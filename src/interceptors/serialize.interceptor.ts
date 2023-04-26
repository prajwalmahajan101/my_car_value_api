import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

import { UserDto } from 'src/users/dtos/user.dto';

export class SerializerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> {
    // Run Any thing before the request is handled
    // request handler

    // console.log(context, 'I am running before the handler');
    return handler.handle().pipe(
      map((data: any) => {
        // Run Any thing before the request is handled
        // request handler
        // console.log('I am running before response is sent out', data);
        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
