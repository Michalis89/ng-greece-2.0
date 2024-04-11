export class SelectedFlood {
  static readonly type = '[App] Selected Flood';
  constructor(public payload: string) {}
}

export class SelectedYear {
  static readonly type = '[App] Selected Year';
  constructor(public payload: number) {}
}

export class SelectedDate {
  static readonly type = '[App] Selected Date';
  constructor(public payload: string) {}
}

export class SelectedLocation {
  static readonly type = '[App] Selected Location';
  constructor(public payload: string) {}
}
