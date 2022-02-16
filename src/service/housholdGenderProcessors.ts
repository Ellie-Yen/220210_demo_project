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
import { default as CONTENT } from '../datastore/household_gender/content.json';
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
export function assortHouseholdGenderData(kwargs: ProcessorKwargs): HouseholdGenderOutPut {
  try {
    // check record is not empty
    if (kwargs.raw_data.result?.records?.length < 2){
      return failed(`${MSG_MAP.parse_fail}-${ERROR_CODE.api_record_empty}`);
    }
    return success(assortRawData(kwargs));
  }
  catch (error){
    return exception(error);
  }
}

/**
 * translate into data for rendering components.
 * (so far we have that for bar chart only)
 * @param record_list : Array<HouseholdGenderRecordItem>, 
 * the smallest component of assorted raw data. 
 * @returns HouseholdGenderRenderData
 */
 export function getHouseholdGenderRenderData(record_list: Array<HouseholdGenderRecordItem>): HouseholdGenderRenderData{
  return {
    bar_chart: ToBarChartData(record_list)
  };
}


/**
 * assort api raw data by city and dist (using their code).
 * @param kwargs includes following keys:
 * - raw_data: HouseholdGenderAPIRes, a json.
 * - request_city_list: HouseholdGenderRequestCityList, a list contains 
 * info of each city we request.
 * @returns HouseholdGenderCityAssortData, a object contains
 * - name_list: city names (by request order).
 * - data: [name_list] of dists of the city 
 *   and [data] (map of record_item list of each dist).
 */
function assortRawData(kwargs: ProcessorKwargs): HouseholdGenderCityAssortData {
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
  const data: HouseholdGenderCityDataMap = {};
  let i = 0;
  city_list.forEach((city)=> {
    const city_name = city.name;
    data[city_name] = {
      name_list: [],
      data: {}
    };
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
      addRecordItemToDist({
        city_name,
        assorted_dist: data[city_name],
        record_item: records[i]
      });
      i++;
    }
  });
  return {
    name_list: request_city_list.map(city => city.name),
    data
  };
}

interface AddRecordToDistKwargs {
  city_name: string,
  assorted_dist: HouseholdGenderDistAssortData,
  record_item: HouseholdGenderRecordItem
}
/**
 * add single record item to assort_dist (a city's dist lists and map).
 * @param kwargs includes following keys:
 * - city_name: string, name of the city which the data belongs to.
 * - assort_dist: HouseholdGenderDistAssortData;
 * - record_item: HouseholdGenderRecordItem
 */
function addRecordItemToDist(kwargs: AddRecordToDistKwargs){
  const {assorted_dist, record_item, city_name} = kwargs;
  const dist_name = getDistName(city_name, record_item.site_id);
  if (! assorted_dist.data[dist_name]){
    assorted_dist.data[dist_name] = [];
    assorted_dist.name_list.push(dist_name);
  }
  assorted_dist.data[dist_name].push(record_item);
}

/**
 * @param city_name : string, name of the city which this site belongs to. 
 * @param site_id : string, name of a district, generally city_name + district_name
 * @returns a short name represents the district
 */
function getDistName(city_name: string, site_id: string){
  return site_id.replace(city_name, '');
}

type Label = keyof typeof CONTENT.label_to_key;
type RecordKey = keyof HouseholdGenderRecordItem;

function ToBarChartData(record_list: Array<HouseholdGenderRecordItem>): BarChartInfo {
  const group_label_list = CONTENT.charts.bar.group_label_list;
  const subgroup_label_list = CONTENT.charts.bar.subgroup_label_list;

  // init by 0
  const data: ChartData = group_label_list.map(k1 => (
    subgroup_label_list.map(k2 => 0)
  ));
  record_list.forEach((record_item)=> {
    group_label_list.forEach((group_label, i) => {
      subgroup_label_list.forEach((subgroup_label, j) => {
        data[i][j] += +record_item[(
            CONTENT.label_to_key[group_label as Label] +
            CONTENT.label_to_key[subgroup_label as Label]
            ) as RecordKey];
      });
    });
  });

  return {
    color_list: ['rgba(0,0,150,1)', 'rgba(150,0,0,1)'],
    group_label_list, subgroup_label_list, data
  };
}


