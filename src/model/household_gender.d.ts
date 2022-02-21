// models related to household_gender(戶數、人口數按戶別及性別)

// origin api response
interface HouseholdGenderAPIRes {
  success:true,
  result: {
    resource_id: string,
    limit: number,
    total: number,
    fields:[
      {
        type:"text",
        id:"statistic_yyy"
      },
      {
        type: "text",
        id:"district_code"
      },
      {
        type:"text",
        id:"site_id"
      },
      {
        type:"text",
        id:"village"
      },
      {
        type:"text",
        id:"household_ordinary_total"
      },
      {
        type:"text",
        id:"household_business_total"
      },
      {
        type:"text",
        id:"household_single_total"
      },
      {
        type:"text",
        id:"household_ordinary_m"
      },
      {
        type:"text",
        id:"household_business_m"
      },
      {
        type:"text",
        id:"household_single_m"
      },
      {
        type:"text",
        id:"household_ordinary_f"
      },
      {
        type:"text",
        id:"household_business_f"
      },
      {
        type:"text",
        id:"household_single_f"
      }
    ],
    records: Array<HouseholdGenderRecordItem>
  }
}
interface HouseholdGenderRecordItem {
  statistic_yyy: string,
  district_code:string,
  site_id:string,
  village:string,
  household_ordinary_total:string,
  household_business_total:string,
  household_single_total:string,
  household_ordinary_m:string,
  household_business_m:string,
  household_single_m:string,
  household_ordinary_f:string,
  household_business_f:string,
  household_single_f:string
}

// raw output of data
// (just identify whether fetch is success, 
// data might needs to be further processed for last rendering)
interface SuccessHouseholdGenderAPIOutput extends SuccessOutput {
  result: HouseholdGenderAPIRes
}
type HouseholdGenderAPIOutput = SuccessHouseholdGenderAPIOutput | FailedOutput;

// data after assorted
type HouseholdGenderAssortDataKey = string;
interface HouseholdGenderDistDataMap {
  [name: HouseholdGenderAssortDataKey]: Array<HouseholdGenderRecordItem>
}
interface HouseholdGenderDistAssortData {
  name_list: Array<HouseholdGenderAssortDataKey>,
  data: HouseholdGenderDistDataMap
}
interface HouseholdGenderCityDataMap {
  [name: HouseholdGenderAssortDataKey]: HouseholdGenderDistAssortData
}
interface HouseholdGenderCityAssortData {
  name_list: Array<HouseholdGenderAssortDataKey>,
  data: HouseholdGenderCityDataMap
}
interface SuccessHouseholdGenderOutPut extends SuccessOutput {
  result: HouseholdGenderCityAssortData
}
type HouseholdGenderOutPut = SuccessHouseholdGenderOutPut | FailedOutput;

interface HouseholdGenderRequestCityInfo {
  name: string,
  code: string,
  logo: string
}

type HouseholdGenderRequestCityList = Array<HouseholdGenderRequestCityInfo>;

// data that can used for rendering charts
interface HouseholdGenderChartData {
  bar_chart: ChartInfo
}

// data for rendering all sections
interface HouseholdGenderDisplay {
  tw_year: string,
  city_info: HouseholdGenderRequestCityInfo,
  dist_name: string,
  chart: HouseholdGenderChartData
}
interface HouseholdGenderRenderData {
  state: HouseholdGenderOutPut,
  select: {
    dist: MySelectKwargs
  },
  display: HouseholdGenderDisplay
}


