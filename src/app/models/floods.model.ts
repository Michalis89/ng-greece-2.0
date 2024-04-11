export interface Root {
  floods: Floods;
}

export interface Floods {
  [key: string]: Flood;
}

export interface Flood {
  name: string;
  year: number;
  date: number;
  deaths: number;
  aoi: Aoi[];
  total: Total;
}

export interface Aoi {
  name: string;
  coords: Coords;
  maxLandFlooded: number;
  potentialAffected: AffectedOrPotentialAffected;
}

export interface Coords {
  lat: number;
  lon: number;
}

export interface AffectedOrPotentialAffected {
  builtUp: number;
  roads: number;
  population: number;
}

export interface Total {
  maxLandFlooded: number;
  potentialAffected: AffectedOrPotentialAffected;
}
