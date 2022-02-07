import {
  storage,
  context,
  PersistentVector,
  PersistentMap,
  logging,
} from "near-sdk-as";
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

  const registrations = new Array<string>();

  const registrant = new Registrant(
    accountId,
    firstName,
    lastName,
    houseNumber,
    street,
    city,
    postalCode,
    telNumber,
    email,
    registrations
  );

  registrants.set(accountId, registrant);
}

// Only registrant can update their own data
export function updateRegistrant(
  firstName: string,
  lastName: string,
  houseNumber: string,
  street: string,
  city: string,
  postalCode: string,
  telNumber: string,
  email: string
): bool {
  const accountId = context.sender;
  const registrant = registrants.get(accountId);

  if (!registrant) {
    return false;
  }

  const registrations = new Array<string>();

  for (let i = 0; i < registrant.registrations.length; ++i) {
    registrations.push(registrant.registrations[i]);
  }

  const updatedRegistrant = new Registrant(
    accountId,
    firstName,
    lastName,
    houseNumber,
    street,
    city,
    postalCode,
    telNumber,
    email,
    registrations
  );

  registrants.set(accountId, updatedRegistrant);

  return true;
}

// Only registrant can delete themselves
// Will also delete registrant's registrations
export function deleteRegistrant(): bool {
  assert(
    storage.hasKey("registrants::" + context.sender),
    "Registrant does not exist"
  );

  const registrant = registrants.get(context.sender);
  const registrantsRegistrations = new Array<string>();

  if (!registrant) {
    return false;
  }

  for (let i = 0; i < registrant.registrations.length; ++i) {
    registrantsRegistrations.push(registrant.registrations[i]);
  }

  registrants.delete(context.sender);

  for (let i = 0; i < registrant.registrations.length; ++i) {
    if (registrant.registrations[i]) {
      registrations.delete(registrant.registrations[i]);
    } else {
      logging.log(
        "Registration for " + registrant.registrations[i] + " does not exist"
      );
    }
  }

  return true;
}

// Create a registration
export function createRegistration(
  licenceNumber: string,
  type: string,
  make: string,
  model: string,
  color: string
): bool {
  assert(
    !storage.hasKey("registrations::" + licenceNumber),
    "Registration already exists."
  );

  assert(
    storage.hasKey("registrants::" + context.sender),
    "Registrant does not exist"
  );

  const blockIndex = context.blockIndex;

  // Create registration item
  const registration = new Registration(
    type,
    make,
    model,
    color,
    context.sender,
    blockIndex
  );

  registrations.set(licenceNumber, registration);

  // Add to registrant's registrations
  const registrant = registrants.get(context.sender);
  const registrantsRegistrations = new Array<string>();

  if (!registrant) {
    return false;
  }

  const registrantsCurrentRegistrations = registrant.registrations;

  for (let i = 0; i < registrantsCurrentRegistrations.length; ++i) {
    registrantsRegistrations.push(registrantsCurrentRegistrations[i]);
  }

  registrantsRegistrations.push(licenceNumber);

  registrant.registrations = registrantsRegistrations;

  registrants.set(context.sender, registrant);

  return true;
}

// Only the registration's registrant can update the registration
export function updateRegistration(
  licenceNumber: string,
  type: string,
  make: string,
  model: string,
  color: string
): bool {
  const registration = registrations.get(licenceNumber);

  if (!registration) {
    return false;
  }

  assert(
    context.sender == registration.registrant,
    "Only the registration's registrant can update the registration."
  );

  const updatedRegistration = new Registration(
    type,
    make,
    model,
    color,
    context.sender,
    registration.blockIndex
  );

  registrations.set(licenceNumber, updatedRegistration);

  return true;
}

export function deleteRegistration(licenceNumber: string): bool {
  assert(
    storage.hasKey("registrations::" + licenceNumber),
    "Registration does not exist"
  );

  const registration = registrations.get(licenceNumber);

  if (!registration) {
    return false;
  }

  assert(
    storage.hasKey("registrants::" + registration.registrant),
    "Registrant does not exist"
  );

  const registrant = registrants.get(registration.registrant);

  if (!registrant) {
    return false;
  }

  assert(
    registration.registrant == context.sender,
    "Only the registered registrant can delete the registration."
  );

  registrations.delete(licenceNumber);

  const registrantsRegistrations = new Array<string>();

  for (let i = 0; i < registrant.registrations.length; ++i) {
    if (registrant.registrations[i] != licenceNumber) {
      registrantsRegistrations.push(registrant.registrations[i]);
    }
  }

  const updatedRegistrant = new Registrant(
    registrant.accountId,
    registrant.firstName,
    registrant.lastName,
    registrant.houseNumber,
    registrant.street,
    registrant.city,
    registrant.postalCode,
    registrant.telNumber,
    registrant.email,
    registrantsRegistrations
  );

  registrants.set(registrant.accountId, updatedRegistrant);

  return true;
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

  const registrant = registrants.get(accountId);
  const result = new Array<string>();

  if (!registrant) {
    return [];
  }

  for (let i = 0; i < registrant.registrations.length; ++i) {
    result.push(registrant.registrations[i]);
  }

  return result;
}

// Transfer registration to a different registrant
// - Registrant must have been created beforehand
// - Registrant can only transfer their own registrations
export function transferRegistration(
  licenceNumber: string,
  toAccountId: string
): bool {
  assert(
    storage.hasKey("registrants::" + toAccountId),
    "Registrant " + toAccountId + " does not exist."
  );

  assert(
    storage.hasKey("registrants::" + context.sender),
    "Registrant " + context.sender + " does not exist."
  );

  const registration = registrations.get(licenceNumber);

  if (!registration) {
    return false;
  }

  const fromRegistrant = registrants.get(registration.registrant);
  const toRegistrant = registrants.get(toAccountId);

  if (!fromRegistrant || !toRegistrant) {
    return false;
  }

  // Update registration with new registrant
  assert(
    registration.registrant == context.sender,
    "Only the current registrant can tranfer registration."
  );

  registration.registrant = toAccountId;
  registrations.set(licenceNumber, registration);

  // Remove licence no. from current registrant's registrations
  const fromRegistrantsAmendedRegistrations = new Array<string>();

  for (let i = 0; i < fromRegistrant.registrations.length; ++i) {
    if (fromRegistrant.registrations[i] != licenceNumber) {
      fromRegistrantsAmendedRegistrations.push(fromRegistrant.registrations[i]);
    }
  }

  fromRegistrant.registrations = fromRegistrantsAmendedRegistrations;
  registrants.set(fromRegistrant.accountId, fromRegistrant);

  // Add licence no. to new registrant's registrations
  const toRegistrantsAmendedRegistrations = new Array<string>();

  for (let i = 0; i < toRegistrant.registrations.length; ++i) {
    toRegistrantsAmendedRegistrations.push(toRegistrant.registrations[i]);
  }

  toRegistrantsAmendedRegistrations.push(licenceNumber);

  toRegistrant.registrations = toRegistrantsAmendedRegistrations;
  registrants.set(toRegistrant.accountId, toRegistrant);

  return true;
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
