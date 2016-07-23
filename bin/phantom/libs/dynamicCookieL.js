var navigator = {
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53'
};

var lToken;

Math._random = Math.random;

//Math.random = function () {
//  return 0.5;
//}
Date._now = function () {
  return Date.now();
}

var currentCookie = 'Ai0t-tP7LnOkkW5yMpAOP3/BvdKnimHV';

!function (t, n, r) {
  if (!n._sufei_data) {
    n._sufei_data = 1;
    var e;
    !function (t) {
      function n(t) {
        for (var n = 0, r = t.length, i = []; r > n;) {
          var o = t[n++] << 16 | t[n++] << 8 | t[n++];
          i.push(e.charAt(o >> 18), e.charAt(o >> 12 & 63), e.charAt(o >> 6 & 63), e.charAt(63 & o))
        }
        return i.join("")
      }

      function r(t) {
        for (var n = 0, r = t.length, e = []; r > n;) {
          var o = i[t.charAt(n++)] << 18 | i[t.charAt(n++)] << 12 | i[t.charAt(n++)] << 6 | i[t.charAt(n++)];
          e.push(o >> 16, o >> 8 & 255, 255 & o)
        }
        return e
      }

      for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = {}, o = 0; 64 > o; o++)i[e[o]] = o;
      t.a = n, t.b = r
    }(e || (e = {}));
    var i;
    !function (n) {
      function r() {
        return 4294967295 * Math.random() >>> 0
      }

      function e(t) {
        for (var n = 0, r = 0, e = t.length; e > r; r++)n = (n << 5) - n + t.charCodeAt(r), n >>>= 0;
        return n
      }

      function i(t, n, r) {
        u ? t.addEventListener(n, r) : t.attachEvent("on" + n, r)
      }

      function o(t) {
        return /^(\d+\.)+\d+$/.test(t)
      }

      function c(t) {
        if (o(t))return t;
        var n = f.test(t) ? -3 : -2, r = t.split(".");
        return r.slice(n).join(".")
      }

      function a(t) {
        if (t) {
          var n = t.match(s);
          if (n) {
            var r = n[1];
            return v.test(r) && (r = r.split("@").pop().split(":")[0]), r
          }
        }
      }

      var u = !!t.addEventListener;
      n.c = r, n.d = e, n.e = Date._now , n.f = i, n.g = o;
      var f = /\.com\.cn$|\.com\.hk$/;
      n.h = c;
      var s = /^\s*(?:https?:)?\/{2,}([^\/\?\#\\]+)/i, v = /[@:]/;
      n.i = a
    }(i || (i = {}));
    var o;
    !function (t) {
      function r(t) {
        c++
      }

      function e(t) {
        a++
      }

      function o() {
        if(!isInit){
          c = Math._random() * 100;
        }else{
          isInit = false;
        }
        return c << 16 | a
      }

      var c = 0, a = 0, u = '';
      var isInit = true;
      //i.f(n, u, e), i.f(n, "mousemove", r), i.f(n, "touchmove", r),
      t.j = o
    }(o || (o = {}));
    var c;
    !function (r) {


      function m() {
        //m:32799,pc:32779
        return 32779
      }

      r.k = m
    }(c || (c = {}));
    var a, u = "l", f = "isg2", s = [/\.alicdn\.com\//];
    !function (t) {
      function r(t) {
        var r = n.cookie, e = "; " + t + "=", i = r.indexOf(e);
        if (-1 == i) {
          if (e = t + "=", r.substr(0, e.length) != e)return;
          i = 0
        }
        var o = i + e.length, c = r.indexOf("; ", o);
        return -1 == c && (c = r.length), r.substring(o, c)
      }

      function e(t, r, e, i, o) {
        var c = t + "=" + r;
        i && (c += "; domain=" + i), o && (c += "; path=" + o), e && (c += "; expires=" + e), n.cookie = c
      }

      function i(t, n, r) {
        this.write(t, "", "Thu, 01 Jan 1970 00:00:00 GMT", n, r)
      }

      t.l = r, t.m = e, t.n = i
    }(a || (a = {}));
    var v, h = function () {
      function t(t) {
        this._fields = t
      }

      return t.prototype.o = function () {
        for (var t = this._fields, n = [], r = -1, e = 0, i = t.length; i > e; e++)for (var o = this[e], c = t[e], a = r += c; n[a] = 255 & o, 0 != --c;)--a, o >>= 8;
        return n
      }, t.prototype.b = function (t) {
        for (var n = this._fields, r = 0, e = 0, i = n.length; i > e; e++) {
          var o = n[e], c = 0;
          do c = (c << 8) + t[r++]; while (--o > 0);
          this[e] = c >>> 0
        }
      }, t.prototype.p = function (t, n) {
        this._desc || (this._desc = []), this._desc[t] = n
      }, t.prototype.q = function () {
        for (var t = {}, n = 0; n < this._fields.length; n++) {
          var r = this._desc[n] || n;
          t[r] = this[n]
        }
        return t
      }, t
    }();
    !function (t) {
      function n(t) {
        for (var n = 0, r = 0, e = t.length; e > r; r++)n = (n << 5) - n + t[r];
        return 255 & n
      }

      function r(t, n, r, e, i) {
        for (var o = t.length; o > n;)r[e++] = t[n++] ^ 255 & i, i = ~(131 * i)
      }

      function i(t) {
        return e.a(t).replace(/\+/g, "-").replace(/\=/g, "_")
      }

      function o(t) {
        return t = t.replace(/\-/g, "+").replace(/\_/g, "="), e.b(t)
      }

      function c(t) {
        var e = n(t), o = [u, e];
        return r(t, 0, o, 2, e), i(o)
      }

      function a(t) {
        var e = o(t), i = e[0];
        if (i == u) {
          var c = e[1], a = [];
          if (r(e, 2, a, 0, c), n(a) == c)return a
        }
      }

      var u = 2;
      t.r = c, t.s = a
    }(v || (v = {}));
    var l;
    !function (t) {
      function n() {
        var t = currentCookie;
        if (t && 32 == t.length) {
          var n = v.s(t);
          if (n && (s.b(n), 0 != s[d]))return
        }
        s[d] = i.c()
      }

      function r() {
        s[l]++,
        s[m] = i.e() / 1e3 | 0;
        var t = o.j();
        s[y] = t >> 16,
        s[b] = 65535 & t;
        var n = s.o();
        return v.r(n)
      }

      function e() {
        var t = 4, r = 2;
        s = new h([r, r, t, t, t, r, r, r]), n(), s[p] = 65535 & i.c(), s[l] = 0, s[g] = i.d(navigator.userAgent), s[w] = c.k()
      }

      function f() {
        var t = r();
        currentCookie = t;
        return t
      }

      var s, l = 0, p = 1, d = 2, g = 3, m = 4, w = 5, y = 6, b = 7;
      t.t = e, t.j = f
    }(l || (l = {}));
    var d;
    !function (t) {
      function r() {

        l.t();

        //AkNDtyIXtR82gy2yXytZldX0Uw3tuNf6
        //AkNDtyIXtR82gy2yXytZldX0Uw3tuNf6

        //Al9fYCYL0aOKt4Fm26c9-Zkgb7npn7Nm

        //AtjYduVOE0Sx6uZT-MICxKoNKAxqwTxL
        //AtjYduVOE0Sx6uZT-MICxKoNKAxqwTxL
        //AtjYduVOE0Sx6uZT-MICxKoNKAxqwTxL

        //var t  = 1455938704252;
        //var _t = 1455938704256;
        //var j = 1455938632874;

        //AgcHaz7DTXL4l2l-81/FAXHol7DRDNvu

        lToken = l.j.bind(l);
      }

      function e() {
          r()
      }

      e()
    }(d || (d = {}))
  }
}({
  addEventListener:true,
}, {
  cookie:''//' cna=8EUdDn3GhVkCAbeApyUEuDVr; miid=7215250158361710725; lzstat_uv=29412594542921228370|1267385@3492151@2924570@3600092@1341479@3476526@1203522@3217275@3600144@3533350@2144678@2139325; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0; isg=4FD7FCD56703F3D5B3E3FF940D091513; _tb_token_=HRi9jsYoL6rLkv4; wud=wud; thw=cn; ali_ab=115.192.188.175.1436170747494.4; hng=CN%7Czh-cn%7CCNY; v=0; _m_user_unitinfo_=unit|unsz; _m_unitapi_v_=1446197822170; uc1=cookie14=UoWyi2A%2BMxrBSg%3D%3D&existShop=true&cookie16=VFC%2FuZ9az08KUQ56dCrZDlbNdA%3D%3D&cookie21=V32FPkk%2FhoypzrZtAqoZbA%3D%3D&tag=2&cookie15=U%2BGCWk%2F75gdr5Q%3D%3D&pas=0; existShop=MTQ1NTkzNjc5MQ%3D%3D; lgc=shock_%5Cu67D2; tracknick=shock_%5Cu67D2; sg=%E6%9F%9219; mt=np=&ci=0_0; t=10fbca10044522c4c8303587a38d3e05; _cc_=U%2BGCWk%2F7og%3D%3D; tg=0; _l_g_=Ug%3D%3D; _nk_=shock_%5Cu67D2; _m_h5_tk=3b65ca601b2e1c2693ba74768975015c_1455947317986; _m_h5_tk_enc=293dc1ebaf3a3305e315ddb10bf27481; l=AiYmjyeIZU6TROh5ekSUfoiT9paoCmrB'
});

lToken();

module.exports = function(initCookieL){

  currentCookie = initCookieL;

  return lToken()
};