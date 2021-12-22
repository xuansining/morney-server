const mongoose = require('mongoose');

const url = 'mongodb://localhost/morney'

module.exports = {
    connect: ()=> {            
        mongoose.connect(url)
        let db = mongoose.connection
        db.on('error', console.error.bind(console, '连接错误:'));
        db.once('open', ()=> {
            console.log('连接成功');
        })
    }
}