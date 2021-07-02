import fs from 'fs'
import path from 'path'
import { Router, Request, Response, NextFunction } from 'express'
import Crowller from './utils/crowller'
import Analyzer from './utils/analyzer'
import { getResponseData } from './utils/utils'

// 解决类型描述不正确
interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  }
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false
  if (isLogin) {
    next()
  } else {
    res.json(getResponseData(null, '请先登录'))
  }
}

const router = Router()


router.get('/', (req: BodyRequest, res: Response) => {
  const isLogin = req.session ? req.session.login : false
  if (isLogin) {
    res.send(`
      <html>
        <body>
          <a href="/getData">爬取内容</a>
          <a href="/showData">展示内容</a>
          <a href="/logout">退出</a>
        </body>
      </html>
    `)
  } else {
    res.send(`
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password" name="password" value="" />
            <button>提交</button>
          </form>
        </body>
      </html>
    `)
  }
  
})

router.post('/login', (req: BodyRequest, res: Response) => {
  const { password } = req.body
  const isLogin = req.session ? req.session.login : false
  if (!isLogin) {
    if (password === '123' && req.session) {
      req.session.login = true
      res.json(getResponseData(true))
    } else {
      res.json(getResponseData(null, '密码不正确'))
    }
  } else {
    res.json(getResponseData(null, '您已登录过了'))
  }
})

router.get('/logout', (req: BodyRequest, res: Response) => {
  if (req.session) {
    req.session.login = undefined
  }
  res.json(getResponseData(true))
})

router.get('/getData', checkLogin, (req: BodyRequest, res: Response) => {
  const url = `http://www.dell-lee.com/`
  const analyzer = Analyzer.getInstance()
  new Crowller(url, analyzer)
  res.send('get data success')
})

router.get('/showData', checkLogin, (req: BodyRequest, res: Response) => {
  try {
    // 相对于打包后的文件目录，即build的目录
    const position = path.resolve(__dirname, '../data/course.json')
    const result = fs.readFileSync(position, 'utf-8')
    res.json(JSON.parse(result))
  } catch(e) {
    res.json(getResponseData(null, '文件读取失败'))
  }
})

export default router