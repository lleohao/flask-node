const Flask = require('../../lib');

const app = new Flask(__dirname);
const mainRouter = app.createRouter();
const render = app.createRender();

mainRouter.add('/', (req, res) => {


    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(render('index.html', {
        message: 'hello world'
    }))
})

app.run({debug: true});
