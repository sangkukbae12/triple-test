const inquirer = require('inquirer');
const Rx = require('rxjs');
const prompts = new Rx.Subject();
const chalk = require('chalk');
const log = console.log;

let i = 0, promptCnt, capacity;

function promptSubscriber() {
  const weights = [];
  const values = [];

  const pushSplitValueFromAnswer = answer => {
    let [name, weight, value] = answer.split(',');
    weights.push(+weight);
    values.push(+value);
  }

  return (
    inquirer.prompt(prompts).ui.process.subscribe(
      ({ name, answer }) => {
        if (name === 'init') {
          [promptCnt, capacity] = answer.split(' ');
          prompts.next(makePrompt())
        } else {
          if (i < promptCnt) {
            pushSplitValueFromAnswer(answer);
            prompts.next(makePrompt())
          } else {
            pushSplitValueFromAnswer(answer);
            const result = getOptimizedValue(values, weights, +capacity);
            log(chalk.yellow(result));
            prompts.complete();
          }
        }
        i++;
      },
      err => {
        log(chalk.red(err));
      },
      () => {
        log(chalk.green('Enjoy your trip👋'))
      }
    )
  )
}

function makePrompt() {
  return {
    type: 'input', 
    name: `place${i}`, 
    message: chalk.blue(`각 장소들의 이름, 소요시간, 만족도를 ','로 구분하여 입력해주세요(ex: 오사카성,2,5):`,),
    validate: value => {
      if (/(.+),(\d+),(\d+)/.test(value)) {
        return true;
      } else {
        return `각각의 장소와 소요시간 만족도 사이에 ','로 구분해서 입력해주세요.`
      }
    }
  }
}

function getOptimizedValue(values, weights, target) {
  let T = new Array(values.length + 1);
  for(let i = 0; i < T.length; i++){
    T[i] = new Array(target+1).fill(0);
  }

  for (let i = 1; i <= values.length; i++) {
    for (let j = 0; j <= target; j++) {
      if (weights[i-1] > j) {
        T[i][j] = T[i-1][j];
      } else {
        T[i][j] = Math.max(T[i-1][j], T[i-1][j-weights[i-1]] + values[i-1]);
      }
    }
  }

  return T[values.length][target];
}

module.exports = {
  prompts,
  promptSubscriber 
}