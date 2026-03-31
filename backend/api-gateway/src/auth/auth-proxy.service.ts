// ==============================================
// SenPolBank — Auth Proxy Service
// ==============================================
// Ce service fait le pont entre l'API Gateway
// et l'Auth Service (port 3001).
//
// POURQUOI un proxy ?
// - Le client ne connaît qu'un seul point d'entrée (port 3000)
// - Le gateway gère la sécurité, le rate limiting, etc.
// - Les microservices restent isolés du réseau externe
// ==============================================

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

@Injectable()
export class AuthProxyService {
  private readonly authServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    // URL du auth-service (configurable via .env)
    this.authServiceUrl =
      this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
  }

  // Proxy générique : transfère la requête vers auth-service
  async proxy(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: any,
    headers?: Record<string, string>,
  ) {
    try {
      const response = await axios({
        method,
        url: `${this.authServiceUrl}${path}`,
        data: body,
        headers: {
          'Content-Type': 'application/json',
          // Transférer le header Authorization si présent
          ...(headers?.authorization && {
            Authorization: headers.authorization,
          }),
        },
      });

      return response.data;
    } catch (error) {
      // Transférer l'erreur du microservice au client
      if (error instanceof AxiosError && error.response) {
        throw new HttpException(
          error.response.data,
          error.response.status,
        );
      }
      throw new HttpException(
        'Auth service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
