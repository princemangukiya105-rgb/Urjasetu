export type ComplaintStatus =
  | 'REPORTED'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'WORK IN PROGRESS'
  | 'RESOLVED'
  | 'REOPENED';

export type IssueType =
  | 'Streetlight Not Working'
  | 'Public Light Not Working'
  | 'Streetlight Flickering'
  | 'Damaged Electrical Pole'
  | 'Exposed Electrical Wiring'
  | 'Public Lighting Damage'
  | 'Electrical Infrastructure Issue'
  | 'Other';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface MaintenanceTeam {
  id: string;
  name: string;
  members: string[];
  currentAssignmentsCount: number;
  availability: 'Available' | 'Busy' | 'On Shift';
  area: string;
  phone: string;
  lead: string;
}

export interface TimelineItem {
  id: string;
  status: ComplaintStatus;
  message: string;
  timestamp: string;
  actor: string;
  type: 'creation' | 'status_change' | 'update' | 'assignment';
}

export interface ProgressUpdate {
  id: string;
  message: string;
  timestamp: string;
  author: string;
}

export interface Complaint {
  id: string;
  issueType: IssueType;
  description: string;
  location: string;
  area: string;
  ward: string;
  pincode: string;
  image?: string;
  priority: Priority;
  status: ComplaintStatus;
  reportedDate: string;
  lastUpdated: string;
  assignedTeam?: string;
  reportedBy: {
    name: string;
    phone: string;
    email: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  timeline: TimelineItem[];
  updates: ProgressUpdate[];
}

export interface NotificationItem {
  id: string;
  complaintId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status_update' | 'assignment' | 'resolution' | 'system';
}

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  isLoggedIn: boolean;
}
