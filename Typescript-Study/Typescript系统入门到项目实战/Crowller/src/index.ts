import express, { Request, Response, NextFunction } from 'express'
import router from './router'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
const app = express()

// 问题1： express库的类型定义文件 .d.ts文件类型描述不准确
// 问题2： 当我使用中间件的时候，对req或者res做了修改之后，实际上类型并不能改变

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieSession({
  name: 'session',
  keys: ['teacher ddd'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use((req: Request, res: Response, next: NextFunction) => {
  req.teacherName = 'ddd'
  next()
})
app.use(router)

app.listen(7001, () => {
  console.log('server is running')
})

