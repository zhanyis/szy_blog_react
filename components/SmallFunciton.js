import { Divider } from 'antd'
import Link from 'next/link'

const SmallFunction = () => {
    return (
        <div style={{ textAlign: "center", margin: "1rem" }} className="comm-box">
            <Divider>其他小功能</Divider>
            <Link href="/weekly"><span style={{cursor:"pointer"}}>每周计划表(本地储存)</span></Link>
        </div>
    )
}

export default SmallFunction