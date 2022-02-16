type ZeroArgAction = () => any;

/**
 * @returns a function that make animation by executing action within discontinuous intervals.
 * the action is a function that takes zero args.
 */
 export default function makeAnimationCreator(): ((action: ZeroArgAction)=> any){
  let ticking = false;
  function makeAnimation(action: ZeroArgAction){
    if (!ticking) { 
      window.requestAnimationFrame( ()=> {
        action();
        ticking = false;
      });
      ticking = true; 
    }
  }
  return makeAnimation;
}