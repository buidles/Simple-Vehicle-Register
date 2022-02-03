import { PersistentVector } from "near-sdk-as";

/**
 * @class Registration
 * @property type - type of vehicle
 * @property make - make of vehicle
 * @property nodel - model of vehicle
 * @property color - color of vehicle
 * @property registrant - accountId of registrant
 */
@nearBindgen
export class Registration {
  constructor(
    public type: "car" | "motorcyle" | "boat",
    public make: string,
    public model: string,
    public color: string,
    public registrant: string
  ) {}
}

/**
 * @class Registrant
 * @property firstName - first name of registrant
 * @property lastName - last name of registrant
 * @property houseNumber - house number of registrant
 * @property street - street of registrant
 * @property city - city of registrant
 * @property postalCode - postal code of registrant
 * @property telNumber - telephone number of registrant
 * @property email - email of registrant
 * @property registrations - registrations of registrant

 */
@nearBindgen
export class Registrant {
  constructor(
    public accountId: string,
    public firstName: string,
    public lastName: string,
    public houseNumber: u32,
    public street: string,
    public city: string,
    public postalCode: string,
    public telNumber: u64,
    public email: string,
    public registrations: PersistentVector<string> = new PersistentVector<string>(
      accountId
    )
  ) {}
}
