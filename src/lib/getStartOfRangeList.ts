interface GetRangeListKwargs {
  start: number,
  end: number,
  cnt_interval: number
}
/**
 * split the length into intervals and return a array of start of each interval.
 * @param kwargs contains following keys:
 * - start: number, as the start of first interval
 * - end: number, as the end of last interval.
 * - cnt_interval: number, how many intervals to split.
 * @returns Array<number>, which length = cnt_interval + 1.
 */
export default function getStartOfRangeList(kwargs: GetRangeListKwargs): Array<number>{
  const res = [];
  const {start, end, cnt_interval} = kwargs;
  const step = (end - start) / cnt_interval;
  let interval_start = start - step;
  for (let i = 0; i <= cnt_interval; i += 1){
    interval_start += step;
    res.push(interval_start);
  }
  return res;
}