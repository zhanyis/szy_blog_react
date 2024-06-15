import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { TDesignResolver, VantResolver } from 'unplugin-vue-components/resolvers';
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if ( command === 'serve' ) {
    return {
      plugins: [
        vue(),
        AutoImport({
          resolvers: [TDesignResolver({
            library: 'vue-next'
          })],
        }),
        Components({
          resolvers: [TDesignResolver({
            library: 'vue-next'
          }), VantResolver()],
        }),
        createHtmlPlugin({
          minify: true,
          entry: 'src/main.ts',
          template: 'index.html',
          inject: {
            data: {
              injectScript: `<script></script>`,
            },
            tags: [
              {
                injectTo: 'body-prepend',
                tag: 'div',
                attrs: {
                  id: 'tag',
                },
              },
            ],
          },
        })
      ]
    }
  } else if ( command === 'build' ) {
    return {
      plugins: [
        vue(),
        AutoImport({
          resolvers: [TDesignResolver({
            library: 'vue-next'
          })],
        }),
        Components({
          resolvers: [TDesignResolver({
            library: 'vue-next'
          }), VantResolver()],
        }),
        createHtmlPlugin({
          minify: true,
          /**
           * After writing entry here, you will not need to add script tags in `index.html`, the original tags need to be deleted
           * @default src/main.ts
           */
          entry: 'src/main.ts',
          /**
           * If you want to store `index.html` in the specified folder, you can modify it, otherwise no configuration is required
           * @default index.html
           */
          template: 'index.html',
    
          /**
           * Data that needs to be injected into the index.html ejs template
           */
          inject: {
            data: {
              injectScript: `<script>
                              var _hmt = _hmt || [];
                              (function () {
                                var hm = document.createElement("script");
                                hm.src = "https://hm.baidu.com/hm.js?5028ec69a4e5f1977a05389b8dd5dbb6";
                                var s = document.getElementsByTagName("script")[0];
                                s.parentNode.insertBefore(hm, s);
                              })();
                            </script>
                            <!-- Google tag (gtag.js) -->
                            <script async src="https://www.googletagmanager.com/gtag/js?id=G-5RH33P5ZZ9"></script>
                            <script>
                              window.dataLayer = window.dataLayer || [];
                              function gtag(){dataLayer.push(arguments);}
                              gtag('js', new Date());
                            
                              gtag('config', 'G-5RH33P5ZZ9');
                            </script>`,
            },
            tags: [
              {
                injectTo: 'body-prepend',
                tag: 'div',
                attrs: {
                  id: 'tag',
                },
              },
            ],
          },
        })
      ]
    }
  }
})
