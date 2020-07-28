import { Tag, Divider } from 'antd'
import '../static/style/components/typenav.css'
import Link from 'next/link'
import {useContext} from 'react';
import ThemeContext from '../static/jsMethod/context';

const TypeNav = (props) => {
    const theme = useContext(ThemeContext)
    const cusstyle = theme.state.dark ? {color:"#fff"} : {color:"black"}
    return (
        <div className={`typenav-div comm-box ${theme.state.dark ? 'app-dark' : 'app-light'}`}>
            <Divider style={cusstyle}>分类</Divider>
            {props.data.map(item=>(
                <Link key={item.typeName} href={{ pathname: '/tagtype', query: { id: item.Id } }}><Tag style={{cursor:"pointer"}} color={item.color}>{item.typeName}</Tag></Link>
            ))}
        </div>
    )
}

export default TypeNav