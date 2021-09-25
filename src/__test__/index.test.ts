import Events from '../index'

describe('事件监听派发', () => {
  test('单个事件注册', async () => {
    const events = new Events()
    const key = 'test1'
    events.on(key, () => key)
    const res = await events.emit(key)
    expect(res).toBe(key)

    events.off(key)
    const res2 = await events.emit(key)
    expect(res2).toBe(undefined)
  })
  test('多个事件注册', async () => {
    const events = new Events()
    const key = 'test2'
    const handle1 = () => 'a'
    const handle2 = () => 'b'

    events.on(key, handle1)
    events.on(key, handle2)

    const res = await events.emit(key)

    expect(res[0]).toBe('a')
    expect(res[1]).toBe('b')

    events.off(key, handle1)
    const res2 = await events.emit(key)
    expect(res2).toBe('b')
  })
})
