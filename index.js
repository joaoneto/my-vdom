let dom = {
  nodeName: 'div',
  nodeValue: '',
  attrs: {},
  children: []
};

const _append = (element, parent) => {
  // console.log(`[V-DOM _append] ${element.nodeName} to ${parent.nodeName}`);
  parent.children.push(element);
  return element;
};

const _createElement = (nodeName, attrs = {}, children = []) => {
  // console.log(`[V-DOM _createElement] ${nodeName}`);
  let element = {
    nodeName: nodeName.toLowerCase(),
    nodeValue: '',
    attrs,
    children
  };
  return element;
};

const _setAttr = (element, attr, value) => {
  // console.log(`[V-DOM _setAttr] ${attr} to ${element.nodeName}`);
  element.attrs[attr] = value;
  return element;
};

const _setText = (element, str) => {
  // console.log(`[V-DOM _setText] ${str} to ${element.nodeName}`);
  element.nodeValue = str;
  return element;
};

const _diff = (before, after) => {

};

const _renderDOM = (element, domElement) => {
  const nodeRef = element.nodeRef = document.createElement(element.nodeName);

  for (let attr in element.attrs) {
    nodeRef.setAttribute(attr, element.attrs[attr]);
  }
  nodeRef.appendChild(document.createTextNode(element.nodeValue));

  element.children.forEach((child) => {
    _renderDOM(child, nodeRef);
  });

  domElement.appendChild(nodeRef);

  return domElement;
};

let ul = _createElement('ul');
_append(ul, dom);

for (let x = 0; x < 1000; x++) {
  _append(
    _setAttr(_setText(_createElement('a'), `My link ${x}`), 'href', '#'),
    _setText(
      _append(
        _createElement('span'),
        _setAttr(
          _append(
            _createElement('li'),
            ul
          ),
          'id', x
        )
      ),
      'SPAM ;)'
    )
  );
}

const DOMRoot = _renderDOM(dom, document.getElementById('root'));

console.log('VDOM', dom);
console.log('DOMRoot', DOMRoot);
