<template>
<div class="flex justify-center items-center flex-col">
  <figure v-if="hasPhantom === false" class="bg-gray-800 rounded-xl p-8 m-1">
    Please install Phantom Wallet to be able to use this app
  </figure>
  <template v-else>
    <figure class="bg-gray-800 rounded-xl p-8 m-1">
      <h2 class="text-lg">Welcome to a1m@solana</h2>
      <template v-if="loggedIn">
        <button class="btn btn-primary mt-3" @click.prevent="logout">Logout {{username}}</button>
        <a :href="'/user/'+username" class="btn btn-secondary mt-3" target="_blank">Visit {{username}}'s Page</a>
      </template>
      <template v-else>
        <div v-if="authError" class="alert alert-error">
          {{authError}}
        </div>
        <p>Enter a username to register a new account or login so you can make changes</p>
        <div class="form-control">
          <label class="label">
            <span class="label-text">
              Username
            </span>
          </label>
          <input v-model="username" :disabled="saving" class="input" @keyup.enter.prevent="login" /> 
        </div>
        <div class="mt-2">
            <button class="btn btn-primary" :disabled="username.length <= 0 || saving" @click.prevent="login">Login</button>
            <button class="btn btn-primary" :disabled="username.length <= 0 || saving" @click.prevent="register">
              Register
              <div v-if="saving" style="border-top-color:transparent"
              class="w-4 h-4 border-4 border-purple-400 border-solid rounded-full animate-spin ml-2"></div>
              </button>
        </div>
      </template>

    </figure>
    <figure  v-if="loggedIn && (links.length > 0 || linksLoading)" class="bg-gray-800 rounded-xl p-8 m-1">
        <h2 class="text-lg">Your Links</h2>
            <div v-if="linksLoading" style="border-top-color:transparent"
              class="w-8 h-8 border-4 border-purple-400 border-solid rounded-full animate-spin ml-2"></div>
          <links v-if="links.length > 0" :links="links" :show-actions="true" @deleted="getLinks" />
    </figure>
    <figure  v-if="loggedIn" class="bg-gray-800 rounded-xl p-8 m-1">
      <h2 class="text-lg">Create Link</h2>
      <div v-if="linkError" class="alert alert-error">
        {{linkError}}
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">
            Your Link
          </span>
        </label>
        <input v-model="newLink" class="input" max="255" @keyup.enter.prevent="createLink" /> 
      </div>
        <div class="mt-2">
        <button class="btn btn-primary" :disabled="newLink.length <= 0" @click.prevent="createLink">
          Create
          <div v-if="saving" style="border-top-color:transparent"
              class="w-4 h-4 border-4 border-purple-400 border-solid rounded-full animate-spin ml-2"></div>
          </button>
        </div>
    </figure>
  </template>
</div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      newLink: '',
      loggedIn: false,
      saving: false,
      linksLoading: false,
      links: [],
      linkError: null,
      authError: null
    }
  },
  computed: {
    userKey() {
      return this.$aim.getUserPublicKey()
    },
    hasPhantom() {
      return window.solana !== undefined
    }
  },
  methods: {
    logout() {
      this.loggedIn = false
      this.username = ''
      this.authError = null
      this.linkError = null
      this.links = []
    },
    async register() {
      try {
        this.saving = true;
        await this.$aim.connect();
        await this.$aim.register(this.username)
        this.loggedIn = true;
        this.getLinks();
      }catch(e){
        this.authError = e.message
      }finally{
        this.saving = false
      }
    },
    async login() {
      try {
        await this.$aim.connect();
        this.loggedIn = await this.$aim.login(this.username)
        if(this.loggedIn){
          this.getLinks();
        }else {
          throw new Error('Could not log you in. Are you registered?')
        }
      }catch(e){
        this.authError = e.message
      }
    },
    async createLink() {
      if(this.newLink.length <=0) {
        return
      }
      try {
        await this.$aim.connect();
        this.linkError = null
        this.saving = true
        await this.$aim.createLink(this.username, this.newLink)
        this.newLink = '';
        this.getLinks();
      }catch(e) {
        this.linkError = e.message
      } finally{
        this.saving = false
      }
    },
    async getLinks() {
      try {
        await this.$aim.connect();
        this.linksLoading = true
        const [pubKey, bump] = await this.$aim.getUserAccountByUsername(this.username);
        this.links = await this.$aim.getLinksForUserAccount(pubKey)
      }catch(e){
        throw e
      }finally{
        this.linksLoading = false
      }
      
    }
  }
}
</script>
