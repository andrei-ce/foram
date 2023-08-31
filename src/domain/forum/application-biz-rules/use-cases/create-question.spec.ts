import { Success } from '@/core/either'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repo'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionUseCase // <-- System Under Test

describe('Create Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.exec({
      authorId: '21',
      title: 'How does next-auth work?',
      content: 'I would like to know why... Help!',
      attachmentIds: ['1', '2'],
    })

    expect(result).toBeInstanceOf(Success)
    expect(questionsRepository.items[0].id).toEqual(result.value?.question.id)
    // expect(result.value?.question.slug.value).toEqual('how-does-next-auth-work')
    expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(
      2,
    )
    expect(questionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
})
