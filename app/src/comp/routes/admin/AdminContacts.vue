<template lang="pug">

v-list
    v-list-item(v-for="contact in contacts" :key="contact.id")
        v-list-item-title {{ contact.name }}
        v-list-item-subtitle {{ contact.email }}

</template>


<script setup lang="ts">

import {inject, type Ref} from 'vue'

import type {ContactWithId} from '@/shared/schemas'


const contacts = inject('contacts') as Ref<ContactWithId[]>


</script>


<style lang='sass' scoped>


</style>
