import { remote } from 'electron';
import update from 'react-addons-update';
import { calculatePointsLeft, rankPointsSum } from '../helpers';
import testMasteries from '../../../offline/masteries_composed.json';

const fetchMasteries = remote.require('./api/masteryFeed');

const FETCH_MASTERIES_SUCCESS = 'app/talents/FETCH_MASTERIES_SUCCESS';
const FETCH_MASTERIES_START = 'app/talents/FETCH_MASTERIES_START';
const FETCH_MASTERIES_ERROR = 'app/talents/FETCH_MASTERIES_ERROR';

const MASTERY_ADD = 'app/talents/MASTERY_ADD';
const MASTERY_ADD_NEW = 'app/talents/MASTERY_ADD_NEW';
const MASTERY_REMOVE = 'app/talents/MASTERY_REMOVE';
const MASTERY_RESET = 'app/talents/MASTERY_RESET';

export const loadMasteries = () =>
  (dispatch) => {
    dispatch({ type: FETCH_MASTERIES_START });
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        dispatch(
          {
            type: FETCH_MASTERIES_SUCCESS,
            payload: testMasteries
          }
        );
      }, 300);
    } else {
      fetchMasteries.init()
        .then(response => dispatch(FETCH_MASTERIES_SUCCESS, response))
        .catch(err => dispatch(FETCH_MASTERIES_ERROR, err));
    }
  };

export const addMastery = mastery =>
  (dispatch, getState) => {
    const { branchState, pointsLeft, masteryState } = getState().talents;
    const { name, rank, branch, pointsReq } = mastery;
    const foundActiveMastery = masteryState[name];

    // Block mastery adding if you don't have enough points required.
    // Block the tier if masteries spent on this tier is enough to go further.
    // Block mastery adding if 30 points spent already.
    if (
      pointsReq > branchState[branch] ||
      rankPointsSum(pointsReq, rank) <= branchState[branch] ||
      pointsLeft === 0) {
      return;
    }

    if (foundActiveMastery) {
      // Mastery does not exceed the given rank, then we add a point to it
      if (foundActiveMastery.activePoints < rank) {
        // Replace mastery active points property and refresh the branchState counter
        dispatch({ type: MASTERY_ADD, payload: mastery });
      }
      return;
    }

    // If we click mastery for the first time, then simply add the point to the branchState counter
    // and push it to masteryState
    dispatch({ type: MASTERY_ADD_NEW, payload: mastery });
  };

export const removeMastery = mastery =>
  (dispatch, getState) => {
    const { branchState, masteryState } = getState().talents;
    const { name, rank, branch, pointsReq } = mastery;
    const foundActiveMastery = masteryState[name];

    if (foundActiveMastery) {
      // Can't reduce mastery level below zero
      if (foundActiveMastery.activePoints === 0) {
        return;
      }

      // We can't remove lower-tier masteries before we remove the higher one
      if (rankPointsSum(pointsReq, rank) < branchState[branch]) {
        return;
      }

      dispatch({ type: MASTERY_REMOVE, payload: mastery });
    }
  };

export const resetMastery = () =>
  dispatch =>
    dispatch({ type: MASTERY_RESET });

const initialState = {
  masteryState: {},
  branchState: {
    Cunning: 0,
    Ferocity: 0,
    Resolve: 0
  },
  pointsLeft: 30
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_MASTERIES_SUCCESS:
      return {
        ...state,
        masteries: payload
      };
    case FETCH_MASTERIES_START:
      return initialState;
    case FETCH_MASTERIES_ERROR: // TODO Change this
      return initialState;
    case MASTERY_ADD:
      return update(state, {
        branchState: {
          [payload.branch]: { $apply: point => point + 1 }
        },
        masteryState: {
          [payload.name]: { activePoints: { $apply: point => point + 1 } }
        },
        pointsLeft: { $apply: point => point - 1 }
      });
    case MASTERY_ADD_NEW:
      return update(state, {
        branchState: {
          [payload.branch]: { $apply: point => point + 1 }
        },
        masteryState: {
          $merge: {
            [payload.name]: {
              ...payload,
              activePoints: 1
            }
          }
        },
        pointsLeft: { $apply: point => point - 1 }
      });
    case MASTERY_REMOVE:
      return update(state, {
        branchState: {
          [payload.branch]: { $apply: point => point - 1 }
        },
        masteryState: {
          [payload.name]: {
            activePoints: { $apply: point => point - 1 }
          }
        },
        pointsLeft: { $apply: point => point + 1 }
      });
    case MASTERY_RESET:
      return { ...state, ...initialState };
    default:
      return state;
  }
}
