# Simple Vehicle Register

Uses https://github.com/Learn-NEAR/starter--near-sdk-as as a template.

## About

A simple vehicle registry that allows users to register and transfer vehicles to other users. Users are able to view a registrant's (registered user) or registration's (registered vehicle) details.

- A user first registers with some personal details.
- Once registered they can register vehicles - either cars, boats, or motorcyles.
- Registered vehicles can be updated, deleted, or transferred to another registrant.

**Notes**

This is just a basic project used as an introduction to NEAR development. A public blockchain would not be suitable for this project of this type due to the private data being stored. If data privacy for a project is a requirement for a project then [NEAR's private sharding](https://near.org/blog/near-launches-private-shard-for-enterprise/) may be suitable.

**Possible Improvements**

- Estimate gas costs and refactor if needed.
- Full validation of all function parameters.
- Admin account/s that can perform any action should it be needed.
- Charge users for transactions.
- NFTs could be issued for each registration.

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

| Function                        | Method | Description                                       | Notes                                                          |
| :------------------------------ | :----- | :------------------------------------------------ | :------------------------------------------------------------- |
| `createRegistrant()`            | call   | Create a registrant                               | Calling account can only create a registrant item for itself   |
| `getRegistrant()`               | view   | Get a registrant's data                           | Can be viewed by anyone                                        |
| `getRegistrantsRegistrations()` | view   | Get a registrant's registrations                  | Can be viewed by anyone                                        |
| `updateRegistrant()`            | call   | Update a registrant                               | Calling account can only update its own registrant item        |
| `deleteRegistrant()`            | call   | Delete a registrant                               | Calling account can only delete its own registrant item        |
| `createRegistration()`          | call   | Create a registration                             | Calling account can only create a registration item for itself |
| `getRegistration()`             | view   | Get a registration's data                         | Can be viewed by anyone                                        |
| `updateRegistration()`          | call   | Update a registration                             | Calling account can only update its own registration items     |
| `deleteRegistration()`          | call   | Delete a registration                             | Calling account can only delete its own registration items     |
| `transferRegistration()`        | call   | Transfer a registration to a different registrant | Calling account can only transfer its own registration items   |

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
near call $CONTRACT createRegistrant '{"firstName": "John", "lastName": "Smith", "houseNumber": "123", "street": "High street", "city":"Brighton", "postalCode": "AB1 2CD", "telNumber": "0123456789", "email": "jsmith@test.com"}' --accountId <your-account>.testnet
```

### `getRegistrant()`

**Parameters:**

| Parameter   | Type   | Required |
| :---------- | :----- | :------- |
| `accountId` | string | yes      |

**Example:**

```
near view $CONTRACT getRegistrant '{"accountId": "<account-id>.testnet"}'
```

### `getRegistrantsRegistrations()`

**Parameters:**

| Parameter   | Type   | Required |
| :---------- | :----- | :------- |
| `accountId` | string | yes      |

**Example:**

```
near view $CONTRACT getRegistrantsRegistrations '{"accountId": "<account-id>.testnet"}'
```

### `updateRegistrant()`

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
near call $CONTRACT updateRegistrant '{"firstName": "John", "lastName": "Smith", "houseNumber": "345", "street": "Low street", "city":"London", "postalCode": "WC1", "telNumber": "0123456789", "email": "jsmith@test.com"}' --accountId <your-account>.testnet
```

### `deleteRegistrant()`

**Parameters:**

None

**Example:**

```
near call $CONTRACT deleteRegistrant --accountId <your-account>.testnet
```

### `createRegistration()`

**Parameters:**

| Parameter       | Type   | Required |
| :-------------- | :----- | :------- |
| `licenceNumber` | string | yes      |
| `type`          | string | yes      |
| `make`          | string | yes      |
| `model`         | string | yes      |
| `color`         | string | yes      |

**Example:**

```
near call $CONTRACT createRegistration '{"licenceNumber": "test-licence-no-1", "type": "car", "make": "Tesla", "model": "Model X", "color":"black"}' --accountId <your-account>.testnet
```

### `getRegistration()`

**Parameters:**

| Parameter       | Type   | Required |
| :-------------- | :----- | :------- |
| `licenceNumber` | string | yes      |

**Example:**

```
near view $CONTRACT getRegistration '{"licenceNumber": "<licence-number>"}'
```

### `updateRegistration()`

**Parameters:**

| Parameter       | Type   | Required |
| :-------------- | :----- | :------- |
| `licenceNumber` | string | yes      |
| `type`          | string | yes      |
| `make`          | string | yes      |
| `model`         | string | yes      |
| `color`         | string | yes      |

**Example:**

```
near call $CONTRACT updateRegistration '{"licenceNumber": "test-licence-no-1", "type": "car", "make": "Tesla", "model": "Model X", "color":"black"}' --accountId <your-account>.testnet
```

### `deleteRegistration()`

**Parameters:**

| Parameter       | Type   | Required |
| :-------------- | :----- | :------- |
| `licenceNumber` | string | yes      |

**Example:**

```
near call $CONTRACT deleteRegistration '{"licenceNumber": "test-licence-no-1"}' --accountId <your-account>.testnet
```

### `transferRegistration()`

**Parameters:**

| Parameter       | Type   | Required |
| :-------------- | :----- | :------- |
| `licenceNumber` | string | yes      |
| `toAccountId`   | string | yes      |

**Example:**

```
near call $CONTRACT transferRegistration '{"licenceNumber": "test-licence-no-1", "toAccountId": "<account-id>.testnet"}' --accountId <your-account>.testnet
```
