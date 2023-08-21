import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repo'

let answersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase // <-- System Under Test

describe('Delete Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('answer-001'),
    )
    await answersRepository.create(newAnswer)
    await sut.exec({ requesterId: 'author-001', answerId: 'answer-001' })

    expect(answersRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('answer-001'),
    )
    await answersRepository.create(newAnswer)

    expect(async () => {
      await sut.exec({
        requesterId: 'author-002',
        answerId: 'answer-001',
      })
    }).rejects.toThrowError()
    expect(answersRepository.items.length).toEqual(1)
  })
})
