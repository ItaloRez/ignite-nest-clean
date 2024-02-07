import { InMemoryAnswerCommentsCommentsRepository } from '@/../test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsCommentsRepository: InMemoryAnswerCommentsCommentsRepository
let sut: CommentOnAnswerUseCase
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

describe('Comment on Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsCommentsRepository =
      new InMemoryAnswerCommentsCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsCommentsRepository,
    )
  })

  it('should be able to comment on a answer', async () => {
    const newAnswer = makeAnswer()

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
      content: 'New comment',
    })

    expect(inMemoryAnswerCommentsCommentsRepository.items[0].content).toEqual(
      'New comment',
    )
  })
})
