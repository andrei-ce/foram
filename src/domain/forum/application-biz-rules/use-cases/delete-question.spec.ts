import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed'
import { Failure } from '@/core/either'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repo'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase // <-- System Under Test

describe('Delete Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('question-001'),
    )
    await questionsRepository.create(newQuestion)
    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )
    await sut.exec({ requesterId: 'author-001', questionId: 'question-001' })

    expect(questionsRepository.items.length).toEqual(0)
    expect(questionAttachmentsRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a question frmo another user', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('question-001'),
    )
    await questionsRepository.create(newQuestion)

    const result = await sut.exec({
      requesterId: 'author-002',
      questionId: 'question-001',
    })

    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(questionsRepository.items.length).toEqual(1)
  })
})
