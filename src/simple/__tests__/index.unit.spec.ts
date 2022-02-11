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
  describe("createRegistrant(): void", () => {
    it("saves a new registrant to storage", () => {
      VMContext.setSigner_account_id("current_user");

      // const registrants = new PersistentMap<string, Registrant>("registrants");

      contract.createRegistrant(
        "Jim",
        "smith",
        "567",
        "long rd",
        "Brighton",
        "bn32",
        "13155",
        "sss@wewe.com"
      );

      // @ts-ignore
      // const reg: Registrant = storage.get("registrations::current_user");

      // expect(registrants.get("current_user")!.firstName).toStrictEqual("Jim");
      // expect(reg.firstName).toStrictEqual("Jim");
      // const test = registrants.get("current_user");
      // console.log("ffdsffds");
      // expect(test!.firstName).toStrictEqual("Jim");
      // const test: string = storage.get("registrants::current_user").firstName;
      // log(test);
      expect(storage.hasKey("registrants::current_user")).toBeTruthy();
    });

    // const registrants = new PersistentMap<string, Registrant>("registrants");
    // const registrants = new PersistentMap<string, Registrant>("registrants");

    // logging.log("cfsdfdsfdsdfsdfsdfsdfdsfdsfsfsdf");
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
