import { describe, expect, test } from '@jest/globals'

import WalkForest from '../instance'
import { mockForest, emptyForest, mockUnionForest } from './mock'

function isSameFleetArray<T extends any>(arr1: T[], arr2: T[]) {
  if (arr1.length !== arr2.length) return false

  return arr1.every((item) => arr2.includes(item))
}

describe('class walkForest', () => {
  const walkForest = new WalkForest(mockForest, 'children', 'value')
  const allPaths = [
    ['1'],
    ['2'],
    ['3'],
    ['4'],
    ['1', '1-1'],
    ['1', '1-2'],
    ['3', '3-1'],
    ['3', '3-2'],
    ['1', '1-2', '1-2-1'],
    ['1', '1-2', '1-2-2'],
  ]
  const values = [
    '1',
    '2',
    '3',
    '4',
    '1-1',
    '1-2',
    '3-1',
    '3-2',
    '1-2-1',
    '1-2-2',
  ]

  const filterPath = [
    ['1'],
    ['1', '1-1'],
    ['1', '1-2'],
    ['1', '1-2', '1-2-1'],
    ['1', '1-2', '1-2-2'],
    ['3', '3-1'],
  ]
  const notNodeKey = '0'

  describe('method filterWithPath', () => {
    test('has some values', () => {
      const res = walkForest.filterWithPath((node) => {
        return node.value.includes('1')
      })

      const isSame = res.every((item) => {
        return filterPath.some(
          (needPath) =>
            isSameFleetArray(item.path, needPath) &&
            needPath[needPath.length - 1] === item.node.value,
        )
      })

      expect(isSame).toBe(true)
    })

    test('is empty', () => {
      const res = walkForest.filterWithPath((node) => {
        return node.value.includes(notNodeKey)
      })

      expect(res).toEqual([])
    })
  })

  describe('method filter', () => {
    test('has some values', () => {
      const res = walkForest.filter((node) => {
        return node.value.includes('1')
      })

      const isSame = res.every((item) => {
        return filterPath.some(
          (needPath) => needPath[needPath.length - 1] === item.value,
        )
      })

      expect(isSame).toBe(true)
    })

    test('is empty', () => {
      const res = walkForest.filter((node) => {
        return node.value.includes(notNodeKey)
      })

      expect(res).toEqual([])
    })
  })

  describe('method findWithPath', () => {
    test('has some paths', () => {
      const resPath = ['1', '1-2']
      const res = walkForest.findWithPath((node) => node.value === '1-2')

      expect(res?.node.value).toBe(resPath[resPath.length - 1])
      expect(res?.path).toEqual(resPath)
    })

    test('not find', () => {
      const res = walkForest.findWithPath((node) => node.value === notNodeKey)

      expect(res).toBeUndefined()
    })
  })

  describe('method find', () => {
    test('has some value', () => {
      const res = walkForest.find((node) => node.value === '1-2')

      expect(res?.value).toBe('1-2')
    })

    test('is not find', () => {
      const res = walkForest.find((node) => node.value === notNodeKey)

      expect(res).toBeUndefined()
    })
  })

  describe('method some', () => {
    test('is true', () => {
      const res = walkForest.some((node) => node.value === '1-1')

      expect(res).toBe(true)
    })

    test('is false', () => {
      const res = walkForest.some((node) => node.value === notNodeKey)

      expect(res).toBe(false)
    })
  })

  describe('method every', () => {
    test('is true', () => {
      const res = walkForest.every((node) => !!node.value)

      expect(res).toBe(true)
    })

    test('is false', () => {
      const res = walkForest.every((node) => node.value === '1-1')

      expect(res).toBe(false)
    })
  })

  describe('method count', () => {
    test('has nodes', () => {
      const res = walkForest.count()

      expect(res).toBe(values.length)
    })

    test('not nodes', () => {
      const emptyWalkForest = new WalkForest(emptyForest, 'children', 'value')
      const res = emptyWalkForest.count()

      expect(res).toBe(0)
    })
  })

  describe('method values', () => {
    test('has nodes', () => {
      const res = walkForest.values()

      expect(isSameFleetArray(values, res)).toBe(true)
    })

    test('not nodes', () => {
      const emptyWalkForest = new WalkForest(emptyForest, 'children', 'value')
      const res = emptyWalkForest.values()

      expect(res).toEqual([])
    })
  })

  describe('method paths', () => {
    test('has nodes', () => {
      const res = walkForest.paths()

      const isSame = allPaths.every((needPath) => {
        return res.some((path) => isSameFleetArray(needPath, path))
      })

      expect(isSame).toBe(true)
    })

    test('not nodes', () => {
      const emptyWalkForest = new WalkForest(emptyForest, 'children', 'value')
      const res = emptyWalkForest.paths()

      expect(res).toEqual([])
    })
  })

  describe('method flatWithPath', () => {
    test('has nodes', () => {
      const res = walkForest.flatWithPath()

      const isSame = allPaths.every((needPath) => {
        return res.some(
          (item) =>
            isSameFleetArray(needPath, item.path) &&
            values.includes(item.node.value),
        )
      })

      expect(isSame).toBe(true)
    })

    test('not nodes', () => {
      const emptyWalkForest = new WalkForest(emptyForest, 'children', 'value')
      const res = emptyWalkForest.flatWithPath()

      expect(res).toEqual([])
    })
  })

  describe('method flat', () => {
    test('has nodes', () => {
      const res = walkForest.flat()

      const isSame = values.every((value) => {
        return res.some((item) => item.value === value)
      })

      expect(isSame).toBe(true)
    })

    test('not nodes', () => {
      const emptyWalkForest = new WalkForest(emptyForest, 'children', 'value')
      const res = emptyWalkForest.flat()

      expect(res).toEqual([])
    })
  })

  describe('order with values', () => {
    test('order is DRL', () => {
      const walkForestDRL = new WalkForest(
        mockForest,
        'children',
        'value',
        'DRL',
      )
      const res = walkForestDRL.values()

      expect(res).toEqual([
        '4',
        '3',
        '2',
        '1',
        '3-2',
        '3-1',
        '1-2',
        '1-1',
        '1-2-2',
        '1-2-1',
      ])
    })

    test('order is LRD', () => {
      const walkForestLRD = new WalkForest(
        mockForest,
        'children',
        'value',
        'LRD',
      )
      const res = walkForestLRD.values()

      expect(res).toEqual([
        '4',
        '3-2',
        '3-1',
        '3',
        '2',
        '1-2-2',
        '1-2-1',
        '1-2',
        '1-1',
        '1',
      ])
    })

    test('order is RLD', () => {
      const walkForestRLD = new WalkForest(
        mockForest,
        'children',
        'value',
        'RLD',
      )
      const res = walkForestRLD.values()

      expect(res).toEqual([
        '1-1',
        '1-2-1',
        '1-2-2',
        '1-2',
        '1',
        '2',
        '3-1',
        '3-2',
        '3',
        '4',
      ])
    })
  })

  describe('union type', () => {
    test('accept union type', () => {
      let hasError = false
      try {
        new WalkForest(mockUnionForest, 'children', 'value')
      } catch (err) {
        hasError = true
      }

      expect(hasError).toBe(false)
    })
  })
})
