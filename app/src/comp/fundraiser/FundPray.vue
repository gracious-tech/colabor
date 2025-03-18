
<template lang='pug'>


div.pray
    h3 Learn &amp; Pray
    div
        v-btn(v-for='button of fund.content.subscribe' :key='button.id' variant='tonal' color=''
                :href='button.url' target='_blank' size='large')
            template(v-if='button.icon' #prepend)
                AppIcon(:name='get_icon_name(button.icon)')
            | {{ button.label }}


</template>


<script lang='ts' setup>

import {inject} from 'vue'

import type {Fundraiser} from '@/types'


const fund = inject('fund') as Fundraiser

const get_icon_name = (icon_id:string) => {
    return {
        website: 'link',
        email: 'mail',
        facebook: 'facebook',
    }[icon_id]
}

</script>


<style lang='sass' scoped>

.pray
    width: 100%
    padding: 24px 24px 36px 24px
    color: rgb(var(--v-theme-on-primary))
    background-color: rgb(var(--v-theme-primary))
    text-align: center

    h3
        font-size: 40px

    .v-btn
        margin: 12px

</style>
