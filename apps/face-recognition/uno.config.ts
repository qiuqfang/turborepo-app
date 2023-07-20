// uno.config.ts
import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  presets: [presetUno(), presetIcons()],
  shortcuts: {
    btn: 'rounded-lg px-4 py-2 bg-blue-500 text-white border-none cursor-pointer hover:bg-blue-400',
  }
})
