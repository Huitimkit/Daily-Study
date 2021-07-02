// 专注内容分析
import fs from 'fs'
import cheerio from 'cheerio'
import { IAnalyzer } from './crowller'


interface Course {
  title: string;
  img: string | undefined;
}

interface CourseInfo {
  time: number;
  data: Course[];
}

interface CourseContent {
  [propName: number]: Course[]
}

export default class Analyzer implements IAnalyzer {
  private static instance: Analyzer

  static getInstance() {
    if (!this.instance) {
      this.instance = new Analyzer()
    }
    return this.instance
  }
  private getCoursesInfo(html: string) {
    const $ = cheerio.load(html)
    const courseItems = $('.course-item')
    const courseInfo: Course[] = []
    courseItems.map((index, element) => {
      const $element = $(element)
      const img = $element.find('.course-img').attr('src')
      const title = $(element).find('.course-desc').text()

      courseInfo.push({
        title,
        img
      })
    })

    return {
      time: (new Date()).getTime(),
      data: courseInfo
    }
  }

  // 读取course.json
  private generateCourseInfo(course: CourseInfo, filePath: string) {
    // path.resovle解析为绝对路径
    let fileContent: CourseContent = {}

    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    
    fileContent[course.time] = course.data
    return fileContent
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCoursesInfo(html)
    const fileContent = this.generateCourseInfo(courseInfo, filePath)
    return JSON.stringify(fileContent)
  }

  private constructor() {}
}