
import {z} from 'zod'


export const gen_stripe_url_schema = z.object({
    fundraiser: z.string(),
    ref_code: z.string(),
    email: z.string(),  // Not validating as should allow empty string
    recurring: z.enum(['month', 'single']),
    currency: z.string().toLowerCase(),
    cents: z.int().gte(1),
})
export type GenStripeUrlInput = z.infer<typeof gen_stripe_url_schema>
