import dotenv from "dotenv"
import express from "express"
import { GoogleGenAI } from "@google/genai";



const route = express.Router()

dotenv.config()


const ai = new GoogleGenAI({});


route.post("/chat", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is Required' });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
        });
      
        res.json({ reply: response });
    } catch (e) {
        console.error("Error from Gemini:", e);
        res.status(500).json({ error: e.message || "Unknown error" });
    }

})

export default route