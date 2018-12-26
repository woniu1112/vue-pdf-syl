<template>
  <div id="showPdf">
    <div ref="elscrollbar" class="show_pdf">
      <div class="container">
        <div class="page">
          <span class="span_1" @click="pageUp">上一页</span>
          <span>页码：{{`${pageNo}/${totals.length}`}}</span>
          <span class="span_2" @click="pageDown">下一页</span>
        </div>
        <div class="main_content" id="mainContent" ref="mainContent" @scroll="scrollfun" :style="{height: viewHeight}">
          <div v-for="item in totals" :id="`page-${item}`" :key="item" class="pdf-box">
            <canvas :id="'canvas-pdf-' + item" class="canvas-pdf"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PDFJS from 'pdfjs-dist'
import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer'
import 'pdfjs-dist/web/pdf_viewer.css'

export default {
  name: 'vuePdfSyl',
  props: ['pdfUrl', 'viewHeight'],
  data () {
    return {
      totals: [],
      pageNo: 1,
      viewH: 0,
      scrollbar: '',
      contentWidth: ''
    }
  },
  mounted () {
    this.getMainContentWidth()
    this.renderPdf(this.pdfUrl)
  },
  methods: {
    getMainContentWidth () {
      this.scrollbar = this.$refs.mainContent
      let width = window.getComputedStyle(this.scrollbar).width
      this.contentWidth = parseInt(width)
    },
    renderPdf (pdfUrl) {
      PDFJS.workerSrc = require('pdfjs-dist/build/pdf.worker.min')
      PDFJS.getDocument(pdfUrl).then(pdf => {
        let totalPage = pdf.numPages
        let idName = 'canvas-pdf-'
        this.createCanvas(totalPage, idName)
        for (let i = 1; i <= totalPage; i++) {
          pdf.getPage(i).then((page) => {
            let pageDiv = document.getElementById(`page-${i}`)
            let viewportFirst = page.getViewport(1)
            let scale = this.contentWidth / viewportFirst.width
            let viewport = page.getViewport(scale)
            let canvas = document.getElementById(idName + i)
            let context = canvas.getContext('2d')
            canvas.height = viewport.height
            canvas.width = viewport.width
            this.viewH = viewport.height
            let renderContext = {
              canvasContext: context,
              viewport
            }
            page.render(renderContext).then(() => {
              return page.getTextContent()
            }).then((textContent) => {
              // 创建文本图层div
              const textLayerDiv = document.createElement('div')
              textLayerDiv.setAttribute('class', 'textLayer')
              // 将文本图层div添加至每页pdf的div中
              pageDiv.appendChild(textLayerDiv)
              // 创建新的TextLayerBuilder实例
              let textLayer = new TextLayerBuilder({
                textLayerDiv: textLayerDiv,
                pageIndex: page.pageIndex,
                viewport: viewport
              })
              textLayer.setTextContent(textContent)
              textLayer.render()
            })
          })
        }
      })
    },
    createCanvas (totalPages) {
      for (let i = 1; i <= totalPages; i++) {
        this.totals.push(i)
      }
    },
    /**
     * 分页
     */
    scrollfun (e) {
      let scrollTop = e.target.scrollTop
      if (scrollTop === 0) {
        this.pageNo = 1
      } else {
        this.pageNo = Math.ceil((scrollTop + 15) / this.viewH)
      }
    },
    /**
     * 上一页
     */
    pageUp () {
      let totalPages = this.totals.length
      if (this.pageNo > 0) {
        this.scrollbar.scrollTop = (this.pageNo - 2) * (this.scrollbar.scrollHeight / totalPages)
      }
    },
    /**
     * 下一页
     */
    pageDown () {
      let totalPages = this.totals.length
      if (this.pageNo < totalPages) {
        this.scrollbar.scrollTop = this.pageNo * (this.scrollbar.scrollHeight / totalPages)
      }
    }
  }
}
</script>

<style lang="scss">
  #showPdf {
    .show_pdf {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
    }
    .page {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.2);
      z-index: 100;
      padding: 0 15px;
      line-height: 25px;
      text-align: center;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      color: #fff;
      .span_1 {
        float: left;
        cursor: pointer;
      }
      .span_2 {
        float: right;
        cursor: pointer;
      }
    }
    .main_content {
      width: 100%;
      overflow-y: auto;
    }
    .pdf-box {
      position: relative;
      text-align: left;
      display: inline-block;
    }
  }
</style>
