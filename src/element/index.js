import {toArray} from '../utils';

/**
 * Virtual-dom Element by js-object
 * @param {String} tagName
 * @param {Object} props - Properties of elements
 *                        - key-value object
 * @param {Array<String>|ArrayLike<String>} children - children of elements
 */
class Element{
    constructor(tagName='div',props={},children=[]){
        this.tagName=tagName;
        if(props instanceof Array){
            this.children=toArray(props);
        }
        else {
            this.props = props;
            this.children = toArray(children);
        }
        this.key=props.key;
    }

    render(){
        let root=document.createElement(this.tagName);
        for(let prop in this.props){
            root.setAttribute(prop,this.props[prop]);
        }

        let childNode;
        this.children.forEach((child)=>{
            childNode=(child instanceof Element)?
                child.render():
                document.createTextNode(child);
            root.appendChild(childNode);
        });
        return root;
    }
}

export default Element;

// for test
export function el(tagName,props,children){
    return new Element(tagName,props,children);
}