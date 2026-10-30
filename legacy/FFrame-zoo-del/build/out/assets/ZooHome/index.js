System.register("chunks:///_virtual/ScZooHome.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './PfGMBtn.ts', './GMLauncher.ts', './GMScene.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, _inheritsLoose, cclegacy, _decorator, JsonAsset, assetManager, Node, instantiate, SpriteFrame, CCObjectFlags, UITransform, Sprite, PfGMBtnSize, PfGMBtnTheme, PfGMBtn, gm, gu, GMScene;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      JsonAsset = module.JsonAsset;
      assetManager = module.assetManager;
      Node = module.Node;
      instantiate = module.instantiate;
      SpriteFrame = module.SpriteFrame;
      CCObjectFlags = module.CCObjectFlags;
      UITransform = module.UITransform;
      Sprite = module.Sprite;
    }, null, function (module) {
      PfGMBtnSize = module.PfGMBtnSize;
      PfGMBtnTheme = module.PfGMBtnTheme;
      PfGMBtn = module.PfGMBtn;
    }, function (module) {
      gm = module.gm;
      gu = module.gu;
    }, function (module) {
      GMScene = module.GMScene;
    }],
    execute: function () {
      exports('preloadZoo', preloadZoo);
      var _dec, _dec2, _class;
      cclegacy._RF.push({}, "da0a3yINRhLe6tQ+7mV1uWv", "ScZooHome", undefined);
      var ccclass = _decorator.ccclass,
        executeInEditMode = _decorator.executeInEditMode;
      var DB = 'db://assets/game/bundles/ZooHome';
      var BTN_PREFAB = 'b8d4f2c1-5a3b-4e9f-8d22-7c6b9f3e5a81'; // gmajor/ui/PfGMBtn.prefab
      var RETRY = 30; // 编辑器首次导入图之前多等几轮

      // 进入棋盘在底边居中。其余靠右，从上往下：签到、园景素材、小镇、广告任务、设置
      var HOME_BTNS = [{
        name: 'pfBtnBoard',
        text: '进入棋盘',
        x: 0,
        y: -564
      }, {
        name: 'pfBtnSign',
        text: '签到',
        x: 214,
        y: 580,
        size: PfGMBtnSize.medium,
        theme: PfGMBtnTheme.secondary
      }, {
        name: 'pfBtnScenery',
        text: '园景素材',
        x: 214,
        y: 476,
        size: PfGMBtnSize.medium
      }, {
        name: 'pfBtnTown',
        text: '小镇',
        x: 214,
        y: 372,
        size: PfGMBtnSize.medium,
        theme: PfGMBtnTheme.secondary
      }, {
        name: 'pfBtnAd',
        text: '广告任务',
        x: 214,
        y: 268,
        size: PfGMBtnSize.medium,
        theme: PfGMBtnTheme.warning
      }, {
        name: 'pfBtnSetting',
        text: '设置',
        x: 214,
        y: 164,
        size: PfGMBtnSize.medium,
        theme: PfGMBtnTheme.secondary
      }];
      var cached = null;
      var pending = null;

      /** 把 place 有值的贴纸载进内存。入口在开场景前调用 */
      function preloadZoo(done) {
        if (cached) return done(null);
        if (pending) {
          pending.push(done);
          return;
        }
        pending = [done];
        gm.resource.loadBundle('ZooHome', function (err) {
          if (err) return donePreload(err);
          var bundle = gm.resource.getBundle('ZooHome');
          if (!bundle) return donePreload(new Error('[ScZooHome] ZooHome 未加载'));
          loadArt(bundle, function (loadErr, art) {
            if (loadErr || !art) return donePreload(loadErr != null ? loadErr : new Error('[ScZooHome] 园景失败'));
            cached = art;
            donePreload(null);
          });
        });
      }
      function donePreload(err) {
        var _pending;
        var list = (_pending = pending) != null ? _pending : [];
        pending = null;
        for (var _iterator = _createForOfIteratorHelperLoose(list), _step; !(_step = _iterator()).done;) {
          var fn = _step.value;
          fn(err);
        }
      }
      function frameKey(file) {
        return file.replace(/\.png$/i, '');
      }
      function placed(scenery) {
        return scenery.pieces.filter(function (piece) {
          return piece.place && piece.cocos && piece.png && piece.png.length === 2;
        });
      }
      function loadArt(bundle, done) {
        bundle.load('scenery', JsonAsset, function (err, asset) {
          if (err || !(asset != null && asset.json)) return done(err != null ? err : new Error('[ScZooHome] scenery 失败'));
          var scenery = asset.json;
          var list = placed(scenery);
          var frames = new Map();
          if (!list.length) return done(null, {
            scenery: scenery,
            frames: frames
          });
          var left = list.length;
          var _loop = function _loop() {
            var piece = _step2.value;
            takeFrame(bundle, frameKey(piece.file), function (frame) {
              if (frame) frames.set(frameKey(piece.file), frame);
              if (--left > 0) return;
              done(null, {
                scenery: scenery,
                frames: frames
              });
            });
          };
          for (var _iterator2 = _createForOfIteratorHelperLoose(list), _step2; !(_step2 = _iterator2()).done;) {
            _loop();
          }
        });
      }
      function takeFrame(bundle, key, done) {
        bundle.load(key + '/spriteFrame', SpriteFrame, function (err, frame) {
          if (!err && frame) return done(frame);
          bundle.load(key, SpriteFrame, function (err2, frame2) {
            return done(!err2 && frame2 ? frame2 : null);
          });
        });
      }
      function place(canvas, scenery, frames, reportMissing) {
        var old = canvas.getChildByName('yard');
        if (old) {
          old.removeFromParent();
          old.destroy();
        }
        var w = scenery.cocos.w;
        var h = scenery.cocos.h;
        var yard = new Node('yard');
        yard.layer = canvas.layer;
        canvas.addChild(yard);
        yard.setSiblingIndex(0);
        var rootUt = yard.addComponent(UITransform);
        rootUt.setAnchorPoint(0, 0); // 原点在画面左下，cocos 坐标直接当本地坐标
        rootUt.setContentSize(w, h);
        yard.setPosition(-w / 2, -h / 2, 0);
        var groups = new Map();
        for (var _iterator3 = _createForOfIteratorHelperLoose(scenery.layers), _step3; !(_step3 = _iterator3()).done;) {
          var name = _step3.value;
          groups.set(name, makeLayer(yard, name));
        }
        var count = 0;
        var list = placed(scenery).sort(function (a, b) {
          return a.order - b.order;
        });
        for (var _iterator4 = _createForOfIteratorHelperLoose(list), _step4; !(_step4 = _iterator4()).done;) {
          var piece = _step4.value;
          var parent = groups.get(piece.layer);
          var _frame = frames.get(frameKey(piece.file));
          if (!parent) {
            console.error('[ScZooHome] 没有层', piece.layer);
            continue;
          }
          if (!_frame) {
            if (reportMissing) console.error('[ScZooHome] 没有', piece.file);
            continue;
          }
          addPiece(parent, piece, _frame);
          count += 1;
        }
        dontSave(yard);
        console.info('[ScZooHome] 摆上', count);
      }
      function makeLayer(yard, name) {
        var node = new Node(name);
        node.layer = yard.layer;
        yard.addChild(node);
        var uit = node.addComponent(UITransform);
        uit.setAnchorPoint(0, 0);
        return node;
      }
      function addPiece(parent, piece, frame) {
        var png = piece.png;
        var cocos = piece.cocos;
        if (!png || !cocos) return;
        var node = new Node(piece.id.replace(/\//g, '_'));
        node.layer = parent.layer;
        parent.addChild(node);
        var uit = node.addComponent(UITransform);
        var sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.trim = false; // 锚点按整张 png，含透明边
        sprite.spriteFrame = frame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        uit.setContentSize(png[0], png[1]);
        uit.setAnchorPoint(piece.anchor[0], piece.anchor[1]);
        node.setPosition(cocos.x, cocos.y, 0);
        node.setScale(cocos.scale, cocos.scale, 1);
      }

      /** 清单才是坐标来源，生成的节点不写进场景 */
      function dontSave(node) {
        node._objFlags |= CCObjectFlags.DontSave;
        for (var _iterator5 = _createForOfIteratorHelperLoose(node.children), _step5; !(_step5 = _iterator5()).done;) {
          var child = _step5.value;
          dontSave(child);
        }
      }
      function followLayer(node, layer) {
        node.layer = layer;
        for (var _iterator6 = _createForOfIteratorHelperLoose(node.children), _step6; !(_step6 = _iterator6()).done;) {
          var child = _step6.value;
          followLayer(child, layer);
        }
      }
      function queryUuid(url, done) {
        var _editor$Message;
        var editor = globalThis.Editor;
        var request = editor == null || (_editor$Message = editor.Message) == null ? void 0 : _editor$Message.request;
        if (!request) return done(null);
        request.call(editor.Message, 'asset-db', 'query-uuid', url).then(function (uuid) {
          return done(uuid || null);
        }, function () {
          return done(null);
        });
      }

      /** 园子。开场背景和 place 有值的贴纸按 scenery.json 的 cocos、anchor 摆。place 为空的不摆。六个入口先能点，回调留空 */
      var ScZooHome = exports('ScZooHome', (_dec = ccclass('ScZooHome'), _dec2 = executeInEditMode(true), _dec(_class = _dec2(_class = /*#__PURE__*/function (_GMScene) {
        _inheritsLoose(ScZooHome, _GMScene);
        function ScZooHome() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _GMScene.call.apply(_GMScene, [this].concat(args)) || this;
          _this.token = 0;
          _this.seen = 0;
          // 编辑器里已经摆上的张数，变多才重摆
          _this.pfBtnBoard = null;
          // 进入棋盘
          _this.pfBtnSign = null;
          // 签到
          _this.pfBtnScenery = null;
          // 园景素材
          _this.pfBtnTown = null;
          // 小镇
          _this.pfBtnAd = null;
          // 广告任务
          _this.pfBtnSetting = null;
          return _this;
        }
        var _proto = ScZooHome.prototype;
        // 设置
        _proto.onInit = function onInit() {
          var _this$node$scene,
            _this2 = this;
          var canvas = (_this$node$scene = this.node.scene) == null ? void 0 : _this$node$scene.getChildByName('Canvas');
          if (!canvas) return console.error('[ScZooHome] 没有 Canvas');
          var token = ++this.token;
          this.seen = 0;
          this.placeButtons(canvas, token);
          if (cached) place(canvas, cached.scenery, cached.frames, true);else preloadZoo(function (err) {
            if (token !== _this2.token || !_this2.isValid) return;
            if (err || !cached) return console.error('[ScZooHome] 园景失败', err);
            place(canvas, cached.scenery, cached.frames, true);
          });
        }

        /** 六个入口叠在园景上。编辑器里也能看见；只有播放才注册点击 */;
        _proto.placeButtons = function placeButtons(canvas, token) {
          var _this3 = this;
          assetManager.loadAny({
            uuid: BTN_PREFAB
          }, function (err, prefab) {
            if (token !== _this3.token || !_this3.isValid) return;
            if (err || !prefab) return console.error('[ScZooHome] 没有 PfGMBtn', err);
            _this3.mountButtons(canvas, prefab);
          });
        };
        _proto.mountButtons = function mountButtons(canvas, prefab) {
          var old = canvas.getChildByName('home');
          if (old) {
            old.removeFromParent();
            old.destroy();
          }
          var home = new Node('home');
          home.layer = canvas.layer;
          canvas.addChild(home);
          for (var _i = 0, _HOME_BTNS = HOME_BTNS; _i < _HOME_BTNS.length; _i++) {
            var spec = _HOME_BTNS[_i];
            var node = instantiate(prefab);
            node.name = spec.name;
            var btn = node.getComponent(PfGMBtn);
            if (!btn) {
              node.destroy();
              console.error('[ScZooHome] PfGMBtn 缺少脚本', spec.name);
              continue;
            }
            if (spec.size !== undefined) btn.setSize(spec.size);
            if (spec.theme !== undefined) btn.setTheme(spec.theme);
            btn.setText(spec.text);
            node.setPosition(spec.x, spec.y, 0);
            home.addChild(node);
            followLayer(node, home.layer);
            this[spec.name] = node;
            gu.addClick(node, function () {}); // 不进棋盘、不弹窗、不写数值
          }

          dontSave(home);
          console.info('[ScZooHome] 按钮', home.children.length);
        }

        /** 编辑器里按 db 路径取图，不进播放也能看见 */;
        _proto.loadEditor = function loadEditor(canvas, token, attempt) {
          var _this4 = this;
          if (token !== this.token || !this.isValid) return;
          queryUuid(DB + "/scenery.json", function (uuid) {
            if (token !== _this4.token || !_this4.isValid) return;
            if (!uuid) return _this4.again(canvas, token, attempt);
            assetManager.loadAny({
              uuid: uuid
            }, function (err, asset) {
              if (token !== _this4.token || !_this4.isValid) return;
              var scenery = asset == null ? void 0 : asset.json;
              if (err || !(scenery != null && scenery.pieces)) return _this4.again(canvas, token, attempt);
              _this4.loadEditorFrames(canvas, scenery, token, attempt);
            });
          });
        };
        _proto.again = function again(canvas, token, attempt) {
          var _this5 = this;
          if (attempt + 1 >= RETRY) return console.error('[ScZooHome] 编辑器还没有导入 ZooHome');
          setTimeout(function () {
            return _this5.loadEditor(canvas, token, attempt + 1);
          }, 500);
        };
        _proto.loadEditorFrames = function loadEditorFrames(canvas, scenery, token, attempt) {
          var _this6 = this;
          var list = placed(scenery);
          var frames = new Map();
          var left = list.length;
          var finish = function finish() {
            if (token !== _this6.token || !_this6.isValid) return;
            var got = frames.size;
            var missing = got < list.length;
            var grew = got > _this6.seen;
            var last = attempt + 1 >= RETRY;
            var keepWaiting = missing && !last && (grew || !got);
            if (grew) _this6.seen = got;
            if (grew || !keepWaiting && got) place(canvas, scenery, frames, !keepWaiting);
            if (keepWaiting) setTimeout(function () {
              return _this6.loadEditorFrames(canvas, scenery, token, attempt + 1);
            }, 500);else if (missing && !got) console.error('[ScZooHome] 编辑器还没有贴纸');
          };
          if (!left) return finish();
          var _loop2 = function _loop2() {
            var piece = _step7.value;
            queryUuid(DB + "/" + piece.file + "/spriteFrame", function (uuid) {
              if (!uuid) {
                if (--left === 0) finish();
                return;
              }
              assetManager.loadAny({
                uuid: uuid
              }, function (err, frame) {
                if (!err && frame) frames.set(frameKey(piece.file), frame);
                if (--left === 0) finish();
              });
            });
          };
          for (var _iterator7 = _createForOfIteratorHelperLoose(list), _step7; !(_step7 = _iterator7()).done;) {
            _loop2();
          }
        };
        return ScZooHome;
      }(GMScene)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ZooHome", ['./ScZooHome.ts', './ZooHomeEntry.ts'], function () {
  return {
    setters: [null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/ZooHomeEntry.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './index.ts', './ScZooHome.ts', './GMLauncher.ts', './GMBundleEntryBase.ts'], function () {
  var _inheritsLoose, cclegacy, preloadZoo, registerBundleEntry, gu, GMBundleEntryBase;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, null, function (module) {
      preloadZoo = module.preloadZoo;
    }, function (module) {
      registerBundleEntry = module.registerBundleEntry;
      gu = module.gu;
    }, function (module) {
      GMBundleEntryBase = module.GMBundleEntryBase;
    }],
    execute: function () {
      cclegacy._RF.push({}, "3f91fXy2H1MebkAzuQhzUJ4", "ZooHomeEntry", undefined);

      /** web 入口：园景进内存后打开园子 */
      var ZooHomeEntry = /*#__PURE__*/function (_GMBundleEntryBase) {
        _inheritsLoose(ZooHomeEntry, _GMBundleEntryBase);
        function ZooHomeEntry() {
          return _GMBundleEntryBase.call(this, 'ZooHome') || this;
        }
        var _proto = ZooHomeEntry.prototype;
        _proto.onBind = function onBind(ctx) {
          gu.loadingShow('ZooHome.scenery');
          return new Promise(function (resolve, reject) {
            preloadZoo(function (err) {
              gu.loadingHide('ZooHome.scenery');
              if (err) return reject(err);
              ctx.openScene('ScZooHome', function (openErr) {
                if (openErr) return console.error('[ZooHome] openScene 失败', openErr);
              });
              resolve();
            });
          });
        };
        return ZooHomeEntry;
      }(GMBundleEntryBase);
      registerBundleEntry('ZooHome', new ZooHomeEntry());
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/ZooHome', 'chunks:///_virtual/ZooHome'); 
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