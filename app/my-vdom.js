const _append = (element, parent) => {
  parent.children.push(element);
  return element;
};
module.exports._append = _append;

const _createElement = (nodeName, attributes, ...children) => {
  console.log('_createElement', typeof nodeName, nodeName, attributes);
  if (typeof nodeName === 'function') {
    const componentInstance = new nodeName({ ...attributes, children: children[0] });
    const componentElement = componentInstance.render();
    componentInstance.memoizeRenderedElement(componentElement);
    return componentElement;
  }

  attributes = attributes || {};
  children = children || [];
  let element = {
    nodeName,
    attributes,
    children: children.map(child => child.nodeName ? child : _createElement('text', { value: child }))
  };
  return element;
};
module.exports._createElement = _createElement;

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
module.exports._renderDOM = _renderDOM;


const _isChild = (children, node) => {
  return children.some(child => child.node === node);
};
module.exports._isChild = _isChild;

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
module.exports._updateDOM = _updateDOM;

class Component {
  constructor(attributes) {
    this.attributes = attributes;
    console.log('constructor', this.attributes);
  }

  memoizeRenderedElement(element) {
    this.element = element;
    this.element.attributes = this.attributes;
  }

  setState(state) {
    Object.assign(this.state, state);
    // console.log('setState', this.state);
    // console.log(this.render());
    _updateDOM(this.element);
  }
}
module.exports.Component = Component;
