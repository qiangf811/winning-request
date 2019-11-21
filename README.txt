# wining-request
> 费用域基于axois封装的request插件

## 安装

将npm源切换为winning

```bash
npm install @winning-plugin/request -S

```

或者

```bash
yarn add @winning-plugin/request -S

```

## 使用

**@winning-plugin/request**  本质上为一个js类，核心功能提供了生成和后端交互的方法，

1、 初始化

```javascript
import Request from '@winning-plugin/request'
import { Message } from 'element-ui'

export const request = new Request({
  devBaseUrl: 'http://172.16.6.213:41200',
  proBaseUrl: '/finance-mdm',
  Message,
  isAddSoid: false
})

export default request
```
2、 生成请求

```javascript
/** 本服务计费 */
import request from '...'
export const addOriginService = request.temp(url, {
  failTxt: '本服务计费设置添加失败！',
  successTxt: '本服务计费设置添加成功！',
  warning: false,
  refixFn: function (data) {
  	...
	return data
  },
  checkFn: function (data) {
	 ...
	 return data
	}
})
```
3、页面中调用
```javascript
import { addOriginService } from '...'
addOriginService({
	...  // 入参
}, [{
	... // 个性化配置 （非必需，可覆盖之前的配置信息）
}]).then(res => {
...
})
```

## 配置说明（config）

考虑同一个api在不同的页面有不同的应用场景，**winning-request** 提供了三层配置场景，你可以在`初始化`、`生成请求方法`、`页面方法调用`、后面的配置参数会覆盖之前的配置。

|  Param Name  | Required | Description |
|--------|----------|-------------|
| Message   | 是       | 统一报错的方法  |
| devBaseUrl   | 否       | 本地开发接口前缀，不传的话为空字符串 |
| proBaseUrl   | 否       | 打包后的接口前缀，不传的话为空字符串 |
|isAddSoid   | 否        |是否统一加hospitalSOID, 默认为 true |
|warning| 否| 接口出错时是否提示，默认为ture |
|login| 否| 是否需要登录，默认为true |
|refixFn|否| 在请求发出前对入参重新定义的方式，无默认值|
|checkFn| 否| 在请求发出前，对入参进行校验的方法，未通过则取消请求，无默认值|
|checkWarning| 否| 当checkFn 未通过时，是否提示错误信息， 默认为true|



