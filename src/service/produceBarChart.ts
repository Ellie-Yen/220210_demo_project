import chartInfoController from "./chartInfoController";
import drawBarChart from "../lib/drawBarChart";
import drawLabelGroup from "../lib/drawLabelGroup";
import {
  clearAll
} from '../lib/canvasDrawHelpers';

import { default as constant } from '../datastore/app_chart_setting.json';
const {
  MARGIN, TEXT_COLOR, TEXT_SIZE_RATIO,
  LABEL_GROUP_W_RATIO
} = constant;

/**
 * @param chart_info : ChartInfo, contains chart data, label, color info.
 * @returns CanvasElementAction, a function to generate
 * interactive bar chart by canvas.
 */
export default function produceBarChart(chart_info: ChartInfo): CanvasElementAction{
  const {
    data, 
    color_list, 
    group_label_list, 
    subgroup_label_list,
    unit
  } = chart_info;

  if (data.length === 0 || data[0].length === 0){
    return (element) => {
      const ctx = element.getContext('2d');
      const [w, h] = [element.width, element.height];
      clearAll({ctx, w, h});
    }
  }

  const {
    getLabelPos,
    checkUpdateView
  } = chartInfoController(chart_info);
  const label_list = subgroup_label_list.concat(group_label_list);
  const label_color_list = color_list.concat(
    group_label_list.map(k => TEXT_COLOR)
  );

  return (element) => {
    // init static kwargs of draw action.
    const ctx = element.getContext('2d');
    const [w, h] = [element.width, element.height];
    const label_group_w = LABEL_GROUP_W_RATIO * w;
    const text_size = w * TEXT_SIZE_RATIO;
    const chart_boundary: ChartPosBoundary = {
      left: MARGIN,
      right: w - MARGIN - MARGIN - label_group_w,
      top: MARGIN,
      bottom: h - MARGIN
    };
    const label_boundary = Object.assign({}, chart_boundary, {
      left: chart_boundary.right + MARGIN,
      right: w - MARGIN
    });
    const pos_list = getLabelPos({
      label_list,
      boundary: label_boundary
    });
    const static_kwargs = {
      ctx,
      unit,
      text_size,
      boundary: chart_boundary,
      label_boundary,
      label_list,
      label_color_list,
      pos_list,
    };

    // init view is display complete data
    draw(Object.assign({}, static_kwargs, {
      data,
      color_list,
      group_label_list,
      subgroup_label_list,
      label_select_list: label_list.map(k => true)
    }));

    // redraw by new info if view should be udated.
    element.onclick = (event) => {
      const {offsetX, offsetY} = event; 
      const change_view = checkUpdateView(ctx, offsetX, offsetY);
      if (! change_view){
        return;
      }
      draw(Object.assign({}, static_kwargs, {
        data: change_view.new_data.data,
        color_list: change_view.new_data.color_list,
        group_label_list: change_view.new_data.group_label_list,
        subgroup_label_list: change_view.new_data.subgroup_label_list,
        label_select_list: change_view.label_select_list
      }));
    }
  };
}

type DrawKwargs = DrawChartKwargs & DrawChartLabelKwargs & {
  label_color_list: Array<string>,
  label_boundary: ChartPosBoundary,
}

async function draw(kwargs: DrawKwargs) {
  const {
    ctx,
    data,
    unit,
    color_list,
    group_label_list,
    subgroup_label_list,
    boundary,
    label_list,
    pos_list,
    label_color_list,
    label_select_list,
    label_boundary,
    text_size
  } = kwargs;
  await drawLabelGroup({
    ctx,
    text_size,
    color_list: label_color_list,
    label_list,
    label_select_list,
    pos_list,
    boundary: label_boundary,
  });
  await drawBarChart({
    ctx,
    data,
    unit,
    text_size,
    color_list,
    group_label_list,
    subgroup_label_list,
    boundary
  });
}



