// import App from 'next/app'
import 'antd/dist/antd.css'
import '../static/style/pages/comm.css'
import NProgress from 'nprogress'
import Router from 'next/router'
import 'nprogress/nprogress.css'
import { useReducer, useEffect } from 'react'
import ThemeContext from '../static/jsMethod/context'

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

const initialState = { dark: false };

function reducer(state, action) {
    switch (action.type) {
        case 'dark':
            return { dark: true };
        case 'change':
            return { dark: !state.dark }
        case 'light':
            return { dark: false }
        default:
            throw new Error();
    }
}

function MyApp({ Component, pageProps }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    // 识别浏览器darkmode
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
        if (mediaQuery.matches) {
            dispatch({ type: 'light' })
        } else {
            dispatch({ type: 'dark' })
        }
    }, [])
    return (
        <ThemeContext.Provider value={{ state, dispatch }} >
            <Component {...pageProps} />
        </ThemeContext.Provider>
    )
}

export default MyApp