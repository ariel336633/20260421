let capture;
let pg; // 宣告繪圖緩衝區
let bubbles = []; // 儲存泡泡資料的陣列

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML 影片元件，只在畫布上繪製
  capture.hide();

  // 建立一個與視訊畫面（畫布 60%）一樣寬高的繪圖空間
  pg = createGraphics(windowWidth * 0.6, windowHeight * 0.6);

  // 初始化一些泡泡
  for (let i = 0; i < 30; i++) {
    bubbles.push({
      x: random(pg.width),
      y: random(pg.height),
      size: random(10, 40),
      speed: random(1, 3)
    });
  }
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
  pg.noStroke();
  pg.fill(255, 255, 255, 100); // 半透明白色泡泡

  // 更新並繪製每一個泡泡
  for (let b of bubbles) {
    pg.ellipse(b.x, b.y, b.size);
    b.y -= b.speed; // 讓泡泡向上移動

    // 如果泡泡完全超出頂部，重新回到底部隨機位置
    if (b.y < -b.size) {
      b.y = pg.height + b.size;
      b.x = random(pg.width);
    }
  }
  
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
  
  // 重新調整泡泡的初始位置，避免超出新畫布
  bubbles = [];
  for (let i = 0; i < 30; i++) {
    bubbles.push({
      x: random(pg.width),
      y: random(pg.height),
      size: random(10, 40),
      speed: random(1, 3)
    });
  }
}
