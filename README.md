# Simple Vehicle Register

Uses https://github.com/Learn-NEAR/starter--near-sdk-as as a template.

## About

- A user first registers with some personal details.
- Once registered they can register vehicles - either cars, boats, or motorcyles.
- Registered vehicles can be updated, deleted, or transferred to another registrant.

## Project Setup

Ensure [NEAR CLI](https://github.com/near/near-cli) and [yarn](https://github.com/yarnpkg/berry) are installed.

1. Clone this repo to a local folder
2. Run `yarn`
3. Build contract: `yarn build`
4. Deploy contract: `near dev-deploy ./build/debug/simple.wasm` - keep a note of the output dev account ID (it can also be be found in either file in `./neardev`)

## Testing

To run unit tests: `yarn test`

## Environment setup

1. Set NEAR environment: `export NEAR_ENV=testnet`
2. Set contract owner: `export OWNER=<your-account>.testnet`
3. Set contract: `export CONTRACT=<dev-account-id>`

## Contract API

| Function                        | Method | Description                                       |
| :------------------------------ | :----- | :------------------------------------------------ |
| `createRegistrant()`            | call   | Create a registrant                               |
| `updateRegistrant()`            | call   | Update a registrant                               |
| `deleteRegistrant()`            | call   | Delete a registrant                               |
| `createRegistration()`          | call   | Create a registration                             |
| `updateRegistration()`          | call   | Update a registration                             |
| `deleteRegistration()`          | call   | Delete a registration                             |
| `transferRegistration()`        | call   | Transfer a registration to a different registrant |
| `getRegistrantData()`           | view   | Get a registrant's data                           |
| `getRegistrantsRegistrations()` | view   | Get a registratant's registrations                |

### `createRegistrant()`

**Parameters:**

| Parameter     | Type   | Required |
| :------------ | :----- | :------- |
| `firstName`   | string | yes      |
| `lastName`    | string | yes      |
| `houseNumber` | string | yes      |
| `street`      | string | yes      |
| `city`        | string | yes      |
| `postalCode`  | string | yes      |
| `telNumber`   | string | yes      |
| `email`       | string | yes      |

**Example:**

```
near call $CONTRACT createRegistration '{"licenceNumber": "test-licence-no-1", "type": "car", "make": "Tesla", "model": "Model X", "color": "black"}' --accountId <your-account>.testnet`
```
