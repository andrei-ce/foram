import { Answer } from '../../enterprise-biz-rules/entities/answer'
import { AnswersRepository } from '../repositories/answer-repo'

interface ListAnswersFromQuestionUseCaseParams {
  questionId: string
  page: number
}

interface ListAnswersFromQuestionUseCaseResponse {
  answers: Answer[]
}

export class ListAnswersFromQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async exec({
    questionId,
    page,
  }: ListAnswersFromQuestionUseCaseParams): Promise<ListAnswersFromQuestionUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return { answers }
  }
}
