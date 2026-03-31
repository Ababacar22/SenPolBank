import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

@Injectable()
export class PoliceProxyService {
  private readonly policeServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.policeServiceUrl =
      this.configService.get<string>('POLICE_SERVICE_URL') || 'http://localhost:3004';
  }

  async proxy(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    path: string,
    body?: any,
    headers?: Record<string, string>,
  ) {
    try {
      const response = await axios({
        method,
        url: `${this.policeServiceUrl}${path}`,
        data: body,
        headers: {
          'Content-Type': 'application/json',
          ...(headers?.authorization && { Authorization: headers.authorization }),
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Police service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
