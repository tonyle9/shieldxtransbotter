var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
// Imports the Google Cloud client library
var { translate } = require("google-translate-api-browser");
// Instantiates a client

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('new-message', function (msg) {
        translate(msg.data, { from: 'en', to: 'vi' }).then(res => {
            io.emit('new-message',msg);
            io.emit('new-message', {
                data: res.text,
                from: "bot",
                id: socket.id
            });
        }).catch(err => {
            console.error(err);
        });
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});
