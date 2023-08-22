import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise-biz-rules/entities/question'
import { QuestionsRepository } from '../repositories/question-repo'
import { Either, succeed } from '@/core/either'

interface CreateQuestionUseCaseParams {
  authorId: string
  title: string
  content: string
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async exec({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseParams): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId), // student or instructor
      title,
      content,
    })

    await this.questionsRepository.create(question)
    return succeed({ question })
  }
}
