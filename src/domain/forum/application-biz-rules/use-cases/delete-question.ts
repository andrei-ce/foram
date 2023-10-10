import { QuestionsRepository } from '../repositories/question-repo'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed'
import { Either, fail, succeed } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found'

interface DeleteQuestionUseCaseParams {
  requesterId: string
  questionId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async exec({
    requesterId,
    questionId,
  }: DeleteQuestionUseCaseParams): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return fail(new ResourceNotFoundError())
    }
    if (question.authorId.toValue() !== requesterId) {
      return fail(new NotAllowedError())
    }

    this.questionsRepository.delete(question)
    return succeed({})
  }
}
