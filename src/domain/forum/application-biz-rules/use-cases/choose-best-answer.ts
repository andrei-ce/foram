import { AnswersRepository } from '../repositories/answer-repo'
import { Question } from '../../enterprise-biz-rules/entities/question'
import { QuestionsRepository } from '../repositories/question-repo'

interface ChooseBestAnswerUseCaseParams {
  requesterId: string
  answerId: string
}

interface ChooseBestAnswerUseCaseResponse {
  question: Question
}

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
      throw new Error('Answer not found')
    }
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      throw new Error('Question not found')
    }
    if (question.authorId.toString() !== requesterId) {
      throw new Error('Unauthorized')
    }

    question.bestAnswerId = answer.id
    await this.questionsRepository.save(question)

    return { question }
  }
}
