import {default as CLS_MAP} from '../datastore/class_name.json';
const changeClsName = {
  toSuccess,
  toLoading,
  toEmtpy,
  toFail,
  toActive,
  toInactive
};

const STATE_REGEXP = /c_\d+/;
function toSuccess(element: HTMLElement){
  modify(element, STATE_REGEXP, CLS_MAP.success);
}
function toLoading(element: HTMLElement){
  modify(element, STATE_REGEXP, CLS_MAP.loading);
}
function toEmtpy(element: HTMLElement){
  modify(element, STATE_REGEXP, CLS_MAP.empty);
}
function toFail(element: HTMLElement){
  modify(element, STATE_REGEXP, CLS_MAP.fail);
}

const ACT_REGEXP = /a_\d+/;
function toActive(element: HTMLElement){
  modify(element, ACT_REGEXP, CLS_MAP.active);
}
function toInactive(element: HTMLElement){
  modify(element, ACT_REGEXP, CLS_MAP.inactive);
}

function modify(element: HTMLElement, reg_ex: RegExp, new_cls_name: string){
  if (! reg_ex.test(element.className)){
    element.className += ` ${new_cls_name}`;
    return;
  }
  element.className = element.className.replace(reg_ex, new_cls_name);
}
export default changeClsName;