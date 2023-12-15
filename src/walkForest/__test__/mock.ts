interface MockTree {
  children?: MockTree[]
  value: string
  label?: string
}

export const mockForest: MockTree[] = [
  {
    value: '1',
    children: [
      {
        value: '1-1',
      },
      {
        value: '1-2',
        children: [
          {
            value: '1-2-1',
          },
          {
            value: '1-2-2',
          },
        ],
      },
    ],
  },
  {
    value: '2',
  },
  {
    value: '3',
    children: [
      {
        value: '3-1',
      },
      {
        value: '3-2',
      },
    ],
  },
  {
    value: '4',
  },
]

export const emptyForest: MockTree[] = []

// 联合类型数据

interface BaseTree {
  value: string
  label?: string
}

interface HasChildTree extends BaseTree {
  children: UnionTree[]
}

interface HasChildOtherTree extends BaseTree {
  other: UnionTree[]
}

interface NotChildTree extends BaseTree {}

type UnionTree = NotChildTree | HasChildTree | HasChildOtherTree

export const mockUnionForest: UnionTree[] = [
  {
    value: '1',
    children: [
      {
        value: '1-1',
      },
    ],
  },
  {
    value: '2',
  },
]
