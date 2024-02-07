import { FakeEncrypter } from './../../../../../test/cryptography/fake-encrypter'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Authenticate Student Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'john@email.com',
      password: await fakeHasher.hash('password'),
    })

    inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'john@email.com',
      password: 'password',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  // it('should hash student password upon registration', async () => {
  //   const result = await sut.execute({
  //     name: 'John Doe',
  //     email: 'john@email.com',
  //     password: 'password',
  //   })

  //   const hashedPassword = await fakeHasher.hash('password')

  //   expect(result.isRight()).toBe(true)
  //   expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  // })
})
