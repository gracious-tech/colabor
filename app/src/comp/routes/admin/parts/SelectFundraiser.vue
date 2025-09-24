
<template lang='pug'>

v-select(:items='fundraisers.map(f => f.id)' v-model='fundraiser'
    @update:modelValue='change_fundraiser' max-width='300' density='compact' class='ml-4')

</template>


<script lang='ts' setup>

import {inject, computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'

import type {Ref} from 'vue'
import type {Fundraiser} from '@/types'


const router = useRouter()
const route = useRoute()
const fundraisers = inject('fundraisers') as Ref<Fundraiser[]>


const fundraiser = computed(() => route.params['fundraiser'] as string)


function change_fundraiser(id: string) {
    router.push(`/admin/fundraisers/${id}`)
}

</script>
