
<template lang='pug'>

VDialog(v-model='show' persistent max-width='600' class='text-center')
    VCard(style='min-height: 500px')
        VCardTitle(class='text-right')
            VBtn(@click='show = false' icon variant='text' color='')
                AppIcon(name='close')
        VCardText
            VWindow(v-model='step')

                VWindowItem(:value='1')
                    h2 Let's support this!
                    p This is a free platform, so 100% of your donation will go to the fundraiser 🎉
                    p The following steps help to avoid transaction fees from banks as well.
                    div.btns
                        span
                        DialogDonateNext(@click='step = currencies.length ? 2 : 3')

                VWindowItem(:value='2')
                    h2 What currency will you be sending?
                    VRadioGroup(v-model='selected_currency' inline)
                        VRadio(v-for='currency of currencies' :key='currency' :value='currency'
                            :label='currency.toUpperCase()')
                        VRadio(value='other' label="Other")
                    p We'll then work out how to transfer it with the least fees.
                    div.btns
                        DialogDonatePrev(@click='step--')
                        DialogDonateNext(@click='step++' :disabled='!selected_currency')

                VWindowItem(:value='3')
                    h2 How would you like to donate?
                    div(class='d-flex')
                        VCard.option(v-for='option of displayed_options' :key='option.data.id'
                                @click='select_option(option.data.id)' :title='option.title'
                                color='surface-variant' variant='tonal' max-width='300'
                                :class='{selected: selected_option === option.data.id}'
                                class='ma-2')
                            VCardText {{ option.desc }}
                    div.btns
                        DialogDonatePrev(@click='step = currencies.length ? 2 : 1')
                        DialogDonateNext(@click='step++'
                            :disabled='!displayed_options.find(o => o.data.id === selected_option)')

                VWindowItem(:value='4')
                    h2 How often?
                    VRadioGroup(v-model='selected_frequency' inline)
                        VRadio(value='single' label="One-off")
                        VRadio(value='monthly' label="Monthly")
                        p.
                            Regular support makes it easier for ministries to plan ahead and have
                            a stable base of funding, though one-off gifts are also appreciated.
                    div.btns
                        DialogDonatePrev(@click='step--')
                        DialogDonateNext(@click='step++' :disabled='!selected_frequency')

                VWindowItem(:value='5')
                    h2 How much?
                    div.amount(class='d-flex align-center justify-center')
                        VTextField(v-model='entered_amount_cleaned' max-width='200' label="Amount")
                        VAutocomplete(v-model='entered_amount_currency' :items='top_currencies'
                            max-width='125' label="Currency")
                    p(v-if='selected_frequency === "monthly"') per month
                    div.btns
                        DialogDonatePrev(@click='step--')
                        DialogDonateNext(@click='step++' :disabled='!entered_amount')

                VWindowItem(:value='6')
                    h2 How can you be contacted?
                    VTextField(v-model='entered_name' :rules='[check_name]'
                        :label='"Name" + (contact_required ? "" : " (optional)")')
                    VTextField(v-model.trim='entered_email' :rules='[check_email]'
                        :label='"Email address" + (contact_required ? "" : " (optional)")')
                    div(class='mt-4') {{ contact_explanation }}
                    div.btns
                        DialogDonatePrev(@click='step--')
                        DialogDonateNext(@click='submit' :disabled='!contact_details_valid')
                            | Confirm

                VWindowItem(:value='7')
                    h2 Thanks for your support!
                    div(v-if='requires_stripe')
                        template(v-if='!stripe_url')
                            div Connecting to payment platform...
                            VProgressCircular(indeterminate)
                        VBtn(v-else color='secondary' :href='stripe_url' target='_blank')
                            template(#prepend)
                                AppIcon(name='credit_card')
                            | Give by card
                    div.btns
                        DialogDonatePrev(@click='step--')
                            | Modify


</template>


<script lang='ts' setup>

import {inject, computed, ref} from 'vue'

import type {Fundraiser} from '@/types'


const top_currencies = [
    'usd', 'eur', 'gbp', 'jpy', 'cny', 'chf', 'cad', 'aud', 'sgd', 'hkd',
    'krw', 'inr', 'brl', 'mxn', 'zar', 'rub', 'try', 'nzd', 'thb', 'myr',
    'idr', 'php', 'vnd', 'sar', 'aed', 'sek', 'nok', 'dkk', 'pln', 'huf',
    'czk', 'ils', 'twd', 'ars', 'clp', 'cop', 'pen', 'egp', 'qar', 'kwd',
    'omr', 'bdt', 'pkr', 'lkr', 'ron', 'bgn', 'hrk', 'uyu', 'kzt', 'uah',
].map(c => ({title: c.toUpperCase(), value: c})).sort()


const show = defineModel<boolean>({required: true})

const fund = inject('fund') as Fundraiser

const step = ref(1)
const selected_currency = ref<string|null>(null)
const selected_option = ref<string|null>(null)
const selected_frequency = ref<'single'|'monthly'|null>(null)
const entered_amount = ref(0)
const entered_amount_currency = ref(fund.payment.preferred_currency.toUpperCase())
const entered_name = ref('')
const entered_email = ref('')


const entered_amount_cleaned = computed({
    get(){
        return entered_amount.value ? entered_amount.value.toString() : ''
    },
    set(value:string){
        const parsed = parseInt(value, 10) || 0
        entered_amount.value = Math.max(0, parsed)
    },
})


const currencies = computed(() => {
    // List currencies that have options that are exclusive to that currency

    const detected = new Set<string>()
    for (const option of options.value){
        if (!option.international && 'currency' in option.data && option.data.currency){
            detected.add(option.data.currency)
        }
    }

    // If the preferred currency exists, ensure it comes first
    const preferred = fund.payment.preferred_currency
    let as_list = [...detected]
    if (as_list.includes(preferred)){
        as_list = [preferred, ...as_list.filter(i => i !== preferred)]
    }
    return as_list
})


const displayed_options = computed(() => {
    const items:{id:string, title:string, icon:string, desc:string, recommended:boolean}[] = []

    for (const option of fund.payment.options){

        if (option.type === 'transfer'){
            if (selected_currency.value !== option.currency && !option.swift){
                continue  // Not same currency and no international payment option
            }
            items.push({
                id: option.id,
                title: `Bank transfer (${option.currency.toUpperCase()})`,
                icon: 'bank',
                desc: "",
                recommended: selected_currency.value === option.currency,
            })
        } else if (option.type === 'custom'){
            items.push(({
                id: option.id,
                title: option.title,
                icon: option.icon,
                desc: option.desc,
                recommended: false,
            }))
        }
    }

    // Always add option to contact fundraiser
    items.push({
        id: 'contact',
        title: "Something else",
        icon: '?',
        desc: "If no other options are suitable, the fundraiser will get in touch about other possibilities.",
        recommended: false,
    })

    return items
})


const select_option = (id:string) => {
    selected_option.value = selected_option.value === id ? null : id
}

</script>


<style lang='sass' scoped>

.option
    border: 2px dashed transparent
    cursor: pointer

    &.selected
        border-color: rgb(var(--v-theme-secondary))
        border-style: solid

    &:hover
        border-color: rgb(var(--v-theme-secondary))

h2
    margin-top: 12px
    margin-bottom: 36px

:deep(.v-selection-control-group)
    justify-content: center

.btns
    margin-top: 48px
    margin-bottom: 6px
    display: flex
    justify-content: space-between

</style>
