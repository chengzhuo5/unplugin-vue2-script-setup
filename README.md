# @minar-kotonoha/unplugin-vue2-script-setup-sync

这个版本将转换函数从异步改为同步，以解决Jest@27以上版本报错的问题。

[![NPM version](https://img.shields.io/npm/v/@minar-kotonoha/unplugin-vue2-script-setup-sync?color=a1b858&label=)](https://www.npmjs.com/package/@minar-kotonoha/unplugin-vue2-script-setup-sync)

Bring [`<script setup>`](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to Vue 2. Works for Vite, Nuxt, Vue CLI, Webpack, esbuild and more, powered by [unplugin](https://github.com/unjs/unplugin).

> ⚠️ With the release of [Vue 2.7](https://blog.vuejs.org/posts/vue-2-7-naruto.html), which has Composition API and `<script setup>` built-in, **you no longer need this plugin**. Thereby this plugin has entered maintenance mode and will only support Vue 2.6 or earlier. This project will reach End of Life by the end of 2022.

## Install

```bash
npm i -D @minar-kotonoha/unplugin-vue2-script-setup-sync
npm i @vue/composition-api
```

Install [`@vue/composition-api`](https://github.com/vuejs/composition-api) in your App's entry (it enables the `setup()` hook):

```ts
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { createVuePlugin as Vue2 } from 'vite-plugin-vue2'
import ScriptSetup from '@minar-kotonoha/unplugin-vue2-script-setup-sync/vite'

export default defineConfig({
  plugins: [
    Vue2(),
    ScriptSetup({
      /* options */
    }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Nuxt</summary><br>

> It's built-in in [Nuxt Bridge](https://github.com/nuxt/bridge).

</details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
const ScriptSetup = require('@minar-kotonoha/unplugin-vue2-script-setup-sync/webpack').default

module.exports = {
  parallel: false, // disable thread-loader, which is not compactible with this plugin
  configureWebpack: {
    plugins: [
      ScriptSetup({
        /* options */
      }),
    ],
  },
}
```

Example: [`examples/vue-cli`](./examples/vue-cli)

###### TypeScript

To use TypeScript with Vue CLI, install `@vue/cli-plugin-typescript` but disable the type check:

```bash
npm i -D @vue/cli-plugin-typescript vue-tsc
```

```ts
const ScriptSetup = require('@minar-kotonoha/unplugin-vue2-script-setup-sync/webpack').default
module.exports = {
  parallel: false,
  configureWebpack: {
    plugins: [
      ScriptSetup({
        /* options */
      }),
    ],
  },
  chainWebpack(config) {
    // disable type check and let `vue-tsc` handles it
    config.plugins.delete('fork-ts-checker')
  },
}
```

And then use [`vue-tsc`](https://github.com/johnsoncodehk/volar) to do the type check at build time:

```jsonc
// package.json
{
  "scripts": {
    "dev": "vue-cli-service serve",
    "build": "vue-tsc --noEmit && vue-cli-service build"
  }
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
const ScriptSetup = require('@minar-kotonoha/unplugin-vue2-script-setup-sync/webpack').default
module.exports = {
  /* ... */
  plugins: [
    ScriptSetup({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Vue from 'rollup-plugin-vue'
import ScriptSetup from '@minar-kotonoha/unplugin-vue2-script-setup-sync/rollup'

export default {
  plugins: [
    Vue(),
    ScriptSetup({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import ScriptSetup from '@minar-kotonoha/unplugin-vue2-script-setup-sync/esbuild'
build({
  /* ... */
  plugins: [
    ScriptSetup({
      /* options */
    }),
  ],
})
```

<br></details>

<details>
<summary>Jest</summary><br>

```bash
npm i -D vue-jest
```

```ts
// jest.config.js
module.exports = {
  transform: {
    '.*\\.(vue)$': '@minar-kotonoha/unplugin-vue2-script-setup-sync/jest',
  },
}
```

<br></details>

<details>
<summary>JavaScript API</summary><br>

```ts
import { transform } from '@minar-kotonoha/unplugin-vue2-script-setup-sync'

const Vue2SFC = transform(`
<template>
  <!-- ... -->
</template>

<script setup>
  // ...
</script>
`)
```

<br></details>

## IDE

We recommend using [VS Code](https://code.visualstudio.com/) with [Volar](https://github.com/johnsoncodehk/volar) to get the best experience (You might want to disable Vetur if you have it).

When using Volar, you need to install `@vue/runtime-dom` as devDependencies to make it work on Vue 2.

```bash
npm i -D @vue/runtime-dom
```

[Learn more](https://github.com/johnsoncodehk/volar#using)

###### Global Types

If the global types are missing for your IDE, update your `tsconfig.json` with:

```jsonc
{
  "compilerOptions": {
    "types": ["@minar-kotonoha/unplugin-vue2-script-setup-sync/types"]
  }
}
```

###### Support Vue 2 template

Volar preferentially supports Vue 3. Vue 3 and Vue 2 template has some different. You need to set the `experimentalCompatMode` option to support Vue 2 template.

```jsonc
{
  "compilerOptions": {
    ...
  },
  "vueCompilerOptions": {
    "experimentalCompatMode": 2
  },
}
```

###### ESLint

If you are using ESLint, you might get `@typescript-eslint/no-unused-vars` warning with `<script setup>`. You can disable it and add `noUnusedLocals: true` in your `tsconfig.json`, Volar will infer the real missing locals correctly for you.

## Configurations

<details>
  <summary>
    Ref Sugar (take 2)
  </summary>

In v0.5.x, we shipped the **experimental** [Ref Sugar (take 2)](https://github.com/vuejs/rfcs/discussions/369) implementation based on Vue 3's [`@vue/reactivity-transform`](https://github.com/vuejs/vue-next/tree/master/packages/reactivity-transform) package. Notice the syntax is not settled yet and might be changed in the future updates. **Use at your own risk!**

To enabled it, pass the option:

```ts
ScriptSetup({
  reactivityTransform: true,
})
```

To get TypeScript support, update your `tsconfig.json` with:

```jsonc
{
  "compilerOptions": {
    "types": [
      "@minar-kotonoha/unplugin-vue2-script-setup-sync/types",
      "@minar-kotonoha/unplugin-vue2-script-setup-sync/ref-macros"
    ]
  }
}
```

</details>

## Recommendations

If you enjoy using `<script setup>`, you might also want to try [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) to improve the DX even further.

## Progress

- [x] PoC
- [x] Components registration
- [x] Compile time macros `defineProps` `defineEmits` `withDefaults` `defineExpose`
- [x] Global types
- [x] Merge with normal scripts
- [x] [Ref Sugar (take 2)](https://github.com/vuejs/rfcs/discussions/369)
- [x] `<template lang="pug">` support
- [x] Vite plugin
- [x] Webpack plugin
- [x] Nuxt module
- [ ] ~~Top-level await~~ (not supported)

## How?

<details>
  <summary>
    👀
  </summary>

![image](https://user-images.githubusercontent.com/11247099/130307245-20f9342e-377b-4565-b55d-1b91741b5c0f.png)

It's made possible by transforming the `<script setup>` syntax back to normal `<script>` and let the Vue 2 SFC compiler handle the rest.

<br></details>

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2021 [Anthony Fu](https://github.com/antfu)
