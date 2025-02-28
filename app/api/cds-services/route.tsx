import { NextResponse } from "next/server";

export async function GET() {
    try {

      const response = {
        services: [
            {
                hook: "patient-view",
                title: "Patient View",
                description: "This service provides information about the patient",
                id: "0001",
                prefetch: {
                    patient: 'Patient/{{context.patientId}}',
                    conditions: 'Condition?patient={{context.patientId}}',
                    observations: 'Observation?patient={{context.patientId}}'
                }
            }
        ]
    };

      return NextResponse.json(response, { status: 200 });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }
  }