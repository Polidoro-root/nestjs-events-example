import { Test, TestingModule } from '@nestjs/testing';
import { EventDispatcherService } from './event-dispatcher.service';
import { EventInterface } from './event.interface';
import { Logger } from '@nestjs/common';

describe('EventDispatcherService', () => {
  let service: EventDispatcherService;

  const handler1 = {
    async handle(event: EventInterface) {
    }
  }
  const handler2 = {
    async handle(event: EventInterface) {
    }
  }
  const handler3 = {
    async handle(event: EventInterface) {
      await new Promise((resolve) => {
        resolve(event)
      })
    }
  }
  const event1 = {
    name: 'event1',
    payload: {
      hello: 'world'
    },
    dateTime: new Date('2020-12-31')
  }
  const event2 = {
    name: 'event2',
    payload: {
      foo: 'bar'
    },
    dateTime: new Date('2021-01-01')
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventDispatcherService],
    }).compile();

    service = module.get<EventDispatcherService>(EventDispatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register an event', () => {
      expect(() => {
        service.register(event1.name, handler1)
      }).not.toThrowError()

      expect(service.has(event1.name, handler1)).toBe(true)
    })
  })

  describe('has', () => {
    it('should return true when has handler', () => {
      service.register(event1.name, handler1)
      service.register(event2.name, handler2)

      expect(service.has(event1.name, handler1)).toBe(true)
      expect(service.has(event2.name, handler2)).toBe(true)
    })
  })

  describe('unregister', () => {
    it('should unregister an event', () => {
      service.register(event1.name, handler1)

      service.unregister(event1.name, handler1)

      expect(service.has(event1.name, handler1)).toBe(false)
    })

    it('should keep handler references after unregister', () => {
      service.register(event1.name, handler1)
      service.register(event2.name, handler2)

      expect(service.has(event1.name, handler1)).toBe(true)
      expect(service.has(event2.name, handler2)).toBe(true)

      service.unregister(event1.name, handler1)

      expect(service.has(event1.name, handler1)).toBe(false)
      expect(service.has(event2.name, handler2)).toBe(true)
    })
  })

  describe('dispatch', () => {
    it('should dispatch all registered handlers', async () => {
      const resolveds = []

      const handler1 = {
        async handle(event: EventInterface) {
          const operation = await new Promise((resolve) => {
            resolve(event)
          })

          resolveds.push(operation)
        }
      }

      const handler2 = {
        async handle(event: EventInterface) {
          const operation = await new Promise((resolve) => {
            resolve(event)
          })

          resolveds.push(operation)
        }
      }

      service.register(event1.name, handler1)
      service.register(event2.name, handler2)

      await expect(service.dispatch(event1)).resolves.not.toThrowError()
      await expect(service.dispatch(event2)).resolves.not.toThrowError()

      expect(resolveds).toHaveLength(2)
      expect(resolveds[0]).toStrictEqual(event1)
      expect(resolveds[1]).toStrictEqual(event2)

    })
  })
});
