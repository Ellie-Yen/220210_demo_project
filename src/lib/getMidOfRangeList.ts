interface GetMidOfRangeListKwargs {
  start: number,
  end: number,
  cnt_mid: number
}
/**
 * split the length into intervals and return a array of mid of each interval.
 * @param kwargs contains following keys:
 * - start: number, as the start of first interval
 * - end: number, as the end of last interval.
 * - cnt_mid: number, how many intervals to split.
 * @returns Array<number>, which length = cnt_mid.
 */
export default function getMidOfRangeList(kwargs: GetMidOfRangeListKwargs): Array<number>{
  const res = [];
  const {start, end, cnt_mid} = kwargs;
  const step = (end - start) / (cnt_mid + 1);
  let mid = start / 2;
  for (let i = 0; i <= cnt_mid; i += 1){
    mid += step;
    res.push(mid);
  }
  return res;
}