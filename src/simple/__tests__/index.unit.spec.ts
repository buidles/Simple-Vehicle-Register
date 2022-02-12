import {
  VMContext,
  u128,
  context,
  storage,
  PersistentMap,
  logging,
} from "near-sdk-as";
import * as contract from "../assembly";
import { Registration, Registrant } from "../assembly/models";

describe("Contract", () => {
  describe("createRegistrant()", () => {
    beforeEach(() => {
      VMContext.setSigner_account_id("test_user");
    });

    it("should create a new registrant with the correct values", () => {
      contract.createRegistrant(
        "John",
        "Jones",
        "123",
        "High Street",
        "London",
        "SE1",
        "123456789",
        "test@test.com"
      );

      const createdRegistrant = contract.registrants.get("test_user");

      expect(createdRegistrant!.firstName).toBe(
        "John",
        "firstName is incorrect"
      );
      expect(createdRegistrant!.lastName).toBe(
        "Jones",
        "lastName is incorrect"
      );
      expect(createdRegistrant!.houseNumber).toBe(
        "123",
        "houseNumber is incorrect"
      );
      expect(createdRegistrant!.street).toBe(
        "High Street",
        "street is incorrect"
      );
      expect(createdRegistrant!.city).toBe("London", "city is incorrect");
      expect(createdRegistrant!.postalCode).toBe(
        "SE1",
        "postalCode is incorrect"
      );
      expect(createdRegistrant!.telNumber).toBe(
        "123456789",
        "telNumber is incorrect"
      );
      expect(createdRegistrant!.email).toBe(
        "test@test.com",
        "email is incorrect"
      );
      expect(createdRegistrant!.registrations).toHaveLength(
        0,
        "registrations is incorrect"
      );
    });
  });

  describe("updateRegistrant()", () => {
    beforeEach(() => {
      VMContext.setSigner_account_id("test_user");

      contract.createRegistrant(
        "John",
        "Jones",
        "123",
        "High Street",
        "London",
        "SE1",
        "123456789",
        "test@test.com"
      );
    });

    it("should update a registrant with the correct values", () => {
      contract.updateRegistrant(
        "Jane",
        "Smith",
        "321",
        "Low Street",
        "Brighton",
        "BN1",
        "987654321",
        "test1@test1.com"
      );

      const updatedRegistrant = contract.registrants.get("test_user");

      expect(updatedRegistrant!.firstName).toBe(
        "Jane",
        "firstName is incorrect"
      );
      expect(updatedRegistrant!.lastName).toBe(
        "Smith",
        "lastName is incorrect"
      );
      expect(updatedRegistrant!.houseNumber).toBe(
        "321",
        "houseNumber is incorrect"
      );
      expect(updatedRegistrant!.street).toBe(
        "Low Street",
        "street is incorrect"
      );
      expect(updatedRegistrant!.city).toBe("Brighton", "city is incorrect");
      expect(updatedRegistrant!.postalCode).toBe(
        "BN1",
        "postalCode is incorrect"
      );
      expect(updatedRegistrant!.telNumber).toBe(
        "987654321",
        "telNumber is incorrect"
      );
      expect(updatedRegistrant!.email).toBe(
        "test1@test1.com",
        "email is incorrect"
      );
      expect(updatedRegistrant!.registrations).toHaveLength(
        0,
        "registrations is incorrect"
      );
    });
  });

  describe("deleteRegistrant()", () => {
    beforeEach(() => {
      VMContext.setSigner_account_id("test_user");

      contract.createRegistrant(
        "John",
        "Jones",
        "123",
        "High Street",
        "London",
        "SE1",
        "123456789",
        "test@test.com"
      );
    });

    it("should delete a registrant", () => {
      contract.deleteRegistrant();

      const deletedRegistrant = contract.registrants.get("test_user");

      expect(deletedRegistrant).toBeNull("Registrant has not been deleted");
    });

    it("should delete any registrations belonging to the registrant", () => {
      contract.createRegistration("123-xyz", "car", "Ford", "F150", "blue");
      contract.createRegistration(
        "456-xyz",
        "car",
        "Tesla",
        "Model 3",
        "black"
      );

      expect(contract.registrations.get("123-xyz")).toBeTruthy(
        'Registration "123-xyz" exists'
      );

      expect(contract.registrations.get("456-xyz")).toBeTruthy(
        'Registration "123-xyz" exists'
      );

      contract.deleteRegistrant();

      expect(contract.registrations.get("123-xyz")).toBeFalsy(
        'Registration "123-xyz" no longer exists'
      );
      expect(contract.registrations.get("456-xyz")).toBeFalsy(
        'Registration "123-xyz" no longer exists'
      );
    });
  });

  describe("createRegistration()", () => {
    beforeEach(() => {
      VMContext.setSigner_account_id("test_user");

      contract.createRegistrant(
        "John",
        "Jones",
        "123",
        "High Street",
        "London",
        "SE1",
        "123456789",
        "test@test.com"
      );

      contract.createRegistration("123-xyz", "car", "Ford", "F150", "blue");
    });

    it("should create a new registration with the correct values", () => {
      const createdRegistration = contract.registrations.get("123-xyz");

      expect(createdRegistration!.type).toBe("car", "type is incorrect");
      expect(createdRegistration!.make).toBe("Ford", "make is incorrect");
      expect(createdRegistration!.model).toBe("F150", "model is incorrect");
      expect(createdRegistration!.color).toBe("blue", "color is incorrect");
      expect(createdRegistration!.registrant).toBe(
        "test_user",
        "registrant is incorrect"
      );
      expect(createdRegistration!.blockIndex).toBeTruthy(
        "blockIndex does not exist"
      );
    });

    it("should add the registration to the registrant's registrations", () => {
      const testRegistrant = contract.registrants.get("test_user");

      expect(testRegistrant!.registrations[0]).toBe(
        "123-xyz",
        "Registrant's registration does not exist"
      );
    });
  });

  describe("deleteRegistration()", () => {
    beforeEach(() => {
      VMContext.setSigner_account_id("test_user");

      contract.createRegistrant(
        "John",
        "Jones",
        "123",
        "High Street",
        "London",
        "SE1",
        "123456789",
        "test@test.com"
      );

      contract.createRegistration("123-xyz", "car", "Ford", "F150", "blue");
    });

    it("should delete a registration", () => {
      contract.deleteRegistration("123-xyz");

      expect(contract.registrations.get("123-xyz")).toBeFalsy(
        'Registration "123-xyz" should not exists'
      );
    });

    it("should add delete the registration from the registrant's registrations", () => {
      let testRegistrant = contract.registrants.get("test_user");

      expect(testRegistrant!.registrations[0]).toBe(
        "123-xyz",
        'Registrant\'s registration "123-xyz" should exist'
      );

      contract.deleteRegistration("123-xyz");

      testRegistrant = contract.registrants.get("test_user");

      expect(testRegistrant!.registrations).toHaveLength(
        0,
        'Registrant\'s registration "123-xyz" should not exist'
      );
    });

    // it("should add the registration to the registrant's registrations", () => {
    //   contract.createRegistration("123-xyz", "car", "Ford", "F150", "blue");

    //   const testRegistrant = contract.registrants.get("test_user");

    //   expect(testRegistrant!.registrations[0]).toBe(
    //     "123-xyz",
    //     "Registrant's registration does not exist"
    //   );
    // });
  });

  // // VIEW method tests
  // it("says hello", () => {
  //   expect(contract.helloWorld()).toStrictEqual("hello world")
  // })
  // it("reads data", () => {
  //   expect(contract.read("some key")).toStrictEqual("🚫 Key [ some key ] not found in storage. ( storage [ 0 bytes ] )")
  // })
  // // CHANGE method tests
  // it("saves data to contract storage", () => {
  //   expect(contract.write("some-key", "some value")).toStrictEqual("✅ Data saved. ( storage [ 18 bytes ] )")
  // })
});
