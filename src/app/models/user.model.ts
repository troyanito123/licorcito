export class User {
  static fromFirebase({
    email,
    uid,
    name,
    phone,
    role,
    dealerId,
    onesignalId,
  }) {
    return new User(uid, name, email, phone, role, dealerId, onesignalId);
  }
  constructor(
    public uid: string,
    public name: string,
    public email: string,
    public phone: string,
    public role: UserRole,
    public dealerId?: string,
    public onesignalId?: string
  ) {}
}

export enum UserRole {
  user = 'USER',
  admin = 'ADMIN',
  dealer = 'DEALER',
}
