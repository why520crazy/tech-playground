import { compile } from 'art-template';
const render = compile(`<div>{{if user}}
<h2>{{user.name}}</h2>
{{/if}}</div>`);

console.log(render({ user: { name: 'peter' } }));
// console.log(JSON.stringify(result, null, 2));
