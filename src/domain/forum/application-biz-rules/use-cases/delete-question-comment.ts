import { Either, fail, succeed } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments-repo'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed'

interface DeleteQuestionCommentUseCaseParams {
  requesterId: string
  questionCommentId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async exec({
    requesterId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseParams): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return fail(new ResourceNotFoundError())
    }

    if (questionComment.authorId.toString() !== requesterId) {
      return fail(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return succeed({ questionComment })
  }
}
