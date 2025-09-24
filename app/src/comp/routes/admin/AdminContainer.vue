
<template lang="pug">

div(v-if="!user" class='text-center')
    v-btn(@click="sign_in") Sign In with Google

AdminContainerInner(v-else :key='user.uid')

</template>

<script setup lang="ts">

import {useCurrentUser, useFirebaseAuth} from 'vuefire'
import {GoogleAuthProvider, signInWithRedirect, signInWithPopup} from 'firebase/auth'

import AdminContainerInner from './parts/AdminContainerInner.vue'

const auth = useFirebaseAuth()!
const user = useCurrentUser()


function sign_in(){
    const method = import.meta.env.DEV ? signInWithPopup : signInWithRedirect
    method(auth, new GoogleAuthProvider())
}

</script>
