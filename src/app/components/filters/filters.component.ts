import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../state/app.state';
import { Select, Store } from '@ngxs/store';
import {
  EventDate,
  EventLocation,
  EventTypes,
  EventYear,
} from '../../../shared/constants/enums';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  SelectedDate,
  SelectedFlood,
  SelectedLocation,
  SelectedYear,
} from '../../state/app.actions';
import { CommonModule } from '@angular/common';
import { Observable, Subject, catchError, forkJoin, of, takeUntil } from 'rxjs';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FloodsDataService } from '../../services/floods/floods-data.service';

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
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Select(AppState.selectedFlood) selectedFlood$: Observable<string>;
  @Select(AppState.selectedYear) selectedYear$: Observable<number>;
  @Select(AppState.selectedDate) selectedDate$: Observable<string>;
  @Select(AppState.selectedLocation) selectedLocation$: Observable<string>;
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

  eventYears = [
    { label: EventYear.Year2024, value: EventYear.Year2024 },
    { label: EventYear.Year2023, value: EventYear.Year2023 },
    { label: EventYear.Year2022, value: EventYear.Year2022 },
    { label: EventYear.Year2021, value: EventYear.Year2021 },
    { label: EventYear.Year2020, value: EventYear.Year2020 },
    { label: EventYear.Year2019, value: EventYear.Year2019 },
  ];

  eventDates = [
    {
      label: 'Daniel' + ' ' + '(' + EventDate.Daniel + ')',
      value: EventDate.Daniel,
    },
    {
      label: 'Elias' + ' ' + '(' + EventDate.Elias + ')',
      value: EventDate.Elias,
    },
  ];
  eventLocations = [
    { label: 'All', value: 'all' },
    { label: EventLocation.Larissa, value: EventLocation.Larissa },
    { label: EventLocation.Karditsa, value: EventLocation.Karditsa },
    { label: EventLocation.Kalamaki, value: EventLocation.Kalamaki },
    { label: EventLocation.Keramidi, value: EventLocation.Keramidi },
    {
      label: EventLocation.Stefanovikio,
      value: EventLocation.Stefanovikio,
    },
    { label: EventLocation.Palamas, value: EventLocation.Palamas },
  ];
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
    private readonly floodsDataService: FloodsDataService
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
  }

  locationSelection() {
    const selectedValue = this.selectedLocation;
    if (selectedValue === 'all') {
      this.store.dispatch(new SelectedLocation(selectedValue));
      this.displayAllLocations();
    } else {
      this.store.dispatch(new SelectedLocation(selectedValue));
      this.loadGeoJSONAndSetView();
    }
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

  private displayAllLocations() {
    this.map.eachLayer((layer: any) => {
      if (!layer._url) {
        this.map.removeLayer(layer);
      }
    });
    const requests: Observable<any>[] = [];

    const locations = [
      EventLocation.Larissa,
      EventLocation.Karditsa,
      EventLocation.Stefanovikio,
      EventLocation.Kalamaki,
      EventLocation.Keramidi,
    ];

    locations.forEach((location) => {
      requests.push(
        this.http
          .get(
            `../../../../assets/data/${this.selectedEventType}/${this.selectedEventYear}/${this.selectedEventDate}/${location}/observedEventA_v1.geojson`
          )
          .pipe(
            catchError((error) => {
              console.error(`Failed to load GeoJSON for ${location}`, error);
              return of(null);
            })
          )
      );
    });

    forkJoin(requests).subscribe((responses: any[]) => {
      responses.forEach((response) => {
        if (response) {
          const layer = L.geoJSON(response, {
            style: {
              fillColor: 'blue',
              color: 'blue',
              weight: 2,
            },
          }).addTo(this.map);
          this.fitMapToBounds(layer);
          this.map.setView([39.53158493558717, 22.137451171875004], 9);
        }
      });
    });
  }
}
