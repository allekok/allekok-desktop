<div dir=rtl>

# بەرنامەی دێسکتاپی ئاڵەکۆک
## پێویستییەکان
</div>
- node.js
- npm or yarn

<div dir=rtl>

## بەکارهێنان
</div>
```bash
git clone https://github.com/allekok/allekok-desktop.git && cd allekok-desktop
git submodule init && git submodule update
[npm|yarn] install
[npm|yarn] start
```

<div dir=rtl>

## ساز کردنی وەشانی نوێ
</div>
```bash
# linux
yarn dist --linux --x64 AppImage
# windows
yarn dist --win --x64 exe
# mac os
yarn dist --mac --x64 dmg
```
