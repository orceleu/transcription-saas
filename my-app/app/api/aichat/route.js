import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = "AIzaSyAzyIwCBstZ2THIErRE4_CTShzWsO6orB4";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  const { messages, customKey } = await req.json();
  const lastMessage = messages[messages.length - 1].content;
  console.log(lastMessage);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction: `You are an helpfull intelligent assistant designed to answer questions precisely and concisely based solely on the content of a document provided,this document:${customKey}. Here are your rules:

Only answer questions based on the information contained in the document. If a question cannot be answered using the document, respond with: "I cannot answer this question based on the available information."
Do not make assumptions or inferences outside the document's content.
If a specific section or paragraph of the document is directly relevant to the question, explicitly refer to that section in your response.
Provide concise but clear answers, and if necessary, quote directly from the document to support your response.
If multiple interpretations of a question are possible, clarify the question or list the relevant interpretations, then answer each separately.
Objective: Ensure your responses strictly align with the provided document's content and contain no external information.`,
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
