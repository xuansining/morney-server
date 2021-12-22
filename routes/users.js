const { login, register, verify, updatePwd } = require('../controller/users')

const router = require('koa-router')()

router.prefix('/users')

router.post('/login', login),
router.post('/register', register),
router.post('/verify', verify)
router.post('/update/pwd',updatePwd)
module.exports = router
