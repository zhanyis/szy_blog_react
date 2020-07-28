const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function currentWeekday() {
    let date = new Date();
    let wd = weekday[date.getDay() - 1];
    let mm = month[date.getMonth()];
    let dd = date.getDate();
    return `${wd},  ${mm}  ${dd}`
}

function changeTime(timeStamp) {
    let date = new Date(timeStamp);
    let yy = date.getFullYear();
    let mm = date.getMonth();
    let dd = date.getDate();
    let obj = {
        y: yy,
        m: month[mm],
        d: dd
    }
    return obj
}

function ymdhms(timeStamp) {
    let date = new Date(timeStamp);
    let yy = date.getFullYear();
    let mm = date.getMonth();
    let dd = date.getDate();
    let hh = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    m = m < 10 ? `0${m}` : m;
    s = s < 10 ? `0${s}` : s;
    return `${yy}/${mm + 1}/${dd} ${hh}:${m}:${s}`
}

export { changeTime, currentWeekday, ymdhms }