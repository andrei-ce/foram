import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise-biz-rules/entities/question'
import { QuestionsRepository } from '../repositories/question-repo'
import { Either, succeed } from '@/core/either'
import { QuestionAttachment } from '../../enterprise-biz-rules/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise-biz-rules/entities/question-attachment-list'

interface CreateQuestionUseCaseParams {
  authorId: string
  title: string
  content: string
  attachmentIds: string[]
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
    attachmentIds,
  }: CreateQuestionUseCaseParams): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId), // student or instructor
      title,
      content,
    })

    const questionAttachments = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionsRepository.create(question)
    return succeed({ question })
  }
}
