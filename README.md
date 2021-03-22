# zhihu-answer-wordcloud

突然翻到两年前为了想知道知乎的一个问题下一共有多少个回答是黑詹姆斯的而写的一个简单爬虫程序，简单封装成 cli 工具方便调用。


## 安装

```bash
# npm i -g zhihu-answer-wordcloud
```

因为依赖了 `Highcharts`，安装中途可能会弹出来一些安装 `Highcharts` 的选项，主要是版本选择 ~7.x.x~ 和要选择 `WordCloud` 插件

![86D0DC69-DF3B-4CA1-9F6E-B47FC942FEF6](https://user-images.githubusercontent.com/6936358/112041785-bfcf2d80-8b81-11eb-89b8-40b80923aadd.png)

Ps: 因为很久的项目，测试只有在 **Node 8 和 Node 10** 能跑成功

## 使用

```bash
[2:46:04] xlaoyu:zhihu-answer-hot $ zhwc --help
/Users/xlaoyu/workspaces/github/zhihu-answer-hot
Usage: zhwc <answerId>

选项：
  --version     显示版本号                                                [布尔]
  --number, -n  需要统计多少条回答, 0 表示获取全部，默认：100
                                                            [数字] [默认值: 100]
  --path, -p    图片存储路径，默认：当前命令执行路径                    [字符串]
  --words, -w   词云最多显示多少个词语，默认：20             [数字] [默认值: 20]
  --help        显示帮助信息                                              [布尔]
[2:46:09] xlaoyu:zhihu-answer-hot $ zhwc 328077021
```

## 效果

![word-cloud2](https://user-images.githubusercontent.com/6936358/112040796-982b9580-8b80-11eb-89f9-28f40f45e28f.png)


## License

[MIT](./LICENSE) @ xlaoyu