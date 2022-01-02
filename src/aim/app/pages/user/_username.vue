<template>
    <div class="flex justify-center items-center flex-col">
        <figure class="bg-gray-800 rounded-xl p-8 m-1">
        <p class="text-lg mb-2"> {{username}}'s Links</p>

        <div class="flex flex-col">
            <div v-for="link in links" :key="link.pubkey.toString()" class="btn btn-secondary m-1">
                <a :href="link.accountData.url" target="_blank">{{link.accountData.url}}</a>
            </div>
        </div>
        </figure>
        <p>Links are powered by a1m and the solana blockchain</p>
    </div>
</template>

<script>


export default {
    data() {
        return {
            userAccount: null,
            links: []
        }
    },
    computed: {
        username() {
            return this.$route.params.username
        }
    },
    async validate({ params, $aim }) {
        this.userAccount = await $aim.requestUserAccountByUsername(params.username)
        return true
    
    },
    async created() {
        const [pubKey, bump] = await this.$aim.getUserAccountByUsername(this.username);
       const accounts = await this.$aim.getLinksForUserAccount(pubKey)
       this.links = accounts
    }
}
</script>
