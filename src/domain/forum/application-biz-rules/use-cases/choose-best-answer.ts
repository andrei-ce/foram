import { AnswersRepository } from '../repositories/answer-repo'
import { Question } from '../../enterprise-biz-rules/entities/question'
import { QuestionsRepository } from '../repositories/question-repo'
import { Either, fail, succeed } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotAllowedError } from './errors/not-allowed'

interface ChooseBestAnswerUseCaseParams {
  requesterId: string
  answerId: string
}

type ChooseBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>

export class ChooseBestAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository,
  ) {}

  async exec({
    requesterId,
    answerId,
  }: ChooseBestAnswerUseCaseParams): Promise<ChooseBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      return fail(new ResourceNotFoundError())
    }
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return fail(new ResourceNotFoundError())
    }
    if (question.authorId.toString() !== requesterId) {
      return fail(new NotAllowedError())
    }

    question.bestAnswerId = answer.id
    await this.questionsRepository.save(question)

    return succeed({ question })
  }
}
