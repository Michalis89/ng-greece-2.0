import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Flood, Root } from '../../models/floods.model';

@Injectable({
  providedIn: 'root',
})
export class FloodsDataService {
  private apiUrl = '../../assets/data/floods-data.json';

  constructor(private readonly http: HttpClient) {}

  getFloodData(): Observable<Root> {
    return this.http.get<Root>(this.apiUrl);
  }

  getFloodInfo(): Observable<Flood[]> {
    return this.getFloodData().pipe(
      map((data) => {
        const floods: Flood[] = [];
        for (const key in data.floods) {
          if (data.floods.hasOwnProperty(key)) {
            const floodData = data.floods[key];
            const flood: any = {
              name: floodData.name,
              year: floodData.year,
              date: floodData.date,
              aoi: floodData.aoi,
            };
            floods.push(flood);
          }
        }

        return floods;
      })
    );
  }
}
