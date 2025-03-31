
<template lang='pug'>

VCardTitle(class='d-flex align-center pa-2')
    div(class='text-center flex-grow-1 pl-12') {{ title }}
    VBtn(@click='$emit("close")' icon variant='text' color='' class='align-self-start')
        AppIcon(name='close')

VCardText.content
    VWindow(v-model='step')

        VWindowItem(value='intro')
            p(class='text-h6').
                This is a free platform,
                so 100% of your donation will go to the fundraiser 🎉
            p(v-if='options.length > 1')
                | The following steps help to avoid transaction fees from banks as well.
            template(v-else)
                h6(class='text-subtitle-1 font-weight-bold mt-8') Supported payment method
                p(class='text-subtitle-1 mt-1') {{ options[0]?.title }}

        VWindowItem(value='option')
            template(v-if='currencies.length')
                div(class='text-body-2') What currency are you sending?
                VRadioGroup(v-model='selected_currency' inline class='mb-4')
                    VRadio(v-for='currency of currencies' :key='currency' :value='currency'
                        :label='currency.toUpperCase()')
                    VRadio(value='other' label="Other")
            div.options(v-if='currencies.length && selected_currency')
                TransitionGroup(name='options' appear)
                    VCard.option(v-for='option of displayed_options' :key='option.data.id'
                            @click='select_option(option.data.id)'
                            color='surface-variant' variant='tonal' :class='option.classes')
                        VCardTitle
                            AppIcon(:name='option.icon')
                            | {{ option.title }}
                        VCardText
                            | {{ option.desc }}
                            div.recommend(v-if='option.recommended')
                                AppIcon(name='thumb_up')
                                | Recommended

        VWindowItem(value='amount')
            VRadioGroup(v-if='fund.payment.allow_recurring' v-model='selected_recurring' inline
                    class='mb-4')
                VRadio(value='single' label="One-off" class='mr-2')
                VRadio(value='month' label="Monthly" class='mr-4')
            div.amount(class='d-flex align-center justify-center')
                VTextField(v-model='cleaned_amount' max-width='200' label="Amount" class='mr-3')
                VCombobox(v-model='cleaned_amount_currency' :items='top_currencies'
                    :readonly='!selected_option.international'
                    max-width='125' label="Currency" minlength='3' maxlength='3')
            p(class='mt-8').
                Donating monthly helps fundraisers to plan ahead,
                though one-off gifts are also appreciated.

        VWindowItem(value='contact')
            VTextField(v-model='entered_name' :rules='[check_name]'
                :label='"Name" + (name_required ? "" : " (optional)")')
            VTextField(v-model.trim='entered_email' :rules='[check_email]'
                :label='"Email address" + (email_required ? "" : " (optional)")')
            div(class='mt-8') {{ contact_explanation }}

        VWindowItem(value='pay')

            template(v-if='selected_option.data.type === "contact"')
                div
                    a(:href='email_href' target='_blank' class='text-h6')
                        | {{ fund.contact.email }}

            template(v-else-if='selected_option.data.type === "custom"')
                div(class='mb-8') {{ selected_option.data.instructions }}
                div
                    VBtn(v-if='selected_option.data.url' :href='selected_option.data.url'
                            target='_blank' color='secondary' class='mb-2')
                        | Continue

            template(v-else-if='selected_option.data.type === "stripe"')
                div(v-if='stripe_url !== false' class='mb-8 text-body-2')
                    | Please continue to the secure card payment platform, Stripe.
                template(v-if='stripe_url === null')
                    div(class='mb-4 font-italic') Connecting to payment platform...
                    VProgressCircular(indeterminate color='secondary')
                VBtn(v-else-if='stripe_url' @click='open_stripe' color='secondary')
                    template(#prepend)
                        AppIcon(name='credit_card')
                    | Donate {{ commitment }}
                template(v-else)
                    p.
                        Sorry, there was a problem connecting to the payment platform.
                        Please contact the fundraiser for a payment link instead.
                    div
                        a(:href='email_href' target='_blank' class='text-h6')
                            | {{ fund.contact.email }}

            template(v-else-if='selected_option.data.type === "transfer"')
                VRadioGroup(v-if='payid_possible' v-model='selected_payid' inline
                        class='mb-4')
                    VRadio(value='payid' label="PayID" class='mr-2')
                    VRadio(value='account' label="BSB/Account" class='mr-4')
                div.payid(v-if='payid_possible && selected_payid === "payid"'
                        class='d-flex justify-center')
                    VTextField(:value='selected_option.data.payid?.value' readonly active
                        variant='outlined' bg-color='#dff0ff' :label='selected_option.data.name')
                        template(v-if='selected_option.data.payid?.type === "abn"' #prepend-inner)
                            strong ABN
                div.transfer(v-else)
                    div Account name
                    input(:value='selected_option.data.name' readonly)
                    div Account number
                    input(:value='selected_option.data.account' readonly)
                    div {{ bank_code_label(selected_option.data.currency) }}
                    input(:value='selected_option.data.bank_code' readonly)
                    template(v-if='selected_option.data.swift')
                        div SWIFT
                        input(:value='selected_option.data.swift' readonly)
                    template(v-if='selected_option.data.other')
                        textarea(:value='selected_option.data.other' readonly rows='3')
                div(class='mt-6')
                    template(v-if='confirmed_transfer')
                        div Please use reference #[strong(class='text-secondary text-h5') {{ human_id }}] for your transfer.
                        div(class='font-italic opacity-60 mt-2') Thanks for your support!
                    template(v-else)
                        VBtn(@click='confirm_transfer' color='secondary' variant='elevated')
                            | Get reference code
                        div(class='mt-2 text-body-2 font-italic') for the transfer

            div(class='mt-16 text-left text-body-2')
                div(class='mb-4') #[strong Please note:] {{ disclaimer(fund.id) }}
                div {{ get_tax_notice(fund.steward.tax_deductible) }}

VCardActions.actions(class='pa-4')
    VBtn(v-if='step !== "intro"' @click='move(-1)' color='' variant='tonal' class='pr-4')
        template(#prepend)
            AppIcon(name='arrow_back')
        | {{ step === 'pay' ? "Modify" : "Prev" }}
    VSpacer
    VBtn(v-if='step !== "pay"' @click='move(1)' :disabled='next_disabled' color='secondary'
            variant='elevated' class='pl-4')
        | Next
        template(#append)
            AppIcon(name='arrow_forward')


</template>


<script lang='ts' setup>

import {inject, computed, ref, watch} from 'vue'

import {bank_code_label, currency_str, generate_token, random_letter, random_number, disclaimer,
    get_tax_notice} from '@/services/utils'
import {gen_stripe_url, save_pledge, type Pledge} from '@/services/backend'

import type {Fundraiser, PaymentOption} from '@/types'


const steps = ['intro', 'option', 'amount', 'contact', 'pay'] as const
/* UX philosophy: avoid unncessary steps unless they help the donor in their decision making

Custom/third-party options will probably ask all these questions again so skip all
    and also won't know what options (like recurring frequency) will be available to them
And 'contact' just needs contact details

But for Stripe and bank transfer:
    currency - only needed if affects what options are available
    option - only needed if multiple (but tell user means before continuing)
    recurring - ask to help donor realise recurring is most helpful
        Only support monthly as standard for commercial subscriptions and too frequent = more admin
    amount - Stripe requires, but also ask for transfers as helps user's decision making
    contact - grab in case issue with Stripe, as most people know they're committing before redirect

Moment of commitment
    The donor should feel 100% in control of their own commitment
        So don't submit anything until they confirm all their details
    Once committed, the fundraiser should be comfortable following them up
        Since missing payment is likely to be a mistake rather than confusion regarding the pledge
*/


// List top currencies to choose from (UI also allows entering custom if missing)
const top_currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CHF', 'CAD', 'AUD', 'SGD', 'HKD',
    'KRW', 'INR', 'BRL', 'MXN', 'ZAR', 'RUB', 'TRY', 'NZD', 'THB', 'MYR',
    'IDR', 'PHP', 'VND', 'SAR', 'AED', 'SEK', 'NOK', 'DKK', 'PLN', 'HUF',
    'CZK', 'ILS', 'TWD', 'ARS', 'CLP', 'COP', 'PEN', 'EGP', 'QAR', 'KWD',
    'OMR', 'BDT', 'PKR', 'LKR', 'RON', 'BGN', 'HRK', 'UYU', 'KZT', 'UAH',
].sort()


const props = defineProps<{activity:string|null}>()
defineEmits(['close'])

const fund = inject('fund') as Fundraiser

const step = ref<typeof steps[number]>('intro')
const pledge_id = generate_token()
const human_id = random_letter() + random_number(100, 999)  // Ensure always together 4 chars
const selected_currency = ref<string|null>(null)
const selected_option_id = ref<string|null>(null)
const selected_recurring = ref<'single'|'month'|null>(null)
const selected_payid = ref<'payid'|'account'>('payid')
const entered_amount = ref<null|number>(null)
const entered_amount_currency = ref(fund.payment.preferred_currency.toUpperCase())
const entered_name = ref('')
const entered_email = ref('')
const stripe_url = ref<string|null|false>(null)
const confirmed_transfer = ref(false)



// STEPS


// The title for the current step
const title = computed(() => {
    if (step.value === 'pay'){
        return {
            stripe: "Send donation",
            transfer: `You'll send ${commitment.value} to`,
            contact: `Please contact ${fund.steward.organiser_name}`,
            custom: '\u00A0',
        }[selected_type.value]
    }
    return {
        option: "Payment method",
        amount: "Amount",
        contact: "Your contact details",
    }[step.value as string] || '\u00A0'  // nbsp to prevent height jump
})


// Move back or forward a step (skipping some as needed)
const move = (increment:1|-1) => {

    // Go back or forward
    step.value = steps[steps.indexOf(step.value) + increment]!

    // Skip options if only one to choose from
    if (step.value === 'option' && options.value.length === 1){
        selected_option_id.value = options.value[0]!.data.id
        return move(increment)
    }

    // Skip amount step if not stripe or bank transfer, as third-party will arrange
    if (step.value === 'amount' && ['contact', 'custom'].includes(selected_type.value)){
        selected_recurring.value = null
        entered_amount.value = null
        return move(increment)
    }

    // Skip contact details if going to email fundraiser, or have custom URL
    // As it can be assumed that a custom URL would collect name/email anyway
    // NOTE Stripe is different as can pass the email address on so they don't have to repeat
    if (step.value === 'contact'
        && (selected_type.value === 'contact'
            || (selected_option.value.data.type === 'custom' && selected_option.value.data.url))){
        // NOTE Chance name/email already filled but no real validation for them anyway
        return move(increment)
    }

    // Trigger some tasks as soon as enter pay step
    if (step.value === 'pay'){
        do_pay_step_tasks()
    }
}


// Whether cannot progress from current step
const next_disabled = computed(() => {
    if (step.value === 'option'){
        return !displayed_options.value.find(o => o.data.id === selected_option_id.value)
    } else if (step.value === 'amount'){
        return !entered_amount.value || (fund.payment.allow_recurring && !selected_recurring.value)
    } else if (step.value === 'contact'){
        return !contact_details_valid.value
    }
    return false
})


// SELECT CURRENCY


// When selected currency/option changes, ensure the amount currency defaults to it
// WARN Need to reset for option change too in case previous option allowed international
watch([selected_currency, selected_option_id], () => {
    if (selected_currency.value && selected_currency.value !== 'other'){
        entered_amount_currency.value = selected_currency.value
    }
})


// Only allow a positive integer or otherwise set to null
const cleaned_amount = computed({
    get(){
        return entered_amount.value ? entered_amount.value.toString() : ''
    },
    set(value:string){
        const parsed = parseInt(value, 10) || 0
        entered_amount.value = Math.max(0, parsed) || null
    },
})


// Store currency in lowercase but present it in uppercase
const cleaned_amount_currency = computed({
    get(){
        return entered_amount_currency.value.toUpperCase()
    },
    set(value:string|null){  // WARN Vuetify gives null for empty string
        entered_amount_currency.value = value?.trim().toLowerCase() || ''
    },
})


// Human str version of entered amount/currency/frequency
const commitment = computed(() => {
    let str = currency_str(entered_amount.value ?? 0, entered_amount_currency.value)
    if (selected_recurring.value === "month"){
        str += '/month'
    }
    return str
})


const currencies = computed(() => {
    // List currencies that have options that are exclusive to that currency

    const detected = new Set<string>()
    for (const option of options.value){
        if ('currency' in option.data && option.data.currency){
            detected.add(option.data.currency)
        }
    }

    // If the preferred currency exists, ensure it comes first
    const preferred = fund.payment.preferred_currency
    let as_list = [...detected].sort()  // Sort to ensure list doesn't jump around in UI
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
    classes:string[]
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
            const recommended = selected_currency.value === option.currency
            items.push({
                data: option,
                icon: 'account_balance',
                title: `Bank transfer (${option.currency.toUpperCase()})`,
                desc: recommended
                    ? "No fees and you stay in control of donation amount and frequency."
                    : "Suitable for one-off large donations when transferring internationally.",
                international: !!option.swift,
                recommended,
                classes: [],
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
                classes: [],
            }))
        } else if (option.type === 'custom'){
            items.push(({
                data: option,
                icon: conform_icon(option.icon),
                title: option.title,
                desc: option.desc,
                international: option.international,
                recommended: false,
                classes: [],
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
            desc: `Ask the fundraiser if another option may be possible.`,
            international: true,
            recommended: false,
            classes: ['type-contact'],
        })
    }

    // Ensure recommended option comes first
    // @ts-ignore Boolean math does work
    items.sort((a, b) => b.recommended - a.recommended)

    // Add selected class
    for (const item of items){
        if (item.data.id === selected_option_id.value){
            item.classes.push('selected')
        }
    }

    return items
})


const displayed_options = computed(() => {
    let included_same_currency_transfer = false
    return options.value.filter(option => {

        // Track if included same currency transfer option, as will ignore others if so
        // NOTE This assumes it would have been sorted to front as recommended option already
        if (option.data.type === 'transfer' && selected_currency.value === option.data.currency){
            included_same_currency_transfer = true
            return true
        }

        // Exclude other currency transfers if non-international or already have same currency one
        if (option.data.type === 'transfer' && selected_currency.value !== option.data.currency
                && (included_same_currency_transfer || !option.international)){
            return false
        }

        // Exclude custom options if not same currency and not international
        // NOTE Unlike transfers, still show even if another custom one with same currency
        if (option.data.type === 'custom' && selected_currency.value !== option.data.currency
                && !option.international){
            return false
        }
        return true
    })
})


// The data for the selected option
const selected_option = computed(() => {
    /* WARN Defaults to first option to prevent errors when user goes to later steps but then
        backtracks, as that renders components that rely on an option being selected.
        If the user then deselects an option it would break existing components out-of-view.
        In other words, this will always return a valid value to prevent things breaking,
            so don't rely on it pre-options-step when an option is actually deselected.
    */
    return options.value.find(opt => opt.data.id === selected_option_id.value)
        || options.value[0]!
})


// Shortcut for getting the selected option's type
const selected_type = computed(() => {
    return selected_option.value.data.type
})


const pledge = computed(() => {
    return {
        id: pledge_id,
        human_id,
        fundraiser: fund.id,
        amount: entered_amount.value,
        currency: entered_amount_currency.value,
        recurring: selected_recurring.value,
        email: entered_email.value,
        name: entered_name.value.trim(),
        means: selected_option.value.title ?? "Unknown",
        appreciate: fund.content.activities.find(a => a.id === props.activity)?.title ?? null,
    } as Pledge
})


// Whether name is required or not
const name_required = computed(() => {
    return !fund.payment.allow_anonymous || selected_type.value === 'contact'
})


// Whether email is required or not
const email_required = computed(() => {
    // Stripe requires email anyway so may as well collect now so record even if Stripe fails
    return name_required.value || selected_type.value === 'stripe'
})


// What message should be displayed under the name/email fields
const contact_explanation = computed(() => {
    if (selected_type.value === 'contact'){
        return ''  // Won't be arranging payment yet so don't talk about receipts
    } else if (!email_required.value){
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
    return !name_required.value || !!entered_name.value
}


// Verify if email input is valid (doesn't need to take value to work)
const check_email = () => {
    if (!email_required.value && !entered_email.value){
        return true
    }
    return /^[^\s@]+@[^\s@]+$/.test(entered_email.value)
}


// Whether contact details entered are valid and can continue
const contact_details_valid = computed(() => {
    return check_name() && check_email()
})


// Actions to perform when arriving at the pay stage
const do_pay_step_tasks = () => {

    // Get Stripe URL if needed
    if (selected_type.value === 'stripe'){
        stripe_url.value = null
        gen_stripe_url(pledge.value).then(url => {
            stripe_url.value = url === null ? false : url
        }, () => {
            stripe_url.value = false
        })
    }

    // If previously confirmed transfer and have gone back to modify things, auto-save changes
    if (selected_type.value === 'transfer' && confirmed_transfer.value){
        void save_pledge(pledge.value)
    }
}


// Open link to Stripe
const open_stripe = () => {
    // Save pledge in case something goes wrong with Stripe
    // Can consider donor as committed at this stage since they have confirmed all the details
    void save_pledge(pledge.value)
    self.open(stripe_url.value as string, '_blank')
}


// Confirm the pledge to transfer and reveal ref code
const confirm_transfer = () => {
    confirmed_transfer.value = true
    void save_pledge(pledge.value)
}


// Email href with prefilled subject
const email_href = computed(() => {
    return `mailto:${fund.contact.email}?subject=${encodeURIComponent("Donate to " + fund.name)}`
})


// Whether it's possible to pay using payid
// NOTE Currently most banks don't support recurring payID payments (only Up apparently)
//      So don't even offer to avoid confusion, until at least one major bank does
const payid_possible = computed(() => {
    return selected_option.value.data.type === 'transfer' && selected_option.value.data.payid
        && selected_recurring.value === 'single'
})


</script>


<style lang='sass' scoped>

.v-card-title
    white-space: normal

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
        border-color: rgb(var(--v-theme-secondary)) !important
        border-style: solid

    &.type-contact
        border-color: #ccc
        :deep(.v-card__underlay)
            background-color: #fff

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
    :deep(.v-text-field)
        width: 100%
        max-width: 320px

        input
            text-align: center
            font-size: 18px
            font-family: Roboto Condensed, Roboto, sans-serif

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

    > textarea
            grid-column: span 2
            text-align: left !important
            background-color: #eee


// Animate display of new options
.options-move, .options-enter-active
    transition: all 0.5s ease  // Animate repositioning and entering opacity
.options-leave-active
    display: none  // Make old disappear immediately as mess up positioning of others
.options-enter-from
    opacity: 0  // Fade new ones in


.actions
    border-top: 1px solid #eee


</style>
