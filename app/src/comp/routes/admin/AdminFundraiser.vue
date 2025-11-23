
<template lang="pug">

div(class='my-4 d-flex justify-space-around')
    v-btn(:to='`/admin/fundraisers/${fundraiser}/pledges`') Pledges
    v-btn(:to='`/admin/fundraisers/${fundraiser}/contacts`') Supporters
    v-btn(:to='`/admin/fundraisers/${fundraiser}/payments`') Payments
    v-btn(:to='`/admin/fundraisers/${fundraiser}/statements`') Statements

router-view(:key='fundraiser')

</template>


<script setup lang="ts">

import {computed, provide} from 'vue'
import {useRoute} from 'vue-router'

import {use_contacts} from '@/services/backend'


const route = useRoute()
const fundraiser = computed(() => {
    return route.params['fundraiser'] as string
})

provide('fundraiser', fundraiser)
provide('contacts', use_contacts(fundraiser))


</script>
