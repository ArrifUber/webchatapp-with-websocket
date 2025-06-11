import { formatBytes } from "./main.js"

export const handlerFileSubmit = async function (files) {
    const file = files;
    console.log(file)
    if (!file) return;
    const fileSize = formatBytes(file.size)
    console.log(file, fileSize);

    const res = await fetch(
        "https://zdo8t2goxl.execute-api.us-east-1.amazonaws.com/dev/image",
        {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: file.name, fileType: file.type, fileSize: fileSize }),
        }
    );

    const url = await res.json();
    console.log(url);

    await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
    });
    const fileUrl = url.split("?")[0];
    const result = { fileUrl: fileUrl, fileType: file.type, fileName: file.name, fileSize: fileSize };
    return result;
};