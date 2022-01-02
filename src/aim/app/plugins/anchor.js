const anchor = require("@project-serum/anchor");

import idl from '../../target/idl/aim2.json';

class ConnectionAdaptor {
    constructor(providerUrl) {
        this.isConnected = false;
        this.anchor = anchor;
        this.providerUrl = providerUrl
        this.connection = new anchor.web3.Connection(this.providerUrl);
        const wallet = anchor.web3.Keypair.generate();
        this.provider = new anchor.Provider(this.connection,wallet,{})
        anchor.setProvider(this.provider)
        this.programId = new anchor.web3.PublicKey(idl.metadata.address);
        this.program = new anchor.Program(idl, this.programId);
        console.log(idl.metadata.address)
    }

    async connect() {
        if(this.isConnected === false) {
            await window.solana.connect()
            this.provider = new anchor.Provider(this.connection, window.solana, {});
            anchor.setProvider(this.provider)
            this.isConnected = true
            this.programId = new anchor.web3.PublicKey(idl.metadata.address);
            this.program = new anchor.Program(idl, this.programId);
        }
        return this
    }

    async getUserAccountByUsername(username) {
        return await anchor.web3.PublicKey.findProgramAddress([Buffer.from("username"), Buffer.from(username)], this.programId);
    }
    getUserPublicKey() {
        return this.provider.wallet.publicKey
    }

    async register(username) {
        const [userAccount, bump] = await this.getUserAccountByUsername(username)
        return await this.program.rpc.initialize(bump,username, {
            accounts: {
              username: userAccount,
              authority:this.provider.wallet.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId
            } ,
            signers: [],
          })
    }

    async requestUserAccountByUsername(username) {
        const [pubKey, bump] = await this.getUserAccountByUsername(username);
        return this.program.account.usernameAccount.fetch(pubKey)
    }
    
    async login(username) {
       try {
        const userAccount = await this.requestUserAccountByUsername(username)
        return userAccount.authority.toString() === this.getUserPublicKey().toString()
       }catch(err) {
           console.error(err)
           return false
       }
    }

    async createLink(username, url) {
        const [userAccount, bump] = await this.getUserAccountByUsername(username)
        const linkPair = anchor.web3.Keypair.generate();
        return await this.program.rpc.createLink(url, {
            accounts: {
              link:linkPair.publicKey,
              username: userAccount,
              authority:this.provider.wallet.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId
            } ,
            signers: [linkPair],
          })
     }

     async deleteLink(linkPubKey) {
        return await this.program.rpc.deleteLink({
            accounts: {
              link:linkPubKey,
              authority:this.provider.wallet.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId
            } ,
            signers: [],
          })
     }

    async getLinksForUserAccount(pubKey) {
        const awaitAccounts = await this.connection.getProgramAccounts(this.programId,{
            filters: [{
                memcmp:{
                    bytes: pubKey.toBase58(),
                    offset: 8 + 32
                }
            }]
        })
        const pubKeys = awaitAccounts.map(a => a.pubkey)
        const links = await this.program.account.linkAccount.fetchMultiple(pubKeys)
        return pubKeys.map((k,i) => {
            return  {
                pubkey: k,
                accountData: links[i]
            }
        });
    }
}

export default (context, inject) => {
    inject('aim', new ConnectionAdaptor(process.env.ANCHOR_PROVIDER_URL))
}