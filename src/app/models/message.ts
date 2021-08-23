export class Message {
  static fromFirebase({ body, name, role, userId, date }) {
    return new Message(body, name, role, userId, date);
  }

  constructor(
    public body: string,
    public name: string,
    public role: string,
    public userId: string,
    public date: string
  ) {}
}
