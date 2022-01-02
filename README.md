# Solana Links
Solana links is a proof of concept application not ment for production. This was created to play around with solana and learn how to build and deploy an application on the solana blockchain using the anchor framework.

The application will allow you to register a username if it has not already been taken, and then create links to your "homepage" that are all stored on the blockchain. There is no backend apart from using the solana devnet, all data is stored in the blockchain.

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
[Example application](http://a1m.coxeh.com/)

[Example user page](http://a1m.coxeh.com/user/coxeh)