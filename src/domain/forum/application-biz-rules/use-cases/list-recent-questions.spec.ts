import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'
import { makeQuestion } from 'test/factories/make-question'
import { ListRecentQuestionsUseCase } from './list-recent-questions'

let questionsRepository: InMemoryQuestionsRepository
let sut: ListRecentQuestionsUseCase // <-- System Under Test

describe('Get recent questions', () => {
  beforeEach(async () => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new ListRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to get a recent questions', async () => {
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    )
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) }),
    )
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
    )

    const result = await sut.exec({ page: 1 })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to get PAGINATED recent questions', async () => {
    for (let i = 1; i <= 25; i++) {
      await questionsRepository.create(makeQuestion())
    }

    const result = await sut.exec({ page: 2 })

    expect(result.value?.questions).toHaveLength(5)
  })
})
