module.exports = [{
  files: ['src/**/*.js'],
  languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs', globals: { console: 'readonly', process: 'readonly', module: 'readonly', require: 'readonly' } },
  rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] }
}];
