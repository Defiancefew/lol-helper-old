import { remote } from 'electron';
import _ from 'lodash/fp';
import { regions } from '../../../configs/apiConfig.json';
import { apiKey } from '../../../configs/apiKey.json';

const cReduce = _.reduce.convert({ cap: false });

const ApiClass = remote.require('./api/lolApi').lolApi;
const lolApi = new ApiClass(apiKey);
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

const SEARCH_TEAM_START = 'app/search/SEARCH_TEAM_START';
const SEARCH_TEAM_ERROR = 'app/search/SEARCH_TEAM_ERROR';
const SEARCH_TEAM_SUCCESS = 'app/search/SEARCH_TEAM_SUCCESS';

const SEARCH_SUMMONER_DATA_SUCCESS = 'app/search/SEARCH_SUMMONER_DATA_SUCCESS';
const SEARCH_SUMMONER_DATA_START = 'app/search/SEARCH_SUMMONER_DATA_START';
const SEARCH_SUMMONER_DATA_ERROR = 'app/search/SEARCH_SUMMONER_DATA_ERROR';

const SEARCH_SUMMONER_RECENT_START = 'app/search/SEARCH_SUMMONER_RECENT_START';
const SEARCH_SUMMONER_RECENT_SUCCESS = 'app/search/SEARCH_SUMMONER_RECENT_SUCCESS';
const SEARCH_SUMMONER_RECENT_ERROR = 'app/search/SEARCH_SUMMONER_RECENT_ERROR';

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

// written separately from searchOfflineData since
// i can't assign search start in debounced method
export const searchStart = () => ({ type: SEARCH_DATA_START });

export const searchOfflineData = searchValue =>
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

export const getSummoner = name =>
  (dispatch, getState) => {
    dispatch({ type: SEARCH_SUMMONER_START });
    const region = getState().search.selectedRegion.short;

    lolApi.createQuery('summoner', { name, region })
      .then((summonerResult) => {
        const summonerId = _.keys(summonerResult)
          .map(key => summonerResult[key].id);

        dispatch({ type: SEARCH_SUMMONER_SUCCESS, payload: { summonerResult, summonerId } });
        return lolApi.createQuery('league', { region, type: 'summoner', id: summonerId, entry: true });
      })
      .then((leagueEntries) => {
        dispatch({ type: SEARCH_SUMMONER_DATA_SUCCESS, payload: { leagueEntries } });
      })
      .catch(err => dispatch({ type: SEARCH_SUMMONER_ERROR, payload: err }));
  };

export const fetchSummonerRunes = () =>
  (dispatch, getState) => {
    const state = getState().search;
    const region = state.selectedRegion.short;
    const summonerId = state.search.summonerId;

    dispatch({ type: SEARCH_SUMMONER_DATA_START });

    return lolApi.createQuery('summoner', { region, type: 'runes', summonerId })
      .then(result => dispatch({
        type: SEARCH_SUMMONER_DATA_SUCCESS,
        payload: {runes: result}
      }))
      .catch(err => dispatch({ type: SEARCH_SUMMONER_DATA_ERROR, payload: err }));
  };

export const fetchSummonerMasteries = () =>
  (dispatch, getState) => {
    const state = getState().search;
    const region = state.selectedRegion.short;
    const summonerId = state.search.summonerId;

    dispatch({ type: SEARCH_SUMMONER_DATA_START });

    return lolApi.createQuery('summoner', { region, type: 'masteries', summonerId })
      .then(result => dispatch({
        type: SEARCH_SUMMONER_DATA_SUCCESS,
        payload: {masteries: result}
      }))
      .catch(err => dispatch({ type: SEARCH_SUMMONER_DATA_ERROR, payload: err }));
  };

// export const getSummonerStats = () =>
//   (dispatch, getState) => {
//     const state = getState().search;
//     const region = state.selectedRegion.short;
//     const summonerId = state.search.summonerId;
//
//     dispatch({ type: SEARCH_SUMMONER_DATA_START });
//
//     return Promise.all([
//       lolApi.createQuery('summoner', { region, type: 'masteries', summonerId }),
//       lolApi.createQuery('summoner', { region, type: 'runes', summonerId })
//     ])
//       .then(result => dispatch({
//         type: SEARCH_SUMMONER_DATA_SUCCESS,
//         payload: {
//           masteries: result[0],
//           runes: result[1]
//         }
//       }))
//       .catch(err => dispatch({ type: SEARCH_SUMMONER_DATA_ERROR, payload: err }));
//   };

export const getTeam = name =>
  (dispatch, getState) => {
    dispatch({ type: SEARCH_TEAM_START });
    const region = getState().search.selectedRegion.short;

    lolApi.createQuery('summoner', { name, region })
      .then((listOfSummoners) => {
        const summonerIds = _.map('id', listOfSummoners);
        return lolApi.createQuery('team', { id: summonerIds, region, type: 'summoner' });
      })
      .then(result => dispatch({ type: SEARCH_TEAM_SUCCESS, payload: result }))
      .catch(err => dispatch({ type: SEARCH_TEAM_ERROR, payload: err }));
  };

export const selectRegion = region =>
  ({ type: SEARCH_REGION_CHANGED, payload: region });

export const searchChampions = summonerId =>
  (dispatch, getState) => {
    const platformId = getState().search.selectedRegion.platformId;
    dispatch({ type: SEARCH_SUMMONER_DATA_START });

    lolApi.createQuery('championMastery', { platformId, type: 'topchampions', summonerId })
      .then((result) => {
        dispatch({
          type: SEARCH_SUMMONER_DATA_SUCCESS,
          payload: { mostPlayed: { [summonerId]: result } }
        });
      })
      .catch(err => dispatch({ type: SEARCH_SUMMONER_DATA_ERROR, payload: err }));
  };

export const searchRecentGames = id =>
  (dispatch, getState) => {
    const region = getState().search.selectedRegion.short;
    dispatch({ type: SEARCH_SUMMONER_RECENT_START });
    const summonerId = parseInt(id, 10);

    lolApi.createQuery('recentGames', { region, summonerId })
      .then((result) => {
        dispatch({ type: SEARCH_SUMMONER_RECENT_SUCCESS, payload: result });
      })
      .catch(err => dispatch({ type: SEARCH_SUMMONER_RECENT_ERROR, payload: err }));
  };

// export const searchSummonerRunes = id =>

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
  selectedRegion: regions.EUW,
  summonerResult: {},
  teamResult: {},
  summonerStats: {
    leagueEntries: {},
    mostPlayed: {},
    runes: {},
    masteries: {}
  },
  summonerId: []
};

// TODO Add error cases for team and summoner

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
        ...initialState,
        data: state.data
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
    case SEARCH_SUMMONER_SUCCESS:
      return {
        ...state,
        summonerResult: action.payload.summonerResult,
        summonerId: action.payload.summonerId
      };
    case SEARCH_TEAM_SUCCESS:
      return {
        ...state,
        teamResult: action.payload
      };
    case SEARCH_SUMMONER_DATA_SUCCESS:
      return {
        ...state,
        summonerStats: {
          ...state.summonerStats,
          ...action.payload
        }
      };
    case SEARCH_SUMMONER_RECENT_SUCCESS:
      return {
        ...state,
        summonerRecent: action.payload
      }
    default:
      return state;
  }
}
