# 台灣 OffSec 證照觀測

每日統計 OffSec 全球排行榜中，國家標記為台灣（`TW`）的帳號與其公開證照資料，並以 GitHub Pages 呈現最新持有人數、Badge 圖片及歷史趨勢。

## GitHub Repository Description

> 每日追蹤 OffSec 全球排行榜中台灣帳號的公開證照數量，保存歷史快照並以 GitHub Pages 呈現趨勢。

## 功能

- 每天抓取台灣累計排行榜資料，統計各證照列出的帳號數。
- 顯示 OffSec 台灣帳號總數、至少擁有一張證照的帳號數、證照種類及持有人數趨勢。
- 列出所有公開證照的 Badge 圖片與持有人數。
- 使用台北時區記錄每日快照；同一天重跑會更新當日資料，不會新增重複日期。
- 保留 Git 歷史，不需要資料庫或 API 金鑰。

## 資料保存方式

`data/snapshots.json` 是歷史資料來源。每筆快照包含日期、排行榜帳號總數、至少擁有一張證照的帳號數、各證照持有人數、OffSec Badge 圖片網址，以及資料來源。每日 GitHub Actions 工作流程更新 JSON 並提交到 repository；GitHub Pages 隨後重新部署網站，將最新快照一併發布。

第一次執行會建立第一筆快照。本專案已在 **2026-09-29（台北時間）** 建立起始快照；之後每次成功執行會累積一個新的日期，形成趨勢資料。

## 建立 GitHub Pages

1. 在 GitHub 建立新的 repository，將本專案推送到 `main` 分支。
2. 開啟 repository 的 **Settings → Pages**，將 **Build and deployment** 的來源設為 **GitHub Actions**。
3. 確認 repository 的 Actions 有權限提交內容：進入 **Settings → Actions → General → Workflow permissions**，選擇 **Read and write permissions**。
4. 推送到 `main` 後，`Deploy to GitHub Pages` 工作流程會發布網站。每日資料更新成功後也會觸發重新部署。

網站網址通常是 `https://<GitHub 帳號>.github.io/<repository 名稱>/`。在 **Settings → Pages** 可查看實際網址。

## 每日更新

`.github/workflows/daily-update.yml` 設定於每天 **08:20（Asia/Taipei）** 執行，也可以從 repository 的 **Actions** 頁面手動執行。更新流程會：

1. 從 OffSec Portal 取得台灣累計排行榜。
2. 為每個帳號的每種證照最多計一次，彙總持有人數。
3. 更新 `data/snapshots.json` 中今天的快照並提交變更。
4. 成功完成後觸發 GitHub Pages 重新部署。

若 API 回傳 `hasNext: true`，表示 `limit=1000` 可能未涵蓋全部資料；更新程式會停止，不會把不完整結果寫成快照。

## 本機更新

```sh
python3 scripts/update_data.py
```

## 統計範圍與限制

- 資料來自 OffSec Portal 公開的全球排行榜 API，篩選 `countryCode=TW` 和 `timeFilter=ALL_TIME`。
- 統計的是排行榜帳號 `credentials` 欄位中列出的證照，不等同 OffSec 官方完整持證人數。
- 一個帳號可以列出多張證照，因此各證照人數加總會高於持有至少一張證照的帳號數。
- 排行榜成員、國家設定或 API 欄位改變，都可能造成每日數字變動。
- 此 API 未公開文件，若 API 格式改變，更新工作流程可能需要調整。

## 專案檔案

```text
.
├── .github/workflows/
│   ├── daily-update.yml   # 每日抓取與提交快照
│   └── pages.yml          # GitHub Pages 部署
├── data/snapshots.json    # 每日歷史資料
├── scripts/update_data.py # API 擷取與統計
├── app.js                 # 儀表板呈現與趨勢圖
├── index.html             # 網站頁面
└── style.css              # 網站樣式
```
