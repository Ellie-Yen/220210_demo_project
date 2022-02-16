interface GetRangeListKwargs {
  start: number,
  end: number,
  cnt_interval: number
}
export default function getRangeList(kwargs: GetRangeListKwargs): Array<number>{
  const res = [];
  const {start, end, cnt_interval} = kwargs;
  const step = (end - start) / cnt_interval;
  let cur = start - step;
  for (let i = 0; i <= cnt_interval; i += 1){
    cur += step;
    res.push(cur);
  }
  return res;
}