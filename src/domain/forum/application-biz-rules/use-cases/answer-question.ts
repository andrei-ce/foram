import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise-biz-rules/entities/answer'
import { AnswersRepository } from '../repositories/answer-repo'
import { Either, succeed } from '@/core/either'
import { AnswerAttachment } from '../../enterprise-biz-rules/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise-biz-rules/entities/answer-attachment-list'

// the interface below is to clarify which argument is which when call new AnswerQuestionUseCase().exec()
interface AnswerQuestionUseCaseParams {
  instructorId: string
  questionId: string
  content: string
  attachmentIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase {
  private answersRepository: AnswersRepository

  constructor(answersRepository: AnswersRepository) {
    this.answersRepository = answersRepository
  }

  async exec({
    instructorId,
    questionId,
    content,
    attachmentIds,
  }: AnswerQuestionUseCaseParams): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    })

    const answerAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answersRepository.create(answer)

    return succeed({ answer })
  }
}
