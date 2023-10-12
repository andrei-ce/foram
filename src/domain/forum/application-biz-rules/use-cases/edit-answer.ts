import { Either, fail, succeed } from '@/core/either'
import { Answer } from '../../enterprise-biz-rules/entities/answer'
import { AnswersRepository } from '../repositories/answer-repo'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repo'
import { AnswerAttachmentList } from '../../enterprise-biz-rules/entities/answer-attachment-list'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '../../enterprise-biz-rules/entities/answer-attachment'

interface EditAnswerUseCaseParams {
  requesterId: string
  answerId: string
  content: string
  attachmentIds: string[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async exec({
    requesterId,
    answerId,
    content,
    attachmentIds,
  }: EditAnswerUseCaseParams): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return fail(new ResourceNotFoundError())
    }
    if (answer.authorId.toString() !== requesterId) {
      return fail(new NotAllowedError())
    }

    answer.content = content

    // if there is the arg attachmentIds, check for the attachments...
    if (attachmentIds) {
      const currentQuestionAttachments =
        await this.answerAttachmentsRepository.findManyByAnswerId(answerId)
      // ... and create a Watched List from it so we can call watched list methods
      const answerAttachmentList = new AnswerAttachmentList(
        currentQuestionAttachments,
      )
      // now create the new question attachments
      const answerAttachments = attachmentIds.map((attachmentId) => {
        return AnswerAttachment.create({
          attachmentId: new UniqueEntityId(attachmentId),
          answerId: answer.id,
        })
      })
      // and finally update it
      answerAttachmentList.update(answerAttachments)
      answer.attachments = answerAttachmentList
    }

    this.answersRepository.save(answer)
    return succeed({ answer })
  }
}
