import { HttpStatus } from '@nestjs/common';

export const prismaErrors: Record<
  string,
  {
    statusCode: number;
    message: string;
  }
> = {
  P2000: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Input value is too long.',
  },

  P2001: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Record not found.',
  },

  P2002: {
    statusCode: HttpStatus.CONFLICT,
    message: 'Duplicate entry detected.',
  },

  P2003: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Related record does not exist.',
  },

  P2011: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Required field cannot be null.',
  },

  P2012: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Missing required field.',
  },

  P2015: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Related record not found.',
  },

  P2018: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Required connected records were not found.',
  },

  P2024: {
    statusCode: HttpStatus.GATEWAY_TIMEOUT,
    message: 'Database timeout.',
  },

  P2025: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Record not found.',
  },

  P2028: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Transaction failed.',
  },

  P2034: {
    statusCode: HttpStatus.CONFLICT,
    message: 'Transaction conflict. Please retry.',
  },
};
