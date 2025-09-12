export interface UserDTO {
  id: string;
  username: string;
  email: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: string;
  email: string;
}
