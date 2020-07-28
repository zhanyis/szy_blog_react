// import React from 'react'
import '../static/style/components/header.css'
import { Row, Col, Switch } from 'antd'
import React, { useContext } from 'react'
import Link from 'next/link'
import ThemeContext from '../static/jsMethod/context';

const Header = () => {
    const theme = useContext(ThemeContext)
    const onChange = () => {
        theme.dispatch({type:'change'})
    }
    return (
        <div className={`header ${theme.state.dark ? 'app-dark' : 'app-light'}`}>
            <Row type="flex" justify="center">
                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                    <Link href='/'><span className="header-logo">SZYblog</span></Link>
                </Col>
                <Col className="header-switch" xs={0} sm={0} md={0} lg={4} xl={4}>
                    <span className="header-span">Dark Mode</span><Switch checked={theme.state.dark} onChange={onChange} />
                </Col>
            </Row>
        </div>
    )
}

export default Header