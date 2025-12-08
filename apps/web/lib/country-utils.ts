import * as city from 'countries-and-timezones'

export function getCountryFromTimezone(timezone?: string) { 
  if (!timezone) return null
  
  const timezoneInfo = city.getTimezone(timezone)
  if (!timezoneInfo?.countries?.length) return null
  
  const countryCode = timezoneInfo.countries[0]
  const country = city.getCountry(countryCode as string)

  return { 
    code: countryCode,
    name: country?.name || countryCode,
  }
}

export function getCountryFlagUrl(countryCode: string) {
	return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
}