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

  // 2. get children diff
  const childCount = Math.max(node.childNodes.length, element.children.length);
  for (let index = 0; index < childCount; index++) {
    if (!node.childNodes[index] && element.children[index]) {
      patches.push({ action: 'ADD_CHILD', index, parent: node, element: element.children[index] });
    } else if (!_isChild(element.children, node.childNodes[index])) {
      patches.push({ action: 'REMOVE_CHILD', index, parent: node, element: node.childNodes[index] });
    } else if (node.childNodes[index].nodeName === '#text' && node.childNodes[index].nodeValue !== element.children[index].attrs.value) {
      patches.push({ action: 'REPLACE_CHILD', index, parent: node, element: element.children[index] });
    }
  }

  // 3. get deep children diff
  // element.children.forEach(child => {
  //   if (child.node) patches = patches.concat(_diff(child));
  // });

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
        element.node.removeChild(patch.element);
        break;
      }
      case 'REPLACE_CHILD': {
        element.node.childNodes[patch.index].nodeValue = patch.element.attrs.value;
        break;
      }
    }
  });
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

for (let x = 0; x < 10; x++) {
  _append(createLi(x), ul);
}

_append(ul, vDOM);

const DOMRoot = _renderDOM(vDOM, document.getElementById('root'));

console.log('vDOM', vDOM);
console.log('DOMRoot', DOMRoot);

// add a li child on ul parent
_append(createLi(Date.now().toString(32)), ul);
_updateDOM(ul);

// remove a li child from ul parent
ul.children.splice(1, 1);
_updateDOM(ul);

// update a li text child nodeValue
ul.children[8].children[0].attrs.value = 'Lorem ipsum ';
ul.children[8].children[2].attrs.value = ' dolor sit amet';
_updateDOM(ul.children[8]);

// always need to pass current element on _updateDOM, to prevent deep children diff
ul.children[8].children[1].children[0].children[0].attrs.value = ' ------- ';
_updateDOM(ul.children[8].children[1].children[0]);
