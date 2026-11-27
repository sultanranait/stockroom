export type Role = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
}
