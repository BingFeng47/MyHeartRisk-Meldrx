import { NextResponse } from "next/server";
import { Fhir } from "fhir";

var fhir = new Fhir();

interface ACSData {
  ptageatnotification?: number,
  heartrate?: number,
  canginapast2wk?: number,
  killipclass?: number,
  hdlc?: number,
  ldlc?: number,
  fbg?: number,
  cabg?: number,
  oralhypogly?: number,
  antiarr?: number,
  ecgabnormlocationll?: number,
  cardiaccath?: number,
  statin?: number,
  lipidla?: number
}


// Calulate age from birthdate
const calculateAge = (birthdate: string) => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
  age--;
  }
  return age;
};

// Get FRS Score
const getFrsScore = async (data: {
  age: number;
  hdlc: number;
  sex: number;
  tc: number;
  bpsys: number;
  bpsys_treatment: number;
  smoker: number;
  diabetes: number;
}) => {
  try {
    console.log("pass data = " ,JSON.stringify(data))
    const response = await fetch('http://127.0.0.1:8000/frs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });


    return response.json();
  } catch (error) {
    console.error('Error fetching FRS score:', error);
    throw error;
  }

};





export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; 

    // Check if request has a body
    const bodyText = await req.text();
    const body = bodyText ? JSON.parse(bodyText) : {};
    const observations: { observation: string; value: string; code: string; }[] = []; // Initialize the observations array


    // Get Observations
    if (body.prefetch.observations.entry) {
    
      body.prefetch.observations.entry.forEach((entry: any) => {
        const resource = entry.resource; // Access the resource object
    
        let observation = "Unknown"; // Default value for observation text
        let code = "Unknown"; // Default value for observation code
        let value = "Unknown"; // Default value for observation value
    
        // Extract observation text or display name
        if (resource.code) {
          if (resource.code.text) {
            observation = resource.code.text;
          } else if (resource.code.coding && resource.code.coding.length > 0 && resource.code.coding[0].display) {
            observation = resource.code.coding[0].display;
          }
    
          // Extract observation code
          if (resource.code.coding && resource.code.coding.length > 0 && resource.code.coding[0].code) {
            code = resource.code.coding[0].code;
          }
        }
    
        // Extract observation value
        if (resource.valueQuantity && resource.valueQuantity.value !== undefined) {
          value = resource.valueQuantity.value;
        } else if (resource.valueCodeableConcept && resource.valueCodeableConcept.text) {
          value = resource.valueCodeableConcept.text;
        }
    
        // Push the result to the observations array
        observations.push({ observation, value, code });
      });
    }
    console.log(observations); // For debugging purposes

    // Get FRS Score
    const hdlc = parseFloat(observations.find(obs => obs.code === '2085-9')?.value ?? '1.0') || 1.0;
    const tc = parseFloat(observations.find(obs => obs.code === '2093-3')?.value ?? '1.0') || 1.0;
    const bpsys = parseFloat(observations.find(obs => obs.code === '8480-6')?.value ?? '2.5') || 120;
    const bpsys_treatment = 0; // Assuming no treatment for now
    const smoker = 0; // Assuming non-smoker for now
    const diabetes = observations.find(obs => obs.code === '62238-1')?.value === 'Yes' ? 1 : 0;

    const birthdate = body.prefetch.patient.birthDate
    const age = calculateAge(birthdate);
    const sex = body.prefetch.patient.gender

    const frsData = {
      "age": age,
      "hdlc": hdlc,
      "sex": sex === 'male' ? 0 : 1,
      "tc": tc,
      "bpsys": 120,
      "bpsys_treatment": bpsys_treatment,
      "smoker": smoker,
      "diabetes": diabetes
    };
    const frsScore = await getFrsScore(frsData);
    console.log(`FRS probability: ${frsScore.probability}`);
    console.log(`FRS risk category: ${frsScore.risk_category}`);


    const response = {
      cards: [
      {
        indicator: 'critical',
        source: { label: 'MyHeartRisk', url: '' },
        suggestions: [{ label: 'Test suggestion', uuid: '1234' }],
        summary: `ACS Risk: ${frsScore.risk_category}`,
        detail: `Based on the Framingham Risk Score, this patient has a ${frsScore.probability} probability of developing heart disease in the next 10 years.`,
        links: [
        { label: 'View more on MyHeartRisk', url: 'https://cds-test.vercel.app/launch', type: 'smart' },
        ],
      },
      ],
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}