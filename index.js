'use strict';

const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const nodejieba = require('nodejieba');
const exporter = require('highcharts-export-server');
const htmlparser = require('htmlparser2');
const fetch = require('node-fetch');
const _ = require('lodash');

const questionTmpl = 'https://www.zhihu.com/api/v4/questions/_questionid_';
const answersTmpl = 'https://www.zhihu.com/api/v4/questions/_questionid_/answers';
// ?include=content,excerpt&limit=20&offset=0&platform=desktop&sort_by=default

const params = {
  include: 'content,excerpt',
  limit: 20,
  offset: 0,
  platform: 'desktop',
  sort_by: 'default', // default - 默认排序，updated - 更新时间排序
};
const defaultConfig = {
  words: 20,
  path: process.cwd(),
  number: 20,
};
const score = {};
console.log(process.cwd());

const parser = new htmlparser.Parser({
  ontext(text) {
    // console.log(text);
    const taggedArr = nodejieba.tag(text).filter(word => {
      const tag = word.tag;

      // a 开头表示是形容词
      return tag.startsWith('a'); //  || tag.startsWith('n')
    });

    // 统计词频
    // console.log(taggedArr);
    for (const tag of taggedArr) {
      if (score[tag.word]) {
        score[tag.word]++;
      } else {
        score[tag.word] = 1;
      }
    }

  },
}, { decodeEntities: true });

async function fetchData(url) {
  const resp = await fetch(`${url}`);
  if (!resp.ok) {
    // throw new Error(resp.statusText);
    console.error(`请求回答数据异常: ${resp.status} - ${resp.statusText} (${await resp.text()})`);
    process.exit(-1);
  }
  // console.log(resp)

  return resp.json();
}

async function analyze(answerList) {
  for (const answer of answerList) {
    // console.log(answer);
    parser.write(answer.content);
  }
}

function generateChart(title, conf) {
  console.log('开始绘画词云');
  const data = Object.entries(score)
    .sort((a, b) => {
      return b.weight - a.weight;
    })
    .slice(0, conf.words)
    .map(item => {
      return {
        name: item[0],
        weight: item[1],
      };
    });
  const exportSettings = {
    type: 'png',
    options: {
      series: [{
        type: 'wordcloud',
        data,
        name: 'Occurrences',
      }],
      title: {
        text: title,
      },
    },
  };

  // Set up a pool of PhantomJS workers
  exporter.initPool();

  // Perform an export
  /*
    Export settings corresponds to the available CLI arguments described
    above.
*/
  exporter.export(exportSettings, function(err, res) {
    console.log('绘画词云结束');
    // The export result is now in res.
    // If the output is not PDF or SVG, it will be base64 encoded (res.data).
    const imageData = res.data;

    // const buff = new ArrayBuffer(imageData, 'base64');
    console.log('开始生成文件');
    fs.writeFileSync(path.join(conf.path, `${Date.now()}.png`), imageData, { encoding: 'base64' });
    console.log('生成文件成功');
    // If the output is a PDF or SVG, it will contain a filename (res.filename).

    // Kill the pool when we're done with it, and exit the application
    exporter.killPool();
    process.exit(1);
  });
}

async function main(conf) {
  // 279441465, 328077021
  const questionUrl = questionTmpl.replace('_questionid_', conf._[0]);
  const answerUrl = answersTmpl.replace('_questionid_', conf._[0]);
  const resolvedConf = _.defaults({}, conf, defaultConfig);
  const resolvedParams = Object.assign({}, params);

  const questionData = await fetchData(questionUrl);

  let answerData;
  let i = 0;
  while (resolvedParams.offset < resolvedConf.number) {
    resolvedParams.offset = resolvedParams.limit * i;

    console.log('开始获取数据');
    try {
      console.log(`${answerUrl}?${querystring.stringify(resolvedParams)}`);
      answerData = await fetchData(`${answerUrl}?${querystring.stringify(resolvedParams)}`);
      analyze(answerData.data);

    } catch (error) {
      console.error('请求数据异常：', error);
      throw error;
    } finally {
      i++;
    }
  }

  console.log('获取数据结束');
  generateChart(questionData.title, resolvedConf);

  parser.end();

}

// main();
exports.main = main;
// function testNodeJieba() {
//   const sentence = '我是拖拉机学院手扶拖拉机专业的。不用多久，我就会升职加薪，当上CEO，走上人生巅峰。';

//   let result;

//   // 没有主动调用nodejieba.load载入词典的时候，
//   // 会在第一次调用cut或者其他需要词典的函数时，自动载入默认词典。
//   // 词典只会被加载一次。
//   result = nodejieba.cut(sentence);
//   console.log(result);

//   result = nodejieba.cut(sentence, true);
//   console.log(result);

//   result = nodejieba.cutHMM(sentence);
//   console.log(result);

//   result = nodejieba.cutAll(sentence);
//   console.log(result);

//   result = nodejieba.cutForSearch(sentence);
//   console.log(result);

//   result = nodejieba.tag(sentence);
//   console.log(result);
//   console.log('=======');
//   console.log(nodejieba.extractWithWords(nodejieba.tagWordsToStr(result), 5));
//   console.log(nodejieba.extract(sentence, 5));

//   console.log(nodejieba.textRankExtractWithWords(nodejieba.tagWordsToStr(result), 5));
//   console.log(nodejieba.textRankExtract(sentence, 5));
//   console.log('=======');
//   const topN = 5;
//   result = nodejieba.extract(sentence, topN);
//   console.log(result);

//   result = nodejieba.cut('男默女泪');
//   console.log(result);
//   nodejieba.insertWord('男默女泪');
//   result = nodejieba.cut('男默女泪');
//   console.log(result);

//   result = nodejieba.cutSmall('南京市长江大桥', 3);
//   console.log(result);

// }
// testNodeJieba();
