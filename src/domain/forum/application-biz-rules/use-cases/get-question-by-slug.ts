import { Either, fail, succeed } from '@/core/either'
import { Question } from '../../enterprise-biz-rules/entities/question'
import { QuestionsRepository } from '../repositories/question-repo'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface GetQuestionBySlugUseCaseParams {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async exec({
    slug,
  }: GetQuestionBySlugUseCaseParams): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      return fail(new ResourceNotFoundError())
    }

    return succeed({ question })
  }
}
