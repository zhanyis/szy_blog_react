const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec"];
const weekday = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function currentWeekday(){
    let date = new Date();
    let wd = weekday[date.getDay()-1];
    let mm = month[date.getMonth()];
    let dd = date.getDate();
    return `${wd},  ${mm}  ${dd}`
}

function changeTime (timeStamp) {
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

export {changeTime, currentWeekday}