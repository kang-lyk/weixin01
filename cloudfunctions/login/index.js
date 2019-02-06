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
const userTable = weixinDB.collection('user')

/** 查询用户数据 */
const getUserData = async (openid) => {
    try {
        return await userTable.where({
            openid
        }).get()
    } catch (error){
        console.log(error)
    }
}

// const addUserData = async (data) => {
//     try {
//         return await userTable.add({
//             data
//         }) 
//     } catch(error) {
//         console.log(error)
//     }
// }
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event) => {
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
    let openid = wxContext.OPENID
    
    let userArray = await getUserData(openid)
    if(userArray.length > 0) {
        let [{
            nickName
        }] = userArray
        return {
            code: 100200,
            nickName
        }
    } else {
        
        // userTable.add({
        //     data: {
        //         openid: wxContext.OPENID,
        //         appid: wxContext.APPID,
        //         unionid: wxContext.UNIONID,
        //         avatarUrl, 
        //         city, 
        //         countrprovincey, 
        //         gender, 
        //         nickName
        //     }
        // })
        // .then(res => {
        //     console.log(JSON.stringify(res))
        // })
        // .catch( error => {
        //     console.log(JSON.stringify(error))
        // })
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
            complete(res) {
                console.log(JSON.stringify(res))
            }
        })
    }

    // return {
    //     event,
    //     // openid: wxContext.OPENID,
    //     // appid: wxContext.APPID,
    //     // unionid: wxContext.UNIONID,
    //     // userArray
    // }
}
