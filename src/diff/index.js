import Patches from '../patch';
import {isString} from '../utils';
import listDiff from 'list-diff2';

/**
 * diff two virtual-dom tree
 * @param {Element} oldTree
 * @param {Element} newTree
 * @param {Patches} patches
 */
class Diff{
    constructor(oldTree,newTree,patches=new Patches()){
        if(!patches instanceof Patches){
            throw new Error('Invalid patches\'s type:it should be {Patches}.');
        }
        this.patches=patches;
        this.index=0;
        this.diffNode(oldTree,newTree);
    }

    getPatches(){
        return this.patches
    }

    // DFS travel
    diffNode(oldNode,newNode){
        let currPatches=[];
        let currIndex=this.index;
        // if text node
        if(isString(oldNode) && isString(newNode)){
            if(oldNode!==newNode){
                currPatches.push({
                    type:Patches.TEXT,
                    content:newNode
                })
            }
        }
        // if tagName and keys are the same
        else if(oldNode.tagName===newNode.tagName
            && oldNode.key===newNode.key){
            // diff props
            this.diffProps(oldNode,newNode,currPatches);
            // ignore
            if(!(oldNode.props && oldNode.props.hasOwnProperty('ignore'))) {
                this.diffChildren(oldNode, newNode, currPatches);
            }
        }
        else{   // replace item
            this.index+=oldNode.count;
            currPatches.push({
                type:Patches.REPLACE,
                node:newNode
            })
        }
        currPatches.length &&
        this.patches.addPatch(currIndex, currPatches);
    }

    diffProps(oldNode,newNode,currPatches){
        let oProps=oldNode.props||{};
        let nProps=newNode.props||{};
        let propsWillChange={};
        // check old props
        for(let prop in oProps){
            if(nProps[prop]!==oProps[prop]){
                propsWillChange[prop]=nProps[prop];
            }
        }
        // find new props
        for(let prop in nProps){
            if(!oProps.hasOwnProperty(prop)) {
                propsWillChange[prop] = nProps[prop];
            }
        }
        if(Object.keys(propsWillChange).length) {
            currPatches.push({
                type: Patches.PROPS,
                props: propsWillChange
            });
        }
        return currPatches;
    }

    diffChildren(oldNode,newNode,currPatches){
        let diff=listDiff(oldNode.children,newNode.children,'key');
        let moves=diff.moves;
        let newChildren=diff.children;
        if(moves.length){
            currPatches.push({
                type:Patches.REORDER,
                moves:moves
            })
        }

        let oldChildren=oldNode.children;
        // diff children
        for(let i=0,len=oldChildren.length;i<len;i++){
            if(!newChildren[i]) break;
            this.index++;
            this.diffNode(oldChildren[i],newChildren[i]);
        }
    }

}

export default Diff;

// for test
export function diff(oldTree,newTree){
    let diffs = new Diff(oldTree,newTree);
    return diffs.getPatches();
}