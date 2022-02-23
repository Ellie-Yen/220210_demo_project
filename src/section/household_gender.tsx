import rwdCanvasRef from '../service/rwdCanvasRef';
import produceBarChart from '../service/produceBarChart'; 
import householdGenderDataController from '../service/householdGenderController';
import MyChart from '../component/my_chart';
import MySelect from '../component/my_select';

import { default as MSG } from '../datastore/message.json';
import { default as CLS_MAP } from '../datastore/class_name.json';
import { default as CONTENT } from '../datastore/household_gender/content.json';

import '../style/household_gender.css';

export default function HouseholdGenderSection(){
  const {
    state,
    select,
    display
  } = householdGenderDataController();
  return (
    <section id='household_gender_section'
      className='section row'
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
    <header className={`section row ${props.reason === MSG.loading 
      ? CLS_MAP.loading
      : CLS_MAP.fail
      }`}
    >
      <h1>{props.reason}</h1>
    </header>
  );
}

type SuccessSectionProps = SelectPartProps & InfoDisplaySectionProps;
function SuccessSection(props: SuccessSectionProps){
  return (
    <>
      <header
        className={`col info_display ${CLS_MAP.success}`}
      >
        <InfoDisplaySection
          display={props.display}
        />
        <SelectPart
          select={props.select}
        />
      </header>
      <ChartDisplayPart
        chart_data={props.display.chart}
      />
    </>
  );
}

interface SelectPartProps {
  select: {
    dist: MySelectKwargs
  }
}
function SelectPart(props: SelectPartProps){
  return (
    <div className='select_part'>
      <MySelect
        title={CONTENT.select_title.dist}
        list={props.select.dist.list}
        selectFunc={props.select.dist.selectFunc}
      />
    </div>
  );
}

interface ChartDisplayPartProps {
  chart_data: HouseholdGenderChartData
}
function ChartDisplayPart(props: ChartDisplayPartProps){
  const canvasRef = rwdCanvasRef(produceBarChart(props.chart_data.bar_chart));
  return (
    <div className='chart_display'>
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
        className='city_logo c_0'
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