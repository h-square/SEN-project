import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Indicators from './pages/indicators/Indicators';
import Optsim from './pages/options/Optsim';
import Reports from './pages/reports/Reports';
import CookieTest from './pages/cookietest/Cookietest'
import Login from './pages/user/Login';
import UserHome from './pages/user/UserHome';
import Peer_comp from './pages/peer-comp/Peer_comp';
import Support from './pages/Help_page/Support'
class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/indicators' component={Indicators}/>
          <Route path='/optsim' component={Optsim}/>
          <Route path='/reports' component={Reports}/>
          <Route path='/cookietest' component={CookieTest}/>
          <Route path='/login' component={Login}/>
          <Route path='/user/home' component={UserHome}/>
          <Route path='/peercomp' component={Peer_comp}/>
          <Route path='/support' component={Support}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;