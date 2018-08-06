

module.exports = {
  parser: 'postcss',
  plugins: {
    "precss": {},
    "postcss-import": {},
    "postcss-px2rem": {
      remUnit: 20
    }
  }
}