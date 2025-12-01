import { GoogleGenAI, Type } from "@google/genai";
import { KeywordAnalysis, SearchIntent, Level, StrategyResult } from "../types";

export interface GenerationOptions {
    negativeKeywords?: string;
    strategyType?: 'BROAD' | 'NICHE';
}

const parseGeminiResponse = (responseText: string): StrategyResult => {
    try {
        const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText) as StrategyResult;
    } catch (e) {
        console.error("Failed to parse JSON", e);
        throw new Error("Invalid response format from AI");
    }
};

export const generateKeywordStrategy = async (topic: string, options?: GenerationOptions): Promise<StrategyResult> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });

    let prompt = `
    Act as a Senior SEO Strategist fluent in Persian (Farsi). 
    Perform a keyword research analysis based on the topic: "${topic}".
    `;

    // Apply Advanced Options
    if (options?.negativeKeywords) {
        prompt += `\nCONSTRAINT: You must STRICTLY EXCLUDE any keywords that contain or are related to: "${options.negativeKeywords}".\n`;
    }

    if (options?.strategyType === 'NICHE') {
        prompt += `\nCONSTRAINT: Focus on "Long-tail" and "Niche" keywords. Prioritize specific intent and lower competition over high volume.\n`;
    } else {
        prompt += `\nCONSTRAINT: Focus on "High Volume" and "Broad" keywords. Prioritize brand awareness and general traffic.\n`;
    }

    prompt += `
    You must follow this filtering process:
    1. Assess Search Volume (High/Medium/Low) - representing Traffic Potential.
    2. Assess Commercial Value (High/Medium/Low) - representing relevance to business.
    3. Identify Search Intent (Informational, Transactional, Commercial, Navigational) - representing User Needs.
    4. Analyze Competition/Difficulty (High/Medium/Low).
    5. Estimate a Difficulty Score (0-100) where 100 is extremely difficult to rank.
    6. Suggest the best "Content Format" (e.g., Comprehensive Guide, Top 10 List, Product Landing Page, Comparison Review).
    7. Write a compelling, high-CTR "SEO Title" in Persian for this keyword.

    Generate 10-12 highly relevant keywords or phrases related to the topic in Persian (Farsi).
    
    IMPORTANT:
    - The 'keyword', 'rationale', 'summary', 'topic', 'suggestedTitle', and 'contentFormat' fields MUST be in PERSIAN.
    - The Enum values (High, Medium, Informational, etc.) MUST remain in ENGLISH for system logic.
    - Ensure 'difficultyIndex' is a number between 0 and 100.
    
    Output strictly in JSON format matching the schema.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    topic: { type: Type.STRING, description: "The core topic in Persian" },
                    summary: { type: Type.STRING, description: "A brief 1-sentence summary of the strategy in Persian." },
                    keywords: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                keyword: { type: Type.STRING, description: "Keyword in Persian" },
                                searchVolume: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                                commercialValue: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                                intent: { type: Type.STRING, enum: ["Informational", "Transactional", "Commercial", "Navigational"] },
                                competition: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                                difficultyIndex: { type: Type.NUMBER, description: "SEO Difficulty Score 0-100" },
                                rationale: { type: Type.STRING, description: "Brief reason for these metrics in Persian" },
                                contentFormat: { type: Type.STRING, description: "Recommended content type (e.g., Guide, List) in Persian" },
                                suggestedTitle: { type: Type.STRING, description: "SEO Optimized Title Tag in Persian" }
                            },
                            required: ["keyword", "searchVolume", "commercialValue", "intent", "competition", "difficultyIndex", "rationale", "contentFormat", "suggestedTitle"]
                        }
                    }
                },
                required: ["topic", "summary", "keywords"]
            }
        }
    });

    if (!response.text) {
        throw new Error("No data received from Gemini");
    }

    return parseGeminiResponse(response.text);
};