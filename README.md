# Flask-node

> similar to python Flask web-framework

## Quick start 

we will create image upload page as demo

### Project directory

```
│
├─tmp
├─static
├──────img
│
│      custom.js
│      style.css
│
├─templates
│      index.htm
│      view.html
│
└─app.js
```

### Install `flask-node`

`npm install flask-node --save-dev`

### Create `app.js`

```javascript
const Flask = require("flask-node");

let app = new Flask(__dirname);
let mainRoute = app.createRouter();		// similar to flask @app.route


mainRoute.add("/", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end("<h1>Hello flask-node</h1>");
});

app.run();
```

1. The first argument is the name of the application’s, you should use `__dirname` because depending on if it’s started as application.
2. We then use the `app.createRouter` create `mainRoute`, and we can use `mainRoute.add(path, [method], callback)` to tell Flask-node what URL should trigger our function.
3. `app.run()` can start the application’s. Now head over to [http://127.0.0.1:5000/](http://127.0.0.1:5000/), and you should see your hello world greeting.

### Add `templates`, create `templates/index.html`

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>drag upload demo</title>
    <link rel="stylesheet" href="{{ 'style.css'|static }}">
    <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">
</head>

<body>
    <div class="container">
        <div class="panel panel-default uploadarea">
            <div class="panel-heading">
                <h2>drag upload demo</h2>
            </div>
            <div class="panel-body">
                <div id="upload">
                    <p>please drag imgage file in the area</p>
                </div>
            </div>
            <div class="panel-footer">
                <div class="preview" style="display: none;">
                    <p>filsname:<span id="filename"></span></p>
                    <p>filesize:<span id="filesize"></span></p>
                    <p>lastModify:<span id="filemodify"></span></p>
                </div>
                <button type="submit" class="btn btn-default" id="btn-upload">upload</button>
            </div>
        </div>
    </div>
    <script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
    <script src="{{ 'custom.js'|static }}"></script>
</body>

</html>
```

1. `flask-node` use [`swig`](https://github.com/paularmstrong/swig/) as template engine, it like to `jijia2`
2. `{{ 'custom.js'|static }}` the `static` filter can give true path to static files, it  depending on your app's `__dirname`

### Create `static/custom.js` and `static/style.css`

```javascript
// custom.js
$(function () {
    $(document).on({
        dragleave: function (e) {
            e.preventDefault();
        },
        drop: function (e) {
            e.preventDefault();
        },
        dragenter: function (e) {
            e.preventDefault();
        },
        dragover: function (e) {
            e.preventDefault();
        }
    });

    var uploadArea = document.getElementById("upload");
    uploadArea.addEventListener("dragenter", function (e) {
        var types = e.dataTransfer.types;
        if (!types ||
            (types.contains && types.contains("Files")) ||
            (types.indexOf && types.indexOf("Files") != -1)) {
            $(uploadArea).addClass("active");
            e.preventDefault();
        }
    })

    uploadArea.addEventListener("dragleave", function (e) {
        $(uploadArea).removeClass("active");
    })

    uploadArea.addEventListener("dragover", function (e) {
        e.preventDefault();
    })

    uploadArea.addEventListener("drop", function (e) {
        e.preventDefault();
        var fileList = e.dataTransfer.files;

        $(".preview").show();
        $("#filename").text(fileList[0].name);
        $("#filesize").text((fileList[0].size / 1024).toFixed(2) + "kb");
        $("#filemodify").text(fileList[0].lastModifiedDate);

        if (fileList[0].name.match(/\.jpg|\.jpeg|\.png|\.bmp/)) {
            var imgUrl = window.URL.createObjectURL(fileList[0]);
            var img = document.createElement("img");
            img.src = imgUrl;
            $(".preview").append(img);
        }

        $("#btn-upload").on("click", function () {
            var req = new XMLHttpRequest();
            req.open("post", "./upload");
            req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            var fd = new FormData();
            fd.append("uploadFile", fileList[0]);
            
            req.send(fd);
            req.onreadystatechange = function() {
                if (req.readyState == 4 &&  req.status == 200) {
                    window.location = "./view";
                }
            }
        })
    });


});
```

```css
/* style.css */
body {
    font-family: "microsoft yahei", "Times New Roman", Times, serif;
}

.uploadarea {
    margin-top: 30px;
}

#upload {
    height: 300px;
    border: 2px #ccc dotted;
    text-align: center;
}
#upload p {
    line-height: 300px;
    -webkit-user-select: none;
    user-select: none;
    color: #888;
    cursor: default;
}

#upload.active {
    box-shadow: 4px 5px 8px #ccc, -4px -5px 8px #ccc;
}
```

### Update `app.js`

```javascript
let render = app.createRender(); // similar to flask render_template

mainRoute.add("/", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(render('index.html'));
});
```

Now head over to [http://127.0.0.1:5000/](http://127.0.0.1:5000/), and you should see `index.html`

### Add `/upload` function and `template/view.html`

```javascript
// app.js
mainRoute.add("/view", function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(render('view.html'));
})

mainRoute.add("/upload", ["POST"], function (req, res) {
    let _uploadFile = req.form.files.uploadFile;
    let _extname = _uploadFile.name.split(".")[1];
    let _tmpPath = _uploadFile.path;
    fs.rename(_tmpPath, path.join(__dirname, 'static/img', 'upload.' + _extname), (err) => {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(err);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("true");
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

`node app.js`, you can  see the demo on [http://127.0.0.1:5000](http://127.0.0.1:5000)

And you can loot at the demo in `demo` directory.

## Todo list

- [ ] Optimal response
- [ ] fix bugs
- [ ] add `url_for` function
- [ ] add more `render` function

- [ ] add error event handling

>I'm a Chinese university student, and I am very poor in English. So you think it's awkward when you look at it. I'm so sorry