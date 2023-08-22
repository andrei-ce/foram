import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repo'
import { ListCommentsFromQuestionUseCase } from './list-comments-from-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: ListCommentsFromQuestionUseCase // <-- System Under Test

describe('List comments from one question', () => {
  beforeEach(async () => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new ListCommentsFromQuestionUseCase(questionCommentsRepository)
  })

  it('should be able to get all comments related to a question ID in order', async () => {
    const newAnswerQuestionID = new UniqueEntityId('question-id-01')
    await questionCommentsRepository.create(
      makeQuestionComment({
        createdAt: new Date(2022, 0, 20),
        questionId: newAnswerQuestionID,
      }),
    )
    await questionCommentsRepository.create(
      makeQuestionComment({
        createdAt: new Date(2022, 0, 23),
        questionId: newAnswerQuestionID,
      }),
    )
    await questionCommentsRepository.create(
      makeQuestionComment({
        createdAt: new Date(2022, 0, 18),
        questionId: newAnswerQuestionID,
      }),
    )
    const result = await sut.exec({
      questionId: newAnswerQuestionID.toString(),
      page: 1,
    })
    expect(result.value?.questionComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to get PAGINATED comments related to a question ID', async () => {
    const newAnswerQuestionID = new UniqueEntityId('question-id-01')
    for (let i = 1; i <= 24; i++) {
      await questionCommentsRepository.create(
        makeQuestionComment({ questionId: newAnswerQuestionID }),
      )
    }

    const result = await sut.exec({
      questionId: newAnswerQuestionID.toString(),
      page: 2,
    })

    expect(result.value?.questionComments).toHaveLength(4)
  })
})
