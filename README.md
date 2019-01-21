# allekok desktop application
Allekok desktop application stable releases can be found here: https://github.com/allekok/allekok-desktop/releases  
For running || building from the source code, Install dependencies that mentioned below and then read the following instructions.
## Dependencies
- node.js
- npm or yarn
## Using
**using npm**
```bash
git clone https://github.com/allekok/allekok-desktop.git
cd allekok-desktop
npm install
npm start
```
For building a distribution package:
```bash
# linux
npm dist --linux --x64 AppImage
# windows
npm dist --win --x64 exe
# mac os
npm dist --mac --x64 dmg
```

**using yarn**
```bash
git clone https://github.com/allekok/allekok-desktop.git
cd allekok-desktop
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
For more information on how to build distributions check out: https://github.com/electron-userland/electron-builder  
