
<template lang="pug">

div
    h2(class='mt-4') Fundraisers

    v-list(class='my-4')
        v-list-item(v-for="fundraiser in fundraisers" :key="fundraiser.id"
                :to="`/admin/fundraisers/${fundraiser.id}`")
            v-list-item-title {{ fundraiser.title }}
            v-list-item-subtitle {{ fundraiser.id }}

    v-btn(@click="show_create_dialog = true") Create New Fundraiser
    DialogCreateFundraiser(v-model="show_create_dialog")

</template>


<script setup lang="ts">

import {ref, inject, type Ref} from 'vue'

import DialogCreateFundraiser from '@/comp/routes/admin/parts/DialogCreateFundraiser.vue'

import type {FundraiserWithId} from '@/shared/schemas'


const show_create_dialog = ref(false)

const fundraisers = inject('fundraisers') as Ref<FundraiserWithId[]>

</script>
