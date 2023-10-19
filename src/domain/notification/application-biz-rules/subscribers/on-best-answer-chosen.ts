import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
// import { QuestionsRepository } from '@/domain/forum/application-biz-rules/repositories/question-repo'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRepository } from '@/domain/forum/application-biz-rules/repositories/answer-repo'
import { BestAnswerChosenEvent } from '@/domain/forum/enterprise-biz-rules/events/best-answer-chosen-event'

export class OnBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    // private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendBestAnswerChosenNotification,
      BestAnswerChosenEvent.name,
    )
  }

  // IMPORTANT: use arrow function to preserve this as this class, and not DomainEvents.
  // Option 2 would be to have this.sendNewAnswerNotification.bind(this) on setupSubscriptions
  private sendBestAnswerChosenNotification = async ({
    question,
    bestAnswerId,
    ...event
  }: BestAnswerChosenEvent) => {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (answer) {
      await this.sendNotification.exec({
        recipientId: answer.authorId.toString(),
        title: `Your answer to was selected as a top answer`,
        content: `Yout answer to "${question.title
          .substring(0, 20)
          .concat('...')}" was chosen as the top answer by the author`,
      })
    }
  }
}
