/**
 * enums for both server and client
 */
if (!global) global = window

global.Enum = {

    MsgType: {
        LiveID: { value: 1, text: 'liveid' },
        LiveName: { value: 2, text: 'livename' },
        RoomID: { value: 3, text: 'roomid' },
        Username: { value: 4, text: 'username' },
        PushUrl: { value: 5, text: 'pushurl' },
        CustomIndex: { value: 99, text: '用户自定义索引信息' },
        SystemInfo: { value: 1000, text: '系统信息' },
        AppInfo: { value: 1010, text: 'app信息' },
        AppActive: { value: 1020, text: 'app激活' },
        NetworkStatus: { value: 1021, text: '网络状态' },
        CustomEvent: { value: 2000, text: '用户自定义事件' },
    },

    getEnumByValue(enumObj, value) {
        let target
        value = Number(value)

        Object.keys(enumObj).some(key => {
            const current = enumObj[key]
            if (current.value === value) {
                target = current
                return true
            }
        })
        return target
    },

    getNameByValue(enumObj, value) {
        let target
        value = Number(value)

        Object.keys(enumObj).some(key => {
            if (enumObj[key].value === value) {
                target = key
                return true
            }
        })
        return target
    },

    getEnumTexts(enumObj) {
        return Object.keys(enumObj).map(key => {
            return enumObj[key].text
        })
    },
}