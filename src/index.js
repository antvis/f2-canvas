// f2-canvas.js
import F2 from '@antv/wx-f2'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    canvasId: {
      type: String,
      value: 'f2-canvas'
    },

    opts: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  ready() {
    if (!this.data.opts) {
      console.warn('组件需绑定 opts 变量，例：<ff-canvas id="mychart-dom-bar" canvas-id="mychart-bar" opts="{{ opts }}"></ff-canvas>')
      return
    }

    if (!this.data.opts.lazyLoad) {
      this.init()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init(callback) {
      const version = wx.version.version.split('.').map(n => parseInt(n, 10))
      const isValid = version[0] > 1 || (version[0] === 1 && version[1] > 9) ||
        (version[0] === 1 && version[1] === 9 && version[2] >= 91)
      if (!isValid) {
        console.error('微信基础库版本过低，需大于等于 1.9.91。')
        return
      }

      const ctx = wx.createCanvasContext(this.data.canvasId, this) // 获取小程序上下文
      const canvas = new F2.Renderer(ctx)
      this.canvas = canvas

      const query = wx.createSelectorQuery().in(this)
      query.select('.f2-canvas').boundingClientRect(res => {
        if (typeof callback === 'function') {
          this.chart = callback(canvas, res.width, res.height, F2)
        } else if (this.data.opts && this.data.opts.onInit) {
          this.chart = this.data.opts.onInit(canvas, res.width, res.height, F2)
        }
      }).exec()
    },
    touchStart(e) {
      if (this.canvas) {
        this.canvas.emitEvent('touchstart', [e])
      }
    },
    touchMove(e) {
      if (this.canvas) {
        this.canvas.emitEvent('touchmove', [e])
      }
    },
    touchEnd(e) {
      if (this.canvas) {
        this.canvas.emitEvent('touchend', [e])
      }
    },
    press(e) {
      if (this.canvas) {
        this.canvas.emitEvent('press', [e])
      }
    }
  }
})
