
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
                            color='surface-variant' variant='tonal'
                            :class='{selected: selected_option_id === option.data.id}')
                        VCardTitle
                            AppIcon(:name='option.icon')
                            | {{ option.title }}
                        VCardText
                            | {{ option.desc }}
                            div.recommend(v-if='option.recommended')
                                AppIcon(name='thumb_up')
                                | Recommended

        VWindowItem(value='recurring')
            VRadioGroup(v-model='selected_recurring' inline class='mb-4')
                VRadio(value='single' label="One-off")
                VRadio(value='month' label="Monthly")
            div.amount(v-if='selected_option.data.type === "stripe"'
                    class='d-flex align-center justify-center')
                VTextField(v-model='cleaned_amount' max-width='200' label="Amount" class='mr-3')
                VCombobox(v-model='cleaned_amount_currency' :items='top_currencies'
                    max-width='125' label="Currency" minlength='3' maxlength='3')
            p(class='mt-8').
                Donating monthly helps fundraisers to plan ahead and have
                a regular supply of income, though one-off gifts are also appreciated.

        VWindowItem(value='contact')
            VTextField(v-model='entered_name' :rules='[check_name]'
                :label='"Name" + (contact_required ? "" : " (optional)")')
            VTextField(v-model.trim='entered_email' :rules='[check_email]'
                :label='"Email address" + (contact_required ? "" : " (optional)")')
            div(class='mt-8') {{ contact_explanation }}

        VWindowItem(value='pay')
            template(v-if='selected_option.data.type === "transfer"')
                p Please send your donation to:
                div.payid(v-if='selected_option.data.payid')
                    div.addr
                        img(src='@/assets/payid.svg')
                        VTextField(:value='selected_option.data.payid.value'
                            :label='selected_option.data.payid.type' readonly
                            variant='outlined' active bg-color='#dff0ff')
                    div.or &mdash; OR &mdash;
                div.transfer
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
            div(v-else-if='selected_type === "stripe"')
                div(class='mb-8 text-body-2')
                    | Please finish by continuing to the secure card payment platform, Stripe.
                template(v-if='stripe_url === null')
                    div(class='mb-4 font-italic') Connecting to payment platform...
                    VProgressCircular(indeterminate color='secondary')
                VBtn(v-else-if='stripe_url' color='secondary' :href='stripe_url' target='_blank')
                    template(#prepend)
                        AppIcon(name='credit_card')
                    | Donate {{ currency_str(entered_amount ?? 0, entered_amount_currency) }}
                    template(v-if='selected_recurring === "month"') /month
            div(v-else-if='selected_type === "contact" && !need_email_fallback')
                | The fundraiser will contact you about alternate payment options.
            div(v-else-if='selected_option.data.type === "custom"')
                div(v-if='selected_option.data.instructions' class='mb-8')
                    | {{ selected_option.data.instructions }}
                VBtn(v-if='selected_option.data.url' :href='selected_option.data.url'
                        target='_blank' color='secondary' class='mb-2')
                    | Continue
            div(v-if='need_email_fallback')
                p.
                    Sorry, the message couldn't be sent for some reason.
                    Please email the fundraiser directly instead:
                div
                    a(:href='`mailto:${fund.contact.email}`' class='text-h6')
                        | {{ fund.contact.email }}
            div(class='mt-16 text-left text-body-2')
                div(class='mb-4') #[strong Please note:] {{ disclaimer }}
                div {{ get_tax_notice(fund.payment.tax_deductible) }}

VCardActions.actions(class='pa-4')
    VBtn(v-if='step !== "intro"' @click='move(-1)' color='' variant='tonal' class='pr-4')
        template(#prepend)
            AppIcon(name='arrow_back')
        | {{ step === 'pay' ? "Modify" : "Prev" }}
    VSpacer
    VBtn(v-if='step !== "pay"' @click='move(1)' :disabled='next_disabled' color='secondary'
            variant='elevated' class='pl-4')
        | {{ step === 'contact' ? "Confirm" : "Next" }}
        template(#append)
            AppIcon(name='arrow_forward')


</template>


<script lang='ts' setup>

import {inject, computed, ref, watch} from 'vue'

import {bank_code_label, currency_str, generate_token, disclaimer, get_tax_notice}
    from '@/services/utils'
import {get_stripe_url, save_pledge, type Pledge} from '@/services/backend'

import type {Fundraiser, PaymentOption} from '@/types'


const steps = ['intro', 'option', 'recurring', 'contact', 'pay'] as const
/* UX philosophy

Don't let anything interrupt the user from donating the way they want to
    Fundraisers can bypass whole system by providing own third-party URL if desired
    currency - only needed if affects what options are
    option - only needed if multiple (but tell user means before continuing)
    recurring - ask to help donor realise recurring is most helpful
        Only support monthly as standard for commercial subscriptions and too frequent = more admin
        (but don't ask for custom as too complex to know what options will be presented)
    amount - only need to ask for Stripe, otherwise let donor decide when paying
    contact - good to grab in case payment doesn't work or donor doesn't realise need for receipt
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
const selected_currency = ref<string|null>(null)
const selected_option_id = ref<string|null>(null)
const selected_recurring = ref<'single'|'month'|null>(null)
const entered_amount = ref<null|number>(null)
const entered_amount_currency = ref(fund.payment.preferred_currency.toUpperCase())
const entered_name = ref('')
const entered_email = ref('')
const save_status = ref<boolean|null>(null)
const stripe_url = ref<string|null|false>(null)



// STEPS


// The title for the current step
const title = computed(() => {
    return {
        option: "Payment method",
        recurring: "Donation frequency",
        contact: "Your contact details",
        pay: "Thanks for your support!",
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

    // Skip recurring step if (1) not allowed (2) just contacting, or (3) custom option
    if (step.value === 'recurring' &&
            (!fund.payment.allow_recurring || ['contact', 'custom'].includes(selected_type.value))){
        selected_recurring.value = fund.payment.allow_recurring ? null : 'single'
        entered_amount.value = null
        return move(increment)
    }

    // Skip contact details if have custom URL as can assume they'll be collected there
    // NOTE Stripe is different as can pass the email address on so they don't have to repeat
    if (step.value === 'contact' && selected_option.value.data.type === 'custom'
            && selected_option.value.data.url){
        // NOTE Chance name/email already filled but no real validation for them anyway
        return move(increment)
    }

    // Submit if moved to last step
    if (step.value === 'pay'){
        void submit()
    }
}


// Whether cannot progress from current step
const next_disabled = computed(() => {
    if (step.value === 'option'){
        return !displayed_options.value.find(o => o.data.id === selected_option_id.value)
    } else if (step.value === 'recurring'){
        return !selected_recurring.value
            || (selected_type.value === 'stripe' && !entered_amount.value)
    } else if (step.value === 'contact'){
        return !contact_details_valid.value
    }
    return false
})


// SELECT CURRENCY


// When selected currency changes, ensure the amount currency defaults to it
watch(selected_currency, () => {
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
        entered_amount_currency.value = value?.toLowerCase() || ''
    },
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
        fundraiser: fund.id,
        amount: entered_amount.value,
        currency: entered_amount_currency.value,
        recurring: selected_recurring.value,
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
    border-top: 1px solid #ddd


</style>
