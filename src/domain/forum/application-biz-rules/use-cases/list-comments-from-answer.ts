import { Either, succeed } from '@/core/either'
import { AnswerComment } from '../../enterprise-biz-rules/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repo'

interface ListCommentsFromAnswerUseCaseParams {
  answerId: string
  page: number
}

type ListCommentsFromAnswerUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

export class ListCommentsFromAnswerUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async exec({
    answerId,
    page,
  }: ListCommentsFromAnswerUseCaseParams): Promise<ListCommentsFromAnswerUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      })

    return succeed({ answerComments })
  }
}
