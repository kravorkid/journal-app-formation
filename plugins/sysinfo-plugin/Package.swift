// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "SysinfoPlugin",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "SysinfoPlugin",
            targets: ["SysInfoPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0")
    ],
    targets: [
        .target(
            name: "SysInfoPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/SysInfoPlugin")
    ]
)
