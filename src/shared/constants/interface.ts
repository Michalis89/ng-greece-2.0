import { EventTypes, EventYear, EventDate, EventLocation } from './enums';

export interface EventSelection {
  eventType?: EventTypes;
  eventYear?: EventYear;
  eventDate?: EventDate;
  eventLocation?: EventLocation;
}
