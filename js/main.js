var socket = new WebSocket('ws://127.0.0.1:9501');

socket.onopen = function(){
    console.log("User connected");
}

setCookie = (cname, cvalue, exdays) => {
    let d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};  

getCookie = cname => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
};

let Name = getCookie("name");

if (!Name) {
    let timestamp = new Date().getTime();
    Name = "anonymous" + timestamp;
    setCookie("name", "anonymous" + timestamp, 60);
}

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

    messageParse(Name, textMessage);
;}

socket.onmessage = function(event){
    let data = JSON.parse(event.data);
    messageParse(data.sender, data.text);
}

function messageParse(sender, msg) {
    let html = "";
    if (sender !== Name) {
      html = `<li class="message left appeared">
          <div class="avatar"></div>
          <div class="text_wrapper">
          <div class="text">${msg}</div>
        </div></li>`;
    } else {
      html = `<li class="message right appeared">
          <div class="avatar"></div>
          <div class="text_wrapper">
          <div class="text">${msg}</div>
        </div></li>`;
    }
  
    document.getElementById("messageBox").innerHTML += html;
}