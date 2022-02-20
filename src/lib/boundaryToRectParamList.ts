/**
 * convert boundary to [x,y,w,h] for drawing canvas rect.
 * @param boundary ChartPosBoundary
 * @returns tuple<number>
 */
export default function boundaryToRectParamList(boundary: ChartPosBoundary): CanvasRectParamList{
  return ([
    boundary.left,
    boundary.top,
    boundary.right - boundary.left, 
    boundary.bottom - boundary.top, 
  ]);
}