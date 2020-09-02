import React, { useState, useEffect } from 'react'
import {useRouter} from 'next/router'
import Head from '../components/Head'
import axios from 'axios'
import Header from '../components/Header'
import Author from '../components/Author'
import TypeNav from '../components/TypeNav'
import ItemCard from '../components/ItemCard'
// import Advert from '../components/Advert'
import Footer from '../components/Footer'
import '../static/style/pages/index.css'
import servicePath from '../config/apiUrl'
import { Row, Col } from 'antd'


const TagType = ({ list, typeInfo }) => {

  const [mylist, setMylist] = useState(list.data);

  const router = useRouter();
  const queryObject = router.query;

  useEffect(()=>{
    setMylist(list.data)
  },[queryObject])


  return (
    <div>
      <Head name="SZYblog" />
      <div className="background-img-style" style={{ backgroundImage: `url(../static/images/background.jpeg)` }}>
        <Header />
        <Row className="comm-main" type="flex" justify="center" >
          <Col className="index-left" xs={24} sm={24} md={16} lg={18} xl={14} >
            {mylist.map(item => (
              <ItemCard key={item.id} data={item} marginTop={14} />
            ))}
          </Col>
          <Col className="comm-right" xs={0} sm={0} md={0} lg={4} xl={4} >
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

TagType.getInitialProps = async (context) => {
  let id = context.query.id
  const promise = new Promise((resolve) => {
    axios(servicePath.getListByTypeId + id).then(
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

  const [list,typeInfo] = await Promise.all([promise,promise3])
  return { list: list,typeInfo:typeInfo }
}

export default TagType