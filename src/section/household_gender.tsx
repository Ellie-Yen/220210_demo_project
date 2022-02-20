import { ChangeEventHandler } from 'react';
import rwdCanvasRef from '../service/rwdCanvasRef';
import produceBarChart from '../service/produceBarChart'; 
import householdGenderDataController from '../service/householdGenderController';
import MyChart from '../component/my_chart';

import { default as MSG_MAP } from '../datastore/app_message.json';
import { default as CONTENT } from '../datastore/household_gender/content.json';

export default function HouseholdGenderSection(){
  const {
    fetch_state,
    dist_list,
    setDistIdx,
    render_data
  } = householdGenderDataController();
  
  const selectDist: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setDistIdx(+event.target.value);
  };

  return (
    <section id='household_gender_section'>
      {fetch_state.is_success === true
        ? 
        <SuccessSection
          dist_list={dist_list}
          selectDist={selectDist}
          render_data={render_data}
        />
        : 
        <EmptySection reason={fetch_state.reason}/>
      }
    </section>
  );
}

interface EmptySectionProps {
  reason: string
}
function EmptySection(props: EmptySectionProps){
  return (
    <>
      <h1>{props.reason}</h1>
    </>
  );
}

type SuccessSectionProps = SelectSectionProps & ResultDisplaySectionProps;
function SuccessSection(props: SuccessSectionProps){
  return (
    <>
      <SelectSection
        selectDist={props.selectDist}
        dist_list={props.dist_list}
      />
      <ResultDisplaySection
        render_data={props.render_data}
      />
    </>
  );
}

interface SelectSectionProps {
  selectDist: ChangeEventHandler<HTMLSelectElement>,
  dist_list: Array<string>
}
function SelectSection(props: SelectSectionProps){
  return (
    <div>
      <label htmlFor="dist_select">{CONTENT.select_title}</label>
      <select name="dists" id="dist_select"
        onChange={props.selectDist}
      >
        <option value=""></option>
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
  render_data: HouseholdGenderRenderData
}
function ResultDisplaySection(props: ResultDisplaySectionProps){
  const canvasRef = rwdCanvasRef(produceBarChart(props.render_data.bar_chart));
  return (
    <MyChart
      canvasRef={canvasRef}
    />
  );
}