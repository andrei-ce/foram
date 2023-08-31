import { QuestionAttachmentsRepository } from '@/domain/forum/application-biz-rules/repositories/question-attachments-repo'
import { QuestionAttachment } from '@/domain/forum/enterprise-biz-rules/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (a) => a.questionId.toString() === questionId,
    )

    return questionAttachments
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.items.filter(
      (a) => a.questionId.toString() !== questionId,
    )
    this.items = questionAttachments
  }
}
