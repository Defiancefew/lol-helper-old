import { promisify } from 'bluebird';
import { isNumber, isArray, isEmpty, isString, forEach, lowerFirst } from 'lodash';
import { map, includes, flow, filter, every } from 'lodash/fp';
import request from 'request';
import { writeFile } from 'fs';

import { apiKey } from '../configs/apiKey.json';
import { apiUrl, regions, apiTypes, numberKeyNames } from '../configs/apiConfig.json';
import { defaultApiRegion } from '../configs/options.json';

const {
  champions,
  championMastery,
  currentGame,
  featuredGames,
  recentGames,
  leagues,
  staticData,
  lolStatus,
  match,
  matchList,
  stats,
  summoner,
  team
} = apiTypes;

const requestApiData = url => promisify(request.get)(url)
  .then(({ statusCode, headers, body }) =>
      ({ statusCode, headers, body }),
    err => console.log(err))
  .catch(err => console.log(err));


const validateRegion = region => flow(map('short'), includes(region))(regions);
const validateType = (name, type) => includes(type, apiTypes[name].type);
const validateNumbers = params =>
  flow(
    filter.convert({ cap: false })((v, k) => includes(k, numberKeyNames)),
    every(v => isNumber(v) || isArray(v) || isEmpty(v))
  )(params);

// TODO Add error handler later
// TODO Change this for multiple regions when options will be done.
// TODO Cover with tests after finished
// TODO change this when proper error validation will come


/*
 Basic class for interaction with lol api.
 Requests limits are enforced per region.
 */

class ApiDriver {
  /*
   @param {string} name
   @param {Object} params
   @returns {Promise}
   */

  createQuery = (name, params, testLog) => {
    const basicUrl = `https://${defaultApiRegion}.${apiUrl}`;
    const validParams = this[name](params);
    const apiKeyQuery = `?api_key=${apiKey}`;

    if (params.region && validateRegion(params.region) && validateNumbers(params) && validParams) {
      if (params.type && validateType(lowerFirst(name.replace('get', '')), params.type)) {
        return false;
      }

      const finalUrl = (!isEmpty(validParams) && isArray(validParams))
        ? `${basicUrl}${validParams[0]}${apiKeyQuery}${validParams[1]}`
        : `${basicUrl}${validParams}${apiKeyQuery}`;

      if (testLog) {
        return console.log(finalUrl);
      }

      return requestApiData(finalUrl);
    }

    return false;
  }

  /*
   Fetches champion availability info. If no id is provided returns all champion status.

   @param {string} region - required
   @param {string} id - optional to obtain single champion availability info
   @param {boolean} freeToPlay - optional query to obtain list of free to play champions
   @returns {string}
   */
  getChampions = ({ region, championId = '', freeToPlay = false }) => {
    const baseQuery = `${region}/${champions.url}`;

    if (isEmpty(championId)) {
      return baseQuery;
    }

    if (!freeToPlay) {
      return `${baseQuery}/${championId}`;
    }

    return [`${baseQuery}/${championId}`, champions.freeToPlay];
  }
  /*
   Get champion mastery info

   @param {string} region - required
   @param {number} type -
   @param {string} summonerId - required
   @returns {string}
   */
  getChampionMastery = ({ region, type, summonerId, championId = '' }) => {
    const validType = () => {
      if (championId) {
        return `champion/${championId}`;
      }

      return type;
    };

    return `${championMastery.url}/${region}/player/${summonerId}/${validType()}`;
  }

  /*
   Get current game information for given summoner id.

   @param {string} region - required
   @param {number} summonerId - required
   @returns {string|boolean}
   */
  getCurrentGame = ({ platformId, summonerId }) => {
    if (isString(platformId)) {
      return `${currentGame.url}${platformId}/${summonerId}`;
    }

    return false;
  }
  /*
   Get featured games by region.

   @param {string} region - required
   @returns {string|boolean}
   */
  getFeaturedGames = ({ region }) => `${region}/${featuredGames.url}`;

  /*
   Get recent  games by summoner id.

   @param {string} region - required
   @param {number} summonerId - required
   @returns {string}
   */
  getRecentGames = ({ region, summonerId }) => `${region}${recentGames.url}${summonerId}/recent`

  /*
   Get leagues mapped by summoner\team id or overall challenger and master.

   @param {string} region - required
   @param {string} type
   @param {number} id
   @param {boolean} entry
   @returns {string}
   */
  getLeagues = ({ region, type, id = '', entry = false }) => {
    const validType = () => {
      if (!isEmpty(id)) {
        return (!entry) ? `${type}/${id}` : `${type}/${id}/entry`;
      }
      return type;
    };

    return `${region}/${leagues.url}${validType()}`;
  }

  /*
   Get static data objects from data dragon.
   Note that for champions,items, masteries,
   runes and summoner spells you can search by id

   @param {string} region - required
   @param {string} type
   @param {number} id
   @returns {string}
   */
  getStaticData = ({ region, type, id = '' }) => {
    const validType = () => {
      if (id) {
        return `${type}/${id}`;
      }
      return type;
    };

    return `${staticData.url}/${region}/v1.2/${validType()}`;
  }

  /*
   Call this directly. Returns status of servers overall or per region.

   @param {string} region
   @returns {string}
   */
  getStatus = (region = '') => `${lolStatus.url}/${region}`;

  /*
   Retrieve match by match ID.

   @param {string} region - required
   @param {number} matchId - required
   @returns {string}
   */
  getMatch = ({ region, matchId }) => `${region}/${match.url}${matchId}`;

  /*
   Retrieve matchlist by summoner id. You can chain summoner search and matchlist search.

   @param {string} region - required
   @param {number} summonerId - required
   @returns {string}
   */
  getMatchList = ({ region, summonerId }) => `${region}/${matchList.url}${summonerId}`;

  /*
   Get player stats by summoner id.

   @param {string} region - required
   @param {string} type - required - you can get ranked or overall summary stats
   @param {number} summonerId
   @returns {string}
   */
  getStats = ({ region, type, summonerId }) => `${apiUrl}${region}/${stats.url}${summonerId}/${type}`;

  /*
   Get summoner info. You can search both by name, id, name[], id[]
   and obtain both full and separate (masteries,name,runes) info

   @param {string} region - required
   @param {string} type -
   @param {number|string|string[]|number[]} summonerId - get summoner or summoner objects
   @returns {string}
   */
  getSummoner = ({ region, type, summonerId }) => {
    const validType = () => {
      if (isArray(summonerId)) {
        return `by-name/${summonerId.join(',')}`;
      }

      if (isString(summonerId)) {
        return `by-name/${summonerId}`;
      }

      return `${summonerId}/${type}`;
    };

    return `${region}/${summoner.url}${validType()}`;
  }

  /*
   @param {string} region
   @param {string} type
   @param {number} id
   @returns {string}
   */
  getTeam = ({ region, type, id }) => {
    const validType = () => {
      if (type === 'summoner') {
        return `by-${type}/${id}`;
      }
      return id;
    };

    return `${region}/${team.url}${validType()}`;
  }
}

module.exports = new ApiDriver();

