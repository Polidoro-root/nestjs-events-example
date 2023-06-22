import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventDispatcherService } from './event/event-dispatcher.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private eventDispatcherService: EventDispatcherService
  ) { }

  @Get()
  async getHello() {
    await this.eventDispatcherService.dispatch({
      name: 'UserCreated',
      payload: {
        email: 'mail@mail.com',
        alias: 'my-alias'
      },
      dateTime: new Date()

    })

    return this.appService.getHello();
  }
}
