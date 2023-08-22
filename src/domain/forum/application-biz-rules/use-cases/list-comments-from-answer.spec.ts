import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repo'
import { ListCommentsFromAnswerUseCase } from './list-comments-from-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: ListCommentsFromAnswerUseCase // <-- System Under Test

describe('List comments from one answer', () => {
  beforeEach(async () => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new ListCommentsFromAnswerUseCase(answerCommentsRepository)
  })

  it('should be able to get all comments related to an answer ID in order', async () => {
    const newAnswerAnswerID = new UniqueEntityId('answer-id-01')
    await answerCommentsRepository.create(
      makeAnswerComment({
        createdAt: new Date(2022, 0, 20),
        answerId: newAnswerAnswerID,
      }),
    )
    await answerCommentsRepository.create(
      makeAnswerComment({
        createdAt: new Date(2022, 0, 23),
        answerId: newAnswerAnswerID,
      }),
    )
    await answerCommentsRepository.create(
      makeAnswerComment({
        createdAt: new Date(2022, 0, 18),
        answerId: newAnswerAnswerID,
      }),
    )
    const result = await sut.exec({
      answerId: newAnswerAnswerID.toString(),
      page: 1,
    })
    expect(result.value?.answerComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to get PAGINATED comments related to an answer ID', async () => {
    const newAnswerAnswerID = new UniqueEntityId('answer-id-01')
    for (let i = 1; i <= 24; i++) {
      await answerCommentsRepository.create(
        makeAnswerComment({ answerId: newAnswerAnswerID }),
      )
    }

    const result = await sut.exec({
      answerId: newAnswerAnswerID.toString(),
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(4)
  })
})
