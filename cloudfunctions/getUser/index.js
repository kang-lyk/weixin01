// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    env: 'development-f3b7be'
})
// 初始化数据库
const weixinDB = cloud.database({
    env: 'development-f3b7be'
})
const userTable = weixinDB.collection('user')

// 云函数入口函数
exports.main = async (event) => {
    const wxContext = cloud.getWXContext()
    console.log(JSON.stringify(event))
    console.log('----')
    let openid = event.openid || wxContext.OPENID
    if (!openid) {
        return {
            code: 100101,
            msg: '参为不全'
        }
    }
    let userData = await userTable.where({
        openid
    }).get()
    console.log('*****')
    console.log(JSON.stringify(userData))
    let userDatas = userData.data
    if (userDatas.length > 1){
        return {
            code: 200,
            ...userDatas[0]
        }
    } else {
        return {
            code: 100100,
            msg: '数据为空'
        }
    }
}