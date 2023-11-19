export class Event {
  static addListener(intance: any, eventName: string, cb: any) {
    intance.on(eventName, cb)
  }
  static trigger(intance: any, eventName: string, data: any) {
    intance.emit(eventName, data)
  }
  static clearListeners(instance: any, eventName: string) {
    instance.clearEvents(eventName)
  }
  static addDomListener(intance: HTMLElement, eventName: string, cb: any) {
    intance.addEventListener(eventName, cb)
  }
  private _events: Record<string, any[]> = {}

  on(type: string | string[], fn: (e: any) => void, context: any = this, once = false) {
    let types
    if (!Array.isArray(type)) {
      types = [type]
    } else {
      types = type
    }

    for (const curType of types) {
      this._on(curType, fn, context, once)
    }
    return this
  }

  off(type: string, fn: (e: any) => void, context: any = this) {
    const events = this._events
    if (type in events) {
      for (let i = 0; i < events[type].length; i += 1) {
        if (events[type][i].fn === fn && events[type][i].context === context) {
          events[type].splice(i, 1)
          return this // 返回链对象
        }
      }
    }
    return this // 返回链对象
  }

  hasEvents(type: string, fn: (e: any) => void, context: any = this) {
    // 当传了第二、三个参数时，就检查某一个特定的监听是否存在
    const events = this._events
    if (type && fn && type in events) {
      for (let i = 0; i < events[type].length; i += 1) {
        if (events[type][i].fn === fn && events[type][i].context === context) {
          return true
        }
      }
    }
    return false
  }

  clearEvents(type: string) {
    if (type) {
      if (this._events[type]) {
        delete this._events[type]
      }
    } else {
      this._events = {}
    }
    return this
  }

  emit(type: string, data: any = {}) {
    if (!(type in this._events)) {
      return this
    }
    const event = {
      ...data,
      type
    }

    // 获取当前事件类型所有注册事件
    const listeners = this._events[type]

    for (let i = 0, len = listeners.length; i < len; i += 1) {
      const cb = listeners[i]
      if (!cb.fn) {
        continue
      }
      cb.fn.call(cb.context, event)
      if (cb.once) {
        this._events[type].splice(i, 1)
        i -= 1
        len -= 1
      }
    }
    if (listeners.length === 0) {
      delete this._events[type]
    }
    return this
  }

  getEvents() {
    return this._events
  }

  private _on(type: string, fn: (e: any) => void, context: any = this, once = false) {
    if (this.hasEvents(type, fn, context)) {
      return this
    }
    const events = this._events
    events[type] = events[type] || []
    events[type].push({
      fn, // 回调函数
      context: context || this, // 上下文
      once
    })
    return this
  }
}
