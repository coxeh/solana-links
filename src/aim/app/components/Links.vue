<template>
    <div>
            <div v-for="link in links" :key="link.pubkey.toString()" class="btn btn-secondary m-1">
                <a :href="link.accountData.url">{{link.accountData.url}}</a>
                <div v-if="showActions">
                    <button class="badge ml-2" @click="doDelete(link)">
                        <div v-if="deletingKey && deletingKey.toString() === link.pubkey.toString()">
                            <div style="border-top-color:transparent"
                                class="w-3 h-3 border-4 border-purple-400 border-solid rounded-full animate-spin"></div>
                        </div>
                        <div v-else>
                            x
                        </div>
                    </button>
                </div>
            </div>
        </div>
</template>

<script>
export default {
    data() {
        return {
            deletingKey: null
        }
    },
    props: {
        showActions: {
            type: Boolean,
            default: false
        },
        links: {
            type: Array,
            default() {
                return []
            }
        }
    },
    methods: {
        async doDelete(link) {
            try {
                this.deletingKey = link.pubkey
                this.$emit('deleting', link)
                await this.$aim.deleteLink(link.pubkey)
                this.$emit('deleted',link)
            }catch(e){
                console.error(e)
            }finally {
                this.deletingKey = null
            }
           
        }
    }
}
</script>
