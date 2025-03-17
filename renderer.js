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
    if (file) {
        console.log("Dropped File:", file);
        if (file.name.endsWith('.csv')) {
            window.electronAPI.processCSV(file.path);
        } else {
            fileOutput.textContent = 'Only Support CSV!';
        }
    }
});

// 🔹 监听点击上传
uploadBtn.addEventListener('click', async () => {
    const fileName = await window.electronAPI.openFileDialog();
});

// 🔹 监听 CSV 读取结果
window.electronAPI.receiveFromMain('csv-data', (data) => {
    console.log("Success to read CSV");
    // document.getElementById('file-output').textContent = data;
});
