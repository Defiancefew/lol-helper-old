import { remote } from 'electron';
import { apiKey } from '../../../configs/apiKey.json';

const ApiClass = remote.require('./api/lolApi').lolApi;
const lolApi = new ApiClass(apiKey);

const SUMMONER_RECENT_START = 'app/summoner/SUMMONER_RECENT_START';
const SUMMONER_RECENT_SUCCESS = 'app/summoner/SUMMONER_RECENT_SUCCESS';
const SUMMONER_RECENT_ERROR = 'app/summoner/SUMMONER_RECENT_ERROR';

const SUMMONER_RUNES_START = 'app/summoner/SUMMONER_RUNES_START';
const SUMMONER_RUNES_SUCCESS = 'app/summoner/SUMMONER_RUNES_SUCCESS';
const SUMMONER_RUNES_ERROR = 'app/summoner/SUMMONER_RUNES_ERROR';

const SUMMONER_LEAGUE_ENTRIES_START = 'app/summoner/SUMMONER_LEAGUE_ENTRIES_START';
const SUMMONER_LEAGUE_ENTRIES_SUCCESS = 'app/summoner/SUMMONER_LEAGUE_ENTRIES_SUCCESS';
const SUMMONER_LEAGUE_ENTRIES_ERROR = 'app/summoner/SUMMONER_LEAGUE_ENTRIES_ERROR';

const SUMMONER_MASTERIES_START = 'app/summoner/SUMMONER_MASTERIES_START';
const SUMMONER_MASTERIES_SUCCESS = 'app/summoner/SUMMONER_MASTERIES_SUCCESS';
const SUMMONER_MASTERIES_ERROR = 'app/summoner/SUMMONER_MASTERIES_ERROR';

const SUMMONER_MOST_PLAYED_START = 'app/summoner/SUMMONER_MOST_PLAYED_START';
const SUMMONER_MOST_PLAYED_SUCCESS = 'app/summoner/SUMMONER_MOST_PLAYED_SUCCESS';
const SUMMONER_MOST_PLAYED_ERROR = 'app/summoner/SUMMONER_MOST_PLAYED_ERROR';

const SUMMONER_TEAM_START = 'app/search/SUMMONER_TEAM_START';
const SUMMONER_TEAM_ERROR = 'app/search/SUMMONER_TEAM_ERROR';
const SUMMONER_TEAM_SUCCESS = 'app/search/SUMMONER_TEAM_SUCCESS';

export const searchRecentGames = id =>
  (dispatch, getState) => {
    const region = getState().search.selectedRegion.short;
    dispatch({ type: SUMMONER_RECENT_START });
    const summonerId = parseInt(id, 10);

    lolApi.createQuery('recentGames', { region, summonerId })
      .then((result) => {
        dispatch({ type: SUMMONER_RECENT_SUCCESS, payload: result });
      })
      .catch(err => dispatch({ type: SUMMONER_RECENT_ERROR, payload: err }));
  };

export const searchChampions = summonerId =>
  (dispatch, getState) => {
    const platformId = getState().search.selectedRegion.platformId;
    dispatch({ type: SUMMONER_MOST_PLAYED_START });

    lolApi.createQuery('championMastery', { platformId, type: 'topchampions', summonerId })
      .then((result) => {
        dispatch({
          type: SUMMONER_MOST_PLAYED_SUCCESS,
          payload: { mostPlayed: { [summonerId]: result } }
        });
      })
      .catch(err => dispatch({ type: SUMMONER_MOST_PLAYED_ERROR, payload: err }));
  };

export const getSummonerRunes = () =>
  (dispatch, getState) => {
    const state = getState().search;
    const region = state.selectedRegion.short;
    const summonerId = state.summonerId;

    dispatch({ type: SUMMONER_RUNES_START });

    return lolApi.createQuery('summoner', { region, type: 'runes', summonerId })
      .then(result => dispatch({
        type: SUMMONER_RUNES_SUCCESS,
        payload: { runes: result }
      }))
      .catch(err => dispatch({ type: SUMMONER_RUNES_ERROR, payload: err }));
  };

export const getLeagueEntries = () =>
  (dispatch, getState) => {
    const state = getState().search;
    const region = state.selectedRegion.short;
    const summonerId = state.summonerId;

    dispatch({ type: SUMMONER_LEAGUE_ENTRIES_START });

    return lolApi.createQuery('league', { region, type: 'summoner', id: summonerId, entry: true })
      .then((result) => {
        dispatch({ type: SUMMONER_LEAGUE_ENTRIES_SUCCESS, payload: result });
      })
      .catch(err => dispatch({ type: SUMMONER_LEAGUE_ENTRIES_ERROR, payload: err }));
  };

export const getSummonerMasteries = () =>
  (dispatch, getState) => {
    const state = getState().search;
    const region = state.selectedRegion.short;
    const summonerId = state.summonerId;

    dispatch({ type: SUMMONER_MASTERIES_START });

    return lolApi.createQuery('summoner', { region, type: 'masteries', summonerId })
      .then(result => dispatch({
        type: SUMMONER_MASTERIES_SUCCESS,
        payload: { masteries: result }
      }))
      .catch(err => dispatch({ type: SUMMONER_MASTERIES_ERROR, payload: err }));
  };

export const getTeams = name =>
  (dispatch, getState) => {
    dispatch({ type: SUMMONER_TEAM_START });
    const region = getState().search.selectedRegion.short;

    lolApi.createQuery('summoner', { name, region })
      .then((listOfSummoners) => {
        const summonerIds = _.map('id', listOfSummoners);
        return lolApi.createQuery('team', { id: summonerIds, region, type: 'summoner' });
      })
      .then(result => dispatch({ type: SUMMONER_TEAM_SUCCESS, payload: result }))
      .catch(err => dispatch({ type: SUMMONER_TEAM_ERROR, payload: err }));
  };

const initialState = {
  recent: {},
  runes: {},
  masteries: {},
  team: {},
  mostPlayed: {},
  leagueEntries: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SUMMONER_RECENT_SUCCESS:
      return {
        ...state,
        recent: {
          ...state.summonerRecent,
          [action.payload.summonerId]: action.payload
        }
      };
    case SUMMONER_MASTERIES_SUCCESS:
      return {
        ...state,
        masteries: {
          ...action.payload
        }
      };
    case SUMMONER_RUNES_SUCCESS:
      return {
        ...state,
        runes: {
          ...action.payload
        }
      };
    case SUMMONER_MOST_PLAYED_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    case SUMMONER_TEAM_SUCCESS:
      return {
        ...state,
        team: {
          ...action.payload
        }
      };
    case SUMMONER_LEAGUE_ENTRIES_SUCCESS:
      return {
        ...state,
        leagueEntries: {
          ...action.payload
        }
      };
    default:
      return state;
  }
}
