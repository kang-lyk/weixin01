// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
    env: 'development-f3b7be'
})
// 初始化数据库
const weixinDB = cloud.database({
    env: 'development-f3b7be'
})
// const userTable = weixinDB.collection('user')


/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = (event) => {
    // 可执行其他自定义逻辑
    // console.log 的内容可以在云开发云函数调用日志查看

    // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
    const wxContext = cloud.getWXContext()
    let { 
        avatarUrl = '',
        city = '', 
        countrprovincey = '', 
        gender = 2, 
        nickName = ''
    } = event
    weixinDB.collection('user').add({
        data: {
            openid: wxContext.OPENID,
            appid: wxContext.APPID,
            unionid: wxContext.UNIONID,
            avatarUrl, 
            city, 
            countrprovincey, 
            gender, 
            nickName
        },
        complete(res){
            console.log(res)
        }
    })

    // weixinDB
    //     .collection('classification')
    //     .where({
    //         name: '废纸'
    //     })
    //     .get({
    //         success(res) {
    //             console.log(res.data)
    //         }
    //     })
    return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}
