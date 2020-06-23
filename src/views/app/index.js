import React, { Component } from 'react';
import {
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

import Home from "../../views/home/index.js";

class App extends Component {
  render() {
    return (
      <div>
          <Switch>
            <Route exact path="/" component={Home}/>
          </Switch>

       </div>
    )
  }
}

export default App;
