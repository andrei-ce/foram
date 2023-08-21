import { QuestionCommentsRepository } from '../repositories/question-comments-repo'

interface DeleteQuestionCommentUseCaseParams {
  requesterId: string
  questionCommentId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeleteQuestionCommentUseCaseResponse {}

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async exec({
    requesterId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseParams): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      throw new Error('Comment not found')
    }

    if (questionComment.authorId.toString() !== requesterId) {
      throw new Error('Not Allowed')
    }

    await this.questionCommentsRepository.delete(questionComment)

    return { questionComment }
  }
}
