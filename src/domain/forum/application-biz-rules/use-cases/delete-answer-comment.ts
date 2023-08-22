import { Either, fail, succeed } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repo'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotAllowedError } from './errors/not-allowed'

interface DeleteAnswerCommentUseCaseParams {
  requesterId: string
  answerCommentId: string
}

// Record<string, never> instead of {} ?
type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {}
>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async exec({
    requesterId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseParams): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return fail(new ResourceNotFoundError())
    }

    if (answerComment.authorId.toString() !== requesterId) {
      return fail(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(answerComment)

    return succeed({})
  }
}
