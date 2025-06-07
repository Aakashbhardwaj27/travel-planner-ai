require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a travel planner bot. Help users plan trips with hotels, activities, and itineraries.' },
        ...context,
        { role: 'user', content: message },
      ],
    });
    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong with OpenAI API' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
