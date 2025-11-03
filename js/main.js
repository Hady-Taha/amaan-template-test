$(function () {
    var player = new Playerjs({
        id: "player",
        file: "https://easy.easy-stream.net/uploads/b4414128-9c0a-4511-b427-40751cd48806/drm/manifest.mpd",
        dashdrmjson: {
            "com.widevine.alpha": {
                "serverURL": "https://stream.easy-tech.ai/video/license/",
                "httpRequestHeaders": {
                    "Auth": "wwwwww"
                }
            }
        }
    });
});