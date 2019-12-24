import marked = require('marked');

const source = `
<div></div>

## header1

- Title 1
- Title 2

> xxxxx
`;
const result = marked(source, (error, result) => {
    console.log(result);
});
// console.log(result);
