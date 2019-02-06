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
exports.main = async () => {
    const wxContext = cloud.getWXContext()
    let userData = await userTable.where({
        openid: wxContext.OPENID
    }).get()

    userData
        .then((res)=>{
            let dataArray = res || []
            if (dataArray.length > 0){
                return {
                    code: 200,
                    ...dataArray[0]
                }
            } else {
                return {
                    code: 100001
                }
            }
            
        })
        .catch((error)=>{
            return {
                code: 100002,
                error
            }
        })
}