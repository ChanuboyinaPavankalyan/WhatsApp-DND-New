const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { DateTime } = require('luxon');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

/* ------------------ Middleware ------------------ */
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ------------------ JWT ------------------ */
function verifyJwt(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).send('Invalid JWT');
  }
}

/* ------------------ Timezone Map ------------------ */
const countryTimezones = {
  india: 'Asia/Kolkata',
  germany: 'Europe/Berlin',
  usa: 'America/New_York',
  uk: 'Europe/London',
  slovakia: 'Europe/Bratislava'
};

function evaluate(country) {
  const tz = countryTimezones[country?.toLowerCase()];
  if (!tz) return { isWithinWindow: false, currentHour: null };

  const now = DateTime.now().setZone(tz);
  return {
    isWithinWindow: now.hour >= 9 && now.hour < 18,
    currentHour: now.hour
  };
}

/* ------------------ Root ------------------ */
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/.well-known/journeybuilder/config.json', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/config.json'))
);

/* ------------------ Execute ------------------ */
const dedupe = new Set();
app.post('/activity/execute', verifyJwt, (req, res) => {
  const key = req.body.activityId + ':' + req.body.definitionInstanceId;
  if (dedupe.has(key)) return res.sendStatus(200);
  dedupe.add(key);

  const inArgs = Object.assign({}, ...(req.body.inArguments || []));
  const result = evaluate(inArgs.country);

  res.json([{ isWithinWindow: result.isWithinWindow, currentHour: result.currentHour }]);
});

/* ------------------ Lifecycle ------------------ */
app.post('/activity/save', verifyJwt, (req, res) => res.sendStatus(200));
app.post('/activity/validate', verifyJwt, (req, res) => res.sendStatus(200));
app.post('/activity/publish', verifyJwt, (req, res) => res.sendStatus(200));
app.post('/activity/stop', verifyJwt, (req, res) => res.sendStatus(200));

app.listen(PORT, () => console.log('🚀 Activity running'));
