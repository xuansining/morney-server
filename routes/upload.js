const router = require('koa-router')()
const multer = require('@koa/multer')
const fs = require('fs')
const path=require('path')
router.prefix('/upload')
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1;
        let day = date.getDate()
        let dir = './public/uploads/' + year + month + day
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive:true
            })
        }
        cb(null,dir)
    },
    filename: (req, file, cb) => {
        let fileName = file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        cb(null,fileName)
    }
})
const limits = {
    fields: 10,//非文件字段的数量
    fileSize: 500 * 1024,//文件大小 单位 b
    files: 1//文件数量
}
const upload = multer({storage},{limits})
router.post('/img', upload.single('myfile'), async ctx => {
    let path = ctx.file.path
    path = ctx.origin + '' + path.replace('public','')
    ctx.body = {
        data: path
    }
})

module.exports=router