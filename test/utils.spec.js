import {toArray,isString} from '../src/utils';
import chai from 'chai';
chai.should();

describe('Test utilities',()=>{
    it('Func toArray input []&null',()=>{
        toArray([]).should.be.deep.equal([]);
        toArray(null).should.be.deep.equal([]);
    })

    it('Func toArray input array',()=>{
        let arr=[1,2,3]
        toArray(arr).should.be.deep.equal(arr);
    })

    it('Func toArray input array-like',()=>{
        let arrayLike={0:1,1:2,2:3,length:3};
        let arr=[1,2,3];
        toArray(arrayLike).should.be.deep.equal(arr);
    })

    it('Func toArray input object',()=>{
        let obj={};
        try{
            toArray(obj);
        }
        catch(e){
            e.message.should.be.equal('Parameter 1 should be array-like object')
        }
    })

    it('Func isString',()=>{
        isString('lowes').should.be.equal(true);
        isString({}).should.be.equal(false);
    })
})

