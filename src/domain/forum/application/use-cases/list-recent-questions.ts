import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/question-repo'

interface ListRecentQuestionsUseCaseParams {
  page: number
  // filters ?
}

interface ListRecentQuestionsUseCaseResponse {
  questions: Question[]
}

export class ListRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async exec({
    page,
  }: ListRecentQuestionsUseCaseParams): Promise<ListRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return { questions }
  }
}
