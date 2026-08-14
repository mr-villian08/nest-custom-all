import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../../generated/prisma/client';
import { prismaErrors } from '../constants/prisma.errors';
import {
  getRecordNotFoundField,
  getUniqueConstraintField,
} from '../utils/prisma-errors.util';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientUnknownRequestError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        const field = getUniqueConstraintField(exception);

        response.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          message: `${field} already exists.`,
        });
        return;
      }

      if (exception.code === 'P2025') {
        const field = getRecordNotFoundField(exception);

        response.status(HttpStatus.NOT_FOUND).json({
          status: false,
          message: field
            ? `${field} not found. Try again!`
            : 'Required record not found.',
        });

        return;
      }

      const prismaError = prismaErrors[exception.code];

      response
        .status(prismaError?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          status: false,
          message:
            prismaError?.message ?? 'An unexpected database error occurred.',
        });

      return;
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: 'Invalid database query.',
      });

      return;
    }

    if (exception instanceof Prisma.PrismaClientInitializationError) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Database connection failed.',
      });

      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Internal server error.',
    });
  }
}
