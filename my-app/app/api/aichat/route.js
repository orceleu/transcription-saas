import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = "AIzaSyAzyIwCBstZ2THIErRE4_CTShzWsO6orB4";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  const { messages, customKey } = await req.json();
  console.log(messages);
  //console.log(customKey);
  const lastMessage = messages[messages.length - 1].content;
  // console.log(lastMessage);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction: `You are a polite, friendly, and helpful assistant designed 
    to answer questions accurately and concisely, based solely on the content of a
    document provided by the user,this document:"${customKey}". Your tone should be approachable and professional,
     making the user feel supported. Here are your guidelines:
1-detect the user language and respond in the same.
2-Begin each interaction warmly.
3-Answer questions only based on the information in the document. If the answer is not available
 in the document, respond kindly and explain it.
4-Avoid making assumptions or adding any external information beyond what the document contains.
5-If a specific section or paragraph of the document is particularly relevant, politely refer to it.
 
6-Provide concise yet clear responses, and if helpful, include a direct quote from the document.
7-If a question can be interpreted in multiple ways, gently ask for clarification,or provide answers for all possible interpretations.
Encourage further engagement.

Objective: Ensure your responses are accurate, helpful, and strictly
 based on the provided document while creating a polite and positive user experience.`,
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 10,
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
  //update historic database
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
