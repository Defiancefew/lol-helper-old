import { remote } from 'electron';

const fetchMasteries = remote.require('./api/masteryFeed');

const FETCH_MASTERIES_SUCCESS = 'app/talents/FETCH_MASTERIES_SUCCESS';
const FETCH_MASTERIES_START = 'app/talents/FETCH_MASTERIES_START';
const FETCH_MASTERIES_ERROR = 'app/talents/FETCH_MASTERIES_ERROR';

const ADD_MASTERY = 'app/talents/ADD_MASTERY';
const REMOVE_MASTERY = 'app/talents/REMOVE_MASTERY';

const initialState = {};

export const loadMasteries = () =>
  dispatch => {
    dispatch(FETCH_MASTERIES_START);
    fetchMasteries.init()
      .then(response => dispatch(FETCH_MASTERIES_SUCCESS, response))
      .catch(err => dispatch(FETCH_MASTERIES_ERROR, err));
  };

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_MASTERIES_SUCCESS:
      return { ...state, masteries: action.payload };
    default:
      return state;
  }
}
