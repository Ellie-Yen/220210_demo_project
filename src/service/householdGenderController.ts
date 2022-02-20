import { 
  useState, useEffect
 } from "react";

import {
  assortHouseholdGenderData,
  getHouseholdGenderRenderData
} from './housholdGenderProcessors';

import requestAndFetch from '../lib/requestAndFetch';
import { default as MSG } from '../datastore/app_message.json';
import { default as API_MAP } from '../datastore/household_gender/api_info.json';
import { default as CITY_LIST } from '../datastore/household_gender/request_city_list.json';
import { default as TW_YEAR_LIST } from '../datastore/household_gender/request_tw_yr_list.json';

const EMPTY_RENDER_DATA: HouseholdGenderRenderData = {
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
 * - fetch_state: HouseholdGenderOutPut,
 * - dist_list: Array<string>, dist names in current city.
 * - setDistIdx: React.Dispatch, function to select a dist.
 * - render_data: HouseholdGenderRenderData
 */
export default function householdGenderDataController(){
  
  // these are app default options
  const tw_year_list = TW_YEAR_LIST;
  const city_list = CITY_LIST;

  // these are selectable, but are fixed in current version.
  const city_idx = 0;
  const tw_year_idx = 0;

  // these are decided after above parameters are selected.
  const [fetch_state, setFetchState] = useState<HouseholdGenderOutPut>({
    is_success: false,
    reason: MSG.loading
  });
  const [dist_list, setDistList] = useState<Array<string>>([]);
  const [dist_idx, setDistIdx] = useState<number>(-1);

  // the final data for rendering result, 
  // update after select all parameters above
  const [render_data, setRenderData] = useState<HouseholdGenderRenderData>(EMPTY_RENDER_DATA);

  async function fetchAndUpdate(kwargs: FetchKwargs){
    const new_fetch_state = await fetchAssortedData(kwargs);
    setRenderData(EMPTY_RENDER_DATA);
    setDistIdx(-1);
    setFetchState(new_fetch_state);
    if (new_fetch_state.is_success === true){
      const city_name = new_fetch_state.result.name_list[city_idx];
      setDistList(new_fetch_state.result.data[city_name].name_list);
      return;
    }
    setDistList([]);
  }
  function updateRenderData(data_root: SuccessHouseholdGenderOutPut){
    const city_name = data_root.result.name_list[city_idx];
    const dist_name = data_root.result.data[city_name].name_list[dist_idx];
    const dist_record_list = data_root.result.data[city_name].data[dist_name];
    const new_render_data = getHouseholdGenderRenderData(dist_record_list);
    setRenderData(new_render_data);
  }

  // fetch data
  useEffect(()=> {
    fetchAndUpdate({
      tw_year: TW_YEAR_LIST[tw_year_idx],
      city_list: CITY_LIST
    });
  }, [tw_year_idx, CITY_LIST]);

  // update render data after dist is selected.
  useEffect(()=> {
    if (dist_idx === -1 || !fetch_state.is_success){
      return;
    }
    updateRenderData(fetch_state);
  }, [fetch_state, dist_idx]);
  
  return {
    fetch_state,
    dist_list,
    setDistIdx,
    render_data
  };
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