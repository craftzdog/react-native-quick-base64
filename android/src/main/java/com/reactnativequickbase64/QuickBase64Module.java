package com.reactnativequickbase64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;


class QuickBase64Module extends ReactContextBaseJavaModule {
  static {
    System.loadLibrary("quickbase64");
  }

  private static native void initialize(long jsiPtr, String docDir);
  private static native void destruct();

  public QuickBase64Module(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return "QuickBase64";
  }

  @Override
  public void initialize() {
    super.initialize();

    QuickBase64Module.initialize(
      this.getReactApplicationContext().getJavaScriptContextHolder().get(),
      this.getReactApplicationContext().getFilesDir().getAbsolutePath());
  }

  @Override
  public void onCatalystInstanceDestroy() {
    QuickBase64Module.destruct();
  }
}
