import { ChangeEventHandler } from 'react';
import rwdCanvasRef from '../service/rwdCanvasRef';
import produceBarChart from '../service/produceBarChart'; 
import householdGenderDataController from '../service/householdGenderController';
import MyChart from '../component/my_chart';

import { default as MSG } from '../datastore/message.json';
import { default as CLS_MAP } from '../datastore/class_name.json';
import { default as CONTENT } from '../datastore/household_gender/content.json';

export default function HouseholdGenderSection(){
  const {
    state,
    select,
    display
  } = householdGenderDataController();
  console.log('re-render');
  return (
    <section id='household_gender_section'
      className='section'
    >
      {state.is_success === true
        ? 
        <SuccessSection
          select={select}
          display={display}
        />
        : 
        <UnsuccessSection reason={state.reason}/>
      }
    </section>
  );
}

interface UnsuccessSectionProps {
  reason: string
}
function UnsuccessSection(props: UnsuccessSectionProps){
  return (
    <header className={`container ${props.reason === MSG.loading 
      ? CLS_MAP.loading
      : CLS_MAP.fail
      }`}
    >
      <h1>{props.reason}</h1>
    </header>
  );
}

type SuccessSectionProps = SelectSectionProps & InfoDisplaySectionProps;
function SuccessSection(props: SuccessSectionProps){
  return (
    <>
      <header
        className={`info_display container ${CLS_MAP.success}`}
      >
        <InfoDisplaySection
          display={props.display}
        />
        <SelectSection
          select={props.select}
        />
      </header>
      <ChartDisplaySection
        chart_data={props.display.chart}
      />
    </>
  );
}

interface SelectSectionProps {
  select: {
    dist: MySelectKwargs
  }
}
function SelectSection(props: SelectSectionProps){
  const selectOption: ChangeEventHandler<HTMLSelectElement> = (event) => {
    props.select.dist.selectFunc(+event.target.value);
  }
  return (
    <div className='select'>
      <label htmlFor="dist_select">
        {CONTENT.select_title.dist}
      </label>
      <select name="dists" id="dist_select"
        onChange={selectOption}
      >
        <option value=""></option>
        {props.select.dist.list.map((dist, i)=>
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

interface ChartDisplaySectionProps {
  chart_data: HouseholdGenderChartData
}
function ChartDisplaySection(props: ChartDisplaySectionProps){
  const canvasRef = rwdCanvasRef(produceBarChart(props.chart_data.bar_chart));
  return (
    <div className='chart_display container'>
      <MyChart canvasRef={canvasRef}/>
    </div>
  );
}

interface InfoDisplaySectionProps {
  display: HouseholdGenderDisplay
}
function InfoDisplaySection(props: InfoDisplaySectionProps){
  return (
    <>
      <img
        className='city_logo'
        alt={props.display.city_info.name}
        src={`city_logo/${props.display.city_info.logo}.png`}
      />
      <h1 className='title'>
        <span>{props.display.tw_year}{CONTENT.select_title.tw_year}</span>
        {CONTENT.title}
      </h1>
    </>
  );
}