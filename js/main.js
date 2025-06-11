import { handlerFileSubmit } from "./handlerFile.js";
import { socket } from "./socket.js";

socket;

// Saat halaman dimuat
window.onload = function () {
    // get Random Color


    const savedName = localStorage.getItem("chatUsername");
    console.log(savedName);
    if (!savedName) {
        document.getElementById("nameModal").style.display = "block";
        return;
    } else {
        const changeNameSection = document.getElementById("changeNameSection");

        let name = document.createElement("p");
        name.setAttribute("id", "user-name");
        name.innerText = savedName;

        changeNameSection.appendChild(name);

        document.getElementById("changeUserName").addEventListener("click", () => {
            document.getElementById("changeNameModal").style.display = "block";
        });

        return;
    }
};

document.getElementById("changeSaveBtn").addEventListener("click", () => {
    const input = document.getElementById("changeUsernameInput").value.trim();
    if (input) {
        let name = escapeHtml(input);
        localStorage.setItem("chatUsername", name);
        document.getElementById("changeNameModal").style.display = "none";

        let nameUser = document.getElementById("user-name");
        nameUser.innerText = name;

        return;
    }
});

document.getElementById("saveBtn").addEventListener("click", saveName);
function saveName() {
    const input = document.getElementById("usernameInput").value.trim();
    if (input) {
        let name = escapeHtml(input);
        localStorage.setItem("chatUsername", name);
        document.getElementById("nameModal").style.display = "none";

        const chatHeader = document.getElementById("chatHeader");
        let nameUser = document.getElementById("user-name");
        console.log("---->", nameUser);

        const changeNameSection = document.getElementById("changeNameSection");

        if (nameUser === undefined || nameUser === null) {
            let nameOfUser = document.createElement("p");
            nameOfUser.setAttribute("id", "user-name");
            nameOfUser.innerText = name

            changeNameSection.appendChild(nameOfUser);
        } else {
            console.log(name);
            nameUser.innerText = name;
        }
        return;
    }
}

// Fungsi buka modal
export function openImageModal(imageUrl) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    modalImg.src = imageUrl;
    modal.style.display = "flex";
}

// Tutup modal kalau klik area luar gambar
document.getElementById("imageModal").addEventListener("click", (e) => {
    if (e.target.id === "imageModal") {
        e.target.style.display = "none";
    }
});

document.querySelectorAll(".chat-image").forEach((img) => {
    img.addEventListener("click", () => {
        openImageModal(img.src);
    });
});

// file
const fileInput = document.getElementById("fileInput");
const filePreview = document.getElementById("filePreview");
const fileName = document.getElementById("fileName");
const cancelUpload = document.getElementById("cancelUpload");
let fileToUpload = "";

fileInput.addEventListener("change", () => {
    let maxFileSize = 100 * 1024 * 1024
    if (fileInput.files[0].size > maxFileSize) return alert("filenya kegedean oy (maksimal 100MB)")

    fileToUpload = fileInput.files[0];
    if (fileToUpload) {
        filePreview.classList.remove("hidden");
        fileName.textContent = fileToUpload.name;
    }
});

cancelUpload.addEventListener("click", () => {
    fileInput.value = "";
    filePreview.classList.add("hidden");
    fileName.textContent = "";
    fileToUpload = "";
});

const formChat = document.getElementById("inputForm");

// handle form
formChat.addEventListener("submit", async (e) => {
    e.preventDefault();
    let file = fileToUpload
    console.log(file);

    const userName = localStorage.getItem("chatUsername") || "";
    if (userName === "") {
        return (document.getElementById("nameModal").style.display = "block");
    }

    //message
    const messageInput = document.getElementById("messageInput").value.trim();
    console.log(messageInput, userName);

    if (messageInput === "") return alert("gak boleh kosong uy");

    let timeStamp = new Date();
    let hour = timeStamp.getHours().toString();
    let minute = timeStamp.getMinutes().toString();
    if (minute < 10) minute = `0${minute}`;
    let actualTimeStamp = `${hour}:${minute}`;

    //file
    const fileInfo = await handlerFileSubmit(fileToUpload);
    console.log(fileInfo);
    let datas = {};
    if (fileInfo) {
        datas = {
            message: messageInput,
            sender: userName,
            timeStamp: actualTimeStamp,
            fileInfo: fileInfo,
        };
    } else {
        datas = {
            message: messageInput,
            sender: userName,
            timeStamp: actualTimeStamp,
        };
    }
    formChat.reset();
    filePreview.classList.add("hidden");
    fileName.textContent = "";
    fileToUpload = "";
    console.log(datas);
    if (messageInput !== "") {
        socket.send(JSON.stringify({ message: datas, action: "sendmessage" }));
    }
});

// escape html
export function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function getFileNameFromUrl(url) {
    const pathParts = url.split("?");
    const fullPath = pathParts[0];
    let a = fullPath.substring(fullPath.lastIndexOf("/") + 1);

    let result = a.replace(/%20/g, " ");
    return result;
}
