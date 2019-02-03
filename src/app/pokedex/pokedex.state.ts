import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { empty } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { PokedexService, Pokemon } from '~app/shared/api';

import {
  CountPokemons,
  CountPokemonsSuccess,
  FetchPokemons,
  FetchPokemonsSuccess,
} from './pokedex.actions';

export interface PokedexStateModel {
  total: number;
  pokemons: { [index: number]: Pokemon };
  isLoading: boolean;
}

@State<PokedexStateModel>({
  name: 'pokedex',
  defaults: {
    total: 0,
    pokemons: {},
    isLoading: false,
  },
})
export class PokedexState {
  constructor(private pokedexService: PokedexService) {
    // I think 🤔, this is an effect ...
    // this.actions$
    //   .pipe(
    //     ofActionDispatched(FetchPokemons),
    //     switchMap((action: FetchPokemons) =>
    //       this.pokedexService.fetchPokemons(action.range.start, action.range.end)
    //     )
    //   )
    //   .subscribe(pokemons => this.store.dispatch(new FetchPokemonsSuccess(pokemons)));
  }

  @Selector()
  static pokemons(state: PokedexStateModel) {
    return state.pokemons;
  }

  @Selector()
  static total(state: PokedexStateModel) {
    return state.total;
  }

  static indexes() {
    return createSelector(
      [PokedexState.total],
      (total: number) => {
        return Array(total)
          .fill(0)
          .map((_, i) => i);
      }
    );
  }

  @Selector()
  static isLoading(state: PokedexStateModel) {
    return state.isLoading;
  }

  @Action(CountPokemons)
  count({ patchState, dispatch }: StateContext<PokedexStateModel>) {
    patchState({ isLoading: true });
    // 😒 https://github.com/ngxs/store/issues/139
    // https://ngxs.gitbook.io/ngxs/concepts/state#dispatching-actions-from-actions
    return this.pokedexService
      .count()
      .pipe(mergeMap(total => dispatch(new CountPokemonsSuccess(total))));
  }

  @Action(CountPokemonsSuccess)
  countSuccess({ patchState }: StateContext<PokedexStateModel>, { total }: CountPokemonsSuccess) {
    patchState({ total, isLoading: true });
  }

  @Action(FetchPokemons, { cancelUncompleted: true })
  fetch(
    { getState, patchState, dispatch }: StateContext<PokedexStateModel>,
    { range }: FetchPokemons
  ) {
    patchState({ isLoading: true });

    const pokemon = { ...getState().pokemons };
    const indexes = Object.keys(pokemon).map(key => Number(key));
    const min = Math.min(...indexes);
    const max = Math.max(...indexes);
    const preserved = indexes
      .filter(index => index >= range.start && index <= range.end)
      .reduce((acc, key) => ({ ...acc, [key]: pokemon[key] }), {});

    if (min < range.start && range.end < max) {
      return empty();
    }

    if (range.start < min && range.end > min) {
      range.end = min;
    }

    if (range.end > max && range.start < max) {
      range.start = max;
    }

    if (range.end === range.start) {
      return empty();
    }

    // 😒 https://github.com/ngxs/store/issues/139
    return this.pokedexService.fetch(range.start, range.end).pipe(
      map(pokemons =>
        pokemons.reduce((acc, pkm, index) => ({ ...acc, [index + range.start]: pkm }), preserved)
      ),
      mergeMap(pokemons => dispatch(new FetchPokemonsSuccess(pokemons)))
    );
  }

  @Action(FetchPokemonsSuccess)
  fetchSuccess(
    { patchState }: StateContext<PokedexStateModel>,
    { pokemons }: FetchPokemonsSuccess
  ) {
    patchState({ pokemons, isLoading: false });
  }
}
