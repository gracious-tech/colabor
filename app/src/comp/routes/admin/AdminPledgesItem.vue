
<template lang="pug">

v-list-item(:class='{recurring: pledge.recurring !== "single"}')
    template(#prepend)
        div(class='d-flex' style='width: 140px')
            AppIcon(:name='pledge.recurring === "single" ? "looks_one" : "event_repeat"' class='mr-4')
            div.amount {{ amount }}
    v-list-item-title
        | {{ pledge.name || "[Anonymous]" }}
        template(v-if='pledge.email') &nbsp;{{ '<' + pledge.email + '>' }}
    v-list-item-subtitle
        span {{ date_str }}
        span &nbsp;&nbsp;|&nbsp;&nbsp;{{ pledge.ref_code }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ pledge.means }}
    v-list-item-subtitle(v-if='pledge.appreciate') Appreciates: {{ pledge.appreciate }}
    template(#append)
        v-menu(location="bottom end")
            template(#activator="{ props }")
                v-btn(icon v-bind="props" variant='text')
                    app-icon(name='more_vert')
            v-list
                v-list-item(@click='emit("payment")')
                    v-list-item-title Record related payment

</template>


<script setup lang="ts">

import {clear_date} from '@/services/utils'
import {cents_to_display} from '@/shared/currency'
import {computed, defineEmits, defineProps} from 'vue'

import type {Pledge} from '@/shared/schemas'


const props = defineProps<{pledge:Pledge}>()
const emit = defineEmits<{(e:'payment'):void}>()


const date_str = computed(() => {
    return clear_date(props.pledge.timestamp)
})

const amount = computed(() => {
    if (!props.pledge.cents){
        return 'TBC'
    }
    return cents_to_display(props.pledge.cents, props.pledge.currency)
})


</script>


<style lang='sass' scoped>

.recurring
    background-color: #0f02

</style>
