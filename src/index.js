import Element,{el} from './element';
import Patches from './patch';
import {diff} from './diff';

window.vdom={
    el,
    Element,
    Patches,
    diff
}

export default window.vdom;