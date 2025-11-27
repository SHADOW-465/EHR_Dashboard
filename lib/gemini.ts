import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
// The API key should be provided via environment variable
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

export async function generateHospitalInsights(metrics: any) {
    try {
        const prompt = `
      Analyze the following hospital operational metrics and provide 3 brief, actionable predictions or insights.
      Focus on potential bottlenecks, staffing needs, or patient flow issues.
      
      Current Metrics:
      ${JSON.stringify(metrics, null, 2)}
      
      Format the response as a JSON array of objects with the following structure:
      [
        {
          "label": "Short Title",
          "confidence": 85,
          "status": "critical" | "warning" | "success"
        }
      ]
    `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Extract JSON from the response (handle potential markdown formatting)
        const jsonMatch = text.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        return []
    } catch (error) {
        console.error("Error generating insights:", error)
        return []
    }
}
