export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
};