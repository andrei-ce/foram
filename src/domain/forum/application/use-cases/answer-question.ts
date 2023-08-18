import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answer-repo'

// the interface below is to clarify which argument is which when call new AnswerQuestionUseCase().exec()
interface AnswerQuestionUseCaseArgs {
  instructorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase {
  private answersRepository: AnswersRepository

  constructor(answersRepository: AnswersRepository) {
    this.answersRepository = answersRepository
  }

  async exec({ instructorId, questionId, content }: AnswerQuestionUseCaseArgs) {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    })

    await this.answersRepository.create(answer)
    return answer
  }
}
