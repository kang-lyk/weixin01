// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    env: 'development-f3b7be'
})

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
    let unionid = wxContext.UNIONID
    // 最新的用户数据，如果
    let newUserData = {
        avatarUrl,
        city,
        countrprovincey,
        gender,
        nickName,
        openid,
        unionid
    }

    let userData = await cloud.callFunction({
        name: 'getUser',
        data: {
            openid
        }
    })
    let { result } = userData
    let oldUserData = { ...result }
    console.log(JSON.stringify(oldUserData))
    delete oldUserData.code
    let isEqual = oldUserData.toString() === newUserData.toString()
    if (result.code === 200 && isEqual){
        return result
    } else {
        try{
            await cloud.callFunction({
                name: 'register',
                data: {
                    avatarUrl,
                    city,
                    countrprovincey,
                    gender,
                    nickName,
                    openid,
                    unionid
                }
            }) 
            return {
                code: 200
            }   
        } catch(error){
            return {
                code: 30000,
                ...error
            }
        }
    }
}
