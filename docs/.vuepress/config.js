import { containerPlugin } from '@vuepress/plugin-container'
import { defaultTheme } from '@vuepress/theme-default'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { path } from '@vuepress/utils'

module.exports = {
  lang: 'en-US',
  title: 'VIVES IoT Lab Complete',
  description: 'Cursus voor Graduaat studenten Internet Of Things VIVES Kortrijk',
  head: [
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?familiy=Material+Icons' }],
    ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML', async: true }]
  ],

  theme: defaultTheme({
    logo: 'https://www.vives.be/sites/default/files/uploads/huisstijl/Logo VIVES Hogeschool - Smile.png',
    navbar: [
      { text: 'Toledo', link: 'https://toledo.kuleuven.be/portal' },
      { text: 'Report Issue', link: 'https://github.com/WimDejonghe/iot-lab-complete-python/issues' },
      { text: 'Organization', link: 'https://github.com/WimDejonghe/iot-lab-complete-python' }
    ],
    sidebar: [
      {
        text: 'About this Course',
        link: '/about-this-course/README.md',
      },
      {
        text: 'Sturen/schakelen van grotere vermogens',
        children: [
          '/a-groteP/00-intro/README.md',
          '/a-groteP/01-transistor/README.md',
          '/a-groteP/02-driver/README.md',
          '/a-groteP/03-fet/README.md',
          '/a-groteP/04-hbrug/README.md',
          '/a-groteP/05-servo/README.md',
        ]
      },
      {
        text: 'WiFi',
        children: [
          '/b-wifi/01-wifi/README.md',
          '/b-wifi/02-esp32/README.md',
          '/b-wifi/03-webserver/README.md',
        ]
      },
      {
        text: 'MQTT',
        children: [
          '/c-mqtt/01-mqtt/README.md',
          '/c-mqtt/02-esp32/README.md',
        ]
      },
     
    ],
    sidebarDepth: 1,
    repo: 'WimDejonghe/iot-lab-complete-python',
    docsDir: 'docs',
    docsBranch: 'main'
  }),
  serviceWorker: true,
  plugins: [
    containerPlugin({
      type: 'codeoutput',
      locales: {
        '/': {
          defaultInfo: 'Output',
        },
      },
    }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
    
  ],
}