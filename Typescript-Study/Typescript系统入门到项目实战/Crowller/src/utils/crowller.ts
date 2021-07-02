// superagent可以理解為在node里也可以发送ajax请求
// ts -> .d.ts 类型定义文件（翻译文件） -> js

// 函数应该解耦，职责更加单一
import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import Analyzer from './analyzer'

// 设计模式：组合模式可建多个分析类
export interface IAnalyzer {
  analyze: (html: string, filePath: string) => string
}

// 專注爬取內容
class Crowller {
    private filePath = path.resolve(__dirname, '../../data/course.json')

    private async getRawHtml() {
        const result = await superagent.get(this.url)
        return result.text
    }

    private writeFile(fileContent: string) {
      fs.writeFileSync(this.filePath, fileContent)
    }

    // 初始化爬虫程序
    private async initSpiderProccess() {
        const html = await this.getRawHtml()
        const fileContent = this.analyzer.analyze(html, this.filePath)
        this.writeFile(fileContent)
    }

    constructor(private url: string, private analyzer: IAnalyzer) {
        this.initSpiderProccess()
    }
}

export default Crowller
// const url = `http://www.dell-lee.com/`
// // 组合模式
// // const analyzer = new Analyzer()
// // 使用单例模式创建
// const analyzer = Analyzer.getInstance()
// new Crowller(url, analyzer)
// console.log('this is a spider proccess')