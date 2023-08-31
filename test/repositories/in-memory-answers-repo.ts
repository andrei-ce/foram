import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application-biz-rules/repositories/answer-attachments-repo'
import { AnswersRepository } from '@/domain/forum/application-biz-rules/repositories/answer-repo'
import { Answer } from '@/domain/forum/enterprise-biz-rules/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  public items: Answer[] = []

  async create(answer: Answer) {
    this.items.push(answer)
  }

  async delete(answer: Answer) {
    const index = this.items.findIndex((a) => a.id !== answer.id)
    this.items.splice(index, 1)

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async save(answer: Answer) {
    const index = this.items.findIndex((a) => a.id !== answer.id)
    this.items[index] = answer
  }

  async findById(id: string) {
    const answer = this.items.find((a) => a.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByQuestionId(answerId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((a) => a.questionId.toString() === answerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return answers
  }
}
