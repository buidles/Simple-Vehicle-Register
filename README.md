# Simple Vehicle Register

Uses https://github.com/Learn-NEAR/starter--near-sdk-as as a template.

## About

- A user first registers with some personal details.
- Once registered they can register vehicles - either cars, boats, or motorcyles.
- Registered vehicles can be updated, deleted, or transferred to another account

## Project Setup

Ensure [NEAR CLI](https://github.com/near/near-cli) and [yarn](https://github.com/yarnpkg/berry) are installed.

1. Clone this repo to a local folder
2. Run `yarn`
3. Build contract: `yarn build`
4. Deploy contract: `near dev-deploy ./build/debug/simple.wasm` - keep a note of the output dev account ID (it can also be be found in either file in `./neardev`)

## Testing

To run unit tests: `yarn test`

## Usage

1. Set NEAR environment: `export NEAR_ENV=testnet`
2. Set contract owner: `export OWNER=<your-account>.testnet`
3. Set contract: `export CONTRACT=<dev-account-id>`

## Contract API

todo

## Examples

#### To register a user:

Call `createRegistration()`

`near call $CONTRACT createRegistration '{"licenceNumber": "licence-no-2", "type": "car", "make": "Tesla", "model": "x2", "color":"green"}' --accountId jptest1.testnet`
