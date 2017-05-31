import {toArray} from '../utils';

/**
 * replace new node
 * @param {Node} node
 * @param {Element} el - new element
 */
export function replaceNode(node,el){
    let newNode;
    if(typeof el === 'string') newNode=document.createTextNode(el);
    else newNode=el.render();
    node.parentNode.replaceChild(newNode,node);
}

/**
 * apply list diff to children
 * @param {Node} node
 * @param {Array} moves
 */
export function reorderChildren(node,moves){
    let childList=toArray(node.childNodes);     // simulate the node actions with array.
    let child,index;
    let cache={};

    childList.forEach((child)=>{
        if(child.nodeType===1){
            let key=child.getAttribute('key');
            if(key) cache[key]=child;
        }
    });

    moves.forEach((move)=>{
        index=move.index;
        child=childList[index];
        if(move.type===0){  //remove item
            node.removeChild(child);
            childList.splice(index,1);
        }
        else if(move.type===1){
            let insertNode=cache[move.item.key]  //use old item
                || ((typeof move.item==='object')?
                move.item.render():document.createTextNode(move.item));
            childList.splice(index,0,insertNode);
            node.insertBefore(insertNode,child);
        }
        else throw new Error('Invalid move\'s type');
    })
}

/**
 * set new props
 * @param {Node} node
 * @param {Object} props - key-value object
 */
export function setProps(node,props){
    let value;
    for(let prop in props){
        value=props[prop];
        if(!props[prop]) node.removeAttribute(prop);
        else {
            switch(prop){
                case 'style':
                    node.style.cssText=value;
                    break;
                case 'value':
                    let tagName=(node.tagName || '').toLowerCase();
                    if(tagName==='input' || tagName==='textarea') {
                        node.value = value;
                    }
                    else{
                        node.setAttribute(prop,value);
                    }
                    break;
                default:
                    node.setAttribute(prop,value);
                    break;
            }
        };
    }
}

/**
 * set new text
 * @param {Node} node
 * @param {String} content
 */
export function setText(node,content){
    if(node.textContent) node.textContent=content;
    else node.nodeValue=content;        //IE
}