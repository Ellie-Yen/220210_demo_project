import { useEffect, useRef } from 'react';
import makeAnimationCreator from "../lib/makeAnimationCreator";

const MIN_W = 320;
const MIN_H = 500;

interface RWDCanvasRefInitKwargs {
  h_ratio: number,
  w_ratio: number,
  drawAction: CanvasElementAction
}
export default function rwdCanvasRef(kwargs: RWDCanvasRefInitKwargs){
  const canvasRef = useRef<HTMLCanvasElement>();
  const {
    h_ratio,
    w_ratio,
    drawAction
  } = kwargs;
  const makeAction = makeAnimationCreator();

  const resizeAndDraw: CanvasElementAction = (element) => {
    element.height = Math.max(window.innerHeight * h_ratio, MIN_H);
    element.width = Math.max(window.innerWidth * w_ratio, MIN_W);
    drawAction(element);
  }
  const handleResize = () => {
    if (!canvasRef.current){
      return;
    }
    resizeAndDraw(canvasRef.current);
  };

  window.addEventListener('resize', ()=> {
    makeAction(handleResize);
  });
  useEffect(()=> {
    if (!canvasRef.current){
      return;
    }
    makeAction(handleResize);
  });

  return canvasRef;
}