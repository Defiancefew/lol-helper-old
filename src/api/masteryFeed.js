import { load } from 'cheerio';
import { promisify, resolve } from 'bluebird';
import request from 'request';
import { flow } from 'lodash';
import cfg from '../configs/mastery.json';
import { writeFile, statSync, mkdirSync } from 'fs';

const pRequestGet = promisify(request.get);

class MasteryFeed {
  constructor(config) {
    this.config = config;
    this.masteryTree = {};
  }

  /*
   Main function, fetches all masteries info/images to the local drive
   @returns {void}
   */
  init() {
    // TODO Check img folder creation

    const parseMasteryPage = this.parseMasteryPage.bind(this);
    const { config, parseMasteriesUrl, loadPage } = this;

    this.loadPage(`${config.mainAddress}/wiki/${config.masteryAll.ferocity}`)
      .then($ => parseMasteriesUrl($, config.masterySelector.link))
      .map(singleMasteryUrl => ({
        page: loadPage(`${config.mainAddress}${singleMasteryUrl}`),
        url: singleMasteryUrl
      }))
      .map(({ page, url }) => page
        .then(result => parseMasteryPage(result, url, this.config.masterySelector)))
      // .then(array => console.log(array))
      .catch(err => console.log(err));
  }

  /*
   Get page and return cheerio's version for further parse.
   @param {string} url
   @returns {object}
   */
  loadPage(url) {
    return pRequestGet(url)
      .then(response => flow(load, resolve)(response.body))
      .catch(err => console.log(err));
  }

  /*
   Get array of masteries pages.
   @param {object} $ - web page with cheerio wrapper
   @param {string} selector -
   @returns {array}
   */
  parseMasteriesUrl($, selector) {
    const memoize = [];

    $(selector).each((index, element) => {
      memoize.push($(element).attr('href'));
    });

    return resolve(memoize);
  }

  /*
   Because we can't parse mastery name right through the local
   page we extract it right from the url
   @param {string} string - url page
   @returns {string}
   */
  // parseMasteryName(string) {
  //   return string
  //     .replace(this.config.regularForUrl[0], '')
  //     .replace(this.config.regularForUrl[1], '');
  // }

  /*
   Extract description, rank and tier from the mastery page
   @param {string} name
   @param {object} $ - web page with cheerio wrapper
   @param {string} url
   @param {object} selector - set of selectors we need to parse from the page
   @returns {object}
   */
  parseMasteryPage(page, url, selector) {
    const { description, rank, tier, pointsReq, image } = selector;

    const name = url
      .replace(cfg.regularForUrl[0], '')
      .replace(cfg.regularForUrl[1], '');

    this.downloadMasteryImage(name, page(`${image}`).attr('src'));

    return resolve({
      name,
      description: page(`${description}`).text(),
      rank: page(`${rank}`).text(),
      tier: page(`${tier}`).text(),
      pointsRequired: page(`${pointsReq}`).text()
    });
  }

  /*
   We do save image first time app initialize
   @param {string} name - used for naming the saved image on the filesystem
   @param {string} url
   @returns {void}
   */
  downloadMasteryImage(name, url) {
    return pRequestGet({ url, encoding: 'binary' })
      .then(response => {
        writeFile(`./src/app/img/${name}.png`,
          response.body,
          'binary',
          err => (err === null) ? null : console.log(err));
      })
      .catch(err => console.log(err));
  }
}

const test = new MasteryFeed(cfg).init();
