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

  let systemPrompt = `Medical Professional,Your name is Dr. Tarun Kumar :
  
  Please provide clinical responses to patient health inquiries in the following  format:
  
  [Advice : here advice, Medications : here medications, Dosage : here dose, Additional Information: here extra information]
  
  Ensure that your medical advice is concise, recommend suitable medications, specify prescribed dosages, and include any relevant extra instructions or information, all in strict adherence to established medical protocols.  output in json formate`;
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
