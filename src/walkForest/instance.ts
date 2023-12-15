import {
  type LikeTree,
  type SelfArrayOfObjectKeysWithUnion,
  type ForestCb,
  type ForestOrder,
  type ForestWithPath,
  type WithWalkChildrenTreeNodeWithPath,
  type TreeNodeWithPath,
} from './type'

export default class WalkForest<
  T extends Record<string, any>,
  VK extends keyof T,
> {
  private readonly forest: T[]
  private readonly subTreeKey: keyof T
  private readonly valueKey: VK
  private order: ForestOrder = 'DLR'

  constructor(
    forest: Array<LikeTree<T>>,
    subKey: SelfArrayOfObjectKeysWithUnion<T>,
    valueKey: VK,
    order?: ForestOrder,
  ) {
    this.forest = forest
    this.subTreeKey = subKey
    this.valueKey = valueKey
    if (order) {
      this.order = order
    }
  }

  setOrder(order: ForestOrder) {
    this.order = order

    return this
  }

  each(fn: ForestCb<T, VK>) {
    if (this.isRootPriv()) {
      this.eachRootBefore(fn)
    } else {
      this.eachRootAfter(fn)
    }
  }

  private eachRootBefore(fn: ForestCb<T, VK>) {
    const forestQueue: Array<ForestWithPath<T, VK>> = [
      {
        forest: this.forest,
        path: [],
      },
    ]

    while (forestQueue.length > 0) {
      const forestWithPath = forestQueue.shift()
      if (!forestWithPath) return

      const next = this.walkForestRootTrees(forestWithPath.forest)
      let treeNode = next()

      while (treeNode) {
        const path = [...forestWithPath.path, treeNode[this.valueKey]]

        if (fn(treeNode, path)) return

        if (treeNode[this.subTreeKey]) {
          forestQueue.push({
            forest: treeNode[this.subTreeKey],
            path,
          })
        }

        treeNode = next()
      }
    }
  }

  private eachRootAfter(fn: ForestCb<T, VK>) {
    const nodeStack: Array<WithWalkChildrenTreeNodeWithPath<T, VK>> = []

    const addTreeToQueue = (forest: T[], parentPath: Array<T[VK]>) => {
      const next = this.walkForestRootTrees(forest)
      let treeNode = next()

      while (treeNode) {
        nodeStack.push({
          node: treeNode,
          path: [...parentPath, treeNode[this.valueKey]],
        })
        treeNode = next()
      }
    }

    addTreeToQueue(this.forest, [])

    while (nodeStack.length > 0) {
      const lastNode = nodeStack.pop()
      if (!lastNode) return

      if (!lastNode.isWalkChildren && lastNode.node[this.subTreeKey]) {
        lastNode.isWalkChildren = true
        nodeStack.push(lastNode)
        addTreeToQueue(lastNode.node[this.subTreeKey], lastNode.path)
      } else {
        if (fn(lastNode.node, lastNode.path)) {
          return
        }
      }
    }
  }

  filterWithPath(fn: ForestCb<T, VK>) {
    const res: Array<TreeNodeWithPath<T, VK>> = []

    this.each((item, path) => {
      const isMatch = fn(item, path)

      if (isMatch) {
        res.push({
          node: item,
          path,
        })
      }
    })

    return res
  }

  filter(fn: ForestCb<T, VK>) {
    return this.filterWithPath(fn).map((item) => item.node)
  }

  findWithPath(fn: ForestCb<T, VK>) {
    let res: TreeNodeWithPath<T, VK> | undefined

    this.each((item, path) => {
      const isMatch = fn(item, path)

      if (isMatch) {
        res = {
          node: item,
          path,
        }

        return true
      }
    })

    return res
  }

  find(fn: ForestCb<T, VK>) {
    return this.findWithPath(fn)?.node
  }

  some(fn: ForestCb<T, VK>) {
    let flag: boolean = false

    this.each((item, path) => {
      const isMatch = fn(item, path)

      if (isMatch) {
        flag = true
        return true
      }
    })

    return flag
  }

  every(fn: ForestCb<T, VK>) {
    let flag: boolean = true

    this.each((item, path) => {
      const isMatch = fn(item, path)

      if (!isMatch) {
        flag = false
        return true
      }
    })

    return flag
  }

  count() {
    let count: number = 0

    this.each(() => {
      count++
    })

    return count
  }

  values() {
    const values: Array<T[VK]> = []

    this.each((node) => {
      values.push(node[this.valueKey])
    })

    return values
  }

  paths() {
    const paths: Array<Array<T[VK]>> = []

    this.each((_, path) => {
      paths.push(path)
    })

    return paths
  }

  flatWithPath() {
    const res: Array<TreeNodeWithPath<T, VK>> = []

    this.each((node, path) => {
      res.push({
        node,
        path,
      })
    })

    return res
  }

  flat() {
    const res: T[] = []

    this.each((node) => {
      res.push(node)
    })

    return res
  }

  private isRootPriv() {
    return ['DLR', 'DRL'].includes(this.order)
  }

  private walkForestRootTrees(forest: T[]) {
    const isToRight = ['DLR', 'LRD'].includes(this.order)
    let i = isToRight ? 0 : forest.length - 1

    function getNode() {
      if (i < 0 || i >= forest.length) return

      return forest[i]
    }

    function addStep() {
      if (isToRight) {
        i++
      } else {
        i--
      }
    }

    return function () {
      const node = getNode()
      addStep()

      return node
    }
  }
}
