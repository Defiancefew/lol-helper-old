import { remote } from 'electron';
import { findIndex, find, reduce } from 'lodash';
import { Map, fromJS } from 'immutable';
import testMasteries from '../../../../masteries.json';

const fetchMasteries = remote.require('./api/masteryFeed');

const FETCH_MASTERIES_SUCCESS = 'app/talents/FETCH_MASTERIES_SUCCESS';
const FETCH_MASTERIES_START = 'app/talents/FETCH_MASTERIES_START';
const FETCH_MASTERIES_ERROR = 'app/talents/FETCH_MASTERIES_ERROR';

const MASTERY_ADD = 'app/talents/MASTERY_ADD';
const MASTERY_REMOVE = 'app/talents/MASTERY_REMOVE';
const MASTERY_RESET = 'app/talents/MASTERY_RESET';

export const loadMasteries = () =>
  dispatch => {
    dispatch({ type: FETCH_MASTERIES_START });
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        dispatch({ type: FETCH_MASTERIES_SUCCESS, payload: testMasteries });
      }, 500);
    } else {
      fetchMasteries.init()
        .then(response => dispatch(FETCH_MASTERIES_SUCCESS, response))
        .catch(err => dispatch(FETCH_MASTERIES_ERROR, err));
    }
  };

export const addMastery = (mastery) =>
  dispatch => {
    dispatch({ type: MASTERY_ADD, payload: mastery });
  };

export const removeMastery = (mastery) =>
  dispatch => {
    dispatch({ type: MASTERY_REMOVE, payload: mastery });
  };

export const resetMastery = () =>
  dispatch => {
    dispatch({ type: MASTERY_RESET });
  };

export const calculatePointsLeft = (branchState) => {
  return 30 - (reduce(branchState, (prev, next) => prev + next) + 1);
};

export const rankPointsSum = (pointsReq, rank) => {
  return parseInt(pointsReq, 10) + parseInt(rank, 10);
};

const masteryActionHelper = (state, payload, type) => {
  const { name, rank, branch, pointsReq } = payload;
  const { branchState, pointsLeft } = state.toJS();
  const foundActiveMastery = state.get('masteryState').toJS()[name];

  if (type === MASTERY_ADD) {
    // const rankPointsSum = parseInt(pointsReq, 10) + parseInt(rank, 10);

    /*
     Block mastery adding if you don't have enough points required.B
     Block the tier if masteries spent on this tier is enough to go further.
     Block mastery adding if 30 points spent already.
     */
    if (
      pointsReq > branchState[branch] ||
      rankPointsSum(pointsReq, rank) === branchState[branch] ||
      pointsLeft === 0) {
      return state;
    }

    if (foundActiveMastery) {
      // Mastery does not exceed the given rank, then we add a point to it
      if (foundActiveMastery.activePoints < rank) {
        // Replace mastery active points property and refresh the branchState counter
        return state
          .updateIn(['branchState', branch], score => score + 1)
          .updateIn(['masteryState', name, 'activePoints'], activePoints => activePoints + 1)
          .update('pointsLeft', () => calculatePointsLeft(branchState));
      }
      return state;
    }

    // If we click mastery for the first time, then simply add the point to the branchState counter
    // and push it to masteryState
    return state
      .updateIn(['branchState', branch], score => score + 1)
      .setIn(['masteryState', name], fromJS({ name, activePoints: 1, branch, pointsReq }))
      .update('pointsLeft', currentPoints => calculatePointsLeft(branchState));
  }

  if (foundActiveMastery) {
    if (foundActiveMastery.activePoints === 0) {
      return state;
    }
    //
    return state
      .updateIn(['branchState', branch], score => score - 1)
      .updateIn(['masteryState', name, 'activePoints'], activePoints => activePoints - 1)
      .update('pointsLeft', currentPoints => currentPoints + 1);
  }
  return state;
};

const initialState = fromJS({
  masteryState: {},
  branchState: {
    cunning: 0,
    ferocity: 0,
    resolve: 0
  },
  pointsLeft: 30
});

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_MASTERIES_SUCCESS:
      return initialState.set('masteries', payload);
    case FETCH_MASTERIES_START:
      return initialState;
    case FETCH_MASTERIES_ERROR: // TODO Change this
      return initialState;
    case MASTERY_ADD:
      return masteryActionHelper(state, payload, type);
    case MASTERY_REMOVE:
      return masteryActionHelper(state, payload, type);
    case MASTERY_RESET: {
      return state.merge({
        masteryState: {},
        branchState: {
          cunning: 0,
          ferocity: 0,
          resolve: 0
        },
        pointsLeft: 30
      });
    }
    default:
      return state;
  }
}
