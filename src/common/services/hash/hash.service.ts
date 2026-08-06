import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

@Injectable()
export class HashService {
  make(value: string): string {
    return bcrypt.hashSync(value, 10);
  }

  compare(value: string, hash: string): boolean {
    return bcrypt.compareSync(value, hash);
  }
}
