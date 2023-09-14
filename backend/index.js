const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const openai = new OpenAIApi(
  new Configuration({
    apiKey: `${process.env.open_ai_key}`,
  })
);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", (req, res) => {
  // let payload  = req.body

  // console.log(req.body)
  let { text } = req.body;

  //   console.log(text, lang, word)

  // "Hello, ChatGPT. I'm seeking your expertise as a doctor consultant. Please provide me with information and guidance related to medical conditions, symptoms, treatments, and general healthcare advice. I understand that you will not provide information on topics outside of the medical field, and I expect you to prioritize ethical considerations when offering any medical advice. Please help me with my medical queries."

  let systemPrompt = `"Dr. Tarun, Medical Professional:
  Please provide clinical responses to patient health inquiries. Offer precise medical advice, recommend suitable medications with dosages, and specify medication timing, adhering strictly to medical guidelines.

  Strictly Follow the format:
   "Advice": "Your medical advice here",
    "Medicines": "Recommended medications here", 
    "Dose": "Prescribed dosage here", 
    "Extra Information": "Additional information or instructions"


    [note - I want output in array with above four items]
`;
  try {
    openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },

          { role: "user", content: `${text}` },
        ],
        // output_format: "array",
        max_tokens: 3900,
      })
      .then((resp) => {
        let ans = resp.data.choices[0].message.content;
        ans = ans.split("\n\n");
        console.log(ans);
        res.send({ msg: ans });
      });
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.port, () => {
  console.log(`${process.env.port} port is working`);
});
