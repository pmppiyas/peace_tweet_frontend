export interface RegisterInput {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  identifier: string;
  password: string;
}
