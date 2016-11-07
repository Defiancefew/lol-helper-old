import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import NotFound from './components/NotFound';
import Home from './components/Home';
import Talents from './containers/Talent';
import Search from './containers/Search';
import Summoner from './containers/Summoner';
import Masteries from './components/summoner/Masteries';
import Runes from './components/summoner/Runes';
import Match from './components/summoner/MatchHistory/Match';

export default (
  <div>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="talents" component={Talents} />
      <Route path="search" component={Search} />
      <Route path="summoner/:summonerId" component={Summoner}>
        <Route path="masteries" component={Masteries} />
        <Route path="runes" component={Runes} />
        <Route path="match" component={Match} />
      </Route>
    </Route>
    <Route path="*" component={NotFound} />
  </div>
);
