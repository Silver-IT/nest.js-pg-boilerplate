import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class HealthResponse {
  @ApiProperty()
  readonly health: boolean;

  constructor() {
    this.health = true;
  }
}

export class SuccessResponse {
  @ApiProperty()
  @IsBoolean()
  readonly success: boolean;

  constructor(success = true) {
    this.success = success;
  }
}

export class AccessTokenResponse {
  @ApiProperty()
  @IsString()
  readonly accessToken: string;

  constructor(accessToken) {
    this.accessToken = accessToken;
  }
}

export class UploadResponse {
  @ApiProperty()
  @IsString()
  readonly url: string;

  constructor(url) {
    this.url = url;
  }
}

export class TokenResponse {
  @ApiProperty()
  @IsString()
  readonly token: string;

  constructor(token) {
    this.token = token;
  }
}
