import { Prisma } from '../../generated/prisma/client';
import { uppercaseFirst } from '../helpers/string.helper';

export function getUniqueConstraintField(
  exception: Prisma.PrismaClientKnownRequestError,
): string {
  const driverAdapterError = exception.meta?.driverAdapterError as
    | {
        cause?: {
          constraint?: {
            constraintName?: string;
          };
          originalMessage?: string;
        };
      }
    | undefined;

  const constraintName = driverAdapterError?.cause?.constraint?.constraintName;

  if (constraintName) {
    const match = constraintName.match(/^[^_]+_(.+)_key$/);

    if (match) {
      return match[1];
    }
  }

  const originalMessage = driverAdapterError?.cause?.originalMessage ?? '';

  const match = originalMessage.match(/"([^"]+)"/);

  if (match) {
    const constraint = match[1];
    const field = constraint.replace(/^[^_]+_/, '').replace(/_key$/, '');

    return uppercaseFirst(field);
  }

  return 'field';
}
