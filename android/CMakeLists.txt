cmake_minimum_required(VERSION 3.9.0)

set (PACKAGE_NAME "react-native-quick-base64")
set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 11)

if(${REACT_NATIVE_VERSION} LESS 66)
        set (
                INCLUDE_JSI_CPP
                "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi/jsi/jsi.cpp"
        )
        set (
                INCLUDE_JSIDYNAMIC_CPP
                "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi/jsi/JSIDynamic.cpp"
        )
endif()


include_directories(
  ../cpp
  "${NODE_MODULES_DIR}/react-native/React"
  "${NODE_MODULES_DIR}/react-native/React/Base"
  "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
  ${INCLUDE_JSI_CPP} # only on older RN versions
  ${INCLUDE_JSIDYNAMIC_CPP} # only on older RN versions
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

if(${REACT_NATIVE_VERSION} LESS 66)
  # JSI lib didn't exist on RN 0.65 and before. Simply omit it.
  set (JSI_LIB "")
else()
  # RN 0.66 distributes libjsi.so, can be used instead of compiling jsi.cpp manually.
  find_library(
    JSI_LIB
    jsi
    PATHS ${LIBRN_DIR}
    NO_CMAKE_FIND_ROOT_PATH
  )
endif()

target_link_libraries(quickbase64)
