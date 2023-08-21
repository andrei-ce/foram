import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise-biz-rules/entities/question-comment'

export interface QuestionCommentsRepository {
  create(questionComent: QuestionComment): Promise<void>
  findById(id: string): Promise<QuestionComment | null>
  delete(questionComent: QuestionComment): Promise<void>
  findManyByQuestionId(
    id: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
}
