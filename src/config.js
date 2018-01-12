const config = {
    base: {
        ENV: 'prod',
        LOG_PAGE_SIZE: 20,
        LOG_DETAILS_PAGE_SIZE: 100, //must keep pace with the backend method
    },
    dev: {
        API_HOST: 'http://localhost:8410'
    },
    test: {
        API_HOST: 'http://10.0.60.95:8400'
    },
    prod: {
        API_HOST: 'http://10.0.60.95:8400'
        // API_HOST: 'https://elog-live.ejudata.com'
    }
}

window.config = Object.assign(config.base, config[config.base.ENV])