export default function chartInfoController(chart_info: ChartInfo){
  const {
    data, 
    color_list, 
    group_label_list, 
    subgroup_label_list
  } = chart_info;
  const group_is_display = group_label_list.map((k)=> true);
  const subgroup_is_display = subgroup_label_list.map((k)=> true);

  const updateGroupDisplay = (i: number) => {
    group_is_display[i] = !group_is_display[i];
    return updateInfo(group_is_display, subgroup_is_display);
  }
  const updateSubgroupDisplay = (i: number) => {
    subgroup_is_display[i] = !subgroup_is_display[i];
    return updateInfo(group_is_display, subgroup_is_display);
  }
  const updateInfo = (
    group_is_display: Array<boolean>,
    subgroup_is_display: Array<boolean>
    ) => (infoFilter({
      data, 
      color_list, 
      group_label_list, 
      subgroup_label_list,
      group_is_display,
      subgroup_is_display
    })
  );
  
  return ({
    updateGroupDisplay,
    updateSubgroupDisplay
  });
}

interface InfoFilterKwargs extends ChartInfo {
  group_is_display: Array<boolean>,
  subgroup_is_display: Array<boolean>,
}
function infoFilter(kwargs: InfoFilterKwargs): ChartInfo{
  const {
    data,
    color_list,
    group_is_display,
    subgroup_is_display,
    group_label_list, 
    subgroup_label_list
  } = kwargs;

  const new_data: ChartData = [];
  const new_color_list: ChartColorList = [];
  const new_group_label_list: Array<string> = [];
  const new_subgroup_label_list: Array<string> = [];
  data.forEach((group, i)=> {
    if (group_is_display[i]){
      new_data.push(group.filter((subgroup, j)=> subgroup_is_display[j]));
      new_group_label_list.push(group_label_list[i]);
    }
  });

  subgroup_label_list.forEach((label, i)=> {
    if (subgroup_is_display[i]){
      new_subgroup_label_list.push(label);
      new_color_list.push(color_list[i]);
    }
  });

  return {
    data: new_data,
    color_list: new_color_list,
    group_label_list: new_group_label_list,
    subgroup_label_list: new_subgroup_label_list
  };
}