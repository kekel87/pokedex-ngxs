import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule, MatProgressBarModule } from '@angular/material';
import { NgxsModule } from '@ngxs/store';
import { PokedexService } from '~app/shared/api';

import { PokedexComponent } from './pokedex.component';
import { PokedexRoutingModule } from './pokedex.routing';
import { PokedexState } from './pokedex.state';

@NgModule({
  declarations: [PokedexComponent],
  imports: [
    CommonModule,
    PokedexRoutingModule,
    NgxsModule.forFeature([PokedexState]),
    MatProgressBarModule,
    MatListModule,
    ScrollingModule,
  ],
  providers: [PokedexService],
})
export class PokedexModule {}
