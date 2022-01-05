You may have to edit `CMAkeLists.txt` as following for Android:

```diff
diff --git a/android/CMakeLists.txt b/android/CMakeLists.txt
index 5540dbe..04d474b 100644
--- a/android/CMakeLists.txt
+++ b/android/CMakeLists.txt
@@ -5,14 +5,14 @@ set (CMAKE_CXX_STANDARD 11)

 include_directories(
   ../cpp
-  ../../react-native/React
-  ../../react-native/React/Base
-  ../../react-native/ReactCommon/jsi
+  ../node_modules/react-native/React
+  ../node_modules/react-native/React/Base
+  ../node_modules/react-native/ReactCommon/jsi
   )

 add_library(quickbase64 # Library name
   SHARED
-  ../../react-native/ReactCommon/jsi/jsi/jsi.cpp
+  ../node_modules/react-native/ReactCommon/jsi/jsi/jsi.cpp
   ../cpp/base64.cpp
   ../cpp/base64.h
   ../cpp/react-native-quick-base64.cpp
```
