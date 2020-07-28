import { Avatar, Divider, Tag } from 'antd'
import '../static/style/components/author.css'
import {
    GithubOutlined,
    WeiboCircleOutlined,
    TagOutlined,
    EnvironmentOutlined,
    LinkOutlined,
} from '@ant-design/icons';
import {useContext} from 'react';
import ThemeContext from '../static/jsMethod/context';

const Author = () => {

    const theme = useContext(ThemeContext)

    const moveToGitHub = () => {
        window.location.href = 'https://github.com/zhanyis';
    }

    const moveToWeibo = () => {
        window.location.href = 'https://weibo.com/u/2210923830';
    }

    return (
        <div className={`author-div comm-box ${theme.state.dark ? 'app-dark' : 'app-light'}`}>
            <div>
                <Avatar size={100} src="../static/images/head.jpg" />
                <div className="author-name">
                    SZY
                </div>
                <div className="author-shortSentense">
                    越努力越幸运
                </div>
                <div className="author-introduction">
                    <div className="author-detail"><EnvironmentOutlined /><span>广东顺德</span></div>
                    <div className="author-detail"><TagOutlined /><Tag color="volcano">入门前端</Tag></div>
                    <div className="author-detail"><LinkOutlined /><a href="http://114.55.250.155/oldblog/">旧Hexo博客</a></div>
                </div>
                <Divider></Divider>
                <GithubOutlined onClick={moveToGitHub} style={{ color: theme.state.dark ? 'white' : 'black' }} className="account" />
                <WeiboCircleOutlined onClick={moveToWeibo} style={{ color: 'red' }} className="account" />
            </div>
        </div >
    )
}

export default Author