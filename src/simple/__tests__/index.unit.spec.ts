import { VMContext } from "near-sdk-as";
import * as contract from "../assembly";

describe("Contract", () => {
  describe("createRegistrant()", () => {
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

    it("should create a new registrant with the correct values", () => {
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
  });

  describe("getRegistrantData()", () => {
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

    it("should get a registrant's data", () => {
      const testRegistrant = contract.getRegistrantData("test_user");

      expect(testRegistrant!.firstName).toBe("John", "firstName is incorrect");
      expect(testRegistrant!.lastName).toBe("Jones", "lastName is incorrect");
      expect(testRegistrant!.houseNumber).toBe(
        "123",
        "houseNumber is incorrect"
      );
      expect(testRegistrant!.street).toBe("High Street", "street is incorrect");
      expect(testRegistrant!.city).toBe("London", "city is incorrect");
      expect(testRegistrant!.postalCode).toBe("SE1", "postalCode is incorrect");
      expect(testRegistrant!.telNumber).toBe(
        "123456789",
        "telNumber is incorrect"
      );
      expect(testRegistrant!.email).toBe("test@test.com", "email is incorrect");
      expect(testRegistrant!.registrations).toHaveLength(
        0,
        "registrations is incorrect"
      );
    });
  });

  describe("getRegistrantsRegistrations()", () => {
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
      contract.createRegistration(
        "456-xyz",
        "car",
        "Tesla",
        "Model 3",
        "black"
      );
    });

    it("should get a registrant's registratons", () => {
      const testRegistrant = contract.getRegistrantData("test_user");

      expect(testRegistrant!.registrations[0]).toBe(
        "123-xyz",
        'Registrant\'s registration "123-xyz" should exist'
      );

      expect(testRegistrant!.registrations[1]).toBe(
        "456-xyz",
        'Registrant\'s registration "456-xyz" should exist'
      );
    });
  });

  describe("transferRegistration()", () => {
    beforeEach(() => {
      VMContext.setSigner_account_id("test_user_1");

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

      VMContext.setSigner_account_id("test_user_2");

      contract.createRegistrant(
        "Jane",
        "Smith",
        "321",
        "Low Street",
        "Brighton",
        "BN1",
        "987654321",
        "test1@test1.com"
      );

      VMContext.setSigner_account_id("test_user_1");

      contract.createRegistration("123-xyz", "car", "Ford", "F150", "blue");

      VMContext.setSigner_account_id("test_user_2");

      contract.createRegistration(
        "456-xyz",
        "car",
        "Tesla",
        "Model 3",
        "black"
      );
    });

    it("should transfer a registration from one registrant to another", () => {
      let testRegistrant1 = contract.getRegistrantData("test_user_1");
      let testRegistrant2 = contract.getRegistrantData("test_user_2");
      let testRegistration1 = contract.registrations.get("123-xyz");
      let testRegistration2 = contract.registrations.get("456-xyz");

      expect(testRegistrant1!.registrations).toHaveLength(
        1,
        'Registrant "test_user_1" should have one registration'
      );

      expect(testRegistrant2!.registrations).toHaveLength(
        1,
        'Registrant "test_user_2" should have one registration'
      );

      expect(testRegistrant1!.registrations[0]).toBe(
        "123-xyz",
        'Registration "123-xyz" should exist for "test_user_1"'
      );

      expect(testRegistrant2!.registrations[0]).toBe(
        "456-xyz",
        'Registration "456-xyz" should exist for "test_user_2"'
      );

      expect(testRegistration1!.registrant).toBe("test_user_1");
      expect(testRegistration2!.registrant).toBe("test_user_2");

      VMContext.setSigner_account_id("test_user_1");
      contract.transferRegistration("123-xyz", "test_user_2");

      testRegistrant1 = contract.getRegistrantData("test_user_1");
      testRegistrant2 = contract.getRegistrantData("test_user_2");
      testRegistration1 = contract.registrations.get("123-xyz");
      testRegistration2 = contract.registrations.get("456-xyz");

      expect(testRegistrant1!.registrations).toHaveLength(
        0,
        'Registrant "test_user_1" should not have any registrations'
      );

      expect(testRegistrant2!.registrations).toHaveLength(
        2,
        'Registrant "test_user_2" should have two registrations'
      );

      expect(testRegistrant2!.registrations[0]).toBe(
        "456-xyz",
        'Registration "456-xyz" should exist for "test_user_2"'
      );

      expect(testRegistrant2!.registrations[1]).toBe(
        "123-xyz",
        'Registration "123-xyz" should exist for "test_user_2"'
      );

      expect(testRegistration1!.registrant).toBe("test_user_2");
      expect(testRegistration2!.registrant).toBe("test_user_2");
    });
  });
});
