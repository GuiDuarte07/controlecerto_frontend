import { InfoUserResponse } from "./InfoUserResponse";

export class DetailsUserResponse extends InfoUserResponse {
  createdAt: Date;

  constructor(
    id: number,
    name: string,
    email: string,
    emailConfirmed: boolean,
    createdAt: Date
  ) {
    super(id, name, email, emailConfirmed);
    this.createdAt = createdAt;
  }
}
