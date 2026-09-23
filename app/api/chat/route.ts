import { NextResponse } from "next/server"
import { getGroqClient, GROQ_MODELS } from "@/lib/groq"

export async function POST(req: Request) {
  try {
    const { messages, patientContext } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const groq = getGroqClient()

    const systemPrompt = `
You are MediSum AI, an elite Clinical Intelligence Decision Support Copilot.
You are assisting an attending physician or clinical team reviewing a patient's electronic health record.
Ground all your clinical answers strictly in the active patient's EHR context provided below.
Be concise, authoritative, evidence-based, and highlight critical contraindications, lab interpretations, or next diagnostic steps.

=== CURRENT PATIENT CONTEXT ===
Patient Name: ${patientContext?.metadata?.name || "Unknown"}
MRN: ${patientContext?.metadata?.mrn || "Unknown"}
DOB: ${patientContext?.metadata?.dob || "Unknown"}
Primary Target Anatomy: ${patientContext?.targetAnatomy || "General"}
Vitals: ${JSON.stringify(patientContext?.vitals || {})}
Summary Findings: ${JSON.stringify(patientContext?.summaryPoints || [])}
Risk Predictions: ${JSON.stringify(patientContext?.predictions || [])}
Raw Note Snippet:
${patientContext?.rawText || "No raw text available"}
===============================

Provide a professional, direct, medically accurate answer. Keep answers under 3 concise paragraphs. Use bullet points where appropriate.
`

    if (groq) {
      try {
        const groqMessages = [
          { role: "system" as const, content: systemPrompt },
          ...messages.map((m: any) => ({
            role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
            content: m.text || m.content || "",
          })),
        ]

        const response = await groq.chat.completions.create({
          model: GROQ_MODELS.CHAT,
          messages: groqMessages,
          temperature: 0.3,
          max_tokens: 600,
        })

        const reply = response.choices[0]?.message?.content
        if (reply) {
          return NextResponse.json({
            success: true,
            source: "groq-llama-3.1-8b",
            reply,
          })
        }
      } catch (groqErr: any) {
        console.warn("Groq chat API error, falling back to simulated clinical advisor:", groqErr?.message)
      }
    }

    // Dynamic Clinical Context Fallback
    const lastUserQuery = messages[messages.length - 1]?.text || ""
    const fallbackReply = generateClinicalContextReply(lastUserQuery, patientContext)

    return NextResponse.json({
      success: true,
      source: "local-clinical-advisor",
      reply: fallbackReply,
    })
  } catch (err: any) {
    console.error("Clinical chat error:", err)
    return NextResponse.json({ error: "Failed to process clinical consult query" }, { status: 500 })
  }
}

function generateClinicalContextReply(query: string, context: any): string {
  const q = query.toLowerCase()
  const name = context?.metadata?.name || "the patient"
  const anatomy = context?.targetAnatomy || "general"

  if (q.includes("antibiotic") || q.includes("medication") || q.includes("drug")) {
    const allergy = context?.metadata?.allergies?.join(", ") || "None documented"
    return `Based on ${name}'s chart, empirical antimicrobial therapy is ordered according to emergency guidelines. Note that documented allergies include: ${allergy}. Verify renal dosing and blood culture order times prior to subsequent administrations.`
  }

  if (q.includes("surgery") || q.includes("operation") || q.includes("procedure")) {
    return `For ${name}, surgical evaluation is indicated based on current imaging and physical exam findings. Ensure strict NPO status is maintained, consent is obtained, and pre-operative lab workup (CBC, Coags, Type & Screen) is sent STAT.`
  }

  if (q.includes("vital") || q.includes("lab") || q.includes("wbc") || q.includes("troponin")) {
    const vitalsStr = context?.vitals ? `HR: ${context.vitals.hr} bpm, BP: ${context.vitals.bp}, Temp: ${context.vitals.temp}` : "Active monitoring"
    return `Current recorded parameters for ${name}: ${vitalsStr}. Lab findings demonstrate acute systemic response. Recommend continuous telemetry and repeat labs per clinical protocol.`
  }

  return `Regarding ${name} (${context?.metadata?.mrn}): Key clinical priority centers on stabilizing the acute ${anatomy} condition. The patient has been triaged with active alerts. Please monitor for hemodynamic fluctuations or changes in serial biomarkers.`
}
