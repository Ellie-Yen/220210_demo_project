/**
 * A set of functions that turns raw data (from API)
 * to data that used for rendering
 */
import {
  exception,
  failed,
  success
} from '../lib/outputConstructors';
import { default as MSG_MAP } from '../datastore/app_message.json';
import { default as ERROR_CODE } from '../datastore/household_gender/error_code.json';

interface ProcessorKwargs {
  raw_data: HouseholdGenderAPIRes,
  request_city_list: HouseholdGenderRequestCityList
}
/**
 * assort api raw data by city_code.
 * @param kwargs includes following keys:
 * - raw_data: HouseholdGenderAPIRes, a json.
 * - request_city_list: HouseholdGenderRequestCityList, a list contains 
 * info of each city we request, cannot be empty.
 * @returns HouseholdGenderOutPut, 
 * an object contains data for rendering (whether the process is success).
 */
export default function householdGenderDataProcessor(kwargs: ProcessorKwargs): HouseholdGenderOutPut {
  try {
    // check record is not empty
    if (kwargs.raw_data.result?.records?.length < 2){
      return failed(`${MSG_MAP.parse_fail}-${ERROR_CODE.api_record_empty}`);
    }

    // remove the first item represents fields
    // since we don't need it for data processing/ rendering.
    kwargs.raw_data.result.records.shift();

    // assort data by city.
    const raw_data_by_city = assortByCityCode(kwargs);
    
    // for each city, assort its data by dist
    // (which is the min unit we need)
    // while check every city has data.
    // then turn it into format for rendering
    const {request_city_list} = kwargs;
    const res: HouseholdGenderData = [];
    for (let city of request_city_list){
      if (!raw_data_by_city[city.code]){
        return failed(
          `${MSG_MAP.parse_fail}-${ERROR_CODE.api_not_includes_city} ${city.code}`
        );
      }
      const raw_data_by_dist = assortByDist({
        city_name: city.name, 
        record_list: raw_data_by_city[city.code]
      });

      const render_data_by_dist = Object.entries(raw_data_by_dist).map((key_val_pair)=> ({
        name: key_val_pair[0],
        data: toRenderData(key_val_pair[1])
      }));

      res.push({
        name: city.name,
        dist_list: render_data_by_dist
      });
    }
    return success(res);
  }
  catch (error){
    return exception(error);
  }
}


type RawDataByCityCode = {
  [city_code: string]: Array<HouseholdGenderRecordItem>
};
/**
 * assort api raw data by city_code.
 * @param kwargs includes following keys:
 * - raw_data: HouseholdGenderAPIRes, a json.
 * - request_city_list: HouseholdGenderRequestCityList, a list contains 
 * info of each city we request.
 * @returns RawDataByCityCode, an object contains a list of raw data for each city.
 */
function assortByCityCode(kwargs: ProcessorKwargs): RawDataByCityCode{
  const {raw_data, request_city_list} = kwargs;

  // ascending sort records by district_code
  // and cities by city code
  const records = raw_data.result.records.sort(
    (a, b)=> (+a.district_code) - (+b.district_code)
  );
  const city_list = request_city_list.sort(
    (a, b)=> (+a.code) - (+b.code)
  );
  
  // since both are sorted
  // we add current item if its district is belonging to current city
  // otherwise we keep iterating until we reach such item.
  const res: RawDataByCityCode = {};
  let i = 0;
  city_list.forEach((city)=> {
    res[city.code] = [];
    while (
      i < records.length &&
      !records[i].district_code.startsWith(city.code)
    ){
      i++;
    }
    while (
      i < records.length &&
      records[i].district_code.startsWith(city.code)
    ){
      res[city.code].push(records[i]);
      i++;
    }
  });
  return res;
}

interface AssortBySiteIDKwargs {
  record_list: Array<HouseholdGenderRecordItem>,
  city_name: string
}
type RawDataByDist = {
  [dist_name: string]: Array<HouseholdGenderRecordItem>
};
/**
 * assort city raw data by dist.
 * @param kwargs includes following keys:
 * - city_name: string, name of the city which the data belongs to.
 * - record_list: Array<HouseholdGenderRecordItem>
 * @returns RawDataByDist, an object contains record_list for each dist.
 */
function assortByDist(kwargs: AssortBySiteIDKwargs): RawDataByDist{
  const { city_name, record_list } = kwargs;
  const res: RawDataByDist = {};
  record_list.forEach((record_item) => {
    const dist_name = siteIDToDist(city_name, record_item.site_id);
    if (! res[dist_name]){
      res[dist_name] = [];
    }
    res[dist_name].push(record_item);
  })
  return res;
}

/**
 * @param city_name : string, name of the city which this site belongs to. 
 * @param site_id : string, name of a district, generally city_name + district
 * @returns a short name represents the district
 */
function siteIDToDist(city_name: string, site_id: string){
  return site_id.replace(city_name, '');
}

/**
 * translate into data for rendering components.
 * (so far we have that for bar chart only)
 * @param record_list : Array<HouseholdGenderRecordItem>, 
 * the smallest component of assorted raw data. 
 * @returns HouseholdGenderRenderData
 */
function toRenderData(record_list: Array<HouseholdGenderRecordItem>): HouseholdGenderRenderData{
  return {
    bar_chart: ToBarChartData(record_list)
  };
}
function ToBarChartData(record_list: Array<HouseholdGenderRecordItem>): HouseholdGenderBarChartData{
  const res = {
    household_single: {
      f: 0,
      m: 0
    },
    household_ordinary: {
      f: 0,
      m: 0
    }
  };
  record_list.forEach((record_item)=> {
    res.household_single.f += +record_item.household_single_f;
    res.household_single.m += +record_item.household_single_m;
    res.household_ordinary.f += +record_item.household_ordinary_f;
    res.household_ordinary.m += +record_item.household_ordinary_m;
  })
  return res;
}



