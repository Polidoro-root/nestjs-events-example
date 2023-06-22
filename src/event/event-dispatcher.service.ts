import { Injectable, Logger } from "@nestjs/common";
import { EventDispatcherInterface, EventHandlerInterface, EventInterface } from "./event.interface";

@Injectable()
export class EventDispatcherService implements EventDispatcherInterface {
  private handlers = new Map<string, EventHandlerInterface[]>()
  private logger = new Logger()

  register(eventName: string, handler: EventHandlerInterface) {
    const exists = this.has(eventName, handler)

    if (exists) {
      this.handlers.get(eventName).push(handler)

      this.logger.log(`[Event] A new ${eventName} handler has been registered`)

      return
    }

    this.logger.log(`[Event] A new ${eventName} handler has been registered`)

    this.handlers.set(eventName, [handler])
  }

  has(eventName: string, handler: EventHandlerInterface): boolean {
    const hasEvent = this.handlers.has(eventName)

    if (!hasEvent) {
      return false
    }

    const handlers = this.handlers.get(eventName)

    const hasHandler = handlers.some(h => h === handler)

    return hasHandler
  }

  unregister(eventName: string, handler: EventHandlerInterface): void {
    const exists = this.has(eventName, handler)

    if (exists) {
      const handlers = this.handlers.get(eventName).filter(h => h !== handler)

      this.handlers.set(eventName, handlers)

      return
    }
  }

  async dispatch(event: EventInterface): Promise<void> {
    const handlers = this.handlers.get(event.name)

    if (!handlers) {
      return
    }

    await Promise.all(handlers.map(h => h.handle(event)))
  }

  clear(): void {
    this.handlers.clear()
  }
} 
