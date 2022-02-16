import { 
  useState, useEffect
 } from "react";

import {
  assortHouseholdGenderData,
  getHouseholdGenderRenderData
} from './housholdGenderProcessors';

import requestAndFetch from '../lib/requestAndFetch';
import { default as API_MAP } from '../datastore/household_gender/api_info.json';
import { default as CITY_LIST } from '../datastore/household_gender/request_city_list.json';
import { default as TW_YEAR_LIST } from '../datastore/household_gender/request_tw_yr_list.json';

const EMPTY_RENDER_DATA: HouseholdGenderRenderData = {
  bar_chart: {
    group_label_list: [],
    subgroup_label_list: [],
    data: [[]],
    color_list: []
  }
};
 
export default function householdGenderDataController(){
  
  // these are app default options
  const tw_year_list = TW_YEAR_LIST;
  const city_list = CITY_LIST;

  // these are selectable, but are fixed in current version.
  const city_idx = 0;
  const tw_year_idx = 0;

  // these are decided after above parameters are selected.
  const [data, setData] = useState<HouseholdGenderOutPut>({
    is_success: false,
    reason: 'not init'
  });
  const [dist_list, setDistList] = useState<Array<string>>([]);
  const [dist_idx, setDistIdx] = useState<number>(-1);

  // the final data for rendering result, 
  // update after select all parameters above
  const [render_data, setRenderData] = useState<HouseholdGenderRenderData>(EMPTY_RENDER_DATA);

  async function updateData(kwargs: FetchKwargs){
    const new_data = await fetchAssortedData(kwargs);
    if (new_data.is_success === true){
      setRenderData(EMPTY_RENDER_DATA);
      const city_name = new_data.result.name_list[city_idx];
      setDistList(new_data.result.data[city_name].name_list);
      setDistIdx(-1);
      setData(new_data);
      return;
    }
    setRenderData(getFailedRenderData(new_data.reason));
  }

  function updateRenderData(data_root: SuccessHouseholdGenderOutPut){
    const city_name = data_root.result.name_list[city_idx];
    const dist_name = data_root.result.data[city_name].name_list[dist_idx];
    const dist_record_list = data_root.result.data[city_name].data[dist_name];
    const new_render_data = getHouseholdGenderRenderData(dist_record_list);
    setRenderData(new_render_data);
  }

  useEffect(()=> {
    updateData({
      tw_year: TW_YEAR_LIST[tw_year_idx],
      city_list: CITY_LIST
    });
  }, [tw_year_idx, CITY_LIST]);

  useEffect(()=> {
    if (dist_idx === -1 || !data.is_success){
      return;
    }
    updateRenderData(data);
  }, [data, dist_idx]);
  
  return {
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

function getFailedRenderData(failed_reason: string): HouseholdGenderRenderData{
  return ({
    bar_chart: {
      group_label_list: [failed_reason],
      subgroup_label_list: [],
      data: [[]],
      color_list: []
    }
  });
}