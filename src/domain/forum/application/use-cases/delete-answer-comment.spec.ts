import { InMemoryAnswerCommentsCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryAnswerCommentsCommentsRepository: InMemoryAnswerCommentsCommentsRepository
let inMemoryStudentRepository: InMemoryStudentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment Use Case', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsCommentsRepository =
      new InMemoryAnswerCommentsCommentsRepository(inMemoryStudentRepository)
    sut = new DeleteAnswerCommentUseCase(
      inMemoryAnswerCommentsCommentsRepository,
    )
  })

  it('should be able to delete a answer comment by id', async () => {
    const answerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswerCommentsCommentsRepository.create(answerComment)

    await sut.execute({ answerCommentId: 'answer-1', authorId: 'author-1' })

    expect(inMemoryAnswerCommentsCommentsRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a answer comment from another user', async () => {
    const newAnswer = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswerCommentsCommentsRepository.create(newAnswer)

    const result = await sut.execute({
      answerCommentId: 'answer-1',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
