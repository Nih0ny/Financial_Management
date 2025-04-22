export class AnalyticsResultDto {
  [key: string]: AnalyticsResultDto | number | number[] | undefined;
  total: number;
  inPercent: number;
  recieptIds?: number[];
}
