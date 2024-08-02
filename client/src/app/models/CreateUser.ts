export class Createuser {
  email: string;
  password: string;
  name: string;

  constructor({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}
