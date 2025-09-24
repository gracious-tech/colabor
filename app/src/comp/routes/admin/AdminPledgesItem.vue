
<template lang="pug">

v-list-item(:class='status_class')
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
                v-list-item(@click='delete_pledge_action')
                    v-list-item-title Delete pledge

</template>


<script setup lang="ts">

import {computed, defineEmits, defineProps, inject} from 'vue'

import {clear_date} from '@/services/utils'
import {cents_to_display} from '@/shared/currency'
import {delete_pledge} from '@/services/backend'

import type {Ref} from 'vue'
import type {PledgeWithId} from '@/shared/schemas'


const fundraiser = inject('fundraiser') as Ref<string>

const props = defineProps<{pledge:PledgeWithId}>()
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

const status_class = computed(() => {
    // Deal with inactive first...
    if (props.pledge.status === 'unpaid')
        return 'unpaid'
    if (props.pledge.status === 'finished')
        return 'finished'
    // Leaves pending...
    return props.pledge.recurring === 'single' ? '' : 'recurring'
})


function delete_pledge_action(){
    delete_pledge(fundraiser.value, props.pledge.id)
}


</script>


<style lang='sass' scoped>

.recurring
    background-color: #0f02

.unpaid
    background-color: #f002

.finished
    background-color: #0002

</style>
