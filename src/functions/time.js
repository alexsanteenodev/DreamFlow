export const toHHMMSS = (seconds)=>  {
    var sec_num = parseInt(seconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours + ':' + minutes + ':' + seconds;
};


export const HHMMSStoSeconds = (time)=>  {
    time  = time? time.split(':') : 0;
    return parseInt((parseInt(time[0]*3600)) +  (parseInt(time[1]*60)) +  parseInt(time[2]));
};
