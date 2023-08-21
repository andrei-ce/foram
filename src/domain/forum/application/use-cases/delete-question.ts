import { QuestionsRepository } from '../repositories/question-repo'

interface DeleteQuestionUseCaseParams {
  requesterId: string
  questionId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeleteQuestionUseCaseResponse {}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async exec({
    requesterId,
    questionId,
  }: DeleteQuestionUseCaseParams): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found.')
    }
    if (question.authorId.toValue() !== requesterId) {
      throw new Error('Unauthorized.')
    }

    this.questionsRepository.delete(question)
    return {}
  }
}
