import { DATABASE_ID, USER_AI_CHAT } from "@/app/constKey/key";
import { databases, ID } from "../../appwrite/appwrite";
export async function POST(req) {
  const { conversationId, msg } = await req.json();

  saveConversation(conversationId, msg);
  // console.log(`${conversationId},${msg}`);
  return new Response(" ai conversation Saved", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

// le document devais etre update ici ,apres l avoir cree lors d'un upload
async function saveConversation(conversationId_docId, messages) {
  const promise = databases.updateDocument(
    DATABASE_ID,
    USER_AI_CHAT,
    conversationId_docId,
    {
      messages: messages,
    }
  );
  console.log(promise);
}
