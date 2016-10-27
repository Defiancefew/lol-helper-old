import { remote } from 'electron';
import update from 'react-addons-update';
import { reduce } from 'lodash';

const lolApi = remote.require('./api/lolApi');
const dragonApi = remote.require('./api/dataDragonApi');

const FETCH_STATIC_DATA_SUCCESS = 'app/search/FETCH_STATIC_DATA_SUCCESS';
const FETCH_STATIC_DATA_START = 'app/search/FETCH_STATIC_DATA_START';
const FETCH_STATIC_DATA_ERROR = 'app/search/FETCH_STATIC_DATA_ERROR';
const CHANGE_FILTER_VALUE = 'app/search/CHANGE_FILTER_VALUE';

export const changeFilter = filter => ({ type: CHANGE_FILTER_VALUE, payload: filter });

export const fetchData = () =>
  (dispatch, getState) => {
    // TODO Add this when options will be done
    // if (getState().options.apiKey) {
    //
    // }
    dispatch({ type: FETCH_STATIC_DATA_START });
    dragonApi.getData()
      .then(response =>
        dispatch({
          type: FETCH_STATIC_DATA_SUCCESS,
          payload: response
        }))
      .catch(err => dispatch({ type: FETCH_STATIC_DATA_ERROR, payload: err }));
  };

const initialState = {
  filters: {
    champions: true,
    items: true,
    summonerspells: true,
    mastery: true,
    rune: true,
    summoner: true
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_STATIC_DATA_START:
      return state;
    case FETCH_STATIC_DATA_SUCCESS:
      return { ...state, data: action.payload };
    case FETCH_STATIC_DATA_ERROR:
      return { state, err: action.payload };
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
