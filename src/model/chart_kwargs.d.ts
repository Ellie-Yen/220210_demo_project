type ChartColorList = Array<string>;
type ChartGroupData = Array<number>;
type ChartData = Array<ChartGroupData>

interface ChartInfo {
  data: ChartData,
  group_label_list: Array<string>,
  subgroup_label_list: Array<string>,
  color_list: ChartColorList
}

interface ChartPosBoundary {
  top: number,
  bottom: number,
  left: number,
  right: number
}

interface BarChartInfo extends ChartInfo {
}
