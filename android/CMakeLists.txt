cmake_minimum_required(VERSION 3.4.1)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 11)

include_directories(
        ../cpp
        ../node_modules/react-native/React
        ../node_modules/react-native/React/Base
        ../node_modules/react-native/ReactCommon/jsi
)

add_library(cpp
            SHARED
            ../node_modules/react-native/ReactCommon/jsi/jsi/jsi.cpp
            ../cpp/base64.cpp
            ../cpp/base64.h
            ../cpp/react-native-quick-base64.cpp
            ../cpp/react-native-quick-base64.h
            cpp-adapter.cpp
)

