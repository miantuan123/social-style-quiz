// ... existing types ...

export interface Session {
  code: string;
  created_at: Date;
  status: 'active' | 'completed';
}