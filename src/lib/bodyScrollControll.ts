const bodyScrollAction = {
  disable,
  permit
}
function disable(){
  document.body.style.overflow = 'hidden';
}

function permit(){
  document.body.style.overflow = 'auto';
}

export default bodyScrollAction;