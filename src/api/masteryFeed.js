import { load } from 'cheerio';
import { promisify, resolve, all } from 'bluebird';
import request from 'request';
import { flow, reduce, forEach, map } from 'lodash';
import cfg from '../configs/mastery.json';
import { writeFile } from 'fs';

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
    return flow(map, all)(this.config.masteryAll, (nameOfMasteryTree, key) =>
      this.check(`${this.config.mainAddress}/wiki/${nameOfMasteryTree}`, key))
      .then(() => resolve(this.masteryTree));
  }

  /*
   Main promise chain
   @param {String} mainMasteryName - template url for loading mastery data
   @param {String} key - used to name mastery branch once all info is fetched
   @returns {void}
   */
  check(mainMasteryPage, key) {
    const { config, parseMasteriesUrl, loadPage, sortMasteryTree } = this;
    const parseMasteryPage = this.parseMasteryPage.bind(this);

    return this.loadPage(mainMasteryPage, key)
      .then($ => parseMasteriesUrl($, config.masterySelector.link))
      .map(singleMasteryUrl => ({
        page: loadPage(`${config.mainAddress}${singleMasteryUrl}`),
        url: singleMasteryUrl
      }))
      .map(({ page, url }) => page
        .then(result => parseMasteryPage(result, url, this.config.masterySelector))
        .catch(err => console.log(err)))
      .then(arrayOfMasteries => sortMasteryTree(arrayOfMasteries))
      .then(masteryObject => {
        this.masteryTree[key] = masteryObject;
        writeFile('./masteries.json',
          JSON.stringify(this.masteryTree),
          err => console.log(err));
        return this.masteryTree[key];
      })
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
   Extract description, rank and tier from the mastery page
   @param {string} name
   @param {object} $ - web page with cheerio wrapper
   @param {string} url
   @param {object} selector - set of selectors we need to parse from the page
   @returns {object}
   */
  parseMasteryPage(page, url, selector) {
    const { image, link, ...rest } = selector;
    const name = cfg.regularForUrl
      .reduce((previous, current) => previous.replace(current, ''), url);
    const singleMasteryObject = reduce(rest, (previous, current, key) =>
        ({ ...previous, [key]: page(current).text() })
      , { name });

    this.downloadMasteryImage(name, page(`${image}`).attr('src'));

    return resolve(singleMasteryObject);
  }

  /*
   Save image when app initialized for the first time
   @param {string} name - used for naming the saved image on the filesystem
   @param {string} url
   @returns {void}
   */
  downloadMasteryImage(name, url) {
    // TODO Add existing image check
    return pRequestGet({ url, encoding: 'binary' })
      .then(({ body }) => writeFile(`./src/app/img/${name}.png`,
        body,
        'binary',
        err => console.log(err)))
      .catch(err => console.log(err));
  }
n
  /*
   Convert mastery array to object and normalize it, each key equals tier number
   @param {Array} tree - mastery info
   @returns {Object}
   */
  sortMasteryTree(tree) {
    return flow(reduce, resolve)(tree, (previous, current) =>
        (previous[current.tier])
          ? ({ ...previous, [current.tier]: [...previous[current.tier], current] })
          : ({ ...previous, [current.tier]: [current] })
      , {});
  }
}

module.exports = new MasteryFeed(cfg);
