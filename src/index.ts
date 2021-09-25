import { isFunc } from 'ginlibs-type-check'

class Events {
  private eventsMap: any = {}
  private context: any = {}
  constructor(context?: any) {
    this.context = context || {}
  }

  on = (taskName: string, handle: AnyFunction) => {
    const eventsMap = this.eventsMap
    const handleList = eventsMap[taskName] || []
    if (isFunc(handle)) {
      handleList.push(handle)
    }
    eventsMap[taskName] = handleList
    this.eventsMap = eventsMap
    return () => {
      this.off(taskName, handle)
    }
  }

  emit = async (taskName: string, ...arg: any[]): Promise<any[]> => {
    const eventsMap = this.eventsMap
    const handleList = eventsMap[taskName] || []
    const result = []
    for (const it of handleList) {
      const itRes = await it.apply(null, [...arg, this.context])
      result.push(itRes)
    }
    if (result.length <= 1) {
      return result[0]
    } else {
      return result
    }
  }

  off = (taskName: string, handle?: AnyFunction) => {
    const eventsMap = this.eventsMap || {}
    let handleList = eventsMap[taskName] || []
    if (!isFunc(handle)) {
      eventsMap[taskName] = []
    } else {
      handleList = handleList.filter((eventFn) => {
        return eventFn !== handle
      })
      eventsMap[taskName] = handleList
    }
    this.eventsMap = eventsMap
  }
}

export default Events
