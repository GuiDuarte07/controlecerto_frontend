export class InfoLimitResponse {
  actualLimit: number;
  availableMonthLimit: number;
  accumulatedLimit: number;

  constructor(
    actualLimit: number,
    availableMonthLimit: number,
    accumulatedLimit: number
  ) {
    this.actualLimit = actualLimit;
    this.availableMonthLimit = availableMonthLimit;
    this.accumulatedLimit = accumulatedLimit;
  }
}
