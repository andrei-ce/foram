import { Either, fail, succeed } from '@/core/either'
import { Answer } from '../../enterprise-biz-rules/entities/answer'
import { AnswersRepository } from '../repositories/answer-repo'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotAllowedError } from './errors/not-allowed'

interface EditAnswerUseCaseParams {
  requesterId: string
  answerId: string
  content: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async exec({
    requesterId,
    answerId,
    content,
  }: EditAnswerUseCaseParams): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return fail(new ResourceNotFoundError())
    }
    if (answer.authorId.toValue() !== requesterId) {
      return fail(new NotAllowedError())
    }

    answer.content = content

    this.answersRepository.save(answer)
    return succeed({ answer })
  }
}
