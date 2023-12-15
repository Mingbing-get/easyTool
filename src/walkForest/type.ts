type UnionToIoF<U> = (
  U extends any ? (k: (x: U) => void) => void : never
) extends (k: infer I) => void
  ? I
  : never

type LastTypeInUnion<T> = UnionToIoF<T> extends (k: infer R) => any ? R : never

type RefArrayOfObjectKeys<T extends Record<string, any>, R extends any = T> = ((
  p: LastTypeInUnion<keyof T>,
) => any) extends (p: infer K) => any
  ? K extends keyof T
    ? T[K] extends R[] | undefined
      ? K | RefArrayOfObjectKeys<Omit<T, K>, R>
      : RefArrayOfObjectKeys<Omit<T, K>, R>
    : never
  : never

export type SelfArrayOfObjectKeysWithUnion<
  T extends Record<string, any>,
  R extends any = T,
> = (
  T extends any
    ? (k: { [k in RefArrayOfObjectKeys<T, R>]: any }) => void
    : never
) extends (k: infer I) => void
  ? keyof I
  : never

export type LikeTree<T extends Record<string, any>> =
  SelfArrayOfObjectKeysWithUnion<T> extends never ? never : T

export interface ForestWithPath<
  T extends Record<string, any>,
  VK extends keyof T,
> {
  forest: T[]
  path: Array<T[VK]>
}

export interface WithWalkChildrenTreeNodeWithPath<
  T extends Record<string, any>,
  VK extends keyof T,
> extends TreeNodeWithPath<T, VK> {
  isWalkChildren?: boolean
}

export interface TreeNodeWithPath<
  T extends Record<string, any>,
  VK extends keyof T,
> {
  node: T
  path: Array<T[VK]>
}

export type ForestOrder = 'DLR' | 'DRL' | 'LRD' | 'RLD'

export type ForestCb<T extends Record<string, any>, VK extends keyof T> = (
  item: T,
  path: Array<T[VK]>,
) => boolean | void
