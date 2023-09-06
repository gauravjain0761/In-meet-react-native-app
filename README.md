## 前置作業

在專案根目錄
```
nvm use
rm -rf node_modules
yarn
```

## IOS
進到ios資料夾

```
brew install cocoapods
pod install --repo-update
```

也可以使用
```
npx pod install
```

```
xed INMEET.xcworkspace
```

如果遇到問題
```
pod deintegrate
pod cache clean --all
ln -s $(which node) /usr/local/bin/node
```

再執行
```
pod install
Product > Clean Build Folder
```

上傳到Testflight
前提是要先在local build過，cert要正確
Product > Archive

部署
進Info.plist 找CFBundleVersion 建制版本 進版
CFBundleShortVersionString
下面有版號可以選擇是否要進版

## Android
進到android資料夾
[Android studio 版本](https://redirector.gvt1.com/edgedl/android/studio/install/2022.1.1.19/android-studio-2022.1.1.19-mac_arm.dmg)

```
open -a /Applications/Android\ Studio.app ./android
./gradlew build
```

如果遇到問題
```
./gradlew --stop
./gradlew clean
./gradlew cleanBuildCache
```

部署
升版號 app > build.gradle defaultConfig裡 versionCode 升上去
build aab 使用 .jks檔案
參考[說明](@sean_hsieh__inmeet-react-native-keystore-credentials.md)