import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        const message = data?.message || 'Request successful';

        let responseData = data;

        if (data && typeof data === 'object') {
          
          const { message: _, ...rest } = data;

         
          if ('access_token' in data || 'session' in data) {
            responseData = rest;
          } 
          
          else if ('user' in data && Object.keys(rest).length === 1) {
            responseData = data.user;
          } 
         
          else if (Object.keys(rest).length === 0) {
            responseData = null;
          } else {
            responseData = rest;
          }
        }

        return {
          success: true,
          statusCode: statusCode,
          message: message,
          data: responseData,
        };
      }),
    );
  }
}