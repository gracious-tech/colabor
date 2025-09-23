
import {z} from 'zod'


export const gen_stripe_url_schema = z.object({
    fundraiser: z.string(),
    ref_code: z.string(),
    email: z.string(),  // Not validating as should allow empty string
    recurring: z.enum(['month', 'single']),
    currency: z.string().toLowerCase(),
    dollars: z.int().gte(1),  // Stripe payment must be at least $1 or currency equiv
})
