
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
                        VBtn(color='secondary' @click='step = currencies.length ? 2 : 3') Next
                VWindowItem(:value='2')
                    h2 What currency will you be sending?
                    VRadioGroup(v-model='selected_currency' inline)
                        VRadio(v-for='currency of currencies' :value='currency' :label='currency.toUpperCase()')
                        VRadio(value='other' label="Other")
                    p We'll then work out how to transfer it with the least fees.
                    div.btns
                        VBtn(color='secondary' @click='step--') Prev
                        VBtn(color='secondary' @click='step++' :disabled='!selected_currency') Next
                VWindowItem(:value='3')
                    h2 How would you like to donate?
                    div(class='d-flex')
                        VCard.option(v-for='option of displayed_options' @click='select_option(option.id)' :title='option.title'
                                color='surface-variant' variant='tonal' max-width='300'
                                class='ma-2' :class='{selected: selected_option === option.id}')
                            VCardText {{ option.desc }}
                    div.btns
                        VBtn(color='secondary' @click='step = currencies.length ? 2 : 1') Prev
                        VBtn(color='secondary' @click='step++' :disabled='!displayed_options.find(o => o.id === selected_option)') Next
                VWindowItem(:value='4')
                    h2 How often?
                    VRadioGroup(v-model='selected_frequency' inline)
                        VRadio(value='single' label="One-off")
                        VRadio(value='monthly' label="Monthly")
                        p Regular support makes it easier for ministries to plan ahead and have a stable base of funding, though one-off gifts are also appreciated.
                    div.btns
                        VBtn(color='secondary' @click='step--') Prev
                        VBtn(color='secondary' @click='step++' :disabled='!selected_frequency') Next
                VWindowItem(:value='5')
                    h2 How much?
                    div.amount(class='d-flex align-center justify-center')
                        VTextField(v-model='entered_amount' type='number' max-width='200' label="Amount")
                        span(v-if='selected_currency && selected_currency !== "other"' class='ml-3') {{ selected_currency.toUpperCase() }}
                        VAutocomplete(v-else v-model='entered_amount_currency' :items='top_currencies' max-width='125' label="Currency")
                    p(v-if='selected_frequency === "monthly"') per month
                    div.btns
                        VBtn(color='secondary' @click='step--') Prev
                        VBtn(color='secondary' @click='step++' :disabled='!entered_amount') Next
                VWindowItem(:value='6')
                    h2 How can you be contacted?
                    VTextField(v-model='entered_name' label="Name (optional)")
                    VTextField(v-model='entered_email' label="Email address (optional)")
                    p So you can receive confirmation that your donation is received. However, you can remain anonymous if you prefer.
                    div.btns
                        VBtn(color='secondary' @click='step--') Prev
                        VBtn(color='secondary' @click='step++') Donate
                VWindowItem(:value='7')
                    h2 Thanks for your support!
                    p(class='opacity-60') If you'd like to modify your choices, simply go back and they'll be updated.
                    div.btns
                        VBtn(color='secondary' @click='step--') Prev
                        span


</template>


<script lang='ts' setup>

import {inject, computed, ref} from 'vue'

import type {Fundraiser} from '@/types'


const top_currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CHF', 'CAD', 'AUD', 'SGD', 'HKD',
    'KRW', 'INR', 'BRL', 'MXN', 'ZAR', 'RUB', 'TRY', 'NZD', 'THB', 'MYR',
    'IDR', 'PHP', 'VND', 'SAR', 'AED', 'SEK', 'NOK', 'DKK', 'PLN', 'HUF',
    'CZK', 'ILS', 'TWD', 'ARS', 'CLP', 'COP', 'PEN', 'EGP', 'QAR', 'KWD',
    'OMR', 'BDT', 'PKR', 'LKR', 'RON', 'BGN', 'HRK', 'UYU', 'KZT', 'UAH',
].sort()


const show = defineModel<boolean>({required: true})

const fund = inject('fund') as Fundraiser

const step = ref(1)
const selected_currency = ref<string|null>(null)
const selected_option = ref<string|null>(null)
const selected_frequency = ref<'single'|'monthly'|null>(null)
const entered_amount = ref('')
const entered_amount_currency = ref(fund.payment.preferred_currency.toUpperCase())
const entered_name = ref('')
const entered_email = ref('')


const analysed_options = computed(() => {
    return fund.payment.options.map(option => {
        return {
            props: option,
            international: (option.type === 'transfer' && option.swift)
                || option.type === 'card'
                || (option.type === 'custom' && option.international),
        }
    })
})


const currencies = computed(() => {
    // List currencies that have options that are exclusive to that currency

    const detected = new Set<string>()
    for (const option of analysed_options.value){
        if (!option.international && 'currency' in option.props && option.props.currency){
            detected.add(option.props.currency)
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
