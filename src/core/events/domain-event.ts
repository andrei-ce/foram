import { UniqueEntityId } from '@/core/entities/unique-entity-id'

// Published event (as seen in Pub/Sub)
export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityId
}
