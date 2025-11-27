import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    metadata: {
      type: SchemaType.OBJECT,
      properties: {
        name: { type: SchemaType.STRING, description: "Patient name" },
        dob: { type: SchemaType.STRING, description: "Date of birth YYYY-MM-DD" },
        mrn: { type: SchemaType.STRING, description: "Medical Record Number" },
        date: { type: SchemaType.STRING, description: "Date of record" },
      },
      required: ["name", "dob", "mrn", "date"],
    },
    annotatedHtml: {
      type: SchemaType.STRING,
      description: "HTML with <section> and <span class='highlight-source'> tags",
    },
    summaryPoints: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          sourceId: { type: SchemaType.STRING },
          category: { type: SchemaType.STRING, enum: ["Critical", "Diagnosis", "Vitals", "Plan"] },
          technical: { type: SchemaType.STRING },
          simple: { type: SchemaType.STRING },
          riskLevel: { type: SchemaType.STRING, enum: ["High", "Medium", "Low"] },
        },
        required: ["id", "sourceId", "category", "technical", "simple", "riskLevel"],
      },
    },
    predictions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          label: { type: SchemaType.STRING },
          value: { type: SchemaType.NUMBER },
          unit: { type: SchemaType.STRING },
          severity: { type: SchemaType.STRING, enum: ["high", "low"] },
          details: { type: SchemaType.STRING },
        },
        required: ["label", "value", "unit", "severity", "details"],
      },
    },
  },
  required: ["metadata", "annotatedHtml", "summaryPoints", "predictions"],
}

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json()

    if (!rawText) {
      return Response.json({ success: false, error: "Raw text is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    })

    const prompt = `
      Analyze the following medical record and extract structured data.
      
      1. Metadata: Extract name, DOB, MRN, Date.
      2. Annotated HTML: Create semantic HTML. Wrap key findings in <span id="evidence_X" class="highlight-source">...</span>.
         Use <section id="..."> and <h3> tags.
      3. Summary Points: Create 4-6 points linking to evidence_X IDs.
      4. Predictions: Generate 2-4 risk predictions based on the text.
      
      Medical Record:
      ${rawText}
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const data = JSON.parse(text)

    return Response.json({ success: true, data })
  } catch (error) {
    console.error("Analysis error:", error)
    return Response.json({ success: false, error: "Failed to analyze" }, { status: 500 })
  }
}
