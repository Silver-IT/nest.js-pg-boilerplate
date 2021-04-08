export class ForgotPasswordModel {
  email: string;
  username: string;
  token: string;

  constructor(email: string, username: string, token: string) {
    this.email = email;
    this.username = username;
    this.token = token;
  }
}

export class EmailVerificationModel {
  email: string;
  id: string;

  constructor(email, id) {
    this.email = email;
    this.id = id;
  }
}
