let capture;
let pg; // 宣告繪圖緩衝區

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML 影片元件，只在畫布上繪製
  capture.hide();

  // 建立一個與視訊畫面（畫布 60%）一樣寬高的繪圖空間
  pg = createGraphics(windowWidth * 0.6, windowHeight * 0.6);
}

function draw() {
  background('#ade8f4');
  
  // 計算顯示影像的寬高 (整個畫布的 60%)
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let xPos = (width - videoW) / 2;
  let yPos = (height - videoH) / 2;

  // 在 pg (繪圖緩衝區) 上繪製內容
  pg.clear(); // 保持背景透明
  pg.fill(255, 255, 255, 150); // 半透明白色
  pg.noStroke();
  pg.rect(20, 20, 150, 50, 10); // 在左上角畫一個小方塊
  pg.fill(0);
  pg.textAlign(CENTER, CENTER);
  pg.text("Camera Overlay", 95, 45); // 在方塊內加入文字
  
  // 修正攝影機左右顛倒問題
  push(); // 保存當前的繪圖狀態
  translate(width, 0); // 將座標原點移至畫布最右側
  scale(-1, 1); // 水平翻轉座標軸

  // 繪製影像，由於座標軸已翻轉，計算出的位置會自動對應到正確的視覺位置
  image(capture, xPos, yPos, videoW, videoH);
  
  // 將 pg 繪製在視訊畫面的上方
  image(pg, xPos, yPos, videoW, videoH);

  pop(); // 恢復繪圖狀態，避免影響到後續其他的繪圖指令
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 視窗縮放時同時調整 pg 的大小
  pg = createGraphics(windowWidth * 0.6, windowHeight * 0.6);
}
