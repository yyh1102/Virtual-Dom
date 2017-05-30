import {el} from '../src/element';
import {diff} from '../src/diff';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import jsdom from 'mocha-jsdom';

chai.use(sinonChai)
chai.should()
jsdom()

describe('Test patch fucntion', function () {
    it('Attributes adding', function () {
        let root = el('div', {id: 'content'}, [
            el('p', ['I love you']),
            el('div', ['I love you']),
            el('section', ['I love you'])
        ])

        let root2 = el('div', {id: 'content'}, [
            el('p', ['I love you']),
            el('div', {name: 'Jerry'}, ['I love you']),
            el('section', ['I love you'])
        ])

        let dom = root.render()
        let patches = diff(root, root2)

        let spy = dom.childNodes[1].setAttribute = sinon.spy()

        patches.apply(dom);
        spy.should.has.been.calledWith('name', 'Jerry').once
    })

    it('Attributes removing', function () {
        let root = el('div', {id: 'content'}, [
            el('p', ['I love you']),
            el('div', ['I love you']),
            el('section', ['I love you'])
        ])

        let root2 = el('div', [
            el('p', ['I love you']),
            el('div', {name: 'Jerry'}, ['I love you']),
            el('section', ['I love you'])
        ])

        let dom = root.render()
        let patches = diff(root, root2)

        let spy = dom.removeAttribute = sinon.spy()
        patches.apply(dom)
        spy.should.has.been.calledOnce
    })

    it('Text replacing', function () {
        let root = el('div', {id: 'content'}, [
            el('p', ['I love you']),
            el('div', ['I love you']),
            el('section', ['I love you'])
        ])

        let root2 = el('div', [
            el('p', ['I love you']),
            el('div', {name: 'Jerry'}, ['I love you']),
            el('section', ['I love you, too'])
        ])

        let dom = root.render()
        let patches = diff(root, root2)
        patches.apply(dom)

        dom.childNodes[2].textContent.should.be.equal('I love you, too')
    })

    it('Node replacing', function () {
        let root = el('div', {id: 'content'}, [
            el('p', ['I love you']),
            el('div', ['I love you']),
            el('section', ['I love you'])
        ])

        let root2 = el('div', {id: 'content'}, [
            el('p', ['I love you']),
            el('p', {name: 'Jerry'}, ['I love you']),
            el('section', ['I love you, too'])
        ])

        let dom = root.render()
        let patches = diff(root, root2)
        let spy = dom.replaceChild = sinon.spy()
        patches.apply(dom)
        spy.should.has.been.called.once
    })

    it('Nodes reordering', function () {
        let root = el('ul', {id: 'content'}, [
            el('li', {key: 'a'}, ['Item 1']),
            el('li', {key: 'b'}, ['Item 2']),
            el('li', {key: 'c'}, ['Item 3']),
            el('li', {key: 'd'}, ['Item 4']),
            el('li', {key: 'e'}, ['Item 5'])
        ])

        let root2 = el('ul', {id: 'content'}, [
            el('li', {key: 'a'}, ['Item 1']),
            el('li', {key: 'd'}, ['Item 4']),
            el('li', {key: 'b'}, ['Item 2']),
            el('li', {key: 'e'}, ['Item 5']),
            el('li', {key: 'c'}, ['Item 3'])
        ])

        let dom = root.render()
        let patches = diff(root, root2)
        let spy = dom.insertBefore = sinon.stub()
        let spy2 = dom.removeChild = sinon.stub()
        patches.apply(dom)

        spy.should.has.been.called.twice
        spy2.should.not.has.been.called
    })

    it('Root replacing', function () {
        let root = el('ul', {id: 'content'}, [
            el('li', {key: 'a'}, ['Item 1']),
            el('li', {key: 'b'}, ['Item 2']),
            el('li', {key: 'c'}, ['Item 3']),
            el('li', {key: 'd'}, ['Item 4']),
            el('li', {key: 'e'}, ['Item 5'])
        ])

        let root2 = el('div', {id: 'content'}, [
            el('li', {key: 'a'}, ['Item 1']),
            el('li', {key: 'd'}, ['Item 4']),
            el('li', {key: 'b'}, ['Item 2']),
            el('li', {key: 'e'}, ['Item 5']),
            el('li', {key: 'c'}, ['Item 3'])
        ])

        let dom = root.render()
        document.body.appendChild(dom)
        let patches = diff(root, root2)
        patches.apply(dom)
        dom = document.getElementById('content')
        dom.innerHTML.should.be.equal(root2.render().innerHTML)
    })

    it('Root reordering and replacing',function(){
        let root = el('ul', {id: 'content'}, [
            el('li', {key: 'a'}, ['Item 1']),
            el('li', {key: 'b'}, ['Item 2']),
            el('li', {key: 'c'}, ['Item 3']),
            el('li', {key: 'd'}, ['Item 4']),
            el('li', {key: 'e'}, ['Item 5'])
        ])

        let root2 = el('ul', {id: 'content'}, [
            el('li', {key: 'a'}, ['Item 1']),
            el('li', {key: 'd'}, ['Item 4']),
            el('li', {key: 'b'}, ['Item 222']),
            el('li', {key: 'e'}, ['Item 5']),
            el('li', {key: 'c'}, ['Item 23'])

        ])

        let dom = root.render()
        let patches = diff(root, root2)
        patches.apply(dom)
        dom.innerHTML.should.be.equal(root2.render().innerHTML)
    })

    // it('Using patches don\'t exist, should throw error', function () {
    //     let root = el('div', ['good'])
    //     let dom = root.render()
    //     try {
    //         patch(dom, {
    //             1: [{type: 6}, {}]
    //         })
    //     } catch (e) {
    //         e.toString().should.be.equal('Error: Unknown patch type 6')
    //     }
    // })

    it('When child node is not the same, don\'t remove it', function () {
        let root = el('ul', {id: 'content2'}, [
            el('li', {key: 'a'}, ['Item 1']),
            el('li', {key: 'b'}, ['Item 2']),
            el('li', {key: 'c'}, ['Item 3']),
            el('li', {key: 'd'}, ['Item 4']),
            el('li', {key: 'e'}, ['Item 5'])
        ])

        let root2 = el('ul', {id: 'content2'}, [
            el('li', {key: 'a'}, ['Item 1']),
            el('li', {key: 'd'}, ['Item 4']),
            el('li', {key: 'b'}, ['Item 2']),
            el('li', {key: 'c'}, ['Item 3']),
            el('li', {key: 'e'}, ['Item 5'])
        ])

        let dom = root.render()
        let spy = sinon.spy(dom, 'removeChild')
        dom.removeChild(dom.childNodes[3])
        let patches = diff(root, root2)

        patches.apply(dom);
        spy.should.have.been.called.once
    })

    it('When child nodes are the same, remove it', function () {
        let root = el('ul', {id: 'content2'}, [
            el('li', {key: 'a'}, ['Item 1']),
            el('li', {key: 'b'}, ['Item 2']),
            el('li', {key: 'c'}, ['Item 3']),
            el('li', {key: 'd'}, ['Item 4']),
            el('li', {key: 'e'}, ['Item 5'])
        ])

        let root2 = el('ul', {id: 'content2'}, [
            el('li', {key: 'a'}, ['Item 1']),
            el('li', {key: 'b'}, ['Item 2']),
            el('li', {key: 'c'}, ['Item 3']),
            el('li', {key: 'e'}, ['Item 5'])
        ])

        let dom = root.render()
        let spy = sinon.spy(dom, 'removeChild')
        let patches = diff(root, root2)

        patches.apply(dom);
        spy.should.have.been.called.once
    })

    it('Patching input & textarea', function () {
        let input = el('div', {}, [
            el('input', {value: 'old string'}, null),
            el('textarea', {value: 'old string'}, null)
        ])
        let dom = input.render()
        let input2 = el('div', {}, [
            el('input', {value: 'new string'}, null),
            el('textarea', {value: 'new string'}, null)
        ])
        let patches = diff(input, input2)
        patches.apply(dom);
        dom.childNodes[0].value.should.be.equal('new string')
        dom.childNodes[1].value.should.be.equal('new string')
    })
    
    it('Patching div with style',function(){
        let input=el('div',{},[
            el('div')
        ])
        let input2=el('div',{},[
            el('div',{style:'font-size:24px;'})
        ])
        let patches=diff(input,input2);
        let dom=input.render();
        patches.apply(dom);
        dom.childNodes[0].style.fontSize.should.be.equal('24px');

    })

    it('Test nodeValue for IE', function () {
        let root = el('div', {}, [
            el('input', {value: 'old string'}, null),
            el('textarea', {value: 'old string'}, null),
            'ok this is a string'
        ])
        let dom = root.render()
        let text = dom.childNodes[2]
        text.textContent.should.be.equal('ok this is a string')
        text.textContent=undefined;

        let root2 = el('div', {}, [
            el('input', {value: 'old string'}, null),
            el('textarea', {value: 'old string'}, null),
            'ok this is a string2'
        ])

        let patches = diff(root, root2)
        patches.apply(dom);
        text.nodeValue.should.be.equal('ok this is a string2')
    })
})
