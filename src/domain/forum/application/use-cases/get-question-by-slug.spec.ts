import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'

let questionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase // <-- System Under Test
let createQuestionUseCase: CreateQuestionUseCase

describe('Get question by slug', () => {
  beforeEach(async () => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(questionsRepository)
    createQuestionUseCase = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    await createQuestionUseCase.exec({
      authorId: '21',
      title: 'How does next-auth work?',
      content:
        'I would like to know why the code below is not correctly fetching a session object. I have already wrapped my next app with SessionProvider and tries to reinstall the package. Help!',
    })
    const { question } = await sut.exec({ slug: 'how-does-next-auth-work' })

    expect(question.id).toBeInstanceOf(UniqueEntityId)
  })

  it("should not be able to get a question if the slug doesn't exist", async () => {
    await expect(() =>
      sut.exec({ slug: 'this-slug-doesnt-exist' }),
    ).rejects.toThrowError()
  })
})
