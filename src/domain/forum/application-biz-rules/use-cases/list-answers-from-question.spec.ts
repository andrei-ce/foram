import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repo'
import { ListAnswersFromQuestionUseCase } from './list-answers-from-question'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repo'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: ListAnswersFromQuestionUseCase // <-- System Under Test

describe('Get answers related to one question', () => {
  beforeEach(async () => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new ListAnswersFromQuestionUseCase(answersRepository)
  })

  it('should be able to get all answers related to a question ID in order', async () => {
    const newAnswerQuestionID = new UniqueEntityId('question-id-01')
    await answersRepository.create(
      makeAnswer({
        createdAt: new Date(2022, 0, 20),
        questionId: newAnswerQuestionID,
      }),
    )
    await answersRepository.create(
      makeAnswer({
        createdAt: new Date(2022, 0, 23),
        questionId: newAnswerQuestionID,
      }),
    )
    await answersRepository.create(
      makeAnswer({
        createdAt: new Date(2022, 0, 18),
        questionId: newAnswerQuestionID,
      }),
    )
    const result = await sut.exec({
      questionId: newAnswerQuestionID.toString(),
      page: 1,
    })
    expect(result.value?.answers).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to get PAGINATED answers related to a question ID', async () => {
    const newAnswerQuestionID = new UniqueEntityId('question-id-01')
    for (let i = 1; i <= 24; i++) {
      await answersRepository.create(
        makeAnswer({ questionId: newAnswerQuestionID }),
      )
    }

    const result = await sut.exec({
      questionId: newAnswerQuestionID.toString(),
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(4)
  })
})
