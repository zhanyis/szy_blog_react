import App from 'next/app'
import 'antd/dist/antd.css'
import '../static/style/pages/comm.css'
import NProgress from 'nprogress'
import Router from 'next/router'
import 'nprogress/nprogress.css'

Router.events.on('routeChangeStart', () => {
    console.log('开始跳转')
    NProgress.start();
})

Router.events.on('routeChangeComplete', () => {
    console.log('跳转完成')
    NProgress.done();
})

Router.events.on('routeChangeError', () => {
    NProgress.done();
})

export default App