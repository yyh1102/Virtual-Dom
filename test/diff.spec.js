import {el} from '../src/element';
import {diff} from '../src/diff';
import Pathces from '../src/patch';
import chai,{expect} from 'chai';
chai.should();

describe('Test diff algorithm', function () {
    it('Node replacing', function () {
        let oldRoot = el('div', [el('p'), el('div'), el('section')])
        let newRoot = el('div', [el('p'), el('span'), el('section')])

        let patches = diff(oldRoot, newRoot).getPatches();
        patches[2][0].type.should.be.equal(Pathces.REPLACE)
    })

    it('Node propeties change', function () {
        let oldRoot = el('div', [
            el('p', [el('span', { style: 'blue' })]),
            el('p', [el('span', { style: 'red' })]),
            el('p', [el('span', { style: 'yellow' })])
        ])

        let newRoot = el('div', [
            el('p', [el('span', { style: 'blue', index: '0' })]),
            el('p', [el('span', { class: 'fuck' })]),
            el('p', [el('span', { style: 'yellow green' })])
        ])

        let patches = diff(oldRoot, newRoot).getPatches();
        patches[2][0].type.should.be.equal(Pathces.PROPS)
        patches[2][0].props.should.be.deep.equal({ index: '0' })

        patches[4][0].type.should.be.equal(Pathces.PROPS)
        patches[4][0].props.should.be.deep.equal({ style: void 555, class: 'fuck' })

        patches[6][0].type.should.be.equal(Pathces.PROPS)
        patches[6][0].props.should.be.deep.equal({ style: 'yellow green' })
    })

    it('Node removing', function () {
        let oldRoot = el('div', [
            el('p', [el('span', { style: 'blue' })]),
            el('p', [el('span', { style: 'red' }), el('p'), el('div')]),
            el('p', [el('span', { style: 'yellow' })])
        ])

        let newRoot = el('div', [
            el('p', [el('span', { style: 'blue' })]),
            el('p', [el('span', { style: 'red' })]),
            el('p', [el('span', { style: 'yellow' })])
        ])

        let diffs = diff(oldRoot, newRoot).getPatches();
        diffs[3][0].type.should.be.equal(Pathces.REORDER)
        diffs[3][0].moves.should.be.deep.equal([
            { type: 0, index: 1 },
            { type: 0, index: 1 }
        ])
    })

    it('Reordering with keyed items', function () {
        let oldRoot = el('ul', {id: 'list'}, [
            el('li', {key: 'a'}),
            el('li', {key: 'b'}),
            el('li', {key: 'c', style: 'shit'}),
            el('li', {key: 'd'}),
            el('li', {key: 'e'})
        ])

        let newRoot = el('ul', {id: 'lsit'}, [
            el('li', {key: 'a'}),
            el('li', {key: 'c'}),
            el('li', {key: 'e'}),
            el('li', {key: 'd'}),
            el('li', {key: 'b', name: 'Jerry'})
        ])

        let diffs = diff(oldRoot, newRoot).getPatches();
        diffs[0].length.should.be.equal(2)
        diffs[0][0].type.should.equal(Pathces.PROPS)
        diffs[2][0].type.should.equal(Pathces.PROPS)

        diffs[2][0].props.should.deep.equal({name: 'Jerry'})
        diffs[3][0].props.should.deep.equal({style: void 555})

        diffs[0][0].type.should.equal(Pathces.PROPS)
        diffs[0][1].type.should.equal(Pathces.REORDER)
        diffs[0][1].moves.length.should.equal(4)
    })

    it('Text replacing', function () {
        let oldRoot = el('div', [
            el('p', ['Jerry', 'is', 'my', 'love']),
            el('p', ['Jerry', 'is', 'my', 'love'])
        ])

        let newRoot = el('div', [
            el('p', ['Jerry', 'is', 'my', 'love']),
            el('p', ['Lucy', 'is', 'my', 'hate'])
        ])

        let diffs = diff(oldRoot, newRoot).getPatches();
        diffs[7][0].type.should.be.equal(Pathces.TEXT)
        diffs[10][0].type.should.be.equal(Pathces.TEXT)
    })

    it('Diff complicated dom', function () {
        let color = 'blue'
        let count = 0
        let root1 = el('div', {'id': 'container'}, [
            el('h1', {style: 'color: ' + color}, ['simple virtal dom']),
            el('p', ['the count is :' + count]),
            el('ul', [el('li')])
        ])

        let root2 = el('div', {'id': 'container'}, [
            el('h1', {style: 'color: ' + color}, ['simple virtal dom']),
            el('p', ['the count is :' + count]),
            el('ul', [el('li'), el('li')])
        ])

        let patches = diff(root1, root2).getPatches();
        patches[5].should.be.an.Object
    })

    it('Skip element that has ignore tag when performing diff', function () {
        let color = 'blue'
        let count = 0
        let root1 = el('div', {'id': 'container', 'ignore': 'true'}, [
            el('h1', {style: 'color: ' + color}, ['simple virtal dom']),
            el('p', ['the count is :' + count]),
            el('ul', [el('li')])
        ])

        let root2 = el('div', {'id': 'container', 'ignore': 'true'}, [
            el('h1', {style: 'color: ' + color}, ['simple virtal domk']),
            el('p', ['the count is :' + count + 'k']),
            el('ul', [el('li'), el('li'), el('li')])
        ])

        let patches = diff(root1, root2).getPatches();
        patches.should.be.deep.equal({})

        root1 = el('div', {'id': 'container'}, [
            el('h1', {style: 'color: ' + color, 'ignore': 'true'}, ['simple virtual dom']),
            el('p', ['the count is :' + count]),
            el('ul', [el('li')])
        ])

        root2 = el('div', {'id': 'container'}, [
            el('h1', {style: 'color: ' + color, 'ignore': 'true'}, ['simple virtual dom 2']),
            el('p', ['the count is :' + count]),
            el('ul', [el('li'), el('li',{name:'llaa'})])
        ])

        patches = diff(root1, root2).getPatches();
        expect(patches[1]).to.be.equal(undefined)
        expect(patches[4]).to.be.an('array')
    })
})
