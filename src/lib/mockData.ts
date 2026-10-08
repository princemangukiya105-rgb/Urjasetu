import { Complaint, MaintenanceTeam, NotificationItem } from '../types';

export const INITIAL_MAINTENANCE_TEAMS: MaintenanceTeam[] = [
  {
    id: 'team-a',
    name: 'Electrical Maintenance Team A',
    members: ['Rajesh Sharma (Lead)', 'Vikram Singh', 'Rohan Patel'],
    currentAssignmentsCount: 0,
    availability: 'Available',
    area: 'Mira Road North & Sectors',
    phone: '+91 98201 55431',
    lead: 'Rajesh Sharma',
  },
  {
    id: 'team-b',
    name: 'Electrical Maintenance Team B',
    members: ['Amit Patel (Lead)', 'Suresh Kumar', 'Sunil Pawar'],
    currentAssignmentsCount: 0,
    availability: 'Available',
    area: 'Bhayandar East & Industrial Zone',
    phone: '+91 98202 88123',
    lead: 'Amit Patel',
  },
  {
    id: 'team-c',
    name: 'Public Lighting Team',
    members: ['Anil Verma (Lead)', 'Manoj Kumar', 'Pankaj Mehta'],
    currentAssignmentsCount: 0,
    availability: 'Available',
    area: 'Mira Road West & Bhayandar West',
    phone: '+91 98203 44901',
    lead: 'Anil Verma',
  },
  {
    id: 'team-d',
    name: 'Emergency Response Team',
    members: ['Deepak Rao (Lead)', 'Sandeep Patil', 'Ganesh Jadhav'],
    currentAssignmentsCount: 0,
    availability: 'Available',
    area: 'Citywide High Hazard Unit',
    phone: '+91 98200 10099',
    lead: 'Deepak Rao',
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
