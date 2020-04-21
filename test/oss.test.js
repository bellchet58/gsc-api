const init = require('../lib/init')
const { oss } = init({ token: '115377f2ed6d6d02935fd335216e036d'})

describe("oss related api", () => {
  test("get sign", async () => {
    const result = await oss.getSign({})
    expect(result.dir).toEqual('ipa');
  });
});