import { NotificationsRepository } from '@/domain/notification/application-biz-rules/repositories/notifications-repo'
import { Notification } from '@/domain/notification/enterprise-biz-rules/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async create(notification: Notification) {
    this.items.push(notification)
  }
}
