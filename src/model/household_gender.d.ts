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

// data that can used for rendering directly
interface HouseholdGenderBarChartData {
  household_single: {
    f: number,
    m: number
  },
  household_ordinary: {
    f: number,
    m: number
  }
}
interface HouseholdGenderRenderData {
  bar_chart: HouseholdGenderBarChartData
}
interface HouseholdGenderDistData {
  name: string,
  data: HouseholdGenderRenderData
}
interface HouseholdGenderCityData {
  name: string,
  dist_list: Array<HouseholdGenderDistData>
}
type HouseholdGenderData = Array<HouseholdGenderCityData>;

interface SuccessHouseholdGenderOutPut extends SuccessOutput {
  result: HouseholdGenderData
}

type HouseholdGenderOutPut = SuccessHouseholdGenderOutPut | FailedOutput;

interface HouseholdGenderRequestCityInfo {
  name: string,
  code: string,
  logo: string
}

type HouseholdGenderRequestCityList = Array<HouseholdGenderRequestCityInfo>