var socket = new WebSocket('ws://127.0.0.1:9501');

socket.onopen = function () {
    console.log("User connected");
};

function getRandomNumber() {
    return Math.floor(Math.random() * 100);
}

let Name = "anonymous" + getRandomNumber();

function sendMessage() {
    let messageElem = document.getElementById("message");
    let textMessage = messageElem.value;

    var msg = {
        type: "message",
        text: textMessage,
        sender: Name,
        date: Date.now()
    };

    socket.send(JSON.stringify(msg));

    messageElem.value = "";

    messageParse(Name, msg.date, textMessage);
}

socket.onmessage = function (event) {
    let data = JSON.parse(event.data);
    messageParse(data.sender, data.date, data.text);
}

function messageParse(sender, timestamp, msg) {
    let html = "";
    let timeString = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sender !== Name) {
        html = `<li class="message left appeared">
            <div class="avatar"></div>
            <div class="text_wrapper">
                <div class="sender_info">${sender}</div>
                <div class="text">${msg}</div>
                <div class="timestamp_info">${timeString}</div>
            </div></li>`;
    } else {
        html = `<li class="message right appeared">
            <div class="avatar"></div>
            <div class="text_wrapper">
                <div class="sender_info">${sender}</div>
                <div class="text">${msg}</div>
                <div class="timestamp_info">${timeString}</div>
            </div></li>`;
    }

    document.getElementById("messageBox").innerHTML += html;
}