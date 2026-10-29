package com.formation.sysinfo;

import android.os.Build;
import android.os.StatFs;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "SysInfo")
public class SysInfoPlugin extends Plugin {

    @PluginMethod
    public void getInfo(PluginCall call) {
        JSObject result = new JSObject();
        result.put("manufacturer", Build.MANUFACTURER);
        result.put("model", Build.MODEL);
        result.put("osVersion", Build.VERSION.RELEASE);
        result.put("sdkInt", Build.VERSION.SDK_INT);

        call.resolve(result);
    }

    @PluginMethod
    public void getFreeSpace(PluginCall call) {
        StatFs stat = new StatFs(getContext().getFilesDir().getPath());
        JSObject result = new JSObject();
        result.put("freeBytes", stat.getAvailableBytes());
        call.resolve(result);
    }
}
