import {
  clearRange,
  drawLabelText
} from './canvasDrawHelpers';

export default async function drawLabelGroup(kwargs: DrawChartLabelKwargs){
  const {
    ctx,
    text_size,
    color_list,
    pos_list,
    label_list,
    label_select_list,
    boundary
  } = kwargs;
  
  // clear graph before
  await clearRange({ctx, boundary});

  // draw label by check if it's selected.
  for (let i = 0; i < label_list.length; i++){
    const {x, y, w, h} = pos_list[i];
    await drawLabelText({
      ctx,
      size: text_size,
      text: label_list[i],
      color: color_list[i],
      is_selected: label_select_list[i], 
      boundary: {
        left: x,
        top: y,
        right: x + w,
        bottom: y + h
      }
    });
  };
}

