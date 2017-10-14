import React, { Component } from 'react';
import Menu from './components/Menu';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GovernmentPage from './pages/GovernmentPage';
import ImmigrantPage from './pages/ImmigrantPage';
import Notifier from './pages/Notifier';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div style={{ marginBottom: 20 }}>
          <Notifier/>

          <Menu/>

          <Switch>
            <Route path="/" exact component={HomePage}/>
            <Route path="/government" exact component={GovernmentPage}/>
            <Route path="/immigrant" exact component={ImmigrantPage}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
