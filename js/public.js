/*
 * 公共方法,建议涉及到一些公用方法可以再里面扩展
 */
(function (window) {
    var public = {
        isDebug: false,
        apiHost: 'http://dapp.tuuz.cc:1180/', //服务器接口域名-测试
        imgHost: 'http://msc.tuuz.cc:15180/',
        token: '',
        /**
         * 对jquery的post进一步封装，默认会注入_app\_platform\_passport,
         * 同时对返回数据默认进行通用错误处理,未登录会进行登录处理
         * @param {string} url 请求地址
         * @param {object} data 请求附加参数
         * @param {function} callback 异步回调函数,默认已对数据进行通用错误处理
         * @param {string} type 返回内容类型
         *

         * @returns {object}  返回Deferred对象，支持promise
         */
        post: function (url, data, callback, syn, type) {
            if (url.indexOf('http') === -1) {
                return this._jqAjax(this.apiHost + url, data, callback, syn, 'post');Api_find_address
            } else {
                return this._jqAjax(url, data, callback, syn, 'post');
            }
        },
        /**
         * 对jquery的post进一步封装，默认会注入_app\_platform\_passport,
         * 同时对返回数据默认进行通用错误处理,未登录会进行登录处理
         * @param {string} url 请求地址
         * @param {object} data 请求附加参数
         * @param {function} callback 异步回调函数,默认已对数据进行通用错误处理
         * @param {string} type 返回内容类型
         *
         * @returns {object}  返回Deferred对象，支持promise
         */
        get: function (url, data, callback, syn, type) {
            if (url.indexOf('http') === -1) {
                return this._jqAjax(this.apiHost + url, data, callback, syn, "get");
            } else {
                return this._jqAjax(url, data, callback, syn, "get");
            }
        },
        /**
         * ajax私有方法不要调用
         */
        _jqAjax: function (url, data, succCallback, syn, type, dataType) {
            var _this = this;
            var type = type || "post";
            var dataType = dataType || "json";
            var asyn;
            var load = {};
            var dataObj = data,
                signStr = '',
                sign = '';
            // dataObj.ts = new Date().getTime();
            // signStr = dataObj.ts;
            // sign = md5(signStr)
            // dataObj.sign = sign;
            var token = Pub.getSession('token');
            var uid = Pub.getSession('uid');
            var lang = Pub.getSession('language');
            if (lang) {
                dataObj.lang = lang;
            } else {
                dataObj.lang = 'en';
            }
            if (token) {
                dataObj.token = token;
            }
            if (uid) {
                dataObj.uid = uid;
            }
            $.ajax({
                type: type,
                url: url,
                data: dataObj,
                async: asyn,
                dataType: dataType,
                beforeSend: function () {
                    load = $(document).dialog({
                        type: 'toast',
                        infoIcon: './images/common/loading.gif',
                        infoText: ''
                    });
                },
                success: function (response) {
                    load.close();
                    if (_this.isDebug) {
                        console.log('接口地址：', url);
                        console.log('接口参数：', dataObj);
                    }
                    var res;
                    if (typeof res == 'string') {
                        res = JSON.parse(response);
                    } else {
                        res = response;
                    }
                    if (_this.isDebug) {
                        console.log(res);
                    }
                    Pub.catchCommonError(res);
                    if (succCallback) {
                        succCallback(res);
                    }
                },
                complete: function () {
                    load.close();
                },
                error: function (response) {
                    load.close();
                    if (_this.isDebug) {
                        console.log('接口地址：', url);
                        console.log('接口参数：', dataObj);
                        console.log(response);
                    }
                }
            });
        },
        /**
         * 传参签名
         */
        postParams: function (data) {

        },
        /**
         * 浏览器判断是否是
         */
        browser: {
            isAndroid: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1, //android终端
            isiOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            isWeChat: window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'
        },
        /**
         *搜索ID或名字等，通过关键词获取的
         */
        searchToObject: function () {
            var pairs = window.location.search.substring(1).split("&"),
                obj = {},
                i;
            for (i in pairs) {
                if (pairs[i] === "")
                    continue;

                pair = pairs[i].split("=");
                obj[decodeURI(pair[0])] = decodeURI(pair[1]);
            }
            return obj;
        },
        /**
         * 修改链接参数
         * @param destiny
         * @param par
         * @param par_value
         * @returns {string}
         */
        changeUrlPar: function (url, arg, arg_val) {
            var pattern = arg + '=([^&]*)';
            var replaceText = arg + '=' + arg_val;
            if (url.match(pattern)) {
                var tmp = '/(' + arg + '=)([^&]*)/gi';
                tmp = url.replace(eval(tmp), replaceText);
                return tmp;
            } else {
                if (url.match('[\?]')) {
                    return url + '&' + replaceText;
                } else {
                    return url + '?' + replaceText;
                }
            }
            return url + '\n' + arg + '\n' + arg_val;
        },
        /**
         *倒计时方法
         */
        countDown: function (time, id) {
            var dayElem = $(id).find('.day');
            var hourElem = $(id).find('.hour');
            var minuteElem = $(id).find('.minute');
            var secondElem = $(id).find('.second');
            var endTime = new Date(time).getTime(),
                sysSecond = (endTime - new Date().getTime()) / 1000;
            var timer = setInterval(function () {
                if (sysSecond > 1) {
                    sysSecond -= 1;
                    var day = Math.floor((sysSecond / 3600) / 24);
                    var hour = Math.floor((sysSecond / 3600) % 24);
                    var minute = Math.floor((sysSecond / 60) % 60);
                    var second = Math.floor(sysSecond % 60);
                    $(dayElem).text(day); //计算天
                    $(hourElem).text(hour < 10 ? "0" + hour : hour); //计算小时
                    $(minuteElem).text(minute < 10 ? "0" + minute : minute); //计算分钟
                    $(secondElem).text(second < 10 ? "0" + second : second); //计算秒杀
                } else {
                    clearInterval(timer);
                }
            }, 1000);
        },
        /**
         * 类型(Y-m-d H:i:s)时间转换时间戳
         */
        toUnix: function (time) {
            var tmpDatetime = time.replace(/:/g, '-');
            tmpDatetime = tmpDatetime.replace(/ /g, '-');
            var arr = tmpDatetime.split("-");
            var now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
            return parseInt(now.getTime());
        },
        toDatetime: function (time) {
            return new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
        },
        toTime: function (times) {
            var time = new Date(parseInt(times));
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            var d = time.getDate();
            d = d < 10 ? '0' + d : d;
            var h = time.getHours();
            h = h < 10 ? '0' + h : h;
            var mi = time.getMinutes();
            mi = mi < 10 ? '0' + mi : mi;
            var s = time.getSeconds();
            s = s < 10 ? '0' + s : s;
            return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s;
        },
        /**
         * 获取当前时间
         */
        getNowFormatDate: function () {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
            return currentdate;
        },
        /**
         * 获取前天后天的日期(20170118，-1)
         */
        getDay: function (s, num) {
            var y = parseInt(s.substr(0, 4), 10);
            var m = parseInt(s.substr(4, 2), 10) - 1;
            var d = parseInt(s.substr(6, 2), 10);
            var dt = new Date(y, m, d + num);
            y = dt.getFullYear();
            m = dt.getMonth() + 1;
            d = dt.getDate();
            m = m < 10 ? "0" + m : m;
            d = d < 10 ? "0" + d : d;
            return y + "-" + m + "-" + d;
        },
        /**
         * 获取几天前或几天后的日期
         */
        getDateStr: function (AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = (dd.getMonth() + 1) < 10 ? ('0' + (dd.getMonth() + 1)) : (dd.getMonth() + 1);
            var d = dd.getDate() < 10 ? ('0' + dd.getDate()) : dd.getDate();
            return y + "-" + m + "-" + d;
        },
        /**
         * 通过值删除数组元素
         */
        deleteByValue: function (arr, valueToDelete) {
            var ret = $.grep(arr, function (value, i) {
                return value != valueToDelete;
            });
            return ret;
        },
        /**
         * 通过索引删除数组元素
         */
        deleteByIndex: function (arr, indexToDelete) {
            var reta = $.grep(arr, function (value, i) {
                return i != indexToDelete;
            });
            return reta;
        },
        /**
         * 判断字符串在数组的位置
         */
        arrIndexOf: function (arr, str) {
            // 如果可以的话，调用原生方法
            if (arr && arr.length > 0) {
                var len = arr.length;
                for (var i = 0; i < len; i++) {
                    var isString = JSON.stringify(arr[i]);
                    // 定位该元素位置
                    if (isString.indexOf(str) != -1) {
                        return i;
                    }
                }
            }
            // 数组中不存在该元素
            return -1;
        },
        /**
         * 获取地址参数
         */
        getUrlParams: function (url, name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = url.substr(1).match(reg);
            if (r !== null)
                return unescape(r[2]);
            return null;
        },
        /**
         * 从返回接口的数据是否含有错误
         * @param {object} data 待处理数据
         * @returns {boolean} true/false
         */
        hasError: function (data) {
            if ($.isPlainObject(data) && data.code) {
                var code = data.code;
                if (code !== "0") {
                    return false;
                }
            }
            return true;
        },
        /**
         * 需要域名时使用
         */
        domainName: function (data) {
            return '' + data;
        },
        /**
         * 获取内容
         */
        getCont: function (data) {
            return data.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&amp;nbsp;/g, ' ');
        },
        /**
         * 四舍五入保留小数点
         */
        decimal: function (num, v) {
            var vv = Math.pow(10, v);
            return Math.round(num * vv) / vv;
        },

        /**
         * 清楚空格
         */
        clearSpace: function (data) {
            return data.replace(/\s/g, '');
        },
        /**
         * input光标放在最后
         */
        inputLast: function (obj) {
            var len = obj[0].value.length;
            if (document.selection) {
                var sel = obj.createTextRange();
                sel.moveStart('character', len - 1);
                sel.collapse();
                sel.select();
            } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
                obj.selectionStart = obj.selectionEnd = len;
            }
        },
        /**
         * 判断输入内容是否是中文
         */
        isChinese: function (str) {
            var entryVal = str;
            var cnChar = entryVal.match(/[^\x00-\x80]/g);
            if (cnChar !== null && cnChar.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 把数组分成多个数组
         */
        arrayChunk: function (array, size) {
            var result = [];
            for (var x = 0; x < Math.ceil(array.length / size); x++) {
                var start = x * size;
                var end = start + size;
                result.push(array.slice(start, end));
            }
            return result;
        },
        /**
         * 文本框只能输入数字
         */
        numOnly: function (selector) {
            $(selector).keyup(function () {
                this.value = this.value.replace(/[^\d]/g, '');
            });
        },
        /**
         * 转换小数数字
         */
        floatNum: function (oInput) {
            if ('' !== oInput.value.replace(/\d{1,}\.{0,1}\d{0,}/, '')) {
                oInput.value = oInput.value.match(/\d{1,}\.{0,1}\d{0,}/) === null ? '' : oInput.value.match(/\d{1,}\.{0,1}\d{0,}/);
            }
        },
        /**
         * 文本框只能输入数字和小数点
         */
        numDotOnly: function (selector) {
            $(selector).keyup(function () {
                this.value = this.value.replace(/[^0-9.]/g, '');

            });
        },
        /**
         * 文本框只能输入数字和小数点后两位
         */
        numDotTwoOnly: function (selector) {
            $(selector).keyup(function () {
                this.value = this.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
                this.value = this.value.replace(/^\./g, ""); //验证第一个字符是数字而不是
                this.value = this.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
                this.value = this.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                this.value = thisc.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
            });
        },
        /**
         * 随机生成字符串
         */
        random: function (len) {
            len = len || 32;
            var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
            var maxPos = $chars.length;
            var rendomString = '';
            for (i = 0; i < len; i++) {
                rendomString += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return rendomString;
        },
        /*数值相乘精确*/
        multiply: function (arg1, arg2) {
            var m = 0,
                s1 = arg1.toString(),
                s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length
            } catch (e) { }
            try {
                m += s2.split(".")[1].length
            } catch (e) { }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        },
        /*数值相除精确*/
        division: function (arg1, arg2) {
            if (arg1 == 0) return 0;
            var t1 = 0,
                t2 = 0,
                r1, r2;
            try {
                t1 = arg1.toString().split(".")[1].length
            } catch (e) { }
            try {
                t2 = arg2.toString().split(".")[1].length
            } catch (e) { }
            with (Math) {
                r1 = Number(arg1.toString().replace(".", ""))
                r2 = Number(arg2.toString().replace(".", ""))
                return (r1 / r2) * pow(10, t2 - t1);
            }
        },
        /**
        * 数值相加
        */
        accAdd: function (arg1, arg2) {
            var r1, r2, m;
            try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2))
            return (arg1 * m + arg2 * m) / m
        },
        /**
        * 数值相减
        */
        Subtr(arg1, arg2) {
            var r1, r2, m, n;
            try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2));
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        },
        /**
         * 生成二维码
         */
        h5CreateQrcode(id, content, logo) {
            QrCodeWithLogo.toCanvas({
                canvas: document.getElementById(id),
                content: content,
                width: document.getElementById(id).width,
                logo: logo ? {
                    src: logo || '',
                } : null,
            })
        },
        /**
         * 正则表达式验证
         */
        regex: {
            rgNotnull: /[\w\W]+/, // 不能为空！
            rgCharacterLimit: /^[\w\W]{6,16}$/, // 6到16位任意字符！
            rgNum: /^\d+$/, // 数字！
            rgNumLimit: /^\d{6,16}$/, // 6到16位数字！
            rgNoString: /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]+$/, // 特殊字符！
            rgStringLimit: /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/, // 6到18位字符！
            rgPost: /^[0-9]{6}$/, // 请填写邮政编码！
            // rgMobile: /^1[34578]\d{9}$/, // 手机号码！
            rgEmail: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, // 邮箱地址格式!
            rgPhone: /^(\d{3,4}-)?\d{7,8}$/, // 电话或传真！
            rgUrl: /^(\w+:\/\/)?\w+(\.\w+)+.*$/, //网址
            rgMobile: /^1[3456789]\d{9}$/, // 手机号码！
            rgPassword: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/, // 8-20位包含字母特殊字符数字密码
            rgPayPassword: /^\d{6}$/ // 6位纯数字密码
        },
        /**
         * 号码加空格
         */
        padStr: function (value, position, padstr, inputElement) {
            position.forEach(function (item, index) {
                if (value.length > item + index) {
                    value = value.substring(0, item + index) + padstr + value.substring(item + index)
                }
            })
            value = value.trim();
            // 解决安卓部分浏览器插入空格后光标错位问题
            if (inputElement) {
                requestAnimationFrame(function () {
                    inputElement.setSelectionRange(value.length, value.length);
                })
            }
            return value;
        },
        /**
         * 获取绝对路径，当页面需要进行跨模块调用时有用
         * @param {type} url
         * @returns {undefined}
         */
        getAbsoluteUrl: function (url) {
            return url;
        },
        /**
         * 获取认证信息
         * @returns {undefined}
         */
        getAuthInfo: function () {
            var _passport = this.getSession("_passport");
            var res = {
                // _app: "shop",
                // _platform: "web"
            };
            if (_passport) {
                res._passport = _passport;
            }
            return res;
        },
        /**
         * 设置认证信息
         * @param {object} data
         * @returns {undefined}
         */
        setAuthInfo: function (data) {
            var _passport = data && data._passport;
            this.setSession("_passport", _passport);
        },
        /**
         * 清楚认证信息
         * @returns {undefined}
         */
        clearAuthInfo: function () {
            this.delSession("_passport");
        },
        /**
         * 所有接口都有通用错误处理
         * @param {object} data
         * @returns {object}
         */
        catchCommonError: function (data) {
            var _this = this;
            if (data.code == -1) {
                if (Pub.getSession('invite_code')) {
                    window.location.href = './login.html?code=' + Pub.getSession('invite_code');
                } else if (Pub.searchToObject().code) {
                    window.location.href = './login.html?code=' + Pub.searchToObject().code;
                } else {
                    window.location.href = './login.html';
                }
            }
            if (data.code == !0) {
                this.msg(data.msg || '');
            }
        },
        // 弹窗
        msg: function (text, positon, time) {
            $(document).dialog({
                type: 'notice',
                infoText: text,
                autoClose: time || 1500,
                position: positon || 'middle' // center: 居中; bottom: 底部
            });
        },
        toast: function (text, type, time) {
            var img = '';
            switch (type) {
                case 'success':
                    img = './images/common/success.png';
                    break;
                case 'fail':
                    img = './images/common/fail.png';
                    break;
                default:
                    img = './images/common/loading.gif';
            }
            $(document).dialog({
                type: 'toast',
                infoIcon: img,
                infoText: text || '',
                autoClose: time || 1500
            });
        },
        alert: function (title, content) {
            $(document).dialog({
                titleText: title,
                titleShow: title || false,
                content: content || ''
            });
        },
        dialogConfirm: {},
        confirm: function (title, content, callback, cancel) {
            var _this = this;
            this.dialogConfirm = $(document).dialog({
                type: 'confirm',
                closeBtnShow: true,
                titleText: title || '提示',
                content: content,
                onClickConfirmBtn: function () {
                    callback();
                },
                onClickCancelBtn: function () {
                    if (cancel && typeof cancel == 'function') {
                        cancel();
                    }
                    _this.dialogConfirm.close();
                },
                onClickCloseBtn: function () {
                    if (cancel && typeof cancel == 'function') {
                        cancel();
                    }
                    _this.dialogConfirm.close();
                }
            });
        },
        /**
         * 解析url地址
         * @param {string} url 等待解析url地址
         * @return {object}
         */
        parseUrl: function (url) {
            var urlRegExp = new RegExp(/^([^:]+):\/\/(?:([^:@]+)(?::([^@]+))?@)?([^:\/]+)(?:\:([0-9]*))?([^#\?]+)?(?:\?([^#]+))?(#.+)?$/ig); // :RegExp
            var pathRegExp = new RegExp('([^/]+)', 'g'); // :RegExp
            var queryRegExp = new RegExp('([^=&]+)=([^&]+)', 'g'); // :RegExp
            var info = {
                url: url
            };
            var match = urlRegExp.exec(url);
            if (match !== null) {
                info.protocol = match[1] || ''; // 'https'
                info.user = match[2] || ''; // 'admin'
                info.password = match[3] || ''; // '123456'
                info.subdomain = match[4] || ''; // 'secure'
                info.domain = match[4] || ''; // 'example.com'
                info.port = match[5] || ''; // '8181'
                info.path = match[6] || ''; // '/local/test'
                info.query = match[7] || ''; // 'search=bk&show=page'
                info.hash = match[8] || ''; // '#content'
                var path = info.path.match(pathRegExp);
                info.parsePath = (path === null) ? [] : path;
                var parseQuery = {};
                info.query.replace(queryRegExp, function (match, c1, c2) {
                    parseQuery[c1] = c2;
                    return match;
                });
                info.parseQuery = parseQuery;
                return info;
            }
        },
        /**
         * 拼接url地址
         * @param {string} url url地址
         * @param {object} param url参数
         * @returns {string} 拼接后的url地址
         *
         */
        getUrl: function (url, param) {
            if (url.indexOf("?") !== -1) {
                url += "&" + $.param(param);
            } else {
                url += "?" + $.param(param);
            }
            return url;
        },
        /**
         * 返回当前url地址中的参数
         * @returns {object}
         */
        getUrlParam: function () {
            var urlInfo = this.parseUrl(window.location.href);
            return urlInfo && urlInfo.parseQuery;
        },
        queryStr: function (query) {
            var lang = Pub.getSession('language');
            if (lang) {
                query.lang = lang;
            } else {
                query.lang = 'en';
            }
            var queryStr = ''
            var token = Pub.getSession('token');
            if (Object.keys(query).length > 0) {
                queryStr = Object.keys(query).reduce((ary, key) => {
                    if (query[key]) {
                        ary.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
                    }
                    return ary;
                }, [])
                    .join('&');
                queryStr = '?' + queryStr;
            }
            return queryStr
        },
        /**
        * 页面跳转方法
        **/
        toPage: function (url, params) {
            url = url + this.queryStr(params || {})
            //   window.open(url);
            parent.location.href = url;
        },
        closePage: function () {
            window.history.back();
        },
        /**
         * 设置cookie
         */
        setCookie: function (key, val, time) {
            var t = time || 7;
            $.cookie(key, val, { expires: parseInt(t) });
        },
        /**
         * 获取cookie
         */
        getCookie: function (key) {
            return $.cookie(key);
        },
        /**
         * 获取会话中指定的值
         * @param {string} key 要获取的key
         * @return {stirng} 返回指定值
         */
        getSession: function (key) {
            var v = localStorage.getItem(key);
            if (!v) { return; }
            if (v.indexOf('obj-') === 0) {
                v = v.slice(4);
                return JSON.parse(v);
            } else if (v.indexOf('str-') === 0) {
                return v.slice(4);
            }
        },
        /**
         * 设置会话指定值
         * @param {string} key 会话的key
         * @param {string} val 要设置的值
         * @returns {void}
         */
        setSession: function (key, val) {
            if (arguments.length === 2) {
                var v = val;
                if (typeof v == 'object') {
                    v = JSON.stringify(v);
                    v = 'obj-' + v;
                } else {
                    v = 'str-' + v;
                }
                localStorage.setItem(key, v);
            }
        },
        /**
         *  删除指定会话值
         * @param {type} key
         * @returns {undefined}
         */
        delSession: function (key) {
            localStorage.removeItem(key);
        },
        /**
         * 获取html文件url
         */
        getHtmlUrl: function (htmlFile) {
            return this.clientRoot + htmlFile;
        },
        /*号码添加空格*/
        padStr: function (value, position, padstr, inputElement) {
            position.forEach(function (item, index) {
                if (value.length > item + index) {
                    value = value.substring(0, item + index) + padstr + value.substring(item + index)
                }
            })
            value = value.trim();
            // 解决安卓部分浏览器插入空格后光标错位问题
            if (inputElement) {
                requestAnimationFrame(function () {
                    inputElement.setSelectionRange(value.length, value.length);
                })
            }
            return value;
        },
        /*去除所有空格*/
        trimAll: function (val) {
            return val.replace(/\s+/g, "")
        },
        /**
         * 默认图片
         */
        defaultImg: function (elm, src) {
            $(elm).find('img').each(function () {
                var _this = this;
                var timer = setInterval(function () {
                    if (_this.complete) {
                        if (typeof _this.naturalWidth == "undefined" || _this.naturalWidth === 0) {
                            _this.src = src;
                        }
                        clearInterval(timer);
                    }
                }, 300);
            });
        },
        removeImg: function (elm) {
            $(elm).find('img').each(function () {
                var _this = this;
                var timer = setInterval(function () {
                    if (_this.complete) {
                        if (typeof _this.naturalWidth == "undefined" || _this.naturalWidth === 0) {
                            _this.remove();
                        }
                        clearInterval(timer);
                    }
                }, 300);
            });
        },
        _checkLogin: function () {
            // localStorage.setItem('user_id', '20')
            // var passport = this.getCookie('_PASSPORT');
            // if (!passport) {
            //     var lcHref = window.location.href;
            //     if (lcHref.indexOf('login') === -1) {
            //         var returnLink = window.encodeURI(lcHref);
            //         this.setCookie('return-link', returnLink);
            //         var link = this.getHtmlUrl('login.html');
            //         window.location.href = link;
            //     }
            // } else {
            //     $('body').show();
            // }

        },
        /**
         * 获取日期
         */
        _showDay: function (num) {
            var nums = num;
            var time = {};

            var now = new Date(); //当前日期
            var nowDayOfWeek = now.getDay(); //今天本周的第几天
            var nowDay = now.getDate(); //当前日
            var nowMonth = now.getMonth(); //当前月
            var nowYear = now.getYear(); //当前年
            var nowHours = now.getHours(); //当前小时
            var nowMinutes = now.getMinutes(); //当前分钟
            var nowSeconds = now.getSeconds(); //当前秒
            nowYear += (nowYear < 2000) ? 1900 : 0; //

            var lastMonthDate = new Date(); //上月日期
            lastMonthDate.setDate(1);
            lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
            var lastYear = lastMonthDate.getYear();
            var lastMonth = lastMonthDate.getMonth();

            //格式化日期：yyyy-MM-dd
            function formatDate(date) {
                var myyear = date.getFullYear();
                var mymonth = date.getMonth() + 1;
                var myweekday = date.getDate();

                if (mymonth < 10) {
                    mymonth = "0" + mymonth;
                }
                if (myweekday < 10) {
                    myweekday = "0" + myweekday;
                }
                return (myyear + "-" + mymonth + "-" + myweekday);
            }
            //获得某月的天数
            function getMonthDays(myMonth) {
                var monthStartDate = new Date(nowYear, myMonth, 1);
                var monthEndDate = new Date(nowYear, myMonth + 1, 1);
                var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
                return days;
            }
            //获得今日时间
            function gettoDate() {
                var day1 = new Date();
                day1.setTime(day1.getTime());
                var months = day1.getMonth();
                var dates = day1.getDate();
                if (months < 10) {
                    months = "0" + (months + 1);
                }
                if (dates < 10) {
                    dates = "0" + dates;
                }
                if (day1.getMonth()) { };
                var s1 = day1.getFullYear() + "-" + (months) + "-" + dates;
                return s1;
            }
            //获得今日时间时分秒
            function gettoDates() {
                var day1 = new Date();
                day1.setTime(day1.getTime());
                var months = day1.getMonth();
                var dates = day1.getDate();
                var hours = day1.getHours();
                var minutes = day1.getMinutes();
                var seconds = day1.getSeconds();
                if (months < 10) {
                    months = "0" + (months + 1);
                }
                if (dates < 10) {
                    dates = "0" + dates;
                }
                if (hours < 10) {
                    hours = "0" + hours;
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (dates < 10) {
                    seconds = "0" + seconds;
                }

                if (day1.getMonth()) { };
                var s1 = day1.getFullYear() + "-" + (months) + "-" + dates + ' ' + hours + ':' + minutes + ':' + seconds;
                return s1;
            }
            //获得昨天日期
            function getyesterdayDate() {
                var day1 = new Date();
                day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
                var months = day1.getMonth();
                var dates = day1.getDate();
                if (months < 10) {
                    months = "0" + (months + 1);
                }
                if (dates < 10) {
                    dates = "0" + dates;
                }
                if (day1.getMonth()) { };
                var s1 = day1.getFullYear() + "-" + (months) + "-" + dates;
                return s1;
            }
            //获得本月时间
            function getThisMonth() {
                var day1 = new Date();
                day1.setTime(day1.getTime());
                var months = day1.getMonth();
                var dates = day1.getDate();
                if (months < 10) {
                    months = "0" + (months + 1);
                }
                if (dates < 10) {
                    dates = "0" + dates;
                }
                if (day1.getMonth()) { };
                var s1 = day1.getFullYear() + "-" + (months);
                return s1;
            }

            //获得上月日期
            function getLastMonth() {
                var day1 = new Date();
                day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
                var months = day1.getMonth();
                var dates = day1.getDate();
                if (months < 10) {
                    months = "0" + months;
                }
                if (dates < 10) {
                    dates = "0" + dates;
                }
                if (day1.getMonth()) { };
                var s1 = day1.getFullYear() + "-" + (months);
                return s1;
            }


            //获得最近7天日期
            function getsevendayDate() {
                var day1 = new Date();
                day1.setTime(day1.getTime() - 24 * 60 * 60 * 7 * 1000);

                var months = day1.getMonth();
                var dates = day1.getDate();
                if (months < 10) {
                    months = "0" + (months + 1);
                }
                if (dates < 10) {
                    dates = "0" + dates;
                }
                if (day1.getMonth()) { };
                var s1 = day1.getFullYear() + "-" + (months) + "-" + dates;
                return s1;
            }
            //获得最近3天日期
            function getThreeDate() {
                var day1 = new Date();
                day1.setTime(day1.getTime() - 24 * 60 * 60 * 3 * 1000);

                var months = day1.getMonth();
                var dates = day1.getDate();
                if (months < 10) {
                    months = "0" + (months + 1);
                }
                if (dates < 10) {
                    dates = "0" + dates;
                }
                if (day1.getMonth()) { };
                var s1 = day1.getFullYear() + "-" + (months) + "-" + dates;
                return s1;
            }
            //获得最近30天日期
            function getthirtydayDate() {
                var day1 = new Date();
                day1.setTime(day1.getTime() - 24 * 60 * 60 * 30 * 1000);

                var months = day1.getMonth();
                var dates = day1.getDate();
                if (months < 10) {
                    months = "0" + (months + 1);
                }
                if (dates < 10) {
                    dates = "0" + dates;
                }
                if (day1.getMonth()) { };
                var s1 = day1.getFullYear() + "-" + (months) + "-" + dates;
                return s1;
            }
            //获得最近90天日期
            function getnightydayDate() {
                var day1 = new Date();
                day1.setTime(day1.getTime() - 24 * 60 * 60 * 90 * 1000);

                var months = day1.getMonth();
                var dates = day1.getDate();
                if (months < 10) {
                    months = "0" + (months + 1);
                }
                if (dates < 10) {
                    dates = "0" + dates;
                }
                if (day1.getMonth()) { };
                var s1 = day1.getFullYear() + "-" + (months) + "-" + dates;
                return s1;
            }

            //获得本周的开始日期
            function getWeekStartDate() {
                var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
                return formatDate(weekStartDate);
            }

            //获得本周的结束日期
            function getWeekEndDate() {
                var weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
                return formatDate(weekEndDate);
            }

            //获得上周的开始日期
            function getLastWeekStartDate() {
                var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 6);
                return formatDate(weekStartDate);
            }
            //获得上周的结束日期
            function getLastWeekEndDate() {
                var weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
                return formatDate(weekEndDate);
            }

            //获得本月的开始日期
            function getMonthStartDate() {
                var monthStartDate = new Date(nowYear, nowMonth, 1);
                return formatDate(monthStartDate);
            }

            //获得本月的结束日期
            function getMonthEndDate() {
                var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
                return formatDate(monthEndDate);
            }

            //获得上月开始时间
            function getLastMonthStartDate() {
                var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
                return formatDate(lastMonthStartDate);
            }

            //获得上月结束时间
            function getLastMonthEndDate() {
                var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
                return formatDate(lastMonthEndDate);
            }
            if (nums == 1) {
                //时分秒
                time.days = gettoDates();
                //最近3天时间
                time.threeDate = getThreeDate();
                //最近7天时间
                time.sevenday = getsevendayDate();
                //最近30天时间
                time.thirtyday = getthirtydayDate();
                //最近90天时间
                time.nightyday = getnightydayDate();
                //昨天时间
                time.yesterday = getyesterdayDate();
                //今日时间
                time.today = gettoDate();
                time.thisMonth = getThisMonth();
                time.lastMonth = getLastMonth();
                return time;
            } else if (nums == 2) {
                //本周第一天
                time.getWeekStartDate = getWeekStartDate();
                //本周最后一天
                time.getWeekEndDate = getWeekEndDate();
                //上周第一天
                time.getLastWeekStartDate = getLastWeekStartDate();
                //上周最后一天
                time.getLastWeekEndDate = getLastWeekEndDate();
                return time;
            } else if (nums == 3) {
                //本月第一天
                time.getMonthStartDate = getMonthStartDate();
                //本月最后一天
                time.getMonthEndDate = getMonthEndDate();
                //上月第一天
                time.getLastMonthStartDate = getLastMonthStartDate();
                //上月最后一天
                time.getLastMonthEndDate = getLastMonthEndDate();
                return time;
            }
        },
        ArrayType: function () {
            Array.prototype.unique = function () {
                this.sort(); //先排序
                var res = [this[0]];
                for (var i = 1; i < this.length; i++) {
                    if (this[i] !== res[res.length - 1]) {
                        res.push(this[i]);
                    }
                }
                return res;
            }
            Array.prototype.indexOf = function (val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val)
                        return i;
                }
                return -1;
            };
            Array.prototype.remove = function (val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            // Array.prototype.removeIndex = function(from, to) {
            //   var rest = this.slice((to || from) + 1 || this.length);
            //   this.length = from < 0 ? this.length + from : from;
            //   return this.push.apply(this, rest);
            // };
        },
        getImgUrl(img) {
            if (img.indexOf('http') == -1) {
                img = this.imgHost + img;
            }
            return img;
        },
        getThemeHost() {
            var themeName = this.getSession('theme_name') || 'default';
            var url = './images/theme_' + themeName + '/';
            return url;
        },
        setTheme() {
            var themeName = this.getSession('theme_name') || 'default';
            $('#app').addClass('theme-' + themeName);
        },

    };
    // public._checkLogin();
    public.setTheme();
    window.Pub = public;
})(window);