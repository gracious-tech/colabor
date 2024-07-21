
export interface Fundraiser {
    title:string
    subtitle:string
    currency:string
    intro:string
    activities:FundraiserActivity[]
    milestones:FundraiserMilestone[]
    steward:{
        organiser_type:'individual'|'organisation'
        organiser_name:string
        towards:'income'|'cause'|'mixed'
        max_personal_income:number
        max_personal_assets:number
        goal:number
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


export interface FundraiserMilestone {
    id:string
    date:string
    title:string
    desc:string
    url:string
}
