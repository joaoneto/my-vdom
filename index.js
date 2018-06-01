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
  return _createElement('text', { value });
};

const _renderDOM = (element, domElement) => {
  if (element.nodeName === 'text') {
    let node = document.createTextNode(element.attrs.value);
    element.node = node;
    domElement.appendChild(node);
    return domElement;
  }

  let node = document.createElementNS('http://www.w3.org/1999/xhtml', element.nodeName);
  element.node = node;

  for (let attr in element.attrs) {
    node.setAttributeNS(null, attr, element.attrs[attr]);
  }

  element.children.forEach((child) => {
    _renderDOM(child, node);
  });

  domElement.appendChild(node);

  return domElement;
};

const _isChild = (children, node) => {
  return children.some(child => child.node === node);
}

const _diff = (element) => {
  const node = element.node;
  let patches = [];
  // 1. get attributes diff

  // 2. get children patches
  const childCount = Math.max(node.childNodes.length, element.children.length);
  for (let index = 0; index < childCount; index++) {
    if (!node.childNodes[index] && element.children[index]) {
      patches.push({ action: 'ADD_CHILD', index, parent: node, element: element.children[index] });
    } else if (!_isChild(element.children, node.childNodes[index])) {
      patches.push({ action: 'REMOVE_CHILD', index, parent: node, element: node.childNodes[index] });
    }
  }

  return patches;
};

const _updateDOM = (element) => {
  // 1. generate patch from diff
  const patches = _diff(element);

  // 2. apply patch
  patches.map(patch => {
    switch (patch.action) {
      case 'ADD_CHILD': {
        _renderDOM(patch.element, patch.parent);
        break;
      }
      case 'REMOVE_CHILD': {
        console.log(element.node, patch);
        element.node.removeChild(patch.element);
        break;
      }
    }
  });

  // 3. render with vDOM node reference
};


// app

let ul = _createElement('ul');

const createLi = (x) => {
  return _createElement(
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
}

for (let x = 0; x < 3; x++) {
  _append(createLi(x), ul);
}

_append(ul, vDOM);

const DOMRoot = _renderDOM(vDOM, document.getElementById('root'));

console.log('vDOM', vDOM);
console.log('DOMRoot', DOMRoot);

// update vDOM, adding a li child on ul parent
_append(createLi(Date.now().toString(32)), ul);
_updateDOM(ul);

// update vDOM, removing a li child from ul parent
ul.children.splice(1, 1);
console.log('ul.children', ul.children);
_updateDOM(ul);
