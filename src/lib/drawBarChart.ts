import {
  clearAll,
  clearRange,
  horizontalTextRect,
  verticalTextRect,
  drawGridY,
  drawTickX,
  drawTickY
} from './canvasDrawHelpers';
import getRangeList from './getRangeList';

const MARGIN = 25;
const TEXT_SIZE = 30;
const TEXT_CENTER = 15;
const AXIS_BAND = 50;
const AXIS_CENTER = 25;
const LABEL_GROUP_W = 100;
const TICK_COLOR = 'rgba(0,0,0,1)';

type DrawKwargs = 
  CanvasDrawActionKwargs &
  ChartInfo &
  {boundary: ChartPosBoundary}
;

export default function drawBarChart(kwargs: DrawKwargs){
  const {
    ctx,
    data,
    color_list,
    group_label_list,
    subgroup_label_list,
    boundary
  } = kwargs;

  // clear graph before
  clearRange({ctx, boundary});

  // get x, y axes info
  const max_val = Math.max(...data.flat());
  const {tick_cnt, tick_unit} = getTickCntAndUnit(max_val);
  const y_label_list = getRangeList({
    start: tick_cnt,
    end: 0,
    cnt_interval: tick_cnt
  }).map((label) =>
    `${label}`
  );
  const y_pos_list = getRangeList({
    start: boundary.top + TEXT_CENTER,
    end: boundary.bottom - TEXT_CENTER - AXIS_BAND,
    cnt_interval: tick_cnt
  });
  const x_axis_pos = y_pos_list[y_pos_list.length - 1];
  const pos_unit = y_pos_list[1] - y_pos_list[0];

  const group_pos_list = getRangeList({
    start: boundary.left + AXIS_BAND + MARGIN,
    end: boundary.right,
    cnt_interval: data.length
  });
  const subgroup_margin = (
    group_pos_list[1] - group_pos_list[0]
  ) * 0.1;

  // draw axes
  drawGridY({
    ctx,
    pos_list: y_pos_list,
    boundary: Object.assign(boundary, {left: TEXT_SIZE})
  });
  drawTickY({
    ctx,
    pos_list: y_pos_list,
    label_list: y_label_list,
    boundary
  });
  drawTickX({
    ctx,
    pos_list: group_label_list.map((k, i)=> 
      (group_pos_list[i + 1] + group_pos_list[i]) / 2 
    ),
    label_list: group_label_list,
    boundary: Object.assign(boundary, {top: x_axis_pos})
  });

  // add unit
  drawTickX({
    ctx,
    pos_list: [boundary.left + AXIS_CENTER],
    label_list: [`${tick_unit}`],
    boundary: Object.assign(boundary, {top: x_axis_pos})
  });

  // draw bars
  const translateVal = (val: number) => {
    return val / tick_unit * pos_unit;
  }
  data.forEach((group, i)=> {
    const subgroup_boundary = Object.assign(boundary, {
      left: group_pos_list[i] + subgroup_margin,
      right: group_pos_list[i + 1] - subgroup_margin,
      bottom: x_axis_pos
    });
    drawBarGroup({
      ctx,
      boundary: subgroup_boundary,
      val_list: group.map(translateVal),
      label_list: group.map(val => `${val}`),
      color_list
    });
  });
}

function getTickCntAndUnit(max_val: number){  
  let tick_cnt = max_val;
  let tick_unit = 1;
  while (tick_cnt >= 10){
    tick_cnt = Math.floor(tick_cnt / 10);
    tick_unit *= 10;
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
  color_list: Array<string>
}
function drawBarGroup(kwargs: DrawBarGroupKwargs){
  const {
    ctx,
    boundary,
    val_list,
    label_list,
    color_list
  } = kwargs;

  const pos_list = getRangeList({
    start: boundary.left,
    end: boundary.right,
    cnt_interval: val_list.length
  });

  const w = pos_list[1] - pos_list[0];
  pos_list.forEach((pos, i)=> {
    verticalTextRect({
      ctx,
      x: pos, 
      y: boundary.bottom - val_list[i],
      w,
      h: val_list[i], 
      rect_color: color_list[i], 
      text_color: 'rgba(0,0,0,1)', 
      text: label_list[i]
    });
  });
}

/*

interface DrawChartLabelKwargs extends CanvasDrawActionKwargs {
  group_label_list: Array<String>,
  subgroup_label_list: Array<String>,
  color_list: ChartColorList
}
function drawChartLabel(kwargs: DrawChartLabelKwargs){
  const {
    ctx, 
    w, 
    h, 
    color_list,
    group_label_list,
    subgroup_label_list
  } = kwargs;
  clearAll({ctx, w, h});
  const label_pos = getRangeList({
    start: MARGIN,
    end: h - MARGIN,
    cnt_interval: group_label_list.length + subgroup_label_list.length
  });
  console.log(label_pos);

  const unit = (label_pos[1] - label_pos[0]);
  const label_margin = unit * 0.1;
  const label_h = unit - label_margin;
  const label_h_center = label_h / 2;
  const label_left = w - MARGIN - LABEL_GROUP_W;
  
  const label_w = LABEL_GROUP_W;
  const label_w_center = label_left + label_w / 2;

  const subgroup_pos = subgroup_label_list.map((subgroup, i) => {
    const label = new Path2D();
    const label_top = label_pos[i] + label_margin;
    ctx.fillStyle = color_list[i];
    label.rect(
      label_left,
      label_top,
      label_w,
      label_h
    );
    ctx.fill(label);
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillText(
      `${subgroup}`,
      label_w_center,
      label_top + label_h_center,
      label_w
    );
    return label;
  });

  const group_pos = group_label_list.map((group, i) => {
    const label = new Path2D();
    const label_top = label_pos[i + subgroup_label_list.length] + label_margin;
    ctx.fillStyle = 'rgba(0,0,0,0)';
    label.rect(
      label_left,
      label_top,
      label_w,
      label_h
    );
    ctx.fill(label);
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillText(
      `${group}`,
      label_w_center,
      label_top + label_h_center,
      label_w
    );
    return label;
  });

  return {subgroup_pos, group_pos};
}

interface DrawChartBodyKwargs extends CanvasDrawActionKwargs {
  data: ChartData,
  color_list: ChartColorList
}
function drawChartBody(kwargs: DrawChartBodyKwargs){
  const {ctx, w, h, data, color_list} = kwargs;
  const content_h = h - MARGIN * 2;
  const content_w = w - MARGIN * 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.fillRect(MARGIN, MARGIN, content_w - LABEL_GROUP_W, content_h);

  const tick_boundary: ChartPosBoundary = {
    top: MARGIN,
    bottom: h - MARGIN - AXIS_BAND,
    left: MARGIN,
    right: w - MARGIN - LABEL_GROUP_W
  };
  const max_val = Math.max(...data.flat());
  const {
    x_axis_pos,
    val_unit,
    pos_unit,
    tick_info_list
  } = getTickDetails({
    max_val,
    boundary: tick_boundary
  });
  drawTick({
    ctx, 
    tick_info_list,
    boundary: tick_boundary
  });

  const bar_boundary = Object.assign(tick_boundary, {
    left: MARGIN * 2 + AXIS_BAND,
    bottom: x_axis_pos
  });
  const bar_data = convertToBarChartData({
    data,
    val_unit,
    pos_unit,
    boundary: bar_boundary
  });
  bar_data.forEach((group_data)=>{
    drawGroupBar({
      data: group_data,
      ctx, 
      color_list
    })
  });
}
type BarChartData = Array<BarGroupInfo>;

interface getDataInfoKwargs {
  data: ChartData,
  boundary: ChartPosBoundary,
  pos_unit: number,
  val_unit: number
}
function convertToBarChartData(kwargs: getDataInfoKwargs): BarChartData{
  const res: BarChartData = [];
  const { 
    boundary,
    data,
    val_unit,
    pos_unit
  } = kwargs;

  const group_w_pos = getRangeList({
    start: boundary.left,
    end: boundary.right,
    cnt_interval: data.length
  });
  const group_w_margin = (group_w_pos[1] - group_w_pos[0]) / 20;
  
  data.forEach((group, i)=> {
    const info_group: BarGroupInfo = [];
    const subgroup_w_pos = getRangeList({
      start: group_w_pos[i] + group_w_margin,
      end: group_w_pos[i + 1] - group_w_margin,
      cnt_interval: group.length
    });
    const bar_width = subgroup_w_pos[1] - subgroup_w_pos[0];
    group.forEach((val, j)=> {
      const bar_height = val / val_unit * pos_unit;
      info_group.push({
        label: `${val}`,
        bar_width,
        bar_height,
        x: subgroup_w_pos[j],
        y: boundary.bottom - bar_height
      });
    })
    res.push(info_group);
  });
  return res;
}

interface GetTickDetailsKwargs {
  max_val: number, 
  boundary: ChartPosBoundary
}
function getTickDetails(kwargs: GetTickDetailsKwargs){
  const {
    max_val, 
    boundary
  } = kwargs;
  
  let unit_cnt = max_val;
  let val_unit = 1;
  while (unit_cnt >= 10){
    unit_cnt = Math.floor(unit_cnt / 10);
    val_unit *= 10;
  }

  unit_cnt += 1;
  const text_space = TEXT_SIZE / 2;
  const start = boundary.top + text_space;
  const end = boundary.bottom - text_space;
  const tick_pos_list = getRangeList({
    start,
    end,
    cnt_interval: unit_cnt
  });
  const x_axis_pos = tick_pos_list[tick_pos_list.length - 1];
  const pos_unit = tick_pos_list[1] - tick_pos_list[0];
  const tick_info_list = tick_pos_list.map((tick_pos, i)=> ({
    tick_pos,
    label_pos: tick_pos,
    label: `${unit_cnt - i}`
  }));
  return {
    start,
    x_axis_pos,
    val_unit,
    pos_unit,
    tick_info_list
  };
}

interface BarInfo {
  label: string,
  x: number,
  y: number,
  bar_height: number,
  bar_width: number
}
type BarGroupInfo = Array<BarInfo>;
interface drawGroupBarKwargs {
  data: BarGroupInfo,
  ctx: CanvasRenderingContext2D,
  color_list: ChartColorList
}
function drawGroupBar(kwargs: drawGroupBarKwargs){
  const {data, ctx, color_list} = kwargs;
  data.forEach((info, i)=>{
    ctx.save();
    ctx.fillStyle = color_list[i];
    ctx.fillRect(info.x, info.y, info.bar_width, info.bar_height);
    
    // draw bar label by vertical direction.
    // put label in center of the bar,
    // if the bar could accommodate label inside;
    // otherwise put it on top.
    ctx.rotate((Math.PI / 180) * 90);
    const bar_w_center = info.bar_width / 2;
    const bar_h_center = info.bar_height / 2;
    ctx.fillStyle = 'rgba(0,0,0,1)';
    const text_w = ctx.measureText(info.label).width;
    const text_y = 
      text_w > info.bar_height
      ? info.y - text_w
      : info.y + bar_h_center
    ;
    ctx.fillText(info.label, 
      text_y, 
      -info.x - bar_w_center
    );
    ctx.restore();
  });
  ctx.save();
}


*/