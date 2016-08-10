/// <reference path="../../typings/index.d.ts" />
$(function () {
    // 取消浏览器默认事件

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
        })
    });


});