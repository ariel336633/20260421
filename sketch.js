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
  
  // 修正攝影機左右顛倒問題
  push(); // 保存當前的繪圖狀態
  translate(width, 0); // 將座標原點移至畫布最右側
  scale(-1, 1); // 水平翻轉座標軸
  // 繪製影像，由於座標軸已翻轉，計算出的位置會自動對應到正確的視覺位置
  image(capture, (width - videoW) / 2, (height - videoH) / 2, videoW, videoH);
  pop(); // 恢復繪圖狀態，避免影響到後續其他的繪圖指令
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
