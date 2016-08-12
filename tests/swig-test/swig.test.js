const swig = require("swig");

let template = swig.compileFile(__dirname + "/templates/index.html");
let output = template({
    pagename: 'awesome people',
    authors: ['Paul', 'Jim', 'Jane']
});
