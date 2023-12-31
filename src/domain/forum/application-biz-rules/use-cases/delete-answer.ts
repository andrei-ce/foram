import { Either, fail, succeed } from '@/core/either'
import { AnswersRepository } from '../repositories/answer-repo'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed'

interface DeleteAnswerUseCaseParams {
  requesterId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async exec({
    requesterId,
    answerId,
  }: DeleteAnswerUseCaseParams): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return fail(new ResourceNotFoundError())
    }
    if (answer.authorId.toString() !== requesterId) {
      return fail(new NotAllowedError())
    }

    this.answersRepository.delete(answer)
    return succeed({})
  }
}
