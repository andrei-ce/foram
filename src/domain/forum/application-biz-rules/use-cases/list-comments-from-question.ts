import { QuestionComment } from '../../enterprise-biz-rules/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repo'

interface ListCommentsFromQuestionUseCaseParams {
  questionId: string
  page: number
}

interface ListCommentsFromQuestionUseCaseResponse {
  questionComments: QuestionComment[]
}

export class ListCommentsFromQuestionUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async exec({
    questionId,
    page,
  }: ListCommentsFromQuestionUseCaseParams): Promise<ListCommentsFromQuestionUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      })

    return { questionComments }
  }
}
