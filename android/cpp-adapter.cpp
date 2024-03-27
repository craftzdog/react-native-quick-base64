#include <jni.h>
#include "react-native-quick-base64.h"

using namespace facebook;

extern "C"
JNIEXPORT void JNICALL
Java_com_reactnativequickbase64_QuickBase64Module_initialize(JNIEnv* env, jclass clazz, jlong jsiPtr) {
  installBase64(*reinterpret_cast<jsi::Runtime*>(jsiPtr));
}

extern "C"
JNIEXPORT void JNICALL
Java_com_reactnativequickbase64_QuickBase64Module_destruct(JNIEnv* env, jclass clazz) {
  cleanupBase64();
}
