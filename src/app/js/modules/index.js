import { combineReducers } from 'redux';
import talents from './talents';
import search from './search';

export default combineReducers({ talents, search });