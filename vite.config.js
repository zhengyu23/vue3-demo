import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue()],
  plugins: [
      /* 是否开启 $ref, vue3.2的语法糖 */
      vue({
          refTransform: true,
          reactivityTransform: true,
      }),
  ],

    server: {
      // port:  8080

        // 解决跨域
      proxy:{
          '/user':   {
              target:   "http://127.0.0.1:3000"
          }
      }
    },

  base: './', // 打开相对路径
})
