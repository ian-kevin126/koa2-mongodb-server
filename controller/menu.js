const { cleanFalsyParams } = require('../utils/common')
const util = require('../utils/util')
const MenuModel = require('./../model/menu')

/**
 * 菜单列表查询
 * @param {*} ctx
 */
const getMenuList = async (ctx) => {
  const { menuName, menuState } = ctx.request.query

  const params = cleanFalsyParams({
    menuName,
    menuState,
  })

  const menuList = (await MenuModel.find(params)) || []

  // 对查询到的结果进行处理——拼装成树形结构，方便前端处理
  const permissionList = util.getTreeMenu(menuList, null, [])

  ctx.body = util.success(permissionList)
}

/**
 * 新增、编辑、删除菜单
 * @param {*} ctx
 */
const operateMenuItem = async (ctx) => {
  const { _id, action, ...params } = ctx.request.body
  let info

  try {
    if (action === 'add') {
      // 新增菜单
      res = await MenuModel.create(params)
      info = '创建成功'
    } else if (action === 'edit') {
      // 编辑菜单
      params.updateTime = new Date()
      res = await MenuModel.findByIdAndUpdate(_id, params)
      info = '编辑成功'
    } else {
      // 删除菜单
      res = await MenuModel.findByIdAndDelete(_id)
      // 同时也要删除对应的子菜单，否则就会出现bug
      await MenuModel.deleteMany({ parentId: { $all: [_id] } })
      info = '删除成功'
    }

    ctx.body = util.success('', info)
  } catch (error) {
    ctx.body = util.fail(error.stack)
  }
}

module.exports = {
  getMenuList,
  operateMenuItem,
}
