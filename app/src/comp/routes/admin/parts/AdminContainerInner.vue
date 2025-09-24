
<template lang="pug">

v-toolbar(flat)
    v-btn(to="/admin") Dashboard
    SelectFundraiser(v-if='route.path.startsWith("/admin/fundraisers/")')
    v-menu(location="bottom end")
        template(#activator="{props}")
            v-avatar(size="48" class="ml-auto mr-2" v-bind="props")
                //- NOTE no-referrer needed to prevent google from rate limiting duing dev
                v-img(:src="profile_pic" referrerpolicy="no-referrer")
        v-list
            v-list-item(@click="sign_out")
                v-list-item-title Sign Out

router-view

</template>


<script setup lang="ts">

import {computed, provide} from 'vue'
import {useRoute} from 'vue-router'
import {useCurrentUser, useFirebaseAuth} from 'vuefire'
import {signOut} from 'firebase/auth'

import SelectFundraiser from './SelectFundraiser.vue'
import {use_fundraisers} from '@/services/backend'


const auth = useFirebaseAuth()!
const user = useCurrentUser()
const route = useRoute()


provide('fundraisers', use_fundraisers())


const profile_pic = computed(() => {
    return user.value?.photoURL || ''  // TODO add default
})


function sign_out() {
    signOut(auth)
}

</script>
