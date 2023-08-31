import { AnswerAttachmentsRepository } from '@/domain/forum/application-biz-rules/repositories/answer-attachments-repo'
import { AnswerAttachment } from '@/domain/forum/enterprise-biz-rules/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (a) => a.answerId.toString() === answerId,
    )

    return answerAttachments
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = this.items.filter(
      (a) => a.answerId.toString() !== answerId,
    )
    this.items = answerAttachments
  }
}
