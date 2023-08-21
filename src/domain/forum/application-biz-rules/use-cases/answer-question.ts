import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise-biz-rules/entities/answer'
import { AnswersRepository } from '../repositories/answer-repo'

// the interface below is to clarify which argument is which when call new AnswerQuestionUseCase().exec()
interface AnswerQuestionUseCaseParams {
  instructorId: string
  questionId: string
  content: string
}

interface AnswerQuestionUseCaseResponse {
  answer: Answer
}

export class AnswerQuestionUseCase {
  private answersRepository: AnswersRepository

  constructor(answersRepository: AnswersRepository) {
    this.answersRepository = answersRepository
  }

  async exec({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseParams): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    })

    await this.answersRepository.create(answer)
    return { answer }
  }
}
