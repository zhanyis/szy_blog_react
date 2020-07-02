let ipUrl = 'http://127.0.0.1:7001/default/'
// let ipUrl = 'http://114.55.250.155/default/'

let servicePath = {
    getArticleList: ipUrl + 'getArticleList', // 首页接口
    getArticleById: ipUrl + 'getArticleById/',  // 详细页接口
    getTopArticle: ipUrl + 'getTopArticle', // 获得热门文章
    getListByTypeId: ipUrl + 'getListByTypeId/', //根据类别获得文章
    getTypeInfo: ipUrl + 'getTypeInfo', //获得类型
    getArticleListByPage: ipUrl + 'getArticleListByPage/', //加载下一页数据
}

export default servicePath