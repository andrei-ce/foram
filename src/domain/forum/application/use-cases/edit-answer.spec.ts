import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repo'

let answersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase // <-- System Under Test

describe('Edit Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('should be able to edit an answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('answer-001'),
    )
    await answersRepository.create(newAnswer)
    await sut.exec({
      requesterId: 'author-001',
      answerId: newAnswer.id.toString(),
      content: "Hi! This answer's content has been updated.",
    })

    expect(answersRepository.items[0]).toMatchObject({
      content: "Hi! This answer's content has been updated.",
    })
  })

  it('should not be able to edit a answer frmo another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('answer-001'),
    )
    await answersRepository.create(newAnswer)

    expect(async () => {
      await sut.exec({
        requesterId: 'author-002',
        answerId: newAnswer.id.toString(),
        content: "Hi! This answer's content has been updated.",
      })
    }).rejects.toThrowError()
  })
})
