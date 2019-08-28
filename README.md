# بەرنامەی دێسکتاپی ئاڵەکۆک
بۆ داگرتنی وەشانەکانی جۆراوجۆری بەرنامەی دێسکتاپی ئاڵەکۆک،
سەردانی لاپەڕەی خوارەوە بکەن:  
[دابەزاندنی بەرنامەی دێسکتاپی
ئاڵەکۆک](https://github.com/allekok/allekok-desktop/releases)  
بۆ دروست‌کردنی بەرنامەی دێسکتاپی ئاڵەکۆک، خوارەوە وەخوێنن:  
## Dependencies
- node.js
- npm or yarn
## Using
**using npm**
```bash
git clone https://github.com/allekok/allekok-desktop.git && cd allekok-desktop
git submodule init && git submodule update
npm install
npm start
```

**using yarn**
```bash
git clone https://github.com/allekok/allekok-desktop.git && cd allekok-desktop
git submodule init && git submodule update
yarn install
yarn start
```
For building a distribution package:
```bash
# linux
yarn dist --linux --x64 AppImage
# windows
yarn dist --win --x64 exe
# mac os
yarn dist --mac --x64 dmg
```
For more information on how to build packages check out: https://github.com/electron-userland/electron-builder  
