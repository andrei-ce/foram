import { Either, fail, succeed } from '@/core/either'
import { Question } from '../../enterprise-biz-rules/entities/question'
import { QuestionsRepository } from '../repositories/question-repo'
import { NotAllowedError } from './errors/not-allowed'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { QuestionAttachmentList } from '../../enterprise-biz-rules/entities/question-attachment-list'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repo'
import { QuestionAttachment } from '../../enterprise-biz-rules/entities/question-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface EditQuestionUseCaseParams {
  requesterId: string
  questionId: string
  title: string
  content: string
  attachmentIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async exec({
    requesterId,
    questionId,
    title,
    content,
    attachmentIds,
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

    // if there is the arg attachmentIds, check for the attachments...
    if (attachmentIds) {
      const currentQuestionAttachments =
        await this.questionAttachmentsRepository.findManyByQuestionId(
          questionId,
        )
      // ... and create a Watched List from it so we can call watched list methods
      const questionAttachmentList = new QuestionAttachmentList(
        currentQuestionAttachments,
      )
      // now create the new question attachments
      const questionAttachments = attachmentIds.map((attachmentId) => {
        return QuestionAttachment.create({
          attachmentId: new UniqueEntityId(attachmentId),
          questionId: question.id,
        })
      })
      // and finally update it
      questionAttachmentList.update(questionAttachments)
      question.attachments = questionAttachmentList
    }

    this.questionsRepository.save(question)
    return succeed({ question })
  }
}
