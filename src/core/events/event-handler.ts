// Subscriber to event (as seen in Pub/Sub)

export interface EventHandler {
  setupSubscriptions(): void
}
