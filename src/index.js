import express from 'express';
import { setLoginFn } from './Auth/index.js'
import { setCloudTaskFn } from './CloudTask/index.js'
import { setCloudServeFn } from './CloudServe/index.js'
import { createTimedTask } from './CloudTask/task.js'
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
setLoginFn(app)
setCloudTaskFn(app)
setCloudServeFn(app)
// 5分钟后开启定时任务
setTimeout(() => {
    createTimedTask()
}, 1000 * 60 * 5);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));