console.log("✅ Renderer script loaded!");

const dropZone = document.getElementById('drop-zone');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');

// 🔹 监听拖拽
dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('drag-over');

    const file = event.dataTransfer.files[0];

    if (file && file.path.endsWith('.csv')) {
        window.electronAPI.sendToMain('read-csv', file.path);
    } else {
        document.getElementById('file-output').textContent = '请拖入 CSV 文件！';
    }
});

// 🔹 监听点击上传
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        window.electronAPI.sendToMain('read-csv', fileInput.files[0].path);
    }
});

// 🔹 监听 CSV 读取结果
ipcRenderer.on('csv-data', (event, data) => {
    document.getElementById('file-output').textContent = data;
});
