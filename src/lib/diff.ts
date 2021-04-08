import render from "./render";
import { BaunilhaEvents } from "./v-dom";

const diffProps = (prevProps, nextProps) => {
  return (node: HTMLElement) => {
    for (const prop in nextProps) {
      if (!nextProps.hasOwnProperty(prop)) {
        node.removeAttribute(prop);
      } else if (prop in BaunilhaEvents) {
      } else if (
        !prevProps.hasOwnProperty(prop) ||
        prevProps[prop] !== nextProps[prop]
      ) {
        node.setAttribute(prop, nextProps[prop]);
      }
    }
    return node;
  };
};

const diffChildren = (prevChildren = [], nextChildren = []) => {
  const patches = [];

  prevChildren.forEach((prevChild, i) => {
    patches.push(diff(prevChild, nextChildren[i]));
  });

  const addPatches = [];
  for (const addChild of nextChildren.slice(prevChildren.length)) {
    addPatches.push((node) => {
      node.appendChild(render(addChild));
      return node;
    });
  }

  return function parentPatch(parent: HTMLElement) {
    const childNodes = parent?.childNodes;
    const len = patches.length;

    for (let i = 0; i < len; i++) {
      patches[i](childNodes.item(i));
    }

    for (const patch of addPatches) {
      patch(parent);
    }

    return parent;
  };
};

export const diff = (prevNodeTree, nextNodeTree) => {
  if (!nextNodeTree) {
    return function removeNodePatch(node) {
      node?.remove();
      return undefined;
    };
  }

  if (typeof prevNodeTree === "string" || typeof nextNodeTree === "string") {
    if (prevNodeTree !== nextNodeTree) {
      return function stringPatch(node) {
        const newNode = render(nextNodeTree);
        node?.replaceWith(newNode);
        return newNode;
      };
    } else {
      return function noopPatch(node) {
        return undefined;
      };
    }
  }

  const patchProps = diffProps(prevNodeTree.props, nextNodeTree.props);
  const patchChildren = diffChildren(
    prevNodeTree.children,
    nextNodeTree.children
  );

  return function rootPatch(node) {
    patchProps(node);
    patchChildren(node);
    return node;
  };
};
