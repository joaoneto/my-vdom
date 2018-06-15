import { Component, _append, _createElement, _renderDOM, _updateDOM } from './my-vdom';

// app _createElement JSX abstraction

class App extends Component {
  render() {
    return (
      <div>{this.attributes.children}</div>
    );
  }
}

class Foo extends Component {
  constructor(attributes) {
    super(attributes);
    // this.setState({ x: 0 });
  }

  render() {
    let x = 1;
    const el = <text value={x} />;
    setInterval(() => {
      x++;
      el.attributes.value = x;
      _updateDOM(el);
    }, 1000);

    return (
      <div>Foo {el} --- {this.attributes.children}</div>
    );
  }
}

_renderDOM(<App id="1"><div>lalala<Foo>Bar</Foo></div></App>, document.getElementById('root'));

// app _createElement no JSX
_renderDOM(_createElement(
  'div',
  { id: '1' },
  _createElement(
    'div',
    null,
    'lalala',
    _createElement(
      'div',
      null,
      'Bar'
    )
  )
), document.getElementById('root2'));

// legacy playground
/*
let vDOM = {
  nodeName: 'div',
  attributes: {},
  children: []
};

let ul = _createElement('ul');

const createLi = (x) => {
  return (
    <li>
      SPAM
      <span id={x}><a href="#">My link {x}</a></span>
      ;)
    </li>
  );
};

for (let x = 0; x < 10; x++) {
  _append(createLi(x), ul);
}

_append(ul, vDOM);

const DOMRoot = _renderDOM(<App></App>, document.getElementById('root'));

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

const component = () => (
  <div>Lalala</div>
);
*/
