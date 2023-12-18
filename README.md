# easy-tool

### WalkForest

##### 用于遍历树结构的对象

```ts
// 直接树结构对象
interface MockTree {
  children?: MockTree[]
  value: string
  label?: string
}
```

```ts
// 联合类型的树结构对象
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
```

##### 用法

```ts
import { WalkForest } from 'easy-tool'

interface MockTree {
  children?: MockTree[]
  value: string
  label?: string
}
const forest: MockTree[] = []

// 第一个参数：要遍历的树集合
// 第二个参数：下一级的key
// 第三个参数：值的key
// 第四个参数：遍历的顺序（选填，默认：DLR）
const walkForest = new WalkForest(forest, 'children', 'value')

walkForest.each((node, path) => {
  // todo
})
```

##### 设置遍历顺序

```ts
walkForest.setOrder('DLR')
// DLR: 根->左->右
// DRL: 根->右->左
// LRD: 左->右->根
// RLD: 右->左->根
```

##### API

```
walkForest
  .setOrder // 设置遍历顺序
  .each // 遍历所有的节点，若返回true则终止便利
  .filterWithPath // 过滤返回true的节点和节点对应的路径列表
  .filter // 过滤返回true的节点列表
  .findWithPath // 返回第一个返回true的节点和其对应的路径，找到后终止遍历
  .find // 返回第一个返回true的节点，找到后终止遍历
  .some // 有一个为true，则结果为true（遇到true终止遍历）
  .every // 有一个为false，则结果为false（遇到false终止遍历）
  .count // 返回节点个数
  .values // 返回所有value
  .paths // 返回所有的path
  .flatWithPath // 将树转为列表，每项是节点和其对应的路径
  .flat // 将树转为列表，每项是节点
```
