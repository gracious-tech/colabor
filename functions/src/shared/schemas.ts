
import {z} from 'zod'


export type WithId<T> = T & {id:string}


export const fundraiser_schema = z.object({
    owners: z.array(z.string()),
    title: z.string(),
    receipt_thanks: z.string(),
    contact: z.object({
        email: z.email(),
    }),
})
export type Fundraiser = z.infer<typeof fundraiser_schema>
export type FundraiserWithId = WithId<Fundraiser>


export const pledge_schema = z.object({
    ref_code: z.string(),
    currency: z.string(),
    cents: z.number().nullable(),  // Null if third-party platform handling payment
    recurring: z.enum(['single', 'month']),
    means: z.string(),
    name: z.string(),
    email: z.string(),  // Not validating as should allow empty string
    appreciate: z.string().nullable(),
    note: z.string(),  // TODO Implement in UI
    // Any public user input is overridden for following:
    timestamp: z.number(),
    contact: z.string(), // Cannot be set by supporters / manually set if contact created from this
    ip: z.string(),
    status: z.enum(['pending', 'finished', 'unpaid']),
})
export type Pledge = z.infer<typeof pledge_schema>
export type PledgeWithId = WithId<Pledge>


export const contact_schema = z.object({
    name: z.string(),
    name_hello: z.string(),
    email: z.string(),  // Not validating as should allow empty string
})
export type Contact = z.infer<typeof contact_schema>
export type ContactWithId = WithId<Contact>


export const payment_schema = z.object({
    contact: z.string(),
    date: z.iso.date(),
    cents: z.number(),
    currency: z.string(),
    ref_code: z.string(),
    means: z.string(),
    receipt_sent: z.boolean(),
})
export type Payment = z.infer<typeof payment_schema>
export type PaymentWithId = WithId<Payment>


export const statement_schema = z.object({
    title: z.string(),
    start: z.iso.date(),
    end: z.iso.date(),
    message: z.string(),
})
export type Statement = z.infer<typeof statement_schema>
export type StatementWithId = WithId<Statement>


export const statement_contact = z.object({
    contact: z.string(),
    cents: z.number(),
    currency: z.string(),
    ref_codes: z.array(z.string()),
    record_sent: z.boolean(),
})
export type StatementContact = z.infer<typeof statement_contact>
export type StatementContactWithId = WithId<StatementContact>
