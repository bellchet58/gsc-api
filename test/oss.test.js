const init = require('../lib/init')
const { oss } = init({ token: '115377f2ed6d6d02935fd335216e036d', timeout: 99999999999999999})
const { v4 } = require('uuid')

describe("oss related api", () => {
  test("get sign", async () => {
    const result = await oss.getSign({})
    const uploadResult = await oss.doUpload(result)
    // expect(!!uploadResult).toBe(true)
  });
  test("get oss upload key", () => {
    expect(v4().replace(/\-/g, '').length).toBe(32)
  })
});