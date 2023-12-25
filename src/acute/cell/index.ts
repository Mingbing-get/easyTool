import brain from '../brain'
import withProxy from './withProxy'

import { type PathItem } from '../type'

export const CELL_UNIQ = 'cell'

export class Cell<T> {
  private readonly proxy: { v: T }
  private readonly subscribeMarks: symbol[]
  private readonly uniqKey = Symbol(CELL_UNIQ)

  constructor(v: T) {
    this.subscribeMarks = []
    this.proxy = withProxy(
      { v },
      this.pathCollector.bind(this),
      this.triggerUpdate.bind(this),
    )
  }

  value() {
    return this.proxy
  }

  private pathCollector(path: PathItem[]) {
    const subscribeMark = brain.getMark()
    if (!subscribeMark) return

    if (!this.subscribeMarks.includes(subscribeMark)) {
      this.subscribeMarks.push(subscribeMark)
    }

    brain.addPath(subscribeMark, [this.uniqKey, ...path])
  }

  private triggerUpdate(path: PathItem[], newValue: T, oldValue: T) {
    this.subscribeMarks.forEach((key) => {
      brain.trigger(key, [this.uniqKey, ...path])
    })
  }
}

export default function useCell<T>(v: T) {
  return new Cell(v).value()
}
