// backend/src/types/user.types.ts
export interface User {
  id: number;
  username: string;
  email?: string;
  points?: number;
  streak?: number;
  created_at?: string;
  updated_at?: string;
}
