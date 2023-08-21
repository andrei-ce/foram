import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answer-repo'

interface EditAnswerUseCaseParams {
  requesterId: string
  answerId: string
  content: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EditAnswerUseCaseResponse {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async exec({
    requesterId,
    answerId,
    content,
  }: EditAnswerUseCaseParams): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found.')
    }
    if (answer.authorId.toValue() !== requesterId) {
      throw new Error('Unauthorized.')
    }

    answer.content = content

    this.answersRepository.save(answer)
    return { answer }
  }
}
