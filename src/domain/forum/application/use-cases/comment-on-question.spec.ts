import { InMemoryQuestionCommentsCommentsRepository } from '@/../test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsCommentsRepository: InMemoryQuestionCommentsCommentsRepository
let sut: CommentOnQuestionUseCase
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

describe('Comment on Question Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionCommentsCommentsRepository =
      new InMemoryQuestionCommentsCommentsRepository()
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsCommentsRepository,
    )
  })

  it('should be able to comment on a question', async () => {
    const newQuestion = makeQuestion()

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      content: 'New comment',
    })

    expect(inMemoryQuestionCommentsCommentsRepository.items[0].content).toEqual(
      'New comment',
    )
  })
})
