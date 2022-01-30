import { isFunc } from 'ginlibs-type-check'

interface EventOptions {
  once?: boolean
  done?: boolean
  context?: any
}

export class Events {
  private eventsMap: any = {}
  private context: any = {}
  constructor(context?: any) {
    this.context = context || {}
  }

  once = (taskName: string, handle: AnyFunction, context?: any) => {
    return this.on(taskName, handle, {
      once: true,
      context,
    })
  }

  on = (
    taskName: string,
    handle: AnyFunction,
    options: Omit<EventOptions, 'done'> = {}
  ) => {
    const eventsMap = this.eventsMap
    const handleInfos = eventsMap[taskName] || []
    if (isFunc(handle)) {
      handleInfos.push({ handle, options })
    }
    eventsMap[taskName] = handleInfos
    this.eventsMap = eventsMap
    return () => {
      this.off(taskName, handle)
    }
  }

  emit = (taskName: string, ...arg: any[]): any[] => {
    const eventsMap = this.eventsMap
    const handleInfos: any[] = eventsMap[taskName] || []
    const result: any[] = []
    for (const it of handleInfos) {
      if (!it) {
        continue
      }
      const { handle, options } = it || {}
      const { once, done, context } = options || {}
      if ((once && done) || !isFunc(handle)) {
        continue
      }
      const itRes = handle.apply(null, [
        ...arg,
        { ...this.context, ...(context || {}) },
      ])
      result.push(itRes)
      if (options && once) {
        it.options.done = true
      }
    }
    eventsMap[taskName] = handleInfos.filter((it) => {
      const { options } = it || {}
      const { once, done } = options || {}
      return !once || !done
    })
    return result
  }

  off = (taskName: string, handle?: AnyFunction) => {
    const eventsMap = this.eventsMap || {}
    let handleInfos = eventsMap[taskName] || []
    if (!isFunc(handle)) {
      eventsMap[taskName] = []
    } else {
      handleInfos = handleInfos.filter((it) => {
        return (it || {}).handle !== handle
      })
      eventsMap[taskName] = handleInfos
    }
    this.eventsMap = eventsMap
  }
}

export default Events
