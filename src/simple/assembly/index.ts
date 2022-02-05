import { storage, context, PersistentVector, PersistentMap } from "near-sdk-as";
import { Registration, Registrant } from "./models";

const registrations = new PersistentMap<string, Registration>("registrations");
const registrants = new PersistentMap<string, Registrant>("registrants");

// Create a registrant
// Must be created before creating registration
export function createRegistrant(
  firstName: string,
  lastName: string,
  houseNumber: string,
  street: string,
  city: string,
  postalCode: string,
  telNumber: string,
  email: string
): void {
  const accountId = context.sender;

  assert(
    !storage.hasKey("registrants::" + accountId),
    "Registrant already exists"
  );

  const registrant = new Registrant(
    accountId,
    firstName,
    lastName,
    houseNumber,
    street,
    city,
    postalCode,
    telNumber,
    email
  );

  registrants.set(accountId, registrant);
}

// Create a registration
export function createRegistration(
  licenceNumber: string,
  type: string,
  make: string,
  model: string,
  color: string
): void {
  assert(
    !storage.hasKey("registrations::" + licenceNumber),
    "Registration already exists."
  );

  const blockIndex = context.blockIndex;

  const registration = new Registration(
    type,
    make,
    model,
    color,
    context.sender,
    blockIndex
  );

  registrations.set(licenceNumber, registration);

  const registrantsRegistrations = new PersistentVector<string>(
    "registrantsRegistrations_" + context.sender
  );

  registrantsRegistrations.push(licenceNumber);
}

// Get a registrant's data
export function getRegistrantData(accountId: string): Registrant | null {
  assert(
    storage.hasKey("registrants::" + accountId),
    "Registrant " + accountId + " does not exist."
  );

  return registrants.get(accountId);
}

// Get registration licence numbers registered to a registrant
export function getRegistrantsRegistrations(accountId: string): Array<string> {
  assert(
    storage.hasKey("registrants::" + accountId),
    "Registrant " + accountId + "  does not exist."
  );

  const registrantsRegistrations = new PersistentVector<string>(
    "registrantsRegistrations_" + accountId
  );

  let result = new Array<string>();

  for (let i = 0; i < registrantsRegistrations.length; ++i) {
    result.push(registrantsRegistrations[i]);
  }

  return result;
}

// Transfer registration to a different registrant
// Registrant must have been created beforehand
// Registrant can only transfer their own registrations
export function transferRegistration(licenceNo: string, toAccountId: string) {
  assert(
    storage.hasKey("registrants::" + toAccountId),
    "Registrant " + toAccountId + " does not exist."
  );

  assert(
    storage.hasKey("registrants::" + context.sender),
    "Registrant " + context.sender + " does not exist."
  );

  // *Remove licence no. from current registrantsRegistration

  // *Add licence no. to recipient registrantsRegistration

  // *Change registrant in registration

  // const currentRegistration = registrations.get(licenceNo);
  // const currentRegistrantsRegistrations = new PersistentVector<string>(
  //   "registrantsRegistrations_" + currentRegistration
  // );
  // const currentRegistrantsRegistrationsArr = new Array<string>();

  // for (let i = 0; i < currentRegistrantsRegistrations.length; ++i) {
  //   currentRegistrantsRegistrationsArr.push(currentRegistrantsRegistrations[i]);
  // }
}

// return the string 'hello world'
// export function helloWorld(): string {
//   return "hello world";
// }

// read the given key from account (contract) storage
// export function read(key: string): string {
//   if (storage.hasKey(key)) {
//     return `✅ Key [ ${key} ] has value [ ${storage.getString(key)!} ]`
//   } else {
//     return `🚫 Key [ ${key} ] not found in storage. ( ${storageReport()} )`
//   }
// }

// write the given value at the given key to account (contract) storage
// export function write(key: string, value: string): string {
//   storage.set(key, value)
//   return `✅ Data saved. ( ${storageReport()} )`
// }

// private helper method used by read() and write() above
// function storageReport(): string {
//   return `storage [ ${Context.storageUsage} bytes ]`
// }
