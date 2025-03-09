
export interface Fundraiser {
    name:string
    subheading:string
    intro:string
    activities:FundraiserActivity[]
    subscribe:SubscribeButton[]
    quotes:Quote[]
    milestones:FundraiserMilestone[]
    style:{
        show_profile:boolean
    }
    payment:{
        options:PaymentOption[]
        preferred_currency:string  // Required, as used for default for currency selection field
    }
    steward:{
        organiser_type:'individual'|'organisation'
        organiser_name:string
        towards:'income'|'cause'|'mixed'
        max_personal_income:number
        max_personal_assets:number
        goal:number
        goal_period:'year'|'month'|null
        goal_currency:string
        plus_super:boolean
        progress_current:number
        progress_total:number
        progress_type:'%'|'days'|'money'
        ends:string|boolean  // Date to auto-end, true if ends when goal reached, false for ongoing
    }
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

export interface Quote {
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
    account:string
    bank_code:string
    swift:string
    payid:null|{type:'email'|'phone'|'abn', value:string}
    other:string
}

export interface PaymentOptionCard {
    id:string
    type:'card'
    urls:PaymentURL[]  // Auto-detect and display icon/security msg from URL domain
}

export interface PaymentOptionCustom {
    id:string
    type:'custom'
    currency:string|null
    international:boolean
    icon:string  // Either single char or code that matches a builtin icon
    title:string
    desc:string
    instructions:string
    urls:PaymentURL[]  // Requires currency to be set
}

export interface PaymentURL {
    url:string
    amount:string  // Empty if payment service will allow setting own amount
    // NOTE Not adding other frequencies as these links need manual creation, would be over the top
    frequency:'single'|'monthly'|null  // Null if payment service will allow setting frequency
}

export type PaymentOption = PaymentOptionTransfer|PaymentOptionCard|PaymentOptionCustom
