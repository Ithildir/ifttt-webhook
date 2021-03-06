const superagent = require('superagent');
const { fixText } = require('../utils');
const habiticaKeywords = require('./habiticaKeywords.json');

const { HABITICA_API_KEY, HABITICA_USER_ID } = process.env;

const HABITICA_HEADERS = {
  'x-api-key': HABITICA_API_KEY,
  'x-api-user': HABITICA_USER_ID,
  'x-client': `${HABITICA_USER_ID}-Testing`,
};

async function createTask(options) {
  const { body } = await superagent
    .post('https://habitica.com/api/v3/tasks/user')
    .set(HABITICA_HEADERS)
    .send({
      ...options,
      text: fixText(options.text),
    });

  console.log(`Created Habitica ${body.data.type} ${body.data.id}`);
}

async function score({ direction, taskId }) {
  await superagent
    .post(`https://habitica.com/api/v3/tasks/${taskId}/score/${direction}`)
    .set(HABITICA_HEADERS);

  console.log(`Scored Habitica task ${taskId} ${direction}`);
}

function scoreByKeyword(s) {
  const taskId = Object.keys(habiticaKeywords).find((key) =>
    habiticaKeywords[key].some((keyword) => s.includes(keyword))
  );

  if (taskId) {
    return score({ direction: 'up', taskId });
  }

  return null;
}

module.exports = {
  createTask,
  score,
  scoreByKeyword,
};
