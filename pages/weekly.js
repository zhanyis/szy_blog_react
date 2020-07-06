import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Switch, Drawer, Popconfirm, message } from 'antd';
import '../static/style/pages/weekly.css';;
import { currentWeekday } from '../static/jsMethod/comm';
import Link from 'next/link';
import Head from '../components/Head'
import {CloseOutlined, CheckOutlined, ImportOutlined, MenuOutlined } from '@ant-design/icons';


const { Option } = Select;

const Weekly = () => {
    /* 
       monday = [{
           id: 0,
           things: '吃饭',
           done: 'false',
       }]
     */


    const [monday, setMonday] = useState([])
    const [tuesday, setTuesday] = useState([])
    const [wednesday, setWednesday] = useState([])
    const [thursday, setThursday] = useState([])
    const [friday, setFriday] = useState([])
    const [saturday, setSaturday] = useState([])
    const [sunday, setSunday] = useState([])

    const [newThing, setNewThing] = useState('');
    const [choosingDay, setChoosingDay] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let monList = localStorage.getItem('monday') || JSON.stringify([]);
        setMonday(JSON.parse(monList));
        let tueList = localStorage.getItem('tuesday') || JSON.stringify([]);
        setTuesday(JSON.parse(tueList));
        let wedList = localStorage.getItem('wednesday') || JSON.stringify([]);
        setWednesday(JSON.parse(wedList));
        let thuList = localStorage.getItem('thursday') || JSON.stringify([]);
        setThursday(JSON.parse(thuList));
        let friList = localStorage.getItem('friday') || JSON.stringify([]);
        setFriday(JSON.parse(friList));
        let satList = localStorage.getItem('saturday') || JSON.stringify([]);
        setSaturday(JSON.parse(satList));
        let sunList = localStorage.getItem('sunday') || JSON.stringify([]);
        setSunday(JSON.parse(sunList));
    }, [])

    useEffect(() => {
        localStorage.setItem('monday', JSON.stringify(monday))
    }, [monday]);

    useEffect(() => {
        localStorage.setItem('tuesday', JSON.stringify(tuesday))
    }, [tuesday]);

    useEffect(() => {
        localStorage.setItem('wednesday', JSON.stringify(wednesday))
    }, [wednesday]);

    useEffect(() => {
        localStorage.setItem('thursday', JSON.stringify(thursday))
    }, [thursday]);

    useEffect(() => {
        localStorage.setItem('friday', JSON.stringify(friday))
    }, [friday]);

    useEffect(() => {
        localStorage.setItem('saturday', JSON.stringify(saturday))
    }, [saturday]);

    useEffect(() => {
        localStorage.setItem('sunday', JSON.stringify(sunday))
    }, [sunday]);

    const day = {
        'monday': monday,
        'tuesday': tuesday,
        'wednesday': wednesday,
        'thursday': thursday,
        'friday': friday,
        'saturday': saturday,
        'sunday': sunday,
    }

    const setday = {
        'monday': setMonday,
        'tuesday': setTuesday,
        'wednesday': setWednesday,
        'thursday': setThursday,
        'friday': setFriday,
        'saturday': setSaturday,
        'sunday': setSunday,
    }

    const weekDayList = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ]

    const handleSubmit = () => {
        if (!choosingDay) {
            message.error('please SELECT a day')
            return 
        }
        if(newThing===''){
            message.error('please ENTER something')
            return 
        }
        if (choosingDay === 'all') {
            for (const value of weekDayList) {
                const selectDay = day[value];
                const dayMethod = setday[value];
                const newObj = {
                    id: selectDay.length,
                    things: newThing,
                    done: false,
                }
                dayMethod(selectDay.concat(newObj));
                setNewThing('');
            }
            return
        }
        const selectDay = day[choosingDay];
        const dayMethod = setday[choosingDay];
        const newObj = {
            id: selectDay.length,
            things: newThing,
            done: false,
        }
        dayMethod(selectDay.concat(newObj));
        setNewThing('');
    }

    function handleSelect(value) {
        setChoosingDay(value);
    }

    const handledelete = (id, days) => {
        const selectDay = day[days];
        const dayMethod = setday[days];
        console.log('delete method start')
        dayMethod(selectDay.filter(item => {
            return item.id !== id;
        }))
    }

    function onChange(id, days) {
        console.log(id)
        const selectDay = day[days];
        const dayMethod = setday[days];
        dayMethod(selectDay.map(item => {
            if (item.id === id) {
                item.done = !item.done;
                return item
            }
            return item
        }))
    }

    const onClose = () => {
        setVisible(false);
    };

    const showDrawer = () => {
        setVisible(true)
    };

    const delAll = () => {
        setMonday([]);
        setTuesday([]);
        setWednesday([]);
        setThursday([]);
        setFriday([]);
        setSaturday([]);
        setSunday([]);
    }

    return (
        <div className="outer-container">
            <Head name="Weekly Plan" />
            <MenuOutlined style={{ margin: "0.5rem", fontSize: "1rem", display: "absolute", left: 0, top: 0 }} onClick={() => showDrawer()} />
            <Drawer
                placement="left"
                closable={false}
                onClose={onClose}
                visible={visible}
                key="left"
            >
                <div className="tag-list">
                    <ImportOutlined style={{ margin: "0.5rem" }} /><Link href="/" ><a>SZYblog</a></Link>
                </div>
                <div className="tag-list">
                    <CloseOutlined style={{ margin: "0.5rem" }} />
                    <Popconfirm placement="right" title="Delete all?" onConfirm={delAll} okText="Yes" cancelText="No">
                        <a>Delete All</a>
                    </Popconfirm>
                </div>
            </Drawer>
            <div className="weekly-today">{currentWeekday()}</div>
            <div className="weekly-title">Weekly plan</div>
            <div className="weekly-input">
                <Select size="large" defaultValue="Pick A day" style={{ width: 200, marginLeft: "0.5rem", marginRight: 20 }} onChange={handleSelect}>
                    <Option value="monday">Monday</Option>
                    <Option value="tuesday">Tuesday</Option>
                    <Option value="wednesday">Wednesday</Option>
                    <Option value="thursday">Thursday</Option>
                    <Option value="friday">Friday</Option>
                    <Option value="saturday">Saturday</Option>
                    <Option value="sunday">Sunday</Option>
                    <Option value="all">Everyday</Option>
                </Select>
                <Input size="large" onPressEnter={handleSubmit} placeholder="Something to do" style={{ width: 400 }} value={newThing} type="text" onChange={(e) => { setNewThing(e.target.value) }} />
                <Button size="large" style={{ marginRight: 200, marginLeft: 20 }} onClick={handleSubmit} >add</Button>
            </div>
            <div className="days-container">
                <div className="weekly-itemcard">
                    <h1>Monday</h1>
                    {monday.map(item => (
                        <div className="weekly-item" key={item.id}>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={item.done}
                                onChange={() => { onChange(item.id, 'monday') }}
                            />
                            <div className={item.done ? "weekly-text-done" : "weekly-text-notdone"}>{item.things}</div>
                            <Button onClick={() => { handledelete(item.id, 'monday') }}>delete</Button>
                        </div>
                    ))}
                </div>
                <div className="weekly-itemcard">
                    <h1>Tuesday</h1>
                    {tuesday.map(item => (
                        <div className="weekly-item" key={item.id}>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={item.done}
                                onChange={() => { onChange(item.id, 'tuesday') }}
                            />
                            <div className={item.done ? "weekly-text-done" : "weekly-text-notdone"}>{item.things}</div>
                            <Button onClick={() => { handledelete(item.id, 'tuesday') }}>delete</Button>
                        </div>
                    ))}
                </div>
                <div className="weekly-itemcard">
                    <h1>Wednesday</h1>
                    {wednesday.map(item => (
                        <div className="weekly-item" key={item.id}>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={item.done}
                                onChange={() => { onChange(item.id, 'wednesday') }}
                            />
                            <div className={item.done ? "weekly-text-done" : "weekly-text-notdone"}>{item.things}</div>
                            <Button onClick={() => { handledelete(item.id, 'wednesday') }}>delete</Button>
                        </div>
                    ))}
                </div>
                <div className="weekly-itemcard">
                    <h1>Thursday</h1>
                    {thursday.map(item => (
                        <div className="weekly-item" key={item.id}>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={item.done}
                                onChange={() => { onChange(item.id, 'thursday') }}
                            />
                            <div className={item.done ? "weekly-text-done" : "weekly-text-notdone"}>{item.things}</div>
                            <Button onClick={() => { handledelete(item.id, 'thursday') }}>delete</Button>
                        </div>
                    ))}
                </div>
                <div className="weekly-itemcard">
                    <h1>Friday</h1>
                    {friday.map(item => (
                        <div className="weekly-item" key={item.id}>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={item.done}
                                onChange={() => { onChange(item.id, 'friday') }}
                            />
                            <div className={item.done ? "weekly-text-done" : "weekly-text-notdone"}>{item.things}</div>
                            <Button onClick={() => { handledelete(item.id, 'friday') }}>delete</Button>
                        </div>
                    ))}
                </div>
                <div className="weekly-itemcard">
                    <h1>Saturday</h1>
                    {saturday.map(item => (
                        <div className="weekly-item" key={item.id}>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={item.done}
                                onChange={() => { onChange(item.id, 'saturday') }}
                            />
                            <div className={item.done ? "weekly-text-done" : "weekly-text-notdone"}>{item.things}</div>
                            <Button onClick={() => { handledelete(item.id, 'saturday') }}>delete</Button>
                        </div>
                    ))}
                </div>
                <div className="weekly-itemcard">
                    <h1>Sunday</h1>
                    {sunday.map(item => (
                        <div className="weekly-item" key={item.id}>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={item.done}
                                onChange={() => { onChange(item.id, 'sunday') }}
                            />
                            <div className={item.done ? "weekly-text-done" : "weekly-text-notdone"}>{item.things}</div>
                            <Button onClick={() => { handledelete(item.id, 'sunday') }}>delete</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default Weekly