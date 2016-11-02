import { load } from 'cheerio';
import { promisify, resolve, all } from 'bluebird';
import request from 'request';
import { flow, reduce, map, upperFirst } from 'lodash';
import { writeFile } from 'fs';
import jimp from 'jimp';
import cfg from '../configs/mastery.json';

const pRequestGet = promisify(request.get);

/*
 Help script that builds offlineMasterydata tree json, uses both lolwiki and official lol api.
 Since official api does not provide tier values, but simple coordinates
 and lolwiki does not provide clean description data we merge official
 description with other lolwiki data.
 */

class MasteryFeed {
  constructor(config) {
    this.config = config;
    this.masteryTree = {};
    this.officialMasteryTree = {};
  }

  /*
   Main function, fetches all masteries info/images to the local drive
   @returns {void}
   */
  init() {
    return this.officialMasteryChain()
      .then((officialDescription) => {
        return flow(map, all)(this.config.masteryAll, (nameOfMasteryTree, key) =>
          this.check(
            `${this.config.mainAddress}/wiki/${nameOfMasteryTree}`,
            key,
            officialDescription));
      })
      .spread((...args) => {
        const convertedMasteryArray = reduce(args, (prev, next) => {
          return { ...prev, ...next };
        }, {});

        writeFile('./masteries.json',
          JSON.stringify(convertedMasteryArray),
          err => console.log(err));

        return resolve(convertedMasteryArray);
      })
      .catch(err => console.log(err));
  }

  officialMasteryChain() {
    return this.fetchOfficialMasteries(this.config.officialMasteryApi)
      .then(officialApi => this.normalizeOfficialMastery(officialApi))
      .then(normalizedOfficialMastery => resolve(normalizedOfficialMastery))
      .catch(err => console.log(err));
  }

  /*
   Main promise chain
   @param {String} mainMasteryName - template url for loading offlineMasterydata data
   @param {String} key - used to name offlineMasterydata branch once all info is fetched
   @returns {void}
   */
  check(mainMasteryPage, key, officialTree) {
    const { config, parseMasteriesUrl, loadPage, sortMasteryTree } = this;
    const parseMasteryPage = this.parseMasteryPage.bind(this);

    return this.loadPage(mainMasteryPage, key)
      .then($ => parseMasteriesUrl($, config.masterySelector.link))
      .map(singleMasteryUrl => ({
        page: loadPage(`${config.mainAddress}${singleMasteryUrl}`),
        url: singleMasteryUrl
      }))
      .map(({ page, url }) => page
        .then(result => flow(parseMasteryPage, resolve)(
          result,
          url,
          this.config.masterySelector,
          officialTree,
          upperFirst(key)))
        .then(nonActivatedMasteryObject => this.addActiveMastery(nonActivatedMasteryObject))
        .catch(err => console.log(err)))
      .then(arrayOfMasteries => sortMasteryTree(arrayOfMasteries))
      .then(masteryObject => masteryObject)
      .catch(err => console.log(err));
  }


  /*
   Simply iterates over offlineMasterydata object keys and return new object with active prop
   @param {object} - single offlineMasterydata object
   @returns {object}
   */
  addActiveMastery(singleMasteryObject) {
    if (singleMasteryObject.pointsReq == 0) {
      return { ...singleMasteryObject, active: true };
    }
    return { ...singleMasteryObject, active: false };
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

    console.log(memoize);
    return resolve(memoize);
  }

  /*
   Extract description, rank and tier from the offlineMasterydata page
   @param {string} name
   @param {object} $ - web page with cheerio's wrapper
   @param {string} url
   @param {object} selector - set of selectors we need to parse from the page
   @returns {object}
   */
  parseMasteryPage(page, url, selector, officialMasteryTree, nameOfMasteryTree) {
    const { image, link, ...rest } = selector;
    const name = cfg.regularForUrl
      .reduce((previous, current) => previous.replace(current, ''), url);

    const singleMasteryObject = reduce(rest, (previous, current, key) => {
      if (key === 'description') {
        const cleanDescriptionName = officialMasteryTree[decodeURIComponent(name)
          .replace(/_+/g, ' ')];
        const preparedDescription = map(cleanDescriptionName, (description) =>
          description.replace(/<[^>]*>?/g, ''));

        return {
          ...previous,
          [key]: preparedDescription
        };
      }

      return { ...previous, [key]: page(current).text() };
    }, { name, branch: nameOfMasteryTree });

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
    return pRequestGet({ url, encoding: 'binary' })
      .then(({ body }) => {

        writeFile(`./src/app/img/${name}.png`,
          body,
          { encoding: 'binary', flag: 'wx' },
          err => console.log(err));

        return resolve();
      })
      .then(() => {
        jimp.read(`./src/app/img/${name}.png`).then(image =>
          image.greyscale()
            .write(`./src/app/img/${name}-bw.png`)
        )
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  /*
   Convert offlineMasterydata array to object and normalize it, each key equals tier number
   @param {Array} tree - offlineMasterydata info
   @returns {Object}
   */
  sortMasteryTree(tree) {
    return flow(reduce, resolve)(tree, (previous, current) =>
      ({ ...previous, [current.name]: current }), {});
  }

  /*
   Get official lol masteries json file
   @param {string} url
   @returns {object}
   */
  fetchOfficialMasteries(url) {
    return pRequestGet({ url, json: true })
      .then(({ body }) => resolve(body.data))
      .catch(err => console.log(err));
  }

  /*
   Reduce json to format { nameOfMastery: [descriptionRank1, descriptionRank2, ...etc] }
   @param {object} officialData
   @returns {object}
   */
  normalizeOfficialMastery(officialData) {
    return flow(reduce, resolve)(officialData, (prev, next) =>
      ({ ...prev, [next.name]: next.description }), {});
  }
}

module.exports = new MasteryFeed(cfg);
