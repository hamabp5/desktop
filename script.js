const URL = 'https://teachablemachine.withgoogle.com/models/uxWdmo58S/'; // Teachable MachineからコピーしたモデルURLを貼り付け

let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    // モデルとメタデータをロード
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // ウェブカメラをセットアップ
    const flip = true;
    webcam = new tmImage.Webcam(640, 480, flip);
    await webcam.setup();
    await webcam.play();
    document.getElementById('webcam').appendChild(webcam.canvas);

    window.requestAnimationFrame(loop);

    document.getElementById('check').addEventListener('click', predict);
    labelContainer = document.getElementById('result');
}

async function loop() {
    webcam.update();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    let highestProb = 0;
    let label = '';
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            label = prediction[i].className;
        }
    }

    labelContainer.innerHTML = `結果: ${label} (${(highestProb * 100).toFixed(2)}%)`;
}

// ウェブカメラの起動を確実にするために、ページが読み込まれた後にinit関数を呼び出す
window.addEventListener('load', init);
