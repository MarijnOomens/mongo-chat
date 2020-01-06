const mongo = require("mongodb").MongoClient;
const client = require("socket.io").listen(4000).sockets;

// Connect to MongoDB
mongo
  .connect('mongodb://127.0.0.1/mongochat', {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(function(){ console.log("DB Connected!")
    // Connect to socket.io
    client.on('connection', function(socket){
        let chat = db.collection('chats');

        // Send status
        sendStatus = function(s) {
            socket.emit('status', s);
        }

        // Get db chats
        chat.find().limit(42).sort({_id:1}).toArray(function(){
            if (err) {
                throw err;
            }

            // Emit messages
            socket.emit('output', res);
        });

        // Input events
        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;

            if (name == '' || message == '') {
                sendStatus('Please enter a name and a message');
            } else {
                chat.insert({name: name, message: message}, function(){
                    client.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

        // Clear
        socket.on('clear', function(data){
            chat.remove({}, function(){
                socket.emit('cleared');
            });
        });
    });
})
  .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
  });
