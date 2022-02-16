import chartInfoController from "./chartInfoController";
import drawBarChart from "../lib/drawBarChart";
import getRangeList from "../lib/getRangeList";
import {
  clearAll
} from '../lib/canvasDrawHelpers';


const MARGIN = 25;
const TEXT_SIZE = 30;
const TEXT_CENTER = 15;
const AXIS_BAND = 50;
const AXIS_CENTER = 25;
const LABEL_GROUP_W = 100;
const TICK_COLOR = 'rgba(0,0,0,1)';

export default function produceBarChart(kwargs: ChartInfo): CanvasElementAction{
  const {
    data, 
    color_list, 
    group_label_list, 
    subgroup_label_list
  } = kwargs;

  if (data.length === 0 || data[0].length === 0){
    return (element) => {
      const ctx = element.getContext('2d');
      const [w, h] = [element.width, element.height];
      clearAll({ctx, w, h});
    }
  }

  const {
    updateGroupDisplay,
    updateSubgroupDisplay
  } = chartInfoController(kwargs);

  const group_status = group_label_list.map((k)=> true);
  const subgroup_status = subgroup_label_list.map((k)=> true);
  return (element) => { 
    const ctx = element.getContext('2d');
    const [w, h] = [element.width, element.height];
    const chart_boundary: ChartPosBoundary = {
      left: MARGIN,
      right: w - MARGIN - LABEL_GROUP_W,
      top: MARGIN,
      bottom: h - MARGIN
    }
    drawBarChart({
      ctx,
      data,
      color_list,
      group_label_list,
      subgroup_label_list,
      boundary: chart_boundary
    })
  };
}



