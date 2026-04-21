let capture;
let pg; // 宣告繪圖緩衝區
let bubbles = []; // 儲存泡泡資料的陣列
let saveBtn; // 宣告按鈕變數

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML 影片元件，只在畫布上繪製
  capture.hide();

  // 建立一個與視訊畫面（畫布 60%）一樣寬高的繪圖空間
  pg = createGraphics(windowWidth * 0.6, windowHeight * 0.6);
  initBubbles();

  // 建立按鈕並設定位置與點擊事件
  saveBtn = createButton('擷取視訊畫面');
  saveBtn.position(width / 2 - 50, height - 60);
  saveBtn.mousePressed(takeSnap);
}

class Bubble {
  constructor() {
    this.reset();
    this.y = random(pg.height); // 初始時隨機分布在畫面高度
  }

  reset() {
    this.x = random(pg.width);
    this.y = pg.height + random(20, 100);
    this.size = random(8, 25);
    this.speed = random(0.5, 2.5);
    this.wobble = random(1000); // 隨機相位
    this.wobbleSpeed = random(0.02, 0.05);
    this.wobbleAmp = random(1, 4); // 左右晃動的幅度
  }

  update() {
    this.y -= this.speed;
    this.wobble += this.wobbleSpeed;
    
    if (this.y < -this.size) {
      this.reset();
    }
  }

  display() {
    pg.push();
    // 加上 sin 波讓 x 座標晃動
    let displayX = this.x + sin(this.wobble) * this.wobbleAmp;
    pg.translate(displayX, this.y);
    
    // 繪製泡泡本體（細邊框與極淡的填充）
    pg.stroke(255, 180);
    pg.strokeWeight(1);
    pg.fill(255, 40);
    pg.ellipse(0, 0, this.size);
    
    // 繪製左上方的高光點，增加真實感
    pg.noStroke();
    pg.fill(255, 200);
    pg.ellipse(-this.size * 0.25, -this.size * 0.25, this.size * 0.2);
    pg.pop();
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

  for (let b of bubbles) {
    b.update();
    b.display();
  }
  
  // 修正攝影機左右顛倒問題
  push(); // 保存當前的繪圖狀態
  translate(width, 0); // 將座標原點移至畫布最右側
  scale(-1, 1); // 水平翻轉座標軸

  // --- 馬賽克黑白效果實作 ---
  if (capture.width > 0) {
    capture.loadPixels();
    let step = 20; // 每 20 像素採樣一次，形成 20x20 的馬賽克方塊
    noStroke();
    
    for (let y = 0; y < capture.height; y += step) {
      for (let x = 0; x < capture.width; x += step) {
        // 取得攝影機像素陣列中的索引位置
        let i = (y * capture.width + x) * 4;
        let r = capture.pixels[i];
        let g = capture.pixels[i + 1];
        let b = capture.pixels[i + 2];
        
        // 依照需求計算平均亮度，達成黑白效果
        let gray = (r + g + b) / 3;
        
        fill(gray);
        // 將攝影機的原始座標映射 (mapping) 到畫布中央 60% 的區域
        let dx = map(x, 0, capture.width, xPos, xPos + videoW);
        let dy = map(y, 0, capture.height, yPos, yPos + videoH);
        // 計算每個馬賽克方塊在畫布上的實際寬高
        let dw = map(step, 0, capture.width, 0, videoW);
        let dh = map(step, 0, capture.height, 0, videoH);
        
        rect(dx, dy, dw, dh);
      }
    }
  }
  // -------------------------
  
  // 將帶有泡泡效果的繪圖層疊加在視訊畫面之上
  image(pg, xPos, yPos, videoW, videoH);

  pop(); // 恢復繪圖狀態，避免影響到後續其他的繪圖指令
}

function initBubbles() {
  bubbles = [];
  for (let i = 0; i < 40; i++) {
    bubbles.push(new Bubble());
  }
}

function takeSnap() {
  // 計算與 draw 函式中相同的區域範圍
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let xPos = (width - videoW) / 2;
  let yPos = (height - videoH) / 2;

  // 使用 get() 取得畫布指定區域的圖像
  let img = get(xPos, yPos, videoW, videoH);
  
  // 儲存為 jpg 檔案
  img.save('my_snapshot', 'jpg');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重新調整按鈕位置
  saveBtn.position(width / 2 - 50, height - 60);
  // 視窗縮放時同時調整 pg 的大小
  pg = createGraphics(windowWidth * 0.6, windowHeight * 0.6);
  initBubbles();
}
