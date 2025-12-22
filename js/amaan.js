class AmaanPlayer {
    static getInstance(iframe) {
        return new AmaanPlayer(iframe);
    }

    constructor(iframe) {
        this.iframe = iframe;
        this.listeners = {};
        this.isReady = false;

        this._init();
    }

    /* ================= INIT ================= */
    _init() {
        const handler = (event) => {
            if (event.data?.event === "init") {
                this.isReady = true;
                window.removeEventListener("message", handler);
            }
        };

        window.addEventListener("message", handler);

        this.iframe.contentWindow.postMessage({
            api: "init",
            version: 2
        }, "*");
    }

    /* ============== EVENTS ================== */
    addEventListener(eventName, callback) {
        const handler = (msg) => {
            console.log(msg.data);
            
            if (!msg.data) return;

            if (msg.data.event === "fragment") return;

            if (msg.data.event === eventName) {
                callback(msg.data);
            }
        };

        window.addEventListener("message", handler);

        if (!this.listeners[eventName]) this.listeners[eventName] = [];
        this.listeners[eventName].push({
            original: callback,
            handler
        });
    }

    removeEventListener(eventName, callback) {
        if (!this.listeners[eventName]) return;

        const index = this.listeners[eventName]
            .findIndex(l => l.original === callback);

        if (index !== -1) {
            const {
                handler
            } = this.listeners[eventName][index];
            window.removeEventListener("message", handler);
            this.listeners[eventName].splice(index, 1);
        }
    }

    /* ============== CONTROLS ================= */
    _post(message) {
        if (!this.isReady) return;
        this.iframe.contentWindow.postMessage(message, "*");
    }

    play() {
        this._post({
            api: "play"
        });
    }

    pause() {
        this._post({
            api: "pause"
        });
    }

    mute() {
        this._post({
            api: "mute"
        });
    }

    unmute() {
        this._post({
            api: "unmute"
        });
    }

    time(){
        this._post({
            api: "time"
        });
    }

    setTime(seconds) {
        this._post({
            api: "seek",
            set: seconds
        });
    }



    /* ============== DURATION ================= */
    getDuration() {
        return new Promise((resolve) => {
            const handler = (event) => {
                if (event.data?.event === "duration") {
                    resolve(event.data.answer);
                    window.removeEventListener("message", handler);
                }
            };

            window.addEventListener("message", handler);
            this._post({ api: "duration" });
        });
    }




    /* ============== METADATA ================= */
    getMetadata() {
        return new Promise((resolve) => {
            const handler = (event) => {
                if (event.data?.event === "metadata") {
                    resolve(event.data.answer);
                    window.removeEventListener("message", handler);
                }
            };

            window.addEventListener("message", handler);
            this._post({
                api: "metadata"
            });
        });
    }




}