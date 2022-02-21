type ChartColorList = Array<string>;
type ChartGroupData = Array<number>;
type ChartData = Array<ChartGroupData>

interface ChartInfo {
  data: ChartData,
  group_label_list: Array<string>,
  subgroup_label_list: Array<string>,
  color_list: ChartColorList,
  unit: string
}

interface ChartPosBoundary {
  top: number,
  bottom: number,
  left: number,
  right: number
}

interface DrawChartSizeKwargs {
  boundary: ChartPosBoundary,
  text_size: number
}

type DrawChartKwargs = 
  CanvasDrawActionKwargs &
  ChartInfo & DrawChartSizeKwargs
;

type DrawChartLabelKwargs = 
  CanvasDrawActionKwargs & 
  DrawChartSizeKwargs & {
    label_list: Array<string>,
    label_select_list: Array<boolean>,
    pos_list: Array<CanvasRectKwargs>,
    color_list: Array<string>,
  }
;
