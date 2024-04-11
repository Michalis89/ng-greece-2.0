import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
  SelectedDate,
  SelectedFlood,
  SelectedLocation,
  SelectedYear,
} from './app.actions';
import { FloodsDataService } from '../services/floods/floods-data.service';
import { Floods } from '../models/floods.model';
import { catchError, distinctUntilChanged, map, of } from 'rxjs';

export class AppStateModel {
  selectedFlood: string | null;
  selectedYear: number | null;
  selectedDate: string | null;
  selectedLocation: string | null;
  floods: Floods;
  availableYears: number[];
  datesByYear: { year: number; dates: number[] }[];
  availableAoiByDate: { date: number; aois: string[] }[];
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    selectedFlood: '',
    selectedYear: 0,
    selectedDate: '',
    selectedLocation: '',
    floods: {},
    availableYears: [],
    datesByYear: [],
    availableAoiByDate: [],
  },
})
@Injectable()
export class AppState {
  constructor(private readonly floodsDataService: FloodsDataService) {}

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

  @Selector([AppState])
  static floods(state: AppStateModel) {
    return state.floods;
  }

  @Selector([AppState])
  static availableYears(state: AppStateModel) {
    return state.availableYears;
  }

  @Selector([AppState])
  static datesByYear(state: AppStateModel) {
    return state.datesByYear;
  }

  @Selector([AppState])
  static availableAoiByDate(state: AppStateModel) {
    return state.availableAoiByDate;
  }

  @Action(SelectedFlood)
  selectedFlood(
    { patchState }: StateContext<AppStateModel>,
    { payload }: SelectedFlood
  ) {
    patchState({ selectedFlood: payload });
    if (payload === 'floods') {
      this.floodsDataService
        .getFloodData()
        .pipe(
          map((data) => {
            patchState({ floods: data.floods });
            const yearsSet = new Set<number>();
            for (const key in data.floods) {
              if (data.floods.hasOwnProperty(key)) {
                const flood = data.floods[key];
                yearsSet.add(flood.year);
              }
            }
            return Array.from(yearsSet);
          }),
          distinctUntilChanged()
        )
        .subscribe((years) => {
          patchState({ availableYears: years });
        });
    }
  }

  @Action(SelectedYear)
  selectedYear(
    { patchState }: StateContext<AppStateModel>,
    { payload }: SelectedYear
  ) {
    patchState({ selectedYear: payload });
    if (payload) {
      this.floodsDataService
        .getFloodData()
        .pipe(
          map((data) => {
            const datesByYear: { year: number; dates: number[] }[] = [];

            Object.keys(data.floods).forEach((key) => {
              const flood = data.floods[key];
              const year = new Date(flood.date * 1000).getFullYear();
              const index = datesByYear.findIndex(
                (group) => group.year === year
              );
              if (index === -1) {
                datesByYear.push({ year, dates: [flood.date] });
              } else {
                datesByYear[index].dates.push(flood.date);
              }
            });

            return datesByYear;
          }),
          distinctUntilChanged()
        )
        .subscribe((datesByYear) => {
          patchState({ datesByYear });
        });
    }
  }

  @Action(SelectedDate)
  selectedDate(
    { patchState }: StateContext<AppStateModel>,
    { payload }: SelectedDate
  ) {
    patchState({ selectedDate: payload });
    if (payload) {
      this.floodsDataService
        .getFloodData()
        .pipe(
          map((data) => {
            const availableAoiByDate: { date: number; aois: string[] }[] = [];
            for (const key in data.floods) {
              if (data.floods.hasOwnProperty(key)) {
                const flood = data.floods[key];
                const date = flood.date;
                if (date !== null) {
                  const aois = flood.aoi.map((area) => area.name);
                  availableAoiByDate.push({ date, aois });
                }
              }
            }
            return availableAoiByDate;
          }),
          catchError((error) => {
            console.error('Failed to fetch flood data:', error);
            return of([]);
          })
        )
        .subscribe((availableAoiByDate) => {
          patchState({ availableAoiByDate });
        });
    }
  }

  @Action(SelectedLocation)
  selectedLocation(
    { patchState }: StateContext<AppStateModel>,
    { payload }: SelectedLocation
  ) {
    patchState({ selectedLocation: payload });
  }
}
