export default function sizeController(){
  let prev_width: number;
  let prev_height: number;

  const update = (new_w: number, new_h: number) => {
    prev_height = new_h;
    prev_width = new_w;
  }
  const isSizeChanged = (new_w: number, new_h: number) => {
    if (prev_height !== new_h ||
      prev_width !== new_w
    ){
      update(new_w, new_h);
      return true;
    }
    return false;
  }
  return {isSizeChanged};
}