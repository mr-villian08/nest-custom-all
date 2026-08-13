import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((response: { message?: string; data?: T } | T) => {
        if (
          response &&
          typeof response === 'object' &&
          'message' in response &&
          'data' in response
        ) {
          return {
            status: true,
            message: response.message,
            data: response.data,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          status: true,
          data: response,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
