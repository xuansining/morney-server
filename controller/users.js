const jwt = require('jsonwebtoken')
let Users = require('../model/users')
/**
 * 
 * passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
 */
const login = async ctx => {
    let { username, pwd } = ctx.request.body
    await Users.findOne({ username, pwd }).then(rel => {
        if (rel) {
            let token = jwt.sign({
                username: rel.username,
                _id: rel._id
            }, 'morney-server-jwt', {
                expiresIn: 3600*24
            })
            ctx.body = {
                code: 200,
                msg:'登录成功',
                token
            }
        } else {
            ctx.body = {
                code: 300,
                msg: '用户名或密码错误',
                
            }
        }
     
        
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: '登录时出现异常',
            err
        }
    })
   
   
}
const register = async ctx => {
    let isDouble = false;
    const { username, pwd } = ctx.request.body;
    await Users.findOne({ username }).then((rel) => {
        if (rel) {
            isDouble = true;
            ctx.body = {
                code: 300,
                msg:'用户名已纯在'
            }
            return;
        }
    })
    if (!isDouble) {
        await Users.create({ username, pwd }).then(rel => {
            if (rel) {
                ctx.body = {
                    code: 200,
                    msg:'注册成功',
                
                }
         
            } else {
                ctx.body = {
                    code: 300,
                    msg: '注册失败',
                    
                }
          
            }
         
            
        }).catch(err => {
            if (err) {
                ctx.body = {
                    code: 500,
                    msg: '注册时出现异常',
                    err
                }
            }
        
        })
    }
}
const verify = async ctx => {
    let token = ctx.header.authorization
    token = token.replace('Bearer', '').trim()
    try {
        let result = jwt.verify(token, 'morney-server-jwt')
        await Users.findOne({ _id: result._id }).then(rel => {
            if (rel) {
                ctx.body = {
                    code: 200,
                    msg: '用户认证成功',
                    user:rel
                }
            } else {
                ctx.body = {
                    code: 500,
                    msg:'用户认证失败'
                }
           }
        })
    } catch {
        ctx.body = {
            code: 500,
            msg:'用户认证失败'
        }
    }
}
const updatePwd = async ctx => {
    const { username, pwd } = ctx.request.body
    await Users.updateOne({ username }, { pwd }).then(rel => {
        console.log(rel);
        if (rel.modifiedCount>0) {
            ctx.body = {
                code: 200,
                msg:'密码修改成功'
            }
        } else {
            ctx.body = {
                code: 300,
                msg:'密码修改失败'
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: '密码修改时出现异常',
            err
        }
    })
}
module.exports = {
    login,
    register,
    verify,
    updatePwd
}