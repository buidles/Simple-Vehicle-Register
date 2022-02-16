import { storage, context, PersistentMap, logging } from "near-sdk-as";
import { Registration, Registrant } from "./models";

export const registrations = new PersistentMap<string, Registration>(
  "registrations"
);
export const registrants = new PersistentMap<string, Registrant>("registrants");

/**
 * Create a registrant
 *
 * Asserts:
 * - a registrant with the sender account ID does not already exist
 */
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

/**
 * Update a registrant
 *
 * Only the sender can update their own registrant item
 *
 * Asserts:
 * - a registrant with the sender account ID exists
 */
export function updateRegistrant(
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
  const registrant = registrants.get(accountId);

  assert(registrant, "Registrant " + accountId + "  does not exist.");

  const registrantsRegistrations = registrant!.registrations;
  const registrantsRegistrationsCopy = new Array<string>();

  for (let i = 0; i < registrantsRegistrations.length; ++i) {
    registrantsRegistrationsCopy.push(registrantsRegistrations[i]);
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
    registrantsRegistrationsCopy
  );

  registrants.set(accountId, updatedRegistrant);
}

/**
 * Delete a registrant
 *
 * Only the sender can delete their own registrant item
 * Deletes registrations belonging to the registrant
 *
 * Asserts:
 * - a registrant with the sender account ID exists
 */
export function deleteRegistrant(): void {
  assert(
    storage.hasKey("registrants::" + context.sender),
    "Registrant does not exist"
  );

  const registrant = registrants.get(context.sender);
  const registrantsRegistrationsCopy = registrant!.registrations;

  registrants.delete(context.sender);

  for (let i = 0; i < registrantsRegistrationsCopy.length; ++i) {
    if (registrantsRegistrationsCopy[i]) {
      registrations.delete(registrantsRegistrationsCopy[i]);
    } else {
      logging.log(
        "Registration for " +
          registrantsRegistrationsCopy[i] +
          " does not exist"
      );
    }
  }
}

/**
 * Create a registration
 *
 * Only the sender can create their own registration items
 * Adds entry to the registrant's registrations
 *
 * Asserts:
 * - a registration with the same licence number does not already exist
 * - a registrant with the sender account ID exists
 * - the type can only be "car", "boat", or "motorcycle"
 */
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

  assert(
    storage.hasKey("registrants::" + context.sender),
    "Registrant does not exist"
  );

  assert(
    type == "car" || type == "boat" || type == "motorcycle",
    `Type can only be "car", "boat", or "motorcycle"`
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

  const registrant = registrants.get(context.sender);
  const registrantsUpdatedRegistrations = new Array<string>();
  const registrantsCurrentRegistrations = registrant!.registrations;

  for (let i = 0; i < registrantsCurrentRegistrations.length; ++i) {
    registrantsUpdatedRegistrations.push(registrantsCurrentRegistrations[i]);
  }

  registrantsUpdatedRegistrations.push(licenceNumber);
  registrant!.registrations = registrantsUpdatedRegistrations;
  registrants.set(context.sender, registrant!);
}

/**
 * Update a registration
 *
 * Only the sender can update their own registration items
 *
 * Asserts:
 * - a registration with the same licence number exists
 * - the registrant and the registration's registrant have the same account ID
 */
export function updateRegistration(
  licenceNumber: string,
  type: string,
  make: string,
  model: string,
  color: string
): void {
  assert(
    storage.hasKey("registrations::" + licenceNumber),
    "Registration does not exist"
  );

  const registration = registrations.get(licenceNumber);

  assert(
    context.sender == registration!.registrant,
    "Only the registration's registrant can update the registration."
  );

  const updatedRegistration = new Registration(
    type,
    make,
    model,
    color,
    context.sender,
    registration!.blockIndex
  );

  registrations.set(licenceNumber, updatedRegistration);
}

/**
 * Delete a registration
 *
 * Only the sender can delete their own registration items
 * Updates the registration's registrant
 *
 * Asserts:
 * - a registration with the same licence number exists
 * - the registration's registrant exists
 * - the registrant and the registration's registrant have the same account ID
 */
export function deleteRegistration(licenceNumber: string): void {
  assert(
    storage.hasKey("registrations::" + licenceNumber),
    "Registration does not exist"
  );

  const registration = registrations.get(licenceNumber);

  assert(
    storage.hasKey("registrants::" + registration!.registrant),
    "Registrant does not exist"
  );

  const registrant = registrants.get(registration!.registrant);

  assert(
    registration!.registrant == context.sender,
    "Only the registered registrant can delete the registration."
  );

  registrations.delete(licenceNumber);

  const registrantsUpdatedRegistrations = new Array<string>();

  for (let i = 0; i < registrant!.registrations.length; ++i) {
    if (registrant!.registrations[i] != licenceNumber) {
      registrantsUpdatedRegistrations.push(registrant!.registrations[i]);
    }
  }

  const updatedRegistrant = new Registrant(
    registrant!.accountId,
    registrant!.firstName,
    registrant!.lastName,
    registrant!.houseNumber,
    registrant!.street,
    registrant!.city,
    registrant!.postalCode,
    registrant!.telNumber,
    registrant!.email,
    registrantsUpdatedRegistrations
  );

  registrants.set(registrant!.accountId, updatedRegistrant);
}

/**
 * Transfer a registration to a different registrant
 * Updates both the from and to registrants' registrations
 *
 * Asserts:
 * - both the from and to registrants exist
 * - the registration exists
 * - the current registration's registrant is the sender
 */
export function transferRegistration(
  licenceNumber: string,
  toAccountId: string
): void {
  assert(
    storage.hasKey("registrants::" + toAccountId),
    "Registrant " + toAccountId + " does not exist."
  );

  assert(
    storage.hasKey("registrants::" + context.sender),
    "Registrant " + context.sender + " does not exist."
  );

  assert(
    storage.hasKey("registrations::" + licenceNumber),
    "Registration does not exist."
  );

  const registration = registrations.get(licenceNumber);
  const fromRegistrant = registrants.get(registration!.registrant);
  const toRegistrant = registrants.get(toAccountId);

  assert(
    registration!.registrant == context.sender,
    "Only the current registrant can tranfer registration."
  );

  registration!.registrant = toAccountId;
  registrations.set(licenceNumber, registration!);

  const fromRegistrantsAmendedRegistrations = new Array<string>();

  for (let i = 0; i < fromRegistrant!.registrations.length; ++i) {
    if (fromRegistrant!.registrations[i] != licenceNumber) {
      fromRegistrantsAmendedRegistrations.push(
        fromRegistrant!.registrations[i]
      );
    }
  }

  fromRegistrant!.registrations = fromRegistrantsAmendedRegistrations;
  registrants.set(fromRegistrant!.accountId, fromRegistrant!);

  const toRegistrantsAmendedRegistrations = new Array<string>();

  for (let i = 0; i < toRegistrant!.registrations.length; ++i) {
    toRegistrantsAmendedRegistrations.push(toRegistrant!.registrations[i]);
  }

  toRegistrantsAmendedRegistrations.push(licenceNumber);
  toRegistrant!.registrations = toRegistrantsAmendedRegistrations;
  registrants.set(toRegistrant!.accountId, toRegistrant!);
}

/**
 * Get a registrant's data
 *
 * Asserts:
 * - the registrant exists
 */
export function getRegistrantData(accountId: string): Registrant | null {
  assert(
    storage.hasKey("registrants::" + accountId),
    "Registrant " + accountId + " does not exist."
  );

  return registrants.get(accountId);
}

/**
 * Get a registration's data
 *
 * Asserts:
 * - the registration exists
 */
export function getRegistrationData(
  licenceNumber: string
): Registration | null {
  assert(
    storage.hasKey("registrations::" + licenceNumber),
    "Registration " + licenceNumber + " does not exist."
  );

  return registrations.get(licenceNumber);
}

/**
 * Get a registratant's registrations
 *
 * Asserts:
 * - the registrant exists
 */
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
