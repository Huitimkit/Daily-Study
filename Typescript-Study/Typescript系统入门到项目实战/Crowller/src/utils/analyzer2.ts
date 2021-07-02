import { IAnalyzer } from './crowller'

export default class Analyzer2 implements IAnalyzer {
  public analyze(html: string, filePath: string) {
    return html
  }
}