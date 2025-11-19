// Clerk SDK Bundle
var Clerk = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/@clerk/clerk-js/dist/clerk.browser.js
  var require_clerk_browser = __commonJS({
    "node_modules/@clerk/clerk-js/dist/clerk.browser.js"(exports, module) {
      !(function(e, t) {
        if ("object" == typeof exports && "object" == typeof module) module.exports = t();
        else if ("function" == typeof define && define.amd) define([], t);
        else {
          var n = t();
          for (var r in n) ("object" == typeof exports ? exports : e)[r] = n[r];
        }
      })(globalThis, (function() {
        return (function() {
          var e, t, n, r, i = { 2163: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { A: function() {
              return re;
            } });
            var r2 = (function() {
              function e3(e4) {
                var t4 = this;
                this._insertTag = function(e5) {
                  var n3;
                  n3 = 0 === t4.tags.length ? t4.insertionPoint ? t4.insertionPoint.nextSibling : t4.prepend ? t4.container.firstChild : t4.before : t4.tags[t4.tags.length - 1].nextSibling, t4.container.insertBefore(e5, n3), t4.tags.push(e5);
                }, this.isSpeedy = void 0 === e4.speedy || e4.speedy, this.tags = [], this.ctr = 0, this.nonce = e4.nonce, this.key = e4.key, this.container = e4.container, this.prepend = e4.prepend, this.insertionPoint = e4.insertionPoint, this.before = null;
              }
              var t3 = e3.prototype;
              return t3.hydrate = function(e4) {
                e4.forEach(this._insertTag);
              }, t3.insert = function(e4) {
                this.ctr % (this.isSpeedy ? 65e3 : 1) == 0 && this._insertTag((function(e5) {
                  var t5 = document.createElement("style");
                  return t5.setAttribute("data-emotion", e5.key), void 0 !== e5.nonce && t5.setAttribute("nonce", e5.nonce), t5.appendChild(document.createTextNode("")), t5.setAttribute("data-s", ""), t5;
                })(this));
                var t4 = this.tags[this.tags.length - 1];
                if (this.isSpeedy) {
                  var n3 = (function(e5) {
                    if (e5.sheet) return e5.sheet;
                    for (var t5 = 0; t5 < document.styleSheets.length; t5++) if (document.styleSheets[t5].ownerNode === e5) return document.styleSheets[t5];
                  })(t4);
                  try {
                    n3.insertRule(e4, n3.cssRules.length);
                  } catch (r3) {
                  }
                } else t4.appendChild(document.createTextNode(e4));
                this.ctr++;
              }, t3.flush = function() {
                this.tags.forEach((function(e4) {
                  return e4.parentNode && e4.parentNode.removeChild(e4);
                })), this.tags = [], this.ctr = 0;
              }, e3;
            })(), i2 = Math.abs, o2 = String.fromCharCode, a2 = Object.assign;
            function s2(e3) {
              return e3.trim();
            }
            function c(e3, t3, n3) {
              return e3.replace(t3, n3);
            }
            function l(e3, t3) {
              return e3.indexOf(t3);
            }
            function u(e3, t3) {
              return 0 | e3.charCodeAt(t3);
            }
            function d(e3, t3, n3) {
              return e3.slice(t3, n3);
            }
            function h(e3) {
              return e3.length;
            }
            function f(e3) {
              return e3.length;
            }
            function p(e3, t3) {
              return t3.push(e3), e3;
            }
            var m = 1, g = 1, y = 0, v = 0, b = 0, w = "";
            function _(e3, t3, n3, r3, i3, o3, a3) {
              return { value: e3, root: t3, parent: n3, type: r3, props: i3, children: o3, line: m, column: g, length: a3, return: "" };
            }
            function S(e3, t3) {
              return a2(_("", null, null, "", null, null, 0), e3, { length: -e3.length }, t3);
            }
            function k() {
              return b = v > 0 ? u(w, --v) : 0, g--, 10 === b && (g = 1, m--), b;
            }
            function P() {
              return b = v < y ? u(w, v++) : 0, g++, 10 === b && (g = 1, m++), b;
            }
            function O() {
              return u(w, v);
            }
            function A() {
              return v;
            }
            function U(e3, t3) {
              return d(w, e3, t3);
            }
            function x(e3) {
              switch (e3) {
                case 0:
                case 9:
                case 10:
                case 13:
                case 32:
                  return 5;
                case 33:
                case 43:
                case 44:
                case 47:
                case 62:
                case 64:
                case 126:
                case 59:
                case 123:
                case 125:
                  return 4;
                case 58:
                  return 3;
                case 34:
                case 39:
                case 40:
                case 91:
                  return 2;
                case 41:
                case 93:
                  return 1;
              }
              return 0;
            }
            function C(e3) {
              return m = g = 1, y = h(w = e3), v = 0, [];
            }
            function E(e3) {
              return w = "", e3;
            }
            function I(e3) {
              return s2(U(v - 1, z(91 === e3 ? e3 + 2 : 40 === e3 ? e3 + 1 : e3)));
            }
            function M(e3) {
              for (; (b = O()) && b < 33; ) P();
              return x(e3) > 2 || x(b) > 3 ? "" : " ";
            }
            function R(e3, t3) {
              for (; --t3 && P() && !(b < 48 || b > 102 || b > 57 && b < 65 || b > 70 && b < 97); ) ;
              return U(e3, A() + (t3 < 6 && 32 == O() && 32 == P()));
            }
            function z(e3) {
              for (; P(); ) switch (b) {
                case e3:
                  return v;
                case 34:
                case 39:
                  34 !== e3 && 39 !== e3 && z(b);
                  break;
                case 40:
                  41 === e3 && z(e3);
                  break;
                case 92:
                  P();
              }
              return v;
            }
            function T(e3, t3) {
              for (; P() && e3 + b !== 57 && (e3 + b !== 84 || 47 !== O()); ) ;
              return "/*" + U(t3, v - 1) + "*" + o2(47 === e3 ? e3 : P());
            }
            function N(e3) {
              for (; !x(O()); ) P();
              return U(e3, v);
            }
            var L = "-ms-", j = "-moz-", $ = "-webkit-", F = "comm", D = "rule", W = "decl", V = "@keyframes";
            function B(e3, t3) {
              for (var n3 = "", r3 = f(e3), i3 = 0; i3 < r3; i3++) n3 += t3(e3[i3], i3, e3, t3) || "";
              return n3;
            }
            function J(e3, t3, n3, r3) {
              switch (e3.type) {
                case "@layer":
                  if (e3.children.length) break;
                case "@import":
                case W:
                  return e3.return = e3.return || e3.value;
                case F:
                  return "";
                case V:
                  return e3.return = e3.value + "{" + B(e3.children, r3) + "}";
                case D:
                  e3.value = e3.props.join(",");
              }
              return h(n3 = B(e3.children, r3)) ? e3.return = e3.value + "{" + n3 + "}" : "";
            }
            function q(e3) {
              return E(G("", null, null, null, [""], e3 = C(e3), 0, [0], e3));
            }
            function G(e3, t3, n3, r3, i3, a3, s3, d2, f2) {
              for (var m2 = 0, g2 = 0, y2 = s3, v2 = 0, b2 = 0, w2 = 0, _2 = 1, S2 = 1, U2 = 1, x2 = 0, C2 = "", E2 = i3, z2 = a3, L2 = r3, j2 = C2; S2; ) switch (w2 = x2, x2 = P()) {
                case 40:
                  if (108 != w2 && 58 == u(j2, y2 - 1)) {
                    -1 != l(j2 += c(I(x2), "&", "&\f"), "&\f") && (U2 = -1);
                    break;
                  }
                case 34:
                case 39:
                case 91:
                  j2 += I(x2);
                  break;
                case 9:
                case 10:
                case 13:
                case 32:
                  j2 += M(w2);
                  break;
                case 92:
                  j2 += R(A() - 1, 7);
                  continue;
                case 47:
                  switch (O()) {
                    case 42:
                    case 47:
                      p(K(T(P(), A()), t3, n3), f2);
                      break;
                    default:
                      j2 += "/";
                  }
                  break;
                case 123 * _2:
                  d2[m2++] = h(j2) * U2;
                case 125 * _2:
                case 59:
                case 0:
                  switch (x2) {
                    case 0:
                    case 125:
                      S2 = 0;
                    case 59 + g2:
                      -1 == U2 && (j2 = c(j2, /\f/g, "")), b2 > 0 && h(j2) - y2 && p(b2 > 32 ? Y(j2 + ";", r3, n3, y2 - 1) : Y(c(j2, " ", "") + ";", r3, n3, y2 - 2), f2);
                      break;
                    case 59:
                      j2 += ";";
                    default:
                      if (p(L2 = H(j2, t3, n3, m2, g2, i3, d2, C2, E2 = [], z2 = [], y2), a3), 123 === x2) if (0 === g2) G(j2, t3, L2, L2, E2, a3, y2, d2, z2);
                      else switch (99 === v2 && 110 === u(j2, 3) ? 100 : v2) {
                        case 100:
                        case 108:
                        case 109:
                        case 115:
                          G(e3, L2, L2, r3 && p(H(e3, L2, L2, 0, 0, i3, d2, C2, i3, E2 = [], y2), z2), i3, z2, y2, d2, r3 ? E2 : z2);
                          break;
                        default:
                          G(j2, L2, L2, L2, [""], z2, 0, d2, z2);
                      }
                  }
                  m2 = g2 = b2 = 0, _2 = U2 = 1, C2 = j2 = "", y2 = s3;
                  break;
                case 58:
                  y2 = 1 + h(j2), b2 = w2;
                default:
                  if (_2 < 1) {
                    if (123 == x2) --_2;
                    else if (125 == x2 && 0 == _2++ && 125 == k()) continue;
                  }
                  switch (j2 += o2(x2), x2 * _2) {
                    case 38:
                      U2 = g2 > 0 ? 1 : (j2 += "\f", -1);
                      break;
                    case 44:
                      d2[m2++] = (h(j2) - 1) * U2, U2 = 1;
                      break;
                    case 64:
                      45 === O() && (j2 += I(P())), v2 = O(), g2 = y2 = h(C2 = j2 += N(A())), x2++;
                      break;
                    case 45:
                      45 === w2 && 2 == h(j2) && (_2 = 0);
                  }
              }
              return a3;
            }
            function H(e3, t3, n3, r3, o3, a3, l2, u2, h2, p2, m2) {
              for (var g2 = o3 - 1, y2 = 0 === o3 ? a3 : [""], v2 = f(y2), b2 = 0, w2 = 0, S2 = 0; b2 < r3; ++b2) for (var k2 = 0, P2 = d(e3, g2 + 1, g2 = i2(w2 = l2[b2])), O2 = e3; k2 < v2; ++k2) (O2 = s2(w2 > 0 ? y2[k2] + " " + P2 : c(P2, /&\f/g, y2[k2]))) && (h2[S2++] = O2);
              return _(e3, t3, n3, 0 === o3 ? D : u2, h2, p2, m2);
            }
            function K(e3, t3, n3) {
              return _(e3, t3, n3, F, o2(b), d(e3, 2, -2), 0);
            }
            function Y(e3, t3, n3, r3) {
              return _(e3, t3, n3, W, d(e3, 0, r3), d(e3, r3 + 1, -1), r3);
            }
            var Z = function(e3, t3, n3) {
              for (var r3 = 0, i3 = 0; r3 = i3, i3 = O(), 38 === r3 && 12 === i3 && (t3[n3] = 1), !x(i3); ) P();
              return U(e3, v);
            }, Q = /* @__PURE__ */ new WeakMap(), X = function(e3) {
              if ("rule" === e3.type && e3.parent && !(e3.length < 1)) {
                for (var t3 = e3.value, n3 = e3.parent, r3 = e3.column === n3.column && e3.line === n3.line; "rule" !== n3.type; ) if (!(n3 = n3.parent)) return;
                if ((1 !== e3.props.length || 58 === t3.charCodeAt(0) || Q.get(n3)) && !r3) {
                  Q.set(e3, true);
                  for (var i3 = [], a3 = (function(e4, t4) {
                    return E((function(e5, t5) {
                      var n4 = -1, r4 = 44;
                      do {
                        switch (x(r4)) {
                          case 0:
                            38 === r4 && 12 === O() && (t5[n4] = 1), e5[n4] += Z(v - 1, t5, n4);
                            break;
                          case 2:
                            e5[n4] += I(r4);
                            break;
                          case 4:
                            if (44 === r4) {
                              e5[++n4] = 58 === O() ? "&\f" : "", t5[n4] = e5[n4].length;
                              break;
                            }
                          default:
                            e5[n4] += o2(r4);
                        }
                      } while (r4 = P());
                      return e5;
                    })(C(e4), t4));
                  })(t3, i3), s3 = n3.props, c2 = 0, l2 = 0; c2 < a3.length; c2++) for (var u2 = 0; u2 < s3.length; u2++, l2++) e3.props[l2] = i3[c2] ? a3[c2].replace(/&\f/g, s3[u2]) : s3[u2] + " " + a3[c2];
                }
              }
            }, ee = function(e3) {
              if ("decl" === e3.type) {
                var t3 = e3.value;
                108 === t3.charCodeAt(0) && 98 === t3.charCodeAt(2) && (e3.return = "", e3.value = "");
              }
            };
            function te(e3, t3) {
              switch ((function(e4, t4) {
                return 45 ^ u(e4, 0) ? (((t4 << 2 ^ u(e4, 0)) << 2 ^ u(e4, 1)) << 2 ^ u(e4, 2)) << 2 ^ u(e4, 3) : 0;
              })(e3, t3)) {
                case 5103:
                  return $ + "print-" + e3 + e3;
                case 5737:
                case 4201:
                case 3177:
                case 3433:
                case 1641:
                case 4457:
                case 2921:
                case 5572:
                case 6356:
                case 5844:
                case 3191:
                case 6645:
                case 3005:
                case 6391:
                case 5879:
                case 5623:
                case 6135:
                case 4599:
                case 4855:
                case 4215:
                case 6389:
                case 5109:
                case 5365:
                case 5621:
                case 3829:
                  return $ + e3 + e3;
                case 5349:
                case 4246:
                case 4810:
                case 6968:
                case 2756:
                  return $ + e3 + j + e3 + L + e3 + e3;
                case 6828:
                case 4268:
                  return $ + e3 + L + e3 + e3;
                case 6165:
                  return $ + e3 + L + "flex-" + e3 + e3;
                case 5187:
                  return $ + e3 + c(e3, /(\w+).+(:[^]+)/, $ + "box-$1$2" + L + "flex-$1$2") + e3;
                case 5443:
                  return $ + e3 + L + "flex-item-" + c(e3, /flex-|-self/, "") + e3;
                case 4675:
                  return $ + e3 + L + "flex-line-pack" + c(e3, /align-content|flex-|-self/, "") + e3;
                case 5548:
                  return $ + e3 + L + c(e3, "shrink", "negative") + e3;
                case 5292:
                  return $ + e3 + L + c(e3, "basis", "preferred-size") + e3;
                case 6060:
                  return $ + "box-" + c(e3, "-grow", "") + $ + e3 + L + c(e3, "grow", "positive") + e3;
                case 4554:
                  return $ + c(e3, /([^-])(transform)/g, "$1" + $ + "$2") + e3;
                case 6187:
                  return c(c(c(e3, /(zoom-|grab)/, $ + "$1"), /(image-set)/, $ + "$1"), e3, "") + e3;
                case 5495:
                case 3959:
                  return c(e3, /(image-set\([^]*)/, $ + "$1$`$1");
                case 4968:
                  return c(c(e3, /(.+:)(flex-)?(.*)/, $ + "box-pack:$3" + L + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + $ + e3 + e3;
                case 4095:
                case 3583:
                case 4068:
                case 2532:
                  return c(e3, /(.+)-inline(.+)/, $ + "$1$2") + e3;
                case 8116:
                case 7059:
                case 5753:
                case 5535:
                case 5445:
                case 5701:
                case 4933:
                case 4677:
                case 5533:
                case 5789:
                case 5021:
                case 4765:
                  if (h(e3) - 1 - t3 > 6) switch (u(e3, t3 + 1)) {
                    case 109:
                      if (45 !== u(e3, t3 + 4)) break;
                    case 102:
                      return c(e3, /(.+:)(.+)-([^]+)/, "$1" + $ + "$2-$3$1" + j + (108 == u(e3, t3 + 3) ? "$3" : "$2-$3")) + e3;
                    case 115:
                      return ~l(e3, "stretch") ? te(c(e3, "stretch", "fill-available"), t3) + e3 : e3;
                  }
                  break;
                case 4949:
                  if (115 !== u(e3, t3 + 1)) break;
                case 6444:
                  switch (u(e3, h(e3) - 3 - (~l(e3, "!important") && 10))) {
                    case 107:
                      return c(e3, ":", ":" + $) + e3;
                    case 101:
                      return c(e3, /(.+:)([^;!]+)(;|!.+)?/, "$1" + $ + (45 === u(e3, 14) ? "inline-" : "") + "box$3$1" + $ + "$2$3$1" + L + "$2box$3") + e3;
                  }
                  break;
                case 5936:
                  switch (u(e3, t3 + 11)) {
                    case 114:
                      return $ + e3 + L + c(e3, /[svh]\w+-[tblr]{2}/, "tb") + e3;
                    case 108:
                      return $ + e3 + L + c(e3, /[svh]\w+-[tblr]{2}/, "tb-rl") + e3;
                    case 45:
                      return $ + e3 + L + c(e3, /[svh]\w+-[tblr]{2}/, "lr") + e3;
                  }
                  return $ + e3 + L + e3 + e3;
              }
              return e3;
            }
            var ne = [function(e3, t3, n3, r3) {
              if (e3.length > -1 && !e3.return) switch (e3.type) {
                case W:
                  e3.return = te(e3.value, e3.length);
                  break;
                case V:
                  return B([S(e3, { value: c(e3.value, "@", "@" + $) })], r3);
                case D:
                  if (e3.length) return (function(e4, t4) {
                    return e4.map(t4).join("");
                  })(e3.props, (function(t4) {
                    switch ((function(e4, t5) {
                      return (e4 = /(::plac\w+|:read-\w+)/.exec(e4)) ? e4[0] : e4;
                    })(t4)) {
                      case ":read-only":
                      case ":read-write":
                        return B([S(e3, { props: [c(t4, /:(read-\w+)/, ":-moz-$1")] })], r3);
                      case "::placeholder":
                        return B([S(e3, { props: [c(t4, /:(plac\w+)/, ":" + $ + "input-$1")] }), S(e3, { props: [c(t4, /:(plac\w+)/, ":-moz-$1")] }), S(e3, { props: [c(t4, /:(plac\w+)/, L + "input-$1")] })], r3);
                    }
                    return "";
                  }));
              }
            }], re = function(e3) {
              var t3 = e3.key;
              if ("css" === t3) {
                var n3 = document.querySelectorAll("style[data-emotion]:not([data-s])");
                Array.prototype.forEach.call(n3, (function(e4) {
                  -1 !== e4.getAttribute("data-emotion").indexOf(" ") && (document.head.appendChild(e4), e4.setAttribute("data-s", ""));
                }));
              }
              var i3, o3, a3 = e3.stylisPlugins || ne, s3 = {}, c2 = [];
              i3 = e3.container || document.head, Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="' + t3 + ' "]'), (function(e4) {
                for (var t4 = e4.getAttribute("data-emotion").split(" "), n4 = 1; n4 < t4.length; n4++) s3[t4[n4]] = true;
                c2.push(e4);
              }));
              var l2, u2, d2, h2, p2 = [J, (h2 = function(e4) {
                l2.insert(e4);
              }, function(e4) {
                e4.root || (e4 = e4.return) && h2(e4);
              })], m2 = (u2 = [X, ee].concat(a3, p2), d2 = f(u2), function(e4, t4, n4, r3) {
                for (var i4 = "", o4 = 0; o4 < d2; o4++) i4 += u2[o4](e4, t4, n4, r3) || "";
                return i4;
              });
              o3 = function(e4, t4, n4, r3) {
                l2 = n4, B(q(e4 ? e4 + "{" + t4.styles + "}" : t4.styles), m2), r3 && (g2.inserted[t4.name] = true);
              };
              var g2 = { key: t3, sheet: new r2({ key: t3, container: i3, nonce: e3.nonce, speedy: e3.speedy, prepend: e3.prepend, insertionPoint: e3.insertionPoint }), nonce: e3.nonce, inserted: s3, registered: {}, insert: o3 };
              return g2.sheet.hydrate(c2), g2;
            };
          }, 2949: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { C: function() {
              return h;
            }, E: function() {
              return w;
            }, a: function() {
              return g;
            }, c: function() {
              return v;
            }, h: function() {
              return u;
            } });
            var r2 = n2(4041), i2 = n2(2163);
            function o2() {
              return o2 = Object.assign ? Object.assign.bind() : function(e3) {
                for (var t3 = 1; t3 < arguments.length; t3++) {
                  var n3 = arguments[t3];
                  for (var r3 in n3) Object.prototype.hasOwnProperty.call(n3, r3) && (e3[r3] = n3[r3]);
                }
                return e3;
              }, o2.apply(this, arguments);
            }
            var a2 = function(e3) {
              var t3 = /* @__PURE__ */ new WeakMap();
              return function(n3) {
                if (t3.has(n3)) return t3.get(n3);
                var r3 = e3(n3);
                return t3.set(n3, r3), r3;
              };
            }, s2 = function(e3, t3, n3) {
              var r3 = e3.key + "-" + t3.name;
              false === n3 && void 0 === e3.registered[r3] && (e3.registered[r3] = t3.styles);
            }, c = n2(6979), l = n2(6558), u = {}.hasOwnProperty, d = r2.createContext("undefined" != typeof HTMLElement ? (0, i2.A)({ key: "css" }) : null), h = d.Provider, f = function(e3) {
              return (0, r2.forwardRef)((function(t3, n3) {
                var i3 = (0, r2.useContext)(d);
                return e3(t3, i3, n3);
              }));
            }, p = r2.createContext({}), m = a2((function(e3) {
              return a2((function(t3) {
                return (function(e4, t4) {
                  return "function" == typeof t4 ? t4(e4) : o2({}, e4, t4);
                })(e3, t3);
              }));
            })), g = function(e3) {
              var t3 = r2.useContext(p);
              return e3.theme !== t3 && (t3 = m(t3)(e3.theme)), r2.createElement(p.Provider, { value: t3 }, e3.children);
            }, y = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__", v = function(e3, t3) {
              var n3 = {};
              for (var r3 in t3) u.call(t3, r3) && (n3[r3] = t3[r3]);
              return n3[y] = e3, n3;
            }, b = function(e3) {
              var t3 = e3.cache, n3 = e3.serialized, r3 = e3.isStringTag;
              return s2(t3, n3, r3), (0, l.s)((function() {
                return (function(e4, t4, n4) {
                  s2(e4, t4, n4);
                  var r4 = e4.key + "-" + t4.name;
                  if (void 0 === e4.inserted[t4.name]) {
                    var i3 = t4;
                    do {
                      e4.insert(t4 === i3 ? "." + r4 : "", i3, e4.sheet, true), i3 = i3.next;
                    } while (void 0 !== i3);
                  }
                })(t3, n3, r3);
              })), null;
            }, w = f((function(e3, t3, n3) {
              var i3 = e3.css;
              "string" == typeof i3 && void 0 !== t3.registered[i3] && (i3 = t3.registered[i3]);
              var o3 = e3[y], a3 = [i3], s3 = "";
              "string" == typeof e3.className ? s3 = (function(e4, t4, n4) {
                var r3 = "";
                return n4.split(" ").forEach((function(n5) {
                  void 0 !== e4[n5] ? t4.push(e4[n5] + ";") : r3 += n5 + " ";
                })), r3;
              })(t3.registered, a3, e3.className) : null != e3.className && (s3 = e3.className + " ");
              var l2 = (0, c.J)(a3, void 0, r2.useContext(p));
              s3 += t3.key + "-" + l2.name;
              var d2 = {};
              for (var h2 in e3) u.call(e3, h2) && "css" !== h2 && h2 !== y && (d2[h2] = e3[h2]);
              return d2.ref = n3, d2.className = s3, r2.createElement(r2.Fragment, null, r2.createElement(b, { cache: t3, serialized: l2, isStringTag: "string" == typeof o3 }), r2.createElement(o3, d2));
            }));
          }, 4380: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { FD: function() {
              return s2;
            }, FK: function() {
              return o2;
            }, Y: function() {
              return a2;
            } });
            var r2 = n2(1085), i2 = n2(2949), o2 = (n2(4041), n2(2163), n2(5985), n2(6979), n2(6558), r2.Fragment);
            function a2(e3, t3, n3) {
              return i2.h.call(t3, "css") ? r2.jsx(i2.E, (0, i2.c)(e3, t3), n3) : r2.jsx(e3, t3, n3);
            }
            function s2(e3, t3, n3) {
              return i2.h.call(t3, "css") ? r2.jsxs(i2.E, (0, i2.c)(e3, t3), n3) : r2.jsxs(e3, t3, n3);
            }
          }, 6979: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { J: function() {
              return p;
            } });
            var r2 = { animationIterationCount: 1, aspectRatio: 1, borderImageOutset: 1, borderImageSlice: 1, borderImageWidth: 1, boxFlex: 1, boxFlexGroup: 1, boxOrdinalGroup: 1, columnCount: 1, columns: 1, flex: 1, flexGrow: 1, flexPositive: 1, flexShrink: 1, flexNegative: 1, flexOrder: 1, gridRow: 1, gridRowEnd: 1, gridRowSpan: 1, gridRowStart: 1, gridColumn: 1, gridColumnEnd: 1, gridColumnSpan: 1, gridColumnStart: 1, msGridRow: 1, msGridRowSpan: 1, msGridColumn: 1, msGridColumnSpan: 1, fontWeight: 1, lineHeight: 1, opacity: 1, order: 1, orphans: 1, tabSize: 1, widows: 1, zIndex: 1, zoom: 1, WebkitLineClamp: 1, fillOpacity: 1, floodOpacity: 1, stopOpacity: 1, strokeDasharray: 1, strokeDashoffset: 1, strokeMiterlimit: 1, strokeOpacity: 1, strokeWidth: 1 };
            function i2(e3) {
              var t3 = /* @__PURE__ */ Object.create(null);
              return function(n3) {
                return void 0 === t3[n3] && (t3[n3] = e3(n3)), t3[n3];
              };
            }
            var o2 = /[A-Z]|^ms/g, a2 = /_EMO_([^_]+?)_([^]*?)_EMO_/g, s2 = function(e3) {
              return 45 === e3.charCodeAt(1);
            }, c = function(e3) {
              return null != e3 && "boolean" != typeof e3;
            }, l = i2((function(e3) {
              return s2(e3) ? e3 : e3.replace(o2, "-$&").toLowerCase();
            })), u = function(e3, t3) {
              switch (e3) {
                case "animation":
                case "animationName":
                  if ("string" == typeof t3) return t3.replace(a2, (function(e4, t4, n3) {
                    return h = { name: t4, styles: n3, next: h }, t4;
                  }));
              }
              return 1 === r2[e3] || s2(e3) || "number" != typeof t3 || 0 === t3 ? t3 : t3 + "px";
            };
            function d(e3, t3, n3) {
              if (null == n3) return "";
              if (void 0 !== n3.__emotion_styles) return n3;
              switch (typeof n3) {
                case "boolean":
                  return "";
                case "object":
                  if (1 === n3.anim) return h = { name: n3.name, styles: n3.styles, next: h }, n3.name;
                  if (void 0 !== n3.styles) {
                    var r3 = n3.next;
                    if (void 0 !== r3) for (; void 0 !== r3; ) h = { name: r3.name, styles: r3.styles, next: h }, r3 = r3.next;
                    return n3.styles + ";";
                  }
                  return (function(e4, t4, n4) {
                    var r4 = "";
                    if (Array.isArray(n4)) for (var i4 = 0; i4 < n4.length; i4++) r4 += d(e4, t4, n4[i4]) + ";";
                    else for (var o4 in n4) {
                      var a4 = n4[o4];
                      if ("object" != typeof a4) null != t4 && void 0 !== t4[a4] ? r4 += o4 + "{" + t4[a4] + "}" : c(a4) && (r4 += l(o4) + ":" + u(o4, a4) + ";");
                      else if (!Array.isArray(a4) || "string" != typeof a4[0] || null != t4 && void 0 !== t4[a4[0]]) {
                        var s3 = d(e4, t4, a4);
                        switch (o4) {
                          case "animation":
                          case "animationName":
                            r4 += l(o4) + ":" + s3 + ";";
                            break;
                          default:
                            r4 += o4 + "{" + s3 + "}";
                        }
                      } else for (var h2 = 0; h2 < a4.length; h2++) c(a4[h2]) && (r4 += l(o4) + ":" + u(o4, a4[h2]) + ";");
                    }
                    return r4;
                  })(e3, t3, n3);
                case "function":
                  if (void 0 !== e3) {
                    var i3 = h, o3 = n3(e3);
                    return h = i3, d(e3, t3, o3);
                  }
              }
              if (null == t3) return n3;
              var a3 = t3[n3];
              return void 0 !== a3 ? a3 : n3;
            }
            var h, f = /label:\s*([^\s;\n{]+)\s*(;|$)/g, p = function(e3, t3, n3) {
              if (1 === e3.length && "object" == typeof e3[0] && null !== e3[0] && void 0 !== e3[0].styles) return e3[0];
              var r3 = true, i3 = "";
              h = void 0;
              var o3 = e3[0];
              null == o3 || void 0 === o3.raw ? (r3 = false, i3 += d(n3, t3, o3)) : i3 += o3[0];
              for (var a3 = 1; a3 < e3.length; a3++) i3 += d(n3, t3, e3[a3]), r3 && (i3 += o3[a3]);
              f.lastIndex = 0;
              for (var s3, c2 = ""; null !== (s3 = f.exec(i3)); ) c2 += "-" + s3[1];
              var l2 = (function(e4) {
                for (var t4, n4 = 0, r4 = 0, i4 = e4.length; i4 >= 4; ++r4, i4 -= 4) t4 = 1540483477 * (65535 & (t4 = 255 & e4.charCodeAt(r4) | (255 & e4.charCodeAt(++r4)) << 8 | (255 & e4.charCodeAt(++r4)) << 16 | (255 & e4.charCodeAt(++r4)) << 24)) + (59797 * (t4 >>> 16) << 16), n4 = 1540483477 * (65535 & (t4 ^= t4 >>> 24)) + (59797 * (t4 >>> 16) << 16) ^ 1540483477 * (65535 & n4) + (59797 * (n4 >>> 16) << 16);
                switch (i4) {
                  case 3:
                    n4 ^= (255 & e4.charCodeAt(r4 + 2)) << 16;
                  case 2:
                    n4 ^= (255 & e4.charCodeAt(r4 + 1)) << 8;
                  case 1:
                    n4 = 1540483477 * (65535 & (n4 ^= 255 & e4.charCodeAt(r4))) + (59797 * (n4 >>> 16) << 16);
                }
                return (((n4 = 1540483477 * (65535 & (n4 ^= n4 >>> 13)) + (59797 * (n4 >>> 16) << 16)) ^ n4 >>> 15) >>> 0).toString(36);
              })(i3) + c2;
              return { name: l2, styles: i3, next: h };
            };
          }, 6558: function(e2, t2, n2) {
            "use strict";
            var r2;
            n2.d(t2, { s: function() {
              return a2;
            } });
            var i2 = n2(4041), o2 = !!(r2 || (r2 = n2.t(i2, 2))).useInsertionEffect && (r2 || (r2 = n2.t(i2, 2))).useInsertionEffect, a2 = o2 || function(e3) {
              return e3();
            };
            o2 || i2.useLayoutEffect;
          }, 3011: function(e2, t2, n2) {
            "use strict";
            var r2 = this && this.__awaiter || function(e3, t3, n3, r3) {
              return new (n3 || (n3 = Promise))((function(i3, o3) {
                function a3(e4) {
                  try {
                    c2(r3.next(e4));
                  } catch (t4) {
                    o3(t4);
                  }
                }
                function s3(e4) {
                  try {
                    c2(r3.throw(e4));
                  } catch (t4) {
                    o3(t4);
                  }
                }
                function c2(e4) {
                  e4.done ? i3(e4.value) : new n3((function(t4) {
                    t4(e4.value);
                  })).then(a3, s3);
                }
                c2((r3 = r3.apply(e3, t3 || [])).next());
              }));
            }, i2 = this && this.__generator || function(e3, t3) {
              var n3, r3, i3, o3, a3 = { label: 0, sent: function() {
                if (1 & i3[0]) throw i3[1];
                return i3[1];
              }, trys: [], ops: [] };
              return o3 = { next: s3(0), throw: s3(1), return: s3(2) }, "function" == typeof Symbol && (o3[Symbol.iterator] = function() {
                return this;
              }), o3;
              function s3(o4) {
                return function(s4) {
                  return (function(o5) {
                    if (n3) throw new TypeError("Generator is already executing.");
                    for (; a3; ) try {
                      if (n3 = 1, r3 && (i3 = 2 & o5[0] ? r3.return : o5[0] ? r3.throw || ((i3 = r3.return) && i3.call(r3), 0) : r3.next) && !(i3 = i3.call(r3, o5[1])).done) return i3;
                      switch (r3 = 0, i3 && (o5 = [2 & o5[0], i3.value]), o5[0]) {
                        case 0:
                        case 1:
                          i3 = o5;
                          break;
                        case 4:
                          return a3.label++, { value: o5[1], done: false };
                        case 5:
                          a3.label++, r3 = o5[1], o5 = [0];
                          continue;
                        case 7:
                          o5 = a3.ops.pop(), a3.trys.pop();
                          continue;
                        default:
                          if (!((i3 = (i3 = a3.trys).length > 0 && i3[i3.length - 1]) || 6 !== o5[0] && 2 !== o5[0])) {
                            a3 = 0;
                            continue;
                          }
                          if (3 === o5[0] && (!i3 || o5[1] > i3[0] && o5[1] < i3[3])) {
                            a3.label = o5[1];
                            break;
                          }
                          if (6 === o5[0] && a3.label < i3[1]) {
                            a3.label = i3[1], i3 = o5;
                            break;
                          }
                          if (i3 && a3.label < i3[2]) {
                            a3.label = i3[2], a3.ops.push(o5);
                            break;
                          }
                          i3[2] && a3.ops.pop(), a3.trys.pop();
                          continue;
                      }
                      o5 = t3.call(e3, a3);
                    } catch (s5) {
                      o5 = [6, s5], r3 = 0;
                    } finally {
                      n3 = i3 = 0;
                    }
                    if (5 & o5[0]) throw o5[1];
                    return { value: o5[0] ? o5[1] : void 0, done: true };
                  })([o4, s4]);
                };
              }
            };
            Object.defineProperty(t2, "__esModule", { value: true });
            var o2 = n2(6933), a2 = "browser-tabs-lock-key";
            function s2(e3) {
              return new Promise((function(t3) {
                return setTimeout(t3, e3);
              }));
            }
            function c(e3) {
              for (var t3 = "", n3 = 0; n3 < e3; n3++) t3 += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"[Math.floor(61 * Math.random())];
              return t3;
            }
            var l = (function() {
              function e3() {
                this.acquiredIatSet = /* @__PURE__ */ new Set(), this.id = Date.now().toString() + c(15), this.acquireLock = this.acquireLock.bind(this), this.releaseLock = this.releaseLock.bind(this), this.releaseLock__private__ = this.releaseLock__private__.bind(this), this.waitForSomethingToChange = this.waitForSomethingToChange.bind(this), this.refreshLockWhileAcquired = this.refreshLockWhileAcquired.bind(this), void 0 === e3.waiters && (e3.waiters = []);
              }
              return e3.prototype.acquireLock = function(t3, n3) {
                return void 0 === n3 && (n3 = 5e3), r2(this, void 0, void 0, (function() {
                  var r3, o3, l2, u, d, h;
                  return i2(this, (function(i3) {
                    switch (i3.label) {
                      case 0:
                        r3 = Date.now() + c(4), o3 = Date.now() + n3, l2 = a2 + "-" + t3, u = window.localStorage, i3.label = 1;
                      case 1:
                        return Date.now() < o3 ? [4, s2(30)] : [3, 8];
                      case 2:
                        return i3.sent(), null !== u.getItem(l2) ? [3, 5] : (d = this.id + "-" + t3 + "-" + r3, [4, s2(Math.floor(25 * Math.random()))]);
                      case 3:
                        return i3.sent(), u.setItem(l2, JSON.stringify({ id: this.id, iat: r3, timeoutKey: d, timeAcquired: Date.now(), timeRefreshed: Date.now() })), [4, s2(30)];
                      case 4:
                        return i3.sent(), null !== (h = u.getItem(l2)) && (h = JSON.parse(h)).id === this.id && h.iat === r3 ? (this.acquiredIatSet.add(r3), this.refreshLockWhileAcquired(l2, r3), [2, true]) : [3, 7];
                      case 5:
                        return e3.lockCorrector(), [4, this.waitForSomethingToChange(o3)];
                      case 6:
                        i3.sent(), i3.label = 7;
                      case 7:
                        return r3 = Date.now() + c(4), [3, 1];
                      case 8:
                        return [2, false];
                    }
                  }));
                }));
              }, e3.prototype.refreshLockWhileAcquired = function(e4, t3) {
                return r2(this, void 0, void 0, (function() {
                  var n3 = this;
                  return i2(this, (function(a3) {
                    return setTimeout((function() {
                      return r2(n3, void 0, void 0, (function() {
                        var n4, r3;
                        return i2(this, (function(i3) {
                          switch (i3.label) {
                            case 0:
                              return [4, o2.default().lock(t3)];
                            case 1:
                              return i3.sent(), this.acquiredIatSet.has(t3) ? (n4 = window.localStorage, null === (r3 = n4.getItem(e4)) ? (o2.default().unlock(t3), [2]) : ((r3 = JSON.parse(r3)).timeRefreshed = Date.now(), n4.setItem(e4, JSON.stringify(r3)), o2.default().unlock(t3), this.refreshLockWhileAcquired(e4, t3), [2])) : (o2.default().unlock(t3), [2]);
                          }
                        }));
                      }));
                    }), 1e3), [2];
                  }));
                }));
              }, e3.prototype.waitForSomethingToChange = function(t3) {
                return r2(this, void 0, void 0, (function() {
                  return i2(this, (function(n3) {
                    switch (n3.label) {
                      case 0:
                        return [4, new Promise((function(n4) {
                          var r3 = false, i3 = Date.now(), o3 = false;
                          function a3() {
                            if (o3 || (window.removeEventListener("storage", a3), e3.removeFromWaiting(a3), clearTimeout(s3), o3 = true), !r3) {
                              r3 = true;
                              var t4 = 50 - (Date.now() - i3);
                              t4 > 0 ? setTimeout(n4, t4) : n4();
                            }
                          }
                          window.addEventListener("storage", a3), e3.addToWaiting(a3);
                          var s3 = setTimeout(a3, Math.max(0, t3 - Date.now()));
                        }))];
                      case 1:
                        return n3.sent(), [2];
                    }
                  }));
                }));
              }, e3.addToWaiting = function(t3) {
                this.removeFromWaiting(t3), void 0 !== e3.waiters && e3.waiters.push(t3);
              }, e3.removeFromWaiting = function(t3) {
                void 0 !== e3.waiters && (e3.waiters = e3.waiters.filter((function(e4) {
                  return e4 !== t3;
                })));
              }, e3.notifyWaiters = function() {
                void 0 !== e3.waiters && e3.waiters.slice().forEach((function(e4) {
                  return e4();
                }));
              }, e3.prototype.releaseLock = function(e4) {
                return r2(this, void 0, void 0, (function() {
                  return i2(this, (function(t3) {
                    switch (t3.label) {
                      case 0:
                        return [4, this.releaseLock__private__(e4)];
                      case 1:
                        return [2, t3.sent()];
                    }
                  }));
                }));
              }, e3.prototype.releaseLock__private__ = function(t3) {
                return r2(this, void 0, void 0, (function() {
                  var n3, r3, s3;
                  return i2(this, (function(i3) {
                    switch (i3.label) {
                      case 0:
                        return n3 = window.localStorage, r3 = a2 + "-" + t3, null === (s3 = n3.getItem(r3)) ? [2] : (s3 = JSON.parse(s3)).id !== this.id ? [3, 2] : [4, o2.default().lock(s3.iat)];
                      case 1:
                        i3.sent(), this.acquiredIatSet.delete(s3.iat), n3.removeItem(r3), o2.default().unlock(s3.iat), e3.notifyWaiters(), i3.label = 2;
                      case 2:
                        return [2];
                    }
                  }));
                }));
              }, e3.lockCorrector = function() {
                for (var t3 = Date.now() - 5e3, n3 = window.localStorage, r3 = Object.keys(n3), i3 = false, o3 = 0; o3 < r3.length; o3++) {
                  var s3 = r3[o3];
                  if (s3.includes(a2)) {
                    var c2 = n3.getItem(s3);
                    null !== c2 && (void 0 === (c2 = JSON.parse(c2)).timeRefreshed && c2.timeAcquired < t3 || void 0 !== c2.timeRefreshed && c2.timeRefreshed < t3) && (n3.removeItem(s3), i3 = true);
                  }
                }
                i3 && e3.notifyWaiters();
              }, e3.waiters = void 0, e3;
            })();
            t2.default = l;
          }, 6933: function(e2, t2) {
            "use strict";
            Object.defineProperty(t2, "__esModule", { value: true });
            var n2 = (function() {
              function e3() {
                var e4 = this;
                this.locked = /* @__PURE__ */ new Map(), this.addToLocked = function(t3, n3) {
                  var r2 = e4.locked.get(t3);
                  void 0 === r2 ? void 0 === n3 ? e4.locked.set(t3, []) : e4.locked.set(t3, [n3]) : void 0 !== n3 && (r2.unshift(n3), e4.locked.set(t3, r2));
                }, this.isLocked = function(t3) {
                  return e4.locked.has(t3);
                }, this.lock = function(t3) {
                  return new Promise((function(n3, r2) {
                    e4.isLocked(t3) ? e4.addToLocked(t3, n3) : (e4.addToLocked(t3), n3());
                  }));
                }, this.unlock = function(t3) {
                  var n3 = e4.locked.get(t3);
                  if (void 0 !== n3 && 0 !== n3.length) {
                    var r2 = n3.pop();
                    e4.locked.set(t3, n3), void 0 !== r2 && setTimeout(r2, 0);
                  } else e4.locked.delete(t3);
                };
              }
              return e3.getInstance = function() {
                return void 0 === e3.instance && (e3.instance = new e3()), e3.instance;
              }, e3;
            })();
            t2.default = function() {
              return n2.getInstance();
            };
          }, 9818: function(e2, t2, n2) {
            "use strict";
            var r2 = n2(528), i2 = n2(8498), o2 = i2(r2("String.prototype.indexOf"));
            e2.exports = function(e3, t3) {
              var n3 = r2(e3, !!t3);
              return "function" == typeof n3 && o2(e3, ".prototype.") > -1 ? i2(n3) : n3;
            };
          }, 8498: function(e2, t2, n2) {
            "use strict";
            var r2 = n2(9138), i2 = n2(528), o2 = i2("%Function.prototype.apply%"), a2 = i2("%Function.prototype.call%"), s2 = i2("%Reflect.apply%", true) || r2.call(a2, o2), c = i2("%Object.getOwnPropertyDescriptor%", true), l = i2("%Object.defineProperty%", true), u = i2("%Math.max%");
            if (l) try {
              l({}, "a", { value: 1 });
            } catch (h) {
              l = null;
            }
            e2.exports = function(e3) {
              var t3 = s2(r2, a2, arguments);
              return c && l && c(t3, "length").configurable && l(t3, "length", { value: 1 + u(0, e3.length - (arguments.length - 1)) }), t3;
            };
            var d = function() {
              return s2(r2, o2, arguments);
            };
            l ? l(e2.exports, "apply", { value: d }) : e2.exports.apply = d;
          }, 8794: function(e2) {
            "use strict";
            var t2 = Array.prototype.slice, n2 = Object.prototype.toString;
            e2.exports = function(e3) {
              var r2 = this;
              if ("function" != typeof r2 || "[object Function]" !== n2.call(r2)) throw new TypeError("Function.prototype.bind called on incompatible " + r2);
              for (var i2, o2 = t2.call(arguments, 1), a2 = Math.max(0, r2.length - o2.length), s2 = [], c = 0; c < a2; c++) s2.push("$" + c);
              if (i2 = Function("binder", "return function (" + s2.join(",") + "){ return binder.apply(this,arguments); }")((function() {
                if (this instanceof i2) {
                  var n3 = r2.apply(this, o2.concat(t2.call(arguments)));
                  return Object(n3) === n3 ? n3 : this;
                }
                return r2.apply(e3, o2.concat(t2.call(arguments)));
              })), r2.prototype) {
                var l = function() {
                };
                l.prototype = r2.prototype, i2.prototype = new l(), l.prototype = null;
              }
              return i2;
            };
          }, 9138: function(e2, t2, n2) {
            "use strict";
            var r2 = n2(8794);
            e2.exports = Function.prototype.bind || r2;
          }, 528: function(e2, t2, n2) {
            "use strict";
            var r2, i2 = SyntaxError, o2 = Function, a2 = TypeError, s2 = function(e3) {
              try {
                return o2('"use strict"; return (' + e3 + ").constructor;")();
              } catch (t3) {
              }
            }, c = Object.getOwnPropertyDescriptor;
            if (c) try {
              c({}, "");
            } catch (E) {
              c = null;
            }
            var l = function() {
              throw new a2();
            }, u = c ? (function() {
              try {
                return l;
              } catch (e3) {
                try {
                  return c(arguments, "callee").get;
                } catch (t3) {
                  return l;
                }
              }
            })() : l, d = n2(3558)(), h = n2(6869)(), f = Object.getPrototypeOf || (h ? function(e3) {
              return e3.__proto__;
            } : null), p = {}, m = "undefined" != typeof Uint8Array && f ? f(Uint8Array) : r2, g = { "%AggregateError%": "undefined" == typeof AggregateError ? r2 : AggregateError, "%Array%": Array, "%ArrayBuffer%": "undefined" == typeof ArrayBuffer ? r2 : ArrayBuffer, "%ArrayIteratorPrototype%": d && f ? f([][Symbol.iterator]()) : r2, "%AsyncFromSyncIteratorPrototype%": r2, "%AsyncFunction%": p, "%AsyncGenerator%": p, "%AsyncGeneratorFunction%": p, "%AsyncIteratorPrototype%": p, "%Atomics%": "undefined" == typeof Atomics ? r2 : Atomics, "%BigInt%": "undefined" == typeof BigInt ? r2 : BigInt, "%BigInt64Array%": "undefined" == typeof BigInt64Array ? r2 : BigInt64Array, "%BigUint64Array%": "undefined" == typeof BigUint64Array ? r2 : BigUint64Array, "%Boolean%": Boolean, "%DataView%": "undefined" == typeof DataView ? r2 : DataView, "%Date%": Date, "%decodeURI%": decodeURI, "%decodeURIComponent%": decodeURIComponent, "%encodeURI%": encodeURI, "%encodeURIComponent%": encodeURIComponent, "%Error%": Error, "%eval%": eval, "%EvalError%": EvalError, "%Float32Array%": "undefined" == typeof Float32Array ? r2 : Float32Array, "%Float64Array%": "undefined" == typeof Float64Array ? r2 : Float64Array, "%FinalizationRegistry%": "undefined" == typeof FinalizationRegistry ? r2 : FinalizationRegistry, "%Function%": o2, "%GeneratorFunction%": p, "%Int8Array%": "undefined" == typeof Int8Array ? r2 : Int8Array, "%Int16Array%": "undefined" == typeof Int16Array ? r2 : Int16Array, "%Int32Array%": "undefined" == typeof Int32Array ? r2 : Int32Array, "%isFinite%": isFinite, "%isNaN%": isNaN, "%IteratorPrototype%": d && f ? f(f([][Symbol.iterator]())) : r2, "%JSON%": "object" == typeof JSON ? JSON : r2, "%Map%": "undefined" == typeof Map ? r2 : Map, "%MapIteratorPrototype%": "undefined" != typeof Map && d && f ? f((/* @__PURE__ */ new Map())[Symbol.iterator]()) : r2, "%Math%": Math, "%Number%": Number, "%Object%": Object, "%parseFloat%": parseFloat, "%parseInt%": parseInt, "%Promise%": "undefined" == typeof Promise ? r2 : Promise, "%Proxy%": "undefined" == typeof Proxy ? r2 : Proxy, "%RangeError%": RangeError, "%ReferenceError%": ReferenceError, "%Reflect%": "undefined" == typeof Reflect ? r2 : Reflect, "%RegExp%": RegExp, "%Set%": "undefined" == typeof Set ? r2 : Set, "%SetIteratorPrototype%": "undefined" != typeof Set && d && f ? f((/* @__PURE__ */ new Set())[Symbol.iterator]()) : r2, "%SharedArrayBuffer%": "undefined" == typeof SharedArrayBuffer ? r2 : SharedArrayBuffer, "%String%": String, "%StringIteratorPrototype%": d && f ? f(""[Symbol.iterator]()) : r2, "%Symbol%": d ? Symbol : r2, "%SyntaxError%": i2, "%ThrowTypeError%": u, "%TypedArray%": m, "%TypeError%": a2, "%Uint8Array%": "undefined" == typeof Uint8Array ? r2 : Uint8Array, "%Uint8ClampedArray%": "undefined" == typeof Uint8ClampedArray ? r2 : Uint8ClampedArray, "%Uint16Array%": "undefined" == typeof Uint16Array ? r2 : Uint16Array, "%Uint32Array%": "undefined" == typeof Uint32Array ? r2 : Uint32Array, "%URIError%": URIError, "%WeakMap%": "undefined" == typeof WeakMap ? r2 : WeakMap, "%WeakRef%": "undefined" == typeof WeakRef ? r2 : WeakRef, "%WeakSet%": "undefined" == typeof WeakSet ? r2 : WeakSet };
            if (f) try {
              null.error;
            } catch (E) {
              var y = f(f(E));
              g["%Error.prototype%"] = y;
            }
            var v = function e3(t3) {
              var n3;
              if ("%AsyncFunction%" === t3) n3 = s2("async function () {}");
              else if ("%GeneratorFunction%" === t3) n3 = s2("function* () {}");
              else if ("%AsyncGeneratorFunction%" === t3) n3 = s2("async function* () {}");
              else if ("%AsyncGenerator%" === t3) {
                var r3 = e3("%AsyncGeneratorFunction%");
                r3 && (n3 = r3.prototype);
              } else if ("%AsyncIteratorPrototype%" === t3) {
                var i3 = e3("%AsyncGenerator%");
                i3 && f && (n3 = f(i3.prototype));
              }
              return g[t3] = n3, n3;
            }, b = { "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"], "%ArrayPrototype%": ["Array", "prototype"], "%ArrayProto_entries%": ["Array", "prototype", "entries"], "%ArrayProto_forEach%": ["Array", "prototype", "forEach"], "%ArrayProto_keys%": ["Array", "prototype", "keys"], "%ArrayProto_values%": ["Array", "prototype", "values"], "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"], "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"], "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"], "%BooleanPrototype%": ["Boolean", "prototype"], "%DataViewPrototype%": ["DataView", "prototype"], "%DatePrototype%": ["Date", "prototype"], "%ErrorPrototype%": ["Error", "prototype"], "%EvalErrorPrototype%": ["EvalError", "prototype"], "%Float32ArrayPrototype%": ["Float32Array", "prototype"], "%Float64ArrayPrototype%": ["Float64Array", "prototype"], "%FunctionPrototype%": ["Function", "prototype"], "%Generator%": ["GeneratorFunction", "prototype"], "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"], "%Int8ArrayPrototype%": ["Int8Array", "prototype"], "%Int16ArrayPrototype%": ["Int16Array", "prototype"], "%Int32ArrayPrototype%": ["Int32Array", "prototype"], "%JSONParse%": ["JSON", "parse"], "%JSONStringify%": ["JSON", "stringify"], "%MapPrototype%": ["Map", "prototype"], "%NumberPrototype%": ["Number", "prototype"], "%ObjectPrototype%": ["Object", "prototype"], "%ObjProto_toString%": ["Object", "prototype", "toString"], "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"], "%PromisePrototype%": ["Promise", "prototype"], "%PromiseProto_then%": ["Promise", "prototype", "then"], "%Promise_all%": ["Promise", "all"], "%Promise_reject%": ["Promise", "reject"], "%Promise_resolve%": ["Promise", "resolve"], "%RangeErrorPrototype%": ["RangeError", "prototype"], "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"], "%RegExpPrototype%": ["RegExp", "prototype"], "%SetPrototype%": ["Set", "prototype"], "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"], "%StringPrototype%": ["String", "prototype"], "%SymbolPrototype%": ["Symbol", "prototype"], "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"], "%TypedArrayPrototype%": ["TypedArray", "prototype"], "%TypeErrorPrototype%": ["TypeError", "prototype"], "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"], "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"], "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"], "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"], "%URIErrorPrototype%": ["URIError", "prototype"], "%WeakMapPrototype%": ["WeakMap", "prototype"], "%WeakSetPrototype%": ["WeakSet", "prototype"] }, w = n2(9138), _ = n2(2571), S = w.call(Function.call, Array.prototype.concat), k = w.call(Function.apply, Array.prototype.splice), P = w.call(Function.call, String.prototype.replace), O = w.call(Function.call, String.prototype.slice), A = w.call(Function.call, RegExp.prototype.exec), U = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, x = /\\(\\)?/g, C = function(e3, t3) {
              var n3, r3 = e3;
              if (_(b, r3) && (r3 = "%" + (n3 = b[r3])[0] + "%"), _(g, r3)) {
                var o3 = g[r3];
                if (o3 === p && (o3 = v(r3)), void 0 === o3 && !t3) throw new a2("intrinsic " + e3 + " exists, but is not available. Please file an issue!");
                return { alias: n3, name: r3, value: o3 };
              }
              throw new i2("intrinsic " + e3 + " does not exist!");
            };
            e2.exports = function(e3, t3) {
              if ("string" != typeof e3 || 0 === e3.length) throw new a2("intrinsic name must be a non-empty string");
              if (arguments.length > 1 && "boolean" != typeof t3) throw new a2('"allowMissing" argument must be a boolean');
              if (null === A(/^%?[^%]*%?$/, e3)) throw new i2("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
              var n3 = (function(e4) {
                var t4 = O(e4, 0, 1), n4 = O(e4, -1);
                if ("%" === t4 && "%" !== n4) throw new i2("invalid intrinsic syntax, expected closing `%`");
                if ("%" === n4 && "%" !== t4) throw new i2("invalid intrinsic syntax, expected opening `%`");
                var r4 = [];
                return P(e4, U, (function(e5, t5, n5, i3) {
                  r4[r4.length] = n5 ? P(i3, x, "$1") : t5 || e5;
                })), r4;
              })(e3), r3 = n3.length > 0 ? n3[0] : "", o3 = C("%" + r3 + "%", t3), s3 = o3.name, l2 = o3.value, u2 = false, d2 = o3.alias;
              d2 && (r3 = d2[0], k(n3, S([0, 1], d2)));
              for (var h2 = 1, f2 = true; h2 < n3.length; h2 += 1) {
                var p2 = n3[h2], m2 = O(p2, 0, 1), y2 = O(p2, -1);
                if (('"' === m2 || "'" === m2 || "`" === m2 || '"' === y2 || "'" === y2 || "`" === y2) && m2 !== y2) throw new i2("property names with quotes must have matching quotes");
                if ("constructor" !== p2 && f2 || (u2 = true), _(g, s3 = "%" + (r3 += "." + p2) + "%")) l2 = g[s3];
                else if (null != l2) {
                  if (!(p2 in l2)) {
                    if (!t3) throw new a2("base intrinsic for " + e3 + " exists, but the property is not available.");
                    return;
                  }
                  if (c && h2 + 1 >= n3.length) {
                    var v2 = c(l2, p2);
                    l2 = (f2 = !!v2) && "get" in v2 && !("originalValue" in v2.get) ? v2.get : l2[p2];
                  } else f2 = _(l2, p2), l2 = l2[p2];
                  f2 && !u2 && (g[s3] = l2);
                }
              }
              return l2;
            };
          }, 2580: function(e2) {
            e2.exports = function(e3, t2) {
              if ("string" != typeof e3) throw new TypeError("Expected a string");
              for (var n2, r2 = String(e3), i2 = "", o2 = !!t2 && !!t2.extended, a2 = !!t2 && !!t2.globstar, s2 = false, c = t2 && "string" == typeof t2.flags ? t2.flags : "", l = 0, u = r2.length; l < u; l++) switch (n2 = r2[l]) {
                case "/":
                case "$":
                case "^":
                case "+":
                case ".":
                case "(":
                case ")":
                case "=":
                case "!":
                case "|":
                  i2 += "\\" + n2;
                  break;
                case "?":
                  if (o2) {
                    i2 += ".";
                    break;
                  }
                case "[":
                case "]":
                  if (o2) {
                    i2 += n2;
                    break;
                  }
                case "{":
                  if (o2) {
                    s2 = true, i2 += "(";
                    break;
                  }
                case "}":
                  if (o2) {
                    s2 = false, i2 += ")";
                    break;
                  }
                case ",":
                  if (s2) {
                    i2 += "|";
                    break;
                  }
                  i2 += "\\" + n2;
                  break;
                case "*":
                  for (var d = r2[l - 1], h = 1; "*" === r2[l + 1]; ) h++, l++;
                  var f = r2[l + 1];
                  a2 ? !(h > 1) || "/" !== d && void 0 !== d || "/" !== f && void 0 !== f ? i2 += "([^/]*)" : (i2 += "((?:[^/]*(?:/|$))*)", l++) : i2 += ".*";
                  break;
                default:
                  i2 += n2;
              }
              return c && ~c.indexOf("g") || (i2 = "^" + i2 + "$"), new RegExp(i2, c);
            };
          }, 6869: function(e2) {
            "use strict";
            var t2 = { foo: {} }, n2 = Object;
            e2.exports = function() {
              return { __proto__: t2 }.foo === t2.foo && !({ __proto__: null } instanceof n2);
            };
          }, 3558: function(e2, t2, n2) {
            "use strict";
            var r2 = "undefined" != typeof Symbol && Symbol, i2 = n2(2908);
            e2.exports = function() {
              return "function" == typeof r2 && "function" == typeof Symbol && "symbol" == typeof r2("foo") && "symbol" == typeof Symbol("bar") && i2();
            };
          }, 2908: function(e2) {
            "use strict";
            e2.exports = function() {
              if ("function" != typeof Symbol || "function" != typeof Object.getOwnPropertySymbols) return false;
              if ("symbol" == typeof Symbol.iterator) return true;
              var e3 = {}, t2 = Symbol("test"), n2 = Object(t2);
              if ("string" == typeof t2) return false;
              if ("[object Symbol]" !== Object.prototype.toString.call(t2)) return false;
              if ("[object Symbol]" !== Object.prototype.toString.call(n2)) return false;
              for (t2 in e3[t2] = 42, e3) return false;
              if ("function" == typeof Object.keys && 0 !== Object.keys(e3).length) return false;
              if ("function" == typeof Object.getOwnPropertyNames && 0 !== Object.getOwnPropertyNames(e3).length) return false;
              var r2 = Object.getOwnPropertySymbols(e3);
              if (1 !== r2.length || r2[0] !== t2) return false;
              if (!Object.prototype.propertyIsEnumerable.call(e3, t2)) return false;
              if ("function" == typeof Object.getOwnPropertyDescriptor) {
                var i2 = Object.getOwnPropertyDescriptor(e3, t2);
                if (42 !== i2.value || true !== i2.enumerable) return false;
              }
              return true;
            };
          }, 2571: function(e2, t2, n2) {
            "use strict";
            var r2 = n2(9138);
            e2.exports = r2.call(Function.call, Object.prototype.hasOwnProperty);
          }, 5985: function(e2, t2, n2) {
            "use strict";
            var r2 = n2(524), i2 = { childContextTypes: true, contextType: true, contextTypes: true, defaultProps: true, displayName: true, getDefaultProps: true, getDerivedStateFromError: true, getDerivedStateFromProps: true, mixins: true, propTypes: true, type: true }, o2 = { name: true, length: true, prototype: true, caller: true, callee: true, arguments: true, arity: true }, a2 = { $$typeof: true, compare: true, defaultProps: true, displayName: true, propTypes: true, type: true }, s2 = {};
            function c(e3) {
              return r2.isMemo(e3) ? a2 : s2[e3.$$typeof] || i2;
            }
            s2[r2.ForwardRef] = { $$typeof: true, render: true, defaultProps: true, displayName: true, propTypes: true }, s2[r2.Memo] = a2;
            var l = Object.defineProperty, u = Object.getOwnPropertyNames, d = Object.getOwnPropertySymbols, h = Object.getOwnPropertyDescriptor, f = Object.getPrototypeOf, p = Object.prototype;
            e2.exports = function e3(t3, n3, r3) {
              if ("string" != typeof n3) {
                if (p) {
                  var i3 = f(n3);
                  i3 && i3 !== p && e3(t3, i3, r3);
                }
                var a3 = u(n3);
                d && (a3 = a3.concat(d(n3)));
                for (var s3 = c(t3), m = c(n3), g = 0; g < a3.length; ++g) {
                  var y = a3[g];
                  if (!(o2[y] || r3 && r3[y] || m && m[y] || s3 && s3[y])) {
                    var v = h(n3, y);
                    try {
                      l(t3, y, v);
                    } catch (b) {
                    }
                  }
                }
              }
              return t3;
            };
          }, 8660: function(e2, t2, n2) {
            var r2 = "function" == typeof Map && Map.prototype, i2 = Object.getOwnPropertyDescriptor && r2 ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, o2 = r2 && i2 && "function" == typeof i2.get ? i2.get : null, a2 = r2 && Map.prototype.forEach, s2 = "function" == typeof Set && Set.prototype, c = Object.getOwnPropertyDescriptor && s2 ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, l = s2 && c && "function" == typeof c.get ? c.get : null, u = s2 && Set.prototype.forEach, d = "function" == typeof WeakMap && WeakMap.prototype ? WeakMap.prototype.has : null, h = "function" == typeof WeakSet && WeakSet.prototype ? WeakSet.prototype.has : null, f = "function" == typeof WeakRef && WeakRef.prototype ? WeakRef.prototype.deref : null, p = Boolean.prototype.valueOf, m = Object.prototype.toString, g = Function.prototype.toString, y = String.prototype.match, v = String.prototype.slice, b = String.prototype.replace, w = String.prototype.toUpperCase, _ = String.prototype.toLowerCase, S = RegExp.prototype.test, k = Array.prototype.concat, P = Array.prototype.join, O = Array.prototype.slice, A = Math.floor, U = "function" == typeof BigInt ? BigInt.prototype.valueOf : null, x = Object.getOwnPropertySymbols, C = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? Symbol.prototype.toString : null, E = "function" == typeof Symbol && "object" == typeof Symbol.iterator, I = "function" == typeof Symbol && Symbol.toStringTag && (Symbol.toStringTag, 1) ? Symbol.toStringTag : null, M = Object.prototype.propertyIsEnumerable, R = ("function" == typeof Reflect ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(e3) {
              return e3.__proto__;
            } : null);
            function z(e3, t3) {
              if (e3 === 1 / 0 || e3 === -1 / 0 || e3 != e3 || e3 && e3 > -1e3 && e3 < 1e3 || S.call(/e/, t3)) return t3;
              var n3 = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
              if ("number" == typeof e3) {
                var r3 = e3 < 0 ? -A(-e3) : A(e3);
                if (r3 !== e3) {
                  var i3 = String(r3), o3 = v.call(t3, i3.length + 1);
                  return b.call(i3, n3, "$&_") + "." + b.call(b.call(o3, /([0-9]{3})/g, "$&_"), /_$/, "");
                }
              }
              return b.call(t3, n3, "$&_");
            }
            var T = n2(6973), N = T.custom, L = W(N) ? N : null;
            function j(e3, t3, n3) {
              var r3 = "double" === (n3.quoteStyle || t3) ? '"' : "'";
              return r3 + e3 + r3;
            }
            function $(e3) {
              return b.call(String(e3), /"/g, "&quot;");
            }
            function F(e3) {
              return !("[object Array]" !== J(e3) || I && "object" == typeof e3 && I in e3);
            }
            function D(e3) {
              return !("[object RegExp]" !== J(e3) || I && "object" == typeof e3 && I in e3);
            }
            function W(e3) {
              if (E) return e3 && "object" == typeof e3 && e3 instanceof Symbol;
              if ("symbol" == typeof e3) return true;
              if (!e3 || "object" != typeof e3 || !C) return false;
              try {
                return C.call(e3), true;
              } catch (t3) {
              }
              return false;
            }
            e2.exports = function e3(t3, n3, r3, i3) {
              var s3 = n3 || {};
              if (B(s3, "quoteStyle") && "single" !== s3.quoteStyle && "double" !== s3.quoteStyle) throw new TypeError('option "quoteStyle" must be "single" or "double"');
              if (B(s3, "maxStringLength") && ("number" == typeof s3.maxStringLength ? s3.maxStringLength < 0 && s3.maxStringLength !== 1 / 0 : null !== s3.maxStringLength)) throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
              var c2 = !B(s3, "customInspect") || s3.customInspect;
              if ("boolean" != typeof c2 && "symbol" !== c2) throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
              if (B(s3, "indent") && null !== s3.indent && "	" !== s3.indent && !(parseInt(s3.indent, 10) === s3.indent && s3.indent > 0)) throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
              if (B(s3, "numericSeparator") && "boolean" != typeof s3.numericSeparator) throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
              var m2 = s3.numericSeparator;
              if (void 0 === t3) return "undefined";
              if (null === t3) return "null";
              if ("boolean" == typeof t3) return t3 ? "true" : "false";
              if ("string" == typeof t3) return G(t3, s3);
              if ("number" == typeof t3) {
                if (0 === t3) return 1 / 0 / t3 > 0 ? "0" : "-0";
                var w2 = String(t3);
                return m2 ? z(t3, w2) : w2;
              }
              if ("bigint" == typeof t3) {
                var S2 = String(t3) + "n";
                return m2 ? z(t3, S2) : S2;
              }
              var A2 = void 0 === s3.depth ? 5 : s3.depth;
              if (void 0 === r3 && (r3 = 0), r3 >= A2 && A2 > 0 && "object" == typeof t3) return F(t3) ? "[Array]" : "[Object]";
              var x2, N2 = (function(e4, t4) {
                var n4;
                if ("	" === e4.indent) n4 = "	";
                else {
                  if (!("number" == typeof e4.indent && e4.indent > 0)) return null;
                  n4 = P.call(Array(e4.indent + 1), " ");
                }
                return { base: n4, prev: P.call(Array(t4 + 1), n4) };
              })(s3, r3);
              if (void 0 === i3) i3 = [];
              else if (q(i3, t3) >= 0) return "[Circular]";
              function V2(t4, n4, o3) {
                if (n4 && (i3 = O.call(i3)).push(n4), o3) {
                  var a3 = { depth: s3.depth };
                  return B(s3, "quoteStyle") && (a3.quoteStyle = s3.quoteStyle), e3(t4, a3, r3 + 1, i3);
                }
                return e3(t4, s3, r3 + 1, i3);
              }
              if ("function" == typeof t3 && !D(t3)) {
                var H2 = (function(e4) {
                  if (e4.name) return e4.name;
                  var t4 = y.call(g.call(e4), /^function\s*([\w$]+)/);
                  return t4 ? t4[1] : null;
                })(t3), ee = X(t3, V2);
                return "[Function" + (H2 ? ": " + H2 : " (anonymous)") + "]" + (ee.length > 0 ? " { " + P.call(ee, ", ") + " }" : "");
              }
              if (W(t3)) {
                var te = E ? b.call(String(t3), /^(Symbol\(.*\))_[^)]*$/, "$1") : C.call(t3);
                return "object" != typeof t3 || E ? te : K(te);
              }
              if ((x2 = t3) && "object" == typeof x2 && ("undefined" != typeof HTMLElement && x2 instanceof HTMLElement || "string" == typeof x2.nodeName && "function" == typeof x2.getAttribute)) {
                for (var ne = "<" + _.call(String(t3.nodeName)), re = t3.attributes || [], ie = 0; ie < re.length; ie++) ne += " " + re[ie].name + "=" + j($(re[ie].value), "double", s3);
                return ne += ">", t3.childNodes && t3.childNodes.length && (ne += "..."), ne + "</" + _.call(String(t3.nodeName)) + ">";
              }
              if (F(t3)) {
                if (0 === t3.length) return "[]";
                var oe = X(t3, V2);
                return N2 && !(function(e4) {
                  for (var t4 = 0; t4 < e4.length; t4++) if (q(e4[t4], "\n") >= 0) return false;
                  return true;
                })(oe) ? "[" + Q(oe, N2) + "]" : "[ " + P.call(oe, ", ") + " ]";
              }
              if ((function(e4) {
                return !("[object Error]" !== J(e4) || I && "object" == typeof e4 && I in e4);
              })(t3)) {
                var ae = X(t3, V2);
                return "cause" in Error.prototype || !("cause" in t3) || M.call(t3, "cause") ? 0 === ae.length ? "[" + String(t3) + "]" : "{ [" + String(t3) + "] " + P.call(ae, ", ") + " }" : "{ [" + String(t3) + "] " + P.call(k.call("[cause]: " + V2(t3.cause), ae), ", ") + " }";
              }
              if ("object" == typeof t3 && c2) {
                if (L && "function" == typeof t3[L] && T) return T(t3, { depth: A2 - r3 });
                if ("symbol" !== c2 && "function" == typeof t3.inspect) return t3.inspect();
              }
              if ((function(e4) {
                if (!o2 || !e4 || "object" != typeof e4) return false;
                try {
                  o2.call(e4);
                  try {
                    l.call(e4);
                  } catch (ne2) {
                    return true;
                  }
                  return e4 instanceof Map;
                } catch (t4) {
                }
                return false;
              })(t3)) {
                var se = [];
                return a2 && a2.call(t3, (function(e4, n4) {
                  se.push(V2(n4, t3, true) + " => " + V2(e4, t3));
                })), Z("Map", o2.call(t3), se, N2);
              }
              if ((function(e4) {
                if (!l || !e4 || "object" != typeof e4) return false;
                try {
                  l.call(e4);
                  try {
                    o2.call(e4);
                  } catch (t4) {
                    return true;
                  }
                  return e4 instanceof Set;
                } catch (n4) {
                }
                return false;
              })(t3)) {
                var ce = [];
                return u && u.call(t3, (function(e4) {
                  ce.push(V2(e4, t3));
                })), Z("Set", l.call(t3), ce, N2);
              }
              if ((function(e4) {
                if (!d || !e4 || "object" != typeof e4) return false;
                try {
                  d.call(e4, d);
                  try {
                    h.call(e4, h);
                  } catch (ne2) {
                    return true;
                  }
                  return e4 instanceof WeakMap;
                } catch (t4) {
                }
                return false;
              })(t3)) return Y("WeakMap");
              if ((function(e4) {
                if (!h || !e4 || "object" != typeof e4) return false;
                try {
                  h.call(e4, h);
                  try {
                    d.call(e4, d);
                  } catch (ne2) {
                    return true;
                  }
                  return e4 instanceof WeakSet;
                } catch (t4) {
                }
                return false;
              })(t3)) return Y("WeakSet");
              if ((function(e4) {
                if (!f || !e4 || "object" != typeof e4) return false;
                try {
                  return f.call(e4), true;
                } catch (t4) {
                }
                return false;
              })(t3)) return Y("WeakRef");
              if ((function(e4) {
                return !("[object Number]" !== J(e4) || I && "object" == typeof e4 && I in e4);
              })(t3)) return K(V2(Number(t3)));
              if ((function(e4) {
                if (!e4 || "object" != typeof e4 || !U) return false;
                try {
                  return U.call(e4), true;
                } catch (t4) {
                }
                return false;
              })(t3)) return K(V2(U.call(t3)));
              if ((function(e4) {
                return !("[object Boolean]" !== J(e4) || I && "object" == typeof e4 && I in e4);
              })(t3)) return K(p.call(t3));
              if ((function(e4) {
                return !("[object String]" !== J(e4) || I && "object" == typeof e4 && I in e4);
              })(t3)) return K(V2(String(t3)));
              if (!(function(e4) {
                return !("[object Date]" !== J(e4) || I && "object" == typeof e4 && I in e4);
              })(t3) && !D(t3)) {
                var le = X(t3, V2), ue = R ? R(t3) === Object.prototype : t3 instanceof Object || t3.constructor === Object, de = t3 instanceof Object ? "" : "null prototype", he = !ue && I && Object(t3) === t3 && I in t3 ? v.call(J(t3), 8, -1) : de ? "Object" : "", fe = (ue || "function" != typeof t3.constructor ? "" : t3.constructor.name ? t3.constructor.name + " " : "") + (he || de ? "[" + P.call(k.call([], he || [], de || []), ": ") + "] " : "");
                return 0 === le.length ? fe + "{}" : N2 ? fe + "{" + Q(le, N2) + "}" : fe + "{ " + P.call(le, ", ") + " }";
              }
              return String(t3);
            };
            var V = Object.prototype.hasOwnProperty || function(e3) {
              return e3 in this;
            };
            function B(e3, t3) {
              return V.call(e3, t3);
            }
            function J(e3) {
              return m.call(e3);
            }
            function q(e3, t3) {
              if (e3.indexOf) return e3.indexOf(t3);
              for (var n3 = 0, r3 = e3.length; n3 < r3; n3++) if (e3[n3] === t3) return n3;
              return -1;
            }
            function G(e3, t3) {
              if (e3.length > t3.maxStringLength) {
                var n3 = e3.length - t3.maxStringLength, r3 = "... " + n3 + " more character" + (n3 > 1 ? "s" : "");
                return G(v.call(e3, 0, t3.maxStringLength), t3) + r3;
              }
              return j(b.call(b.call(e3, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, H), "single", t3);
            }
            function H(e3) {
              var t3 = e3.charCodeAt(0), n3 = { 8: "b", 9: "t", 10: "n", 12: "f", 13: "r" }[t3];
              return n3 ? "\\" + n3 : "\\x" + (t3 < 16 ? "0" : "") + w.call(t3.toString(16));
            }
            function K(e3) {
              return "Object(" + e3 + ")";
            }
            function Y(e3) {
              return e3 + " { ? }";
            }
            function Z(e3, t3, n3, r3) {
              return e3 + " (" + t3 + ") {" + (r3 ? Q(n3, r3) : P.call(n3, ", ")) + "}";
            }
            function Q(e3, t3) {
              if (0 === e3.length) return "";
              var n3 = "\n" + t3.prev + t3.base;
              return n3 + P.call(e3, "," + n3) + "\n" + t3.prev;
            }
            function X(e3, t3) {
              var n3 = F(e3), r3 = [];
              if (n3) {
                r3.length = e3.length;
                for (var i3 = 0; i3 < e3.length; i3++) r3[i3] = B(e3, i3) ? t3(e3[i3], e3) : "";
              }
              var o3, a3 = "function" == typeof x ? x(e3) : [];
              if (E) {
                o3 = {};
                for (var s3 = 0; s3 < a3.length; s3++) o3["$" + a3[s3]] = a3[s3];
              }
              for (var c2 in e3) B(e3, c2) && (n3 && String(Number(c2)) === c2 && c2 < e3.length || E && o3["$" + c2] instanceof Symbol || (S.call(/[^\w$]/, c2) ? r3.push(t3(c2, e3) + ": " + t3(e3[c2], e3)) : r3.push(c2 + ": " + t3(e3[c2], e3))));
              if ("function" == typeof x) for (var l2 = 0; l2 < a3.length; l2++) M.call(e3, a3[l2]) && r3.push("[" + t3(a3[l2]) + "]: " + t3(e3[a3[l2]], e3));
              return r3;
            }
          }, 1830: function(e2) {
            "use strict";
            var t2 = String.prototype.replace, n2 = /%20/g, r2 = "RFC3986";
            e2.exports = { default: r2, formatters: { RFC1738: function(e3) {
              return t2.call(e3, n2, "+");
            }, RFC3986: function(e3) {
              return String(e3);
            } }, RFC1738: "RFC1738", RFC3986: r2 };
          }, 5810: function(e2, t2, n2) {
            "use strict";
            var r2 = n2(6623), i2 = n2(6193), o2 = n2(1830);
            e2.exports = { formats: o2, parse: i2, stringify: r2 };
          }, 6193: function(e2, t2, n2) {
            "use strict";
            var r2 = n2(1539), i2 = Object.prototype.hasOwnProperty, o2 = Array.isArray, a2 = { allowDots: false, allowPrototypes: false, allowSparse: false, arrayLimit: 20, charset: "utf-8", charsetSentinel: false, comma: false, decoder: r2.decode, delimiter: "&", depth: 5, ignoreQueryPrefix: false, interpretNumericEntities: false, parameterLimit: 1e3, parseArrays: true, plainObjects: false, strictNullHandling: false }, s2 = function(e3) {
              return e3.replace(/&#(\d+);/g, (function(e4, t3) {
                return String.fromCharCode(parseInt(t3, 10));
              }));
            }, c = function(e3, t3) {
              return e3 && "string" == typeof e3 && t3.comma && e3.indexOf(",") > -1 ? e3.split(",") : e3;
            }, l = function(e3, t3, n3, r3) {
              if (e3) {
                var o3 = n3.allowDots ? e3.replace(/\.([^.[]+)/g, "[$1]") : e3, a3 = /(\[[^[\]]*])/g, s3 = n3.depth > 0 && /(\[[^[\]]*])/.exec(o3), l2 = s3 ? o3.slice(0, s3.index) : o3, u = [];
                if (l2) {
                  if (!n3.plainObjects && i2.call(Object.prototype, l2) && !n3.allowPrototypes) return;
                  u.push(l2);
                }
                for (var d = 0; n3.depth > 0 && null !== (s3 = a3.exec(o3)) && d < n3.depth; ) {
                  if (d += 1, !n3.plainObjects && i2.call(Object.prototype, s3[1].slice(1, -1)) && !n3.allowPrototypes) return;
                  u.push(s3[1]);
                }
                return s3 && u.push("[" + o3.slice(s3.index) + "]"), (function(e4, t4, n4, r4) {
                  for (var i3 = r4 ? t4 : c(t4, n4), o4 = e4.length - 1; o4 >= 0; --o4) {
                    var a4, s4 = e4[o4];
                    if ("[]" === s4 && n4.parseArrays) a4 = [].concat(i3);
                    else {
                      a4 = n4.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
                      var l3 = "[" === s4.charAt(0) && "]" === s4.charAt(s4.length - 1) ? s4.slice(1, -1) : s4, u2 = parseInt(l3, 10);
                      n4.parseArrays || "" !== l3 ? !isNaN(u2) && s4 !== l3 && String(u2) === l3 && u2 >= 0 && n4.parseArrays && u2 <= n4.arrayLimit ? (a4 = [])[u2] = i3 : "__proto__" !== l3 && (a4[l3] = i3) : a4 = { 0: i3 };
                    }
                    i3 = a4;
                  }
                  return i3;
                })(u, t3, n3, r3);
              }
            };
            e2.exports = function(e3, t3) {
              var n3 = (function(e4) {
                if (!e4) return a2;
                if (null !== e4.decoder && void 0 !== e4.decoder && "function" != typeof e4.decoder) throw new TypeError("Decoder has to be a function.");
                if (void 0 !== e4.charset && "utf-8" !== e4.charset && "iso-8859-1" !== e4.charset) throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
                var t4 = void 0 === e4.charset ? a2.charset : e4.charset;
                return { allowDots: void 0 === e4.allowDots ? a2.allowDots : !!e4.allowDots, allowPrototypes: "boolean" == typeof e4.allowPrototypes ? e4.allowPrototypes : a2.allowPrototypes, allowSparse: "boolean" == typeof e4.allowSparse ? e4.allowSparse : a2.allowSparse, arrayLimit: "number" == typeof e4.arrayLimit ? e4.arrayLimit : a2.arrayLimit, charset: t4, charsetSentinel: "boolean" == typeof e4.charsetSentinel ? e4.charsetSentinel : a2.charsetSentinel, comma: "boolean" == typeof e4.comma ? e4.comma : a2.comma, decoder: "function" == typeof e4.decoder ? e4.decoder : a2.decoder, delimiter: "string" == typeof e4.delimiter || r2.isRegExp(e4.delimiter) ? e4.delimiter : a2.delimiter, depth: "number" == typeof e4.depth || false === e4.depth ? +e4.depth : a2.depth, ignoreQueryPrefix: true === e4.ignoreQueryPrefix, interpretNumericEntities: "boolean" == typeof e4.interpretNumericEntities ? e4.interpretNumericEntities : a2.interpretNumericEntities, parameterLimit: "number" == typeof e4.parameterLimit ? e4.parameterLimit : a2.parameterLimit, parseArrays: false !== e4.parseArrays, plainObjects: "boolean" == typeof e4.plainObjects ? e4.plainObjects : a2.plainObjects, strictNullHandling: "boolean" == typeof e4.strictNullHandling ? e4.strictNullHandling : a2.strictNullHandling };
              })(t3);
              if ("" === e3 || null == e3) return n3.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
              for (var u = "string" == typeof e3 ? (function(e4, t4) {
                var n4, l2 = {}, u2 = t4.ignoreQueryPrefix ? e4.replace(/^\?/, "") : e4, d2 = t4.parameterLimit === 1 / 0 ? void 0 : t4.parameterLimit, h2 = u2.split(t4.delimiter, d2), f2 = -1, p2 = t4.charset;
                if (t4.charsetSentinel) for (n4 = 0; n4 < h2.length; ++n4) 0 === h2[n4].indexOf("utf8=") && ("utf8=%E2%9C%93" === h2[n4] ? p2 = "utf-8" : "utf8=%26%2310003%3B" === h2[n4] && (p2 = "iso-8859-1"), f2 = n4, n4 = h2.length);
                for (n4 = 0; n4 < h2.length; ++n4) if (n4 !== f2) {
                  var m2, g, y = h2[n4], v = y.indexOf("]="), b = -1 === v ? y.indexOf("=") : v + 1;
                  -1 === b ? (m2 = t4.decoder(y, a2.decoder, p2, "key"), g = t4.strictNullHandling ? null : "") : (m2 = t4.decoder(y.slice(0, b), a2.decoder, p2, "key"), g = r2.maybeMap(c(y.slice(b + 1), t4), (function(e5) {
                    return t4.decoder(e5, a2.decoder, p2, "value");
                  }))), g && t4.interpretNumericEntities && "iso-8859-1" === p2 && (g = s2(g)), y.indexOf("[]=") > -1 && (g = o2(g) ? [g] : g), i2.call(l2, m2) ? l2[m2] = r2.combine(l2[m2], g) : l2[m2] = g;
                }
                return l2;
              })(e3, n3) : e3, d = n3.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, h = Object.keys(u), f = 0; f < h.length; ++f) {
                var p = h[f], m = l(p, u[p], n3, "string" == typeof e3);
                d = r2.merge(d, m, n3);
              }
              return true === n3.allowSparse ? d : r2.compact(d);
            };
          }, 6623: function(e2, t2, n2) {
            "use strict";
            var r2 = n2(7575), i2 = n2(1539), o2 = n2(1830), a2 = Object.prototype.hasOwnProperty, s2 = { brackets: function(e3) {
              return e3 + "[]";
            }, comma: "comma", indices: function(e3, t3) {
              return e3 + "[" + t3 + "]";
            }, repeat: function(e3) {
              return e3;
            } }, c = Array.isArray, l = String.prototype.split, u = Array.prototype.push, d = function(e3, t3) {
              u.apply(e3, c(t3) ? t3 : [t3]);
            }, h = Date.prototype.toISOString, f = o2.default, p = { addQueryPrefix: false, allowDots: false, charset: "utf-8", charsetSentinel: false, delimiter: "&", encode: true, encoder: i2.encode, encodeValuesOnly: false, format: f, formatter: o2.formatters[f], indices: false, serializeDate: function(e3) {
              return h.call(e3);
            }, skipNulls: false, strictNullHandling: false }, m = {}, g = function e3(t3, n3, o3, a3, s3, u2, h2, f2, g2, y, v, b, w, _, S, k) {
              for (var P, O = t3, A = k, U = 0, x = false; void 0 !== (A = A.get(m)) && !x; ) {
                var C = A.get(t3);
                if (U += 1, void 0 !== C) {
                  if (C === U) throw new RangeError("Cyclic object value");
                  x = true;
                }
                void 0 === A.get(m) && (U = 0);
              }
              if ("function" == typeof f2 ? O = f2(n3, O) : O instanceof Date ? O = v(O) : "comma" === o3 && c(O) && (O = i2.maybeMap(O, (function(e4) {
                return e4 instanceof Date ? v(e4) : e4;
              }))), null === O) {
                if (s3) return h2 && !_ ? h2(n3, p.encoder, S, "key", b) : n3;
                O = "";
              }
              if ("string" == typeof (P = O) || "number" == typeof P || "boolean" == typeof P || "symbol" == typeof P || "bigint" == typeof P || i2.isBuffer(O)) {
                if (h2) {
                  var E = _ ? n3 : h2(n3, p.encoder, S, "key", b);
                  if ("comma" === o3 && _) {
                    for (var I = l.call(String(O), ","), M = "", R = 0; R < I.length; ++R) M += (0 === R ? "" : ",") + w(h2(I[R], p.encoder, S, "value", b));
                    return [w(E) + (a3 && c(O) && 1 === I.length ? "[]" : "") + "=" + M];
                  }
                  return [w(E) + "=" + w(h2(O, p.encoder, S, "value", b))];
                }
                return [w(n3) + "=" + w(String(O))];
              }
              var z, T = [];
              if (void 0 === O) return T;
              if ("comma" === o3 && c(O)) z = [{ value: O.length > 0 ? O.join(",") || null : void 0 }];
              else if (c(f2)) z = f2;
              else {
                var N = Object.keys(O);
                z = g2 ? N.sort(g2) : N;
              }
              for (var L = a3 && c(O) && 1 === O.length ? n3 + "[]" : n3, j = 0; j < z.length; ++j) {
                var $ = z[j], F = "object" == typeof $ && void 0 !== $.value ? $.value : O[$];
                if (!u2 || null !== F) {
                  var D = c(O) ? "function" == typeof o3 ? o3(L, $) : L : L + (y ? "." + $ : "[" + $ + "]");
                  k.set(t3, U);
                  var W = r2();
                  W.set(m, k), d(T, e3(F, D, o3, a3, s3, u2, h2, f2, g2, y, v, b, w, _, S, W));
                }
              }
              return T;
            };
            e2.exports = function(e3, t3) {
              var n3, i3 = e3, l2 = (function(e4) {
                if (!e4) return p;
                if (null !== e4.encoder && void 0 !== e4.encoder && "function" != typeof e4.encoder) throw new TypeError("Encoder has to be a function.");
                var t4 = e4.charset || p.charset;
                if (void 0 !== e4.charset && "utf-8" !== e4.charset && "iso-8859-1" !== e4.charset) throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
                var n4 = o2.default;
                if (void 0 !== e4.format) {
                  if (!a2.call(o2.formatters, e4.format)) throw new TypeError("Unknown format option provided.");
                  n4 = e4.format;
                }
                var r3 = o2.formatters[n4], i4 = p.filter;
                return ("function" == typeof e4.filter || c(e4.filter)) && (i4 = e4.filter), { addQueryPrefix: "boolean" == typeof e4.addQueryPrefix ? e4.addQueryPrefix : p.addQueryPrefix, allowDots: void 0 === e4.allowDots ? p.allowDots : !!e4.allowDots, charset: t4, charsetSentinel: "boolean" == typeof e4.charsetSentinel ? e4.charsetSentinel : p.charsetSentinel, delimiter: void 0 === e4.delimiter ? p.delimiter : e4.delimiter, encode: "boolean" == typeof e4.encode ? e4.encode : p.encode, encoder: "function" == typeof e4.encoder ? e4.encoder : p.encoder, encodeValuesOnly: "boolean" == typeof e4.encodeValuesOnly ? e4.encodeValuesOnly : p.encodeValuesOnly, filter: i4, format: n4, formatter: r3, serializeDate: "function" == typeof e4.serializeDate ? e4.serializeDate : p.serializeDate, skipNulls: "boolean" == typeof e4.skipNulls ? e4.skipNulls : p.skipNulls, sort: "function" == typeof e4.sort ? e4.sort : null, strictNullHandling: "boolean" == typeof e4.strictNullHandling ? e4.strictNullHandling : p.strictNullHandling };
              })(t3);
              "function" == typeof l2.filter ? i3 = (0, l2.filter)("", i3) : c(l2.filter) && (n3 = l2.filter);
              var u2, h2 = [];
              if ("object" != typeof i3 || null === i3) return "";
              u2 = t3 && t3.arrayFormat in s2 ? t3.arrayFormat : t3 && "indices" in t3 ? t3.indices ? "indices" : "repeat" : "indices";
              var f2 = s2[u2];
              if (t3 && "commaRoundTrip" in t3 && "boolean" != typeof t3.commaRoundTrip) throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
              var m2 = "comma" === f2 && t3 && t3.commaRoundTrip;
              n3 || (n3 = Object.keys(i3)), l2.sort && n3.sort(l2.sort);
              for (var y = r2(), v = 0; v < n3.length; ++v) {
                var b = n3[v];
                l2.skipNulls && null === i3[b] || d(h2, g(i3[b], b, f2, m2, l2.strictNullHandling, l2.skipNulls, l2.encode ? l2.encoder : null, l2.filter, l2.sort, l2.allowDots, l2.serializeDate, l2.format, l2.formatter, l2.encodeValuesOnly, l2.charset, y));
              }
              var w = h2.join(l2.delimiter), _ = true === l2.addQueryPrefix ? "?" : "";
              return l2.charsetSentinel && ("iso-8859-1" === l2.charset ? _ += "utf8=%26%2310003%3B&" : _ += "utf8=%E2%9C%93&"), w.length > 0 ? _ + w : "";
            };
          }, 1539: function(e2, t2, n2) {
            "use strict";
            var r2 = n2(1830), i2 = Object.prototype.hasOwnProperty, o2 = Array.isArray, a2 = (function() {
              for (var e3 = [], t3 = 0; t3 < 256; ++t3) e3.push("%" + ((t3 < 16 ? "0" : "") + t3.toString(16)).toUpperCase());
              return e3;
            })(), s2 = function(e3, t3) {
              for (var n3 = t3 && t3.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, r3 = 0; r3 < e3.length; ++r3) void 0 !== e3[r3] && (n3[r3] = e3[r3]);
              return n3;
            };
            e2.exports = { arrayToObject: s2, assign: function(e3, t3) {
              return Object.keys(t3).reduce((function(e4, n3) {
                return e4[n3] = t3[n3], e4;
              }), e3);
            }, combine: function(e3, t3) {
              return [].concat(e3, t3);
            }, compact: function(e3) {
              for (var t3 = [{ obj: { o: e3 }, prop: "o" }], n3 = [], r3 = 0; r3 < t3.length; ++r3) for (var i3 = t3[r3], a3 = i3.obj[i3.prop], s3 = Object.keys(a3), c = 0; c < s3.length; ++c) {
                var l = s3[c], u = a3[l];
                "object" == typeof u && null !== u && -1 === n3.indexOf(u) && (t3.push({ obj: a3, prop: l }), n3.push(u));
              }
              return (function(e4) {
                for (; e4.length > 1; ) {
                  var t4 = e4.pop(), n4 = t4.obj[t4.prop];
                  if (o2(n4)) {
                    for (var r4 = [], i4 = 0; i4 < n4.length; ++i4) void 0 !== n4[i4] && r4.push(n4[i4]);
                    t4.obj[t4.prop] = r4;
                  }
                }
              })(t3), e3;
            }, decode: function(e3, t3, n3) {
              var r3 = e3.replace(/\+/g, " ");
              if ("iso-8859-1" === n3) return r3.replace(/%[0-9a-f]{2}/gi, unescape);
              try {
                return decodeURIComponent(r3);
              } catch (i3) {
                return r3;
              }
            }, encode: function(e3, t3, n3, i3, o3) {
              if (0 === e3.length) return e3;
              var s3 = e3;
              if ("symbol" == typeof e3 ? s3 = Symbol.prototype.toString.call(e3) : "string" != typeof e3 && (s3 = String(e3)), "iso-8859-1" === n3) return escape(s3).replace(/%u[0-9a-f]{4}/gi, (function(e4) {
                return "%26%23" + parseInt(e4.slice(2), 16) + "%3B";
              }));
              for (var c = "", l = 0; l < s3.length; ++l) {
                var u = s3.charCodeAt(l);
                45 === u || 46 === u || 95 === u || 126 === u || u >= 48 && u <= 57 || u >= 65 && u <= 90 || u >= 97 && u <= 122 || o3 === r2.RFC1738 && (40 === u || 41 === u) ? c += s3.charAt(l) : u < 128 ? c += a2[u] : u < 2048 ? c += a2[192 | u >> 6] + a2[128 | 63 & u] : u < 55296 || u >= 57344 ? c += a2[224 | u >> 12] + a2[128 | u >> 6 & 63] + a2[128 | 63 & u] : (l += 1, u = 65536 + ((1023 & u) << 10 | 1023 & s3.charCodeAt(l)), c += a2[240 | u >> 18] + a2[128 | u >> 12 & 63] + a2[128 | u >> 6 & 63] + a2[128 | 63 & u]);
              }
              return c;
            }, isBuffer: function(e3) {
              return !(!e3 || "object" != typeof e3 || !(e3.constructor && e3.constructor.isBuffer && e3.constructor.isBuffer(e3)));
            }, isRegExp: function(e3) {
              return "[object RegExp]" === Object.prototype.toString.call(e3);
            }, maybeMap: function(e3, t3) {
              if (o2(e3)) {
                for (var n3 = [], r3 = 0; r3 < e3.length; r3 += 1) n3.push(t3(e3[r3]));
                return n3;
              }
              return t3(e3);
            }, merge: function e3(t3, n3, r3) {
              if (!n3) return t3;
              if ("object" != typeof n3) {
                if (o2(t3)) t3.push(n3);
                else {
                  if (!t3 || "object" != typeof t3) return [t3, n3];
                  (r3 && (r3.plainObjects || r3.allowPrototypes) || !i2.call(Object.prototype, n3)) && (t3[n3] = true);
                }
                return t3;
              }
              if (!t3 || "object" != typeof t3) return [t3].concat(n3);
              var a3 = t3;
              return o2(t3) && !o2(n3) && (a3 = s2(t3, r3)), o2(t3) && o2(n3) ? (n3.forEach((function(n4, o3) {
                if (i2.call(t3, o3)) {
                  var a4 = t3[o3];
                  a4 && "object" == typeof a4 && n4 && "object" == typeof n4 ? t3[o3] = e3(a4, n4, r3) : t3.push(n4);
                } else t3[o3] = n4;
              })), t3) : Object.keys(n3).reduce((function(t4, o3) {
                var a4 = n3[o3];
                return i2.call(t4, o3) ? t4[o3] = e3(t4[o3], a4, r3) : t4[o3] = a4, t4;
              }), a3);
            } };
          }, 320: function(e2, t2) {
            "use strict";
            var n2 = "function" == typeof Symbol && Symbol.for, r2 = n2 ? Symbol.for("react.element") : 60103, i2 = n2 ? Symbol.for("react.portal") : 60106, o2 = n2 ? Symbol.for("react.fragment") : 60107, a2 = n2 ? Symbol.for("react.strict_mode") : 60108, s2 = n2 ? Symbol.for("react.profiler") : 60114, c = n2 ? Symbol.for("react.provider") : 60109, l = n2 ? Symbol.for("react.context") : 60110, u = n2 ? Symbol.for("react.async_mode") : 60111, d = n2 ? Symbol.for("react.concurrent_mode") : 60111, h = n2 ? Symbol.for("react.forward_ref") : 60112, f = n2 ? Symbol.for("react.suspense") : 60113, p = n2 ? Symbol.for("react.suspense_list") : 60120, m = n2 ? Symbol.for("react.memo") : 60115, g = n2 ? Symbol.for("react.lazy") : 60116, y = n2 ? Symbol.for("react.block") : 60121, v = n2 ? Symbol.for("react.fundamental") : 60117, b = n2 ? Symbol.for("react.responder") : 60118, w = n2 ? Symbol.for("react.scope") : 60119;
            function _(e3) {
              if ("object" == typeof e3 && null !== e3) {
                var t3 = e3.$$typeof;
                switch (t3) {
                  case r2:
                    switch (e3 = e3.type) {
                      case u:
                      case d:
                      case o2:
                      case s2:
                      case a2:
                      case f:
                        return e3;
                      default:
                        switch (e3 = e3 && e3.$$typeof) {
                          case l:
                          case h:
                          case g:
                          case m:
                          case c:
                            return e3;
                          default:
                            return t3;
                        }
                    }
                  case i2:
                    return t3;
                }
              }
            }
            function S(e3) {
              return _(e3) === d;
            }
            t2.AsyncMode = u, t2.ConcurrentMode = d, t2.ContextConsumer = l, t2.ContextProvider = c, t2.Element = r2, t2.ForwardRef = h, t2.Fragment = o2, t2.Lazy = g, t2.Memo = m, t2.Portal = i2, t2.Profiler = s2, t2.StrictMode = a2, t2.Suspense = f, t2.isAsyncMode = function(e3) {
              return S(e3) || _(e3) === u;
            }, t2.isConcurrentMode = S, t2.isContextConsumer = function(e3) {
              return _(e3) === l;
            }, t2.isContextProvider = function(e3) {
              return _(e3) === c;
            }, t2.isElement = function(e3) {
              return "object" == typeof e3 && null !== e3 && e3.$$typeof === r2;
            }, t2.isForwardRef = function(e3) {
              return _(e3) === h;
            }, t2.isFragment = function(e3) {
              return _(e3) === o2;
            }, t2.isLazy = function(e3) {
              return _(e3) === g;
            }, t2.isMemo = function(e3) {
              return _(e3) === m;
            }, t2.isPortal = function(e3) {
              return _(e3) === i2;
            }, t2.isProfiler = function(e3) {
              return _(e3) === s2;
            }, t2.isStrictMode = function(e3) {
              return _(e3) === a2;
            }, t2.isSuspense = function(e3) {
              return _(e3) === f;
            }, t2.isValidElementType = function(e3) {
              return "string" == typeof e3 || "function" == typeof e3 || e3 === o2 || e3 === d || e3 === s2 || e3 === a2 || e3 === f || e3 === p || "object" == typeof e3 && null !== e3 && (e3.$$typeof === g || e3.$$typeof === m || e3.$$typeof === c || e3.$$typeof === l || e3.$$typeof === h || e3.$$typeof === v || e3.$$typeof === b || e3.$$typeof === w || e3.$$typeof === y);
            }, t2.typeOf = _;
          }, 524: function(e2, t2, n2) {
            "use strict";
            e2.exports = n2(320);
          }, 3335: function(e2, t2, n2) {
            "use strict";
            var r2 = n2(4041), i2 = Symbol.for("react.element"), o2 = Symbol.for("react.fragment"), a2 = Object.prototype.hasOwnProperty, s2 = r2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, c = { key: true, ref: true, __self: true, __source: true };
            function l(e3, t3, n3) {
              var r3, o3 = {}, l2 = null, u = null;
              for (r3 in void 0 !== n3 && (l2 = "" + n3), void 0 !== t3.key && (l2 = "" + t3.key), void 0 !== t3.ref && (u = t3.ref), t3) a2.call(t3, r3) && !c.hasOwnProperty(r3) && (o3[r3] = t3[r3]);
              if (e3 && e3.defaultProps) for (r3 in t3 = e3.defaultProps) void 0 === o3[r3] && (o3[r3] = t3[r3]);
              return { $$typeof: i2, type: e3, key: l2, ref: u, props: o3, _owner: s2.current };
            }
            t2.Fragment = o2, t2.jsx = l, t2.jsxs = l;
          }, 4304: function(e2, t2) {
            "use strict";
            var n2 = Symbol.for("react.element"), r2 = Symbol.for("react.portal"), i2 = Symbol.for("react.fragment"), o2 = Symbol.for("react.strict_mode"), a2 = Symbol.for("react.profiler"), s2 = Symbol.for("react.provider"), c = Symbol.for("react.context"), l = Symbol.for("react.forward_ref"), u = Symbol.for("react.suspense"), d = Symbol.for("react.memo"), h = Symbol.for("react.lazy"), f = Symbol.iterator, p = { isMounted: function() {
              return false;
            }, enqueueForceUpdate: function() {
            }, enqueueReplaceState: function() {
            }, enqueueSetState: function() {
            } }, m = Object.assign, g = {};
            function y(e3, t3, n3) {
              this.props = e3, this.context = t3, this.refs = g, this.updater = n3 || p;
            }
            function v() {
            }
            function b(e3, t3, n3) {
              this.props = e3, this.context = t3, this.refs = g, this.updater = n3 || p;
            }
            y.prototype.isReactComponent = {}, y.prototype.setState = function(e3, t3) {
              if ("object" != typeof e3 && "function" != typeof e3 && null != e3) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
              this.updater.enqueueSetState(this, e3, t3, "setState");
            }, y.prototype.forceUpdate = function(e3) {
              this.updater.enqueueForceUpdate(this, e3, "forceUpdate");
            }, v.prototype = y.prototype;
            var w = b.prototype = new v();
            w.constructor = b, m(w, y.prototype), w.isPureReactComponent = true;
            var _ = Array.isArray, S = Object.prototype.hasOwnProperty, k = { current: null }, P = { key: true, ref: true, __self: true, __source: true };
            function O(e3, t3, r3) {
              var i3, o3 = {}, a3 = null, s3 = null;
              if (null != t3) for (i3 in void 0 !== t3.ref && (s3 = t3.ref), void 0 !== t3.key && (a3 = "" + t3.key), t3) S.call(t3, i3) && !P.hasOwnProperty(i3) && (o3[i3] = t3[i3]);
              var c2 = arguments.length - 2;
              if (1 === c2) o3.children = r3;
              else if (1 < c2) {
                for (var l2 = Array(c2), u2 = 0; u2 < c2; u2++) l2[u2] = arguments[u2 + 2];
                o3.children = l2;
              }
              if (e3 && e3.defaultProps) for (i3 in c2 = e3.defaultProps) void 0 === o3[i3] && (o3[i3] = c2[i3]);
              return { $$typeof: n2, type: e3, key: a3, ref: s3, props: o3, _owner: k.current };
            }
            function A(e3) {
              return "object" == typeof e3 && null !== e3 && e3.$$typeof === n2;
            }
            var U = /\/+/g;
            function x(e3, t3) {
              return "object" == typeof e3 && null !== e3 && null != e3.key ? (function(e4) {
                var t4 = { "=": "=0", ":": "=2" };
                return "$" + e4.replace(/[=:]/g, (function(e5) {
                  return t4[e5];
                }));
              })("" + e3.key) : t3.toString(36);
            }
            function C(e3, t3, i3, o3, a3) {
              var s3 = typeof e3;
              "undefined" !== s3 && "boolean" !== s3 || (e3 = null);
              var c2 = false;
              if (null === e3) c2 = true;
              else switch (s3) {
                case "string":
                case "number":
                  c2 = true;
                  break;
                case "object":
                  switch (e3.$$typeof) {
                    case n2:
                    case r2:
                      c2 = true;
                  }
              }
              if (c2) return a3 = a3(c2 = e3), e3 = "" === o3 ? "." + x(c2, 0) : o3, _(a3) ? (i3 = "", null != e3 && (i3 = e3.replace(U, "$&/") + "/"), C(a3, t3, i3, "", (function(e4) {
                return e4;
              }))) : null != a3 && (A(a3) && (a3 = (function(e4, t4) {
                return { $$typeof: n2, type: e4.type, key: t4, ref: e4.ref, props: e4.props, _owner: e4._owner };
              })(a3, i3 + (!a3.key || c2 && c2.key === a3.key ? "" : ("" + a3.key).replace(U, "$&/") + "/") + e3)), t3.push(a3)), 1;
              if (c2 = 0, o3 = "" === o3 ? "." : o3 + ":", _(e3)) for (var l2 = 0; l2 < e3.length; l2++) {
                var u2 = o3 + x(s3 = e3[l2], l2);
                c2 += C(s3, t3, i3, u2, a3);
              }
              else if (u2 = (function(e4) {
                return null === e4 || "object" != typeof e4 ? null : "function" == typeof (e4 = f && e4[f] || e4["@@iterator"]) ? e4 : null;
              })(e3), "function" == typeof u2) for (e3 = u2.call(e3), l2 = 0; !(s3 = e3.next()).done; ) c2 += C(s3 = s3.value, t3, i3, u2 = o3 + x(s3, l2++), a3);
              else if ("object" === s3) throw t3 = String(e3), Error("Objects are not valid as a React child (found: " + ("[object Object]" === t3 ? "object with keys {" + Object.keys(e3).join(", ") + "}" : t3) + "). If you meant to render a collection of children, use an array instead.");
              return c2;
            }
            function E(e3, t3, n3) {
              if (null == e3) return e3;
              var r3 = [], i3 = 0;
              return C(e3, r3, "", "", (function(e4) {
                return t3.call(n3, e4, i3++);
              })), r3;
            }
            function I(e3) {
              if (-1 === e3._status) {
                var t3 = e3._result;
                (t3 = t3()).then((function(t4) {
                  0 !== e3._status && -1 !== e3._status || (e3._status = 1, e3._result = t4);
                }), (function(t4) {
                  0 !== e3._status && -1 !== e3._status || (e3._status = 2, e3._result = t4);
                })), -1 === e3._status && (e3._status = 0, e3._result = t3);
              }
              if (1 === e3._status) return e3._result.default;
              throw e3._result;
            }
            var M = { current: null }, R = { transition: null }, z = { ReactCurrentDispatcher: M, ReactCurrentBatchConfig: R, ReactCurrentOwner: k };
            t2.Children = { map: E, forEach: function(e3, t3, n3) {
              E(e3, (function() {
                t3.apply(this, arguments);
              }), n3);
            }, count: function(e3) {
              var t3 = 0;
              return E(e3, (function() {
                t3++;
              })), t3;
            }, toArray: function(e3) {
              return E(e3, (function(e4) {
                return e4;
              })) || [];
            }, only: function(e3) {
              if (!A(e3)) throw Error("React.Children.only expected to receive a single React element child.");
              return e3;
            } }, t2.Component = y, t2.Fragment = i2, t2.Profiler = a2, t2.PureComponent = b, t2.StrictMode = o2, t2.Suspense = u, t2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = z, t2.cloneElement = function(e3, t3, r3) {
              if (null == e3) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e3 + ".");
              var i3 = m({}, e3.props), o3 = e3.key, a3 = e3.ref, s3 = e3._owner;
              if (null != t3) {
                if (void 0 !== t3.ref && (a3 = t3.ref, s3 = k.current), void 0 !== t3.key && (o3 = "" + t3.key), e3.type && e3.type.defaultProps) var c2 = e3.type.defaultProps;
                for (l2 in t3) S.call(t3, l2) && !P.hasOwnProperty(l2) && (i3[l2] = void 0 === t3[l2] && void 0 !== c2 ? c2[l2] : t3[l2]);
              }
              var l2 = arguments.length - 2;
              if (1 === l2) i3.children = r3;
              else if (1 < l2) {
                c2 = Array(l2);
                for (var u2 = 0; u2 < l2; u2++) c2[u2] = arguments[u2 + 2];
                i3.children = c2;
              }
              return { $$typeof: n2, type: e3.type, key: o3, ref: a3, props: i3, _owner: s3 };
            }, t2.createContext = function(e3) {
              return (e3 = { $$typeof: c, _currentValue: e3, _currentValue2: e3, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }).Provider = { $$typeof: s2, _context: e3 }, e3.Consumer = e3;
            }, t2.createElement = O, t2.createFactory = function(e3) {
              var t3 = O.bind(null, e3);
              return t3.type = e3, t3;
            }, t2.createRef = function() {
              return { current: null };
            }, t2.forwardRef = function(e3) {
              return { $$typeof: l, render: e3 };
            }, t2.isValidElement = A, t2.lazy = function(e3) {
              return { $$typeof: h, _payload: { _status: -1, _result: e3 }, _init: I };
            }, t2.memo = function(e3, t3) {
              return { $$typeof: d, type: e3, compare: void 0 === t3 ? null : t3 };
            }, t2.startTransition = function(e3) {
              var t3 = R.transition;
              R.transition = {};
              try {
                e3();
              } finally {
                R.transition = t3;
              }
            }, t2.unstable_act = function() {
              throw Error("act(...) is not supported in production builds of React.");
            }, t2.useCallback = function(e3, t3) {
              return M.current.useCallback(e3, t3);
            }, t2.useContext = function(e3) {
              return M.current.useContext(e3);
            }, t2.useDebugValue = function() {
            }, t2.useDeferredValue = function(e3) {
              return M.current.useDeferredValue(e3);
            }, t2.useEffect = function(e3, t3) {
              return M.current.useEffect(e3, t3);
            }, t2.useId = function() {
              return M.current.useId();
            }, t2.useImperativeHandle = function(e3, t3, n3) {
              return M.current.useImperativeHandle(e3, t3, n3);
            }, t2.useInsertionEffect = function(e3, t3) {
              return M.current.useInsertionEffect(e3, t3);
            }, t2.useLayoutEffect = function(e3, t3) {
              return M.current.useLayoutEffect(e3, t3);
            }, t2.useMemo = function(e3, t3) {
              return M.current.useMemo(e3, t3);
            }, t2.useReducer = function(e3, t3, n3) {
              return M.current.useReducer(e3, t3, n3);
            }, t2.useRef = function(e3) {
              return M.current.useRef(e3);
            }, t2.useState = function(e3) {
              return M.current.useState(e3);
            }, t2.useSyncExternalStore = function(e3, t3, n3) {
              return M.current.useSyncExternalStore(e3, t3, n3);
            }, t2.useTransition = function() {
              return M.current.useTransition();
            }, t2.version = "18.2.0";
          }, 4041: function(e2, t2, n2) {
            "use strict";
            e2.exports = n2(4304);
          }, 1085: function(e2, t2, n2) {
            "use strict";
            e2.exports = n2(3335);
          }, 8989: function(e2) {
            var t2 = (function(e3) {
              "use strict";
              var t3, n2 = Object.prototype, r2 = n2.hasOwnProperty, i2 = Object.defineProperty || function(e4, t4, n3) {
                e4[t4] = n3.value;
              }, o2 = "function" == typeof Symbol ? Symbol : {}, a2 = o2.iterator || "@@iterator", s2 = o2.asyncIterator || "@@asyncIterator", c = o2.toStringTag || "@@toStringTag";
              function l(e4, t4, n3) {
                return Object.defineProperty(e4, t4, { value: n3, enumerable: true, configurable: true, writable: true }), e4[t4];
              }
              try {
                l({}, "");
              } catch (R) {
                l = function(e4, t4, n3) {
                  return e4[t4] = n3;
                };
              }
              function u(e4, t4, n3, r3) {
                var o3 = t4 && t4.prototype instanceof y ? t4 : y, a3 = Object.create(o3.prototype), s3 = new E(r3 || []);
                return i2(a3, "_invoke", { value: A(e4, n3, s3) }), a3;
              }
              function d(e4, t4, n3) {
                try {
                  return { type: "normal", arg: e4.call(t4, n3) };
                } catch (R) {
                  return { type: "throw", arg: R };
                }
              }
              e3.wrap = u;
              var h = "suspendedStart", f = "suspendedYield", p = "executing", m = "completed", g = {};
              function y() {
              }
              function v() {
              }
              function b() {
              }
              var w = {};
              l(w, a2, (function() {
                return this;
              }));
              var _ = Object.getPrototypeOf, S = _ && _(_(I([])));
              S && S !== n2 && r2.call(S, a2) && (w = S);
              var k = b.prototype = y.prototype = Object.create(w);
              function P(e4) {
                ["next", "throw", "return"].forEach((function(t4) {
                  l(e4, t4, (function(e5) {
                    return this._invoke(t4, e5);
                  }));
                }));
              }
              function O(e4, t4) {
                function n3(i3, o4, a3, s3) {
                  var c2 = d(e4[i3], e4, o4);
                  if ("throw" !== c2.type) {
                    var l2 = c2.arg, u2 = l2.value;
                    return u2 && "object" == typeof u2 && r2.call(u2, "__await") ? t4.resolve(u2.__await).then((function(e5) {
                      n3("next", e5, a3, s3);
                    }), (function(e5) {
                      n3("throw", e5, a3, s3);
                    })) : t4.resolve(u2).then((function(e5) {
                      l2.value = e5, a3(l2);
                    }), (function(e5) {
                      return n3("throw", e5, a3, s3);
                    }));
                  }
                  s3(c2.arg);
                }
                var o3;
                i2(this, "_invoke", { value: function(e5, r3) {
                  function i3() {
                    return new t4((function(t5, i4) {
                      n3(e5, r3, t5, i4);
                    }));
                  }
                  return o3 = o3 ? o3.then(i3, i3) : i3();
                } });
              }
              function A(e4, t4, n3) {
                var r3 = h;
                return function(i3, o3) {
                  if (r3 === p) throw new Error("Generator is already running");
                  if (r3 === m) {
                    if ("throw" === i3) throw o3;
                    return M();
                  }
                  for (n3.method = i3, n3.arg = o3; ; ) {
                    var a3 = n3.delegate;
                    if (a3) {
                      var s3 = U(a3, n3);
                      if (s3) {
                        if (s3 === g) continue;
                        return s3;
                      }
                    }
                    if ("next" === n3.method) n3.sent = n3._sent = n3.arg;
                    else if ("throw" === n3.method) {
                      if (r3 === h) throw r3 = m, n3.arg;
                      n3.dispatchException(n3.arg);
                    } else "return" === n3.method && n3.abrupt("return", n3.arg);
                    r3 = p;
                    var c2 = d(e4, t4, n3);
                    if ("normal" === c2.type) {
                      if (r3 = n3.done ? m : f, c2.arg === g) continue;
                      return { value: c2.arg, done: n3.done };
                    }
                    "throw" === c2.type && (r3 = m, n3.method = "throw", n3.arg = c2.arg);
                  }
                };
              }
              function U(e4, n3) {
                var r3 = n3.method, i3 = e4.iterator[r3];
                if (i3 === t3) return n3.delegate = null, "throw" === r3 && e4.iterator.return && (n3.method = "return", n3.arg = t3, U(e4, n3), "throw" === n3.method) || "return" !== r3 && (n3.method = "throw", n3.arg = new TypeError("The iterator does not provide a '" + r3 + "' method")), g;
                var o3 = d(i3, e4.iterator, n3.arg);
                if ("throw" === o3.type) return n3.method = "throw", n3.arg = o3.arg, n3.delegate = null, g;
                var a3 = o3.arg;
                return a3 ? a3.done ? (n3[e4.resultName] = a3.value, n3.next = e4.nextLoc, "return" !== n3.method && (n3.method = "next", n3.arg = t3), n3.delegate = null, g) : a3 : (n3.method = "throw", n3.arg = new TypeError("iterator result is not an object"), n3.delegate = null, g);
              }
              function x(e4) {
                var t4 = { tryLoc: e4[0] };
                1 in e4 && (t4.catchLoc = e4[1]), 2 in e4 && (t4.finallyLoc = e4[2], t4.afterLoc = e4[3]), this.tryEntries.push(t4);
              }
              function C(e4) {
                var t4 = e4.completion || {};
                t4.type = "normal", delete t4.arg, e4.completion = t4;
              }
              function E(e4) {
                this.tryEntries = [{ tryLoc: "root" }], e4.forEach(x, this), this.reset(true);
              }
              function I(e4) {
                if (e4) {
                  var n3 = e4[a2];
                  if (n3) return n3.call(e4);
                  if ("function" == typeof e4.next) return e4;
                  if (!isNaN(e4.length)) {
                    var i3 = -1, o3 = function n4() {
                      for (; ++i3 < e4.length; ) if (r2.call(e4, i3)) return n4.value = e4[i3], n4.done = false, n4;
                      return n4.value = t3, n4.done = true, n4;
                    };
                    return o3.next = o3;
                  }
                }
                return { next: M };
              }
              function M() {
                return { value: t3, done: true };
              }
              return v.prototype = b, i2(k, "constructor", { value: b, configurable: true }), i2(b, "constructor", { value: v, configurable: true }), v.displayName = l(b, c, "GeneratorFunction"), e3.isGeneratorFunction = function(e4) {
                var t4 = "function" == typeof e4 && e4.constructor;
                return !!t4 && (t4 === v || "GeneratorFunction" === (t4.displayName || t4.name));
              }, e3.mark = function(e4) {
                return Object.setPrototypeOf ? Object.setPrototypeOf(e4, b) : (e4.__proto__ = b, l(e4, c, "GeneratorFunction")), e4.prototype = Object.create(k), e4;
              }, e3.awrap = function(e4) {
                return { __await: e4 };
              }, P(O.prototype), l(O.prototype, s2, (function() {
                return this;
              })), e3.AsyncIterator = O, e3.async = function(t4, n3, r3, i3, o3) {
                void 0 === o3 && (o3 = Promise);
                var a3 = new O(u(t4, n3, r3, i3), o3);
                return e3.isGeneratorFunction(n3) ? a3 : a3.next().then((function(e4) {
                  return e4.done ? e4.value : a3.next();
                }));
              }, P(k), l(k, c, "Generator"), l(k, a2, (function() {
                return this;
              })), l(k, "toString", (function() {
                return "[object Generator]";
              })), e3.keys = function(e4) {
                var t4 = Object(e4), n3 = [];
                for (var r3 in t4) n3.push(r3);
                return n3.reverse(), function e5() {
                  for (; n3.length; ) {
                    var r4 = n3.pop();
                    if (r4 in t4) return e5.value = r4, e5.done = false, e5;
                  }
                  return e5.done = true, e5;
                };
              }, e3.values = I, E.prototype = { constructor: E, reset: function(e4) {
                if (this.prev = 0, this.next = 0, this.sent = this._sent = t3, this.done = false, this.delegate = null, this.method = "next", this.arg = t3, this.tryEntries.forEach(C), !e4) for (var n3 in this) "t" === n3.charAt(0) && r2.call(this, n3) && !isNaN(+n3.slice(1)) && (this[n3] = t3);
              }, stop: function() {
                this.done = true;
                var e4 = this.tryEntries[0].completion;
                if ("throw" === e4.type) throw e4.arg;
                return this.rval;
              }, dispatchException: function(e4) {
                if (this.done) throw e4;
                var n3 = this;
                function i3(r3, i4) {
                  return s3.type = "throw", s3.arg = e4, n3.next = r3, i4 && (n3.method = "next", n3.arg = t3), !!i4;
                }
                for (var o3 = this.tryEntries.length - 1; o3 >= 0; --o3) {
                  var a3 = this.tryEntries[o3], s3 = a3.completion;
                  if ("root" === a3.tryLoc) return i3("end");
                  if (a3.tryLoc <= this.prev) {
                    var c2 = r2.call(a3, "catchLoc"), l2 = r2.call(a3, "finallyLoc");
                    if (c2 && l2) {
                      if (this.prev < a3.catchLoc) return i3(a3.catchLoc, true);
                      if (this.prev < a3.finallyLoc) return i3(a3.finallyLoc);
                    } else if (c2) {
                      if (this.prev < a3.catchLoc) return i3(a3.catchLoc, true);
                    } else {
                      if (!l2) throw new Error("try statement without catch or finally");
                      if (this.prev < a3.finallyLoc) return i3(a3.finallyLoc);
                    }
                  }
                }
              }, abrupt: function(e4, t4) {
                for (var n3 = this.tryEntries.length - 1; n3 >= 0; --n3) {
                  var i3 = this.tryEntries[n3];
                  if (i3.tryLoc <= this.prev && r2.call(i3, "finallyLoc") && this.prev < i3.finallyLoc) {
                    var o3 = i3;
                    break;
                  }
                }
                o3 && ("break" === e4 || "continue" === e4) && o3.tryLoc <= t4 && t4 <= o3.finallyLoc && (o3 = null);
                var a3 = o3 ? o3.completion : {};
                return a3.type = e4, a3.arg = t4, o3 ? (this.method = "next", this.next = o3.finallyLoc, g) : this.complete(a3);
              }, complete: function(e4, t4) {
                if ("throw" === e4.type) throw e4.arg;
                return "break" === e4.type || "continue" === e4.type ? this.next = e4.arg : "return" === e4.type ? (this.rval = this.arg = e4.arg, this.method = "return", this.next = "end") : "normal" === e4.type && t4 && (this.next = t4), g;
              }, finish: function(e4) {
                for (var t4 = this.tryEntries.length - 1; t4 >= 0; --t4) {
                  var n3 = this.tryEntries[t4];
                  if (n3.finallyLoc === e4) return this.complete(n3.completion, n3.afterLoc), C(n3), g;
                }
              }, catch: function(e4) {
                for (var t4 = this.tryEntries.length - 1; t4 >= 0; --t4) {
                  var n3 = this.tryEntries[t4];
                  if (n3.tryLoc === e4) {
                    var r3 = n3.completion;
                    if ("throw" === r3.type) {
                      var i3 = r3.arg;
                      C(n3);
                    }
                    return i3;
                  }
                }
                throw new Error("illegal catch attempt");
              }, delegateYield: function(e4, n3, r3) {
                return this.delegate = { iterator: I(e4), resultName: n3, nextLoc: r3 }, "next" === this.method && (this.arg = t3), g;
              } }, e3;
            })(e2.exports);
            try {
              regeneratorRuntime = t2;
            } catch (n2) {
              "object" == typeof globalThis ? globalThis.regeneratorRuntime = t2 : Function("r", "regeneratorRuntime = r")(t2);
            }
          }, 7575: function(e2, t2, n2) {
            "use strict";
            var r2 = n2(528), i2 = n2(9818), o2 = n2(8660), a2 = r2("%TypeError%"), s2 = r2("%WeakMap%", true), c = r2("%Map%", true), l = i2("WeakMap.prototype.get", true), u = i2("WeakMap.prototype.set", true), d = i2("WeakMap.prototype.has", true), h = i2("Map.prototype.get", true), f = i2("Map.prototype.set", true), p = i2("Map.prototype.has", true), m = function(e3, t3) {
              for (var n3, r3 = e3; null !== (n3 = r3.next); r3 = n3) if (n3.key === t3) return r3.next = n3.next, n3.next = e3.next, e3.next = n3, n3;
            };
            e2.exports = function() {
              var e3, t3, n3, r3 = { assert: function(e4) {
                if (!r3.has(e4)) throw new a2("Side channel does not contain " + o2(e4));
              }, get: function(r4) {
                if (s2 && r4 && ("object" == typeof r4 || "function" == typeof r4)) {
                  if (e3) return l(e3, r4);
                } else if (c) {
                  if (t3) return h(t3, r4);
                } else if (n3) return (function(e4, t4) {
                  var n4 = m(e4, t4);
                  return n4 && n4.value;
                })(n3, r4);
              }, has: function(r4) {
                if (s2 && r4 && ("object" == typeof r4 || "function" == typeof r4)) {
                  if (e3) return d(e3, r4);
                } else if (c) {
                  if (t3) return p(t3, r4);
                } else if (n3) return (function(e4, t4) {
                  return !!m(e4, t4);
                })(n3, r4);
                return false;
              }, set: function(r4, i3) {
                s2 && r4 && ("object" == typeof r4 || "function" == typeof r4) ? (e3 || (e3 = new s2()), u(e3, r4, i3)) : c ? (t3 || (t3 = new c()), f(t3, r4, i3)) : (n3 || (n3 = { key: {}, next: null }), (function(e4, t4, n4) {
                  var r5 = m(e4, t4);
                  r5 ? r5.value = n4 : e4.next = { key: t4, next: e4.next, value: n4 };
                })(n3, r4, i3));
              } };
              return r3;
            };
          }, 6480: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { $i: function() {
              return f;
            }, CL: function() {
              return s2;
            }, Ej: function() {
              return r2;
            }, MC: function() {
              return l;
            }, OQ: function() {
              return u;
            }, UU: function() {
              return h;
            }, ZA: function() {
              return i2;
            }, e8: function() {
              return d;
            }, k2: function() {
              return a2;
            }, rt: function() {
              return c;
            }, tK: function() {
              return o2;
            } });
            const r2 = ["after_sign_in_url", "after_sign_up_url", "redirect_url"], i2 = "clerk-db-jwt", o2 = "__dev_session", a2 = "Clerk-Cookie", s2 = "__clerk_modal_state", c = "__clerk_synced", l = "__clerk_satellite_url", u = { FORM_IDENTIFIER_NOT_FOUND: "form_identifier_not_found", FORM_PASSWORD_INCORRECT: "form_password_incorrect", INVALID_STRATEGY_FOR_USER: "strategy_for_user_invalid", NOT_ALLOWED_TO_SIGN_UP: "not_allowed_to_sign_up", OAUTH_ACCESS_DENIED: "oauth_access_denied", OAUTH_EMAIL_DOMAIN_RESERVED_BY_SAML: "oauth_email_domain_reserved_by_saml", NOT_ALLOWED_ACCESS: "not_allowed_access", SAML_USER_ATTRIBUTE_MISSING: "saml_user_attribute_missing", USER_LOCKED: "user_locked" }, d = ["email_address", "phone_number", "username"], h = ["email_address", "phone_number", "username", "first_name", "last_name"], f = 350;
          }, 5882: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { $V: function() {
              return h;
            }, A8: function() {
              return U;
            }, BF: function() {
              return o2;
            }, Gm: function() {
              return y;
            }, HZ: function() {
              return g;
            }, IJ: function() {
              return _;
            }, O: function() {
              return l;
            }, Rj: function() {
              return v;
            }, U6: function() {
              return A;
            }, ZX: function() {
              return P;
            }, a2: function() {
              return p;
            }, eS: function() {
              return a2;
            }, gY: function() {
              return O;
            }, hs: function() {
              return f;
            }, i$: function() {
              return c;
            }, iq: function() {
              return S;
            }, jB: function() {
              return s2;
            }, kX: function() {
              return d;
            }, lg: function() {
              return u;
            }, pV: function() {
              return b;
            }, sW: function() {
              return i2;
            }, ut: function() {
              return k;
            }, wv: function() {
              return w;
            }, z$: function() {
              return m;
            } });
            const r2 = "ClerkJS:";
            function i2(e3, t3) {
              throw new Error(`${r2} Network error at "${e3}" - ${t3}. Please try again.`);
            }
            function o2() {
              throw new Error(`${r2} Something went wrong initializing Clerk.`);
            }
            function a2(e3) {
              throw new Error(`${r2} Something went wrong initializing Clerk in development mode${e3 && ` - ${e3}`}.`);
            }
            function s2(e3) {
              throw new Error(`${r2} Missing path option. The ${e3} component was mounted with path routing so you need to specify the path where the component is mounted on e.g. path="/sign-in".`);
            }
            function c(e3) {
              throw new Error(`${r2} You must wrap your application in a <${e3}> component.`);
            }
            function l() {
              throw new Error(`${r2} User is undefined. Try wrapping your component with \`withUserGuard\``);
            }
            function u() {
              throw new Error(`${r2} Session is undefined. Try wrapping your component with \`withUserGuard\``);
            }
            function d() {
              throw new Error(`${r2} Clerk is undefined`);
            }
            function h() {
              throw new Error(`${r2} The target element is empty. Provide a valid DOM element.`);
            }
            function f() {
              throw new Error(`${r2} Missing FAPI client in resources.`);
            }
            function p(e3) {
              throw new Error(`${r2} Token refresh failed (error='${e3}')`);
            }
            function m(e3) {
              throw new Error(`${r2} Something went wrong initializing Clerk during the ${e3} flow. Please contact support.`);
            }
            function g(e3) {
              throw new Error(`${r2} You need to start a ${e3} flow by calling ${e3}.create() first.`);
            }
            function y(e3, t3) {
              throw new Error(`${r2} Strategy "${t3}" is not a valid strategy for ${e3}.`);
            }
            function v(e3) {
              throw new Error(`${r2} You need to start a ${e3} flow by calling ${e3}.create({ identifier: 'your web3 wallet address' }) first`);
            }
            function b(e3 = "") {
              throw new Error(`${r2} Missing '${e3}' option`);
            }
            function w(e3, t3) {
              throw new Error(`${r2} Response: ${e3 || 0} not supported yet.
For more information contact us at ${t3}`);
            }
            function _() {
              throw new Error(`${r2} Missing dev browser jwt. Please contact support.`);
            }
            function S() {
              throw new Error(`${r2} Missing domain and proxyUrl. A satellite application needs to specify a domain or a proxyUrl.`);
            }
            function k() {
              throw new Error(`${r2} The signInUrl needs to be on a different origin than your satellite application.`);
            }
            function P() {
              throw new Error(`${r2} The signInUrl needs to have a absolute url format.`);
            }
            function O() {
              throw new Error(`${r2} Missing signInUrl. A satellite application needs to specify the signInUrl for development instances.`);
            }
            function A() {
              throw new Error(`${r2} Invalid redirect_url. A valid http or https url should be used for the redirection.`);
            }
            function U(e3) {
              throw new Error(`${r2} Unable to retrieve a third party script${e3 ? ` ${e3}` : ""}.`);
            }
          }, 2692: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { A: function() {
              return r2;
            }, B: function() {
              return i2;
            } });
            const r2 = { TokenUpdate: "token:update" }, i2 = /* @__PURE__ */ (() => {
              const e3 = /* @__PURE__ */ new Map();
              return { on: (t3, n3) => {
                var r3;
                e3.get(t3) || e3.set(t3, []), null === (r3 = e3.get(t3)) || void 0 === r3 || r3.push(n3);
              }, dispatch: (t3, n3) => {
                (e3.get(t3) || []).forEach(((e4) => "function" == typeof e4 && e4(n3)));
              }, off: (t3, n3) => {
                const r3 = e3.get(t3) || [];
                r3.length && (n3 && e3.set(t3, r3.filter(((e4) => e4 !== n3))), e3.set(t3, []));
              } };
            })();
          }, 600: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { A: function() {
              return l;
            } });
            var r2 = n2(7643), i2 = n2(5810), o2 = n2.n(i2), a2 = n2(5098), s2 = n2(5882);
            const c = (e3, t3, n3, i3) => "key" === i3 ? (0, r2.C8)(e3) : t3(e3);
            function l(e3) {
              const t3 = [], n3 = [];
              function i3({ method: t4, path: n4, sessionId: r3, search: i4, rotatingTokenNonce: a3 }) {
                const s3 = new URLSearchParams(i4);
                e3.version && s3.append("_clerk_js_version", e3.version), a3 && s3.append("rotating_token_nonce", a3), "development" === e3.instanceType && e3.isSatellite && s3.append("__domain", e3.domain), t4 && "GET" !== t4 && "POST" !== t4 && s3.append("_method", t4), n4 && !n4.startsWith("/client") && r3 && s3.append("_clerk_session_id", r3);
                const c2 = [...s3.entries()].reduce(((e4, [t5, n5]) => (e4[t5] = n5.includes(",") ? n5.split(",") : n5, e4)), {});
                return o2().stringify(c2, { addQueryPrefix: true, arrayFormat: "repeat" });
              }
              function l2(t4) {
                const { path: n4, pathPrefix: r3 = "v1" } = t4, { proxyUrl: o3, domain: s3, frontendApi: c2, instanceType: l3 } = e3, u = "production" === l3 ? s3 : "";
                if (o3) {
                  const e4 = new URL(o3), s4 = e4.pathname.slice(1, e4.pathname.length);
                  return (0, a2.kZ)({ base: e4.origin, pathname: `${s4}/${r3}${n4}`, search: i3(t4) }, { stringify: false });
                }
                return (0, a2.kZ)({ base: `https://${u || c2}`, pathname: `${r3}${n4}`, search: i3(t4) }, { stringify: false });
              }
              return { buildEmailAddress: function(t4) {
                return (0, a2.DG)({ localPart: t4, frontendApi: e3.frontendApi });
              }, buildUrl: l2, onAfterResponse: function(e4) {
                n3.push(e4);
              }, onBeforeRequest: function(e4) {
                t3.push(e4);
              }, request: async function(i4) {
                var a3;
                let { method: u = "GET", body: d } = i4;
                i4.url = l2({ ...i4, sessionId: null === (a3 = e3.session) || void 0 === a3 ? void 0 : a3.id }), i4.headers || (i4.headers = new Headers()), "GET" === u || d instanceof FormData || i4.headers.has("content-type") || i4.headers.set("content-type", "application/x-www-form-urlencoded"), "application/x-www-form-urlencoded" === i4.headers.get("content-type") && (i4.body = o2().stringify(d, { encoder: c, indices: false }));
                const h = await (async function(e4) {
                  const n4 = "undefined" != typeof window && window.__unstable__onBeforeRequest;
                  for await (const r3 of [n4, ...t3].filter(((e5) => e5))) if (false === await r3(e4)) return false;
                  return true;
                })(i4), f = "GET" === u ? "GET" : "POST";
                let p;
                const m = i4.url.toString(), g = { ...i4, credentials: "include", method: f };
                try {
                  if (h) {
                    const e4 = (0, r2.kv)() ? 4 : 11;
                    p = "GET" === f ? await (0, r2.Nv)((() => fetch(m, g)), { firstDelay: 500, maxDelay: 3e3, shouldRetry: (t4, n4) => n4 < e4 }) : await fetch(m, g);
                  } else p = new Response("{}", i4);
                } catch (b) {
                  (0, s2.sW)(m, b);
                }
                const y = await p.json(), v = Object.assign(p, { payload: y });
                return await (async function(e4, t4) {
                  const r3 = "undefined" != typeof window && window.__unstable__onAfterResponse;
                  for await (const i5 of [r3, ...n3].filter(((e5) => e5))) if (false === await i5(e4, t4)) return false;
                  return true;
                })(i4, v), v;
              } };
            }
          }, 1101: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { xW: function() {
              return s2;
            }, Qx: function() {
              return o2;
            }, LR: function() {
              return w.LR;
            }, cR: function() {
              return w.cR;
            }, Kj: function() {
              return d;
            }, Z4: function() {
              return h;
            }, lx: function() {
              return p;
            }, Tl: function() {
              return g;
            }, NZ: function() {
              return w.NZ;
            }, Ys: function() {
              return w.Ys;
            }, OH: function() {
              return v;
            }, Fi: function() {
              return O;
            }, NX: function() {
              return A;
            }, _V: function() {
              return U;
            }, gS: function() {
              return w.gS;
            }, dB: function() {
              return w.dB;
            }, yb: function() {
              return z;
            }, L5: function() {
              return T;
            }, i7: function() {
              return N;
            }, YO: function() {
              return L;
            }, go: function() {
              return x;
            }, LA: function() {
              return K;
            }, t3: function() {
              return j;
            }, Nn: function() {
              return H;
            }, Kn: function() {
              return Y;
            }, Ls: function() {
              return X;
            }, Hx: function() {
              return re;
            }, Vx: function() {
              return k;
            }, _k: function() {
              return oe;
            }, ou: function() {
              return ie;
            }, KJ: function() {
              return ce;
            }, E0: function() {
              return ee;
            }, wE: function() {
              return le;
            }, tl: function() {
              return a2;
            }, o6: function() {
              return S;
            }, Nv: function() {
              return ue;
            }, $R: function() {
              return w.$R;
            }, Cm: function() {
              return w.Cm;
            }, ux: function() {
              return w.ux;
            }, si: function() {
              return w.si;
            }, u$: function() {
              return w.u$;
            } });
            var r2 = n2(8521), i2 = n2(5882);
            class o2 {
              constructor() {
                this.pathRoot = "";
              }
              static get fapiClient() {
                return o2.clerk.getFapiClient();
              }
              static async _fetch(e3, t3 = {}) {
                let n3;
                o2.fapiClient || (0, i2.hs)();
                try {
                  n3 = await o2.fapiClient.request(e3);
                } catch (u2) {
                  if ((0, r2.CS)()) throw u2;
                  return console.warn(u2), null;
                }
                const { payload: a3, status: s3, statusText: c2, headers: l2 } = n3;
                if (l2) {
                  const e4 = l2.get("x-country");
                  this.clerk.__internal_setCountry(e4 ? e4.toLowerCase() : null);
                }
                if (("GET" !== e3.method || t3.forceUpdateClient) && this._updateClient(a3), s3 >= 200 && s3 <= 299) return a3;
                if (401 === s3 && await o2.clerk.handleUnauthenticated(), s3 >= 400) throw new w.LR(c2, { data: null == a3 ? void 0 : a3.errors, status: s3 });
                return null;
              }
              static _updateClient(e3) {
                var t3;
                if (!e3) return;
                const n3 = e3.client || (null === (t3 = e3.meta) || void 0 === t3 ? void 0 : t3.client);
                n3 && o2.clerk && o2.clerk.updateClient(d.getInstance().fromJSON(n3));
              }
              isNew() {
                return !this.id;
              }
              path(e3) {
                const t3 = this.pathRoot;
                if (this.isNew()) return t3;
                const n3 = t3.replace(/[^/]$/, "$&/") + encodeURIComponent(this.id);
                return e3 ? n3.replace(/[^/]$/, "$&/") + encodeURIComponent(e3) : n3;
              }
              async _baseGet(e3 = {}) {
                const t3 = await o2._fetch({ method: "GET", path: this.path(), rotatingTokenNonce: e3.rotatingTokenNonce, search: e3.search }, e3);
                return this.fromJSON((null == t3 ? void 0 : t3.response) || t3);
              }
              async _baseMutate({ action: e3, body: t3, method: n3 = "POST", path: r3 }) {
                const i3 = await o2._fetch({ method: n3, path: r3 || this.path(e3), body: t3 });
                return this.fromJSON((null == i3 ? void 0 : i3.response) || i3);
              }
              async _basePost(e3 = {}) {
                return this._baseMutate({ ...e3, method: "POST" });
              }
              async _basePut(e3 = {}) {
                return this._baseMutate({ ...e3, method: "PUT" });
              }
              async _basePatch(e3 = {}) {
                return this._baseMutate({ ...e3, method: "PATCH" });
              }
              async _baseDelete(e3 = {}) {
                await this._baseMutate({ ...e3, method: "DELETE" });
              }
              async reload(e3) {
                const { rotatingTokenNonce: t3 } = e3 || {};
                return this._baseGet({ forceUpdateClient: true, rotatingTokenNonce: t3 });
              }
            }
            class a2 extends o2 {
              constructor(e3) {
                super(), this.id = void 0, this.socialProviderStrategies = [], this.authenticatableSocialStrategies = [], this.web3FirstFactors = [], this.enabledFirstFactorIdentifiers = [], this.fromJSON(e3);
              }
              get instanceIsPasswordBased() {
                return this.attributes.password.enabled && this.attributes.password.required;
              }
              get hasValidAuthFactor() {
                return this.attributes.email_address.enabled || this.attributes.phone_number.enabled || this.attributes.password.required && this.attributes.username.required;
              }
              fromJSON(e3) {
                var t3, n3, r3;
                return e3 ? (this.social = e3.social, this.saml = e3.saml, this.attributes = Object.fromEntries(Object.entries(e3.attributes).map(((e4) => [e4[0], { ...e4[1], name: e4[0] }]))), this.actions = e3.actions, this.signIn = e3.sign_in, this.signUp = e3.sign_up, this.passwordSettings = { ...e3.password_settings, min_length: Math.max(null === (t3 = null == e3 ? void 0 : e3.password_settings) || void 0 === t3 ? void 0 : t3.min_length, 8), max_length: 0 === (null === (n3 = null == e3 ? void 0 : e3.password_settings) || void 0 === n3 ? void 0 : n3.max_length) ? 72 : Math.min(null === (r3 = null == e3 ? void 0 : e3.password_settings) || void 0 === r3 ? void 0 : r3.max_length, 72) }, this.socialProviderStrategies = this.getSocialProviderStrategies(e3.social), this.authenticatableSocialStrategies = this.getAuthenticatableSocialStrategies(e3.social), this.web3FirstFactors = this.getWeb3FirstFactors(this.attributes), this.enabledFirstFactorIdentifiers = this.getEnabledFirstFactorIdentifiers(this.attributes), this) : this;
              }
              getEnabledFirstFactorIdentifiers(e3) {
                return e3 ? Object.entries(e3).filter((([e4, t3]) => t3.used_for_first_factor && !e4.startsWith("web3"))).map((([e4]) => e4)) : [];
              }
              getWeb3FirstFactors(e3) {
                return e3 ? Object.entries(e3).filter((([e4, t3]) => t3.used_for_first_factor && e4.startsWith("web3"))).map((([, e4]) => e4.first_factors)).flat() : [];
              }
              getSocialProviderStrategies(e3) {
                return e3 ? Object.entries(e3).filter((([, e4]) => e4.enabled)).map((([, e4]) => e4.strategy)).sort() : [];
              }
              getAuthenticatableSocialStrategies(e3) {
                return e3 ? Object.entries(e3).filter((([, e4]) => e4.enabled && e4.authenticatable)).map((([, e4]) => e4.strategy)).sort() : [];
              }
            }
            class s2 extends o2 {
              constructor(e3) {
                super(), this.fromJSON(e3);
              }
              fromJSON(e3) {
                return this.singleSessionMode = !e3 || e3.single_session_mode, this.urlBasedSessionSyncing = !!e3 && e3.url_based_session_syncing, this;
              }
            }
            function c(e3) {
              const t3 = new Date(e3 || /* @__PURE__ */ new Date());
              return (n3 = t3) instanceof Date && !isNaN(n3.getTime()) ? t3 : /* @__PURE__ */ new Date();
              var n3;
            }
            class l {
              static fromKey(e3) {
                const [t3, n3, r3 = ""] = e3.split("::");
                return new l(t3, { audience: r3, tokenId: n3 });
              }
              constructor(e3, t3) {
                this.prefix = e3, this.data = t3, this.prefix = e3, this.data = t3;
              }
              toKey() {
                const { tokenId: e3, audience: t3 } = this.data;
                return [this.prefix, e3, t3 || ""].join("::");
              }
            }
            const u = /* @__PURE__ */ ((e3 = "clerk") => {
              const t3 = /* @__PURE__ */ new Map();
              let n3;
              return { get: (n4, r3 = 10) => {
                const i3 = new l(e3, n4), o3 = t3.get(i3.toKey());
                if (!o3) return;
                const a3 = Math.floor(Date.now() / 1e3) - o3.createdAt;
                if (!(o3.expiresIn - a3 < (r3 || 1) + 5)) return o3.entry;
                t3.delete(i3.toKey());
              }, set: (r3) => {
                const i3 = new l(e3, { audience: r3.audience, tokenId: r3.tokenId }).toKey(), o3 = { entry: r3, createdAt: Math.floor(Date.now() / 1e3) }, a3 = () => {
                  t3.get(i3) === o3 && t3.delete(i3);
                };
                r3.tokenResolver.then(((e4) => {
                  if (!e4.jwt) return a3();
                  const t4 = e4.jwt.claims.exp - e4.jwt.claims.iat;
                  o3.expiresIn = t4, n3 = setTimeout(a3, 1e3 * t4), "function" == typeof n3.unref && n3.unref();
                })).catch((() => {
                  a3();
                })), t3.set(i3, o3);
              }, clear: () => {
                clearTimeout(n3), t3.clear();
              }, size: () => t3.size };
            })();
            class d extends o2 {
              static getInstance() {
                return d.instance || (d.instance = new d()), d.instance;
              }
              static isClientResource(e3) {
                return !!e3 && e3 instanceof d;
              }
              constructor(e3 = null) {
                super(), this.pathRoot = "/client", this.sessions = [], this.signUp = new re(), this.signIn = new X(), this.lastActiveSessionId = null, this.createdAt = null, this.updatedAt = null, this.fromJSON(e3);
              }
              get signUpAttempt() {
                return this.signUp;
              }
              get signInAttempt() {
                return this.signIn;
              }
              get activeSessions() {
                return this.sessions.filter(((e3) => "active" === e3.status));
              }
              create() {
                return this._basePut();
              }
              fetch() {
                return this._baseGet();
              }
              async destroy() {
                return this._baseDelete({ path: "/client" }).then((() => {
                  u.clear(), this.sessions = [], this.signUp = new re(null), this.signIn = new X(null), this.lastActiveSessionId = null, this.createdAt = null, this.updatedAt = null;
                }));
              }
              clearCache() {
                return this.sessions.forEach(((e3) => e3.clearCache()));
              }
              fromJSON(e3) {
                return e3 && (this.id = e3.id, this.sessions = (e3.sessions || []).map(((e4) => new H(e4))), this.signUp = new re(e3.sign_up), this.signIn = new X(e3.sign_in), this.lastActiveSessionId = e3.last_active_session_id, this.createdAt = c(e3.created_at), this.updatedAt = c(e3.updated_at)), this;
              }
              path() {
                return this.pathRoot;
              }
            }
            class h {
              constructor(e3) {
                this.object = "", this.deleted = false, this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 ? (this.object = e3.object, this.id = e3.id, this.slug = e3.slug, this.deleted = e3.deleted, this) : this;
              }
            }
            var f = n2(7780);
            class p extends o2 {
              constructor(e3) {
                super(), this.captchaPublicKey = null, this.captchaWidgetType = null, this.captchaProvider = "turnstile", this.captchaPublicKeyInvisible = null, this.captchaOauthBypass = [], this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.instanceEnvironmentType = e3.instance_environment_type, this.applicationName = e3.application_name, this.theme = e3.theme, this.preferredSignInStrategy = e3.preferred_sign_in_strategy, this.logoImageUrl = e3.logo_image_url, this.faviconImageUrl = e3.favicon_image_url, this.logoUrl = e3.logo_url, this.faviconUrl = e3.favicon_url, this.homeUrl = e3.home_url, this.signInUrl = e3.sign_in_url, this.signUpUrl = e3.sign_up_url, this.userProfileUrl = e3.user_profile_url, this.afterSignInUrl = e3.after_sign_in_url, this.afterSignUpUrl = e3.after_sign_up_url, this.afterSignOutOneUrl = e3.after_sign_out_one_url, this.afterSignOutAllUrl = e3.after_sign_out_all_url, this.afterSwitchSessionUrl = e3.after_switch_session_url, this.branded = e3.branded, this.captchaPublicKey = e3.captcha_public_key, this.captchaWidgetType = e3.captcha_widget_type, this.captchaProvider = e3.captcha_provider, this.captchaPublicKeyInvisible = e3.captcha_public_key_invisible, this.captchaOauthBypass = e3.captcha_oauth_bypass || ["oauth_google", "oauth_microsoft", "oauth_apple"], this.supportEmail = e3.support_email || "", this.clerkJSVersion = e3.clerk_js_version, this.organizationProfileUrl = e3.organization_profile_url, this.createOrganizationUrl = e3.create_organization_url, this.afterLeaveOrganizationUrl = e3.after_leave_organization_url, this.afterCreateOrganizationUrl = e3.after_create_organization_url, this.googleOneTapClientId = e3.google_one_tap_client_id, this) : this;
              }
            }
            (0, f.Lx)(p, "logoUrl", "Use `logoImageUrl` instead."), (0, f.Lx)(p, "faviconUrl", "Use `faviconImageUrl` instead.");
            var m = n2(4968);
            n2(3195);
            class g extends o2 {
              constructor(e3, t3) {
                super(), this.emailAddress = "", this.linkedTo = [], this.prepareVerification = (e4) => this._basePost({ action: "prepare_verification", body: { ...e4 } }), this.attemptVerification = (e4) => {
                  const { code: t4 } = e4 || {};
                  return this._basePost({ action: "attempt_verification", body: { code: t4 } });
                }, this.createMagicLinkFlow = () => {
                  (0, f.io)("createMagicLinkFlow", "Use `createEmailLinkFlow` instead.");
                  const { run: e4, stop: t4 } = (0, m.vu)();
                  return { startMagicLinkFlow: async ({ redirectUrl: n3 }) => (this.id || (0, i2.HZ)("SignUp"), await this.prepareVerification({ strategy: "email_link", redirectUrl: n3 }), new Promise(((n4, r3) => {
                    e4((() => this.reload().then(((e5) => {
                      "verified" === e5.verification.status && (t4(), n4(e5));
                    })).catch(((e5) => {
                      t4(), r3(e5);
                    }))));
                  }))), cancelMagicLinkFlow: t4 };
                }, this.createEmailLinkFlow = () => {
                  const { run: e4, stop: t4 } = (0, m.vu)();
                  return { startEmailLinkFlow: async ({ redirectUrl: n3 }) => (this.id || (0, i2.HZ)("SignUp"), await this.prepareVerification({ strategy: "email_link", redirectUrl: n3 }), new Promise(((n4, r3) => {
                    e4((() => this.reload().then(((e5) => {
                      "verified" === e5.verification.status && (t4(), n4(e5));
                    })).catch(((e5) => {
                      t4(), r3(e5);
                    }))));
                  }))), cancelEmailLinkFlow: t4 };
                }, this.destroy = () => this._baseDelete(), this.toString = () => this.emailAddress, this.pathRoot = t3, this.fromJSON(e3);
              }
              create() {
                return this._basePost({ body: { email_address: this.emailAddress } });
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.emailAddress = e3.email_address, this.verification = new S(e3.verification), this.linkedTo = (e3.linked_to || []).map(((e4) => new A(e4))), this) : this;
              }
            }
            class y extends o2 {
              constructor(e3) {
                super(), this.fromJSON(e3);
              }
              fromJSON(e3) {
                const { enabled: t3 = false, max_allowed_memberships: n3 = 0, actions: r3, domains: i3 } = e3 || {};
                return this.enabled = t3, this.maxAllowedMemberships = n3, this.actions = { adminDelete: (null == r3 ? void 0 : r3.admin_delete) || false }, this.domains = { enabled: (null == i3 ? void 0 : i3.enabled) || false, enrollmentModes: (null == i3 ? void 0 : i3.enrollment_modes) || [] }, this;
              }
            }
            class v extends o2 {
              static getInstance() {
                return v.instance || (v.instance = new v()), v.instance;
              }
              constructor(e3 = null) {
                super(), this.pathRoot = "/environment", this.isSingleSession = () => this.authConfig.singleSessionMode, this.isProduction = () => "production" === this.displayConfig.instanceEnvironmentType, this.isDevelopmentOrStaging = () => !this.isProduction(), this.onWindowLocationHost = () => this.displayConfig.backendHost === window.location.host, this.fromJSON(e3);
              }
              fetch({ touch: e3 } = { touch: false }) {
                if (e3) return this._basePatch({});
                const t3 = new URLSearchParams();
                if ("function" == typeof o2.clerk.__internal_getFrameworkHint) {
                  const { framework: e4, version: n3 } = o2.clerk.__internal_getFrameworkHint();
                  e4 && (t3.append("__clerk_framework_hint", e4), n3 && t3.append("__clerk_framework_version", n3));
                }
                return this._baseGet({ search: t3 });
              }
              fromJSON(e3) {
                return e3 && (this.authConfig = new s2(e3.auth_config), this.displayConfig = new p(e3.display_config), this.userSettings = new a2(e3.user_settings), this.organizationSettings = new y(e3.organization_settings), this.maintenanceMode = e3.maintenance_mode), this;
              }
            }
            var b, w = n2(9859), _ = n2(7643);
            class S extends o2 {
              constructor(e3) {
                super(), this.pathRoot = "", this.status = null, this.strategy = null, this.nonce = null, this.externalVerificationRedirectURL = null, this.attempts = null, this.expireAt = null, this.error = null, this.verifiedAtClient = null, this.verifiedFromTheSameClient = () => {
                  var e4, t3;
                  return this.verifiedAtClient === (null === (t3 = null === (e4 = o2.clerk) || void 0 === e4 ? void 0 : e4.client) || void 0 === t3 ? void 0 : t3.id);
                }, this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 && (this.status = e3.status, this.verifiedAtClient = e3.verified_at_client, this.strategy = e3.strategy, this.nonce = e3.nonce || null, e3.external_verification_redirect_url ? this.externalVerificationRedirectURL = new URL(e3.external_verification_redirect_url) : this.externalVerificationRedirectURL = null, this.attempts = e3.attempts, this.expireAt = c(e3.expire_at), this.error = e3.error ? (0, w.u$)(e3.error) : null), this;
              }
            }
            class k {
              constructor(e3) {
                e3 ? (this.emailAddress = new P(e3.email_address), this.phoneNumber = new P(e3.phone_number), this.web3Wallet = new P(e3.web3_wallet), this.externalAccount = new S(e3.external_account)) : (this.emailAddress = new P(null), this.phoneNumber = new P(null), this.web3Wallet = new P(null), this.externalAccount = new S(null));
              }
            }
            class P extends S {
              constructor(e3) {
                super(e3), e3 ? (this.nextAction = e3.next_action, this.supportedStrategies = e3.supported_strategies) : (this.nextAction = "", this.supportedStrategies = []);
              }
            }
            class O extends o2 {
              constructor(e3, t3) {
                super(), this.providerUserId = "", this.emailAddress = "", this.approvedScopes = "", this.firstName = "", this.lastName = "", this.avatarUrl = "", this.imageUrl = "", this.username = "", this.publicMetadata = {}, this.label = "", this.verification = null, this.reauthorize = (e4) => {
                  const { additionalScopes: t4, redirectUrl: n3 } = e4 || {};
                  return this._basePatch({ action: "reauthorize", body: { additional_scope: t4, redirect_url: n3 } });
                }, this.destroy = () => this._baseDelete(), this.pathRoot = t3, this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.identificationId = e3.identification_id, this.providerUserId = e3.provider_user_id, this.approvedScopes = e3.approved_scopes, this.avatarUrl = e3.avatar_url, this.imageUrl = e3.image_url, this.emailAddress = e3.email_address, this.firstName = e3.first_name, this.lastName = e3.last_name, this.provider = (e3.provider || "").replace("oauth_", ""), this.username = e3.username, this.publicMetadata = e3.public_metadata, this.label = e3.label, e3.verification && (this.verification = new S(e3.verification)), this) : this;
              }
              providerSlug() {
                return this.provider;
              }
              providerTitle() {
                return [(0, _.Ns)(this.providerSlug()), "Account"].join(" ");
              }
              accountIdentifier() {
                return this.username || this.emailAddress || this.label;
              }
            }
            (0, _.Lx)(O, "avatarUrl", "Use `imageUrl` instead.");
            class A extends o2 {
              constructor(e3) {
                super(), this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.type = e3.type, this) : this;
              }
            }
            class U extends o2 {
              static async create(e3, t3 = {}) {
                var n3;
                let r3, i3 = t3;
                "string" == typeof t3.file ? (i3 = t3.file, r3 = new Headers({ "Content-Type": "application/octet-stream" })) : t3.file && (i3 = new FormData(), i3.append("file", t3.file));
                const a3 = null === (n3 = await o2._fetch({ path: e3, method: "POST", body: i3, headers: r3 })) || void 0 === n3 ? void 0 : n3.response;
                return new U(a3);
              }
              static async delete(e3) {
                var t3;
                const n3 = null === (t3 = await o2._fetch({ path: e3, method: "DELETE" })) || void 0 === t3 ? void 0 : t3.response;
                return new U(n3);
              }
              constructor(e3) {
                super(), this.name = null, this.publicUrl = null, this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.name = e3.name, this.publicUrl = e3.public_url, this) : this;
              }
            }
            class x extends o2 {
              constructor(e3, t3) {
                super(), this.phoneNumber = "", this.reservedForSecondFactor = false, this.defaultSecondFactor = false, this.linkedTo = [], this.create = () => this._basePost({ body: { phone_number: this.phoneNumber } }), this.prepareVerification = () => this._basePost({ action: "prepare_verification", body: { strategy: "phone_code" } }), this.attemptVerification = (e4) => {
                  const { code: t4 } = e4 || {};
                  return this._basePost({ action: "attempt_verification", body: { code: t4 } });
                }, this.setReservedForSecondFactor = (e4) => {
                  const { reserved: t4 } = e4 || {};
                  return this._basePatch({ body: { reserved_for_second_factor: t4 } });
                }, this.makeDefaultSecondFactor = () => this._basePatch({ body: { default_second_factor: true } }), this.destroy = () => this._baseDelete(), this.toString = () => {
                  const e4 = this.phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
                  return e4 ? "(" + e4[1] + ") " + e4[2] + "-" + e4[3] : this.phoneNumber;
                }, this.pathRoot = t3, this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.phoneNumber = e3.phone_number, this.reservedForSecondFactor = e3.reserved_for_second_factor, this.defaultSecondFactor = e3.default_second_factor, this.verification = new S(e3.verification), this.linkedTo = (e3.linked_to || []).map(((e4) => new A(e4))), this.backupCodes = e3.backup_codes, this) : this;
              }
            }
            function C(e3) {
              const { pageSize: t3, initialPage: n3, ...r3 } = e3 || {}, i3 = null != t3 ? t3 : 10, o3 = null != n3 ? n3 : 1;
              return { ...(a3 = r3, Object.keys(a3).reduce(((e4, t4) => (void 0 !== a3[t4] && (e4[t4] = a3[t4]), e4)), {})), limit: i3, offset: (o3 - 1) * i3 };
              var a3;
            }
            class E extends o2 {
              constructor(e3) {
                super(), this.prepareAffiliationVerification = async (e4) => this._basePost({ path: `/organizations/${this.organizationId}/domains/${this.id}/prepare_affiliation_verification`, method: "POST", body: e4 }), this.attemptAffiliationVerification = async (e4) => this._basePost({ path: `/organizations/${this.organizationId}/domains/${this.id}/attempt_affiliation_verification`, method: "POST", body: e4 }), this.updateEnrollmentMode = (e4) => this._basePost({ path: `/organizations/${this.organizationId}/domains/${this.id}/update_enrollment_mode`, body: e4 }), this.delete = () => this._baseDelete({ path: `/organizations/${this.organizationId}/domains/${this.id}` }), this.fromJSON(e3);
              }
              static async create(e3, { name: t3 }) {
                var n3;
                const r3 = null === (n3 = await o2._fetch({ path: `/organizations/${e3}/domains`, method: "POST", body: { name: t3 } })) || void 0 === n3 ? void 0 : n3.response;
                return new E(r3);
              }
              fromJSON(e3) {
                return e3 && (this.id = e3.id, this.name = e3.name, this.organizationId = e3.organization_id, this.enrollmentMode = e3.enrollment_mode, this.affiliationEmailAddress = e3.affiliation_email_address, this.totalPendingSuggestions = e3.total_pending_suggestions, this.totalPendingInvitations = e3.total_pending_invitations, e3.verification ? this.verification = { status: e3.verification.status, strategy: e3.verification.strategy, attempts: e3.verification.attempts, expiresAt: c(e3.verification.expires_at) } : this.verification = null), this;
              }
            }
            class I extends o2 {
              constructor(e3) {
                super(), this.accept = async () => await this._basePost({ path: `/organizations/${this.organizationId}/membership_requests/${this.id}/accept` }), this.reject = async () => await this._basePost({ path: `/organizations/${this.organizationId}/membership_requests/${this.id}/reject` }), this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 && (this.id = e3.id, this.organizationId = e3.organization_id, this.status = e3.status, this.createdAt = c(e3.created_at), this.updatedAt = c(e3.updated_at), e3.public_user_data && (this.publicUserData = new K(e3.public_user_data))), this;
              }
            }
            class M extends o2 {
              constructor(e3) {
                super(), this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.key = e3.key, this.name = e3.name, this.description = e3.description, this.type = e3.type, this.createdAt = c(e3.created_at), this.updatedAt = c(e3.updated_at), this) : this;
              }
            }
            class R extends o2 {
              constructor(e3) {
                super(), this.permissions = [], this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.key = e3.key, this.name = e3.name, this.description = e3.description, this.permissions = e3.permissions.map(((e4) => new M(e4))), this.createdAt = c(e3.created_at), this.updatedAt = c(e3.updated_at), this) : this;
              }
            }
            class z extends o2 {
              constructor(e3) {
                super(), this.pathRoot = "/organizations", this.publicMetadata = {}, this.membersCount = 0, this.pendingInvitationsCount = 0, this.update = async (e4) => this._basePatch({ body: e4 }), this.getRoles = async (e4) => await o2._fetch({ path: `/organizations/${this.id}/roles`, method: "GET", search: C(e4) }, { forceUpdateClient: true }).then(((e5) => {
                  const { data: t3, total_count: n3 } = null == e5 ? void 0 : e5.response;
                  return { total_count: n3, data: t3.map(((e6) => new R(e6))) };
                })), this.getDomains = async (e4) => await o2._fetch({ path: `/organizations/${this.id}/domains`, method: "GET", search: C(e4) }, { forceUpdateClient: true }).then(((e5) => {
                  const { data: t3, total_count: n3 } = null == e5 ? void 0 : e5.response;
                  return { total_count: n3, data: t3.map(((e6) => new E(e6))) };
                })).catch((() => ({ total_count: 0, data: [] }))), this.getDomain = async ({ domainId: e4 }) => {
                  var t3;
                  const n3 = null === (t3 = await o2._fetch({ path: `/organizations/${this.id}/domains/${e4}`, method: "GET" })) || void 0 === t3 ? void 0 : t3.response;
                  return new E(n3);
                }, this.getMembershipRequests = async (e4) => await o2._fetch({ path: `/organizations/${this.id}/membership_requests`, method: "GET", search: C(e4) }).then(((e5) => {
                  const { data: t3, total_count: n3 } = null == e5 ? void 0 : e5.response;
                  return { total_count: n3, data: t3.map(((e6) => new I(e6))) };
                })).catch((() => ({ total_count: 0, data: [] }))), this.createDomain = async (e4) => E.create(this.id, { name: e4 }), this.getMemberships = async (e4) => {
                  const t3 = void 0 === e4 || !(null == e4 ? void 0 : e4.paginated);
                  return (null == e4 ? void 0 : e4.limit) && (0, f.io)("limit", "Use `pageSize` instead in Organization.getMemberships.", "organization:getMemberships:limit"), (null == e4 ? void 0 : e4.offset) && (0, f.io)("offset", "Use `initialPage` instead in Organization.limit.", "organization:getMemberships:offset"), await o2._fetch({ path: `/organizations/${this.id}/memberships`, method: "GET", search: t3 ? e4 : C(e4) }, { forceUpdateClient: true }).then(((e5) => {
                    if (t3) return (null == e5 ? void 0 : e5.response).map(((e6) => new N(e6)));
                    const { data: n3, total_count: r3 } = null == e5 ? void 0 : e5.response;
                    return { total_count: r3, data: n3.map(((e6) => new N(e6))) };
                  })).catch((() => t3 ? [] : { total_count: 0, data: [] }));
                }, this.getPendingInvitations = async (e4) => ((0, f.io)("getPendingInvitations", "Use the `getInvitations` method instead."), await o2._fetch({ path: `/organizations/${this.id}/invitations/pending`, method: "GET", search: e4 }).then(((e5) => (null == e5 ? void 0 : e5.response).map(((e6) => new T(e6))))).catch((() => []))), this.getInvitations = async (e4) => await o2._fetch({ path: `/organizations/${this.id}/invitations`, method: "GET", search: C(e4) }, { forceUpdateClient: true }).then(((e5) => {
                  const { data: t3, total_count: n3 } = null == e5 ? void 0 : e5.response;
                  return { total_count: n3, data: t3.map(((e6) => new T(e6))) };
                })).catch((() => ({ total_count: 0, data: [] }))), this.addMember = async ({ userId: e4, role: t3 }) => {
                  const n3 = await o2._fetch({ method: "POST", path: `/organizations/${this.id}/memberships`, body: { userId: e4, role: t3 } }).then(((e5) => new N(null == e5 ? void 0 : e5.response)));
                  return N.clerk.__unstable__membershipUpdate(n3), n3;
                }, this.inviteMember = async (e4) => T.create(this.id, e4), this.inviteMembers = async (e4) => T.createBulk(this.id, e4), this.updateMember = async ({ userId: e4, role: t3 }) => {
                  const n3 = await o2._fetch({ method: "PATCH", path: `/organizations/${this.id}/memberships/${e4}`, body: { role: t3 } }).then(((e5) => new N(null == e5 ? void 0 : e5.response)));
                  return N.clerk.__unstable__membershipUpdate(n3), n3;
                }, this.removeMember = async (e4) => {
                  const t3 = await o2._fetch({ method: "DELETE", path: `/organizations/${this.id}/memberships/${e4}` }).then(((e5) => new N(null == e5 ? void 0 : e5.response)));
                  return N.clerk.__unstable__membershipUpdate(t3), t3;
                }, this.destroy = async () => this._baseDelete(), this.setLogo = async ({ file: e4 }) => {
                  if (null === e4) return await o2._fetch({ path: `/organizations/${this.id}/logo`, method: "DELETE" }).then(((e5) => new z(null == e5 ? void 0 : e5.response)));
                  let t3, n3;
                  return "string" == typeof e4 ? (t3 = e4, n3 = new Headers({ "Content-Type": "application/octet-stream" })) : (t3 = new FormData(), t3.append("file", e4)), await o2._fetch({ path: `/organizations/${this.id}/logo`, method: "PUT", body: t3, headers: n3 }).then(((e5) => new z(null == e5 ? void 0 : e5.response)));
                }, this.fromJSON(e3);
              }
              static async create(e3) {
                var t3;
                let n3, r3;
                "string" == typeof e3 ? (n3 = e3, (0, f.io)("create", "Calling `create` with a string is deprecated. Use an object of type CreateOrganizationParams instead.", "organization:create")) : (n3 = e3.name, r3 = e3.slug);
                const i3 = null === (t3 = await o2._fetch({ path: "/organizations", method: "POST", body: { name: n3, slug: r3 } })) || void 0 === t3 ? void 0 : t3.response;
                return new z(i3);
              }
              static async get(e3) {
                var t3;
                const n3 = null === (t3 = await o2._fetch({ path: `/organizations/${e3}`, method: "GET" })) || void 0 === t3 ? void 0 : t3.response;
                return new z(n3);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.name = e3.name, this.slug = e3.slug, this.logoUrl = e3.logo_url, this.imageUrl = e3.image_url, this.hasImage = e3.has_image, this.publicMetadata = e3.public_metadata, this.membersCount = e3.members_count, this.pendingInvitationsCount = e3.pending_invitations_count, this.maxAllowedMemberships = e3.max_allowed_memberships, this.adminDeleteEnabled = e3.admin_delete_enabled, this.createdAt = c(e3.created_at), this.updatedAt = c(e3.updated_at), this) : this;
              }
              async reload(e3) {
                var t3;
                const { rotatingTokenNonce: n3 } = e3 || {}, r3 = null === (t3 = await o2._fetch({ path: `/organizations/${this.id}`, method: "GET", rotatingTokenNonce: n3 }, { forceUpdateClient: true })) || void 0 === t3 ? void 0 : t3.response;
                return this.fromJSON(r3);
              }
            }
            (0, f.Lx)(z, "logoUrl", "Use `imageUrl` instead.");
            class T extends o2 {
              static async create(e3, { emailAddress: t3, role: n3 }) {
                var r3;
                const i3 = null === (r3 = await o2._fetch({ path: `/organizations/${e3}/invitations`, method: "POST", body: { email_address: t3, role: n3 } })) || void 0 === r3 ? void 0 : r3.response, a3 = new T(i3);
                return this.clerk.__unstable__invitationUpdate(a3), a3;
              }
              static async createBulk(e3, t3) {
                var n3;
                const { emailAddresses: r3, role: i3 } = t3;
                return (null === (n3 = await o2._fetch({ path: `/organizations/${e3}/invitations/bulk`, method: "POST", body: { email_address: r3, role: i3 } })) || void 0 === n3 ? void 0 : n3.response).map(((e4) => new T(e4)));
              }
              constructor(e3) {
                super(), this.publicMetadata = {}, this.revoke = async () => {
                  const e4 = await this._basePost({ path: `/organizations/${this.organizationId}/invitations/${this.id}/revoke` });
                  return T.clerk.__unstable__invitationUpdate(e4), e4;
                }, this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 && (this.id = e3.id, this.emailAddress = e3.email_address, this.organizationId = e3.organization_id, this.publicMetadata = e3.public_metadata, this.role = e3.role, this.status = e3.status, this.createdAt = c(e3.created_at), this.updatedAt = c(e3.updated_at)), this;
              }
            }
            class N extends o2 {
              constructor(e3) {
                super(), this.publicMetadata = {}, this.permissions = [], this.destroy = async () => {
                  const e4 = await this._baseDelete({ path: `/organizations/${this.organization.id}/memberships/${this.publicUserData.userId}` });
                  return b.clerk.__unstable__membershipUpdate(e4), e4;
                }, this.update = async ({ role: e4 }) => {
                  const t3 = await this._basePatch({ path: `/organizations/${this.organization.id}/memberships/${this.publicUserData.userId}`, body: { role: e4 } });
                  return b.clerk.__unstable__membershipUpdate(t3), t3;
                }, this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.organization = new z(e3.organization), this.publicMetadata = e3.public_metadata, e3.public_user_data && (this.publicUserData = new K(e3.public_user_data)), this.permissions = Array.isArray(e3.permissions) ? [...e3.permissions] : [], this.role = e3.role, this.createdAt = c(e3.created_at), this.updatedAt = c(e3.updated_at), this) : this;
              }
              async reload(e3) {
                const { rotatingTokenNonce: t3 } = e3 || {}, n3 = await o2._fetch({ method: "GET", path: "/me/organization_memberships", rotatingTokenNonce: t3 }, { forceUpdateClient: true }), r3 = (null == n3 ? void 0 : n3.response).find(((e4) => e4.id === this.id));
                return this.fromJSON(r3);
              }
            }
            b = N, N.retrieve = async (e3) => {
              const t3 = void 0 === e3 || !(null == e3 ? void 0 : e3.paginated);
              return (null == e3 ? void 0 : e3.limit) && (0, f.io)("limit", "Use `pageSize` instead in OrganizationMembership.retrieve.", "organization-membership:limit"), (null == e3 ? void 0 : e3.offset) && (0, f.io)("offset", "Use `initialPage` instead in OrganizationMembership.retrieve.", "organization-membership:offset"), await o2._fetch({ path: "/me/organization_memberships", method: "GET", search: t3 ? e3 : C(e3) }).then(((e4) => {
                if (t3) return (null == e4 ? void 0 : e4.response).map(((e5) => new b(e5)));
                const { data: n3, total_count: r3 } = null == e4 ? void 0 : e4.response;
                return { total_count: r3, data: n3.map(((e5) => new b(e5))) };
              })).catch((() => t3 ? [] : { total_count: 0, data: [] }));
            };
            class L extends o2 {
              constructor(e3) {
                super(), this.accept = async () => await this._basePost({ path: `/me/organization_suggestions/${this.id}/accept` }), this.fromJSON(e3);
              }
              static async retrieve(e3) {
                return await o2._fetch({ path: "/me/organization_suggestions", method: "GET", search: C(e3) }).then(((e4) => {
                  const { data: t3, total_count: n3 } = null == e4 ? void 0 : e4.response;
                  return { total_count: n3, data: t3.map(((e5) => new L(e5))) };
                })).catch((() => ({ total_count: 0, data: [] })));
              }
              fromJSON(e3) {
                return e3 && (this.id = e3.id, this.status = e3.status, this.publicOrganizationData = { hasImage: e3.public_organization_data.has_image, imageUrl: e3.public_organization_data.image_url, name: e3.public_organization_data.name, id: e3.public_organization_data.id, slug: e3.public_organization_data.slug }, this.createdAt = c(e3.created_at), this.updatedAt = c(e3.updated_at)), this;
              }
            }
            class j extends o2 {
              constructor(e3, t3) {
                super(), this.provider = "saml_custom", this.providerUserId = null, this.active = false, this.emailAddress = "", this.firstName = "", this.lastName = "", this.verification = null, this.pathRoot = t3, this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.provider = e3.provider, this.providerUserId = e3.provider_user_id, this.active = e3.active, this.emailAddress = e3.email_address, this.firstName = e3.first_name, this.lastName = e3.last_name, e3.verification && (this.verification = new S(e3.verification)), this) : this;
              }
            }
            var $, F, D, W, V, B, J, q = n2(2692), G = function(e3, t3, n3, r3) {
              if ("a" === n3 && !r3) throw new TypeError("Private accessor was defined without a getter");
              if ("function" == typeof t3 ? e3 !== t3 || !r3 : !t3.has(e3)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
              return "m" === n3 ? r3 : "a" === n3 ? r3.call(e3) : r3 ? r3.value : t3.get(e3);
            };
            class H extends o2 {
              static isSessionResource(e3) {
                return !!e3 && e3 instanceof H;
              }
              constructor(e3) {
                super(), $.add(this), this.pathRoot = "/client/sessions", this.end = () => (u.clear(), this._basePost({ action: "end" })), this.remove = () => (u.clear(), this._basePost({ action: "remove" })), this.touch = () => this._basePost({ action: "touch", body: { active_organization_id: this.lastActiveOrganizationId } }), this.clearCache = () => u.clear(), this.getToken = async (e4) => (0, _.Nv)((() => this._getToken(e4)), { shouldRetry: (e5, t3) => !(0, w.nc)(e5) && t3 < 4 }), this.checkAuthorization = (e4) => {
                  if (!this.lastActiveOrganizationId || !this.user) return false;
                  const t3 = (this.user.organizationMemberships || []).find(((e5) => e5.organization.id === this.lastActiveOrganizationId));
                  if (!t3) return false;
                  const n3 = t3.permissions, r3 = t3.role;
                  return e4.permission ? n3.includes(e4.permission) : !!e4.role && r3 === e4.role;
                }, F.set(this, ((e4) => {
                  e4 && (u.set({ tokenId: G(this, $, "m", D).call(this), tokenResolver: Promise.resolve(e4) }), q.B.dispatch(q.A.TokenUpdate, { token: e4 }));
                })), W.set(this, ((e4) => !!e4 && e4.startsWith("integration_"))), V.set(this, ((e4) => (e4 || "").replace("integration_", ""))), B.set(this, (async (e4) => {
                  const { template: t3, leewayInSeconds: n3 } = e4, r3 = u.get({ tokenId: this.user.id, audience: t3 }, n3);
                  if (r3) return r3.tokenResolver.then(((e5) => G(this, $, "m", J).call(this, e5)));
                  const i3 = ie.create(this.user.pathRoot + "/tokens", { service: G(this, V, "f").call(this, t3) });
                  return u.set({ tokenId: this.user.id, audience: t3, tokenResolver: i3 }), i3.then(((e5) => G(this, $, "m", J).call(this, e5)));
                })), this.fromJSON(e3), G(this, F, "f").call(this, this.lastActiveToken);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.status = e3.status, this.expireAt = c(e3.expire_at), this.abandonAt = c(e3.abandon_at), this.lastActiveAt = c(e3.last_active_at), this.lastActiveOrganizationId = e3.last_active_organization_id, this.actor = e3.actor, this.createdAt = c(e3.created_at), this.updatedAt = c(e3.updated_at), this.user = new ce(e3.user), e3.public_user_data && (this.publicUserData = new K(e3.public_user_data)), this.lastActiveToken = e3.last_active_token ? new ie(e3.last_active_token) : null, this) : this;
              }
              async _getToken(e3) {
                if (!this.user) return null;
                const { leewayInSeconds: t3, template: n3, skipCache: r3 = false } = e3 || {};
                if (!n3 && Number(t3) >= 60) throw new Error("Leeway can not exceed the token lifespan (60 seconds)");
                if (G(this, W, "f").call(this, n3)) return G(this, B, "f").call(this, { template: n3, leewayInSeconds: t3, skipCache: r3 });
                const i3 = G(this, $, "m", D).call(this, n3), o3 = r3 ? void 0 : u.get({ tokenId: i3 }, t3);
                if (o3) {
                  const e4 = await o3.tokenResolver;
                  return n3 || q.B.dispatch(q.A.TokenUpdate, { token: e4 }), G(this, $, "m", J).call(this, e4);
                }
                const a3 = n3 ? `${this.path()}/tokens/${n3}` : `${this.path()}/tokens`, s3 = ie.create(a3);
                return u.set({ tokenId: i3, tokenResolver: s3 }), s3.then(((e4) => (n3 || q.B.dispatch(q.A.TokenUpdate, { token: e4 }), G(this, $, "m", J).call(this, e4))));
              }
            }
            F = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ new WeakMap(), $ = /* @__PURE__ */ new WeakSet(), D = function(e3) {
              return `${e3 ? `${this.id}-${e3}` : this.id}-${this.updatedAt.getTime()}`;
            }, J = function(e3) {
              return e3.getRawString() || null;
            };
            class K {
              constructor(e3) {
                this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 && (this.firstName = e3.first_name, this.lastName = e3.last_name, this.profileImageUrl = e3.profile_image_url, this.imageUrl = e3.image_url, this.hasImage = e3.has_image, this.identifier = e3.identifier, this.userId = e3.user_id), this;
              }
            }
            (0, f.Lx)(K, "profileImageUrl", "Use `imageUrl` instead.");
            class Y extends o2 {
              constructor(e3, t3) {
                super(), this.pathRoot = "", this.pathRoot = t3, this.fromJSON(e3);
              }
              static retrieve() {
                var e3;
                const t3 = null === (e3 = o2.clerk.session) || void 0 === e3 ? void 0 : e3.id;
                return this.clerk.getFapiClient().request({ method: "GET", path: "/me/sessions/active", sessionId: t3 }).then(((e4) => e4.payload.map(((e5) => new Y(e5, "/me/sessions"))))).catch((() => []));
              }
              revoke() {
                return this._basePost({ action: "revoke", body: {} });
              }
              fromJSON(e3) {
                var t3;
                return e3 ? (this.id = e3.id, this.status = e3.status, this.expireAt = c(e3.expire_at), this.abandonAt = c(e3.abandon_at), this.lastActiveAt = c(e3.last_active_at), this.latestActivity = ((e4) => ({ id: e4.id, deviceType: e4.device_type, browserName: e4.browser_name, browserVersion: e4.browser_version, country: e4.country, city: e4.city, isMobile: e4.is_mobile, ipAddress: e4.ip_address }))(null !== (t3 = e3.latest_activity) && void 0 !== t3 ? t3 : {}), this.actor = e3.actor, this) : this;
              }
            }
            var Z = n2(5098), Q = n2(9961);
            class X extends o2 {
              constructor(e3 = null) {
                super(), this.pathRoot = "/client/sign_ins", this.status = null, this.supportedIdentifiers = [], this.supportedFirstFactors = [], this.supportedSecondFactors = [], this.firstFactorVerification = new S(null), this.secondFactorVerification = new S(null), this.identifier = null, this.createdSessionId = null, this.userData = new ee(null), this.create = (e4) => this._basePost({ path: this.pathRoot, body: e4 }), this.resetPassword = (e4) => this._basePost({ body: e4, action: "reset_password" }), this.prepareFirstFactor = (e4) => {
                  let t3;
                  switch (e4.strategy) {
                    case "email_link":
                      t3 = { emailAddressId: e4.emailAddressId, redirectUrl: e4.redirectUrl };
                      break;
                    case "email_code":
                    case "reset_password_email_code":
                      t3 = { emailAddressId: e4.emailAddressId };
                      break;
                    case "phone_code":
                      t3 = { phoneNumberId: e4.phoneNumberId, default: e4.default };
                      break;
                    case "web3_metamask_signature":
                      t3 = { web3WalletId: e4.web3WalletId };
                      break;
                    case "reset_password_phone_code":
                      t3 = { phoneNumberId: e4.phoneNumberId };
                      break;
                    case "saml":
                      t3 = { redirectUrl: e4.redirectUrl, actionCompleteRedirectUrl: e4.actionCompleteRedirectUrl };
                      break;
                    default:
                      (0, i2.Gm)("SignIn.prepareFirstFactor", e4.strategy);
                  }
                  return this._basePost({ body: { ...t3, strategy: e4.strategy }, action: "prepare_first_factor" });
                }, this.attemptFirstFactor = (e4) => this._basePost({ body: e4, action: "attempt_first_factor" }), this.createMagicLinkFlow = () => {
                  (0, _.io)("createMagicLinkFlow", "Use `createEmailLinkFlow` instead.");
                  const { run: e4, stop: t3 } = (0, _.vu)();
                  return { startMagicLinkFlow: async ({ emailAddressId: n3, redirectUrl: r3 }) => (this.id || (0, i2.HZ)("SignIn"), await this.prepareFirstFactor({ strategy: "email_link", emailAddressId: n3, redirectUrl: r3 }), new Promise(((n4, r4) => {
                    e4((() => this.reload().then(((e5) => {
                      const r5 = e5.firstFactorVerification.status;
                      "verified" !== r5 && "expired" !== r5 || (t3(), n4(e5));
                    })).catch(((e5) => {
                      t3(), r4(e5);
                    }))));
                  }))), cancelMagicLinkFlow: t3 };
                }, this.createEmailLinkFlow = () => {
                  const { run: e4, stop: t3 } = (0, _.vu)();
                  return { startEmailLinkFlow: async ({ emailAddressId: n3, redirectUrl: r3 }) => (this.id || (0, i2.HZ)("SignIn"), await this.prepareFirstFactor({ strategy: "email_link", emailAddressId: n3, redirectUrl: r3 }), new Promise(((n4, r4) => {
                    e4((() => this.reload().then(((e5) => {
                      const r5 = e5.firstFactorVerification.status;
                      "verified" !== r5 && "expired" !== r5 || (t3(), n4(e5));
                    })).catch(((e5) => {
                      t3(), r4(e5);
                    }))));
                  }))), cancelEmailLinkFlow: t3 };
                }, this.prepareSecondFactor = (e4) => this._basePost({ body: e4, action: "prepare_second_factor" }), this.attemptSecondFactor = (e4) => this._basePost({ body: e4, action: "attempt_second_factor" }), this.authenticateWithRedirect = async (e4) => {
                  const { strategy: t3, redirectUrl: n3, redirectUrlComplete: r3, identifier: o3 } = e4 || {}, { firstFactorVerification: a3 } = "saml" === t3 && this.id ? await this.prepareFirstFactor({ strategy: t3, redirectUrl: X.clerk.buildUrlWithAuth(n3), actionCompleteRedirectUrl: r3 }) : await this.create({ strategy: t3, identifier: o3, redirectUrl: X.clerk.buildUrlWithAuth(n3), actionCompleteRedirectUrl: r3 }), { status: s3, externalVerificationRedirectURL: c2 } = a3;
                  "unverified" === s3 && c2 ? (0, Z.y7)(c2) : (0, i2.wv)(s3, X.fapiClient.buildEmailAddress("support"));
                }, this.authenticateWithWeb3 = async (e4) => {
                  const { identifier: t3, generateSignature: n3 } = e4 || {};
                  "function" != typeof n3 && (0, i2.pV)("generateSignature"), await this.create({ identifier: t3 });
                  const r3 = this.supportedFirstFactors.find(((e5) => "web3_metamask_signature" === e5.strategy));
                  r3 || (0, i2.Rj)("SignIn"), await this.prepareFirstFactor(r3);
                  const { nonce: o3 } = this.firstFactorVerification, a3 = await n3({ identifier: this.identifier, nonce: o3 });
                  return this.attemptFirstFactor({ signature: a3, strategy: "web3_metamask_signature" });
                }, this.authenticateWithMetamask = async () => {
                  const e4 = await (0, Z.$1)();
                  return this.authenticateWithWeb3({ identifier: e4, generateSignature: Z.l });
                }, this.validatePassword = (e4, t3) => {
                  var n3, r3;
                  if (null === (n3 = X.clerk.__unstable__environment) || void 0 === n3 ? void 0 : n3.userSettings.passwordSettings) return (0, Q.G)({ ...null === (r3 = X.clerk.__unstable__environment) || void 0 === r3 ? void 0 : r3.userSettings.passwordSettings, validatePassword: true })(e4, t3);
                }, this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 && (this.id = e3.id, this.status = e3.status, this.supportedIdentifiers = e3.supported_identifiers, this.identifier = e3.identifier, this.supportedFirstFactors = (0, _.Sd)(e3.supported_first_factors), this.supportedSecondFactors = (0, _.Sd)(e3.supported_second_factors), this.firstFactorVerification = new S(e3.first_factor_verification), this.secondFactorVerification = new S(e3.second_factor_verification), this.createdSessionId = e3.created_session_id, this.userData = new ee(e3.user_data)), this;
              }
            }
            class ee {
              constructor(e3) {
                this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 && (this.firstName = e3.first_name, this.lastName = e3.last_name, this.profileImageUrl = e3.profile_image_url, this.imageUrl = e3.image_url, this.hasImage = e3.has_image), this;
              }
            }
            (0, f.Lx)(ee, "profileImageUrl", "Use `imageUrl` instead.");
            var te = n2(8391);
            function ne(e3) {
              const { unsafeMetadata: t3 } = { ...e3 }, n3 = t3 ? "object" == typeof t3 ? JSON.stringify(t3) : t3 : "";
              return { ...e3, ...t3 ? { unsafeMetadata: n3 } : {} };
            }
            class re extends o2 {
              constructor(e3 = null) {
                super(), this.pathRoot = "/client/sign_ups", this.status = null, this.requiredFields = [], this.optionalFields = [], this.missingFields = [], this.unverifiedFields = [], this.verifications = new k(null), this.username = null, this.firstName = null, this.lastName = null, this.emailAddress = null, this.phoneNumber = null, this.web3wallet = null, this.hasPassword = false, this.unsafeMetadata = {}, this.createdSessionId = null, this.createdUserId = null, this.abandonAt = null, this.create = async (e4) => {
                  var t3;
                  const n3 = e4, { captchaSiteKey: r3, canUseCaptcha: i3, captchaURL: o3, captchaWidgetType: a3, captchaProvider: s3, captchaPublicKeyInvisible: c2 } = (0, te.NQ)(re.clerk);
                  if (!this.shouldBypassCaptchaForAttempt(e4) && i3 && r3 && o3 && c2) try {
                    const { captchaToken: e5, captchaWidgetTypeUsed: t4 } = await (0, te.yi)({ siteKey: r3, widgetType: a3, invisibleSiteKey: c2, scriptUrl: o3, captchaProvider: s3 });
                    n3.captchaToken = e5, n3.captchaWidgetType = t4;
                  } catch (l2) {
                    if (!l2.captchaError) throw new w.cR(l2.message, { code: "captcha_unavailable" });
                    n3.captchaError = l2.captchaError;
                  }
                  return e4.transfer && this.shouldBypassCaptchaForAttempt(e4) && (n3.strategy = null === (t3 = re.clerk.client) || void 0 === t3 ? void 0 : t3.signIn.firstFactorVerification.strategy), this._basePost({ path: this.pathRoot, body: ne(n3) });
                }, this.prepareVerification = (e4) => this._basePost({ body: e4, action: "prepare_verification" }), this.attemptVerification = (e4) => this._basePost({ body: e4, action: "attempt_verification" }), this.prepareEmailAddressVerification = (e4) => this.prepareVerification(e4 || { strategy: "email_code" }), this.attemptEmailAddressVerification = (e4) => this.attemptVerification({ ...e4, strategy: "email_code" }), this.createMagicLinkFlow = () => {
                  (0, _.io)("createMagicLinkFlow", "Use `createEmailLinkFlow` instead.");
                  const { run: e4, stop: t3 } = (0, _.vu)();
                  return { startMagicLinkFlow: async ({ redirectUrl: n3 }) => (this.id || (0, i2.HZ)("SignUp"), await this.prepareEmailAddressVerification({ strategy: "email_link", redirectUrl: n3 }), new Promise(((n4, r3) => {
                    e4((() => this.reload().then(((e5) => {
                      const r4 = e5.verifications.emailAddress.status;
                      "verified" !== r4 && "expired" !== r4 || (t3(), n4(e5));
                    })).catch(((e5) => {
                      t3(), r3(e5);
                    }))));
                  }))), cancelMagicLinkFlow: t3 };
                }, this.createEmailLinkFlow = () => {
                  const { run: e4, stop: t3 } = (0, _.vu)();
                  return { startEmailLinkFlow: async ({ redirectUrl: n3 }) => (this.id || (0, i2.HZ)("SignUp"), await this.prepareEmailAddressVerification({ strategy: "email_link", redirectUrl: n3 }), new Promise(((n4, r3) => {
                    e4((() => this.reload().then(((e5) => {
                      const r4 = e5.verifications.emailAddress.status;
                      "verified" !== r4 && "expired" !== r4 || (t3(), n4(e5));
                    })).catch(((e5) => {
                      t3(), r3(e5);
                    }))));
                  }))), cancelEmailLinkFlow: t3 };
                }, this.preparePhoneNumberVerification = (e4) => this.prepareVerification(e4 || { strategy: "phone_code" }), this.attemptPhoneNumberVerification = (e4) => this.attemptVerification({ ...e4, strategy: "phone_code" }), this.prepareWeb3WalletVerification = () => this.prepareVerification({ strategy: "web3_metamask_signature" }), this.attemptWeb3WalletVerification = async (e4) => {
                  const { signature: t3, generateSignature: n3 } = e4 || {};
                  if (n3 && (0, _.io)("generateSignature", "Use signature field instead."), t3) return this.attemptVerification({ signature: t3, strategy: "web3_metamask_signature" });
                  "function" != typeof n3 && (0, i2.pV)("generateSignature");
                  const { nonce: r3 } = this.verifications.web3Wallet;
                  r3 || (0, i2.Rj)("SignUp");
                  const o3 = await n3({ identifier: this.web3wallet, nonce: r3 });
                  return this.attemptVerification({ signature: o3, strategy: "web3_metamask_signature" });
                }, this.authenticateWithWeb3 = async (e4) => {
                  const { generateSignature: t3, identifier: n3, unsafeMetadata: r3 } = e4 || {}, o3 = n3 || this.web3wallet;
                  await this.create({ web3Wallet: o3, unsafeMetadata: r3 }), await this.prepareWeb3WalletVerification();
                  const { nonce: a3 } = this.verifications.web3Wallet;
                  a3 || (0, i2.Rj)("SignUp");
                  const s3 = await t3({ identifier: n3, nonce: a3 });
                  return this.attemptWeb3WalletVerification({ signature: s3 });
                }, this.authenticateWithMetamask = async (e4) => {
                  const t3 = await (0, Z.$1)();
                  return this.authenticateWithWeb3({ identifier: t3, generateSignature: Z.l, unsafeMetadata: null == e4 ? void 0 : e4.unsafeMetadata });
                }, this.authenticateWithRedirect = async ({ redirectUrl: e4, redirectUrlComplete: t3, strategy: n3, continueSignUp: r3 = false, unsafeMetadata: o3, emailAddress: a3 }) => {
                  const s3 = () => {
                    const i3 = { strategy: n3, redirectUrl: re.clerk.buildUrlWithAuth(e4), actionCompleteRedirectUrl: t3, unsafeMetadata: o3, emailAddress: a3 };
                    return r3 && this.id ? this.update(i3) : this.create(i3);
                  }, { verifications: c2 } = await s3().catch((async (e5) => {
                    if ((0, w.$R)(e5) && (0, w.rZ)(e5)) return await re.clerk.__unstable__environment.reload(), s3();
                    throw e5;
                  })), { externalAccount: l2 } = c2, { status: u2, externalVerificationRedirectURL: d2 } = l2;
                  "unverified" === u2 && d2 ? (0, Z.y7)(d2) : (0, i2.wv)(u2, re.fapiClient.buildEmailAddress("support"));
                }, this.update = (e4) => this._basePatch({ body: ne(e4) }), this.validatePassword = (e4, t3) => {
                  var n3, r3;
                  if (null === (n3 = re.clerk.__unstable__environment) || void 0 === n3 ? void 0 : n3.userSettings.passwordSettings) return (0, Q.G)({ ...null === (r3 = re.clerk.__unstable__environment) || void 0 === r3 ? void 0 : r3.userSettings.passwordSettings, validatePassword: true })(e4, t3);
                }, this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 && (this.id = e3.id, this.status = e3.status, this.requiredFields = e3.required_fields, this.optionalFields = e3.optional_fields, this.missingFields = e3.missing_fields, this.unverifiedFields = e3.unverified_fields, this.verifications = new k(e3.verifications), this.username = e3.username, this.firstName = e3.first_name, this.lastName = e3.last_name, this.emailAddress = e3.email_address, this.phoneNumber = e3.phone_number, this.hasPassword = e3.has_password, this.unsafeMetadata = e3.unsafe_metadata, this.createdSessionId = e3.created_session_id, this.createdUserId = e3.created_user_id, this.abandonAt = e3.abandon_at, this.web3wallet = e3.web3_wallet), this;
              }
              shouldBypassCaptchaForAttempt(e3) {
                if (!e3.strategy) return false;
                const t3 = re.clerk.__unstable__environment.displayConfig.captchaOauthBypass;
                return !!t3.some(((t4) => t4 === e3.strategy)) || !(!e3.transfer || !t3.some(((e4) => e4 === re.clerk.client.signIn.firstFactorVerification.strategy)));
              }
            }
            class ie extends o2 {
              static async create(e3, t3 = {}) {
                const n3 = await o2._fetch({ path: e3, method: "POST", body: t3 });
                return new ie(n3, e3);
              }
              constructor(e3, t3) {
                super(), this.pathRoot = "tokens", this.getRawString = () => {
                  var e4;
                  return (null === (e4 = this.jwt) || void 0 === e4 ? void 0 : e4.claims.__raw) || "";
                }, t3 && (this.pathRoot = t3), (null == e3 ? void 0 : e3.jwt) && (this.jwt = (0, Z.D4)(e3.jwt));
              }
              fromJSON(e3) {
                return e3 ? (this.jwt = (0, Z.D4)(e3.jwt), this) : this;
              }
            }
            class oe extends o2 {
              constructor(e3) {
                super(), this.pathRoot = "/me", this.id = "", this.verified = false, this.updatedAt = null, this.createdAt = null, this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.secret = e3.secret, this.uri = e3.uri, this.verified = e3.verified, this.backupCodes = e3.backup_codes, this.updatedAt = c(e3.updated_at), this.createdAt = c(e3.created_at), this) : this;
              }
            }
            var ae = n2(8740);
            class se extends o2 {
              constructor(e3) {
                super(), this.pathRoot = "/me", this.codes = [], this.updatedAt = null, this.createdAt = null, this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.codes = e3.codes, this.updatedAt = c(e3.updated_at), this.createdAt = c(e3.created_at), this) : this;
              }
            }
            class ce extends o2 {
              static isUserResource(e3) {
                return !!e3 && e3 instanceof ce;
              }
              constructor(e3) {
                super(), this.pathRoot = "/me", this.id = "", this.externalId = null, this.username = null, this.emailAddresses = [], this.phoneNumbers = [], this.web3Wallets = [], this.externalAccounts = [], this.samlAccounts = [], this.organizationMemberships = [], this.passwordEnabled = false, this.firstName = null, this.lastName = null, this.fullName = null, this.primaryEmailAddressId = null, this.primaryEmailAddress = null, this.primaryPhoneNumberId = null, this.primaryPhoneNumber = null, this.primaryWeb3WalletId = null, this.primaryWeb3Wallet = null, this.profileImageUrl = "", this.imageUrl = "", this.hasImage = false, this.twoFactorEnabled = false, this.totpEnabled = false, this.backupCodeEnabled = false, this.publicMetadata = {}, this.unsafeMetadata = {}, this.createOrganizationEnabled = false, this.deleteSelfEnabled = false, this.lastSignInAt = null, this.updatedAt = null, this.createdAt = null, this.cachedSessionsWithActivities = null, this.isPrimaryIdentification = (e4) => {
                  switch (e4.constructor) {
                    case g:
                      return this.primaryEmailAddressId === e4.id;
                    case x:
                      return this.primaryPhoneNumberId === e4.id;
                    case ue:
                      return this.primaryWeb3WalletId === e4.id;
                    default:
                      return false;
                  }
                }, this.createEmailAddress = (e4) => {
                  const { email: t3 } = e4 || {};
                  return new g({ email_address: t3 }, this.path() + "/email_addresses/").create();
                }, this.createPhoneNumber = (e4) => {
                  const { phoneNumber: t3 } = e4 || {};
                  return new x({ phone_number: t3 }, this.path() + "/phone_numbers/").create();
                }, this.createWeb3Wallet = (e4) => {
                  const { web3Wallet: t3 } = e4 || {};
                  return new ue({ web3_wallet: t3 }, this.path() + "/web3_wallets/").create();
                }, this.createExternalAccount = async (e4) => {
                  var t3;
                  const { strategy: n3, redirectUrl: r3, additionalScopes: i3, redirect_url: a3 } = e4 || {};
                  a3 && (0, f.io)("redirect_url", "Use `redirectUrl` instead.");
                  const s3 = null === (t3 = await o2._fetch({ path: "/me/external_accounts", method: "POST", body: { strategy: n3, redirect_url: r3 || a3, additional_scope: i3 } })) || void 0 === t3 ? void 0 : t3.response;
                  return new O(s3, this.path() + "/external_accounts");
                }, this.createTOTP = async () => {
                  var e4;
                  const t3 = null === (e4 = await o2._fetch({ path: "/me/totp", method: "POST" })) || void 0 === e4 ? void 0 : e4.response;
                  return new oe(t3);
                }, this.verifyTOTP = async ({ code: e4 }) => {
                  var t3;
                  const n3 = null === (t3 = await o2._fetch({ path: "/me/totp/attempt_verification", method: "POST", body: { code: e4 } })) || void 0 === t3 ? void 0 : t3.response;
                  return new oe(n3);
                }, this.disableTOTP = async () => {
                  var e4;
                  const t3 = null === (e4 = await o2._fetch({ path: "/me/totp", method: "DELETE" })) || void 0 === e4 ? void 0 : e4.response;
                  return new h(t3);
                }, this.createBackupCode = async () => {
                  var e4;
                  const t3 = null === (e4 = await o2._fetch({ path: this.path() + "/backup_codes/", method: "POST" })) || void 0 === e4 ? void 0 : e4.response;
                  return new se(t3);
                }, this.update = (e4) => (e4.password && (0, f.io)("password", "This will be removed in the next major version. Please use `updatePassword(params)` instead."), this._basePatch({ body: ne(e4) })), this.updatePassword = (e4) => this._basePost({ body: e4, path: `${this.path()}/change_password` }), this.removePassword = (e4) => this._basePost({ body: e4, path: `${this.path()}/remove_password` }), this.delete = () => this._baseDelete({ path: "/me" }), this.getSessions = async () => {
                  if (this.cachedSessionsWithActivities) return this.cachedSessionsWithActivities;
                  const e4 = await Y.retrieve();
                  return this.cachedSessionsWithActivities = e4, e4;
                }, this.setProfileImage = (e4) => {
                  const { file: t3 } = e4 || {};
                  return null === t3 ? U.delete(`${this.path()}/profile_image`) : U.create(`${this.path()}/profile_image`, { file: t3 });
                }, this.getOrganizationInvitations = (e4) => le.retrieve(e4), this.getOrganizationSuggestions = (e4) => L.retrieve(e4), this.getOrganizationMemberships = (e4) => N.retrieve(e4), this.leaveOrganization = async (e4) => {
                  var t3;
                  const n3 = null === (t3 = await o2._fetch({ path: `${this.path()}/organization_memberships/${e4}`, method: "DELETE" })) || void 0 === t3 ? void 0 : t3.response;
                  return new h(n3);
                }, this.fromJSON(e3);
              }
              path() {
                return this.pathRoot;
              }
              get verifiedExternalAccounts() {
                return this.externalAccounts.filter(((e3) => {
                  var t3;
                  return "verified" == (null === (t3 = e3.verification) || void 0 === t3 ? void 0 : t3.status);
                }));
              }
              get unverifiedExternalAccounts() {
                return this.externalAccounts.filter(((e3) => {
                  var t3;
                  return "verified" != (null === (t3 = e3.verification) || void 0 === t3 ? void 0 : t3.status);
                }));
              }
              get hasVerifiedEmailAddress() {
                return this.emailAddresses.filter(((e3) => "verified" === e3.verification.status)).length > 0;
              }
              get hasVerifiedPhoneNumber() {
                return this.phoneNumbers.filter(((e3) => "verified" === e3.verification.status)).length > 0;
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.externalId = e3.external_id, this.firstName = e3.first_name, this.lastName = e3.last_name, (this.firstName || this.lastName) && (this.fullName = (0, ae.dS)({ firstName: this.firstName, lastName: this.lastName })), this.profileImageUrl = e3.profile_image_url, this.imageUrl = e3.image_url, this.hasImage = e3.has_image, this.username = e3.username, this.passwordEnabled = e3.password_enabled, this.emailAddresses = (e3.email_addresses || []).map(((e4) => new g(e4, this.path() + "/email_addresses"))), this.primaryEmailAddressId = e3.primary_email_address_id, this.primaryEmailAddress = this.emailAddresses.find((({ id: e4 }) => e4 === this.primaryEmailAddressId)) || null, this.phoneNumbers = (e3.phone_numbers || []).map(((e4) => new x(e4, this.path() + "/phone_numbers"))), this.primaryPhoneNumberId = e3.primary_phone_number_id, this.primaryPhoneNumber = this.phoneNumbers.find((({ id: e4 }) => e4 === this.primaryPhoneNumberId)) || null, this.web3Wallets = (e3.web3_wallets || []).map(((e4) => new ue(e4, this.path() + "/web3_wallets"))), this.primaryWeb3WalletId = e3.primary_web3_wallet_id, this.primaryWeb3Wallet = this.web3Wallets.find((({ id: e4 }) => e4 === this.primaryWeb3WalletId)) || null, this.externalAccounts = (e3.external_accounts || []).map(((e4) => new O(e4, this.path() + "/external_accounts"))), this.organizationMemberships = (e3.organization_memberships || []).map(((e4) => new N(e4))), this.samlAccounts = (e3.saml_accounts || []).map(((e4) => new j(e4, this.path() + "/saml_accounts"))), this.publicMetadata = e3.public_metadata, this.unsafeMetadata = e3.unsafe_metadata, this.totpEnabled = e3.totp_enabled, this.backupCodeEnabled = e3.backup_code_enabled, this.twoFactorEnabled = e3.two_factor_enabled, this.createOrganizationEnabled = e3.create_organization_enabled, this.deleteSelfEnabled = e3.delete_self_enabled, e3.last_sign_in_at && (this.lastSignInAt = c(e3.last_sign_in_at)), this.updatedAt = c(e3.updated_at), this.createdAt = c(e3.created_at), this) : this;
              }
            }
            (0, f.Lx)(ce, "profileImageUrl", "Use `imageUrl` instead.");
            class le extends o2 {
              static async retrieve(e3) {
                return await o2._fetch({ path: "/me/organization_invitations", method: "GET", search: C(e3) }).then(((e4) => {
                  const { data: t3, total_count: n3 } = null == e4 ? void 0 : e4.response;
                  return { total_count: n3, data: t3.map(((e5) => new le(e5))) };
                })).catch((() => ({ total_count: 0, data: [] })));
              }
              constructor(e3) {
                super(), this.publicMetadata = {}, this.accept = async () => await this._basePost({ path: `/me/organization_invitations/${this.id}/accept` }), this.fromJSON(e3);
              }
              fromJSON(e3) {
                return e3 && (this.id = e3.id, this.emailAddress = e3.email_address, this.publicOrganizationData = { hasImage: e3.public_organization_data.has_image, imageUrl: e3.public_organization_data.image_url, name: e3.public_organization_data.name, id: e3.public_organization_data.id, slug: e3.public_organization_data.slug }, this.publicMetadata = e3.public_metadata, this.role = e3.role, this.status = e3.status, this.createdAt = c(e3.created_at), this.updatedAt = c(e3.updated_at)), this;
              }
            }
            class ue extends o2 {
              constructor(e3, t3) {
                super(), this.web3Wallet = "", this.prepareVerification = (e4) => this._basePost({ action: "prepare_verification", body: { ...e4 } }), this.attemptVerification = (e4) => {
                  const { signature: t4, generateSignature: n3 } = e4 || {};
                  return n3 && (0, f.io)("generateSignature", "Use signature field instead."), t4 ? this._basePost({ action: "attempt_verification", body: { signature: t4 } }) : ("function" != typeof n3 && (0, i2.pV)("generateSignature"), (async () => {
                    "function" != typeof n3 && (0, i2.pV)("generateSignature");
                    const { nonce: e5 } = this.verification;
                    e5 || (0, i2.Rj)("SignUp");
                    const t5 = await n3({ identifier: this.web3Wallet, nonce: e5 });
                    return this._basePost({ action: "attempt_verification", body: { signature: t5 } });
                  })());
                }, this.pathRoot = t3, this.fromJSON(e3);
              }
              create() {
                return this._basePost({ body: { web3_wallet: this.web3Wallet } });
              }
              destroy() {
                return this._baseDelete();
              }
              toString() {
                return this.web3Wallet;
              }
              fromJSON(e3) {
                return e3 ? (this.id = e3.id, this.web3Wallet = e3.web3_wallet, this.verification = new S(e3.verification), this) : this;
              }
            }
          }, 5864: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { A: function() {
              return r2;
            } });
            const r2 = { cannotRenderComponentWhenSessionExists: "The <SignUp/> and <SignIn/> components cannot render when a user is already signed in, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, Clerk is redirecting to the Home URL instead.", cannotRenderComponentWhenUserDoesNotExist: "<UserProfile/> cannot render unless a user is signed in. Since no user is signed in, Clerk is redirecting to the Home URL instead. (This notice only appears in development.)", cannotRenderComponentWhenOrgDoesNotExist: "<OrganizationProfile/> cannot render unless an organization is active. Since no organization is currently active, Clerk is redirecting to the Home URL instead.", cannotOpenOrgProfile: "The OrganizationProfile cannot render unless an organization is active. Since no organization is currently active, this is no-op.", cannotOpenUserProfile: "The UserProfile modal cannot render unless a user is signed in. Since no user is signed in, this is no-op.", cannotOpenSignUpOrSignUp: "The SignIn or SignUp modals do not render when a user is already signed in, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, this is no-op." };
            for (const i2 of Object.keys(r2)) r2[i2] = `\u{1F512} Clerk:
${r2[i2].trim()}
(This notice only appears in development)`;
          }, 2797: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { x: function() {
              return a2;
            } });
            var r2 = n2(4041), i2 = n2(6480), o2 = n2(5098);
            const a2 = () => {
              const [e3, t3] = r2.useState({ startPath: "", path: "", componentName: "", socialProvider: "" }), n3 = (0, o2.FP)();
              r2.useLayoutEffect((() => {
                n3 && t3(n3);
              }), []);
              const a3 = () => {
                t3({ startPath: "", path: "", componentName: "", socialProvider: "" });
              };
              return { urlStateParam: { ...e3, clearUrlStateParam: a3 }, decodedRedirectParams: n3, clearUrlStateParam: a3, removeQueryParam: () => (0, o2.rw)(i2.CL) };
            };
          }, 5547: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { A: function() {
              return r2;
            } });
            const r2 = ({ signUp: e3, verifyEmailPath: t3, verifyPhonePath: n3, navigate: r3, handleComplete: i2, redirectUrl: o2 = "", redirectUrlComplete: a2 = "" }) => {
              var s2, c;
              if ("complete" === e3.status) return i2 && i2();
              if ("missing_requirements" === e3.status) {
                if (e3.missingFields.some(((e4) => "saml" === e4))) return e3.authenticateWithRedirect({ strategy: "saml", redirectUrl: o2, redirectUrlComplete: a2, continueSignUp: true });
                if ((null === (s2 = e3.unverifiedFields) || void 0 === s2 ? void 0 : s2.includes("email_address")) && t3) return r3(t3);
                if ((null === (c = e3.unverifiedFields) || void 0 === c ? void 0 : c.includes("phone_number")) && n3) return r3(n3);
              }
            };
          }, 8391: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { Wl: function() {
              return o2;
            }, yi: function() {
              return l;
            }, NQ: function() {
              return i2;
            } });
            var r2 = n2(600);
            const i2 = (e3) => {
              const t3 = e3.__unstable__environment, n3 = (0, r2.A)(e3), i3 = t3 ? t3.displayConfig.captchaProvider : "turnstile";
              return { captchaSiteKey: t3 ? t3.displayConfig.captchaPublicKey : null, captchaWidgetType: t3 ? t3.displayConfig.captchaWidgetType : null, captchaProvider: i3, captchaPublicKeyInvisible: t3 ? t3.displayConfig.captchaPublicKeyInvisible : null, canUseCaptcha: t3 ? t3.userSettings.signUp.captcha_enabled && e3.isStandardBrowser : null, captchaURL: n3.buildUrl({ path: "cloudflare/turnstile/v0/api.js", pathPrefix: "", search: "?render=explicit" }).toString() };
            }, o2 = "clerk-captcha", a2 = "clerk-invisible-captcha";
            var s2 = n2(8643);
            const c = async (e3) => {
              const { siteKey: t3, scriptUrl: n3, widgetType: r3, invisibleSiteKey: i3 } = e3;
              let c2 = "", l2 = "", u = !r3 || "invisible" === r3, d = t3, h = null;
              const f = () => {
                const e4 = document.createElement("div");
                return e4.classList.add(a2), document.body.appendChild(e4), e4;
              }, p = await (async function(e4) {
                return window.turnstile || await (async function() {
                  try {
                    return await (0, s2.k)("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", { defer: true });
                  } catch (e5) {
                    throw console.warn("Clerk: Failed to load the CAPTCHA script from Cloudflare. If you see a CSP error in your browser, please add the necessary CSP rules to your app. Visit https://clerk.com/docs/security/clerk-csp for more information."), e5;
                  }
                })().catch((() => (async function(e5) {
                  try {
                    return await (0, s2.k)(e5, { defer: true });
                  } catch (t4) {
                    throw console.error("Clerk: Failed to load the CAPTCHA script from the URL: ", e5), t4;
                  }
                })(e4))).catch((() => {
                  throw { captchaError: "captcha_script_failed_to_load" };
                })), window.turnstile;
              })(n3);
              let m = 0;
              const g = [];
              try {
                [c2, l2] = await new Promise(((e4, t4) => {
                  try {
                    if (u) h = f();
                    else {
                      const e5 = document.getElementById(o2);
                      e5 ? h = e5 : (console.error("Captcha DOM element not found. Using invisible captcha widget."), h = f(), u = true, d = i3);
                    }
                    const n4 = p.render(u ? `.${a2}` : `#${o2}`, { sitekey: d, appearance: "interaction-only", retry: "never", "refresh-expired": "auto", callback: function(t5) {
                      e4([t5, n4]);
                    }, "before-interactive-callback": () => {
                      const e5 = document.getElementById(o2);
                      e5 && (e5.style.maxHeight = "unset", e5.style.minHeight = "68px", e5.style.marginBottom = "1.5rem");
                    }, "error-callback": function(e5) {
                      g.push(e5), m < 2 && ((e6) => !!["crashed", "undefined_error", "102", "103", "104", "106", "110600", "300", "600"].find(((t5) => e6.startsWith(t5))))(e5.toString()) ? setTimeout((() => {
                        p.reset(n4), m++;
                      }), 250) : t4([g.join(","), n4]);
                    }, "unsupported-callback": function() {
                      return t4(["This browser is not supported by the CAPTCHA.", n4]), true;
                    } });
                  } catch (n4) {
                    t4([n4, void 0]);
                  }
                })), p.remove(l2);
              } catch ([y, l3]) {
                throw l3 && p.remove(l3), { captchaError: y };
              } finally {
                h && (u ? document.body.removeChild(h) : (h.style.maxHeight = "0", h.style.minHeight = "unset", h.style.marginBottom = "unset"));
              }
              return { captchaToken: c2, captchaWidgetTypeUsed: u ? "invisible" : "smart" };
            }, l = (e3) => {
              const { captchaProvider: t3, ...n3 } = e3;
              return c(n3);
            };
          }, 4927: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { hI: function() {
              return i2;
            }, rw: function() {
              return o2;
            } });
            var r2 = n2(6480);
            function i2(e3) {
              return new URL(window.location.href).searchParams.get(e3) || null;
            }
            function o2(e3) {
              const t3 = new URL(window.location.href);
              t3.searchParams.has(e3) && (t3.searchParams.delete(e3), window.history.replaceState(window.history.state, "", t3));
            }
            r2.rt, r2.MC;
          }, 5098: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { F1: function() {
              return Y;
            }, $7: function() {
              return l.$7;
            }, jk: function() {
              return V;
            }, k: function() {
              return te;
            }, DG: function() {
              return S;
            }, kZ: function() {
              return l.kZ;
            }, cL: function() {
              return D;
            }, T0: function() {
              return i2;
            }, J4: function() {
              return b;
            }, AL: function() {
              return w;
            }, wO: function() {
              return j;
            }, D4: function() {
              return T;
            }, Fm: function() {
              return k;
            }, sb: function() {
              return A;
            }, l: function() {
              return Z.l;
            }, hI: function() {
              return U.hI;
            }, aC: function() {
              return _;
            }, $1: function() {
              return Z.$;
            }, vA: function() {
              return B.v;
            }, rM: function() {
              return l.rM;
            }, tL: function() {
              return l.tL;
            }, ez: function() {
              return E;
            }, Z$: function() {
              return q;
            }, M: function() {
              return J;
            }, zU: function() {
              return G;
            }, V0: function() {
              return l.V0;
            }, px: function() {
              return re;
            }, zi: function() {
              return l.zi;
            }, DY: function() {
              return l.DY;
            }, bJ: function() {
              return O;
            }, l1: function() {
              return l.l1;
            }, AY: function() {
              return l.AY;
            }, yR: function() {
              return l.yR;
            }, FW: function() {
              return s2;
            }, vV: function() {
              return a2;
            }, yY: function() {
              return l.yY;
            }, VH: function() {
              return ee;
            }, FP: function() {
              return W;
            }, rw: function() {
              return U.rw;
            }, AC: function() {
              return l.AC;
            }, Mo: function() {
              return $;
            }, gm: function() {
              return x;
            }, QP: function() {
              return o2;
            }, FV: function() {
              return l.FV;
            }, Z0: function() {
              return l.Z0;
            }, Xz: function() {
              return l.Xz;
            }, iD: function() {
              return l.iD;
            }, Kj: function() {
              return l.Kj;
            }, RA: function() {
              return R;
            }, y7: function() {
              return r2.y;
            } });
            var r2 = n2(3132);
            const i2 = () => {
              let e3 = false;
              const t3 = () => e3 = true;
              return { startTracking: () => {
                window.addEventListener("beforeunload", t3), window.addEventListener(r2.t, t3);
              }, stopTracking: () => {
                window.removeEventListener("beforeunload", t3), window.removeEventListener(r2.t, t3);
              }, isUnloading: () => e3 };
            }, o2 = (e3, t3) => !(!e3.session || !(null == t3 ? void 0 : t3.authConfig.singleSessionMode)), a2 = (e3) => !e3.user, s2 = (e3) => !e3.organization;
            var c = n2(7643), l = n2(7661);
            function u(e3) {
              for (var t3 = 1; t3 < arguments.length; t3++) {
                var n3 = arguments[t3];
                for (var r3 in n3) e3[r3] = n3[r3];
              }
              return e3;
            }
            n2(3195);
            var d = (function e3(t3, n3) {
              function r3(e4, r4, i3) {
                if ("undefined" != typeof document) {
                  "number" == typeof (i3 = u({}, n3, i3)).expires && (i3.expires = new Date(Date.now() + 864e5 * i3.expires)), i3.expires && (i3.expires = i3.expires.toUTCString()), e4 = encodeURIComponent(e4).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
                  var o3 = "";
                  for (var a3 in i3) i3[a3] && (o3 += "; " + a3, true !== i3[a3] && (o3 += "=" + i3[a3].split(";")[0]));
                  return document.cookie = e4 + "=" + t3.write(r4, e4) + o3;
                }
              }
              return Object.create({ set: r3, get: function(e4) {
                if ("undefined" != typeof document && (!arguments.length || e4)) {
                  for (var n4 = document.cookie ? document.cookie.split("; ") : [], r4 = {}, i3 = 0; i3 < n4.length; i3++) {
                    var o3 = n4[i3].split("="), a3 = o3.slice(1).join("=");
                    try {
                      var s3 = decodeURIComponent(o3[0]);
                      if (r4[s3] = t3.read(a3, s3), e4 === s3) break;
                    } catch (c2) {
                    }
                  }
                  return e4 ? r4[e4] : r4;
                }
              }, remove: function(e4, t4) {
                r3(e4, "", u({}, t4, { expires: -1 }));
              }, withAttributes: function(t4) {
                return e3(this.converter, u({}, this.attributes, t4));
              }, withConverter: function(t4) {
                return e3(u({}, this.converter, t4), this.attributes);
              } }, { attributes: { value: Object.freeze(n3) }, converter: { value: Object.freeze(t3) } });
            })({ read: function(e3) {
              return '"' === e3[0] && (e3 = e3.slice(1, -1)), e3.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
            }, write: function(e3) {
              return encodeURIComponent(e3).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
            } }, { path: "/" }), h = d;
            function f(e3) {
              return { get() {
                return h.get(e3);
              }, set(t3, n3 = {}) {
                return h.set(e3, t3, n3);
              }, remove(t3) {
                h.remove(e3, t3);
              } };
            }
            const p = f("__client"), m = f("__client_uat"), g = f(c.Ss), y = f("__initted"), v = f("__session"), b = () => {
              const e3 = p;
              return { getDevBrowserInittedCookie: () => y.get(), setDevBrowserInittedCookie: () => y.set("1", { expires: (0, c.e7)(Date.now(), 1), sameSite: G() ? "None" : "Lax", secure: !!G() || void 0, path: "/" }), setSessionCookie: (e4) => {
                const t3 = (0, c.e7)(Date.now(), 1), n3 = G() ? "None" : "Lax", r3 = G() || "https:" === window.location.protocol;
                return v.set(e4, { expires: t3, sameSite: n3, secure: r3 });
              }, getClientUatCookie: () => parseInt(m.get() || "0", 10), setClientUatCookie: (e4) => {
                const t3 = (0, c.e7)(Date.now(), 1), n3 = G() ? "None" : "strict", r3 = G() || "https:" === window.location.protocol;
                let i3 = "0";
                return e4 && e4.updatedAt && e4.activeSessions.length > 0 && (i3 = Math.floor(e4.updatedAt.getTime() / 1e3).toString()), m.set(i3, { expires: t3, sameSite: n3, secure: r3 });
              }, removeSessionCookie: () => v.remove(), removeAllDevBrowserCookies: () => {
                y.remove({ path: "/" }), (0, l.Ux)().forEach(((t3) => e3.remove({ domain: t3, path: "/" })));
              }, setDevBrowserCookie: (e4) => {
                const t3 = (0, c.e7)(Date.now(), 1), n3 = G() ? "None" : "Lax", r3 = G() || "https:" === window.location.protocol;
                return g.set(e4, { expires: t3, sameSite: n3, secure: r3 });
              }, getDevBrowserCookie: () => g.get(), removeDevBrowserCookie: () => g.remove() };
            }, w = ({ regex: e3 }) => ({ urlWithParam: t3, entity: n3 }) => {
              const r3 = e3.exec(t3);
              if (r3) {
                const e4 = r3[1];
                if (e4 in n3) {
                  const i3 = n3[e4];
                  return t3.replace(r3[0], i3);
                }
              }
              return t3;
            };
            function _(e3) {
              const t3 = new URL(e3), n3 = (0, c.HR)(t3), r3 = (0, c.Lm)(t3), i3 = n3 || r3;
              return i3 && void 0 !== globalThis.history && globalThis.history.replaceState(null, "", t3.href), i3;
            }
            function S({ localPart: e3, frontendApi: t3 }) {
              return `${e3}@${t3 ? t3.replace("clerk.", "") : "clerk.dev"}`;
            }
            function k(e3) {
              return n2.g.btoa(e3);
            }
            function P(e3) {
              return (function(e4) {
                return decodeURIComponent(n2.g.atob(e4).split("").map(((e5) => "%" + ("00" + e5.charCodeAt(0).toString(16)).slice(-2))).join(""));
              })(e3.replace(/_/g, "/").replace(/-/g, "+"));
            }
            function O(e3, t3 = "") {
              return e3.errors && !!e3.errors.find(((e4) => e4.code === t3));
            }
            const A = (0, n2(9859)._r)({ packageName: "@clerk/clerk-js" });
            var U = n2(4927);
            function x({ src: e3, eventOrigin: t3 }) {
              return new Promise(((n3, r3) => {
                const i3 = document.createElement("div");
                i3.setAttribute("style", "display: none; position: fixed; z-index: 2147483646; background-color: rgba(100,100,100,0.8); top: 0; left: 0; bottom: 0; right: 0;");
                const o3 = document.createElement("iframe");
                o3.src = e3, o3.setAttribute("style", "display: none; position: fixed; z-index: 2147483647; border-radius: 32px; width: 600px; height: 500px; left: 50%; top: 50%; transform: translate(-50%, -50%); border: 0; outline: 0; background-color: white; box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);");
                const a3 = ["allow-same-origin", "allow-scripts", "allow-top-navigation"];
                function s3() {
                  null == i3 || i3.remove(), null == o3 || o3.remove(), window.removeEventListener("message", c2, false);
                }
                function c2(e4) {
                  e4.origin == t3 && (e4.data.error ? (s3(), r3(e4.data.error)) : e4.data.showFrame ? (o3.style.display = "block", i3.style.display = "block") : (s3(), n3(e4.data)));
                }
                "function" == typeof document.requestStorageAccess && a3.push("allow-storage-access-by-user-activation"), o3.setAttribute("sandbox", a3.join(" ")), window.addEventListener("message", c2, false), document.body.appendChild(i3), document.body.appendChild(o3);
              }));
            }
            const C = (e3) => !!e3 && "object" == typeof e3 && "target" in e3 && "currentTarget" in e3 && "preventDefault" in e3;
            function E(e3, t3 = {}) {
              if (!(t3.requireType && typeof e3 !== t3.requireType || C(e3))) return e3;
            }
            const I = /^clerk\.([\w|-]+\.){2,4}(dev|com)$/i, M = /^clerk(\.[A-Z0-9_-]{1,256}){2,}$/i;
            function R(e3) {
              return !!e3 && ((0, l.DY)(e3) ? I.test(e3) : M.test(e3));
            }
            var z = n2(7780);
            function T(e3) {
              const t3 = (e3 || "").split("."), [n3, r3, i3] = t3;
              if (3 !== t3.length || !n3 || !r3 || !i3) throw new Error("JWT could not be decoded");
              const o3 = JSON.parse(P(r3)), a3 = { __raw: e3 };
              Object.keys(o3).forEach(((e4) => {
                a3[e4] = o3[e4];
              }));
              const s3 = { encoded: { header: n3, payload: r3, signature: i3 }, header: JSON.parse(P(n3)), claims: a3 };
              return (0, z.W1)(s3, "orgs", 'Add orgs to your session token using the "user.organizations" shortcode in JWT Templates instead.', "decode:orgs"), s3;
            }
            var N = n2(8521);
            const L = () => {
            }, j = () => {
              if (!(0, N.M)()) return { isUnloading: L, onPageVisible: L };
              const e3 = { "visibilitychange:visible": [] };
              return document.addEventListener("visibilitychange", (() => {
                "visible" === document.visibilityState && e3["visibilitychange:visible"].forEach(((e4) => e4()));
              })), { onPageVisible: (t3) => {
                e3["visibilitychange:visible"].push(t3);
              } };
            };
            function $(e3) {
              return "function" == typeof e3 ? e3() : e3;
            }
            n2(5792);
            var F = n2(6480);
            const D = ({ base: e3, path: t3 }) => t3 ? e3 + t3 : e3, W = () => {
              var e3;
              const t3 = null !== (e3 = (0, U.hI)(F.CL)) && void 0 !== e3 ? e3 : "";
              return t3 ? JSON.parse(atob(t3)) : null;
            }, V = ({ url: e3, startPath: t3 = "/user", currentPath: n3 = "", componentName: r3, socialProvider: i3 = "" }) => {
              const o3 = { path: n3.replace(/CLERK-ROUTER\/VIRTUAL\/.*\//, "") || "", componentName: r3, startPath: t3, socialProvider: i3 }, a3 = k(JSON.stringify(o3)), s3 = new URL(e3), c2 = s3.searchParams;
              return c2.set(F.CL, a3), s3.search = c2.toString(), s3.toString();
            };
            var B = n2(1630);
            function J() {
              return void 0 !== globalThis.document;
            }
            function q() {
              return J() && globalThis.document.hasFocus();
            }
            function G() {
              return J() && window.self !== window.top && !("undefined" != typeof window && void 0 !== window.Cypress) && !window.frameElement && J() && "https:" === window.location.protocol;
            }
            var H = n2(3011), K = n2.n(H);
            function Y(e3) {
              const t3 = new (K())();
              return window.addEventListener("beforeunload", (async () => {
                await t3.releaseLock(e3);
              })), { acquireLockAndRun: async (n3) => {
                if (await t3.acquireLock(e3, 5e3)) try {
                  return await n3();
                } finally {
                  await t3.releaseLock(e3);
                }
              } };
            }
            var Z = n2(1783), Q = n2(5810), X = n2.n(Q);
            const ee = (e3, { ctx: t3, queryParams: n3, displayConfig: r3, options: i3 }, o3 = true) => {
              const a3 = (0, c.C8)(e3), s3 = null == n3 ? void 0 : n3[a3], u2 = "string" == typeof s3 ? s3 : void 0, d2 = o3 && "string" == typeof (null == n3 ? void 0 : n3.redirect_url) ? n3.redirect_url : void 0;
              let h2;
              u2 && (0, l.Dp)(u2, null == i3 ? void 0 : i3.allowedRedirectOrigins) ? h2 = u2 : d2 && (0, l.Dp)(d2, null == i3 ? void 0 : i3.allowedRedirectOrigins) && (h2 = d2);
              const f2 = h2 || (null == t3 ? void 0 : t3[e3]) || (o3 ? null == t3 ? void 0 : t3.redirectUrl : void 0) || (null == i3 ? void 0 : i3[e3]) || (null == r3 ? void 0 : r3[e3]);
              return !(0, l.AY)(f2, { includeRelativeUrls: true }) || (0, l.RF)(f2) ? "" : f2;
            }, te = (e3) => {
              const t3 = (t4) => {
                const n4 = e3[t4];
                if (n4 && n4 !== e3.displayConfig[t4]) return n4.startsWith("/") ? window.location.origin + n4 : n4;
              }, n3 = t3("afterSignInUrl"), r3 = t3("afterSignUpUrl"), i3 = {};
              return n3 && n3 === r3 ? i3.redirect_url = n3 : (r3 && (i3.after_sign_up_url = r3), n3 && (i3.after_sign_in_url = n3)), 0 === Object.keys(i3).length ? null : X().stringify(i3);
            };
            var ne = n2(1777);
            const re = (e3) => {
              if ((e3 || "").includes("gravatar") || (e3 || "").includes("avatar_placeholder")) return true;
              try {
                const t3 = new URL(e3).pathname.replace("/", ""), n3 = (0, ne.y)(t3);
                return "default" === JSON.parse(n3).type;
              } catch {
                return false;
              }
            };
          }, 9961: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { G: function() {
              return i2;
            } });
            var r2 = n2(7643);
            const i2 = (e3, t3) => {
              const { onValidation: i3 = r2.lQ, onValidationComplexity: o2 = r2.lQ } = t3 || {}, { show_zxcvbn: a2, validatePassword: s2 } = e3, c = /* @__PURE__ */ ((e4) => (t4) => ((e5, t5) => {
                const { max_length: n3, min_length: r3, require_special_char: i4, require_lowercase: o3, require_numbers: a3, require_uppercase: s3 } = t5, c2 = ((e6) => {
                  let t6;
                  if (e6.allowed_special_characters) {
                    let n4 = e6.allowed_special_characters.replace("[", "\\[");
                    n4 = n4.replace("]", "\\]"), t6 = new RegExp(`[${n4}]`);
                  } else t6 = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;
                  return (e7, { minLength: n4, maxLength: r4 }) => ({ max_length: e7.length < r4, min_length: e7.length >= n4, require_numbers: /\d/.test(e7), require_lowercase: /[a-z]/.test(e7), require_uppercase: /[A-Z]/.test(e7), require_special_char: t6.test(e7) });
                })(t5), l2 = c2(e5, { maxLength: t5.max_length, minLength: t5.min_length }), u2 = { max_length: n3, min_length: r3, require_special_char: i4, require_lowercase: o3, require_numbers: a3, require_uppercase: s3 }, d = /* @__PURE__ */ new Map();
                for (const h in u2) {
                  const e6 = h;
                  u2[e6] && (l2[e6] || d.set(e6, true));
                }
                return Object.freeze(Object.fromEntries(d));
              })(t4, e4))(e3), l = (({ min_zxcvbn_strength: e4, onResult: t4 }) => (n3) => (r3) => {
                const i4 = n3(r3);
                return null == t4 || t4(i4), i4.score >= e4 && i4.score < 3 ? { state: "pass", keys: ["unstable__errors.zxcvbn.couldBeStronger"], result: i4 } : i4.score >= e4 ? { state: "excellent", result: i4 } : { state: "fail", keys: ["unstable__errors.zxcvbn.notEnough", ...i4.feedback.suggestions.map(((e5) => `unstable__errors.zxcvbn.suggestions.${e5}`))], result: i4 };
              })(e3);
              let u = {};
              return (e4, t4) => {
                const { onValidation: r3 = i3, onValidationComplexity: d = o2 } = t4 || {};
                if (!s2) return;
                const h = c(e4);
                d(0 === Object.keys(h).length), u = { ...u, complexity: h }, a2 && Promise.all([Promise.all([n2.e(592), n2.e(96)]).then(n2.bind(n2, 1533)), n2.e(128).then(n2.bind(n2, 1206))]).then((([e5, t5]) => {
                  const { zxcvbnOptions: n3, zxcvbn: r4 } = e5, { dictionary: i4, adjacencyGraphs: o3 } = t5;
                  return n3.setOptions({ dictionary: { ...i4 }, graphs: o3 }), r4;
                })).then(((t5) => {
                  const n3 = l(t5)(e4);
                  u = { ...u, strength: n3 }, r3({ ...u, strength: n3 });
                })), u.complexity && 0 === Object.keys(u.complexity).length && a2 || r3(u);
              };
            };
          }, 5792: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { H: function() {
              return o2;
            } });
            const r2 = "/", i2 = new RegExp(r2 + "{1,}", "g");
            function o2(e3, t3) {
              return [e3, t3].filter(((e4) => e4)).join(r2).replace(i2, r2);
            }
          }, 1630: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { v: function() {
              return o2;
            } });
            var r2 = n2(5810), i2 = n2.n(r2);
            const o2 = (e3) => i2().parse(e3 || "", { ignoreQueryPrefix: true });
          }, 7661: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { $7: function() {
              return _;
            }, kZ: function() {
              return m;
            }, Ux: function() {
              return p;
            }, RF: function() {
              return O;
            }, rM: function() {
              return S;
            }, tL: function() {
              return A;
            }, Dp: function() {
              return z;
            }, V0: function() {
              return P;
            }, zi: function() {
              return f;
            }, DY: function() {
              return d;
            }, l1: function() {
              return I;
            }, AY: function() {
              return k;
            }, yR: function() {
              return U;
            }, yY: function() {
              return x;
            }, AC: function() {
              return M;
            }, FV: function() {
              return y;
            }, Z0: function() {
              return w;
            }, Xz: function() {
              return g;
            }, iD: function() {
              return b;
            }, Kj: function() {
              return v;
            } });
            var r2 = n2(7643), i2 = (n2(3195), n2(2580)), o2 = n2(5792), a2 = n2(1630);
            const s2 = "http://clerk-dummy", c = [".lcl.dev", ".lclstage.dev", ".lclclerk.com"], l = [".accounts.dev", ".accountsstage.dev", ".accounts.lclclerk.com"], u = ["javascript:"], { isDevOrStagingUrl: d } = (0, r2.RZ)(), h = /* @__PURE__ */ new Map();
            function f(e3 = window.location.hostname) {
              if (!e3) return false;
              let t3 = h.get(e3);
              var n3;
              return void 0 === t3 && (n3 = e3, t3 = c.some(((e4) => n3.startsWith("accounts.") && n3.endsWith(e4))) || (function(e4) {
                return l.some(((t4) => e4.endsWith(t4) && !e4.endsWith(".clerk" + t4)));
              })(e3), h.set(e3, t3)), t3;
            }
            function p(e3 = window.location.hostname) {
              const t3 = e3.split("."), n3 = [], r3 = [];
              for (let i3 = t3.length - 1; i3 > 0; i3--) n3.unshift(t3[i3]), r3.push(n3.join("."));
              return r3;
            }
            function m(e3, t3 = {}) {
              const { base: n3, hashPath: r3, hashSearch: i3, searchParams: c2, ...l2 } = e3;
              let u2 = "";
              u2 = "undefined" != typeof window && window.location ? window.location.href : "http://react-native-fake-base-url";
              const d2 = new URL(n3 || "", u2);
              if (c2 instanceof URLSearchParams && c2.forEach(((e4, t4) => {
                d2.searchParams.set(t4, e4);
              })), Object.assign(d2, l2), r3 || i3) {
                const e4 = new URL(s2 + d2.hash.substring(1));
                e4.pathname = (0, o2.H)(e4.pathname, r3 || "");
                const t4 = (0, a2.v)(i3 || "");
                for (const [r4, i4] of Object.entries(t4)) e4.searchParams.append(r4, i4);
                const n4 = e4.href.replace(s2, "");
                d2.hash = n4;
              }
              const { stringify: h2, skipOrigin: f2 } = t3;
              return h2 ? f2 ? d2.href.replace(d2.origin, "") : d2.href : d2;
            }
            function g(e3) {
              return new URL(e3.toString(), window.location.origin);
            }
            function y(e3) {
              return (e3 = g(e3)).href.replace(e3.origin, "");
            }
            const v = (e3) => (e3 || "").replace(/\/+$/, ""), b = (e3) => (e3 || "").replace(/^\/+/, ""), w = (e3, t3) => t3.origin === e3.origin ? y(e3) : `${e3}`, _ = (e3, t3 = {}) => {
              const n3 = g(e3), i3 = new URLSearchParams();
              for (const [o3, a3] of Object.entries(t3)) a3 && i3.append((0, r2.C8)(o3), a3);
              return `${n3}${i3.toString() ? "#/?" + i3.toString() : ""}`;
            }, S = (e3) => {
              const { externalAccount: t3 } = e3.verifications;
              return !!t3.error;
            };
            function k(e3, t3) {
              const { includeRelativeUrls: n3 = false } = t3 || {};
              if (!e3 && !n3) return false;
              try {
                return new URL(e3, n3 ? s2 : void 0), true;
              } catch (r3) {
                return false;
              }
            }
            function P(e3) {
              return !!k(e3) && "data:" === new URL(e3).protocol;
            }
            function O(e3) {
              if (!k(e3)) return false;
              const t3 = new URL(e3).protocol;
              return u.some(((e4) => e4 === t3));
            }
            const A = (e3) => new URL(e3, s2).hash.startsWith("#/"), U = (e3) => {
              const t3 = new URL(e3);
              if (!A(t3)) return t3;
              const n3 = new URL(t3.hash.replace("#/", "/"), t3.href), r3 = [t3.pathname, n3.pathname].map(((e4) => e4.split("/"))).flat().filter(Boolean).join("/"), i3 = new URL(r3, t3.origin);
              return t3.searchParams.forEach(((e4, t4) => {
                i3.searchParams.set(t4, e4);
              })), n3.searchParams.forEach(((e4, t4) => {
                i3.searchParams.set(t4, e4);
              })), i3;
            }, x = (e3) => e3.replace(/CLERK-ROUTER\/(.*?)\//, ""), C = ["/oauth/authorize"], E = ["/v1/verify", "/v1/tickets/accept"];
            function I(e3, t3) {
              const n3 = new URL(t3, s2), r3 = n3.pathname, i3 = C.includes(r3) || E.includes(r3);
              return e3 === n3.host && i3;
            }
            function M(e3) {
              const t3 = new URL(e3, s2);
              return C.includes(t3.pathname);
            }
            const R = [/\0/, /^\/\//, /[\x00-\x1F]/], z = (e3, t3) => {
              const n3 = window.location.origin, r3 = "string" == typeof e3 ? (function(e4, t4) {
                try {
                  return new URL(e4);
                } catch (n4) {
                  return new URL(e4, t4);
                }
              })(e3, n3) : e3;
              if (!t3) return true;
              const o3 = n3 === r3.origin, a3 = !(function(e4) {
                if (O(e4)) return true;
                for (const t4 of R) if (t4.test(e4.pathname)) return true;
                return false;
              })(r3) && (o3 || t3.map(((e4) => "string" == typeof e4 ? ((e5) => {
                try {
                  return i2(e5);
                } catch (t4) {
                  throw new Error(`Invalid pattern: ${e5}.
Consult the documentation of glob-to-regexp here: https://www.npmjs.com/package/glob-to-regexp.
${t4.message}`);
                }
              })(v(e4)) : e4)).some(((e4) => e4.test(v(r3.origin)))));
              return a3 || console.warn(`Clerk: Redirect URL ${r3} is not on one of the allowedRedirectOrigins, falling back to the default redirect URL.`), a3;
            };
          }, 8740: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { Cm: function() {
              return o2;
            }, IM: function() {
              return i2;
            }, dS: function() {
              return r2;
            } });
            const r2 = ({ firstName: e3, lastName: t3, name: n3 }) => n3 || [e3, t3].join(" ").trim() || "", i2 = ({ firstName: e3, lastName: t3, name: n3 }) => [(e3 || "")[0], (t3 || "")[0]].join("").trim() || (n3 || "")[0], o2 = (e3) => e3.username ? e3.username : e3.primaryEmailAddress ? e3.primaryEmailAddress.emailAddress : e3.primaryPhoneNumber ? e3.primaryPhoneNumber.phoneNumber : e3.primaryWeb3Wallet ? e3.primaryWeb3Wallet.web3Wallet : "";
          }, 1783: function(e2, t2, n2) {
            "use strict";
            async function r2() {
              if (!n2.g.ethereum) return "";
              const e3 = await n2.g.ethereum.request({ method: "eth_requestAccounts" });
              return e3 && e3[0] || "";
            }
            async function i2({ identifier: e3, nonce: t3 }) {
              return n2.g.ethereum ? await n2.g.ethereum.request({ method: "personal_sign", params: [`0x${r3 = t3, r3.split("").map(((e4) => e4.charCodeAt(0).toString(16).padStart(2, "0"))).join("")}`, e3] }) : "";
              var r3;
            }
            n2.d(t2, { l: function() {
              return i2;
            }, $: function() {
              return r2;
            } });
          }, 3132: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { t: function() {
              return r2;
            }, y: function() {
              return i2;
            } });
            const r2 = "clerk:beforeunload";
            function i2(e3) {
              let t3 = new URL(e3, window.location.href);
              "http:" !== t3.protocol && "https:" !== t3.protocol && (console.warn("Clerk: Not a valid protocol. Redirecting to /"), t3 = new URL("/", window.location.href)), window.dispatchEvent(new CustomEvent(r2)), window.location.href = t3.href;
            }
          }, 4026: function(e2, t2, n2) {
            "use strict";
            var r2 = n2(4041), i2 = "function" == typeof Object.is ? Object.is : function(e3, t3) {
              return e3 === t3 && (0 !== e3 || 1 / e3 == 1 / t3) || e3 != e3 && t3 != t3;
            }, o2 = r2.useState, a2 = r2.useEffect, s2 = r2.useLayoutEffect, c = r2.useDebugValue;
            function l(e3) {
              var t3 = e3.getSnapshot;
              e3 = e3.value;
              try {
                var n3 = t3();
                return !i2(e3, n3);
              } catch (r3) {
                return true;
              }
            }
            var u = "undefined" == typeof window || void 0 === window.document || void 0 === window.document.createElement ? function(e3, t3) {
              return t3();
            } : function(e3, t3) {
              var n3 = t3(), r3 = o2({ inst: { value: n3, getSnapshot: t3 } }), i3 = r3[0].inst, u2 = r3[1];
              return s2((function() {
                i3.value = n3, i3.getSnapshot = t3, l(i3) && u2({ inst: i3 });
              }), [e3, n3, t3]), a2((function() {
                return l(i3) && u2({ inst: i3 }), e3((function() {
                  l(i3) && u2({ inst: i3 });
                }));
              }), [e3]), c(n3), n3;
            };
            t2.useSyncExternalStore = void 0 !== r2.useSyncExternalStore ? r2.useSyncExternalStore : u;
          }, 8139: function(e2, t2, n2) {
            "use strict";
            e2.exports = n2(4026);
          }, 6973: function() {
          }, 8521: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { CS: function() {
              return r2.CS;
            }, M: function() {
              return r2.M;
            } });
            var r2 = n2(7736);
            n2(3195);
          }, 4968: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { fx: function() {
              return a2;
            }, lQ: function() {
              return r2;
            }, vu: function() {
              return s2;
            } });
            var r2 = (...e3) => {
            }, i2 = 'const respond=r=>{self.postMessage(r)},workerToTabIds={};self.addEventListener("message",r=>{const e=r.data;switch(e.type){case"setTimeout":workerToTabIds[e.id]=setTimeout(()=>{respond({id:e.id})},e.ms);break;case"clearTimeout":workerToTabIds[e.id]&&(clearTimeout(workerToTabIds[e.id]),delete workerToTabIds[e.id]);break;case"setInterval":workerToTabIds[e.id]=setInterval(()=>{respond({id:e.id})},e.ms);break;case"clearInterval":workerToTabIds[e.id]&&(clearInterval(workerToTabIds[e.id]),delete workerToTabIds[e.id]);break}});\n', o2 = (e3, t3 = {}) => {
              if ("undefined" == typeof Worker) return null;
              try {
                const n3 = new Blob([e3], { type: "application/javascript; charset=utf-8" }), r3 = globalThis.URL.createObjectURL(n3);
                return new Worker(r3, t3);
              } catch (n3) {
                return console.warn("Clerk: Cannot create worker from blob. Consider adding worker-src blob:; to your CSP"), null;
              }
            }, a2 = () => {
              let e3 = 0;
              const t3 = () => e3++, n3 = /* @__PURE__ */ new Map(), a3 = (e4, t4) => null == e4 ? void 0 : e4.postMessage(t4), s3 = (e4) => {
                var t4;
                null == (t4 = n3.get(e4.data.id)) || t4();
              };
              let c = o2(i2, { name: "clerk-timers" });
              if (null == c || c.addEventListener("message", s3), !c) return { setTimeout: globalThis.setTimeout.bind(globalThis), setInterval: globalThis.setInterval.bind(globalThis), clearTimeout: globalThis.clearTimeout.bind(globalThis), clearInterval: globalThis.clearInterval.bind(globalThis), cleanup: r2 };
              const l = () => {
                c || (c = o2(i2, { name: "clerk-timers" }), null == c || c.addEventListener("message", s3));
              };
              return { setTimeout: (e4, r3) => {
                l();
                const i3 = t3();
                return n3.set(i3, e4), a3(c, { type: "setTimeout", id: i3, ms: r3 }), i3;
              }, setInterval: (e4, r3) => {
                l();
                const i3 = t3();
                return n3.set(i3, e4), a3(c, { type: "setInterval", id: i3, ms: r3 }), i3;
              }, clearTimeout: (e4) => {
                l(), n3.delete(e4), a3(c, { type: "clearTimeout", id: e4 });
              }, clearInterval: (e4) => {
                l(), n3.delete(e4), a3(c, { type: "clearInterval", id: e4 });
              }, cleanup: () => {
                c && (c.terminate(), c = null, n3.clear());
              } };
            };
            function s2({ delayInMs: e3 } = { delayInMs: 1e3 }) {
              const t3 = a2();
              let n3, r3 = false;
              const i3 = () => {
                n3 && (t3.clearTimeout(n3), t3.cleanup()), r3 = true;
              }, o3 = async (a3) => {
                r3 = false, await a3(i3), r3 || (n3 = t3.setTimeout((() => {
                  o3(a3);
                }), e3));
              };
              return { run: o3, stop: i3 };
            }
          }, 7754: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { Lx: function() {
              return a2;
            }, W1: function() {
              return s2;
            }, b_: function() {
              return r2;
            }, io: function() {
              return o2;
            } });
            var r2 = () => {
              try {
                return false;
              } catch (e3) {
              }
              return false;
            }, i2 = /* @__PURE__ */ new Set(), o2 = (e3, t3, n3) => {
              const r3 = (() => {
                try {
                  return false;
                } catch (e4) {
                }
                return false;
              })() || (() => {
                try {
                  return true;
                } catch (e4) {
                }
                return false;
              })(), o3 = null != n3 ? n3 : e3;
              i2.has(o3) || r3 || (i2.add(o3), console.warn(`Clerk - DEPRECATION WARNING: "${e3}" is deprecated and will be removed in the next major release.
${t3}`));
            }, a2 = (e3, t3, n3, r3 = false) => {
              const i3 = r3 ? e3 : e3.prototype;
              let a3 = i3[t3];
              Object.defineProperty(i3, t3, { get() {
                return o2(t3, n3, `${e3.name}:${t3}`), a3;
              }, set(e4) {
                a3 = e4;
              } });
            }, s2 = (e3, t3, n3, r3) => {
              let i3 = e3[t3];
              Object.defineProperty(e3, t3, { get() {
                return o2(t3, n3, r3), i3;
              }, set(e4) {
                i3 = e4;
              } });
            };
          }, 7736: function(e2, t2, n2) {
            "use strict";
            function r2() {
              return "undefined" != typeof window;
            }
            n2.d(t2, { CS: function() {
              return a2;
            }, M: function() {
              return r2;
            }, kv: function() {
              return o2;
            } });
            var i2 = new RegExp(["bot", "spider", "crawl", "APIs-Google", "AdsBot", "Googlebot", "mediapartners", "Google Favicon", "FeedFetcher", "Google-Read-Aloud", "DuplexWeb-Google", "googleweblight", "bing", "yandex", "baidu", "duckduck", "yahoo", "ecosia", "ia_archiver", "facebook", "instagram", "pinterest", "reddit", "slack", "twitter", "whatsapp", "youtube", "semrush"].join("|"), "i");
            function o2() {
              var e3, t3;
              const n3 = r2() ? null == window ? void 0 : window.navigator : null;
              if (!n3) return false;
              const i3 = null == n3 ? void 0 : n3.onLine;
              return 0 !== (null == (e3 = null == n3 ? void 0 : n3.connection) ? void 0 : e3.rtt) && 0 !== (null == (t3 = null == n3 ? void 0 : n3.connection) ? void 0 : t3.downlink) && i3;
            }
            function a2() {
              return o2() && (function() {
                const e3 = r2() ? null == window ? void 0 : window.navigator : null;
                return !(!e3 || (t3 = null == e3 ? void 0 : e3.userAgent, t3 && i2.test(t3) || (null == e3 ? void 0 : e3.webdriver)));
                var t3;
              })();
            }
          }, 3195: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { V: function() {
              return s2;
            }, i: function() {
              return l;
            } });
            var r2 = Object.defineProperty, i2 = Object.getOwnPropertyDescriptor, o2 = Object.getOwnPropertyNames, a2 = Object.prototype.hasOwnProperty, s2 = (e3, t3) => {
              for (var n3 in t3) r2(e3, n3, { get: t3[n3], enumerable: true });
            }, c = (e3, t3, n3, s3) => {
              if (t3 && "object" == typeof t3 || "function" == typeof t3) for (let c2 of o2(t3)) a2.call(e3, c2) || c2 === n3 || r2(e3, c2, { get: () => t3[c2], enumerable: !(s3 = i2(t3, c2)) || s3.enumerable });
              return e3;
            }, l = (e3, t3, n3) => (c(e3, t3, "default"), n3 && c(n3, t3, "default"));
          }, 1777: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { y: function() {
              return r2;
            } });
            var r2 = (e3) => "undefined" != typeof atob && "function" == typeof atob ? atob(e3) : "undefined" != typeof global && global.Buffer ? new global.Buffer(e3, "base64").toString() : e3;
          }, 6310: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { $R: function() {
              return c;
            }, Au: function() {
              return h;
            }, Cm: function() {
              return l;
            }, LR: function() {
              return p;
            }, NZ: function() {
              return y;
            }, TX: function() {
              return a2;
            }, Ys: function() {
              return w;
            }, _d: function() {
              return d;
            }, _r: function() {
              return S;
            }, cR: function() {
              return m;
            }, dB: function() {
              return b;
            }, gS: function() {
              return g;
            }, hl: function() {
              return v;
            }, nc: function() {
              return o2;
            }, rZ: function() {
              return i2;
            }, si: function() {
              return u;
            }, u$: function() {
              return f;
            }, ux: function() {
              return s2;
            } });
            var r2 = n2(7754);
            function i2(e3) {
              return ["captcha_invalid", "captcha_not_enabled", "captcha_missing_token"].includes(e3.errors[0].code);
            }
            function o2(e3) {
              const t3 = null == e3 ? void 0 : e3.status;
              return !!t3 && t3 >= 400 && t3 < 500;
            }
            function a2(e3) {
              return (`${e3.message}${e3.name}` || "").toLowerCase().replace(/\s+/g, "").includes("networkerror");
            }
            function s2(e3) {
              return c(e3) || u(e3) || l(e3);
            }
            function c(e3) {
              return "clerkError" in e3;
            }
            function l(e3) {
              return "clerkRuntimeError" in e3;
            }
            function u(e3) {
              return "code" in e3 && [4001, 32602, 32603].includes(e3.code) && "message" in e3;
            }
            function d(e3) {
              var t3, n3;
              return c(e3) && "user_locked" === (null == (n3 = null == (t3 = e3.errors) ? void 0 : t3[0]) ? void 0 : n3.code);
            }
            function h(e3) {
              var t3, n3;
              return c(e3) && "form_password_pwned" === (null == (n3 = null == (t3 = e3.errors) ? void 0 : t3[0]) ? void 0 : n3.code);
            }
            function f(e3) {
              var t3, n3, r3, i3, o3;
              return { code: e3.code, message: e3.message, longMessage: e3.long_message, meta: { paramName: null == (t3 = null == e3 ? void 0 : e3.meta) ? void 0 : t3.param_name, sessionId: null == (n3 = null == e3 ? void 0 : e3.meta) ? void 0 : n3.session_id, emailAddresses: null == (r3 = null == e3 ? void 0 : e3.meta) ? void 0 : r3.email_addresses, identifiers: null == (i3 = null == e3 ? void 0 : e3.meta) ? void 0 : i3.identifiers, zxcvbn: null == (o3 = null == e3 ? void 0 : e3.meta) ? void 0 : o3.zxcvbn } };
            }
            var p = class e3 extends Error {
              constructor(t3, { data: n3, status: r3, clerkTraceId: i3 }) {
                super(t3), this.toString = () => {
                  let e4 = `[${this.name}]
Message:${this.message}
Status:${this.status}
Serialized errors: ${this.errors.map(((e5) => JSON.stringify(e5)))}`;
                  return this.clerkTraceId && (e4 += `
Clerk Trace ID: ${this.clerkTraceId}`), e4;
                }, Object.setPrototypeOf(this, e3.prototype), this.status = r3, this.message = t3, this.clerkTraceId = i3, this.clerkError = true, this.errors = (function(e4 = []) {
                  return e4.length > 0 ? e4.map(f) : [];
                })(n3);
              }
            }, m = class e3 extends Error {
              constructor(t3, { code: n3 }) {
                super(t3), this.toString = () => `[${this.name}]
Message:${this.message}`, Object.setPrototypeOf(this, e3.prototype), this.code = n3, this.message = t3, this.clerkRuntimeError = true;
              }
            }, g = class e3 extends Error {
              constructor(t3) {
                super(t3), this.code = t3, Object.setPrototypeOf(this, e3.prototype), (0, r2.io)("MagicLinkError", "Use `EmailLinkError` instead.");
              }
            }, y = class e3 extends Error {
              constructor(t3) {
                super(t3), this.code = t3, Object.setPrototypeOf(this, e3.prototype);
              }
            };
            function v(e3) {
              return e3 instanceof y;
            }
            var b = new Proxy({ Expired: "expired", Failed: "failed" }, { get(e3, t3, n3) {
              return (0, r2.io)("MagicLinkErrorCode", "Use `EmailLinkErrorCode` instead."), Reflect.get(e3, t3, n3);
            } }), w = { Expired: "expired", Failed: "failed" }, _ = Object.freeze({ InvalidFrontendApiErrorMessage: "The frontendApi passed to Clerk is invalid. You can get your Frontend API key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})", InvalidProxyUrlErrorMessage: "The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})", InvalidPublishableKeyErrorMessage: "The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})", MissingPublishableKeyErrorMessage: "Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys." });
            function S({ packageName: e3, customMessages: t3 }) {
              let n3 = e3;
              const r3 = { ..._, ...t3 };
              function i3(e4, t4) {
                if (!t4) return `${n3}: ${e4}`;
                let r4 = e4;
                const i4 = e4.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);
                for (const n4 of i4) {
                  const e5 = (t4[n4[1]] || "").toString();
                  r4 = r4.replace(`{{${n4[1]}}}`, e5);
                }
                return `${n3}: ${r4}`;
              }
              return { setPackageName({ packageName: e4 }) {
                return "string" == typeof e4 && (n3 = e4), this;
              }, setMessages({ customMessages: e4 }) {
                return Object.assign(r3, e4 || {}), this;
              }, throwInvalidPublishableKeyError(e4) {
                throw new Error(i3(r3.InvalidPublishableKeyErrorMessage, e4));
              }, throwInvalidFrontendApiError(e4) {
                throw new Error(i3(r3.InvalidFrontendApiErrorMessage, e4));
              }, throwInvalidProxyUrl(e4) {
                throw new Error(i3(r3.InvalidProxyUrlErrorMessage, e4));
              }, throwMissingPublishableKeyError() {
                throw new Error(i3(r3.MissingPublishableKeyErrorMessage));
              } };
            }
          }, 7780: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { Lx: function() {
              return r2.Lx;
            }, W1: function() {
              return r2.W1;
            }, io: function() {
              return r2.io;
            } });
            var r2 = n2(7754);
            n2(3195);
          }, 9859: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { $R: function() {
              return r2.$R;
            }, Au: function() {
              return r2.Au;
            }, Cm: function() {
              return r2.Cm;
            }, LR: function() {
              return r2.LR;
            }, NZ: function() {
              return r2.NZ;
            }, TX: function() {
              return r2.TX;
            }, Ys: function() {
              return r2.Ys;
            }, _d: function() {
              return r2._d;
            }, _r: function() {
              return r2._r;
            }, cR: function() {
              return r2.cR;
            }, dB: function() {
              return r2.dB;
            }, gS: function() {
              return r2.gS;
            }, hl: function() {
              return r2.hl;
            }, nc: function() {
              return r2.nc;
            }, rZ: function() {
              return r2.rZ;
            }, si: function() {
              return r2.si;
            }, u$: function() {
              return r2.u$;
            }, ux: function() {
              return r2.ux;
            } });
            var r2 = n2(6310);
            n2(7754), n2(3195);
          }, 7643: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { Ss: function() {
              return C;
            }, vu: function() {
              return r2.vu;
            }, TV: function() {
              return m;
            }, e7: function() {
              return U;
            }, C8: function() {
              return d;
            }, ph: function() {
              return T;
            }, RZ: function() {
              return S;
            }, fx: function() {
              return r2.fx;
            }, Sd: function() {
              return f;
            }, io: function() {
              return i2.io;
            }, Lx: function() {
              return i2.Lx;
            }, HR: function() {
              return M;
            }, Lm: function() {
              return R;
            }, om: function() {
              return A;
            }, VK: function() {
              return g;
            }, M: function() {
              return k.M;
            }, nc: function() {
              return z.nc;
            }, kv: function() {
              return k.kv;
            }, $R: function() {
              return z.$R;
            }, b_: function() {
              return i2.b_;
            }, RE: function() {
              return a2;
            }, r7: function() {
              return _;
            }, _d: function() {
              return z._d;
            }, CS: function() {
              return k.CS;
            }, _c: function() {
              return o2;
            }, lQ: function() {
              return r2.lQ;
            }, OG: function() {
              return O;
            }, q5: function() {
              return w;
            }, zz: function() {
              return c;
            }, Nv: function() {
              return L;
            }, Js: function() {
              return I;
            }, sF: function() {
              return u;
            }, Wl: function() {
              return p;
            }, Ns: function() {
              return l;
            } });
            var r2 = n2(4968), i2 = n2(7754);
            function o2(e3) {
              return !e3 || a2(e3) || s2(e3);
            }
            function a2(e3) {
              return /^http(s)?:\/\//.test(e3 || "");
            }
            function s2(e3) {
              return e3.startsWith("/");
            }
            function c(e3) {
              return e3 ? s2(e3) ? new URL(e3, window.location.origin).toString() : e3 : "";
            }
            function l(e3) {
              const t3 = e3 || "";
              return t3.charAt(0).toUpperCase() + t3.slice(1);
            }
            function u(e3) {
              return e3 ? e3.replace(/([-_][a-z])/g, ((e4) => e4.toUpperCase().replace(/-|_/, ""))) : "";
            }
            function d(e3) {
              return e3 ? e3.replace(/[A-Z]/g, ((e4) => `_${e4.toLowerCase()}`)) : "";
            }
            var h = (e3) => {
              const t3 = (n3) => {
                if (!n3) return n3;
                if (Array.isArray(n3)) return n3.map(((e4) => "object" == typeof e4 || Array.isArray(e4) ? t3(e4) : e4));
                const r3 = { ...n3 }, i3 = Object.keys(r3);
                for (const o3 of i3) {
                  const n4 = e3(o3.toString());
                  n4 !== o3 && (r3[n4] = r3[o3], delete r3[o3]), "object" == typeof r3[n4] && (r3[n4] = t3(r3[n4]));
                }
                return r3;
              };
              return t3;
            }, f = (h(d), h(u));
            function p(e3 = "") {
              return (e3 || "").replace(/^.+:\/\//, "");
            }
            function m(e3) {
              if (!e3) return "";
              let t3;
              if (e3.match(/^(clerk\.)+\w*$/)) t3 = /(clerk\.)*(?=clerk\.)/;
              else {
                if (e3.match(/\.clerk.accounts/)) return e3;
                t3 = /^(clerk\.)*/gi;
              }
              return `clerk.${e3.replace(t3, "")}`;
            }
            function g(e3, t3, n3) {
              return "function" == typeof e3 ? e3(t3) : void 0 !== e3 ? e3 : void 0 !== n3 ? n3 : void 0;
            }
            Object.freeze({ "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/webp": "webp", "image/x-icon": "ico", "image/vnd.microsoft.icon": "ico" });
            var y = n2(1777), v = "pk_live_", b = "pk_test_";
            function w(e3) {
              if (!(function(e4) {
                const t4 = (e4 = e4 || "").startsWith(v) || e4.startsWith(b), n4 = (0, y.y)(e4.split("_")[2] || "").endsWith("$");
                return t4 && n4;
              })(e3 = e3 || "")) return null;
              const t3 = e3.startsWith(v) ? "production" : "development";
              let n3 = (0, y.y)(e3.split("_")[2]);
              return n3.endsWith("$") ? (n3 = n3.slice(0, -1), { instanceType: t3, frontendApi: n3 }) : null;
            }
            function _(e3) {
              return (e3 = e3 || "").startsWith("clerk.");
            }
            function S() {
              const e3 = [".lcl.dev", ".stg.dev", ".lclstage.dev", ".stgstage.dev", ".dev.lclclerk.com", ".stg.lclclerk.com", ".accounts.lclclerk.com", "accountsstage.dev", "accounts.dev"], t3 = /* @__PURE__ */ new Map();
              return { isDevOrStagingUrl: (n3) => {
                if (!n3) return false;
                const r3 = "string" == typeof n3 ? n3 : n3.hostname;
                let i3 = t3.get(r3);
                return void 0 === i3 && (i3 = e3.some(((e4) => r3.endsWith(e4))), t3.set(r3, i3)), i3;
              } };
            }
            var k = n2(7736), P = 864e5;
            function O(e3) {
              try {
                return new Date(e3 || /* @__PURE__ */ new Date());
              } catch (t3) {
                return /* @__PURE__ */ new Date();
              }
            }
            function A(e3) {
              const { date: t3, relativeTo: n3 } = e3;
              if (!t3 || !n3) return null;
              const r3 = O(t3), i3 = (function(e4, t4, { absolute: n4 = true } = {}) {
                if (!e4 || !t4) return 0;
                const r4 = Date.UTC(e4.getFullYear(), e4.getMonth(), e4.getDate()), i4 = Date.UTC(t4.getFullYear(), t4.getMonth(), t4.getDate()), o3 = Math.floor((i4 - r4) / P);
                return n4 ? Math.abs(o3) : o3;
              })(O(n3), r3, { absolute: false });
              return i3 < -6 ? { relativeDateCase: "other", date: r3 } : i3 < -1 ? { relativeDateCase: "previous6Days", date: r3 } : -1 === i3 ? { relativeDateCase: "lastDay", date: r3 } : 0 === i3 ? { relativeDateCase: "sameDay", date: r3 } : 1 === i3 ? { relativeDateCase: "nextDay", date: r3 } : i3 < 7 ? { relativeDateCase: "next6Days", date: r3 } : { relativeDateCase: "other", date: r3 };
            }
            function U(e3, t3) {
              const n3 = O(e3);
              return n3.setFullYear(n3.getFullYear() + t3), n3;
            }
            var x = "__dev_session", C = "__clerk_db_jwt", E = /__clerk_db_jwt\[(.*)\]/;
            function I(e3, t3, n3 = { hash: true }) {
              const r3 = new URL(e3), i3 = M(r3), o3 = R(r3), a3 = i3 || o3 || t3;
              return a3 && (r3.searchParams.append(x, a3), r3.searchParams.append(C, a3), n3.hash && (r3.hash = r3.hash + `${C}[${a3}]`)), r3;
            }
            function M(e3) {
              const t3 = (function(e4) {
                const t4 = e4.match(E);
                return t4 ? t4[1] : "";
              })(e3.hash);
              return e3.hash = e3.hash.replace(E, ""), e3.href.endsWith("#") && (e3.hash = ""), t3;
            }
            function R(e3) {
              const t3 = e3.searchParams.get(x);
              e3.searchParams.delete(x);
              const n3 = e3.searchParams.get(C);
              return e3.searchParams.delete(C), t3 || n3 || "";
            }
            var z = n2(6310), T = (n2(3195), () => {
              let e3 = r2.lQ, t3 = r2.lQ;
              return { promise: new Promise(((n3, r3) => {
                e3 = n3, t3 = r3;
              })), resolve: e3, reject: t3 };
            }), N = { firstDelay: 125, maxDelay: 0, timeMultiple: 2, shouldRetry: () => true }, L = async (e3, t3 = {}) => {
              let n3 = 0;
              const { shouldRetry: r3, firstDelay: i3, maxDelay: o3, timeMultiple: a3 } = { ...N, ...t3 }, s3 = /* @__PURE__ */ ((e4) => {
                let t4 = 0;
                return async () => {
                  await (async (e5) => new Promise(((t5) => setTimeout(t5, e5))))((() => {
                    const n4 = e4.firstDelay, r4 = e4.timeMultiple, i4 = n4 * Math.pow(r4, t4);
                    return Math.min(e4.maxDelay || i4, i4);
                  })()), t4++;
                };
              })({ firstDelay: i3, maxDelay: o3, timeMultiple: a3 });
              for (; ; ) try {
                return await e3();
              } catch (c2) {
                if (n3++, !r3(c2, n3)) throw c2;
                await s3();
              }
            };
          }, 8643: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { k: function() {
              return o2;
            } });
            var r2 = "loadScript cannot be called when document does not exist", i2 = "loadScript cannot be called without a src";
            async function o2(e3 = "", t3) {
              const { async: n3, defer: o3, beforeLoad: a2, crossOrigin: s2 } = t3 || {};
              return new Promise(((t4, c) => {
                e3 || c(i2), document && document.body || c(r2);
                const l = document.createElement("script");
                s2 && l.setAttribute("crossorigin", s2), l.async = n3 || false, l.defer = o3 || false, l.addEventListener("load", (() => {
                  l.remove(), t4(l);
                })), l.addEventListener("error", (() => {
                  l.remove(), c();
                })), l.src = e3, null == a2 || a2(l), document.body.appendChild(l);
              }));
            }
            n2(3195);
          }, 4654: function(e2, t2, n2) {
            "use strict";
            n2.d(t2, { ED: function() {
              return ce;
            }, pc: function() {
              return he;
            }, TS: function() {
              return ve;
            }, IC: function() {
              return pe;
            }, Rs: function() {
              return ue;
            }, _x: function() {
              return oe;
            }, e3: function() {
              return ae;
            }, hQ: function() {
              return le;
            }, WD: function() {
              return fe;
            }, Z5: function() {
              return ke;
            }, D_: function() {
              return Ae;
            }, Gi: function() {
              return Ue;
            }, UQ: function() {
              return xe;
            }, Lg: function() {
              return me;
            }, ur: function() {
              return de;
            } });
            var r2 = {};
            n2.r(r2), n2.d(r2, { SWRConfig: function() {
              return ee;
            }, default: function() {
              return te;
            }, mutate: function() {
              return D;
            }, preload: function() {
              return K;
            }, unstable_serialize: function() {
              return Z;
            }, useSWRConfig: function() {
              return H;
            } });
            var i2 = n2(7754), o2 = n2(3195), a2 = n2(4041), s2 = n2(8139);
            const c = () => {
            }, l = c(), u = Object, d = (e3) => e3 === l, h = (e3) => "function" == typeof e3, f = (e3, t3) => ({ ...e3, ...t3 }), p = /* @__PURE__ */ new WeakMap();
            let m = 0;
            const g = (e3) => {
              const t3 = typeof e3, n3 = e3 && e3.constructor, r3 = n3 == Date;
              let i3, o3;
              if (u(e3) !== e3 || r3 || n3 == RegExp) i3 = r3 ? e3.toJSON() : "symbol" == t3 ? e3.toString() : "string" == t3 ? JSON.stringify(e3) : "" + e3;
              else {
                if (i3 = p.get(e3), i3) return i3;
                if (i3 = ++m + "~", p.set(e3, i3), n3 == Array) {
                  for (i3 = "@", o3 = 0; o3 < e3.length; o3++) i3 += g(e3[o3]) + ",";
                  p.set(e3, i3);
                }
                if (n3 == u) {
                  i3 = "#";
                  const t4 = u.keys(e3).sort();
                  for (; !d(o3 = t4.pop()); ) d(e3[o3]) || (i3 += o3 + ":" + g(e3[o3]) + ",");
                  p.set(e3, i3);
                }
              }
              return i3;
            }, y = /* @__PURE__ */ new WeakMap(), v = {}, b = {}, w = "undefined", _ = typeof window != w, S = typeof document != w, k = (e3, t3) => {
              const n3 = y.get(e3);
              return [() => !d(t3) && e3.get(t3) || v, (r3) => {
                if (!d(t3)) {
                  const i3 = e3.get(t3);
                  t3 in b || (b[t3] = i3), n3[5](t3, f(i3, r3), i3 || v);
                }
              }, n3[6], () => !d(t3) && t3 in b ? b[t3] : !d(t3) && e3.get(t3) || v];
            };
            let P = true;
            const [O, A] = _ && window.addEventListener ? [window.addEventListener.bind(window), window.removeEventListener.bind(window)] : [c, c], U = { isOnline: () => P, isVisible: () => {
              const e3 = S && document.visibilityState;
              return d(e3) || "hidden" !== e3;
            } }, x = { initFocus: (e3) => (S && document.addEventListener("visibilitychange", e3), O("focus", e3), () => {
              S && document.removeEventListener("visibilitychange", e3), A("focus", e3);
            }), initReconnect: (e3) => {
              const t3 = () => {
                P = true, e3();
              }, n3 = () => {
                P = false;
              };
              return O("online", t3), O("offline", n3), () => {
                A("online", t3), A("offline", n3);
              };
            } }, C = !a2.useId, E = !_ || "Deno" in window, I = E ? a2.useEffect : a2.useLayoutEffect, M = "undefined" != typeof navigator && navigator.connection, R = !E && M && (["slow-2g", "2g"].includes(M.effectiveType) || M.saveData), z = (e3) => {
              if (h(e3)) try {
                e3 = e3();
              } catch (n3) {
                e3 = "";
              }
              const t3 = e3;
              return [e3 = "string" == typeof e3 ? e3 : (Array.isArray(e3) ? e3.length : e3) ? g(e3) : "", t3];
            };
            let T = 0;
            const N = () => ++T;
            async function L(...e3) {
              const [t3, n3, r3, i3] = e3, o3 = f({ populateCache: true, throwOnError: true }, "boolean" == typeof i3 ? { revalidate: i3 } : i3 || {});
              let a3 = o3.populateCache;
              const s3 = o3.rollbackOnError;
              let c2 = o3.optimisticData;
              const u2 = false !== o3.revalidate, p2 = o3.throwOnError;
              if (h(n3)) {
                const e4 = n3, r4 = [], i4 = t3.keys();
                for (const n4 of i4) !/^\$(inf|sub)\$/.test(n4) && e4(t3.get(n4)._k) && r4.push(n4);
                return Promise.all(r4.map(m2));
              }
              return m2(n3);
              async function m2(n4) {
                const [i4] = z(n4);
                if (!i4) return;
                const [o4, f2] = k(t3, i4), [m3, g2, v2, b2] = y.get(t3), w2 = m3[i4], _2 = () => u2 && (delete v2[i4], delete b2[i4], w2 && w2[0]) ? w2[0](2).then((() => o4().data)) : o4().data;
                if (e3.length < 3) return _2();
                let S2, P2 = r3;
                const O2 = N();
                g2[i4] = [O2, 0];
                const A2 = !d(c2), U2 = o4(), x2 = U2.data, C2 = U2._c, E2 = d(C2) ? x2 : C2;
                if (A2 && (c2 = h(c2) ? c2(E2, x2) : c2, f2({ data: c2, _c: E2 })), h(P2)) try {
                  P2 = P2(E2);
                } catch (M2) {
                  S2 = M2;
                }
                if (P2 && h(P2.then)) {
                  if (P2 = await P2.catch(((e4) => {
                    S2 = e4;
                  })), O2 !== g2[i4][0]) {
                    if (S2) throw S2;
                    return P2;
                  }
                  S2 && A2 && ((e4) => "function" == typeof s3 ? s3(e4) : false !== s3)(S2) && (a3 = true, P2 = E2, f2({ data: P2, _c: l }));
                }
                a3 && (S2 || (h(a3) && (P2 = a3(P2, E2)), f2({ data: P2, error: l, _c: l }))), g2[i4][1] = N();
                const I2 = await _2();
                if (f2({ _c: l }), !S2) return a3 ? I2 : P2;
                if (p2) throw S2;
              }
            }
            const j = (e3, t3) => {
              for (const n3 in e3) e3[n3][0] && e3[n3][0](t3);
            }, $ = (e3, t3) => {
              if (!y.has(e3)) {
                const n3 = f(x, t3), r3 = {}, i3 = L.bind(l, e3);
                let o3 = c;
                const a3 = {}, s3 = (e4, t4) => {
                  const n4 = a3[e4] || [];
                  return a3[e4] = n4, n4.push(t4), () => n4.splice(n4.indexOf(t4), 1);
                }, u2 = (t4, n4, r4) => {
                  e3.set(t4, n4);
                  const i4 = a3[t4];
                  if (i4) for (const e4 of i4) e4(n4, r4);
                }, d2 = () => {
                  if (!y.has(e3) && (y.set(e3, [r3, {}, {}, {}, i3, u2, s3]), !E)) {
                    const t4 = n3.initFocus(setTimeout.bind(l, j.bind(l, r3, 0))), i4 = n3.initReconnect(setTimeout.bind(l, j.bind(l, r3, 1)));
                    o3 = () => {
                      t4 && t4(), i4 && i4(), y.delete(e3);
                    };
                  }
                };
                return d2(), [e3, i3, d2, o3];
              }
              return [e3, y.get(e3)[4]];
            }, [F, D] = $(/* @__PURE__ */ new Map()), W = f({ onLoadingSlow: c, onSuccess: c, onError: c, onErrorRetry: (e3, t3, n3, r3, i3) => {
              const o3 = n3.errorRetryCount, a3 = i3.retryCount, s3 = ~~((Math.random() + 0.5) * (1 << (a3 < 8 ? a3 : 8))) * n3.errorRetryInterval;
              !d(o3) && a3 > o3 || setTimeout(r3, s3, i3);
            }, onDiscarded: c, revalidateOnFocus: true, revalidateOnReconnect: true, revalidateIfStale: true, shouldRetryOnError: true, errorRetryInterval: R ? 1e4 : 5e3, focusThrottleInterval: 5e3, dedupingInterval: 2e3, loadingTimeout: R ? 5e3 : 3e3, compare: (e3, t3) => g(e3) == g(t3), isPaused: () => false, cache: F, mutate: D, fallback: {} }, U), V = (e3, t3) => {
              const n3 = f(e3, t3);
              if (t3) {
                const { use: r3, fallback: i3 } = e3, { use: o3, fallback: a3 } = t3;
                r3 && o3 && (n3.use = r3.concat(o3)), i3 && a3 && (n3.fallback = f(i3, a3));
              }
              return n3;
            }, B = (0, a2.createContext)({}), J = _ && window.__SWR_DEVTOOLS_USE__, q = J ? window.__SWR_DEVTOOLS_USE__ : [], G = (e3) => h(e3[1]) ? [e3[0], e3[1], e3[2] || {}] : [e3[0], null, (null === e3[1] ? e3[2] : e3[1]) || {}], H = () => f(W, (0, a2.useContext)(B)), K = (e3, t3) => {
              const [n3, r3] = z(e3), [, , , i3] = y.get(F);
              if (i3[n3]) return i3[n3];
              const o3 = t3(r3);
              return i3[n3] = o3, o3;
            }, Y = q.concat(((e3) => (t3, n3, r3) => e3(t3, n3 && ((...e4) => {
              const [r4] = z(t3), [, , , i3] = y.get(F), o3 = i3[r4];
              return d(o3) ? n3(...e4) : (delete i3[r4], o3);
            }), r3)));
            J && (window.__SWR_DEVTOOLS_REACT__ = a2);
            const Z = (e3) => z(e3)[0], Q = a2.use || ((e3) => {
              if ("pending" === e3.status) throw e3;
              if ("fulfilled" === e3.status) return e3.value;
              throw "rejected" === e3.status ? e3.reason : (e3.status = "pending", e3.then(((t3) => {
                e3.status = "fulfilled", e3.value = t3;
              }), ((t3) => {
                e3.status = "rejected", e3.reason = t3;
              })), e3);
            }), X = { dedupe: true }, ee = u.defineProperty(((e3) => {
              const { value: t3 } = e3, n3 = (0, a2.useContext)(B), r3 = h(t3), i3 = (0, a2.useMemo)((() => r3 ? t3(n3) : t3), [r3, n3, t3]), o3 = (0, a2.useMemo)((() => r3 ? i3 : V(n3, i3)), [r3, n3, i3]), s3 = i3 && i3.provider, c2 = (0, a2.useRef)(l);
              s3 && !c2.current && (c2.current = $(s3(o3.cache || F), i3));
              const u2 = c2.current;
              return u2 && (o3.cache = u2[0], o3.mutate = u2[1]), I((() => {
                if (u2) return u2[2] && u2[2](), u2[3];
              }), []), (0, a2.createElement)(B.Provider, f(e3, { value: o3 }));
            }), "defaultValue", { value: W }), te = (ne = (e3, t3, n3) => {
              const { cache: r3, compare: i3, suspense: o3, fallbackData: c2, revalidateOnMount: u2, revalidateIfStale: p2, refreshInterval: m2, refreshWhenHidden: g2, refreshWhenOffline: v2, keepPreviousData: b2 } = n3, [S2, P2, O2, A2] = y.get(r3), [U2, x2] = z(e3), M2 = (0, a2.useRef)(false), R2 = (0, a2.useRef)(false), T2 = (0, a2.useRef)(U2), j2 = (0, a2.useRef)(t3), $2 = (0, a2.useRef)(n3), F2 = () => $2.current, D2 = () => F2().isVisible() && F2().isOnline(), [W2, V2, B2, J2] = k(r3, U2), q2 = (0, a2.useRef)({}).current, G2 = d(c2) ? n3.fallback[U2] : c2, H2 = (e4, t4) => {
                for (const n4 in q2) {
                  const r4 = n4;
                  if ("data" === r4) {
                    if (!i3(e4[r4], t4[r4])) {
                      if (!d(e4[r4])) return false;
                      if (!i3(oe2, t4[r4])) return false;
                    }
                  } else if (t4[r4] !== e4[r4]) return false;
                }
                return true;
              }, K2 = (0, a2.useMemo)((() => {
                const e4 = !!U2 && !!t3 && (d(u2) ? !F2().isPaused() && !o3 && (!!d(p2) || p2) : u2), n4 = (t4) => {
                  const n5 = f(t4);
                  return delete n5._k, e4 ? { isValidating: true, isLoading: true, ...n5 } : n5;
                }, r4 = W2(), i4 = J2(), a3 = n4(r4), s3 = r4 === i4 ? a3 : n4(i4);
                let c3 = a3;
                return [() => {
                  const e5 = n4(W2());
                  return H2(e5, c3) ? (c3.data = e5.data, c3.isLoading = e5.isLoading, c3.isValidating = e5.isValidating, c3.error = e5.error, c3) : (c3 = e5, e5);
                }, () => s3];
              }), [r3, U2]), Y2 = (0, s2.useSyncExternalStore)((0, a2.useCallback)(((e4) => B2(U2, ((t4, n4) => {
                H2(n4, t4) || e4();
              }))), [r3, U2]), K2[0], K2[1]), Z2 = !M2.current, ee2 = S2[U2] && S2[U2].length > 0, te2 = Y2.data, ne2 = d(te2) ? G2 : te2, re2 = Y2.error, ie2 = (0, a2.useRef)(ne2), oe2 = b2 ? d(te2) ? ie2.current : te2 : ne2, ae2 = !(ee2 && !d(re2)) && (Z2 && !d(u2) ? u2 : !F2().isPaused() && (o3 ? !d(ne2) && p2 : d(ne2) || p2)), se2 = !!(U2 && t3 && Z2 && ae2), ce2 = d(Y2.isValidating) ? se2 : Y2.isValidating, le2 = d(Y2.isLoading) ? se2 : Y2.isLoading, ue2 = (0, a2.useCallback)((async (e4) => {
                const t4 = j2.current;
                if (!U2 || !t4 || R2.current || F2().isPaused()) return false;
                let r4, o4, a3 = true;
                const s3 = e4 || {}, c3 = !O2[U2] || !s3.dedupe, u3 = () => C ? !R2.current && U2 === T2.current && M2.current : U2 === T2.current, f2 = { isValidating: false, isLoading: false }, p3 = () => {
                  V2(f2);
                }, m3 = () => {
                  const e5 = O2[U2];
                  e5 && e5[1] === o4 && delete O2[U2];
                }, g3 = { isValidating: true };
                d(W2().data) && (g3.isLoading = true);
                try {
                  if (c3 && (V2(g3), n3.loadingTimeout && d(W2().data) && setTimeout((() => {
                    a3 && u3() && F2().onLoadingSlow(U2, n3);
                  }), n3.loadingTimeout), O2[U2] = [t4(x2), N()]), [r4, o4] = O2[U2], r4 = await r4, c3 && setTimeout(m3, n3.dedupingInterval), !O2[U2] || O2[U2][1] !== o4) return c3 && u3() && F2().onDiscarded(U2), false;
                  f2.error = l;
                  const e5 = P2[U2];
                  if (!d(e5) && (o4 <= e5[0] || o4 <= e5[1] || 0 === e5[1])) return p3(), c3 && u3() && F2().onDiscarded(U2), false;
                  const s4 = W2().data;
                  f2.data = i3(s4, r4) ? s4 : r4, c3 && u3() && F2().onSuccess(r4, U2, n3);
                } catch (y2) {
                  m3();
                  const e5 = F2(), { shouldRetryOnError: t5 } = e5;
                  e5.isPaused() || (f2.error = y2, c3 && u3() && (e5.onError(y2, U2, e5), (true === t5 || h(t5) && t5(y2)) && D2() && e5.onErrorRetry(y2, U2, e5, ((e6) => {
                    const t6 = S2[U2];
                    t6 && t6[0] && t6[0](3, e6);
                  }), { retryCount: (s3.retryCount || 0) + 1, dedupe: true })));
                }
                return a3 = false, p3(), true;
              }), [U2, r3]), de2 = (0, a2.useCallback)(((...e4) => L(r3, T2.current, ...e4)), []);
              if (I((() => {
                j2.current = t3, $2.current = n3, d(te2) || (ie2.current = te2);
              })), I((() => {
                if (!U2) return;
                const e4 = ue2.bind(l, X);
                let t4 = 0;
                const n4 = ((e5, t5, n5) => {
                  const r5 = t5[e5] || (t5[e5] = []);
                  return r5.push(n5), () => {
                    const e6 = r5.indexOf(n5);
                    e6 >= 0 && (r5[e6] = r5[r5.length - 1], r5.pop());
                  };
                })(U2, S2, ((n5, r5 = {}) => {
                  if (0 == n5) {
                    const n6 = Date.now();
                    F2().revalidateOnFocus && n6 > t4 && D2() && (t4 = n6 + F2().focusThrottleInterval, e4());
                  } else if (1 == n5) F2().revalidateOnReconnect && D2() && e4();
                  else {
                    if (2 == n5) return ue2();
                    if (3 == n5) return ue2(r5);
                  }
                }));
                return R2.current = false, T2.current = U2, M2.current = true, V2({ _k: x2 }), ae2 && (d(ne2) || E ? e4() : (r4 = e4, _ && typeof window.requestAnimationFrame != w ? window.requestAnimationFrame(r4) : setTimeout(r4, 1))), () => {
                  R2.current = true, n4();
                };
                var r4;
              }), [U2]), I((() => {
                let e4;
                function t4() {
                  const t5 = h(m2) ? m2(W2().data) : m2;
                  t5 && -1 !== e4 && (e4 = setTimeout(n4, t5));
                }
                function n4() {
                  W2().error || !g2 && !F2().isVisible() || !v2 && !F2().isOnline() ? t4() : ue2(X).then(t4);
                }
                return t4(), () => {
                  e4 && (clearTimeout(e4), e4 = -1);
                };
              }), [m2, g2, v2, U2]), (0, a2.useDebugValue)(oe2), o3 && d(ne2) && U2) {
                if (!C && E) throw new Error("Fallback data is required when using suspense in SSR.");
                j2.current = t3, $2.current = n3, R2.current = false;
                const e4 = A2[U2];
                if (!d(e4)) {
                  const t4 = de2(e4);
                  Q(t4);
                }
                if (!d(re2)) throw re2;
                {
                  const e5 = ue2(X);
                  d(oe2) || (e5.status = "fulfilled", e5.value = true), Q(e5);
                }
              }
              return { mutate: de2, get data() {
                return q2.data = true, oe2;
              }, get error() {
                return q2.error = true, re2;
              }, get isValidating() {
                return q2.isValidating = true, ce2;
              }, get isLoading() {
                return q2.isLoading = true, le2;
              } };
            }, function(...e3) {
              const t3 = H(), [n3, r3, i3] = G(e3), o3 = V(t3, i3);
              let a3 = ne;
              const { use: s3 } = o3, c2 = (s3 || []).concat(Y);
              for (let l2 = c2.length; l2--; ) a3 = c2[l2](a3);
              return a3(n3, r3 || o3.fetcher || null, o3);
            });
            var ne;
            const re = Promise.resolve(), ie = /* @__PURE__ */ ((e3, t3) => (...n3) => {
              const [r3, i3, o3] = G(n3), a3 = (o3.use || []).concat(t3);
              return e3(r3, i3, { ...o3, use: a3 });
            })(te, ((e3) => (t3, n3, r3) => {
              const i3 = (0, a2.useRef)(false), { cache: o3, initialSize: c2 = 1, revalidateAll: u2 = false, persistSize: f2 = false, revalidateFirstPage: p2 = true, revalidateOnMount: m2 = false, parallel: g2 = false } = r3;
              let y2;
              try {
                y2 = ((e4) => z(e4 ? e4(0, null) : null)[0])(t3), y2 && (y2 = "$inf$" + y2);
              } catch (C2) {
              }
              const [v2, b2, w2] = k(o3, y2), _2 = (0, a2.useCallback)((() => d(v2()._l) ? c2 : v2()._l), [o3, y2, c2]);
              (0, s2.useSyncExternalStore)((0, a2.useCallback)(((e4) => y2 ? w2(y2, (() => {
                e4();
              })) : () => {
              }), [o3, y2]), _2, _2);
              const S2 = (0, a2.useCallback)((() => {
                const e4 = v2()._l;
                return d(e4) ? c2 : e4;
              }), [y2, c2]), P2 = (0, a2.useRef)(S2());
              I((() => {
                i3.current ? y2 && b2({ _l: f2 ? P2.current : S2() }) : i3.current = true;
              }), [y2, o3]);
              const O2 = m2 && !i3.current, A2 = e3(y2, (async (e4) => {
                const i4 = v2()._i, a3 = [], s3 = S2(), [c3] = k(o3, e4), h2 = c3().data, f3 = [];
                let m3 = null;
                for (let l2 = 0; l2 < s3; ++l2) {
                  const [e5, s4] = z(t3(l2, g2 ? null : m3));
                  if (!e5) break;
                  const [c4, y3] = k(o3, e5);
                  let v3 = c4().data;
                  const b3 = u2 || i4 || d(v3) || p2 && !l2 && !d(h2) || O2 || h2 && !d(h2[l2]) && !r3.compare(h2[l2], v3);
                  if (n3 && b3) {
                    const e6 = async () => {
                      v3 = await n3(s4), y3({ data: v3, _k: s4 }), a3[l2] = v3;
                    };
                    g2 ? f3.push(e6) : await e6();
                  } else a3[l2] = v3;
                  g2 || (m3 = v3);
                }
                return g2 && await Promise.all(f3.map(((e5) => e5()))), b2({ _i: l }), a3;
              }), r3), U2 = (0, a2.useCallback)((function(e4, t4) {
                const n4 = "boolean" == typeof t4 ? { revalidate: t4 } : t4 || {}, r4 = false !== n4.revalidate;
                return y2 ? (r4 && (d(e4) ? b2({ _i: true }) : b2({ _i: false })), arguments.length ? A2.mutate(e4, { ...n4, revalidate: r4 }) : A2.mutate()) : re;
              }), [y2, o3]), x2 = (0, a2.useCallback)(((e4) => {
                if (!y2) return re;
                const [, n4] = k(o3, y2);
                let r4;
                if (h(e4) ? r4 = e4(S2()) : "number" == typeof e4 && (r4 = e4), "number" != typeof r4) return re;
                n4({ _l: r4 }), P2.current = r4;
                const i4 = [], [a3] = k(o3, y2);
                let s3 = null;
                for (let c3 = 0; c3 < r4; ++c3) {
                  const [e5] = z(t3(c3, s3)), [n5] = k(o3, e5), r5 = e5 ? n5().data : l;
                  if (d(r5)) return U2(a3().data);
                  i4.push(r5), s3 = r5;
                }
                return U2(i4);
              }), [y2, o3, U2, S2]);
              return { size: S2(), setSize: x2, mutate: U2, get data() {
                return A2.data;
              }, get error() {
                return A2.error;
              }, get isValidating() {
                return A2.isValidating;
              }, get isLoading() {
                return A2.isLoading;
              } };
            }));
            function oe(e3, t3) {
              if (!e3) throw "string" == typeof t3 ? new Error(t3) : new Error(`${t3.displayName} not found`);
            }
            var ae = (e3, t3) => {
              const { assertCtxFn: n3 = oe } = t3 || {}, r3 = a2.createContext(void 0);
              return r3.displayName = e3, [r3, () => {
                const t4 = a2.useContext(r3);
                return n3(t4, `${e3} not found`), t4.value;
              }, () => {
                const e4 = a2.useContext(r3);
                return e4 ? e4.value : {};
              }];
            }, se = {};
            (0, o2.V)(se, { SWRConfig: () => ee, useSWR: () => te, useSWRInfinite: () => ie }), (0, o2.i)(se, r2);
            var [ce, le] = ae("ClerkInstanceContext"), [ue, de] = ae("UserContext"), [he, fe] = ae("ClientContext"), [pe, me] = ae("SessionContext"), [ge, ye] = ae("OrganizationContext"), ve = ({ children: e3, organization: t3, lastOrganizationMember: n3, lastOrganizationInvitation: r3, swrConfig: i3 }) => a2.createElement(ee, { value: i3 }, a2.createElement(ge.Provider, { value: { value: { organization: t3, lastOrganizationMember: n3, lastOrganizationInvitation: r3 } } }, e3));
            function be(e3, t3) {
              const n3 = new Set(Object.keys(t3)), r3 = {};
              for (const i3 of Object.keys(e3)) n3.has(i3) || (r3[i3] = e3[i3]);
              return r3;
            }
            var we = (e3, t3) => {
              var n3, r3, i3;
              const o3 = "boolean" == typeof e3 && e3, s3 = (0, a2.useRef)(o3 ? t3.initialPage : null != (n3 = null == e3 ? void 0 : e3.initialPage) ? n3 : t3.initialPage), c2 = (0, a2.useRef)(o3 ? t3.pageSize : null != (r3 = null == e3 ? void 0 : e3.pageSize) ? r3 : t3.pageSize), l2 = {};
              for (const a3 of Object.keys(t3)) l2[a3] = o3 ? t3[a3] : null != (i3 = null == e3 ? void 0 : e3[a3]) ? i3 : t3[a3];
              return { ...l2, initialPage: s3.current, pageSize: c2.current };
            }, _e = (e3, t3, n3, r3) => {
              var i3, o3, s3, c2, l2, u2;
              const [d2, h2] = (0, a2.useState)(null != (i3 = e3.initialPage) ? i3 : 1), f2 = (0, a2.useRef)(null != (o3 = e3.initialPage) ? o3 : 1), p2 = (0, a2.useRef)(null != (s3 = e3.pageSize) ? s3 : 10), m2 = null == (c2 = n3.enabled) || c2, g2 = null != (l2 = n3.infinite) && l2, y2 = null != (u2 = n3.keepPreviousData) && u2, v2 = { ...r3, ...e3, initialPage: d2, pageSize: p2.current }, { data: b2, isValidating: w2, isLoading: _2, error: S2, mutate: k2 } = te(!g2 && t3 && m2 ? v2 : null, ((e4) => {
                const n4 = be(e4, r3);
                return null == t3 ? void 0 : t3(n4);
              }), { keepPreviousData: y2 }), { data: P2, isLoading: O2, isValidating: A2, error: U2, size: x2, setSize: C2, mutate: E2 } = ie(((t4) => g2 && m2 ? { ...e3, ...r3, initialPage: f2.current + t4, pageSize: p2.current } : null), ((e4) => {
                const n4 = be(e4, r3);
                return null == t3 ? void 0 : t3(n4);
              })), I2 = (0, a2.useMemo)((() => g2 ? x2 : d2), [g2, x2, d2]), M2 = (0, a2.useCallback)(((e4) => {
                if (!g2) return h2(e4);
                C2(e4);
              }), [C2]), R2 = (0, a2.useMemo)((() => {
                var e4, t4;
                return g2 ? null != (e4 = null == P2 ? void 0 : P2.map(((e5) => null == e5 ? void 0 : e5.data)).flat()) ? e4 : [] : null != (t4 = null == b2 ? void 0 : b2.data) ? t4 : [];
              }), [g2, b2, P2]), z2 = (0, a2.useMemo)((() => {
                var e4, t4;
                return g2 ? (null == (e4 = null == P2 ? void 0 : P2[(null == P2 ? void 0 : P2.length) - 1]) ? void 0 : e4.total_count) || 0 : null != (t4 = null == b2 ? void 0 : b2.total_count) ? t4 : 0;
              }), [g2, b2, P2]), T2 = g2 ? O2 : _2, N2 = g2 ? A2 : w2, L2 = !!(g2 ? U2 : S2), j2 = (0, a2.useCallback)((() => {
                M2(((e4) => Math.max(0, e4 + 1)));
              }), [M2]), $2 = (0, a2.useCallback)((() => {
                M2(((e4) => Math.max(0, e4 - 1)));
              }), [M2]), F2 = (f2.current - 1) * p2.current, D2 = Math.ceil((z2 - F2) / p2.current), W2 = z2 - F2 * p2.current > I2 * p2.current, V2 = (I2 - 1) * p2.current > F2 * p2.current;
              return { data: R2, count: z2, isLoading: T2, isFetching: N2, isError: L2, page: I2, pageCount: D2, fetchPage: M2, fetchNext: j2, fetchPrevious: $2, hasNextPage: W2, hasPreviousPage: V2, revalidate: g2 ? () => E2() : () => k2(), setData: g2 ? (e4) => E2(e4, { revalidate: false }) : (e4) => k2(e4, { revalidate: false }) };
            }, Se = { data: void 0, count: void 0, isLoading: false, isFetching: false, isError: false, page: void 0, pageCount: void 0, fetchPage: void 0, fetchNext: void 0, fetchPrevious: void 0, hasNextPage: false, hasPreviousPage: false, revalidate: void 0, setData: void 0 }, ke = (e3) => {
              const { invitationList: t3, membershipList: n3, domains: r3, membershipRequests: o3, memberships: a3, invitations: s3 } = e3 || {}, { organization: c2, lastOrganizationMember: l2, lastOrganizationInvitation: u2 } = ye(), d2 = me(), h2 = we(r3, { initialPage: 1, pageSize: 10, keepPreviousData: false, infinite: false, enrollmentMode: void 0 }), f2 = we(o3, { initialPage: 1, pageSize: 10, status: "pending", keepPreviousData: false, infinite: false }), p2 = we(a3, { initialPage: 1, pageSize: 10, role: void 0, keepPreviousData: false, infinite: false }), m2 = we(s3, { initialPage: 1, pageSize: 10, status: ["pending"], keepPreviousData: false, infinite: false }), g2 = le(), y2 = !!(g2.loaded && d2 && c2), v2 = void 0 === r3 ? void 0 : { initialPage: h2.initialPage, pageSize: h2.pageSize, enrollmentMode: h2.enrollmentMode }, b2 = void 0 === o3 ? void 0 : { initialPage: f2.initialPage, pageSize: f2.pageSize, status: f2.status }, w2 = void 0 === a3 ? void 0 : { initialPage: p2.initialPage, pageSize: p2.pageSize, role: p2.role }, _2 = void 0 === s3 ? void 0 : { initialPage: m2.initialPage, pageSize: m2.pageSize, status: m2.status }, S2 = _e({ ...v2 }, null == c2 ? void 0 : c2.getDomains, { keepPreviousData: h2.keepPreviousData, infinite: h2.infinite, enabled: !!v2 }, { type: "domains", organizationId: null == c2 ? void 0 : c2.id }), k2 = _e({ ...b2 }, null == c2 ? void 0 : c2.getMembershipRequests, { keepPreviousData: f2.keepPreviousData, infinite: f2.infinite, enabled: !!b2 }, { type: "membershipRequests", organizationId: null == c2 ? void 0 : c2.id }), P2 = _e({ ...w2, paginated: true }, null == c2 ? void 0 : c2.getMemberships, { keepPreviousData: p2.keepPreviousData, infinite: p2.infinite, enabled: !!w2 }, { type: "members", organizationId: null == c2 ? void 0 : c2.id }), O2 = _e({ ..._2 }, null == c2 ? void 0 : c2.getInvitations, { keepPreviousData: m2.keepPreviousData, infinite: m2.infinite, enabled: !!_2 }, { type: "invitations", organizationId: null == c2 ? void 0 : c2.id }), A2 = g2.loaded ? () => {
                var e4;
                return null == (e4 = g2.organization) ? void 0 : e4.getPendingInvitations(t3);
              } : () => [], U2 = g2.loaded ? () => {
                var e4;
                return null == (e4 = g2.organization) ? void 0 : e4.getMemberships(n3);
              } : () => [];
              t3 && (0, i2.io)("invitationList in useOrganization", "Use the `invitations` property and return value instead.");
              const { data: x2, isValidating: C2, mutate: E2 } = te(y2 && t3 ? Pe("invites", c2, u2, t3) : null, A2);
              n3 && (0, i2.io)("membershipList in useOrganization", "Use the `memberships` property and return value instead.");
              const { data: I2, isValidating: M2, mutate: R2 } = te(y2 && n3 ? Pe("memberships", c2, l2, n3) : null, U2);
              return void 0 === c2 ? { isLoaded: false, organization: void 0, invitationList: void 0, membershipList: void 0, membership: void 0, domains: Se, membershipRequests: Se, memberships: Se, invitations: Se } : null === c2 ? { isLoaded: true, organization: null, invitationList: null, membershipList: null, membership: null, domains: null, membershipRequests: null, memberships: null, invitations: null } : !g2.loaded && c2 ? { isLoaded: true, organization: c2, invitationList: void 0, membershipList: void 0, membership: void 0, domains: Se, membershipRequests: Se, memberships: Se, invitations: Se } : { isLoaded: !M2 && !C2, organization: c2, membershipList: I2, membership: (z2 = d2.user.organizationMemberships, T2 = c2.id, z2.find(((e4) => e4.organization.id === T2))), invitationList: x2, unstable__mutate: () => {
                R2(), E2();
              }, domains: S2, membershipRequests: k2, memberships: P2, invitations: O2 };
              var z2, T2;
            };
            function Pe(e3, t3, n3, r3) {
              return [e3, t3.id, null == n3 ? void 0 : n3.id, null == n3 ? void 0 : n3.updatedAt, r3.offset, r3.limit].filter(Boolean).join("-");
            }
            var Oe = { data: void 0, count: void 0, isLoading: false, isFetching: false, isError: false, page: void 0, pageCount: void 0, fetchPage: void 0, fetchNext: void 0, fetchPrevious: void 0, hasNextPage: false, hasPreviousPage: false, revalidate: void 0, setData: void 0 }, Ae = (e3) => {
              const { userMemberships: t3, userInvitations: n3, userSuggestions: r3 } = e3 || {}, o3 = we(t3, { initialPage: 1, pageSize: 10, keepPreviousData: false, infinite: false }), a3 = we(n3, { initialPage: 1, pageSize: 10, status: "pending", keepPreviousData: false, infinite: false }), s3 = we(r3, { initialPage: 1, pageSize: 10, status: "pending", keepPreviousData: false, infinite: false }), c2 = le(), l2 = de(), u2 = void 0 === t3 ? void 0 : { initialPage: o3.initialPage, pageSize: o3.pageSize }, d2 = void 0 === n3 ? void 0 : { initialPage: a3.initialPage, pageSize: a3.pageSize, status: a3.status }, h2 = void 0 === r3 ? void 0 : { initialPage: s3.initialPage, pageSize: s3.pageSize, status: s3.status }, f2 = !(!c2.loaded || !l2), p2 = _e({ ...u2, paginated: true }, null == l2 ? void 0 : l2.getOrganizationMemberships, { keepPreviousData: o3.keepPreviousData, infinite: o3.infinite, enabled: !!u2 }, { type: "userMemberships", userId: null == l2 ? void 0 : l2.id }), m2 = _e({ ...d2 }, null == l2 ? void 0 : l2.getOrganizationInvitations, { keepPreviousData: a3.keepPreviousData, infinite: a3.infinite, enabled: !!d2 }, { type: "userInvitations", userId: null == l2 ? void 0 : l2.id }), g2 = _e({ ...h2 }, null == l2 ? void 0 : l2.getOrganizationSuggestions, { keepPreviousData: s3.keepPreviousData, infinite: s3.infinite, enabled: !!h2 }, { type: "userSuggestions", userId: null == l2 ? void 0 : l2.id });
              if (!f2) return { isLoaded: false, organizationList: void 0, createOrganization: void 0, setActive: void 0, userMemberships: Oe, userInvitations: Oe, userSuggestions: Oe };
              const y2 = { isLoaded: f2, organizationList: (v2 = l2.organizationMemberships, v2.map(((e4) => ({ membership: e4, organization: e4.organization })))), setActive: c2.setActive, createOrganization: c2.createOrganization, userMemberships: p2, userInvitations: m2, userSuggestions: g2 };
              var v2;
              return (0, i2.W1)(y2, "organizationList", "Use `userMemberships` instead."), y2;
            }, Ue = () => {
              (0, i2.io)("useOrganizations", "Use useOrganizationList, useOrganization, or useClerk instead.");
              const e3 = le();
              return e3.loaded ? { isLoaded: true, createOrganization: e3.createOrganization, getOrganizationMemberships: e3.getOrganizationMemberships, getOrganization: e3.getOrganization } : { isLoaded: false, createOrganization: void 0, getOrganizationMemberships: void 0, getOrganization: void 0 };
            }, xe = "undefined" != typeof window ? a2.useLayoutEffect : a2.useEffect;
          } }, o = {};
          function a(e2) {
            var t2 = o[e2];
            if (void 0 !== t2) return t2.exports;
            var n2 = o[e2] = { exports: {} };
            return i[e2].call(n2.exports, n2, n2.exports, a), n2.exports;
          }
          a.m = i, a.n = function(e2) {
            var t2 = e2 && e2.__esModule ? function() {
              return e2.default;
            } : function() {
              return e2;
            };
            return a.d(t2, { a: t2 }), t2;
          }, t = Object.getPrototypeOf ? function(e2) {
            return Object.getPrototypeOf(e2);
          } : function(e2) {
            return e2.__proto__;
          }, a.t = function(n2, r2) {
            if (1 & r2 && (n2 = this(n2)), 8 & r2) return n2;
            if ("object" == typeof n2 && n2) {
              if (4 & r2 && n2.__esModule) return n2;
              if (16 & r2 && "function" == typeof n2.then) return n2;
            }
            var i2 = /* @__PURE__ */ Object.create(null);
            a.r(i2);
            var o2 = {};
            e = e || [null, t({}), t([]), t(t)];
            for (var s2 = 2 & r2 && n2; "object" == typeof s2 && !~e.indexOf(s2); s2 = t(s2)) Object.getOwnPropertyNames(s2).forEach((function(e2) {
              o2[e2] = function() {
                return n2[e2];
              };
            }));
            return o2.default = function() {
              return n2;
            }, a.d(i2, o2), i2;
          }, a.d = function(e2, t2) {
            for (var n2 in t2) a.o(t2, n2) && !a.o(e2, n2) && Object.defineProperty(e2, n2, { enumerable: true, get: t2[n2] });
          }, a.f = {}, a.e = function(e2) {
            return Promise.all(Object.keys(a.f).reduce((function(t2, n2) {
              return a.f[n2](e2, t2), t2;
            }), []));
          }, a.u = function(e2) {
            return ({ 45: "userprofile", 65: "ui-common", 96: "vendors", 128: "zxcvbn-common", 278: "userbutton", 417: "signin", 536: "oneTap", 578: "organizationlist", 592: "zxcvbn-ts-core", 703: "organizationswitcher", 787: "signup", 796: "impersonationfab", 837: "organizationprofile", 862: "createorganization" }[e2] || e2) + "_" + a.h().slice(0, 6) + "_4.73.14.js";
          }, a.h = function() {
            return "176afd7d210394bc6ad4";
          }, a.g = (function() {
            if ("object" == typeof globalThis) return globalThis;
            try {
              return this || new Function("return this")();
            } catch (e2) {
              if ("object" == typeof window) return window;
            }
          })(), a.o = function(e2, t2) {
            return Object.prototype.hasOwnProperty.call(e2, t2);
          }, n = {}, r = "@clerk/clerk-js:", a.l = function(e2, t2, i2, o2) {
            if (n[e2]) n[e2].push(t2);
            else {
              var s2, c;
              if (void 0 !== i2) for (var l = document.getElementsByTagName("script"), u = 0; u < l.length; u++) {
                var d = l[u];
                if (d.getAttribute("src") == e2 || d.getAttribute("data-webpack") == r + i2) {
                  s2 = d;
                  break;
                }
              }
              s2 || (c = true, (s2 = document.createElement("script")).charset = "utf-8", s2.timeout = 120, a.nc && s2.setAttribute("nonce", a.nc), s2.setAttribute("data-webpack", r + i2), s2.src = e2), n[e2] = [t2];
              var h = function(t3, r2) {
                s2.onerror = s2.onload = null, clearTimeout(f);
                var i3 = n[e2];
                if (delete n[e2], s2.parentNode && s2.parentNode.removeChild(s2), i3 && i3.forEach((function(e3) {
                  return e3(r2);
                })), t3) return t3(r2);
              }, f = setTimeout(h.bind(null, void 0, { type: "timeout", target: s2 }), 12e4);
              s2.onerror = h.bind(null, s2.onerror), s2.onload = h.bind(null, s2.onload), c && document.head.appendChild(s2);
            }
          }, a.r = function(e2) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
          }, (function() {
            var e2;
            a.g.importScripts && (e2 = a.g.location + "");
            var t2 = a.g.document;
            if (!e2 && t2 && (t2.currentScript && (e2 = t2.currentScript.src), !e2)) {
              var n2 = t2.getElementsByTagName("script");
              if (n2.length) for (var r2 = n2.length - 1; r2 > -1 && (!e2 || !/^http(s?):/.test(e2)); ) e2 = n2[r2--].src;
            }
            if (!e2) throw new Error("Automatic publicPath is not supported in this browser");
            e2 = e2.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/"), a.p = e2;
          })(), (function() {
            var e2 = { 468: 0 };
            a.f.j = function(t3, n3) {
              var r2 = a.o(e2, t3) ? e2[t3] : void 0;
              if (0 !== r2) if (r2) n3.push(r2[2]);
              else {
                var i2 = new Promise((function(n4, i3) {
                  r2 = e2[t3] = [n4, i3];
                }));
                n3.push(r2[2] = i2);
                var o2 = a.p + a.u(t3), s2 = new Error();
                a.l(o2, (function(n4) {
                  if (a.o(e2, t3) && (0 !== (r2 = e2[t3]) && (e2[t3] = void 0), r2)) {
                    var i3 = n4 && ("load" === n4.type ? "missing" : n4.type), o3 = n4 && n4.target && n4.target.src;
                    s2.message = "Loading chunk " + t3 + " failed.\n(" + i3 + ": " + o3 + ")", s2.name = "ChunkLoadError", s2.type = i3, s2.request = o3, r2[1](s2);
                  }
                }), "chunk-" + t3, t3);
              }
            };
            var t2 = function(t3, n3) {
              var r2, i2, o2 = n3[0], s2 = n3[1], c = n3[2], l = 0;
              if (o2.some((function(t4) {
                return 0 !== e2[t4];
              }))) {
                for (r2 in s2) a.o(s2, r2) && (a.m[r2] = s2[r2]);
                c && c(a);
              }
              for (t3 && t3(n3); l < o2.length; l++) i2 = o2[l], a.o(e2, i2) && e2[i2] && e2[i2][0](), e2[i2] = 0;
            }, n2 = globalThis.webpackChunk_clerk_clerk_js = globalThis.webpackChunk_clerk_clerk_js || [];
            n2.forEach(t2.bind(null, 0)), n2.push = t2.bind(null, n2.push.bind(n2));
          })();
          var s = {};
          return (function() {
            "use strict";
            a.r(s);
            {
              const e3 = /(^.*\/@clerk\/clerk-js@)(.+?)(\/dist.*)/;
              (() => {
                try {
                  const t3 = new URL(document.currentScript.src);
                  let n3 = new URL(t3.href.split("/").slice(0, -1).join("/")).href;
                  n3 += n3.endsWith("/") ? "" : "/", a.p = n3.replace(e3, "$14.73.14$3");
                } catch (t3) {
                }
              })();
            }
            a(8989);
            var e2 = a(7643), t2 = a(5547), n2 = a(5098), r2 = a(1101);
            function i2(e3, t3) {
              return (function(e4, t4) {
                if (!e4 && t4 || e4 && !t4) return true;
                if (!e4 && e4 === t4) return false;
                if (!e4 || !t4) return true;
                try {
                  if (r2.Kj.isClientResource(e4)) return (function(e5, t5) {
                    return e5.id !== t5.id || e5.updatedAt.getTime() < t5.updatedAt.getTime() || e5.sessions.length !== t5.sessions.length;
                  })(e4, t4);
                  if (r2.Nn.isSessionResource(e4)) return (function(e5, t5) {
                    return e5.id !== t5.id || e5.updatedAt.getTime() < t5.updatedAt.getTime() || (function(e6, t6) {
                      var n3, r3, i3, o3, a2, s2;
                      if (e6.lastActiveOrganizationId !== t6.lastActiveOrganizationId) return true;
                      const c2 = null === (r3 = null === (n3 = e6.user) || void 0 === n3 ? void 0 : n3.organizationMemberships) || void 0 === r3 ? void 0 : r3.find(((t7) => t7.organization.id === e6.lastActiveOrganizationId)), l2 = null === (o3 = null === (i3 = t6.user) || void 0 === i3 ? void 0 : i3.organizationMemberships) || void 0 === o3 ? void 0 : o3.find(((t7) => t7.organization.id === e6.lastActiveOrganizationId));
                      return (null == c2 ? void 0 : c2.role) !== (null == l2 ? void 0 : l2.role) || (null === (a2 = null == c2 ? void 0 : c2.permissions) || void 0 === a2 ? void 0 : a2.length) !== (null === (s2 = null == l2 ? void 0 : l2.permissions) || void 0 === s2 ? void 0 : s2.length);
                    })(t5, e5);
                  })(e4, t4);
                  if (r2.KJ.isUserResource(e4)) return (function(e5, t5) {
                    return e5.id !== t5.id || e5.updatedAt.getTime() < t5.updatedAt.getTime() || (function(e6, t6) {
                      var n3, r3;
                      return e6.organizationMemberships.length !== t6.organizationMemberships.length || (null === (n3 = e6.organizationMemberships[0]) || void 0 === n3 ? void 0 : n3.updatedAt) !== (null === (r3 = t6.organizationMemberships[0]) || void 0 === r3 ? void 0 : r3.updatedAt);
                    })(t5, e5);
                  })(e4, t4);
                } catch (n3) {
                  return true;
                }
                return true;
              })(e3, t3) ? t3 : e3;
            }
            var o2 = a(6480), c = a(5882);
            var l = a(600), u = a(9859), d = a(2692);
            class h {
              constructor() {
                this.lock = (0, n2.F1)("clerk.lock.refreshSessionToken"), this.workerTimers = (0, e2.fx)(), this.timerId = null;
              }
              startPollingForSessionToken(e3) {
                this.timerId || (this.timerId = this.workerTimers.setInterval((() => {
                  this.lock.acquireLockAndRun(e3);
                }), 5e3));
              }
              stopPollingForSessionToken() {
                this.timerId && (this.workerTimers.clearInterval(this.timerId), this.timerId = null);
              }
            }
            class f {
              constructor(e3) {
                this.clerk = e3, this.cookies = (0, n2.J4)(), this.poller = null, d.B.on(d.A.TokenUpdate, (({ token: e4 }) => {
                  this.updateSessionCookie(null == e4 ? void 0 : e4.getRawString());
                })), this.refreshTokenOnVisibilityChange(), this.startPollingForToken();
              }
              setEnvironment(e3) {
                this.environment = e3, this.setClientUatCookieForDevelopmentInstances();
              }
              async setAuthCookiesFromSession(e3) {
                this.updateSessionCookie(await (null == e3 ? void 0 : e3.getToken())), this.setClientUatCookieForDevelopmentInstances();
              }
              startPollingForToken() {
                this.poller || (this.poller = new h()), this.poller.startPollingForSessionToken((() => this.refreshSessionToken()));
              }
              refreshTokenOnVisibilityChange() {
                (0, n2.M)() && document.addEventListener("visibilitychange", (() => {
                  "visible" === document.visibilityState && this.refreshSessionToken();
                }));
              }
              async refreshSessionToken() {
                if ((0, n2.M)() && this.clerk.session) try {
                  this.updateSessionCookie(await this.getNewToken());
                } catch (e3) {
                  return this.handleGetTokenError(e3);
                }
              }
              getNewToken() {
                var e3;
                return null === (e3 = this.clerk.session) || void 0 === e3 ? void 0 : e3.getToken();
              }
              setSessionCookie(e3) {
                this.cookies.setSessionCookie(e3);
              }
              updateSessionCookie(e3) {
                return e3 ? this.setSessionCookie(e3) : this.removeSessionCookie();
              }
              removeSessionCookie() {
                this.cookies.removeSessionCookie();
              }
              setClientUatCookieForDevelopmentInstances() {
                this.environment && this.environment.isDevelopmentOrStaging() && this.inCustomDevelopmentDomain() && this.cookies.setClientUatCookie(this.clerk.client);
              }
              inCustomDevelopmentDomain() {
                const e3 = this.clerk.frontendApi.replace("clerk.", "");
                return !window.location.host.endsWith(e3);
              }
              handleGetTokenError(e3) {
                (0, u.$R)(e3) || (0, c.a2)(e3.message || e3), (0, u.nc)(e3) ? this.clerk.handleUnauthenticated() : (0, u.TX)(e3) || (0, c.a2)(e3.toString());
              }
            }
            var p, m, g, y, v, b, w, _, S, k, P, O, A, U, x, C, E, I, M, R, z, T, N, L, j, $, F, D, W, V, B, J, q, G, H, K, Y, Z, Q, X, ee, te, ne, re = a(5864), ie = function(e3, t3, n3, r3) {
              if ("a" === n3 && !r3) throw new TypeError("Private accessor was defined without a getter");
              if ("function" == typeof t3 ? e3 !== t3 || !r3 : !t3.has(e3)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
              return "m" === n3 ? r3 : "a" === n3 ? r3.call(e3) : r3 ? r3.value : t3.get(e3);
            }, oe = function(e3, t3, n3, r3, i3) {
              if ("m" === r3) throw new TypeError("Private method is not writable");
              if ("a" === r3 && !i3) throw new TypeError("Private accessor was defined without a setter");
              if ("function" == typeof t3 ? e3 !== t3 || !i3 : !t3.has(e3)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
              return "a" === r3 ? i3.call(e3, n3) : i3 ? i3.value = n3 : t3.set(e3, n3), n3;
            };
            const ae = { polling: true, standardBrowser: true, touchSession: true, isSatellite: false, signInUrl: void 0, signUpUrl: void 0, afterSignInUrl: void 0, afterSignUpUrl: void 0, isInterstitial: false };
            class se {
              get version() {
                return p.version;
              }
              set sdkMetadata(e3) {
                p.sdkMetadata = e3;
              }
              get sdkMetadata() {
                return p.sdkMetadata;
              }
              get loaded() {
                return ie(this, P, "f");
              }
              get isSatellite() {
                return !!(0, n2.M)() && (0, e2.VK)(ie(this, x, "f").isSatellite, new URL(window.location.href), false);
              }
              get domain() {
                if ((0, n2.M)()) {
                  const t3 = (0, e2.Wl)((0, e2.VK)(ie(this, m, "f"), new URL(window.location.href)));
                  return "production" === ie(this, k, "f") ? (0, e2.TV)(t3) : t3;
                }
                return "";
              }
              get proxyUrl() {
                if ((0, n2.M)()) {
                  const t3 = (0, e2.VK)(ie(this, g, "f"), new URL(window.location.href));
                  return (0, e2._c)(t3) || n2.sb.throwInvalidProxyUrl({ url: t3 }), (0, e2.zz)(t3);
                }
                return "";
              }
              get instanceType() {
                return ie(this, k, "f");
              }
              get isStandardBrowser() {
                return ie(this, x, "f").standardBrowser || false;
              }
              get experimental_canUseCaptcha() {
                return (0, e2.io)("experimental_canUseCaptcha", "This is will be dropped in the next major version"), !!ie(this, _, "f") && ie(this, _, "f").userSettings.signUp.captcha_enabled && ie(this, x, "f").standardBrowser && "production" === ie(this, k, "f");
              }
              get experimental_captchaSiteKey() {
                return (0, e2.io)("experimental_captchaSiteKey", "This is will be dropped in the next major version"), ie(this, _, "f") ? ie(this, _, "f").displayConfig.captchaPublicKey : null;
              }
              get experimental_captchaURL() {
                return (0, e2.io)("experimental_captchaURL", "This is will be dropped in the next major version"), ie(this, S, "f") ? ie(this, S, "f").buildUrl({ path: "cloudflare/turnstile/v0/api.js", pathPrefix: "", search: "?render=explicit" }).toString() : null;
              }
              constructor(a2, s2) {
                if (this.internal_last_error = null, m.set(this, void 0), g.set(this, void 0), y.set(this, null), v.set(this, null), b.set(this, void 0), w.set(this, null), _.set(this, void 0), S.set(this, void 0), k.set(this, void 0), P.set(this, false), O.set(this, null), A.set(this, null), U.set(this, []), x.set(this, {}), C.set(this, null), this.getFapiClient = () => ie(this, S, "f"), this.isReady = () => ie(this, P, "f"), this.load = async (e3) => {
                  ie(this, P, "f") || (oe(this, x, { ...ae, ...e3 }, "f"), ie(this, x, "f").standardBrowser ? oe(this, P, await ie(this, F, "f").call(this), "f") : oe(this, P, await ie(this, D, "f").call(this), "f"));
                }, this.signOut = async (e3, t3) => {
                  var r3;
                  if (!this.client || 0 === this.client.sessions.length) return;
                  const i3 = "function" == typeof e3 ? e3 : void 0, o3 = e3 && "object" == typeof e3 ? e3 : t3 || {};
                  if (!o3.sessionId || 1 === this.client.activeSessions.length) return await this.client.destroy(), this.setActive({ session: null, beforeEmit: (0, n2.ez)(i3) });
                  const a3 = this.client.activeSessions.find(((e4) => e4.id === o3.sessionId)), s3 = (null == a3 ? void 0 : a3.id) && (null === (r3 = this.session) || void 0 === r3 ? void 0 : r3.id) === a3.id;
                  return await (null == a3 ? void 0 : a3.remove()), s3 ? this.setActive({ session: null, beforeEmit: (0, n2.ez)(i3) }) : void 0;
                }, this.openGoogleOneTap = (e3) => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted({ preloadHint: "GoogleOneTap" }).then(((t3) => t3.openModal("googleOneTap", e3 || {})));
                }, this.closeGoogleOneTap = () => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted().then(((e3) => e3.closeModal("googleOneTap")));
                }, this.openSignIn = (e3) => {
                  if (this.assertComponentsReady(ie(this, b, "f")), (0, n2.QP)(this, ie(this, _, "f")) && "development" === ie(this, k, "f")) return console.info(re.A.cannotOpenSignUpOrSignUp);
                  ie(this, b, "f").ensureMounted({ preloadHint: "SignIn" }).then(((t3) => t3.openModal("signIn", e3 || {})));
                }, this.closeSignIn = () => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted().then(((e3) => e3.closeModal("signIn")));
                }, this.openSignUp = (e3) => {
                  if (this.assertComponentsReady(ie(this, b, "f")), (0, n2.QP)(this, ie(this, _, "f")) && "development" === ie(this, k, "f")) return console.info(re.A.cannotOpenSignUpOrSignUp);
                  ie(this, b, "f").ensureMounted({ preloadHint: "SignUp" }).then(((t3) => t3.openModal("signUp", e3 || {})));
                }, this.closeSignUp = () => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted().then(((e3) => e3.closeModal("signUp")));
                }, this.openUserProfile = (e3) => {
                  if (this.assertComponentsReady(ie(this, b, "f")), (0, n2.vV)(this) && "development" === ie(this, k, "f")) return console.info(re.A.cannotOpenUserProfile);
                  ie(this, b, "f").ensureMounted({ preloadHint: "UserProfile" }).then(((t3) => t3.openModal("userProfile", e3 || {})));
                }, this.closeUserProfile = () => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted().then(((e3) => e3.closeModal("userProfile")));
                }, this.openOrganizationProfile = (e3) => {
                  if (this.assertComponentsReady(ie(this, b, "f")), (0, n2.FW)(this) && "development" === ie(this, k, "f")) return console.info(re.A.cannotOpenOrgProfile);
                  ie(this, b, "f").ensureMounted({ preloadHint: "OrganizationProfile" }).then(((t3) => t3.openModal("organizationProfile", e3 || {})));
                }, this.closeOrganizationProfile = () => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted().then(((e3) => e3.closeModal("organizationProfile")));
                }, this.openCreateOrganization = (e3) => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted({ preloadHint: "CreateOrganization" }).then(((t3) => t3.openModal("createOrganization", e3 || {})));
                }, this.closeCreateOrganization = () => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted().then(((e3) => e3.closeModal("createOrganization")));
                }, this.mountSignIn = (e3, t3) => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted({ preloadHint: "SignIn" }).then(((n3) => n3.mountComponent({ name: "SignIn", appearanceKey: "signIn", node: e3, props: t3 })));
                }, this.unmountSignIn = (e3) => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted().then(((t3) => t3.unmountComponent({ node: e3 })));
                }, this.mountSignUp = (e3, t3) => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted({ preloadHint: "SignUp" }).then(((n3) => n3.mountComponent({ name: "SignUp", appearanceKey: "signUp", node: e3, props: t3 })));
                }, this.unmountSignUp = (e3) => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted().then(((t3) => t3.unmountComponent({ node: e3 })));
                }, this.mountUserProfile = (e3, t3) => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted({ preloadHint: "UserProfile" }).then(((n3) => n3.mountComponent({ name: "UserProfile", appearanceKey: "userProfile", node: e3, props: t3 })));
                }, this.unmountUserProfile = (e3) => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted().then(((t3) => t3.unmountComponent({ node: e3 })));
                }, this.mountOrganizationProfile = (e3, t3) => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted({ preloadHint: "OrganizationProfile" }).then(((n3) => n3.mountComponent({ name: "OrganizationProfile", appearanceKey: "userProfile", node: e3, props: t3 })));
                }, this.unmountOrganizationProfile = (e3) => {
                  this.assertComponentsReady(ie(this, b, "f")), ie(this, b, "f").ensureMounted().then(((t3) => t3.unmountComponent({ node: e3 })));
                }, this.mountCreateOrganization = (e3, t3) => {
                  var n3;
                  this.assertComponentsReady(ie(this, b, "f")), null === (n3 = ie(this, b, "f")) || void 0 === n3 || n3.ensureMounted({ preloadHint: "CreateOrganization" }).then(((n4) => n4.mountComponent({ name: "CreateOrganization", appearanceKey: "createOrganization", node: e3, props: t3 })));
                }, this.unmountCreateOrganization = (e3) => {
                  var t3;
                  this.assertComponentsReady(ie(this, b, "f")), null === (t3 = ie(this, b, "f")) || void 0 === t3 || t3.ensureMounted().then(((t4) => t4.unmountComponent({ node: e3 })));
                }, this.mountOrganizationSwitcher = (e3, t3) => {
                  var n3;
                  this.assertComponentsReady(ie(this, b, "f")), null === (n3 = ie(this, b, "f")) || void 0 === n3 || n3.ensureMounted({ preloadHint: "OrganizationSwitcher" }).then(((n4) => n4.mountComponent({ name: "OrganizationSwitcher", appearanceKey: "organizationSwitcher", node: e3, props: t3 })));
                }, this.unmountOrganizationSwitcher = (e3) => {
                  var t3;
                  this.assertComponentsReady(ie(this, b, "f")), null === (t3 = ie(this, b, "f")) || void 0 === t3 || t3.ensureMounted().then(((t4) => t4.unmountComponent({ node: e3 })));
                }, this.mountOrganizationList = (e3, t3) => {
                  var n3;
                  this.assertComponentsReady(ie(this, b, "f")), null === (n3 = ie(this, b, "f")) || void 0 === n3 || n3.ensureMounted({ preloadHint: "OrganizationList" }).then(((n4) => n4.mountComponent({ name: "OrganizationList", appearanceKey: "organizationList", node: e3, props: t3 })));
                }, this.unmountOrganizationList = (e3) => {
                  var t3;
                  this.assertComponentsReady(ie(this, b, "f")), null === (t3 = ie(this, b, "f")) || void 0 === t3 || t3.ensureMounted().then(((t4) => t4.unmountComponent({ node: e3 })));
                }, this.mountUserButton = (e3, t3) => {
                  var n3;
                  this.assertComponentsReady(ie(this, b, "f")), null === (n3 = ie(this, b, "f")) || void 0 === n3 || n3.ensureMounted({ preloadHint: "UserButton" }).then(((n4) => n4.mountComponent({ name: "UserButton", appearanceKey: "userButton", node: e3, props: t3 })));
                }, this.unmountUserButton = (e3) => {
                  var t3;
                  this.assertComponentsReady(ie(this, b, "f")), null === (t3 = ie(this, b, "f")) || void 0 === t3 || t3.ensureMounted().then(((t4) => t4.unmountComponent({ node: e3 })));
                }, this.setActive = async ({ session: t3, organization: r3, beforeEmit: i3 }) => {
                  var o3;
                  if (!this.client) throw new Error("setActive is being called before the client is loaded. Wait for init.");
                  if (void 0 === t3 && !this.session) throw new Error("setActive should either be called with a session param or there should be already an active session.");
                  const a3 = "undefined" != typeof window && "function" == typeof window.__unstable__onBeforeSetActive ? window.__unstable__onBeforeSetActive : e2.lQ, s3 = "undefined" != typeof window && "function" == typeof window.__unstable__onAfterSetActive ? window.__unstable__onAfterSetActive : e2.lQ;
                  "string" == typeof t3 && (t3 = this.client.sessions.find(((e3) => e3.id === t3)) || null);
                  let c2 = void 0 === t3 ? this.session : t3;
                  if (c2 && void 0 !== r3) {
                    const e3 = "string" == typeof r3 ? r3 : null == r3 ? void 0 : r3.id;
                    c2.lastActiveOrganizationId = e3 || null;
                  }
                  this.session && null === c2 && ie(this, q, "f").call(this), a3(), !(0, n2.Z$)() && ie(this, x, "f").standardBrowser || (await ie(this, B, "f").call(this, c2), c2 = ie(this, Z, "f").call(this, null == c2 ? void 0 : c2.id)), await (null === (o3 = ie(this, y, "f")) || void 0 === o3 ? void 0 : o3.setAuthCookiesFromSession(c2));
                  const l2 = (0, n2.T0)();
                  i3 && (l2.startTracking(), ie(this, H, "f").call(this), await i3(c2), l2.stopTracking()), l2.isUnloading() || (ie(this, Y, "f").call(this, c2), ie(this, J, "f").call(this), s3(), ie(this, G, "f").call(this));
                }, this.setSession = async (t3, n3) => ((0, e2.io)("setSession", "Use `setActive` instead.", "clerk:setSession"), this.setActive({ session: t3, beforeEmit: n3 })), this.addListener = (e3) => (e3 = /* @__PURE__ */ (function(e4) {
                  let t3;
                  return (n3) => {
                    var r3, o3;
                    t3 || (t3 = { ...n3 }), t3 = { ...(r3 = t3, o3 = n3, { client: i2(r3.client, o3.client), session: i2(r3.session, o3.session), user: i2(r3.user, o3.user), organization: i2(r3.organization, o3.organization), lastOrganizationInvitation: i2(r3.lastOrganizationInvitation, o3.lastOrganizationInvitation), lastOrganizationMember: i2(r3.lastOrganizationMember, o3.lastOrganizationMember) }) }, e4(t3);
                  };
                })(e3), ie(this, U, "f").push(e3), this.client && e3({ client: this.client, session: this.session, user: this.user, organization: this.organization, lastOrganizationInvitation: ie(this, O, "f"), lastOrganizationMember: ie(this, A, "f") }), () => {
                  oe(this, U, ie(this, U, "f").filter(((t3) => t3 !== e3)), "f");
                }), this.navigate = async (e3) => {
                  if (!e3 || !(0, n2.M)()) return;
                  let t3 = new URL(e3, window.location.href);
                  "http:" !== t3.protocol && "https:" !== t3.protocol && (console.warn("Clerk: Not a valid protocol. Redirecting to /"), t3 = new URL("/", window.location.href));
                  const r3 = ie(this, x, "f").navigate;
                  if (t3.origin === window.location.origin && r3) return await r3((0, n2.FV)(t3));
                  (0, n2.y7)(t3);
                }, E.set(this, (async () => {
                  if (!(0, n2.M)()) return;
                  const t3 = new URLSearchParams({ [o2.rt]: "true" }), r3 = (0, n2.hI)(o2.MC);
                  r3 && (0, e2.RE)(r3) || (0, c.U6)();
                  const i3 = (0, n2.kZ)({ base: (0, n2.hI)(o2.MC), searchParams: t3 }, { stringify: true });
                  return this.navigate(this.buildUrlWithAuth(i3));
                })), this.redirectWithAuth = async (e3) => {
                  if ((0, n2.M)()) return this.navigate(this.buildUrlWithAuth(e3));
                }, this.redirectToSignIn = async (e3) => {
                  if ((0, n2.M)()) return this.navigate(this.buildSignInUrl(e3));
                }, this.redirectToSignUp = async (e3) => {
                  if ((0, n2.M)()) return this.navigate(this.buildSignUpUrl(e3));
                }, this.redirectToUserProfile = async () => {
                  if ((0, n2.M)()) return this.navigate(this.buildUserProfileUrl());
                }, this.redirectToCreateOrganization = async () => {
                  if ((0, n2.M)()) return this.navigate(this.buildCreateOrganizationUrl());
                }, this.redirectToOrganizationProfile = async () => {
                  if ((0, n2.M)()) return this.navigate(this.buildOrganizationProfileUrl());
                }, this.redirectToHome = async () => {
                  if ((0, n2.M)()) return this.navigate(this.buildHomeUrl());
                }, this.handleMagicLinkVerification = async (t3, i3) => {
                  if ((0, e2.io)("handleMagicLinkVerification", "Use `handleEmailLinkVerification` instead."), !this.client) return;
                  const o3 = (0, n2.hI)("__clerk_status");
                  if ("expired" === o3) throw new r2.gS(r2.dB.Expired);
                  if ("verified" !== o3) throw new r2.gS(r2.dB.Failed);
                  const a3 = (0, n2.hI)("__clerk_created_session"), { signIn: s3, signUp: c2, sessions: l2 } = this.client, u2 = l2.some(((e3) => e3.id === a3)), d2 = "needs_second_factor" === s3.status || "missing_requirements" === c2.status, h2 = (e3) => i3 && "function" == typeof i3 ? i3(e3) : this.navigate(e3), f2 = t3.redirectUrlComplete ? () => h2(t3.redirectUrlComplete) : e2.lQ, p2 = t3.redirectUrl ? () => h2(t3.redirectUrl) : e2.lQ;
                  return u2 ? this.setActive({ session: a3, beforeEmit: f2 }) : d2 ? p2() : ("function" == typeof t3.onVerifiedOnOtherDevice && t3.onVerifiedOnOtherDevice(), null);
                }, this.handleEmailLinkVerification = async (t3, i3) => {
                  if (!this.client) return;
                  const o3 = (0, n2.hI)("__clerk_status");
                  if ("expired" === o3) throw new r2.NZ(r2.Ys.Expired);
                  if ("verified" !== o3) throw new r2.NZ(r2.Ys.Failed);
                  const a3 = (0, n2.hI)("__clerk_created_session"), { signIn: s3, signUp: c2, sessions: l2 } = this.client, u2 = l2.some(((e3) => e3.id === a3)), d2 = "needs_second_factor" === s3.status || "missing_requirements" === c2.status, h2 = (e3) => i3 && "function" == typeof i3 ? i3(e3) : this.navigate(e3), f2 = t3.redirectUrlComplete ? () => h2(t3.redirectUrlComplete) : e2.lQ, p2 = t3.redirectUrl ? () => h2(t3.redirectUrl) : e2.lQ;
                  return u2 ? this.setActive({ session: a3, beforeEmit: f2 }) : d2 ? p2() : ("function" == typeof t3.onVerifiedOnOtherDevice && t3.onVerifiedOnOtherDevice(), null);
                }, this.handleGoogleOneTapCallback = async (e3, t3, n3) => {
                  if (!ie(this, P, "f") || !ie(this, _, "f") || !this.client) return;
                  const { signIn: r3, signUp: i3 } = this.client, o3 = "identifier" in (e3 || {}) ? e3 : r3, a3 = "missingFields" in (e3 || {}) ? e3 : i3;
                  return this._handleRedirectCallback(t3, { signUp: a3, signIn: o3, navigate: (e4) => n3 && "function" == typeof n3 ? n3(this.buildUrlWithAuth(e4)) : this.navigate(this.buildUrlWithAuth(e4)) });
                }, this._handleRedirectCallback = async (e3, { signIn: r3, signUp: i3, navigate: o3 }) => {
                  var a3, s3, l2, u2, d2, h2;
                  if (!this.loaded || !ie(this, _, "f") || !this.client) return;
                  const { displayConfig: f2 } = ie(this, _, "f"), { firstFactorVerification: p2 } = r3, { externalAccount: m2 } = i3.verifications, g2 = { status: i3.status, missingFields: i3.missingFields, externalAccountStatus: m2.status, externalAccountErrorCode: null === (a3 = m2.error) || void 0 === a3 ? void 0 : a3.code, externalAccountSessionId: null === (l2 = null === (s3 = m2.error) || void 0 === s3 ? void 0 : s3.meta) || void 0 === l2 ? void 0 : l2.sessionId, sessionId: i3.createdSessionId }, y2 = { status: r3.status, firstFactorVerificationStatus: p2.status, firstFactorVerificationErrorCode: null === (u2 = p2.error) || void 0 === u2 ? void 0 : u2.code, firstFactorVerificationSessionId: null === (h2 = null === (d2 = p2.error) || void 0 === d2 ? void 0 : d2.meta) || void 0 === h2 ? void 0 : h2.sessionId, sessionId: r3.createdSessionId }, v2 = (e4) => () => o3(e4), b2 = v2(f2.signInUrl), w2 = v2(f2.signUpUrl), S2 = v2(e3.firstFactorUrl || (0, n2.kZ)({ base: f2.signInUrl, hashPath: "/factor-one" }, { stringify: true })), k2 = v2(e3.secondFactorUrl || (0, n2.kZ)({ base: f2.signInUrl, hashPath: "/factor-two" }, { stringify: true })), P2 = v2(e3.resetPasswordUrl || (0, n2.kZ)({ base: f2.signInUrl, hashPath: "/reset-password" }, { stringify: true })), O2 = v2(e3.afterSignInUrl || e3.redirectUrl || f2.afterSignInUrl), A2 = v2(e3.afterSignUpUrl || e3.redirectUrl || f2.afterSignUpUrl), U2 = v2(e3.continueSignUpUrl || (0, n2.kZ)({ base: f2.signUpUrl, hashPath: "/continue" }, { stringify: true })), x2 = ({ missingFields: r4 }) => r4.length ? U2() : (0, t2.A)({ signUp: i3, verifyEmailPath: e3.verifyEmailAddressUrl || (0, n2.kZ)({ base: f2.signUpUrl, hashPath: "/verify-email-address" }, { stringify: true }), verifyPhonePath: e3.verifyPhoneNumberUrl || (0, n2.kZ)({ base: f2.signUpUrl, hashPath: "/verify-phone-number" }, { stringify: true }), navigate: o3 });
                  if ("complete" === y2.status) return this.setActive({ session: y2.sessionId, beforeEmit: O2 });
                  if ("transferable" === g2.externalAccountStatus && "external_account_exists" === g2.externalAccountErrorCode) {
                    const e4 = await r3.create({ transfer: true });
                    switch (e4.status) {
                      case "complete":
                        return this.setActive({ session: e4.createdSessionId, beforeEmit: O2 });
                      case "needs_first_factor":
                        return S2();
                      case "needs_second_factor":
                        return k2();
                      case "needs_new_password":
                        return P2();
                      default:
                        (0, c.z$)("sign in");
                    }
                  }
                  const C2 = "user_locked" === y2.firstFactorVerificationErrorCode;
                  if ("user_locked" === g2.externalAccountErrorCode) return w2();
                  if (C2) return b2();
                  if ("needs_first_factor" === y2.status) return S2();
                  if ("needs_new_password" === y2.status) return P2();
                  if ("transferable" === y2.firstFactorVerificationStatus) {
                    const e4 = await i3.create({ transfer: true });
                    switch (e4.status) {
                      case "complete":
                        return this.setActive({ session: e4.createdSessionId, beforeEmit: A2 });
                      case "missing_requirements":
                        return x2({ missingFields: e4.missingFields });
                      default:
                        (0, c.z$)("sign in");
                    }
                  }
                  if ("complete" === g2.status) return this.setActive({ session: g2.sessionId, beforeEmit: A2 });
                  if ("needs_second_factor" === y2.status) return k2();
                  if (("failed" === g2.externalAccountStatus || "unverified" === g2.externalAccountStatus) && "identifier_already_signed_in" === g2.externalAccountErrorCode && g2.externalAccountSessionId || "failed" === y2.firstFactorVerificationStatus && "identifier_already_signed_in" === y2.firstFactorVerificationErrorCode && y2.firstFactorVerificationSessionId) {
                    const e4 = y2.firstFactorVerificationSessionId || g2.externalAccountSessionId;
                    if (e4) return this.setActive({ session: e4, beforeEmit: O2 });
                  }
                  return (0, n2.rM)(i3) ? w2() : "verified" === g2.externalAccountStatus && "missing_requirements" === g2.status ? x2({ missingFields: i3.missingFields }) : b2();
                }, this.handleRedirectCallback = async (e3 = {}, t3) => {
                  if (!this.loaded || !ie(this, _, "f") || !this.client) return;
                  const { signIn: n3, signUp: r3 } = this.client;
                  return this._handleRedirectCallback(e3, { signUp: r3, signIn: n3, navigate: (e4) => t3 && "function" == typeof t3 ? t3(e4) : this.navigate(e4) });
                }, this.handleUnauthenticated = async (e3 = { broadcast: true }) => {
                  if (!this.client || !this.session) return;
                  const t3 = await r2.Kj.getInstance().fetch();
                  return this.updateClient(t3), this.session ? void 0 : (e3.broadcast && ie(this, q, "f").call(this), this.setActive({ session: null }));
                }, this.authenticateWithGoogleOneTap = async (t3) => {
                  var n3;
                  return null === (n3 = this.client) || void 0 === n3 ? void 0 : n3.signIn.create({ strategy: "google_one_tap", token: t3.token }).catch(((n4) => {
                    var r3;
                    if ((0, e2.$R)(n4) && "external_account_not_found" === n4.errors[0].code) return null === (r3 = this.client) || void 0 === r3 ? void 0 : r3.signUp.create({ strategy: "google_one_tap", token: t3.token });
                    throw n4;
                  }));
                }, this.authenticateWithMetamask = async ({ redirectUrl: e3, signUpContinueUrl: t3, customNavigate: r3, unsafeMetadata: i3 } = {}) => {
                  if (!this.client || !ie(this, _, "f")) return;
                  const a3 = (e4) => r3 && "function" == typeof r3 ? r3(e4) : this.navigate(e4);
                  let s3;
                  try {
                    s3 = await this.client.signIn.authenticateWithMetamask();
                  } catch (c2) {
                    if (!(0, n2.bJ)(c2, o2.OQ.FORM_IDENTIFIER_NOT_FOUND)) throw c2;
                    s3 = await this.client.signUp.authenticateWithMetamask({ unsafeMetadata: i3 }), t3 && "missing_requirements" === s3.status && "verified" === s3.verifications.web3Wallet.status && await a3(t3);
                  }
                  s3.createdSessionId && await this.setActive({ session: s3.createdSessionId, beforeEmit: () => e3 ? a3(e3) : Promise.resolve() });
                }, this.createOrganization = async ({ name: e3, slug: t3 }) => r2.yb.create({ name: e3, slug: t3 }), this.getOrganizationMemberships = async () => ((0, e2.io)("getOrganizationMemberships", "Use User.getOrganizationMemberships"), await r2.i7.retrieve()), this.getOrganization = async (e3) => r2.yb.get(e3), this.__internal_setCountry = (e3) => {
                  this.__internal_country || (this.__internal_country = e3);
                }, this.updateClient = (e3) => {
                  if (!this.client) {
                    const t3 = ie(this, x, "f").selectInitialSession ? ie(this, x, "f").selectInitialSession(e3) : ie(this, W, "f").call(this, e3);
                    ie(this, Y, "f").call(this, t3);
                  }
                  if (this.client = e3, this.session) {
                    const e4 = ie(this, Z, "f").call(this, this.session.id);
                    ie(this, Y, "f").call(this, e4);
                  }
                  ie(this, J, "f").call(this);
                }, this.__unstable__setEnvironment = async (e3) => {
                  oe(this, _, new r2.OH(e3), "f"), p.mountComponentRenderer && oe(this, b, p.mountComponentRenderer(this, ie(this, _, "f"), ie(this, x, "f")), "f");
                }, this.__unstable__onBeforeRequest = (e3) => {
                  ie(this, S, "f").onBeforeRequest(e3);
                }, this.__unstable__onAfterResponse = (e3) => {
                  ie(this, S, "f").onAfterResponse(e3);
                }, this.__unstable__updateProps = (e3) => {
                  var t3;
                  return null === (t3 = ie(this, b, "f")) || void 0 === t3 ? void 0 : t3.ensureMounted().then(((t4) => t4.updateProps(e3)));
                }, I.set(this, (() => "true" === (0, n2.hI)(o2.rt))), M.set(this, (() => (0, n2.rw)(o2.rt))), R.set(this, (() => {
                  const e3 = new URLSearchParams({ [o2.MC]: window.location.href });
                  return (0, n2.kZ)({ base: ie(this, x, "f").signInUrl, searchParams: e3 }, { stringify: true });
                })), z.set(this, (() => {
                  let e3;
                  if (this.proxyUrl) {
                    const t3 = new URL(this.proxyUrl);
                    e3 = new URL(`${t3.pathname}/v1/client/sync`, t3.origin);
                  } else this.domain && (e3 = new URL("/v1/client/sync", `https://${this.domain}`));
                  return null == e3 || e3.searchParams.append("redirect_url", window.location.href), (null == e3 ? void 0 : e3.toString()) || "";
                })), T.set(this, (() => ie(this, I, "f").call(this) ? (ie(this, x, "f").isInterstitial || ie(this, M, "f").call(this), false) : !!this.isSatellite && (0, n2.J4)().getClientUatCookie() <= 0)), N.set(this, (() => "production" !== ie(this, k, "f") && (!this.isSatellite && !!(0, n2.hI)(o2.MC)))), L.set(this, (async () => {
                  "development" === this.instanceType ? await this.navigate(ie(this, R, "f").call(this)) : "production" === this.instanceType && await this.navigate(ie(this, z, "f").call(this));
                })), j.set(this, ((e3, t3) => {
                  let n3;
                  try {
                    n3 = new URL(e3);
                  } catch {
                    (0, c.ZX)();
                  }
                  n3.origin === t3 && (0, c.ut)();
                })), $.set(this, (() => {
                  this.isSatellite && ("development" !== ie(this, k, "f") || ie(this, x, "f").signInUrl || (0, c.gY)(), this.proxyUrl || this.domain || (0, c.iq)(), ie(this, x, "f").signInUrl && ie(this, j, "f").call(this, ie(this, x, "f").signInUrl, window.location.origin));
                })), F.set(this, (async () => {
                  if (oe(this, w, (function({ frontendApi: e3, fapiClient: t4 }) {
                    const r3 = (0, n2.J4)(), i4 = o2.ZA;
                    let a3 = true;
                    function s3() {
                      return localStorage.getItem(i4);
                    }
                    function l2(e4) {
                      localStorage.setItem(i4, e4), r3.setDevBrowserCookie(e4);
                    }
                    function u2() {
                      localStorage.removeItem(i4), r3.removeDevBrowserCookie();
                    }
                    function d2() {
                      return a3;
                    }
                    return { clear: async function() {
                      return u2(), r3.removeAllDevBrowserCookies(), Promise.resolve();
                    }, setup: async function() {
                      const i5 = (0, n2.DY)(e3), u3 = (0, n2.DY)(window.location.host), h2 = r3.getDevBrowserCookie();
                      if (h2 && (r3.removeDevBrowserCookie(), r3.setDevBrowserCookie(h2)), i5 && (t4.onBeforeRequest(((e4) => {
                        var t5;
                        const n3 = s3();
                        n3 && (null === (t5 = e4.url) || void 0 === t5 || t5.searchParams.set(o2.tK, n3));
                      })), t4.onAfterResponse(((e4, t5) => {
                        var n3;
                        const r4 = null === (n3 = null == t5 ? void 0 : t5.headers) || void 0 === n3 ? void 0 : n3.get(o2.k2);
                        r4 && l2(r4);
                      }))), await (async function() {
                        const e4 = (0, n2.aC)(new URL(window.location.href));
                        if (e4) return void l2(e4);
                        if (null !== s3()) return;
                        const r4 = t4.buildUrl({ path: "/dev_browser" }), i6 = await fetch(r4.toString(), { method: "POST" });
                        if (200 === i6.status) {
                          a3 = true;
                          const e5 = await i6.json();
                          l2(null == e5 ? void 0 : e5.token);
                        } else a3 = false;
                      })(), !d2()) return u3 && !r3.getDevBrowserInittedCookie() ? (async function() {
                        const e4 = t4.buildUrl({ method: "POST", path: "/dev_browser/set_first_party_cookie" });
                        (await fetch(e4.toString(), { method: "POST", credentials: "include" })).ok || (0, c.eS)(), r3.setDevBrowserInittedCookie();
                      })() : u3 || !i5 || s3() ? void 0 : (async function() {
                        const t5 = `https://${e3}`, i6 = window.location.origin, o3 = window.location.href, a4 = (0, n2.kZ)({ base: t5, pathname: "/v1/dev_browser/init", search: `origin=${i6}&redirect=${o3}` }, { stringify: true });
                        try {
                          const { browserToken: e4 } = await (0, n2.gm)({ src: a4, eventOrigin: t5 });
                          if (!e4) throw "Missing token";
                          l2(e4), r3.removeSessionCookie();
                        } catch (s4) {
                          (0, c.eS)(s4.message || s4);
                        }
                      })();
                    }, getDevBrowserJWT: s3, setDevBrowserJWT: l2, usesUrlBasedSessionSync: d2, removeDevBrowserJWT: u2 };
                  })({ frontendApi: this.frontendApi, fapiClient: ie(this, S, "f") }), "f"), ie(this, $, "f").call(this), ie(this, T, "f").call(this)) return await ie(this, L, "f").call(this), false;
                  if ("production" === ie(this, k, "f") ? await ie(this, w, "f").clear() : await ie(this, w, "f").setup(), ie(this, N, "f").call(this)) return await ie(this, E, "f").call(this), false;
                  oe(this, y, new f(this), "f"), oe(this, C, (0, n2.wO)(), "f");
                  const t3 = (0, n2.zi)(null === window || void 0 === window ? void 0 : window.location.hostname);
                  ie(this, V, "f").call(this);
                  let i3 = 0;
                  for (; i3 < 2; ) {
                    i3++;
                    try {
                      const e3 = "development" === ie(this, k, "f") && !t3, [n3, i4] = await Promise.all([r2.OH.getInstance().fetch({ touch: e3 }), r2.Kj.getInstance().fetch()]);
                      if (this.updateClient(i4), this.updateEnvironment(n3), await ie(this, te, "f").call(this)) return false;
                      p.mountComponentRenderer && oe(this, b, p.mountComponentRenderer(this, ie(this, _, "f"), ie(this, x, "f")), "f");
                      break;
                    } catch (a3) {
                      if (!(0, n2.bJ)(a3, "dev_browser_unauthenticated")) {
                        if ((0, e2.CS)()) throw a3;
                        return console.warn(a3), false;
                      }
                      await ie(this, w, "f").clear(), await ie(this, w, "f").setup();
                    }
                    i3 >= 2 && (0, c.BF)();
                  }
                  return ie(this, ne, "f").call(this), ie(this, X, "f").call(this), true;
                })), D.set(this, (async () => {
                  const [e3, t3] = await Promise.all([r2.OH.getInstance().fetch({ touch: false }), r2.Kj.getInstance().fetch()]);
                  return oe(this, _, e3, "f"), this.updateClient(t3), p.mountComponentRenderer && oe(this, b, p.mountComponentRenderer(this, ie(this, _, "f"), ie(this, x, "f")), "f"), true;
                })), W.set(this, ((e3) => {
                  if (e3.lastActiveSessionId) {
                    const t3 = e3.activeSessions.find(((t4) => t4.id === e3.lastActiveSessionId));
                    if (t3) return t3;
                  }
                  return e3.activeSessions[0] || null;
                })), V.set(this, (() => {
                  var t3, n3;
                  (0, e2.M)() && (null === (t3 = ie(this, C, "f")) || void 0 === t3 || t3.onPageVisible((() => {
                    this.session && ie(this, B, "f").call(this, this.session);
                  })), null === (n3 = ie(this, v, "f")) || void 0 === n3 || n3.addEventListener("message", (({ data: e3 }) => {
                    "signout" === e3.type && this.handleUnauthenticated({ broadcast: false });
                  })));
                })), B.set(this, (async (t3) => {
                  if (!t3 || !ie(this, x, "f").touchSession) return Promise.resolve();
                  await t3.touch().catch(((t4) => {
                    (0, e2.nc)(t4) && this.handleUnauthenticated();
                  }));
                })), J.set(this, (() => {
                  if (this.client) for (const e3 of ie(this, U, "f")) e3({ client: this.client, session: this.session, user: this.user, organization: this.organization, lastOrganizationInvitation: ie(this, O, "f"), lastOrganizationMember: ie(this, A, "f") });
                })), q.set(this, (() => {
                  var e3;
                  null === (e3 = ie(this, v, "f")) || void 0 === e3 || e3.postMessage({ type: "signout" });
                })), G.set(this, (() => {
                  p.mountComponentRenderer && (this.closeSignUp(), this.closeSignIn());
                })), H.set(this, (() => {
                  this.session = void 0, this.organization = void 0, this.user = void 0, ie(this, J, "f").call(this);
                })), K.set(this, (() => {
                  var e3;
                  return ((null === (e3 = this.session) || void 0 === e3 ? void 0 : e3.user.organizationMemberships) || []).map(((e4) => e4.organization)).find(((e4) => {
                    var t3;
                    return e4.id === (null === (t3 = this.session) || void 0 === t3 ? void 0 : t3.lastActiveOrganizationId);
                  })) || null;
                })), Y.set(this, ((e3) => {
                  this.session = e3 || null, this.organization = ie(this, K, "f").call(this), ie(this, Q, "f").call(this);
                })), Z.set(this, ((e3) => {
                  var t3;
                  return (null === (t3 = this.client) || void 0 === t3 ? void 0 : t3.activeSessions.find(((t4) => t4.id === e3))) || null;
                })), Q.set(this, (() => {
                  this.user = this.session ? this.session.user : null;
                })), X.set(this, (() => {
                  this.addListener((({ session: e3 }) => {
                    var t3;
                    (null == e3 ? void 0 : e3.actor) && (null === (t3 = ie(this, b, "f")) || void 0 === t3 || t3.ensureMounted().then(((e4) => e4.mountImpersonationFab())));
                  }));
                })), ee.set(this, ((e3, t3) => {
                  if (!ie(this, P, "f") || !ie(this, _, "f") || !ie(this, _, "f").displayConfig) return "";
                  const r3 = (0, n2.VH)(e3, { options: ie(this, x, "f"), displayConfig: ie(this, _, "f").displayConfig }, false), i3 = { afterSignInUrl: (0, n2.VH)("afterSignInUrl", { ctx: t3, options: ie(this, x, "f") }, false), afterSignUpUrl: (0, n2.VH)("afterSignUpUrl", { ctx: t3, options: ie(this, x, "f") }, false), redirectUrl: (null == t3 ? void 0 : t3.redirectUrl) || window.location.href };
                  return Object.keys(i3).forEach((function(e4) {
                    const t4 = i3[e4];
                    t4 && (i3[e4] = (0, n2.Z0)((0, n2.Xz)(t4), (0, n2.Xz)(r3)));
                  })), this.buildUrlWithAuth((0, n2.$7)(r3, { ...i3, ...null == t3 ? void 0 : t3.initialValues }));
                })), te.set(this, (async () => {
                  var e3, t3;
                  const r3 = new URLSearchParams(window.location.search).get("redirect_url"), i3 = "production" === this.instanceType, o3 = null !== r3 && (0, n2.l1)(this.frontendApi, r3);
                  if (i3 || !o3) return false;
                  const a3 = this.session, s3 = ie(this, x, "f").signInUrl || (null === (e3 = ie(this, _, "f")) || void 0 === e3 ? void 0 : e3.displayConfig.signInUrl), c2 = s3 && window.location.href.startsWith(s3), l2 = ie(this, x, "f").signUpUrl || (null === (t3 = ie(this, _, "f")) || void 0 === t3 ? void 0 : t3.displayConfig.signUpUrl), u2 = l2 && window.location.href.startsWith(l2);
                  return !((0, n2.AC)(r3) && !a3 && (c2 || u2) || (await this.navigate(this.buildUrlWithAuth(r3)), 0));
                })), ne.set(this, (() => {
                  try {
                    (0, n2.rw)("__clerk_handshake"), (0, n2.rw)("__clerk_help");
                  } catch (e3) {
                  }
                })), a2 = (a2 || "").trim(), oe(this, m, null == s2 ? void 0 : s2.domain, "f"), oe(this, g, null == s2 ? void 0 : s2.proxyUrl, "f"), (0, e2.r7)(a2)) (0, e2.io)("frontendApi", "Use `publishableKey` instead."), (0, n2.RA)(a2) || n2.sb.throwInvalidFrontendApiError({ key: a2 }), this.frontendApi = a2, oe(this, k, (0, n2.DY)(this.frontendApi) ? "development" : "production", "f");
                else {
                  const t3 = (0, e2.q5)(a2);
                  t3 || n2.sb.throwInvalidPublishableKeyError({ key: a2 });
                  const { frontendApi: r3, instanceType: i3 } = t3;
                  this.publishableKey = a2, this.frontendApi = r3, oe(this, k, i3, "f");
                }
                oe(this, S, (0, l.A)(this), "f"), r2.Qx.clerk = this;
              }
              buildUrlWithAuth(t3) {
                var n3, r3;
                if ("production" === ie(this, k, "f") || !(null === (n3 = ie(this, w, "f")) || void 0 === n3 ? void 0 : n3.usesUrlBasedSessionSync())) return t3;
                const i3 = new URL(t3, window.location.origin);
                if (i3.origin === window.location.origin) return i3.href;
                const o3 = null === (r3 = ie(this, w, "f")) || void 0 === r3 ? void 0 : r3.getDevBrowserJWT();
                return o3 ? (0, e2.Js)(i3, o3).href : (0, c.IJ)();
              }
              buildSignInUrl(e3) {
                return ie(this, ee, "f").call(this, "signInUrl", e3);
              }
              buildSignUpUrl(e3) {
                return ie(this, ee, "f").call(this, "signUpUrl", e3);
              }
              buildUserProfileUrl() {
                return ie(this, _, "f") && ie(this, _, "f").displayConfig ? this.buildUrlWithAuth(ie(this, _, "f").displayConfig.userProfileUrl) : "";
              }
              buildHomeUrl() {
                return ie(this, _, "f") && ie(this, _, "f").displayConfig ? this.buildUrlWithAuth(ie(this, _, "f").displayConfig.homeUrl) : "";
              }
              buildCreateOrganizationUrl() {
                return ie(this, _, "f") && ie(this, _, "f").displayConfig ? this.buildUrlWithAuth(ie(this, _, "f").displayConfig.createOrganizationUrl) : "";
              }
              buildOrganizationProfileUrl() {
                return ie(this, _, "f") && ie(this, _, "f").displayConfig ? this.buildUrlWithAuth(ie(this, _, "f").displayConfig.organizationProfileUrl) : "";
              }
              updateEnvironment(e3) {
                var t3;
                oe(this, _, e3, "f"), null === (t3 = ie(this, y, "f")) || void 0 === t3 || t3.setEnvironment(e3);
              }
              get __internal_last_error() {
                const e3 = this.internal_last_error;
                return this.internal_last_error = null, e3;
              }
              set __internal_last_error(e3) {
                this.internal_last_error = e3;
              }
              __unstable__invitationUpdate(t3) {
                (0, e2.io)("__unstable__invitationUpdate", "We are completely dropping this method as it was introduced for internal use only"), oe(this, O, t3, "f"), ie(this, J, "f").call(this);
              }
              __unstable__membershipUpdate(t3) {
                (0, e2.io)("__unstable__membershipUpdate", "We are completely dropping this method as it was introduced for internal use only"), oe(this, A, t3, "f"), ie(this, J, "f").call(this);
              }
              get __unstable__environment() {
                return ie(this, _, "f");
              }
              __internal_navigateWithError(e3, t3) {
                return this.__internal_last_error = t3, this.navigate(e3);
              }
              __internal_getFrameworkHint() {
                var e3, t3;
                try {
                  if ("undefined" == typeof window || "undefined" == typeof document) return { framework: void 0, version: void 0 };
                  const n3 = window;
                  return n3.__NEXT_DATA__ || n3.document.querySelector("#__next") || (null === (e3 = n3.next) || void 0 === e3 ? void 0 : e3.version) ? { framework: "nextjs", version: null === (t3 = n3.next) || void 0 === t3 ? void 0 : t3.version } : { framework: void 0, version: void 0 };
                } catch (n3) {
                  return { framework: void 0, version: void 0 };
                }
              }
              assertComponentsReady(e3) {
                if (!p.mountComponentRenderer) throw new Error("ClerkJS was loaded without UI components.");
                if (!e3) throw new Error("ClerkJS components are not ready yet.");
              }
            }
            p = se, m = /* @__PURE__ */ new WeakMap(), g = /* @__PURE__ */ new WeakMap(), y = /* @__PURE__ */ new WeakMap(), v = /* @__PURE__ */ new WeakMap(), b = /* @__PURE__ */ new WeakMap(), w = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap(), S = /* @__PURE__ */ new WeakMap(), k = /* @__PURE__ */ new WeakMap(), P = /* @__PURE__ */ new WeakMap(), O = /* @__PURE__ */ new WeakMap(), A = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakMap(), x = /* @__PURE__ */ new WeakMap(), C = /* @__PURE__ */ new WeakMap(), E = /* @__PURE__ */ new WeakMap(), I = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap(), R = /* @__PURE__ */ new WeakMap(), z = /* @__PURE__ */ new WeakMap(), T = /* @__PURE__ */ new WeakMap(), N = /* @__PURE__ */ new WeakMap(), L = /* @__PURE__ */ new WeakMap(), j = /* @__PURE__ */ new WeakMap(), $ = /* @__PURE__ */ new WeakMap(), F = /* @__PURE__ */ new WeakMap(), D = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ new WeakMap(), J = /* @__PURE__ */ new WeakMap(), q = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakMap(), H = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakMap(), Y = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakMap(), Q = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakMap(), ee = /* @__PURE__ */ new WeakMap(), te = /* @__PURE__ */ new WeakMap(), ne = /* @__PURE__ */ new WeakMap(), se.version = "4.73.14", se.sdkMetadata = { name: "@clerk/clerk-js", version: "4.73.14" };
            var ce = se, le = a(4380), ue = a(4654), de = a(4041), he = a(2797);
            const fe = { SignIn: () => Promise.all([a.e(96), a.e(65), a.e(417)]).then(a.bind(a, 739)), SignUp: () => Promise.all([a.e(96), a.e(65), a.e(787)]).then(a.bind(a, 5685)), UserButton: () => Promise.all([a.e(96), a.e(65), a.e(278)]).then(a.bind(a, 1906)), UserProfile: () => Promise.all([a.e(96), a.e(65), a.e(45)]).then(a.bind(a, 9937)), CreateOrganization: () => Promise.all([a.e(96), a.e(65), a.e(916), a.e(862)]).then(a.bind(a, 2525)), OrganizationProfile: () => Promise.all([a.e(96), a.e(65), a.e(837)]).then(a.bind(a, 114)), OrganizationSwitcher: () => Promise.all([a.e(96), a.e(65), a.e(703)]).then(a.bind(a, 8770)), OrganizationList: () => Promise.all([a.e(96), a.e(65), a.e(916), a.e(578)]).then(a.bind(a, 8382)), ImpersonationFab: () => Promise.all([a.e(96), a.e(65), a.e(796)]).then(a.bind(a, 9009)), GoogleOneTap: () => Promise.all([a.e(96), a.e(65), a.e(536)]).then(a.bind(a, 7187)) }, pe = (0, de.lazy)((() => fe.SignIn().then(((e3) => ({ default: e3.SignIn }))))), me = (0, de.lazy)((() => fe.SignIn().then(((e3) => ({ default: e3.SignInModal }))))), ge = (0, de.lazy)((() => fe.GoogleOneTap().then(((e3) => ({ default: e3.OneTap }))))), ye = (0, de.lazy)((() => fe.SignUp().then(((e3) => ({ default: e3.SignUp }))))), ve = (0, de.lazy)((() => fe.SignUp().then(((e3) => ({ default: e3.SignUpModal }))))), be = (0, de.lazy)((() => fe.UserButton().then(((e3) => ({ default: e3.UserButton }))))), we = (0, de.lazy)((() => fe.UserProfile().then(((e3) => ({ default: e3.UserProfile }))))), _e = (0, de.lazy)((() => fe.UserProfile().then(((e3) => ({ default: e3.UserProfileModal }))))), Se = (0, de.lazy)((() => fe.CreateOrganization().then(((e3) => ({ default: e3.CreateOrganization }))))), ke = (0, de.lazy)((() => fe.CreateOrganization().then(((e3) => ({ default: e3.CreateOrganizationModal }))))), Pe = (0, de.lazy)((() => fe.OrganizationProfile().then(((e3) => ({ default: e3.OrganizationProfile }))))), Oe = (0, de.lazy)((() => fe.OrganizationProfile().then(((e3) => ({ default: e3.OrganizationProfileModal }))))), Ae = (0, de.lazy)((() => fe.OrganizationSwitcher().then(((e3) => ({ default: e3.OrganizationSwitcher }))))), Ue = (0, de.lazy)((() => fe.OrganizationList().then(((e3) => ({ default: e3.OrganizationList }))))), xe = (0, de.lazy)((() => fe.ImpersonationFab().then(((e3) => ({ default: e3.ImpersonationFab }))))), Ce = { SignIn: pe, SignUp: ye, UserButton: be, UserProfile: we, OrganizationSwitcher: Ae, OrganizationList: Ue, OrganizationProfile: Pe, CreateOrganization: Se, SignInModal: me, SignUpModal: ve, UserProfileModal: _e, OrganizationProfileModal: Oe, CreateOrganizationModal: ke, GoogleOneTap: ge }, Ee = (0, de.lazy)((() => Promise.all([a.e(96), a.e(65)]).then(a.bind(a, 4740)).then(((e3) => ({ default: e3.CoreClerkContextWrapper }))))), Ie = (0, de.lazy)((() => Promise.all([a.e(96), a.e(65)]).then(a.bind(a, 4740)).then(((e3) => ({ default: e3.EnvironmentProvider }))))), Me = (0, de.lazy)((() => Promise.all([a.e(96), a.e(65)]).then(a.bind(a, 4740)).then(((e3) => ({ default: e3.OptionsProvider }))))), Re = (0, de.lazy)((() => Promise.all([a.e(96), a.e(65)]).then(a.bind(a, 9333)).then(((e3) => ({ default: e3.AppearanceProvider }))))), ze = (0, de.lazy)((() => Promise.all([a.e(96), a.e(65)]).then(a.bind(a, 166)).then(((e3) => ({ default: e3.VirtualRouter }))))), Te = (0, de.lazy)((() => Promise.all([a.e(96), a.e(65)]).then(a.bind(a, 3965)).then(((e3) => ({ default: e3.InternalThemeProvider }))))), Ne = (0, de.lazy)((() => Promise.all([a.e(96), a.e(65)]).then(a.bind(a, 861)).then(((e3) => ({ default: e3.Portal }))))), Le = (0, de.lazy)((() => Promise.all([a.e(96), a.e(65)]).then(a.bind(a, 861)).then(((e3) => ({ default: e3.VirtualBodyRootPortal }))))), je = (0, de.lazy)((() => Promise.all([a.e(96), a.e(65)]).then(a.bind(a, 2932)).then(((e3) => ({ default: e3.FlowMetadataProvider }))))), $e = (0, de.lazy)((() => Promise.all([a.e(96), a.e(65)]).then(a.bind(a, 2932)).then(((e3) => ({ default: e3.Modal }))))), Fe = (e3) => (0, le.Y)(Ee, { clerk: e3.clerk, children: (0, le.Y)(Ie, { value: e3.environment, children: (0, le.Y)(Me, { value: e3.options, children: e3.children }) }) }), De = (e3) => (0, le.Y)(Re, { globalAppearance: e3.globalAppearance, appearanceKey: e3.appearanceKey, appearance: e3.componentAppearance, children: (0, le.Y)(Ne, { node: e3.node, component: Ce[e3.componentName], props: e3.componentProps, componentName: e3.componentName }) }), We = (e3) => (0, le.Y)(de.Suspense, { fallback: "", children: (0, le.Y)(Re, { globalAppearance: e3.globalAppearance, appearanceKey: e3.appearanceKey, appearance: e3.componentAppearance, children: (0, le.Y)(je, { flow: e3.flowName || "", children: (0, le.Y)(Te, { children: (0, le.Y)($e, { handleClose: e3.onClose, containerSx: e3.modalContainerSx, contentSx: e3.modalContentSx, children: e3.startPath ? (0, le.Y)(de.Suspense, { children: (0, le.Y)(ze, { startPath: e3.startPath, onExternalNavigate: e3.onExternalNavigate, children: e3.children }) }) : e3.children }) }) }) }) }), Ve = (e3) => (0, le.Y)(de.Suspense, { children: (0, le.Y)(Re, { globalAppearance: e3.globalAppearance, appearanceKey: "impersonationFab", children: e3.children }) }), Be = (e3) => (0, le.Y)(Re, { globalAppearance: e3.globalAppearance, appearanceKey: "oneTap", appearance: e3.componentAppearance, children: (0, le.Y)(Le, { startPath: e3.startPath, component: Ce.GoogleOneTap, props: e3.componentProps, componentName: "GoogleOneTap" }) });
            let Je = 0;
            const qe = {}, Ge = Object.freeze({ SignUp: "signUpModal", SignIn: "signInModal", UserProfile: "userProfileModal", OrganizationProfile: "organizationProfileModal", CreateOrganization: "createOrganizationModal" }), He = (e3) => {
              const [t3, r3] = de.useState({ appearance: e3.options.appearance, options: e3.options, googleOneTapModal: null, signInModal: null, signUpModal: null, userProfileModal: null, organizationProfileModal: null, createOrganizationModal: null, nodes: /* @__PURE__ */ new Map(), impersonationFab: false }), { googleOneTapModal: i3, signInModal: o3, signUpModal: a2, userProfileModal: s2, organizationProfileModal: l2, createOrganizationModal: u2, nodes: d2 } = t3, { urlStateParam: h2, clearUrlStateParam: f2, decodedRedirectParams: p2 } = (0, he.x)();
              (0, ue.UQ)((() => {
                p2 && r3(((e4) => ({ ...e4, [Ge[p2.componentName]]: true }))), qe.mountComponent = (e4) => {
                  const { node: t4, name: n3, props: i4, appearanceKey: o4 } = e4;
                  t4 || (0, c.$V)(), r3(((e5) => (e5.nodes.set(t4, { key: "p" + ++Je, name: n3, props: i4, appearanceKey: o4 }), { ...e5, nodes: d2 })));
                }, qe.unmountComponent = (e4) => {
                  const { node: t4 } = e4;
                  r3(((e5) => (e5.nodes.delete(t4), { ...e5, nodes: d2 })));
                }, qe.updateProps = ({ node: e4, props: n3, ...i4 }) => {
                  if (e4 && n3 && "object" == typeof n3) {
                    const i5 = t3.nodes.get(e4);
                    if (i5) return i5.props = { ...n3 }, void r3(((e5) => ({ ...e5 })));
                  }
                  r3(((e5) => ({ ...e5, ...i4 })));
                }, qe.closeModal = (e4) => {
                  f2(), r3(((t4) => ({ ...t4, [e4 + "Modal"]: null })));
                }, qe.openModal = (e4, t4) => {
                  r3(((n3) => ({ ...n3, [e4 + "Modal"]: t4 })));
                }, qe.mountImpersonationFab = () => {
                  r3(((e4) => ({ ...e4, impersonationFab: true })));
                }, e3.onComponentsMounted();
              }), []);
              const m2 = (0, le.Y)(Be, { componentProps: i3, globalAppearance: t3.appearance, componentAppearance: null == i3 ? void 0 : i3.appearance, startPath: (0, n2.cL)({ base: "/one-tap", path: "" }) }), g2 = (0, le.FD)(We, { globalAppearance: t3.appearance, appearanceKey: "signIn", componentAppearance: null == o3 ? void 0 : o3.appearance, flowName: "signIn", onClose: () => qe.closeModal("signIn"), onExternalNavigate: () => qe.closeModal("signIn"), startPath: (0, n2.cL)({ base: "/sign-in", path: null == h2 ? void 0 : h2.path }), componentName: "SignInModal", children: [(0, le.Y)(me, { ...o3 }), (0, le.Y)(ve, { ...o3 })] }), y2 = (0, le.FD)(We, { globalAppearance: t3.appearance, appearanceKey: "signUp", componentAppearance: null == a2 ? void 0 : a2.appearance, flowName: "signUp", onClose: () => qe.closeModal("signUp"), onExternalNavigate: () => qe.closeModal("signUp"), startPath: (0, n2.cL)({ base: "/sign-up", path: null == h2 ? void 0 : h2.path }), componentName: "SignUpModal", children: [(0, le.Y)(me, { ...a2 }), (0, le.Y)(ve, { ...a2 })] }), v2 = (0, le.Y)(We, { globalAppearance: t3.appearance, appearanceKey: "userProfile", componentAppearance: null == s2 ? void 0 : s2.appearance, flowName: "userProfile", onClose: () => qe.closeModal("userProfile"), onExternalNavigate: () => qe.closeModal("userProfile"), startPath: (0, n2.cL)({ base: "/user", path: null == h2 ? void 0 : h2.path }), componentName: "SignUpModal", modalContainerSx: { alignItems: "center" }, modalContentSx: (e4) => ({ height: `min(${e4.sizes.$176}, calc(100% - ${e4.sizes.$12}))`, margin: 0 }), children: (0, le.Y)(_e, { ...s2 }) }), b2 = (0, le.Y)(We, { globalAppearance: t3.appearance, appearanceKey: "organizationProfile", componentAppearance: null == l2 ? void 0 : l2.appearance, flowName: "organizationProfile", onClose: () => qe.closeModal("organizationProfile"), onExternalNavigate: () => qe.closeModal("organizationProfile"), startPath: (0, n2.cL)({ base: "/organizationProfile", path: null == h2 ? void 0 : h2.path }), componentName: "OrganizationProfileModal", modalContainerSx: { alignItems: "center" }, modalContentSx: (e4) => ({ height: `min(${e4.sizes.$176}, calc(100% - ${e4.sizes.$12}))`, margin: 0 }), children: (0, le.Y)(Oe, { ...l2 }) }), w2 = (0, le.Y)(We, { globalAppearance: t3.appearance, appearanceKey: "createOrganization", componentAppearance: null == u2 ? void 0 : u2.appearance, flowName: "createOrganization", onClose: () => qe.closeModal("createOrganization"), onExternalNavigate: () => qe.closeModal("createOrganization"), startPath: (0, n2.cL)({ base: "/createOrganization", path: null == h2 ? void 0 : h2.path }), componentName: "CreateOrganizationModal", modalContainerSx: { alignItems: "center" }, modalContentSx: (e4) => ({ height: `min(${e4.sizes.$120}, calc(100% - ${e4.sizes.$12}))`, margin: 0 }), children: (0, le.Y)(ke, { ...u2 }) });
              return (0, le.Y)(de.Suspense, { fallback: "", children: (0, le.FD)(Fe, { clerk: e3.clerk, environment: e3.environment, options: t3.options, children: [[...d2].map((([e4, n3]) => {
                var r4;
                return (0, le.Y)(De, { node: e4, globalAppearance: t3.appearance, appearanceKey: n3.appearanceKey, componentAppearance: null === (r4 = n3.props) || void 0 === r4 ? void 0 : r4.appearance, componentName: n3.name, componentProps: n3.props }, n3.key);
              })), i3 && m2, o3 && g2, a2 && y2, s2 && v2, l2 && b2, u2 && w2, t3.impersonationFab && (0, le.Y)(Ve, { globalAppearance: t3.appearance, children: (0, le.Y)(xe, {}) })] }) });
            };
            var Ke, Ye, Ze, Qe;
            ce.mountComponentRenderer = (t3, n3, r3) => {
              let i3, o3 = document.getElementById("clerk-components");
              return o3 || (o3 = document.createElement("div"), o3.setAttribute("id", "clerk-components"), document.body.appendChild(o3)), { ensureMounted: async (s2) => {
                const { preloadHint: c2 } = s2 || {};
                if (!i3) {
                  const s3 = (0, e2.ph)();
                  c2 && (async (e3) => {
                    var t4;
                    null === (t4 = fe[e3]) || void 0 === t4 || t4.call(fe);
                  })(c2), i3 = Promise.all([a.e(96), a.e(65)]).then(a.bind(a, 8131)).then((({ createRoot: e3 }) => (e3(o3).render((0, le.Y)(He, { clerk: t3, environment: n3, options: r3, onComponentsMounted: s3.resolve })), s3.promise.then((() => qe)))));
                }
                return i3.then(((e3) => e3));
              } };
            };
            const Xe = (null === (Ke = document.querySelector("script[data-clerk-publishable-key]")) || void 0 === Ke ? void 0 : Ke.getAttribute("data-clerk-publishable-key")) || window.__clerk_publishable_key || "", et = (null === (Ye = document.querySelector("script[data-clerk-frontend-api]")) || void 0 === Ye ? void 0 : Ye.getAttribute("data-clerk-frontend-api")) || window.__clerk_frontend_api || "", tt = (null === (Ze = document.querySelector("script[data-clerk-proxy-url]")) || void 0 === Ze ? void 0 : Ze.getAttribute("data-clerk-proxy-url")) || window.__clerk_proxy_url || "", nt = (null === (Qe = document.querySelector("script[data-clerk-domain]")) || void 0 === Qe ? void 0 : Qe.getAttribute("data-clerk-domain")) || window.__clerk_domain || "";
            window.Clerk = new ce(Xe || et, { proxyUrl: tt, domain: nt });
          })(), s;
        })();
      }));
    }
  });
  return require_clerk_browser();
})();
/*! Bundled license information:

@clerk/clerk-js/dist/clerk.browser.js:
  (*! For license information please see clerk.browser.js.LICENSE.txt *)
*/
if (typeof Clerk !== "undefined" && typeof window !== "undefined") { window.Clerk = Clerk; }
