// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.

// A script preamble that provides the ability to load a single outfile
// TypeScript "bundle" where a main module is loaded which recursively
// instantiates all the other modules in the bundle.  This code is used to load
// bundles when creating snapshots, but is also used when emitting bundles from
// Deno cli.

// @ts-nocheck

/**
 * @type {(name: string, deps: ReadonlyArray<string>, factory: (...deps: any[]) => void) => void=}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let define;

/**
 * @type {(mod: string) => any=}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let instantiate;

/**
 * @callback Factory
 * @argument {...any[]} args
 * @returns {object | void}
 */

/**
 * @typedef ModuleMetaData
 * @property {ReadonlyArray<string>} dependencies
 * @property {(Factory | object)=} factory
 * @property {object} exports
 */

(function() {
  /**
   * @type {Map<string, ModuleMetaData>}
   */
  const modules = new Map();

  /**
   * Bundles in theory can support "dynamic" imports, but for internal bundles
   * we can't go outside to fetch any modules that haven't been statically
   * defined.
   * @param {string[]} deps
   * @param {(...deps: any[]) => void} resolve
   * @param {(err: any) => void} reject
   */
  const require = (deps, resolve, reject) => {
    try {
      if (deps.length !== 1) {
        throw new TypeError("Expected only a single module specifier.");
      }
      if (!modules.has(deps[0])) {
        throw new RangeError(`Module "${deps[0]}" not defined.`);
      }
      resolve(getExports(deps[0]));
    } catch (e) {
      if (reject) {
        reject(e);
      } else {
        throw e;
      }
    }
  };

  define = (id, dependencies, factory) => {
    if (modules.has(id)) {
      throw new RangeError(`Module "${id}" has already been defined.`);
    }
    modules.set(id, {
      dependencies,
      factory,
      exports: {}
    });
  };

  /**
   * @param {string} id
   * @returns {any}
   */
  function getExports(id) {
    const module = modules.get(id);
    if (!module) {
      // because `$deno$/ts_global.d.ts` looks like a real script, it doesn't
      // get erased from output as an import, but it doesn't get defined, so
      // we don't have a cache for it, so because this is an internal bundle
      // we can just safely return an empty object literal.
      return {};
    }
    if (!module.factory) {
      return module.exports;
    } else if (module.factory) {
      const { factory, exports } = module;
      delete module.factory;
      if (typeof factory === "function") {
        const dependencies = module.dependencies.map(id => {
          if (id === "require") {
            return require;
          } else if (id === "exports") {
            return exports;
          }
          return getExports(id);
        });
        factory(...dependencies);
      } else {
        Object.assign(exports, factory);
      }
      return exports;
    }
  }

  instantiate = dep => {
    define = undefined;
    const result = getExports(dep);
    // clean up, or otherwise these end up in the runtime environment
    instantiate = undefined;
    return result;
  };
})();

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define("https://deno.land/std@v0.24.0/path/interface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
define("https://deno.land/std@v0.24.0/path/constants", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const { build } = Deno;
    // Alphabet chars.
    exports.CHAR_UPPERCASE_A = 65; /* A */
    exports.CHAR_LOWERCASE_A = 97; /* a */
    exports.CHAR_UPPERCASE_Z = 90; /* Z */
    exports.CHAR_LOWERCASE_Z = 122; /* z */
    // Non-alphabetic chars.
    exports.CHAR_DOT = 46; /* . */
    exports.CHAR_FORWARD_SLASH = 47; /* / */
    exports.CHAR_BACKWARD_SLASH = 92; /* \ */
    exports.CHAR_VERTICAL_LINE = 124; /* | */
    exports.CHAR_COLON = 58; /* : */
    exports.CHAR_QUESTION_MARK = 63; /* ? */
    exports.CHAR_UNDERSCORE = 95; /* _ */
    exports.CHAR_LINE_FEED = 10; /* \n */
    exports.CHAR_CARRIAGE_RETURN = 13; /* \r */
    exports.CHAR_TAB = 9; /* \t */
    exports.CHAR_FORM_FEED = 12; /* \f */
    exports.CHAR_EXCLAMATION_MARK = 33; /* ! */
    exports.CHAR_HASH = 35; /* # */
    exports.CHAR_SPACE = 32; /*   */
    exports.CHAR_NO_BREAK_SPACE = 160; /* \u00A0 */
    exports.CHAR_ZERO_WIDTH_NOBREAK_SPACE = 65279; /* \uFEFF */
    exports.CHAR_LEFT_SQUARE_BRACKET = 91; /* [ */
    exports.CHAR_RIGHT_SQUARE_BRACKET = 93; /* ] */
    exports.CHAR_LEFT_ANGLE_BRACKET = 60; /* < */
    exports.CHAR_RIGHT_ANGLE_BRACKET = 62; /* > */
    exports.CHAR_LEFT_CURLY_BRACKET = 123; /* { */
    exports.CHAR_RIGHT_CURLY_BRACKET = 125; /* } */
    exports.CHAR_HYPHEN_MINUS = 45; /* - */
    exports.CHAR_PLUS = 43; /* + */
    exports.CHAR_DOUBLE_QUOTE = 34; /* " */
    exports.CHAR_SINGLE_QUOTE = 39; /* ' */
    exports.CHAR_PERCENT = 37; /* % */
    exports.CHAR_SEMICOLON = 59; /* ; */
    exports.CHAR_CIRCUMFLEX_ACCENT = 94; /* ^ */
    exports.CHAR_GRAVE_ACCENT = 96; /* ` */
    exports.CHAR_AT = 64; /* @ */
    exports.CHAR_AMPERSAND = 38; /* & */
    exports.CHAR_EQUAL = 61; /* = */
    // Digits
    exports.CHAR_0 = 48; /* 0 */
    exports.CHAR_9 = 57; /* 9 */
    exports.isWindows = build.os === "win";
    exports.EOL = exports.isWindows ? "\r\n" : "\n";
    exports.SEP = exports.isWindows ? "\\" : "/";
    exports.SEP_PATTERN = exports.isWindows ? /[\\/]+/ : /\/+/;
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
define("https://deno.land/std@v0.24.0/path/utils", ["require", "exports", "https://deno.land/std@v0.24.0/path/constants"], function (require, exports, constants_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function assertPath(path) {
        if (typeof path !== "string") {
            throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
        }
    }
    exports.assertPath = assertPath;
    function isPosixPathSeparator(code) {
        return code === constants_ts_1.CHAR_FORWARD_SLASH;
    }
    exports.isPosixPathSeparator = isPosixPathSeparator;
    function isPathSeparator(code) {
        return isPosixPathSeparator(code) || code === constants_ts_1.CHAR_BACKWARD_SLASH;
    }
    exports.isPathSeparator = isPathSeparator;
    function isWindowsDeviceRoot(code) {
        return ((code >= constants_ts_1.CHAR_LOWERCASE_A && code <= constants_ts_1.CHAR_LOWERCASE_Z) ||
            (code >= constants_ts_1.CHAR_UPPERCASE_A && code <= constants_ts_1.CHAR_UPPERCASE_Z));
    }
    exports.isWindowsDeviceRoot = isWindowsDeviceRoot;
    // Resolves . and .. elements in a path with directory names
    function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
        let res = "";
        let lastSegmentLength = 0;
        let lastSlash = -1;
        let dots = 0;
        let code;
        for (let i = 0, len = path.length; i <= len; ++i) {
            if (i < len)
                code = path.charCodeAt(i);
            else if (isPathSeparator(code))
                break;
            else
                code = constants_ts_1.CHAR_FORWARD_SLASH;
            if (isPathSeparator(code)) {
                if (lastSlash === i - 1 || dots === 1) {
                    // NOOP
                }
                else if (lastSlash !== i - 1 && dots === 2) {
                    if (res.length < 2 ||
                        lastSegmentLength !== 2 ||
                        res.charCodeAt(res.length - 1) !== constants_ts_1.CHAR_DOT ||
                        res.charCodeAt(res.length - 2) !== constants_ts_1.CHAR_DOT) {
                        if (res.length > 2) {
                            const lastSlashIndex = res.lastIndexOf(separator);
                            if (lastSlashIndex === -1) {
                                res = "";
                                lastSegmentLength = 0;
                            }
                            else {
                                res = res.slice(0, lastSlashIndex);
                                lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                            }
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                        else if (res.length === 2 || res.length === 1) {
                            res = "";
                            lastSegmentLength = 0;
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                    }
                    if (allowAboveRoot) {
                        if (res.length > 0)
                            res += `${separator}..`;
                        else
                            res = "..";
                        lastSegmentLength = 2;
                    }
                }
                else {
                    if (res.length > 0)
                        res += separator + path.slice(lastSlash + 1, i);
                    else
                        res = path.slice(lastSlash + 1, i);
                    lastSegmentLength = i - lastSlash - 1;
                }
                lastSlash = i;
                dots = 0;
            }
            else if (code === constants_ts_1.CHAR_DOT && dots !== -1) {
                ++dots;
            }
            else {
                dots = -1;
            }
        }
        return res;
    }
    exports.normalizeString = normalizeString;
    function _format(sep, pathObject) {
        const dir = pathObject.dir || pathObject.root;
        const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
        if (!dir)
            return base;
        if (dir === pathObject.root)
            return dir + base;
        return dir + sep + base;
    }
    exports._format = _format;
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
define("https://deno.land/std@v0.24.0/path/win32", ["require", "exports", "https://deno.land/std@v0.24.0/path/constants", "https://deno.land/std@v0.24.0/path/utils"], function (require, exports, constants_ts_2, utils_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const { cwd, env } = Deno;
    exports.sep = "\\";
    exports.delimiter = ";";
    function resolve(...pathSegments) {
        let resolvedDevice = "";
        let resolvedTail = "";
        let resolvedAbsolute = false;
        for (let i = pathSegments.length - 1; i >= -1; i--) {
            let path;
            if (i >= 0) {
                path = pathSegments[i];
            }
            else if (!resolvedDevice) {
                path = cwd();
            }
            else {
                // Windows has the concept of drive-specific current working
                // directories. If we've resolved a drive letter but not yet an
                // absolute path, get cwd for that drive, or the process cwd if
                // the drive cwd is not available. We're sure the device is not
                // a UNC path at this points, because UNC paths are always absolute.
                path = env()[`=${resolvedDevice}`] || cwd();
                // Verify that a cwd was found and that it actually points
                // to our drive. If not, default to the drive's root.
                if (path === undefined ||
                    path.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                    path = `${resolvedDevice}\\`;
                }
            }
            utils_ts_1.assertPath(path);
            const len = path.length;
            // Skip empty entries
            if (len === 0)
                continue;
            let rootEnd = 0;
            let device = "";
            let isAbsolute = false;
            const code = path.charCodeAt(0);
            // Try to match a root
            if (len > 1) {
                if (utils_ts_1.isPathSeparator(code)) {
                    // Possible UNC root
                    // If we started with a separator, we know we at least have an
                    // absolute path of some kind (UNC or otherwise)
                    isAbsolute = true;
                    if (utils_ts_1.isPathSeparator(path.charCodeAt(1))) {
                        // Matched double path separator at beginning
                        let j = 2;
                        let last = j;
                        // Match 1 or more non-path separators
                        for (; j < len; ++j) {
                            if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            const firstPart = path.slice(last, j);
                            // Matched!
                            last = j;
                            // Match 1 or more path separators
                            for (; j < len; ++j) {
                                if (!utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j < len && j !== last) {
                                // Matched!
                                last = j;
                                // Match 1 or more non-path separators
                                for (; j < len; ++j) {
                                    if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                        break;
                                }
                                if (j === len) {
                                    // We matched a UNC root only
                                    device = `\\\\${firstPart}\\${path.slice(last)}`;
                                    rootEnd = j;
                                }
                                else if (j !== last) {
                                    // We matched a UNC root with leftovers
                                    device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                    rootEnd = j;
                                }
                            }
                        }
                    }
                    else {
                        rootEnd = 1;
                    }
                }
                else if (utils_ts_1.isWindowsDeviceRoot(code)) {
                    // Possible device root
                    if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                        device = path.slice(0, 2);
                        rootEnd = 2;
                        if (len > 2) {
                            if (utils_ts_1.isPathSeparator(path.charCodeAt(2))) {
                                // Treat separator following drive name as an absolute path
                                // indicator
                                isAbsolute = true;
                                rootEnd = 3;
                            }
                        }
                    }
                }
            }
            else if (utils_ts_1.isPathSeparator(code)) {
                // `path` contains just a path separator
                rootEnd = 1;
                isAbsolute = true;
            }
            if (device.length > 0 &&
                resolvedDevice.length > 0 &&
                device.toLowerCase() !== resolvedDevice.toLowerCase()) {
                // This path points to another device so it is not applicable
                continue;
            }
            if (resolvedDevice.length === 0 && device.length > 0) {
                resolvedDevice = device;
            }
            if (!resolvedAbsolute) {
                resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
                resolvedAbsolute = isAbsolute;
            }
            if (resolvedAbsolute && resolvedDevice.length > 0)
                break;
        }
        // At this point the path should be resolved to a full absolute path,
        // but handle relative paths to be safe (might happen when process.cwd()
        // fails)
        // Normalize the tail path
        resolvedTail = utils_ts_1.normalizeString(resolvedTail, !resolvedAbsolute, "\\", utils_ts_1.isPathSeparator);
        return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
    }
    exports.resolve = resolve;
    function normalize(path) {
        utils_ts_1.assertPath(path);
        const len = path.length;
        if (len === 0)
            return ".";
        let rootEnd = 0;
        let device;
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (utils_ts_1.isPathSeparator(code)) {
                // Possible UNC root
                // If we started with a separator, we know we at least have an absolute
                // path of some kind (UNC or otherwise)
                isAbsolute = true;
                if (utils_ts_1.isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    let j = 2;
                    let last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path.slice(last, j);
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                // Return the normalized version of the UNC root since there
                                // is nothing left to process
                                return `\\\\${firstPart}\\${path.slice(last)}\\`;
                            }
                            else if (j !== last) {
                                // We matched a UNC root with leftovers
                                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                }
                else {
                    rootEnd = 1;
                }
            }
            else if (utils_ts_1.isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                    device = path.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(2))) {
                            // Treat separator following drive name as an absolute path
                            // indicator
                            isAbsolute = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        }
        else if (utils_ts_1.isPathSeparator(code)) {
            // `path` contains just a path separator, exit early to avoid unnecessary
            // work
            return "\\";
        }
        let tail;
        if (rootEnd < len) {
            tail = utils_ts_1.normalizeString(path.slice(rootEnd), !isAbsolute, "\\", utils_ts_1.isPathSeparator);
        }
        else {
            tail = "";
        }
        if (tail.length === 0 && !isAbsolute)
            tail = ".";
        if (tail.length > 0 && utils_ts_1.isPathSeparator(path.charCodeAt(len - 1)))
            tail += "\\";
        if (device === undefined) {
            if (isAbsolute) {
                if (tail.length > 0)
                    return `\\${tail}`;
                else
                    return "\\";
            }
            else if (tail.length > 0) {
                return tail;
            }
            else {
                return "";
            }
        }
        else if (isAbsolute) {
            if (tail.length > 0)
                return `${device}\\${tail}`;
            else
                return `${device}\\`;
        }
        else if (tail.length > 0) {
            return device + tail;
        }
        else {
            return device;
        }
    }
    exports.normalize = normalize;
    function isAbsolute(path) {
        utils_ts_1.assertPath(path);
        const len = path.length;
        if (len === 0)
            return false;
        const code = path.charCodeAt(0);
        if (utils_ts_1.isPathSeparator(code)) {
            return true;
        }
        else if (utils_ts_1.isWindowsDeviceRoot(code)) {
            // Possible device root
            if (len > 2 && path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                if (utils_ts_1.isPathSeparator(path.charCodeAt(2)))
                    return true;
            }
        }
        return false;
    }
    exports.isAbsolute = isAbsolute;
    function join(...paths) {
        const pathsCount = paths.length;
        if (pathsCount === 0)
            return ".";
        let joined;
        let firstPart;
        for (let i = 0; i < pathsCount; ++i) {
            const path = paths[i];
            utils_ts_1.assertPath(path);
            if (path.length > 0) {
                if (joined === undefined)
                    joined = firstPart = path;
                else
                    joined += `\\${path}`;
            }
        }
        if (joined === undefined)
            return ".";
        // Make sure that the joined path doesn't start with two slashes, because
        // normalize() will mistake it for an UNC path then.
        //
        // This step is skipped when it is very clear that the user actually
        // intended to point at an UNC path. This is assumed when the first
        // non-empty string arguments starts with exactly two slashes followed by
        // at least one more non-slash character.
        //
        // Note that for normalize() to treat a path as an UNC path it needs to
        // have at least 2 components, so we don't filter for that here.
        // This means that the user can use join to construct UNC paths from
        // a server name and a share name; for example:
        //   path.join('//server', 'share') -> '\\\\server\\share\\')
        let needsReplace = true;
        let slashCount = 0;
        firstPart = firstPart;
        if (utils_ts_1.isPathSeparator(firstPart.charCodeAt(0))) {
            ++slashCount;
            const firstLen = firstPart.length;
            if (firstLen > 1) {
                if (utils_ts_1.isPathSeparator(firstPart.charCodeAt(1))) {
                    ++slashCount;
                    if (firstLen > 2) {
                        if (utils_ts_1.isPathSeparator(firstPart.charCodeAt(2)))
                            ++slashCount;
                        else {
                            // We matched a UNC path in the first part
                            needsReplace = false;
                        }
                    }
                }
            }
        }
        if (needsReplace) {
            // Find any more consecutive slashes we need to replace
            for (; slashCount < joined.length; ++slashCount) {
                if (!utils_ts_1.isPathSeparator(joined.charCodeAt(slashCount)))
                    break;
            }
            // Replace the slashes if needed
            if (slashCount >= 2)
                joined = `\\${joined.slice(slashCount)}`;
        }
        return normalize(joined);
    }
    exports.join = join;
    // It will solve the relative path from `from` to `to`, for instance:
    //  from = 'C:\\orandea\\test\\aaa'
    //  to = 'C:\\orandea\\impl\\bbb'
    // The output of the function should be: '..\\..\\impl\\bbb'
    function relative(from, to) {
        utils_ts_1.assertPath(from);
        utils_ts_1.assertPath(to);
        if (from === to)
            return "";
        const fromOrig = resolve(from);
        const toOrig = resolve(to);
        if (fromOrig === toOrig)
            return "";
        from = fromOrig.toLowerCase();
        to = toOrig.toLowerCase();
        if (from === to)
            return "";
        // Trim any leading backslashes
        let fromStart = 0;
        let fromEnd = from.length;
        for (; fromStart < fromEnd; ++fromStart) {
            if (from.charCodeAt(fromStart) !== constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        // Trim trailing backslashes (applicable to UNC paths only)
        for (; fromEnd - 1 > fromStart; --fromEnd) {
            if (from.charCodeAt(fromEnd - 1) !== constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        const fromLen = fromEnd - fromStart;
        // Trim any leading backslashes
        let toStart = 0;
        let toEnd = to.length;
        for (; toStart < toEnd; ++toStart) {
            if (to.charCodeAt(toStart) !== constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        // Trim trailing backslashes (applicable to UNC paths only)
        for (; toEnd - 1 > toStart; --toEnd) {
            if (to.charCodeAt(toEnd - 1) !== constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        const toLen = toEnd - toStart;
        // Compare paths to find the longest common path from root
        const length = fromLen < toLen ? fromLen : toLen;
        let lastCommonSep = -1;
        let i = 0;
        for (; i <= length; ++i) {
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                        // We get here if `from` is the exact base path for `to`.
                        // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
                        return toOrig.slice(toStart + i + 1);
                    }
                    else if (i === 2) {
                        // We get here if `from` is the device root.
                        // For example: from='C:\\'; to='C:\\foo'
                        return toOrig.slice(toStart + i);
                    }
                }
                if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                        // We get here if `to` is the exact base path for `from`.
                        // For example: from='C:\\foo\\bar'; to='C:\\foo'
                        lastCommonSep = i;
                    }
                    else if (i === 2) {
                        // We get here if `to` is the device root.
                        // For example: from='C:\\foo\\bar'; to='C:\\'
                        lastCommonSep = 3;
                    }
                }
                break;
            }
            const fromCode = from.charCodeAt(fromStart + i);
            const toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
                break;
            else if (fromCode === constants_ts_2.CHAR_BACKWARD_SLASH)
                lastCommonSep = i;
        }
        // We found a mismatch before the first common path separator was seen, so
        // return the original `to`.
        if (i !== length && lastCommonSep === -1) {
            return toOrig;
        }
        let out = "";
        if (lastCommonSep === -1)
            lastCommonSep = 0;
        // Generate the relative path based on the path difference between `to` and
        // `from`
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                if (out.length === 0)
                    out += "..";
                else
                    out += "\\..";
            }
        }
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0)
            return out + toOrig.slice(toStart + lastCommonSep, toEnd);
        else {
            toStart += lastCommonSep;
            if (toOrig.charCodeAt(toStart) === constants_ts_2.CHAR_BACKWARD_SLASH)
                ++toStart;
            return toOrig.slice(toStart, toEnd);
        }
    }
    exports.relative = relative;
    function toNamespacedPath(path) {
        // Note: this will *probably* throw somewhere.
        if (typeof path !== "string")
            return path;
        if (path.length === 0)
            return "";
        const resolvedPath = resolve(path);
        if (resolvedPath.length >= 3) {
            if (resolvedPath.charCodeAt(0) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                // Possible UNC root
                if (resolvedPath.charCodeAt(1) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                    const code = resolvedPath.charCodeAt(2);
                    if (code !== constants_ts_2.CHAR_QUESTION_MARK && code !== constants_ts_2.CHAR_DOT) {
                        // Matched non-long UNC root, convert the path to a long UNC path
                        return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                    }
                }
            }
            else if (utils_ts_1.isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
                // Possible device root
                if (resolvedPath.charCodeAt(1) === constants_ts_2.CHAR_COLON &&
                    resolvedPath.charCodeAt(2) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                    // Matched device root, convert the path to a long UNC path
                    return `\\\\?\\${resolvedPath}`;
                }
            }
        }
        return path;
    }
    exports.toNamespacedPath = toNamespacedPath;
    function dirname(path) {
        utils_ts_1.assertPath(path);
        const len = path.length;
        if (len === 0)
            return ".";
        let rootEnd = -1;
        let end = -1;
        let matchedSlash = true;
        let offset = 0;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (utils_ts_1.isPathSeparator(code)) {
                // Possible UNC root
                rootEnd = offset = 1;
                if (utils_ts_1.isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    let j = 2;
                    let last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                return path;
                            }
                            if (j !== last) {
                                // We matched a UNC root with leftovers
                                // Offset by 1 to include the separator after the UNC root to
                                // treat it as a "normal root" on top of a (UNC) root
                                rootEnd = offset = j + 1;
                            }
                        }
                    }
                }
            }
            else if (utils_ts_1.isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                    rootEnd = offset = 2;
                    if (len > 2) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(2)))
                            rootEnd = offset = 3;
                    }
                }
            }
        }
        else if (utils_ts_1.isPathSeparator(code)) {
            // `path` contains just a path separator, exit early to avoid
            // unnecessary work
            return path;
        }
        for (let i = len - 1; i >= offset; --i) {
            if (utils_ts_1.isPathSeparator(path.charCodeAt(i))) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            }
            else {
                // We saw the first non-path separator
                matchedSlash = false;
            }
        }
        if (end === -1) {
            if (rootEnd === -1)
                return ".";
            else
                end = rootEnd;
        }
        return path.slice(0, end);
    }
    exports.dirname = dirname;
    function basename(path, ext = "") {
        if (ext !== undefined && typeof ext !== "string")
            throw new TypeError('"ext" argument must be a string');
        utils_ts_1.assertPath(path);
        let start = 0;
        let end = -1;
        let matchedSlash = true;
        let i;
        // Check for a drive letter prefix so as not to mistake the following
        // path separator as an extra separator at the end of the path that can be
        // disregarded
        if (path.length >= 2) {
            const drive = path.charCodeAt(0);
            if (utils_ts_1.isWindowsDeviceRoot(drive)) {
                if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON)
                    start = 2;
            }
        }
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
                return "";
            let extIdx = ext.length - 1;
            let firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= start; --i) {
                const code = path.charCodeAt(i);
                if (utils_ts_1.isPathSeparator(code)) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else {
                    if (firstNonSlashEnd === -1) {
                        // We saw the first non-path separator, remember this index in case
                        // we need it if the extension ends up not matching
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        // Try to match the explicit extension
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                // We matched the extension, so mark this as the end of our path
                                // component
                                end = i;
                            }
                        }
                        else {
                            // Extension does not match, so our result is the entire path
                            // component
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end)
                end = firstNonSlashEnd;
            else if (end === -1)
                end = path.length;
            return path.slice(start, end);
        }
        else {
            for (i = path.length - 1; i >= start; --i) {
                if (utils_ts_1.isPathSeparator(path.charCodeAt(i))) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1)
                return "";
            return path.slice(start, end);
        }
    }
    exports.basename = basename;
    function extname(path) {
        utils_ts_1.assertPath(path);
        let start = 0;
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        // Check for a drive letter prefix so as not to mistake the following
        // path separator as an extra separator at the end of the path that can be
        // disregarded
        if (path.length >= 2 &&
            path.charCodeAt(1) === constants_ts_2.CHAR_COLON &&
            utils_ts_1.isWindowsDeviceRoot(path.charCodeAt(0))) {
            start = startPart = 2;
        }
        for (let i = path.length - 1; i >= start; --i) {
            const code = path.charCodeAt(i);
            if (utils_ts_1.isPathSeparator(code)) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === constants_ts_2.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            return "";
        }
        return path.slice(startDot, end);
    }
    exports.extname = extname;
    function format(pathObject) {
        /* eslint-disable max-len */
        if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
        }
        return utils_ts_1._format("\\", pathObject);
    }
    exports.format = format;
    function parse(path) {
        utils_ts_1.assertPath(path);
        const ret = { root: "", dir: "", base: "", ext: "", name: "" };
        const len = path.length;
        if (len === 0)
            return ret;
        let rootEnd = 0;
        let code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (utils_ts_1.isPathSeparator(code)) {
                // Possible UNC root
                rootEnd = 1;
                if (utils_ts_1.isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    let j = 2;
                    let last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                rootEnd = j;
                            }
                            else if (j !== last) {
                                // We matched a UNC root with leftovers
                                rootEnd = j + 1;
                            }
                        }
                    }
                }
            }
            else if (utils_ts_1.isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                    rootEnd = 2;
                    if (len > 2) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(2))) {
                            if (len === 3) {
                                // `path` contains just a drive root, exit early to avoid
                                // unnecessary work
                                ret.root = ret.dir = path;
                                return ret;
                            }
                            rootEnd = 3;
                        }
                    }
                    else {
                        // `path` contains just a drive root, exit early to avoid
                        // unnecessary work
                        ret.root = ret.dir = path;
                        return ret;
                    }
                }
            }
        }
        else if (utils_ts_1.isPathSeparator(code)) {
            // `path` contains just a path separator, exit early to avoid
            // unnecessary work
            ret.root = ret.dir = path;
            return ret;
        }
        if (rootEnd > 0)
            ret.root = path.slice(0, rootEnd);
        let startDot = -1;
        let startPart = rootEnd;
        let end = -1;
        let matchedSlash = true;
        let i = path.length - 1;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        // Get non-dir info
        for (; i >= rootEnd; --i) {
            code = path.charCodeAt(i);
            if (utils_ts_1.isPathSeparator(code)) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === constants_ts_2.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            if (end !== -1) {
                ret.base = ret.name = path.slice(startPart, end);
            }
        }
        else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
            ret.ext = path.slice(startDot, end);
        }
        // If the directory is the root, use the entire root as the `dir` including
        // the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
        // trailing slash (`C:\abc\def` -> `C:\abc`).
        if (startPart > 0 && startPart !== rootEnd) {
            ret.dir = path.slice(0, startPart - 1);
        }
        else
            ret.dir = ret.root;
        return ret;
    }
    exports.parse = parse;
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
define("https://deno.land/std@v0.24.0/path/posix", ["require", "exports", "https://deno.land/std@v0.24.0/path/constants", "https://deno.land/std@v0.24.0/path/utils"], function (require, exports, constants_ts_3, utils_ts_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const { cwd } = Deno;
    exports.sep = "/";
    exports.delimiter = ":";
    // path.resolve([from ...], to)
    function resolve(...pathSegments) {
        let resolvedPath = "";
        let resolvedAbsolute = false;
        for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            let path;
            if (i >= 0)
                path = pathSegments[i];
            else
                path = cwd();
            utils_ts_2.assertPath(path);
            // Skip empty entries
            if (path.length === 0) {
                continue;
            }
            resolvedPath = `${path}/${resolvedPath}`;
            resolvedAbsolute = path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        // Normalize the path
        resolvedPath = utils_ts_2.normalizeString(resolvedPath, !resolvedAbsolute, "/", utils_ts_2.isPosixPathSeparator);
        if (resolvedAbsolute) {
            if (resolvedPath.length > 0)
                return `/${resolvedPath}`;
            else
                return "/";
        }
        else if (resolvedPath.length > 0)
            return resolvedPath;
        else
            return ".";
    }
    exports.resolve = resolve;
    function normalize(path) {
        utils_ts_2.assertPath(path);
        if (path.length === 0)
            return ".";
        const isAbsolute = path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
        const trailingSeparator = path.charCodeAt(path.length - 1) === constants_ts_3.CHAR_FORWARD_SLASH;
        // Normalize the path
        path = utils_ts_2.normalizeString(path, !isAbsolute, "/", utils_ts_2.isPosixPathSeparator);
        if (path.length === 0 && !isAbsolute)
            path = ".";
        if (path.length > 0 && trailingSeparator)
            path += "/";
        if (isAbsolute)
            return `/${path}`;
        return path;
    }
    exports.normalize = normalize;
    function isAbsolute(path) {
        utils_ts_2.assertPath(path);
        return path.length > 0 && path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
    }
    exports.isAbsolute = isAbsolute;
    function join(...paths) {
        if (paths.length === 0)
            return ".";
        let joined;
        for (let i = 0, len = paths.length; i < len; ++i) {
            const path = paths[i];
            utils_ts_2.assertPath(path);
            if (path.length > 0) {
                if (!joined)
                    joined = path;
                else
                    joined += `/${path}`;
            }
        }
        if (!joined)
            return ".";
        return normalize(joined);
    }
    exports.join = join;
    function relative(from, to) {
        utils_ts_2.assertPath(from);
        utils_ts_2.assertPath(to);
        if (from === to)
            return "";
        from = resolve(from);
        to = resolve(to);
        if (from === to)
            return "";
        // Trim any leading backslashes
        let fromStart = 1;
        const fromEnd = from.length;
        for (; fromStart < fromEnd; ++fromStart) {
            if (from.charCodeAt(fromStart) !== constants_ts_3.CHAR_FORWARD_SLASH)
                break;
        }
        const fromLen = fromEnd - fromStart;
        // Trim any leading backslashes
        let toStart = 1;
        const toEnd = to.length;
        for (; toStart < toEnd; ++toStart) {
            if (to.charCodeAt(toStart) !== constants_ts_3.CHAR_FORWARD_SLASH)
                break;
        }
        const toLen = toEnd - toStart;
        // Compare paths to find the longest common path from root
        const length = fromLen < toLen ? fromLen : toLen;
        let lastCommonSep = -1;
        let i = 0;
        for (; i <= length; ++i) {
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                        // We get here if `from` is the exact base path for `to`.
                        // For example: from='/foo/bar'; to='/foo/bar/baz'
                        return to.slice(toStart + i + 1);
                    }
                    else if (i === 0) {
                        // We get here if `from` is the root
                        // For example: from='/'; to='/foo'
                        return to.slice(toStart + i);
                    }
                }
                else if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                        // We get here if `to` is the exact base path for `from`.
                        // For example: from='/foo/bar/baz'; to='/foo/bar'
                        lastCommonSep = i;
                    }
                    else if (i === 0) {
                        // We get here if `to` is the root.
                        // For example: from='/foo'; to='/'
                        lastCommonSep = 0;
                    }
                }
                break;
            }
            const fromCode = from.charCodeAt(fromStart + i);
            const toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
                break;
            else if (fromCode === constants_ts_3.CHAR_FORWARD_SLASH)
                lastCommonSep = i;
        }
        let out = "";
        // Generate the relative path based on the path difference between `to`
        // and `from`
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                if (out.length === 0)
                    out += "..";
                else
                    out += "/..";
            }
        }
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0)
            return out + to.slice(toStart + lastCommonSep);
        else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === constants_ts_3.CHAR_FORWARD_SLASH)
                ++toStart;
            return to.slice(toStart);
        }
    }
    exports.relative = relative;
    function toNamespacedPath(path) {
        // Non-op on posix systems
        return path;
    }
    exports.toNamespacedPath = toNamespacedPath;
    function dirname(path) {
        utils_ts_2.assertPath(path);
        if (path.length === 0)
            return ".";
        const hasRoot = path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
        let end = -1;
        let matchedSlash = true;
        for (let i = path.length - 1; i >= 1; --i) {
            if (path.charCodeAt(i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            }
            else {
                // We saw the first non-path separator
                matchedSlash = false;
            }
        }
        if (end === -1)
            return hasRoot ? "/" : ".";
        if (hasRoot && end === 1)
            return "//";
        return path.slice(0, end);
    }
    exports.dirname = dirname;
    function basename(path, ext = "") {
        if (ext !== undefined && typeof ext !== "string")
            throw new TypeError('"ext" argument must be a string');
        utils_ts_2.assertPath(path);
        let start = 0;
        let end = -1;
        let matchedSlash = true;
        let i;
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
                return "";
            let extIdx = ext.length - 1;
            let firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= 0; --i) {
                const code = path.charCodeAt(i);
                if (code === constants_ts_3.CHAR_FORWARD_SLASH) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else {
                    if (firstNonSlashEnd === -1) {
                        // We saw the first non-path separator, remember this index in case
                        // we need it if the extension ends up not matching
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        // Try to match the explicit extension
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                // We matched the extension, so mark this as the end of our path
                                // component
                                end = i;
                            }
                        }
                        else {
                            // Extension does not match, so our result is the entire path
                            // component
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end)
                end = firstNonSlashEnd;
            else if (end === -1)
                end = path.length;
            return path.slice(start, end);
        }
        else {
            for (i = path.length - 1; i >= 0; --i) {
                if (path.charCodeAt(i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1)
                return "";
            return path.slice(start, end);
        }
    }
    exports.basename = basename;
    function extname(path) {
        utils_ts_2.assertPath(path);
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        for (let i = path.length - 1; i >= 0; --i) {
            const code = path.charCodeAt(i);
            if (code === constants_ts_3.CHAR_FORWARD_SLASH) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === constants_ts_3.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            return "";
        }
        return path.slice(startDot, end);
    }
    exports.extname = extname;
    function format(pathObject) {
        /* eslint-disable max-len */
        if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
        }
        return utils_ts_2._format("/", pathObject);
    }
    exports.format = format;
    function parse(path) {
        utils_ts_2.assertPath(path);
        const ret = { root: "", dir: "", base: "", ext: "", name: "" };
        if (path.length === 0)
            return ret;
        const isAbsolute = path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
        let start;
        if (isAbsolute) {
            ret.root = "/";
            start = 1;
        }
        else {
            start = 0;
        }
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        let i = path.length - 1;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        // Get non-dir info
        for (; i >= start; --i) {
            const code = path.charCodeAt(i);
            if (code === constants_ts_3.CHAR_FORWARD_SLASH) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === constants_ts_3.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            if (end !== -1) {
                if (startPart === 0 && isAbsolute) {
                    ret.base = ret.name = path.slice(1, end);
                }
                else {
                    ret.base = ret.name = path.slice(startPart, end);
                }
            }
        }
        else {
            if (startPart === 0 && isAbsolute) {
                ret.name = path.slice(1, startDot);
                ret.base = path.slice(1, end);
            }
            else {
                ret.name = path.slice(startPart, startDot);
                ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
        }
        if (startPart > 0)
            ret.dir = path.slice(0, startPart - 1);
        else if (isAbsolute)
            ret.dir = "/";
        return ret;
    }
    exports.parse = parse;
});
// This file is ported from globrex@0.1.2
// MIT License
// Copyright (c) 2018 Terkel Gjervig Nielsen
define("https://deno.land/std@v0.24.0/path/globrex", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const isWin = Deno.build.os === "win";
    const SEP = isWin ? `(\\\\+|\\/)` : `\\/`;
    const SEP_ESC = isWin ? `\\\\` : `/`;
    const SEP_RAW = isWin ? `\\` : `/`;
    const GLOBSTAR = `((?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
    const WILDCARD = `([^${SEP_ESC}/]*)`;
    const GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
    const WILDCARD_SEGMENT = `([^${SEP_ESC}/]*)`;
    /**
     * Convert any glob pattern to a JavaScript Regexp object
     * @param glob Glob pattern to convert
     * @param opts Configuration object
     * @param [opts.extended=false] Support advanced ext globbing
     * @param [opts.globstar=false] Support globstar
     * @param [opts.strict=true] be laissez faire about mutiple slashes
     * @param [opts.filepath=""] Parse as filepath for extra path related features
     * @param [opts.flags=""] RegExp globs
     * @returns Converted object with string, segments and RegExp object
     */
    function globrex(glob, { extended = false, globstar = false, strict = false, filepath = false, flags = "" } = {}) {
        let regex = "";
        let segment = "";
        let pathRegexStr = "";
        const pathSegments = [];
        // If we are doing extended matching, this boolean is true when we are inside
        // a group (eg {*.html,*.js}), and false otherwise.
        let inGroup = false;
        let inRange = false;
        // extglob stack. Keep track of scope
        const ext = [];
        // Helper function to build string and segments
        function add(str, options = { split: false, last: false, only: "" }) {
            const { split, last, only } = options;
            if (only !== "path")
                regex += str;
            if (filepath && only !== "regex") {
                pathRegexStr += str.match(new RegExp(`^${SEP}$`)) ? SEP : str;
                if (split) {
                    if (last)
                        segment += str;
                    if (segment !== "") {
                        // change it 'includes'
                        if (!flags.includes("g"))
                            segment = `^${segment}$`;
                        pathSegments.push(new RegExp(segment, flags));
                    }
                    segment = "";
                }
                else {
                    segment += str;
                }
            }
        }
        let c, n;
        for (let i = 0; i < glob.length; i++) {
            c = glob[i];
            n = glob[i + 1];
            if (["\\", "$", "^", ".", "="].includes(c)) {
                add(`\\${c}`);
                continue;
            }
            if (c === "/") {
                add(`\\${c}`, { split: true });
                if (n === "/" && !strict)
                    regex += "?";
                continue;
            }
            if (c === "(") {
                if (ext.length) {
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === ")") {
                if (ext.length) {
                    add(c);
                    const type = ext.pop();
                    if (type === "@") {
                        add("{1}");
                    }
                    else if (type === "!") {
                        add("([^/]*)");
                    }
                    else {
                        add(type);
                    }
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "|") {
                if (ext.length) {
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "+") {
                if (n === "(" && extended) {
                    ext.push(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "@" && extended) {
                if (n === "(") {
                    ext.push(c);
                    continue;
                }
            }
            if (c === "!") {
                if (extended) {
                    if (inRange) {
                        add("^");
                        continue;
                    }
                    if (n === "(") {
                        ext.push(c);
                        add("(?!");
                        i++;
                        continue;
                    }
                    add(`\\${c}`);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "?") {
                if (extended) {
                    if (n === "(") {
                        ext.push(c);
                    }
                    else {
                        add(".");
                    }
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "[") {
                if (inRange && n === ":") {
                    i++; // skip [
                    let value = "";
                    while (glob[++i] !== ":")
                        value += glob[i];
                    if (value === "alnum")
                        add("(\\w|\\d)");
                    else if (value === "space")
                        add("\\s");
                    else if (value === "digit")
                        add("\\d");
                    i++; // skip last ]
                    continue;
                }
                if (extended) {
                    inRange = true;
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "]") {
                if (extended) {
                    inRange = false;
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "{") {
                if (extended) {
                    inGroup = true;
                    add("(");
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "}") {
                if (extended) {
                    inGroup = false;
                    add(")");
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === ",") {
                if (inGroup) {
                    add("|");
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "*") {
                if (n === "(" && extended) {
                    ext.push(c);
                    continue;
                }
                // Move over all consecutive "*"'s.
                // Also store the previous and next characters
                const prevChar = glob[i - 1];
                let starCount = 1;
                while (glob[i + 1] === "*") {
                    starCount++;
                    i++;
                }
                const nextChar = glob[i + 1];
                if (!globstar) {
                    // globstar is disabled, so treat any number of "*" as one
                    add(".*");
                }
                else {
                    // globstar is enabled, so determine if this is a globstar segment
                    const isGlobstar = starCount > 1 && // multiple "*"'s
                        // from the start of the segment
                        [SEP_RAW, "/", undefined].includes(prevChar) &&
                        // to the end of the segment
                        [SEP_RAW, "/", undefined].includes(nextChar);
                    if (isGlobstar) {
                        // it's a globstar, so match zero or more path segments
                        add(GLOBSTAR, { only: "regex" });
                        add(GLOBSTAR_SEGMENT, { only: "path", last: true, split: true });
                        i++; // move over the "/"
                    }
                    else {
                        // it's not a globstar, so only match one path segment
                        add(WILDCARD, { only: "regex" });
                        add(WILDCARD_SEGMENT, { only: "path" });
                    }
                }
                continue;
            }
            add(c);
        }
        // When regexp 'g' flag is specified don't
        // constrain the regular expression with ^ & $
        if (!flags.includes("g")) {
            regex = `^${regex}$`;
            segment = `^${segment}$`;
            if (filepath)
                pathRegexStr = `^${pathRegexStr}$`;
        }
        const result = { regex: new RegExp(regex, flags) };
        // Push the last segment
        if (filepath) {
            pathSegments.push(new RegExp(segment, flags));
            result.path = {
                regex: new RegExp(pathRegexStr, flags),
                segments: pathSegments,
                globstar: new RegExp(!flags.includes("g") ? `^${GLOBSTAR_SEGMENT}$` : GLOBSTAR_SEGMENT, flags)
            };
        }
        return result;
    }
    exports.globrex = globrex;
});
define("https://deno.land/std@v0.24.0/path/glob", ["require", "exports", "https://deno.land/std@v0.24.0/path/constants", "https://deno.land/std@v0.24.0/path/globrex", "https://deno.land/std@v0.24.0/path/mod"], function (require, exports, constants_ts_4, globrex_ts_1, mod_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const { DenoError, ErrorKind } = Deno;
    /**
     * Generate a regex based on glob pattern and options
     * This was meant to be using the the `fs.walk` function
     * but can be used anywhere else.
     * Examples:
     *
     *     Looking for all the `ts` files:
     *     walkSync(".", {
     *       match: [globToRegExp("*.ts")]
     *     })
     *
     *     Looking for all the `.json` files in any subfolder:
     *     walkSync(".", {
     *       match: [globToRegExp(join("a", "**", "*.json"),{
     *         flags: "g",
     *         extended: true,
     *         globstar: true
     *       })]
     *     })
     *
     * @param glob - Glob pattern to be used
     * @param options - Specific options for the glob pattern
     * @returns A RegExp for the glob pattern
     */
    function globToRegExp(glob, options = {}) {
        const result = globrex_ts_1.globrex(glob, { ...options, strict: false, filepath: true });
        return result.path.regex;
    }
    exports.globToRegExp = globToRegExp;
    /** Test whether the given string is a glob */
    function isGlob(str) {
        const chars = { "{": "}", "(": ")", "[": "]" };
        /* eslint-disable-next-line max-len */
        const regex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
        if (str === "") {
            return false;
        }
        let match;
        while ((match = regex.exec(str))) {
            if (match[2])
                return true;
            let idx = match.index + match[0].length;
            // if an open bracket/brace/paren is escaped,
            // set the index to the next closing character
            const open = match[1];
            const close = open ? chars[open] : null;
            if (open && close) {
                const n = str.indexOf(close, idx);
                if (n !== -1) {
                    idx = n + 1;
                }
            }
            str = str.slice(idx);
        }
        return false;
    }
    exports.isGlob = isGlob;
    /** Like normalize(), but doesn't collapse "**\/.." when `globstar` is true. */
    function normalizeGlob(glob, { globstar = false } = {}) {
        if (!!glob.match(/\0/g)) {
            throw new DenoError(ErrorKind.InvalidPath, `Glob contains invalid characters: "${glob}"`);
        }
        if (!globstar) {
            return mod_ts_1.normalize(glob);
        }
        const s = constants_ts_4.SEP_PATTERN.source;
        const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
        return mod_ts_1.normalize(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
    }
    exports.normalizeGlob = normalizeGlob;
    /** Like join(), but doesn't collapse "**\/.." when `globstar` is true. */
    function joinGlobs(globs, { extended = false, globstar = false } = {}) {
        if (!globstar || globs.length == 0) {
            return mod_ts_1.join(...globs);
        }
        if (globs.length === 0)
            return ".";
        let joined;
        for (const glob of globs) {
            const path = glob;
            if (path.length > 0) {
                if (!joined)
                    joined = path;
                else
                    joined += `${constants_ts_4.SEP}${path}`;
            }
        }
        if (!joined)
            return ".";
        return normalizeGlob(joined, { extended, globstar });
    }
    exports.joinGlobs = joinGlobs;
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
define("https://deno.land/std@v0.24.0/path/mod", ["require", "exports", "https://deno.land/std@v0.24.0/path/win32", "https://deno.land/std@v0.24.0/path/posix", "https://deno.land/std@v0.24.0/path/constants", "https://deno.land/std@v0.24.0/path/constants", "https://deno.land/std@v0.24.0/path/glob", "https://deno.land/std@v0.24.0/path/globrex"], function (require, exports, _win32, _posix, constants_ts_5, constants_ts_6, glob_ts_1, globrex_ts_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    _win32 = __importStar(_win32);
    _posix = __importStar(_posix);
    const path = constants_ts_5.isWindows ? _win32 : _posix;
    exports.win32 = _win32;
    exports.posix = _posix;
    exports.resolve = path.resolve;
    exports.normalize = path.normalize;
    exports.isAbsolute = path.isAbsolute;
    exports.join = path.join;
    exports.relative = path.relative;
    exports.toNamespacedPath = path.toNamespacedPath;
    exports.dirname = path.dirname;
    exports.basename = path.basename;
    exports.extname = path.extname;
    exports.format = path.format;
    exports.parse = path.parse;
    exports.sep = path.sep;
    exports.delimiter = path.delimiter;
    exports.EOL = constants_ts_6.EOL;
    exports.SEP = constants_ts_6.SEP;
    exports.SEP_PATTERN = constants_ts_6.SEP_PATTERN;
    exports.isWindows = constants_ts_6.isWindows;
    __export(glob_ts_1);
    __export(globrex_ts_2);
});
define("https://deno.land/std@v0.24.0/strings/encode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** A default TextEncoder instance */
    exports.encoder = new TextEncoder();
    /** Shorthand for new TextEncoder().encode() */
    function encode(input) {
        return exports.encoder.encode(input);
    }
    exports.encode = encode;
});
define("https://deno.land/std@v0.24.0/strings/decode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** A default TextDecoder instance */
    exports.decoder = new TextDecoder();
    /** Shorthand for new TextDecoder().decode() */
    function decode(input) {
        return exports.decoder.decode(input);
    }
    exports.decode = decode;
});
// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
define("https://deno.land/std@v0.24.0/strings/pad", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Pad helper for strings.
     * Input string is processed to output a string with a minimal length.
     * If the parameter `strict` is set to true, the output string length
     * is equal to the `strLen` parameter.
     * Example:
     *
     *     pad("deno", 6, { char: "*", side: "left" }) // output : "**deno"
     *     pad("deno", 6, { char: "*", side: "right"}) // output : "deno**"
     *     pad("denosorusrex", 6 {
     *       char: "*",
     *       side: "left",
     *       strict: true,
     *       strictSide: "right",
     *       strictChar: "..."
     *     }) // output : "den..."
     *
     * @param input Input string
     * @param strLen Output string lenght
     * @param opts Configuration object
     * @param [opts.char=" "] Character used to fill in
     * @param [opts.side="left"] Side to fill in
     * @param [opts.strict=false] Flag to truncate the string if length > strLen
     * @param [opts.strictChar=""] Character to add if string is truncated
     * @param [opts.strictSide="right"] Side to truncate
     */
    function pad(input, strLen, opts = {
        char: " ",
        strict: false,
        side: "left",
        strictChar: "",
        strictSide: "right"
    }) {
        let out = input;
        const outL = out.length;
        if (outL < strLen) {
            if (!opts.side || opts.side === "left") {
                out = out.padStart(strLen, opts.char);
            }
            else {
                out = out.padEnd(strLen, opts.char);
            }
        }
        else if (opts.strict && outL > strLen) {
            const addChar = opts.strictChar ? opts.strictChar : "";
            if (opts.strictSide === "left") {
                let toDrop = outL - strLen;
                if (opts.strictChar) {
                    toDrop += opts.strictChar.length;
                }
                out = `${addChar}${out.slice(toDrop, outL)}`;
            }
            else {
                out = `${out.substring(0, strLen - addChar.length)}${addChar}`;
            }
        }
        return out;
    }
    exports.pad = pad;
});
// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
define("https://deno.land/std@v0.24.0/strings/mod", ["require", "exports", "https://deno.land/std@v0.24.0/strings/encode", "https://deno.land/std@v0.24.0/strings/decode", "https://deno.land/std@v0.24.0/strings/pad"], function (require, exports, encode_ts_1, decode_ts_1, pad_ts_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(encode_ts_1);
    __export(decode_ts_1);
    __export(pad_ts_1);
});
define("https://deno.land/std@v0.24.0/io/util", ["require", "exports", "https://deno.land/std@v0.24.0/path/mod", "https://deno.land/std@v0.24.0/strings/mod"], function (require, exports, path, mod_ts_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    path = __importStar(path);
    // Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
    const { Buffer, mkdir, open } = Deno;
    // `off` is the offset into `dst` where it will at which to begin writing values
    // from `src`.
    // Returns the number of bytes copied.
    function copyBytes(dst, src, off = 0) {
        off = Math.max(0, Math.min(off, dst.byteLength));
        const r = dst.byteLength - off;
        if (src.byteLength > r) {
            src = src.subarray(0, r);
        }
        dst.set(src, off);
        return src.byteLength;
    }
    exports.copyBytes = copyBytes;
    function charCode(s) {
        return s.charCodeAt(0);
    }
    exports.charCode = charCode;
    function stringsReader(s) {
        return new Buffer(mod_ts_2.encode(s).buffer);
    }
    exports.stringsReader = stringsReader;
    /** Create or open a temporal file at specified directory with prefix and
     *  postfix
     * */
    async function tempFile(dir, opts = { prefix: "", postfix: "" }) {
        const r = Math.floor(Math.random() * 1000000);
        const filepath = path.resolve(`${dir}/${opts.prefix || ""}${r}${opts.postfix || ""}`);
        await mkdir(path.dirname(filepath), true);
        const file = await open(filepath, "a");
        return { file, filepath };
    }
    exports.tempFile = tempFile;
});
define("https://deno.land/std@v0.24.0/fmt/colors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
    /**
     * A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
     * on npm.
     *
     * ```
     * import { bgBlue, red, bold } from "https://deno.land/std/fmt/colors.ts";
     * console.log(bgBlue(red(bold("Hello world!"))));
     * ```
     *
     * This module supports `NO_COLOR` environmental variable disabling any coloring
     * if `NO_COLOR` is set.
     */
    const { noColor } = Deno;
    let enabled = !noColor;
    function setEnabled(value) {
        if (noColor) {
            return;
        }
        enabled = value;
    }
    exports.setEnabled = setEnabled;
    function getEnabled() {
        return enabled;
    }
    exports.getEnabled = getEnabled;
    function code(open, close) {
        return {
            open: `\x1b[${open}m`,
            close: `\x1b[${close}m`,
            regexp: new RegExp(`\\x1b\\[${close}m`, "g")
        };
    }
    function run(str, code) {
        return enabled
            ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
            : str;
    }
    function reset(str) {
        return run(str, code(0, 0));
    }
    exports.reset = reset;
    function bold(str) {
        return run(str, code(1, 22));
    }
    exports.bold = bold;
    function dim(str) {
        return run(str, code(2, 22));
    }
    exports.dim = dim;
    function italic(str) {
        return run(str, code(3, 23));
    }
    exports.italic = italic;
    function underline(str) {
        return run(str, code(4, 24));
    }
    exports.underline = underline;
    function inverse(str) {
        return run(str, code(7, 27));
    }
    exports.inverse = inverse;
    function hidden(str) {
        return run(str, code(8, 28));
    }
    exports.hidden = hidden;
    function strikethrough(str) {
        return run(str, code(9, 29));
    }
    exports.strikethrough = strikethrough;
    function black(str) {
        return run(str, code(30, 39));
    }
    exports.black = black;
    function red(str) {
        return run(str, code(31, 39));
    }
    exports.red = red;
    function green(str) {
        return run(str, code(32, 39));
    }
    exports.green = green;
    function yellow(str) {
        return run(str, code(33, 39));
    }
    exports.yellow = yellow;
    function blue(str) {
        return run(str, code(34, 39));
    }
    exports.blue = blue;
    function magenta(str) {
        return run(str, code(35, 39));
    }
    exports.magenta = magenta;
    function cyan(str) {
        return run(str, code(36, 39));
    }
    exports.cyan = cyan;
    function white(str) {
        return run(str, code(37, 39));
    }
    exports.white = white;
    function gray(str) {
        return run(str, code(90, 39));
    }
    exports.gray = gray;
    function bgBlack(str) {
        return run(str, code(40, 49));
    }
    exports.bgBlack = bgBlack;
    function bgRed(str) {
        return run(str, code(41, 49));
    }
    exports.bgRed = bgRed;
    function bgGreen(str) {
        return run(str, code(42, 49));
    }
    exports.bgGreen = bgGreen;
    function bgYellow(str) {
        return run(str, code(43, 49));
    }
    exports.bgYellow = bgYellow;
    function bgBlue(str) {
        return run(str, code(44, 49));
    }
    exports.bgBlue = bgBlue;
    function bgMagenta(str) {
        return run(str, code(45, 49));
    }
    exports.bgMagenta = bgMagenta;
    function bgCyan(str) {
        return run(str, code(46, 49));
    }
    exports.bgCyan = bgCyan;
    function bgWhite(str) {
        return run(str, code(47, 49));
    }
    exports.bgWhite = bgWhite;
});
define("https://deno.land/std@v0.24.0/testing/diff", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DiffType;
    (function (DiffType) {
        DiffType["removed"] = "removed";
        DiffType["common"] = "common";
        DiffType["added"] = "added";
    })(DiffType = exports.DiffType || (exports.DiffType = {}));
    const REMOVED = 1;
    const COMMON = 2;
    const ADDED = 3;
    function createCommon(A, B, reverse) {
        const common = [];
        if (A.length === 0 || B.length === 0)
            return [];
        for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
            if (A[reverse ? A.length - i - 1 : i] === B[reverse ? B.length - i - 1 : i]) {
                common.push(A[reverse ? A.length - i - 1 : i]);
            }
            else {
                return common;
            }
        }
        return common;
    }
    function diff(A, B) {
        const prefixCommon = createCommon(A, B);
        const suffixCommon = createCommon(A.slice(prefixCommon.length), B.slice(prefixCommon.length), true).reverse();
        A = suffixCommon.length
            ? A.slice(prefixCommon.length, -suffixCommon.length)
            : A.slice(prefixCommon.length);
        B = suffixCommon.length
            ? B.slice(prefixCommon.length, -suffixCommon.length)
            : B.slice(prefixCommon.length);
        const swapped = B.length > A.length;
        [A, B] = swapped ? [B, A] : [A, B];
        const M = A.length;
        const N = B.length;
        if (!M && !N && !suffixCommon.length && !prefixCommon.length)
            return [];
        if (!N) {
            return [
                ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
                ...A.map((a) => ({
                    type: swapped ? DiffType.added : DiffType.removed,
                    value: a
                })),
                ...suffixCommon.map((c) => ({ type: DiffType.common, value: c }))
            ];
        }
        const offset = N;
        const delta = M - N;
        const size = M + N + 1;
        const fp = new Array(size).fill({ y: -1 });
        /**
         * INFO:
         * This buffer is used to save memory and improve performance.
         * The first half is used to save route and last half is used to save diff
         * type.
         * This is because, when I kept new uint8array area to save type,performance
         * worsened.
         */
        const routes = new Uint32Array((M * N + size + 1) * 2);
        const diffTypesPtrOffset = routes.length / 2;
        let ptr = 0;
        let p = -1;
        function backTrace(A, B, current, swapped) {
            const M = A.length;
            const N = B.length;
            const result = [];
            let a = M - 1;
            let b = N - 1;
            let j = routes[current.id];
            let type = routes[current.id + diffTypesPtrOffset];
            while (true) {
                if (!j && !type)
                    break;
                const prev = j;
                if (type === REMOVED) {
                    result.unshift({
                        type: swapped ? DiffType.removed : DiffType.added,
                        value: B[b]
                    });
                    b -= 1;
                }
                else if (type === ADDED) {
                    result.unshift({
                        type: swapped ? DiffType.added : DiffType.removed,
                        value: A[a]
                    });
                    a -= 1;
                }
                else {
                    result.unshift({ type: DiffType.common, value: A[a] });
                    a -= 1;
                    b -= 1;
                }
                j = routes[prev];
                type = routes[prev + diffTypesPtrOffset];
            }
            return result;
        }
        function createFP(slide, down, k, M) {
            if (slide && slide.y === -1 && down && down.y === -1)
                return { y: 0, id: 0 };
            if ((down && down.y === -1) ||
                k === M ||
                (slide && slide.y) > (down && down.y) + 1) {
                const prev = slide.id;
                ptr++;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = ADDED;
                return { y: slide.y, id: ptr };
            }
            else {
                const prev = down.id;
                ptr++;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = REMOVED;
                return { y: down.y + 1, id: ptr };
            }
        }
        function snake(k, slide, down, _offset, A, B) {
            const M = A.length;
            const N = B.length;
            if (k < -N || M < k)
                return { y: -1, id: -1 };
            const fp = createFP(slide, down, k, M);
            while (fp.y + k < M && fp.y < N && A[fp.y + k] === B[fp.y]) {
                const prev = fp.id;
                ptr++;
                fp.id = ptr;
                fp.y += 1;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = COMMON;
            }
            return fp;
        }
        while (fp[delta + offset].y < N) {
            p = p + 1;
            for (let k = -p; k < delta; ++k) {
                fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
            }
            for (let k = delta + p; k > delta; --k) {
                fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
            }
            fp[delta + offset] = snake(delta, fp[delta - 1 + offset], fp[delta + 1 + offset], offset, A, B);
        }
        return [
            ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
            ...backTrace(A, B, fp[delta + offset], swapped),
            ...suffixCommon.map((c) => ({ type: DiffType.common, value: c }))
        ];
    }
    exports.default = diff;
});
define("https://deno.land/std@v0.24.0/testing/format", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const toString = Object.prototype.toString;
    const toISOString = Date.prototype.toISOString;
    const errorToString = Error.prototype.toString;
    const regExpToString = RegExp.prototype.toString;
    const symbolToString = Symbol.prototype.toString;
    const DEFAULT_OPTIONS = {
        callToJSON: true,
        escapeRegex: false,
        escapeString: true,
        indent: 2,
        maxDepth: Infinity,
        min: false,
        printFunctionName: true
    };
    /**
     * Explicitly comparing typeof constructor to function avoids undefined as name
     * when mock identity-obj-proxy returns the key as the value for any key.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getConstructorName = (val) => (typeof val.constructor === "function" && val.constructor.name) || "Object";
    /* global window */
    /** Is val is equal to global window object?
     *  Works even if it does not exist :)
     * */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isWindow = (val) => typeof window !== "undefined" && val === window;
    const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
    function isToStringedArrayType(toStringed) {
        return (toStringed === "[object Array]" ||
            toStringed === "[object ArrayBuffer]" ||
            toStringed === "[object DataView]" ||
            toStringed === "[object Float32Array]" ||
            toStringed === "[object Float64Array]" ||
            toStringed === "[object Int8Array]" ||
            toStringed === "[object Int16Array]" ||
            toStringed === "[object Int32Array]" ||
            toStringed === "[object Uint8Array]" ||
            toStringed === "[object Uint8ClampedArray]" ||
            toStringed === "[object Uint16Array]" ||
            toStringed === "[object Uint32Array]");
    }
    function printNumber(val) {
        return Object.is(val, -0) ? "-0" : String(val);
    }
    function printFunction(val, printFunctionName) {
        if (!printFunctionName) {
            return "[Function]";
        }
        return "[Function " + (val.name || "anonymous") + "]";
    }
    function printSymbol(val) {
        return symbolToString.call(val).replace(SYMBOL_REGEXP, "Symbol($1)");
    }
    function printError(val) {
        return "[" + errorToString.call(val) + "]";
    }
    /**
     * The first port of call for printing an object, handles most of the
     * data-types in JS.
     */
    function printBasicValue(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val, { printFunctionName, escapeRegex, escapeString }) {
        if (val === true || val === false) {
            return String(val);
        }
        if (val === undefined) {
            return "undefined";
        }
        if (val === null) {
            return "null";
        }
        const typeOf = typeof val;
        if (typeOf === "number") {
            return printNumber(val);
        }
        if (typeOf === "string") {
            if (escapeString) {
                return `"${val.replace(/"|\\/g, "\\$&")}"`;
            }
            return `"${val}"`;
        }
        if (typeOf === "function") {
            return printFunction(val, printFunctionName);
        }
        if (typeOf === "symbol") {
            return printSymbol(val);
        }
        const toStringed = toString.call(val);
        if (toStringed === "[object WeakMap]") {
            return "WeakMap {}";
        }
        if (toStringed === "[object WeakSet]") {
            return "WeakSet {}";
        }
        if (toStringed === "[object Function]" ||
            toStringed === "[object GeneratorFunction]") {
            return printFunction(val, printFunctionName);
        }
        if (toStringed === "[object Symbol]") {
            return printSymbol(val);
        }
        if (toStringed === "[object Date]") {
            return isNaN(+val) ? "Date { NaN }" : toISOString.call(val);
        }
        if (toStringed === "[object Error]") {
            return printError(val);
        }
        if (toStringed === "[object RegExp]") {
            if (escapeRegex) {
                // https://github.com/benjamingr/RegExp.escape/blob/master/polyfill.js
                return regExpToString.call(val).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
            }
            return regExpToString.call(val);
        }
        if (val instanceof Error) {
            return printError(val);
        }
        return null;
    }
    function printer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val, config, indentation, depth, refs, hasCalledToJSON) {
        const basicResult = printBasicValue(val, config);
        if (basicResult !== null) {
            return basicResult;
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return printComplexValue(val, config, indentation, depth, refs, hasCalledToJSON);
    }
    /**
     * Return items (for example, of an array)
     * with spacing, indentation, and comma
     * without surrounding punctuation (for example, brackets)
     */
    function printListItems(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list, config, indentation, depth, refs, printer) {
        let result = "";
        if (list.length) {
            result += config.spacingOuter;
            const indentationNext = indentation + config.indent;
            for (let i = 0; i < list.length; i++) {
                result +=
                    indentationNext +
                        printer(list[i], config, indentationNext, depth, refs);
                if (i < list.length - 1) {
                    result += "," + config.spacingInner;
                }
                else if (!config.min) {
                    result += ",";
                }
            }
            result += config.spacingOuter + indentation;
        }
        return result;
    }
    /**
     * Return entries (for example, of a map)
     * with spacing, indentation, and comma
     * without surrounding punctuation (for example, braces)
     */
    function printIteratorEntries(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iterator, config, indentation, depth, refs, printer, 
    // Too bad, so sad that separator for ECMAScript Map has been ' => '
    // What a distracting diff if you change a data structure to/from
    // ECMAScript Object or Immutable.Map/OrderedMap which use the default.
    separator = ": ") {
        let result = "";
        let current = iterator.next();
        if (!current.done) {
            result += config.spacingOuter;
            const indentationNext = indentation + config.indent;
            while (!current.done) {
                const name = printer(current.value[0], config, indentationNext, depth, refs);
                const value = printer(current.value[1], config, indentationNext, depth, refs);
                result += indentationNext + name + separator + value;
                current = iterator.next();
                if (!current.done) {
                    result += "," + config.spacingInner;
                }
                else if (!config.min) {
                    result += ",";
                }
            }
            result += config.spacingOuter + indentation;
        }
        return result;
    }
    /**
     * Return values (for example, of a set)
     * with spacing, indentation, and comma
     * without surrounding punctuation (braces or brackets)
     */
    function printIteratorValues(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iterator, config, indentation, depth, refs, printer) {
        let result = "";
        let current = iterator.next();
        if (!current.done) {
            result += config.spacingOuter;
            const indentationNext = indentation + config.indent;
            while (!current.done) {
                result +=
                    indentationNext +
                        printer(current.value, config, indentationNext, depth, refs);
                current = iterator.next();
                if (!current.done) {
                    result += "," + config.spacingInner;
                }
                else if (!config.min) {
                    result += ",";
                }
            }
            result += config.spacingOuter + indentation;
        }
        return result;
    }
    const getKeysOfEnumerableProperties = (object) => {
        const keys = Object.keys(object).sort();
        if (Object.getOwnPropertySymbols) {
            Object.getOwnPropertySymbols(object).forEach((symbol) => {
                if (Object.getOwnPropertyDescriptor(object, symbol).enumerable) {
                    keys.push(symbol);
                }
            });
        }
        return keys;
    };
    /**
     * Return properties of an object
     * with spacing, indentation, and comma
     * without surrounding punctuation (for example, braces)
     */
    function printObjectProperties(val, config, indentation, depth, refs, printer) {
        let result = "";
        const keys = getKeysOfEnumerableProperties(val);
        if (keys.length) {
            result += config.spacingOuter;
            const indentationNext = indentation + config.indent;
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const name = printer(key, config, indentationNext, depth, refs);
                const value = printer(val[key], config, indentationNext, depth, refs);
                result += indentationNext + name + ": " + value;
                if (i < keys.length - 1) {
                    result += "," + config.spacingInner;
                }
                else if (!config.min) {
                    result += ",";
                }
            }
            result += config.spacingOuter + indentation;
        }
        return result;
    }
    /**
     * Handles more complex objects ( such as objects with circular references.
     * maps and sets etc )
     */
    function printComplexValue(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val, config, indentation, depth, refs, hasCalledToJSON) {
        if (refs.indexOf(val) !== -1) {
            return "[Circular]";
        }
        refs = refs.slice();
        refs.push(val);
        const hitMaxDepth = ++depth > config.maxDepth;
        const { min, callToJSON } = config;
        if (callToJSON &&
            !hitMaxDepth &&
            val.toJSON &&
            typeof val.toJSON === "function" &&
            !hasCalledToJSON) {
            return printer(val.toJSON(), config, indentation, depth, refs, true);
        }
        const toStringed = toString.call(val);
        if (toStringed === "[object Arguments]") {
            return hitMaxDepth
                ? "[Arguments]"
                : (min ? "" : "Arguments ") +
                    "[" +
                    printListItems(val, config, indentation, depth, refs, printer) +
                    "]";
        }
        if (isToStringedArrayType(toStringed)) {
            return hitMaxDepth
                ? `[${val.constructor.name}]`
                : (min ? "" : `${val.constructor.name} `) +
                    "[" +
                    printListItems(val, config, indentation, depth, refs, printer) +
                    "]";
        }
        if (toStringed === "[object Map]") {
            return hitMaxDepth
                ? "[Map]"
                : "Map {" +
                    printIteratorEntries(val.entries(), config, indentation, depth, refs, printer, " => ") +
                    "}";
        }
        if (toStringed === "[object Set]") {
            return hitMaxDepth
                ? "[Set]"
                : "Set {" +
                    printIteratorValues(val.values(), config, indentation, depth, refs, printer) +
                    "}";
        }
        // Avoid failure to serialize global window object in jsdom test environment.
        // For example, not even relevant if window is prop of React element.
        return hitMaxDepth || isWindow(val)
            ? "[" + getConstructorName(val) + "]"
            : (min ? "" : getConstructorName(val) + " ") +
                "{" +
                printObjectProperties(val, config, indentation, depth, refs, printer) +
                "}";
    }
    // TODO this is better done with `.padStart()`
    function createIndent(indent) {
        return new Array(indent + 1).join(" ");
    }
    const getConfig = (options) => ({
        ...options,
        indent: options.min ? "" : createIndent(options.indent),
        spacingInner: options.min ? " " : "\n",
        spacingOuter: options.min ? "" : "\n"
    });
    /**
     * Returns a presentation string of your `val` object
     * @param val any potential JavaScript object
     * @param options Custom settings
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function format(val, options = {}) {
        const opts = {
            ...DEFAULT_OPTIONS,
            ...options
        };
        const basicResult = printBasicValue(val, opts);
        if (basicResult !== null) {
            return basicResult;
        }
        return printComplexValue(val, getConfig(opts), "", 0, []);
    }
    exports.format = format;
});
define("https://deno.land/std@v0.24.0/testing/asserts", ["require", "exports", "https://deno.land/std@v0.24.0/fmt/colors", "https://deno.land/std@v0.24.0/testing/diff", "https://deno.land/std@v0.24.0/testing/format"], function (require, exports, colors_ts_1, diff_ts_1, format_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    diff_ts_1 = __importStar(diff_ts_1);
    const CAN_NOT_DISPLAY = "[Cannot display]";
    class AssertionError extends Error {
        constructor(message) {
            super(message);
            this.name = "AssertionError";
        }
    }
    exports.AssertionError = AssertionError;
    function createStr(v) {
        try {
            return format_ts_1.format(v);
        }
        catch (e) {
            return colors_ts_1.red(CAN_NOT_DISPLAY);
        }
    }
    function createColor(diffType) {
        switch (diffType) {
            case diff_ts_1.DiffType.added:
                return (s) => colors_ts_1.green(colors_ts_1.bold(s));
            case diff_ts_1.DiffType.removed:
                return (s) => colors_ts_1.red(colors_ts_1.bold(s));
            default:
                return colors_ts_1.white;
        }
    }
    function createSign(diffType) {
        switch (diffType) {
            case diff_ts_1.DiffType.added:
                return "+   ";
            case diff_ts_1.DiffType.removed:
                return "-   ";
            default:
                return "    ";
        }
    }
    function buildMessage(diffResult) {
        const messages = [];
        messages.push("");
        messages.push("");
        messages.push(`    ${colors_ts_1.gray(colors_ts_1.bold("[Diff]"))} ${colors_ts_1.red(colors_ts_1.bold("Left"))} / ${colors_ts_1.green(colors_ts_1.bold("Right"))}`);
        messages.push("");
        messages.push("");
        diffResult.forEach((result) => {
            const c = createColor(result.type);
            messages.push(c(`${createSign(result.type)}${result.value}`));
        });
        messages.push("");
        return messages;
    }
    function isKeyedCollection(x) {
        return [Symbol.iterator, "size"].every(k => k in x);
    }
    function equal(c, d) {
        const seen = new Map();
        return (function compare(a, b) {
            // Have to render RegExp & Date for string comparison
            // unless it's mistreated as object
            if (a &&
                b &&
                ((a instanceof RegExp && b instanceof RegExp) ||
                    (a instanceof Date && b instanceof Date))) {
                return String(a) === String(b);
            }
            if (Object.is(a, b)) {
                return true;
            }
            if (a && typeof a === "object" && b && typeof b === "object") {
                if (seen.get(a) === b) {
                    return true;
                }
                if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
                    return false;
                }
                if (isKeyedCollection(a) && isKeyedCollection(b)) {
                    if (a.size !== b.size) {
                        return false;
                    }
                    let unmatchedEntries = a.size;
                    for (const [aKey, aValue] of a.entries()) {
                        for (const [bKey, bValue] of b.entries()) {
                            /* Given that Map keys can be references, we need
                             * to ensure that they are also deeply equal */
                            if ((aKey === aValue && bKey === bValue && compare(aKey, bKey)) ||
                                (compare(aKey, bKey) && compare(aValue, bValue))) {
                                unmatchedEntries--;
                            }
                        }
                    }
                    return unmatchedEntries === 0;
                }
                const merged = { ...a, ...b };
                for (const key in merged) {
                    if (!compare(a && a[key], b && b[key])) {
                        return false;
                    }
                }
                seen.set(a, b);
                return true;
            }
            return false;
        })(c, d);
    }
    exports.equal = equal;
    /** Make an assertion, if not `true`, then throw. */
    function assert(expr, msg = "") {
        if (!expr) {
            throw new AssertionError(msg);
        }
    }
    exports.assert = assert;
    /**
     * Make an assertion that `actual` and `expected` are equal, deeply. If not
     * deeply equal, then throw.
     */
    function assertEquals(actual, expected, msg) {
        if (equal(actual, expected)) {
            return;
        }
        let message = "";
        const actualString = createStr(actual);
        const expectedString = createStr(expected);
        try {
            const diffResult = diff_ts_1.default(actualString.split("\n"), expectedString.split("\n"));
            message = buildMessage(diffResult).join("\n");
        }
        catch (e) {
            message = `\n${colors_ts_1.red(CAN_NOT_DISPLAY)} + \n\n`;
        }
        if (msg) {
            message = msg;
        }
        throw new AssertionError(message);
    }
    exports.assertEquals = assertEquals;
    /**
     * Make an assertion that `actual` and `expected` are not equal, deeply.
     * If not then throw.
     */
    function assertNotEquals(actual, expected, msg) {
        if (!equal(actual, expected)) {
            return;
        }
        let actualString;
        let expectedString;
        try {
            actualString = String(actual);
        }
        catch (e) {
            actualString = "[Cannot display]";
        }
        try {
            expectedString = String(expected);
        }
        catch (e) {
            expectedString = "[Cannot display]";
        }
        if (!msg) {
            msg = `actual: ${actualString} expected: ${expectedString}`;
        }
        throw new AssertionError(msg);
    }
    exports.assertNotEquals = assertNotEquals;
    /**
     * Make an assertion that `actual` and `expected` are strictly equal.  If
     * not then throw.
     */
    function assertStrictEq(actual, expected, msg) {
        if (actual !== expected) {
            let actualString;
            let expectedString;
            try {
                actualString = String(actual);
            }
            catch (e) {
                actualString = "[Cannot display]";
            }
            try {
                expectedString = String(expected);
            }
            catch (e) {
                expectedString = "[Cannot display]";
            }
            if (!msg) {
                msg = `actual: ${actualString} expected: ${expectedString}`;
            }
            throw new AssertionError(msg);
        }
    }
    exports.assertStrictEq = assertStrictEq;
    /**
     * Make an assertion that actual contains expected. If not
     * then thrown.
     */
    function assertStrContains(actual, expected, msg) {
        if (!actual.includes(expected)) {
            if (!msg) {
                msg = `actual: "${actual}" expected to contains: "${expected}"`;
            }
            throw new AssertionError(msg);
        }
    }
    exports.assertStrContains = assertStrContains;
    /**
     * Make an assertion that `actual` contains the `expected` values
     * If not then thrown.
     */
    function assertArrayContains(actual, expected, msg) {
        const missing = [];
        for (let i = 0; i < expected.length; i++) {
            let found = false;
            for (let j = 0; j < actual.length; j++) {
                if (equal(expected[i], actual[j])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                missing.push(expected[i]);
            }
        }
        if (missing.length === 0) {
            return;
        }
        if (!msg) {
            msg = `actual: "${actual}" expected to contains: "${expected}"`;
            msg += "\n";
            msg += `missing: ${missing}`;
        }
        throw new AssertionError(msg);
    }
    exports.assertArrayContains = assertArrayContains;
    /**
     * Make an assertion that `actual` match RegExp `expected`. If not
     * then thrown
     */
    function assertMatch(actual, expected, msg) {
        if (!expected.test(actual)) {
            if (!msg) {
                msg = `actual: "${actual}" expected to match: "${expected}"`;
            }
            throw new AssertionError(msg);
        }
    }
    exports.assertMatch = assertMatch;
    /**
     * Forcefully throws a failed assertion
     */
    function fail(msg) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        assert(false, `Failed assertion${msg ? `: ${msg}` : "."}`);
    }
    exports.fail = fail;
    /** Executes a function, expecting it to throw.  If it does not, then it
     * throws.  An error class and a string that should be included in the
     * error message can also be asserted.
     */
    function assertThrows(fn, ErrorClass, msgIncludes = "", msg) {
        let doesThrow = false;
        let error = null;
        try {
            fn();
        }
        catch (e) {
            if (ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)) {
                msg = `Expected error to be instance of "${ErrorClass.name}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            if (msgIncludes && !e.message.includes(msgIncludes)) {
                msg = `Expected error message to include "${msgIncludes}", but got "${e.message}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            doesThrow = true;
            error = e;
        }
        if (!doesThrow) {
            msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
            throw new AssertionError(msg);
        }
        return error;
    }
    exports.assertThrows = assertThrows;
    async function assertThrowsAsync(fn, ErrorClass, msgIncludes = "", msg) {
        let doesThrow = false;
        let error = null;
        try {
            await fn();
        }
        catch (e) {
            if (ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)) {
                msg = `Expected error to be instance of "${ErrorClass.name}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            if (msgIncludes && !e.message.includes(msgIncludes)) {
                msg = `Expected error message to include "${msgIncludes}", but got "${e.message}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            doesThrow = true;
            error = e;
        }
        if (!doesThrow) {
            msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
            throw new AssertionError(msg);
        }
        return error;
    }
    exports.assertThrowsAsync = assertThrowsAsync;
    /** Use this to stub out methods that will throw when invoked. */
    function unimplemented(msg) {
        throw new AssertionError(msg || "unimplemented");
    }
    exports.unimplemented = unimplemented;
    /** Use this to assert unreachable code. */
    function unreachable() {
        throw new AssertionError("unreachable");
    }
    exports.unreachable = unreachable;
});
// Based on https://github.com/golang/go/blob/891682/src/bufio/bufio.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
define("https://deno.land/std@v0.24.0/io/bufio", ["require", "exports", "https://deno.land/std@v0.24.0/io/util", "https://deno.land/std@v0.24.0/testing/asserts"], function (require, exports, util_ts_1, asserts_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const DEFAULT_BUF_SIZE = 4096;
    const MIN_BUF_SIZE = 16;
    const MAX_CONSECUTIVE_EMPTY_READS = 100;
    const CR = util_ts_1.charCode("\r");
    const LF = util_ts_1.charCode("\n");
    class BufferFullError extends Error {
        constructor(partial) {
            super("Buffer full");
            this.partial = partial;
            this.name = "BufferFullError";
        }
    }
    exports.BufferFullError = BufferFullError;
    class UnexpectedEOFError extends Error {
        constructor() {
            super("Unexpected EOF");
            this.name = "UnexpectedEOFError";
        }
    }
    exports.UnexpectedEOFError = UnexpectedEOFError;
    /** BufReader implements buffering for a Reader object. */
    class BufReader {
        constructor(rd, size = DEFAULT_BUF_SIZE) {
            this.r = 0; // buf read position.
            this.w = 0; // buf write position.
            this.eof = false;
            if (size < MIN_BUF_SIZE) {
                size = MIN_BUF_SIZE;
            }
            this._reset(new Uint8Array(size), rd);
        }
        // private lastByte: number;
        // private lastCharSize: number;
        /** return new BufReader unless r is BufReader */
        static create(r, size = DEFAULT_BUF_SIZE) {
            return r instanceof BufReader ? r : new BufReader(r, size);
        }
        /** Returns the size of the underlying buffer in bytes. */
        size() {
            return this.buf.byteLength;
        }
        buffered() {
            return this.w - this.r;
        }
        // Reads a new chunk into the buffer.
        async _fill() {
            // Slide existing data to beginning.
            if (this.r > 0) {
                this.buf.copyWithin(0, this.r, this.w);
                this.w -= this.r;
                this.r = 0;
            }
            if (this.w >= this.buf.byteLength) {
                throw Error("bufio: tried to fill full buffer");
            }
            // Read new data: try a limited number of times.
            for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
                const rr = await this.rd.read(this.buf.subarray(this.w));
                if (rr === Deno.EOF) {
                    this.eof = true;
                    return;
                }
                asserts_ts_1.assert(rr >= 0, "negative read");
                this.w += rr;
                if (rr > 0) {
                    return;
                }
            }
            throw new Error(`No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`);
        }
        /** Discards any buffered data, resets all state, and switches
         * the buffered reader to read from r.
         */
        reset(r) {
            this._reset(this.buf, r);
        }
        _reset(buf, rd) {
            this.buf = buf;
            this.rd = rd;
            this.eof = false;
            // this.lastByte = -1;
            // this.lastCharSize = -1;
        }
        /** reads data into p.
         * It returns the number of bytes read into p.
         * The bytes are taken from at most one Read on the underlying Reader,
         * hence n may be less than len(p).
         * To read exactly len(p) bytes, use io.ReadFull(b, p).
         */
        async read(p) {
            let rr = p.byteLength;
            if (p.byteLength === 0)
                return rr;
            if (this.r === this.w) {
                if (p.byteLength >= this.buf.byteLength) {
                    // Large read, empty buffer.
                    // Read directly into p to avoid copy.
                    const rr = await this.rd.read(p);
                    const nread = rr === Deno.EOF ? 0 : rr;
                    asserts_ts_1.assert(nread >= 0, "negative read");
                    // if (rr.nread > 0) {
                    //   this.lastByte = p[rr.nread - 1];
                    //   this.lastCharSize = -1;
                    // }
                    return rr;
                }
                // One read.
                // Do not use this.fill, which will loop.
                this.r = 0;
                this.w = 0;
                rr = await this.rd.read(this.buf);
                if (rr === 0 || rr === Deno.EOF)
                    return rr;
                asserts_ts_1.assert(rr >= 0, "negative read");
                this.w += rr;
            }
            // copy as much as we can
            const copied = util_ts_1.copyBytes(p, this.buf.subarray(this.r, this.w), 0);
            this.r += copied;
            // this.lastByte = this.buf[this.r - 1];
            // this.lastCharSize = -1;
            return copied;
        }
        /** reads exactly `p.length` bytes into `p`.
         *
         * If successful, `p` is returned.
         *
         * If the end of the underlying stream has been reached, and there are no more
         * bytes available in the buffer, `readFull()` returns `EOF` instead.
         *
         * An error is thrown if some bytes could be read, but not enough to fill `p`
         * entirely before the underlying stream reported an error or EOF. Any error
         * thrown will have a `partial` property that indicates the slice of the
         * buffer that has been successfully filled with data.
         *
         * Ported from https://golang.org/pkg/io/#ReadFull
         */
        async readFull(p) {
            let bytesRead = 0;
            while (bytesRead < p.length) {
                try {
                    const rr = await this.read(p.subarray(bytesRead));
                    if (rr === Deno.EOF) {
                        if (bytesRead === 0) {
                            return Deno.EOF;
                        }
                        else {
                            throw new UnexpectedEOFError();
                        }
                    }
                    bytesRead += rr;
                }
                catch (err) {
                    err.partial = p.subarray(0, bytesRead);
                    throw err;
                }
            }
            return p;
        }
        /** Returns the next byte [0, 255] or `EOF`. */
        async readByte() {
            while (this.r === this.w) {
                if (this.eof)
                    return Deno.EOF;
                await this._fill(); // buffer is empty.
            }
            const c = this.buf[this.r];
            this.r++;
            // this.lastByte = c;
            return c;
        }
        /** readString() reads until the first occurrence of delim in the input,
         * returning a string containing the data up to and including the delimiter.
         * If ReadString encounters an error before finding a delimiter,
         * it returns the data read before the error and the error itself
         * (often io.EOF).
         * ReadString returns err != nil if and only if the returned data does not end
         * in delim.
         * For simple uses, a Scanner may be more convenient.
         */
        async readString(delim) {
            if (delim.length !== 1)
                throw new Error("Delimiter should be a single character");
            const buffer = await this.readSlice(delim.charCodeAt(0));
            if (buffer == Deno.EOF)
                return Deno.EOF;
            return new TextDecoder().decode(buffer);
        }
        /** `readLine()` is a low-level line-reading primitive. Most callers should
         * use `readString('\n')` instead or use a Scanner.
         *
         * `readLine()` tries to return a single line, not including the end-of-line
         * bytes. If the line was too long for the buffer then `more` is set and the
         * beginning of the line is returned. The rest of the line will be returned
         * from future calls. `more` will be false when returning the last fragment
         * of the line. The returned buffer is only valid until the next call to
         * `readLine()`.
         *
         * The text returned from ReadLine does not include the line end ("\r\n" or
         * "\n").
         *
         * When the end of the underlying stream is reached, the final bytes in the
         * stream are returned. No indication or error is given if the input ends
         * without a final line end. When there are no more trailing bytes to read,
         * `readLine()` returns the `EOF` symbol.
         *
         * Calling `unreadByte()` after `readLine()` will always unread the last byte
         * read (possibly a character belonging to the line end) even if that byte is
         * not part of the line returned by `readLine()`.
         */
        async readLine() {
            let line;
            try {
                line = await this.readSlice(LF);
            }
            catch (err) {
                let { partial } = err;
                asserts_ts_1.assert(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
                // Don't throw if `readSlice()` failed with `BufferFullError`, instead we
                // just return whatever is available and set the `more` flag.
                if (!(err instanceof BufferFullError)) {
                    throw err;
                }
                // Handle the case where "\r\n" straddles the buffer.
                if (!this.eof &&
                    partial.byteLength > 0 &&
                    partial[partial.byteLength - 1] === CR) {
                    // Put the '\r' back on buf and drop it from line.
                    // Let the next call to ReadLine check for "\r\n".
                    asserts_ts_1.assert(this.r > 0, "bufio: tried to rewind past start of buffer");
                    this.r--;
                    partial = partial.subarray(0, partial.byteLength - 1);
                }
                return { line: partial, more: !this.eof };
            }
            if (line === Deno.EOF) {
                return Deno.EOF;
            }
            if (line.byteLength === 0) {
                return { line, more: false };
            }
            if (line[line.byteLength - 1] == LF) {
                let drop = 1;
                if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
                    drop = 2;
                }
                line = line.subarray(0, line.byteLength - drop);
            }
            return { line, more: false };
        }
        /** `readSlice()` reads until the first occurrence of `delim` in the input,
         * returning a slice pointing at the bytes in the buffer. The bytes stop
         * being valid at the next read.
         *
         * If `readSlice()` encounters an error before finding a delimiter, or the
         * buffer fills without finding a delimiter, it throws an error with a
         * `partial` property that contains the entire buffer.
         *
         * If `readSlice()` encounters the end of the underlying stream and there are
         * any bytes left in the buffer, the rest of the buffer is returned. In other
         * words, EOF is always treated as a delimiter. Once the buffer is empty,
         * it returns `EOF`.
         *
         * Because the data returned from `readSlice()` will be overwritten by the
         * next I/O operation, most clients should use `readString()` instead.
         */
        async readSlice(delim) {
            let s = 0; // search start index
            let slice;
            while (true) {
                // Search buffer.
                let i = this.buf.subarray(this.r + s, this.w).indexOf(delim);
                if (i >= 0) {
                    i += s;
                    slice = this.buf.subarray(this.r, this.r + i + 1);
                    this.r += i + 1;
                    break;
                }
                // EOF?
                if (this.eof) {
                    if (this.r === this.w) {
                        return Deno.EOF;
                    }
                    slice = this.buf.subarray(this.r, this.w);
                    this.r = this.w;
                    break;
                }
                // Buffer full?
                if (this.buffered() >= this.buf.byteLength) {
                    this.r = this.w;
                    throw new BufferFullError(this.buf);
                }
                s = this.w - this.r; // do not rescan area we scanned before
                // Buffer is not full.
                try {
                    await this._fill();
                }
                catch (err) {
                    err.partial = slice;
                    throw err;
                }
            }
            // Handle last byte, if any.
            // const i = slice.byteLength - 1;
            // if (i >= 0) {
            //   this.lastByte = slice[i];
            //   this.lastCharSize = -1
            // }
            return slice;
        }
        /** `peek()` returns the next `n` bytes without advancing the reader. The
         * bytes stop being valid at the next read call.
         *
         * When the end of the underlying stream is reached, but there are unread
         * bytes left in the buffer, those bytes are returned. If there are no bytes
         * left in the buffer, it returns `EOF`.
         *
         * If an error is encountered before `n` bytes are available, `peek()` throws
         * an error with the `partial` property set to a slice of the buffer that
         * contains the bytes that were available before the error occurred.
         */
        async peek(n) {
            if (n < 0) {
                throw Error("negative count");
            }
            let avail = this.w - this.r;
            while (avail < n && avail < this.buf.byteLength && !this.eof) {
                try {
                    await this._fill();
                }
                catch (err) {
                    err.partial = this.buf.subarray(this.r, this.w);
                    throw err;
                }
                avail = this.w - this.r;
            }
            if (avail === 0 && this.eof) {
                return Deno.EOF;
            }
            else if (avail < n && this.eof) {
                return this.buf.subarray(this.r, this.r + avail);
            }
            else if (avail < n) {
                throw new BufferFullError(this.buf.subarray(this.r, this.w));
            }
            return this.buf.subarray(this.r, this.r + n);
        }
    }
    exports.BufReader = BufReader;
    /** BufWriter implements buffering for an deno.Writer object.
     * If an error occurs writing to a Writer, no more data will be
     * accepted and all subsequent writes, and flush(), will return the error.
     * After all data has been written, the client should call the
     * flush() method to guarantee all data has been forwarded to
     * the underlying deno.Writer.
     */
    class BufWriter {
        constructor(wr, size = DEFAULT_BUF_SIZE) {
            this.wr = wr;
            this.n = 0;
            this.err = null;
            if (size <= 0) {
                size = DEFAULT_BUF_SIZE;
            }
            this.buf = new Uint8Array(size);
        }
        /** return new BufWriter unless w is BufWriter */
        static create(w, size = DEFAULT_BUF_SIZE) {
            return w instanceof BufWriter ? w : new BufWriter(w, size);
        }
        /** Size returns the size of the underlying buffer in bytes. */
        size() {
            return this.buf.byteLength;
        }
        /** Discards any unflushed buffered data, clears any error, and
         * resets b to write its output to w.
         */
        reset(w) {
            this.err = null;
            this.n = 0;
            this.wr = w;
        }
        /** Flush writes any buffered data to the underlying io.Writer. */
        async flush() {
            if (this.err !== null)
                throw this.err;
            if (this.n === 0)
                return;
            let n = 0;
            try {
                n = await this.wr.write(this.buf.subarray(0, this.n));
            }
            catch (e) {
                this.err = e;
                throw e;
            }
            if (n < this.n) {
                if (n > 0) {
                    this.buf.copyWithin(0, n, this.n);
                    this.n -= n;
                }
                this.err = new Error("Short write");
                throw this.err;
            }
            this.n = 0;
        }
        /** Returns how many bytes are unused in the buffer. */
        available() {
            return this.buf.byteLength - this.n;
        }
        /** buffered returns the number of bytes that have been written into the
         * current buffer.
         */
        buffered() {
            return this.n;
        }
        /** Writes the contents of p into the buffer.
         * Returns the number of bytes written.
         */
        async write(p) {
            if (this.err !== null)
                throw this.err;
            if (p.length === 0)
                return 0;
            let nn = 0;
            let n = 0;
            while (p.byteLength > this.available()) {
                if (this.buffered() === 0) {
                    // Large write, empty buffer.
                    // Write directly from p to avoid copy.
                    try {
                        n = await this.wr.write(p);
                    }
                    catch (e) {
                        this.err = e;
                        throw e;
                    }
                }
                else {
                    n = util_ts_1.copyBytes(this.buf, p, this.n);
                    this.n += n;
                    await this.flush();
                }
                nn += n;
                p = p.subarray(n);
            }
            n = util_ts_1.copyBytes(this.buf, p, this.n);
            this.n += n;
            nn += n;
            return nn;
        }
    }
    exports.BufWriter = BufWriter;
});
// Based on https://github.com/golang/go/blob/891682/src/net/textproto/
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
define("https://deno.land/std@v0.24.0/textproto/mod", ["require", "exports", "https://deno.land/std@v0.24.0/io/bufio", "https://deno.land/std@v0.24.0/io/util"], function (require, exports, bufio_ts_1, util_ts_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const asciiDecoder = new TextDecoder();
    function str(buf) {
        if (buf == null) {
            return "";
        }
        else {
            return asciiDecoder.decode(buf);
        }
    }
    class ProtocolError extends Error {
        constructor(msg) {
            super(msg);
            this.name = "ProtocolError";
        }
    }
    exports.ProtocolError = ProtocolError;
    function append(a, b) {
        if (a == null) {
            return b;
        }
        else {
            const output = new Uint8Array(a.length + b.length);
            output.set(a, 0);
            output.set(b, a.length);
            return output;
        }
    }
    exports.append = append;
    class TextProtoReader {
        constructor(r) {
            this.r = r;
        }
        /** readLine() reads a single line from the TextProtoReader,
         * eliding the final \n or \r\n from the returned string.
         */
        async readLine() {
            const s = await this.readLineSlice();
            if (s === Deno.EOF)
                return Deno.EOF;
            return str(s);
        }
        /** ReadMIMEHeader reads a MIME-style header from r.
         * The header is a sequence of possibly continued Key: Value lines
         * ending in a blank line.
         * The returned map m maps CanonicalMIMEHeaderKey(key) to a
         * sequence of values in the same order encountered in the input.
         *
         * For example, consider this input:
         *
         *	My-Key: Value 1
         *	Long-Key: Even
         *	       Longer Value
         *	My-Key: Value 2
         *
         * Given that input, ReadMIMEHeader returns the map:
         *
         *	map[string][]string{
         *		"My-Key": {"Value 1", "Value 2"},
         *		"Long-Key": {"Even Longer Value"},
         *	}
         */
        async readMIMEHeader() {
            const m = new Headers();
            let line;
            // The first line cannot start with a leading space.
            let buf = await this.r.peek(1);
            if (buf === Deno.EOF) {
                return Deno.EOF;
            }
            else if (buf[0] == util_ts_2.charCode(" ") || buf[0] == util_ts_2.charCode("\t")) {
                line = (await this.readLineSlice());
            }
            buf = await this.r.peek(1);
            if (buf === Deno.EOF) {
                throw new bufio_ts_1.UnexpectedEOFError();
            }
            else if (buf[0] == util_ts_2.charCode(" ") || buf[0] == util_ts_2.charCode("\t")) {
                throw new ProtocolError(`malformed MIME header initial line: ${str(line)}`);
            }
            while (true) {
                const kv = await this.readLineSlice(); // readContinuedLineSlice
                if (kv === Deno.EOF)
                    throw new bufio_ts_1.UnexpectedEOFError();
                if (kv.byteLength === 0)
                    return m;
                // Key ends at first colon; should not have trailing spaces
                // but they appear in the wild, violating specs, so we remove
                // them if present.
                let i = kv.indexOf(util_ts_2.charCode(":"));
                if (i < 0) {
                    throw new ProtocolError(`malformed MIME header line: ${str(kv)}`);
                }
                let endKey = i;
                while (endKey > 0 && kv[endKey - 1] == util_ts_2.charCode(" ")) {
                    endKey--;
                }
                //let key = canonicalMIMEHeaderKey(kv.subarray(0, endKey));
                const key = str(kv.subarray(0, endKey));
                // As per RFC 7230 field-name is a token,
                // tokens consist of one or more chars.
                // We could return a ProtocolError here,
                // but better to be liberal in what we
                // accept, so if we get an empty key, skip it.
                if (key == "") {
                    continue;
                }
                // Skip initial spaces in value.
                i++; // skip colon
                while (i < kv.byteLength &&
                    (kv[i] == util_ts_2.charCode(" ") || kv[i] == util_ts_2.charCode("\t"))) {
                    i++;
                }
                const value = str(kv.subarray(i));
                // In case of invalid header we swallow the error
                // example: "Audio Mode" => invalid due to space in the key
                try {
                    m.append(key, value);
                }
                catch { }
            }
        }
        async readLineSlice() {
            // this.closeDot();
            let line;
            while (true) {
                const r = await this.r.readLine();
                if (r === Deno.EOF)
                    return Deno.EOF;
                const { line: l, more } = r;
                // Avoid the copy if the first call produced a full line.
                if (!line && !more) {
                    // TODO(ry):
                    // This skipSpace() is definitely misplaced, but I don't know where it
                    // comes from nor how to fix it.
                    if (this.skipSpace(l) === 0) {
                        return new Uint8Array(0);
                    }
                    return l;
                }
                // @ts-ignore
                line = append(line, l);
                if (!more) {
                    break;
                }
            }
            return line;
        }
        skipSpace(l) {
            let n = 0;
            for (let i = 0; i < l.length; i++) {
                if (l[i] === util_ts_2.charCode(" ") || l[i] === util_ts_2.charCode("\t")) {
                    continue;
                }
                n++;
            }
            return n;
        }
    }
    exports.TextProtoReader = TextProtoReader;
});
// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
define("https://deno.land/std@v0.24.0/http/http_status", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** HTTP status codes */
    var Status;
    (function (Status) {
        /** RFC 7231, 6.2.1 */
        Status[Status["Continue"] = 100] = "Continue";
        /** RFC 7231, 6.2.2 */
        Status[Status["SwitchingProtocols"] = 101] = "SwitchingProtocols";
        /** RFC 2518, 10.1 */
        Status[Status["Processing"] = 102] = "Processing";
        /** RFC 7231, 6.3.1 */
        Status[Status["OK"] = 200] = "OK";
        /** RFC 7231, 6.3.2 */
        Status[Status["Created"] = 201] = "Created";
        /** RFC 7231, 6.3.3 */
        Status[Status["Accepted"] = 202] = "Accepted";
        /** RFC 7231, 6.3.4 */
        Status[Status["NonAuthoritativeInfo"] = 203] = "NonAuthoritativeInfo";
        /** RFC 7231, 6.3.5 */
        Status[Status["NoContent"] = 204] = "NoContent";
        /** RFC 7231, 6.3.6 */
        Status[Status["ResetContent"] = 205] = "ResetContent";
        /** RFC 7233, 4.1 */
        Status[Status["PartialContent"] = 206] = "PartialContent";
        /** RFC 4918, 11.1 */
        Status[Status["MultiStatus"] = 207] = "MultiStatus";
        /** RFC 5842, 7.1 */
        Status[Status["AlreadyReported"] = 208] = "AlreadyReported";
        /** RFC 3229, 10.4.1 */
        Status[Status["IMUsed"] = 226] = "IMUsed";
        /** RFC 7231, 6.4.1 */
        Status[Status["MultipleChoices"] = 300] = "MultipleChoices";
        /** RFC 7231, 6.4.2 */
        Status[Status["MovedPermanently"] = 301] = "MovedPermanently";
        /** RFC 7231, 6.4.3 */
        Status[Status["Found"] = 302] = "Found";
        /** RFC 7231, 6.4.4 */
        Status[Status["SeeOther"] = 303] = "SeeOther";
        /** RFC 7232, 4.1 */
        Status[Status["NotModified"] = 304] = "NotModified";
        /** RFC 7231, 6.4.5 */
        Status[Status["UseProxy"] = 305] = "UseProxy";
        /** RFC 7231, 6.4.7 */
        Status[Status["TemporaryRedirect"] = 307] = "TemporaryRedirect";
        /** RFC 7538, 3 */
        Status[Status["PermanentRedirect"] = 308] = "PermanentRedirect";
        /** RFC 7231, 6.5.1 */
        Status[Status["BadRequest"] = 400] = "BadRequest";
        /** RFC 7235, 3.1 */
        Status[Status["Unauthorized"] = 401] = "Unauthorized";
        /** RFC 7231, 6.5.2 */
        Status[Status["PaymentRequired"] = 402] = "PaymentRequired";
        /** RFC 7231, 6.5.3 */
        Status[Status["Forbidden"] = 403] = "Forbidden";
        /** RFC 7231, 6.5.4 */
        Status[Status["NotFound"] = 404] = "NotFound";
        /** RFC 7231, 6.5.5 */
        Status[Status["MethodNotAllowed"] = 405] = "MethodNotAllowed";
        /** RFC 7231, 6.5.6 */
        Status[Status["NotAcceptable"] = 406] = "NotAcceptable";
        /** RFC 7235, 3.2 */
        Status[Status["ProxyAuthRequired"] = 407] = "ProxyAuthRequired";
        /** RFC 7231, 6.5.7 */
        Status[Status["RequestTimeout"] = 408] = "RequestTimeout";
        /** RFC 7231, 6.5.8 */
        Status[Status["Conflict"] = 409] = "Conflict";
        /** RFC 7231, 6.5.9 */
        Status[Status["Gone"] = 410] = "Gone";
        /** RFC 7231, 6.5.10 */
        Status[Status["LengthRequired"] = 411] = "LengthRequired";
        /** RFC 7232, 4.2 */
        Status[Status["PreconditionFailed"] = 412] = "PreconditionFailed";
        /** RFC 7231, 6.5.11 */
        Status[Status["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
        /** RFC 7231, 6.5.12 */
        Status[Status["RequestURITooLong"] = 414] = "RequestURITooLong";
        /** RFC 7231, 6.5.13 */
        Status[Status["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
        /** RFC 7233, 4.4 */
        Status[Status["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
        /** RFC 7231, 6.5.14 */
        Status[Status["ExpectationFailed"] = 417] = "ExpectationFailed";
        /** RFC 7168, 2.3.3 */
        Status[Status["Teapot"] = 418] = "Teapot";
        /** RFC 7540, 9.1.2 */
        Status[Status["MisdirectedRequest"] = 421] = "MisdirectedRequest";
        /** RFC 4918, 11.2 */
        Status[Status["UnprocessableEntity"] = 422] = "UnprocessableEntity";
        /** RFC 4918, 11.3 */
        Status[Status["Locked"] = 423] = "Locked";
        /** RFC 4918, 11.4 */
        Status[Status["FailedDependency"] = 424] = "FailedDependency";
        /** RFC 7231, 6.5.15 */
        Status[Status["UpgradeRequired"] = 426] = "UpgradeRequired";
        /** RFC 6585, 3 */
        Status[Status["PreconditionRequired"] = 428] = "PreconditionRequired";
        /** RFC 6585, 4 */
        Status[Status["TooManyRequests"] = 429] = "TooManyRequests";
        /** RFC 6585, 5 */
        Status[Status["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
        /** RFC 7725, 3 */
        Status[Status["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
        /** RFC 7231, 6.6.1 */
        Status[Status["InternalServerError"] = 500] = "InternalServerError";
        /** RFC 7231, 6.6.2 */
        Status[Status["NotImplemented"] = 501] = "NotImplemented";
        /** RFC 7231, 6.6.3 */
        Status[Status["BadGateway"] = 502] = "BadGateway";
        /** RFC 7231, 6.6.4 */
        Status[Status["ServiceUnavailable"] = 503] = "ServiceUnavailable";
        /** RFC 7231, 6.6.5 */
        Status[Status["GatewayTimeout"] = 504] = "GatewayTimeout";
        /** RFC 7231, 6.6.6 */
        Status[Status["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
        /** RFC 2295, 8.1 */
        Status[Status["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
        /** RFC 4918, 11.5 */
        Status[Status["InsufficientStorage"] = 507] = "InsufficientStorage";
        /** RFC 5842, 7.2 */
        Status[Status["LoopDetected"] = 508] = "LoopDetected";
        /** RFC 2774, 7 */
        Status[Status["NotExtended"] = 510] = "NotExtended";
        /** RFC 6585, 6 */
        Status[Status["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
    })(Status = exports.Status || (exports.Status = {}));
    exports.STATUS_TEXT = new Map([
        [Status.Continue, "Continue"],
        [Status.SwitchingProtocols, "Switching Protocols"],
        [Status.Processing, "Processing"],
        [Status.OK, "OK"],
        [Status.Created, "Created"],
        [Status.Accepted, "Accepted"],
        [Status.NonAuthoritativeInfo, "Non-Authoritative Information"],
        [Status.NoContent, "No Content"],
        [Status.ResetContent, "Reset Content"],
        [Status.PartialContent, "Partial Content"],
        [Status.MultiStatus, "Multi-Status"],
        [Status.AlreadyReported, "Already Reported"],
        [Status.IMUsed, "IM Used"],
        [Status.MultipleChoices, "Multiple Choices"],
        [Status.MovedPermanently, "Moved Permanently"],
        [Status.Found, "Found"],
        [Status.SeeOther, "See Other"],
        [Status.NotModified, "Not Modified"],
        [Status.UseProxy, "Use Proxy"],
        [Status.TemporaryRedirect, "Temporary Redirect"],
        [Status.PermanentRedirect, "Permanent Redirect"],
        [Status.BadRequest, "Bad Request"],
        [Status.Unauthorized, "Unauthorized"],
        [Status.PaymentRequired, "Payment Required"],
        [Status.Forbidden, "Forbidden"],
        [Status.NotFound, "Not Found"],
        [Status.MethodNotAllowed, "Method Not Allowed"],
        [Status.NotAcceptable, "Not Acceptable"],
        [Status.ProxyAuthRequired, "Proxy Authentication Required"],
        [Status.RequestTimeout, "Request Timeout"],
        [Status.Conflict, "Conflict"],
        [Status.Gone, "Gone"],
        [Status.LengthRequired, "Length Required"],
        [Status.PreconditionFailed, "Precondition Failed"],
        [Status.RequestEntityTooLarge, "Request Entity Too Large"],
        [Status.RequestURITooLong, "Request URI Too Long"],
        [Status.UnsupportedMediaType, "Unsupported Media Type"],
        [Status.RequestedRangeNotSatisfiable, "Requested Range Not Satisfiable"],
        [Status.ExpectationFailed, "Expectation Failed"],
        [Status.Teapot, "I'm a teapot"],
        [Status.MisdirectedRequest, "Misdirected Request"],
        [Status.UnprocessableEntity, "Unprocessable Entity"],
        [Status.Locked, "Locked"],
        [Status.FailedDependency, "Failed Dependency"],
        [Status.UpgradeRequired, "Upgrade Required"],
        [Status.PreconditionRequired, "Precondition Required"],
        [Status.TooManyRequests, "Too Many Requests"],
        [Status.RequestHeaderFieldsTooLarge, "Request Header Fields Too Large"],
        [Status.UnavailableForLegalReasons, "Unavailable For Legal Reasons"],
        [Status.InternalServerError, "Internal Server Error"],
        [Status.NotImplemented, "Not Implemented"],
        [Status.BadGateway, "Bad Gateway"],
        [Status.ServiceUnavailable, "Service Unavailable"],
        [Status.GatewayTimeout, "Gateway Timeout"],
        [Status.HTTPVersionNotSupported, "HTTP Version Not Supported"],
        [Status.VariantAlsoNegotiates, "Variant Also Negotiates"],
        [Status.InsufficientStorage, "Insufficient Storage"],
        [Status.LoopDetected, "Loop Detected"],
        [Status.NotExtended, "Not Extended"],
        [Status.NetworkAuthenticationRequired, "Network Authentication Required"]
    ]);
});
// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
define("https://deno.land/std@v0.24.0/util/async", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** Creates a Promise with the `reject` and `resolve` functions
     * placed as methods on the promise object itself. It allows you to do:
     *
     *     const p = deferred<number>();
     *     // ...
     *     p.resolve(42);
     */
    function deferred() {
        let methods;
        const promise = new Promise((resolve, reject) => {
            methods = { resolve, reject };
        });
        return Object.assign(promise, methods);
    }
    exports.deferred = deferred;
    /** The MuxAsyncIterator class multiplexes multiple async iterators into a
     * single stream. It currently makes a few assumptions:
     * - The iterators do not throw.
     * - The final result (the value returned and not yielded from the iterator)
     *   does not matter; if there is any, it is discarded.
     */
    class MuxAsyncIterator {
        constructor() {
            this.iteratorCount = 0;
            this.yields = [];
            this.signal = deferred();
        }
        add(iterator) {
            ++this.iteratorCount;
            this.callIteratorNext(iterator);
        }
        async callIteratorNext(iterator) {
            const { value, done } = await iterator.next();
            if (done) {
                --this.iteratorCount;
            }
            else {
                this.yields.push({ iterator, value });
            }
            this.signal.resolve();
        }
        async *iterate() {
            while (this.iteratorCount > 0) {
                // Sleep until any of the wrapped iterators yields.
                await this.signal;
                // Note that while we're looping over `yields`, new items may be added.
                for (let i = 0; i < this.yields.length; i++) {
                    const { iterator, value } = this.yields[i];
                    yield value;
                    this.callIteratorNext(iterator);
                }
                // Clear the `yields` list and reset the `signal` promise.
                this.yields.length = 0;
                this.signal = deferred();
            }
        }
        [Symbol.asyncIterator]() {
            return this.iterate();
        }
    }
    exports.MuxAsyncIterator = MuxAsyncIterator;
    /** Collects all Uint8Arrays from an AsyncIterable and retuns a single
     * Uint8Array with the concatenated contents of all the collected arrays.
     */
    async function collectUint8Arrays(it) {
        const chunks = [];
        let length = 0;
        for await (const chunk of it) {
            chunks.push(chunk);
            length += chunk.length;
        }
        if (chunks.length === 1) {
            // No need to copy.
            return chunks[0];
        }
        const collected = new Uint8Array(length);
        let offset = 0;
        for (const chunk of chunks) {
            collected.set(chunk, offset);
            offset += chunk.length;
        }
        return collected;
    }
    exports.collectUint8Arrays = collectUint8Arrays;
    // Delays the given milliseconds and resolves.
    function delay(ms) {
        return new Promise((res) => setTimeout(() => {
            res();
        }, ms));
    }
    exports.delay = delay;
});
define("https://deno.land/std@v0.24.0/http/server", ["require", "exports", "https://deno.land/std@v0.24.0/io/bufio", "https://deno.land/std@v0.24.0/textproto/mod", "https://deno.land/std@v0.24.0/http/http_status", "https://deno.land/std@v0.24.0/testing/asserts", "https://deno.land/std@v0.24.0/util/async"], function (require, exports, bufio_ts_2, mod_ts_3, http_status_ts_1, asserts_ts_2, async_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
    const { listen, listenTLS, copy, toAsyncIterator } = Deno;
    function bufWriter(w) {
        if (w instanceof bufio_ts_2.BufWriter) {
            return w;
        }
        else {
            return new bufio_ts_2.BufWriter(w);
        }
    }
    function setContentLength(r) {
        if (!r.headers) {
            r.headers = new Headers();
        }
        if (r.body) {
            if (!r.headers.has("content-length")) {
                if (r.body instanceof Uint8Array) {
                    const bodyLength = r.body.byteLength;
                    r.headers.append("Content-Length", bodyLength.toString());
                }
                else {
                    r.headers.append("Transfer-Encoding", "chunked");
                }
            }
        }
    }
    exports.setContentLength = setContentLength;
    async function writeChunkedBody(w, r) {
        const writer = bufWriter(w);
        const encoder = new TextEncoder();
        for await (const chunk of toAsyncIterator(r)) {
            if (chunk.byteLength <= 0)
                continue;
            const start = encoder.encode(`${chunk.byteLength.toString(16)}\r\n`);
            const end = encoder.encode("\r\n");
            await writer.write(start);
            await writer.write(chunk);
            await writer.write(end);
        }
        const endChunk = encoder.encode("0\r\n\r\n");
        await writer.write(endChunk);
    }
    async function writeResponse(w, r) {
        const protoMajor = 1;
        const protoMinor = 1;
        const statusCode = r.status || 200;
        const statusText = http_status_ts_1.STATUS_TEXT.get(statusCode);
        const writer = bufWriter(w);
        if (!statusText) {
            throw Error("bad status code");
        }
        if (!r.body) {
            r.body = new Uint8Array();
        }
        let out = `HTTP/${protoMajor}.${protoMinor} ${statusCode} ${statusText}\r\n`;
        setContentLength(r);
        const headers = r.headers;
        for (const [key, value] of headers) {
            out += `${key}: ${value}\r\n`;
        }
        out += "\r\n";
        const header = new TextEncoder().encode(out);
        const n = await writer.write(header);
        asserts_ts_2.assert(n === header.byteLength);
        if (r.body instanceof Uint8Array) {
            const n = await writer.write(r.body);
            asserts_ts_2.assert(n === r.body.byteLength);
        }
        else if (headers.has("content-length")) {
            const bodyLength = parseInt(headers.get("content-length"));
            const n = await copy(writer, r.body);
            asserts_ts_2.assert(n === bodyLength);
        }
        else {
            await writeChunkedBody(writer, r.body);
        }
        await writer.flush();
    }
    exports.writeResponse = writeResponse;
    class ServerRequest {
        constructor() {
            this.done = async_ts_1.deferred();
        }
        async *bodyStream() {
            if (this.headers.has("content-length")) {
                const len = +this.headers.get("content-length");
                if (Number.isNaN(len)) {
                    return new Uint8Array(0);
                }
                let buf = new Uint8Array(1024);
                let rr = await this.r.read(buf);
                let nread = rr === Deno.EOF ? 0 : rr;
                let nreadTotal = nread;
                while (rr !== Deno.EOF && nreadTotal < len) {
                    yield buf.subarray(0, nread);
                    buf = new Uint8Array(1024);
                    rr = await this.r.read(buf);
                    nread = rr === Deno.EOF ? 0 : rr;
                    nreadTotal += nread;
                }
                yield buf.subarray(0, nread);
            }
            else {
                if (this.headers.has("transfer-encoding")) {
                    const transferEncodings = this.headers
                        .get("transfer-encoding")
                        .split(",")
                        .map((e) => e.trim().toLowerCase());
                    if (transferEncodings.includes("chunked")) {
                        // Based on https://tools.ietf.org/html/rfc2616#section-19.4.6
                        const tp = new mod_ts_3.TextProtoReader(this.r);
                        let line = await tp.readLine();
                        if (line === Deno.EOF)
                            throw new bufio_ts_2.UnexpectedEOFError();
                        // TODO: handle chunk extension
                        const [chunkSizeString] = line.split(";");
                        let chunkSize = parseInt(chunkSizeString, 16);
                        if (Number.isNaN(chunkSize) || chunkSize < 0) {
                            throw new Error("Invalid chunk size");
                        }
                        while (chunkSize > 0) {
                            const data = new Uint8Array(chunkSize);
                            if ((await this.r.readFull(data)) === Deno.EOF) {
                                throw new bufio_ts_2.UnexpectedEOFError();
                            }
                            yield data;
                            await this.r.readLine(); // Consume \r\n
                            line = await tp.readLine();
                            if (line === Deno.EOF)
                                throw new bufio_ts_2.UnexpectedEOFError();
                            chunkSize = parseInt(line, 16);
                        }
                        const entityHeaders = await tp.readMIMEHeader();
                        if (entityHeaders !== Deno.EOF) {
                            for (const [k, v] of entityHeaders) {
                                this.headers.set(k, v);
                            }
                        }
                        /* Pseudo code from https://tools.ietf.org/html/rfc2616#section-19.4.6
                        length := 0
                        read chunk-size, chunk-extension (if any) and CRLF
                        while (chunk-size > 0) {
                          read chunk-data and CRLF
                          append chunk-data to entity-body
                          length := length + chunk-size
                          read chunk-size and CRLF
                        }
                        read entity-header
                        while (entity-header not empty) {
                          append entity-header to existing header fields
                          read entity-header
                        }
                        Content-Length := length
                        Remove "chunked" from Transfer-Encoding
                        */
                        return; // Must return here to avoid fall through
                    }
                    // TODO: handle other transfer-encoding types
                }
                // Otherwise...
                yield new Uint8Array(0);
            }
        }
        // Read the body of the request into a single Uint8Array
        async body() {
            return async_ts_1.collectUint8Arrays(this.bodyStream());
        }
        async respond(r) {
            // Write our response!
            await writeResponse(this.w, r);
            // Signal that this request has been processed and the next pipelined
            // request on the same connection can be accepted.
            this.done.resolve();
        }
    }
    exports.ServerRequest = ServerRequest;
    function fixLength(req) {
        const contentLength = req.headers.get("Content-Length");
        if (contentLength) {
            const arrClen = contentLength.split(",");
            if (arrClen.length > 1) {
                const distinct = [...new Set(arrClen.map((e) => e.trim()))];
                if (distinct.length > 1) {
                    throw Error("cannot contain multiple Content-Length headers");
                }
                else {
                    req.headers.set("Content-Length", distinct[0]);
                }
            }
            const c = req.headers.get("Content-Length");
            if (req.method === "HEAD" && c && c !== "0") {
                throw Error("http: method cannot contain a Content-Length");
            }
            if (c && req.headers.has("transfer-encoding")) {
                // A sender MUST NOT send a Content-Length header field in any message
                // that contains a Transfer-Encoding header field.
                // rfc: https://tools.ietf.org/html/rfc7230#section-3.3.2
                throw new Error("http: Transfer-Encoding and Content-Length cannot be send together");
            }
        }
    }
    /**
     * ParseHTTPVersion parses a HTTP version string.
     * "HTTP/1.0" returns (1, 0, true).
     * Ported from https://github.com/golang/go/blob/f5c43b9/src/net/http/request.go#L766-L792
     */
    function parseHTTPVersion(vers) {
        switch (vers) {
            case "HTTP/1.1":
                return [1, 1];
            case "HTTP/1.0":
                return [1, 0];
            default: {
                const Big = 1000000; // arbitrary upper bound
                const digitReg = /^\d+$/; // test if string is only digit
                if (!vers.startsWith("HTTP/")) {
                    break;
                }
                const dot = vers.indexOf(".");
                if (dot < 0) {
                    break;
                }
                const majorStr = vers.substring(vers.indexOf("/") + 1, dot);
                const major = parseInt(majorStr);
                if (!digitReg.test(majorStr) ||
                    isNaN(major) ||
                    major < 0 ||
                    major > Big) {
                    break;
                }
                const minorStr = vers.substring(dot + 1);
                const minor = parseInt(minorStr);
                if (!digitReg.test(minorStr) ||
                    isNaN(minor) ||
                    minor < 0 ||
                    minor > Big) {
                    break;
                }
                return [major, minor];
            }
        }
        throw new Error(`malformed HTTP version ${vers}`);
    }
    exports.parseHTTPVersion = parseHTTPVersion;
    async function readRequest(conn, bufr) {
        const tp = new mod_ts_3.TextProtoReader(bufr);
        const firstLine = await tp.readLine(); // e.g. GET /index.html HTTP/1.0
        if (firstLine === Deno.EOF)
            return Deno.EOF;
        const headers = await tp.readMIMEHeader();
        if (headers === Deno.EOF)
            throw new bufio_ts_2.UnexpectedEOFError();
        const req = new ServerRequest();
        req.conn = conn;
        req.r = bufr;
        [req.method, req.url, req.proto] = firstLine.split(" ", 3);
        [req.protoMinor, req.protoMajor] = parseHTTPVersion(req.proto);
        req.headers = headers;
        fixLength(req);
        return req;
    }
    exports.readRequest = readRequest;
    class Server {
        constructor(listener) {
            this.listener = listener;
            this.closing = false;
        }
        close() {
            this.closing = true;
            this.listener.close();
        }
        // Yields all HTTP requests on a single TCP connection.
        async *iterateHttpRequests(conn) {
            const bufr = new bufio_ts_2.BufReader(conn);
            const w = new bufio_ts_2.BufWriter(conn);
            let req;
            let err;
            while (!this.closing) {
                try {
                    req = await readRequest(conn, bufr);
                }
                catch (e) {
                    err = e;
                    break;
                }
                if (req === Deno.EOF) {
                    break;
                }
                req.w = w;
                yield req;
                // Wait for the request to be processed before we accept a new request on
                // this connection.
                await req.done;
            }
            if (req === Deno.EOF) {
                // The connection was gracefully closed.
            }
            else if (err) {
                // An error was thrown while parsing request headers.
                try {
                    await writeResponse(req.w, {
                        status: 400,
                        body: new TextEncoder().encode(`${err.message}\r\n\r\n`)
                    });
                }
                catch (_) {
                    // The connection is destroyed.
                    // Ignores the error.
                }
            }
            else if (this.closing) {
                // There are more requests incoming but the server is closing.
                // TODO(ry): send a back a HTTP 503 Service Unavailable status.
            }
            conn.close();
        }
        // Accepts a new TCP connection and yields all HTTP requests that arrive on
        // it. When a connection is accepted, it also creates a new iterator of the
        // same kind and adds it to the request multiplexer so that another TCP
        // connection can be accepted.
        async *acceptConnAndIterateHttpRequests(mux) {
            if (this.closing)
                return;
            // Wait for a new connection.
            const { value, done } = await this.listener.next();
            if (done)
                return;
            const conn = value;
            // Try to accept another connection and add it to the multiplexer.
            mux.add(this.acceptConnAndIterateHttpRequests(mux));
            // Yield the requests that arrive on the just-accepted connection.
            yield* this.iterateHttpRequests(conn);
        }
        [Symbol.asyncIterator]() {
            const mux = new async_ts_1.MuxAsyncIterator();
            mux.add(this.acceptConnAndIterateHttpRequests(mux));
            return mux.iterate();
        }
    }
    exports.Server = Server;
    /**
     * Start a HTTP server
     *
     *     import { serve } from "https://deno.land/std/http/server.ts";
     *     const body = new TextEncoder().encode("Hello World\n");
     *     const s = serve({ port: 8000 });
     *     for await (const req of s) {
     *       req.respond({ body });
     *     }
     */
    function serve(addr) {
        if (typeof addr === "string") {
            const [hostname, port] = addr.split(":");
            addr = { hostname, port: Number(port) };
        }
        const listener = listen(addr);
        return new Server(listener);
    }
    exports.serve = serve;
    async function listenAndServe(addr, handler) {
        const server = serve(addr);
        for await (const request of server) {
            handler(request);
        }
    }
    exports.listenAndServe = listenAndServe;
    /**
     * Create an HTTPS server with given options
     *
     *     const body = new TextEncoder().encode("Hello HTTPS");
     *     const options = {
     *       hostname: "localhost",
     *       port: 443,
     *       certFile: "./path/to/localhost.crt",
     *       keyFile: "./path/to/localhost.key",
     *     };
     *     for await (const req of serveTLS(options)) {
     *       req.respond({ body });
     *     }
     *
     * @param options Server configuration
     * @return Async iterable server instance for incoming requests
     */
    function serveTLS(options) {
        const tlsOptions = {
            ...options,
            transport: "tcp"
        };
        const listener = listenTLS(tlsOptions);
        return new Server(listener);
    }
    exports.serveTLS = serveTLS;
    /**
     * Create an HTTPS server with given options and request handler
     *
     *     const body = new TextEncoder().encode("Hello HTTPS");
     *     const options = {
     *       hostname: "localhost",
     *       port: 443,
     *       certFile: "./path/to/localhost.crt",
     *       keyFile: "./path/to/localhost.key",
     *     };
     *     listenAndServeTLS(options, (req) => {
     *       req.respond({ body });
     *     });
     *
     * @param options Server configuration
     * @param handler Request handler
     */
    async function listenAndServeTLS(options, handler) {
        const server = serveTLS(options);
        for await (const request of server) {
            handler(request);
        }
    }
    exports.listenAndServeTLS = listenAndServeTLS;
});
define("file:///Users/haifeng/IT/01_Study/tech-share/tech-playground/deno/a", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hello = 'Hello World';
});
define("file:///Users/haifeng/IT/01_Study/tech-share/tech-playground/deno/mod", ["require", "exports", "https://deno.land/std@v0.24.0/http/server", "file:///Users/haifeng/IT/01_Study/tech-share/tech-playground/deno/a"], function (require, exports, server_ts_1, a_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const body = new TextEncoder().encode(`${a_ts_1.hello}\n`);
    const s = server_ts_1.serve({ port: 8000 });
    (async () => {
        const content = await Deno.readFile("./deno/a.ts");
        console.log(new TextDecoder().decode(content));
        console.table(Deno.metrics());
        console.log("http://localhost:8000/");
        for await (const req of s) {
            req.respond({ body });
        }
    })();
});

instantiate("file:///Users/haifeng/IT/01_Study/tech-share/tech-playground/deno/mod");
