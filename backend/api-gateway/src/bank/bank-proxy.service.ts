import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

@Injectable()
export class BankProxyService {
  private readonly bankServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.bankServiceUrl = this.configService.get<string>('BANK_SERVICE_URL') || 'http://localhost:3005';
  }

  async proxy(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, body?: any, headers?: Record<string, string>) {
    try {
      const response = await axios({
        method, url: `${this.bankServiceUrl}${path}`, data: body,
        headers: { 'Content-Type': 'application/json', ...(headers?.authorization && { Authorization: headers.authorization }) },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) throw new HttpException(error.response.data, error.response.status);
      throw new HttpException('Bank service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
