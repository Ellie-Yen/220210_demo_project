import householdGenderDataProcessor from './housholdGenderProcessors';
import requestAndFetch from '../lib/requestAndFetch';
import { default as API_MAP } from '../datastore/household_gender/api_info.json';

interface householdGenderDataFetcherKwargs {
  tw_yr: string,
  city_list: HouseholdGenderRequestCityList
}
export default async function householdGenderDataFetcher(kwargs: householdGenderDataFetcherKwargs): Promise<HouseholdGenderOutPut>{
  const url = API_MAP.tw_year_url[kwargs.tw_yr as keyof typeof API_MAP.tw_year_url];
  const fetch_result = await requestAndFetch(url);
  if (! fetch_result.is_success){
    return fetch_result;
  }
  
  const raw_data = fetch_result.result;
  return householdGenderDataProcessor({
    raw_data,
    request_city_list: kwargs.city_list
  });
}