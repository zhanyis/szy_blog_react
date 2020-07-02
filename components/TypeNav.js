import { Tag, Divider } from 'antd'
import '../static/style/components/typenav.css'
import Link from 'next/link'

const TypeNav = (props) => {
    return (
        <div className="typenav-div comm-box">
            <Divider>分类</Divider>
            {props.data.map(item=>(
                <Link key={item.typeName} href={{ pathname: '/tagtype', query: { id: item.Id } }}><Tag color={item.color}>{item.typeName}</Tag></Link>
            ))}
        </div>
    )
}

export default TypeNav