import {decode, encode} from 'base-64'

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

export const getElementByKeyFromArray=(array, key, value)=>{
    for (let i in array) {
        if (array[i].hasOwnProperty(key)) {
            if (array[i][key] === value)
                return array[i];
        }
    }
    return false;
};


export function DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
}


export const groupBy = (xs, key, push=true) => {
    return xs.reduce(function(rv, x) {
        if(push){
            (rv[x[key]] = rv[x[key]] || []).push(x);
        }else{
            rv[x[key]] = x;
        }
        return rv;
    }, {});
};
export const groupArrayBy = (xs, key, innerKey) => {

    if(innerKey){
        let newArr= [];
        for(let i  in xs){


                newArr.push(xs[i][innerKey].reduce(function(rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {}))

        }
        return newArr;
    }

    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
export const groupArrayByNestedObjKey = (xs, key, innerKey,noGroupedKey='noGrouped') => {
    return xs.reduce(function(rv, x) {
        if(x[innerKey] && x[innerKey][key]){
            (rv[x[innerKey][key]] = (x[innerKey] && x[innerKey][key] && rv[x[innerKey][key]]) ? rv[x[innerKey][key]] :  []).push(x);
            return rv;
        }else{
            (rv[noGroupedKey] = rv[noGroupedKey] ||  []).push(x)
            return rv;
        }
    }, {});

};


export const groupTasksByProjectName = (tasks) => {

    let newTasks = [];

    let tasksGrouped  = groupArrayByNestedObjKey([...tasks],'name','project');



    Object.keys(tasksGrouped).forEach(key=>{

        newTasks.push({
            title: key,
            data: tasksGrouped[key].sort(function(a, b) {

                if(!a.priorities || !b.priorities)return 0;

                if (a.priorities.sort < b.priorities.sort) return -1;
                if (a.priorities.sort > b.priorities.sort) return 1;
                return 0;
            })
        })

    });


    return newTasks;
};
