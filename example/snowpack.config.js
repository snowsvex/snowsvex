module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/' }
  },
  plugins: [
    [
      '@snowsvex/snowsvex-plugin',
      {
        pagesDirs: ['articles', 'pages']
      }
    ]
  ],
  routes: [{ match: 'routes', src: '.*', dest: '/index.html' }]
}
