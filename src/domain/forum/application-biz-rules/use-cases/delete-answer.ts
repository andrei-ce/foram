import { AnswersRepository } from '../repositories/answer-repo'

interface DeleteAnswerUseCaseParams {
  requesterId: string
  answerId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeleteAnswerUseCaseResponse {}

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async exec({
    requesterId,
    answerId,
  }: DeleteAnswerUseCaseParams): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found.')
    }
    if (answer.authorId.toValue() !== requesterId) {
      throw new Error('Unauthorized.')
    }

    this.answersRepository.delete(answer)
    return {}
  }
}
