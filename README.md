# Dynamic_Cursor_GeekTen2022

```
DynamicCursor
│  mainScript.js: 拡張機能のプログラムのファイル
│  mainStyle.css: 拡張機能を使っているページに適用するスタイルシート
│  manifest.json: 設定ファイル
│  README.md: このファイル
│
├─options
│      options.css: 設定ページのcssファイル
│      options.html: 設定ページのhtmlファイル
│
└─popup
        popup.css: ポップアップのcssファイル
        popup.html: ポップアップのhtmlファイル
```

## prototype
マウスの動きでニセカーソルに力を加えて加速  
速度に比例する抵抗力で減速  
運動方程式に従って移動  
ウィンドウ端と弾性衝突  
### ToDo
- [x] カーソルの動きでニセカーソルに力を加える
- [x] mx.jsの使用 &rarr; 各成分ごとの計算でできるので必要なかった
- [ ] 行列計算のライブラリを使いたかったら[Math.js](https://mathjs.org/)の方がいいかも
- [x] 抵抗力をかける
- [x] ニセカーソルのバウンド（アクションがないとき、次のページがないとき等）
- [x] 調整できるパラメータ
  - [x] 抵抗値
  - [x] 感度 &rarr; ニセカーソルの質量として実装
- [ ] クリック
- [ ] ニセカーソルがリンクにホバーした時の動作
- [ ] アクション
