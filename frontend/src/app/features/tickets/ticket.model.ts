export interface Ticket {
  id: string; 
  title: string;    
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'BLOCKED' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category?: string;
  reporterId?: string;  
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
}
