# Solana Links
Solana links is a proof of concept application not ment for production. This was created to play around with solana and learn how to build and deploy an application on the solana blockchain using the anchor framework.

The application will allow you to register a username if it has not already been taken, and then create links to your "homepage" that are all stored on the blockchain. There is no backend apart from using the solana devnet, all data is stored in the blockchain.

**Important Note: I do not know 100% if this is secure.**

### Features

* Anchor Framework
* PDA (Program Devised Address)
* Instruction Signing
* Owner/Authority Validation of Accounts
* Closing Accounts

## Deployment of Solana Program
Deploy the program first you will need to start the solana container using `docker-compose up` once done you may run this commands to upload to the devnet

    npm run anchor:build
    npm run anchor:deploy

This will deployed to the blockchain. You need to take the application pubkey that is provided on the deploy and update the  `lib.rs` file with the new key. Then deploy once more.

## Deployment of Frontend
The front end of the applcationis built using vuejs and nuxt as a single page application. This is the only part of the application that will need to be hosted.

    npm run app:build

Will create a the files to be uploaded in `src/aim/app/dist`

## Example

The appliation requires the Phantom Wallet and it must be set to devnet. Make sure you have some SOL then register a new account.

[Example application](http://a1m.coxeh.com/)

[Example user page](http://a1m.coxeh.com/user/coxeh)

## Todo

* Work out how rent of accounts and links work. See if I can calculate for all accounts and display when things expire
* Validation of Url. Currently commented off due to failing to upload to devnet which i presume is because its too large
* Allow Updating of Url
* Better UI


