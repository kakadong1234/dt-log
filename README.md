# elog
所有前端采集数据的存储, 检索和下载等功能.

### 开发环境
使用以下命令启动前端文件监控&自动重载.
```bash
npm run dev
```

### 生产环境
使用PM2启动, 停止, 删除应用相关命令如下. (无后缀则对应生产环境)
```bash
npm run start
npm run start_test
npm run restart
npm run restart_test
npm run stop    #所有环境通用
npm run delete  #所有环境通用
```

API, TASK 及 PM2 的日志均放在/log目录之下.  
API 和 TASK 日志直接按日或月分割.  
PM2 暂未提供日志文件分割功能, 我们通过crontab定时任务来做分割. (当日日志请查 /log/pm2/out.log)
```bash
1 0 * * * sh [root_path]/log/pm2/cutPm2OutLog.sh
```