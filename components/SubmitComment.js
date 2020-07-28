import '../static/style/components/submitcomment.css';
import { Input, Button, Avatar, message } from 'antd';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import servicePath from '../config/apiUrl';
import { UserOutlined } from '@ant-design/icons';
import { ymdhms } from '../static/jsMethod/comm';
import ThemeContext from '../static/jsMethod/context';

const { TextArea } = Input;
const itemStyle = { margin: '0.5rem 0.2rem' }


// 输入框
const CommentModel = ({ addComment, show, father, replyto }) => {
    const [text, setText] = useState('');
    const [userName, setUserName] = useState('');
    const theme = useContext(ThemeContext);
    if (show) {
        return (
            <div className={theme.state.dark ? 'submit-comment-dark' : 'submit-comment-light'}>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <Input placeholder="输入名字..." value={userName} onChange={(e) => { setUserName(e.target.value) }} style={itemStyle} style={{ width: '20%' }} />
                <TextArea maxLength={255} placeholder="输入评论..." value={text} onChange={(e) => { setText(e.target.value) }} style={itemStyle} style={{ width: '60%' }} autoSize onPressEnter={() => { addComment(text, father, userName, replyto); setText('');setUserName('') }} />
                <Button type="primary" shape="round" style={itemStyle} style={{ width: '13%' }} onClick={() => { addComment(text, father, userName, replyto); setText('');setUserName('') }}>Submit</Button>
            </div>
        )
    } else {
        return (
            <></>
        )
    }
}

// 评论+回复板块
const Comment = ({ data, replylist }) => {
    const theme = useContext(ThemeContext)
    const [click, setClick] = useState(false);
    const [replyclick, setReplyclick] = useState(new Array(replylist.length).fill(false));
    const [reply, setReply] = useState(replylist);
    const show = (index) => {
        const copy = JSON.parse(JSON.stringify(replyclick));
        copy[index] = !copy[index];
        setReplyclick(copy);
    }

    const closeAll = () => {
        setReplyclick(new Array(reply.length).fill(false));
        setClick(false);
    }

    // 回复
    const addComment = (comment, father, userName, replyto) => {
        if(father===undefined){
            message.error('请先刷新，有bug T T')
            return;
        }
        console.log('father: ' + father)
        console.log('userName: ' + userName)
        console.log('replyto: ' + replyto)
        userName = userName === '' ? "anonymous" : JSON.stringify(userName);
        replyto = replyto === '' ? "anonymous" : replyto;
        const dataProps = {
            article_id: data.article_id,
            content: 'REPLY TO ' + replyto + ' : ' + JSON.stringify(comment),
            date: Date.now(),
            name: userName,
            father_id: father,
        }
        axios({
            method: 'post',
            url: servicePath.addComment,
            data: dataProps,
        }).then((res) => {
            if (res.data.isSuccess) {
                message.success('成功')
            } else {
                message.error('失败')
            }
        })
        setReply(reply.concat(dataProps));
        closeAll();
    }
    return (
        <div className="comment-list">
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            <div className="comment-display">
                <p>{data.name}</p>
                <p>{ymdhms(data.date)}</p>
            </div>
            <p>{data.content}</p>
            <Button type="primary" shape="round" onClick={() => { setClick(!click) }}>回复</Button>
            <CommentModel show={click} addComment={addComment} father={data.Id} replyto={data.name} />
            <div className={`reply-list ${theme.state.dark ? 'app-dark-1' : 'app-light-1'}`}>
                {reply.map((item, index) => (
                    <div className="comment-box" key={item.Id}>
                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                        <div className="comment-display">
                            <p>{item.name}</p>
                            <p>{ymdhms(item.date)}</p>
                        </div>
                        <p>{item.content}</p>
                        <Button type="primary" shape="round" onClick={() => { show(index) }}>回复</Button>
                        <CommentModel show={replyclick[index]} addComment={addComment} father={data.Id} replyto={item.name} />
                    </div>
                ))}
            </div>
        </div>
    )
}

// 评论板块，传入这一篇文章所有的评论 评论分回复类
const SubmitComment = ({ comments, AID }) => {
    const [allComments, setAllcomments] = useState(comments)
    const [data, setData] = useState([]);
    const [reply, setReply] = useState([]);
    useEffect(() => {
        // console.log(allComments.data);
        const comment = [];
        const reply = [];
        for (const item of allComments.data) {
            if (item.father_id !== null) {
                reply.push(item)
            } else {
                comment.push(item)
            }
        }
        setReply(reply);
        setData(comment);
    }, [])
    // 新增评论专用
    const addComment = (comment, father, userName) => {
        userName = userName === '' ? "anonymous" : JSON.stringify(userName);
        const dataProps = {
            article_id: AID,
            content: JSON.stringify(comment),
            date: Date.now(),
            name: userName,
            father_id: father,
        }
        axios({
            method: 'post',
            url: servicePath.addComment,
            data: dataProps,
        }).then((res) => {
            if (res.data.isSuccess) {
                message.success('成功')
            } else {
                message.error('失败')
            }
        })
        setData(data.concat(dataProps));
    }
    return (
        <div>
            <CommentModel addComment={addComment} show={true} father={null} />
            {data.map((item) => {
                const replylist = reply.filter(r => {
                    return r.father_id == item.Id
                });
                return (<Comment key={item.Id} data={item} replylist={replylist}></Comment>)
            })}
        </div>
    );
};

export default SubmitComment