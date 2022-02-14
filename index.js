import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });

app.post('/', async (req, res) => {
  const foxPicture = await getFoxPicturet()
  const catFacts = await getCatsFacts()
  const holliday = await getHolliday(req.body?.countryCode) 

  return {
    foxPicture: foxPicture,
    catFacts: catFacts ,
    holidays: holliday
  };
});

app.post('/cats', async (req, res) => {
  return getCatsFacts() 
});

app.post('/fox', async (req, res) => {
  return getFoxPicturet()
});

app.post('/holliday', async (req, res) => {
  return getHolliday(req.body?.countryCode)
});

async function getCatsFacts() {
  try {
    var catFacts = (await axios.get('https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=3')).data
    return catFacts.map(cat => cat.text)
  } catch (error) {
    return null
  }
}

async function getFoxPicturet() {
  try {
    var foxPicture = (await axios.get('https://randomfox.ca/floof/')).data
    return foxPicture.image
  } catch (error) {
    return null
  }
}

async function getHolliday(countryCode) {
  try {
    return (await axios.get('https://date.nager.at/api/v3/publicholidays/2022/' + countryCode)).data
  } catch (error) {
    return null
  }
}

// Only used for dev server, do not remove
app.head('/', () => ({ ping: 'pong' }));

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
