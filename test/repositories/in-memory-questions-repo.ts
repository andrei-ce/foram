import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application-biz-rules/repositories/question-repo'
import { QuestionAttachmentsRepository } from '@/domain/forum/application-biz-rules/repositories/question-attachments-repo'
import { Question } from '@/domain/forum/enterprise-biz-rules/entities/question'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  public items: Question[] = []

  async create(question: Question) {
    this.items.push(question)

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const index = this.items.findIndex((q) => q.id !== question.id)
    this.items.splice(index, 1)
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async save(question: Question) {
    const index = this.items.findIndex((q) => q.id !== question.id)
    this.items[index] = question
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(id: string) {
    const question = this.items.find((q) => q.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find((q) => q.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
    return questions
  }
}
