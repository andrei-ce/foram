import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/question-repo'

interface EditQuestionUseCaseParams {
  requesterId: string
  questionId: string
  title: string
  content: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EditQuestionUseCaseResponse {
  question: Question
}

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
      throw new Error('Question not found.')
    }
    if (question.authorId.toValue() !== requesterId) {
      throw new Error('Unauthorized.')
    }

    question.title = title
    question.content = content

    this.questionsRepository.save(question)
    return { question }
  }
}
