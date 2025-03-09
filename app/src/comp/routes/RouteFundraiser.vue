
<template lang='pug'>

FundMain


div.footer(class='text-center')
    div.created created with
    GO(href='/' target='_blank')
        img.logo(src='@/assets/logo_with_tagline.svg')

</template>


<script lang='ts' setup>

import {provide} from 'vue'

import FundMain from '@/comp/fundraiser/FundMain.vue'
import {data_url} from '@/services/backend'
import type {Fundraiser} from '@/types'


const props = defineProps<{fundraiser:string}>()

const url = data_url(props.fundraiser) + '/data.json'
const data = await (await fetch(url)).json()

data.id = props.fundraiser
data.url = data_url(props.fundraiser)
provide<Fundraiser>('fund', data)

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
