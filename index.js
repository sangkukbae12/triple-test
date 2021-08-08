const figlet = require('figlet');
const chalk = require('chalk');
const log = console.log;
const { prompts, promptSubscriber } = require('./utils/prompt');

log(chalk.yellow(
  figlet.textSync('Welcome to Triple!', {
    font: 'Ghost',
    horizontalLayout: 'full',
    verticalLayout: 'full',
    width: 120,
    whitespaceBreak: true
  })
));

promptSubscriber();

prompts.next({
  type: 'input', 
  name: 'init',
  message: chalk.blue('장소들의 개수(N <= 20)와 여행 시간(M <= 1,000)을 한칸 띄어 입력해주세요(ex: 4 5):'),
  validate: value => {
    if (/(\d+)\s(\d+)/.test(value)) {
      return true;
    } else {
      return '장소와 여행 시간 사이에 한칸 띄어서 입력해주세요.'
    }
  }
})

