import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  create: (answer: AnswerComment) => Promise<void>
  delete: (question: AnswerComment) => Promise<void>
  findById: (id: string) => Promise<AnswerComment | null>
  findManyByAnswerId: (
    answerId: string,
    options: { page: number },
  ) => Promise<AnswerComment[]>
}
