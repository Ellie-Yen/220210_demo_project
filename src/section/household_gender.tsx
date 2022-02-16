import { ChangeEventHandler } from 'react';
import householdGenderDataController from '../service/householdGenderController';
import MyBarChart from '../component/my_bar_chart';

export default function HouseholdGenderSection(){
  return (
    <MyBarChart
      data={[[1155, 50]]}
      group_label_list={['a']}
      subgroup_label_list={['1', '2']}
      color_list={['rgba(255,150,0,1)', 'rgba(255,0,150,1)']}
    />
  );
}
/*
const {
    dist_list,
    setDistIdx,
    render_data
  } = householdGenderDataController();
  
  const selectDist: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setDistIdx(+event.target.value);
  };

  return (
    <section id='household_gender_section'>
      <SelectSection
        selectDist={selectDist}
        dist_list={dist_list}
      />
      <ResultDisplaySection
        data={render_data}
      />
    </section>
  );
*/

function EmptyStatusSection(){
  return (
    <div> empty </div>
  );
}

interface SelectSectionProps {
  selectDist: ChangeEventHandler<HTMLSelectElement>,
  dist_list: Array<string>
}
function SelectSection(props: SelectSectionProps){
  return (
    <div>
      <label htmlFor="dist_select">地區</label>
      {props.dist_list.length === 0 ? 'loading...': ''}
      <select name="dists" id="dist_select"
        onChange={props.selectDist}
      >
        <option value="">--Please choose an option--</option>
        {props.dist_list.map((dist, i)=>
          <option
            key={dist} 
            value={i}
          >
            {dist}
          </option>
        )}
      </select>
    </div>
  );
}

interface ResultDisplaySectionProps {
  data: HouseholdGenderRenderData
}
function ResultDisplaySection(props: ResultDisplaySectionProps){
  return (
    <MyBarChart
      {...props.data.bar_chart}
    />
  );
}