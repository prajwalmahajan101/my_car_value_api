import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2050)
  @Transform(({ obj }) => parseInt(obj.year))
  year: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  @Transform(({ obj }) => parseInt(obj.mileage))
  mileage: number;

  @IsLongitude()
  @Transform(({ obj }) => parseInt(obj.lng))
  lng: number;

  @IsLatitude()
  @Transform(({ obj }) => parseInt(obj.lat))
  lat: number;
}
