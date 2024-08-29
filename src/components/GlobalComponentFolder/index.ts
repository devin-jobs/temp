// index.js文件
import { App, defineAsyncComponent } from "vue";

/**
 * @description 在src/components目录下创建文件，即 src/components/xxx.vue
 * @description 在src/components目录下创建目录及文件，即 src/components/xxx文件夹/xxx.vue
 */
const components = import.meta.glob("./**/**.vue");
export default function install(app: App) {
  for (const [key, value] of Object.entries(components)) {
    const name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'));
    app.component(name, defineAsyncComponent(value));
  }
}
