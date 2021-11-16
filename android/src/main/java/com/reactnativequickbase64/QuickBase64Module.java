package com.reactnativequickbase64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;


class QuickBase64Module extends ReactContextBaseJavaModule {
  static {
    System.loadLibrary("quickbase64");
  }

  private static native void initialize(long jsiPtr, String docDir);

  public QuickBase64Module(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return "QuickBase64";
  }

  public static void install(ReactApplicationContext context) {
    QuickBase64Module.initialize(
      context.getJavaScriptContextHolder().get(),
      context.getFilesDir().getAbsolutePath());
  }
}
