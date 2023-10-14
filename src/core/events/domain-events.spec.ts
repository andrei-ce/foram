import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { vi } from 'vitest'

class CustomAgreggateCreated implements DomainEvent {
  public ocurredAt: Date
  public aggregate: CustomAgreggate //eslint-disable-line

  constructor(aggregate: CustomAgreggate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAgreggate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAgreggate(null)
    aggregate.createDomainEvent(new CustomAgreggateCreated(aggregate))
    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to create dispatch and listen to events', () => {
    // testing function:
    const dispatchSpy = vi.fn()

    // Subscribed being registered (e.g. I am listening to a answer creation) -- notification domain
    DomainEvents.register(dispatchSpy, CustomAgreggateCreated.name)

    // Creating an aggregate (e.g. answer), without saving on DB -- forum domain
    const aggregate = CustomAgreggate.create()
    expect(aggregate.domainEvents).toHaveLength(1)

    // Saving aggregate (e.g. answer) on DB and consequently firing the event -- forum domain
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // The Subscriber listens to the event and does whatever it has to do
    expect(dispatchSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
