// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    // required to lint *.vue files
    plugins: ['html'],
    // add your custom rules here
    'rules': {
        'indent': [
            'error', 4
        ],
        'no-mixed-spaces-and-tabs': 0,
        "brace-style": [
            2,
            "1tbs", {
                "allowSingleLine": true
            }
        ],
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production'
            ? 2
            : 0,
        // 关闭语句强制分号结尾
        "semi": [0]
    }
}
