
export interface Fundraiser {
    id:string  // Set at runtime
    url:string  // Set at runtime
    name:string
    subheading:string
    intro:string
    activities:FundraiserActivity[]
    subscribe:SubscribeButton[]
    resources:Resource[]
    quotes:Quote[]
    milestones:FundraiserMilestone[]
    style:{
        show_profile:boolean
    }
    payment:{
        third_party:string  // If set to a URL, Colabor's system will be skipped entirely
        options:PaymentOption[]
        preferred_currency:string  // Required, as used for default for currency selection field
        allow_recurring:boolean  // May want to only raise money for short time, so no recurring
        allow_anonymous:boolean  // Some countries may forbid
        allow_other:boolean  // Whether to show other/"contact us" option
        manage_recurring:string  // E.g. Stripe URL
        tax_deductible:string  // Should be a country code/name
    }
    steward:{
        organiser_type:'individual'|'organisation'
        organiser_name:string
        towards:'income'|'cause'|'mixed'
        goal:number
        goal_period:'year'|'month'|null
        goal_currency:string
        goal_explain:string
        plus_super:boolean
        progress_current:number
        progress_total:number
        progress_type:'%'|'days'|'money'
        ends:string|boolean  // Date to auto-end, true if ends when goal reached, false for ongoing
    }
    contact:{
        email:string  // Required
    }
}


export interface FundraiserPrivate {
    stripe_key:string
}


export interface FundraiserActivity {
    id:string
    title:string
    desc:string
}

export interface SubscribeButton {
    label:string
    icon:'email'|'facebook'|null
    url:string
}

export interface Resource {
    id:string
    title:string
    desc:string
    url:string
}

export interface Quote {
    id:string
    text:string
    author:string
    context:string
}

export interface FundraiserMilestone {
    id:string
    date:string  // Empty string becomes "upcoming", but not if comes after one with
    title:string
    url:string
}


export interface PaymentOptionTransfer {
    id:string
    type:'transfer'
    currency:string
    name:string
    account:string
    bank_code:string
    swift:string
    payid:null|{type:'email'|'phone'|'abn', value:string}
    other:string  // Suggested text: "Please put your name as the reference"
}

export interface PaymentOptionStripe {
    id:string
    type:'stripe'
}

// NOTE Stick any options like PayPal in as "custom" items as the UX will still be the same as for
//      an unknown third-party service, and can build a nice admin UI for choosing PayPal instead
export interface PaymentOptionCustom {
    id:string
    type:'custom'
    currency:string|null
    international:boolean
    icon:string
    title:string
    desc:string
    instructions:string
    // NOTE Rather than mess around with multiple URLs and determining recurrance etc.
    //      Just skip recurr/amount steps
    url:string
}

export type PaymentOption = PaymentOptionTransfer|PaymentOptionStripe|PaymentOptionCustom
