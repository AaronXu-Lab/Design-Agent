import test from 'node:test'
import assert from 'node:assert/strict'
import { PreviewPool } from '../assets/canvas-kit/reference/preview-pool.ts'
test('three documents, serialized concurrent activations and exact state restoration', async () => {
 const pool = new PreviewPool()
 for (let i=0;i<20;i++) pool.register(String(i),{suspend:async()=>({email:`${i}@example.com`,step:'error',value:i})})
 await Promise.all(Array.from({length:20},(_,i)=>pool.activate(String(i))))
 assert.deepEqual(pool.getSnapshot(),['17','18','19'])
 assert.deepEqual(pool.saved('0'),{present:true,value:{email:'0@example.com',step:'error',value:0}})
 await pool.activate('0')
 assert.equal(pool.getSnapshot().length,3)
 pool.reset('0')
 assert.equal(pool.saved('0').present,false)
 assert.equal(pool.getSnapshot().includes('0'),false)
})
test('snapshot failure preserves active documents and queued requests recover', async () => {
 const pool=new PreviewPool();let fail=true
 pool.register('a',{suspend:async()=>{if(fail)throw Error('missing adapter');return {text:'saved'}}})
 for(const id of ['b','c','d'])pool.register(id,{suspend:async()=>null})
 for(const id of ['a','b','c'])await pool.activate(id)
 await assert.rejects(pool.activate('d'),/missing adapter/)
 assert.deepEqual(pool.getSnapshot(),['a','b','c'])
 fail=false;await pool.activate('d');assert.deepEqual(pool.saved('a').value,{text:'saved'})
})
test('save before module unmount, scope separation and reset clear snapshots',async()=>{
 const pool=new PreviewPool();const unregister=pool.register('flow-a:node',{suspend:async()=>({field:'draft'})})
 await pool.activate('flow-a:node');await pool.saveAll();unregister()
 assert.equal(pool.getSnapshot().length,0)
 assert.equal(pool.saved('flow-a:node').value.field,'draft')
 assert.equal(pool.saved('flow-b:node').present,false)
 pool.reset('flow-a:node');assert.equal(pool.saved('flow-a:node').present,false)
})
