import { remote } from 'electron';
import update from 'react-addons-update';

const api = remote.require('./api/lolApi');

const CHANGE_FILTER_VALUE = 'app/search/CHANGE_FILTER_VALUE';

export const changeFilter = (filter) => ({ type: CHANGE_FILTER_VALUE, payload: filter });

const initialState = {
  filters: {
    champions: true,
    items: true,
    summonerSpells: true
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CHANGE_FILTER_VALUE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload]: !state.filters[action.payload]
        }
      };
    }
    default:
      return state;
  }
}
