import React, { useState } from 'react'
import Head from '../components/Head'
import axios from 'axios'
import Header from '../components/Header'
import Author from '../components/Author'
// import Advert from '../components/Advert'
import Footer from '../components/Footer'
import TypeNav from '../components/TypeNav'
import ItemCard from '../components/ItemCard'
import '../static/style/pages/index.css'
import servicePath from '../config/apiUrl'
import { Row, Col, message, Button } from 'antd'

const HomePage = ({ list, toplist, typeInfo }) => {

  const [mylist, setMylist] = useState(list.data);
  const [top, setTop] = useState(toplist.data);
  const [page, setPage] = useState(0);
  const [canLoad, setCanLoad] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    if (canLoad) {
      message.error('没有更多文章了');
      return
    }
    setLoading(true);
    axios.get(servicePath.getArticleListByPage, {
      params: {
        page: page + 1
      }
    }).then(res => {
      // res.data.data 文章列表
      // res.data.anymore ture => 没有更多文章了
      setPage(page + 1);
      setMylist(mylist.concat(res.data.data));
      setCanLoad(res.data.anymore);
      setLoading(false);
      message.success('成功加载更多文章');
    })
  }

  return (
    <div>
      <Head name="SZYblog" />
      <div className="background-img-style" style={{ backgroundImage: `url(../static/images/background.jpeg)` }}>
        <Header />
        <Row className="comm-main" type="flex" justify="center" >
          <Col className="index-left" xs={24} sm={24} md={16} lg={18} xl={14} >
            <div className="top-container">
              <h3>热门文章</h3>
              {top.map(item => (
                <ItemCard key={item.id} data={item} marginTop={0} />
              ))}
            </div>

            {mylist.map(item => (
              <ItemCard key={item.id} data={item} marginTop={14} />
            ))}
            <div className="index-button"><Button loading={loading} size="large" type="primary" shape="round" onClick={loadMore}>加载更多</Button></div>
          </Col>
          <Col className="comm-right" xs={0} sm={0} md={7} lg={5} xl={4} >
            <Author />
            {/* <Advert /> */}
            <TypeNav data={typeInfo.data} />
          </Col>
        </Row>
        <Footer />
      </div>
    </div>
  )
}

HomePage.getInitialProps = async () => {
  const promise = new Promise((resolve) => {
    axios(servicePath.getArticleList).then(
      (res) => {
        // console.log('------>', res.data)
        resolve(res.data)
      }
    )
  });

  const promise2 = new Promise((resolve) => {
    axios(servicePath.getTopArticle).then(
      (res) => {
        // console.log('------>', res.data)
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



  const [list, toplist, typeInfo] = await Promise.all([promise, promise2, promise3])
  return { list: list, toplist: toplist, typeInfo: typeInfo }
}

export default HomePage