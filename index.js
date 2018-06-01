let vDOM = {
  nodeName: 'div',
  attributes: {},
  children: []
};

const _append = (element, parent) => {
  parent.children.push(element);
  return element;
};

const _createElement = (nodeName, attributes, children = []) => {
  attributes = attributes || {};
  children = children || [];
  let element = {
    nodeName,
    attributes,
    children
  };
  return element;
};

const _createTextNode = (value = '') => {
  return _createElement('text', { value });
};

const _renderDOM = (element, domElement) => {
  if (element.nodeName === 'text') {
    let node = document.createTextNode(element.attributes.value);
    element.node = node;
    domElement.appendChild(node);
    return domElement;
  }

  let node = document.createElementNS('http://www.w3.org/1999/xhtml', element.nodeName);
  element.node = node;

  for (let attribute in element.attributes) {
    node.setAttributeNS(null, attribute, element.attributes[attribute]);
  }

  element.children.forEach((child) => {
    _renderDOM(child, node);
  });

  domElement.appendChild(node);

  return domElement;
};

const _isChild = (children, node) => {
  return children.some(child => child.node === node);
};

const _diff = (element) => {
  const node = element.node;
  let patches = [];

  // 1. get attributes diff
  const attributesNames = [...new Set([...Object.values(node.attributes).map(attribute => attribute.name), ...Object.keys(element.attributes)])];
  const attributesCount = Math.max(node.attributes.length, attributesNames.length);
  for (let index = 0; index < attributesCount; index++) {
    const nodeAttributeValue = node.getAttribute(attributesNames[index]);
    const elementAttributeValue = element.attributes[attributesNames[index]];

    if (elementAttributeValue && nodeAttributeValue !== elementAttributeValue) {
      patches.push({ action: 'UPDATE_ATTRIBUTE', index, parent: node, attribute: { name: attributesNames[index], value: elementAttributeValue } });
    } else if (!elementAttributeValue && nodeAttributeValue) {
      patches.push({ action: 'REMOVE_ATTRIBUTE', index, parent: node, attribute: { name: attributesNames[index] } });
    }
  }

  // 2. get children diff
  const childCount = Math.max(node.childNodes.length, element.children.length);
  for (let index = 0; index < childCount; index++) {
    if (!node.childNodes[index] && element.children[index]) {
      patches.push({ action: 'ADD_CHILD', index, parent: node, element: element.children[index] });
    } else if (!_isChild(element.children, node.childNodes[index])) {
      patches.push({ action: 'REMOVE_CHILD', index, parent: node, element: node.childNodes[index] });
    } else if (node.childNodes[index].nodeName === '#text' && node.childNodes[index].nodeValue !== element.children[index].attributes.value) {
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
      case 'UPDATE_ATTRIBUTE': {
        patch.parent.setAttributeNS(null, patch.attribute.name, patch.attribute.value);
        break;
      }
      case 'REMOVE_ATTRIBUTE': {
        patch.parent.removeAttribute(patch.attribute.name);
        break;
      }
      case 'ADD_CHILD': {
        _renderDOM(patch.element, patch.parent);
        break;
      }
      case 'REMOVE_CHILD': {
        element.node.removeChild(patch.element);
        break;
      }
      case 'REPLACE_CHILD': {
        element.node.childNodes[patch.index].nodeValue = patch.element.attributes.value;
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
ul.children[8].children[0].attributes.value = 'Lorem ipsum ';
ul.children[8].children[2].attributes.value = ' dolor sit amet';
_updateDOM(ul.children[8]);

// always need to pass current element on _updateDOM, to prevent deep children diff
ul.children[8].children[1].children[0].children[0].attributes.value = ' ------- ';
_updateDOM(ul.children[8].children[1].children[0]);

// add className attribute on ul
ul.attributes.class = 'my-ul';
_updateDOM(ul);

// update className on ul
ul.attributes.class = 'my-ul-green';
_updateDOM(ul);

// delete className on ul
delete ul.attributes.class;
_updateDOM(ul);
