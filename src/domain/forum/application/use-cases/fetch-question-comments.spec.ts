import { InMemoryStudentsRepository } from './../../../../../test/repositories/in-memory-students-repository'
import { InMemoryQuestionCommentsCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsCommentsRepository: InMemoryQuestionCommentsCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsCommentsRepository =
      new InMemoryQuestionCommentsCommentsRepository(inMemoryStudentsRepository)
    sut = new FetchQuestionCommentsUseCase(
      inMemoryQuestionCommentsCommentsRepository,
    )
  })

  it('should be able to get fecth question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    const commment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const commment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const commment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentsCommentsRepository.create(commment1)
    await inMemoryQuestionCommentsCommentsRepository.create(commment2)
    await inMemoryQuestionCommentsCommentsRepository.create(commment3)

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: commment1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: commment2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: commment3.id,
        }),
      ]),
    )
  })

  it('should be able to get fecth paginated comments', async () => {
    const student = makeStudent()

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
  })
})
