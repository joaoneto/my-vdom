import "./index.css";
import { createElement, CreateBaunilhaNode } from "./lib/v-dom";
import { diff } from "./lib/diff";
import render from "./lib/render";

declare global {
  interface Window {
    _createElement: CreateBaunilhaNode;
  }
}
window._createElement = createElement;

let appNodeTree = null;
let rootNode = null;
let oldNode = {};

let debouneRender;

function reRender() {
  if (debouneRender) {
    window.cancelAnimationFrame(debouneRender);
  }
  debouneRender = window.requestAnimationFrame(function () {
    // @todo make hooks to initialize and destroy timers
    for (var i = 1; i < 9999; i++) {
      window.clearInterval(i);
      window.clearTimeout(i);
    }
    const newApp = appNodeTree();
    // console.log("re render", oldNode, newApp);
    diff(oldNode, newApp)(rootNode.children[0]);
    oldNode = newApp;
  });
}

function MyComponent() {
  let date = Number(new Date());
  setTimeout(() => {
    date = Number(new Date());
    reRender();
  }, 1000);

  // console.log("MyComponent render");

  return (
    <div>
      {`MyComponent says: ${date}`}
    </div>
  );
}

let data = 'type anything';
// @todo: create instance of component
function MyComponentWithDataBind() {
  console.log('MyComponentWithDataBind render');
  const onKeyUp = (e) => {
    data = e.target.value;
    // console.log('data', data);
    reRender();
  };

  return (
    <div>
      <div>
        Bound data:
        {' '}
        {data}
      </div>
      <input value="type anything" type="text" onKeyUp={onKeyUp} />
    </div>
  );
}

appNodeTree = () => (
  <main>
    <MyComponent />
    <MyComponentWithDataBind />
    <button onClick={(e) => reRender()}>
      FORCE RE - RENDER
    </button>
  </main>
);

oldNode = appNodeTree();

function init() {
  rootNode = document.getElementById("root");
  render(appNodeTree(), rootNode);
}

document.addEventListener("DOMContentLoaded", init, true);
