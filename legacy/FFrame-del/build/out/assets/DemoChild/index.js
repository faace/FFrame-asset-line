System.register("chunks:///_virtual/DemoChild", ['./DemoChildEntry.ts'], function () {
  return {
    setters: [null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/DemoChildEntry.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './GMLauncher.ts', './GMBundleEntryBase.ts'], function () {
  var _inheritsLoose, _asyncToGenerator, _regeneratorRuntime, cclegacy, registerBundleEntry, GMBundleEntryBase;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, null, function (module) {
      registerBundleEntry = module.registerBundleEntry;
    }, function (module) {
      GMBundleEntryBase = module.GMBundleEntryBase;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c3d4eX2p7iQEs3vEjRWeJAS", "DemoChildEntry", undefined);

      /** 示范子功能：被 DemoHome 嵌套绑定 */
      var DemoChildEntry = /*#__PURE__*/function (_GMBundleEntryBase) {
        _inheritsLoose(DemoChildEntry, _GMBundleEntryBase);
        function DemoChildEntry() {
          return _GMBundleEntryBase.call(this, 'DemoChild') || this;
        }
        var _proto = DemoChildEntry.prototype;
        _proto.onInit = function onInit() {
          console.log('[DemoChild] onInit');
        };
        _proto.onBind = /*#__PURE__*/function () {
          var _onBind = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(ctx) {
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  console.log('[DemoChild] onBind', ctx.bindPath.join('/'));
                case 1:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          }));
          function onBind(_x) {
            return _onBind.apply(this, arguments);
          }
          return onBind;
        }();
        _proto.onStart = function onStart() {
          console.log('[DemoChild] onStart (Ready)');
        };
        _proto.onUnbind = /*#__PURE__*/function () {
          var _onUnbind = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  console.log('[DemoChild] onUnbind');
                case 1:
                case "end":
                  return _context2.stop();
              }
            }, _callee2);
          }));
          function onUnbind() {
            return _onUnbind.apply(this, arguments);
          }
          return onUnbind;
        }();
        _proto.onRemove = function onRemove() {
          console.log('[DemoChild] onRemove');
        };
        return DemoChildEntry;
      }(GMBundleEntryBase);
      registerBundleEntry('DemoChild', new DemoChildEntry());
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/DemoChild', 'chunks:///_virtual/DemoChild'); 
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