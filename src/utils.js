/**
 * convert array-like object to array.
 * will generate a new array
 * @param arrayLike
 * @return {Array}
 */
export function toArray(arrayLike){
    arrayLike = arrayLike || [];
    if(!arrayLike.hasOwnProperty('length')) throw new Error('Parameter 1 should be array-like object');
    let list=[];
    for(let i=0,len=arrayLike.length;i<len;i++){
        list.push(arrayLike[i]);
    }
    return list;
}

export function isString(o){
    return typeof o === 'string';
}
