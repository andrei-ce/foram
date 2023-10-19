import { makeAnswer } from 'test/factories/make-answer'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repo'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repo'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repo'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repo'
import { makeQuestion } from 'test/factories/make-question'
import { SpyInstance } from 'vitest'
import { OnBestAnswerChosen } from './on-best-answer-chosen'

let questionAttachmentsReposiory: InMemoryQuestionAttachmentsRepository
let questionReposiory: InMemoryQuestionsRepository
let answersReposiory: InMemoryAnswersRepository
let answerAttachmentsReposiory: InMemoryAnswerAttachmentsRepository
let notificationRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationSpy: SpyInstance

describe('On Best Answer Selected', () => {
  beforeEach(() => {
    questionAttachmentsReposiory = new InMemoryQuestionAttachmentsRepository()
    questionReposiory = new InMemoryQuestionsRepository(
      questionAttachmentsReposiory,
    )
    answerAttachmentsReposiory = new InMemoryAnswerAttachmentsRepository()
    answersReposiory = new InMemoryAnswersRepository(answerAttachmentsReposiory)

    notificationRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationRepository,
    )

    // setup to check if method was called
    sendNotificationSpy = vi.spyOn(sendNotificationUseCase, 'exec')

    // instantiate the listener/subscriber
    new OnBestAnswerChosen(answersReposiory, sendNotificationUseCase)
  })

  it('should send a notification when an answer is selected as best by author', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await questionReposiory.create(question) // although almost synchronous, await is needed
    await answersReposiory.create(answer)

    question.bestAnswerId = answer.id

    await questionReposiory.save(question)

    expect(sendNotificationSpy).toHaveBeenCalled()
  })
})
