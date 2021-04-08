import { BaunilhaNode, BaunilhaEvents } from "./v-dom";

export default function render(
  nodeTree: BaunilhaNode,
  rootDOMNode?: HTMLElement
) {
  if (typeof nodeTree === "string") {
    const node = document.createTextNode(nodeTree);
    return rootDOMNode ? rootDOMNode.appendChild(node) : node;
  }

  const node = document.createElement(nodeTree.nodeName);

  for (let propName in nodeTree.props) {
    if (propName in BaunilhaEvents) {
      node[propName.toLowerCase()] = nodeTree.props[propName] as () => any;
    } else {
      node.setAttribute(propName, String(nodeTree.props[propName]) || "");
    }
  }

  if (nodeTree.children) {
    if (Array.isArray(nodeTree.children)) {
      nodeTree.children.forEach((childNode: any) => render(childNode, node));
    } else if (typeof nodeTree.children === "object") {
      const childElement = document.createElement(nodeTree.children.nodeName);
      node.appendChild(childElement);
    } else if (typeof nodeTree.children === "string") {
      const childElement = document.createTextNode(nodeTree.children);
      node.appendChild(childElement);
    } else {
      throw new Error("Not compatible children");
    }
  }

  return rootDOMNode ? rootDOMNode.appendChild(node) : node;
}
