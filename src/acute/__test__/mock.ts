interface MockAcute {
  a: number
  b: {
    c: string
    arr: MockAcute[]
  }
}

export const mockAcute: MockAcute = {
  a: 10,
  b: {
    c: 'a',
    arr: [
      {
        a: 100,
        b: {
          c: 'aa',
          arr: [],
        },
      },
    ],
  },
}
