import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'

let questionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase // <-- System Under Test

describe('Delete Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('question-001'),
    )
    await questionsRepository.create(newQuestion)
    await sut.exec({ requesterId: 'author-001', questionId: 'question-001' })

    expect(questionsRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a question frmo another user', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('question-001'),
    )
    await questionsRepository.create(newQuestion)

    expect(async () => {
      await sut.exec({
        requesterId: 'author-002',
        questionId: 'question-001',
      })
    }).rejects.toThrowError()
    expect(questionsRepository.items.length).toEqual(1)
  })
})
