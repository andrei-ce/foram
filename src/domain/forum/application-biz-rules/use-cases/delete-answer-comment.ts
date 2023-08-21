import { AnswerCommentsRepository } from '../repositories/answer-comments-repo'

interface DeleteAnswerCommentUseCaseParams {
  requesterId: string
  answerCommentId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeleteAnswerCommentUseCaseResponse {}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async exec({
    requesterId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseParams): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      throw new Error('Comment not found')
    }

    if (answerComment.authorId.toString() !== requesterId) {
      throw new Error('Not Allowed')
    }

    await this.answerCommentsRepository.delete(answerComment)

    return { answerComment }
  }
}
