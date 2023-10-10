import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise-biz-rules/value-objects/slug'
import { Failure, Success } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repo'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase // <-- System Under Test

describe('Get question by slug', () => {
  beforeEach(async () => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.createFromWithoutFormatting('example-question-001'),
    })
    await questionsRepository.create(newQuestion)

    const result = await sut.exec({ slug: 'example-question-001' })

    expect(result).toBeInstanceOf(Success)
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
      }),
    })
  })

  it("should not be able to get a question if the slug doesn't exist", async () => {
    const result = await sut.exec({ slug: 'this-slug-doesnt-exist' })

    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
