// pages/userConsole/userConsole.js
Page({

    data: {
        openid: ''
    },

    onLoad: function () {
        this.setData({
            openid: getApp().globalData.openid
        })
    }
})