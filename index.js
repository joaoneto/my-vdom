let dom = {
  nodeName: 'div',
  attrs: {},
  children: []
};

const _append = (element, parent) => {
  parent.children.push(element);
  return element;
};

const _createElement = (nodeName, attrs = {}, children = []) => {
  let element = {
    nodeName,
    attrs,
    children
  };
  return element;
};

const _createTextNode = (value = '') => {
  return _createElement('textNode', { value });
}

const _diff = (before, after) => {

};

const _renderDOM = (element, domElement) => {
  let nodeRef;

  if (element.nodeName === 'textNode') {
    nodeRef = document.createTextNode(element.attrs.value);
  } else {
    nodeRef = document.createElement(element.nodeName);

    for (let attr in element.attrs) {
      nodeRef.setAttribute(attr, element.attrs[attr]);
    }

    element.children.forEach((child) => {
      _renderDOM(child, nodeRef);
    });
  }

  domElement.appendChild(nodeRef);

  return domElement;
};

let ul = _createElement('ul');

for (let x = 0; x < 3; x++) {
  let li = _createElement(
    'li',
    null,
    [
      _createTextNode('SPAM '),
      _createElement('span', { id: x }, [
        _createElement('a', { href: '#' }, [
          _createTextNode(`My link ${x}`)
        ])
      ]),
      _createTextNode(' ;)'),
    ]
  );
  _append(li, ul);
}

_append(ul, dom);

const DOMRoot = _renderDOM(dom, document.getElementById('root'));

console.log('VDOM', dom);
console.log('DOMRoot', DOMRoot);
