import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';

test('shared controls render accessible errors, loading and disabled states',async()=>{
 const server=await createServer({root:fileURLToPath(new URL('../',import.meta.url)),server:{middlewareMode:true},appType:'custom'});
 try{
  const {FormInput,Button,Alert}=await server.ssrLoadModule('/src/components/Ui.jsx');
  const input=renderToStaticMarkup(React.createElement(FormInput,{label:'Email',id:'email',error:'Enter a valid email.',type:'email',value:'bad',onChange(){}}));
  assert.match(input,/for="email"/);assert.match(input,/aria-invalid="true"/);assert.match(input,/aria-describedby="email-error"/);assert.match(input,/id="email-error"/);
  const select=renderToStaticMarkup(React.createElement(FormInput,{as:'select',label:'Service',error:'Select a service.',value:'',onChange(){}},React.createElement('option',{value:''},'Select')));
  assert.match(select,/<select/);assert.match(select,/Select a service/);
  const button=renderToStaticMarkup(React.createElement(Button,{loading:true},'Save'));
  assert.match(button,/disabled/);assert.match(button,/aria-busy="true"/);assert.match(button,/Please wait/);
  assert.match(renderToStaticMarkup(React.createElement(Alert,{type:'success',message:'Saved'})),/role="status"/);
  assert.match(renderToStaticMarkup(React.createElement(Alert,{message:'Failed'})),/role="alert"/);
  const {useFormFeedback}=await server.ssrLoadModule('/src/hooks/useFormFeedback.js');
  let feedback;
  function Harness(){feedback=useFormFeedback();return null;}
  renderToStaticMarkup(React.createElement(Harness));
  let resolve,calls=0;
  const waiting=new Promise(done=>{resolve=done;});
  const first=feedback.run(async()=>{calls++;await waiting;});
  const duplicate=await feedback.run(async()=>{calls++;});
  assert.equal(duplicate,false);assert.equal(calls,1);resolve();assert.equal(await first,true);
  assert.equal(await feedback.run(async()=>{calls++;}),true);assert.equal(calls,2);
 }finally{await server.close();}
});
