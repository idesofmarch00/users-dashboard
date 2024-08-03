export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  alternate_email?: string;
  password: string;
  age: number;
}
