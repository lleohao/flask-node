const Flask = require('../../lib').Flask;
const Router = require('../../lib').Router;

let app = new Flask(__dirname);
let mainRoute = new Router();

mainRoute.add("/", function index(req, res) {
    res.str('Hello world');
});

app.run();