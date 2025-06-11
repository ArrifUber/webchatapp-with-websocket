import { openImageModal } from "./main.js";
import { getFileNameFromUrl } from "./main.js";

export function appendMessage({ message, sender, timeStamp, fileInfo = undefined }) {
    console.log("Append message ------->", message, timeStamp, sender, fileInfo);

    const chatBody = document.getElementById("chatBody");
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("chat-container");

    const spanSenderTime = document.createElement("span");
    spanSenderTime.classList.add("send-time");

    const messageT = document.createElement("p");
    messageT.classList.add("chat-message");
    messageT.innerHTML = message;

    const senderT = document.createElement("h3");
    senderT.classList.add("chat-sender");
    senderT.innerHTML = sender;

    const timeStampT = document.createElement("time");
    timeStampT.classList.add("chat-time");
    timeStampT.innerHTML = timeStamp;

    spanSenderTime.appendChild(senderT);
    spanSenderTime.appendChild(timeStampT);
    messageContainer.appendChild(spanSenderTime);
    messageContainer.appendChild(messageT);
    //handler file
    if (fileInfo !== undefined && fileInfo !== "") {
        console.log(fileInfo !== undefined)
        console.log(fileInfo !== "")
        let fileContainer = ""
        if (fileInfo.fileType.startsWith("image/")) {
            fileContainer = document.createElement("section");
            fileContainer.classList.add("image-container");

            const image = document.createElement("img");
            image.classList.add("chat-image")
            image.src = fileInfo.fileUrl;
            image.setAttribute("alt", "./img/icons/file-svgrepo-com.svg")
            fileContainer.appendChild(image);
            messageContainer.appendChild(fileContainer)
        } else if (fileInfo.fileType.startsWith("video/")) {
            fileContainer = document.createElement("video")
            fileContainer.classList.add("video-container")
            fileContainer.setAttribute("controls", "")

            let video = document.createElement("source")
            video.src = fileInfo.fileUrl
            fileContainer.appendChild(video)
            messageContainer.appendChild(fileContainer)
        } else if (fileInfo.fileType.startsWith("audio/")) {
            fileContainer = document.createElement("audio")
            fileContainer.setAttribute("controls", "")
            fileContainer.classList.add("audio-container")

            let src = document.createElement("source")
            src.setAttribute("src", fileInfo.fileUrl)
            fileContainer.appendChild(src)
            messageContainer.appendChild(fileContainer)
        } else {
            let nameFile = getFileNameFromUrl(fileInfo.fileUrl)
            fileContainer = document.createElement("section")
            fileContainer.classList.add("file-container")

            let divItem = document.createElement("div")
            divItem.classList.add("file-item")


            let svgImg = document.createElement("img")
            svgImg.src = "./img/icons/file-svgrepo-com.svg"


            let divInfo = document.createElement('div')
            divInfo.classList.add("file-info")


            let link = document.createElement("a")
            link.classList.add("file-name")
            link.target = "_blank"
            link.href = fileInfo.fileUrl
            link.innerText = nameFile

            let fileSize = document.createElement("p")
            fileSize.classList.add("file-size")
            fileSize.innerText = fileInfo.fileSize

            divInfo.appendChild(link)
            divInfo.appendChild(fileSize)

            divItem.appendChild(svgImg)
            divItem.appendChild(divInfo)

            fileContainer.appendChild(divItem)
            messageContainer.appendChild(fileContainer)
        }
    }
    chatBody.appendChild(messageContainer);
    chatBody.scrollTop = chatBody.scrollHeight;
    document.querySelectorAll(".chat-image").forEach((img) => {
        img.addEventListener("click", () => {
            openImageModal(img.src);
        });
    });
}