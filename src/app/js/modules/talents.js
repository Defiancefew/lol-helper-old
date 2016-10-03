import { remote } from 'electron';
import testMasteries from '../../../../masteries.json';

const fetchMasteries = remote.require('./api/masteryFeed');

const FETCH_MASTERIES_SUCCESS = 'app/talents/FETCH_MASTERIES_SUCCESS';
const FETCH_MASTERIES_START = 'app/talents/FETCH_MASTERIES_START';
const FETCH_MASTERIES_ERROR = 'app/talents/FETCH_MASTERIES_ERROR';

const ADD_MASTERY = 'app/talents/ADD_MASTERY';
const REMOVE_MASTERY = 'app/talents/REMOVE_MASTERY';


export const loadMasteries = () =>
  dispatch => {
    dispatch({ type: FETCH_MASTERIES_START });
    // fetchMasteries.init()
    //   .then(response => dispatch(FETCH_MASTERIES_SUCCESS, response))
    //   .catch(err => dispatch(FETCH_MASTERIES_ERROR, err));

    setTimeout(() => {
      dispatch({ type: FETCH_MASTERIES_SUCCESS, payload: testMasteries });
    }, 500);
  };

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_MASTERIES_SUCCESS:
      return { ...state, masteries: action.payload };
    case FETCH_MASTERIES_START:
      return { ...state };
    default:
      return state;
  }
}
