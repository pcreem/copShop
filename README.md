![image alt](https://github.com/pcreem/copShop/blob/master/upload/logo.png?raw=true)



## Overview
這是 Alpha Camp 全端 Web App 開發課程的學生小組畢業專案。<br>
我們選擇的主題為「網路電商」，歷時 4-6 weeks 進行開發製作。

偏鄉農民對於網路使用不熟悉,導致農產曝光(銷售)困難，以手機為主體, line介面為參考的農產銷售介面(電商), 農民可使用line上傳圖文,再由後台管理人員修改商品/訂單相關資訊

核心開發目標：
1. 商品陳列、搜尋篩選
2. 購物車、信用卡支付系統
3. 後台商品管理
4. Linebot 簡易上傳商品功能
<br>


## Deploy
此專案佈署於 heroku 平台。您可以直接前往，開始瀏覽。<br>
[線上網站](https://farmer-shop3.herokuapp.com/) <br>


## 相關文件

[開發過程文件](https://docs.google.com/document/d/1nLcnblhoqDkEdIREnPdc6Gkjo5wMHipfl-tmWUUMdI4/edit?usp=sharing) <br>
[畢業專案提交文件](https://hackmd.io/@ksS_La_-RRmaNMN-0fBH3g/Sy8qntGML) <br>

## 主要技術

|  | 後端 | 前端 |
| -------- | -------- | -------- |
| 核心語言   | Node.js     | JavaScrip |
| 框架 | Express.js | Bootstrap  |
| 模板引擎 | Handlebars | |
| 資料庫 | MySQL | Sequelize |
| 第三方 | LineBot | |

- 此 App 的核心體系為 Node.js + Express.js，以 Node npm 來管理套件。
- 單元測試部分，並沒有實作
- 。
- 其他依賴套件請參考專案 [package.json](https://github.com/pcreem/copShop/blob/master/package.json)

## Installation & 本機端啟動
如欲在本地端啟動，必須先安裝 [Node.js](https://nodejs.org/en/) 與 [MySQL](https://dev.mysql.com/downloads/mysql/)。<br>
推薦使用 [nvm](https://github.com/coreybutler/nvm-windows) 來安裝指定版本的 Node.js。
- Node.js v10.16.3
- MySQL v8.0.17

#### 下載專案
請先從 Github clone 本專案:
```
$ git clone https://github.com/pcreem/copShop.git
```

並安裝依賴套件 `$ npm install`

#### 設置 .env file
請參考專案檔案 [.env.example](https://github.com/pcreem/copShop/blob/master/.env_example)。
- DB config： MySQL 資料庫個人帳密等訊息
- IMGUR_CLIENT_ID： 專案圖床，請輸入個人註冊的 Imgur App ID
- GMAIL_ACCOUNT： 請輸入個人可使用的 Gamil 帳戶，做為通知信發送用
- newebpay： 藍新金流，測試環境 API 之帳戶資訊

※ 藍新金流 API，不支持 localhost 串接。請使用 [ngrok](https://ngrok.com/) 虛擬出一個網域。並將該網域填入 env 的 URL 條目。

#### 初始化資料庫
安裝資料庫 ORM sequelize，可選擇安裝在 global 或 local:
```
$ npm install [-g] sequelize
```

於 MySQL 建立 database:
```
# SQL
CREATE DATABASE `database_name`;
```

運行 sequelize migration 建立 database tables:
```
$ npx sequelize db:migrate
```

登錄 seed 資料:
```
$ npx sequelize db:seed:all
```

完成上述前置作業後，即可於本機端啟動 App:
```
$ npm run dev
```

啟動後，可於任一瀏覽器以 http://localhost:3000 進行瀏覽。<br>
如欲測試線上支付系統，請使用 ngrok 虛擬的網域，替代掉 `localhost:3000`。

## 開發人員

- [Kevin](https://github.com/wllcrre)，[心得Blog](https://medium.com/@shanhengchiu/alpha-camp-%E5%85%A8%E7%AB%AF%E7%B6%B2%E8%B7%AF%E9%96%8B%E7%99%BC%E8%AA%B2%E7%A8%8B%E5%AD%B8%E7%BF%92%E5%BF%83%E5%BE%97-7e043603b1ee)
- [乃頌](https://github.com/pcreem)，心得Blog - [coming soon](https://)