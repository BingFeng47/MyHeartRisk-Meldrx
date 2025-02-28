const base_url = "http://localhost:8000"

interface FRSData {
    age?: number,
    hdlc?: number, 
    sex?: number,
    tc?: number, 
    bpsys?: number,
    bpsys_treatment?: number, 
    smoker?: number, 
    diabetes?: number 
  }

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

// Function to get pateint details
async function getFrsRisk(frsData:FRSData) {

    // Workspace URL
    const url = `${base_url}/frs`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
            },
            body: frsData ? JSON.stringify(frsData) : JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        return res;
    } catch (error) {
        console.error("Error getting FRS Risk Score:", error);
        return [];
    }
}

// Function to get pateint details
async function getAcsRisk(acsData:ACSData) {

    // Workspace URL
    const url = `${base_url}/acs`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
            },
            body: acsData ? JSON.stringify(acsData) : JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        return res;
    } catch (error) {
        console.error("Error getting ACS Risk Score:", error);
        return [];
    }
}


export { getFrsRisk, getAcsRisk };