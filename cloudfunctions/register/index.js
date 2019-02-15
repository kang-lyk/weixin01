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
    // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
    console.log(JSON.stringify(event))
    const wxContext = cloud.getWXContext()
    let {
        avatarUrl = '',
        city = '',
        countrprovincey = '',
        gender = 2,
        nickName = '',
        openid = wxContext.OPENID,
        unionid = wxContext.UNIONID
    } = event
    try{
        await userTable.add({
            data: {
                openid,
                unionid,
                avatarUrl, 
                city, 
                countrprovincey, 
                gender, 
                nickName
            }
        }) 
        return {
            code: 200
        }
    } catch(error) {
        return {
            code: 100003,
            msg: '添加用户失败',
            error
        }
    }
}