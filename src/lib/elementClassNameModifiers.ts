import {default as CLS_MAP} from '../datastore/class_name.json';
const changeClsName = {
  toSuccess,
  toLoading,
  toEmtpy,
  toFail
};

function toSuccess(element: HTMLElement){
  modify(element, CLS_MAP.success);
}
function toLoading(element: HTMLElement){
  modify(element, CLS_MAP.loading);
}
function toEmtpy(element: HTMLElement){
  modify(element, CLS_MAP.empty);
}
function toFail(element: HTMLElement){
  modify(element, CLS_MAP.fail);
}

function modify(element: HTMLElement, new_cls_name: string){
  if (! /c_\d+/.test(element.className)){
    element.className += ` ${new_cls_name}`;
    return;
  }
  element.className = element.className.replace(/c_\d+/, new_cls_name);
}
export default changeClsName;