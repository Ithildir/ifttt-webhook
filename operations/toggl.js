const TogglClient = require('toggl-api');
const { promisify } = require('util');
const habitica = require('./habitica');
const { fixText } = require('../utils');

const { TOGGL_API_TOKEN } = process.env;

const toggl = new TogglClient({ apiToken: TOGGL_API_TOKEN });

const getCurrentTimeEntryAsync = promisify(
  toggl.getCurrentTimeEntry.bind(toggl)
);
const startTimeEntryAsync = promisify(toggl.startTimeEntry.bind(toggl));
const stopTimeEntryAsync = promisify(toggl.stopTimeEntry.bind(toggl));

async function stopTimer() {
  const timeEntry = await getCurrentTimeEntryAsync();

  if (timeEntry) {
    await stopTimeEntryAsync(timeEntry.id);

    console.log(
      `Stopped time entry ${timeEntry.id}: "${timeEntry.description}"`
    );

    await habitica.scoreByKeyword(timeEntry.description);
  }
}

async function startTimer({ description }) {
  await stopTimer();

  const timeEntry = await startTimeEntryAsync({
    description: fixText(description),
  });

  console.log(`Started time entry ${timeEntry.id}: "${timeEntry.description}"`);
}

module.exports = {
  startTimer,
  stopTimer,
};
