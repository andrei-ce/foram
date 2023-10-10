import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repo'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed'
import { Failure } from '@/core/either'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repo'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase // <-- System Under Test

describe('Edit Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository)
  })

  it('should be able to edit an answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('answer-001'),
    )
    await answersRepository.create(newAnswer)

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

    await sut.exec({
      requesterId: 'author-001',
      answerId: newAnswer.id.toString(),
      content: "Hi! This answer's content has been updated.",
      attachmentIds: ['1', '3'],
    })

    expect(answersRepository.items[0]).toMatchObject({
      content: "Hi! This answer's content has been updated.",
    })
    expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(answersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('answer-001'),
    )
    await answersRepository.create(newAnswer)

    const result = await sut.exec({
      requesterId: 'author-002',
      answerId: newAnswer.id.toString(),
      content: "Hi! This answer's content has been updated.",
      attachmentIds: [],
    })

    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
