import test from 'node:test';
import assert from 'node:assert/strict';
import { validateForm, validationErrors, requestError, submissionLock } from '../src/utils/formValidation.js';

test('login requires email/password and validates email format',()=>{
 assert.ok(validateForm('login',{email:'bad',password:''}).email);
 assert.ok(validateForm('login',{email:'bad',password:''}).password);
 assert.deepEqual(validateForm('login',{email:'admin@example.test',password:'existing-password'}),{});
});
test('registration validates names, minimum password length and confirmation',()=>{
 const errors=validateForm('register',{name:' ',email:'person@example.test',password:'short',password_confirmation:'different'});
 assert.ok(errors.name&&errors.password&&errors.password_confirmation);
});
test('product allows blank quote price and rejects missing or negative values',()=>{
 const product={category_id:'1',name:'Window',description:'Clear glass',type:'Sliding',estimated_price:'',image:'/products/window.png'};
 assert.deepEqual(validateForm('product',product),{});
 assert.ok(validateForm('product',{...product,estimated_price:'-1'}).estimated_price);
 assert.ok(validateForm('product',{...product,name:' ',category_id:''}).name);
 assert.ok(validateForm('product',{...product,image:'x'.repeat(2049)}).image);
});
test('category limits match Laravel requirements',()=>{
 assert.ok(validateForm('category',{name:'',description:''}).name);
 assert.ok(validateForm('category',{name:'a'.repeat(101),description:'a'.repeat(2001)}).description);
 assert.deepEqual(validateForm('category',{name:'Windows',description:''}),{});
});
const quotation={project_title:'Windows',project_location:'Tubigon',project_description:'Replace our windows',estimated_budget:'',preferred_date:'',items:[{product_id:'1',quantity:1,specifications:''}]};
test('quotation permits optional blank budget and date',()=>assert.deepEqual(validateForm('quotation',quotation),{}));
test('quotation validates duplicate services and individual quantities',()=>{
 const errors=validateForm('quotation',{...quotation,items:[{product_id:'1',quantity:0},{product_id:'1',quantity:1.5},{product_id:'',quantity:1001}]});
 assert.ok(errors['items.0.product_id']&&errors['items.1.product_id']);
 assert.ok(errors['items.0.quantity']&&errors['items.1.quantity']&&errors['items.2.quantity']);
 assert.ok(errors['items.2.product_id']);
});
test('quotation rejects past dates and long specifications',()=>{
 const errors=validateForm('quotation',{...quotation,preferred_date:'2000-01-01',items:[{product_id:1,quantity:1,specifications:'x'.repeat(2001)}]});
 assert.ok(errors.preferred_date&&errors['items.0.specifications']);
});
test('quoting requires an amount without converting blank to zero',()=>{
 assert.ok(validateForm('status',{status:'quoted',quotation_amount:''}).quotation_amount);
 assert.ok(validateForm('status',{status:'quoted',quotation_amount:-1}).quotation_amount);
 assert.deepEqual(validateForm('status',{status:'rejected',quotation_amount:''}),{});
});
test('Laravel 422 arrays and nested keys stay associated with their fields',()=>{
 assert.deepEqual(validationErrors({response:{status:422,data:{errors:{'items.0.product_id':['Select a service.'],email:['Already used.']}}}}),{'items.0.product_id':'Select a service.',email:'Already used.'});
 assert.deepEqual(validationErrors({response:{status:500,data:{}}}),{});
});
test('network failures have a meaningful retry message',()=>assert.match(requestError({}),/connect/i));
test('submission lock rejects double clicks and releases after completion',()=>{
 const lock=submissionLock();assert.equal(lock.acquire(),true);assert.equal(lock.acquire(),false);lock.release();assert.equal(lock.acquire(),true);
});
