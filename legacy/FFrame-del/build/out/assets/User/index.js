System.register("chunks:///_virtual/User", ['./UserEntry.ts'], function () {
  return {
    setters: [null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/UserEntry.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './GMLauncher.ts', './GMBundleEntryBase.ts'], function () {
  var _inheritsLoose, cclegacy, registerBundleEntry, gd, GMBundleEntryBase;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, null, function (module) {
      registerBundleEntry = module.registerBundleEntry;
      gd = module.gd;
    }, function (module) {
      GMBundleEntryBase = module.GMBundleEntryBase;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a11b2LD1E5PVYZneImaq7AE", "UserEntry", undefined);

      /** 基础包：账号树 gd.User */
      var UserEntry = /*#__PURE__*/function (_GMBundleEntryBase) {
        _inheritsLoose(UserEntry, _GMBundleEntryBase);
        function UserEntry() {
          return _GMBundleEntryBase.call(this, 'User') || this;
        }
        var _proto = UserEntry.prototype;
        _proto.onBind = function onBind() {
          return new Promise(function (resolve, reject) {
            gd.sync('User', function (err) {
              if (err) return reject(err);
              resolve();
            });
          });
        };
        return UserEntry;
      }(GMBundleEntryBase);
      registerBundleEntry('User', new UserEntry());
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/User', 'chunks:///_virtual/User'); 
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