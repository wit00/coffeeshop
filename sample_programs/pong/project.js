(function() {
  var Bitmap, Circle, CollisionManager, ColorTween, Curve, GameLoop, Gradient, KeyManager, Line, Matrix, Pattern, Polygon, Rectangle, RoundedRectangle, Scene, Shape, Sprite, Square, Star, Text, Triangle, Tween, animations, ball, collisions, f, gameLoop, include, keys, namespace, paddle1, paddle2, scene,
    __slice = Array.prototype.slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  include = function(toInclude, target) {
    var key, value, _results;
    if (!(toInclude && target)) throw 'requires a mixin and a target';
    _results = [];
    for (key in toInclude) {
      value = toInclude[key];
      _results.push(target.prototype[key] = value);
    }
    return _results;
  };

  namespace = function(target, name, block) {
    var item, top, _i, _len, _ref, _ref2;
    if (arguments.length < 3) {
      _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
    }
    top = target;
    _ref2 = name.split('.');
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      item = _ref2[_i];
      target = target[item] || (target[item] = {});
    }
    return block(target, top);
  };

  ColorTween = (function() {

    function ColorTween(args) {
      var _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
      if (args == null) args = {};
      this.attribute = (_ref = args.attribute) != null ? _ref : "x";
      this.easeClass = (_ref2 = args.ease) != null ? _ref2 : None.easeNone;
      this.from = (_ref3 = args.from) != null ? _ref3 : 0;
      this.to = (_ref4 = args.to) != null ? _ref4 : 100;
      this.duration = (_ref5 = args.duration) != null ? _ref5 : 2000;
      this.yoyo = (_ref6 = args.yoyo) != null ? _ref6 : false;
      this.elapsed = 0;
    }

    return ColorTween;

  })();

  Matrix = (function() {

    function Matrix(a, b, c, d, e, f) {
      this.a = a != null ? a : 1;
      this.b = b != null ? b : 0;
      this.c = c != null ? c : 0;
      this.d = d != null ? d : 1;
      this.e = e != null ? e : 0;
      this.f = f != null ? f : 0;
      this.xScale = 1;
      this.yScale = 1;
      this.xSkew = 0;
      this.ySkew = 0;
      this.xTranslation = 0;
      this.yTranslation = 0;
      this.rotation = 0;
    }

    Matrix.prototype.makeTransformationMatrix = function() {
      this.a = Math.cos(this.rotation) * this.xScale - Math.sin(this.rotation) * this.xSkew;
      this.b = Math.sin(this.rotation) * this.xScale + Math.cos(this.rotation) * this.xSkew;
      this.c = Math.cos(this.rotation) * this.ySkew - Math.sin(this.rotation) * this.yScale;
      this.d = Math.sin(this.rotation) * this.ySkew + Math.cos(this.rotation) * this.yScale;
      this.e = this.xTranslation;
      return this.f = this.yTranslation;
    };

    return Matrix;

  })();

  Sprite = (function() {

    function Sprite(args) {
      var _ref, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (args == null) args = {};
      this.addChild = __bind(this.addChild, this);
      this.runDrawing2 = __bind(this.runDrawing2, this);
      this.runDrawing = __bind(this.runDrawing, this);
      this.draw = __bind(this.draw, this);
      this.x = (_ref = args.x) != null ? _ref : 0;
      this.y = (_ref2 = args.y) != null ? _ref2 : 0;
      this.angularVelocity = (_ref3 = args.angularVelocity) != null ? _ref3 : 0;
      this.velocity = (_ref4 = args.velocity) != null ? _ref4 : 0.5;
      this.otherVelocity = (_ref5 = args.otherVelocity) != null ? _ref5 : 0.3;
      this.alpha = (_ref6 = args.alpha) != null ? _ref6 : 1.0;
      this.rotation = (_ref7 = args.rotation) != null ? _ref7 : 0;
      this.verticalScale = 1;
      this.horizontalScale = 1;
      this.horizontalSkew = 0;
      this.verticalSkew = 0;
      this.width = (_ref8 = args.width) != null ? _ref8 : 0;
      this.subSprites = [];
      this.lineCap = (_ref9 = args.lineCap) != null ? _ref9 : "butt";
      this.lineWidth = (_ref10 = args.lineWidth) != null ? _ref10 : 1;
      this.lineJoin = (_ref11 = args.lineJoin) != null ? _ref11 : "miter";
      this.miterLimit = (_ref12 = args.miterLimit) != null ? _ref12 : 10;
      this.events = [];
      this.receivedEvents = {};
      this.matrix = new Matrix;
      this.toDeleteEvents = [];
      this.boxwidth = 0;
      this.animations = [];
      this.collisionEvents = [];
      this.lastTime = new Date();
      this.thisTime = new Date();
      this.time = 1;
      this.xVelocity = (_ref13 = args.xVelocity) != null ? _ref13 : 0;
      this.yVelocity = (_ref14 = args.yVelocity) != null ? _ref14 : 0;
      this.adjustedX = this.x;
      this.adjustedY = this.y;
      this.delta = {
        x: this.adjustedX,
        y: this.adjustedY,
        hScale: this.hScale,
        vScale: this.vScale,
        hSkew: this.hSkew,
        vSkew: this.vSkew,
        rotation: 0
      };
      this.collideTime = 0;
    }

    Sprite.prototype.setTime = function() {
      this.thisTime = new Date();
      this.time = this.thisTime.getTime() - this.lastTime.getTime();
      return this.lastTime = this.thisTime;
    };

    Sprite.prototype.colorTween = function(tween) {
      var newColor, red;
      if (this.fill.length === 15) red = this.fill.substr(5, 1);
      if (this.fill.length === 16) red = this.fill.substr(5, 2);
      if (this.fill.length === 17) red = this.fill.substr(5, 3);
      newColor = parseInt(red) + 1;
      return this.changeProperty({
        fill: 'rgba(' + newColor.toString() + ',0,255,1)'
      });
    };

    Sprite.prototype.tween = function(tween) {
      var attribute, change;
      change = tween.ease(this.time);
      if (change === "delete") {
        return this.toDeleteEvents.push(tween);
      } else {
        switch (tween.attribute) {
          case "x":
            return this.x = change;
          case "y":
            return this.y = change;
          case "rotation":
            return this.rotation = change;
          case "alpha":
            return this.alpha = change;
          default:
            return attribute = this.x;
        }
      }
    };

    Sprite.prototype.translate = function(vx, vy) {
      var adjVector, vector;
      vector = Vector.add(this.x, this.y, vx, vy);
      this.x = vector.x;
      this.y = vector.y;
      adjVector = Vector.add(this.adjustedX, this.adjustedY, vx, vy);
      this.adjustedX = adjVector.x;
      return this.adjustedY = adjVector.y;
    };

    Sprite.prototype.move = function(vx, vy) {
      this.x = this.x + vx * this.time;
      this.y = this.y + vy * this.time;
      this.adjustedX = this.adjustedX + vx * this.time;
      return this.adjustedY = this.adjustedY + vy * this.time;
    };

    Sprite.prototype.moveTo = function(x, y) {
      var deltaX, deltaY;
      deltaX = this.x - x;
      deltaY = this.y - y;
      this.x = x;
      this.adjustedX = x;
      this.y = y;
      return this.adjustedY = y;
    };

    Sprite.prototype.oldScale = function(x, y) {
      this.matrix.xScale = this.matrix.xScale + x * (2 / 4);
      return this.matrix.yScale = this.matrix.yScale + y * (3 / 4);
    };

    Sprite.prototype.scale = function(x, y) {
      var max, sprite, _i, _len, _ref, _results;
      if (this.radius) {
        if (x !== y) {
          max = Math.max(x, y);
          this.radius = this.radius * max;
          this.width = this.width * max;
          this.height = this.height * max;
          this.matrix.xScale = this.matrix.xScale * (x / max);
          this.matrix.yScale = this.matrix.yScale * (y / max);
        } else {
          this.radius = this.radius * x;
          this.width = this.width * x;
          this.height = this.height * x;
        }
      } else {
        this.width = this.width * x;
        this.height = this.height * y;
      }
      this.centerPoint = {
        x: -this.width / 2 - this.lineWidth / 2,
        y: -this.height / 2 - this.lineWidth / 2
      };
      this.buildDrawingCanvas();
      this.createStamp(this.stampContext);
      _ref = this.subSprites;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        sprite.x = sprite.x * x;
        sprite.y = sprite.y * y;
        sprite.adjustedX = sprite.adjustedX * x;
        sprite.adjustedY = sprite.adjustedY * y;
        _results.push(sprite.scale(x, y));
      }
      return _results;
    };

    Sprite.prototype.rotate = function(rotation) {
      var sprite, _i, _len, _ref, _results;
      this.rotation = this.rotation + rotation;
      _ref = this.subSprites;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        _results.push(sprite.rotate(rotation));
      }
      return _results;
    };

    Sprite.prototype.skew = function(x, y) {
      var sprite, _i, _len, _ref, _results;
      this.matrix.xSkew = this.matrix.xSkew + x;
      this.matrix.ySkew = this.matrix.ySkew + y;
      _ref = this.subSprites;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        _results.push(sprite.skew(x, y));
      }
      return _results;
    };

    Sprite.prototype.draw = function(context) {};

    Sprite.prototype.runDrawing = function(context) {
      this.setupCanvas(context);
      this.draw(context);
      this.drawSubSprites(context);
      return this.restoreCanvas(context);
    };

    Sprite.prototype.runDrawing2 = function(context) {
      this.setupCanvas2(context);
      this.draw(context);
      this.drawSubSprites(context);
      return this.restoreCanvas(context);
    };

    Sprite.prototype.update = function() {
      var sprite, _i, _len, _ref, _results;
      this.delta.x = this.adjustedX;
      this.delta.y = this.adjustedY;
      this.delta.rotation = this.rotation;
      this.setTime();
      this.x = this.x + this.xVelocity * this.time;
      this.y = this.y + this.yVelocity * this.time;
      this.adjustedX = this.adjustedX + this.xVelocity * this.time;
      this.adjustedY = this.adjustedY + this.yVelocity * this.time;
      this.rotation = this.rotation + this.angularVelocity * this.time;
      if (this.rotation > 6.28) this.rotation = 0.1;
      this.runEvents();
      _ref = this.subSprites;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        if (sprite) {
          _results.push(sprite.update());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Sprite.prototype.addChild = function(sprite) {
      return this.subSprites.push(sprite);
    };

    Sprite.prototype.deleteAnimation = function(event) {
      var index;
      index = this.animations.indexOf(event);
      return this.animations.splice(event, 1);
    };

    Sprite.prototype.deleteEvent = function(event) {
      var index;
      index = this.events.indexOf(event);
      return this.events.splice(event, 1);
    };

    Sprite.prototype.run = function(event) {
      if (typeof event === "function") {
        return event();
      } else {
        if (event instanceof Tween) this.tween(event);
        if (event instanceof ColorTween) return this.colorTween(event);
      }
    };

    Sprite.prototype.runEvents = function() {
      var animation, event, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
      _ref = this.animations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        animation = _ref[_i];
        this.run(animation);
      }
      _ref2 = this.events;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        event = _ref2[_j];
        if (this.receivedEvents[event.code] === true) this.run(event.toDo);
        if (__indexOf.call(this.collisionEvents, event) >= 0) this.run(event.toDo);
      }
      this.collisionEvents.length = 0;
      if (this.toDeleteEvents.length > 0) {
        _ref3 = this.toDeleteEvents;
        for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
          event = _ref3[_k];
          this.deleteAnimation(event);
        }
        return this.toDeleteEvents.length = 0;
      }
    };

    Sprite.prototype.receiveCollisionEvent = function(objectHit) {
      var myEvent, _i, _len, _ref, _results;
      _ref = this.events;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        myEvent = _ref[_i];
        if (myEvent.objectType === "boundary") {
          if (objectHit === "boundary") {
            _results.push(this.collisionEvents.push(myEvent));
          } else {
            _results.push(void 0);
          }
        } else if (myEvent.type === collisions) {
          if (myEvent.objectType === "all") {
            _results.push(this.collisionEvents.push(myEvent));
          } else if (objectHit instanceof myEvent.objectType) {
            _results.push(this.collisionEvents.push(myEvent));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Sprite.prototype.receiveEvent = function(e) {
      var myEvent, _i, _len, _ref, _results;
      _ref = this.events;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        myEvent = _ref[_i];
        if (myEvent.code === e.keyCode) {
          if (myEvent.action === e.type) {
            _results.push(this.receivedEvents[e.keyCode] = true);
          } else {
            _results.push(delete this.receivedEvents[e.keyCode]);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Sprite.prototype.addAnimation = function(toDo) {
      return this.animations.push(toDo);
    };

    Sprite.prototype.addEvent = function(args) {
      var newEvent, objectType, toDo, type, _ref;
      if (args == null) args = {};
      type = args.type;
      toDo = args.toDo;
      type.observe(this);
      if (type instanceof CollisionManager) {
        objectType = (_ref = args.objectType) != null ? _ref : 'all';
        type.addTypeToTest(this, objectType);
        newEvent = {
          type: type,
          objectType: objectType,
          toDo: toDo
        };
        this.events.push(newEvent);
      }
      if (type instanceof KeyManager) {
        newEvent = {
          type: args.type,
          action: args.action,
          code: args.code,
          toDo: args.toDo
        };
        return this.events.push(newEvent);
      }
    };

    Sprite.prototype.setupCanvas2 = function(context) {
      context.save();
      this.matrix.makeTransformationMatrix();
      context.translate(this.adjustedX, this.adjustedY);
      context.rotate(this.rotation);
      return context.globalAlpha = context.globalAlpha * this.alpha;
    };

    Sprite.prototype.setupCanvas = function(context) {
      context.save();
      this.matrix.makeTransformationMatrix();
      context.translate(this.x, this.y);
      context.rotate(this.rotation);
      context.transform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e, this.matrix.f);
      return context.globalAlpha = context.globalAlpha * this.alpha;
    };

    Sprite.prototype.drawSubSprites = function(context) {
      var sprite, _i, _len, _ref, _results;
      _ref = this.subSprites;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        _results.push(sprite.runDrawing(context));
      }
      return _results;
    };

    Sprite.prototype.restoreCanvas = function(context) {
      context.restore();
      return context.globalAlpha = 1.0;
    };

    Sprite.prototype.buildDrawingCanvas = function() {
      this.canvas2 = document.createElement('canvas');
      this.canvas2.width = this.width + this.lineWidth;
      this.canvas2.height = this.height + this.lineWidth;
      this.stampContext = this.canvas2.getContext('2d');
      return this.createStamp(this.stampContext);
    };

    Sprite.prototype.changeProperty = function(args) {
      var key, value;
      if (args == null) args = {};
      for (key in args) {
        if (!__hasProp.call(args, key)) continue;
        value = args[key];
        this[key] = value;
      }
      return this.createStamp(this.stampContext);
    };

    return Sprite;

  })();

  Tween = (function() {

    function Tween(args) {
      var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (args == null) args = {};
      this.attribute = (_ref = args.attribute) != null ? _ref : "x";
      this.easeClass = (_ref2 = args.ease) != null ? _ref2 : None.easeNone;
      this.from = (_ref3 = args.from) != null ? _ref3 : 0;
      this.to = (_ref4 = args.to) != null ? _ref4 : 100;
      this.duration = (_ref5 = args.duration) != null ? _ref5 : 2000;
      this.yoyo = (_ref6 = args.yoyo) != null ? _ref6 : false;
      this.elapsed = 0;
      this.stop = (_ref7 = args.stop) != null ? _ref7 : this.duration;
    }

    Tween.prototype.ease = function(time) {
      this.elapsed = this.elapsed + time;
      if (this.elapsed <= this.stop) {
        return this.easeClass(this.elapsed, this.to - this.from, this.duration, this.from);
      } else {
        if (this.yoyo === true) {
          return this.reverse();
        } else {
          return "delete";
        }
      }
    };

    Tween.prototype.reverse = function() {
      var from, to;
      this.elapsed = 0;
      to = this.to;
      from = this.from;
      this.to = from;
      return this.from = to;
    };

    return Tween;

  })();

  namespace('Vector', function(exports) {
    exports.add = function(vec1x, vec1y, vec2x, vec2y) {
      var vec;
      vec = {
        x: vec1x + vec2x,
        y: vec1y + vec2y
      };
      return vec;
    };
    exports.subtract = function(vec1x, vec1y, vec2x, vec2y) {
      var vec;
      vec = {
        x: vec1x - vec2x,
        y: vec1y - vec2y
      };
      return vec;
    };
    exports.dotProduct = function(vec1x, vec1y, vec2x, vec2y) {
      return (vec1x * vec2x) + (vec1y * vec2y);
    };
    exports.length = function(vecX, vecY) {
      return Math.sqrt((vecX * vecX) + (vecY * vecY));
    };
    exports.normalize = function(vecX, vecY) {
      var length, vec;
      length = Vector.length(vecX, vecY);
      vec = {
        x: vecX / length,
        y: vecY / length
      };
      return vec;
    };
    return exports.scale = function(scalar, vecX, vecY) {
      var vec;
      vec = {
        x: scalar * vecX,
        y: scalar * vecY
      };
      return vec;
    };
  });

  namespace('Back', function(exports) {
    exports.easeIn = function(elapsed, change, duration, from) {
      return change * (elapsed /= duration) * elapsed * ((1.70158 + 1) * elapsed - 1.70158) + from;
    };
    exports.easeOut = function(elapsed, change, duration, from) {
      return change * ((elapsed = elapsed / duration - 1) * elapsed * ((1.70158 + 1) * elapsed + 1.70158) + 1) + from;
    };
    return exports.easeInOut = function(elapsed, change, duration, from) {
      var s;
      s = 1.70158;
      if ((elapsed /= duration / 2) < 1) {
        return (change / 2) * (elapsed * elapsed * (((s *= 1.525) + 1) * elapsed - s)) + from;
      } else {
        return (change / 2) * ((elapsed -= 2) * elapsed * (((s *= 1.525) + 1) * elapsed + s) + 2) + from;
      }
    };
  });

  namespace('Bounce', function(exports) {
    exports.easeIn = function(elapsed, change, duration, from) {
      return change - Bounce.easeOut(duration - elapsed, change, duration, 0) + from;
    };
    exports.easeOut = function(elapsed, change, duration, from) {
      if ((elapsed /= duration) < (1 / 2.75)) {
        return change * (7.5625 * elapsed * elapsed) + from;
      }
      if (elapsed < (2 / 2.75)) {
        return change * (7.5625 * (elapsed -= 1.5 / 2.75) * elapsed + 0.75) + from;
      }
      if (elapsed < (2.5 / 2.75)) {
        return change * (7.5625 * (elapsed -= 2.25 / 2.75) * elapsed + 0.9375) + from;
      } else {
        return change * (7.5625 * (elapsed -= 2.625 / 2.75) * elapsed + 0.984375) + from;
      }
    };
    return exports.easeInOut = function(elapsed, change, duration, from) {
      if (elapsed < duration / 2) {
        return Bounce.easeIn(elapsed * 2, change, duration, 0) * 0.5 + from;
      } else {
        return Bounce.easeOut(elapsed * 2 - duration, change, duration, 0) * 0.5 + change * 0.5 + from;
      }
    };
  });

  namespace('Elastic', function(exports) {
    exports.easeIn = function(elapsed, change, duration, from) {
      var period, s;
      if (elapsed === 0) return from;
      if ((elapsed /= duration) === 1) {
        return from + change;
      } else {
        period = duration * 0.3;
        s = period / 4;
        return -(change * Math.pow(2, 10 * (elapsed -= 1)) * Math.sin((elapsed * duration - s) * 6.28 / period)) + from;
      }
    };
    exports.easeOut = function(elapsed, change, duration, from) {
      var period, s;
      if (elapsed === 0) return from;
      if ((elapsed /= duration) === 1) {
        return from + change;
      } else {
        period = duration * 0.3;
        s = period / 4;
        return change * Math.pow(2, -10 * elapsed) * Math.sin((elapsed * duration - s) * 6.28 / period) + change + from;
      }
    };
    return exports.easeInOut = function(elapsed, change, duration, from) {
      var period, s;
      if (elapsed === 0) return from;
      if ((elapsed /= duration / 2) === 2) {
        return from + change;
      } else {
        period = duration * (0.3 * 1.5);
        s = period / 4;
        if (elapsed < 1) {
          return 0.5 * (change * Math.pow(2, 10 * (elapsed -= 1)) * Math.sin((elapsed * duration - s) * 6.28 / period)) + from;
        } else {
          return change * Math.pow(2, -10 * (elapsed -= 1)) * Math.sin((elapsed * duration - s) * 6.28 / period) * -.5 + change + from;
        }
      }
    };
  });

  namespace('None', function(exports) {
    return exports.easeNone = function(elapsed, change, duration, from) {
      return elapsed * (change / duration) + from;
    };
  });

  namespace('Regular', function(exports) {
    exports.easeIn = function(elapsed, change, duration, from) {
      return change * (elapsed /= duration) * elapsed + from;
    };
    exports.easeOut = function(elapsed, change, duration, from) {
      return -change * (elapsed /= duration) * (elapsed - 2) + from;
    };
    return exports.easeInOut = function(elapsed, change, duration, from) {
      if ((elapsed /= duration / 2) < 1) {
        return (change / 2) * elapsed * elapsed + from;
      } else {
        return (-change / 2) * ((--elapsed) * (elapsed - 2) - 1) + from;
      }
    };
  });

  namespace('Strong', function(exports) {
    exports.easeIn = function(elapsed, change, duration, from) {
      return change * (elapsed /= duration) * elapsed * elapsed * elapsed * elapsed * elapsed + from;
    };
    exports.easeOut = function(elapsed, change, duration, from) {
      return -change * ((elapsed = elapsed / duration - 1) * elapsed * elapsed * elapsed - 1) + from;
    };
    return exports.easeInOut = function(elapsed, change, duration, from) {
      if ((elapsed /= duration / 2) < 1) {
        return (change / 2) * elapsed * elapsed * elapsed * elapsed * elapsed + from;
      } else {
        return (-change / 2) * ((elapsed -= 2) * elapsed * elapsed * elapsed - 2) + from;
      }
    };
  });

  Shape = (function(_super) {

    __extends(Shape, _super);

    function Shape(x, y, rotationVelocity, velocity, otherVelocity, alpha, rotation, fill, stroke, lineCap, lineWidth, lineJoin, miterLimit, xVelocity, yVelocity) {
      var _ref, _ref2;
      this.x = x;
      this.y = y;
      this.rotationVelocity = rotationVelocity;
      this.velocity = velocity;
      this.otherVelocity = otherVelocity;
      this.alpha = alpha;
      this.rotation = rotation;
      this.fill = fill;
      this.stroke = stroke;
      this.lineCap = lineCap;
      this.lineWidth = lineWidth;
      this.lineJoin = lineJoin;
      this.miterLimit = miterLimit;
      this.xVelocity = xVelocity;
      this.yVelocity = yVelocity;
      Shape.__super__.constructor.call(this, {
        x: this.x,
        y: this.y,
        rotationVelocity: this.rotationVelocity,
        velocity: this.velocity,
        otherVelocity: this.otherVelocity,
        alpha: this.alpha,
        lineCap: this.lineCap,
        lineWidth: this.lineWidth,
        lineJoin: this.lineJoin,
        miterLimit: this.miterLimit,
        xVelocity: this.xVelocity,
        yVelocity: this.yVelocity
      });
      this.fill = (_ref = this.fill) != null ? _ref : "rgba(0,0,255,0)";
      this.stroke = (_ref2 = this.stroke) != null ? _ref2 : "black";
    }

    return Shape;

  })(Sprite);

  Gradient = (function() {

    function Gradient(args) {
      var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (args == null) args = {};
      this.x1 = (_ref = args.x1) != null ? _ref : 0;
      this.y1 = (_ref2 = args.y1) != null ? _ref2 : 0;
      this.x2 = (_ref3 = args.x2) != null ? _ref3 : 60;
      this.y2 = (_ref4 = args.y2) != null ? _ref4 : 0;
      this.r1 = (_ref5 = args.r1) != null ? _ref5 : 5;
      this.r2 = (_ref6 = args.r2) != null ? _ref6 : 60;
      this.colorStops = (_ref7 = args.colorStops) != null ? _ref7 : [["red", 1], ["blue", 0], ["white", 0.5]];
    }

    Gradient.prototype.makeOptimalVertical = function(sprite) {
      this.y1 = 0;
      this.x1 = 0;
      this.y2 = 0;
      if (sprite.radius) {
        this.x1 = -sprite.radius - sprite.lineWidth;
        return this.x2 = sprite.radius + sprite.lineWidth;
      } else {
        return this.x2 = sprite.height;
      }
    };

    Gradient.prototype.makeOptimalHorizontal = function(sprite) {
      this.x1 = 0;
      this.y1 = 0;
      this.x2 = 0;
      if (sprite.radius) {
        this.y1 = -sprite.radius - sprite.lineWidth;
        return this.y2 = sprite.radius + sprite.lineWidth;
      } else {
        return this.y2 = sprite.height;
      }
    };

    Gradient.prototype.makeOptimalRadial = function(sprite) {
      this.x1 = 0;
      this.y1 = 0;
      this.x2 = 0;
      this.y2 = 0;
      if (sprite.radius) {
        this.r1 = sprite.radius / 10;
        return this.r2 = sprite.radius;
      } else {
        this.r1 = sprite.width / 10;
        return this.r2 = sprite.width;
      }
    };

    return Gradient;

  })();

  Pattern = (function() {

    function Pattern(args) {
      var _ref;
      if (args == null) args = {};
      this.image = args.image;
      this.repeat = (_ref = args.repeat) != null ? _ref : "repeat";
      this.imgId = document.getElementById(this.image);
    }

    return Pattern;

  })();

  Bitmap = (function(_super) {

    __extends(Bitmap, _super);

    function Bitmap(args) {
      if (args == null) args = {};
      Bitmap.__super__.constructor.call(this, args.x, args.y, args.angularVelocity, args.velocity, args.otherVelocity, args.alpha, args.rotation, args.fill, args.stroke, args.lineCap, args.lineWidth, args.lineJoin, args.miterLimit, args.xVelocity, args.yVelocity);
      this.image = document.getElementById(args.image);
      this.width = this.image.width;
      this.height = this.image.height;
      this.centerPoint = {
        x: -this.width / 2 - this.lineWidth / 2,
        y: -this.height / 2 - this.lineWidth / 2
      };
    }

    Bitmap.prototype.createStamp = function(context) {};

    Bitmap.prototype.draw = function(context) {
      return context.drawImage(this.image, this.centerPoint.x, this.centerPoint.y);
    };

    return Bitmap;

  })(Shape);

  Circle = (function(_super) {

    __extends(Circle, _super);

    function Circle(args) {
      var _ref;
      if (args == null) args = {};
      Circle.__super__.constructor.call(this, args.x, args.y, args.angularVelocity, args.velocity, args.otherVelocity, args.alpha, args.rotation, args.fill, args.stroke, args.lineCap, args.lineWidth, args.lineJoin, args.miterLimit, args.xVelocity, args.yVelocity);
      this.radius = (_ref = args.radius) != null ? _ref : 30;
      this.width = this.radius * 2;
      this.height = this.radius * 2;
      this.centerPoint = {
        x: -this.width / 2 - this.lineWidth / 2,
        y: -this.height / 2 - this.lineWidth / 2
      };
      this.buildDrawingCanvas();
    }

    Circle.prototype.createStamp = function(context) {
      context.translate(this.width / 2 + this.lineWidth / 2, this.height / 2 + this.lineWidth / 2);
      context.lineCap = this.lineCap;
      context.lineJoin = this.lineJoin;
      context.lineWidth = this.lineWidth;
      context.miterLimit = this.miterLimit;
      context.fillStyle = this.fill;
      context.strokeStyle = this.stroke;
      context.beginPath();
      context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
      context.fill();
      context.stroke();
      context.closePath();
      return context.translate(-this.width / 2 - this.lineWidth / 2, -this.height / 2 - this.lineWidth / 2);
    };

    Circle.prototype.draw = function(context) {
      return context.drawImage(this.canvas2, this.centerPoint.x, this.centerPoint.y);
    };

    return Circle;

  })(Shape);

  Curve = (function(_super) {

    __extends(Curve, _super);

    function Curve(args) {
      var canvas, _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
      if (args == null) args = {};
      Curve.__super__.constructor.call(this, args.x, args.y, args.angularVelocity, args.velocity, args.otherVelocity, args.alpha, args.rotation, args.fill, args.stroke, args.lineCap, args.lineWidth, args.lineJoin, args.miterLimit, args.xVelocity, args.yVelocity);
      this.cp1x = (_ref = args.cp1x) != null ? _ref : 0;
      this.cp1y = (_ref2 = args.cp1y) != null ? _ref2 : 0;
      this.cp2x = (_ref3 = args.cp2x) != null ? _ref3 : "none";
      this.cp2y = (_ref4 = args.cp2y) != null ? _ref4 : "none";
      this.toX = (_ref5 = args.toX) != null ? _ref5 : 100;
      this.toY = (_ref6 = args.toY) != null ? _ref6 : 100;
      canvas = document.getElementById("myCanvas");
      this.width = canvas.width;
      this.height = canvas.height;
      this.centerPoint = {
        x: -this.width / 2 - this.lineWidth / 2,
        y: -this.height / 2 - this.lineWidth / 2
      };
      this.buildDrawingCanvas();
    }

    Curve.prototype.createStamp = function(context) {
      context.strokeStyle = this.stroke;
      context.beginPath();
      context.moveTo(this.x, this.y);
      if (this.cp2x && this.cp2y !== "none") {
        context.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.toX, this.toY);
      } else {
        context.quadraticCurveTo(this.cp1x, this.cp1y, this.toX, this.toY);
      }
      context.stroke();
      return context.closePath();
    };

    Curve.prototype.draw = function(context) {
      return context.drawImage(this.canvas2, 0, 0);
    };

    return Curve;

  })(Shape);

  Line = (function(_super) {

    __extends(Line, _super);

    function Line(args) {
      var _ref, _ref2;
      if (args == null) args = {};
      Line.__super__.constructor.call(this, args.x, args.y, args.angularVelocity, args.velocity, args.otherVelocity, args.alpha, args.rotation, args.fill, args.stroke, args.lineCap, args.lineWidth, args.lineJoin, args.miterLimit, args.xVelocity, args.yVelocity);
      this.toX = (_ref = args.toX) != null ? _ref : 0;
      this.toY = (_ref2 = args.toY) != null ? _ref2 : 0;
      this.width = Math.abs(this.x - this.toX) * 2;
      this.height = Math.abs(this.y - this.toY) * 2;
      this.centerPoint = {
        x: -this.width / 2 - this.lineWidth / 2,
        y: -this.height / 2 - this.lineWidth / 2
      };
      this.buildDrawingCanvas();
    }

    Line.prototype.createStamp = function(context) {
      context.translate(this.width / 2 + this.lineWidth / 2, this.height / 2 + this.lineWidth / 2);
      context.strokeStyle = this.stroke;
      context.beginPath();
      context.translate(-this.x, -this.y);
      context.moveTo(this.x, this.y);
      context.lineTo(this.toX, this.toY);
      context.closePath();
      context.stroke();
      return context.translate(-this.width / 2 - this.lineWidth / 2, -this.height / 2 - this.lineWidth / 2);
    };

    Line.prototype.draw = function(context) {
      return context.drawImage(this.canvas2, this.centerPoint.x, this.centerPoint.y);
    };

    return Line;

  })(Shape);

  Polygon = (function(_super) {

    __extends(Polygon, _super);

    function Polygon(args) {
      var _ref, _ref2;
      if (args == null) args = {};
      Polygon.__super__.constructor.call(this, args.x, args.y, args.angularVelocity, args.velocity, args.otherVelocity, args.alpha, args.rotation, args.fill, args.stroke, args.lineCap, args.lineWidth, args.lineJoin, args.miterLimit, args.xVelocity, args.yVelocity);
      this.radius = (_ref = args.radius) != null ? _ref : 30;
      this.sides = (_ref2 = args.sides) != null ? _ref2 : 5;
      this.width = this.radius * 2;
      this.height = this.radius * 2;
      this.centerPoint = {
        x: -this.width / 2 - this.lineWidth / 2,
        y: -this.height / 2 - this.lineWidth / 2
      };
      this.buildDrawingCanvas();
    }

    Polygon.prototype.createStamp = function(context) {
      var radians, side, _ref;
      context.translate(this.width / 2 + this.lineWidth / 2, this.height / 2 + this.lineWidth / 2);
      context.lineCap = this.lineCap;
      context.lineJoin = this.lineJoin;
      context.lineWidth = this.lineWidth;
      context.miterLimit = this.miterLimit;
      context.save();
      radians = 2 * Math.PI / this.sides;
      context.beginPath();
      context.moveTo(0, -this.radius);
      for (side = 0, _ref = this.sides; 0 <= _ref ? side < _ref : side > _ref; 0 <= _ref ? side++ : side--) {
        context.rotate(radians);
        context.lineTo(0, -this.radius);
      }
      context.fillStyle = this.fill;
      context.strokeStyle = this.stroke;
      context.stroke();
      context.fill();
      context.closePath();
      context.restore();
      return context.translate(-this.width / 2 - this.lineWidth / 2, -this.height / 2 - this.lineWidth / 2);
    };

    Polygon.prototype.draw = function(context) {
      return context.drawImage(this.canvas2, this.centerPoint.x, this.centerPoint.y);
    };

    return Polygon;

  })(Shape);

  Rectangle = (function(_super) {

    __extends(Rectangle, _super);

    function Rectangle(args) {
      var _ref, _ref2;
      if (args == null) args = {};
      Rectangle.__super__.constructor.call(this, args.x, args.y, args.angularVelocity, args.velocity, args.otherVelocity, args.alpha, args.rotation, args.fill, args.stroke, args.lineCap, args.lineWidth, args.lineJoin, args.miterLimit, args.xVelocity, args.yVelocity);
      this.width = (_ref = args.width) != null ? _ref : 40;
      this.height = (_ref2 = args.height) != null ? _ref2 : 70;
      this.centerPoint = {
        x: -this.width / 2 - this.lineWidth / 2,
        y: -this.height / 2 - this.lineWidth / 2
      };
      this.buildDrawingCanvas();
    }

    Rectangle.prototype.createStamp = function(context) {
      context.translate(this.width / 2 + this.lineWidth / 2, this.height / 2 + this.lineWidth / 2);
      context.lineCap = this.lineCap;
      context.lineJoin = this.lineJoin;
      context.lineWidth = this.lineWidth;
      context.miterLimit = this.miterLimit;
      context.translate(-(this.width / 2), -(this.height / 2));
      context.fillStyle = this.fill;
      context.strokeStyle = this.stroke;
      context.rect(0, 0, this.width, this.height);
      context.fill();
      context.stroke();
      context.translate(this.width / 2, this.height / 2);
      return context.translate(-this.width / 2 - this.lineWidth / 2, -this.height / 2 - this.lineWidth / 2);
    };

    Rectangle.prototype.draw = function(context) {
      return context.drawImage(this.canvas2, this.centerPoint.x, this.centerPoint.y);
    };

    Rectangle.prototype.attachLinearGradientFill = function(gradient) {
      var grad;
      grad = this.stampContext.createLinearGradient(0, 0, 0, 30);
      grad.addColorStop(0, "black");
      grad.addColorStop(0.5, "white");
      grad.addColorStop(1, "blue");
      this.fill = grad;
      return this.createStamp(this.stampContext);
    };

    return Rectangle;

  })(Shape);

  RoundedRectangle = (function(_super) {

    __extends(RoundedRectangle, _super);

    function RoundedRectangle(args) {
      var _ref, _ref2, _ref3;
      if (args == null) args = {};
      RoundedRectangle.__super__.constructor.call(this, args.x, args.y, args.angularVelocity, args.velocity, args.otherVelocity, args.alpha, args.rotation, args.fill, args.stroke, args.lineCap, args.lineWidth, args.lineJoin, args.miterLimit, args.xVelocity, args.yVelocity);
      this.width = (_ref = args.width) != null ? _ref : 100;
      this.height = (_ref2 = args.height) != null ? _ref2 : 100;
      this.arcRadius = (_ref3 = args.arcRadius) != null ? _ref3 : 10;
      this.centerPoint = {
        x: -this.width / 2 - this.lineWidth / 2 + this.arcRadius / 2,
        y: -this.height / 2 - this.lineWidth / 2
      };
      this.buildDrawingCanvas();
    }

    RoundedRectangle.prototype.createStamp = function(context) {
      var arcRadius, height, width;
      context.translate(this.width / 2 + this.lineWidth / 2, this.height / 2 + this.lineWidth / 2);
      context.fillStyle = this.fill;
      context.strokeStyle = this.stroke;
      width = this.width - (2 * this.arcRadius);
      height = this.height - (2 * this.arcRadius);
      arcRadius = this.arcRadius;
      context.translate(-(this.width / 2), -(this.height / 2));
      context.beginPath();
      context.moveTo(arcRadius, 0);
      context.lineTo(width, 0);
      context.arcTo(width + arcRadius, 0, width + arcRadius, arcRadius, arcRadius);
      context.lineTo(width + arcRadius, arcRadius + height);
      context.arcTo(width + arcRadius, height + (2 * arcRadius), width, height + (2 * arcRadius), arcRadius);
      context.lineTo(arcRadius, height + (2 * arcRadius));
      context.arcTo(0, height + (2 * arcRadius), 0, height + arcRadius, arcRadius);
      context.lineTo(0, arcRadius);
      context.arcTo(0, 0, arcRadius, 0, arcRadius);
      context.fill();
      context.stroke();
      context.translate(this.width / 2, this.height / 2);
      return context.translate(-this.width / 2 - this.lineWidth / 2, -this.height / 2 - this.lineWidth / 2);
    };

    RoundedRectangle.prototype.draw = function(context) {
      return context.drawImage(this.canvas2, this.centerPoint.x, this.centerPoint.y);
    };

    return RoundedRectangle;

  })(Shape);

  Square = (function(_super) {

    __extends(Square, _super);

    function Square(args) {
      var _ref, _ref2;
      if (args == null) args = {};
      Square.__super__.constructor.call(this, args.x, args.y, args.angularVelocity, args.velocity, args.otherVelocity, args.alpha, args.rotation, args.fill, args.stroke, args.lineCap, args.lineWidth, args.lineJoin, args.miterLimit, args.xVelocity, args.yVelocity);
      this.lineWidth = (_ref = args.lineWidth) != null ? _ref : 1;
      this.width = (_ref2 = args.width) != null ? _ref2 : 30;
      this.height = this.width;
      this.centerPoint = {
        x: -this.width / 2 - this.lineWidth / 2,
        y: -this.height / 2 - this.lineWidth / 2
      };
      this.buildDrawingCanvas();
    }

    Square.prototype.createStamp = function(context) {
      context.translate(this.width / 2 + this.lineWidth / 2, this.height / 2 + this.lineWidth / 2);
      context.translate(-(this.width / 2), -(this.height / 2));
      context.fillStyle = this.fill;
      context.strokeStyle = this.stroke;
      context.beginPath();
      context.rect(0, 0, this.width, this.height);
      context.fill();
      context.stroke();
      context.closePath();
      context.translate(this.width / 2, this.height / 2);
      return context.translate(-this.width / 2 - this.lineWidth / 2, -this.height / 2 - this.lineWidth / 2);
    };

    Square.prototype.draw = function(context) {
      return context.drawImage(this.canvas2, this.centerPoint.x, this.centerPoint.y);
    };

    return Square;

  })(Shape);

  Star = (function(_super) {

    __extends(Star, _super);

    function Star(args) {
      var _ref, _ref2, _ref3;
      if (args == null) args = {};
      Star.__super__.constructor.call(this, args.x, args.y, args.angularVelocity, args.velocity, args.otherVelocity, args.alpha, args.rotation, args.fill, args.stroke, args.lineCap, args.lineWidth, args.lineJoin, args.miterLimit, args.xVelocity, args.yVelocity);
      this.radius = (_ref = args.radius) != null ? _ref : 30;
      this.sides = (_ref2 = args.sides) != null ? _ref2 : 5;
      this.width = this.radius * 2;
      this.height = this.width;
      this.lineWidth = (_ref3 = args.lineWidth) != null ? _ref3 : 1;
      this.centerPoint = {
        x: -this.width / 2 - this.lineWidth / 2,
        y: -this.height / 2 - this.lineWidth / 2
      };
      this.buildDrawingCanvas();
    }

    Star.prototype.createStamp = function(context) {
      var radians, side, _ref;
      context.translate(this.height / 2 + this.lineWidth, this.width / 2 + this.lineWidth);
      context.lineCap = this.lineCap;
      context.lineJoin = this.lineJoin;
      context.lineWidth = this.lineWidth;
      context.miterLimit = this.miterLimit;
      context.save();
      radians = Math.PI / this.sides;
      context.beginPath();
      context.moveTo(0, -this.radius);
      for (side = 0, _ref = this.sides; 0 <= _ref ? side < _ref : side > _ref; 0 <= _ref ? side++ : side--) {
        context.rotate(radians);
        context.lineTo(0, -0.5 * this.radius);
        context.rotate(radians);
        context.lineTo(0, -this.radius);
      }
      context.fillStyle = this.fill;
      context.strokeStyle = this.stroke;
      context.fill();
      context.stroke();
      context.closePath();
      context.restore();
      return context.translate(-this.height / 2 - this.lineWidth, -this.width / 2 - this.lineWidth);
    };

    Star.prototype.draw = function(context) {
      return context.drawImage(this.canvas2, this.centerPoint.x, this.centerPoint.y);
    };

    return Star;

  })(Shape);

  Text = (function(_super) {

    __extends(Text, _super);

    function Text(args) {
      var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (args == null) args = {};
      Text.__super__.constructor.call(this, args.x, args.y, args.angularVelocity, args.velocity, args.otherVelocity, args.alpha, args.rotation, args.fill, args.stroke, args.lineCap, args.lineWidth, args.lineJoin, args.miterLimit, args.xVelocity, args.yVelocity);
      this.text = (_ref = args.text) != null ? _ref : "Hello World!";
      this.fill = (_ref2 = args.fill) != null ? _ref2 : "black";
      this.style = (_ref3 = args.style) != null ? _ref3 : "normal ";
      this.variant = (_ref4 = args.variant) != null ? _ref4 : "normal ";
      this.weight = (_ref5 = args.weight) != null ? _ref5 : "normal ";
      this.size = (_ref6 = args.size) != null ? _ref6 : "12px ";
      this.family = (_ref7 = args.family) != null ? _ref7 : " sans-serif ";
      this.findWidth();
      this.centerPoint = {
        x: -this.width / 2 - this.lineWidth / 2,
        y: -this.height / 2 - this.lineWidth / 2
      };
      this.buildDrawingCanvas();
    }

    Text.prototype.createStamp = function(context) {
      var font;
      context.translate(this.width / 2 + this.lineWidth / 2, this.height / 2 + this.lineWidth / 2);
      context.fillStyle = this.fill;
      font = this.style + this.variant + this.weight + this.size + this.family;
      context.font = font;
      context.fillText(this.text, -this.width / 2, 0);
      return context.translate(-this.width / 2 - this.lineWidth / 2, -this.height / 2 - this.lineWidth / 2);
    };

    Text.prototype.draw = function(context) {
      return context.drawImage(this.canvas2, this.centerPoint.x, this.centerPoint.y);
    };

    Text.prototype.findWidth = function() {
      var tempCanvas, tempContext, _ref, _ref2;
      tempCanvas = document.createElement('canvas');
      tempCanvas.width = (_ref = scene.canvasWidth) != null ? _ref : 500;
      tempCanvas.height = (_ref2 = scene.canvasHeight) != null ? _ref2 : 500;
      tempContext = tempCanvas.getContext('2d');
      tempContext.font = this.style + this.variant + this.weight + this.size + this.family;
      this.width = tempContext.measureText(this.text).width;
      return this.height = this.width;
    };

    return Text;

  })(Shape);

  Triangle = (function(_super) {

    __extends(Triangle, _super);

    function Triangle(args) {
      var _ref, _ref2;
      if (args == null) args = {};
      Triangle.__super__.constructor.call(this, args.x, args.y, args.angularVelocity, args.velocity, args.otherVelocity, args.alpha, args.rotation, args.fill, args.stroke, args.lineCap, args.lineWidth, args.lineJoin, args.miterLimit, args.xVelocity, args.yVelocity);
      this.width = (_ref = args.width) != null ? _ref : 400;
      this.height = (_ref2 = args.height) != null ? _ref2 : 400;
      this.lineWidth = 2;
      /*
          @x1 = args.x1 ? 10
          @y1 = args.y1 ? 10
          @x2 = args.x2 ? 0
          @y2 = args.y2 ? 20
          @x3 = args.x3 ? 20
          @y3 = args.y3 ? 20
          @x = @x1
          @y = @y1
      */
      this.centerPoint = {
        x: -this.width / 2 - this.lineWidth / 2,
        y: -this.height / 2 - this.lineWidth / 2
      };
      this.buildDrawingCanvas();
    }

    Triangle.prototype.createStamp = function(context) {
      context.translate(this.width / 2 + this.lineWidth / 2, 0);
      context.lineCap = this.lineCap;
      context.lineJoin = this.lineJoin;
      context.lineWidth = this.lineWidth;
      context.miterLimit = this.miterLimit;
      context.fillStyle = this.fill;
      context.strokeStyle = this.stroke;
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(this.width / 2, this.height);
      context.lineTo(-this.width / 2, this.height);
      context.lineTo(0, 0);
      context.fill();
      context.stroke();
      context.closePath();
      return context.translate(-this.width / 2 - this.lineWidth, 0);
    };

    Triangle.prototype.draw = function(context) {
      return context.drawImage(this.canvas2, this.centerPoint.x, this.centerPoint.y);
    };

    return Triangle;

  })(Shape);

  namespace('CollisionResponse', function(exports) {
    exports.moveBeforeCollision = function(o) {
      o.rotation = o.rotation - ((o.rotation - o.delta.rotation) * 3);
      o.x = o.x - ((o.x - o.delta.x) * 3);
      o.y = o.y - ((o.y - o.delta.y) * 3);
      o.adjustedX = o.adjustedX - ((o.adjustedX - o.delta.x) * 3);
      return o.adjustedY = o.adjustedY - ((o.adjustedY - o.delta.y) * 3);
    };
    exports.stop = function(o) {
      CollisionResponse.moveBeforeCollision(o);
      o.xVelocity = 0;
      return o.yVelocity = 0;
    };
    return exports.randomBounce = function(o) {
      var direction, rand2, randomnumber;
      direction = true;
      randomnumber = Math.floor(Math.random() * 11);
      rand2 = Math.floor(Math.random() * 11);
      if (rand2 > 4) {
        direction = false;
        randomnumber = randomnumber * (-1);
      }
      randomnumber = randomnumber / 71;
      CollisionResponse.moveBeforeCollision(o);
      o.xVelocity = o.xVelocity * -1;
      if (o.y >= 200) o.yVelocity = -.1;
      if (o.y < 200) return o.yVelocity = 0.1;
    };
  });

  CollisionManager = (function() {

    function CollisionManager(scene) {
      this.checkCollision = [];
      this.collided = [];
      this.typesToTest = {};
      this.scene = scene;
    }

    CollisionManager.prototype.onUpdate = function(event) {
      var collisionEvent, from, sprite, _i, _j, _len, _len2, _ref, _ref2;
      _ref = this.checkCollision;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        this.runCollisionDetection(sprite);
      }
      _ref2 = this.collided;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        sprite = _ref2[_j];
        from = sprite.o1;
        collisionEvent = {
          type: "collision",
          keyCode: sprite.o2
        };
        from.receiveCollisionEvent(sprite.o2);
      }
      return this.collided = [];
    };

    CollisionManager.prototype.observe = function(sprite) {
      if (__indexOf.call(this.checkCollision, sprite) < 0) {
        return this.checkCollision.push(sprite);
      }
    };

    CollisionManager.prototype.unObserve = function(sprite) {
      var index;
      index = this.checkCollision.indexOf(sprite);
      return this.checkCollision.splice(index, 1);
    };

    CollisionManager.prototype.addTypeToTest = function(sprite, type) {
      if (this.typesToTest.sprite) {
        return this.typesToTest.sprite.push(type);
      } else {
        return this.typesToTest.sprite = [type];
      }
    };

    CollisionManager.prototype.pixelByPixel = function(xMax, xMin, yMax, yMin, o1, o2) {
      var canvas, canvas2, imgData1, imgData2, pixel1, pixel2, pixels1, pixels2, tempContext, xDiff, yDiff, _i, _j, _len, _len2, _step, _step2;
      xDiff = xMax - xMin;
      yDiff = yMax - yMin;
      canvas = document.getElementById("myCanvas");
      canvas2 = document.createElement('canvas');
      canvas2.width = canvas.width;
      canvas2.height = canvas.height;
      tempContext = canvas2.getContext('2d');
      o1.runDrawing2(tempContext);
      imgData1 = tempContext.getImageData(xMin, yMin, xDiff, yDiff);
      pixels1 = imgData1.data;
      tempContext.clearRect(0, 0, canvas2.width, canvas2.height);
      o2.runDrawing(tempContext);
      imgData2 = tempContext.getImageData(xMin, yMin, xDiff, yDiff);
      pixels2 = imgData2.data;
      for (_i = 0, _len = pixels1.length, _step = 3; _i < _len; _i += _step) {
        pixel1 = pixels1[_i];
        for (_j = 0, _len2 = pixels2.length, _step2 = 3; _j < _len2; _j += _step2) {
          pixel2 = pixels2[_j];
          if (pixel1 > 0 && pixel2 > 0) return true;
        }
      }
      return false;
    };

    CollisionManager.prototype.detectCollisions = function(o1, o2) {
      var side1, side2, x, x2, xMax, xMin, y, y2, yMax, yMin;
      side1 = Math.max(o1.width, o1.height);
      side2 = Math.max(o2.width, o2.height);
      x = Math.round(o1.adjustedX) + o1.lineWidth;
      y = Math.round(o1.adjustedY) + o1.lineWidth;
      x2 = Math.round(o2.adjustedX) + o2.lineWidth;
      y2 = Math.round(o2.adjustedY) + o2.lineWidth;
      x -= (side1 / 2 + 0.5) << 0;
      y -= (side1 / 2 + 0.5) << 0;
      x2 -= (side2 / 2 + 0.5) << 0;
      y2 -= (side2 / 2 + 0.5) << 0;
      xMin = Math.max(x, x2);
      yMin = Math.max(y, y2);
      xMax = Math.min(x + o1.width, x2 + o2.width);
      yMax = Math.min(y + o1.height, y2 + o2.height);
      if ((xMin >= xMax) || (yMin >= yMax)) {
        return false;
      } else {
        return this.pixelByPixel(xMax, xMin, yMax, yMin, o1, o2);
      }
    };

    CollisionManager.prototype.notOnCanvas = function(sprite) {
      var canvasObject, opposite;
      canvasObject = new Rectangle({
        x: scene.canvasWidth / 2,
        y: scene.canvasHeight / 2,
        width: scene.canvasWidth,
        height: scene.canvasHeight
      });
      opposite = this.detectCollisions(sprite, canvasObject);
      if (opposite === false) return true;
      if (opposite === true) return false;
    };

    CollisionManager.prototype.detectAtTime = function(xDiff, yDiff, xMin, yMin, o1, o2, moment) {
      var canvas, h, imgData1, imgData2, pixels1, pixels2, tempCanvas, tempContext, w;
      canvas = document.getElementById("myCanvas");
      w = xDiff - xMin;
      h = yDiff - yMin;
      tempCanvas = document.createElement("canvas");
      tempCanvas.width = 500;
      tempCanvas.height = 500;
      tempContext = tempCanvas.getContext("2d");
      tempContext.save();
      o1.setupCanvas(tempContext);
      tempContext.translate((o1.adjustedX - o1.delta.x) * moment, (o1.adjustedY - o1.delta.y) * moment);
      tempContext.rotate((o1.rotation - o1.delta.rotation) * moment);
      o1.draw(tempContext);
      imgData1 = tempContext.getImageData(xMin, yMin, xDiff, yDiff);
      pixels1 = imgData1.data;
      tempContext.restore();
      tempContext.clearRect(0, 0, 500, 500);
      o2.setupCanvas(tempContext);
      tempContext.rotate((o1.rotation - o1.delta.rotation) * moment);
      tempContext.translate((o2.adjustedX - o2.delta.x) * moment, (o2.adjustedY - o2.delta.y) * moment);
      o2.draw(tempContext);
      imgData2 = tempContext.getImageData(xMin, yMin, xDiff, yDiff);
      pixels2 = imgData2.data;
      return {
        pixels1: pixels1,
        pixels2: pixels2
      };
    };

    CollisionManager.prototype.collidesAtTime = function(xDiff, yDiff, xMin, yMin, o1, o2, moment) {
      var pixel1, pixel2, pixels, _i, _j, _len, _len2, _ref, _ref2, _step, _step2;
      pixels = this.detectAtTime(xDiff, yDiff, xMin, yMin, o1, o2, moment);
      _ref = pixels.pixels1;
      for (_i = 0, _len = _ref.length, _step = 3; _i < _len; _i += _step) {
        pixel1 = _ref[_i];
        _ref2 = pixels.pixels2;
        for (_j = 0, _len2 = _ref2.length, _step2 = 3; _j < _len2; _j += _step2) {
          pixel2 = _ref2[_j];
          if (pixel1 > 0 && pixel2 > 0) return true;
        }
      }
      return false;
    };

    CollisionManager.prototype.makePointsList = function(xDiff, yDiff, xMin, yMin, o1, o2, moment) {
      var list, pixel1, pixel2, pixels, x, y, _i, _j, _len, _len2, _ref, _ref2, _step, _step2;
      list = [];
      pixels = this.detectAtTime(xDiff, yDiff, xMin, yMin, o1, o2, moment);
      x = 0;
      y = 0;
      _ref = pixels.pixels1;
      for (_i = 0, _len = _ref.length, _step = 3; _i < _len; _i += _step) {
        pixel1 = _ref[_i];
        _ref2 = pixels.pixels2;
        for (_j = 0, _len2 = _ref2.length, _step2 = 3; _j < _len2; _j += _step2) {
          pixel2 = _ref2[_j];
          if (x >= xDiff) {
            x = 0;
            y = y + 1;
          } else {
            x = x + 1;
          }
          if (pixel1 > 0 && pixel2 > 0) {
            list.push([x + xMin, y + yMin]);
            if (list.length > 10) return list;
          }
        }
      }
    };

    CollisionManager.prototype.drawAtCollide = function(o, time) {
      o.rotation = o.rotation - ((o.rotation - o.delta.rotation) * time);
      o.x = o.x - ((o.x - o.delta.x) * time);
      o.y = o.y - ((o.y - o.delta.y) * time);
      o.adjustedX = o.adjustedX - ((o.adjustedX - o.delta.x) * time);
      return o.adjustedY = o.adjustedY - ((o.adjustedY - o.delta.y) * time);
    };

    CollisionManager.prototype.generatePoints = function(xDiff, yDiff, xMin, yMin, o1, o2) {
      var isColliding, max, mid, midValue, min, moment, time;
      min = 0;
      max = o1.time - 1;
      mid = 0;
      midValue = true;
      time = o1.time;
      isColliding = true;
      while (min <= max) {
        mid = Math.floor((min + max) / 2);
        moment = mid / time;
        isColliding = this.collidesAtTime(xDiff, yDiff, xMin, yMin, o1, o2, moment);
        if (isColliding === false) min = mid + 1;
        if (isColliding === true) max = mid - 1;
      }
      if (isColliding === true) {
        o1.collideTime = mid;
        return this.drawAtCollide(o1, mid / o1.time + 1);
      } else {
        o1.collideTime = mid + 1;
        return this.drawAtCollide(o1, (mid + 1) / o1.time + 1);
      }
    };

    CollisionManager.prototype.hitsBoundary = function(sprite) {
      var canvas, h, radius, w, x, xMax, xMin, y, yMax, yMin;
      canvas = document.getElementById("myCanvas");
      if (sprite instanceof Circle) {
        radius = sprite.radius;
        if (sprite.adjustedX + radius >= canvas.width) return true;
        if (sprite.adjustedX - radius <= 0) return true;
        if (sprite.adjustedY + radius >= canvas.height) return true;
        if (sprite.adjustedY - radius <= 0) return true;
      } else {
        y = sprite.adjustedY;
        x = sprite.adjustedX;
        h = sprite.height;
        w = sprite.width;
        yMin = y - (h / 2);
        yMax = y + (h / 2);
        xMin = x - (w / 2);
        xMax = x + (w / 2);
        if (xMin <= 0) {
          return true;
        } else if (xMax >= canvas.width) {
          return true;
        } else if (yMax >= canvas.height) {
          return true;
        } else if (yMin <= 0) {
          return true;
        }
      }
    };

    CollisionManager.prototype.runCollisionDetection = function(sprite) {
      var collision, index, isCorrectType, object, subSprite, type, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _results;
      _ref = this.typesToTest.sprite;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        if (type === "boundary") {
          if (this.hitsBoundary(sprite) === true) {
            this.collided.push({
              o1: sprite,
              o2: "boundary"
            });
          }
        }
      }
      index = this.scene.sprites.indexOf(sprite);
      isCorrectType = false;
      _ref2 = this.scene.sprites;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        object = _ref2[_j];
        isCorrectType = true;
        if (isCorrectType) {
          if (index !== this.scene.sprites.indexOf(object)) {
            collision = this.detectCollisions(sprite, object);
            if (collision === true) {
              this.collided.push({
                o1: sprite,
                o2: object
              });
            }
          }
        }
      }
      _ref3 = sprite.subSprites;
      _results = [];
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        subSprite = _ref3[_k];
        _results.push(this.runCollisionDetection(subSprite));
      }
      return _results;
    };

    return CollisionManager;

  })();

  GameLoop = (function() {

    function GameLoop() {
      this.init();
    }

    GameLoop.prototype.init = function() {
      var animationFrame, every, gameLoop, recursiveAnimation;
      gameLoop = function() {
        scene.update();
        collisions.onUpdate();
        scene.clear();
        return scene.draw();
      };
      animationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;
      if (animationFrame !== null) {
        recursiveAnimation = function() {
          gameLoop();
          return animationFrame(recursiveAnimation);
        };
        animationFrame(recursiveAnimation);
      }
      if (animationFrame === null) {
        every = function(ms, cb) {
          return setInterval(cb, ms);
        };
        return every(1000 / 60, function() {
          return gameLoop();
        });
      }
    };

    return GameLoop;

  })();

  KeyManager = (function() {

    function KeyManager() {
      var listener;
      document.addEventListener("keydown", (listener = function(event) {
        return keys.onKeyDown(event);
      }), false);
      document.addEventListener("keyup", (listener = function(event) {
        return keys.onKeyUp(event);
      }), false);
      this.sprites = [];
    }

    KeyManager.prototype.onKeyDown = function(event) {
      var sprite, _i, _len, _ref, _results;
      _ref = this.sprites;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        _results.push(sprite.receiveEvent(event));
      }
      return _results;
    };

    KeyManager.prototype.onKeyUp = function(event) {
      var sprite, _i, _len, _ref, _results;
      _ref = this.sprites;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        _results.push(sprite.receiveEvent(event));
      }
      return _results;
    };

    KeyManager.prototype.observe = function(sprite) {
      return this.sprites.push(sprite);
    };

    return KeyManager;

  })();

  Scene = (function() {

    function Scene(canvas, canvasWidth) {
      this.clear = __bind(this.clear, this);      this.canvas = document.getElementById("myCanvas");
      this.canvasWidth = this.canvas.width;
      this.canvasHeight = this.canvas.height;
      this.context = this.canvas.getContext("2d");
      this.sprites = [];
    }

    Scene.prototype.draw = function() {
      var sprite, _i, _len, _ref, _results;
      _ref = this.sprites;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        _results.push(sprite.runDrawing(this.context));
      }
      return _results;
    };

    Scene.prototype.update = function() {
      var sprite, _i, _len, _ref, _results;
      _ref = this.sprites;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        _results.push(sprite.update());
      }
      return _results;
    };

    Scene.prototype.addSprite = function(sprite) {
      return this.sprites.push(sprite);
    };

    Scene.prototype.addSprites = function() {
      var sprite, sprites, _i, _len, _results;
      sprites = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = sprites.length; _i < _len; _i++) {
        sprite = sprites[_i];
        _results.push(this.sprites.push(sprite));
      }
      return _results;
    };

    Scene.prototype.removeSprite = function(sprite) {
      var index;
      index = this.sprites.indexOf(sprite);
      this.sprites.splice(index, 1);
      return collisions.unObserve(sprite);
    };

    Scene.prototype.removeChild = function(parentSprite, childSprite) {
      var index;
      index = parentSprite.subSprites.indexOf(childSprite);
      parentSprite.subSprites.splice(index, 1);
      return collisions.unObserve(childSprite);
    };

    Scene.prototype.clone = function(obj) {
      var flags, key, newInstance;
      if (!(obj != null) || typeof obj !== 'object') return obj;
      if (obj instanceof Date) return new Date(obj.getTime());
      if (obj instanceof RegExp) {
        flags = '';
        if (obj.global != null) flags += 'g';
        if (obj.ignoreCase != null) flags += 'i';
        if (obj.multiline != null) flags += 'm';
        if (obj.sticky != null) flags += 'y';
        return new RegExp(obj.source, flags);
      }
      newInstance = new obj.constructor();
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          newInstance[key] = this.clone(obj[key]);
          newInstance[key] = obj[key];
        }
      }
      return newInstance;
    };

    Scene.prototype.makeChild = function(parentSprite, childSprite) {
      parentSprite.addChild(childSprite);
      childSprite.adjustedX = childSprite.x + parentSprite.adjustedX;
      return childSprite.adjustedY = childSprite.y + parentSprite.adjustedY;
    };

    Scene.prototype.clear = function() {
      return this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    };

    Scene.prototype.attachLinearGradientFill = function(sprite, gradient) {
      var a, grad, _i, _len, _ref;
      grad = this.context.createLinearGradient(gradient.x1, gradient.y1, gradient.x2, gradient.y2);
      _ref = gradient.colorStops;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        grad.addColorStop(a[1], a[0]);
      }
      sprite.fill = grad;
      return sprite.createStamp(sprite.stampContext);
    };

    Scene.prototype.attachRadialGradientFill = function(sprite, gradient) {
      var a, grad, _i, _len, _ref;
      grad = this.context.createRadialGradient(gradient.x1, gradient.y1, gradient.r1, gradient.x2, gradient.y2, gradient.r2);
      _ref = gradient.colorStops;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        grad.addColorStop(a[1], a[0]);
      }
      sprite.fill = grad;
      return sprite.createStamp(sprite.stampContext);
    };

    Scene.prototype.attachPattern = function(sprite, pattern) {
      var pat;
      pat = this.context.createPattern(pattern.imgId, pattern.repeat);
      sprite.fill = pat;
      return sprite.createStamp(sprite.stampContext);
    };

    return Scene;

  })();

  scene = new Scene;

  gameLoop = new GameLoop;

  keys = new KeyManager;

  collisions = new CollisionManager(scene);

  ball = new Circle({
    radius: 20,
    x: 200,
    y: 200,
    alpha: 0.4,
    fill: "yellow",
    lineWidth: 1,
    xVelocity: 0,
    yVelocity: 0
  });

  paddle1 = new RoundedRectangle({
    x: 380,
    y: 200,
    width: 50,
    height: 70,
    stroke: "purple"
  });

  paddle2 = new RoundedRectangle({
    x: 20,
    y: 200,
    width: 50,
    height: 70,
    stroke: "red"
  });

  scene.addSprite(paddle1);

  scene.addSprite(paddle2);

  scene.addSprite(ball);

  animations = {
    changeVelocity: function() {
      CollisionResponse.moveBeforeCollision(this);
      this.xVelocity = this.xVelocity * -1;
      if (this.y >= 200) {
        return this.yVelocity = -0.1;
      } else {
        return this.yVelocity = 0.1;
      }
    },
    crash: function() {
      alert("Crash!");
      this.moveTo(200, 200);
      this.xVelocity = 0;
      return this.yVelocity = 0;
    }
  };

  include(animations, Sprite);

  ball.addEvent({
    type: collisions,
    objectType: "boundary",
    toDo: f = function() {
      return ball.crash();
    }
  });

  ball.addEvent({
    type: collisions,
    objectType: RoundedRectangle,
    toDo: f = function() {
      return ball.changeVelocity();
    }
  });

  ball.addEvent({
    type: keys,
    action: "keydown",
    code: 13,
    toDo: f = function() {
      return ball.xVelocity = 0.5;
    }
  });

  paddle1.addEvent({
    type: keys,
    action: "keydown",
    code: 87,
    toDo: f = function() {
      return paddle1.move(0, -.5);
    }
  });

  paddle1.addEvent({
    type: keys,
    action: "keydown",
    code: 83,
    toDo: f = function() {
      return paddle1.move(0, .5);
    }
  });

  paddle2.addEvent({
    type: keys,
    action: "keydown",
    code: 87,
    toDo: f = function() {
      return paddle2.move(0, -.5);
    }
  });

  paddle2.addEvent({
    type: keys,
    action: "keydown",
    code: 83,
    toDo: f = function() {
      return paddle2.move(0, .5);
    }
  });

}).call(this);
