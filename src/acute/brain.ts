import {
  type RecomputedWithPath,
  type VoidFn,
  type ComputeFn,
  type PathItem,
  type DeepReadOnly,
} from './type'
import useCell from './cell'

export const BRAIN_USE = 'brain_use'

export class Brain {
  private recomputedMark: symbol | undefined
  private recomputedWithPath: Record<symbol, RecomputedWithPath>
  private isWaitNextTick = false
  private readonly executeQueue: symbol[]

  constructor() {
    this.recomputedWithPath = {}
    this.executeQueue = []
  }

  watch(fn: VoidFn) {
    const symbol = Symbol(BRAIN_USE)
    this.recomputedWithPath[symbol] = {
      fn,
      pathList: [],
    }
    this.recomputedMark = symbol
    fn()
    this.recomputedMark = undefined
  }

  compute<T>(fn: ComputeFn<T>) {
    const result = useCell<T>('' as T)
    const symbol = Symbol(BRAIN_USE)

    this.recomputedWithPath[symbol] = {
      fn: () => {
        const res = fn()
        result.v = res
      },
      pathList: [],
    }

    this.recomputedMark = symbol
    const res = fn()
    this.recomputedMark = undefined
    result.v = res

    return result as DeepReadOnly<{ v: T }>
  }

  getMark() {
    return this.recomputedMark
  }

  addPath(mark: symbol, path: PathItem[]) {
    if (!this.recomputedWithPath[mark]) return

    const curPathList = this.recomputedWithPath[mark].pathList
    if (curPathList.some((item) => this.isSamePath(item, path))) return

    curPathList.push(path)
  }

  trigger(mark: symbol, path: PathItem[]) {
    if (!this.recomputedWithPath[mark]) return

    const { pathList } = this.recomputedWithPath[mark]
    if (!pathList.some((item) => this.isSamePath(item, path))) return

    if (!this.executeQueue.includes(mark)) {
      this.executeQueue.push(mark)
    }

    this.executeTick()
  }

  private isSamePath(path1: PathItem[], path2: PathItem[]) {
    if (path1.length !== path2.length) return false

    for (let i = 0; i < path1.length; i++) {
      if (path1[i] !== path2[i]) return false
    }

    return true
  }

  private async executeTick() {
    if (this.isWaitNextTick) return
    this.isWaitNextTick = true

    await new Promise<void>((resolve) => {
      if (globalThis.requestAnimationFrame) {
        globalThis.requestAnimationFrame(() => {
          this.nextTick()
          resolve()
        })
      } else if (globalThis.requestIdleCallback) {
        globalThis.requestIdleCallback(
          () => {
            this.nextTick()
            resolve()
          },
          { timeout: 60 },
        )
      } else {
        setTimeout(() => {
          this.nextTick()
          resolve()
        }, 0)
      }
    });
  }

  nextTick() {
    let mark = this.executeQueue.shift()
    while (mark) {
      if (!this.recomputedWithPath[mark]) continue

      const { fn } = this.recomputedWithPath[mark]
      fn()

      mark = this.executeQueue.shift()
    }
    this.isWaitNextTick = false
  }
}

export default new Brain()
