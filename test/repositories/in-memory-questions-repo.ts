import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repo'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  async create(question: Question) {
    this.items.push(question)
  }

  async findBySlug(slug: string) {
    const question = this.items.find((q) => q.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }
}
