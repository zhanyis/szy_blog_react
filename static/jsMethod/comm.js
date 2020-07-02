function changeTime (timeStamp) {
    let date = new Date(timeStamp);
    let yy = date.getFullYear();
    let mm = date.getMonth();
    let dd = date.getDate();
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec"];
    let obj = {
        y: yy,
        m: month[mm],
        d: dd
    }
    return obj
}

export {changeTime}