### packx

基于 webpack 开发/打包工具


#### 入口在 ./src目录下,比如./src/index.jsx

```js
 --src
    -index.jsx
```

运行 packx start index

#### 入口在 ./src目录下,比如./src/demo.jsx

```js
 --src
    -demo.tsx
```

运行 packx start demo


#### 对于mpa多目录应用, 入口在 ./src/page1/index 目录下,比如./src/page1/index.jsx
```js
 --src
    --page1
        -index.jsx
```

运行 packx start page1
