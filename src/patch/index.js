import {replaceNode,reorderChildren,setProps,setText} from './patchUtils';
import {toArray} from '../utils';

class Patches{
    constructor(){
        this.patches={};
        this.walkIndex=0;
    }

    getPatches(index){
        if(!index) return this.patches;
        return this.patches[index];
    }

    addPatch(index,patches){
        this.patches[index]=patches;
    }

    /**
     * DFS apply patches to each node
     * @param {Node} node
     */
    apply(node){
        let patches=this.patches[this.walkIndex];
        // DFS travel
        let children=toArray(node.childNodes);
        children.forEach((child)=>{
            this.walkIndex++;
            this.apply(child);
        });

        this.applyPatches(node,patches);
    }

    /**
     * apply patches to a single node
     * @param {Node} node
     * @param {Array} patches
     */
    applyPatches(node,patches=[]){
        patches.forEach((patch)=>{
            switch(patch.type){
                case Patches.REPLACE:
                    replaceNode(node,patch.node);
                    break;
                case Patches.REORDER:
                    reorderChildren(node,patch.moves);
                    break;
                case Patches.PROPS:
                    setProps(node,patch.props);
                    break;
                case Patches.TEXT:
                    setText(node,patch.content);
                    break;
                default:
                    throw new Error('Invalid patch\'s type');
                    break;
            }
        })
    }
}

Patches.REPLACE=0;
Patches.REORDER=1;
Patches.PROPS=2;
Patches.TEXT=3;

export default Patches;