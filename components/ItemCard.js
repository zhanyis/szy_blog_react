import React, { useContext } from 'react';
import { Row, Col, Tag, Card } from 'antd'
import Link from 'next/link'
import { changeTime } from '../static/jsMethod/comm';
import '../static/style/components/itemCard.css';
import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';
import ThemeContext from '../static/jsMethod/context';

const ItemCard = (props) => {

    const theme = useContext(ThemeContext)
    const renderer = new marked.Renderer();
    marked.setOptions({
        renderer: renderer,
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
        sanitize: false,
        xhtml: false,
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });

    return (
        <>
            {/* <Link href={{ pathname: '/detail', query: { id: props.data.id } }}> */}
            <Card
                className={theme.state.dark ? 'app-dark' : 'app-light'}
                hoverable
                bordered
                style={{ marginTop: props.marginTop }}
            >
                <Row type="flex" justify="center">
                    <Col className="card-time-display" xs={0} sm={0} md={4} lg={6} xl={6}>
                        <div className="card-day-display">{changeTime(props.data.addTime).d}</div>
                        <div className="card-month-display">{changeTime(props.data.addTime).m + ' ' + changeTime(props.data.addTime).y}</div>
                    </Col>
                    <Col xs={24} sm={24} md={20} lg={18} xl={18}>
                        <div className="list-title" >
                            <Link href={{ pathname: '/detail', query: { id: props.data.id } }}><a>{props.data.title}</a></Link>
                            {props.atTop ? <Tag color="purple">置顶</Tag> : <span></span>}
                            <Link href={{ pathname: '/tagtype', query: { id: props.data.typeId } }}>
                                <Tag style={{ cursor: "pointer" }} color={props.data.color}>{props.data.typeName}</Tag>
                            </Link>
                        </div>
                        <div className="list-content" dangerouslySetInnerHTML={{ __html: marked(props.data.introduce) }}></div>
                    </Col>
                </Row>
            </Card>
            {/* </Link> */}
        </>
    )
}

export default ItemCard