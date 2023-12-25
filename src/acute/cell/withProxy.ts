import { type PathItem } from '../type'

export default function withProxy<T extends object>(
  v: T,
  onGet: (p: PathItem[]) => void,
  onSet: (p: PathItem[], newValue: any, oldValue: any) => void,
  parentPath: PathItem[] = [],
): T {
  return new Proxy(v, {
    get(target, p) {
      const path = [...parentPath, p]
      onGet(path)

      const getValue = target[p as keyof T]
      if (getValue instanceof Object) {
        return withProxy(getValue, onGet, onSet, path)
      }

      return getValue
    },

    set(target, p, newValue) {
      const oldValue = target[p as keyof T]
      target[p as keyof T] = newValue

      onSet([...parentPath, p], newValue, oldValue)

      return true
    },
  })
}
