"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 专注内容分析
var fs_1 = __importDefault(require("fs"));
var cheerio_1 = __importDefault(require("cheerio"));
var Analyzer = /** @class */ (function () {
    function Analyzer() {
    }
    Analyzer.getInstance = function () {
        if (!this.instance) {
            this.instance = new Analyzer();
        }
        return this.instance;
    };
    Analyzer.prototype.getCoursesInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var courseItems = $('.course-item');
        var courseInfo = [];
        courseItems.map(function (index, element) {
            var $element = $(element);
            var img = $element.find('.course-img').attr('src');
            var title = $(element).find('.course-desc').text();
            courseInfo.push({
                title: title,
                img: img
            });
        });
        return {
            time: (new Date()).getTime(),
            data: courseInfo
        };
    };
    // 读取course.json
    Analyzer.prototype.generateCourseInfo = function (course, filePath) {
        // path.resovle解析为绝对路径
        var fileContent = {};
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[course.time] = course.data;
        return fileContent;
    };
    Analyzer.prototype.analyze = function (html, filePath) {
        var courseInfo = this.getCoursesInfo(html);
        var fileContent = this.generateCourseInfo(courseInfo, filePath);
        return JSON.stringify(fileContent);
    };
    return Analyzer;
}());
exports.default = Analyzer;
