import { Notification } from '../../enterprise-biz-rules/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repo'
import { Either, fail, succeed } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { NotAllowedError } from '@/core/errors/errors/not-allowed'

interface ReadNotificationUseCaseParams {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async exec({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseParams): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return fail(new ResourceNotFoundError())
    }
    if (notification.recipientId.toString() !== recipientId) {
      return fail(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)
    return succeed({ notification })
  }
}
