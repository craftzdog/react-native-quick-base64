cmake_minimum_required(VERSION 3.9.0)
project(QuickBase64)

set (PACKAGE_NAME "react-native-quick-base64")
set (CMAKE_VERBOSE_MAKEFILE ON)

add_library(
    ${PACKAGE_NAME}    STATIC
    ../cpp/QuickBase64Impl.cpp
)

set_target_properties(
    ${PACKAGE_NAME} PROPERTIES
    CXX_STANDARD 20
    CXX_STANDARD_REQUIRED ON
    CXX_EXTENSIONS OFF
)

target_include_directories(
    ${PACKAGE_NAME}    PUBLIC
    ../cpp
)

target_link_libraries(
    ${PACKAGE_NAME}    jsi
    reactnative
    react_codegen_QuickBase64Spec
)
