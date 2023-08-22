import { Either, succeed } from '@/core/either'
import { Question } from '../../enterprise-biz-rules/entities/question'
import { QuestionsRepository } from '../repositories/question-repo'

interface ListRecentQuestionsUseCaseParams {
  page: number
  // filters ?
}

type ListRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class ListRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async exec({
    page,
  }: ListRecentQuestionsUseCaseParams): Promise<ListRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return succeed({ questions })
  }
}
