import { Success } from '@/core/either'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'

let questionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase // <-- System Under Test

describe('Create Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.exec({
      authorId: '21',
      title: 'How does next-auth work?',
      content:
        'I would like to know why the code below is not correctly fetching a session object. I have already wrapped my next app with SessionProvider and tries to reinstall the package. Help!',
    })

    expect(result).toBeInstanceOf(Success)
    expect(questionsRepository.items[0].id).toEqual(result.value?.question.id)
    expect(result.value?.question.slug.value).toEqual('how-does-next-auth-work')
  })
})
