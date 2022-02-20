import { useEffect, useRef, RefObject } from 'react';
import sizeController from './sizeController';
import makeAnimationCreator from "../lib/makeAnimationCreator";

/**
 * update canvas view when resizing.
 * @param drawAction : CanvasElementAction, a function that draw canvas.
 * @returns RefObject<HTMLCanvasElement>
 */
export default function rwdCanvasRef(drawAction: CanvasElementAction): RefObject<HTMLCanvasElement>{
  const canvasRef = useRef<HTMLCanvasElement>();
  const makeAction = makeAnimationCreator();
  const {isSizeChanged} = sizeController();

  const resizeAndDraw:CanvasElementAction = (element) => {
    // get current render size
    // then set size of element if size is changed.
    // (the result will have unexpect scale ratio without doing this,
    // since canvas has a default size which is different to render one)
    const {width, height} = element.getBoundingClientRect();
    if (isSizeChanged(width, height)){
      element.width = width;
      element.height = height;
      drawAction(element);
    }
  }
  const handleDraw = () => {
    if (!canvasRef.current){
      return;
    }
    resizeAndDraw(canvasRef.current);
  };

  window.addEventListener('resize', ()=> {
    makeAction(handleDraw);
  });
  useEffect(()=> {
    if (!canvasRef.current){
      return;
    }
    makeAction(handleDraw);
  });
  return canvasRef;
}

