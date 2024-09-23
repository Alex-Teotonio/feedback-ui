// app/types/index.ts
export interface User {
  _id: string;
  nome: string;
  email: string;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}
