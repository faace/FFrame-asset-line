System.register("chunks:///_virtual/Setting", ['./SettingEntry.ts'], function () {
  return {
    setters: [null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/SettingEntry.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './GMLauncher.ts', './GMBundleEntryBase.ts'], function () {
  var _inheritsLoose, cclegacy, registerBundleEntry, gl, GMBundleEntryBase;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, null, function (module) {
      registerBundleEntry = module.registerBundleEntry;
      gl = module.gl;
    }, function (module) {
      GMBundleEntryBase = module.GMBundleEntryBase;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a11b2LD1E5PVYZneImaq7AF", "SettingEntry", undefined);

      /** 基础包：本地设置 gl.Setting */
      var SettingEntry = /*#__PURE__*/function (_GMBundleEntryBase) {
        _inheritsLoose(SettingEntry, _GMBundleEntryBase);
        function SettingEntry() {
          return _GMBundleEntryBase.call(this, 'Setting') || this;
        }
        var _proto = SettingEntry.prototype;
        _proto.onBind = function onBind() {
          var setting = gl.Setting;
          if (!setting) return console.error('[Setting] gl.Setting 未建树');
          if (setting.bgmVolume === undefined) setting.bgmVolume = 1;
          if (setting.sfxVolume === undefined) setting.sfxVolume = 1;
          if (setting.language === undefined) setting.language = 'zh';
        };
        return SettingEntry;
      }(GMBundleEntryBase);
      registerBundleEntry('Setting', new SettingEntry());
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/Setting', 'chunks:///_virtual/Setting'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});