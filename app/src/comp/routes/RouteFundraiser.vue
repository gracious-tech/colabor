
<template lang='pug'>

template(v-if='error')
    h1 {{ error === 'missing' ? "Not Found" : "Offline" }}
template(v-else-if='fund')
    FundMain(:fund='fund' :key='fund.id')
    div.footer(class='text-center')
        div.created created with
        GO(href='/' target='_blank')
            img.logo(src='@/assets/logo.svg')

</template>


<script lang='ts' setup>

import {ref} from 'vue'

import FundMain from '@/comp/fundraiser/FundMain.vue'
import {data_url} from '@/services/backend'
import type {Fundraiser} from '@/types'


const props = defineProps<{fundraiser:string}>()

const url = data_url(props.fundraiser) + '/data.json'
let fund = ref<Fundraiser>()
let error = ref<'offline'|'missing'>()
fetch(url).then(async resp => {
    if (!resp.ok || !resp.headers.get('content-type')?.includes('json')){
        error.value = 'missing'
    }
    const data = await resp.json()
    data.id = props.fundraiser
    data.url = data_url(props.fundraiser)
    fund.value = data
}, () => {error.value = 'offline'})


</script>


<style lang='sass' scoped>

.footer
    margin-top: 200px

    .logo
        max-width: 250px

.created
    color: white
    opacity: 0.5

</style>
