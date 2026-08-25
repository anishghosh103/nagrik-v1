export function formatMoney(value: number, language = 'en') { return new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value) }

export function formatDate(value: string, language = 'en') { return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) }
