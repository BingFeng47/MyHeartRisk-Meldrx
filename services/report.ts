import { XMLBuilder } from 'fast-xml-parser';
import { uploadXmlToS3 } from './bucket';

const fhirServerUrl = "https://app.meldrx.com/api/fhir/0f18e56b-25b4-4da3-a8fe-ea43ad612f92";

interface FrsRiskProps {
    risk_category: string;
    probability: string;
}

interface AcsRiskProps {
    model_prediction: {
        result: string;
        category: string;
        probability: number;
    };
    contribution_to_death: {
        feature: string;
        contribution: number;
        impact: string;
        advice: string[];
    }[];
}

function generateXmlReport(patientId: string,patientName:any, patientDob:string, patientGender:string, acsRisk: AcsRiskProps, frsRisk: FrsRiskProps): string {
    const builder = new XMLBuilder({ ignoreAttributes: false, format: true });
    console.log(patientName)
    const xmlData = {
        ClinicalDocument: {
            "@_xmlns": "urn:hl7-org:v3",
            "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            realmCode: { "@_code": "US" },
            typeId: { "@_root": "2.16.840.1.113883.1.3", "@_extension": "POCD_HD000040" },
            templateId: { "@_root": "2.16.840.1.113883.10.20.22.1.1", "@_extension": "2015-08-01" },
            id: { "@_root": patientId, "@_assigningAuthorityName": "MyHealthSystem" },
            code: { "@_codeSystem": "2.16.840.1.113883.6.1", "@_code": "34133-9", "@_displayName": "Cardiovascular Risk Assessment Report" },
            title: "Cardiovascular Risk Assessment",
            effectiveTime: { "@_value": new Date().toISOString().split("T")[0].replace(/-/g, "") },
            recordTarget: {
                patientRole: {
                    patient: {
                        name: [
                            {
                                given: patientName[0].given? patientName[0].given : '',
                                family: patientName[0].family
                            },
                        ],
                        administrativeGenderCode: {
                            "@_codeSystem": "2.16.840.1.113883.5.1",
                            "@_code": "M",
                            "@_displayName": patientGender
                        },
                        birthTime: { "@_value": patientDob.replace(/-/g, "") },
                        
                        languageCommunication: {
                            languageCode: { "@_code": "en-US" }
                        }
                    }
                }
            },

            component: {
                structuredBody: {
                    component: [
                        {
                            section: {
                                title: "Disclaimer",
                                text: {
                                    paragraph: "The AI-predicted risk is for reference purposes only. Please consult with a healthcare professional for a comprehensive assessment and personalized advice."
                                }
                            }
                        },
                        {
                            section: {
                                title: "ACS Risk Assessment",
                                text: {
                                    table: {
                                        "@_border": "1",
                                        "@_width": "100%",
                                        tr: [
                                            {
                                                th: ["Category", "Probability"]
                                            },
                                            {
                                                td: [acsRisk.model_prediction.category, acsRisk.model_prediction.probability.toString()]
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            section: {
                                title: "FRS Risk Assessment",
                                text: {
                                    table: {
                                        "@_border": "1",
                                        "@_width": "100%",
                                        tr: [
                                            {
                                                th: ["Category", "Probability"]
                                            },
                                            {
                                                td: [frsRisk.risk_category, frsRisk.probability]
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            section: {
                                title: "Risk Factors",
                                text: {
                                    table: {
                                        "@_border": "1",
                                        "@_width": "100%",
                                        tr: [
                                            {
                                                th: ["Feature", "Contribution to Risk", "Impact", "Advice"]
                                            },
                                            ...acsRisk.contribution_to_death.map(item => ({
                                                td: [
                                                    item.feature,
                                                    item.contribution.toString(),
                                                    item.contribution >= 0 ? "Negative" : "Keep up",
                                                    item.advice.join(", ")
                                                ]
                                            }))
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    };

    return builder.build(xmlData);
}

async function sendReport(patientId:string, accessToken:string, patientName:string, patientDob:string, patientGender:string, acsRisk:AcsRiskProps, frsRisk:FrsRiskProps) {
    // Upload XML to a storage service and get the URL
    const xmlContent = generateXmlReport(patientId, patientName, patientGender, patientDob, acsRisk, frsRisk);
    const xmlUrl = await uploadXmlToS3(xmlContent); // Implement this function

    const report = {
        resourceType: "DocumentReference",
        status: "current",
        type: {
            coding: [
                {
                    system: "http://loinc.org",
                    code: "18842-5",
                    display: "MyHeartRisk: ACS Risk Assessment Report"
                }
            ]
        },
        subject: {
            reference: `Patient/${patientId}`
        },
        date: new Date().toISOString(),
        author: [
            {
                reference: "Practitioner/56789",
                display: "MyHeartRisk AI Calculator"
            }
        ],
        custodian: {
            reference: "Organization/67890",
            display: "MyHeartRisk"
        },
        content: [
            {
                attachment: {
                    contentType: "application/xml",
                    title: "ACS & FRS Risk Assessment",
                    url: xmlUrl  // Use the URL instead of base64 data
                }
            }
        ]
    };

    try {
        const response = await fetch(`${fhirServerUrl}/DocumentReference`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(report)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }

        const result = await response.json();
        console.log("Report successfully sent:", result);
        console.log(xmlContent)
        return result;
    } catch (error) {
        console.error("Failed to send report:", error);
        return null;
    }
}

export { sendReport };