export class InfoUserResponse {
  id: number;
  name: string;
  email: string;
  emailConfirmed: boolean;

  constructor(
    id: number,
    name: string,
    email: string,
    emailConfirmed: boolean
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.emailConfirmed = emailConfirmed;
  }
}
