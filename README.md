##使用（use）
```
npm install vue-pdf-syl --save
npm install pdfjs-dist --save
```

**app.vue**
```
<template>
    <div id="app">
        <vuePdf :height="pdfHeight" :pdfUrl="pdfUrl"></vuePdf>
    </div>
</template>

<script>
import vuePdf from 'vue-pdf-syl'

export default {
    name: 'app',
    components: {
        vuePdf
    },
    data () {
        return {
            pdfHeight: '500px',
            pdfUrl: 'static/test.pdf'
        }
    }
}
</script>
<style scoped>

</style>
```

**注意**

* 接受后台传输的pdf，后台应该以流的形式进行传输，前端接收看下面代码

```
getPdfFun () {
  axios({
    method: 'get',
    url: url, // 后台传输pdf地址
    data: {},
    responseType: 'blob'
  }).then(res => {
    let url = window.URL.createObjectURL(new Blob([res.data]))
    this.pdfUrl = url
  })
}
```