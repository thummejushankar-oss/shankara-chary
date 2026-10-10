export type VisitorStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expected'
  | 'inside'
  | 'completed';

export type VisitorPurpose = 
  | 'Business Meeting'
  | 'Job Interview'
  | 'Vendor & Supplier'
  | 'Client Presentation'
  | 'Delivery & Courier'
  | 'Maintenance & IT'
  | 'Campus Tour'
  | 'Personal Visit';

export type IdDocumentType = 
  | 'National ID'
  | 'Passport'
  | 'Driving License'
  | 'Employee Badge'
  | 'Student ID';

export interface VisitorRecord {
  id: string; // e.g. "VP-2041"
  fullName: string;
  email: string;
  phone: string;
  company: string;
  hostId: string;
  hostName: string;
  hostDepartment: string;
  purpose: VisitorPurpose;
  expectedDate: string; // YYYY-MM-DD
  expectedTime: string; // HH:mm
  checkInTime?: string; // Formatted or ISO
  checkOutTime?: string; // Formatted or ISO
  stayDuration?: string; // e.g. "1 hr 45 min"
  status: VisitorStatus;
  badgeNumber?: string; // e.g. "#B-204"
  photoUrl?: string;
  idDocType?: IdDocumentType;
  idDocNumber?: string;
  vehicleNumber?: string;
  accompanyingGuests: number;
  approvalNotes?: string;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  preRegistered: boolean;
  qrCode: string;
}

export interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  officeRoom: string;
  active: boolean;
  avatar?: string;
}

export type UserRole = 'admin' | 'receptionist' | 'host';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  title: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'visitor_registered' | 'visitor_checked_in' | 'visitor_checked_out' | 'approval_request' | 'approved' | 'rejected';
  visitorId?: string;
}

export interface OrgSettings {
  organizationName: string;
  buildingName: string;
  facilityLocation: string;
  guestWifiSsid: string;
  guestWifiPassword: string;
  requireApproval: boolean;
  requirePhoto: boolean;
  requireIdProof: boolean;
  autoCheckoutHours: number;
  contactEmergency: string;
  receptionPhone: string;
}

export type ActivePage = 
  | 'dashboard'
  | 'registration'
  | 'approvals'
  | 'checkinout'
  | 'records'
  | 'reports'
  | 'settings'
  | 'login';
