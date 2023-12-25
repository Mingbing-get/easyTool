export type PathItem = string | number | symbol

export type VoidFn = () => void

export interface RecomputedWithPath {
  fn: VoidFn
  pathList: PathItem[][]
}

export type ComputeFn<T> = () => T

export type DeepReadOnly<T> = T extends Array<infer Item>
  ? Readonly<Array<DeepReadOnly<Item>>>
  : T extends object
    ? {
        readonly [K in keyof T]: DeepReadOnly<T[K]>
      }
    : T
