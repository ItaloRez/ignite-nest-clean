import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  async hash(plain: string) {
    return await hash(plain, this.HASH_SALT_LENGTH)
  }

  async compare(plain: string, hashed: string) {
    return await compare(plain, hashed)
  }
}
