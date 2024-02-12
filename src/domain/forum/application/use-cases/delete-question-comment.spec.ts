import { InMemoryQuestionCommentsCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionCommentsCommentsRepository: InMemoryQuestionCommentsCommentsRepository
let inMemoryStudentRepository: InMemoryStudentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsCommentsRepository =
      new InMemoryQuestionCommentsCommentsRepository(inMemoryStudentRepository)
    sut = new DeleteQuestionCommentUseCase(
      inMemoryQuestionCommentsCommentsRepository,
    )
  })

  it('should be able to delete a question comment by id', async () => {
    const questionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionCommentsCommentsRepository.create(questionComment)

    await sut.execute({ questionCommentId: 'question-1', authorId: 'author-1' })

    expect(inMemoryQuestionCommentsCommentsRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a question comment from another user', async () => {
    const newQuestion = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionCommentsCommentsRepository.create(newQuestion)

    const result = await sut.execute({
      questionCommentId: 'question-1',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
