import getStartOfRangeList from '../lib/getStartOfRangeList';

/**
 * helps handle displaying info while interactions happens.
 * @param chart_info : ChartInfo, contains 
 * data, color_list, unit, group_label_list, subgroup_label_list.
 * @returns 
 * - getLabelPos: a function takes {label_list, boundary} as kwargs,
 * return Array<CanvasRectKwargs> as canvas pos & size of labels.
 * - checkUpdateView: a function takes {ctx, x, y} as kwargs,
 * check if a click event target is one of labels,
 * return {label_select_list, new_data} if it is,
 * otherwise return undefined.
 */
export default function chartInfoController(chart_info: ChartInfo){
  const {
    data, 
    color_list, 
    group_label_list, 
    subgroup_label_list,
    unit
  } = chart_info;

  const [n, m] = [subgroup_label_list.length, group_label_list.length];
  const label_select_list = Array.from(new Array(n + m)).map((k)=> true);

  // the path of each label, for check click event targets.
  let label_path_list: Array<Path2D> = [];

  const getLabelPos = (params: GetLabelGroupPosKwargs) => {
    const label_pos_list = getLabelGroupPos(params);
    updatePathList(label_pos_list);
    return label_pos_list;
  }
  const checkUpdateView = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    for (let i = 0; i < label_path_list.length; i++){
      if (ctx.isPointInPath(label_path_list[i], x, y)){
        label_select_list[i] = !label_select_list[i];
        return {
          label_select_list: label_select_list.slice(),
          new_data: infoFilter({
            data, 
            unit,
            color_list, 
            group_label_list, 
            subgroup_label_list,
            group_is_select: label_select_list.slice(n),
            subgroup_is_select: label_select_list.slice(0, n)
          })
        };
      }
    }
    return;
  }
  const updatePathList = (label_pos_list: Array<CanvasRectKwargs>) => {
    label_path_list = label_pos_list.map((path)=> {
      const res = new Path2D();
      res.rect(path.x, path.y, path.w, path.h);
      return res;
    });
  }
  return {
    getLabelPos,
    checkUpdateView
  };
}

interface InfoFilterKwargs extends ChartInfo {
  group_is_select: Array<boolean>,
  subgroup_is_select: Array<boolean>,
}
function infoFilter(kwargs: InfoFilterKwargs): ChartInfo{
  const {
    data,
    color_list,
    group_is_select,
    subgroup_is_select,
    group_label_list, 
    subgroup_label_list,
    unit
  } = kwargs;
  
  const new_data: ChartData = [];
  const new_color_list: ChartColorList = [];
  const new_group_label_list: Array<string> = [];
  const new_subgroup_label_list: Array<string> = [];
  data.forEach((group, i)=> {
    if (group_is_select[i]){
      new_data.push(group.filter((subgroup, j)=> subgroup_is_select[j]));
      new_group_label_list.push(group_label_list[i]);
    }
  });

  subgroup_label_list.forEach((label, i)=> {
    if (subgroup_is_select[i]){
      new_subgroup_label_list.push(label);
      new_color_list.push(color_list[i]);
    }
  });

  return {
    unit,
    data: new_data,
    color_list: new_color_list,
    group_label_list: new_group_label_list,
    subgroup_label_list: new_subgroup_label_list
  };
}

type GetLabelGroupPosKwargs = {
  label_list: Array<string>,
  boundary: ChartPosBoundary
}
function getLabelGroupPos(kwargs: GetLabelGroupPosKwargs): Array<CanvasRectKwargs>{
  const {
    label_list,
    boundary
  } = kwargs;

  const pos_y_list = getStartOfRangeList({
    start: boundary.top,
    end: boundary.bottom,
    cnt_interval: label_list.length
  });
  const unit = pos_y_list[1] - pos_y_list[0];
  const y_margin = unit * 0.1;
  const h = unit - y_margin;

  const w = boundary.right - boundary.left;
  return pos_y_list.map((pos)=> ({
    x: boundary.left,
    y: pos + y_margin,
    h, w
  }));
}