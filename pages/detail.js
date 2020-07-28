import Head from '../components/Head';
import { Row, Col, Tag, Affix, Divider } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import marked from 'marked';
import hljs from 'highlight.js';
import Link from 'next/link';
import 'highlight.js/styles/atom-one-dark.css';
import '../static/style/pages/detail.css';
import Tocify from '../components/tocify.tsx';
import servicePath from '../config/apiUrl';
import { changeTime } from '../static/jsMethod/comm';
import TypeNav from '../components/TypeNav';
import { useContext } from 'react';
import ThemeContext from '../static/jsMethod/context';
import SubmitComment from '../components/SubmitComment';

const Detailed = ({ props, typeInfo, comments, AID }) => {
  const theme = useContext(ThemeContext)
  const tocify = new Tocify();
  const renderer = new marked.Renderer();
  renderer.heading = function (text, level, raw) {
    const anchor = tocify.add(text, level);
    return `<a id="${anchor}" href="#${anchor}" class="anchor-fix"><h${level}>${text}</h${level}></a>\n`;
  }

  marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code) {
      return hljs.highlightAuto(code).value
    }
  })

  hljs.configure({ useBR: true });

  // console.log(props)

  let html = marked(props.article_content)

  return (
    <>
      <Head name={'SZYblog ' + props.title} />
      <div className="background-img-style" style={{ backgroundImage: `url(../static/images/background.jpeg)` }}>
        <Header />
        <Row className="comm-main" type="flex" justify="center">
          <Col className={`comm-left ${theme.state.dark ? 'app-dark' : 'app-light'}`} xs={24} sm={24} md={20} lg={18} xl={14}  >
            <div>
              <div className="detailed-title">
                {props.title}
              </div>
              <div className="center">
                <Link href={{ pathname: '/tagtype', query: { id: props.typeId } }}><Tag color={props.color}>{props.typeName}</Tag></Link>
                <span>{changeTime(props.addTime).y + ' ' + changeTime(props.addTime).m + ' ' + changeTime(props.addTime).d}</span>
              </div>
              <Divider></Divider>
              <div className="detailed-content"
                dangerouslySetInnerHTML={{ __html: html }}
              >
              </div>
            </div>
            <SubmitComment comments={comments} AID={AID}/>
          </Col>
          <Col className="comm-right" xs={0} sm={0} md={4} lg={6} xl={4}>
            <TypeNav data={typeInfo.data} />
            <Affix offsetTop={5}>
              <div className={`detailed-nav comm-box ${theme.state.dark ? 'app-dark' : 'app-light'}`}>
                <div className="nav-title">文章目录</div>
                <div className="toc-list">
                  {tocify && tocify.render()}
                </div>
              </div>
            </Affix>
          </Col>
        </Row>
        <Footer />
      </div>
    </>
  )
}

Detailed.getInitialProps = async (context) => {
  // console.log(context.query.id)

  let id = context.query.id

  const promise = new Promise((resolve) => {
    axios(servicePath.getArticleById + id).then(
      (res) => {
        // console.log(res.data.data[0])
        resolve(res.data.data[0])
      }
    )
  });

  const promise2 = new Promise((resolve) => {
    axios(servicePath.getCommentById + id).then(
      (res) => {
        // console.log(res.data)
        resolve(res.data)
      }
    )
  });

  const promise3 = new Promise((resolve) => {
    axios(servicePath.getTypeInfo).then(
      (res) => {
        // console.log('------>', res.data)
        resolve(res.data)
      }
    )
  });
  const [list, typeInfo, data] = await Promise.all([promise, promise3, promise2])
  return { props: list, typeInfo: typeInfo, comments:data, AID: id }
}

export default Detailed