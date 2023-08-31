import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repo'
import { NotAllowedError } from './errors/not-allowed'
import { Failure } from '@/core/either'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase // <-- System Under Test

describe('Edit Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    sut = new EditQuestionUseCase(
      questionsRepository,
      questionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    // question created with 2 attachments
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

    await sut.exec({
      requesterId: 'author-001',
      questionId: newQuestion.id.toString(),
      title: 'Updated Title!',
      content: "Hi! This question's content has been updated.",
      attachmentIds: ['1', '3'],
    })

    expect(questionsRepository.items[0]).toMatchObject({
      title: 'Updated Title!',
      content: "Hi! This question's content has been updated.",
    })
    expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(
      2,
    )
    expect(questionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
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
      attachmentIds: [],
    })

    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
