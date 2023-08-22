import { Either, fail, succeed } from '@/core/either'
import { Question } from '../../enterprise-biz-rules/entities/question'
import { QuestionsRepository } from '../repositories/question-repo'
import { NotAllowedError } from './errors/not-allowed'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface EditQuestionUseCaseParams {
  requesterId: string
  questionId: string
  title: string
  content: string
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async exec({
    requesterId,
    questionId,
    title,
    content,
  }: EditQuestionUseCaseParams): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return fail(new ResourceNotFoundError())
    }
    if (question.authorId.toValue() !== requesterId) {
      return fail(new NotAllowedError())
    }

    question.title = title
    question.content = content

    this.questionsRepository.save(question)
    return succeed({ question })
  }
}
