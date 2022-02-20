import boundaryToRectParamList from './boundaryToRectParamList';
import { default as constant } from '../datastore/app_chart_setting.json';
const {
  GAP,
  TEXT_BASELINE,
  TEXT_COLOR, TICK_COLOR,
} = constant;

const ROTATE_DEG = (Math.PI / 180) * 90;
const CIRCLE_ANG = Math.PI * 2;

type PosList = {
  pos_list: Array<number>
};

type ClearAllKwargs = CanvasDrawActionKwargs & CanvasSizeKwargs;
export async function clearAll(kwargs: ClearAllKwargs){
  const {ctx, w, h} = kwargs;
  ctx.clearRect(0, 0, w, h);
}

type ClearRangeKwargs = CanvasDrawActionKwargs & {
  boundary: ChartPosBoundary
}
export async function clearRange(kwargs: ClearRangeKwargs){
  const {ctx, boundary} = kwargs;
  ctx.clearRect(...boundaryToRectParamList(boundary));
}

interface FillKwargs {
  color: string
}
type FillRectKwargs = FillKwargs & ClearRangeKwargs;
export async function fillRectByColor(kwargs: FillRectKwargs){
  const {
    ctx, boundary, color
  } = kwargs;
  ctx.fillStyle = color;
  ctx.fillRect(...boundaryToRectParamList(boundary));
}

type CircleKwargs = CanvasDrawActionKwargs & FillKwargs & CanvasPosKwargs & {
  radius: number
};
export async function fillCircleByColor(kwargs: CircleKwargs){
  const {
    ctx, x, y, color, radius
  } = kwargs;
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, CIRCLE_ANG);
  ctx.fill();
  ctx.closePath();
}
export async function strokeCircleByColor(kwargs: CircleKwargs){
  const {
    ctx, x, y, color, radius
  } = kwargs;
  const radical = radius * 2;
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.arc(x, y, radius, 0, CIRCLE_ANG);
  ctx.clip();
  ctx.clearRect(x - radius, y - radius, radical, radical);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

type TextKwargs = ClearRangeKwargs & TextInfo;
export async function drawCenterText(kwargs: TextKwargs){
  const {ctx, text, boundary, size} = kwargs;
  const rect_param_list = boundaryToRectParamList(boundary);

  // move x, y, to center
  rect_param_list[0] += rect_param_list[2] / 2;
  rect_param_list[1] += rect_param_list[3] / 2;
  await initTextSetting({ctx, size, text_align: 'center'});
  await drawTextHelper({ctx, text, rect_param_list, size});
}
export async function drawLeftText(kwargs: TextKwargs){
  const {ctx, text, boundary, size} = kwargs;
  const rect_param_list = boundaryToRectParamList(boundary);
  // move y to center
  rect_param_list[1] += rect_param_list[3] / 2;
  await initTextSetting({ctx, size, text_align: 'left'});
  await drawTextHelper({ctx, text, rect_param_list, size});
}

type TextRectKwargs = FillRectKwargs & TextInfo;
export async function drawHorizontalTextRect(kwargs: TextRectKwargs){
  const {
    ctx, boundary, color, text, size
  } = kwargs;
  if (color){
    await fillRectByColor({ctx, boundary, color});
  }
  await drawCenterText({ctx, text, boundary, size});
}
export async function drawVerticalTextRect(kwargs: TextRectKwargs){
  const {
    ctx, boundary, color, text, size
  } = kwargs;
  if (color){
    await fillRectByColor({ctx, boundary, color});
  }
  ctx.save();

  // put text in center of the rect,
  // if the rect could accommodate text inside;
  // otherwise put it on top.
  ctx.rotate(ROTATE_DEG);

  // init bc we want to know text width
  await initTextSetting({ctx, size, text_align: 'center'});
  const text_w = ctx.measureText(text).width;
  const h = (boundary.bottom - boundary.top);
  const [top, bottom] = text_w > h
    ? [boundary.top - text_w, boundary.top]
    : [boundary.top, boundary.bottom]
  ;
  await drawCenterText({
    ctx, text, size,
    boundary: {
      top: -boundary.right,
      left: top,
      right: bottom,
      bottom: -boundary.left
    }
  });
  ctx.restore();
  ctx.save();
}

type DrawLabelTextKwargs = TextRectKwargs & {
  is_selected: boolean
};
export async function drawLabelText(kwargs: DrawLabelTextKwargs){
  let {
    ctx, boundary, color, text, size, is_selected
  } = kwargs;
  const radius = size / 2;
  let [x, y] = [
    boundary.left + radius, 
    (boundary.top + boundary.bottom) / 2
  ];
  if (is_selected){
    await fillCircleByColor({ctx, x, y, color, radius});
  }
  else {
    await strokeCircleByColor({ctx, x, y, color, radius});
  }
  await drawLeftText({
    ctx, 
    text,
    size,
    boundary: Object.assign({}, boundary, {
      left: boundary.left + size + GAP
    })
  });
}

type DrawGridKwargs = ClearRangeKwargs & PosList;
export async function drawGridY(kwargs: DrawGridKwargs){
  const {ctx, pos_list, boundary} = kwargs;
  const getGridPosStart: GetPosFunc = (y_pos) => ({
    x: boundary.left, 
    y: y_pos
  });
  const getGridPosEnd: GetPosFunc = (y_pos) => ({
    x: boundary.right, 
    y: y_pos
  });
  await drawGridHelper({
    ctx, pos_list, getGridPosStart, getGridPosEnd
  });
}

interface DrawTickKwargs extends DrawGridKwargs {
  label_list: Array<string>,
  size: number
}
export async function drawTickX(kwargs: DrawTickKwargs){
  const {boundary, pos_list} = kwargs;
  const w = (pos_list.length > 1
    ? pos_list[1] - pos_list[0]
    : boundary.right - boundary.left
  ) / 2;
  const getBoundary: GetBoundaryFunc = (x_pos) => 
    Object.assign({}, boundary, {
      left: x_pos - w,
      right: x_pos + w
    }
  );
  await drawTickHelper(
    Object.assign({}, kwargs, {getBoundary})
  );
}
export async function drawTickY(kwargs: DrawTickKwargs){
  const {boundary, pos_list} = kwargs;
  const h = (pos_list.length > 1
    ? pos_list[1] - pos_list[0]
    : boundary.bottom - boundary.top
  ) / 2;
  const getBoundary: GetBoundaryFunc = (y_pos) => 
    Object.assign({}, boundary, {
      top: y_pos - h,
      bottom: y_pos + h
    }
  );
  await drawTickHelper(
    Object.assign({}, kwargs, {getBoundary})
  );
}



type GetPosFunc = (pos: number)=> CanvasPosKwargs;
type DrawGridHelperKwargs = CanvasDrawActionKwargs & PosList &{
  getGridPosStart: GetPosFunc,
  getGridPosEnd: GetPosFunc
};
async function drawGridHelper(kwargs: DrawGridHelperKwargs){
  const {
    ctx, pos_list, 
    getGridPosStart, getGridPosEnd
  } = kwargs;
  ctx.strokeStyle = TICK_COLOR;
  pos_list.forEach((tick_pos)=> {
    const start = getGridPosStart(tick_pos);
    const end = getGridPosEnd(tick_pos);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.closePath();
  });
}

type GetBoundaryFunc = (pos: number)=> ChartPosBoundary;
type DrawTickHelperKwargs = DrawTickKwargs & {
  getBoundary: GetBoundaryFunc
};
async function drawTickHelper(kwargs: DrawTickHelperKwargs){
  const {
    ctx, pos_list, label_list, size, getBoundary
  } = kwargs;
  for (let i = 0; i < label_list.length; i++) {
    await drawCenterText({
      ctx,
      size,
      text: label_list[i],
      boundary: getBoundary(pos_list[i])
    });
  }
}

type InitTextSettingKwargs = CanvasDrawActionKwargs & {
  text_align: CanvasTextAlign,
  size: number
}
async function initTextSetting(kwargs: InitTextSettingKwargs){
  const {ctx, text_align, size} = kwargs;
  ctx.textAlign = text_align;
  ctx.textBaseline = (TEXT_BASELINE as CanvasTextBaseline);
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = `${size}px sans-serif`;
}
interface TextInfo {
  size: number,
  text: string,
}
type TextHelperKwargs = CanvasDrawActionKwargs & TextInfo & {
  rect_param_list: CanvasRectParamList
};
async function drawTextHelper(kwargs: TextHelperKwargs){
  const {
    ctx, text, rect_param_list
  } = kwargs;
  const [x, y, w, h] = rect_param_list;
  let size = Math.min(h, kwargs.size);
  const text_w = ctx.measureText(text).width;

  // scale text size if needed
  if (text_w > w){
    ctx.font = `${size * (w / text_w)}px sans-serif`;
  }
  ctx.fillText(text, x, y, w);
}

