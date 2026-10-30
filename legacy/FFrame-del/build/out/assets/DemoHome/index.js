System.register("chunks:///_virtual/DemoHome", ['./DemoHomeEntry.ts', './LySetting.ts', './PfDemoItem.ts', './PfDemoTabPage.ts', './ScDemoHome.ts'], function () {
  return {
    setters: [null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/DemoHomeEntry.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './GMLauncher.ts', './GMBundleEntryBase.ts'], function () {
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
      cclegacy._RF.push({}, "b2c3dTl9qeJAbze8SNFZ4kB", "DemoHomeEntry", undefined);

      /** web 入口：只开场景。Alert / loading / 占用 unbind 等验收已过，不再自动跑 */
      var DemoHomeEntry = /*#__PURE__*/function (_GMBundleEntryBase) {
        _inheritsLoose(DemoHomeEntry, _GMBundleEntryBase);
        function DemoHomeEntry() {
          return _GMBundleEntryBase.call(this, 'DemoHome') || this;
        }
        var _proto = DemoHomeEntry.prototype;
        _proto.onBind = /*#__PURE__*/function () {
          var _onBind = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(ctx) {
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  ctx.openScene('ScDemoHome', function (err) {
                    if (err) return console.error('[DemoHome] openScene 失败', err);
                  });
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
        return DemoHomeEntry;
      }(GMBundleEntryBase);
      registerBundleEntry('DemoHome', new DemoHomeEntry());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LySetting.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './SkinKit.ts', './GMLauncher.ts', './PfGMBar.ts', './PfGMStepper.ts', './GMLayer.ts'], function (exports) {
  var _inheritsLoose, _createForOfIteratorHelperLoose, cclegacy, _decorator, addText, skinInk, loadSkin, addSkin, dress, gu, PfGMBar, PfGMStepper, GMLayer;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, null, function (module) {
      addText = module.addText;
      skinInk = module.skinInk;
      loadSkin = module.loadSkin;
      addSkin = module.addSkin;
      dress = module.dress;
    }, function (module) {
      gu = module.gu;
    }, function (module) {
      PfGMBar = module.PfGMBar;
    }, function (module) {
      PfGMStepper = module.PfGMStepper;
    }, function (module) {
      GMLayer = module.GMLayer;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "f7521COMZZDTOUEoo/NbTTn", "LySetting", undefined);
      var ccclass = _decorator.ccclass;

      /** 设置：音量、经验条、步进和道具格，用 v7 皮 */
      var LySetting = exports('LySetting', (_dec = ccclass('LySetting'), _dec(_class = /*#__PURE__*/function (_GMLayer) {
        _inheritsLoose(LySetting, _GMLayer);
        function LySetting() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMLayer.call.apply(_GMLayer, [this].concat(args)) || this;
          _this.skins = [];
          return _this;
        }
        var _proto = LySetting.prototype;
        _proto.onInit = function onInit() {
          var _this2 = this;
          var panel = this.panel;
          if (!panel) return;
          var plate = this.put(panel, 'panel', 0, 0, 600, 760);
          plate.setSiblingIndex(0); // 背板垫在预制体里的标题和按钮下面
          var close = panel.getChildByName('btnClose');
          var help = panel.getChildByName('btnHelp');
          if (close) gu.addClick(close, function () {
            return gu.closeLayer('LySetting');
          });
          if (help) gu.addClick(help, function () {
            return gu.alert('音乐、音效和语言都记在本机。');
          });
          this.caption(panel, 'icon_music', '音乐', 200);
          this.caption(panel, 'icon_sfx', '音效', 110);
          addText(panel, '经验', 22, skinInk, 80, 36).node.setPosition(-220, 16, 0);
          this.put(panel, 'icon_settings', -220, -80, 56, 56);
          addText(panel, '语言  中文', 26, skinInk, 220, 48).node.setPosition(20, -80, 0);
          this.bindBar(panel);
          this.bindStepper(panel);
          this.slot(panel, -290);
          loadSkin(function (err) {
            if (err) return console.error('[LySetting] 皮加载失败', err);
            for (var _iterator = _createForOfIteratorHelperLoose(_this2.skins), _step; !(_step = _iterator()).done;) {
              var _step$value = _step.value,
                node = _step$value[0],
                name = _step$value[1];
              dress(node, name);
            }
          });
        };
        _proto.put = function put(parent, name, x, y, w, h) {
          var node = addSkin(parent, name, x, y, w, h);
          this.skins.push([node, name]);
          return node;
        };
        _proto.caption = function caption(parent, icon, text, y) {
          this.put(parent, icon, -230, y, 56, 56);
          addText(parent, text, 24, skinInk, 80, 40).node.setPosition(-150, y, 0);
        };
        _proto.bindBar = function bindBar(panel) {
          var _panel$getChildByName, _panel$getChildByName2;
          var bar = (_panel$getChildByName = (_panel$getChildByName2 = panel.getChildByName('bar')) == null ? void 0 : _panel$getChildByName2.getComponent(PfGMBar)) != null ? _panel$getChildByName : null;
          var btn = panel.getChildByName('btnBar');
          if (!bar || !btn) return console.error('[LySetting] 进度条缺少调整按钮');
          gu.addClick(btn, function () {
            return bar.setValue(bar.value >= 1 ? 0 : bar.value + 0.25);
          });
        };
        _proto.bindStepper = function bindStepper(panel) {
          var _root$getComponent;
          var root = panel.getChildByName('stepper');
          var stepper = (_root$getComponent = root == null ? void 0 : root.getComponent(PfGMStepper)) != null ? _root$getComponent : null;
          var minus = root == null ? void 0 : root.getChildByName('btnMinus');
          var plus = root == null ? void 0 : root.getChildByName('btnPlus');
          if (!stepper || !minus || !plus) return console.error('[LySetting] 步进预制体缺少按钮');
          gu.addClick(minus, function () {
            return stepper.setValue(stepper.value - stepper.step);
          });
          gu.addClick(plus, function () {
            return stepper.setValue(stepper.value + stepper.step);
          });
        };
        _proto.slot = function slot(parent, y) {
          this.put(parent, 'slot_item', -50, y, 96, 96);
          this.put(parent, 'icon_gold', -50, y, 52, 52);
          this.put(parent, 'frame_select', 80, y, 108, 108);
          this.put(parent, 'icon_diamond', 80, y, 52, 52);
        };
        return LySetting;
      }(GMLayer)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PfDemoItem.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './GMComponent.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, UITransform, Graphics, Color, Node, Label, GMComponent;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      UITransform = module.UITransform;
      Graphics = module.Graphics;
      Color = module.Color;
      Node = module.Node;
      Label = module.Label;
    }, null, function (module) {
      GMComponent = module.GMComponent;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "3a8c10uS19HqYwd4PEjRWeJ", "PfDemoItem", undefined);
      var ccclass = _decorator.ccclass;

      /** Demo 列表项：握脚本句柄改 count，不握 node */
      var PfDemoItem = exports('PfDemoItem', (_dec = ccclass('PfDemoItem'), _dec(_class = /*#__PURE__*/function (_GMComponent) {
        _inheritsLoose(PfDemoItem, _GMComponent);
        function PfDemoItem() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMComponent.call.apply(_GMComponent, [this].concat(args)) || this;
          _this.count = 0;
          _this.label = null;
          return _this;
        }
        var _proto = PfDemoItem.prototype;
        _proto.onInit = function onInit() {
          var _this$node$getCompone, _this$node$getCompone2;
          var uit = (_this$node$getCompone = this.node.getComponent(UITransform)) != null ? _this$node$getCompone : this.node.addComponent(UITransform);
          uit.setContentSize(200, 56);
          var g = (_this$node$getCompone2 = this.node.getComponent(Graphics)) != null ? _this$node$getCompone2 : this.node.addComponent(Graphics);
          g.clear();
          g.fillColor = new Color(20, 80, 40, 230);
          g.roundRect(-100, -28, 200, 56, 8);
          g.fill();
          var title = new Node('label');
          this.node.addChild(title);
          title.layer = this.node.layer;
          title.addComponent(UITransform).setContentSize(200, 56);
          this.label = title.addComponent(Label);
          this.label.fontSize = 24;
          this.label.color = Color.WHITE;
          this.label.horizontalAlign = Label.HorizontalAlign.CENTER;
          this.label.verticalAlign = Label.VerticalAlign.CENTER;
          this.refresh();
          console.info('[PfDemoItem] onInit');
        };
        _proto.init = function init(parm) {
          var _parm$count;
          this.setCount((_parm$count = parm == null ? void 0 : parm.count) != null ? _parm$count : 0);
          console.info('[PfDemoItem] init', this.count);
        };
        _proto.setCount = function setCount(n) {
          this.count = n;
          this.refresh();
          console.info('[PfDemoItem] setCount', this.count);
        };
        _proto.getCount = function getCount() {
          return this.count;
        };
        _proto.refresh = function refresh() {
          if (this.label) this.label.string = '数量 ' + this.count + '（点我）';
        };
        return PfDemoItem;
      }(GMComponent)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PfDemoTabPage.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './GMTabPage.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Color, Node, UITransform, Label, assetManager, GMTabPage;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Color = module.Color;
      Node = module.Node;
      UITransform = module.UITransform;
      Label = module.Label;
      assetManager = module.assetManager;
    }, null, function (module) {
      GMTabPage = module.GMTabPage;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "a3c8eFNK3BPVZ0YbksKkcfy", "PfDemoTabPage", undefined);
      var ccclass = _decorator.ccclass;
      var FONT = 'ee40121d-0b21-4bb3-b95c-fa7d2df322b4'; // assets/gmajor/fonts/main.ttf
      var INK = new Color(92, 64, 32, 255);

      /** 首页页签示例里的一页。记录页会等两秒，用来看到 loading */
      var PfDemoTabPage = exports('PfDemoTabPage', (_dec = ccclass('PfDemoTabPage'), _dec(_class = /*#__PURE__*/function (_GMTabPage) {
        _inheritsLoose(PfDemoTabPage, _GMTabPage);
        function PfDemoTabPage() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMTabPage.call.apply(_GMTabPage, [this].concat(args)) || this;
          _this.label = null;
          return _this;
        }
        var _proto = PfDemoTabPage.prototype;
        _proto.onInit = function onInit() {
          var node = new Node('label');
          node.layer = this.node.layer;
          this.node.addChild(node);
          node.addComponent(UITransform).setContentSize(560, 120);
          this.label = node.addComponent(Label);
          this.label.fontSize = 28;
          this.label.lineHeight = 36;
          this.label.color = INK;
          this.label.horizontalAlign = Label.HorizontalAlign.CENTER;
          this.label.verticalAlign = Label.VerticalAlign.CENTER;
          this.label.overflow = Label.Overflow.SHRINK;
          this.label.enableWrapText = true;
          this.label.string = this.line();
          var hit = assetManager.assets.get(FONT);
          if (hit) this.label.font = hit;
        };
        _proto.onShow = function onShow(done) {
          if (this.label) this.label.string = this.line();
          if (this.text !== '记录') return done();
          this.scheduleOnce(function () {
            return done();
          }, 2);
        };
        _proto.line = function line() {
          if (this.text === '记录') return '记录\n这一页会等两秒';
          return this.text + '\n点上面的页签切换';
        };
        return PfDemoTabPage;
      }(GMTabPage)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ScDemoHome.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './SkinKit.ts', './PfDemoTabPage.ts', './GMLauncher.ts', './PfGMTabs.ts', './GMScene.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Node, UITransform, Sprite, addPaper, PfDemoTabPage, gu, PfGMTabs, GMScene;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      UITransform = module.UITransform;
      Sprite = module.Sprite;
    }, null, function (module) {
      addPaper = module.addPaper;
    }, function (module) {
      PfDemoTabPage = module.PfDemoTabPage;
    }, function (module) {
      gu = module.gu;
    }, function (module) {
      PfGMTabs = module.PfGMTabs;
    }, function (module) {
      GMScene = module.GMScene;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "d53095sH3RBKsPigG2rSxLF", "ScDemoHome", undefined);
      var ccclass = _decorator.ccclass;

      /** 首页。节点在 ScDemoHome.scene 的 Canvas/home 里，这里只铺底和注册点击 */
      var ScDemoHome = exports('ScDemoHome', (_dec = ccclass('ScDemoHome'), _dec(_class = /*#__PURE__*/function (_GMScene) {
        _inheritsLoose(ScDemoHome, _GMScene);
        function ScDemoHome() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMScene.call.apply(_GMScene, [this].concat(args)) || this;
          _this.tabsRoot = null;
          return _this;
        }
        var _proto = ScDemoHome.prototype;
        _proto.onInit = function onInit() {
          var _this$node$scene,
            _this2 = this;
          var canvas = (_this$node$scene = this.node.scene) == null ? void 0 : _this$node$scene.getChildByName('Canvas');
          if (!canvas) return console.error('[ScDemoHome] 没有 Canvas');
          addPaper(canvas);
          var home = canvas.getChildByName('home');
          if (!home) return console.error('[ScDemoHome] 没有 home');
          this.click(home, 'btnStart', function () {
            return gu.alert({
              content: '今天先从这里开始。',
              cancel: {}
            });
          });
          this.click(home, 'btnAd', function () {
            return gu.alert({
              content: '看完可以领一份奖励。',
              ok: {
                text: '领取'
              }
            });
          });
          this.click(home, 'btnGold', function () {
            return gu.alert('用金币买下这一格。');
          });
          this.click(home, 'btnDiamond', function () {
            return gu.alert('用钻石买下这一格。');
          });
          this.click(home, 'btnSetting', function () {
            return _this2.openSetting();
          });
          this.click(home, 'tabSetting', function () {
            return _this2.openSetting();
          });
          this.click(home, 'tabHome', function () {
            return _this2.toggleTabs(home);
          });
        };
        _proto.click = function click(parent, name, fn) {
          var node = parent.getChildByName(name);
          if (!node) return console.error('[ScDemoHome] 没有', name);
          gu.addClick(node, fn);
        };
        _proto.openSetting = function openSetting() {
          gu.showLayer('LySetting', {
            bundle: 'DemoHome'
          });
        }

        /** 再点一次关掉。记录页会等两秒 */;
        _proto.toggleTabs = function toggleTabs(home) {
          var _this$tabsRoot;
          if ((_this$tabsRoot = this.tabsRoot) != null && _this$tabsRoot.isValid) {
            this.tabsRoot.destroy();
            this.tabsRoot = null;
            return;
          }
          var root = new Node('PfGMTabs');
          root.layer = home.layer;
          home.addChild(root);
          root.setSiblingIndex(home.children.length - 1);
          root.setPosition(0, -160, 0);
          var uit = root.addComponent(UITransform);
          uit.setAnchorPoint(0.5, 0.5);
          uit.setContentSize(640, 480);
          var panel = new Node('panel');
          panel.layer = root.layer;
          root.addChild(panel);
          panel.addComponent(UITransform);
          panel.addComponent(Sprite);
          var tabs = new Node('tabs');
          tabs.layer = root.layer;
          root.addChild(tabs);
          tabs.addComponent(UITransform);
          var view = root.addComponent(PfGMTabs);
          for (var _i = 0, _arr = ['概况', '背包', '记录']; _i < _arr.length; _i++) {
            var title = _arr[_i];
            var node = new Node(title);
            node.layer = root.layer;
            var page = node.addComponent(PfDemoTabPage);
            page.text = title;
            view.insert(node);
          }
          view.setOnChange(function (index) {
            return console.info('[ScDemoHome] 页签', index);
          });
          view.setIndex(0);
          this.tabsRoot = root;
        };
        return ScDemoHome;
      }(GMScene)) || _class));
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/DemoHome', 'chunks:///_virtual/DemoHome'); 
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