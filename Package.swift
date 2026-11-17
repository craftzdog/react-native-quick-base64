// swift-tools-version: 6.0

import Foundation
import PackageDescription

let usedRootEntries: Set<String> = ["ios", "cpp", "spm-include", "Package.swift"]
let unusedRootEntries = try! FileManager.default.contentsOfDirectory(atPath: Context.packageDirectory)
    .filter { !usedRootEntries.contains($0) }
    .sorted()

let package = Package(
    name: "react_native_quick_base64",
    platforms: [.iOS("15.1")],
    products: [
        .library(name: "react_native_quick_base64", targets: ["react_native_quick_base64"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
    ],
    targets: [
        .target(
            name: "react_native_quick_base64",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
            ],
            path: ".",
            exclude: unusedRootEntries,
            sources: ["ios", "cpp"],
            publicHeadersPath: "spm-include",
            cSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .headerSearchPath("cpp"),
                .headerSearchPath("ios"),
                .headerSearchPath("ios/generated/ReactCodegen"),
            ],
            cxxSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .headerSearchPath("cpp"),
                .headerSearchPath("ios"),
                .headerSearchPath("ios/generated/ReactCodegen"),
                .define("DEBUG", .when(configuration: .debug)),
                .define("NDEBUG", .when(configuration: .release)),
            ]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
