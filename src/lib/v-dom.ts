/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
type BaunilhaNodeNames = keyof HTMLElementTagNameMap;

type BaunilhaTextNode = string;

type BaunilhaChildren =
  | null
  | undefined
  | BaunilhaNode
  | BaunilhaTextNode
  | BaunilhaChildren[];

interface BaunilhaNodeProps {
  [key: string]: string | number | ((e: any) => any);
}

export interface BaunilhaNode {
  nodeName: BaunilhaNodeNames;
  props: BaunilhaNodeProps;
  children?: BaunilhaChildren;
}

export interface CreateBaunilhaNode {
  (
    nodeName: BaunilhaNodeNames | ((props: any) => BaunilhaNode),
    props: BaunilhaNodeProps,
    ...BaunilhaChildren
  ): BaunilhaNode;
}

export const BaunilhaEvents = {
  onClick: "onClick",
  onKeyDown: "onKeyDown",
  onKeyUp: "onKeyUp",
  onKeyPress: "onKeyPress"
};

export const createElement: CreateBaunilhaNode = (
  nodeName,
  props,
  ...children
) => {
  if (typeof nodeName === "function") {
    const teste = nodeName({ props, children });

    return teste;
  }

  return {
    nodeName,
    props,
    children
  };
};
