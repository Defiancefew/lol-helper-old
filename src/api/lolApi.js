import { promisify, resolve, all } from 'bluebird';
import request from 'request';
import apiKey from '../configs/apiKey.json';

const pRequestGet = promisify(request.get);

/*
 Basic class for interaction with lol api.
 Requests limits are enforced per region.
 */

class ApiDriver {
  constructor() {
    this.config = {};
  }
}

module.exports = new ApiDriver();
