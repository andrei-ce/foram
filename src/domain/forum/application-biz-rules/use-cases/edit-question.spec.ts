import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'
import { NotAllowedError } from './errors/not-allowed'
import { Failure } from '@/core/either'

let questionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase // <-- System Under Test

describe('Edit Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(questionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('question-001'),
    )
    await questionsRepository.create(newQuestion)
    await sut.exec({
      requesterId: 'author-001',
      questionId: newQuestion.id.toString(),
      title: 'Updated Title!',
      content: "Hi! This question's content has been updated.",
    })

    expect(questionsRepository.items[0]).toMatchObject({
      title: 'Updated Title!',
      content: "Hi! This question's content has been updated.",
    })
  })

  it('should not be able to edit a question frmo another user', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('question-001'),
    )
    await questionsRepository.create(newQuestion)

    const result = await sut.exec({
      requesterId: 'author-002',
      questionId: newQuestion.id.toString(),
      title: 'Updated Title!',
      content: "Hi! This question's content has been updated.",
    })

    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
