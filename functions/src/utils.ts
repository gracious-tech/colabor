
export function currency_str(number:number, currency:string){
    // WARN Old webkit will throw when given 'narrowSymbol' arg
    try {
        return number.toLocaleString(undefined, {
            style: 'currency',
            currencyDisplay: 'narrowSymbol',
            currency: currency,
            minimumFractionDigits: 0,
        }) + ' ' + currency.toUpperCase()
    } catch {
        return `${number} ${currency.toUpperCase()}`
    }
}


// Get string for date that is clear, with month as a short string
export function clear_date(date:Date|number){
    const verified_date = typeof date === 'number' ? new Date(date) : date
    return verified_date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}


// Takes a string of YYYY-MM-DD and outputs human text without changing value (ignoring time zones)
export function format_date_string(date:string){
    const date_obj = new Date(date.slice(0, 10) + 'T00:00:00Z')
    return date_obj.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    })
}
