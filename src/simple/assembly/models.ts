@nearBindgen
export class Registration {
  constructor(
    public type: string,
    public make: string,
    public model: string,
    public color: string,
    public registrant: string,
    public blockIndex: u64
  ) {}
}
@nearBindgen
export class Registrant {
  constructor(
    public accountId: string,
    public firstName: string,
    public lastName: string,
    public houseNumber: string,
    public street: string,
    public city: string,
    public postalCode: string,
    public telNumber: string,
    public email: string,
    public registrations: string[]
  ) {}
}
