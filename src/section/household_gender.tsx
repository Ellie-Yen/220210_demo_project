import { useState, useEffect } from "react";
import householdGenderDataFetcher from '../service/householdGenderDataFetcher';
import { default as CITY_LIST } from '../datastore/household_gender/request_city_list.json';
import { default as TW_YEAR_LIST } from '../datastore/household_gender/request_tw_yr_list.json';

export default function HouseholdGenderSection(){
  const [init, setInit] = useState<boolean>(false);
  const [data, setData] = useState<HouseholdGenderOutPut>({
    is_success: false,
    reason: 'not init'
  });
  async function getInitData(){
    const new_data = await householdGenderDataFetcher({
      tw_yr: TW_YEAR_LIST[0],
      city_list: CITY_LIST
    });
    setData(new_data);
  }
  useEffect(()=> {
    if (! init) {
      getInitData();
      setInit(true);
    }
  }, [init]);
  
  return (
    <section id='household_gender_section'>
      {`[ ${data.is_success} ]`}
      {`${data.is_success=== false ? data.reason : '' }`}
    </section>
  );
}