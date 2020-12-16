import React from "react";
import { hot } from "react-hot-loader";
import "@babel/polyfill";
import "./index.css";

class App extends React.Component {
  state = {
    count: 0,
  };

  render() {
    return (
      <div>
        <h1>Hello, world</h1>
        <h1>Count: {this.state.count}</h1>
        <button onClick={() => this.setState((s) => ({ count: s.count + 1 }))}>
          +
        </button>
        <button onClick={() => this.setState((s) => ({ count: s.count - 1 }))}>
          -
        </button>
      </div>
    );
  }
}

export default hot(module)(App);
