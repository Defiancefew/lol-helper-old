import LolApi from '../../src/api/lolApi';
import { apiTypes } from '../../src/configs/apiConfig.json';

const mockData = {
  defaultUrl: 'https://euw.api.pvp.net/api/lol/',
  region: 'EUW',
  platformId: 'EUW1',
  championId: 103,
  summonerId: 23842771,
  teamId: 23842771,
  apiKey: 'RGAPI-11111111-1111-1111-1111-111111111111',
};

const {
  champions,
  championMastery,
  currentGame,
  featuredGames,
  recentGames,
  league,
  staticData,
  lolStatus,
  match,
  matchList,
  stats,
  summoner,
  team
} = apiTypes;

const apiKey = `?api_key=${mockData.apiKey}`;
const { defaultUrl, region, championId, summonerId, platformId } = mockData;
const api = new LolApi(mockData.apiKey);
const { createQuery } = api;

describe('champions', () => {
  it('should return champion status', () => {
    expect(createQuery('champions', { region, championId }, true))
      .toBe(`${defaultUrl}${region}/${champions.url}${championId}${apiKey}`);
  });

  it('should return all free to play champions', () => {
    expect(createQuery('champions', { region, freeToPlay: true }, true))
      .toBe(`${defaultUrl}${region}/${champions.url}${apiKey}${champions.freeToPlay}`);
  });
});

describe('championMastery', () => {
  it('should return masteries by championId', () => {
    expect(createQuery('championMastery', { region, summonerId, championId }, true))
      .toBe(
        `${defaultUrl}${championMastery.url}${region}/player/${summonerId}/champion/${championId}${apiKey}`
      );
  });

  it('should return all champions masteries by championId', () => {
    expect(createQuery('championMastery', { region, summonerId, type: 'champions' }, true))
      .toBe(
        `${defaultUrl}${championMastery.url}${region}/player/${summonerId}/champions${apiKey}`
      );
  });

  it('should return all champions mastery score by championId', () => {
    expect(createQuery('championMastery', { region, summonerId, type: 'score' }, true))
      .toBe(
        `${defaultUrl}${championMastery.url}${region}/player/${summonerId}/score${apiKey}`
      );
  });

  it('should return all topchampions masteries by championId', () => {
    expect(createQuery('championMastery', { region, summonerId, type: 'topchampions' }, true))
      .toBe(
        `${defaultUrl}${championMastery.url}${region}/player/${summonerId}/topchampions${apiKey}`
      );
  });
});

describe('currentGame', () => {
  it('should return current game request string', () => {
    expect(createQuery('currentGame', { platformId, summonerId }, true))
      .toBe(
        `${defaultUrl}${currentGame.url}${platformId}/${summonerId}${apiKey}`
      );
  });
});

describe('featuredGame', () => {
  it('should return feature game string', () => {
    expect(createQuery('featuredGames', { region }, true))
      .toBe(
        `${defaultUrl}${featuredGames.url}${apiKey}`
      );
  });
});

describe('recentGames', () => {
  it('should return summoner recent game', () => {
    expect(createQuery('recentGames', { region, summonerId }, true))
      .toBe(`${defaultUrl}${region}/${recentGames.url}${summonerId}/recent${apiKey}`);
  });
});

describe('leagues', () => {
  it('should return leagues mapped to given summoner id', () => {
    expect(createQuery('league', { region, id: summonerId, type: 'summoner' }, true))
      .toBe(`${defaultUrl}${region}/${league.url}by-summoner/${summonerId}${apiKey}`);
  });

  it('should return league entries mapped to given list of summoner id', () => {
    const summonerIds = [123, 456, 789];

    expect(createQuery('league',
      {
        region,
        id: summonerIds,
        type: 'summoner',
        entry: true
      },
      true))
      .toBe(`${defaultUrl}${region}/${league.url}by-summoner/${summonerIds}/entry${apiKey}`);
  });

  it('should return leagues mapped to given list of teams', () => {
    const teamIds = [123, 456, 789];

    expect(createQuery('league', { region, id: teamIds, type: 'team' }, true))
      .toBe(`${defaultUrl}${region}/${league.url}by-team/${teamIds}${apiKey}`);
  });

  it('should return challenger league', () => {
    expect(createQuery('league', { region, type: 'challenger' }, true))
      .toBe(`${defaultUrl}${region}/${league.url}challenger${apiKey}`);
  });

  it('should return master league', () => {
    expect(createQuery('league', { region, type: 'master' }, true))
      .toBe(`${defaultUrl}${region}/${league.url}master${apiKey}`);
  });
});

describe('static data', () => {
  it('should return given item', () => {
    expect(createQuery('staticData', { region, type: 'item' }, true))
      .toBe(`${defaultUrl}${staticData.url}${region}/v1.2/item${apiKey}`);
  });

  it('should return given item by given id', () => {
    expect(createQuery('staticData', { region, type: 'item', id: 100 }, true))
      .toBe(`${defaultUrl}${staticData.url}${region}/v1.2/item/100${apiKey}`);
  });
});

describe('status', () => {
  it('should retrieve status of all servers', () => {
    expect(api.getStatus()).toBe('http://status.leagueoflegends.com/shards/');
  });

  it('should retrieve status of server by given shard', () => {
    expect(api.getStatus(region)).toBe('http://status.leagueoflegends.com/shards/EUW');
  });
});

describe('match', () => {
  it('should retrieve match', () => {
    expect(createQuery('match', { region, matchId: 12345 }, true))
      .toBe(`${defaultUrl}${region}/${match.url}12345${apiKey}`);
  });
});

describe('matchlist', () => {
  it('should retrieve match list by summoner id', () => {
    expect(createQuery('matchList', { region, summonerId }, true))
      .toBe(`${defaultUrl}${region}/${matchList.url}${summonerId}${apiKey}`);
  });
});

describe('should retrieve stats by summoner id', () => {
  it('should retrieve summoner ranked stats', () => {
    expect(createQuery('stats', { region, summonerId, type: 'ranked' }, true))
      .toBe(`${defaultUrl}${region}/${stats.url}${summonerId}/ranked${apiKey}`);
  });
});

describe('should get summoner', () => {
  it('should get summoner by name', () => {
    expect(createQuery('summoner', { name: 'donuts', region }, true))
      .toBe(`${defaultUrl}${region}/${summoner.url}by-name/donuts${apiKey}`);
  });

  it('should get summoner by array of names', () => {
    const summonerNames = ['cheese', 'donuts'];
    expect(createQuery('summoner', { name: summonerNames, region }, true))
      .toBe(`${defaultUrl}${region}/${summoner.url}by-name/${summonerNames}${apiKey}`);
  });

  it('should get summoner by id', () => {
    expect(createQuery('summoner', { region, summonerId }, true))
      .toBe(`${defaultUrl}${region}/${summoner.url}${summonerId}${apiKey}`);
  });

  it('should get summoners name by array of ids', () => {
    const summonerIds = [123, 456, 789];
    expect(createQuery('summoner', { region, summonerId: summonerIds }, true))
      .toBe(`${defaultUrl}${region}/${summoner.url}${summonerIds}${apiKey}`);
  });

  it('should get summoners runes by array of summoner ids', () => {
    const summonerIds = [123, 456, 789];
    expect(createQuery('summoner', { region, summonerId: summonerIds, type: 'runes' }, true))
      .toBe(`${defaultUrl}${region}/${summoner.url}${summonerIds}/runes${apiKey}`);
  });
});

describe('should get team info', () => {
  it('should get teams by summoner ids', () => {
    expect(createQuery('team', { region, id: summonerId, type: 'summoner' }, true))
      .toBe(`${defaultUrl}${region}/${team.url}by-summoner/${summonerId}${apiKey}`);
  });

  it('should get teams by summoner ids', () => {
    const summonerIds = [123, 456, 789];
    expect(createQuery('team', { region, id: summonerIds, type: 'summoner' }, true))
      .toBe(`${defaultUrl}${region}/${team.url}by-summoner/${summonerIds}${apiKey}`);
  });

  it('should get team by team id', () => {
    const teamId = 12345;
    expect(createQuery('team', { region, id: teamId, type: 'team' }, true))
      .toBe(`${defaultUrl}${region}/${team.url}${teamId}${apiKey}`);
  });
});