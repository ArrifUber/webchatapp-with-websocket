import { appendMessage } from "./appendMessage.js";
import { escapeHtml } from "./main.js";

export const socket = new WebSocket(
    "wss://y5miatuowd.execute-api.us-east-1.amazonaws.com/production/"
);


socket.addEventListener("open", function (event) {
    let message = "Connected to websocket";
    let sender = "System";
    let timeStamp = new Date();
    let hour = timeStamp.getHours().toString();
    let minute = timeStamp.getMinutes().toString();
    if (minute < 10) minute = `0${minute}`;
    let actualTimeStamp = `${hour}:${minute}`;
    const datas = {
        message,
        sender,
        timeStamp: actualTimeStamp,
    };
    console.log(datas);
    appendMessage(datas);
});


socket.addEventListener("message", function (event) {
    const receivedData = JSON.parse(event.data).message;
    console.log(receivedData);
    const datas = {
        message: escapeHtml(receivedData.message),
        sender: escapeHtml(receivedData.sender),
        timeStamp: receivedData.timeStamp,
        fileInfo: receivedData.fileInfo ? receivedData.fileInfo : "",
    };
    console.log("data ----->", datas);
    appendMessage(datas);
});

socket.addEventListener("close", function () {
    let message = "Websocket is close, please refresh page";
    let sender = "System";
    let timeStamp = new Date();
    let hour = timeStamp.getHours().toString();
    let minute = timeStamp.getMinutes().toString();
    if (minute < 10) minute = `0${minute}`;
    let actualTimeStamp = `${hour}:${minute}`;
    const datas = {
        message,
        sender,
        timeStamp: actualTimeStamp,
    };
    console.log(datas);
    appendMessage(datas);
})