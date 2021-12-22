import { Action } from 'redux';

type Fn = (...args: any[]) => void;
interface Events {
  [key: string]: Fn[];
}

export class EventEmitter {
  listeners: Events = {};

  constructor() {}

  sub(actionType: string, fn: Fn) {
    if (!this.has(actionType)) {
      this.listeners[actionType] = [];
    }

    this.listeners[actionType].push(fn);
  }

  unsubType(actionType: string) {
    if (!this.has(actionType)) {
      return;
    }
    this.listeners[actionType] = [];
  }

  emit(action: Action) {
    if (!this.has(action.type)) {
      return;
    }

    this.listeners[action.type].forEach((cb) => cb(action));
    this.unsubType(action.type);
  }

  has(actionType: string) {
    return this.listeners.hasOwnProperty(actionType);
  }
}
