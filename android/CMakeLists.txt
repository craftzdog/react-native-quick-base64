cmake_minimum_required(VERSION 3.9.0)

set (PACKAGE_NAME "react-native-quick-base64")
set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 11)

file(TO_CMAKE_PATH "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi/jsi/jsi.cpp" libPath)

include_directories(
  ../cpp
  "${NODE_MODULES_DIR}/react-native/React"
  "${NODE_MODULES_DIR}/react-native/React/Base"
  "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
)

add_library(quickbase64 # Library name
  SHARED
  ${libPath}
  ../cpp/base64.cpp
  ../cpp/base64.h
  ../cpp/react-native-quick-base64.cpp
  ../cpp/react-native-quick-base64.h
  cpp-adapter.cpp
  )

target_link_libraries(quickbase64)
