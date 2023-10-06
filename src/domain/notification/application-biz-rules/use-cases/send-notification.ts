import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '../../enterprise-biz-rules/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repo'
import { Either, succeed } from '@/core/either'

interface SendNotificationUseCaseParams {
  recipientId: string
  title: string
  content: string
}

type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async exec({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseParams): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId), // student or instructor
      title,
      content,
    })

    await this.notificationsRepository.create(notification)
    return succeed({ notification })
  }
}
