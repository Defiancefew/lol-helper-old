import { promisify, resolve, reduce as pReduce } from 'bluebird';
import request from 'request';
import path from 'path';
import jimp from "jimp";
import { readFile, mkdir, writeFile } from 'fs';
import { map, isArray } from 'lodash';
import { uniq, flow, filter, map as fmap } from 'lodash/fp';
import { defaultApiRegion } from '../configs/options.json';
import { dDragon } from '../configs/apiConfig.json';
import { fileExists, directoryExists } from './nodeHelpers';


const pRequestGet = promisify(request.get);
const pReadFile = promisify(readFile);
const pMkdir = promisify(mkdir);

const versions = `${dDragon.url}realms/${defaultApiRegion}.json`;

const fetchVersions = () => {
  if (!fileExists(dDragon.versionsPath)) {
    return pRequestGet(versions).then((response) => {
      writeFile(dDragon.versionsPath, JSON.stringify(response.body), err => console.log(err));

      return resolve(response.body);
    });
  }

  pReadFile(dDragon.versionsPath, 'utf8')
    .then(content => flow(JSON.parse, resolve)(content))
    .catch(err => console.log(err));
};

const fetchData = () => fetchVersions
  .then(response =>
    map(response.body.n, (version, key) => {
      const pathName = `../offline/${key}.json`;

      if (fileExists(pathName)) {
        console.log(`${pathName} exists`);
        return pReadFile(pathName, 'utf8')
          .then(content => JSON.parse(content))
          .catch(err => console.log(err));
      }

      return pRequestGet(`${dDragon.url}cdn/${version}/data/en_US/${key}.json`)
        .then((dataResponse) => {
          writeFile(pathName, dataResponse.body, err => console.log(err));
          return JSON.parse(dataResponse);
        })
        .catch(err => console.log(err));
    }))
  .catch(err => console.log(err));

const prepareSingleDataObject = offlineData =>
  flow(filter(baseData => baseData.type !== 'language'), fmap(v => v.image.sprite), uniq)(offlineData.data);

const saveSprite = (body, spriteType, singleUrl) => {
  const spriteFilePath = `../app/img/sprites/${spriteType}/`;

  if (fileExists(`${spriteFilePath}${singleUrl}`)) {
    return false;
  }

  if (directoryExists(spriteFilePath)) {
    writeFile(`${spriteFilePath}${singleUrl}`,
      body,
      { encoding: 'binary', flag: 'wx' },
      err => console.log(err));
  } else {
    pMkdir(`${spriteFilePath}`).then(() => {
      writeFile(`${spriteFilePath}${singleUrl}`,
        body,
        { encoding: 'binary', flag: 'wx' },
        err => console.log(err));
    })
      .catch(err => console.log(err));
  }

  return true;
};

const downloadSprite = (spriteUrl, spriteType) =>
  map(spriteUrl, singleUrl =>
    pRequestGet({
      url: `${dDragon.url}cdn/6.21.1/img/sprite/${singleUrl}`,
      encoding: 'binary'
    })
      .then(({ body }) => saveSprite(body, spriteType, singleUrl))
      .catch(err => console.log(err)));

const fetchSprites = () =>
  map(dDragon.types, value =>
    pReadFile(`../offline/${value}.json`, 'utf8')
      .then(content => flow(JSON.parse, prepareSingleDataObject, resolve)(content))
      .then(spriteString => downloadSprite(spriteString, value))
      .catch(err => console.log(err)));

const makeBwSprites = (initialPath, savePath) => {
  return jimp
    .read(initialPath)
    .then(image =>
      image.greyscale()
        .write(savePath)
    )
    .catch(err => console.log(err));
};

const getData = () =>
  pReduce(dDragon.types, (total, type) => {
    return pReadFile(`./src/offline/${type}.json`, 'utf8')
      .then(content => {
        return { ...total, [type]: JSON.parse(content).data };
      });
  }, {}).then(object => resolve(object));

module.exports = {
  getData
};

const makeBiggerMasteriesSprites = () => {
  return jimp
    .read('../app/img/sprites/mastery/mastery0.png')
    .then(image => image.resize(640,320).write('../app/img/sprites/mastery/mastery0scaled.png'));
};