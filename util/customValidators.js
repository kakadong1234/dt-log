const config = require('../config')

module.exports = {
    isValidPassword(value) {
        return config.VALIDATION.pwdFormat.test(value)
    },

    isValidUserLogData(value){
        return value.username ? true: false;
    }
}