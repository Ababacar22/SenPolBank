import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

@Injectable()
export class UserProxyService {
  private readonly userServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.userServiceUrl =
      this.configService.get<string>('USER_SERVICE_URL') || 'http://localhost:3002';
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
        url: `${this.userServiceUrl}${path}`,
        data: body,
        headers: {
          'Content-Type': 'application/json',
          ...(headers?.authorization && {
            Authorization: headers.authorization,
          }),
        },
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('User service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
