import { InMemoryDbService, RequestInfo, ResponseOptions } from 'angular-in-memory-web-api';

const url = 'https://raw.githubusercontent.com/cheeaun/repokemon/master/data/pokemon-list.json';

export class InMemoryDataService implements InMemoryDbService {
  async createDb() {
    const pokemons = await fetch(url).then(res => res.json());

    console.log('[MOCK] createDb');
    return { pokemons };
  }

  responseInterceptor(res: ResponseOptions, ri: RequestInfo) {
    console.log('[Mock API RequestInfo]', ri);

    if (ri.query.has('offset')) {
      const offset = Number(ri.query.get('offset'));
      const limit = ri.query.has('limit') ? Number(ri.query.get('limit')) : 10;
      console.log('OFFSET is ' + offset + ' LIMIT is ' + limit);
      res.body = ri.collection.slice(offset, limit);
    }

    if (ri.query.has('count')) {
      console.log('COUNT', ri.collection.length);
      res.body = ri.collection.length;
    }

    console.log('[Mock API response]', res);
    return res;
  }
}
