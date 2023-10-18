import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application-biz-rules/repositories/question-repo'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise-biz-rules/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  // this class has dependency inversion in constructor() -- depends on QuestionsRepo
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification,
      AnswerCreatedEvent.name,
    )
  }

  // IMPORTANT: use arrow function to preserve this as OnAnswerCreated, and not DomainEvents.
  // Option 2 would be to have this.sendNewAnswerNotification.bind(this)
  private sendNewAnswerNotification = async ({
    answer,
    ...event
  }: AnswerCreatedEvent) => {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )
    if (question) {
      await this.sendNotification.exec({
        recipientId: question?.authorId.toString(),
        title: `New answer in "${question.title
          .substring(0, 40)
          .concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
