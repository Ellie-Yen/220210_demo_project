import { 
  useState, useEffect
 } from "react";

import {
  assortHouseholdGenderData,
  getHouseholdGenderChartData
} from './housholdGenderProcessors';

import requestAndFetch from '../lib/requestAndFetch';
import { default as MSG } from '../datastore/message.json';
import { default as API_MAP } from '../datastore/household_gender/api_info.json';
import { default as CITY_LIST } from '../datastore/household_gender/request_city_list.json';
import { default as TW_YEAR_LIST } from '../datastore/household_gender/request_tw_yr_list.json';

const EMPTY_CHART_DATA: HouseholdGenderChartData = {
  bar_chart: {
    group_label_list: [],
    subgroup_label_list: [],
    data: [[]],
    color_list: [],
    unit: ""
  }
};

/**
 * helps fetch and update data for rendering. 
 * @returns an object contains following keys:
 * - state: HouseholdGenderOutPut,
 * - select: MySelectKwargs for select dist
 * - display: info/ data for rendering.
 */
export default function householdGenderDataController(): HouseholdGenderRenderData{
  // these are selectable, but are fixed in current version.
  const city_idx = 0;
  const tw_year_idx = 0;

  const tw_year = TW_YEAR_LIST[tw_year_idx];
  const city_info = CITY_LIST[city_idx];

  const default_display: HouseholdGenderDisplay = {
    tw_year,
    city_info,
    dist_name: '',
    chart: EMPTY_CHART_DATA
  }

  // these are decided after above parameters are selected.
  const [fetch_state, setFetchState] = useState<HouseholdGenderOutPut>({
    is_success: false,
    reason: MSG.loading
  });

  // the final data for rendering result, 
  // update after select all parameters above
  const [display, setDisplay] = useState<HouseholdGenderDisplay>(default_display);
  async function fetchAndUpdate(kwargs: FetchKwargs){
    const new_fetch_state = await fetchAssortedData(kwargs);
    setDisplay(default_display);
    setFetchState(new_fetch_state);
  }
  function selectDist(idx: number){
    const dist_name =  (fetch_state as SuccessHouseholdGenderOutPut
      ).result.data[city_info.name].name_list[idx];
    const dist_record_list = (fetch_state as SuccessHouseholdGenderOutPut
      ).result.data[city_info.name].data[dist_name];
    const new_chart_data = getHouseholdGenderChartData(dist_record_list);
    setDisplay(Object.assign({}, default_display, {
      chart: new_chart_data,
      dist_name
    }));
  }

  // fetch data
  useEffect(()=> {
    fetchAndUpdate({
      tw_year: TW_YEAR_LIST[tw_year_idx],
      city_list: CITY_LIST
    });
  }, [tw_year, CITY_LIST]);
  
  return ({
    state: fetch_state,
    select: {
      dist: {
        list: fetch_state.is_success === true 
        ? fetch_state.result.data[city_info.name].name_list
        : [],
        selectFunc: selectDist
      }
    },
    display
  });
}

type APIYearKey = keyof typeof API_MAP.tw_year_url;
interface FetchKwargs {
  tw_year: string,
  city_list: HouseholdGenderRequestCityList
}
async function fetchAssortedData(kwargs: FetchKwargs): Promise<HouseholdGenderOutPut>{
  const url = API_MAP.tw_year_url[kwargs.tw_year as APIYearKey];
  const fetch_result = await requestAndFetch(url);
  if (! fetch_result.is_success){
    return fetch_result;
  }
  const raw_data = fetch_result.result;
  return assortHouseholdGenderData({
    raw_data,
    request_city_list: kwargs.city_list
  });
}