import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(SysInfoPlugin)
public class SysInfoPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SysInfoPlugin"
    public let jsName = "SysInfo"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getInfo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getFreeSpace", returnType: CAPPluginReturnPromise)
    ]

    private var modelIdentifier: String? {
        if let simulated = ProcessInfo.processInfo.environment["SIMULATOR_MODEL_IDENTIFIER"] {
            return simulated
        }
        var info = utsname()
        uname(&info)
        return withUnsafeContinuation(to: &info.machine) {
            $0.withMemoryRebound(to: CChar.self, capacity: 1) {
                String(cString: $0)
            }
        }
    }

    @objc func getInfo(_ call: CAPPluginCall) {
        let version = ProcessInfo.processInfo.operatingSystemVersion
        call.resolve([
            "manufacturer": "Apple",
            "model": modelIdentifier,
            "osVersion": "\(version.majorVersion).\(version.minorVersion).\(version.patchVersion)",
            "sdkInt": 0
        ])
    }

    @objc func getFreeSpace(_ call: CAPPluginCall) {
        let url = URL(fileURLWithPath: NSHomeDirectory())
        do {
            let values = try url.resourceValues(forKeys: [.volumeAvailableCapacityForImportantUsageKey])
            call.resolve([
                "freeBytes": values.volumeAvailableCapacityForImportantUsage
            ])
        } catch {
            call.reject("Espace libre non disponible:", nil, error)
        }
    }

    private let implementation = SysInfo()
}
