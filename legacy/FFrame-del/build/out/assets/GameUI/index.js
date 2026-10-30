System.register("chunks:///_virtual/GameUI", ['./GameUIEntry.ts', './LyAlert.ts', './SkinKit.ts'], function () {
  return {
    setters: [null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/GameUIEntry.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './config.ts', './SkinKit.ts', './GMLauncher.ts', './GMBundleEntryBase.ts'], function () {
  var _inheritsLoose, cclegacy, Prefab, config, loadSkin, registerBundleEntry, gm, GMBundleEntryBase;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
    }, null, function (module) {
      config = module.config;
    }, function (module) {
      loadSkin = module.loadSkin;
    }, function (module) {
      registerBundleEntry = module.registerBundleEntry;
      gm = module.gm;
    }, function (module) {
      GMBundleEntryBase = module.GMBundleEntryBase;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c33d4Tl9mpHd6iJmqu8zQAE", "GameUIEntry", undefined);

      /** 本游戏常驻壳：开机预载确认框皮 */
      var GameUIEntry = /*#__PURE__*/function (_GMBundleEntryBase) {
        _inheritsLoose(GameUIEntry, _GMBundleEntryBase);
        function GameUIEntry() {
          return _GMBundleEntryBase.call(this, 'GameUI') || this;
        }
        var _proto = GameUIEntry.prototype;
        _proto.onBind = function onBind(ctx) {
          var _config$alert = config.alert,
            bundle = _config$alert.bundle,
            prefab = _config$alert.prefab;
          return new Promise(function (resolve, reject) {
            ctx.resource.load(bundle, prefab, Prefab, function (err, asset) {
              if (err || !asset) return reject(err != null ? err : new Error('[GameUI] 预载 Alert 失败'));
              gm.ui.setAlertPrefab(asset);
              loadSkin(function (skinErr) {
                if (skinErr) console.error('[GameUI] 皮加载失败', skinErr);
                resolve();
              });
            });
          });
        };
        return GameUIEntry;
      }(GMBundleEntryBase);
      registerBundleEntry('GameUI', new GameUIEntry());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LyAlert.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './PfGMBtn.ts', './GMLauncher.ts', './GMAlert.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, PfGMBtn, gu, GMAlert;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, null, function (module) {
      PfGMBtn = module.PfGMBtn;
    }, function (module) {
      gu = module.gu;
    }, function (module) {
      GMAlert = module.GMAlert;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "d44e5X2B3tIiLmaq7zN3gAF", "LyAlert", undefined);
      var ccclass = _decorator.ccclass;

      /** 确认框。节点在预制体里，这里只改文案，并把关闭钮接到取消 */
      var LyAlert = exports('LyAlert', (_dec = ccclass('LyAlert'), _dec(_class = /*#__PURE__*/function (_GMAlert) {
        _inheritsLoose(LyAlert, _GMAlert);
        function LyAlert() {
          return _GMAlert.apply(this, arguments) || this;
        }
        var _proto = LyAlert.prototype;
        _proto.onInit = function onInit() {
          console.info('[LyAlert] onInit');
        };
        _proto.init = function init(parm) {
          var _this$panel, _this$panel2, _this$panel3;
          _GMAlert.prototype.init.call(this, parm);
          if (!parm) return;
          (_this$panel = this.panel) == null || (_this$panel = _this$panel.getChildByName('btnOk')) == null || (_this$panel = _this$panel.getComponent(PfGMBtn)) == null || _this$panel.setText(parm.okText);
          if (parm.showCancel) (_this$panel2 = this.panel) == null || (_this$panel2 = _this$panel2.getChildByName('btnCancel')) == null || (_this$panel2 = _this$panel2.getComponent(PfGMBtn)) == null || _this$panel2.setText(parm.cancelText);
          var closeBtn = (_this$panel3 = this.panel) == null ? void 0 : _this$panel3.getChildByName('btnClose');
          if (closeBtn) gu.addClick(closeBtn, function () {
            parm.onCancel == null || parm.onCancel();
            parm.close();
          });
        };
        _proto.onRemove = function onRemove() {
          console.info('[LyAlert] onRemove');
        };
        return LyAlert;
      }(GMAlert)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SkinKit.ts", ['cc', './index.ts', './GMSkin.ts'], function (exports) {
  var cclegacy, Node, UITransform, Sprite, Label, Color, Widget, Texture2D, SpriteFrame, loadSkin$1, skinFrame$1;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      UITransform = module.UITransform;
      Sprite = module.Sprite;
      Label = module.Label;
      Color = module.Color;
      Widget = module.Widget;
      Texture2D = module.Texture2D;
      SpriteFrame = module.SpriteFrame;
    }, null, function (module) {
      loadSkin$1 = module.loadSkin;
      skinFrame$1 = module.skinFrame;
    }],
    execute: function () {
      exports({
        addPaper: addPaper,
        addSkin: addSkin,
        addText: addText,
        dress: dress,
        loadSkin: loadSkin,
        skinFrame: skinFrame
      });
      cclegacy._RF.push({}, "0dfb1QxSlNGs6XuZjhyxQF3", "SkinKit", undefined);
      var SLICED = new Set(['title_bar', 'panel', 'btn_primary', 'btn_secondary', 'btn_warning', 'btn_neutral', 'btn_info', 'tab_normal', 'tab_selected', 'stepper_plate', 'slider_track', 'progress_fill', 'bar_bg', 'bar_fill']);

      /** 等开机载入的 Skin 包。已经在内存里则立刻回调 */
      function loadSkin(done) {
        loadSkin$1(done);
      }
      function skinFrame(name) {
        // 未载入时是 null；缺槽是白图
        return skinFrame$1(name);
      }

      /** 在 parent 下挂一张皮；九宫格件用 SLICED，其余原图 */
      function addSkin(parent, name, x, y, w, h) {
        var node = new Node(name);
        parent.addChild(node);
        node.layer = parent.layer;
        node.setPosition(x, y, 0);
        node.addComponent(UITransform).setContentSize(w, h);
        node.addComponent(Sprite);
        dress(node, name);
        return node;
      }
      function addText(parent, text, fontSize, color, w, h) {
        var node = new Node('label');
        parent.addChild(node);
        node.layer = parent.layer;
        node.addComponent(UITransform).setContentSize(w, h);
        var label = node.addComponent(Label);
        label.string = text;
        label.fontSize = fontSize;
        label.color = color;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        label.overflow = Label.Overflow.CLAMP;
        return label;
      }
      var skinInk = exports('skinInk', new Color(92, 64, 32, 255)); // 奶油底上的字
      var skinPaper = exports('skinPaper', new Color(248, 238, 211, 255)); // 和 v3 底色接近

      function dress(node, name) {
        // 贴图后锁回自定义尺寸，避免被原图像素撑开
        var frame = skinFrame(name);
        var sp = node.getComponent(Sprite);
        var uit = node.getComponent(UITransform);
        if (!frame || !sp || !uit) return;
        var w = uit.width;
        var h = uit.height;
        sp.spriteFrame = frame;
        sp.sizeMode = Sprite.SizeMode.CUSTOM;
        sp.type = SLICED.has(name) ? Sprite.Type.SLICED : Sprite.Type.SIMPLE;
        uit.setContentSize(w, h);
      }

      /** 铺一层奶油底，跟着父节点四边拉伸 */
      function addPaper(parent) {
        var node = new Node('paper');
        parent.addChild(node);
        node.layer = parent.layer;
        node.setSiblingIndex(0);
        node.addComponent(UITransform);
        var widget = node.addComponent(Widget);
        widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
        widget.top = widget.bottom = widget.left = widget.right = 0;
        widget.alignMode = Widget.AlignMode.ALWAYS;
        var sp = node.addComponent(Sprite);
        sp.spriteFrame = paperFrame();
        sp.sizeMode = Sprite.SizeMode.CUSTOM;
        sp.color = skinPaper;
        return node;
      }
      var paper = null;
      function paperFrame() {
        var _paper;
        if ((_paper = paper) != null && _paper.isValid) return paper;
        var tex = new Texture2D();
        tex.reset({
          width: 2,
          height: 2,
          format: Texture2D.PixelFormat.RGBA8888
        });
        tex.uploadData(new Uint8Array(16).fill(255));
        paper = new SpriteFrame();
        paper.texture = tex;
        return paper;
      }
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/GameUI', 'chunks:///_virtual/GameUI'); 
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