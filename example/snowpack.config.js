module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/' }
  },
  routes: [{ match: 'routes', src: '.*', dest: '/index.html' }],
  plugins: [['@snowsvex/snowsvex-plugin', { pagesDirs: ['pages', 'articles'] }]]
}
