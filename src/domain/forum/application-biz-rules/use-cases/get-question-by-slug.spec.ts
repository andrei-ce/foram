import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise-biz-rules/entities/value-objects/slug'

let questionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase // <-- System Under Test

describe('Get question by slug', () => {
  beforeEach(async () => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.createFromWithoutFormatting('example-question-001'),
    })
    await questionsRepository.create(newQuestion)

    const { question } = await sut.exec({ slug: 'example-question-001' })
    expect(question.id).toBeInstanceOf(UniqueEntityId)
    expect(question.title).toEqual(newQuestion.title)
  })

  it("should not be able to get a question if the slug doesn't exist", async () => {
    await expect(() =>
      sut.exec({ slug: 'this-slug-doesnt-exist' }),
    ).rejects.toThrowError()
  })
})