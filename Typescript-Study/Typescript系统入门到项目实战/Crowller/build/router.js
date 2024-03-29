"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var express_1 = require("express");
var crowller_1 = __importDefault(require("./utils/crowller"));
var analyzer_1 = __importDefault(require("./utils/analyzer"));
var utils_1 = require("./utils/utils");
var checkLogin = function (req, res, next) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        next();
    }
    else {
        res.json(utils_1.getResponseData(null, '请先登录'));
    }
};
var router = express_1.Router();
router.get('/', function (req, res) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.send("\n      <html>\n        <body>\n          <a href=\"/getData\">\u722C\u53D6\u5185\u5BB9</a>\n          <a href=\"/showData\">\u5C55\u793A\u5185\u5BB9</a>\n          <a href=\"/logout\">\u9000\u51FA</a>\n        </body>\n      </html>\n    ");
    }
    else {
        res.send("\n      <html>\n        <body>\n          <form method=\"post\" action=\"/login\">\n            <input type=\"password\" name=\"password\" value=\"\" />\n            <button>\u63D0\u4EA4</button>\n          </form>\n        </body>\n      </html>\n    ");
    }
});
router.post('/login', function (req, res) {
    var password = req.body.password;
    var isLogin = req.session ? req.session.login : false;
    if (!isLogin) {
        if (password === '123' && req.session) {
            req.session.login = true;
            res.json(utils_1.getResponseData(true));
        }
        else {
            res.json(utils_1.getResponseData(null, '密码不正确'));
        }
    }
    else {
        res.json(utils_1.getResponseData(null, '您已登录过了'));
    }
});
router.get('/logout', function (req, res) {
    if (req.session) {
        req.session.login = undefined;
    }
    res.json(utils_1.getResponseData(true));
});
router.get('/getData', checkLogin, function (req, res) {
    var url = "http://www.dell-lee.com/";
    var analyzer = analyzer_1.default.getInstance();
    new crowller_1.default(url, analyzer);
    res.send('get data success');
});
router.get('/showData', checkLogin, function (req, res) {
    try {
        // 相对于打包后的文件目录，即build的目录
        var position = path_1.default.resolve(__dirname, '../data/course.json');
        var result = fs_1.default.readFileSync(position, 'utf-8');
        res.json(JSON.parse(result));
    }
    catch (e) {
        res.json(utils_1.getResponseData(null, '文件读取失败'));
    }
});
exports.default = router;
