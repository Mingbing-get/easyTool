import { useCell, brain } from '../index'
import { mockAcute } from './mock'

describe('Acute', () => {
  test('watch', async () => {
    const p1 = useCell({ test: 10 })
    const p2 = useCell(mockAcute)
    const p3 = useCell(10)

    brain.watch(() => {
      console.log(p2.v.b.arr[0].b.c, p1.v.test + p3.v)
    })

    brain.watch(() => {
      console.log('length: ', p2.v.b.arr.length)
      // for (const item of p2.v.b.arr) {
      //   console.log('array: ', item)
      // }
    })

    async function update() {
      p2.v.b.arr[0].b.c = 'update'
      p2.v.b.arr[0].b = {
        c: 'update2',
        arr: [],
      }

      for (let i = 0; i < 100; i++) {
        p1.v.test++
      }

      await sleep(0)

      p2.v.b.arr.push({ a: 0, b: { c: '', arr: [] } })

      p1.v.test = 12
      p3.v = 19
    }

    await update()

    await sleep()
  })

  test('compute', async () => {
    const p1 = useCell({ test: 10 })
    const p3 = useCell(10)

    const p4 = brain.compute(() => {
      return {
        a: p1.v.test + p3.v,
      }
    })

    brain.watch(() => {
      console.log('p4: ', p4.v)
    })

    p1.v.test = 12
    p3.v = 19

    await sleep()
  })
})

async function sleep(time: number = 1000) {
  return await new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
