import { a } from './a.js';

console.log(a);

import('./b.js').then(result => {
    console.log(result.b);
});
