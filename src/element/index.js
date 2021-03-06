import {toArray} from '../utils';

/**
 * Virtual-dom Element by js-object
 * @param {String} tagName - default 'div'
 * @param {Object} props - Properties of elements
 *                        - key-value object
 * @param {Array<Element|String>|ArrayLike<Element|String>} children - children of elements
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

        let count=0;
        this.children.forEach((child)=>{
            if(child instanceof Element){
                count+=child.count+1;
            }
            else{
                count++;
            }
        })
        this.count=count;
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