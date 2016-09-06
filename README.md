# Flask-node

> similar to python Flask web-framework

## Quick start 

we will create image upload page as demo

### Project directory

```
│
├─tmp
├─asset
├──────img
│
│      style.css
│
├─templates
│      index.htm
│      view.html
│
└─app.js
```

### Install `flask-node`

`npm install flask-node --save`

### Create `app.js`

```javascript
const Flask = require("flask-node").Flask;
const Router = require('flask-node').Router;

let app = new Flask(__dirname);
let mainRoute = new Router();    // similar to flask @route

mainRoute.add("/", function index(req, res) {
    res.str('Hello world');
});

app.run();
```

1. The first argument is the name of the application’s, you should use `__dirname` because depending on if it’s started as application.
2. We then use the `app.createRouter` create `mainRoute`, and we can use `mainRoute.add(path, [method], callback)` to tell Flask-node what URL should trigger our function.
3. `app.run()` can start the application’s. Now head over to [http://127.0.0.1:5050](http://127.0.0.1:5050), and you should see your hello world greeting.

### Add `templates`, create `templates/index.html`

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>upload demo</title>
    <link rel="stylesheet" href="{{ 'style.css'|static }}">
    <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">
</head>

<body>
    <div class="container">
        <div class="panel panel-default uploadarea">
            <div class="panel-heading">
                <h2>upload demo</h2>
            </div>
            <div class="panel-body">
                <form action="/upload" enctype="multipart/form-data" method="post">
                    <label for="img">选择图片文件</label><input id="img" type="file" name="img">
                    <br>
                    <button type="submit" class="btn btn-default" id="btn-upload">upload</button>
                </form>
            </div>
        </div>
    </div>
    <script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
</body>

</html>
```

1. `flask-node` use [`swig`](https://github.com/paularmstrong/swig/) as template engine, it like to `jijia2`
2. `{{ 'style.css'|static }}` the `static` filter can give true path to static files, it  depending on your app's `__dirname`

### Create `static/style.css`

```css
/* style.css */
body {
    font-family: "microsoft yahei", "Times New Roman", Times, serif;
}
```

### Update `app.js`

```javascript

mainRoute.add("/", function index(req, res) {
    res.render('index.html');
});

mainRoute.add("/view", function view(req, res) {
    res.render('view.html');
})
```

Now head over to [http://127.0.0.1:5050](http://127.0.0.1:5050), and you should see `index.html`

### Add `/upload` function and `template/view.html`

```javascript
// app.js
mainRoute.add("/upload", ["POST"], function (req, res) {
    let _uploadFile = req.form.files.img;
    let _extname = _uploadFile.name.split(".")[1];
    let _tmpPath = _uploadFile.path;
    let _movePath = path.join(__dirname, 'asset/img', 'upload.' + _extname);
    fs.exists(_movePath, function (exists) {
        if (exists) {
            fs.unlink(_movePath, function () {
                fs.rename(_tmpPath, _movePath, function (err) {
                    if (err) {
                        console.log(err);
                        res.abort(500);
                    } else {
                        res.redirect('/view');
                    }
                })
            })
        } else {
            fs.rename(_tmpPath, _movePath, function (err) {
                if (err) {
                    console.log(err);
                    res.abort(500);
                } else {
                    res.redirect('/view');
                }
            })
        }
    })
});
```

```html
// view.html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>view upload image</title>
    <link rel="stylesheet" href="{{ 'style.css'|static }}">
    <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">
</head>

<body>
    <div class="container">
        <div class="panel panel-default uploadarea">
            <div class="panel-heading">
                <h2>view upload image</h2>
            </div>
            <div class="panel-body">
                <img src="{{ 'img/upload.jpg'|static }}" alt="">
            </div>
        </div>
    </div>
    <script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
</body>

</html>
```

`node app.js`, you can  see the demo on [http://127.0.0.1:5050](http://127.0.0.1:5050)

And you can loot at the demo in `demo` directory.

## Todo list

- [ ] fix bugs
- [ ] add `url_for` function

>I'm a Chinese university student, and I am very poor in English. So you think it's awkward when you look at it. I'm so sorry