import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Pokemon } from '~app/shared/api';

import { CountPokemons, FetchPokemons } from './pokedex.actions';
import { PokedexState } from './pokedex.state';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokedexComponent implements OnInit {
  itemSize = 72;
  minBufferPx = this.itemSize * 5;
  maxBufferPx = this.itemSize * 10;

  @Select(PokedexState.isLoading) loading$: Observable<boolean>;
  @Select(PokedexState.indexes()) indexes$: Observable<number>;
  @Select(PokedexState.pokemons) pokemons$: Observable<Pokemon[]>;

  @ViewChild('virtualViewport') public virtualViewport: CdkVirtualScrollViewport;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new CountPokemons());

    this.virtualViewport.renderedRangeStream
      .pipe(debounceTime(100))
      .subscribe(range => this.store.dispatch(new FetchPokemons(range)));
  }

  displayPokemon(index: number): Observable<Pokemon> {
    return this.pokemons$.pipe(map(pokemons => pokemons[index]));
  }

  trackByIndex(index: number) {
    return index;
  }
}

// export class MyDataSource extends DataSource<Pokemon> {
//   @Select(PokedexState.pokemons) pokemons$: Observable<Pokemon[]>;
//   private isDisconnected$: Subject<boolean> = new Subject<boolean>();

//   constructor(private store: Store) {
//     super();
//   }

//   connect(collectionViewer: CollectionViewer): Observable<Pokemon[]> {
//     console.log('connect');

//     collectionViewer.viewChange
//       .pipe(
//         debounceTime(200),
//         takeUntil(this.isDisconnected$)
//       )
//       .subscribe(range => {
//         console.log('viewChange', range);
//         this.store.dispatch(new FetchPokemons(RangeError));
//       });

//     this.store.dispatch(new FetchPokemons({ start: 0, 10));

//     return this.pokemons$;
//   }

//   disconnect(): void {
//     this.isDisconnected$.complete();
//   }
// }
