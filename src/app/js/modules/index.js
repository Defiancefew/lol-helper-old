import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import talents from './talents';
import search from './search';
import ftp from './ftp';
import summoner from './summoner';

export default combineReducers({ talents, search, routing, ftp, summoner });
