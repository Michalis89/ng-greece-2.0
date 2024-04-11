import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../state/app.state';
import { Select, Store } from '@ngxs/store';
import { EventTypes } from '../../../shared/constants/enums';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  SelectedDate,
  SelectedFlood,
  SelectedLocation,
  SelectedYear,
} from '../../state/app.actions';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    CustomDatePipe,
    DatePipe,
    MatButtonModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Select(AppState.selectedFlood) selectedFlood$: Observable<string>;
  @Select(AppState.selectedYear) selectedYear$: Observable<number>;
  @Select(AppState.selectedDate) selectedDate$: Observable<string>;
  @Select(AppState.selectedLocation) selectedLocation$: Observable<string>;
  @Select(AppState.availableYears) availableYears$: Observable<number[]>;
  @Select(AppState.datesByYear) datesByYear$: Observable<any>;
  @Select(AppState.availableAoiByDate) availableAoiByDate$: Observable<any>;
  private map: any;
  private destroy$: Subject<void> = new Subject();
  selectedEventType: string;
  selectedEventYear: number;
  selectedEventDate: string;
  selectedLocation: string;

  eventTypes = [
    { label: EventTypes.Floods, value: EventTypes.Floods },
    { label: EventTypes.Wildfires, value: EventTypes.Wildfires },
  ];

  constructor(
    private readonly http: HttpClient,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.selectedFlood$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.resetMap());
    this.selectedYear$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.resetMap());
    this.selectedDate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.resetMap());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  eventSelection() {
    const selectedValue = this.selectedEventType;
    this.store.dispatch(new SelectedFlood(selectedValue));
  }

  yearSelection() {
    const selectedValue = this.selectedEventYear;
    this.store.dispatch(new SelectedYear(selectedValue));
  }

  dateSelection() {
    const selectedValue = this.selectedEventDate;
    this.store.dispatch(new SelectedDate(selectedValue));
    this.resetMap();
  }

  locationSelection() {
    const selectedValue = this.selectedLocation;
    this.store.dispatch(new SelectedLocation(selectedValue));
    this.loadGeoJSONAndSetView();
    this.resetMap();
  }

  private initMap() {
    this.map = L.map('map', {
      fadeAnimation: true,
      zoomAnimation: true,
    }).setView([38.255, 22.2], 7);

    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        maxZoom: 18,
        id: 'mapbox/satellite-streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          'pk.eyJ1IjoibWlnaGVsbG9zODkiLCJhIjoiY2sxejVhanh4MG00YzNubGl5aTYyNmw1diJ9.fSDwfoLOz6ypPI_VNMDMiA',
      }
    ).addTo(this.map);
  }

  private resetMap(): void {
    this.map.eachLayer((layer: any) => {
      if (!layer._url) {
        this.map.removeLayer(layer).setView([38.255, 22.2], 7);
      }
    });
  }

  private loadGeoJSONAndSetView() {
    this.map.eachLayer((layer: any) => {
      if (!layer._url) {
        this.map.removeLayer(layer);
      }
    });
    this.http
      .get(
        `../../../../assets/data/${this.selectedEventType}/${this.selectedEventYear}/${this.selectedEventDate}/${this.selectedLocation}/areaOfInterestA_v1.geojson`
      )
      .subscribe((areaOfInterestData: any) => {
        const areaOfInterestLayer = L.geoJSON(areaOfInterestData, {
          style: {
            fillColor: 'wheat',
            color: 'black',
            weight: 2,
          },
        }).addTo(this.map);
        this.fitMapToBounds(areaOfInterestLayer);
      });

    this.http
      .get(
        `../../../../assets/data/${this.selectedEventType}/${this.selectedEventYear}/${this.selectedEventDate}/${this.selectedLocation}/observedEventA_v1.geojson`
      )
      .subscribe((observedEventData: any) => {
        const observedEventLayer = L.geoJSON(observedEventData, {
          style: {
            fillColor: 'blue',
            color: 'blue',
            weight: 2,
          },
        }).addTo(this.map);
        this.fitMapToBounds(observedEventLayer);
      });
  }

  private fitMapToBounds(layer: any) {
    const bounds = layer.getBounds();

    if (bounds.isValid()) {
      this.map.fitBounds(bounds);
    } else {
      console.error('Invalid bounds');
    }
  }
}
