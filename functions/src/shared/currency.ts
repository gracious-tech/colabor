// Handling of storage and display of currency values
// "dollars" refers to main denomination of currency, and "cents" refers to lowest denomination


// Relying on Stripe for decimal place data for currencies
// See https://docs.stripe.com/currencies#zero-decimal
// NOTE Stripe lists UGX as zero-decimal but then says it's still 2dec for compatibility
const zero_decimal = ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf',
    'vnd', 'vuv', 'xaf', 'xof', 'xpf']
// See https://support.stripe.com/questions/which-payments-methods-and-products-are-available-in-the-uae
const three_decimal = ['bhd', 'jod', 'kwd', 'omr', 'tnd']


// Convert main denomination to lowest denomination for internal use
// NOTE dollars must be an integer (use cents arg if any)
export function dollars_to_cents(dollars:number, currency:string, cents=0):number{
    const currency_lower = currency.toLowerCase()
    if (zero_decimal.includes(currency_lower))
        return dollars
    if (three_decimal.includes(currency_lower))
        return dollars * 1000 + cents
    return dollars * 100 + cents
}


// Convert lowest denomination to main denomination
// NOTE Since fractions can't be accurately preserved, always returns an integer
export function cents_to_dollars(cents:number, currency:string,
        rounding:'round'|'ceil'|'floor'='round'):number{
    const currency_lower = currency.toLowerCase()

    // Just return if no difference
    if (zero_decimal.includes(currency_lower))
        return cents

    // Adjust number
    const divisor = three_decimal.includes(currency_lower) ? 1000 : 100
    const fn = rounding === 'ceil' ? Math.ceil :
        (rounding === 'floor' ? Math.floor : Math.round)
    return fn(cents / divisor)
}


// Take user input and return integer in lowest denomination of currency
export function display_to_cents(amount:string, currency:string):number{

    // Remove all characters except digits and period
    const normalized = amount.replace(/[^\d.]/g, '')

    // Invalid values will be 0
    if (!/^(\d+)(\.\d+)?$/.test(normalized))
        return 0

    // Split as string so don't lose precision
    const [whole, fraction = ''] = normalized.split('.') as [string, string|undefined]

    // Return zero-decimal currency as is
    const currency_lower = currency.toLowerCase()
    if (zero_decimal.includes(currency_lower))
        return parseInt(whole)

    // Convert three-decimal
    if (three_decimal.includes(currency_lower)){
        // Pad so e.g. $0.5 -> 500 and not 5
        // Slice so e.g. $0.12345 -> 123 and not 12345
        const frac = fraction.padEnd(3, '0').slice(0, 3)
        return parseInt(whole) * 1000 + parseInt(frac)
    }

    // Everything else is two-decimal
    const frac = fraction.padEnd(2, '0').slice(0, 2)
    return parseInt(whole) * 100 + parseInt(frac)
}


// Display integer-based amount with expected decimal places for given currency
export function cents_to_display(cents:number, currency:string, parseable=false, fractional=true):string{

    // Determine decimal places used when converting to integer
    let decimal_places = 2
    const currency_lower = currency.toLowerCase()
    if (zero_decimal.includes(currency_lower))
        decimal_places = 0
    else if (three_decimal.includes(currency_lower))
        decimal_places = 3

    // Convert to main denomination
    const dollars = cents / Math.pow(10, decimal_places)

    // If want parseable (i.e. user-input format), don't add anything but digits and period
    if (parseable)
        return dollars.toFixed(decimal_places)

    // Display with expected symbol
    try {
        return dollars.toLocaleString('en-US', {
            style: 'currency',
            currencyDisplay: 'narrowSymbol',
            currency: currency,
            minimumFractionDigits: fractional ? decimal_places : 0,
            maximumFractionDigits: fractional ? decimal_places : 0,
        }) + ' ' + currency.toUpperCase()
    } catch {
        // WARN Old webkit will throw when given 'currencyDisplay' arg
        return dollars.toLocaleString('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: fractional ? decimal_places : 0,
            maximumFractionDigits: fractional ? decimal_places : 0,
        }) + ' ' + currency.toUpperCase()
    }
}
