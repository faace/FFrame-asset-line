System.register("chunks:///_virtual/config.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b22c3PU5V9GZ5d4iZqrvMAJ", "config", undefined);
      /** 项目配置（跟 game/ 走；gmajor 不 import 本文件） */
      var config = exports('config', {
        v: 1,
        // 本文件格式
        version: {
          app: '0.1.0',
          gmajor: '0.5.0'
        },
        // app 版本；gmajor = 按哪个框架版本写的，开机只打日志比对
        boot: ['GameUI', 'User', 'Setting'],
        // 常驻；按平台再拆后置
        entry: {
          web: 'DemoHome'
        },
        // role → 入口包；缺 key 则 gm.boot 失败
        alert: {
          bundle: 'GameUI',
          prefab: 'LyAlert'
        } // 确认框皮；GameUI onBind 预载
      });

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMAlert.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMLayer.ts', './GMLauncher.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Label, GMLayer, gu;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
    }, function (module) {
      GMLayer = module.GMLayer;
    }, function (module) {
      gu = module.gu;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "c91f34qe01ObKHwjSxbnkoQ", "GMAlert", undefined);
      var ccclass = _decorator.ccclass;
      /** 确认框基类：按节点名填字/点按；皮由本游戏预制体提供（缺节点时由子类 onInit 画） */
      var GMAlert = exports('GMAlert', (_dec = ccclass('GMAlert'), _dec(_class = /*#__PURE__*/function (_GMLayer) {
        _inheritsLoose(GMAlert, _GMLayer);
        function GMAlert() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMLayer.call.apply(_GMLayer, [this].concat(args)) || this;
          _this.body = null;
          _this.okLabel = null;
          _this.cancelLabel = null;
          _this.btnOk = null;
          _this.btnCancel = null;
          _this.onOk = void 0;
          _this.onCancel = void 0;
          _this.close = void 0;
          return _this;
        }
        var _proto = GMAlert.prototype;
        _proto.bindAlertNodes = function bindAlertNodes() {
          var _panel$getChildByName, _panel$getChildByName2, _panel$getChildByName3, _panel$getChildByName4, _ref, _this$btnOk$getChildB, _this$btnOk, _this$btnOk2, _ref2, _this$btnCancel$getCh, _this$btnCancel, _this$btnCancel2;
          // 约定：panel 下 body / btnOk / btnCancel
          var panel = this.panel;
          if (!panel) return;
          this.body = (_panel$getChildByName = (_panel$getChildByName2 = panel.getChildByName('body')) == null ? void 0 : _panel$getChildByName2.getComponent(Label)) != null ? _panel$getChildByName : this.body;
          this.btnOk = (_panel$getChildByName3 = panel.getChildByName('btnOk')) != null ? _panel$getChildByName3 : this.btnOk;
          this.btnCancel = (_panel$getChildByName4 = panel.getChildByName('btnCancel')) != null ? _panel$getChildByName4 : this.btnCancel;
          this.okLabel = (_ref = (_this$btnOk$getChildB = (_this$btnOk = this.btnOk) == null || (_this$btnOk = _this$btnOk.getChildByName('label')) == null ? void 0 : _this$btnOk.getComponent(Label)) != null ? _this$btnOk$getChildB : (_this$btnOk2 = this.btnOk) == null ? void 0 : _this$btnOk2.getComponent(Label)) != null ? _ref : this.okLabel;
          this.cancelLabel = (_ref2 = (_this$btnCancel$getCh = (_this$btnCancel = this.btnCancel) == null || (_this$btnCancel = _this$btnCancel.getChildByName('label')) == null ? void 0 : _this$btnCancel.getComponent(Label)) != null ? _this$btnCancel$getCh : (_this$btnCancel2 = this.btnCancel) == null ? void 0 : _this$btnCancel2.getComponent(Label)) != null ? _ref2 : this.cancelLabel;
        };
        _proto.init = function init(parm) {
          var _this2 = this;
          if (!parm) return;
          this.bindAlertNodes();
          if (this.body) this.body.string = parm.content;
          if (this.okLabel) this.okLabel.string = parm.okText;
          if (this.cancelLabel) this.cancelLabel.string = parm.cancelText;
          this.onOk = parm.onOk;
          this.onCancel = parm.onCancel;
          this.close = parm.close;
          if (this.btnCancel) this.btnCancel.active = parm.showCancel;
          if (this.btnOk) {
            if (parm.showCancel === false) this.btnOk.setPosition(0, this.btnOk.position.y, 0);
            gu.addClick(this.btnOk, function () {
              _this2.onOk == null || _this2.onOk();
              _this2.close == null || _this2.close();
            });
          }
          if (parm.showCancel && this.btnCancel) {
            gu.addClick(this.btnCancel, function () {
              _this2.onCancel == null || _this2.onCancel();
              _this2.close == null || _this2.close();
            });
          }
        };
        return GMAlert;
      }(GMLayer)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMAsyncCallback.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d7931iWjMhM+7rcJ3CXeMrZ", "GMAsyncCallback", undefined);
      /**
       * 带进度的异步回调约定（资源加载等共用）。
       * 签名尾部固定：onComplete 在前，onProgress 可选在后；不需要进度就不传。
       */
      // 成功时 err 为 null
      // 成功时 err 为 null，其后才是结果
      // 语义由具体 API 约定
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMBindContext.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createClass, cclegacy;
  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "cf388fu9rlEiZasMkBYTHnB", "GMBindContext", undefined);
      /**
       * 绑定驱动上下文：给入口用的核心能力子集。
       * 不含万能服务定位器。openScene/showLayer 自动带本 Bundle 名。
       */
      var GMBindContext = exports('GMBindContext', /*#__PURE__*/function () {
        function GMBindContext(bundleName, events, resource, binder, parentPath, ui) {
          if (parentPath === void 0) {
            parentPath = [];
          }
          if (ui === void 0) {
            ui = null;
          }
          this.bundleName = bundleName;
          this.events = events;
          this.resource = resource;
          this.binder = binder;
          this.parentPath = parentPath;
          this.ui = ui;
        }
        var _proto = GMBindContext.prototype;
        /** 嵌套绑定子 Bundle；子随父解绑/回滚 */
        _proto.bindChild = function bindChild(name) {
          return this.binder.bind(name, {
            loadIfNeeded: true,
            parentPath: this.bindPath,
            parentName: this.bundleName
          });
        };
        _proto.openScene = function openScene(sceneName, onComplete, onProgress) {
          if (!this.ui) return console.error('[GMBindContext] 无 ui');
          this.ui.openScene(sceneName, {
            bundle: this.bundleName
          }, onComplete, onProgress);
        };
        _proto.showLayer = function showLayer(layerName, onComplete) {
          if (!this.ui) return console.error('[GMBindContext] 无 ui');
          this.ui.showLayer(layerName, {
            bundle: this.bundleName
          }, onComplete);
        };
        _proto.closeLayer = function closeLayer(layerName, onComplete) {
          if (!this.ui) return console.error('[GMBindContext] 无 ui');
          this.ui.closeLayer(layerName, onComplete);
        };
        _createClass(GMBindContext, [{
          key: "bindPath",
          get: function get() {
            // 只读绑定路径，便于排障
            return [].concat(this.parentPath, [this.bundleName]);
          }
        }]);
        return GMBindContext;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMBinder.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMBindContext.ts', './GMBindState.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, _asyncToGenerator, _regeneratorRuntime, cclegacy, GMBindContext, GMBindState;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      GMBindContext = module.GMBindContext;
    }, function (module) {
      GMBindState = module.GMBindState;
    }],
    execute: function () {
      cclegacy._RF.push({}, "0001cG0D7NIM5Gc0/fvCpeF", "GMBinder", undefined);
      /** 调用者编排：load/bind/unbind、嵌套树、失败回滚 */
      var GMBinder = exports('GMBinder', /*#__PURE__*/function () {
        function GMBinder(registry, resource, events) {
          this.nodes = new Map();
          this.roots = new Set();
          this.ui = null;
          this.store = null;
          this.registry = registry;
          this.resource = resource;
          this.events = events;
        }
        var _proto = GMBinder.prototype;
        _proto.attachUI = function attachUI(ui) {
          this.ui = ui;
        };
        _proto.attachStore = function attachStore(store) {
          this.store = store;
        }

        /** 当前绑定树（父 → 子名列表） */;
        _proto.dumpTree = function dumpTree() {
          var out = {};
          for (var _iterator = _createForOfIteratorHelperLoose(this.nodes), _step; !(_step = _iterator()).done;) {
            var _step$value = _step.value,
              name = _step$value[0],
              node = _step$value[1];
            out[name] = [].concat(node.children);
          }
          return out;
        };
        _proto.listBound = function listBound() {
          return [].concat(this.nodes.keys());
        }

        /** 按序 load+bind；已就绪的跳过。名单由项目传入，核心不内置。onProgress(已完成包数, 总包数) */;
        _proto.bindInOrder = function bindInOrder(names, onComplete, onProgress) {
          var _this = this;
          var total = names.length;
          var next = function next(i) {
            if (i >= names.length) return onComplete(null);
            var name = names[i];
            _this.loadBundle(name, function (err) {
              if (err) return onComplete(err);
              void _this.bind(name).then(function () {
                onProgress == null || onProgress(i + 1, total);
                next(i + 1);
              }, function (bindErr) {
                return onComplete(bindErr);
              });
            });
          };
          next(0);
        }

        /** 显式加载 Bundle；成功后注册表中必须已有入口。onProgress 可选 */;
        _proto.loadBundle = function loadBundle(name, onComplete, onProgress) {
          var _this2 = this;
          this.resource.loadBundle(name, function (err) {
            if (err) return onComplete(err);
            if (!_this2.registry.has(name)) {
              return onComplete(new Error("[GMBinder] Bundle \u5DF2\u52A0\u8F7D\u4F46\u672A\u767B\u8BB0\u5165\u53E3: " + name));
            }
            onComplete(null);
          }, onProgress);
        }

        /** bind(loadIfNeeded) 内部用：把回调式 load 收成 Promise */;
        _proto.loadBundleAsync = function loadBundleAsync(name) {
          var _this3 = this;
          return new Promise(function (resolve, reject) {
            _this3.loadBundle(name, function (err) {
              return err ? reject(err) : resolve();
            });
          });
        }

        /**
         * 绑定至就绪。默认要求已 load；失败则对称回滚。
         */;
        _proto.bind = /*#__PURE__*/
        function () {
          var _bind = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(name, options) {
            var _options$parentPath;
            var entry, releaseOnRollback, parentPath, _this$store, _entry, node, parent, ctx;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (options === void 0) {
                    options = {};
                  }
                  if (!this.nodes.has(name)) {
                    _context.next = 6;
                    break;
                  }
                  entry = this.registry.get(name);
                  if (!((entry == null ? void 0 : entry.getState()) === GMBindState.Ready)) {
                    _context.next = 6;
                    break;
                  }
                  console.debug('[GMBinder] 已就绪，跳过绑定', name);
                  return _context.abrupt("return");
                case 6:
                  releaseOnRollback = options.releaseOnRollback !== false;
                  parentPath = (_options$parentPath = options.parentPath) != null ? _options$parentPath : [];
                  _context.prev = 8;
                  if (!options.loadIfNeeded) {
                    _context.next = 14;
                    break;
                  }
                  _context.next = 12;
                  return this.loadBundleAsync(name);
                case 12:
                  _context.next = 16;
                  break;
                case 14:
                  if (this.resource.hasBundle(name)) {
                    _context.next = 16;
                    break;
                  }
                  throw new Error("[GMBinder] Bundle \u672A\u52A0\u8F7D: " + name + "\u3002\u8BF7\u5148\u7531\u903B\u8F91\u8C03\u7528 loadBundle \u540E\u518D bind");
                case 16:
                  _entry = this.registry.get(name);
                  if (_entry) {
                    _context.next = 19;
                    break;
                  }
                  throw new Error("[GMBinder] \u672A\u627E\u5230\u6807\u51C6\u5165\u53E3: " + name);
                case 19:
                  node = {
                    name: name,
                    children: [],
                    parent: options.parentName
                  };
                  this.nodes.set(name, node);
                  if (options.parentName) {
                    parent = this.nodes.get(options.parentName);
                    if (parent && !parent.children.includes(name)) {
                      parent.children.push(name);
                    }
                  } else {
                    this.roots.add(name);
                  }
                  ctx = new GMBindContext(name, this.events, this.resource, this, parentPath, this.ui);
                  (_this$store = this.store) == null || _this$store.onBind(name); // 建 gd.<包> + gl.<包> 空树

                  console.info('[GMBinder] bind →', ctx.bindPath.join(' / '));
                  _context.next = 27;
                  return _entry.bind(ctx);
                case 27:
                  this.events.emit({
                    name: 'BindReady',
                    data: {
                      name: name,
                      bindPath: ctx.bindPath
                    }
                  });
                  console.info('[GMBinder] ready', name);
                  _context.next = 37;
                  break;
                case 31:
                  _context.prev = 31;
                  _context.t0 = _context["catch"](8);
                  console.error('[GMBinder] bind 失败，开始回滚', name, _context.t0);
                  _context.next = 36;
                  return this.rollback(name, releaseOnRollback);
                case 36:
                  throw _context.t0;
                case 37:
                case "end":
                  return _context.stop();
              }
            }, _callee, this, [[8, 31]]);
          }));
          function bind(_x, _x2) {
            return _bind.apply(this, arguments);
          }
          return bind;
        }()
        /**
         * 解绑；先逆序解绑子节点。releaseBundle 默认 true。
         */;

        _proto.unbind = /*#__PURE__*/
        function () {
          var _unbind = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(name, releaseBundle) {
            var _this$ui$getUnbindBlo, _this$ui, _this$store2;
            var node, blockers, msg, _iterator2, _step2, child, entry, parentPath, ctx, parent;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  if (releaseBundle === void 0) {
                    releaseBundle = true;
                  }
                  node = this.nodes.get(name);
                  if (node) {
                    _context2.next = 5;
                    break;
                  }
                  console.debug('[GMBinder] 未绑定，跳过解绑', name);
                  return _context2.abrupt("return");
                case 5:
                  blockers = (_this$ui$getUnbindBlo = (_this$ui = this.ui) == null ? void 0 : _this$ui.getUnbindBlockers(this.collectFamily(name))) != null ? _this$ui$getUnbindBlo : [];
                  if (!blockers.length) {
                    _context2.next = 10;
                    break;
                  }
                  msg = "[GMBinder] \u4E0D\u80FD unbind " + name + "\uFF1A\u4ECD\u5360\u7528 " + blockers.join('；');
                  console.error(msg);
                  throw new Error(msg);
                case 10:
                  _iterator2 = _createForOfIteratorHelperLoose([].concat(node.children).reverse());
                case 11:
                  if ((_step2 = _iterator2()).done) {
                    _context2.next = 17;
                    break;
                  }
                  child = _step2.value;
                  _context2.next = 15;
                  return this.unbind(child, releaseBundle);
                case 15:
                  _context2.next = 11;
                  break;
                case 17:
                  entry = this.registry.get(name);
                  parentPath = this.buildPath(node.parent);
                  ctx = new GMBindContext(name, this.events, this.resource, this, parentPath, this.ui);
                  console.info('[GMBinder] unbind →', name);
                  if (!entry) {
                    _context2.next = 24;
                    break;
                  }
                  _context2.next = 24;
                  return entry.unbind(ctx);
                case 24:
                  (_this$store2 = this.store) == null || _this$store2.onUnbind(name); // 卸本包 gd/gl（假服数据保留）

                  if (node.parent) {
                    parent = this.nodes.get(node.parent);
                    if (parent) {
                      parent.children = parent.children.filter(function (c) {
                        return c !== name;
                      });
                    }
                  } else {
                    this.roots["delete"](name);
                  }
                  this.nodes["delete"](name);
                  if (!releaseBundle) {
                    _context2.next = 31;
                    break;
                  }
                  _context2.next = 30;
                  return this.resource.releaseBundle(name);
                case 30:
                  this.registry.unregister(name);
                case 31:
                  this.events.emit({
                    name: 'BindUnbound',
                    data: {
                      name: name
                    }
                  });
                case 32:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, this);
          }));
          function unbind(_x3, _x4) {
            return _unbind.apply(this, arguments);
          }
          return unbind;
        }();
        _proto.rollback = /*#__PURE__*/function () {
          var _rollback = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(name, releaseBundle) {
            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.prev = 0;
                  _context3.next = 3;
                  return this.unbind(name, releaseBundle);
                case 3:
                  _context3.next = 8;
                  break;
                case 5:
                  _context3.prev = 5;
                  _context3.t0 = _context3["catch"](0);
                  console.error('[GMBinder] 回滚时再次失败', name, _context3.t0);
                case 8:
                case "end":
                  return _context3.stop();
              }
            }, _callee3, this, [[0, 5]]);
          }));
          function rollback(_x5, _x6) {
            return _rollback.apply(this, arguments);
          }
          return rollback;
        }();
        _proto.collectFamily = function collectFamily(name) {
          var out = [name];
          var node = this.nodes.get(name);
          if (!node) return out;
          for (var _iterator3 = _createForOfIteratorHelperLoose(node.children), _step3; !(_step3 = _iterator3()).done;) {
            var child = _step3.value;
            out.push.apply(out, this.collectFamily(child));
          }
          return out;
        };
        _proto.buildPath = function buildPath(parentName) {
          var path = [];
          var cur = parentName;
          while (cur) {
            var _this$nodes$get;
            path.unshift(cur);
            cur = (_this$nodes$get = this.nodes.get(cur)) == null ? void 0 : _this$nodes$get.parent;
          }
          return path;
        };
        return GMBinder;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMBindState.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "605bdut3FRGn636vPyMV2n7", "GMBindState", undefined);
      /**
       * Bundle 标准入口状态。由 GMBundleEntryBase.bind/unbind 推进。
       * 流转：Uncreated -onInit→ Created -onBind/onStart/onEnable→ Ready
       *       Ready -onDisable/onUnbind/onRemove→ Destroyed（再 bind 会重走 onInit）
       * Binding/Unbinding 为过程态，业务勿长期依赖。详表见 docs/架构/核心简介.md
       */
      var GMBindState = exports('GMBindState', /*#__PURE__*/function (GMBindState) {
        GMBindState["Uncreated"] = "uncreated";
        GMBindState["Created"] = "created";
        GMBindState["Binding"] = "binding";
        GMBindState["Ready"] = "ready";
        GMBindState["Unbinding"] = "unbinding";
        GMBindState["Destroyed"] = "destroyed";
        return GMBindState;
      }({})); // 已销毁；再次 bind 会重走 onInit
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMBoot.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e02a1s8TV5GeI+QobLD1OX2", "GMBoot", undefined);
      /** 项目开机配置（住 game/config；gmajor 不 import 该文件） */
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMBundleEntryBase.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMBindState.ts', './GMClassBase.ts'], function (exports) {
  var _inheritsLoose, _asyncToGenerator, _regeneratorRuntime, cclegacy, GMBindState, GMClassBase;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      GMBindState = module.GMBindState;
    }, function (module) {
      GMClassBase = module.GMClassBase;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b952eNhVo9F24wkANtObnx8", "GMBundleEntryBase", undefined);

      /** Bundle 对外标准入口（bind / unbind / getState） */

      /**
       * 标准入口基类：编排侧调 bind/unbind；内部按序触发生命周期钩子并推进 GMBindState。
       * 状态流转见 GMBindState.ts；业务重写 onInit/onBind/onStart/… 即可。
       */
      var GMBundleEntryBase = exports('GMBundleEntryBase', /*#__PURE__*/function (_GMClassBase) {
        _inheritsLoose(GMBundleEntryBase, _GMClassBase);
        function GMBundleEntryBase(bundleName) {
          var _this;
          _this = _GMClassBase.call(this, bundleName) || this;
          _this.bundleName = bundleName;
          return _this;
        }

        /** 进场：Uncreated→Created→Binding→Ready；抛错由 GMBinder 回滚 */
        var _proto = GMBundleEntryBase.prototype;
        _proto.bind = /*#__PURE__*/
        function () {
          var _bind = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(ctx) {
            var needCreate;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (!(this.state === GMBindState.Ready)) {
                    _context.next = 2;
                    break;
                  }
                  return _context.abrupt("return");
                case 2:
                  if (!(this.state === GMBindState.Binding)) {
                    _context.next = 4;
                    break;
                  }
                  throw new Error("[" + this.bundleName + "] \u6B63\u5728\u7ED1\u5B9A\u4E2D");
                case 4:
                  needCreate = this.state === GMBindState.Uncreated || this.state === GMBindState.Destroyed;
                  this.setState(GMBindState.Binding);
                  _context.prev = 6;
                  if (!needCreate) {
                    _context.next = 11;
                    break;
                  }
                  _context.next = 10;
                  return this.invoke('onInit');
                case 10:
                  this.setState(GMBindState.Created);
                case 11:
                  _context.next = 13;
                  return this.invoke('onBind', ctx);
                case 13:
                  _context.next = 15;
                  return this.invoke('onStart');
                case 15:
                  _context.next = 17;
                  return this.invoke('onEnable');
                case 17:
                  this.setState(GMBindState.Ready);
                  _context.next = 24;
                  break;
                case 20:
                  _context.prev = 20;
                  _context.t0 = _context["catch"](6);
                  this.setState(needCreate ? GMBindState.Uncreated : GMBindState.Created);
                  throw _context.t0;
                case 24:
                case "end":
                  return _context.stop();
              }
            }, _callee, this, [[6, 20]]);
          }));
          function bind(_x) {
            return _bind.apply(this, arguments);
          }
          return bind;
        }() /** 退场：Ready→Unbinding→Destroyed；子级联由 GMBinder 负责 */;
        _proto.unbind = /*#__PURE__*/
        function () {
          var _unbind = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(ctx) {
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(this.state === GMBindState.Uncreated || this.state === GMBindState.Destroyed || this.state === GMBindState.Unbinding)) {
                    _context2.next = 2;
                    break;
                  }
                  return _context2.abrupt("return");
                case 2:
                  this.setState(GMBindState.Unbinding);
                  _context2.prev = 3;
                  _context2.next = 6;
                  return this.invoke('onDisable');
                case 6:
                  _context2.next = 8;
                  return this.invoke('onUnbind', ctx);
                case 8:
                  this.disposeSpawned();
                  this.removeAllWatches();
                  this.removeAllEvents();
                  _context2.next = 13;
                  return this.invoke('onRemove');
                case 13:
                  _context2.prev = 13;
                  this.removeAllWatches();
                  this.removeAllEvents();
                  this.setState(GMBindState.Destroyed);
                  return _context2.finish(13);
                case 18:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, this, [[3,, 13, 18]]);
          }));
          function unbind(_x2) {
            return _unbind.apply(this, arguments);
          }
          return unbind;
        }();
        _proto.asLifecycle = function asLifecycle() {
          return this;
        };
        return GMBundleEntryBase;
      }(GMClassBase));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMBundleRegistry.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "bf7deaxbglC9JoUucaMfgkq", "GMBundleRegistry", undefined);
      /** Bundle 标准入口注册表；由 Bundle 脚本 load 时自登记 */
      var GMBundleRegistry = exports('GMBundleRegistry', /*#__PURE__*/function () {
        function GMBundleRegistry() {
          this.entries = new Map();
        }
        var _proto = GMBundleRegistry.prototype;
        _proto.register = function register(name, entry) {
          if (this.entries.has(name)) {
            throw new Error("[GMBundleRegistry] \u91CD\u590D\u767B\u8BB0: " + name);
          }
          this.entries.set(name, entry);
        };
        _proto.unregister = function unregister(name) {
          this.entries["delete"](name);
        };
        _proto.get = function get(name) {
          return this.entries.get(name);
        };
        _proto.has = function has(name) {
          return this.entries.has(name);
        };
        _proto.list = function list() {
          return [].concat(this.entries.keys());
        };
        _proto.clear = function clear() {
          this.entries.clear();
        };
        return GMBundleRegistry;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMClassBase.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMBindState.ts', './GMEventHost.ts', './GMWatchHost.ts'], function (exports) {
  var _createClass, _asyncToGenerator, _regeneratorRuntime, cclegacy, GMBindState, GMEventHost, GMWatchHost;
  return {
    setters: [function (module) {
      _createClass = module.createClass;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      GMBindState = module.GMBindState;
    }, function (module) {
      GMEventHost = module.GMEventHost;
    }, function (module) {
      GMWatchHost = module.GMWatchHost;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e1a647/rpRMcp2R3hoOuJq6", "GMClassBase", undefined);
      /** 逻辑侧通用基类（不挂 Component）；自带实例事件 / watch；spawn 的孩子随本对象退场 */
      var GMClassBase = exports('GMClassBase', /*#__PURE__*/function () {
        function GMClassBase(bindId) {
          this._state = GMBindState.Uncreated;
          this._events = new GMEventHost(this);
          this._watches = new GMWatchHost();
          this._spawned = [];
          this.bindId = bindId;
        }
        var _proto = GMClassBase.prototype;
        _proto.getState = function getState() {
          return this._state;
        };
        _proto.setState = function setState(state) {
          this._state = state;
        }

        /** 监听（listener 为 this，需实现 on{EventName}）；销毁/解绑时自动卸 */;
        _proto.on = function on(eventNames, priority, once) {
          if (priority === void 0) {
            priority = 0;
          }
          if (once === void 0) {
            once = -1;
          }
          this._events.on(eventNames, priority, once);
          return this;
        };
        _proto.off = function off(eventNames) {
          this._events.off(eventNames);
          return this;
        };
        _proto.onAny = function onAny(priority, once) {
          if (priority === void 0) {
            priority = 0;
          }
          if (once === void 0) {
            once = -1;
          }
          this._events.onAny(priority, once);
          return this;
        };
        _proto.offAny = function offAny() {
          this._events.offAny();
          return this;
        };
        _proto.emit = function emit(event, data) {
          this._events.emit(event, data);
          return this;
        }

        /** 卸掉本实例通过 on/onAny 登记的监听 */;
        _proto.removeAllEvents = function removeAllEvents() {
          this._events.removeAll();
        }

        /** 字段监听（自动摘）；root 传 gd 或 gl */;
        _proto.watch = function watch(root, name, key, cb) {
          this._watches.watch(root, name, key, cb);
          return this;
        };
        _proto.unwatch = function unwatch(root, name, key, cb) {
          this._watches.unwatch(root, name, key, cb);
          return this;
        };
        _proto.removeAllWatches = function removeAllWatches() {
          this._watches.removeAll();
        }

        /** 带参初始化；与 onInit 独立。spawn(child, parm) 会调 */;
        /** 登记包内逻辑对象；本对象退场时先拆孩子。parm 有值则当场 init */
        _proto.spawn = function spawn(child, parm) {
          this._spawned.push(child);
          if (parm !== undefined) child.init == null || child.init(parm);
          return child;
        }

        /** 逆序拆 spawn：卸 watch/事件，再调 onRemove */;
        _proto.disposeSpawned = function disposeSpawned() {
          for (var i = this._spawned.length - 1; i >= 0; i--) {
            var child = this._spawned[i];
            child.disposeSpawned();
            child.removeAllWatches();
            child.removeAllEvents();
            var fn = child.onRemove;
            if (typeof fn === 'function') fn.call(child);
          }
          this._spawned.length = 0;
        }

        /** 若子类实现了对应钩子则 await 调用 */;
        _proto.invoke = /*#__PURE__*/
        function () {
          var _invoke = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(hook, ctx) {
            var fn;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  fn = this[hook];
                  if (!(typeof fn !== 'function')) {
                    _context.next = 3;
                    break;
                  }
                  return _context.abrupt("return");
                case 3:
                  if (!(hook === 'onBind' || hook === 'onUnbind')) {
                    _context.next = 8;
                    break;
                  }
                  _context.next = 6;
                  return fn.call(this, ctx);
                case 6:
                  _context.next = 10;
                  break;
                case 8:
                  _context.next = 10;
                  return fn.call(this);
                case 10:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));
          function invoke(_x, _x2) {
            return _invoke.apply(this, arguments);
          }
          return invoke;
        }();
        _createClass(GMClassBase, [{
          key: "state",
          get: function get() {
            return this._state;
          }
        }]);
        return GMClassBase;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMCocosResource.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _asyncToGenerator, _regeneratorRuntime, cclegacy, assetManager;
  return {
    setters: [function (module) {
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      assetManager = module.assetManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "621a9fC8n9K/Lclmqm24VlD", "GMCocosResource", undefined);
      /** 基于 assetManager 的 Bundle 加载/释放 */
      var GMCocosResource = exports('GMCocosResource', /*#__PURE__*/function () {
        function GMCocosResource() {
          this.cache = new Map();
        }
        var _proto = GMCocosResource.prototype;
        _proto.hasBundle = function hasBundle(name) {
          return !!assetManager.getBundle(name) || this.cache.has(name);
        };
        _proto.getBundle = function getBundle(name) {
          var _ref, _assetManager$getBund;
          return (_ref = (_assetManager$getBund = assetManager.getBundle(name)) != null ? _assetManager$getBund : this.cache.get(name)) != null ? _ref : null;
        };
        _proto.loadBundle = function loadBundle(name, onComplete, onProgress) {
          var _this = this;
          var existing = assetManager.getBundle(name);
          if (existing) {
            this.cache.set(name, existing);
            onComplete(null);
            return;
          }
          console.info('[gmajor] loadBundle', name);
          // 对外 onProgress；对接引擎时映射为 onFileProgress
          assetManager.loadBundle(name, {
            onFileProgress: onProgress
          }, function (err, bundle) {
            if (err || !bundle) {
              onComplete(err != null ? err : new Error("[GMCocosResource] loadBundle \u5931\u8D25: " + name));
              return;
            }
            _this.cache.set(name, bundle);
            onComplete(null);
          });
        };
        _proto.load = function load(bundleName, path, type, onComplete, onProgress) {
          var bundle = this.getBundle(bundleName);
          if (!bundle) return onComplete(new Error("[GMCocosResource] Bundle \u672A\u52A0\u8F7D: " + bundleName));
          var done = function done(err, asset) {
            if (err || !asset) return onComplete(err != null ? err : new Error("[GMCocosResource] load \u5931\u8D25: " + bundleName + "/" + path));
            onComplete(null, asset);
          };
          if (onProgress) bundle.load(path, type, onProgress, done);else bundle.load(path, type, done);
        };
        _proto.releaseBundle = /*#__PURE__*/function () {
          var _releaseBundle = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(name) {
            var _assetManager$getBund2;
            var bundle;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  bundle = (_assetManager$getBund2 = assetManager.getBundle(name)) != null ? _assetManager$getBund2 : this.cache.get(name);
                  if (bundle) {
                    _context.next = 3;
                    break;
                  }
                  return _context.abrupt("return");
                case 3:
                  console.info('[gmajor] releaseBundle', name);
                  assetManager.removeBundle(bundle);
                  this.cache["delete"](name);
                case 6:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));
          function releaseBundle(_x) {
            return _releaseBundle.apply(this, arguments);
          }
          return releaseBundle;
        }();
        return GMCocosResource;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMComponent.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMEventHost.ts', './GMWatchHost.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Component, GMEventHost, GMWatchHost;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      GMEventHost = module.GMEventHost;
    }, function (module) {
      GMWatchHost = module.GMWatchHost;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "72fa1cQMTBExqANcbnHA4bq", "GMComponent", undefined);
      var ccclass = _decorator.ccclass;

      /**
       * UI 通用基类（挂 Component）。
       * 业务写 onInit/onStart/onRemove；不要重写 onLoad/start/onDestroy。
       */
      var GMComponent = exports('GMComponent', (_dec = ccclass('GMComponent'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GMComponent, _Component);
        function GMComponent() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this._events = void 0;
          // onLoad 里创建
          _this._watches = void 0;
          return _this;
        }
        var _proto = GMComponent.prototype;
        // 入树后由 createTs 带参调用；与 onInit 独立
        _proto.onLoad = function onLoad() {
          var _this$onInit;
          // 引擎回调；业务用 onInit，不要重写
          this._events = new GMEventHost(this);
          this._watches = new GMWatchHost();
          (_this$onInit = this.onInit) == null || _this$onInit.call(this);
        };
        _proto.start = function start() {
          var _this$onStart;
          // 引擎回调；业务用 onStart，不要重写
          (_this$onStart = this.onStart) == null || _this$onStart.call(this);
        };
        _proto.onDestroy = function onDestroy() {
          var _this$_watches, _this$onRemove;
          // 引擎回调；业务用 onRemove，不要重写
          (_this$_watches = this._watches) == null || _this$_watches.removeAll();
          this._events.removeAll();
          (_this$onRemove = this.onRemove) == null || _this$onRemove.call(this);
        }

        /** 监听（listener 为 this，需实现 on{EventName}）；节点销毁时自动卸 */;
        _proto.on = function on(eventNames, priority, once) {
          if (priority === void 0) {
            priority = 0;
          }
          if (once === void 0) {
            once = -1;
          }
          this._events.on(eventNames, priority, once);
          return this;
        };
        _proto.off = function off(eventNames) {
          this._events.off(eventNames);
          return this;
        };
        _proto.onAny = function onAny(priority, once) {
          if (priority === void 0) {
            priority = 0;
          }
          if (once === void 0) {
            once = -1;
          }
          this._events.onAny(priority, once);
          return this;
        };
        _proto.offAny = function offAny() {
          this._events.offAny();
          return this;
        };
        _proto.emit = function emit(event, data) {
          this._events.emit(event, data);
          return this;
        };
        _proto.removeAllEvents = function removeAllEvents() {
          this._events.removeAll();
        }

        /** 字段监听（节点销毁时自动卸）；root 传 gd 或 gl */;
        _proto.watch = function watch(root, name, key, cb) {
          this._watches.watch(root, name, key, cb);
          return this;
        };
        _proto.unwatch = function unwatch(root, name, key, cb) {
          this._watches.unwatch(root, name, key, cb);
          return this;
        };
        _proto.removeAllWatches = function removeAllWatches() {
          this._watches.removeAll();
        };
        return GMComponent;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMCoreBundle.ts", ['cc'], function (exports) {
  var cclegacy, settings, assetManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      settings = module.settings;
      assetManager = module.assetManager;
    }],
    execute: function () {
      exports('loadCoreBundle', loadCoreBundle);
      cclegacy._RF.push({}, "cda1dALvL1O+aD1qIUs0im5", "GMCoreBundle", undefined);
      /** 框架自带预制体所在 Bundle（源目录 gmajor/prefabs）。PfGM* 常被代码按 uuid 动态加载，不放进 Bundle 就不会被打进包 */
      var CORE_BUNDLE = exports('CORE_BUNDLE', 'GMUI');
      var done = false;

      /** 开机时加载。工程里没有这个 Bundle（旧版本、某些预览）就当已完成 */
      function loadCoreBundle(onComplete) {
        if (done) return onComplete(null);
        var known = settings.querySettings('assets', 'projectBundles');
        if (known && known.length && known.indexOf(CORE_BUNDLE) < 0) {
          done = true;
          return onComplete(null);
        }
        assetManager.loadBundle(CORE_BUNDLE, function (err) {
          if (err) return onComplete(err);
          done = true;
          onComplete(null);
        });
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMEventHost.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports('bindGMEvents', bindGMEvents);
      cclegacy._RF.push({}, "81513P4h8RJZKWLfjdWGbLS", "GMEventHost", undefined);
      /**
       * 实例级事件能力（内部复用，不从 index 导出）。
       * 由 GMLauncher 注入全局 GMEventManager，避免与 gm 循环依赖。
       */
      var eventsRef = null;

      /** 启动时注入；仅 Launcher 调用 */
      function bindGMEvents(em) {
        eventsRef = em;
      }
      function em() {
        if (!eventsRef) throw new Error('[gmajor] 事件总线尚未就绪');
        return eventsRef;
      }

      /** 挂在 GMClassBase / GMComponent 上：记本实例监听，销毁时卸干净 */
      var GMEventHost = exports('GMEventHost', /*#__PURE__*/function () {
        function GMEventHost(target) {
          this.names = [];
          this.any = false;
          this.target = target;
        }
        var _proto = GMEventHost.prototype;
        _proto.on = function on(eventNames, priority, once) {
          if (priority === void 0) {
            priority = 0;
          }
          if (once === void 0) {
            once = -1;
          }
          var list = typeof eventNames === 'string' ? [eventNames] : eventNames;
          for (var _iterator = _createForOfIteratorHelperLoose(list), _step; !(_step = _iterator()).done;) {
            var name = _step.value;
            if (this.names.indexOf(name) < 0) this.names.push(name);
          }
          em().on(list, this.target, priority, once);
          return this;
        };
        _proto.off = function off(eventNames) {
          var list = typeof eventNames === 'string' ? [eventNames] : eventNames;
          em().off(list, this.target);
          for (var _iterator2 = _createForOfIteratorHelperLoose(list), _step2; !(_step2 = _iterator2()).done;) {
            var name = _step2.value;
            var i = this.names.indexOf(name);
            if (i > -1) this.names.splice(i, 1);
          }
          return this;
        };
        _proto.onAny = function onAny(priority, once) {
          if (priority === void 0) {
            priority = 0;
          }
          if (once === void 0) {
            once = -1;
          }
          this.any = true;
          em().onAny(this.target, priority, once);
          return this;
        };
        _proto.offAny = function offAny() {
          this.any = false;
          em().offAny(this.target);
          return this;
        };
        _proto.emit = function emit(event, data) {
          em().emit(event, data);
          return this;
        }

        /** 卸掉本实例登记过的监听 */;
        _proto.removeAll = function removeAll() {
          if (this.names.length) {
            em().off(this.names, this.target);
            this.names.length = 0;
          }
          if (this.any) {
            em().offAny(this.target);
            this.any = false;
          }
        };
        return GMEventHost;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMEventManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "61490Y+hTZPwaGOufw2Owtn", "GMEventManager", undefined);
      /**
       * 全局事件管理（参考 SpiderClub / Crazy777 EventManager）。
       * - 监听对象实现 on{EventName} 或 onAnyEvent；也可直接传函数
       * - 事件名首字母必须大写；回调返回 true 则拦截后续监听
       * - priority 越大越先收到；once=-1 常驻，>0 为剩余可触发次数
       */
      var GMEventManager = exports('GMEventManager', /*#__PURE__*/function () {
        function GMEventManager() {
          this.events = {};
          this.targets = [];
        }
        var _proto = GMEventManager.prototype;
        // onAny：监听所有消息
        /** 监听全部事件（走 on{Name} 或 onAnyEvent） */
        _proto.onAny = function onAny(listener, priority, once) {
          if (priority === void 0) {
            priority = 0;
          }
          if (once === void 0) {
            once = -1;
          }
          var info = this.targets.find(function (one) {
            return one.listener === listener;
          });
          if (info) {
            info.once = once;
            if (info.priority === priority) return this;
            info.priority = priority;
          } else {
            this.targets.push({
              listener: listener,
              priority: priority,
              once: once
            });
          }
          this.targets.sort(function (a, b) {
            return a.priority - b.priority;
          });
          return this;
        };
        _proto.offAny = function offAny(listener) {
          var idx = this.targets.findIndex(function (one) {
            return one.listener === listener;
          });
          if (idx > -1) this.targets.splice(idx, 1);
          return this;
        }

        // eventNames 首字母大写；listener 为 on{Name}/onAnyEvent 对象或函数
        ;

        _proto.on = function on(eventNames, listener, priority, once) {
          if (priority === void 0) {
            priority = 0;
          }
          if (once === void 0) {
            once = -1;
          }
          var names = typeof eventNames === 'string' ? [eventNames] : eventNames;
          for (var _iterator = _createForOfIteratorHelperLoose(names), _step; !(_step = _iterator()).done;) {
            var _eventName = _step.value;
            var list = this._checkAndGetListeners(_eventName, listener);
            var existing = list.find(function (one) {
              return one.listener === listener;
            });
            if (existing) {
              existing.once = once;
              if (existing.priority === priority) continue;
              existing.priority = priority;
            } else {
              list.push({
                listener: listener,
                priority: priority,
                once: once
              });
            }
            list.sort(function (a, b) {
              return a.priority - b.priority;
            });
          }
          return this;
        };
        _proto.off = function off(eventNames, listener) {
          var names = typeof eventNames === 'string' ? [eventNames] : eventNames;
          for (var _iterator2 = _createForOfIteratorHelperLoose(names), _step2; !(_step2 = _iterator2()).done;) {
            var _eventName2 = _step2.value;
            var list = this.events[_eventName2] || [];
            var idx = list.findIndex(function (one) {
              return one.listener === listener;
            });
            if (idx > -1) list.splice(idx, 1);
          }
          return this;
        };
        _proto.offEvent = function offEvent(eventName) {
          delete this.events[eventName];
          return this;
        }

        /** 移除某 listener 的全部监听（含 onAny） */;
        _proto.offListener = function offListener(listener) {
          this.offAny(listener);
          for (var _i = 0, _Object$keys = Object.keys(this.events); _i < _Object$keys.length; _i++) {
            var _eventName3 = _Object$keys[_i];
            var list = this.events[_eventName3];
            var idx = list.findIndex(function (one) {
              return one.listener === listener;
            });
            if (idx > -1) list.splice(idx, 1);
          }
          return this;
        }

        /** @param event 事件对象，或 name + data */;
        _proto.emit = function emit(event, data) {
          var ev = typeof event === 'string' ? {
            name: event,
            data: data
          } : event;
          var eventName = ev.name;
          var handled = [];
          var eventInfos = this.events[eventName];
          if (eventInfos) {
            for (var i = eventInfos.length - 1; i >= 0; i--) {
              var one = eventInfos[i];
              var prevented = this._invoke(one.listener, eventName, ev);
              handled.push(one.listener);
              if (one.once > 0 && --one.once === 0) eventInfos.splice(i, 1);
              if (prevented === true) return this;
            }
          }
          for (var _i2 = this.targets.length - 1; _i2 >= 0; _i2--) {
            var _one = this.targets[_i2];
            if (handled.indexOf(_one.listener) >= 0) continue;
            var _prevented = this._invoke(_one.listener, eventName, ev);
            if (_one.once > 0 && --_one.once === 0) this.targets.splice(_i2, 1);
            if (_prevented === true) return this;
          }
          return this;
        };
        _proto.clear = function clear() {
          this.events = {};
          this.targets.length = 0;
        };
        _proto._checkAndGetListeners = function _checkAndGetListeners(eventName, listener) {
          if (!listener) throw new Error("[GMEventManager] No listener for " + eventName);
          if (!eventName) throw new Error('[GMEventManager] eventName is empty');
          if (eventName[0] !== eventName[0].toUpperCase()) {
            throw new Error("[GMEventManager] First char of " + eventName + " must be upper case");
          }
          if (typeof listener !== 'function') {
            var obj = listener;
            if (!(obj["on" + eventName] || obj.onAnyEvent)) {
              throw new Error("[GMEventManager] No on" + eventName + " or onAnyEvent on listener");
            }
          }
          if (!this.events[eventName]) this.events[eventName] = [];
          return this.events[eventName];
        };
        _proto._invoke = function _invoke(listener, eventName, ev) {
          var _obj$fn;
          if (typeof listener === 'function') {
            return listener(ev);
          }
          var obj = listener;
          var fn = obj["on" + eventName] ? "on" + eventName : 'onAnyEvent';
          return (_obj$fn = obj[fn]) == null ? void 0 : _obj$fn.call(obj, ev);
        };
        return GMEventManager;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMKvStore.ts", ['cc'], function (exports) {
  var cclegacy, sys;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a18e6wvfTRLCpxR6PKg1rGT", "GMKvStore", undefined);
      var ENVELOPE = 1; // 整仓格式；变了才升

      /** localStorage 信封读写（LocalStore / web 假服共用） */
      var GMKvStore = exports('GMKvStore', /*#__PURE__*/function () {
        function GMKvStore(prefix) {
          this.prefix = prefix;
        }
        var _proto = GMKvStore.prototype;
        _proto.read = function read(tree) {
          var _this$ls;
          var raw = (_this$ls = this.ls()) == null ? void 0 : _this$ls.getItem(this.key(tree));
          if (!raw) return null;
          try {
            var pack = JSON.parse(raw);
            if (pack.envelope !== undefined && pack.envelope !== ENVELOPE) return null;
            if (typeof pack.v !== 'number' || !pack.data || typeof pack.data !== 'object') return null;
            return {
              v: pack.v,
              data: pack.data
            };
          } catch (_unused) {
            return null;
          }
        };
        _proto.write = function write(tree, pack) {
          var _this$ls2;
          (_this$ls2 = this.ls()) == null || _this$ls2.setItem(this.key(tree), JSON.stringify({
            envelope: ENVELOPE,
            v: pack.v,
            data: pack.data
          }));
        };
        _proto.remove = function remove(tree) {
          var _this$ls3;
          (_this$ls3 = this.ls()) == null || _this$ls3.removeItem(this.key(tree));
        };
        _proto.key = function key(tree) {
          return this.prefix + "." + tree;
        };
        _proto.ls = function ls() {
          var _sys$localStorage;
          return (_sys$localStorage = sys.localStorage) != null ? _sys$localStorage : null;
        };
        return GMKvStore;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMLauncher.ts", ['cc', './GMBinder.ts', './GMBundleRegistry.ts', './GMCocosResource.ts', './GMEventHost.ts', './GMEventManager.ts', './GMStoreHub.ts', './GMUIManager.ts', './GMPlatformCreate.ts', './GMSkin.ts', './GMCoreBundle.ts'], function (exports) {
  var cclegacy, GMBinder, GMBundleRegistry, GMCocosResource, bindGMEvents, GMEventManager, GMStoreHub, GMUIManager, createPlatform, loadSkin, loadCoreBundle;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      GMBinder = module.GMBinder;
    }, function (module) {
      GMBundleRegistry = module.GMBundleRegistry;
    }, function (module) {
      GMCocosResource = module.GMCocosResource;
    }, function (module) {
      bindGMEvents = module.bindGMEvents;
    }, function (module) {
      GMEventManager = module.GMEventManager;
    }, function (module) {
      GMStoreHub = module.GMStoreHub;
    }, function (module) {
      GMUIManager = module.GMUIManager;
    }, function (module) {
      createPlatform = module.createPlatform;
    }, function (module) {
      loadSkin = module.loadSkin;
    }, function (module) {
      loadCoreBundle = module.loadCoreBundle;
    }],
    execute: function () {
      exports('registerBundleEntry', registerBundleEntry);
      cclegacy._RF.push({}, "42c86OK1bBP/auCA0sm0zZ1", "GMLauncher", undefined);
      var version = exports('version', '0.5.0'); // 框架版本；升级时同时改 extensions/gmajor/package.json 的 version，并写 CHANGELOG.md

      /** 全局核心句柄（模块加载时创建；用法 gm.binder / gm.events / gm.ui / gd / gl / gu / gp …） */
      var events = new GMEventManager();
      bindGMEvents(events);
      var resource = new GMCocosResource();
      var registry = new GMBundleRegistry();
      var binder = new GMBinder(registry, resource, events);
      var ui = new GMUIManager(resource);
      ui.bindPixelFit(); // 设计分辨率 720×1280，宽适配
      var store = new GMStoreHub();
      binder.attachUI(ui);
      binder.attachStore(store);
      var gd = exports('gd', store.gd); // === gm.data；全是 server
      var gl = exports('gl', store.gl); // === gm.local；全是本地
      var gu = exports('gu', ui); // === gm.ui
      var gp = exports('gp', createPlatform(events)); // === gm.platform；import 时认环境；推送进 events

      /** 只打日志，不拦截：app 声明的框架「主.次」与当前不同则警告，由人看 CHANGELOG.md 判断 */
      function checkVersion(declared) {
        if (!declared) return console.info('[gm.boot] 框架版本', version, 'app 未声明 version.gmajor');
        var mm = function mm(v) {
          return v.split('.').slice(0, 2).join('.');
        };
        if (mm(declared) === mm(version)) return console.info('[gm.boot] 框架版本', version, 'app 声明', declared);
        console.warn('[gm.boot] 框架版本', version, '与 app 声明', declared, '的主.次不同；若异常请对照 CHANGELOG.md');
      }
      function boot(game, a, b, c) {
        var hasOpts = typeof a !== 'function';
        var opts = hasOpts ? a : undefined;
        var onComplete = hasOpts ? b : a;
        var onProgress = hasOpts ? c : b;
        var role = (opts == null ? void 0 : opts.role) || gp.params.role || 'web';
        checkVersion(game.version.gmajor);
        var entry = game.entry[role];
        if (!entry) return onComplete(new Error("[gm.boot] \u65E0\u5165\u53E3 role=" + role));
        var names = game.boot.slice();
        if (names.indexOf(entry) < 0) names.push(entry);
        console.info('[gm.boot] role', role, 'packs', names.join(','));
        loadCoreBundle(function (coreErr) {
          if (coreErr) return onComplete(coreErr);
          loadSkin(function (err) {
            if (err) return onComplete(err);
            binder.bindInOrder(names, onComplete, onProgress);
          });
        });
      }

      /** GMajor 全局单例 */
      var gm = exports('gm', {
        events: events,
        resource: resource,
        registry: registry,
        binder: binder,
        ui: ui,
        data: gd,
        local: gl,
        platform: gp,
        version: version,
        boot: boot
      });
      var w = globalThis;
      w.gm = gm; // 预览控制台可直接敲
      w.gd = gd;
      w.gl = gl;
      w.gu = gu;
      w.gp = gp;

      /** Bundle 入口自登记（写到 gm.registry） */
      function registerBundleEntry(name, entry) {
        gm.registry.register(name, entry);
      }
      console.info('[gmajor] 核心已就绪', version);
      console.info('[gp]', gp.id, 'hasWindow', gp.hasWindow, 'role', gp.params.role || 'web');
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMLayer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMComponent.ts'], function (exports) {
  var _inheritsLoose, _createForOfIteratorHelperLoose, cclegacy, _decorator, Tween, tween, Vec3, view, UITransform, instantiate, UIOpacity, GMComponent;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Tween = module.Tween;
      tween = module.tween;
      Vec3 = module.Vec3;
      view = module.view;
      UITransform = module.UITransform;
      instantiate = module.instantiate;
      UIOpacity = module.UIOpacity;
    }, function (module) {
      GMComponent = module.GMComponent;
    }],
    execute: function () {
      exports('bindLayerMaskTpl', bindLayerMaskTpl);
      var _dec, _class;
      cclegacy._RF.push({}, "a7df0q8QPZBFbKJBMBeVK9p", "GMLayer", undefined);
      var ccclass = _decorator.ccclass;
      var ENTER_TOTAL = 0.5; // 与 panel 0.35+0.15 对齐
      var LEAVE_TOTAL = 0.33; // 与 panel 0.13+0.2 对齐

      var layerMaskTpl = null; // Overlay 上的隐藏模板

      /** Overlay 建好后挂上 mask 模板，供 layer 克隆 */
      function bindLayerMaskTpl(node) {
        layerMaskTpl = node;
      }

      /**
       * Layer 脚本基类。`Ly*` 关联脚本继承本类（不要直接 extends Component / GMComponent）。
       * 根下必须有 panel；mask 运行时克隆。场景 GMScene 不走这套。
       */
      var GMLayer = exports('GMLayer', (_dec = ccclass('GMLayer'), _dec(_class = /*#__PURE__*/function (_GMComponent) {
        _inheritsLoose(GMLayer, _GMComponent);
        function GMLayer() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMComponent.call.apply(_GMComponent, [this].concat(args)) || this;
          _this.useLayerChrome = true;
          // GMScene 关掉
          _this.panel = null;
          _this.mask = null;
          return _this;
        }
        var _proto = GMLayer.prototype;
        _proto.onLoad = function onLoad() {
          // 先搭 mask/panel，再 onInit（业务挂 panel）
          if (this.useLayerChrome) this.ensureLayerChrome();
          _GMComponent.prototype.onLoad.call(this);
        };
        _proto.onEnter = function onEnter(done) {
          if (!this.panel) return done();
          var left = this.mask ? 2 : 1;
          var tick = function tick() {
            if (--left <= 0) done();
          };
          this.animateEnter(this.panel, tick);
          if (this.mask) this.fadeMask(255, ENTER_TOTAL, tick);
        };
        _proto.onLeave = function onLeave(done) {
          if (!this.panel) return done();
          var left = this.mask ? 2 : 1;
          var tick = function tick() {
            if (--left <= 0) done();
          };
          this.animateLeave(this.panel, tick);
          if (this.mask) this.fadeMask(0, LEAVE_TOTAL, tick);
        }

        /** Alert 等只动面板时复用同一套时长 */;
        _proto.animateEnter = function animateEnter(target, done) {
          Tween.stopAllByTarget(target);
          target.setScale(0, 0, 1);
          tween(target).to(0.35, {
            scale: new Vec3(1.1, 1.1, 1)
          }).to(0.15, {
            scale: Vec3.ONE
          }).call(done).start();
        };
        _proto.animateLeave = function animateLeave(target, done) {
          Tween.stopAllByTarget(target);
          var s = target.scale;
          tween(target).to(0.13, {
            scale: new Vec3(1.1 * s.x, 1.1 * s.y, 1)
          }).to(0.2, {
            scale: new Vec3(0, 0, 1)
          }).call(done).start();
        };
        _proto.ensureLayerChrome = function ensureLayerChrome() {
          var _this$node$getCompone, _layerMaskTpl;
          var panel = this.node.getChildByName('panel');
          if (!panel) {
            var msg = "[gm.ui] layer \u7F3A\u5C11 panel\uFF1A" + this.node.name + "\uFF08Ly \u9884\u5236\u4F53\u751F\u6210\u65F6\u5C31\u5FC5\u987B\u5E26 panel\uFF0C\u89C1 tools/create-ly-prefab.mjs\uFF09";
            console.error(msg);
            throw new Error(msg);
          }
          this.panel = panel;
          panel.setScale(0, 0, 1);
          var size = view.getVisibleSize();
          var w = size.width;
          var h = size.height;
          var uit = (_this$node$getCompone = this.node.getComponent(UITransform)) != null ? _this$node$getCompone : this.node.addComponent(UITransform);
          uit.setContentSize(w, h);
          if (!((_layerMaskTpl = layerMaskTpl) != null && _layerMaskTpl.isValid)) {
            console.error('[gm.ui] layer mask 模板未就绪', this.node.name);
            return;
          }
          var mask = instantiate(layerMaskTpl);
          mask.name = 'mask';
          mask.active = true;
          mask.parent = this.node;
          mask.setSiblingIndex(0);
          this.applyNodeLayer(mask, this.node.layer);
          this.fitMask(mask, w, h);
          this.mask = mask;
        };
        _proto.fitMask = function fitMask(mask, w, h) {
          var _mask$getComponent, _mask$getComponent2;
          var uit = (_mask$getComponent = mask.getComponent(UITransform)) != null ? _mask$getComponent : mask.addComponent(UITransform);
          uit.setContentSize(w, h);
          var op = (_mask$getComponent2 = mask.getComponent(UIOpacity)) != null ? _mask$getComponent2 : mask.addComponent(UIOpacity);
          op.opacity = 0;
          Tween.stopAllByTarget(op);
        };
        _proto.fadeMask = function fadeMask(to, duration, done) {
          var _this$mask, _this$mask$getCompone;
          if (!((_this$mask = this.mask) != null && _this$mask.isValid)) return done();
          var op = (_this$mask$getCompone = this.mask.getComponent(UIOpacity)) != null ? _this$mask$getCompone : this.mask.addComponent(UIOpacity);
          Tween.stopAllByTarget(op);
          tween(op).to(duration, {
            opacity: to
          }).call(done).start();
        };
        _proto.applyNodeLayer = function applyNodeLayer(node, layer) {
          node.layer = layer;
          for (var _iterator = _createForOfIteratorHelperLoose(node.children), _step; !(_step = _iterator()).done;) {
            var child = _step.value;
            this.applyNodeLayer(child, layer);
          }
        };
        return GMLayer;
      }(GMComponent)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMOverlayHost.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "c42f81bDmNAGbLRf1yeOgG0", "GMOverlayHost", undefined);
      var ccclass = _decorator.ccclass;

      /** persist Overlay 上的调度器：具名 delay，可取消（loading 显形/超时） */
      var GMOverlayHost = exports('GMOverlayHost', (_dec = ccclass('GMOverlayHost'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GMOverlayHost, _Component);
        function GMOverlayHost() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.named = new Map();
          return _this;
        }
        var _proto = GMOverlayHost.prototype;
        _proto.scheduleNamed = function scheduleNamed(name, delay, cb) {
          var _this2 = this;
          this.unscheduleNamed(name);
          var wrap = function wrap() {
            _this2.named["delete"](name);
            cb();
          };
          this.named.set(name, wrap);
          this.scheduleOnce(wrap, delay);
        };
        _proto.unscheduleNamed = function unscheduleNamed(name) {
          var wrap = this.named.get(name);
          if (!wrap) return;
          this.unschedule(wrap);
          this.named["delete"](name);
        };
        return GMOverlayHost;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMPlatform.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports({
        readUrlParams: readUrlParams,
        toGpEventName: toGpEventName,
        toPascalName: toPascalName
      });
      cclegacy._RF.push({}, "8d9b2wxXk9AorfIERITFBUW", "GMPlatform", undefined);
      /**
       * 平台身份 + 本进程 TS↔外面的通道。游戏只握 gp。
       * 公开：call 问并等回；send 只发。主动推不走 gp.on，进 gm.events，名前缀 Gp。
       * 具名方法以后封装 call/send，二次处理后再 onComplete；msgid 不外露。
       */
      // 普通对象；Web/Electron 填 URL query
      var CALL_TIMEOUT_MS = 10000; // call 超时清 pending，避免泄漏

      /** 从当前页 URL 取 query；无 location 则空表 */
      function readUrlParams() {
        var _location;
        var href = (_location = globalThis.location) == null ? void 0 : _location.href;
        if (!href) return {};
        try {
          var out = {};
          new URL(href).searchParams.forEach(function (v, k) {
            out[k] = v;
          });
          return out;
        } catch (_unused) {
          return {};
        }
      }

      /** ui-closed / getClip → UiClosed / GetClip */
      function toPascalName(name) {
        var parts = name.split(/[-_.\s]+/);
        var out = '';
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          if (!p) continue;
          out += p.charAt(0).toUpperCase() + p.slice(1);
        }
        if (out) return out;
        if (!name) return name;
        return name.charAt(0).toUpperCase() + name.slice(1);
      }

      /** 平台推送事件名：大类前缀 Gp + 大驼峰。已是 GpX 则不叠 */
      function toGpEventName(msgName) {
        var pascal = toPascalName(msgName);
        if (/^Gp[A-Z]/.test(pascal)) return pascal;
        return 'Gp' + pascal;
      }

      /** 平台基类；Web 无通道。Electron/原生子类 override wire*，入站调 recv */
      var GMPlatform = exports('GMPlatform', /*#__PURE__*/function () {
        // 启动器注入；推送走这里

        function GMPlatform(id,
        // web / electron / wechat / android / ios
        params,
        // 启动参数，如 ?role=
        hasWindow // 能否开第二扇 OS 窗；仅 electron
        ) {
          if (hasWindow === void 0) {
            hasWindow = false;
          }
          this.seq = 0;
          // msgid 序号
          this.pending = {};
          // 等待回包的 call
          this.pendingTimer = {};
          // 对应超时器
          this.events = null;
          this.id = id;
          this.params = params;
          this.hasWindow = hasWindow;
        }

        /** 仅 GMLauncher 调用，接到全局事件总线 */
        var _proto = GMPlatform.prototype;
        _proto.attachEvents = function attachEvents(events) {
          this.events = events;
        }

        /** 问外面并等回包。onComplete(err, data)；无通道立刻失败，不挡开机 */;
        _proto.call = function call(name, data, onComplete) {
          var _this = this;
          if (!name) return onComplete(new Error('[gp.call] 缺 name'));
          var msgid = this.nextId();
          this.pending[msgid] = onComplete;
          this.pendingTimer[msgid] = setTimeout(function () {
            _this.finish(msgid, new Error("[gp.call] \u8D85\u65F6 " + name));
          }, CALL_TIMEOUT_MS);
          if (this.wireCall({
            msgid: msgid,
            msgName: name,
            msgData: data != null ? data : {}
          })) return; // 子类已发出
          this.finish(msgid, new Error("[gp.call] \u65E0\u901A\u9053 " + name)); // 预览/Web
        }

        /** 只发不等回。埋点、ready 用这个；无通道则忽略 */;
        _proto.send = function send(name, data) {
          if (!name) return;
          this.wireSend({
            msgid: '',
            msgName: name,
            msgData: data != null ? data : {}
          });
        }

        /** 仅平台子类：ipc/jsb 回调里 this.recv(原文)。游戏禁止 gp.recv */;
        _proto.recv = function recv(raw) {
          var msg = this.decodeMsg(raw);
          if (!msg) return;
          if (msg.msgid && this.pending[msg.msgid]) {
            var pack = msg.msgData && typeof msg.msgData === 'object' && !Array.isArray(msg.msgData) ? msg.msgData : null;
            if (pack && typeof pack.error === 'string') return this.finish(msg.msgid, new Error(pack.error));
            return this.finish(msg.msgid, null, msg.msgData);
          }
          this.emitPush(msg.msgName, msg.msgData);
        }

        /** 真正发「问」：有 ipc/jsb 的子类 override，发出后 return true */;
        _proto.wireCall = function wireCall(_msg) {
          return false; // 基类=无通道
        }

        /** 真正发「扔」：有通道的子类 override，发出后 return true */;
        _proto.wireSend = function wireSend(_msg) {
          return false;
        };
        _proto.nextId = function nextId() {
          // 生成本次 call 的 msgid
          this.seq += 1;
          return 'p' + this.seq;
        }

        /** 结束一次 call：摘 pending、清超时、喊 onComplete */;
        _proto.finish = function finish(msgid, err, result) {
          var cb = this.pending[msgid];
          if (!cb) return;
          delete this.pending[msgid];
          var timer = this.pendingTimer[msgid];
          if (timer) {
            clearTimeout(timer);
            delete this.pendingTimer[msgid];
          }
          if (err) return cb(err);
          cb(null, result);
        }

        /** 把入站原文收成信封；字符串先 JSON.parse */;
        _proto.decodeMsg = function decodeMsg(raw) {
          var root = this.toObject(raw);
          if (!root || root instanceof Error || typeof root !== 'object' || Array.isArray(root)) return null;
          var o = root;
          if (typeof o.msgName !== 'string' || !o.msgName) return null;
          var msgid = typeof o.msgid === 'string' ? o.msgid : '';
          var msgData = o.msgData;
          if (typeof msgData === 'string') msgData = this.toObject(msgData); // 底层常再包一层 JSON 字符串
          if (msgData instanceof Error) return null;
          return {
            msgid: msgid,
            msgName: o.msgName,
            msgData: msgData
          };
        }

        /** 已是对象原样返回；字符串则 parse，失败返回 Error */;
        _proto.toObject = function toObject(raw) {
          if (typeof raw !== 'string') return raw;
          var text = raw.trim();
          if (!text) return {};
          try {
            return JSON.parse(text);
          } catch (_unused2) {
            console.error('[gp] 入站 JSON 无法解析');
            return new Error('[gp] 入站 JSON 无法解析');
          }
        }

        /** 主动推：gm.events.emit('Gp' + 大驼峰)；游戏 this.on('GpUiClosed') */;
        _proto.emitPush = function emitPush(msgName, data) {
          if (!this.events) return console.error('[gp] 事件总线未接');
          this.events.emit(toGpEventName(msgName), data);
        };
        return GMPlatform;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMPlatformAndroid.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMPlatform.ts'], function (exports) {
  var _inheritsLoose, cclegacy, GMPlatform;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      GMPlatform = module.GMPlatform;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c13f6B1koNE5vsMFRYXGBka", "GMPlatformAndroid", undefined);

      /** 安卓原生；schema 参数后补，本轮空表 */
      var GMPlatformAndroid = exports('GMPlatformAndroid', /*#__PURE__*/function (_GMPlatform) {
        _inheritsLoose(GMPlatformAndroid, _GMPlatform);
        function GMPlatformAndroid() {
          return _GMPlatform.call(this, 'android', {}, false) || this;
        }
        return GMPlatformAndroid;
      }(GMPlatform));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMPlatformCreate.ts", ['cc', './GMPlatformAndroid.ts', './GMPlatformElectron.ts', './GMPlatformIos.ts', './GMPlatformWeb.ts', './GMPlatformWechat.ts'], function (exports) {
  var cclegacy, sys, GMPlatformAndroid, GMPlatformElectron, GMPlatformIos, GMPlatformWeb, GMPlatformWechat;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      GMPlatformAndroid = module.GMPlatformAndroid;
    }, function (module) {
      GMPlatformElectron = module.GMPlatformElectron;
    }, function (module) {
      GMPlatformIos = module.GMPlatformIos;
    }, function (module) {
      GMPlatformWeb = module.GMPlatformWeb;
    }, function (module) {
      GMPlatformWechat = module.GMPlatformWechat;
    }],
    execute: function () {
      exports('createPlatform', createPlatform);
      cclegacy._RF.push({}, "e3518KXtKVGCB0uFxgZGhsc", "GMPlatformCreate", undefined);

      /** 先壳、再 sys、其余 web；不认 process.versions.electron */
      function createPlatform(events) {
        var p;
        if (GMPlatformElectron.hasShell()) p = new GMPlatformElectron();else {
          var plat = String(sys.platform).toLowerCase();
          var os = String(sys.os).toLowerCase();
          if (plat === 'wechat_game' || plat === 'wechat_mini_program') p = new GMPlatformWechat();else if (sys.isNative && (plat === 'android' || os === 'android')) p = new GMPlatformAndroid();else if (sys.isNative && (plat === 'ios' || os === 'ios')) p = new GMPlatformIos();else p = new GMPlatformWeb();
        }
        p.attachEvents(events);
        return p;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMPlatformElectron.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMPlatform.ts'], function (exports) {
  var _inheritsLoose, cclegacy, readUrlParams, GMPlatform;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      readUrlParams = module.readUrlParams;
      GMPlatform = module.GMPlatform;
    }],
    execute: function () {
      cclegacy._RF.push({}, "af1d45TcGFCxNnqExQVFhcY", "GMPlatformElectron", undefined);

      /** Electron 游戏壳；window.desktop 只在本类探测，其它模块走 gp */
      var GMPlatformElectron = exports('GMPlatformElectron', /*#__PURE__*/function (_GMPlatform) {
        _inheritsLoose(GMPlatformElectron, _GMPlatform);
        function GMPlatformElectron() {
          return _GMPlatform.call(this, 'electron', readUrlParams(), true) || this;
        }
        GMPlatformElectron.hasShell = function hasShell() {
          return !!globalThis.desktop;
        };
        return GMPlatformElectron;
      }(GMPlatform));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMPlatformIos.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMPlatform.ts'], function (exports) {
  var _inheritsLoose, cclegacy, GMPlatform;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      GMPlatform = module.GMPlatform;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d2407GGo5RF9wwdFhcYGRob", "GMPlatformIos", undefined);

      /** 苹果原生；schema 参数后补，本轮空表 */
      var GMPlatformIos = exports('GMPlatformIos', /*#__PURE__*/function (_GMPlatform) {
        _inheritsLoose(GMPlatformIos, _GMPlatform);
        function GMPlatformIos() {
          return _GMPlatform.call(this, 'ios', {}, false) || this;
        }
        return GMPlatformIos;
      }(GMPlatform));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMPlatformWeb.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMPlatform.ts'], function (exports) {
  var _inheritsLoose, cclegacy, readUrlParams, GMPlatform;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      readUrlParams = module.readUrlParams;
      GMPlatform = module.GMPlatform;
    }],
    execute: function () {
      cclegacy._RF.push({}, "9e0c31Cb1BBs8jZEhMUFRYX", "GMPlatformWeb", undefined);

      /** Creator 预览 / 纯浏览器 */
      var GMPlatformWeb = exports('GMPlatformWeb', /*#__PURE__*/function (_GMPlatform) {
        _inheritsLoose(GMPlatformWeb, _GMPlatform);
        function GMPlatformWeb() {
          return _GMPlatform.call(this, 'web', readUrlParams(), false) || this;
        }
        return GMPlatformWeb;
      }(GMPlatform));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMPlatformWechat.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMPlatform.ts'], function (exports) {
  var _inheritsLoose, cclegacy, GMPlatform;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      GMPlatform = module.GMPlatform;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b02e59kgXJD1er7FBUWFxgZ", "GMPlatformWechat", undefined);
      function readWxParams() {
        var _wx$getLaunchOptionsS;
        var wx = globalThis.wx;
        var query = wx == null || wx.getLaunchOptionsSync == null || (_wx$getLaunchOptionsS = wx.getLaunchOptionsSync()) == null ? void 0 : _wx$getLaunchOptionsS.query;
        if (!query) return {};
        var out = {};
        for (var k in query) out[k] = String(query[k]);
        return out;
      }

      /** 微信小游戏 / 小程序；启动参数只在本类读 wx */
      var GMPlatformWechat = exports('GMPlatformWechat', /*#__PURE__*/function (_GMPlatform) {
        _inheritsLoose(GMPlatformWechat, _GMPlatform);
        function GMPlatformWechat() {
          return _GMPlatform.call(this, 'wechat', readWxParams(), false) || this;
        }
        return GMPlatformWechat;
      }(GMPlatform));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMRemoteAdapter.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b52d95AHIdOb6PYD0fJsuYV", "GMRemoteAdapter", undefined);
      var USER_SEED = {
        v: 1,
        data: {
          id: 'u-1001',
          nickname: 'Farmer',
          level: 1,
          exp: 0,
          gold: 1000,
          energy: 100,
          lastOfflineAt: 0
        }
      };

      /** RemoteAdapter：调用形态像真服；web 用 localStorage 当假服 */
      var GMRemoteAdapter = exports('GMRemoteAdapter', /*#__PURE__*/function () {
        function GMRemoteAdapter(kv) {
          this.kv = kv;
        }
        var _proto = GMRemoteAdapter.prototype;
        _proto.pull = function pull(tree, onComplete) {
          var _pack;
          var pack = this.kv.read(tree);
          if (!pack && tree === 'User') {
            this.kv.write('User', USER_SEED);
            pack = USER_SEED;
          }
          onComplete(null, (_pack = pack) != null ? _pack : {
            v: 1,
            data: {}
          });
        };
        return GMRemoteAdapter;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMScene.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMLayer.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Tween, tween, UIOpacity, GMLayer;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Tween = module.Tween;
      tween = module.tween;
      UIOpacity = module.UIOpacity;
    }, function (module) {
      GMLayer = module.GMLayer;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "90086PkZBVEEq5UVgvSHG/D", "GMScene", undefined);
      var ccclass = _decorator.ccclass;

      /**
       * 场景关联脚本基类。`Sc*` 脚本继承本类。
       * 入场/退场默认改 Canvas 整体 opacity（不是 layer 的 scale）。
       */
      var GMScene = exports('GMScene', (_dec = ccclass('GMScene'), _dec(_class = /*#__PURE__*/function (_GMLayer) {
        _inheritsLoose(GMScene, _GMLayer);
        function GMScene() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMLayer.call.apply(_GMLayer, [this].concat(args)) || this;
          _this.useLayerChrome = false;
          return _this;
        }
        var _proto = GMScene.prototype;
        // 场景不套 mask/panel
        _proto.onEnter = function onEnter(done) {
          // 默认 opacity 0 → 255
          var op = this.ensureCanvasOpacity();
          Tween.stopAllByTarget(op);
          op.opacity = 0;
          tween(op).to(0.3, {
            opacity: 255
          }).call(done).start();
        };
        _proto.onLeave = function onLeave(done) {
          // 默认 opacity 255 → 0
          var op = this.ensureCanvasOpacity();
          Tween.stopAllByTarget(op);
          tween(op).to(0.3, {
            opacity: 0
          }).call(done).start();
        };
        _proto.ensureCanvasOpacity = function ensureCanvasOpacity() {
          var _this$node$scene$getC, _this$node$scene, _canvas$getComponent;
          var canvas = (_this$node$scene$getC = (_this$node$scene = this.node.scene) == null ? void 0 : _this$node$scene.getChildByName('Canvas')) != null ? _this$node$scene$getC : this.node;
          return (_canvas$getComponent = canvas.getComponent(UIOpacity)) != null ? _canvas$getComponent : canvas.addComponent(UIOpacity);
        };
        return GMScene;
      }(GMLayer)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMSkin.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, settings, assetManager, Texture2D, SpriteFrame;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      settings = module.settings;
      assetManager = module.assetManager;
      Texture2D = module.Texture2D;
      SpriteFrame = module.SpriteFrame;
    }],
    execute: function () {
      exports({
        applySkin: applySkin,
        loadSkin: loadSkin,
        skinFrame: skinFrame
      });
      cclegacy._RF.push({}, "b8e4cKhXXBPGYwzKm8Om30U", "GMSkin", undefined);
      /** 游戏界面图所在 Bundle。资源在 assets/game/bundles/Skin，不在 gmajor */
      var SKIN_BUNDLE = exports('SKIN_BUNDLE', 'Skin');
      var BUILTIN_WHITE = '7d8f9b89-4fd1-4c9f-a3ab-38ec7cded7ca@f9941'; // default_sprite_splash
      var frames = null;
      var waiters = null;
      var missingBundle = false;
      var logged = new Set();
      var white = null;
      /** 开机或使用方调用。没有 Skin 包也算完成，缺的槽用白图 */
      function loadSkin(onComplete) {
        if (frames) return onComplete(null);
        if (waiters) return waiters.push(onComplete);
        waiters = [onComplete];
        var known = settings.querySettings('assets', 'projectBundles'); // 工程里有哪些 Bundle；没有 Skin 就不去加载，免得打 404 红日志、弹预览错误框
        if (known && known.length && known.indexOf(SKIN_BUNDLE) < 0) {
          missingBundle = true;
          frames = new Map();
          noteMissing('*');
          finish(null);
          return;
        }
        assetManager.loadBundle(SKIN_BUNDLE, function (err, bundle) {
          if (err || !bundle) {
            console.warn('[Skin] 加载 Skin 包失败', err);
            missingBundle = true;
            frames = new Map();
            noteMissing('*');
            finish(null);
            return;
          }
          loadDeps(bundle, function () {
            return bundle.loadDir('', SpriteFrame, function (loadErr, assets) {
              frames = indexFrames(assets != null ? assets : [], bundle);
              if (!frames.size) {
                if (loadErr) console.warn('[Skin] 界面图加载失败', loadErr);
                missingBundle = true;
                noteMissing('*');
              }
              finish(null);
            });
          });
        });
      }

      /** Skin 的图和别的 Bundle 共用资源时，Creator 会把共用部分放到高优先级的包里，Skin 就依赖它。先把依赖的包加载好，不然 loadDir 会报 Please load bundle X first */
      function loadDeps(bundle, done) {
        var _deps;
        var deps = ((_deps = bundle.deps) != null ? _deps : []).filter(function (name) {
          return !assetManager.bundles.has(name);
        });
        if (!deps.length) return done();
        var left = deps.length;
        deps.forEach(function (name) {
          return assetManager.loadBundle(name, function (err) {
            if (err) console.warn('[Skin] 依赖包加载失败', name, err);
            if (--left === 0) done();
          });
        });
      }

      /** 已载入才有值。缺槽时是白图，不是 null */
      function skinFrame(name) {
        if (!frames) return null;
        return take(name);
      }

      /** 把槽贴到调用方。编辑器按路径取，播放用已载入的表 */
      function applySkin(name, apply) {
        if (frames) return apply(take(name));
        loadSkin(function () {
          return apply(take(name));
        });
      }
      function finish(err) {
        var _waiters;
        var pending = (_waiters = waiters) != null ? _waiters : [];
        waiters = null;
        pending.forEach(function (fn) {
          return fn(err);
        });
      }
      function indexFrames(assets, bundle) {
        var map = new Map();
        var byUuid = new Map(assets.map(function (frame) {
          return [frame.uuid, frame];
        }));
        for (var _iterator = _createForOfIteratorHelperLoose(bundle.getDirWithPath('', SpriteFrame)), _step; !(_step = _iterator()).done;) {
          var _byUuid$get;
          var info = _step.value;
          var name = info.path.split('/').find(function (part) {
            return part && part !== 'spriteFrame';
          });
          var _frame = (_byUuid$get = byUuid.get(info.uuid)) != null ? _byUuid$get : assetManager.assets.get(info.uuid);
          if (name && _frame) map.set(name, _frame);
        }
        if (map.size) return map;
        for (var _iterator2 = _createForOfIteratorHelperLoose(assets), _step2; !(_step2 = _iterator2()).done;) {
          var _frame2 = _step2.value;
          var _name = _frame2.name.replace(/\/spriteFrame$/, '').replace(/\.png$/i, '');
          if (_name && _name !== 'spriteFrame') map.set(_name, _frame2);
        }
        return map;
      }
      function take(name) {
        var _frames;
        var hit = (_frames = frames) == null ? void 0 : _frames.get(name);
        if (hit) return hit;
        noteMissing(missingBundle ? '*' : name);
        return whiteFrame();
      }
      function noteMissing(key) {
        if (logged.has(key)) return;
        logged.add(key);
        if (key === '*') console.info('[Skin] 没有 Skin 包，用内置白图'); // 整包没有是正常状态（新 app 还没出图），不当警告
        else console.warn('[Skin] 缺', key); // 包在但缺这一张，才是要补的
      }

      function whiteFrame() {
        var _white;
        if ((_white = white) != null && _white.isValid) return white;
        var builtin = assetManager.assets.get(BUILTIN_WHITE);
        if (builtin != null && builtin.isValid) {
          white = builtin;
          return builtin;
        }
        assetManager.loadAny({
          uuid: BUILTIN_WHITE
        }, function (err, asset) {
          if (!err && asset) white = asset;
        });
        white = makeWhite();
        return white;
      }
      function makeWhite() {
        var tex = new Texture2D();
        tex.reset({
          width: 2,
          height: 2,
          format: Texture2D.PixelFormat.RGBA8888
        });
        tex.uploadData(new Uint8Array(16).fill(255));
        var frame = new SpriteFrame();
        frame.texture = tex;
        return frame;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMStoreHub.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMKvStore.ts', './GMRemoteAdapter.ts'], function (exports) {
  var _extends, cclegacy, GMKvStore, GMRemoteAdapter;
  return {
    setters: [function (module) {
      _extends = module.extends;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      GMKvStore = module.GMKvStore;
    }, function (module) {
      GMRemoteAdapter = module.GMRemoteAdapter;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d6f0aOxjiVMeZGtO0flwIJv", "GMStoreHub", undefined);
      var SCHEMA = 1; // 第一刀各树默认 version

      // 当场调；新旧 === 不喊

      // 树名 → 字段 → 回调
      /** 数据枢纽：gd / gl 两根 + bind 建树 / unbind 拆树 + 字段 watch */
      var GMStoreHub = exports('GMStoreHub', /*#__PURE__*/function () {
        function GMStoreHub() {
          this.gd = void 0;
          this.gl = void 0;
          this.dataTrees = new Map();
          this.localTrees = new Map();
          this.dataWatch = new Map();
          this.localWatch = new Map();
          this.localKv = new GMKvStore('gm.gl');
          this.remote = new GMRemoteAdapter(new GMKvStore('gm.remote'));
          this.gd = this.makeDataRoot();
          this.gl = this.makeLocalRoot();
        }
        var _proto = GMStoreHub.prototype;
        _proto.onBind = function onBind(name) {
          this.ensureTree(this.dataTrees, name, false, false);
          this.ensureTree(this.localTrees, name, true, true);
        };
        _proto.onUnbind = function onUnbind(name) {
          this.clearWatch(this.dataWatch, name);
          this.clearWatch(this.localWatch, name);
          this.dropTree(this.dataTrees, name, false);
          this.dropTree(this.localTrees, name, true);
        };
        _proto.apply = function apply(name, patch) {
          var rec = this.dataTrees.get(name);
          if (!rec) return console.error('[gd] apply 无此树', name);
          var fires = [];
          for (var _i = 0, _Object$keys = Object.keys(patch); _i < _Object$keys.length; _i++) {
            var _key = _Object$keys[_i];
            var old = rec.data[_key];
            var neu = patch[_key];
            if (old === neu) continue;
            rec.data[_key] = neu;
            fires.push({
              key: _key,
              neu: neu,
              old: old
            });
          }
          for (var _i2 = 0, _fires = fires; _i2 < _fires.length; _i2++) {
            var f = _fires[_i2];
            this.fire(this.dataWatch, name, f.key, f.neu, f.old);
          }
        };
        _proto.sync = function sync(name, onComplete) {
          var _this = this;
          var rec = this.dataTrees.get(name);
          if (!rec) return onComplete(new Error("[gd] sync \u65E0\u6B64\u6811: " + name));
          this.remote.pull(name, function (err, pack) {
            if (err) return onComplete(err);
            if (!pack) return onComplete(new Error("[gd] sync \u7A7A\u5305: " + name));
            if (pack.v !== rec.schema) {
              console.warn('[gd] version 不符，丢弃', name, pack.v, rec.schema);
              _this.clearData(rec);
              return onComplete(null);
            }
            _this.apply(name, pack.data);
            onComplete(null);
          });
        };
        _proto.watchData = function watchData(name, key, cb) {
          this.addWatch(this.dataTrees, this.dataWatch, name, key, cb);
        };
        _proto.unwatchData = function unwatchData(name, key, cb) {
          this.removeWatch(this.dataWatch, name, key, cb);
        };
        _proto.watchLocal = function watchLocal(name, key, cb) {
          this.addWatch(this.localTrees, this.localWatch, name, key, cb);
        };
        _proto.unwatchLocal = function unwatchLocal(name, key, cb) {
          this.removeWatch(this.localWatch, name, key, cb);
        };
        _proto.addWatch = function addWatch(trees, watches, name, key, cb) {
          if (!trees.has(name)) throw new Error("[watch] \u65E0\u6B64\u6811: " + name);
          var keys = watches.get(name);
          if (!keys) {
            keys = new Map();
            watches.set(name, keys);
          }
          var set = keys.get(key);
          if (!set) {
            set = new Set();
            keys.set(key, set);
          }
          set.add(cb);
        };
        _proto.removeWatch = function removeWatch(watches, name, key, cb) {
          var _watches$get;
          var set = (_watches$get = watches.get(name)) == null ? void 0 : _watches$get.get(key);
          if (!set) return;
          set["delete"](cb);
          if (!set.size) watches.get(name)["delete"](key);
        };
        _proto.clearWatch = function clearWatch(watches, name) {
          watches["delete"](name);
        };
        _proto.fire = function fire(watches, name, key, neu, old) {
          var _watches$get2;
          var set = (_watches$get2 = watches.get(name)) == null ? void 0 : _watches$get2.get(key);
          if (!set || !set.size) return;
          for (var _i3 = 0, _arr = [].concat(set); _i3 < _arr.length; _i3++) {
            var _cb = _arr[_i3];
            _cb(neu, old);
          }
        };
        _proto.ensureTree = function ensureTree(map, name, writable, persist) {
          var old = map.get(name);
          if (old) return old;
          var data = {};
          var rec = {
            name: name,
            schema: SCHEMA,
            writable: writable,
            persist: persist,
            data: data,
            proxy: data
          };
          rec.proxy = this.makeTreeProxy(rec);
          if (persist) this.hydrateLocal(rec);
          map.set(name, rec);
          return rec;
        };
        _proto.dropTree = function dropTree(map, name, wipeStore) {
          if (!map.has(name)) return;
          map["delete"](name);
          if (wipeStore) this.localKv.remove(name);
        };
        _proto.hydrateLocal = function hydrateLocal(rec) {
          var pack = this.localKv.read(rec.name);
          if (!pack) return;
          if (pack.v !== rec.schema) {
            console.warn('[gl] version 不符，丢弃', rec.name, pack.v, rec.schema);
            this.localKv.remove(rec.name);
            return;
          }
          Object.assign(rec.data, pack.data);
        };
        _proto.persistLocal = function persistLocal(rec) {
          if (!rec.persist) return;
          this.localKv.write(rec.name, {
            v: rec.schema,
            data: _extends({}, rec.data)
          });
        };
        _proto.clearData = function clearData(rec) {
          for (var _i4 = 0, _Object$keys2 = Object.keys(rec.data); _i4 < _Object$keys2.length; _i4++) {
            var _key2 = _Object$keys2[_i4];
            delete rec.data[_key2];
          }
        };
        _proto.makeTreeProxy = function makeTreeProxy(rec) {
          var self = this;
          var watches = rec.writable ? this.localWatch : this.dataWatch;
          return new Proxy(rec.data, {
            get: function get(t, key) {
              return t[key];
            },
            set: function set(t, key, value) {
              if (!rec.writable) throw new Error("[gd] \u4E0D\u80FD\u76F4\u63A5\u5199 " + rec.name + "." + String(key) + "\uFF0C\u8BF7\u7528 apply/sync");
              var field = key;
              var old = t[field];
              if (old === value) return true;
              t[field] = value;
              self.persistLocal(rec);
              self.fire(watches, rec.name, field, value, old);
              return true;
            }
          });
        };
        _proto.makeDataRoot = function makeDataRoot() {
          var self = this;
          var api = {
            apply: function apply(name, patch) {
              return self.apply(name, patch);
            },
            sync: function sync(name, onComplete) {
              return self.sync(name, onComplete);
            },
            watch: function watch(name, key, cb) {
              return self.watchData(name, key, cb);
            },
            unwatch: function unwatch(name, key, cb) {
              return self.unwatchData(name, key, cb);
            }
          };
          return new Proxy(api, {
            get: function get(t, key) {
              var _self$dataTrees$get;
              if (key in t) return t[key];
              return (_self$dataTrees$get = self.dataTrees.get(key)) == null ? void 0 : _self$dataTrees$get.proxy;
            }
          });
        };
        _proto.makeLocalRoot = function makeLocalRoot() {
          var self = this;
          var api = {
            watch: function watch(name, key, cb) {
              return self.watchLocal(name, key, cb);
            },
            unwatch: function unwatch(name, key, cb) {
              return self.unwatchLocal(name, key, cb);
            }
          };
          return new Proxy(api, {
            get: function get(t, key) {
              var _self$localTrees$get;
              if (key in t) return t[key];
              return (_self$localTrees$get = self.localTrees.get(key)) == null ? void 0 : _self$localTrees$get.proxy;
            }
          });
        };
        return GMStoreHub;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMTabPage.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMComponent.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, GMComponent;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      GMComponent = module.GMComponent;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "c4a1eeybTBPGJpVK34MkdSo", "GMTabPage", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /** 页签内容基类。根上挂这个，才能绑进 PfGMTabs */
      var GMTabPage = exports('GMTabPage', (_dec = ccclass('GMTabPage'), _dec(_class = (_class2 = /*#__PURE__*/function (_GMComponent) {
        _inheritsLoose(GMTabPage, _GMComponent);
        function GMTabPage() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMComponent.call.apply(_GMComponent, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "text", _descriptor, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = GMTabPage.prototype;
        // 页签上的字。编辑器填，或 setText
        /** 改字，并让外面的页签条跟着改 */
        _proto.setText = function setText(text) {
          this.text = text;
          this.noteTabs();
        }

        /** 变成当前页时调用。做完必须 done。默认立刻 done */;
        _proto.onShow = function onShow(done) {
          done();
        }

        /** 离开当前页时调用。做完必须 done。默认立刻 done */;
        _proto.onHide = function onHide(done) {
          done();
        };
        _proto.noteTabs = function noteTabs() {
          var node = this.node;
          while (node) {
            var host = node.getComponent('PfGMTabs');
            if (host != null && host.noteText) return host.noteText();
            node = node.parent;
          }
        };
        return GMTabPage;
      }(GMComponent), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "text", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMUIManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMComponent.ts', './GMLayer.ts', './PfGMBtn.ts', './GMOverlayHost.ts', './GMScene.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, screen, game, Game, director, Node, view, UITransform, Camera, Canvas, Widget, BlockInputEvents, UIOpacity, Label, Color, Prefab, instantiate, Button, Sprite, Texture2D, SpriteFrame, ResolutionPolicy, GMComponent, GMLayer, bindLayerMaskTpl, PfGMBtn, GMOverlayHost, GMScene;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      screen = module.screen;
      game = module.game;
      Game = module.Game;
      director = module.director;
      Node = module.Node;
      view = module.view;
      UITransform = module.UITransform;
      Camera = module.Camera;
      Canvas = module.Canvas;
      Widget = module.Widget;
      BlockInputEvents = module.BlockInputEvents;
      UIOpacity = module.UIOpacity;
      Label = module.Label;
      Color = module.Color;
      Prefab = module.Prefab;
      instantiate = module.instantiate;
      Button = module.Button;
      Sprite = module.Sprite;
      Texture2D = module.Texture2D;
      SpriteFrame = module.SpriteFrame;
      ResolutionPolicy = module.ResolutionPolicy;
    }, function (module) {
      GMComponent = module.GMComponent;
    }, function (module) {
      GMLayer = module.GMLayer;
      bindLayerMaskTpl = module.bindLayerMaskTpl;
    }, function (module) {
      PfGMBtn = module.PfGMBtn;
    }, function (module) {
      GMOverlayHost = module.GMOverlayHost;
    }, function (module) {
      GMScene = module.GMScene;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b31e7xKnVJPjqHAbkuNL5Cj", "GMUIManager", undefined);
      var OVERLAY_LAYER = 1 << 19; // 独立层，避免被场景 UI 相机画两次
      var LOADING_DELAY = 1.5; // 秒；之后才出转圈
      var LOADING_TIMEOUT = 20; // 秒；到期自动 hide
      var ENTER_LEAVE_FALLBACK = 5; // 秒；子类忘调 done 时兜底
      var PRESS_SCALE = 0.96; // 按下缩小；松开回到按下前
      var PRESS_DIM = 0.75; // 按下时底板、图标、字和描边乘这系数
      var DESIGN_W = 720; // 跟 settings 里的设计分辨率一致
      var DESIGN_H = 1280;

      // 默认 both

      function dimRgb(c, k) {
        return new Color(Math.round(c.r * k), Math.round(c.g * k), Math.round(c.b * k), c.a);
      }
      /** 视图门面：真场景切换、layer 栈、loading 令牌；persist Overlay；设计分辨率 720×1280，宽适配 */
      var GMUIManager = exports('GMUIManager', /*#__PURE__*/function () {
        function GMUIManager(resource) {
          this.overlay = null;
          this.overlayCamera = null;
          this.host = null;
          this.layersRoot = null;
          this.loadingRoot = null;
          this.alertsRoot = null;
          this.loadingVisual = null;
          this.layers = [];
          this.alerts = [];
          this.alertPrefab = null;
          this.alertSeq = 0;
          this.alertPending = new Set();
          // load 完成前也占去重 key
          this.loadingNames = [];
          // console 一眼能看全
          this.running = null;
          this.pendingBundles = new Set();
          // 正在打开、尚未入场结束
          this.preparingLayers = new Set();
          this.openingScene = false;
          this.fitBound = false;
          this.lastFitW = 0;
          this.lastFitH = 0;
          this.clickUnlockAt = 0;
          // 有 lockTime 的点击共用；无 lockTime 的不查
          this.pressBinds = new Map();
          this.pressHold = new Map();
          this.maskTpl = null;
          this._whiteFrame = null;
          this.resource = resource;
        }

        /** 核心启动：设计分辨率锁 720×1280、宽适配；窗口变了只重铺 Overlay */
        var _proto = GMUIManager.prototype;
        _proto.bindPixelFit = function bindPixelFit() {
          if (this.fitBound) return;
          this.fitBound = true;
          this.applyPixelFit();
          screen.on('window-resize', this.applyPixelFit, this);
          game.once(Game.EVENT_GAME_INITED, this.applyPixelFit, this);
        }

        /** 当前场景或 layer 仍占用这些 Bundle 时，返回中文原因（空数组 = 可 unbind） */;
        _proto.getUnbindBlockers = function getUnbindBlockers(bundleNames) {
          var reasons = [];
          var hit = function hit(bundle) {
            return bundleNames.indexOf(bundle) !== -1;
          };
          if (this.running && hit(this.running.bundle)) {
            reasons.push("\u573A\u666F " + this.running.name + "\uFF08" + this.running.bundle + "\uFF09");
          }
          for (var _iterator = _createForOfIteratorHelperLoose(this.layers), _step; !(_step = _iterator()).done;) {
            var one = _step.value;
            if (hit(one.bundle)) reasons.push("layer " + one.name + "\uFF08" + one.bundle + "\uFF09");
          }
          for (var _iterator2 = _createForOfIteratorHelperLoose(this.pendingBundles), _step2; !(_step2 = _iterator2()).done;) {
            var bundle = _step2.value;
            if (hit(bundle)) reasons.push("\u6B63\u5728\u6253\u5F00\uFF08" + bundle + "\uFF09");
          }
          return reasons;
        };
        _proto.ensureOverlay = function ensureOverlay() {
          var _this$overlay;
          if ((_this$overlay = this.overlay) != null && _this$overlay.isValid) return;
          var scene = director.getScene();
          if (!scene) return console.error('[gm.ui] 无当前场景，无法创建 Overlay');
          var root = new Node('GMOverlay');
          this.setLayer(root);
          var size = view.getVisibleSize();
          root.addComponent(UITransform).setContentSize(size.width, size.height);
          var camNode = new Node('Camera');
          this.setLayer(camNode);
          root.addChild(camNode);
          camNode.setPosition(0, 0, 1000);
          var camera = camNode.addComponent(Camera);
          this.overlayCamera = camera;
          camera.projection = Camera.ProjectionType.ORTHO;
          camera.priority = 1024;
          camera.near = 0;
          camera.far = 2000;
          camera.orthoHeight = size.height / 2;
          camera.clearFlags = Camera.ClearFlag.DEPTH_ONLY;
          camera.visibility = OVERLAY_LAYER;
          var canvas = root.addComponent(Canvas);
          canvas.cameraComponent = camera;
          canvas.alignCanvasWithScreen = true;
          var widget = root.addComponent(Widget);
          widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
          widget.top = widget.bottom = widget.left = widget.right = 0;
          widget.alignMode = Widget.AlignMode.ALWAYS;
          this.layersRoot = this.makeFullNode('layers', root);
          this.loadingRoot = this.makeFullNode('loading', root);
          this.alertsRoot = this.makeFullNode('alerts', root); // 最上：等待中也能点确认
          this.makeLayerMaskTpl(root);
          this.loadingRoot.addComponent(BlockInputEvents);
          this.loadingRoot.active = false;
          this.loadingVisual = new Node('visual');
          this.setLayer(this.loadingVisual);
          this.loadingRoot.addChild(this.loadingVisual);
          this.loadingVisual.addComponent(UITransform).setContentSize(200, 80);
          this.loadingVisual.addComponent(UIOpacity).opacity = 0;
          var label = this.loadingVisual.addComponent(Label);
          label.string = 'loading';
          label.fontSize = 36;
          label.color = Color.WHITE;
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
          label.verticalAlign = Label.VerticalAlign.CENTER;
          this.host = root.addComponent(GMOverlayHost);
          scene.addChild(root);
          director.addPersistRootNode(root);
          this.overlay = root;
          this.syncOverlayToView();
          console.info('[gm.ui] Overlay 已创建');
        };
        _proto.openScene = function openScene(sceneName, options, onComplete, onProgress) {
          var _this$running,
            _this = this;
          if (!sceneName) return this.fail(onComplete, '[gm.ui] openScene 场景名为空');
          if (!(options != null && options.bundle)) return this.fail(onComplete, '[gm.ui] openScene 必须带 bundle');
          if (this.openingScene) return this.fail(onComplete, '[gm.ui] 正在切场景，忽略 ' + sceneName);
          this.ensureOverlay();
          if (!this.overlay) return this.fail(onComplete, '[gm.ui] Overlay 未就绪');
          if (((_this$running = this.running) == null ? void 0 : _this$running.name) === sceneName && this.running.bundle === options.bundle) {
            console.info('[gm.ui] 已是当前场景', sceneName);
            onComplete == null || onComplete(null);
            return;
          }
          var bundleName = options.bundle;
          var loadingKey = "scene:" + bundleName + ":" + sceneName;
          this.openingScene = true;
          this.pendingBundles.add(bundleName);
          this.loadingShow(loadingKey); // 内嵌；调用方不必再调

          var finish = function finish(err) {
            _this.openingScene = false;
            _this.pendingBundles["delete"](bundleName);
            _this.loadingHide(loadingKey);
            if (err) return _this.fail(onComplete, err.message);
            onComplete == null || onComplete(null);
          };
          var leaveDone = false;
          var preloadDone = false;
          var preloadErr = null;
          var tryGo = function tryGo() {
            if (!leaveDone || !preloadDone) return;
            if (preloadErr) return finish(preloadErr);
            _this.closeAll();
            _this.runBundleScene(bundleName, sceneName, onProgress, finish);
          };
          this.runSceneLeave(function () {
            leaveDone = true;
            tryGo();
          });
          this.preloadBundleScene(bundleName, sceneName, onProgress, function (err) {
            preloadErr = err;
            preloadDone = true;
            tryGo();
          });
        };
        _proto.showLayer = function showLayer(layerName, options, onComplete) {
          var _this2 = this;
          if (!layerName) return this.fail(onComplete, '[gm.ui] showLayer 名为空');
          if (!(options != null && options.bundle)) return this.fail(onComplete, '[gm.ui] showLayer 必须带 bundle');
          this.ensureOverlay();
          if (!this.layersRoot) return this.fail(onComplete, '[gm.ui] Overlay 未就绪');
          var old = this.findLayer(layerName);
          if (old) {
            console.warn('[gm.ui] layer 已存在，拆旧开新', layerName);
            this.destroyLayer(old, true);
          }
          if (this.preparingLayers.has(layerName)) return this.fail(onComplete, "[gm.ui] layer \u6B63\u5728\u6253\u5F00: " + layerName);
          var bundleName = options.bundle;
          var loadingKey = "layer:" + bundleName + ":" + layerName;
          this.preparingLayers.add(layerName);
          this.pendingBundles.add(bundleName);
          this.loadingShow(loadingKey); // 内嵌；调用方不必再调

          this.resource.load(bundleName, layerName, Prefab, function (err, prefab) {
            if (err || !prefab) {
              var _err$message;
              _this2.preparingLayers["delete"](layerName);
              _this2.pendingBundles["delete"](bundleName);
              _this2.loadingHide(loadingKey);
              return _this2.fail(onComplete, (_err$message = err == null ? void 0 : err.message) != null ? _err$message : "[gm.ui] \u52A0\u8F7D layer \u5931\u8D25: " + layerName);
            }
            var node = instantiate(prefab);
            node.parent = _this2.layersRoot;
            _this2.setLayer(node); // onInit 里新建的子节点也要跟上 Overlay 层
            var item = {
              name: layerName,
              bundle: bundleName,
              node: node
            };
            _this2.layers.push(item);
            _this2.preparingLayers["delete"](layerName);
            console.info('[gm.ui] 打开 layer', bundleName, layerName);
            _this2.runHook(node.getComponent(GMLayer), 'onEnter', function () {
              _this2.pendingBundles["delete"](bundleName);
              _this2.loadingHide(loadingKey);
              onComplete == null || onComplete(null);
            });
          });
        };
        _proto.closeLayer = function closeLayer(layerName, onComplete) {
          var _this3 = this;
          var item = this.findLayer(layerName);
          if (!item) {
            console.info('[gm.ui] closeLayer 未找到', layerName);
            onComplete == null || onComplete(null);
            return;
          }
          this.runHook(item.node.getComponent(GMLayer), 'onLeave', function () {
            _this3.destroyLayer(item, true);
            onComplete == null || onComplete(null);
          });
        }

        /** 立刻拆掉所有 layer（切场景用，不走 onLeave） */;
        _proto.closeAll = function closeAll() {
          for (var i = this.layers.length - 1; i >= 0; i--) {
            this.destroyLayer(this.layers[i], true);
          }
        };
        _proto.loadingShow = function loadingShow(actionName, params) {
          var _this4 = this;
          if (params === void 0) {
            params = {};
          }
          if (typeof actionName !== 'string' || !actionName) return console.error('[gm.ui] loadingShow 名不合法', actionName);
          this.ensureOverlay();
          if (!this.host || !this.loadingRoot || !this.loadingVisual) return;
          if (this.loadingNames.indexOf(actionName) !== -1) {
            return console.error('[gm.ui] loading 同名', actionName, this.loadingNames);
          }
          var delay = params.delay === undefined ? LOADING_DELAY : params.delay;
          var timeout = params.timeout === undefined ? LOADING_TIMEOUT : params.timeout;
          this.loadingNames.push(actionName);
          this.loadingRoot.active = true;
          if (this.loadingNames.length === 1) this.setVisualOpacity(0);
          if (delay !== Infinity) {
            this.host.scheduleNamed(actionName + ':show', delay, function () {
              if (_this4.loadingNames.indexOf(actionName) === -1) return;
              _this4.setVisualOpacity(255);
            });
          }
          if (timeout !== Infinity) {
            this.host.scheduleNamed(actionName + ':hide', timeout, function () {
              console.warn('[gm.ui] loading 超时自动 hide', actionName, timeout);
              _this4.loadingHide(actionName);
            });
          }
        }

        /** 代码里加 Button 并听 click；同一节点再绑会换掉旧回调。编辑器不用拖 Button。按下默认缩小并压暗 */;
        _proto.addClick = function addClick(target, cb, opts) {
          var _opts$press,
            _this5 = this;
          if (!(target != null && target.isValid)) return;
          if (!target.getComponent(Button)) {
            var btn = target.addComponent(Button);
            btn.transition = Button.Transition.NONE;
            var widget = target.getComponent(PfGMBtn);
            if (widget && !widget.interactive) btn.interactable = false; // 先禁用再注册，不要把按钮重新点亮
          }

          this.bindPress(target, (_opts$press = opts == null ? void 0 : opts.press) != null ? _opts$press : 'both');
          target.off(Button.EventType.CLICK);
          target.on(Button.EventType.CLICK, function (ev) {
            _this5.endPress(target); // 先还原外观，再进回调，避免回调里改色被按下状态盖回去
            var underAlert = _this5.isUnder(target, _this5.alertsRoot);
            if (!underAlert && _this5.loadingNames.length > 0) return; // Alert 在 loading 之上，仍可点
            var lock = opts == null ? void 0 : opts.lockTime;
            if (lock && lock > 0) {
              var now = Date.now();
              if (now < _this5.clickUnlockAt) {
                console.info('[gm.ui] addClick 已锁，忽略', target.name);
                return;
              }
              _this5.clickUnlockAt = now + lock * 1000;
            }
            cb(ev);
          });
        }

        /** 卸 click 并拆掉 Button；节点销毁也会自己卸，这是主动摘 */;
        _proto.removeClick = function removeClick(target) {
          if (!(target != null && target.isValid)) return;
          this.endPress(target);
          this.unbindPress(target);
          target.off(Button.EventType.CLICK);
          target.removeComponent(Button);
        };
        _proto.bindPress = function bindPress(target, mode) {
          var _this6 = this;
          this.endPress(target);
          this.unbindPress(target);
          if (mode === 'none') return;
          var start = function start() {
            return _this6.beginPress(target, mode);
          };
          var end = function end() {
            return _this6.endPress(target);
          };
          target.on(Node.EventType.TOUCH_START, start);
          target.on(Node.EventType.TOUCH_END, end);
          target.on(Node.EventType.TOUCH_CANCEL, end);
          target.once(Node.EventType.NODE_DESTROYED, function () {
            _this6.pressHold["delete"](target);
            _this6.pressBinds["delete"](target);
          });
          this.pressBinds.set(target, {
            start: start,
            end: end
          });
        };
        _proto.unbindPress = function unbindPress(target) {
          var prev = this.pressBinds.get(target);
          if (!prev) return;
          target.off(Node.EventType.TOUCH_START, prev.start);
          target.off(Node.EventType.TOUCH_END, prev.end);
          target.off(Node.EventType.TOUCH_CANCEL, prev.end);
          this.pressBinds["delete"](target);
        };
        _proto.beginPress = function beginPress(target, mode) {
          if (!target.isValid || this.pressHold.has(target)) return;
          var button = target.getComponent(Button);
          if (button && !button.interactable) return;
          var scale = target.scale.clone();
          var colors = [];
          if (mode === 'both' || mode === 'dim') this.dimTree(target, colors);
          if (mode === 'both' || mode === 'scale') target.setScale(scale.x * PRESS_SCALE, scale.y * PRESS_SCALE, scale.z);
          this.pressHold.set(target, {
            scale: scale,
            colors: colors
          });
        };
        _proto.endPress = function endPress(target) {
          var held = this.pressHold.get(target);
          if (!held) return;
          this.pressHold["delete"](target);
          if (!target.isValid) return;
          target.setScale(held.scale);
          for (var _iterator3 = _createForOfIteratorHelperLoose(held.colors), _step3; !(_step3 = _iterator3()).done;) {
            var _item$sprite, _item$label;
            var item = _step3.value;
            if ((_item$sprite = item.sprite) != null && _item$sprite.isValid) item.sprite.color = item.color;
            if (!((_item$label = item.label) != null && _item$label.isValid)) continue;
            item.label.color = item.color;
            if (item.outline) item.label.outlineColor = item.outline;
          }
        };
        _proto.dimTree = function dimTree(node, out) {
          var sprite = node.getComponent(Sprite);
          var label = node.getComponent(Label);
          if (sprite) {
            out.push({
              sprite: sprite,
              color: sprite.color.clone()
            });
            sprite.color = dimRgb(sprite.color, PRESS_DIM);
          }
          if (label) {
            var outline = label.outlineColor.clone();
            out.push({
              label: label,
              color: label.color.clone(),
              outline: outline
            });
            label.color = dimRgb(label.color, PRESS_DIM);
            label.outlineColor = dimRgb(outline, PRESS_DIM);
          }
          for (var _iterator4 = _createForOfIteratorHelperLoose(node.children), _step4; !(_step4 = _iterator4()).done;) {
            var child = _step4.value;
            this.dimTree(child, out);
          }
        }

        /**
         * instantiate prefab，按常用字段改节点，返回根上 GMComponent（含子类）。
         * 先入树（激活则 onInit），再 init(initParm)。调用方自己 load Prefab。
         */;
        _proto.createTs = function createTs(prefab, nodeParm, initParm) {
          if (!prefab) return this.failTs('[gm.ui] createTs 无 prefab');
          var node = instantiate(prefab);
          var p = nodeParm != null ? nodeParm : {};
          if (p.x !== undefined || p.y !== undefined) {
            var _p$x, _p$y;
            var pos = node.position;
            node.setPosition((_p$x = p.x) != null ? _p$x : pos.x, (_p$y = p.y) != null ? _p$y : pos.y, pos.z);
          }
          if (p.scale !== undefined) node.setScale(p.scale, p.scale, 1);
          if (p.anchor !== undefined) {
            var _node$getComponent;
            var uit = (_node$getComponent = node.getComponent(UITransform)) != null ? _node$getComponent : node.addComponent(UITransform);
            if (typeof p.anchor === 'number') uit.setAnchorPoint(p.anchor, p.anchor);else uit.setAnchorPoint(p.anchor.x, p.anchor.y);
          }
          if (p.active !== undefined) node.active = p.active;
          if (p.parent) {
            node.parent = p.parent;
            this.applyLayer(node, p.parent.layer); // 跟父节点同层，否则 UI 相机看不见
          }

          if (p.zIndex !== undefined) {
            if (!node.parent) console.warn('[gm.ui] createTs zIndex 需要 parent');else node.setSiblingIndex(p.zIndex);
          }
          var ts = node.getComponent(GMComponent);
          if (!ts) return this.failTs('[gm.ui] createTs 根节点没有 GMComponent', node.name);
          if (initParm !== undefined) ts.init == null || ts.init(initParm);
          return ts;
        }

        /** 常驻包 onBind 预载后登记；之后 gu.alert 不再 load */;
        _proto.setAlertPrefab = function setAlertPrefab(prefab) {
          this.alertPrefab = prefab;
        }

        /** 系统确认框。字符串 = 仅确定。content+按钮文案相同则不新建 */;
        _proto.alert = function alert(param) {
          var _this7 = this;
          var p = typeof param === 'string' ? {
            content: param
          } : param;
          if (!(p != null && p.content)) return console.error('[gm.ui] alert 无 content');
          var okText = this.btnText(p.ok, '确定');
          var showCancel = p.cancel !== undefined;
          var cancelText = showCancel ? this.btnText(p.cancel, '取消') : '';
          var key = JSON.stringify([p.content, okText, cancelText]);
          for (var _iterator5 = _createForOfIteratorHelperLoose(this.alerts), _step5; !(_step5 = _iterator5()).done;) {
            var one = _step5.value;
            if (one.key === key && !one.closing && one.node.isValid) {
              return console.info('[gm.ui] alert 重复，忽略', p.content);
            }
          }
          if (this.alertPending.has(key)) return console.info('[gm.ui] alert 重复，忽略', p.content);
          this.ensureOverlay();
          if (!this.alertsRoot) return console.error('[gm.ui] Overlay 未就绪');
          this.alertPending.add(key);
          var open = function open(prefab) {
            var id = String(++_this7.alertSeq);
            var item = {
              id: id,
              key: key,
              node: null,
              closing: false
            };
            var ts = _this7.createTs(prefab, {
              parent: _this7.alertsRoot
            }, {
              content: p.content,
              okText: okText,
              cancelText: cancelText,
              showCancel: showCancel,
              onOk: _this7.btnCb(p.ok),
              onCancel: _this7.btnCb(p.cancel),
              close: function close() {
                return _this7.closeAlertItem(item);
              }
            });
            _this7.alertPending["delete"](key);
            if (!ts) return;
            item.node = ts.node;
            _this7.alerts.push(item);
            _this7.runHook(ts, 'onEnter', function () {}, id);
          };
          if (this.alertPrefab) return open(this.alertPrefab);
          this.alertPending["delete"](key);
          console.error('[gm.ui] alert 皮未预载，请在常驻包 onBind 里 setAlertPrefab');
        };
        _proto.loadingHide = function loadingHide(actionName) {
          if (!this.host || !this.loadingRoot) return;
          var index = this.loadingNames.indexOf(actionName);
          if (index !== -1) this.loadingNames.splice(index, 1);
          this.host.unscheduleNamed(actionName + ':show');
          this.host.unscheduleNamed(actionName + ':hide');
          if (this.loadingNames.length === 0) {
            this.setVisualOpacity(0);
            this.loadingRoot.active = false;
          }
        };
        _proto.runBundleScene = function runBundleScene(bundleName, sceneName, onProgress, finish) {
          var _this8 = this;
          var bundle = this.resource.getBundle(bundleName);
          if (!bundle) return finish(new Error("[gm.ui] Bundle \u672A\u52A0\u8F7D: " + bundleName));
          var done = function done(err, sceneAsset) {
            if (err || !sceneAsset) return finish(err != null ? err : new Error("[gm.ui] loadScene \u5931\u8D25: " + bundleName + "/" + sceneName));
            director.runScene(sceneAsset, function () {}, function () {
              var _director$getScene;
              _this8.running = {
                name: sceneName,
                bundle: bundleName
              };
              var script = (_director$getScene = director.getScene()) == null ? void 0 : _director$getScene.getComponentInChildren(GMScene);
              _this8.runHook(script, 'onEnter', function () {
                return finish(null);
              });
            });
          };
          if (onProgress) bundle.loadScene(sceneName, onProgress, done);else bundle.loadScene(sceneName, done);
        };
        _proto.preloadBundleScene = function preloadBundleScene(bundleName, sceneName, onProgress, onComplete) {
          var bundle = this.resource.getBundle(bundleName);
          if (!bundle) return onComplete(new Error("[gm.ui] Bundle \u672A\u52A0\u8F7D: " + bundleName));
          var done = function done(err) {
            return onComplete(err);
          };
          if (onProgress) bundle.preloadScene(sceneName, onProgress, done);else bundle.preloadScene(sceneName, done);
        };
        _proto.runSceneLeave = function runSceneLeave(done) {
          var _director$getScene2;
          var script = (_director$getScene2 = director.getScene()) == null ? void 0 : _director$getScene2.getComponentInChildren(GMScene);
          this.runHook(script, 'onLeave', done);
        };
        _proto.runHook = function runHook(script, hook, done, tag) {
          var _this9 = this,
            _this$host;
          if (tag === void 0) {
            tag = '';
          }
          var called = false;
          var name = 'hook:' + hook + (tag ? ':' + tag : '');
          var once = function once() {
            var _this9$host;
            if (called) return;
            called = true;
            (_this9$host = _this9.host) == null || _this9$host.unscheduleNamed(name);
            done();
          };
          if (!script) return once();
          (_this$host = this.host) == null || _this$host.scheduleNamed(name, ENTER_LEAVE_FALLBACK, function () {
            console.warn('[gm.ui] ' + hook + ' 未调用 done，已兜底');
            once();
          });
          script[hook](once);
        };
        _proto.closeAlertItem = function closeAlertItem(item) {
          var _item$node,
            _this10 = this;
          if (item.closing) return;
          item.closing = true;
          var ts = (_item$node = item.node) != null && _item$node.isValid ? item.node.getComponent(GMLayer) : null;
          this.runHook(ts, 'onLeave', function () {
            var _item$node2;
            var i = _this10.alerts.indexOf(item);
            if (i !== -1) _this10.alerts.splice(i, 1);
            if ((_item$node2 = item.node) != null && _item$node2.isValid) item.node.destroy();
          }, item.id);
        };
        _proto.btnText = function btnText(btn, fallback) {
          if (btn && typeof btn === 'object' && btn.text) return btn.text;
          return fallback;
        };
        _proto.btnCb = function btnCb(btn) {
          if (!btn) return undefined;
          if (typeof btn === 'function') return btn;
          return btn.cb;
        };
        _proto.isUnder = function isUnder(node, root) {
          if (!(root != null && root.isValid)) return false;
          var cur = node;
          while (cur) {
            if (cur === root) return true;
            cur = cur.parent;
          }
          return false;
        };
        _proto.findLayer = function findLayer(layerName) {
          for (var i = this.layers.length - 1; i >= 0; i--) {
            if (this.layers[i].name === layerName && this.layers[i].node.isValid) return this.layers[i];
          }
          return null;
        };
        _proto.destroyLayer = function destroyLayer(item, fromList) {
          console.info('[gm.ui] 关闭 layer', item.bundle, item.name);
          if (fromList) {
            var i = this.layers.indexOf(item);
            if (i !== -1) this.layers.splice(i, 1);
          }
          if (item.node.isValid) item.node.destroy();
        };
        _proto.makeFullNode = function makeFullNode(name, parent) {
          var node = new Node(name);
          this.setLayer(node);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(view.getVisibleSize());
          var widget = node.addComponent(Widget);
          widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
          widget.top = widget.bottom = widget.left = widget.right = 0;
          widget.alignMode = Widget.AlignMode.ALWAYS;
          return node;
        };
        _proto.makeLayerMaskTpl = function makeLayerMaskTpl(parent) {
          var node = new Node('layerMaskTpl');
          this.setLayer(node);
          parent.addChild(node);
          node.active = false;
          var size = view.getVisibleSize();
          node.addComponent(UITransform).setContentSize(size.width, size.height);
          node.addComponent(BlockInputEvents);
          node.addComponent(UIOpacity).opacity = 255;
          var sp = node.addComponent(Sprite);
          sp.spriteFrame = this.whiteFrame();
          sp.sizeMode = Sprite.SizeMode.CUSTOM;
          sp.color = new Color(0, 0, 0, 160);
          bindLayerMaskTpl(node);
          this.maskTpl = node;
        };
        _proto.whiteFrame = function whiteFrame() {
          var _this$_whiteFrame;
          if ((_this$_whiteFrame = this._whiteFrame) != null && _this$_whiteFrame.isValid) return this._whiteFrame;
          var tex = new Texture2D();
          tex.reset({
            width: 2,
            height: 2,
            format: Texture2D.PixelFormat.RGBA8888
          });
          tex.uploadData(new Uint8Array(16).fill(255));
          var frame = new SpriteFrame();
          frame.texture = tex;
          this._whiteFrame = frame;
          return frame;
        };
        _proto.setLayer = function setLayer(node) {
          this.applyLayer(node, OVERLAY_LAYER);
        };
        _proto.applyLayer = function applyLayer(node, layer) {
          node.layer = layer;
          for (var _iterator6 = _createForOfIteratorHelperLoose(node.children), _step6; !(_step6 = _iterator6()).done;) {
            var child = _step6.value;
            this.applyLayer(child, layer);
          }
        };
        _proto.failTs = function failTs(message, extra) {
          if (extra !== undefined) console.error(message, extra);else console.error(message);
          return null;
        };
        _proto.setVisualOpacity = function setVisualOpacity(opacity) {
          var _this$loadingVisual;
          var op = (_this$loadingVisual = this.loadingVisual) == null ? void 0 : _this$loadingVisual.getComponent(UIOpacity);
          if (op) op.opacity = opacity;
        };
        _proto.fail = function fail(onComplete, message) {
          console.error(message);
          onComplete == null || onComplete(new Error(message));
        }

        /** 设计分辨率始终是 720×1280。宽适配：窗口再变，也只改可见高度，不改设计分辨率 */;
        _proto.applyPixelFit = function applyPixelFit() {
          if (this.lastFitW !== DESIGN_W || this.lastFitH !== DESIGN_H) {
            this.lastFitW = DESIGN_W;
            this.lastFitH = DESIGN_H;
            view.setDesignResolutionSize(DESIGN_W, DESIGN_H, ResolutionPolicy.FIXED_WIDTH);
            console.info('[gm.ui] 设计分辨率', DESIGN_W, DESIGN_H);
          }
          this.syncOverlayToView();
        };
        _proto.syncOverlayToView = function syncOverlayToView() {
          var _this$overlay2, _this$overlay$getComp, _this$overlayCamera, _this$maskTpl;
          if (!((_this$overlay2 = this.overlay) != null && _this$overlay2.isValid)) return;
          var size = view.getVisibleSize();
          var w = size.width;
          var h = size.height;
          (_this$overlay$getComp = this.overlay.getComponent(UITransform)) == null || _this$overlay$getComp.setContentSize(w, h);
          if ((_this$overlayCamera = this.overlayCamera) != null && _this$overlayCamera.isValid) this.overlayCamera.orthoHeight = h / 2;
          (_this$maskTpl = this.maskTpl) == null || (_this$maskTpl = _this$maskTpl.getComponent(UITransform)) == null || _this$maskTpl.setContentSize(w, h);
          for (var _iterator7 = _createForOfIteratorHelperLoose(this.layers), _step7; !(_step7 = _iterator7()).done;) {
            var one = _step7.value;
            this.fitLayerChrome(one.node, w, h);
          }
          for (var _iterator8 = _createForOfIteratorHelperLoose(this.alerts), _step8; !(_step8 = _iterator8()).done;) {
            var _one = _step8.value;
            this.fitLayerChrome(_one.node, w, h);
          }
        };
        _proto.fitLayerChrome = function fitLayerChrome(root, w, h) {
          var _root$getComponent, _root$getChildByName;
          if (!(root != null && root.isValid)) return;
          (_root$getComponent = root.getComponent(UITransform)) == null || _root$getComponent.setContentSize(w, h);
          (_root$getChildByName = root.getChildByName('mask')) == null || (_root$getChildByName = _root$getChildByName.getComponent(UITransform)) == null || _root$getChildByName.setContentSize(w, h);
        };
        return GMUIManager;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GMWatchHost.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "7ff464SNqREj6ZLY2qsgNGZ", "GMWatchHost", undefined);
      /** 挂在 GMClassBase / GMComponent 上：记本实例 watch，退场时卸干净 */
      var GMWatchHost = exports('GMWatchHost', /*#__PURE__*/function () {
        function GMWatchHost() {
          this.recs = [];
        }
        var _proto = GMWatchHost.prototype;
        _proto.watch = function watch(root, name, key, cb) {
          root.watch(name, key, cb);
          this.recs.push({
            root: root,
            name: name,
            key: key,
            cb: cb
          });
          return this;
        };
        _proto.unwatch = function unwatch(root, name, key, cb) {
          root.unwatch(name, key, cb);
          var i = this.recs.findIndex(function (r) {
            return r.root === root && r.name === name && r.key === key && r.cb === cb;
          });
          if (i > -1) this.recs.splice(i, 1);
          return this;
        };
        _proto.removeAll = function removeAll() {
          for (var _iterator = _createForOfIteratorHelperLoose(this.recs), _step; !(_step = _iterator()).done;) {
            var r = _step.value;
            r.root.unwatch(r.name, r.key, r.cb);
          }
          this.recs.length = 0;
        };
        return GMWatchHost;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/IGMLifecycle.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2c1beLD2E9Knrlt2R3l8YAp", "IGMLifecycle", undefined);
      /**
       * 编排侧生命周期契约（Binder 只认此接口；非节点自动调）。
       * 与 state 对照见 GMBindState.ts、docs/架构/核心简介.md
       */
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/IGMResource.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c1242+maL9IRrwrTcIsg2xm", "IGMResource", undefined);
      /**
       * 资源门面：只提供能力，是否下载/加载由上层逻辑决定。
       * @see GMCocosResource
       */
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/index.ts", ['cc', './GMEventManager.ts', './GMCocosResource.ts', './GMCoreBundle.ts', './GMBindState.ts', './GMClassBase.ts', './GMBindContext.ts', './GMBinder.ts', './GMBundleRegistry.ts', './GMBundleEntryBase.ts', './GMComponent.ts', './PfGMBtn.ts', './PfGMTitle.ts', './PfGMSlider.ts', './PfGMBar.ts', './PfGMStepper.ts', './GMTabPage.ts', './PfGMTabs.ts', './GMSkin.ts', './GMLayer.ts', './GMAlert.ts', './GMScene.ts', './GMUIManager.ts', './GMKvStore.ts', './GMRemoteAdapter.ts', './GMStoreHub.ts', './GMLauncher.ts', './GMPlatform.ts'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      exports('GMEventManager', module.GMEventManager);
    }, function (module) {
      exports('GMCocosResource', module.GMCocosResource);
    }, function (module) {
      var _setter = {};
      _setter.CORE_BUNDLE = module.CORE_BUNDLE;
      _setter.loadCoreBundle = module.loadCoreBundle;
      exports(_setter);
    }, function (module) {
      exports('GMBindState', module.GMBindState);
    }, function (module) {
      exports('GMClassBase', module.GMClassBase);
    }, function (module) {
      exports('GMBindContext', module.GMBindContext);
    }, function (module) {
      exports('GMBinder', module.GMBinder);
    }, function (module) {
      exports('GMBundleRegistry', module.GMBundleRegistry);
    }, function (module) {
      exports('GMBundleEntryBase', module.GMBundleEntryBase);
    }, function (module) {
      exports('GMComponent', module.GMComponent);
    }, function (module) {
      var _setter = {};
      _setter.PfGMBtn = module.PfGMBtn;
      _setter.PfGMBtnSize = module.PfGMBtnSize;
      _setter.PfGMBtnStyle = module.PfGMBtnStyle;
      _setter.PfGMBtnTheme = module.PfGMBtnTheme;
      exports(_setter);
    }, function (module) {
      exports('PfGMTitle', module.PfGMTitle);
    }, function (module) {
      exports('PfGMSlider', module.PfGMSlider);
    }, function (module) {
      exports('PfGMBar', module.PfGMBar);
    }, function (module) {
      exports('PfGMStepper', module.PfGMStepper);
    }, function (module) {
      exports('GMTabPage', module.GMTabPage);
    }, function (module) {
      var _setter = {};
      _setter.GMTabSource = module.GMTabSource;
      _setter.PfGMTabs = module.PfGMTabs;
      exports(_setter);
    }, function (module) {
      var _setter = {};
      _setter.SKIN_BUNDLE = module.SKIN_BUNDLE;
      _setter.applySkin = module.applySkin;
      _setter.loadSkin = module.loadSkin;
      _setter.skinFrame = module.skinFrame;
      exports(_setter);
    }, function (module) {
      exports('GMLayer', module.GMLayer);
    }, function (module) {
      exports('GMAlert', module.GMAlert);
    }, function (module) {
      exports('GMScene', module.GMScene);
    }, function (module) {
      exports('GMUIManager', module.GMUIManager);
    }, function (module) {
      exports('GMKvStore', module.GMKvStore);
    }, function (module) {
      exports('GMRemoteAdapter', module.GMRemoteAdapter);
    }, function (module) {
      exports('GMStoreHub', module.GMStoreHub);
    }, function (module) {
      var _setter = {};
      _setter.gd = module.gd;
      _setter.gl = module.gl;
      _setter.gm = module.gm;
      _setter.gp = module.gp;
      _setter.gu = module.gu;
      _setter.registerBundleEntry = module.registerBundleEntry;
      _setter.version = module.version;
      exports(_setter);
    }, function (module) {
      var _setter = {};
      _setter.GMPlatform = module.GMPlatform;
      _setter.toGpEventName = module.toGpEventName;
      exports(_setter);
    }],
    execute: function () {
      cclegacy._RF.push({}, "9cc10q3JEhIvocVQYukUehE", "index", undefined);
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./ScMain.ts', './config.ts', './GMBindContext.ts', './GMBindState.ts', './GMBinder.ts', './GMBundleEntryBase.ts', './GMBundleRegistry.ts', './GMClassBase.ts', './IGMLifecycle.ts', './GMKvStore.ts', './GMRemoteAdapter.ts', './GMStoreHub.ts', './GMWatchHost.ts', './GMEventHost.ts', './GMEventManager.ts', './index.ts', './GMBoot.ts', './GMLauncher.ts', './GMPlatform.ts', './GMPlatformAndroid.ts', './GMPlatformCreate.ts', './GMPlatformElectron.ts', './GMPlatformIos.ts', './GMPlatformWeb.ts', './GMPlatformWechat.ts', './GMAsyncCallback.ts', './GMCocosResource.ts', './GMCoreBundle.ts', './IGMResource.ts', './GMAlert.ts', './GMComponent.ts', './GMLayer.ts', './GMOverlayHost.ts', './GMScene.ts', './GMSkin.ts', './GMTabPage.ts', './GMUIManager.ts', './PfGMBar.ts', './PfGMBtn.ts', './PfGMSlider.ts', './PfGMStepper.ts', './PfGMTabs.ts', './PfGMTitle.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/PfGMBar.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMComponent.ts', './GMSkin.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, UITransform, Sprite, GMComponent, applySkin;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      UITransform = module.UITransform;
      Sprite = module.Sprite;
    }, function (module) {
      GMComponent = module.GMComponent;
    }, function (module) {
      applySkin = module.applySkin;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "d5b928xjCZKS65zL5wda45C", "PfGMBar", undefined);
      var ccclass = _decorator.ccclass,
        executeInEditMode = _decorator.executeInEditMode,
        property = _decorator.property;

      /**
       * 进度条可调参数。改数字改这里。
       * 宽读根节点，默认 320。高固定 64。四周留白 12。
       * 填充是胶囊，左右九宫格边之和是 40，窄于这个不画。
       */
      var PF_GM_BAR = {
        height: 64,
        pad: 12,
        defaultWidth: 320,
        fillMin: 40 // 胶囊左右圆头各 20
      };

      function clamp01(n) {
        if (!(n > 0)) return 0;
        if (n > 1) return 1;
        return n;
      }

      /** 框架进度条。槽和填充。value 为 0–1，不接收拖动 */
      var PfGMBar = exports('PfGMBar', (_dec = ccclass('PfGMBar'), _dec2 = executeInEditMode(true), _dec3 = property({
        min: 0,
        max: 1,
        step: 0.01
      }), _dec(_class = _dec2(_class = (_class2 = /*#__PURE__*/function (_GMComponent) {
        _inheritsLoose(PfGMBar, _GMComponent);
        function PfGMBar() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMComponent.call.apply(_GMComponent, [this].concat(args)) || this;
          _this.bg = null;
          _this.fill = null;
          _this.stamp = '';
          _initializerDefineProperty(_this, "value", _descriptor, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = PfGMBar.prototype;
        _proto.onInit = function onInit() {
          if (!this.bindNodes()) return console.error('[PfGMBar] 需要子节点 bg 和 fill');
          this.dress(this.bg, 'bar_bg');
          this.dress(this.fill, 'bar_fill');
          this.layout();
        };
        _proto.update = function update() {
          // 检查器或拉宽后重排。编辑态和运行态同一条
          var uit = this.node.getComponent(UITransform);
          if (!uit || !this.bg) return;
          var mark = this.value + "|" + uit.width + "|" + uit.height;
          if (mark === this.stamp) return;
          this.value = clamp01(this.value);
          this.layout();
        }

        /** 改比例。不发通知 */;
        _proto.setValue = function setValue(value) {
          this.value = clamp01(value);
          this.layout();
        };
        _proto.bindNodes = function bindNodes() {
          var _this$node$getChildBy, _this$node$getChildBy2, _this$node$getChildBy3, _this$node$getChildBy4;
          this.bg = (_this$node$getChildBy = (_this$node$getChildBy2 = this.node.getChildByName('bg')) == null ? void 0 : _this$node$getChildBy2.getComponent(Sprite)) != null ? _this$node$getChildBy : null;
          this.fill = (_this$node$getChildBy3 = (_this$node$getChildBy4 = this.node.getChildByName('fill')) == null ? void 0 : _this$node$getChildBy4.getComponent(Sprite)) != null ? _this$node$getChildBy3 : null;
          return !!(this.bg && this.fill);
        };
        _proto.layout = function layout() {
          var _bg$node$getComponent;
          var uit = this.node.getComponent(UITransform);
          var bg = this.bg;
          var fill = this.fill;
          if (!uit || !bg || !fill) return;
          this.value = clamp01(this.value);
          var width = uit.width > 0 ? uit.width : PF_GM_BAR.defaultWidth;
          uit.setContentSize(width, PF_GM_BAR.height);
          (_bg$node$getComponent = bg.node.getComponent(UITransform)) == null || _bg$node$getComponent.setContentSize(width, PF_GM_BAR.height);
          bg.node.setPosition(0, 0, 0);
          var pad = PF_GM_BAR.pad;
          var inner = Math.max(0, width - pad * 2);
          var fillW = inner * this.value;
          var node = fill.node;
          var show = this.value > 0 && fillW >= PF_GM_BAR.fillMin;
          node.active = show;
          if (show) {
            var fut = node.getComponent(UITransform);
            fut == null || fut.setAnchorPoint(0, 0.5); // 从左侧往右长。根锚点仍是中心
            fut == null || fut.setContentSize(fillW, PF_GM_BAR.height - pad * 2);
            node.setPosition(-width / 2 + pad, 0, 0);
          }
          this.stamp = this.value + "|" + uit.width + "|" + uit.height;
        };
        _proto.dress = function dress(sprite, name) {
          if (!sprite) return;
          applySkin(name, function (frame) {
            if (!sprite.isValid) return;
            sprite.spriteFrame = frame;
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            sprite.type = Sprite.Type.SLICED;
          });
        };
        return PfGMBar;
      }(GMComponent), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "value", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      }), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PfGMBtn.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMComponent.ts', './GMSkin.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, _decorator, Enum, SpriteFrame, Button, Sprite, Label, UITransform, Color, GMComponent, applySkin;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Enum = module.Enum;
      SpriteFrame = module.SpriteFrame;
      Button = module.Button;
      Sprite = module.Sprite;
      Label = module.Label;
      UITransform = module.UITransform;
      Color = module.Color;
    }, function (module) {
      GMComponent = module.GMComponent;
    }, function (module) {
      applySkin = module.applySkin;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;
      cclegacy._RF.push({}, "a7c3eGwTypNjpwRa1qOLU9w", "PfGMBtn", undefined);
      var ccclass = _decorator.ccclass,
        executeInEditMode = _decorator.executeInEditMode,
        property = _decorator.property;

      /**
       * 按钮可调参数。改数字改这里。
       * 字体资源：db://gmajor/fonts/main.ttf，挂在子节点 label 上。
       * 大档是原来的 380 宽。中档 260 宽，720 宽的确认框一行放得下两颗。
       * 底板从 Skin 包取 btn_ 加主题名，例如 btn_primary。不序列化在这个组件上。
       */
      var PF_GM_BTN = {
        disabledMul: 0.55,
        // 禁用时底板、图标、字和描边一起乘。按下的缩小和压暗在 gu.addClick
        outlineWidth: 4,
        contentInset: 16,
        // 九宫格四边。字的缩放框是中心这块，不是按钮外框
        iconScale: 0.8,
        // 图标相对档位尺寸
        sizes: {
          medium: {
            width: 260,
            height: 88,
            square: 88,
            icon: 80,
            padX: 12,
            fontSize: 36
          },
          large: {
            width: 380,
            height: 120,
            square: 120,
            icon: 110,
            padX: 16,
            fontSize: 48
          }
        },
        outline: {
          primary: [30, 80, 16],
          secondary: [62, 40, 18],
          warning: [120, 60, 0],
          neutral: [110, 70, 20],
          info: [16, 60, 110]
        }
      };
      var PfGMBtnTheme = exports('PfGMBtnTheme', /*#__PURE__*/function (PfGMBtnTheme) {
        PfGMBtnTheme[PfGMBtnTheme["primary"] = 0] = "primary";
        PfGMBtnTheme[PfGMBtnTheme["secondary"] = 1] = "secondary";
        PfGMBtnTheme[PfGMBtnTheme["warning"] = 2] = "warning";
        PfGMBtnTheme[PfGMBtnTheme["neutral"] = 3] = "neutral";
        PfGMBtnTheme[PfGMBtnTheme["info"] = 4] = "info";
        return PfGMBtnTheme;
      }({})); // 蓝：花钻石
      Enum(PfGMBtnTheme);
      var PfGMBtnStyle = exports('PfGMBtnStyle', /*#__PURE__*/function (PfGMBtnStyle) {
        PfGMBtnStyle[PfGMBtnStyle["iconText"] = 0] = "iconText";
        PfGMBtnStyle[PfGMBtnStyle["text"] = 1] = "text";
        PfGMBtnStyle[PfGMBtnStyle["icon"] = 2] = "icon";
        return PfGMBtnStyle;
      }({})); // 纯图标，正方形
      Enum(PfGMBtnStyle);
      var PfGMBtnSize = exports('PfGMBtnSize', /*#__PURE__*/function (PfGMBtnSize) {
        PfGMBtnSize[PfGMBtnSize["medium"] = 0] = "medium";
        PfGMBtnSize[PfGMBtnSize["large"] = 1] = "large";
        return PfGMBtnSize;
      }({})); // 首页宽按钮；原来的 380×120
      Enum(PfGMBtnSize);
      function rgb(c) {
        return new Color(c[0], c[1], c[2], 255);
      }
      function mul(c, k) {
        return new Color(Math.round(c.r * k), Math.round(c.g * k), Math.round(c.b * k), c.a);
      }

      /** 框架按钮。theme 定底板和描边，style 定版式。点击由外层 gu.addClick 注册 */
      var PfGMBtn = exports('PfGMBtn', (_dec = ccclass('PfGMBtn'), _dec2 = executeInEditMode(true), _dec3 = property({
        type: Enum(PfGMBtnSize)
      }), _dec4 = property({
        type: Enum(PfGMBtnTheme)
      }), _dec5 = property({
        type: Enum(PfGMBtnStyle)
      }), _dec6 = property(SpriteFrame), _dec(_class = _dec2(_class = (_class2 = /*#__PURE__*/function (_GMComponent) {
        _inheritsLoose(PfGMBtn, _GMComponent);
        function PfGMBtn() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMComponent.call.apply(_GMComponent, [this].concat(args)) || this;
          _this.labelView = null;
          _this.iconView = null;
          _this.plate = null;
          _this._interactive = true;
          _this.stamp = '';
          _this.preferredWidth = PF_GM_BTN.sizes.large.width;
          _this.appliedSize = -1;
          _initializerDefineProperty(_this, "size", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "theme", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "style", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "icon", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "text", _descriptor5, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = PfGMBtn.prototype;
        _proto.onInit = function onInit() {
          if (!this.bindNodes()) return console.error('[PfGMBtn] 需要底板 Sprite、子节点 label 和 icon');
          if (this.labelView.isSystemFontUsed || !this.labelView.font) console.error('[PfGMBtn] label 未挂 db://gmajor/fonts/main.ttf');
          this.refresh();
        };
        _proto.update = function update() {
          // 检查器改了属性，编辑态和运行态都重排
          if (this.mark() === this.stamp) return;
          this.refresh();
        }

        /** 换档。中档给确认框并排，大档给首页宽按钮 */;
        _proto.setSize = function setSize(size) {
          this.size = size;
          this.refresh();
        }

        /** 换主题：底板和描边一起换。字保持白色 */;
        _proto.setTheme = function setTheme(theme) {
          this.theme = theme;
          this.refresh();
        }

        /** 换版式。纯文字不画图标，纯图标不画文字，并改成方钮 */;
        _proto.setStyle = function setStyle(style) {
          this.style = style;
          this.refresh();
        }

        /** 换图标帧。纯文字版式下不显示 */;
        _proto.setIcon = function setIcon(frame) {
          this.icon = frame;
          this.refresh();
        }

        /** 换文字。纯图标版式下不显示 */;
        _proto.setText = function setText(text) {
          this.text = text;
          this.refresh();
        }

        /** 禁用时压暗，并关掉 Button.interactable */;
        _proto.setEnabled = function setEnabled(on) {
          this._interactive = on;
          var btn = this.node.getComponent(Button);
          if (btn) btn.interactable = on;
          this.applyColors();
        };
        _proto.mark = function mark() {
          var _this$icon$uuid, _this$icon;
          return this.size + "|" + this.theme + "|" + this.style + "|" + this.text + "|" + ((_this$icon$uuid = (_this$icon = this.icon) == null ? void 0 : _this$icon.uuid) != null ? _this$icon$uuid : '');
        };
        _proto.bindNodes = function bindNodes() {
          var _this$node$getChildBy, _this$node$getChildBy2, _this$node$getChildBy3, _this$node$getChildBy4;
          this.plate = this.getComponent(Sprite);
          this.labelView = (_this$node$getChildBy = (_this$node$getChildBy2 = this.node.getChildByName('label')) == null ? void 0 : _this$node$getChildBy2.getComponent(Label)) != null ? _this$node$getChildBy : null;
          this.iconView = (_this$node$getChildBy3 = (_this$node$getChildBy4 = this.node.getChildByName('icon')) == null ? void 0 : _this$node$getChildBy4.getComponent(Sprite)) != null ? _this$node$getChildBy3 : null;
          return !!(this.plate && this.labelView && this.iconView);
        };
        _proto.tier = function tier() {
          var _PF_GM_BTN$sizes$name;
          var name = PfGMBtnSize[this.size];
          return (_PF_GM_BTN$sizes$name = PF_GM_BTN.sizes[name]) != null ? _PF_GM_BTN$sizes$name : PF_GM_BTN.sizes.large;
        };
        _proto.refresh = function refresh() {
          var _PfGMBtnTheme$this$th,
            _this2 = this;
          if (!this.bindNodes()) return;
          var theme = (_PfGMBtnTheme$this$th = PfGMBtnTheme[this.theme]) != null ? _PfGMBtnTheme$this$th : 'primary';
          applySkin('btn_' + theme, function (frame) {
            var _this2$plate;
            if (!((_this2$plate = _this2.plate) != null && _this2$plate.isValid)) return;
            _this2.plate.spriteFrame = frame;
            _this2.plate.sizeMode = Sprite.SizeMode.CUSTOM;
            _this2.plate.type = Sprite.Type.SLICED;
          });
          this.layout();
          this.stamp = this.mark();
        };
        _proto.layout = function layout() {
          var _icon$node$getCompone;
          var tier = this.tier();
          var uit = this.node.getComponent(UITransform);
          var label = this.labelView;
          var icon = this.iconView;
          if (!uit || !label || !icon) return;
          var showIcon = this.style === PfGMBtnStyle.icon || this.style === PfGMBtnStyle.iconText;
          var showText = this.style === PfGMBtnStyle.text || this.style === PfGMBtnStyle.iconText;
          icon.node.active = showIcon;
          label.node.active = showText;
          icon.spriteFrame = this.icon;
          icon.sizeMode = Sprite.SizeMode.CUSTOM;
          icon.type = Sprite.Type.SIMPLE;
          var iconSize = tier.icon * PF_GM_BTN.iconScale;
          (_icon$node$getCompone = icon.node.getComponent(UITransform)) == null || _icon$node$getCompone.setContentSize(iconSize, iconSize);
          label.string = this.text;
          if (this.style === PfGMBtnStyle.icon) {
            uit.setContentSize(tier.square, tier.square);
            icon.node.setPosition(0, 0, 0);
            this.applyColors();
            return;
          }
          if (this.appliedSize !== this.size) {
            // 换档时丢掉上一档拉宽的宽度
            this.preferredWidth = uit.height === tier.height && uit.width >= tier.width ? uit.width : tier.width;
            this.appliedSize = this.size;
          } else if (uit.height === tier.height && uit.width >= tier.width) this.preferredWidth = uit.width;
          var width = Math.max(tier.width, this.preferredWidth);
          uit.setContentSize(width, tier.height);
          this.place(width, tier, showText, showIcon);
          this.applyColors();
        };
        _proto.place = function place(width, tier, showText, showIcon) {
          var icon = this.iconView;
          var label = this.labelView;
          if (showIcon && icon) icon.node.setPosition(-width / 2 + tier.padX + tier.icon / 2, 0, 0);
          if (!showText || !label) return;
          label.fontSize = tier.fontSize;
          label.lineHeight = tier.fontSize;
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
          label.verticalAlign = Label.VerticalAlign.CENTER;
          label.overflow = Label.Overflow.SHRINK;
          label.enableWrapText = false;
          label.enableOutline = true;
          label.outlineWidth = PF_GM_BTN.outlineWidth;
          var node = label.node;
          var lut = node.getComponent(UITransform);
          var inset = PF_GM_BTN.contentInset;
          var right = width / 2 - inset;
          var left = showIcon ? Math.max(-width / 2 + inset, -width / 2 + tier.padX + tier.icon) : -width / 2 + inset;
          lut == null || lut.setContentSize(Math.max(0, right - left), Math.max(0, tier.height - inset * 2));
          node.setPosition((left + right) / 2, 0, 0);
        };
        _proto.applyColors = function applyColors() {
          var outline = PF_GM_BTN.outline[PfGMBtnTheme[this.theme]];
          var k = this._interactive ? 1 : PF_GM_BTN.disabledMul;
          var white = mul(Color.WHITE, k);
          if (this.plate) this.plate.color = white;
          if (this.iconView) this.iconView.color = white;
          if (!this.labelView || !outline) return;
          this.labelView.color = white;
          this.labelView.outlineColor = mul(rgb(outline), k);
        };
        _createClass(PfGMBtn, [{
          key: "interactive",
          get: function get() {
            // addClick 新建 Button 时读这个
            return this._interactive;
          }
        }]);
        return PfGMBtn;
      }(GMComponent), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "size", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return PfGMBtnSize.large;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "theme", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return PfGMBtnTheme.primary;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "style", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return PfGMBtnStyle.text;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "icon", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "text", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      })), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PfGMSlider.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMLauncher.ts', './GMComponent.ts', './GMSkin.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, BlockInputEvents, Node, UITransform, Sprite, Vec3, gu, GMComponent, applySkin;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      BlockInputEvents = module.BlockInputEvents;
      Node = module.Node;
      UITransform = module.UITransform;
      Sprite = module.Sprite;
      Vec3 = module.Vec3;
    }, function (module) {
      gu = module.gu;
    }, function (module) {
      GMComponent = module.GMComponent;
    }, function (module) {
      applySkin = module.applySkin;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "c4a814gexVPOp1iHosMWn0x", "PfGMSlider", undefined);
      var ccclass = _decorator.ccclass,
        executeInEditMode = _decorator.executeInEditMode,
        property = _decorator.property;

      /**
       * 滑条可调参数。改数字改这里。
       * 宽读根节点，默认 280。高固定：触摸根 44，轨道 28，滑块 44。
       * 滑块整颗留在轨道宽度里。轨道九宫格，滑块不切。
       */
      var PF_GM_SLIDER = {
        height: 44,
        // 触摸根。滑块上下缘都在里面
        trackHeight: 28,
        thumb: 44,
        minWidth: 44 // 窄于滑块时夹到这里，滑块停住
      };

      function clamp01(n) {
        if (!(n > 0)) return 0;
        if (n > 1) return 1;
        return n;
      }

      /** 框架滑条。只有轨道和滑块。value 为 0–1，拖动由控件自己听 */
      var PfGMSlider = exports('PfGMSlider', (_dec = ccclass('PfGMSlider'), _dec2 = executeInEditMode(true), _dec3 = property({
        min: 0,
        max: 1,
        step: 0.01
      }), _dec(_class = _dec2(_class = (_class2 = /*#__PURE__*/function (_GMComponent) {
        _inheritsLoose(PfGMSlider, _GMComponent);
        function PfGMSlider() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMComponent.call.apply(_GMComponent, [this].concat(args)) || this;
          _this.track = null;
          _this.thumb = null;
          _this.stamp = '';
          _this.drag = false;
          _this.touched = false;
          _this.onChange = null;
          _initializerDefineProperty(_this, "value", _descriptor, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = PfGMSlider.prototype;
        _proto.onInit = function onInit() {
          if (!this.bindNodes()) return console.error('[PfGMSlider] 需要子节点 track 和 thumb');
          if (!this.node.getComponent(BlockInputEvents)) this.node.addComponent(BlockInputEvents); // 热区用根的 44 高，不在根上挂会把子节点透明度乘成 0 的 Sprite
          this.dress(this.track, 'slider_track', true);
          this.dress(this.thumb, 'slider_thumb', false);
          this.layout();
          this.bindTouch();
        };
        _proto.onRemove = function onRemove() {
          if (!this.touched) return;
          var node = this.node;
          node.off(Node.EventType.TOUCH_START, this.onPointerDown, this);
          node.off(Node.EventType.TOUCH_MOVE, this.onPointerMove, this);
          node.off(Node.EventType.TOUCH_END, this.onPointerUp, this);
          node.off(Node.EventType.TOUCH_CANCEL, this.onPointerUp, this);
        };
        _proto.update = function update() {
          // 检查器或拉宽后重排。编辑态和运行态同一条
          var uit = this.node.getComponent(UITransform);
          if (!uit || !this.track) return;
          var mark = this.value + "|" + uit.width + "|" + uit.height;
          if (mark === this.stamp) return;
          this.value = clamp01(this.value);
          this.layout();
        }

        /** 改值。不调用 onChange */;
        _proto.setValue = function setValue(value) {
          this.value = clamp01(value);
          this.layout();
        }

        /** 只在手指按下或移动时调用。setValue 不走这里 */;
        _proto.setOnChange = function setOnChange(cb) {
          this.onChange = cb;
        };
        _proto.bindNodes = function bindNodes() {
          var _this$node$getChildBy, _this$node$getChildBy2, _this$node$getChildBy3, _this$node$getChildBy4;
          this.track = (_this$node$getChildBy = (_this$node$getChildBy2 = this.node.getChildByName('track')) == null ? void 0 : _this$node$getChildBy2.getComponent(Sprite)) != null ? _this$node$getChildBy : null;
          this.thumb = (_this$node$getChildBy3 = (_this$node$getChildBy4 = this.node.getChildByName('thumb')) == null ? void 0 : _this$node$getChildBy4.getComponent(Sprite)) != null ? _this$node$getChildBy3 : null;
          return !!(this.track && this.thumb);
        };
        _proto.bindTouch = function bindTouch() {
          this.touched = true;
          var node = this.node;
          node.on(Node.EventType.TOUCH_START, this.onPointerDown, this);
          node.on(Node.EventType.TOUCH_MOVE, this.onPointerMove, this);
          node.on(Node.EventType.TOUCH_END, this.onPointerUp, this);
          node.on(Node.EventType.TOUCH_CANCEL, this.onPointerUp, this);
        };
        _proto.onPointerDown = function onPointerDown(ev) {
          if (gu.loadingNames.length > 0) {
            // 这次手势整段丢掉
            this.drag = false;
            return;
          }
          this.drag = true;
          this.pointer(ev);
        };
        _proto.onPointerMove = function onPointerMove(ev) {
          if (!this.drag) return;
          if (gu.loadingNames.length > 0) {
            this.drag = false;
            return;
          }
          this.pointer(ev);
        };
        _proto.onPointerUp = function onPointerUp() {
          this.drag = false;
        };
        _proto.pointer = function pointer(ev) {
          var _this$onChange;
          var uit = this.node.getComponent(UITransform);
          if (!uit) return;
          var p = ev.getUILocation();
          var local = uit.convertToNodeSpaceAR(new Vec3(p.x, p.y, 0));
          var next = this.valueAt(local.x, this.width());
          if (next === this.value) return;
          this.value = next;
          this.layout();
          (_this$onChange = this.onChange) == null || _this$onChange.call(this, this.value);
        };
        _proto.layout = function layout() {
          var _track$node$getCompon, _thumb$node$getCompon;
          var uit = this.node.getComponent(UITransform);
          var track = this.track;
          var thumb = this.thumb;
          if (!uit || !track || !thumb) return;
          this.value = clamp01(this.value);
          var width = this.width();
          var thumbSize = PF_GM_SLIDER.thumb;
          var travel = width - thumbSize;
          (_track$node$getCompon = track.node.getComponent(UITransform)) == null || _track$node$getCompon.setContentSize(width, PF_GM_SLIDER.trackHeight);
          track.node.setPosition(0, 0, 0);
          (_thumb$node$getCompon = thumb.node.getComponent(UITransform)) == null || _thumb$node$getCompon.setContentSize(thumbSize, thumbSize);
          var x = travel <= 0 ? 0 : -travel / 2 + this.value * travel;
          thumb.node.setPosition(x, 0, 0);
          this.stamp = this.value + "|" + uit.width + "|" + uit.height;
        }

        /** 根宽。窄于滑块则夹到滑块宽，高始终是触摸根 */;
        _proto.width = function width() {
          var uit = this.node.getComponent(UITransform);
          var width = !uit || uit.width < PF_GM_SLIDER.minWidth ? PF_GM_SLIDER.minWidth : uit.width;
          uit == null || uit.setContentSize(width, PF_GM_SLIDER.height);
          return width;
        }

        /** 0 左缘对齐，1 右缘对齐。可走长度为 0 时不改值 */;
        _proto.valueAt = function valueAt(localX, width) {
          var travel = width - PF_GM_SLIDER.thumb;
          if (travel <= 0) return clamp01(this.value);
          var left = -width / 2 + PF_GM_SLIDER.thumb / 2;
          return clamp01((localX - left) / travel);
        };
        _proto.dress = function dress(sprite, name, sliced) {
          if (!sprite) return;
          applySkin(name, function (frame) {
            if (!sprite.isValid) return;
            sprite.spriteFrame = frame;
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            sprite.type = sliced ? Sprite.Type.SLICED : Sprite.Type.SIMPLE;
          });
        };
        return PfGMSlider;
      }(GMComponent), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "value", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      }), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PfGMStepper.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMComponent.ts', './GMSkin.ts', './PfGMBtn.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Sprite, Label, UITransform, Color, GMComponent, applySkin, PfGMBtn;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Label = module.Label;
      UITransform = module.UITransform;
      Color = module.Color;
    }, function (module) {
      GMComponent = module.GMComponent;
    }, function (module) {
      applySkin = module.applySkin;
    }, function (module) {
      PfGMBtn = module.PfGMBtn;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "e6c03pCnTdLXL+EOg0ufJ9T", "PfGMStepper", undefined);
      var ccclass = _decorator.ccclass,
        executeInEditMode = _decorator.executeInEditMode,
        property = _decorator.property;

      /**
       * 步进可调参数。改数字改这里。
       * 数字板 140×72，字 28 号深墨。按钮是嵌套的中档纯图标，间距 16。
       */
      var PF_GM_STEPPER = {
        plateW: 140,
        plateH: 72,
        fontSize: 28,
        ink: [92, 64, 32]
      };
      function whole(n, fallback) {
        var r = Math.round(n);
        return Number.isFinite(r) ? r : fallback;
      }

      /** 框架步进。减号和加号是嵌套的 PfGMBtn。点按由外层 gu.addClick 注册 */
      var PfGMStepper = exports('PfGMStepper', (_dec = ccclass('PfGMStepper'), _dec2 = executeInEditMode(true), _dec(_class = _dec2(_class = (_class2 = /*#__PURE__*/function (_GMComponent) {
        _inheritsLoose(PfGMStepper, _GMComponent);
        function PfGMStepper() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMComponent.call.apply(_GMComponent, [this].concat(args)) || this;
          _this.plate = null;
          _this.label = null;
          _this.minusBtn = null;
          _this.plusBtn = null;
          _this.stamp = '';
          _initializerDefineProperty(_this, "value", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "min", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "max", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "step", _descriptor4, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = PfGMStepper.prototype;
        _proto.onInit = function onInit() {
          if (!this.bindNodes()) return console.error('[PfGMStepper] 需要 plate、label、btnMinus、btnPlus');
          if (this.label.isSystemFontUsed || !this.label.font) console.error('[PfGMStepper] label 未挂 db://gmajor/fonts/main.ttf');
          this.dress();
          this.layout();
        };
        _proto.update = function update() {
          // 检查器改了属性就收成整数并刷新两边的禁用
          var mark = this.value + "|" + this.min + "|" + this.max + "|" + this.step;
          if (mark === this.stamp) return;
          this.layout();
        }

        /** 收成整数再夹进 min–max。改中间的字，并刷新加减的禁用 */;
        _proto.setValue = function setValue(value) {
          this.value = value;
          this.layout();
        };
        _proto.bindNodes = function bindNodes() {
          var _this$node$getChildBy, _this$node$getChildBy2, _this$node$getChildBy3, _this$node$getChildBy4, _this$node$getChildBy5, _this$node$getChildBy6, _this$node$getChildBy7, _this$node$getChildBy8;
          this.plate = (_this$node$getChildBy = (_this$node$getChildBy2 = this.node.getChildByName('plate')) == null ? void 0 : _this$node$getChildBy2.getComponent(Sprite)) != null ? _this$node$getChildBy : null;
          this.label = (_this$node$getChildBy3 = (_this$node$getChildBy4 = this.node.getChildByName('label')) == null ? void 0 : _this$node$getChildBy4.getComponent(Label)) != null ? _this$node$getChildBy3 : null;
          this.minusBtn = (_this$node$getChildBy5 = (_this$node$getChildBy6 = this.node.getChildByName('btnMinus')) == null ? void 0 : _this$node$getChildBy6.getComponent(PfGMBtn)) != null ? _this$node$getChildBy5 : null;
          this.plusBtn = (_this$node$getChildBy7 = (_this$node$getChildBy8 = this.node.getChildByName('btnPlus')) == null ? void 0 : _this$node$getChildBy8.getComponent(PfGMBtn)) != null ? _this$node$getChildBy7 : null;
          return !!(this.plate && this.label && this.minusBtn && this.plusBtn);
        };
        _proto.layout = function layout() {
          var _this$minusBtn, _this$plusBtn;
          var plate = this.plate;
          var label = this.label;
          if (!plate || !label) return;
          this.step = whole(this.step, 1);
          if (this.step < 1) this.step = 1;
          this.min = whole(this.min, 0);
          this.max = whole(this.max, this.min);
          if (this.max < this.min) this.max = this.min;
          this.value = whole(this.value, this.min);
          if (this.value < this.min) this.value = this.min;
          if (this.value > this.max) this.value = this.max;
          var put = plate.node.getComponent(UITransform);
          put == null || put.setContentSize(PF_GM_STEPPER.plateW, PF_GM_STEPPER.plateH);
          plate.node.setPosition(0, 0, 0);
          var ink = PF_GM_STEPPER.ink;
          label.string = String(this.value);
          label.fontSize = PF_GM_STEPPER.fontSize;
          label.lineHeight = PF_GM_STEPPER.fontSize;
          label.color = new Color(ink[0], ink[1], ink[2], 255);
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
          label.verticalAlign = Label.VerticalAlign.CENTER;
          label.overflow = Label.Overflow.SHRINK;
          label.enableWrapText = false;
          label.enableOutline = false;
          var lut = label.node.getComponent(UITransform);
          lut == null || lut.setContentSize(PF_GM_STEPPER.plateW, PF_GM_STEPPER.plateH);
          label.node.setPosition(0, 0, 0);
          (_this$minusBtn = this.minusBtn) == null || _this$minusBtn.setEnabled(this.value > this.min);
          (_this$plusBtn = this.plusBtn) == null || _this$plusBtn.setEnabled(this.value < this.max);
          this.stamp = this.value + "|" + this.min + "|" + this.max + "|" + this.step;
        };
        _proto.dress = function dress() {
          var plate = this.plate;
          if (!plate) return;
          applySkin('stepper_plate', function (frame) {
            if (!plate.isValid) return;
            plate.spriteFrame = frame;
            plate.sizeMode = Sprite.SizeMode.CUSTOM;
            plate.type = Sprite.Type.SLICED;
          });
        };
        return PfGMStepper;
      }(GMComponent), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "value", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "min", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "max", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "step", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      })), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PfGMTabs.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMLauncher.ts', './GMComponent.ts', './GMTabPage.ts', './GMSkin.ts'], function (exports) {
  var _applyDecoratedDescriptor, _initializerDefineProperty, _inheritsLoose, _assertThisInitialized, _createForOfIteratorHelperLoose, cclegacy, _decorator, CCObjectFlags, Enum, Node, Prefab, Sprite, BlockInputEvents, instantiate, UITransform, Label, Color, assetManager, gu, GMComponent, GMTabPage, applySkin;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _inheritsLoose = module.inheritsLoose;
      _assertThisInitialized = module.assertThisInitialized;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      CCObjectFlags = module.CCObjectFlags;
      Enum = module.Enum;
      Node = module.Node;
      Prefab = module.Prefab;
      Sprite = module.Sprite;
      BlockInputEvents = module.BlockInputEvents;
      instantiate = module.instantiate;
      UITransform = module.UITransform;
      Label = module.Label;
      Color = module.Color;
      assetManager = module.assetManager;
    }, function (module) {
      gu = module.gu;
    }, function (module) {
      GMComponent = module.GMComponent;
    }, function (module) {
      GMTabPage = module.GMTabPage;
    }, function (module) {
      applySkin = module.applySkin;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _dec5, _dec6, _dec7, _class4, _class5, _descriptor4, _descriptor5;
      cclegacy._RF.push({}, "b7e3cGgXyRMjabhnQs/csFY", "PfGMTabs", undefined);
      var ccclass = _decorator.ccclass,
        executeInEditMode = _decorator.executeInEditMode,
        property = _decorator.property;

      /**
       * 页签可调参数。改数字改这里。
       * 外框读根节点，预制体默认 640×480。页签高 72，和首页「页签 / 设置」一样。
       * 字号 26。宽按五个中文字不缩放来排。第一颗从 panel 顶边圆角之后开始，再往右挨着排。
       * 页签九宫格上 10、下 2、左 10、右 10。panel 四边 20。
       */
      var PF_GM_TABS = {
        width: 640,
        tabH: 72,
        // 首页 tabHome / tabSetting 的高度
        corner: 12,
        // panel 顶边圆角。原图顶行从 x=12 才实心，第一颗从这里起
        fontSize: 26,
        padX: 12,
        // 五个字两侧留白，躲开左右圆角
        sample: '中中中中中',
        // 用来量一颗页签的宽
        ink: [92, 64, 32],
        // 和标题同一套深墨
        fallback: 5,
        // 秒；页面忘了调用 done
        font: 'ee40121d-0b21-4bb3-b95c-fa7d2df322b4',
        // db://gmajor/fonts/main.ttf
        dontSave: CCObjectFlags.DontSave // 编辑器里生成的页签不写进预制体
      };

      var GMTabSource = exports('GMTabSource', /*#__PURE__*/function (GMTabSource) {
        GMTabSource[GMTabSource["node"] = 0] = "node";
        GMTabSource[GMTabSource["prefab"] = 1] = "prefab";
        return GMTabSource;
      }({})); // 拖预制体资源
      Enum(GMTabSource);

      /** 编辑器里的一项。下拉框决定露出节点还是预制体 */
      var GMTabSlot = exports('GMTabSlot', (_dec = ccclass('GMTabSlot'), _dec2 = property({
        type: Enum(GMTabSource)
      }), _dec3 = property({
        type: Node,
        visible: function visible() {
          return this.source === GMTabSource.node;
        }
      }), _dec4 = property({
        type: Prefab,
        visible: function visible() {
          return this.source === GMTabSource.prefab;
        }
      }), _dec(_class = (_class2 = function GMTabSlot() {
        _initializerDefineProperty(this, "source", _descriptor, this);
        _initializerDefineProperty(this, "page", _descriptor2, this);
        _initializerDefineProperty(this, "prefab", _descriptor3, this);
      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "source", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return GMTabSource.node;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "page", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      function ink() {
        var c = PF_GM_TABS.ink;
        return new Color(c[0], c[1], c[2], 255);
      }

      /** 框架页签。上面一排页签，下面 panel。根锚点在中心 */
      var PfGMTabs = exports('PfGMTabs', (_dec5 = ccclass('PfGMTabs'), _dec6 = executeInEditMode(true), _dec7 = property({
        type: [GMTabSlot]
      }), _dec5(_class4 = _dec6(_class4 = (_class5 = /*#__PURE__*/function (_GMComponent) {
        _inheritsLoose(PfGMTabs, _GMComponent);
        function PfGMTabs() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMComponent.call.apply(_GMComponent, [this].concat(args)) || this;
          _this.tabsNode = null;
          _this.panelNode = null;
          _this.panelSprite = null;
          _this.pages = [];
          _this.current = -1;
          // 没有当前页
          _this.switching = false;
          _this.pending = null;
          _this.pendingClick = false;
          _this.onChange = null;
          _this.slotMark = '';
          _this.stepGen = 0;
          _this.hookName = '';
          _this.closeStep = null;
          _this.normal = null;
          _this.selected = null;
          _this.fixedW = 0;
          // 五个字量出来的页签宽。字库晚到就重测
          _initializerDefineProperty(_this, "index", _descriptor4, _assertThisInitialized(_this));
          // 和 setIndex 同一份。越界会夹紧
          _initializerDefineProperty(_this, "slots", _descriptor5, _assertThisInitialized(_this));
          _this.lateStep = function () {
            console.warn('[PfGMTabs]', _this.hookName, '未调用 done，已兜底');
            _this.closeStep == null || _this.closeStep();
          };
          return _this;
        }
        var _proto = PfGMTabs.prototype;
        _proto.onInit = function onInit() {
          if (!this.bindNodes()) return console.error('[PfGMTabs] 需要子节点 tabs 和 panel');
          this.dressPanel();
          this.loadFrames();
          this.syncSlots(true);
          this.layout();
          if (this.pages.length === 0) return;
          this.request(this.clamp(Math.round(this.index)), false);
        };
        _proto.onRemove = function onRemove() {
          this.stepGen++;
          this.unschedule(this.lateStep);
          this.closeStep = null;
          if (this.switching) gu.loadingHide(this.loadingKey());
        };
        _proto.update = function update() {
          // 检查器改下标、拉宽、或 setText 之后重排
          if (!this.tabsNode) return;
          this.syncIndex();
          this.layout();
        }

        /** 改当前页。和点页签同一套切换，但不调用 setOnChange */;
        _proto.setIndex = function setIndex(index) {
          if (this.pages.length === 0) {
            this.index = 0;
            this.current = -1;
            return;
          }
          this.request(this.clamp(Math.round(index)), false);
        }

        /** 只在用户点页签并且这次切换走完之后调用 */;
        _proto.setOnChange = function setOnChange(cb) {
          this.onChange = cb;
        }

        /** 插入一页。不传下标就加到末尾。留在当前页 */;
        _proto.insert = function insert(content, index) {
          if (!content) return console.error('[PfGMTabs] insert 没有内容');
          if (this.switching) return console.error('[PfGMTabs] 切换中不能插入');
          var at = index === undefined ? this.pages.length : index;
          var claimed = this.claim(content);
          if (!claimed) return;
          if (!Number.isInteger(at) || at < 0 || at > this.pages.length) {
            if (claimed.made && claimed.page.node.isValid) claimed.page.node.destroy();
            return console.error('[PfGMTabs] insert 下标不合法', index);
          }
          var entry = this.makeEntry(claimed.page, claimed.made);
          this.pages.splice(at, 0, entry);
          if (this.current >= at) this.current += 1;
          if (this.current >= 0) this.index = this.current;
          this.layout();
        }

        /** 删一页。下标必须是现有页。删当前页会切到相邻页 */;
        _proto.remove = function remove(index) {
          if (!Number.isInteger(index) || index < 0 || index >= this.pages.length) return console.error('[PfGMTabs] remove 下标不合法', index);
          if (this.switching) return console.error('[PfGMTabs] 切换中不能删除');
          if (index === this.current) return this.removeShown(index);
          var shown = this.current;
          this.destroyEntry(index);
          if (shown > index) this.current = shown - 1;else if (shown === index) this.current = this.pages.length ? Math.min(index, this.pages.length - 1) : -1;
          this.index = this.current < 0 ? 0 : this.current;
          this.layout();
        }

        /** GMTabPage.setText 调用。把页签上的字改掉 */;
        _proto.noteText = function noteText() {
          this.layout();
        };
        _proto.bindNodes = function bindNodes() {
          var _this$panelNode$getCo, _this$panelNode;
          this.tabsNode = this.node.getChildByName('tabs');
          this.panelNode = this.node.getChildByName('panel');
          this.panelSprite = (_this$panelNode$getCo = (_this$panelNode = this.panelNode) == null ? void 0 : _this$panelNode.getComponent(Sprite)) != null ? _this$panelNode$getCo : null;
          if (!this.tabsNode || !this.panelNode || !this.panelSprite) return false;
          if (!this.panelNode.getComponent(BlockInputEvents)) this.panelNode.addComponent(BlockInputEvents);
          return true;
        };
        _proto.syncSlots = function syncSlots(force) {
          var mark = this.slots.map(function (slot) {
            var _slot$prefab$uuid, _slot$prefab, _slot$page$uuid, _slot$page;
            return slot.source + ':' + (slot.source === GMTabSource.prefab ? (_slot$prefab$uuid = (_slot$prefab = slot.prefab) == null ? void 0 : _slot$prefab.uuid) != null ? _slot$prefab$uuid : '' : (_slot$page$uuid = (_slot$page = slot.page) == null ? void 0 : _slot$page.uuid) != null ? _slot$page$uuid : '');
          }).join(',');
          if (!force && mark === this.slotMark) return;
          this.clearMade();
          this.slotMark = mark;
          for (var _iterator = _createForOfIteratorHelperLoose(this.slots), _step; !(_step = _iterator()).done;) {
            var slot = _step.value;
            this.mountSlot(slot);
          }
        };
        _proto.syncIndex = function syncIndex() {
          if (this.switching) return;
          if (this.pages.length === 0) {
            this.current = -1;
            this.index = 0;
            return;
          }
          var next = this.clamp(Math.round(this.index));
          if (next !== this.index) this.index = next;
          if (next === this.current) return;
          this.request(next, false);
        };
        _proto.mountSlot = function mountSlot(slot) {
          var content = slot.source === GMTabSource.prefab ? slot.prefab : slot.page;
          if (!content) return console.error('[PfGMTabs] 这一项是空的');
          var claimed = this.claim(content);
          if (!claimed) return;
          this.pages.push(this.makeEntry(claimed.page, claimed.made));
        };
        _proto.claim = function claim(content) {
          if (content instanceof Prefab) {
            var node = instantiate(content);
            this["transient"](node);
            var _page = node.getComponent(GMTabPage);
            if (!_page) {
              node.destroy();
              console.error('[PfGMTabs] 根上不是 GMTabPage');
              return null;
            }
            if (this.pages.some(function (item) {
              return item.page === _page;
            })) {
              node.destroy();
              console.error('[PfGMTabs] 重复绑定');
              return null;
            }
            this.adopt(node);
            return {
              page: _page,
              made: true
            };
          }
          var page = content.getComponent(GMTabPage);
          if (!page) return console.error('[PfGMTabs] 根上不是 GMTabPage'), null;
          if (this.pages.some(function (item) {
            return item.page === page;
          })) return console.error('[PfGMTabs] 重复绑定'), null;
          this.adopt(content);
          return {
            page: page,
            made: false
          };
        };
        _proto.adopt = function adopt(node) {
          var panel = this.panelNode;
          if (!panel) return;
          node.layer = panel.layer;
          node.active = false; // 先关掉再入树，onInit 留到第一次显示
          if (node.parent !== panel) panel.addChild(node);
        };
        _proto.makeEntry = function makeEntry(page, made) {
          var tabs = this.tabsNode;
          var tab = new Node('tab');
          var host = tabs != null ? tabs : this.node;
          tab.layer = host.layer;
          host.addChild(tab);
          var tabUt = tab.addComponent(UITransform); // 先于 Sprite，避免后补的变换把尺寸留在默认 100
          tabUt.setAnchorPoint(0.5, 0.5);
          var plate = tab.addComponent(Sprite);
          plate.sizeMode = Sprite.SizeMode.CUSTOM; // 贴图前锁住，原图 56×32 不能改节点宽高
          plate.type = Sprite.Type.SLICED;
          var labelNode = new Node('label');
          labelNode.layer = tab.layer;
          tab.addChild(labelNode);
          labelNode.addComponent(UITransform);
          var label = labelNode.addComponent(Label);
          this.dressLabel(label);
          this["transient"](tab);
          var entry = {
            page: page,
            tab: tab,
            label: label,
            plate: plate,
            made: made,
            wired: false
          };
          this.wire(entry);
          return entry;
        };
        _proto.wire = function wire(entry) {
          var _this2 = this;
          if (entry.wired) return;
          entry.wired = true;
          var tab = entry.tab;
          gu.addClick(tab, function () {
            var at = _this2.pages.findIndex(function (item) {
              return item.tab === tab;
            });
            if (at < 0) return;
            _this2.request(at, true);
          });
        };
        _proto.request = function request(index, fromClick) {
          if (this.pages.length === 0) return;
          var next = this.clamp(index);
          this.index = next;
          if (this.switching) {
            this.pending = next;
            this.pendingClick = fromClick;
            return;
          }
          if (next === this.current) return;
          this.begin(next, fromClick);
        };
        _proto.begin = function begin(next, fromClick) {
          var _prev$page,
            _this3 = this;
          this.switching = true;
          gu.loadingShow(this.loadingKey());
          var prev = this.current >= 0 ? this.pages[this.current] : null;
          this.runHook((_prev$page = prev == null ? void 0 : prev.page) != null ? _prev$page : null, 'onHide', function () {
            var _this3$pages$next$pag, _this3$pages$next;
            if (!_this3.isValid) return;
            _this3.current = next;
            _this3.index = next;
            _this3.layout();
            _this3.runHook((_this3$pages$next$pag = (_this3$pages$next = _this3.pages[next]) == null ? void 0 : _this3$pages$next.page) != null ? _this3$pages$next$pag : null, 'onShow', function () {
              return _this3.endSwitch(fromClick, next);
            });
          });
        };
        _proto.removeShown = function removeShown(index) {
          var _this4 = this;
          var neighbor = this.pages.length === 1 ? null : this.pages[index < this.pages.length - 1 ? index + 1 : index - 1];
          this.switching = true;
          gu.loadingShow(this.loadingKey());
          this.runHook(this.pages[index].page, 'onHide', function () {
            if (!_this4.isValid) return;
            _this4.destroyEntry(index);
            if (!neighbor || !neighbor.page.node.isValid) {
              _this4.current = -1;
              _this4.index = 0;
              _this4.layout();
              _this4.endSwitch(false, -1);
              return;
            }
            var at = _this4.pages.indexOf(neighbor);
            _this4.current = at;
            _this4.index = at;
            _this4.layout();
            _this4.runHook(neighbor.page, 'onShow', function () {
              return _this4.endSwitch(false, at);
            });
          });
        };
        _proto.endSwitch = function endSwitch(fromClick, landed) {
          var _this$onChange;
          if (!this.isValid) return;
          gu.loadingHide(this.loadingKey());
          this.switching = false;
          if (fromClick && landed >= 0) (_this$onChange = this.onChange) == null || _this$onChange.call(this, landed);
          if (this.pending === null) return;
          var next = this.pending;
          var click = this.pendingClick;
          this.pending = null;
          this.pendingClick = false;
          if (this.pages.length === 0 || next === this.current) return;
          this.begin(this.clamp(next), click);
        };
        _proto.runHook = function runHook(page, hook, done) {
          var _this5 = this;
          if (!(page != null && page.node.isValid)) return done();
          var gen = ++this.stepGen;
          var closed = false;
          var close = function close() {
            if (closed || gen !== _this5.stepGen) return;
            closed = true;
            _this5.unschedule(_this5.lateStep);
            if (_this5.isValid) done();
          };
          this.closeStep = close;
          this.hookName = hook;
          this.unschedule(this.lateStep);
          this.scheduleOnce(this.lateStep, PF_GM_TABS.fallback);
          var fn = page[hook];
          if (typeof fn !== 'function') return close();
          fn.call(page, close);
        };
        _proto.layout = function layout() {
          var _tabs$getComponent, _panel$getComponent;
          var tabs = this.tabsNode;
          var panel = this.panelNode;
          var uit = this.node.getComponent(UITransform);
          if (!tabs || !panel || !uit) return;
          uit.setAnchorPoint(0.5, 0.5);
          var width = uit.width > 0 ? uit.width : PF_GM_TABS.width;
          var height = uit.height >= PF_GM_TABS.tabH ? uit.height : PF_GM_TABS.tabH;
          uit.setContentSize(width, height);
          var tabH = PF_GM_TABS.tabH;
          var panelH = height - tabH;
          var tabsUt = (_tabs$getComponent = tabs.getComponent(UITransform)) != null ? _tabs$getComponent : tabs.addComponent(UITransform);
          var panelUt = (_panel$getComponent = panel.getComponent(UITransform)) != null ? _panel$getComponent : panel.addComponent(UITransform);
          tabsUt.setAnchorPoint(0.5, 0.5);
          panelUt.setAnchorPoint(0.5, 0.5);
          tabsUt.setContentSize(width, tabH);
          panelUt.setContentSize(width, panelH);
          var tabBottom = height / 2 - tabH; // 页签底边，同时是 panel 的上沿
          tabs.setPosition(0, tabBottom + tabH / 2, 0);
          panel.setPosition(0, (tabBottom + -height / 2) / 2, 0);
          if (this.fixedW <= 0 && this.pages.length > 0) this.fixedW = this.measureTab(this.pages[0].label);
          var tabW = Math.round(this.fixedW > 0 ? this.fixedW : PF_GM_TABS.fontSize * 5 + PF_GM_TABS.padX * 2);
          var count = this.pages.length;
          var left = -width / 2 + PF_GM_TABS.corner; // 让过左上圆角再排第一颗
          for (var i = 0; i < count; i++) {
            var _entry$tab$getCompone, _this$selected;
            var entry = this.pages[i];
            var on = i === this.current;
            var tabUt = (_entry$tab$getCompone = entry.tab.getComponent(UITransform)) != null ? _entry$tab$getCompone : entry.tab.addComponent(UITransform);
            var frame = on ? (_this$selected = this.selected) != null ? _this$selected : this.normal : this.normal;
            entry.plate.sizeMode = Sprite.SizeMode.CUSTOM; // 先锁自定义，贴上原图才不会把节点打回 56×32
            entry.plate.type = Sprite.Type.SLICED;
            if (frame) entry.plate.spriteFrame = frame;
            tabUt.setAnchorPoint(0.5, 0); // 底边钉在 tabs 底上，也就是 panel 上沿
            tabUt.setContentSize(tabW, tabH); // 贴图之后再写，每帧都写，避免被原图尺寸盖住
            entry.tab.setPosition(left + (i + 0.5) * tabW, -tabH / 2, 0);
            this.dressLabel(entry.label);
            entry.label.string = entry.page.text;
            var lut = entry.label.node.getComponent(UITransform);
            lut == null || lut.setAnchorPoint(0.5, 0.5);
            lut == null || lut.setContentSize(Math.max(0, tabW - PF_GM_TABS.padX * 2), tabH);
            entry.label.node.setPosition(0, tabH / 2, 0);
            entry.page.node.active = on;
            if (on) this.fill(entry.page.node, panelUt);
          }
          var shown = this.current >= 0 ? this.pages[this.current] : null;
          if (shown) shown.tab.setSiblingIndex(tabs.children.length - 1);
        };
        _proto.fill = function fill(node, panelUt) {
          var _node$getComponent;
          var uit = (_node$getComponent = node.getComponent(UITransform)) != null ? _node$getComponent : node.addComponent(UITransform);
          uit.setAnchorPoint(0.5, 0.5);
          uit.setContentSize(panelUt.contentSize);
          node.setPosition(0, 0, 0);
        };
        _proto.clearMade = function clearMade() {
          for (var _iterator2 = _createForOfIteratorHelperLoose(this.pages), _step2; !(_step2 = _iterator2()).done;) {
            var entry = _step2.value;
            if (entry.tab.isValid) entry.tab.destroy();
            if (entry.made && entry.page.node.isValid) entry.page.node.destroy();else if (entry.page.node.isValid) entry.page.node.active = false;
          }
          this.pages = [];
          this.current = -1;
        };
        _proto.destroyEntry = function destroyEntry(index) {
          var entry = this.pages[index];
          if (!entry) return;
          this.pages.splice(index, 1);
          if (entry.tab.isValid) entry.tab.destroy();
          if (entry.page.node.isValid) entry.page.node.destroy();
        };
        _proto.clamp = function clamp(index) {
          if (this.pages.length === 0) return 0;
          if (index < 0) return 0;
          if (index >= this.pages.length) return this.pages.length - 1;
          return index;
        };
        _proto.loadingKey = function loadingKey() {
          return 'PfGMTabs:' + this.node.uuid;
        };
        _proto.loadFrames = function loadFrames() {
          var _this6 = this;
          applySkin('tab_normal', function (frame) {
            return _this6.takeFrame(frame, 10, 2, 10, 10, false);
          });
          applySkin('tab_selected', function (frame) {
            return _this6.takeFrame(frame, 10, 2, 10, 10, true);
          });
        };
        _proto.takeFrame = function takeFrame(frame, top, bottom, left, right, selected) {
          frame.insetTop = top;
          frame.insetBottom = bottom;
          frame.insetLeft = left;
          frame.insetRight = right;
          if (selected) this.selected = frame;else this.normal = frame;
          this.layout();
        };
        _proto.dressPanel = function dressPanel() {
          var sprite = this.panelSprite;
          if (!sprite) return;
          applySkin('panel', function (frame) {
            var _uit$width, _uit$height;
            if (!sprite.isValid) return;
            var uit = sprite.node.getComponent(UITransform);
            var w = (_uit$width = uit == null ? void 0 : uit.width) != null ? _uit$width : 0;
            var h = (_uit$height = uit == null ? void 0 : uit.height) != null ? _uit$height : 0;
            frame.insetTop = frame.insetBottom = frame.insetLeft = frame.insetRight = 20;
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            sprite.type = Sprite.Type.SLICED;
            sprite.spriteFrame = frame;
            if (uit && w > 0 && h > 0) uit.setContentSize(w, h); // 贴图会按原图像素改尺寸，锁回去
          });
        };

        _proto.dressLabel = function dressLabel(label) {
          var _this7 = this;
          label.fontSize = PF_GM_TABS.fontSize;
          label.lineHeight = PF_GM_TABS.fontSize;
          label.color = ink();
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
          label.verticalAlign = Label.VerticalAlign.CENTER;
          label.overflow = Label.Overflow.SHRINK;
          label.enableWrapText = false;
          label.enableOutline = false;
          var hit = assetManager.assets.get(PF_GM_TABS.font);
          if (hit) {
            label.font = hit;
            return;
          }
          assetManager.loadAny({
            uuid: PF_GM_TABS.font
          }, function (err, font) {
            if (err || !font || !label.isValid) return console.error('[PfGMTabs] 没有 main.ttf');
            label.font = font;
            _this7.fixedW = 0;
            _this7.layout();
          });
        }

        /** 五个中文字的实际宽度，加上两侧留白。字还没排出来时按字号估 */;
        _proto.measureTab = function measureTab(label) {
          var _label$node$getCompon, _label$node$getCompon2;
          var saved = label.string;
          this.dressLabel(label);
          label.string = PF_GM_TABS.sample;
          label.overflow = Label.Overflow.NONE;
          label.enableWrapText = false;
          label.updateRenderData(true);
          var textW = (_label$node$getCompon = (_label$node$getCompon2 = label.node.getComponent(UITransform)) == null ? void 0 : _label$node$getCompon2.width) != null ? _label$node$getCompon : 0;
          label.string = saved;
          label.overflow = Label.Overflow.SHRINK;
          label.enableWrapText = false;
          var pad = PF_GM_TABS.padX * 2;
          if (textW <= 0) return PF_GM_TABS.fontSize * 5 + pad;
          return Math.ceil(textW) + pad;
        }

        /** 编辑器里脚本生成的节点不写进预制体 */;
        _proto["transient"] = function transient(node) {
          return;
        };
        return PfGMTabs;
      }(GMComponent), (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "index", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "slots", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class5)) || _class4) || _class4));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PfGMTitle.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GMComponent.ts', './GMSkin.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Sprite, Label, UITransform, Color, GMComponent, applySkin;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Label = module.Label;
      UITransform = module.UITransform;
      Color = module.Color;
    }, function (module) {
      GMComponent = module.GMComponent;
    }, function (module) {
      applySkin = module.applySkin;
    }],
    execute: function () {
      var _dec, _dec2, _class;
      cclegacy._RF.push({}, "ec502CW0ONFaLJ4tz8vjO3u", "PfGMTitle", undefined);
      var ccclass = _decorator.ccclass,
        executeInEditMode = _decorator.executeInEditMode;

      /**
       * 标题可调参数。改数字改这里。
       * 字体资源：db://gmajor/fonts/main.ttf，挂在子节点 label 上。
       * 九宫格在 title_bar 上：左 48、右 48、上 20、下 20。只拉宽，不拉高。
       * 小档、大档以后在 sizes 里加一行，并把 size 指过去。
       */
      var PF_GM_TITLE = {
        outlineWidth: 0,
        // 0 不描边
        outline: [62, 40, 18],
        // 仅 outlineWidth > 0 时使用
        fill: [92, 64, 32],
        // 深墨
        size: 'medium',
        sizes: {
          medium: {
            height: 85,
            fontSize: 36,
            padX: 56,
            minWidth: 320,
            maxWidth: 680
          }
        }
      };
      function rgb(c) {
        return new Color(c[0], c[1], c[2], 255);
      }

      /** 框架标题。宽随字数在最小和最大之间变，锚点在整条中心。点击由外层注册 */
      var PfGMTitle = exports('PfGMTitle', (_dec = ccclass('PfGMTitle'), _dec2 = executeInEditMode(true), _dec(_class = _dec2(_class = /*#__PURE__*/function (_GMComponent) {
        _inheritsLoose(PfGMTitle, _GMComponent);
        function PfGMTitle() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMComponent.call.apply(_GMComponent, [this].concat(args)) || this;
          _this.label = null;
          _this.plate = null;
          return _this;
        }
        var _proto = PfGMTitle.prototype;
        _proto.onInit = function onInit() {
          var _this$node$getChildBy,
            _this$node$getChildBy2,
            _this2 = this;
          this.plate = this.getComponent(Sprite);
          this.label = (_this$node$getChildBy = (_this$node$getChildBy2 = this.node.getChildByName('label')) == null ? void 0 : _this$node$getChildBy2.getComponent(Label)) != null ? _this$node$getChildBy : null;
          if (!this.plate || !this.label) return console.error('[PfGMTitle] 需要底板 Sprite、子节点 label');
          if (this.label.isSystemFontUsed || !this.label.font) console.error('[PfGMTitle] label 未挂 db://gmajor/fonts/main.ttf');
          applySkin('title_bar', function (frame) {
            var _this2$plate;
            if (!((_this2$plate = _this2.plate) != null && _this2$plate.isValid)) return;
            _this2.plate.spriteFrame = frame;
            _this2.plate.sizeMode = Sprite.SizeMode.CUSTOM;
            _this2.plate.type = Sprite.Type.SLICED;
          });
          this.layout();
        }

        /** 按字宽重排。短于最小宽停在最小宽，长于最大宽则在两侧留白里缩小 */;
        _proto.setText = function setText(text) {
          if (!this.label) return;
          this.label.string = text;
          this.layout();
        };
        _proto.tier = function tier() {
          return PF_GM_TITLE.sizes[PF_GM_TITLE.size];
        };
        _proto.layout = function layout() {
          var tier = this.tier();
          var label = this.label;
          var uit = this.node.getComponent(UITransform);
          var lut = label == null ? void 0 : label.node.getComponent(UITransform);
          if (!label || !uit || !lut) return;
          uit.setAnchorPoint(0.5, 0.5);
          lut.setAnchorPoint(0.5, 0.5);
          label.node.setPosition(0, 0, 0);
          label.fontSize = tier.fontSize;
          label.lineHeight = tier.fontSize;
          label.color = rgb(PF_GM_TITLE.fill);
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
          label.verticalAlign = Label.VerticalAlign.CENTER;
          label.enableWrapText = false;
          label.enableOutline = PF_GM_TITLE.outlineWidth > 0;
          label.outlineWidth = PF_GM_TITLE.outlineWidth;
          label.outlineColor = rgb(PF_GM_TITLE.outline);
          var textW = this.measure(label);
          var wanted = textW + tier.padX * 2;
          var width = Math.min(tier.maxWidth, Math.max(tier.minWidth, wanted));
          if (this.plate) {
            this.plate.sizeMode = Sprite.SizeMode.CUSTOM;
            this.plate.type = Sprite.Type.SLICED;
          }
          uit.setContentSize(width, tier.height);
          var shrink = wanted > tier.maxWidth || label.string.length > 0 && textW <= 0;
          if (!shrink) return;
          label.overflow = Label.Overflow.SHRINK;
          lut.setContentSize(Math.max(0, width - tier.padX * 2), tier.height);
          label.updateRenderData(true);
        }

        /** 先按不缩放排出字宽。排不出时当 0，由 layout 收进最小宽里缩小 */;
        _proto.measure = function measure(label) {
          var _label$node$getCompon, _label$node$getCompon2;
          label.overflow = Label.Overflow.NONE;
          label.updateRenderData(true);
          return (_label$node$getCompon = (_label$node$getCompon2 = label.node.getComponent(UITransform)) == null ? void 0 : _label$node$getCompon2.width) != null ? _label$node$getCompon : 0;
        };
        return PfGMTitle;
      }(GMComponent)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ScMain.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './config.ts', './GMLauncher.ts', './GMScene.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, config, gp, gm, GMScene;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, null, function (module) {
      config = module.config;
    }, function (module) {
      gp = module.gp;
      gm = module.gm;
    }, function (module) {
      GMScene = module.GMScene;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "1781ckFc5NHSYBDaZvQC4jq", "ScMain", undefined);
      var ccclass = _decorator.ccclass;

      /** ScMain.scene 关联脚本；挂 Canvas 下同名空节点；只点火，不写游戏名 */
      var ScMain = exports('ScMain', (_dec = ccclass('ScMain'), _dec(_class = /*#__PURE__*/function (_GMScene) {
        _inheritsLoose(ScMain, _GMScene);
        function ScMain() {
          return _GMScene.apply(this, arguments) || this;
        }
        var _proto = ScMain.prototype;
        _proto.onStart = function onStart() {
          var role = gp.params.role || 'web';
          console.info('[ScMain] 版本', 'gmajor', gm.version, 'app', config.version.app, 'platform', gp.id, 'role', role);
          gm.boot(config, function (err) {
            if (err) return console.error('[ScMain] boot 失败', err);
            console.info('[ScMain] 入口完成', '绑定树', gm.binder.dumpTree());
          }, function (finished, total) {
            console.info('[ScMain] boot 进度', finished, total);
          });
        };
        return ScMain;
      }(GMScene)) || _class));
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
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