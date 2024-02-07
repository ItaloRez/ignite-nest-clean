import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'

export abstract class QuestionsRepository {
  abstract create: (question: Question) => Promise<void>
  abstract delete: (question: Question) => Promise<void>
  abstract findById: (id: string) => Promise<Question | null>
  abstract findBySlug: (slug: string) => Promise<Question | null>
  abstract findManyRecent: ({ page }: PaginationParams) => Promise<Question[]>
  abstract save: (question: Question) => Promise<void>
}
