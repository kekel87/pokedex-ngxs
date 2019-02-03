import { ListRange } from '@angular/cdk/collections';
import { Pokemon } from '~app/shared/api';

export class CountPokemons {
  static readonly type = '[Pokedex] Count pokemons';
}

export class CountPokemonsSuccess {
  static readonly type = '[Pokedex] Count pokemons success';
  constructor(public total: number) {}
}

export class FetchPokemons {
  static readonly type = '[Pokedex] Fetch pokemons';
  constructor(public range: ListRange) {}
}

export class FetchPokemonsSuccess {
  static readonly type = '[Pokedex] Fetch pokemon success';
  constructor(public pokemons: { [index: number]: Pokemon }) {}
}
