export interface EventInterface {
  name: string
  payload: any
  dateTime: Date
}

export interface EventHandlerInterface {
  handle(event: EventInterface): Promise<void>
}

export interface EventDispatcherInterface {
  register(eventName: string, handler: EventHandlerInterface): void
  dispatch(event: EventInterface): Promise<void>
  unregister(eventName: string, handler: EventHandlerInterface): void
  has(eventName: string, handler: EventHandlerInterface): boolean
  clear(): void
}
