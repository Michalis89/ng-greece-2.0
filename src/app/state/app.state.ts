import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
  SelectedDate,
  SelectedFlood,
  SelectedLocation,
  SelectedYear,
} from './app.actions';
import { FloodsDataService } from '../services/floods/floods-data.service';
import { HttpClient } from '@angular/common/http';

export class AppStateModel {
  selectedFlood: string;
  selectedYear: number;
  selectedDate: string;
  selectedLocation: string;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    selectedFlood: '',
    selectedYear: 0,
    selectedDate: '',
    selectedLocation: '',
  },
})
@Injectable()
export class AppState {
  @Selector([AppState])
  static selectedFlood(state: AppStateModel) {
    return state.selectedFlood;
  }
  @Selector([AppState])
  static selectedYear(state: AppStateModel) {
    return state.selectedYear;
  }
  @Selector([AppState])
  static selectedDate(state: AppStateModel) {
    return state.selectedDate;
  }
  @Selector([AppState])
  static selectedLocation(state: AppStateModel) {
    return state.selectedLocation;
  }

  @Action(SelectedFlood)
  selectedFlood(
    { patchState }: StateContext<AppStateModel>,
    { payload }: SelectedFlood
  ) {
    patchState({ selectedFlood: payload });
    if (payload === 'floods') {
      // this.floodsDataService.getFloodData().subscribe((data) => {
      //   console.log('Flood data:', data);
      // });
    }
    console.log('state Selected Flood:', payload);
  }

  @Action(SelectedYear)
  selectedYear(
    { patchState }: StateContext<AppStateModel>,
    { payload }: SelectedYear
  ) {
    patchState({ selectedYear: payload });
    console.log('state Selected Year:', payload);
  }

  @Action(SelectedDate)
  selectedDate(
    { patchState }: StateContext<AppStateModel>,
    { payload }: SelectedDate
  ) {
    patchState({ selectedDate: payload });
    console.log('state Selected Date:', payload);
  }

  @Action(SelectedLocation)
  selectedLocation(
    { patchState }: StateContext<AppStateModel>,
    { payload }: SelectedLocation
  ) {
    patchState({ selectedLocation: payload });
    console.log('state Selected Location:', payload);
  }
}
