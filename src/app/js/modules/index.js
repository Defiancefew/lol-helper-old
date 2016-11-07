import { combineReducers } from 'redux';
import talents from './talents';
import search from './search';
import { routerReducer as routing } from 'react-router-redux';

export default combineReducers({ talents, search, routing });