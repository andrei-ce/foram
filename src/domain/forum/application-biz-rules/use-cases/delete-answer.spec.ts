import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repo'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed'
import { Failure } from '@/core/either'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repo'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase // <-- System Under Test

describe('Delete Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('answer-001'),
    )

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )
    await answersRepository.create(newAnswer)
    await sut.exec({ requesterId: 'author-001', answerId: 'answer-001' })

    expect(answersRepository.items.length).toEqual(0)
    expect(answerAttachmentsRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('answer-001'),
    )
    await answersRepository.create(newAnswer)

    const result = await sut.exec({
      requesterId: 'author-002',
      answerId: 'answer-001',
    })

    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(answersRepository.items.length).toEqual(1)
  })
})
