import { Module, OnModuleInit } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDispatcherService } from './event-dispatcher.service';

@Module({
  providers: [EventService, EventDispatcherService],
  exports: [EventDispatcherService]
})
export class EventModule implements OnModuleInit {
  constructor(private eventDispatcherService: EventDispatcherService) { }

  onModuleInit() {
    this.eventDispatcherService.register('UserCreated', {
      async handle(event) {
        console.log('HELLO WORLD!', event)
      }
    })
  }
}
