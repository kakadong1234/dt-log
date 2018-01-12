module.exports = new Map([
    ['AuthFail', { code: 10001, msg: '身份验证失败:elog' }],
    ['NotFound', { code: 10002, msg: '请求的API接口或文件不存在:@param' }],
    ['CommonErr', { code: 14000 }], // 无需特殊处理的自定义错误都用这个代码
    ['ESNEmpty', { code: 14001 }],
    ['TypeEmpty', { code: 14002 }],
    ['CreatedEmpty', { code: 14003 }],
    ['ContentEmpty', { code: 14004 }],
    ['MsgContentInvalid', { code: 14005, msg: '消息格式content不合法' }],
    ['DateEmpty', { code: 14006 }],
    ['DataEmpty', { code: 14007 }],
    ['UserLogDataInvalid', { code: 14008, msg: 'UserLogDataInvalid不合法' }],
])