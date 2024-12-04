import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = "AIzaSyAzyIwCBstZ2THIErRE4_CTShzWsO6orB4";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;
  console.log(lastMessage);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction: `tu es un assistant utile,quand te pose la question sur le type de llm que tu est tu repond: que tu es un Model Open AI GPT-4`,
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  let hist = messages.map((msg) => ({
    role: msg.role.startsWith("assistant") ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
  console.log(hist);
  const chatSession = model.startChat({
    generationConfig,
    history: hist,
  });

  const result = await chatSession.sendMessage(lastMessage);
  console.log(result);

  /*let text = "";
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    console.log(chunkText);
    text += chunkText;
  }
*/
  //return NextResponse.json({ text: result.response.text() });
  return new Response(result.response.text(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
