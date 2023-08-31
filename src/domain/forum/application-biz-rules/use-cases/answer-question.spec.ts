import { Success } from '@/core/either'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repo'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repo'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionUseCase // <-- System Under Test

describe('Create Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.exec({
      questionId: '1',
      instructorId: '1',
      content: 'New answer!',
      attachmentIds: ['1', '2'],
    })

    expect(result).toBeInstanceOf(Success)
    expect(answersRepository.items[0]).toEqual(result.value?.answer)
    expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(answersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
})
