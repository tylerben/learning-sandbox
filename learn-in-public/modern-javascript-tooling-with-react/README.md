# Modern JavaScript Tooling With React

This workspace accompanies the awesome course of the same name that Andy Van Slaars put together over at egghead.io. The course can be found at [https://egghead.io/courses/modern-javascript-tooling-with-react](https://egghead.io/courses/modern-javascript-tooling-with-react).

This project does not represent a finished boilerplate app. I coded along for some of the videos but not for others.

## Main Takeaways

This was my first foray into using webpack (haven't had to in the past thanks to Create React App). I expected webpack to be a bit terrifying but it wasn't the boogie man I thought it would be. I can see how it could get complex and messy quick though. I have included some of the notes I took below.

## General

One of the things I initially had questions on with webpack was the difference between loader presets and plugins. I found a helpful [article](https://isamatov.com/webpack-explained-simply-plugins-loaders-and-babel/) from Iskander that breaks it down nicely.

- the difference between presets and plugins for a loader are that a preset is basically a collection of plugins

**Loaders**:

- Work before or at the beginning of the bundle generation
- Loaders work at the individual file level

**Plugins**:

- Work at the end or after of bundle generation
- Plugins work at bundle level
- Plugins have much more control over the bundle

### Hot Reloading vs. Watch Mode

- Hot reloading not only automatically refreshes the page, but refreshes it in a way that doesn't lose our application state
- i.e. if you were working on styling something in an error state, hot reloading allows you to make changes and have the page auto-refresh without having to move through the UI to toggle the error state again

### Analyzing Bundle Size

- parsed size is really the thing we care most about
- webpack build analyzer can be run in static mode so it has a clean exit process
  - outputs an html file that can be opened instead of spinning up a local server

### Useful Babel Plugins

- plugin-proposal-class-properties

  - allows for modern syntax in classes

  ```jsx
  class Counter extends React.Component {
  	state = {
  		count: 0
  	}
  	render() {...}
  }
  ```

- plugin-syntax-dynamic-import

  - allows for code splitting

  ```jsx
  const Chart = React.lazy(() => import("./BarChart"));
  ```

### Webpack Cli

You run webpack in different modes using the cli.

```bash
# production
webpack --mode production

# development
webpack --mode development
```

Webpack can be run in watch mode

```bash
webpack --watch
```

Set the config file that should be used

```bash
webpack --config webpack.config.prod.js
```

You can easily setup and serve a development server

```bash
webpack serve --config webpack.config.dev.js
```

```jsx
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.config.base");

module.exports = merge(baseConfig, {
  mode: "development",
  devServer: {
    contentBase: "./dist",
    port: 9000,
  },
});
```
