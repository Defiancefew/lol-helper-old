import { promisify, resolve } from 'bluebird';
import { isNumber } from 'lodash';
import request from 'request';
import personalData from '../configs/apiKey.json';
import apiConfig from '../configs/apiConfig.json';

const pRequestGet = promisify(request.get);
const requestApiData = url => promisify(request.get)(url)
  .then(({ body }) => resolve(body))
  .catch(err => console.log(err));

const cleanUrl = string => string.replace(/(\t|\n)+/gm, '');

/*
 Basic class for interaction with lol api.
 Requests limits are enforced per region.
 */

class ApiDriver {
  constructor(config, apiKey) {
    this.config = config;
    this.apiKey = apiKey;
  }

  getChampions(region, id = '', freeToPlay = '') {
    const freeToPlayQuery = (freeToPlay === '') ? '' : '&freeToPlay=true';
    const championId = (id === '') ? '' : `/${id}`;

    // TODO add region validation
    const url = cleanUrl(`${this.config.apiAddr}${region}/v1.2/champion
      ${championId}?api_key=${this.apiKey}${freeToPlayQuery}`);

    return requestApiData(url);
  }

  getChampionMastery(region, playerId, type) {
    const requestType = (isNumber(type))
      ? `champion/${type}`
      : type;
    const url = cleanUrl(`${this.config.apiAddr}${this.config.championMastery.url}
      ${region}/player/${playerId}/${requestType}`);

    return requestApiData(url);
  }

  getCurrentGame(platformId, summonerId) {
    const url = cleanUrl(`${this.config.apiAddr}${this.config.currentGame.url}
      ${platformId}${summonerId}`);
    return requestApiData(url);
  }

  getFeaturedGames(region) {
    const url = cleanUrl(`${this.config.apiAddr}${this.config.featuredGames.url}`);
    return requestApiData(url);
  }

  getRecentGames(region, summonedId) {
    const url = cleanUrl(`${this.config.apiAddr}${region}${this.config.recentGames.url}${summonedId}/recent`);
    return requestApiData(url);
  }

  getLeagues(region, type) {
    // TODO Refactor this
    const url = cleanUrl(`${this.config.apiAddr}${this.config.leagues}${type}`);
    return requestApiData(url);
  }

  getStaticData(region, type, id = '') {
    const url = cleanUrl(`${this.config.apiAddr}${this.config.staticData}${region}/v1.2/${type}`);
    return requestApiData(url);
  }

  getLolStatus(shard = '') {
    // TODO Shard names are differ from platforms
    const url = cleanUrl(`${this.config.lolStatus}${shard}`);
    return requestApiData(url);
  }

  getMatch(region, matchId) {
    const url = cleanUrl(`${this.config.apiAddr}${region}${this.config.match}${matchId}`);
    return requestApiData(url);
  }

  getMatchList(region, summonerId) {
    const url = cleanUrl(`${this.config.apiAddr}${region}${this.config.matchList}${summonerId}`);
    return requestApiData(url);
  }

  getStats(region, summonerId, type) {
    const url = cleanUrl(`${this.config.apiAddr}${region}${this.config.stats}${summonerId}/${type}`);
    return requestApiData(url);
  }

  getSummoner(region, type) {
    // TODO Url is not valid
    const url = cleanUrl(`${this.config.apiAddr}${region}${this.config.summoner}${summonerId}/${type}`);
    return requestApiData(url);
  }

  getTeam(region, type, id) {
    const url = cleanUrl(`${this.config.apiAddr}${region}${this.config.team}`);
    return requestApiData(url);
  }
}

module.exports = new ApiDriver();

const test = new ApiDriver(apiConfig, personalData.apiKey);

test.getChampions('euw', '103');
