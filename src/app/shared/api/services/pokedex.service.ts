import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Pokemon } from '../models/pokemon';

@Injectable()
export class PokedexService {
  constructor(private http: HttpClient) {}

  count(): Observable<number> {
    return this.http.get<number>('api/pokemons', { params: { count: '' } });
  }

  fetch(offset = 0, limit = 0): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>('api/pokemons', {
      params: { offset: offset.toString(), limit: limit.toString() },
    });
  }
}
