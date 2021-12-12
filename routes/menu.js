const router = require('koa-router')()
const { getMenuList, operateMenuItem } = require('../controller/menu')

router.prefix('/menu')

// 获取菜单列表
router.get('/list', getMenuList)

// 新增、编辑、删除菜单
router.post('/operate', operateMenuItem)

module.exports = router
