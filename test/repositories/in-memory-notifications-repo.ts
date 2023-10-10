import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { NotificationsRepository } from '@/domain/notification/application-biz-rules/repositories/notifications-repo'
import { Notification } from '@/domain/notification/enterprise-biz-rules/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((a) => a.id.toString() === id)

    if (!notification) {
      return null
    }

    return notification
  }

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex((a) => a.id !== notification.id)
    this.items[index] = notification
  }
}
