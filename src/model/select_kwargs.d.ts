/**
 * used in rendering select component 
 * list: Array<string>, option to select.
 * selectFunc: (number)=> any, func used to select ith option.
 * */
interface MySelectKwargs {
  list: Array<string>,
  selectFunc: (idx: number)=> any
}