import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  /**
   * Handles exceptions thrown by the Prisma client.
   * @param exception - The Prisma client exception.
   * @param host - The arguments host object.
   */
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);

    // Get the response object from the HTTP context.
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Remove line breaks from the exception message.
    const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002': {
        // If the exception code is P2002, set the status to CONFLICT.
        const status = HttpStatus.CONFLICT;

        // Return a JSON response with the status code and message.
        response.status(status).json({
          statusCode: status,
          message: message,
        });
        break;
      }
      case 'P2025': {
        // If the exception code is P2025, set the status to NOT_FOUND.
        const status = HttpStatus.NOT_FOUND;

        // Return a JSON response with the status code and message.
        response.status(status).json({
          statusCode: status,
          message: message,
        });
        break;
      }
      default:
        // If the exception code is not handled, call the parent catch method.
        super.catch(exception, host);
        break;
    }
  }
}
