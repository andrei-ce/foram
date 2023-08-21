import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise-biz-rules/entities/answer-comment'

export interface AnswerCommentsRepository {
  create(answerComent: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  delete(answerComment: AnswerComment): Promise<void>
  findManyByAnswerId(
    id: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
}
