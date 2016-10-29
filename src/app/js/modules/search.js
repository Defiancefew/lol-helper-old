import { remote } from 'electron';
import _ from 'lodash/fp';
import { regions } from '../../../configs/apiConfig.json';
// import update from 'react-addons-update';
// import { reduce, debounce } from 'lodash';

const cReduce = _.reduce.convert({ cap: false });

const lolApi = remote.require('./api/lolApi');
const dragonApi = remote.require('./api/dataDragonApi');

const FETCH_STATIC_DATA_SUCCESS = 'app/search/FETCH_STATIC_DATA_SUCCESS';
const FETCH_STATIC_DATA_START = 'app/search/FETCH_STATIC_DATA_START';
const FETCH_STATIC_DATA_ERROR = 'app/search/FETCH_STATIC_DATA_ERROR';

const CHANGE_FILTER_VALUE = 'app/search/CHANGE_FILTER_VALUE';
const CLEAN_SUGGESTIONS = 'app/search/CLEAN_SUGGESTIONS';

const SEARCH_DATA_START = 'app/search/SEARCH_DATA_START';
const SEARCH_DATA_END = 'app/search/SEARCH_DATA_END';

const SEARCH_REGION_CHANGED = 'app/search/SEARCH_REGION_CHANGED';

const SEARCH_SUMMONER_START = 'app/search/SEARCH_SUMMONER_START';
const SEARCH_SUMMONER_ERROR = 'app/search/SEARCH_SUMMONER_ERROR';
const SEARCH_SUMMONER_SUCCESS = 'app/search/SEARCH_SUMMONER_SUCCESS';

export const changeFilter = filter => ({ type: CHANGE_FILTER_VALUE, payload: filter });

export const fetchData = () =>
  (dispatch) => {
    // TODO Add this when options will be done
    // if (getState().options.apiKey) {
    //
    // }
    dispatch({ type: FETCH_STATIC_DATA_START });
    return dragonApi.getData()
      .then(response =>
        dispatch({ type: FETCH_STATIC_DATA_SUCCESS, payload: response }))
      .catch(err => dispatch({ type: FETCH_STATIC_DATA_ERROR, payload: err }));
  };

// written separately from searchData method since i can't assign search start in debounced method
export const searchStart = () => ({ type: SEARCH_DATA_START });

export const searchData = searchValue =>
  (dispatch, getState) => {
    const state = getState().search;
    const searchString = _.trim(searchValue);
    const searchStore = (_.isEmpty(state.suggestions) || searchValue.length <= state.value.length)
      ? state.data
      : state.suggestions;

    if (searchString) {
      const searchIteratee = filteredItem => (new RegExp(searchString, 'i')
        .test(filteredItem.name));

      const suggestions = _.flow(
        _.pickBy(filter => !!filter),
        cReduce((total, value, key) =>
          ({ ...total, [key]: _.pickBy(searchIteratee, searchStore[key]) }), {}),
        _.pickBy(suggestion => !_.isEmpty(suggestion))
      )(state.filters);

      dispatch({
        type: SEARCH_DATA_END,
        payload: {
          suggestions,
          value: searchString
        }
      });
    } else {
      dispatch({ type: CLEAN_SUGGESTIONS });
    }
  };

export const cleanSuggestions = () => ({ type: CLEAN_SUGGESTIONS });

export const getSummoner = (name) =>
  (dispatch, getState) => {
    dispatch({ type: SEARCH_SUMMONER_START });
    const region = getState().search.selectedRegion.short;

    lolApi.createQuery('summoner', { name, region })
      .then((result) => {
        console.log(result);
        dispatch({ type: SEARCH_SUMMONER_SUCCESS, payload: result });
      })
      .catch(err => dispatch({ type: SEARCH_SUMMONER_ERROR, payload: err }));
  };

export const selectRegion = region =>
  ({ type: SEARCH_REGION_CHANGED, payload: region });

const initialState = {
  filters: {
    champion: true,
    item: true,
    mastery: true,
    rune: true,
    summoner: true
  },
  value: '',
  searching: false,
  suggestions: {},
  regions,
  selectedRegion: regions.EUW
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_STATIC_DATA_START:
      return state;
    case FETCH_STATIC_DATA_SUCCESS:
      return { ...state, data: action.payload };
    case FETCH_STATIC_DATA_ERROR:
      return { ...state, err: action.payload };
    case CHANGE_FILTER_VALUE:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload]: !state.filters[action.payload]
        }
      };
    case SEARCH_REGION_CHANGED:
      return {
        ...state,
        selectedRegion: action.payload
      };
    case CLEAN_SUGGESTIONS:
      return {
        ...state,
        suggestions: initialState.suggestions,
        value: ''
      };
    case SEARCH_DATA_START:
      return {
        ...state,
        searching: true
      };
    case SEARCH_DATA_END:
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          ...action.payload.suggestions
        },
        value: action.payload.value,
        searching: false
      };
    default:
      return state;
  }
}
