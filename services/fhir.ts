const fhirServerUrl = "https://app.meldrx.com/api/fhir/0f18e56b-25b4-4da3-a8fe-ea43ad612f92";

// Function to get pateint details
async function getPatientDetails(patientId: string, accessToken: string) {

    // Workspace URL
    const url = `${fhirServerUrl}/Patient/${patientId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/fhir+json",
                "Authorization": `Bearer ${accessToken}`, // ✅ Fixed Authorization header
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data)
        return data;
    } catch (error) {
        console.error("Error fetching patient conditions:", error);
        return [];
    }
}

// Function to get Observations
async function getObservations(patientId: string, accessToken: string) {

    const url = `${fhirServerUrl}/Observation?patient=${patientId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/fhir+json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

       // Extract relevant observations into a list
        const observations = data.entry?.map((entry: any) => entry.resource) || [];

        const observationList: any[] = [];

        observations.forEach((observation: any) => {
            const observationName = observation.code?.text;
            const observationCode = observation.code?.coding?.[0]?.code;
            const observationValue = observation.valueQuantity?.value || observation.valueCodeableConcept?.text;
            const observationUnit = observation.valueQuantity?.unit 
            const observationTime = observation.effectiveDateTime;

            const formattedTime = new Date(observationTime).toLocaleString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });

            if (observationName && observationCode && observationValue !== undefined) {
                observationList.push({
                    name: observationName,
                    code: observationCode,
                    value: observationValue,
                    unit: observationUnit,
                    time: formattedTime,
                });
            }
        });

        // console.log(observationList)
        return observationList;

    } catch (error) {
        console.error("Error fetching patient observations:", error);
        return [];
    }
}

// Function to get Medications
async function getMedications(patientId: string, accessToken: string) {

    const url = `${fhirServerUrl}/MedicationStatement?patient=${patientId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/fhir+json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Extract relevant Medications into a list
        const medications = data.entry?.map((entry: any) => entry.resource) || [];

        const medicationsList: any[] = [];
        medications.forEach((medication: any) => {
            const medicationCode = medication.medicationCodeableConcept.coding[0].code;
            const medicationName = medication.medicationCodeableConcept.coding[0].display;
            const medicationStartDate = medication.effectivePeriod.start;
            const medicationEndDate = medication.effectivePeriod.end;
            const medicationDosage = medication.dosage[0].text;

            const formattedStartDate = new Date(medicationStartDate).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });

            const formattedEndDate = medicationEndDate ? new Date(medicationEndDate).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }) : null;

            medicationsList.push({
                medicationCode: medicationCode,
                medicationName: medicationName,
                medicationStartDate: formattedStartDate,
                medicationEndDate: formattedEndDate,
                medicationDosage: medicationDosage,
            });
        });
        // console.log(medicationsList)
        return medicationsList;
    } catch (error) {
        console.error("Error fetching patient medication:", error);
        return [];
    }
}

// Function to get Conditions
async function getConditions(patientId: string, accessToken: string) {

    const url = `${fhirServerUrl}/Condition?patient=${patientId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/fhir+json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Extract relevant Medications into a list
        const conditions = data.entry?.map((entry: any) => entry.resource) || [];

        const conditionList: any[] = [];
        conditions.forEach((condition: any) => {
            const clinicalStatusCode = condition.clinicalStatus.coding[0].code;
            const codeCodingCode = condition.code.coding[0].code;
            const codeCodingDisplay = condition.code.coding[0].display;
            const lastUpdated = condition.meta.lastUpdated;
            
            const formattedLastUpdated = new Date(lastUpdated).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });

            conditionList.push({
                conditionStatus: clinicalStatusCode,
                conditionCode: codeCodingCode,
                conditionName: codeCodingDisplay,
                condtionDate: formattedLastUpdated,
            });

        });
        // console.log(conditionList)
        return conditionList;
    } catch (error) {
        console.error("Error fetching patient medication:", error);
        return [];
    }
}

// Function to get Procedures
async function getProcedures(patientId: string, accessToken: string) {

    const url = `${fhirServerUrl}/Procedure?patient=${patientId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/fhir+json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Extract relevant Medications into a list
        const procedures = data.entry?.map((entry: any) => entry.resource) || [];

        const procedureList: any[] = [];

        procedures.forEach((procedure: any) => {
            
            const procedureName = procedure.code.coding[0].display;
            const procedureCode = procedure.code.coding[0].code;
            const procedureDate = procedure.performedDateTime;
            
            const formattedProcedureDate = new Date(procedureDate).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });

            procedureList.push({
                procedureCode: procedureCode,
                procedureDate: formattedProcedureDate,
                procedureName: procedureName,
            });

        });
        // console.log(procedureList)
        return procedureList;
    } catch (error) {
        console.error("Error fetching patient medication:", error);
        return [];
    }
}

export { getPatientDetails, getObservations, getMedications, getConditions, getProcedures };
