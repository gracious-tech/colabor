
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

import {inject, computed, ref, watch} from 'vue'

import DialogDonatePrev from './parts/DialogDonatePrev.vue'
import DialogDonateNext from './parts/DialogDonateNext.vue'
import {generate_token} from '@/services/utils'
import {get_stripe_url, save_pledge, type Pledge} from '@/services/backend'

import type {Fundraiser, PaymentOption} from '@/types'


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
const pledge_id = generate_token()
const selected_currency = ref<string|null>(null)
const selected_option = ref<string|null>(null)
const selected_frequency = ref<'single'|'monthly'|null>(null)
const entered_amount = ref(0)
const entered_amount_currency = ref(fund.payment.preferred_currency.toUpperCase())
const entered_name = ref('')
const entered_email = ref('')
const save_status = ref<boolean|null>(null)
const stripe_url = ref<string|null|false>(null)


// SELECT CURRENCY


// When selected currency changes, ensure the amount currency defaults to it
watch(selected_currency, () => {
    if (selected_currency.value && selected_currency.value !== 'other'){
        entered_amount_currency.value = selected_currency.value
    }
})


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


interface PaymentOptionUI {
    data:PaymentOption|{id: 'contact', type: 'contact'}
    icon:string
    title:string
    desc:string
    international:boolean
    recommended:boolean
}


// Access to payment options that includes props helpful to UI
const options = computed(() => {
    const items:PaymentOptionUI[] = []

    // Helper to map icon code in db to icon code used in UI
    const conform_icon = (icon:string) => {
        return {
            bank: 'account_balance',
            card: 'credit_card',
            email: 'mail',
        }[icon] ?? 'send_money'
    }

    for (const option of fund.payment.options){
        if (option.type === 'transfer'){
            items.push({
                data: option,
                icon: 'bank',
                title: `Bank transfer (${option.currency.toUpperCase()})`,
                desc: "",
                international: !!option.swift,
                recommended: selected_currency.value === option.currency,
            })
        } else if (option.type === 'stripe'){
            items.push(({
                data: option,
                icon: 'credit_card',
                title: "Credit/Debit card",
                desc: selected_currency.value && selected_currency.value !== 'other'
                    // Comparing to a domestic option, so mention fee difference
                    // NOTE Stripe domestic lowest fee: AU single 1.7% + 30c
                    // NOTE Stripe domestic highest fee: US recurring 2.9% + 0.7% + 30c
                    ? "2%-4% of donation lost to fees but convenient for international payments."
                    // Not comparing to a domestic alternative, so don't cause worry about fees
                    : "A convenient payment option, both domestically and internationally.",
                international: true,
                recommended: false,
            }))
        } else if (option.type === 'custom'){
            items.push(({
                data: option,
                icon: conform_icon(option.icon),
                title: option.title,
                desc: option.desc,
                international: option.international,
                recommended: false,
            }))
        }
    }

    // Add option to contact fundraiser
    if (fund.payment.allow_other){
        items.push({
            data: {
                id: 'contact',
                type: 'contact',
            },
            icon: 'mail',
            title: "Something else",
            desc: `If no other options are suitable,
                the fundraiser will get in touch about other possibilities.`,
            international: true,
            recommended: false,
        })
    }

    // Ensure recommended option comes first
    // @ts-ignore Boolean math does work
    items.sort((a, b) => b.recommended - a.recommended)

    return items
})


const displayed_options = computed(() => {
    return options.value.filter(option => {
        if (option.data.type === 'transfer' && selected_currency.value !== option.data.currency
                && !option.international){
            return false  // Not same currency and not international option
        }
        if (option.data.type === 'custom' && selected_currency.value !== option.data.currency
                && !option.international){
            return false  // Not same currency and not international option
        }
        return true
    })
})


const selected_option_data = computed(() => {
    return options.value.find(opt => opt.data.id === selected_option.value)!
})


const pledge = computed(() => {
    return {
        id: pledge_id,
        fundraiser: fund.id,
        amount: entered_amount.value,
        currency: entered_amount_currency.value,
        recurring: selected_recurring.value!,
        email: entered_email.value,
        name: entered_name.value,
        means: selected_option.value.title ?? "Unknown",
        appreciate: fund.activities.find(a => a.id === props.activity)?.title ?? null,
    } as Pledge
})


// Whether contact details are required or not
// NOTE Even if Stripe will require email address, don't let that interrupt donor just yet
const contact_required = computed(() => {
    return !fund.payment.allow_anonymous || selected_option.value.data.type === 'contact'
})


// What message should be displayed under the name/email fields
const contact_explanation = computed(() => {
    if (selected_option.value.data.type === 'contact'){
        return ''  // Won't be arranging payment yet so don't talk about receipts
    } else if (fund.payment.allow_anonymous){
        return `Please provide if you'd like to receive a receipt.
            However, you can remain anonymous if you prefer.`
    }
    return "Please provide so you can receive a receipt."
})


const select_option = (id:string) => {
    selected_option_id.value = selected_option_id.value === id ? null : id
}


// Verify if name input is valid (doesn't need to take value to work)
const check_name = () => {
    return !contact_required.value || !!entered_name.value
}


// Verify if email input is valid (doesn't need to take value to work)
const check_email = () => {
    if (!contact_required.value && !entered_email.value){
        return true
    }
    return /^[^\s@]+@[^\s@]+$/.test(entered_email.value)
}


// Whether contact details entered are valid and can continue
const contact_details_valid = computed(() => {
    return check_name() && check_email()
})


// Save the pledge and get details ready for payment page
// WARN Always reset statuses as user may go back and forth and modify options
const submit = async () => {

    // Try to save the pledge to db
    // WARN This may be blocked by browsers like Brave. Don't let that stop user from progressing
    //      to payment, but need to warn them if they chose option to be contacted.
    save_status.value = null
    save_pledge(pledge.value).then(() => {
        save_status.value = true
    }, () => {
        save_status.value = false
    })

    // Get Stripe URL if needed
    if (selected_type.value === 'stripe'){
        stripe_url.value = null
        get_stripe_url(pledge.value).then(url => {
            stripe_url.value = url === null ? false : url
        }, () => {
            stripe_url.value = false
        })
    }
}


// If something failed that user needed to continue, show email address to manually contact instead
const need_email_fallback = computed(() => {
    if (selected_type.value === 'stripe' && stripe_url.value === false){
        return true  // Couldn't get Stripe URL
    } else if (selected_type.value === 'contact' && save_status.value === false){
        return true  // Couldn't save contact details and they asked to be contacted
    }
    return false
})


</script>


<style lang='sass' scoped>

.content
    // Tall enough to stop buttons jumping around but not too far away from content
    // NOTE Expands when space but doesn't mess up if short viewport
    height: 400px

.options
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 12px
    @media (max-width: 600px)
        grid-template-columns: 1fr

.option
    border: 2px dashed transparent
    cursor: pointer
    text-align: left

    &.selected
        border-color: rgb(var(--v-theme-secondary))
        border-style: solid

    &:hover
        border-color: rgb(var(--v-theme-secondary))

    :deep(.v-card-title)
        display: flex
        align-items: center
        justify-content: center
        white-space: wrap
        line-height: 1.2
        font-size: 18px
        margin-top: 12px
        margin-bottom: 8px

        svg
            min-width: 24px
            margin-right: 8px

    .recommend
        position: relative
        top: 10px
        left: 4px
        display: flex
        align-items: center
        justify-content: flex-end
        color: rgb(var(--v-theme-secondary))
        font-size: 13px
        font-family: Roboto Condensed, Roboto, sans-serif
        line-height: 1
        svg
            margin-right: 8px
            width: 18px
            height: 18px

h2
    margin-bottom: 36px

:deep(.v-selection-control-group)
    justify-content: center

.btns
    margin-top: 48px
    margin-bottom: 6px
    display: flex
    justify-content: space-between

.payid

    .addr
        display: flex
        justify-content: center
        align-items: center
        gap: 24px
        @media (max-width: 600px)
            flex-direction: column

        img
            width: 80px  // Original width 127px

        :deep(.v-text-field)
            width: 100%
            max-width: 320px

            input
                text-align: center
                font-size: 18px
                font-family: Roboto Condensed, Roboto, sans-serif

    .or
        font-weight: bold
        font-size: 20px
        margin: 16px 0

.transfer
    display: grid
    grid-template-columns: auto auto
    gap: 12px
    margin-top: 24px
    font-family: Roboto Condensed, Roboto, sans-serif

    > *
        border-radius: 8px
        padding: 6px 12px
        text-align: left

        &:nth-child(odd)
            text-align: right

        &:nth-child(even)
            background-color: #eee


// Animate display of new options
.options-move, .options-enter-active
    transition: all 0.5s ease  // Animate repositioning and entering opacity
.options-leave-active
    display: none  // Make old disappear immediately as mess up positioning of others
.options-enter-from
    opacity: 0  // Fade new ones in


</style>
