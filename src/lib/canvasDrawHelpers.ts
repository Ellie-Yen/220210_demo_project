const MARGIN = 25;
const AXIS_BAND = 50;
const AXIS_CENTER = 25;
const LABEL_GROUP_W = 100;
const TEXT_SIZE = 30;
const TEXT_ALIGN = 'center';
const TEXT_BASELINE = 'middle';
const TICK_COLOR = 'rgba(0,0,0,1)';
const ROTATE_DEG = (Math.PI / 180) * 90;

interface ClearAllKwargs extends CanvasDrawActionKwargs{
  w: number,
  h: number
}
export function clearAll(kwargs: ClearAllKwargs){
  const {ctx, w, h} = kwargs;
  ctx.clearRect(0, 0, w, h);
}

interface ClearRangeKwargs extends CanvasDrawActionKwargs {
  boundary: ChartPosBoundary
}
export function clearRange(kwargs: ClearRangeKwargs){
  const {ctx, boundary} = kwargs;
  ctx.clearRect(
    boundary.left,
    boundary.right,
    boundary.right - boundary.left, 
    boundary.bottom - boundary.top, 
  );
}

interface RectKwargs extends ClearAllKwargs {
  x: number,
  y: number,
  rect_color: string
}
export function drawRect(kwargs: RectKwargs){
  const {
    ctx, x, y, w, h, rect_color
  } = kwargs;
  ctx.fillStyle = rect_color;
  ctx.fillRect(x, y, w, h);
}

interface TextRectKwargs extends RectKwargs {
  text: string
  text_color: string
}
export function horizontalTextRect(kwargs: TextRectKwargs){
  const {
    ctx, x, y, w, h, rect_color, text_color, text
  } = kwargs;
  drawRect({ctx, x, y, w, h, rect_color});
  ctx.fillStyle = text_color;
  ctx.font = `${TEXT_SIZE}px serif`;
  ctx.textBaseline = TEXT_BASELINE;
  ctx.textAlign = TEXT_ALIGN;
  ctx.fillText(
    text,
    x + h / 2,
    y + w / 2,
    w
  );
}
export function verticalTextRect(kwargs: TextRectKwargs){
  const {
    ctx, x, y, w, h, rect_color, text_color, text
  } = kwargs;
  drawRect({ctx, x, y, w, h, rect_color});
  ctx.save();

  ctx.fillStyle = text_color;
  ctx.font = `${TEXT_SIZE}px serif`;
  ctx.textBaseline = TEXT_BASELINE;
  ctx.textAlign = TEXT_ALIGN;

  // put text in center of the rect,
  // if the rect could accommodate text inside;
  // otherwise put it on top.
  ctx.rotate(ROTATE_DEG);
  const text_w = ctx.measureText(text).width;
  const text_y = 
    text_w > h
    ? y - text_w
    : y + h / 2
  ;
  ctx.fillText(
    text, 
    text_y, 
    -x - w / 2
  );
  ctx.restore();
  ctx.save();
}

interface DrawGridKwargs extends CanvasDrawActionKwargs {
  pos_list: Array<number>,
  boundary: ChartPosBoundary
}
export function drawGridY(kwargs: DrawGridKwargs){
  const {ctx, pos_list, boundary} = kwargs;
  const getGridPosStart: GetXYPosFunction = (grid_pos: number) => [
    boundary.left + AXIS_BAND, grid_pos
  ];
  const getGridPosEnd: GetXYPosFunction = (grid_pos: number) => [
    boundary.right, grid_pos
  ];
  drawGridHelper({
    ctx, pos_list, getGridPosStart, getGridPosEnd
  });
}

interface DrawTickKwargs extends DrawGridKwargs {
  label_list: Array<string>
}
export function drawTickX(kwargs: DrawTickKwargs){
  const {ctx, pos_list, label_list, boundary} = kwargs;
  const getPos: GetXYPosFunction = (pos: number) => [
    pos, boundary.top + AXIS_BAND
  ];
  drawTickHelper({
    ctx, pos_list, label_list, getPos
  });
}
export function drawTickY(kwargs: DrawTickKwargs){
  const {ctx, pos_list, label_list, boundary} = kwargs;
  const getPos: GetXYPosFunction = (pos: number) => [
    boundary.left + AXIS_BAND, pos
  ];
  drawTickHelper({
    ctx, pos_list, label_list, getPos
  });
}

type GetXYPosFunction = (pos: number)=> [number, number];

interface DrawGridHelperKwargs extends CanvasDrawActionKwargs {
  pos_list: Array<number>,
  getGridPosStart: GetXYPosFunction,
  getGridPosEnd: GetXYPosFunction
}
function drawGridHelper(kwargs: DrawGridHelperKwargs){
  const {
    ctx, pos_list, 
    getGridPosStart, getGridPosEnd
  } = kwargs;
  ctx.fillStyle = TICK_COLOR;
  ctx.strokeStyle = TICK_COLOR;
  pos_list.forEach((tick_pos)=> {
    ctx.beginPath();
    ctx.moveTo(...getGridPosStart(tick_pos));
    ctx.lineTo(...getGridPosEnd(tick_pos));
    ctx.stroke();
    ctx.closePath();
  });
}

interface DrawTickHelperKwargs extends CanvasDrawActionKwargs {
  pos_list: Array<number>,
  label_list: Array<string>,
  getPos: GetXYPosFunction
}
function drawTickHelper(kwargs: DrawTickHelperKwargs){
  const {
    ctx, pos_list, label_list, getPos
  } = kwargs;
  ctx.font = `${TEXT_SIZE}px serif`;
  ctx.textBaseline = TEXT_BASELINE;
  ctx.textAlign = TEXT_ALIGN;
  ctx.fillStyle = TICK_COLOR;
  pos_list.forEach((pos, i)=> {
    ctx.fillText(label_list[i], ...getPos(pos));
  });
}


