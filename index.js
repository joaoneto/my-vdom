let dom = {
  attrs: [],
  children: []
};

const _append = (element, parent) => {
  parent.children.push(element);
  return element;
};

const _createElement = (nodeName, attrs = {}, children = []) => {
  let element = {
    nodeName: nodeName.toLowerCase(),
    attrs,
    children
  };
  return element;
};

const _diff = (before, after) => {

};


let el = _createElement('div');
_append(el, dom);
_append(el, dom);

console.log(dom);
