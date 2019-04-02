# allekok desktop application
The stable releases of Allekok desktop application could be found here: https://github.com/allekok/allekok-desktop/releases  
For building from source code, Install dependencies and then follow the instructions mentioned in "Using" section.
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
For more information on how to build packages check out: https://github.com/electron-userland/electron-builder  
