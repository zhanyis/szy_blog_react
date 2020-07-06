// import React from 'react'
import '../static/style/components/header.css'
import { Row, Col, Menu } from 'antd'
import React, { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'


const Header = () => {
    // const [navArray, setNavArray] = useState({});
    // useEffect(()=>{
    // },[]) // 放空 只有第一次进入页面运行。

    // const handleClick = (e) => {
    //     Router.push('/' + e.key)
    // }

    return (
        <div className="header">
            <Row type="flex" justify="center">
                <Col xs={24} sm={24} md={24} lg={23} xl={18}>
                    <Link href='/'><span className="header-logo">SZYblog</span></Link>
                </Col>
                {/* <Col xs={0} sm={0} md={14} lg={8} xl={6}>
                    <Menu mode="horizontal" onClick={handleClick}>
                        <Menu.Item key="index">
                            首页
                        </Menu.Item>
                    </Menu>
                </Col> */}
            </Row>
        </div>
    )
}

export default Header