import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Root } from '../../models/floods.model';
@Injectable({
  providedIn: 'root',
})
export class FloodsDataService {
  private apiUrl = '../../assets/data/data.json';

  constructor(private readonly http: HttpClient) {}

  getFloodData(): Observable<Root> {
    return this.http.get<Root>(this.apiUrl);
  }

  getAvailableDatesForYear(year: number): Observable<string[]> {
    return this.getFloodData().pipe(
      map((data) => {
        const flood = data.floods[`flood_${year}`];
        if (flood) {
          return flood.aoi.map((area) => area.name);
        } else {
          return [];
        }
      })
    );
  }
}
