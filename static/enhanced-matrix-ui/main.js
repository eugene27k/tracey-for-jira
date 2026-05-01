(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/tslib/tslib.es6.mjs
  var tslib_es6_exports = {};
  __export(tslib_es6_exports, {
    __addDisposableResource: () => __addDisposableResource,
    __assign: () => __assign,
    __asyncDelegator: () => __asyncDelegator,
    __asyncGenerator: () => __asyncGenerator,
    __asyncValues: () => __asyncValues,
    __await: () => __await,
    __awaiter: () => __awaiter,
    __classPrivateFieldGet: () => __classPrivateFieldGet,
    __classPrivateFieldIn: () => __classPrivateFieldIn,
    __classPrivateFieldSet: () => __classPrivateFieldSet,
    __createBinding: () => __createBinding,
    __decorate: () => __decorate,
    __disposeResources: () => __disposeResources,
    __esDecorate: () => __esDecorate,
    __exportStar: () => __exportStar,
    __extends: () => __extends,
    __generator: () => __generator,
    __importDefault: () => __importDefault,
    __importStar: () => __importStar,
    __makeTemplateObject: () => __makeTemplateObject,
    __metadata: () => __metadata,
    __param: () => __param,
    __propKey: () => __propKey,
    __read: () => __read,
    __rest: () => __rest,
    __rewriteRelativeImportExtension: () => __rewriteRelativeImportExtension,
    __runInitializers: () => __runInitializers,
    __setFunctionName: () => __setFunctionName,
    __spread: () => __spread,
    __spreadArray: () => __spreadArray,
    __spreadArrays: () => __spreadArrays,
    __values: () => __values,
    default: () => tslib_es6_default
  });
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  }
  function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function __param(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  }
  function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) {
      if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
      return f;
    }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function(f) {
        if (done) throw new TypeError("Cannot add initializers after decoration has completed");
        extraInitializers.push(accept(f || null));
      };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
        if (result === void 0) continue;
        if (result === null || typeof result !== "object") throw new TypeError("Object expected");
        if (_ = accept(result.get)) descriptor.get = _;
        if (_ = accept(result.set)) descriptor.set = _;
        if (_ = accept(result.init)) initializers.unshift(_);
      } else if (_ = accept(result)) {
        if (kind === "field") initializers.unshift(_);
        else descriptor[key] = _;
      }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
  }
  function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
  }
  function __propKey(x) {
    return typeof x === "symbol" ? x : "".concat(x);
  }
  function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
  }
  function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
  }
  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  }
  function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
    return ar;
  }
  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
  }
  function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function awaitReturn(f) {
      return function(v) {
        return Promise.resolve(v).then(f, reject);
      };
    }
    function verb(n, f) {
      if (g[n]) {
        i[n] = function(v) {
          return new Promise(function(a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
        if (f) i[n] = f(i[n]);
      }
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
  }
  function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function(e) {
      throw e;
    }), verb("return"), i[Symbol.iterator] = function() {
      return this;
    }, i;
    function verb(n, f) {
      i[n] = o[n] ? function(v) {
        return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
      } : f;
    }
  }
  function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i);
    function verb(n) {
      i[n] = o[n] && function(v) {
        return new Promise(function(resolve, reject) {
          v = o[n](v), settle(resolve, reject, v.done, v.value);
        });
      };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function(v2) {
        resolve({ value: v2, done: d });
      }, reject);
    }
  }
  function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, "raw", { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  }
  function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    }
    __setModuleDefault(result, mod);
    return result;
  }
  function __importDefault(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  }
  function __classPrivateFieldGet(receiver, state2, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state2 === "function" ? receiver !== state2 || !f : !state2.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state2.get(receiver);
  }
  function __classPrivateFieldSet(receiver, state2, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state2 === "function" ? receiver !== state2 || !f : !state2.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state2.set(receiver, value), value;
  }
  function __classPrivateFieldIn(state2, receiver) {
    if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state2 === "function" ? receiver === state2 : state2.has(receiver);
  }
  function __addDisposableResource(env, value, async) {
    if (value !== null && value !== void 0) {
      if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
      var dispose, inner;
      if (async) {
        if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
      }
      if (dispose === void 0) {
        if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
        if (async) inner = dispose;
      }
      if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
      if (inner) dispose = function() {
        try {
          inner.call(this);
        } catch (e) {
          return Promise.reject(e);
        }
      };
      env.stack.push({ value, dispose, async });
    } else if (async) {
      env.stack.push({ async: true });
    }
    return value;
  }
  function __disposeResources(env) {
    function fail(e) {
      env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  }
  function __rewriteRelativeImportExtension(path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
        return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
      });
    }
    return path;
  }
  var extendStatics, __assign, __createBinding, __setModuleDefault, ownKeys, _SuppressedError, tslib_es6_default;
  var init_tslib_es6 = __esm({
    "node_modules/tslib/tslib.es6.mjs"() {
      extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      __assign = function() {
        __assign = Object.assign || function __assign2(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }) : function(o, v) {
        o["default"] = v;
      };
      ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
      };
      tslib_es6_default = {
        __extends,
        __assign,
        __rest,
        __decorate,
        __param,
        __esDecorate,
        __runInitializers,
        __propKey,
        __setFunctionName,
        __metadata,
        __awaiter,
        __generator,
        __createBinding,
        __exportStar,
        __values,
        __read,
        __spread,
        __spreadArrays,
        __spreadArray,
        __await,
        __asyncGenerator,
        __asyncDelegator,
        __asyncValues,
        __makeTemplateObject,
        __importStar,
        __importDefault,
        __classPrivateFieldGet,
        __classPrivateFieldSet,
        __classPrivateFieldIn,
        __addDisposableResource,
        __disposeResources,
        __rewriteRelativeImportExtension
      };
    }
  });

  // node_modules/@forge/bridge/out/router/targets.js
  var require_targets = __commonJS({
    "node_modules/@forge/bridge/out/router/targets.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NavigationTarget = void 0;
      exports.NavigationTarget = {
        ContentView: "contentView",
        ContentEdit: "contentEdit",
        ContentList: "contentList",
        SpaceView: "spaceView",
        Module: "module",
        UserProfile: "userProfile",
        Dashboard: "dashboard",
        Issue: "issue",
        ProjectSettingsDetails: "projectSettingsDetails"
      };
    }
  });

  // node_modules/@forge/bridge/out/errors.js
  var require_errors = __commonJS({
    "node_modules/@forge/bridge/out/errors.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BridgeAPIError = void 0;
      var BridgeAPIError = class extends Error {
      };
      exports.BridgeAPIError = BridgeAPIError;
    }
  });

  // node_modules/@forge/bridge/out/bridge.js
  var require_bridge = __commonJS({
    "node_modules/@forge/bridge/out/bridge.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getCallBridge = void 0;
      var errors_1 = require_errors();
      function isBridgeAvailable(bridge) {
        return !!(bridge === null || bridge === void 0 ? void 0 : bridge.callBridge);
      }
      var getCallBridge = () => {
        if (!isBridgeAvailable(window.__bridge)) {
          throw new errors_1.BridgeAPIError(`
      Unable to establish a connection with the Custom UI bridge.
      If you are trying to run your app locally, Forge apps only work in the context of Atlassian products. Refer to https://go.atlassian.com/forge-tunneling-with-custom-ui for how to tunnel when using a local development server.
    `);
        }
        return window.__bridge.callBridge;
      };
      exports.getCallBridge = getCallBridge;
    }
  });

  // node_modules/@forge/bridge/out/utils/index.js
  var require_utils = __commonJS({
    "node_modules/@forge/bridge/out/utils/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.withRateLimiter = void 0;
      var errors_1 = require_errors();
      var withRateLimiter = (wrappedFn, maxOps, intervalInMs, exceededErrorMessage) => {
        let start = Date.now();
        let numOps = 0;
        return async (...args) => {
          const now = Date.now();
          const elapsed = now - start;
          if (elapsed > intervalInMs) {
            start = now;
            numOps = 0;
          }
          if (numOps >= maxOps) {
            throw new errors_1.BridgeAPIError(exceededErrorMessage || "Too many invocations.");
          }
          numOps = numOps + 1;
          return wrappedFn(...args);
        };
      };
      exports.withRateLimiter = withRateLimiter;
    }
  });

  // node_modules/@forge/bridge/out/invoke/invoke.js
  var require_invoke = __commonJS({
    "node_modules/@forge/bridge/out/invoke/invoke.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.invoke = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var utils_1 = require_utils();
      var callBridge = (0, bridge_1.getCallBridge)();
      var validatePayload = (payload) => {
        if (!payload)
          return;
        if (Object.values(payload).some((val) => typeof val === "function")) {
          throw new errors_1.BridgeAPIError("Passing functions as part of the payload is not supported!");
        }
      };
      var _invoke = (functionKey, payload) => {
        if (typeof functionKey !== "string") {
          throw new errors_1.BridgeAPIError("functionKey must be a string!");
        }
        validatePayload(payload);
        return callBridge("invoke", { functionKey, payload });
      };
      exports.invoke = (0, utils_1.withRateLimiter)(_invoke, 500, 1e3 * 25, "Resolver calls are rate limited at 500req/25s");
    }
  });

  // node_modules/@forge/bridge/out/invoke/index.js
  var require_invoke2 = __commonJS({
    "node_modules/@forge/bridge/out/invoke/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_invoke(), exports);
    }
  });

  // node_modules/@forge/bridge/out/invoke-remote/invoke-remote.js
  var require_invoke_remote = __commonJS({
    "node_modules/@forge/bridge/out/invoke-remote/invoke-remote.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.invokeRemote = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var utils_1 = require_utils();
      var MAX_NUM_OPERATIONS = 500;
      var OPERATION_INTERVAL_MS = 1e3 * 25;
      var callBridge = (0, bridge_1.getCallBridge)();
      var validatePayload = (payload) => {
        if (!payload)
          return;
        if (Object.values(payload).some((val) => typeof val === "function")) {
          throw new errors_1.BridgeAPIError("Passing functions as part of the payload is not supported!");
        }
      };
      var _invokeRemote = async (input) => {
        var _a;
        validatePayload(input);
        const { success, payload, error } = (_a = await callBridge("invoke", input)) !== null && _a !== void 0 ? _a : {};
        const response = { ...success ? payload : error };
        if (response && response.headers) {
          for (const header in response.headers) {
            if (Array.isArray(response.headers[header])) {
              response.headers[header] = response.headers[header].join(",");
            }
          }
        }
        return response;
      };
      exports.invokeRemote = (0, utils_1.withRateLimiter)(_invokeRemote, MAX_NUM_OPERATIONS, OPERATION_INTERVAL_MS, "Remote invocation calls are rate limited at 500req/25s");
    }
  });

  // node_modules/@forge/bridge/out/invoke-remote/index.js
  var require_invoke_remote2 = __commonJS({
    "node_modules/@forge/bridge/out/invoke-remote/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_invoke_remote(), exports);
    }
  });

  // node_modules/@forge/bridge/out/view/submit.js
  var require_submit = __commonJS({
    "node_modules/@forge/bridge/out/view/submit.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.submit = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var submit = async (payload) => {
        const success = await callBridge("submit", payload);
        if (success === false) {
          throw new errors_1.BridgeAPIError("this resource's view is not submittable.");
        }
      };
      exports.submit = submit;
    }
  });

  // node_modules/@forge/bridge/out/view/close.js
  var require_close = __commonJS({
    "node_modules/@forge/bridge/out/view/close.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.close = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var close = async (payload) => {
        try {
          const success = await callBridge("close", payload);
          if (success === false) {
            throw new errors_1.BridgeAPIError("this resource's view is not closable.");
          }
        } catch (e) {
          throw new errors_1.BridgeAPIError("this resource's view is not closable.");
        }
      };
      exports.close = close;
    }
  });

  // node_modules/@forge/bridge/out/view/refresh.js
  var require_refresh = __commonJS({
    "node_modules/@forge/bridge/out/view/refresh.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.refresh = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var refresh = async (payload) => {
        const success = await callBridge("refresh", payload);
        if (success === false) {
          throw new errors_1.BridgeAPIError("this resource's view is not refreshable.");
        }
      };
      exports.refresh = refresh;
    }
  });

  // node_modules/@forge/bridge/out/view/createHistory.js
  var require_createHistory = __commonJS({
    "node_modules/@forge/bridge/out/view/createHistory.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createHistory = void 0;
      var bridge_1 = require_bridge();
      var callBridge = (0, bridge_1.getCallBridge)();
      var createHistory = async () => {
        const history = await callBridge("createHistory");
        history.listen((location) => {
          history.location = location;
        });
        return history;
      };
      exports.createHistory = createHistory;
    }
  });

  // node_modules/@forge/bridge/node_modules/@forge/i18n/out/constants.js
  var require_constants = __commonJS({
    "node_modules/@forge/bridge/node_modules/@forge/i18n/out/constants.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FORGE_SUPPORTED_LOCALE_CODES = exports.I18N_BUNDLE_FOLDER_NAME = exports.I18N_INFO_FILE_NAME = void 0;
      exports.I18N_INFO_FILE_NAME = "i18n-info.json";
      exports.I18N_BUNDLE_FOLDER_NAME = "__LOCALES__";
      exports.FORGE_SUPPORTED_LOCALE_CODES = [
        "zh-CN",
        "zh-TW",
        "cs-CZ",
        "da-DK",
        "nl-NL",
        "en-US",
        "en-GB",
        "et-EE",
        "fi-FI",
        "fr-FR",
        "de-DE",
        "hu-HU",
        "is-IS",
        "it-IT",
        "ja-JP",
        "ko-KR",
        "no-NO",
        "pl-PL",
        "pt-BR",
        "pt-PT",
        "ro-RO",
        "ru-RU",
        "sk-SK",
        "tr-TR",
        "es-ES",
        "sv-SE"
      ];
    }
  });

  // node_modules/@forge/bridge/node_modules/@forge/i18n/out/translationsGetter.js
  var require_translationsGetter = __commonJS({
    "node_modules/@forge/bridge/node_modules/@forge/i18n/out/translationsGetter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TranslationsGetter = exports.TranslationGetterError = void 0;
      var pushIfNotExists = (array, item) => {
        if (!array.includes(item)) {
          array.push(item);
        }
      };
      var TranslationGetterError = class extends Error {
        constructor(message) {
          super(message);
          this.name = "TranslationGetterError";
        }
      };
      exports.TranslationGetterError = TranslationGetterError;
      var TranslationsGetter = class {
        constructor(resourcesAccessor) {
          __publicField(this, "resourcesAccessor");
          __publicField(this, "i18nInfoConfig", null);
          __publicField(this, "translationResources", /* @__PURE__ */ new Map());
          this.resourcesAccessor = resourcesAccessor;
        }
        async getTranslations(locale, options = { fallback: true }) {
          const i18nInfoConfig = await this.getI18nInfoConfig();
          const { fallback } = options;
          if (!fallback) {
            let translationResource;
            if (i18nInfoConfig.locales.includes(locale)) {
              translationResource = await this.getTranslationResource(locale);
            }
            return {
              translations: translationResource ?? null,
              locale
            };
          }
          for (const targetLocale of this.getLocaleLookupOrder(locale, i18nInfoConfig)) {
            const translationResource = await this.getTranslationResource(targetLocale);
            if (translationResource) {
              return {
                translations: translationResource,
                locale: targetLocale
              };
            }
          }
          return {
            translations: null,
            locale
          };
        }
        async getTranslationsByLocaleLookupOrder(locale) {
          const i18nInfoConfig = await this.getI18nInfoConfig();
          const lookupOrder = this.getLocaleLookupOrder(locale, i18nInfoConfig);
          return await Promise.all(lookupOrder.map(async (targetLocale) => {
            const translationResource = await this.getTranslationResource(targetLocale);
            return {
              locale: targetLocale,
              translations: translationResource
            };
          }));
        }
        reset() {
          this.i18nInfoConfig = null;
          this.translationResources.clear();
        }
        async getTranslationResource(locale) {
          let resource = this.translationResources.get(locale);
          if (!resource) {
            try {
              resource = await this.resourcesAccessor.getTranslationResource(locale);
              this.translationResources.set(locale, resource);
            } catch (error) {
              if (error instanceof TranslationGetterError) {
                throw error;
              }
              throw new TranslationGetterError(`Failed to get translation resource for locale: ${locale}`);
            }
          }
          return resource;
        }
        async getI18nInfoConfig() {
          if (!this.i18nInfoConfig) {
            try {
              this.i18nInfoConfig = await this.resourcesAccessor.getI18nInfoConfig();
            } catch (error) {
              if (error instanceof TranslationGetterError) {
                throw error;
              }
              throw new TranslationGetterError("Failed to get i18n info config");
            }
          }
          return this.i18nInfoConfig;
        }
        getLocaleLookupOrder(locale, config) {
          const { locales, fallback } = config;
          const lookupOrder = [locale];
          const fallbackLocales = fallback[locale];
          if (fallbackLocales && Array.isArray(fallbackLocales) && fallbackLocales.length > 0) {
            lookupOrder.push(...fallbackLocales);
          }
          pushIfNotExists(lookupOrder, config.fallback.default);
          return lookupOrder.filter((locale2) => locales.includes(locale2));
        }
      };
      exports.TranslationsGetter = TranslationsGetter;
    }
  });

  // node_modules/lodash/isArray.js
  var require_isArray = __commonJS({
    "node_modules/lodash/isArray.js"(exports, module) {
      var isArray = Array.isArray;
      module.exports = isArray;
    }
  });

  // node_modules/lodash/_freeGlobal.js
  var require_freeGlobal = __commonJS({
    "node_modules/lodash/_freeGlobal.js"(exports, module) {
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      module.exports = freeGlobal;
    }
  });

  // node_modules/lodash/_root.js
  var require_root = __commonJS({
    "node_modules/lodash/_root.js"(exports, module) {
      var freeGlobal = require_freeGlobal();
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      module.exports = root;
    }
  });

  // node_modules/lodash/_Symbol.js
  var require_Symbol = __commonJS({
    "node_modules/lodash/_Symbol.js"(exports, module) {
      var root = require_root();
      var Symbol2 = root.Symbol;
      module.exports = Symbol2;
    }
  });

  // node_modules/lodash/_getRawTag.js
  var require_getRawTag = __commonJS({
    "node_modules/lodash/_getRawTag.js"(exports, module) {
      var Symbol2 = require_Symbol();
      var objectProto = Object.prototype;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var nativeObjectToString = objectProto.toString;
      var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
      function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
        try {
          value[symToStringTag] = void 0;
          var unmasked = true;
        } catch (e) {
        }
        var result = nativeObjectToString.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag] = tag;
          } else {
            delete value[symToStringTag];
          }
        }
        return result;
      }
      module.exports = getRawTag;
    }
  });

  // node_modules/lodash/_objectToString.js
  var require_objectToString = __commonJS({
    "node_modules/lodash/_objectToString.js"(exports, module) {
      var objectProto = Object.prototype;
      var nativeObjectToString = objectProto.toString;
      function objectToString(value) {
        return nativeObjectToString.call(value);
      }
      module.exports = objectToString;
    }
  });

  // node_modules/lodash/_baseGetTag.js
  var require_baseGetTag = __commonJS({
    "node_modules/lodash/_baseGetTag.js"(exports, module) {
      var Symbol2 = require_Symbol();
      var getRawTag = require_getRawTag();
      var objectToString = require_objectToString();
      var nullTag = "[object Null]";
      var undefinedTag = "[object Undefined]";
      var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
      function baseGetTag(value) {
        if (value == null) {
          return value === void 0 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
      }
      module.exports = baseGetTag;
    }
  });

  // node_modules/lodash/isObjectLike.js
  var require_isObjectLike = __commonJS({
    "node_modules/lodash/isObjectLike.js"(exports, module) {
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      module.exports = isObjectLike;
    }
  });

  // node_modules/lodash/isSymbol.js
  var require_isSymbol = __commonJS({
    "node_modules/lodash/isSymbol.js"(exports, module) {
      var baseGetTag = require_baseGetTag();
      var isObjectLike = require_isObjectLike();
      var symbolTag = "[object Symbol]";
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
      }
      module.exports = isSymbol;
    }
  });

  // node_modules/lodash/_isKey.js
  var require_isKey = __commonJS({
    "node_modules/lodash/_isKey.js"(exports, module) {
      var isArray = require_isArray();
      var isSymbol = require_isSymbol();
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
      var reIsPlainProp = /^\w*$/;
      function isKey(value, object) {
        if (isArray(value)) {
          return false;
        }
        var type = typeof value;
        if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
          return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
      }
      module.exports = isKey;
    }
  });

  // node_modules/lodash/isObject.js
  var require_isObject = __commonJS({
    "node_modules/lodash/isObject.js"(exports, module) {
      function isObject(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      module.exports = isObject;
    }
  });

  // node_modules/lodash/isFunction.js
  var require_isFunction = __commonJS({
    "node_modules/lodash/isFunction.js"(exports, module) {
      var baseGetTag = require_baseGetTag();
      var isObject = require_isObject();
      var asyncTag = "[object AsyncFunction]";
      var funcTag = "[object Function]";
      var genTag = "[object GeneratorFunction]";
      var proxyTag = "[object Proxy]";
      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
      }
      module.exports = isFunction;
    }
  });

  // node_modules/lodash/_coreJsData.js
  var require_coreJsData = __commonJS({
    "node_modules/lodash/_coreJsData.js"(exports, module) {
      var root = require_root();
      var coreJsData = root["__core-js_shared__"];
      module.exports = coreJsData;
    }
  });

  // node_modules/lodash/_isMasked.js
  var require_isMasked = __commonJS({
    "node_modules/lodash/_isMasked.js"(exports, module) {
      var coreJsData = require_coreJsData();
      var maskSrcKey = (function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      })();
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      module.exports = isMasked;
    }
  });

  // node_modules/lodash/_toSource.js
  var require_toSource = __commonJS({
    "node_modules/lodash/_toSource.js"(exports, module) {
      var funcProto = Function.prototype;
      var funcToString = funcProto.toString;
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      module.exports = toSource;
    }
  });

  // node_modules/lodash/_baseIsNative.js
  var require_baseIsNative = __commonJS({
    "node_modules/lodash/_baseIsNative.js"(exports, module) {
      var isFunction = require_isFunction();
      var isMasked = require_isMasked();
      var isObject = require_isObject();
      var toSource = require_toSource();
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var funcProto = Function.prototype;
      var objectProto = Object.prototype;
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var reIsNative = RegExp(
        "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      module.exports = baseIsNative;
    }
  });

  // node_modules/lodash/_getValue.js
  var require_getValue = __commonJS({
    "node_modules/lodash/_getValue.js"(exports, module) {
      function getValue(object, key) {
        return object == null ? void 0 : object[key];
      }
      module.exports = getValue;
    }
  });

  // node_modules/lodash/_getNative.js
  var require_getNative = __commonJS({
    "node_modules/lodash/_getNative.js"(exports, module) {
      var baseIsNative = require_baseIsNative();
      var getValue = require_getValue();
      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : void 0;
      }
      module.exports = getNative;
    }
  });

  // node_modules/lodash/_nativeCreate.js
  var require_nativeCreate = __commonJS({
    "node_modules/lodash/_nativeCreate.js"(exports, module) {
      var getNative = require_getNative();
      var nativeCreate = getNative(Object, "create");
      module.exports = nativeCreate;
    }
  });

  // node_modules/lodash/_hashClear.js
  var require_hashClear = __commonJS({
    "node_modules/lodash/_hashClear.js"(exports, module) {
      var nativeCreate = require_nativeCreate();
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      module.exports = hashClear;
    }
  });

  // node_modules/lodash/_hashDelete.js
  var require_hashDelete = __commonJS({
    "node_modules/lodash/_hashDelete.js"(exports, module) {
      function hashDelete(key) {
        var result = this.has(key) && delete this.__data__[key];
        this.size -= result ? 1 : 0;
        return result;
      }
      module.exports = hashDelete;
    }
  });

  // node_modules/lodash/_hashGet.js
  var require_hashGet = __commonJS({
    "node_modules/lodash/_hashGet.js"(exports, module) {
      var nativeCreate = require_nativeCreate();
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var objectProto = Object.prototype;
      var hasOwnProperty = objectProto.hasOwnProperty;
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED ? void 0 : result;
        }
        return hasOwnProperty.call(data, key) ? data[key] : void 0;
      }
      module.exports = hashGet;
    }
  });

  // node_modules/lodash/_hashHas.js
  var require_hashHas = __commonJS({
    "node_modules/lodash/_hashHas.js"(exports, module) {
      var nativeCreate = require_nativeCreate();
      var objectProto = Object.prototype;
      var hasOwnProperty = objectProto.hasOwnProperty;
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
      }
      module.exports = hashHas;
    }
  });

  // node_modules/lodash/_hashSet.js
  var require_hashSet = __commonJS({
    "node_modules/lodash/_hashSet.js"(exports, module) {
      var nativeCreate = require_nativeCreate();
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
        return this;
      }
      module.exports = hashSet;
    }
  });

  // node_modules/lodash/_Hash.js
  var require_Hash = __commonJS({
    "node_modules/lodash/_Hash.js"(exports, module) {
      var hashClear = require_hashClear();
      var hashDelete = require_hashDelete();
      var hashGet = require_hashGet();
      var hashHas = require_hashHas();
      var hashSet = require_hashSet();
      function Hash(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      module.exports = Hash;
    }
  });

  // node_modules/lodash/_listCacheClear.js
  var require_listCacheClear = __commonJS({
    "node_modules/lodash/_listCacheClear.js"(exports, module) {
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }
      module.exports = listCacheClear;
    }
  });

  // node_modules/lodash/eq.js
  var require_eq = __commonJS({
    "node_modules/lodash/eq.js"(exports, module) {
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      module.exports = eq;
    }
  });

  // node_modules/lodash/_assocIndexOf.js
  var require_assocIndexOf = __commonJS({
    "node_modules/lodash/_assocIndexOf.js"(exports, module) {
      var eq = require_eq();
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      module.exports = assocIndexOf;
    }
  });

  // node_modules/lodash/_listCacheDelete.js
  var require_listCacheDelete = __commonJS({
    "node_modules/lodash/_listCacheDelete.js"(exports, module) {
      var assocIndexOf = require_assocIndexOf();
      var arrayProto = Array.prototype;
      var splice = arrayProto.splice;
      function listCacheDelete(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        --this.size;
        return true;
      }
      module.exports = listCacheDelete;
    }
  });

  // node_modules/lodash/_listCacheGet.js
  var require_listCacheGet = __commonJS({
    "node_modules/lodash/_listCacheGet.js"(exports, module) {
      var assocIndexOf = require_assocIndexOf();
      function listCacheGet(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return index < 0 ? void 0 : data[index][1];
      }
      module.exports = listCacheGet;
    }
  });

  // node_modules/lodash/_listCacheHas.js
  var require_listCacheHas = __commonJS({
    "node_modules/lodash/_listCacheHas.js"(exports, module) {
      var assocIndexOf = require_assocIndexOf();
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      module.exports = listCacheHas;
    }
  });

  // node_modules/lodash/_listCacheSet.js
  var require_listCacheSet = __commonJS({
    "node_modules/lodash/_listCacheSet.js"(exports, module) {
      var assocIndexOf = require_assocIndexOf();
      function listCacheSet(key, value) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      module.exports = listCacheSet;
    }
  });

  // node_modules/lodash/_ListCache.js
  var require_ListCache = __commonJS({
    "node_modules/lodash/_ListCache.js"(exports, module) {
      var listCacheClear = require_listCacheClear();
      var listCacheDelete = require_listCacheDelete();
      var listCacheGet = require_listCacheGet();
      var listCacheHas = require_listCacheHas();
      var listCacheSet = require_listCacheSet();
      function ListCache(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      module.exports = ListCache;
    }
  });

  // node_modules/lodash/_Map.js
  var require_Map = __commonJS({
    "node_modules/lodash/_Map.js"(exports, module) {
      var getNative = require_getNative();
      var root = require_root();
      var Map2 = getNative(root, "Map");
      module.exports = Map2;
    }
  });

  // node_modules/lodash/_mapCacheClear.js
  var require_mapCacheClear = __commonJS({
    "node_modules/lodash/_mapCacheClear.js"(exports, module) {
      var Hash = require_Hash();
      var ListCache = require_ListCache();
      var Map2 = require_Map();
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map2 || ListCache)(),
          "string": new Hash()
        };
      }
      module.exports = mapCacheClear;
    }
  });

  // node_modules/lodash/_isKeyable.js
  var require_isKeyable = __commonJS({
    "node_modules/lodash/_isKeyable.js"(exports, module) {
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      module.exports = isKeyable;
    }
  });

  // node_modules/lodash/_getMapData.js
  var require_getMapData = __commonJS({
    "node_modules/lodash/_getMapData.js"(exports, module) {
      var isKeyable = require_isKeyable();
      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      module.exports = getMapData;
    }
  });

  // node_modules/lodash/_mapCacheDelete.js
  var require_mapCacheDelete = __commonJS({
    "node_modules/lodash/_mapCacheDelete.js"(exports, module) {
      var getMapData = require_getMapData();
      function mapCacheDelete(key) {
        var result = getMapData(this, key)["delete"](key);
        this.size -= result ? 1 : 0;
        return result;
      }
      module.exports = mapCacheDelete;
    }
  });

  // node_modules/lodash/_mapCacheGet.js
  var require_mapCacheGet = __commonJS({
    "node_modules/lodash/_mapCacheGet.js"(exports, module) {
      var getMapData = require_getMapData();
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      module.exports = mapCacheGet;
    }
  });

  // node_modules/lodash/_mapCacheHas.js
  var require_mapCacheHas = __commonJS({
    "node_modules/lodash/_mapCacheHas.js"(exports, module) {
      var getMapData = require_getMapData();
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      module.exports = mapCacheHas;
    }
  });

  // node_modules/lodash/_mapCacheSet.js
  var require_mapCacheSet = __commonJS({
    "node_modules/lodash/_mapCacheSet.js"(exports, module) {
      var getMapData = require_getMapData();
      function mapCacheSet(key, value) {
        var data = getMapData(this, key), size = data.size;
        data.set(key, value);
        this.size += data.size == size ? 0 : 1;
        return this;
      }
      module.exports = mapCacheSet;
    }
  });

  // node_modules/lodash/_MapCache.js
  var require_MapCache = __commonJS({
    "node_modules/lodash/_MapCache.js"(exports, module) {
      var mapCacheClear = require_mapCacheClear();
      var mapCacheDelete = require_mapCacheDelete();
      var mapCacheGet = require_mapCacheGet();
      var mapCacheHas = require_mapCacheHas();
      var mapCacheSet = require_mapCacheSet();
      function MapCache(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      module.exports = MapCache;
    }
  });

  // node_modules/lodash/memoize.js
  var require_memoize = __commonJS({
    "node_modules/lodash/memoize.js"(exports, module) {
      var MapCache = require_MapCache();
      var FUNC_ERROR_TEXT = "Expected a function";
      function memoize(func, resolver) {
        if (typeof func != "function" || resolver != null && typeof resolver != "function") {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        var memoized = function() {
          var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
          if (cache.has(key)) {
            return cache.get(key);
          }
          var result = func.apply(this, args);
          memoized.cache = cache.set(key, result) || cache;
          return result;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      module.exports = memoize;
    }
  });

  // node_modules/lodash/_memoizeCapped.js
  var require_memoizeCapped = __commonJS({
    "node_modules/lodash/_memoizeCapped.js"(exports, module) {
      var memoize = require_memoize();
      var MAX_MEMOIZE_SIZE = 500;
      function memoizeCapped(func) {
        var result = memoize(func, function(key) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }
          return key;
        });
        var cache = result.cache;
        return result;
      }
      module.exports = memoizeCapped;
    }
  });

  // node_modules/lodash/_stringToPath.js
  var require_stringToPath = __commonJS({
    "node_modules/lodash/_stringToPath.js"(exports, module) {
      var memoizeCapped = require_memoizeCapped();
      var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = memoizeCapped(function(string) {
        var result = [];
        if (string.charCodeAt(0) === 46) {
          result.push("");
        }
        string.replace(rePropName, function(match, number, quote, subString) {
          result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
        });
        return result;
      });
      module.exports = stringToPath;
    }
  });

  // node_modules/lodash/_arrayMap.js
  var require_arrayMap = __commonJS({
    "node_modules/lodash/_arrayMap.js"(exports, module) {
      function arrayMap(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length, result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
      module.exports = arrayMap;
    }
  });

  // node_modules/lodash/_baseToString.js
  var require_baseToString = __commonJS({
    "node_modules/lodash/_baseToString.js"(exports, module) {
      var Symbol2 = require_Symbol();
      var arrayMap = require_arrayMap();
      var isArray = require_isArray();
      var isSymbol = require_isSymbol();
      var INFINITY = 1 / 0;
      var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
      var symbolToString = symbolProto ? symbolProto.toString : void 0;
      function baseToString(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isArray(value)) {
          return arrayMap(value, baseToString) + "";
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : "";
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
      }
      module.exports = baseToString;
    }
  });

  // node_modules/lodash/toString.js
  var require_toString = __commonJS({
    "node_modules/lodash/toString.js"(exports, module) {
      var baseToString = require_baseToString();
      function toString(value) {
        return value == null ? "" : baseToString(value);
      }
      module.exports = toString;
    }
  });

  // node_modules/lodash/_castPath.js
  var require_castPath = __commonJS({
    "node_modules/lodash/_castPath.js"(exports, module) {
      var isArray = require_isArray();
      var isKey = require_isKey();
      var stringToPath = require_stringToPath();
      var toString = require_toString();
      function castPath(value, object) {
        if (isArray(value)) {
          return value;
        }
        return isKey(value, object) ? [value] : stringToPath(toString(value));
      }
      module.exports = castPath;
    }
  });

  // node_modules/lodash/_toKey.js
  var require_toKey = __commonJS({
    "node_modules/lodash/_toKey.js"(exports, module) {
      var isSymbol = require_isSymbol();
      var INFINITY = 1 / 0;
      function toKey(value) {
        if (typeof value == "string" || isSymbol(value)) {
          return value;
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
      }
      module.exports = toKey;
    }
  });

  // node_modules/lodash/_baseGet.js
  var require_baseGet = __commonJS({
    "node_modules/lodash/_baseGet.js"(exports, module) {
      var castPath = require_castPath();
      var toKey = require_toKey();
      function baseGet(object, path) {
        path = castPath(path, object);
        var index = 0, length = path.length;
        while (object != null && index < length) {
          object = object[toKey(path[index++])];
        }
        return index && index == length ? object : void 0;
      }
      module.exports = baseGet;
    }
  });

  // node_modules/lodash/get.js
  var require_get = __commonJS({
    "node_modules/lodash/get.js"(exports, module) {
      var baseGet = require_baseGet();
      function get(object, path, defaultValue) {
        var result = object == null ? void 0 : baseGet(object, path);
        return result === void 0 ? defaultValue : result;
      }
      module.exports = get;
    }
  });

  // node_modules/@forge/bridge/node_modules/@forge/i18n/out/translationValueGetter.js
  var require_translationValueGetter = __commonJS({
    "node_modules/@forge/bridge/node_modules/@forge/i18n/out/translationValueGetter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getTranslationValueFromContent = exports.getTranslationValue = void 0;
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      var get_1 = tslib_1.__importDefault(require_get());
      var getTranslationValue = (translationLookup, i18nKey, locale) => {
        const translation = translationLookup[locale];
        if (!translation) {
          return null;
        }
        return (0, exports.getTranslationValueFromContent)(translation, i18nKey);
      };
      exports.getTranslationValue = getTranslationValue;
      var getTranslationValueFromContent = (translationContent, i18nKey) => {
        let translationValue = translationContent[i18nKey];
        if (!translationValue) {
          const keyTokens = i18nKey.split(".");
          if (keyTokens.length > 1) {
            translationValue = (0, get_1.default)(translationContent, keyTokens, null);
          }
        }
        return typeof translationValue === "string" ? translationValue : null;
      };
      exports.getTranslationValueFromContent = getTranslationValueFromContent;
    }
  });

  // node_modules/@forge/bridge/node_modules/@forge/i18n/out/translator.js
  var require_translator = __commonJS({
    "node_modules/@forge/bridge/node_modules/@forge/i18n/out/translator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Translator = void 0;
      var translationValueGetter_1 = require_translationValueGetter();
      var Translator = class {
        constructor(locale, translationsGetter) {
          __publicField(this, "locale");
          __publicField(this, "translationsGetter");
          __publicField(this, "localeLookupOrderedTranslations", null);
          __publicField(this, "cache", /* @__PURE__ */ new Map());
          this.locale = locale;
          this.translationsGetter = translationsGetter;
        }
        async init() {
          this.localeLookupOrderedTranslations = await this.translationsGetter.getTranslationsByLocaleLookupOrder(this.locale);
        }
        translate(i18nKey) {
          if (!this.localeLookupOrderedTranslations) {
            throw new Error("TranslationLookup not initialized");
          }
          let result = this.cache.get(i18nKey);
          if (result === void 0) {
            for (const { translations } of this.localeLookupOrderedTranslations) {
              const translationValue = (0, translationValueGetter_1.getTranslationValueFromContent)(translations, i18nKey);
              if (translationValue !== null) {
                result = translationValue;
                break;
              }
            }
            result = result ?? null;
            this.cache.set(i18nKey, result);
          }
          return result;
        }
      };
      exports.Translator = Translator;
    }
  });

  // node_modules/@forge/bridge/node_modules/@forge/i18n/out/ensureLocale.js
  var require_ensureLocale = __commonJS({
    "node_modules/@forge/bridge/node_modules/@forge/i18n/out/ensureLocale.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ensureLocale = void 0;
      var constants_1 = require_constants();
      var forgeSupportedLocaleCodesSet = new Set(constants_1.FORGE_SUPPORTED_LOCALE_CODES);
      var localeFallbacks = {
        "en-UK": "en-GB",
        "nb-NO": "no-NO"
      };
      var languageToLocaleCodeMap = constants_1.FORGE_SUPPORTED_LOCALE_CODES.reduce((agg, code) => {
        const [lng] = code.split("-");
        if (!agg[lng]) {
          agg[lng] = code;
        }
        return agg;
      }, {
        nb: "no-NO",
        pt: "pt-PT"
      });
      var ensureLocale = (rawLocale) => {
        const locale = rawLocale.replace("_", "-");
        if (forgeSupportedLocaleCodesSet.has(locale)) {
          return locale;
        }
        return languageToLocaleCodeMap[locale] ?? localeFallbacks[locale] ?? null;
      };
      exports.ensureLocale = ensureLocale;
    }
  });

  // node_modules/@forge/bridge/node_modules/@forge/i18n/out/moduleI18nHelper.js
  var require_moduleI18nHelper = __commonJS({
    "node_modules/@forge/bridge/node_modules/@forge/i18n/out/moduleI18nHelper.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.extractI18nPropertiesFromModules = exports.extractI18nKeysFromModules = exports.getI18nSupportedModuleEntries = void 0;
      var isObject = (value) => {
        return typeof value === "object" && value !== null && !Array.isArray(value);
      };
      var isI18nValue = (value) => {
        return typeof value?.i18n === "string";
      };
      var isConnectModuleKey = (moduleKey) => moduleKey.startsWith("connect-");
      var isCoreModuleKey = (moduleKey) => moduleKey.startsWith("core:");
      var getI18nKeysFromObject = (obj) => {
        const visited = /* @__PURE__ */ new Set();
        const visit = (value, i18nPath) => {
          if (!isObject(value) || visited.has(value)) {
            return [];
          }
          visited.add(value);
          return Object.entries(value).flatMap(([propKey, propValue]) => {
            const currentPath = [...i18nPath, propKey];
            if (isI18nValue(propValue)) {
              return [{ propertyPath: currentPath, key: propValue.i18n }];
            } else if (Array.isArray(propValue)) {
              return propValue.flatMap((item) => visit(item, currentPath));
            }
            return visit(propValue, currentPath);
          });
        };
        return visit(obj, []);
      };
      var getI18nSupportedModuleEntries = (modules) => {
        return Object.entries(modules).flatMap(([moduleKey, moduleEntries]) => {
          if (!isConnectModuleKey(moduleKey) && !isCoreModuleKey(moduleKey) && moduleEntries && Array.isArray(moduleEntries) && moduleEntries.length > 0) {
            return moduleEntries.map((moduleEntry) => [moduleEntry, moduleKey]);
          }
          return [];
        });
      };
      exports.getI18nSupportedModuleEntries = getI18nSupportedModuleEntries;
      var extractI18nKeysFromModules = (modules) => {
        const i18nKeys = /* @__PURE__ */ new Set();
        for (const moduleEntry of (0, exports.getI18nSupportedModuleEntries)(modules)) {
          const i18nKeysForEntryValue = getI18nKeysFromObject(moduleEntry[0]);
          for (const { key } of i18nKeysForEntryValue) {
            i18nKeys.add(key);
          }
        }
        return i18nKeys.size > 0 ? Array.from(i18nKeys) : [];
      };
      exports.extractI18nKeysFromModules = extractI18nKeysFromModules;
      var extractI18nPropertiesFromModules = (modules) => {
        const moduleI18nProperties = [];
        for (const moduleEntry of (0, exports.getI18nSupportedModuleEntries)(modules)) {
          const i18nKeysForEntryValue = getI18nKeysFromObject(moduleEntry[0]);
          for (const i18nObj of i18nKeysForEntryValue) {
            moduleI18nProperties.push({ moduleName: moduleEntry[1], ...i18nObj });
          }
        }
        return moduleI18nProperties;
      };
      exports.extractI18nPropertiesFromModules = extractI18nPropertiesFromModules;
    }
  });

  // node_modules/@forge/bridge/node_modules/@forge/i18n/out/types.js
  var require_types = __commonJS({
    "node_modules/@forge/bridge/node_modules/@forge/i18n/out/types.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/@forge/bridge/node_modules/@forge/i18n/out/index.js
  var require_out = __commonJS({
    "node_modules/@forge/bridge/node_modules/@forge/i18n/out/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getI18nSupportedModuleEntries = exports.extractI18nPropertiesFromModules = exports.extractI18nKeysFromModules = exports.getTranslationValue = void 0;
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_constants(), exports);
      tslib_1.__exportStar(require_translationsGetter(), exports);
      tslib_1.__exportStar(require_translator(), exports);
      tslib_1.__exportStar(require_ensureLocale(), exports);
      var translationValueGetter_1 = require_translationValueGetter();
      Object.defineProperty(exports, "getTranslationValue", { enumerable: true, get: function() {
        return translationValueGetter_1.getTranslationValue;
      } });
      var moduleI18nHelper_1 = require_moduleI18nHelper();
      Object.defineProperty(exports, "extractI18nKeysFromModules", { enumerable: true, get: function() {
        return moduleI18nHelper_1.extractI18nKeysFromModules;
      } });
      Object.defineProperty(exports, "extractI18nPropertiesFromModules", { enumerable: true, get: function() {
        return moduleI18nHelper_1.extractI18nPropertiesFromModules;
      } });
      Object.defineProperty(exports, "getI18nSupportedModuleEntries", { enumerable: true, get: function() {
        return moduleI18nHelper_1.getI18nSupportedModuleEntries;
      } });
      tslib_1.__exportStar(require_types(), exports);
    }
  });

  // node_modules/@forge/bridge/out/view/getContext.js
  var require_getContext = __commonJS({
    "node_modules/@forge/bridge/out/view/getContext.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getContext = void 0;
      var bridge_1 = require_bridge();
      var i18n_1 = require_out();
      var callBridge = (0, bridge_1.getCallBridge)();
      var getContext = async () => {
        var _a;
        const context = await callBridge("getContext");
        const locale = context === null || context === void 0 ? void 0 : context.locale;
        if (locale) {
          context.locale = (_a = (0, i18n_1.ensureLocale)(locale)) !== null && _a !== void 0 ? _a : locale;
        }
        return context;
      };
      exports.getContext = getContext;
    }
  });

  // node_modules/@forge/bridge/out/view/changeWindowTitle.js
  var require_changeWindowTitle = __commonJS({
    "node_modules/@forge/bridge/out/view/changeWindowTitle.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.changeWindowTitle = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var changeWindowTitle = async (title) => {
        try {
          await callBridge("changeWindowTitle", title);
        } catch (e) {
          throw new errors_1.BridgeAPIError("the window title wasn't changed due to error.");
        }
      };
      exports.changeWindowTitle = changeWindowTitle;
    }
  });

  // node_modules/@forge/bridge/out/view/theme.js
  var require_theme = __commonJS({
    "node_modules/@forge/bridge/out/view/theme.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.theme = void 0;
      var bridge_1 = require_bridge();
      var callBridge = (0, bridge_1.getCallBridge)();
      exports.theme = {
        enable: () => callBridge("enableTheming")
      };
    }
  });

  // node_modules/@forge/bridge/out/view/view.js
  var require_view = __commonJS({
    "node_modules/@forge/bridge/out/view/view.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.view = void 0;
      var submit_1 = require_submit();
      var close_1 = require_close();
      var refresh_1 = require_refresh();
      var createHistory_1 = require_createHistory();
      var getContext_1 = require_getContext();
      var changeWindowTitle_1 = require_changeWindowTitle();
      var theme_1 = require_theme();
      exports.view = {
        submit: submit_1.submit,
        close: close_1.close,
        refresh: refresh_1.refresh,
        createHistory: createHistory_1.createHistory,
        getContext: getContext_1.getContext,
        theme: theme_1.theme,
        changeWindowTitle: changeWindowTitle_1.changeWindowTitle
      };
    }
  });

  // node_modules/@forge/bridge/out/view/index.js
  var require_view2 = __commonJS({
    "node_modules/@forge/bridge/out/view/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_view(), exports);
    }
  });

  // node_modules/@forge/bridge/out/router/router.js
  var require_router = __commonJS({
    "node_modules/@forge/bridge/out/router/router.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.router = void 0;
      var bridge_1 = require_bridge();
      var callBridge = (0, bridge_1.getCallBridge)();
      var navigate = async (location) => {
        if (typeof location === "string") {
          return callBridge("navigate", { url: location, type: "same-tab" });
        } else {
          if (!(location === null || location === void 0 ? void 0 : location.target)) {
            throw new Error("target is required for navigation");
          }
          return callBridge("navigate", { ...location, type: "same-tab" });
        }
      };
      var open = async (location) => {
        if (typeof location === "string") {
          return callBridge("navigate", { url: location, type: "new-tab" });
        } else {
          if (!(location === null || location === void 0 ? void 0 : location.target)) {
            throw new Error("target is required for navigation");
          }
          return callBridge("navigate", { ...location, type: "new-tab" });
        }
      };
      var reload = async () => callBridge("reload");
      exports.router = {
        navigate,
        open,
        reload
      };
    }
  });

  // node_modules/@forge/bridge/out/router/index.js
  var require_router2 = __commonJS({
    "node_modules/@forge/bridge/out/router/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_router(), exports);
    }
  });

  // node_modules/@forge/bridge/out/modal/modal.js
  var require_modal = __commonJS({
    "node_modules/@forge/bridge/out/modal/modal.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Modal = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var noop = () => {
      };
      var Modal = class {
        constructor(opts) {
          var _a, _b;
          this.resource = (opts === null || opts === void 0 ? void 0 : opts.resource) || null;
          this.onClose = (opts === null || opts === void 0 ? void 0 : opts.onClose) || noop;
          this.size = (opts === null || opts === void 0 ? void 0 : opts.size) || "medium";
          this.context = (opts === null || opts === void 0 ? void 0 : opts.context) || {};
          this.closeOnEscape = (_a = opts === null || opts === void 0 ? void 0 : opts.closeOnEscape) !== null && _a !== void 0 ? _a : true;
          this.closeOnOverlayClick = (_b = opts === null || opts === void 0 ? void 0 : opts.closeOnOverlayClick) !== null && _b !== void 0 ? _b : true;
        }
        async open() {
          try {
            const success = await callBridge("openModal", {
              resource: this.resource,
              onClose: this.onClose,
              size: this.size,
              context: this.context,
              closeOnEscape: this.closeOnEscape,
              closeOnOverlayClick: this.closeOnOverlayClick
            });
            if (success === false) {
              throw new errors_1.BridgeAPIError("Unable to open modal.");
            }
          } catch (err) {
            throw new errors_1.BridgeAPIError("Unable to open modal.");
          }
        }
      };
      exports.Modal = Modal;
    }
  });

  // node_modules/@forge/bridge/out/modal/index.js
  var require_modal2 = __commonJS({
    "node_modules/@forge/bridge/out/modal/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_modal(), exports);
    }
  });

  // node_modules/@forge/bridge/out/utils/blobParser.js
  var require_blobParser = __commonJS({
    "node_modules/@forge/bridge/out/utils/blobParser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.blobToBase64 = exports.base64ToBlob = void 0;
      var base64ToBlob = (b64string, mimeType) => {
        if (!b64string) {
          return null;
        }
        const base64Data = b64string.includes(";base64") ? b64string.split(",")[1] : b64string;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
      };
      exports.base64ToBlob = base64ToBlob;
      var blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
      exports.blobToBase64 = blobToBase64;
    }
  });

  // node_modules/@forge/bridge/out/fetch/fetch.js
  var require_fetch = __commonJS({
    "node_modules/@forge/bridge/out/fetch/fetch.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.productFetchApi = void 0;
      var blobParser_1 = require_blobParser();
      var parseFormData = async (form) => {
        const parsed = {};
        for (const [key, value] of form.entries()) {
          if (key === "file") {
            const fileName = value.name;
            const fileType = value.type;
            parsed["file"] = await (0, blobParser_1.blobToBase64)(value);
            parsed["__fileName"] = fileName;
            parsed["__fileType"] = fileType;
          } else {
            parsed[key] = value;
          }
        }
        return JSON.stringify(parsed);
      };
      var parseRequest = async (init2) => {
        const isFormData = (init2 === null || init2 === void 0 ? void 0 : init2.body) instanceof FormData ? true : false;
        const requestBody = isFormData ? await parseFormData(init2 === null || init2 === void 0 ? void 0 : init2.body) : init2 === null || init2 === void 0 ? void 0 : init2.body;
        const req = new Request("", { body: requestBody, method: init2 === null || init2 === void 0 ? void 0 : init2.method, headers: init2 === null || init2 === void 0 ? void 0 : init2.headers });
        const headers = Object.fromEntries(req.headers.entries());
        const body = req.method !== "GET" ? await req.text() : null;
        return {
          body,
          headers: new Headers(headers),
          isMultipartFormData: isFormData
        };
      };
      var productFetchApi = (callBridge) => {
        const fetch2 = async (product, restPath, init2) => {
          const { body: requestBody, headers: requestHeaders, isMultipartFormData } = await parseRequest(init2);
          if (!requestHeaders.has("X-Atlassian-Token")) {
            requestHeaders.set("X-Atlassian-Token", "no-check");
          }
          const fetchPayload = {
            product,
            restPath,
            fetchRequestInit: {
              ...init2,
              body: requestBody,
              headers: [...requestHeaders.entries()]
            },
            isMultipartFormData
          };
          const { body, headers, statusText, status, isAttachment } = await callBridge("fetchProduct", fetchPayload);
          const responseBody = isAttachment ? (0, blobParser_1.base64ToBlob)(body, headers["content-type"]) : body;
          return new Response(responseBody || null, { headers, status, statusText });
        };
        return {
          requestConfluence: (restPath, fetchOptions) => fetch2("confluence", restPath, fetchOptions),
          requestJira: (restPath, fetchOptions) => fetch2("jira", restPath, fetchOptions),
          requestBitbucket: (restPath, fetchOptions) => fetch2("bitbucket", restPath, fetchOptions)
        };
      };
      exports.productFetchApi = productFetchApi;
    }
  });

  // node_modules/@forge/bridge/out/fetch/index.js
  var require_fetch2 = __commonJS({
    "node_modules/@forge/bridge/out/fetch/index.js"(exports) {
      "use strict";
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.requestBitbucket = exports.requestJira = exports.requestConfluence = void 0;
      var bridge_1 = require_bridge();
      var fetch_1 = require_fetch();
      _a = (0, fetch_1.productFetchApi)((0, bridge_1.getCallBridge)()), exports.requestConfluence = _a.requestConfluence, exports.requestJira = _a.requestJira, exports.requestBitbucket = _a.requestBitbucket;
    }
  });

  // node_modules/@forge/bridge/out/flag/flag.js
  var require_flag = __commonJS({
    "node_modules/@forge/bridge/out/flag/flag.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.showFlag = void 0;
      var bridge_1 = require_bridge();
      var errors_1 = require_errors();
      var callBridge = (0, bridge_1.getCallBridge)();
      var showFlag = (options) => {
        var _a;
        if (!options.id) {
          throw new errors_1.BridgeAPIError('"id" must be defined in flag options');
        }
        const result = callBridge("showFlag", {
          ...options,
          type: (_a = options.type) !== null && _a !== void 0 ? _a : "info"
        });
        return {
          close: async () => {
            await result;
            return callBridge("closeFlag", { id: options.id });
          }
        };
      };
      exports.showFlag = showFlag;
    }
  });

  // node_modules/@forge/bridge/out/flag/index.js
  var require_flag2 = __commonJS({
    "node_modules/@forge/bridge/out/flag/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.showFlag = void 0;
      var flag_1 = require_flag();
      Object.defineProperty(exports, "showFlag", { enumerable: true, get: function() {
        return flag_1.showFlag;
      } });
    }
  });

  // node_modules/@forge/bridge/out/events/events.js
  var require_events = __commonJS({
    "node_modules/@forge/bridge/out/events/events.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.events = void 0;
      var bridge_1 = require_bridge();
      var callBridge = (0, bridge_1.getCallBridge)();
      var emit = (event, payload) => {
        return callBridge("emit", { event, payload });
      };
      var on = (event, callback) => {
        return callBridge("on", { event, callback });
      };
      exports.events = {
        emit,
        on
      };
    }
  });

  // node_modules/@forge/bridge/out/events/index.js
  var require_events2 = __commonJS({
    "node_modules/@forge/bridge/out/events/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      tslib_1.__exportStar(require_events(), exports);
    }
  });

  // node_modules/@forge/bridge/out/i18n/index.js
  var require_i18n = __commonJS({
    "node_modules/@forge/bridge/out/i18n/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createTranslationFunction = exports.getTranslations = exports.resetTranslationsCache = void 0;
      var i18n_1 = require_out();
      var view_1 = require_view2();
      var frontendResourcesAccessor = {
        getI18nInfoConfig: async () => {
          const resp = await fetch(`./${i18n_1.I18N_BUNDLE_FOLDER_NAME}/${i18n_1.I18N_INFO_FILE_NAME}`);
          if (!resp.ok) {
            throw new Error("Failed to get i18n info config: " + resp.statusText);
          }
          const info = await resp.json();
          return info.config;
        },
        getTranslationResource: async (locale) => {
          const resp = await fetch(`./${i18n_1.I18N_BUNDLE_FOLDER_NAME}/${locale}.json`);
          if (!resp.ok) {
            throw new Error(`Failed to get translation resource for locale: ${locale}`);
          }
          return resp.json();
        }
      };
      var translationsGetter = new i18n_1.TranslationsGetter(frontendResourcesAccessor);
      var resetTranslationsCache = () => {
        translationsGetter.reset();
      };
      exports.resetTranslationsCache = resetTranslationsCache;
      var getTranslations = async (locale = null, options = {
        fallback: true
      }) => {
        let targetLocale = locale;
        if (!targetLocale) {
          const context = await view_1.view.getContext();
          targetLocale = context.locale;
        }
        return await translationsGetter.getTranslations(targetLocale, options);
      };
      exports.getTranslations = getTranslations;
      var createTranslationFunction = async (locale = null) => {
        let targetLocale = locale;
        if (!targetLocale) {
          const context = await view_1.view.getContext();
          targetLocale = context.locale;
        }
        const translator = new i18n_1.Translator(targetLocale, translationsGetter);
        await translator.init();
        return (i18nKey, defaultValue) => {
          var _a, _b;
          return (_b = (_a = translator.translate(i18nKey)) !== null && _a !== void 0 ? _a : defaultValue) !== null && _b !== void 0 ? _b : i18nKey;
        };
      };
      exports.createTranslationFunction = createTranslationFunction;
    }
  });

  // node_modules/@forge/bridge/out/index.js
  var require_out2 = __commonJS({
    "node_modules/@forge/bridge/out/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.i18n = exports.NavigationTarget = void 0;
      var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
      var targets_1 = require_targets();
      Object.defineProperty(exports, "NavigationTarget", { enumerable: true, get: function() {
        return targets_1.NavigationTarget;
      } });
      tslib_1.__exportStar(require_invoke2(), exports);
      tslib_1.__exportStar(require_invoke_remote2(), exports);
      tslib_1.__exportStar(require_view2(), exports);
      tslib_1.__exportStar(require_router2(), exports);
      tslib_1.__exportStar(require_modal2(), exports);
      tslib_1.__exportStar(require_fetch2(), exports);
      tslib_1.__exportStar(require_flag2(), exports);
      tslib_1.__exportStar(require_events2(), exports);
      exports.i18n = tslib_1.__importStar(require_i18n());
    }
  });

  // src/enhanced-matrix-custom/main.js
  var import_bridge = __toESM(require_out2());
  var MODES = {
    COMPONENTS: "components",
    STORY_TO_STORY: "story-to-story",
    HIERARCHICAL: "hierarchical"
  };
  var LEGEND = {
    [MODES.COMPONENTS]: [
      { label: "Issue linked to component", swatchClass: "legend-component" }
    ],
    [MODES.STORY_TO_STORY]: [
      { label: "Blocks (row -> column)", swatchClass: "legend-blocks-full" },
      { label: "Is blocked by (column -> row)", swatchClass: "legend-blocks-diagonal" },
      { label: "Duplicates / Is duplicated by", swatchClass: "legend-duplicates-full" },
      { label: "Clones / Is cloned by", swatchClass: "legend-clones-full" },
      { label: "Relates to", swatchClass: "legend-relates-full" }
    ],
    [MODES.HIERARCHICAL]: [
      { label: "Parent-child hierarchy", swatchClass: "legend-relates-full" },
      { label: "Issue links (optional)", swatchClass: "legend-blocks-diagonal" }
    ]
  };
  var ZOOM_MIN = 0.2;
  var ZOOM_MAX = 20;
  var ROOT_GAP = 96;
  var ROOT_ROW_GAP = 132;
  var CARD_WIDTH = 300;
  var CARD_HEIGHT = 158;
  var CARD_GAP_X = 44;
  var CARD_GAP_Y = 104;
  var CANVAS_MARGIN = 48;
  var PAN_PADDING = 80;
  var INITIAL_READABLE_ZOOM = 0.55;
  var DRAG_GHOST_OFFSET_X = 18;
  var DRAG_GHOST_OFFSET_Y = 14;
  var DRAG_AUTOPAN_EDGE = 84;
  var DRAG_AUTOPAN_MAX_STEP = 24;
  var ISSUE_TYPE_PALETTE = [
    { bg: "#23334a", border: "#6ea8ff", text: "#d5e7ff" },
    { bg: "#2a2f1d", border: "#d6b656", text: "#f6e7bd" },
    { bg: "#2d1f35", border: "#b58ce6", text: "#eadbff" },
    { bg: "#1f3230", border: "#54b89b", text: "#c6f0e4" },
    { bg: "#3a261d", border: "#d18a5f", text: "#ffd9c1" },
    { bg: "#2e2d3b", border: "#9c9ec8", text: "#e0e1ff" }
  ];
  var state = {
    context: null,
    siteUrl: "",
    projectKey: "",
    mode: MODES.COMPONENTS,
    issueTypes: [],
    epics: [],
    fixedVersions: [],
    labels: [],
    components: [],
    selectedIssueTypes: [],
    selectedEpicKeys: [],
    selectedFixedVersions: [],
    selectedLabels: [],
    selectedComponents: [],
    jql: "",
    relatedOnly: false,
    showRelations: false,
    data: null,
    loading: false,
    error: "",
    info: "",
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartPanX: 0,
    dragStartPanY: 0,
    chartDraggedIssueKey: "",
    chartDragPointerId: null,
    chartDragStartX: 0,
    chartDragStartY: 0,
    chartDragMoved: false,
    chartPointerX: 0,
    chartPointerY: 0,
    chartDropTargetKey: "",
    chartAutoPanRaf: 0,
    suppressCardClickUntil: 0,
    layout: null,
    cellLookup: /* @__PURE__ */ new Map()
  };
  var successMessageTimer = null;
  var elements = {
    projectLabel: document.getElementById("project-label"),
    modeComponentsButton: document.getElementById("mode-components-btn"),
    modeStoryButton: document.getElementById("mode-story-btn"),
    modeHierarchyButton: document.getElementById("mode-hierarchy-btn"),
    filtersPanel: document.getElementById("filters-panel"),
    filtersSummaryText: document.getElementById("filters-summary-text"),
    issueTypeSelect: document.getElementById("issue-type-select"),
    epicSelect: document.getElementById("epic-select"),
    fixedVersionSelect: document.getElementById("fixed-version-select"),
    labelSelect: document.getElementById("label-select"),
    componentSelect: document.getElementById("component-select"),
    jqlInput: document.getElementById("jql-input"),
    relatedOnlyWrap: document.getElementById("related-only-wrap"),
    relatedOnlyCheckbox: document.getElementById("related-only-checkbox"),
    resetFiltersButton: document.getElementById("reset-filters-btn"),
    refreshButton: document.getElementById("refresh-btn"),
    legend: document.getElementById("legend"),
    stats: document.getElementById("stats"),
    status: document.getElementById("status"),
    matrixWrap: document.getElementById("matrix-wrap"),
    matrixScroll: document.getElementById("matrix-scroll"),
    matrixTable: document.getElementById("matrix-table"),
    emptyState: document.getElementById("empty-state"),
    hierarchyPanel: document.getElementById("hierarchy-panel"),
    hierarchyViewport: document.getElementById("hierarchy-viewport"),
    hierarchyStage: document.getElementById("hierarchy-stage"),
    hierarchyEdges: document.getElementById("hierarchy-edges"),
    hierarchyEmptyState: document.getElementById("hierarchy-empty-state"),
    zoomOutButton: document.getElementById("zoom-out-btn"),
    zoomInButton: document.getElementById("zoom-in-btn"),
    resetViewButton: document.getElementById("reset-view-btn"),
    fitViewButton: document.getElementById("fit-view-btn"),
    fullscreenButton: document.getElementById("fullscreen-btn"),
    showRelationsCheckbox: document.getElementById("show-relations-checkbox"),
    zoomLabel: document.getElementById("zoom-label"),
    coverageWidget: document.getElementById("coverage-widget"),
    coverageBar: document.getElementById("coverage-bar"),
    coverageBarFill: document.getElementById("coverage-bar-fill"),
    coveragePercent: document.getElementById("coverage-percent"),
    coverageDetails: document.getElementById("coverage-details"),
    coverageBreakdown: document.getElementById("coverage-breakdown"),
    lonelySection: document.getElementById("lonely-section"),
    lonelyRows: document.getElementById("lonely-rows"),
    dragGhost: document.getElementById("chart-drag-ghost"),
    modal: document.getElementById("cell-modal"),
    modalTitle: document.getElementById("modal-title"),
    modalBody: document.getElementById("modal-body"),
    modalCloseButton: document.getElementById("modal-close-btn")
  };
  function escapeHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escapeJqlValue(value) {
    return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }
  function truncate(value, maxLength) {
    const text = String(value || "");
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
  }
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function hashString(value) {
    const text = String(value || "");
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) {
      hash = (hash << 5) - hash + text.charCodeAt(index);
      hash |= 0;
    }
    return Math.abs(hash);
  }
  function getIssueTypeColors(issueType) {
    const paletteIndex = hashString(issueType || "issue") % ISSUE_TYPE_PALETTE.length;
    return ISSUE_TYPE_PALETTE[paletteIndex];
  }
  function sortByLabel(a, b) {
    return String(a).localeCompare(String(b), void 0, { numeric: true, sensitivity: "base" });
  }
  function dedupeStringsByNormalized(values) {
    const seen = /* @__PURE__ */ new Set();
    const result = [];
    for (const value of values || []) {
      const text = String(value || "").trim();
      if (!text) {
        continue;
      }
      const normalized = text.toLowerCase();
      if (seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      result.push(text);
    }
    return result;
  }
  function selectedValues(select) {
    return Array.from(select.selectedOptions || []).map((option) => option.value);
  }
  function enableToggleMultiSelect(select) {
    if (!select) {
      return;
    }
    select.addEventListener("mousedown", (event) => {
      const option = event.target;
      if (!option || option.tagName !== "OPTION") {
        return;
      }
      event.preventDefault();
      option.selected = !option.selected;
      select.focus();
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }
  function renderSelectOptions(select, options, selected) {
    const selectedSet = new Set(selected || []);
    select.innerHTML = options.map((option) => {
      const isSelected = selectedSet.has(option.value) ? " selected" : "";
      return `<option value="${escapeHtml(option.value)}"${isSelected}>${escapeHtml(option.label)}</option>`;
    }).join("");
  }
  function normalizeMode(mode) {
    if (mode === MODES.STORY_TO_STORY) {
      return MODES.STORY_TO_STORY;
    }
    if (mode === MODES.HIERARCHICAL) {
      return MODES.HIERARCHICAL;
    }
    return MODES.COMPONENTS;
  }
  function isModeSupported(mode) {
    return mode === MODES.COMPONENTS || mode === MODES.STORY_TO_STORY || mode === MODES.HIERARCHICAL;
  }
  function setStatus(type, message) {
    if (!message) {
      elements.status.className = "status hidden";
      elements.status.textContent = "";
      return;
    }
    elements.status.className = `status ${type}`;
    elements.status.textContent = message;
  }
  function showSuccessMessage(message, timeoutMs = 2e3) {
    if (successMessageTimer) {
      clearTimeout(successMessageTimer);
      successMessageTimer = null;
    }
    setStatus("success", message);
    successMessageTimer = window.setTimeout(() => {
      setStatus("", "");
      successMessageTimer = null;
    }, timeoutMs);
  }
  function renderLegend() {
    const items = LEGEND[state.mode] || [];
    elements.legend.innerHTML = items.map((item) => {
      return `
        <div class="legend-item">
          <span class="legend-swatch ${escapeHtml(item.swatchClass || "")}"></span>
          <span>${escapeHtml(item.label)}</span>
        </div>
      `;
    }).join("");
  }
  function summarizeFilters() {
    const parts = [];
    if (state.selectedIssueTypes.length > 0) {
      parts.push(`${state.selectedIssueTypes.length} issue types`);
    }
    if (state.selectedEpicKeys.length > 0) {
      parts.push(`${state.selectedEpicKeys.length} epics`);
    }
    if (state.selectedFixedVersions.length > 0) {
      parts.push(`${state.selectedFixedVersions.length} versions`);
    }
    if (state.selectedLabels.length > 0) {
      parts.push(`${state.selectedLabels.length} labels`);
    }
    if (state.selectedComponents.length > 0) {
      parts.push(`${state.selectedComponents.length} components`);
    }
    if (String(state.jql || "").trim()) {
      parts.push("JQL");
    }
    if (state.mode === MODES.STORY_TO_STORY && state.relatedOnly) {
      parts.push("Related only");
    }
    return parts.length > 0 ? parts.join(" \u2022 ") : "No filters";
  }
  function syncControlsToState() {
    state.selectedIssueTypes = dedupeStringsByNormalized(selectedValues(elements.issueTypeSelect));
    state.selectedEpicKeys = selectedValues(elements.epicSelect);
    state.selectedFixedVersions = selectedValues(elements.fixedVersionSelect);
    state.selectedLabels = selectedValues(elements.labelSelect);
    state.selectedComponents = selectedValues(elements.componentSelect);
    state.jql = elements.jqlInput.value || "";
    state.relatedOnly = Boolean(elements.relatedOnlyCheckbox.checked);
    state.showRelations = Boolean(elements.showRelationsCheckbox?.checked);
    elements.filtersSummaryText.textContent = summarizeFilters();
  }
  function syncStateToControls() {
    const issueTypeNames = dedupeStringsByNormalized(
      (state.issueTypes || []).map((type) => type.name)
    ).sort(sortByLabel);
    renderSelectOptions(
      elements.issueTypeSelect,
      issueTypeNames.map((name) => ({ value: name, label: name })),
      dedupeStringsByNormalized(state.selectedIssueTypes)
    );
    renderSelectOptions(
      elements.epicSelect,
      (state.epics || []).map((epic) => ({
        value: epic.key,
        label: epic.summary ? `${epic.key} - ${epic.summary}` : epic.key
      })),
      state.selectedEpicKeys
    );
    renderSelectOptions(
      elements.fixedVersionSelect,
      (state.fixedVersions || []).map((version) => ({
        value: version.name,
        label: version.name
      })),
      state.selectedFixedVersions
    );
    renderSelectOptions(
      elements.labelSelect,
      (state.labels || []).map((label) => ({ value: label, label })),
      state.selectedLabels
    );
    renderSelectOptions(
      elements.componentSelect,
      (state.components || []).map((component) => ({ value: component, label: component })),
      state.selectedComponents
    );
    elements.jqlInput.value = state.jql;
    elements.relatedOnlyCheckbox.checked = Boolean(state.relatedOnly);
    elements.showRelationsCheckbox.checked = Boolean(state.showRelations);
    elements.filtersSummaryText.textContent = summarizeFilters();
    renderModeButtons();
    renderLegend();
  }
  function renderModeButtons() {
    const isComponents = state.mode === MODES.COMPONENTS;
    const isStory = state.mode === MODES.STORY_TO_STORY;
    const isHierarchy = state.mode === MODES.HIERARCHICAL;
    elements.modeComponentsButton.classList.toggle("active-mode", isComponents);
    elements.modeStoryButton.classList.toggle("active-mode", isStory);
    elements.modeHierarchyButton.classList.toggle("active-mode", isHierarchy);
    elements.relatedOnlyWrap.style.display = isStory ? "inline-flex" : "none";
  }
  function resetFilters() {
    state.selectedIssueTypes = [];
    state.selectedEpicKeys = [];
    state.selectedFixedVersions = [];
    state.selectedLabels = [];
    state.selectedComponents = [];
    state.jql = "";
    state.relatedOnly = false;
    syncStateToControls();
  }
  function getIssueLabel(issueKey, summaryMaxLength) {
    const issue = state.data?.issueIndex?.[issueKey];
    if (!issue) {
      return issueKey;
    }
    const shortSummary = truncate(issue.summary || "", summaryMaxLength);
    return shortSummary ? `${issue.key} | ${shortSummary}` : issue.key;
  }
  function getVisibleMatrix() {
    const rows = Array.isArray(state.data?.rows) ? state.data.rows : [];
    const columns = Array.isArray(state.data?.columns) ? state.data.columns : [];
    const cells = state.data?.cells || {};
    if (state.mode !== MODES.STORY_TO_STORY || !state.relatedOnly) {
      return { rows, columns, cells };
    }
    const relatedKeys = /* @__PURE__ */ new Set();
    for (const [rowKey, rowCells] of Object.entries(cells || {})) {
      const colKeys = Object.keys(rowCells || {});
      if (colKeys.length > 0) {
        relatedKeys.add(rowKey);
      }
      for (const colKey of colKeys) {
        relatedKeys.add(colKey);
      }
    }
    return {
      rows: rows.filter((row) => relatedKeys.has(row.key)),
      columns: columns.filter((column) => relatedKeys.has(column.key)),
      cells
    };
  }
  function buildCellTooltip(row, column, cell) {
    if (!cell) {
      return "";
    }
    if (state.mode === MODES.COMPONENTS) {
      const rowIssue2 = state.data?.issueIndex?.[row.key] || { key: row.key, summary: "" };
      const summary = rowIssue2.summary ? ` | ${rowIssue2.summary}` : "";
      return `${rowIssue2.key}${summary} <-> ${column.label}`;
    }
    const rowIssue = state.data?.issueIndex?.[row.key] || { key: row.key };
    const columnIssue = state.data?.issueIndex?.[column.key] || { key: column.key };
    const rowStatus = rowIssue.status || "Unknown status";
    const columnStatus = columnIssue.status || "Unknown status";
    const header = `${rowIssue.key} (${rowStatus}) <-> ${columnIssue.key} (${columnStatus})`;
    const relations = Array.isArray(cell.relations) ? cell.relations : [];
    if (relations.length === 0) {
      return header;
    }
    const relationsText = relations.map((relation, index) => {
      const direction = relation.direction || "related to";
      const typeName = relation.typeName ? ` [${relation.typeName}]` : "";
      return `${index + 1}. ${direction}${typeName}`;
    }).join(" | ");
    return `${header} | ${relationsText}`;
  }
  function renderStats() {
    if (!state.data) {
      elements.stats.textContent = "";
      renderCoverageWidget();
      return;
    }
    const loaded = Number.isFinite(state.data.issueCount) ? state.data.issueCount : 0;
    const total = Number.isFinite(state.data.totalIssues) ? state.data.totalIssues : loaded;
    const truncatedText = state.data.truncated ? " \u2022 truncated to 2,000" : "";
    elements.stats.textContent = `${loaded}/${total} issues \u2022 ${state.data.jql || ""}${truncatedText}`;
    renderCoverageWidget();
  }
  function computeCoverage() {
    const issueIndex = state.data?.issueIndex || {};
    const nodeMeta = state.data?.hierarchy?.nodeMeta || {};
    const nonEpicKeys = Object.keys(issueIndex).filter(
      (key) => !isEpicIssueType(issueIndex[key]?.issueType)
    );
    const total = nonEpicKeys.length;
    if (total === 0) {
      return { total: 0, assigned: 0, unassigned: 0, percent: 0 };
    }
    let assigned = 0;
    for (const key of nonEpicKeys) {
      if (nodeMeta[key]?.parentKey) {
        assigned += 1;
      }
    }
    const unassigned = total - assigned;
    const percent = Math.round(assigned / total * 100);
    return { total, assigned, unassigned, percent };
  }
  function renderCoverageWidget() {
    if (!elements.coverageWidget) {
      return;
    }
    if (state.mode !== MODES.HIERARCHICAL || !state.data) {
      elements.coverageWidget.classList.add("hidden");
      return;
    }
    const coverage = computeCoverage();
    const percent = clamp(coverage.percent, 0, 100);
    elements.coverageWidget.classList.remove("hidden");
    if (elements.coverageBarFill) {
      elements.coverageBarFill.style.width = `${percent}%`;
    }
    if (elements.coverageBar) {
      elements.coverageBar.setAttribute("aria-valuemin", "0");
      elements.coverageBar.setAttribute("aria-valuemax", "100");
      elements.coverageBar.setAttribute("aria-valuenow", String(percent));
      elements.coverageBar.setAttribute(
        "aria-label",
        `Parent coverage ${percent} percent (${coverage.assigned} assigned, ${coverage.unassigned} unassigned)`
      );
    }
    if (elements.coveragePercent) {
      elements.coveragePercent.textContent = `${percent}%`;
    }
    if (elements.coverageDetails) {
      elements.coverageDetails.textContent = `Assigned ${coverage.assigned} of ${coverage.total} non-epic issues`;
    }
    if (elements.coverageBreakdown) {
      elements.coverageBreakdown.textContent = `${coverage.assigned} assigned \u2022 ${coverage.unassigned} unassigned`;
    }
  }
  function renderComponentColumnHeader(column) {
    const label = column.label || column.key;
    const text = truncate(label, 40);
    const jql = `project = "${escapeJqlValue(state.projectKey)}" AND "Affected Components" in ("${escapeJqlValue(label)}")`;
    const href = state.siteUrl ? `${state.siteUrl}/issues/?jql=${encodeURIComponent(jql)}` : "";
    if (!href) {
      return `<span class="col-link" title="${escapeHtml(label)}">${escapeHtml(text)}</span>`;
    }
    return `<a class="col-link" href="${escapeHtml(href)}" target="_blank" rel="noopener" title="${escapeHtml(label)}">${escapeHtml(text)}</a>`;
  }
  function renderIssueLink(issueKey, summaryLength) {
    const label = getIssueLabel(issueKey, summaryLength);
    const href = buildIssueHref(issueKey);
    if (!href) {
      return `<span class="row-link" title="${escapeHtml(label)}">${escapeHtml(label)}</span>`;
    }
    return `<a class="row-link" href="${escapeHtml(href)}" target="_blank" rel="noopener" title="${escapeHtml(label)}">${escapeHtml(label)}</a>`;
  }
  function buildIssueHref(issueKey) {
    if (!state.siteUrl || !issueKey) {
      return "";
    }
    return `${state.siteUrl}/browse/${issueKey}`;
  }
  function getStoryRenderItems(cell) {
    const renderItems = Array.isArray(cell?.renderItems) ? cell.renderItems.filter((item) => item).map((item) => ({
      type: item.type || "relation",
      fillStyle: item.fillStyle === "diagonal" ? "diagonal" : "full"
    })) : [];
    if (renderItems.length > 0) {
      const nonRelates2 = renderItems.filter((item) => item.type !== "relates");
      return nonRelates2.length > 0 ? nonRelates2 : renderItems;
    }
    if (!cell) {
      return [];
    }
    const fallback = [
      {
        type: cell.relationType || "relation",
        fillStyle: cell.fillStyle === "diagonal" ? "diagonal" : "full"
      }
    ];
    const nonRelates = fallback.filter((item) => item.type !== "relates");
    return nonRelates.length > 0 ? nonRelates : fallback;
  }
  function normalizeStoryTypeClass(type) {
    switch (String(type || "").toLowerCase()) {
      case "blocks":
        return "type-blocks";
      case "duplicates":
        return "type-duplicates";
      case "clones":
        return "type-clones";
      case "relates":
        return "type-relates";
      default:
        return "type-relates";
    }
  }
  function renderMatrixTable() {
    elements.matrixTable.innerHTML = "";
    state.cellLookup.clear();
    if (!state.data) {
      elements.emptyState.classList.remove("hidden");
      elements.emptyState.textContent = "No data.";
      elements.matrixScroll.classList.add("hidden");
      return;
    }
    const matrix = getVisibleMatrix();
    const rows = matrix.rows || [];
    const columns = matrix.columns || [];
    if (rows.length === 0 || columns.length === 0) {
      const emptyMessage = state.mode === MODES.STORY_TO_STORY && state.relatedOnly ? "No related story dependencies found for the selected filters." : "No rows or columns found for the selected filters.";
      elements.emptyState.classList.remove("hidden");
      elements.emptyState.textContent = emptyMessage;
      elements.matrixScroll.classList.add("hidden");
      return;
    }
    elements.emptyState.classList.add("hidden");
    elements.matrixScroll.classList.remove("hidden");
    const table = elements.matrixTable;
    const thead = table.createTHead();
    const headRow = thead.insertRow();
    const corner = document.createElement("th");
    corner.className = "corner-cell";
    corner.textContent = "Rows";
    headRow.appendChild(corner);
    for (const column of columns) {
      const th = document.createElement("th");
      th.className = "col-header";
      if (state.mode === MODES.COMPONENTS) {
        th.innerHTML = renderComponentColumnHeader(column);
      } else {
        th.innerHTML = renderIssueLink(column.key, 32);
      }
      headRow.appendChild(th);
    }
    const tbody = table.createTBody();
    const cells = matrix.cells || {};
    for (const row of rows) {
      const tr = tbody.insertRow();
      const rowHeader = document.createElement("th");
      rowHeader.className = "sticky-col";
      rowHeader.scope = "row";
      rowHeader.innerHTML = renderIssueLink(row.key, 50);
      tr.appendChild(rowHeader);
      for (const column of columns) {
        const td = tr.insertCell();
        td.className = "matrix-data-cell";
        const wrap = document.createElement("div");
        wrap.className = "cell-wrap";
        const cell = cells[row.key]?.[column.key] || null;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "cell-btn";
        button.title = buildCellTooltip(row, column, cell);
        if (cell) {
          button.classList.add("clickable");
          button.dataset.rowKey = row.key;
          button.dataset.columnKey = column.key;
          state.cellLookup.set(`${row.key}::${column.key}`, { row, column, cell });
          if (state.mode === MODES.COMPONENTS) {
            button.classList.add("component", "full");
          } else {
            button.classList.add("story");
            const renderItems = getStoryRenderItems(cell);
            if (renderItems.length <= 1) {
              const firstItem = renderItems[0] || { type: "relates", fillStyle: "full" };
              button.classList.add(normalizeStoryTypeClass(firstItem.type));
              button.classList.add(firstItem.fillStyle === "diagonal" ? "diagonal" : "full");
            } else {
              button.classList.add("story-multi");
              button.innerHTML = renderItems.map((item) => {
                const chipClass = item.fillStyle === "diagonal" ? "diagonal" : "full";
                return `<span class="cell-chip ${normalizeStoryTypeClass(item.type)} ${chipClass}" aria-hidden="true"></span>`;
              }).join("");
            }
          }
        }
        wrap.appendChild(button);
        td.appendChild(wrap);
      }
    }
  }
  function computeHierarchyLayout(hierarchy) {
    const nodeMeta = hierarchy?.nodeMeta || {};
    const fallbackKeys = (hierarchy?.levels || []).flatMap((level) => level.issueKeys || []);
    const allNodeKeys = (Object.keys(nodeMeta).length > 0 ? Object.keys(nodeMeta) : fallbackKeys).filter(Boolean).sort(sortByLabel);
    if (allNodeKeys.length === 0) {
      return null;
    }
    const nodeSet = new Set(allNodeKeys);
    const childMap = {};
    const parentMap = {};
    for (const key of allNodeKeys) {
      const children = Array.isArray(nodeMeta[key]?.childKeys) ? nodeMeta[key].childKeys : [];
      childMap[key] = children.filter((childKey) => nodeSet.has(childKey)).sort(sortByLabel);
      const parentKey = nodeMeta[key]?.parentKey;
      parentMap[key] = parentKey && nodeSet.has(parentKey) ? parentKey : null;
    }
    const rootKeys = allNodeKeys.filter((key) => !parentMap[key]).sort(sortByLabel);
    const effectiveRoots = rootKeys.length > 0 ? rootKeys : allNodeKeys;
    const levelHeight = CARD_HEIGHT + CARD_GAP_Y;
    const widthCache = /* @__PURE__ */ new Map();
    const widthStack = /* @__PURE__ */ new Set();
    const subtreeWidth = (key) => {
      if (widthCache.has(key)) {
        return widthCache.get(key);
      }
      if (widthStack.has(key)) {
        return CARD_WIDTH;
      }
      widthStack.add(key);
      const children = childMap[key] || [];
      let width = CARD_WIDTH;
      if (children.length > 0) {
        let childWidth = 0;
        for (let index = 0; index < children.length; index += 1) {
          if (index > 0) {
            childWidth += CARD_GAP_X;
          }
          childWidth += subtreeWidth(children[index]);
        }
        width = Math.max(CARD_WIDTH, childWidth);
      }
      widthStack.delete(key);
      widthCache.set(key, width);
      return width;
    };
    const depthCache = /* @__PURE__ */ new Map();
    const depthStack = /* @__PURE__ */ new Set();
    const subtreeDepth = (key) => {
      if (depthCache.has(key)) {
        return depthCache.get(key);
      }
      if (depthStack.has(key)) {
        return 1;
      }
      depthStack.add(key);
      const children = childMap[key] || [];
      let depth = 1;
      for (const childKey of children) {
        depth = Math.max(depth, 1 + subtreeDepth(childKey));
      }
      depthStack.delete(key);
      depthCache.set(key, depth);
      return depth;
    };
    const positions = {};
    const assigned = /* @__PURE__ */ new Set();
    const subtreeNodeCache = /* @__PURE__ */ new Map();
    const subtreeNodeStack = /* @__PURE__ */ new Set();
    const assignTree = (key, startX, depth, baseY, recursionStack = /* @__PURE__ */ new Set()) => {
      if (assigned.has(key)) {
        return;
      }
      if (recursionStack.has(key)) {
        positions[key] = { x: startX, y: baseY + depth * levelHeight };
        assigned.add(key);
        return;
      }
      const nextStack = new Set(recursionStack);
      nextStack.add(key);
      const branchWidth = subtreeWidth(key);
      const y = baseY + depth * levelHeight;
      const children = (childMap[key] || []).filter((childKey) => !assigned.has(childKey));
      if (children.length === 0) {
        positions[key] = {
          x: startX + (branchWidth - CARD_WIDTH) / 2,
          y
        };
        assigned.add(key);
        return;
      }
      let cursor = startX;
      const childCenters = [];
      for (const childKey of children) {
        const childWidth = subtreeWidth(childKey);
        assignTree(childKey, cursor, depth + 1, baseY, nextStack);
        if (positions[childKey]) {
          childCenters.push(positions[childKey].x + CARD_WIDTH / 2);
        }
        cursor += childWidth + CARD_GAP_X;
      }
      let nodeX = startX + (branchWidth - CARD_WIDTH) / 2;
      if (childCenters.length > 0) {
        const minCenter = Math.min(...childCenters);
        const maxCenter = Math.max(...childCenters);
        nodeX = (minCenter + maxCenter) / 2 - CARD_WIDTH / 2;
      }
      const minX = startX;
      const maxX2 = startX + branchWidth - CARD_WIDTH;
      nodeX = clamp(nodeX, minX, maxX2);
      positions[key] = { x: nodeX, y };
      assigned.add(key);
    };
    const collectSubtreeNodes = (key) => {
      if (subtreeNodeCache.has(key)) {
        return subtreeNodeCache.get(key);
      }
      if (subtreeNodeStack.has(key)) {
        return /* @__PURE__ */ new Set([key]);
      }
      subtreeNodeStack.add(key);
      const subtree = /* @__PURE__ */ new Set([key]);
      const children = childMap[key] || [];
      for (const childKey of children) {
        const childSubtree = collectSubtreeNodes(childKey);
        for (const nodeKey of childSubtree) {
          subtree.add(nodeKey);
        }
      }
      subtreeNodeStack.delete(key);
      subtreeNodeCache.set(key, subtree);
      return subtree;
    };
    const shiftSubtree = (key, deltaX) => {
      if (!deltaX) {
        return;
      }
      const subtree = collectSubtreeNodes(key);
      for (const nodeKey of subtree) {
        if (positions[nodeKey]) {
          positions[nodeKey].x += deltaX;
        }
      }
    };
    const viewportWidth = elements.hierarchyViewport?.clientWidth || 0;
    const maxRowWidth = Math.max(CARD_WIDTH * 4, Math.round((viewportWidth || 1200) * 2.4));
    let rowX = CANVAS_MARGIN;
    let rowY = CANVAS_MARGIN;
    let rowUsedWidth = 0;
    let rowMaxDepth = 0;
    const placeRoot = (key) => {
      if (assigned.has(key)) {
        return;
      }
      const branchWidth = subtreeWidth(key);
      const branchDepth = subtreeDepth(key);
      const additionalWidth = rowUsedWidth === 0 ? branchWidth : ROOT_GAP + branchWidth;
      if (rowUsedWidth > 0 && rowUsedWidth + additionalWidth > maxRowWidth) {
        const rowHeight = CARD_HEIGHT + Math.max(0, rowMaxDepth - 1) * levelHeight;
        rowY += rowHeight + ROOT_ROW_GAP;
        rowX = CANVAS_MARGIN;
        rowUsedWidth = 0;
        rowMaxDepth = 0;
      }
      assignTree(key, rowX, 0, rowY);
      rowX += branchWidth + ROOT_GAP;
      rowUsedWidth += additionalWidth;
      rowMaxDepth = Math.max(rowMaxDepth, branchDepth);
    };
    for (const rootKey of effectiveRoots) {
      placeRoot(rootKey);
    }
    for (const key of allNodeKeys) {
      placeRoot(key);
    }
    const nodesByRowY = /* @__PURE__ */ new Map();
    for (const key of allNodeKeys) {
      const position = positions[key];
      if (!position) {
        continue;
      }
      const rowKey = String(position.y);
      if (!nodesByRowY.has(rowKey)) {
        nodesByRowY.set(rowKey, []);
      }
      nodesByRowY.get(rowKey).push(key);
    }
    for (const rowNodes of nodesByRowY.values()) {
      rowNodes.sort((a, b) => {
        const delta = positions[a].x - positions[b].x;
        if (delta !== 0) {
          return delta;
        }
        return sortByLabel(a, b);
      });
      let previousRight = null;
      for (const key of rowNodes) {
        if (previousRight === null) {
          previousRight = positions[key].x + CARD_WIDTH;
          continue;
        }
        const minimumX = previousRight + CARD_GAP_X;
        if (positions[key].x < minimumX) {
          shiftSubtree(key, minimumX - positions[key].x);
        }
        previousRight = positions[key].x + CARD_WIDTH;
      }
    }
    let maxX = 0;
    let maxY = 0;
    for (const position of Object.values(positions)) {
      maxX = Math.max(maxX, position.x + CARD_WIDTH);
      maxY = Math.max(maxY, position.y + CARD_HEIGHT);
    }
    const canvasWidth = Math.max(maxX + CANVAS_MARGIN, CARD_WIDTH + CANVAS_MARGIN * 2);
    const canvasHeight = Math.max(maxY + CANVAS_MARGIN, CARD_HEIGHT + CANVAS_MARGIN * 2);
    const verticalEdges = (hierarchy?.verticalEdges || []).filter(
      (edge) => positions[edge.from] && positions[edge.to]
    );
    const horizontalEdges = (hierarchy?.horizontalEdges || []).filter(
      (edge) => positions[edge.from] && positions[edge.to]
    );
    return {
      positions,
      canvasWidth,
      canvasHeight,
      verticalEdges,
      horizontalEdges,
      nodeKeys: allNodeKeys
    };
  }
  function renderHierarchyCardsSvg(layout) {
    const issueIndex = state.data?.issueIndex || {};
    return layout.nodeKeys.map((key) => {
      const issue = issueIndex[key] || {};
      const position = layout.positions[key];
      const x = Math.round(Number(position?.x));
      const y = Math.round(Number(position?.y));
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        return "";
      }
      const href = buildIssueHref(key);
      const summary = truncate(issue.summary || "No summary", 36);
      const status = issue.status || "No status";
      const priority = issue.priority || "No priority";
      const fixedVersionsRaw = Array.isArray(issue.fixedVersions) ? issue.fixedVersions.join(", ") : "";
      const fixedVersions = truncate(fixedVersionsRaw || "None", 34);
      const issueType = issue.issueType || "Issue";
      const issueTypeColors = getIssueTypeColors(issueType);
      const badgeWidth = clamp(Math.round(key.length * 8 + 22), 64, CARD_WIDTH - 24);
      const availableTypeWidth = clamp(CARD_WIDTH - 20 - badgeWidth - 10, 54, CARD_WIDTH - 24);
      const issueTypeMaxChars = Math.max(6, Math.floor((availableTypeWidth - 18) / 7));
      const issueTypeLabel = truncate(issueType, issueTypeMaxChars);
      const issueTypeBadgeWidth = clamp(Math.round(issueTypeLabel.length * 7 + 18), 54, availableTypeWidth);
      const issueTypeX = x + CARD_WIDTH - 10 - issueTypeBadgeWidth;
      const titleText = escapeHtml(`${key} - ${issue.summary || ""}`);
      const canDrag = canDragFromChart(key);
      const cardClasses = ["tm-svg-card-link"];
      if (canDrag) {
        cardClasses.push("chart-draggable");
      }
      const cardClassAttr = cardClasses.join(" ");
      const cardAttrs = `class="${cardClassAttr}" data-issue-key="${escapeHtml(
        key
      )}" data-source-draggable="${canDrag ? "true" : "false"}" draggable="${canDrag ? "true" : "false"}"`;
      const cardBody = `
        <g class="tm-svg-card-group">
          <title>${titleText}</title>
          <rect class="tm-svg-card" x="${x}" y="${y}" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="10" ry="10" />
          <rect class="tm-svg-key-bg" x="${x + 10}" y="${y + 10}" width="${badgeWidth}" height="28" rx="6" ry="6" />
          <text class="tm-svg-key-text" x="${x + 18}" y="${y + 28}">${escapeHtml(key)}</text>
          <rect x="${issueTypeX}" y="${y + 10}" width="${issueTypeBadgeWidth}" height="28" rx="6" ry="6" fill="${issueTypeColors.bg}" stroke="${issueTypeColors.border}" stroke-width="1" />
          <text x="${issueTypeX + 9}" y="${y + 28}" fill="${issueTypeColors.text}" font-size="11" font-weight="700">${escapeHtml(issueTypeLabel)}</text>
          <text class="tm-svg-summary" x="${x + 10}" y="${y + 60}">${escapeHtml(summary)}</text>
          <text class="tm-svg-meta" x="${x + 10}" y="${y + 92}">Status: ${escapeHtml(status)}</text>
          <text class="tm-svg-meta" x="${x + 10}" y="${y + 114}">Priority: ${escapeHtml(priority)}</text>
          <text class="tm-svg-meta" x="${x + 10}" y="${y + 136}">Fix version: ${escapeHtml(fixedVersions)}</text>
        </g>
      `;
      if (href) {
        return `<a ${cardAttrs} href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${cardBody}</a>`;
      }
      return `<g ${cardAttrs}>${cardBody}</g>`;
    }).join("");
  }
  function renderHierarchyEdges(layout) {
    const verticalPaths = layout.verticalEdges.map((edge) => {
      const from = layout.positions[edge.from];
      const to = layout.positions[edge.to];
      const fromX = from.x + CARD_WIDTH / 2;
      const fromY = from.y + CARD_HEIGHT;
      const toX = to.x + CARD_WIDTH / 2;
      const toY = to.y;
      const midY = fromY + (toY - fromY) / 2;
      return `<path class="edge-parent" d="M ${fromX} ${fromY} L ${fromX} ${midY} L ${toX} ${midY} L ${toX} ${toY}" />`;
    }).join("");
    const horizontalPaths = state.showRelations ? layout.horizontalEdges.map((edge) => {
      const from = layout.positions[edge.from];
      const to = layout.positions[edge.to];
      const fromX = from.x + CARD_WIDTH / 2;
      const fromY = from.y + CARD_HEIGHT / 2;
      const toX = to.x + CARD_WIDTH / 2;
      const toY = to.y + CARD_HEIGHT / 2;
      const liftY = Math.min(fromY, toY) - 48;
      const delta = Math.max(60, Math.abs(toX - fromX) / 2);
      const c1x = fromX < toX ? fromX + delta : fromX - delta;
      const c2x = fromX < toX ? toX - delta : toX + delta;
      return `<path class="edge-related" d="M ${fromX} ${fromY} C ${c1x} ${liftY} ${c2x} ${liftY} ${toX} ${toY}" />`;
    }).join("") : "";
    const cards = renderHierarchyCardsSvg(layout);
    elements.hierarchyEdges.setAttribute("width", String(layout.canvasWidth));
    elements.hierarchyEdges.setAttribute("height", String(layout.canvasHeight));
    elements.hierarchyEdges.setAttribute("viewBox", `0 0 ${layout.canvasWidth} ${layout.canvasHeight}`);
    elements.hierarchyEdges.innerHTML = `${verticalPaths}${horizontalPaths}${cards}`;
  }
  function clearChartDropTargets() {
    const targets = elements.hierarchyEdges.querySelectorAll(".tm-svg-card-link.chart-drop-target");
    for (const target of targets) {
      target.classList.remove("chart-drop-target");
    }
    state.chartDropTargetKey = "";
  }
  function clearChartDragSource() {
    const source = elements.hierarchyEdges.querySelector(".tm-svg-card-link.chart-drag-source");
    if (source) {
      source.classList.remove("chart-drag-source");
    }
  }
  function hideDragGhost() {
    if (!elements.dragGhost) {
      return;
    }
    elements.dragGhost.classList.remove("visible");
    elements.dragGhost.classList.add("hidden");
    elements.dragGhost.style.transform = "translate(-9999px, -9999px)";
    elements.dragGhost.innerHTML = "";
  }
  function stopChartAutoPanLoop() {
    if (!state.chartAutoPanRaf) {
      return;
    }
    cancelAnimationFrame(state.chartAutoPanRaf);
    state.chartAutoPanRaf = 0;
  }
  function clearChartDragState() {
    stopChartAutoPanLoop();
    state.chartDraggedIssueKey = "";
    state.chartDragPointerId = null;
    state.chartDragMoved = false;
    state.chartDragStartX = 0;
    state.chartDragStartY = 0;
    state.chartPointerX = 0;
    state.chartPointerY = 0;
    elements.hierarchyViewport.classList.remove("chart-assign-dragging");
    clearChartDropTargets();
    clearChartDragSource();
    hideDragGhost();
  }
  function updateDragGhostPosition(clientX, clientY) {
    if (!elements.dragGhost || elements.dragGhost.classList.contains("hidden")) {
      return;
    }
    const viewportRect = elements.hierarchyViewport.getBoundingClientRect();
    const offsetX = clientX - viewportRect.left + DRAG_GHOST_OFFSET_X;
    const offsetY = clientY - viewportRect.top + DRAG_GHOST_OFFSET_Y;
    elements.dragGhost.style.transform = `translate(${Math.round(offsetX)}px, ${Math.round(offsetY)}px)`;
  }
  function showDragGhost(issueKey, clientX, clientY) {
    if (!elements.dragGhost) {
      return;
    }
    const issue = state.data?.issueIndex?.[issueKey] || {};
    const issueType = issue.issueType || "Issue";
    const typeColors = getIssueTypeColors(issueType);
    elements.dragGhost.innerHTML = `
    <div class="drag-ghost-key">${escapeHtml(issueKey)}</div>
    <span class="drag-ghost-type" style="--pill-bg:${typeColors.bg};--pill-border:${typeColors.border};--pill-text:${typeColors.text};">${escapeHtml(truncate(issueType, 16))}</span>
    <div class="drag-ghost-summary">${escapeHtml(truncate(issue.summary || "No summary", 54))}</div>
  `;
    elements.dragGhost.classList.remove("hidden");
    elements.dragGhost.classList.add("visible");
    updateDragGhostPosition(clientX, clientY);
  }
  function findCardAtPoint(clientX, clientY) {
    const hit = document.elementFromPoint(clientX, clientY);
    if (!hit) {
      return null;
    }
    return hit.closest?.(".tm-svg-card-link") || null;
  }
  function updateChartDropTarget(clientX, clientY) {
    clearChartDropTargets();
    if (!state.chartDraggedIssueKey) {
      return;
    }
    const card = findCardAtPoint(clientX, clientY);
    if (!card) {
      return;
    }
    const targetKey = card.dataset.issueKey || "";
    if (!canAssignInChart(state.chartDraggedIssueKey, targetKey)) {
      return;
    }
    state.chartDropTargetKey = targetKey;
    card.classList.add("chart-drop-target");
  }
  function autoPanDuringDrag(clientX, clientY) {
    if (!state.layout) {
      return false;
    }
    const rect = elements.hierarchyViewport.getBoundingClientRect();
    let deltaX = 0;
    let deltaY = 0;
    if (clientX < rect.left + DRAG_AUTOPAN_EDGE) {
      const ratio = (rect.left + DRAG_AUTOPAN_EDGE - clientX) / DRAG_AUTOPAN_EDGE;
      deltaX = DRAG_AUTOPAN_MAX_STEP * clamp(ratio, 0, 1);
    } else if (clientX > rect.right - DRAG_AUTOPAN_EDGE) {
      const ratio = (clientX - (rect.right - DRAG_AUTOPAN_EDGE)) / DRAG_AUTOPAN_EDGE;
      deltaX = -DRAG_AUTOPAN_MAX_STEP * clamp(ratio, 0, 1);
    }
    if (clientY < rect.top + DRAG_AUTOPAN_EDGE) {
      const ratio = (rect.top + DRAG_AUTOPAN_EDGE - clientY) / DRAG_AUTOPAN_EDGE;
      deltaY = DRAG_AUTOPAN_MAX_STEP * clamp(ratio, 0, 1);
    } else if (clientY > rect.bottom - DRAG_AUTOPAN_EDGE) {
      const ratio = (clientY - (rect.bottom - DRAG_AUTOPAN_EDGE)) / DRAG_AUTOPAN_EDGE;
      deltaY = -DRAG_AUTOPAN_MAX_STEP * clamp(ratio, 0, 1);
    }
    if (!deltaX && !deltaY) {
      return false;
    }
    state.panX += deltaX;
    state.panY += deltaY;
    applyHierarchyCamera();
    return true;
  }
  function runChartAutoPanLoop() {
    if (!state.chartDraggedIssueKey || !state.chartDragMoved) {
      stopChartAutoPanLoop();
      return;
    }
    const didPan = autoPanDuringDrag(state.chartPointerX, state.chartPointerY);
    if (didPan) {
      updateDragGhostPosition(state.chartPointerX, state.chartPointerY);
      updateChartDropTarget(state.chartPointerX, state.chartPointerY);
      state.chartAutoPanRaf = requestAnimationFrame(runChartAutoPanLoop);
      return;
    }
    state.chartAutoPanRaf = 0;
  }
  function ensureChartAutoPanLoop() {
    if (state.chartAutoPanRaf) {
      return;
    }
    state.chartAutoPanRaf = requestAnimationFrame(runChartAutoPanLoop);
  }
  function renderLonelyIssues() {
    const lonelyKeys = state.data?.lonelyIssueKeys || [];
    const issueIndex = state.data?.issueIndex || {};
    if (lonelyKeys.length === 0) {
      elements.lonelySection.classList.add("hidden");
      elements.lonelyRows.innerHTML = "";
      return;
    }
    elements.lonelySection.classList.remove("hidden");
    elements.lonelyRows.innerHTML = lonelyKeys.map((key) => {
      const issue = issueIndex[key] || {};
      const href = buildIssueHref(key);
      const issueCell = href ? `<a class="row-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(key)}</a>` : escapeHtml(key);
      return `
        <tr>
          <td>${issueCell}</td>
          <td>${escapeHtml(truncate(issue.summary || "No summary", 120))}</td>
          <td>${escapeHtml(issue.status || "No status")}</td>
          <td>${escapeHtml(issue.priority || "No priority")}</td>
          <td>${escapeHtml(issue.issueType || "Issue")}</td>
        </tr>
      `;
    }).join("");
  }
  function isEpicIssueType(typeName) {
    return /epic/i.test(typeName || "");
  }
  function isSubtaskIssueType(typeName) {
    const lookup = String(typeName || "").trim().toLowerCase();
    const issueType = state.issueTypes.find(
      (item) => String(item.name || "").trim().toLowerCase() === lookup
    );
    if (issueType) {
      return Boolean(issueType.subtask);
    }
    return /sub[- ]?task/i.test(typeName || "");
  }
  function getNodeMetaMap() {
    return state.data?.hierarchy?.nodeMeta || {};
  }
  function getNodeMeta(issueKey) {
    return getNodeMetaMap()[issueKey] || {};
  }
  function canDragFromChart(issueKey) {
    if (!issueKey) {
      return false;
    }
    const issue = state.data?.issueIndex?.[issueKey];
    if (!issue) {
      return false;
    }
    if (isEpicIssueType(issue.issueType)) {
      return false;
    }
    const node = getNodeMeta(issueKey);
    const childCount = Array.isArray(node.childKeys) ? node.childKeys.length : 0;
    return childCount === 0;
  }
  function canBeChartParentForSource(sourceKey, targetKey) {
    if (!sourceKey || !targetKey || sourceKey === targetKey) {
      return false;
    }
    const sourceIssue = state.data?.issueIndex?.[sourceKey];
    const targetIssue = state.data?.issueIndex?.[targetKey];
    if (!sourceIssue || !targetIssue) {
      return false;
    }
    const sourceType = sourceIssue.issueType;
    const targetType = targetIssue.issueType;
    if (isSubtaskIssueType(sourceType)) {
      return !isSubtaskIssueType(targetType);
    }
    return isEpicIssueType(targetType);
  }
  function canAssignInChart(sourceKey, targetKey) {
    if (!sourceKey || !targetKey || sourceKey === targetKey) {
      return false;
    }
    if (!canDragFromChart(sourceKey) || !canBeChartParentForSource(sourceKey, targetKey)) {
      return false;
    }
    const nodeMeta = getNodeMetaMap();
    const visited = /* @__PURE__ */ new Set();
    let current = targetKey;
    while (current && !visited.has(current)) {
      if (current === sourceKey) {
        return false;
      }
      visited.add(current);
      current = nodeMeta[current]?.parentKey || null;
    }
    return true;
  }
  function clampHierarchyPan() {
    if (!state.layout) {
      return;
    }
    const viewport = elements.hierarchyViewport;
    const scaledWidth = state.layout.canvasWidth * state.zoom;
    const scaledHeight = state.layout.canvasHeight * state.zoom;
    const minX = Math.min(PAN_PADDING, viewport.clientWidth - scaledWidth - PAN_PADDING);
    const minY = Math.min(PAN_PADDING, viewport.clientHeight - scaledHeight - PAN_PADDING);
    state.panX = clamp(state.panX, minX, PAN_PADDING);
    state.panY = clamp(state.panY, minY, PAN_PADDING);
  }
  function applyHierarchyCamera() {
    if (!state.layout) {
      return;
    }
    clampHierarchyPan();
    elements.hierarchyStage.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
    elements.zoomLabel.textContent = `${Math.round(state.zoom * 100)}%`;
  }
  function fitHierarchyToViewport(preferReadableScale) {
    if (!state.layout) {
      return;
    }
    const viewport = elements.hierarchyViewport;
    if (!viewport.clientWidth || !viewport.clientHeight) {
      return;
    }
    const fitX = viewport.clientWidth / state.layout.canvasWidth;
    const fitY = viewport.clientHeight / state.layout.canvasHeight;
    const fitZoom = clamp(Math.min(fitX, fitY, 1), ZOOM_MIN, ZOOM_MAX);
    state.zoom = preferReadableScale ? clamp(Math.max(fitZoom, INITIAL_READABLE_ZOOM), ZOOM_MIN, ZOOM_MAX) : fitZoom;
    state.panX = (viewport.clientWidth - state.layout.canvasWidth * state.zoom) / 2;
    state.panY = Math.max(PAN_PADDING, (viewport.clientHeight - state.layout.canvasHeight * state.zoom) / 2);
    applyHierarchyCamera();
  }
  function renderHierarchyView(preserveCamera = false) {
    const previousCamera = preserveCamera && state.layout ? { zoom: state.zoom, panX: state.panX, panY: state.panY } : null;
    const hierarchy = state.data?.hierarchy;
    state.layout = computeHierarchyLayout(hierarchy);
    if (!state.layout) {
      elements.hierarchyStage.classList.add("hidden");
      elements.hierarchyEmptyState.classList.remove("hidden");
      elements.hierarchyEmptyState.textContent = "No hierarchy found for the selected filters.";
      renderLonelyIssues();
      return;
    }
    elements.hierarchyEmptyState.classList.add("hidden");
    elements.hierarchyStage.classList.remove("hidden");
    elements.hierarchyStage.style.width = `${state.layout.canvasWidth}px`;
    elements.hierarchyStage.style.height = `${state.layout.canvasHeight}px`;
    renderHierarchyEdges(state.layout);
    renderLonelyIssues();
    if (previousCamera) {
      state.zoom = clamp(previousCamera.zoom, ZOOM_MIN, ZOOM_MAX);
      state.panX = previousCamera.panX;
      state.panY = previousCamera.panY;
      applyHierarchyCamera();
    } else {
      fitHierarchyToViewport(true);
    }
  }
  async function assignIssueParentInHierarchy(issueKey, parentKey) {
    if (!issueKey || !parentKey || issueKey === parentKey) {
      return;
    }
    try {
      setStatus("loading", `Assigning ${issueKey} -> ${parentKey}...`);
      await (0, import_bridge.invoke)("assignIssueParent", { issueKey, parentKey });
      await loadMatrix({ persist: false, preserveHierarchyCamera: true });
      showSuccessMessage(`Assigned ${issueKey} -> ${parentKey}.`);
    } catch (error) {
      setStatus("error", error?.message || "Failed to assign parent issue.");
    }
  }
  function onHierarchyWheel(event) {
    if (state.mode !== MODES.HIERARCHICAL || !state.layout) {
      return;
    }
    event.preventDefault();
    const rect = elements.hierarchyViewport.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    if (event.shiftKey) {
      state.panX -= event.deltaX;
      state.panY -= event.deltaY;
      applyHierarchyCamera();
      return;
    }
    const zoomFactor = Math.exp(-event.deltaY * 15e-4);
    const nextZoom = clamp(state.zoom * zoomFactor, ZOOM_MIN, ZOOM_MAX);
    const worldX = (px - state.panX) / state.zoom;
    const worldY = (py - state.panY) / state.zoom;
    state.zoom = nextZoom;
    state.panX = px - worldX * state.zoom;
    state.panY = py - worldY * state.zoom;
    applyHierarchyCamera();
  }
  function onHierarchyPointerDown(event) {
    if (state.mode !== MODES.HIERARCHICAL) {
      return;
    }
    if (event.button !== 0 && event.button !== 1) {
      return;
    }
    const card = event.target.closest(".tm-svg-card-link");
    if (card && event.button === 0) {
      const issueKey = card.dataset.issueKey || "";
      if (canDragFromChart(issueKey)) {
        state.chartDraggedIssueKey = issueKey;
        state.chartDragPointerId = event.pointerId;
        state.chartDragStartX = event.clientX;
        state.chartDragStartY = event.clientY;
        state.chartPointerX = event.clientX;
        state.chartPointerY = event.clientY;
        state.chartDragMoved = false;
        clearChartDragSource();
        clearChartDropTargets();
        card.classList.add("chart-drag-source");
        elements.hierarchyViewport.classList.add("chart-assign-dragging");
        showDragGhost(issueKey, event.clientX, event.clientY);
        elements.hierarchyViewport.setPointerCapture(event.pointerId);
        event.preventDefault();
      }
      return;
    }
    state.isDragging = true;
    state.dragStartX = event.clientX;
    state.dragStartY = event.clientY;
    state.dragStartPanX = state.panX;
    state.dragStartPanY = state.panY;
    elements.hierarchyViewport.classList.add("dragging");
    elements.hierarchyViewport.setPointerCapture(event.pointerId);
  }
  function onHierarchyPointerMove(event) {
    if (state.chartDraggedIssueKey && state.chartDragPointerId === event.pointerId) {
      state.chartPointerX = event.clientX;
      state.chartPointerY = event.clientY;
      updateDragGhostPosition(event.clientX, event.clientY);
      const movedDistance = Math.abs(event.clientX - state.chartDragStartX) + Math.abs(event.clientY - state.chartDragStartY);
      if (movedDistance > 4) {
        state.chartDragMoved = true;
      }
      if (state.chartDragMoved) {
        const didPan = autoPanDuringDrag(event.clientX, event.clientY);
        if (didPan) {
          ensureChartAutoPanLoop();
        } else {
          stopChartAutoPanLoop();
        }
        updateChartDropTarget(event.clientX, event.clientY);
      }
      return;
    }
    if (!state.isDragging || state.mode !== MODES.HIERARCHICAL) {
      return;
    }
    state.panX = state.dragStartPanX + (event.clientX - state.dragStartX);
    state.panY = state.dragStartPanY + (event.clientY - state.dragStartY);
    applyHierarchyCamera();
  }
  function onHierarchyPointerUp(event) {
    if (state.chartDraggedIssueKey && state.chartDragPointerId === event.pointerId) {
      const draggedKey = state.chartDraggedIssueKey;
      const dropTargetKey = state.chartDropTargetKey || "";
      const moved = state.chartDragMoved;
      const shouldAssign = moved && canAssignInChart(draggedKey, dropTargetKey);
      const pointerId = state.chartDragPointerId;
      if (elements.hierarchyViewport.hasPointerCapture(pointerId)) {
        elements.hierarchyViewport.releasePointerCapture(pointerId);
      }
      clearChartDragState();
      if (moved) {
        state.suppressCardClickUntil = Date.now() + 350;
      }
      if (shouldAssign) {
        void assignIssueParentInHierarchy(draggedKey, dropTargetKey);
      }
      return;
    }
    if (!state.isDragging) {
      return;
    }
    state.isDragging = false;
    elements.hierarchyViewport.classList.remove("dragging");
    if (elements.hierarchyViewport.hasPointerCapture(event.pointerId)) {
      elements.hierarchyViewport.releasePointerCapture(event.pointerId);
    }
  }
  function onHierarchyCardClick(event) {
    if (Date.now() <= state.suppressCardClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  function updateFullscreenButton() {
    if (!elements.fullscreenButton) {
      return;
    }
    elements.fullscreenButton.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
  }
  async function toggleFullscreen() {
    if (!elements.hierarchyViewport) {
      return;
    }
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await elements.hierarchyViewport.requestFullscreen();
      }
    } catch (error) {
      setStatus("error", "Unable to switch full screen mode in this browser.");
    } finally {
      updateFullscreenButton();
      if (state.mode === MODES.HIERARCHICAL) {
        fitHierarchyToViewport(true);
      }
    }
  }
  function openCellModal(details) {
    if (!details) {
      return;
    }
    const { row, column, cell } = details;
    const rowIssue = state.data?.issueIndex?.[row.key] || { key: row.key };
    const columnIssue = state.data?.issueIndex?.[column.key] || { key: column.key };
    elements.modalTitle.textContent = `${rowIssue.key} \xD7 ${columnIssue.key || column.label}`;
    const sections = [];
    if (state.mode === MODES.COMPONENTS) {
      sections.push(`
      <section class="modal-section">
        <div class="modal-section-title">Relationship</div>
        <div>${escapeHtml(rowIssue.key)} | ${escapeHtml(rowIssue.summary || "")}</div>
        <div>Component: ${escapeHtml(column.label || column.key)}</div>
      </section>
    `);
    } else {
      const relations = Array.isArray(cell.relations) ? cell.relations : [];
      sections.push(`
      <section class="modal-section">
        <div class="modal-section-title">Story Pair</div>
        <div>${escapeHtml(rowIssue.key)} (${escapeHtml(rowIssue.status || "Unknown")})</div>
        <div>${escapeHtml(columnIssue.key)} (${escapeHtml(columnIssue.status || "Unknown")})</div>
      </section>
    `);
      if (relations.length > 0) {
        sections.push(`
        <section class="modal-section">
          <div class="modal-section-title">Relations</div>
          <ol class="modal-list">
            ${relations.map((relation) => {
          const direction = relation.direction || "related to";
          const typeName = relation.typeName ? ` [${relation.typeName}]` : "";
          return `<li>${escapeHtml(direction + typeName)}</li>`;
        }).join("")}
          </ol>
        </section>
      `);
      }
    }
    const issueKeys = Array.isArray(cell.issueKeys) ? cell.issueKeys : [];
    if (issueKeys.length > 0) {
      sections.push(`
      <section class="modal-section">
        <div class="modal-section-title">Issues</div>
        <ul class="modal-list">
          ${issueKeys.map((issueKey) => {
        const issue = state.data?.issueIndex?.[issueKey];
        const label = issue?.summary ? `${issueKey} \u2014 ${issue.summary}` : issueKey;
        const href = state.siteUrl ? `${state.siteUrl}/browse/${issueKey}` : "";
        if (!href) {
          return `<li>${escapeHtml(label)}</li>`;
        }
        return `<li><a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(label)}</a></li>`;
      }).join("")}
        </ul>
      </section>
    `);
    }
    elements.modalBody.innerHTML = sections.join("");
    elements.modal.classList.remove("hidden");
  }
  function closeModal() {
    elements.modal.classList.add("hidden");
    elements.modalBody.innerHTML = "";
  }
  function renderAll(options = {}) {
    const preserveHierarchyCamera = Boolean(options.preserveHierarchyCamera);
    elements.projectLabel.textContent = state.projectKey ? `Project: ${state.projectKey}` : "";
    renderModeButtons();
    renderLegend();
    renderStats();
    syncContentViewportHeight();
    if (state.mode === MODES.HIERARCHICAL) {
      closeModal();
      elements.matrixWrap.classList.add("hidden");
      elements.hierarchyPanel.classList.remove("hidden");
      renderHierarchyView(preserveHierarchyCamera);
    } else {
      elements.hierarchyPanel.classList.add("hidden");
      elements.matrixWrap.classList.remove("hidden");
      renderMatrixTable();
    }
  }
  function syncContentViewportHeight() {
    if (!elements.matrixWrap || !elements.hierarchyPanel) {
      return;
    }
    const anchorRect = state.mode === MODES.HIERARCHICAL ? elements.hierarchyPanel.getBoundingClientRect() : elements.matrixWrap.getBoundingClientRect();
    const viewportBottomPadding = 14;
    const availableHeight = window.innerHeight - anchorRect.top - viewportBottomPadding;
    const nextHeight = Math.max(260, Math.floor(availableHeight));
    elements.matrixWrap.style.height = `${nextHeight}px`;
    elements.hierarchyPanel.style.height = `${nextHeight}px`;
    if (elements.hierarchyViewport) {
      const controlsHeight = elements.hierarchyPanel.querySelector(".hierarchy-controls")?.offsetHeight || 0;
      const viewportHeight = Math.max(360, nextHeight - controlsHeight - 20);
      elements.hierarchyViewport.style.height = `${viewportHeight}px`;
    }
  }
  async function persistState() {
    try {
      await (0, import_bridge.invoke)("setEnhancedMatrixState", {
        projectKey: state.projectKey,
        state: {
          mode: state.mode,
          issueTypes: state.selectedIssueTypes,
          epicKeys: state.selectedEpicKeys,
          fixedVersions: state.selectedFixedVersions,
          labels: state.selectedLabels,
          components: state.selectedComponents,
          jql: state.jql,
          relatedOnly: state.relatedOnly,
          showRelations: state.showRelations
        }
      });
    } catch (error) {
    }
  }
  async function loadMatrix({ persist = true, preserveHierarchyCamera = false } = {}) {
    syncControlsToState();
    clearChartDragState();
    if (persist) {
      await persistState();
    }
    state.loading = true;
    state.error = "";
    setStatus("loading", "Loading matrix data...");
    elements.refreshButton.disabled = true;
    try {
      const result = await (0, import_bridge.invoke)("getMatrixData", {
        projectKey: state.projectKey,
        mode: state.mode,
        issueTypes: state.selectedIssueTypes,
        epicKeys: state.selectedEpicKeys,
        fixedVersions: state.selectedFixedVersions,
        labels: state.selectedLabels,
        components: state.selectedComponents,
        jql: state.jql
      });
      state.data = result;
      setStatus("", "");
    } catch (error) {
      state.data = null;
      state.error = error?.message || "Failed to load matrix data.";
      setStatus("error", state.error);
    } finally {
      state.loading = false;
      elements.refreshButton.disabled = false;
      renderAll({ preserveHierarchyCamera });
    }
  }
  async function loadFilters() {
    const [issueTypes, epics, fixedVersions, labels, components] = await Promise.all([
      (0, import_bridge.invoke)("getIssueTypes"),
      (0, import_bridge.invoke)("getEpics", { projectKey: state.projectKey }),
      (0, import_bridge.invoke)("getFixedVersions", { projectKey: state.projectKey }),
      (0, import_bridge.invoke)("getProjectLabels", { projectKey: state.projectKey }),
      (0, import_bridge.invoke)("getProjectComponents", { projectKey: state.projectKey })
    ]);
    state.issueTypes = (issueTypes || []).slice().sort((a, b) => sortByLabel(a.name, b.name));
    state.epics = (epics || []).slice().sort((a, b) => sortByLabel(a.key, b.key));
    state.fixedVersions = (fixedVersions || []).slice().sort((a, b) => sortByLabel(a.name, b.name));
    state.labels = (labels || []).slice().sort(sortByLabel);
    state.components = (components || []).slice().sort(sortByLabel);
  }
  async function loadSavedState() {
    try {
      let saved = null;
      if (state.projectKey) {
        saved = await (0, import_bridge.invoke)("getEnhancedMatrixState", { projectKey: state.projectKey });
      }
      if (!saved) {
        saved = await (0, import_bridge.invoke)("getEnhancedMatrixLastState");
      }
      if (!saved || typeof saved !== "object") {
        return;
      }
      if (!state.projectKey && typeof saved.projectKey === "string") {
        state.projectKey = saved.projectKey;
      }
      if (isModeSupported(saved.mode)) {
        state.mode = normalizeMode(saved.mode);
      }
      state.selectedIssueTypes = Array.isArray(saved.issueTypes) ? saved.issueTypes : [];
      state.selectedEpicKeys = Array.isArray(saved.epicKeys) ? saved.epicKeys : [];
      state.selectedFixedVersions = Array.isArray(saved.fixedVersions) ? saved.fixedVersions : [];
      state.selectedLabels = Array.isArray(saved.labels) ? saved.labels : [];
      state.selectedComponents = Array.isArray(saved.components) ? saved.components : [];
      state.jql = typeof saved.jql === "string" ? saved.jql : "";
      state.relatedOnly = Boolean(saved.relatedOnly);
      state.showRelations = Boolean(saved.showRelations);
    } catch (error) {
    }
  }
  function bindEvents() {
    enableToggleMultiSelect(elements.issueTypeSelect);
    enableToggleMultiSelect(elements.epicSelect);
    enableToggleMultiSelect(elements.fixedVersionSelect);
    enableToggleMultiSelect(elements.labelSelect);
    enableToggleMultiSelect(elements.componentSelect);
    elements.modeComponentsButton.addEventListener("click", async () => {
      if (state.mode === MODES.COMPONENTS) {
        return;
      }
      state.mode = MODES.COMPONENTS;
      state.relatedOnly = false;
      clearChartDragState();
      syncStateToControls();
      await loadMatrix();
    });
    elements.modeStoryButton.addEventListener("click", async () => {
      if (state.mode === MODES.STORY_TO_STORY) {
        return;
      }
      state.mode = MODES.STORY_TO_STORY;
      clearChartDragState();
      syncStateToControls();
      await loadMatrix();
    });
    elements.modeHierarchyButton.addEventListener("click", async () => {
      if (state.mode === MODES.HIERARCHICAL) {
        return;
      }
      state.mode = MODES.HIERARCHICAL;
      state.relatedOnly = false;
      syncStateToControls();
      await loadMatrix();
    });
    elements.issueTypeSelect.addEventListener("change", syncControlsToState);
    elements.epicSelect.addEventListener("change", syncControlsToState);
    elements.fixedVersionSelect.addEventListener("change", syncControlsToState);
    elements.labelSelect.addEventListener("change", syncControlsToState);
    elements.componentSelect.addEventListener("change", syncControlsToState);
    elements.jqlInput.addEventListener("input", syncControlsToState);
    elements.relatedOnlyCheckbox.addEventListener("change", syncControlsToState);
    elements.refreshButton.addEventListener("click", () => {
      void loadMatrix({ preserveHierarchyCamera: state.mode === MODES.HIERARCHICAL });
    });
    elements.resetFiltersButton.addEventListener("click", () => {
      resetFilters();
      void loadMatrix();
    });
    elements.zoomInButton.addEventListener("click", () => {
      if (state.mode !== MODES.HIERARCHICAL) {
        return;
      }
      state.zoom = clamp(state.zoom * 1.2, ZOOM_MIN, ZOOM_MAX);
      applyHierarchyCamera();
    });
    elements.zoomOutButton.addEventListener("click", () => {
      if (state.mode !== MODES.HIERARCHICAL) {
        return;
      }
      state.zoom = clamp(state.zoom / 1.2, ZOOM_MIN, ZOOM_MAX);
      applyHierarchyCamera();
    });
    elements.resetViewButton.addEventListener("click", () => {
      if (state.mode !== MODES.HIERARCHICAL) {
        return;
      }
      state.zoom = 1;
      state.panX = PAN_PADDING;
      state.panY = PAN_PADDING;
      applyHierarchyCamera();
    });
    elements.fitViewButton.addEventListener("click", () => {
      if (state.mode !== MODES.HIERARCHICAL) {
        return;
      }
      fitHierarchyToViewport(false);
    });
    elements.showRelationsCheckbox.addEventListener("change", () => {
      state.showRelations = Boolean(elements.showRelationsCheckbox.checked);
      if (state.mode === MODES.HIERARCHICAL && state.layout) {
        renderHierarchyEdges(state.layout);
        void persistState();
      }
    });
    elements.fullscreenButton.addEventListener("click", () => {
      if (state.mode !== MODES.HIERARCHICAL) {
        return;
      }
      void toggleFullscreen();
    });
    elements.hierarchyViewport.addEventListener("wheel", onHierarchyWheel, { passive: false });
    elements.hierarchyViewport.addEventListener("pointerdown", onHierarchyPointerDown);
    elements.hierarchyViewport.addEventListener("pointermove", onHierarchyPointerMove);
    elements.hierarchyViewport.addEventListener("pointerup", onHierarchyPointerUp);
    elements.hierarchyViewport.addEventListener("pointercancel", onHierarchyPointerUp);
    elements.hierarchyEdges.addEventListener("click", onHierarchyCardClick, true);
    elements.hierarchyEdges.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
    elements.matrixTable.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-row-key][data-column-key]");
      if (!button) {
        return;
      }
      const rowKey = button.dataset.rowKey;
      const columnKey = button.dataset.columnKey;
      if (!rowKey || !columnKey) {
        return;
      }
      const details = state.cellLookup.get(`${rowKey}::${columnKey}`);
      openCellModal(details);
    });
    elements.modalCloseButton.addEventListener("click", closeModal);
    elements.modal.addEventListener("click", (event) => {
      const closeTarget = event.target.closest('[data-close-modal="true"]');
      if (closeTarget) {
        closeModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }
      if (!elements.modal.classList.contains("hidden")) {
        closeModal();
      }
    });
    elements.filtersPanel.addEventListener("toggle", () => {
      window.requestAnimationFrame(syncContentViewportHeight);
    });
    window.addEventListener("resize", () => {
      syncContentViewportHeight();
      if (state.mode === MODES.HIERARCHICAL) {
        fitHierarchyToViewport(true);
      }
    });
    document.addEventListener("fullscreenchange", () => {
      updateFullscreenButton();
      if (state.mode === MODES.HIERARCHICAL) {
        fitHierarchyToViewport(true);
      }
    });
  }
  async function init() {
    try {
      state.context = await import_bridge.view.getContext();
      state.siteUrl = state.context.siteUrl || "";
      state.projectKey = state.context.extension?.project?.key || state.context.project?.key || "";
      await loadSavedState();
      if (!state.projectKey) {
        throw new Error("Project context is missing. Open Enhanced mode from a project matrix page.");
      }
      await loadFilters();
      state.mode = normalizeMode(state.mode);
      syncStateToControls();
      bindEvents();
      await loadMatrix({ persist: false });
    } catch (error) {
      setStatus("error", error?.message || "Failed to initialize Enhanced Matrix view.");
    }
  }
  void init();
})();
