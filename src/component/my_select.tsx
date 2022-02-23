import { useRef, MouseEventHandler } from 'react';
import changeClsName from '../lib/elementClassNameModifiers';
import bodyScrollAction from '../lib/bodyScrollControll';
import makeAnimationCreator from '../lib/makeAnimationCreator';

import { default as CLS_MAP } from '../datastore/class_name.json';

import '../style/my_select.css';

type ClickEventHandlerCreator = (idx: number) => MouseEventHandler<HTMLSpanElement>;

interface MySelectProps extends MySelectKwargs {
  title: string,
}
export default function MySelect(props: MySelectProps){
  const selectedItemRef = useRef<HTMLSpanElement>(null);
  const optionContainerRef = useRef<HTMLDivElement>(null);
  const toggleActions = [changeClsName.toActive, changeClsName.toInactive];
  const bodyScroll = [bodyScrollAction.disable, bodyScrollAction.permit];
  const makeAction = makeAnimationCreator();

  let action_idx = 0;
  const toggleOptionDisplay: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    makeAction(()=> {
      if (optionContainerRef.current){
        bodyScroll[action_idx]();
        toggleActions[action_idx](optionContainerRef.current);
        toggleActions[action_idx](selectedItemRef.current);
        action_idx ^= 1;
      }
    });
  }
  const updateTitle = (new_title: string) => {
    if (selectedItemRef.current){
      selectedItemRef.current.innerText = new_title;
    }
  }
  const selectIthItem: ClickEventHandlerCreator = (idx) => (
    (event)=> {
      event.preventDefault();
      if (idx > props.list.length){
        return;
      }
      (event.target as HTMLElement).parentNode.childNodes.forEach((child, i)=> {
        if (i === idx){
          changeClsName.toActive(child as HTMLElement);
        }
        else {
          changeClsName.toInactive(child as HTMLElement);
        }
      })
      updateTitle(props.list[idx]);
      toggleOptionDisplay(event);
      setTimeout(()=> {
        props.selectFunc(idx);
      }, 0);
    }
  );

  return (
    <div className='my_select'>
      <b>{props.title}</b>
      <span
        ref={selectedItemRef}
        className={`my_select_option selected_item ${CLS_MAP.inactive}`}
        onClick={toggleOptionDisplay}
      />
      <div 
        ref={optionContainerRef}
        className={`my_option_container ${CLS_MAP.inactive} col`}
        onClick={toggleOptionDisplay}
      >
        <div className='my_option_list'>
          {props.list.map((option, i)=>
            <span
              key={`${props.title}_option_${i}`}
              className={`my_select_option ${CLS_MAP.inactive}`}
              onClick={selectIthItem(i)}
            >
              {option}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}