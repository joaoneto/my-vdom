let vDOM = {
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
  let node;

  if (element.nodeName === 'textNode') {
    node = document.createTextNode(element.attrs.value);
  } else {
    node = document.createElement(element.nodeName);

    for (let attr in element.attrs) {
      node.setAttribute(attr, element.attrs[attr]);
    }

    element.children.forEach((child) => {
      _renderDOM(child, node);
    });
  }

  domElement.appendChild(node);

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

_append(ul, vDOM);

const DOMRoot = _renderDOM(vDOM, document.getElementById('root'));

console.log('VDOM', vDOM);
console.log('DOMRoot', DOMRoot);
