const init = require('../lib/init')
const { oss, upload } = init({ token: '这是token'})
const { v4 } = require('uuid')

describe("oss related api", () => {
  test("get sign", async () => {
    const result = await oss.getSign({})
    expect(result.dir).toEqual('ipa');
  });
  test("get oss upload key", () => {
    expect(v4().replace(/\-/g, '').length).toBe(32)
  })
  test("upload", async () => {
    const result = await upload()
    expect(result).toEqual('https://www.gscapp.cn/app/85lT')
  }, 20000)
});