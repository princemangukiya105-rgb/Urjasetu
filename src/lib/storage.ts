import { Complaint, ComplaintStatus, MaintenanceTeam, NotificationItem, Priority, ProgressUpdate, TimelineItem } from '../types';
import { INITIAL_COMPLAINTS, INITIAL_MAINTENANCE_TEAMS, INITIAL_NOTIFICATIONS } from './mockData';

const STORAGE_KEYS = {
  COMPLAINTS: 'urjasetu_complaints',
  TEAMS: 'urjasetu_teams',
  NOTIFICATIONS: 'urjasetu_notifications',
  ADMIN_SESSION: 'urjasetu_admin_session',
};

const notifyListeners = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('urjasetu_storage_update'));
  }
};

export const getComplaints = (): Complaint[] => {
  if (typeof window === 'undefined') return INITIAL_COMPLAINTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_COMPLAINTS;
  }
};

export const getComplaintById = (id: string): Complaint | undefined => {
  const complaints = getComplaints();
  return complaints.find(
    (c) => c.id.toLowerCase() === id.trim().toLowerCase()
  );
};

export const saveComplaints = (complaints: Complaint[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  notifyListeners();
};

export type NewComplaintInput = Omit<Complaint, 'id' | 'reportedDate' | 'lastUpdated' | 'status' | 'timeline' | 'updates' | 'coordinates'> & {
  coordinates?: { lat: number; lng: number };
};

export const addComplaint = (newComplaint: NewComplaintInput): Complaint => {
  const complaints = getComplaints();
  const year = new Date().getFullYear();
  const indexNumber = (complaints.length + 101).toString().padStart(5, '0');
  const id = `URJ-${year}-${indexNumber}`;
  const now = new Date().toISOString();

  const initialTimeline: TimelineItem = {
    id: `tl-${Date.now()}`,
    status: 'REPORTED',
    message: 'Report submitted by citizen with location and description details.',
    timestamp: now,
    actor: `${newComplaint.reportedBy.name || 'Citizen'} (Citizen)`,
    type: 'creation',
  };

  const complaint: Complaint = {
    ...newComplaint,
    id,
    status: 'REPORTED',
    reportedDate: now,
    lastUpdated: now,
    timeline: [initialTimeline],
    updates: [],
    coordinates: newComplaint.coordinates || {
      lat: 19.28 + (Math.random() * 0.03 - 0.015),
      lng: 72.85 + (Math.random() * 0.03 - 0.015),
    },
  };

  const updatedComplaints = [complaint, ...complaints];
  saveComplaints(updatedComplaints);

  // Add system notification for new report
  addNotification({
    complaintId: id,
    title: 'Report Submitted',
    message: `Your complaint ${id} (${complaint.issueType}) has been logged successfully.`,
    type: 'system',
  });

  return complaint;
};

export const updateComplaintStatus = (
  id: string,
  newStatus: ComplaintStatus,
  actor: string = 'Urban Energy Admin',
  customMessage?: string
): Complaint | null => {
  const complaints = getComplaints();
  const index = complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const complaint = complaints[index];
  const oldStatus = complaint.status;
  if (oldStatus === newStatus && !customMessage) return complaint;

  const now = new Date().toISOString();

  let defaultMsg = `Status updated from ${oldStatus} to ${newStatus}.`;
  if (newStatus === 'VERIFIED') defaultMsg = 'Issue verified by Urban Energy Administration desk.';
  if (newStatus === 'WORK IN PROGRESS') defaultMsg = 'Maintenance team has actively started repair work on site.';
  if (newStatus === 'RESOLVED') defaultMsg = 'Issue has been successfully resolved and tested by electrical engineers.';
  if (newStatus === 'REOPENED') defaultMsg = 'Complaint reopened by citizen or inspector for secondary review.';

  const timelineItem: TimelineItem = {
    id: `tl-${Date.now()}`,
    status: newStatus,
    message: customMessage || defaultMsg,
    timestamp: now,
    actor,
    type: 'status_change',
  };

  const updatedComplaint: Complaint = {
    ...complaint,
    status: newStatus,
    lastUpdated: now,
    timeline: [...complaint.timeline, timelineItem],
  };

  complaints[index] = updatedComplaint;
  saveComplaints(complaints);

  // Add notification
  addNotification({
    complaintId: id,
    title: `Complaint Status: ${newStatus}`,
    message: `Complaint ${id} status changed to ${newStatus}. ${customMessage || ''}`,
    type: newStatus === 'RESOLVED' ? 'resolution' : 'status_update',
  });

  return updatedComplaint;
};

export const assignTeamToComplaint = (
  id: string,
  teamName: string,
  actor: string = 'Urban Energy Admin'
): Complaint | null => {
  const complaints = getComplaints();
  const index = complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const complaint = complaints[index];
  const now = new Date().toISOString();

  const newStatus: ComplaintStatus = complaint.status === 'REPORTED' || complaint.status === 'VERIFIED' ? 'ASSIGNED' : complaint.status;

  const timelineItem: TimelineItem = {
    id: `tl-${Date.now()}`,
    status: newStatus,
    message: `Assigned to ${teamName}.`,
    timestamp: now,
    actor,
    type: 'assignment',
  };

  const updatedComplaint: Complaint = {
    ...complaint,
    assignedTeam: teamName,
    status: newStatus,
    lastUpdated: now,
    timeline: [...complaint.timeline, timelineItem],
  };

  complaints[index] = updatedComplaint;
  saveComplaints(complaints);

  addNotification({
    complaintId: id,
    title: 'Team Assigned',
    message: `Complaint ${id} assigned to ${teamName}.`,
    type: 'assignment',
  });

  return updatedComplaint;
};

export const updateComplaintPriority = (
  id: string,
  priority: Priority,
  actor: string = 'Urban Energy Admin'
): Complaint | null => {
  const complaints = getComplaints();
  const index = complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const complaint = complaints[index];
  const now = new Date().toISOString();

  const timelineItem: TimelineItem = {
    id: `tl-${Date.now()}`,
    status: complaint.status,
    message: `Priority changed to ${priority}.`,
    timestamp: now,
    actor,
    type: 'update',
  };

  const updatedComplaint: Complaint = {
    ...complaint,
    priority,
    lastUpdated: now,
    timeline: [...complaint.timeline, timelineItem],
  };

  complaints[index] = updatedComplaint;
  saveComplaints(complaints);
  return updatedComplaint;
};

export const addProgressUpdateToComplaint = (
  id: string,
  message: string,
  author: string = 'Urban Energy Admin'
): Complaint | null => {
  const complaints = getComplaints();
  const index = complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const complaint = complaints[index];
  const now = new Date().toISOString();

  const progressUpdate: ProgressUpdate = {
    id: `up-${Date.now()}`,
    message,
    timestamp: now,
    author,
  };

  const timelineItem: TimelineItem = {
    id: `tl-${Date.now()}`,
    status: complaint.status,
    message: `Progress Note: ${message}`,
    timestamp: now,
    actor: author,
    type: 'update',
  };

  const updatedComplaint: Complaint = {
    ...complaint,
    lastUpdated: now,
    updates: [...complaint.updates, progressUpdate],
    timeline: [...complaint.timeline, timelineItem],
  };

  complaints[index] = updatedComplaint;
  saveComplaints(complaints);

  addNotification({
    complaintId: id,
    title: 'Progress Update',
    message: `New update on ${id}: "${message}"`,
    type: 'status_update',
  });

  return updatedComplaint;
};

export const getMaintenanceTeams = (): MaintenanceTeam[] => {
  if (typeof window === 'undefined') return INITIAL_MAINTENANCE_TEAMS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(INITIAL_MAINTENANCE_TEAMS));
      return INITIAL_MAINTENANCE_TEAMS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_MAINTENANCE_TEAMS;
  }
};

export const getNotifications = (): NotificationItem[] => {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void => {
  const notifications = getNotifications();
  const newNotif: NotificationItem = {
    ...item,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    read: false,
  };
  const updated = [newNotif, ...notifications];
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  notifyListeners();
};

export const markAllNotificationsRead = (): void => {
  const notifications = getNotifications();
  const updated = notifications.map((n) => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  notifyListeners();
};

export const resetDemoData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(INITIAL_MAINTENANCE_TEAMS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  notifyListeners();
};

export const getAdminSession = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
};

export const setAdminSession = (loggedIn: boolean): void => {
  if (typeof window === 'undefined') return;
  if (loggedIn) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }
  notifyListeners();
};
