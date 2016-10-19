import { promisify, resolve } from 'bluebird';
import request from 'request';
import personalData from '../configs/apiKey.json';
import apiConfig from '../configs/apiConfig.json';

const pRequestGet = promisify(request.get);

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
    const idOfChampion = (id === '') ? '' : `/${id}`;

    // TODO add region validation
    const url = `${this.config.apiAddr}${region}/v1.2/champion${idOfChampion}?api_key=${this.apiKey}${freeToPlayQuery}`;

    return pRequestGet(url)
      .then(({ body }) => resolve(body))
      .catch(err => console.log(err));
  }
}

module.exports = new ApiDriver();

const test = new ApiDriver(apiConfig, personalData.apiKey);

test.getChampions('euw', '103');
