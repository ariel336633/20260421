let capture;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML 影片元件，只在畫布上繪製
  capture.hide();
}

function draw() {
  background('#ade8f4');
  
  // 計算顯示影像的寬高 (整個畫布的 60%)
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  
  // 將影像繪製在畫布正中間
  image(capture, (width - videoW) / 2, (height - videoH) / 2, videoW, videoH);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
