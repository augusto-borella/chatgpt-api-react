import { useState, useEffect } from "react";
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import axios from 'axios';
import TypingAnimation from "../components/TypingAnimation";

const inter = Inter({ subsets: ['latin'] })

const template = `
You are a world class philosopher.
Students will will ask you questions about the bimodal philosophical school of thinking and you will answer them.
    You should answer the questions in a way that is consistent with the bimodal philosophical school of thinking.
    and you will follow ALL of the rules below:

    1/ Response should be very similar to the finest philosophical thinking, return just the answer

2/ If the finest philosophical thinking are irrelevant, then try to mimic the style of the finest philosophical thinking

3/ if there are important concepts in the answer, you should present their definitions at the of the answer. Include a maximum of 3 definitions.

4/ You need to be empathic with the student and double check if the student is satisfied with the answer and understanding the answers and concepts.

5/ a score metric that evaluates in scale between -5 and 5 if the students identifies himself with the paradigms of the bimodal philosophical school of thinking. Include the score at the end of the answer. Where -5 fully desagree with bimodal philosophical school of thinking paradigms. And 5 fully agree with bimodal philosophical school of thinking paradigms.

6/ You must stimulate the student to ask more questions and be curious about the bimodal philosophical school of thinking.

7/ Give answers with at least 100 words, answers with less than 100 words will be penalized.

8/ Answer him with at least 100 words.

`
//OpenAI.api_key = os.getenv("OPENAI_API_KEY")

//const llm_tuned = new OpenAI({temperature: 0.5, model: finetuned_AI_id})
//const prompt = PromptTemplate.fromTemplate(template);
//const chain_tuned = new LLMChain({llm: llm_tuned, prompt});

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([{ role: 'system', content: template }]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [...prevChatLog, { role: 'user', content: inputValue }])

    //sendMessage(inputValue);
    setFetching(true);

    setInputValue('');
  }
  useEffect(() => {
    if (fetching) {
    //const sendMessage = (message) => {
      const finetuned_AI_id = "ft:gpt-3.5-turbo-0613:personal::7wIMQJMw"
      const regular_AI_id = "gpt-3.5-turbo-0613"
      const url = '/api/chat';
      console.log("sendMessage: ", chatLog)
      const data = {
        model: finetuned_AI_id,
        //messages: [{ "role": "user", "content": message }],
        messages: chatLog,
        temperature: 0.7
      };

      axios.post(url, data).then((response) => {
        console.log(response);
        setChatLog((prevChatLog) => [...prevChatLog, { role: 'assistant', content: response.data.choices[0].message.content }])
        setIsLoading(false);
        setFetching(false);
      }).catch((error) => {
        setIsLoading(false);
        console.log(error);
        setFetching(false)
      })
    }
    }, [fetching])
  console.log("chatLog: ", chatLog)
  console.log("inputValue: ", inputValue)
  return (
    <div className="container mx-auto max-w-[700px]">
      <div className="flex flex-col h-screen bg-gray-900">
        <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">ChatGPT</h1>
        <div className="flex-grow p-6">
          <div className="flex flex-col space-y-4">
          {
        chatLog.map((message, index) => (
          <div key={index} className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}>
            <div className={`${
              message.role === 'user' ? 'bg-purple-500' : 'bg-gray-800'
            } rounded-lg p-4 text-white max-w-sm`}>
            {message.content}
            </div>
            </div>
        ))
            }
            {
              isLoading &&
              <div key={chatLog.length} className="flex justify-start">
                  <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                    <TypingAnimation />
                  </div>
              </div>
            }
      </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-none p-6">
          <div className="flex rounded-lg border border-gray-700 bg-gray-800">  
        <input type="text" className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none" placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button type="submit" className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300">Send</button>
            </div>
        </form>
        </div>
    </div>
  )
}
