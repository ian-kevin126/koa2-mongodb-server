/**
 * 过滤假值入参
 * @param {*} params
 * @returns
 */
const cleanFalsyParams = (params) => {
  const _params = {}
  for (const key in params) {
    if (Object.hasOwnProperty.call(params, key) && !isFalsy(params[key])) {
      _params[key] = params[key]
    }
  }

  return _params
}

/**
 * 判断一个值是否是假值
 * @param {*} value
 * @returns
 */
const isFalsy = (value) => {
  return (
    value == undefined ||
    value == '' ||
    JSON.stringify(value) == '[]' ||
    JSON.stringify(value) == '{}'
  )
}

module.exports = {
  cleanFalsyParams,
  isFalsy,
}
