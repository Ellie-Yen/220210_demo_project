import {
  clearRange,
  drawVerticalTextRect,
  drawCenterText,
  drawGridY,
  drawTickX,
  drawTickY
} from './canvasDrawHelpers';
import getStartOfRangeList from './getStartOfRangeList';
import getMidOfRangeList from './getMidOfRangeList';

import { default as constant } from '../datastore/chart_setting.json';
const {
  GAP, AXIS_BAND_RATIO, UNIT_LABEL
} = constant;

export default async function drawBarChart(kwargs: DrawChartKwargs){
  const {
    ctx,
    data,
    color_list,
    group_label_list,
    boundary,
    text_size,
    unit
  } = kwargs;

  // clear graph before
  await clearRange({
    ctx,
    boundary
  });
  const axis_band = AXIS_BAND_RATIO * (boundary.right - boundary.left);
  
  const x_ticks_top = boundary.bottom - axis_band;
  const body_boundary = Object.assign({}, boundary, {
    top: boundary.top + axis_band + GAP,
    left: boundary.left + axis_band + GAP,
    bottom: x_ticks_top
  });
  
  // get x, y axes info
  const max_val = Math.max(...data.flat());
  const {tick_cnt, tick_unit} = getTickCntAndUnit(max_val);
  const y_label_list = getStartOfRangeList({
    start:  tick_cnt,
    end: 0,
    cnt_interval: tick_cnt
  }).map((label) =>
    `${label}`
  );

  // we draw tick at middle of the interval.
  const y_tick_pos_list = getMidOfRangeList({
    start: body_boundary.top,
    end: x_ticks_top,
    cnt_mid: tick_cnt
  });

  const y0_pos = y_tick_pos_list[y_tick_pos_list.length - 1];
  const pos_unit = y_tick_pos_list[1] - y_tick_pos_list[0];
  const y_tick_boundary = Object.assign({}, body_boundary, {
    left: boundary.left,
    right: boundary.left + axis_band,
    bottom: x_ticks_top
  });

  const group_pos_list = getStartOfRangeList({
    start: body_boundary.left,
    end: body_boundary.right,
    cnt_interval: data.length
  });
  const subgroup_margin = (
    group_pos_list[1] - group_pos_list[0]
  ) * 0.1;
  
  // add unit
  await drawCenterText({
    ctx,
    size: text_size,
    text: `${UNIT_LABEL}: ${tick_unit} ${unit}`,
    boundary: Object.assign({}, boundary, {
      top: boundary.top,
      bottom: boundary.top + axis_band
    })
  });

  // draw y axis
  await drawTickY({
    ctx,
    size: text_size,
    pos_list: y_tick_pos_list,
    label_list: y_label_list,
    boundary: y_tick_boundary
  });
  await drawGridY({
    ctx,
    pos_list: y_tick_pos_list,
    boundary: body_boundary
  });

  // draw bars and x tick
  const translateVal = (val: number) => {
    return val / tick_unit * pos_unit;
  }
  for (let i = 0; i < data.length; i++){
    const group = data[i];
    const subgroup_left = group_pos_list[i] + subgroup_margin;
    const subgroup_right = group_pos_list[i + 1] - subgroup_margin;
    const subgroup_boundary = Object.assign({}, body_boundary, {
      left: subgroup_left,
      right: subgroup_right,
      bottom: y0_pos
    });
    await drawTickX({
      ctx,
      size: text_size,
      pos_list: [(subgroup_left + subgroup_right) / 2],
      label_list: [group_label_list[i]],
      boundary: Object.assign({}, boundary, {
        top: x_ticks_top,
        left: subgroup_left,
        right: subgroup_right
      })
    });
    await drawBarGroup({
      ctx,
      text_size,
      boundary: subgroup_boundary,
      val_list: group.map(translateVal),
      label_list: group.map(val => `${val / tick_unit}`),
      color_list
    });
  };
}

function getTickCntAndUnit(max_val: number){  
  let tick_cnt = max_val;
  let tick_unit = 1;
  while (tick_cnt >= 10){
    tick_cnt = Math.floor(tick_cnt / 10);
    tick_unit *= 10;
  }

  // add tick if current tick isn't fine enough.
  // use floor here since in the end we need 1 extra tick
  // to represent boundary.
  if (tick_cnt < 5 && tick_unit > 1  &&
    Math.floor(max_val * 10 / tick_unit) < 15
  ){
    tick_unit /= 10;
    tick_cnt = Math.floor(max_val / tick_unit);
  }
  tick_cnt += 1;
  return {
    tick_unit,
    tick_cnt
  };
}

interface DrawBarGroupKwargs extends CanvasDrawActionKwargs {
  boundary: ChartPosBoundary,
  val_list: Array<number>,
  label_list: Array<string>,
  color_list: Array<string>,
  text_size: number
}
async function drawBarGroup(kwargs: DrawBarGroupKwargs){
  const {
    ctx,
    boundary,
    val_list,
    label_list,
    color_list,
    text_size
  } = kwargs;

  const pos_list = getStartOfRangeList({
    start: boundary.left,
    end: boundary.right,
    cnt_interval: val_list.length
  });

  for (let i = 0; i < label_list.length; i++){
    await drawVerticalTextRect({
      ctx,
      size: text_size,
      color: color_list[i], 
      text: label_list[i],
      boundary: Object.assign({}, boundary, {
        left: pos_list[i],
        right: pos_list[i + 1],
        top: boundary.bottom - val_list[i],
      })
    });
  };
}