"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getConditions, getMedications, getObservations, getPatientDetails, getProcedures } from "@/services/fhir";
import { Bot, Cat, DownloadIcon, Send, User, User2 } from "lucide-react";
import { OidcClient } from "oidc-client-ts";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/callback_comp/dashboard";
import Banner from "@/components/callback_comp/banner";
import { getAcsRisk, getFrsRisk } from "@/services/risk";
import Risk from "@/components/callback_comp/risk";
import DashboardSkeleton from "@/components/skeleton/dashboard-skeleton";
import { calculateAge } from "@/services/utils";
import { sendReport } from "@/services/report";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const STORAGE_KEY = "oidc_auth_data";

interface OIDCResponse {
    access_token: string;
    patient?: string;
}

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


interface frsRiskProps {
  risk_category: string,
  probability: string
}

interface AcsRiskProps {
  model_prediction: {
    result: string,
    category: string,
    probability: number
  },
  contribution_to_death: {
    feature: string,
    contribution: number,
    impact: string,
    advice: string[]
  }[],
}


export default function Callback() {
  // Chatbot State
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");

  const  sendMessage = async() => {
    if (!input.trim()) return;

    const workspaceId = localStorage.getItem("workspace_id");

    
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    
    await fetch("https://4b48-175-41-160-219.ngrok-free.app/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        session_id: "your-session-id", // Replace with actual session ID if available
        username: patientDetailData.name[0].given[0],
        acsRisk: acsRisk? acsRisk : null, 
        frsRisk: frsRisk? frsRisk : null,
        accessToken: accessToken,
        patientId: pateintId,
        workspaceID: workspaceId? workspaceId : '0f18e56b-25b4-4da3-a8fe-ea43ad612f92'
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.completion) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.completion, sender: "bot" },
          ]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
};

    // Session data
    const [pateintId, setPatientId] = useState<any>(null);
    const [accessToken, setAccessToken] = useState<any>(null);
    const [patientName, setPatientName] = useState<any>(null);
    const [patientGender, setPatientGender] = useState<any>(null);
    const [patientDob, setPatientDob] = useState<any>(null);


    // Patient Data State
    const [patientDetailData, setPatientDetailData] = useState<any>(null);
    const [patientObservationData, setPatientObservationData] = useState<any>(null);
    const [patientMedicationData, setPatientMedicationData] = useState<any>(null);
    const [patientConditionData, setPatientConditionData] = useState<any>(null);
    const [patientProcedureData, setPatientProcedureData] = useState<any>(null);;
    const [workspace_id, setWorkSpaceId] = useState<any>(null);

    // Risk State
    const [frsRisk, setFrsRisk] = useState<frsRiskProps>({risk_category: "", probability: ""});
    const [acsRisk, setAcsRisk] = useState<AcsRiskProps>({model_prediction: {result: "", category: "", probability: 0}, contribution_to_death: []});
    const [acsData, setAcsData] = useState<ACSData>({});
  
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchPatientData = async (oidcResult: OIDCResponse) => {
      try {
          if (oidcResult.patient) {
            setPatientId(oidcResult.patient);
            setAccessToken(oidcResult.access_token);

            const workspaceId = localStorage.getItem("workspace_id");
            setWorkSpaceId(workspaceId);

            // Call FHIR Endpoints
            const patientDetail = await getPatientDetails(oidcResult.patient, oidcResult.access_token, String(workspaceId));
            const patientObservation = await getObservations(oidcResult.patient, oidcResult.access_token, String(workspaceId));
            const patientMedication = await getMedications(oidcResult.patient, oidcResult.access_token, String(workspaceId));
            const patientCondition = await getConditions(oidcResult.patient, oidcResult.access_token, String(workspaceId));
            const patientProcedure = await getProcedures(oidcResult.patient, oidcResult.access_token, String(workspaceId));

            // Set State
            setPatientDetailData(patientDetail);
            setPatientObservationData(patientObservation);
            setPatientMedicationData(patientMedication);
            setPatientConditionData(patientCondition);
            setPatientProcedureData(patientProcedure);
            setPatientName(`${patientDetailData?.name?.[0]?.given?.[0] ?? "Loading"} ${patientDetailData?.name?.[0]?.family ?? "Patient"}`);
            setPatientGender(patientDetail.gender);
            setPatientDob(patientDetail.birthDate);

            // Assign Variables for FRS risk scores
            const hdlcObservation = patientObservation.find((obs: any) => obs.code === "2085-9");
            const tcObservation = patientObservation.find((obs: any) => obs.code === "2093-3");
            const bpsysObservation = patientObservation.find((obs: any) => obs.code === "8480-6");
            const smokerObservation = patientObservation.find((obs: any) => obs.code === "72166-2");
            const diabetesCondition = patientCondition.find((cond: any) => cond.conditionCode === "44054006");
            const bpsys_treatmentMedication = patientMedication.find((med: any) => med.conditionCode === "309090")

            const frsData: FRSData = {
              age: patientDetail?.birthDate? calculateAge(patientDetail?.birthDate): 40,
              sex: patientDetail.gender === "male" ? 0 : 1,
              hdlc: hdlcObservation?.value? hdlcObservation?.value : 1.2,
              tc: tcObservation?.value? tcObservation?.value : 3,
              bpsys: bpsysObservation?.value>160? 120 : 120,
              bpsys_treatment: bpsys_treatmentMedication? 1 : 0,
              smoker: smokerObservation?.value === "Current every day smoker" ? 1 : 0,
              diabetes: diabetesCondition? 1 : 0
            }

            // Get Risk Score
            // console.log(frsData);
            const frsRisk = await getFrsRisk(frsData);
            setFrsRisk(frsRisk);
            console.log(frsRisk);

            // Assign Variables for ACS risk scores
            const heartRateObservation = patientObservation.find((obs: any) => obs.code === "8867-4");
            const ldlcObservation = patientObservation.find((obs: any) => obs.code === "13457-7");
            const fbgObservation = patientObservation.find((obs: any) => obs.code === "1558-6");
            const oralhypoglyMedication = patientMedication.find((med: any) => med.conditionCode === "386875005")
            const antiarrMedication = patientMedication.find((med: any) => med.conditionCode === "410505008")
            const statinMedication = patientMedication.find((med: any) => med.conditionCode === "408556005")
            const lipidlaMedication = patientMedication.find((med: any) => med.conditionCode === "372734003")
            const cardiaccathProcedure = patientProcedure.find((pro: any) => pro.conditionCode === "302215000")
            const cabgProcedure = patientProcedure.find((pro: any) => pro.conditionCode === "80146002")
            const anginaCondition = patientCondition.find((cond: any) => cond.conditionCode === "194828000");

            const acsData: ACSData = {
              ptageatnotification: patientDetail?.birthDate? calculateAge(patientDetail?.birthDate): 40,
              heartrate: heartRateObservation?.value? heartRateObservation?.value : 70,
              canginapast2wk: anginaCondition? 1 : 0,
              killipclass: 2,
              hdlc: hdlcObservation?.value? hdlcObservation?.value : 1.2,
              ldlc: ldlcObservation?.value? ldlcObservation?.value : 3,
              fbg: fbgObservation?.value? fbgObservation?.value : 5.5,
              cabg: cabgProcedure? 1 : 0,
              oralhypogly: oralhypoglyMedication? 1 : 0,
              antiarr: antiarrMedication? 1 : 0,
              ecgabnormlocationll: 0,
              cardiaccath: cardiaccathProcedure? 1 : 0,
              statin: statinMedication? 1 : 0,
              lipidla: lipidlaMedication? 1 : 0
            } 

            setAcsData(acsData);

            // Get ACS Risk Score
            // console.log(acsData);
            const acsRisk = await getAcsRisk(acsData);
            setAcsRisk(acsRisk);
            console.log(acsRisk);

          }

      } catch (error) {
          console.error("Error fetching patient data:", error);
      }
    };
    
    // Connect and fetch patient data
    useEffect(() => {

      const urlParams = new URLSearchParams(window.location.search);
      const hasNewLogin = urlParams.has("code"); // Detect if OIDC login just happened
  
      if (hasNewLogin) {
          console.log("New login detected, clearing old session...");
          localStorage.removeItem(STORAGE_KEY); // 🔹 Clear old stored data
      }
  
      const storedAuthData = localStorage.getItem(STORAGE_KEY);
  
      if (storedAuthData && !hasNewLogin) {
          // Restore session from localStorage only if there's no new login
          const oidcResult = JSON.parse(storedAuthData);
          fetchPatientData(oidcResult);
      } else {
          // Handle new sign-in
          const oidc = new OidcClient({
            authority: "https://app.meldrx.com",
            client_id: "92ab67b9df5c445cabc89c476bcbfdab",
            redirect_uri: "https://cds-test.vercel.app/callback",
            response_type: "code",
            scope: "openid profile launch patient/*.* user/*.* system/*.* patient/Task.write patient/Bundle.write patient/Composition.write"
        });
  
          oidc.processSigninResponse(window.location.href)
              .then(async (result) => {
                  console.log("OIDC Login Result:", result);
                  const oidcResult = result as OIDCResponse;
  
                  if (oidcResult.patient) {
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(oidcResult)); // 🔹 Store new patient data
                      fetchPatientData(oidcResult);
                  }
  
                  // 🔥 Remove `code` from URL after processing
                  window.history.replaceState({}, document.title, window.location.pathname);
              })
              .catch((error) => {
                  console.error("OIDC processing error:", error);
              });
      }
  }, []);

  useEffect(() => {
    const chatContent = document.getElementById("chat-content");
    if (chatContent) {
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }, [messages]);

    return (
            <div className="flex min-h-screen flex-col mx-4">

                {/* Chat bot */}
                <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
                  {/* Chat Button */}
                    <Bot className="w-14 h-14 bg-primary border-2 border-primary p-2 rounded-2xl shadow-lg hover:cursor-pointer text-blue-700 " onClick={() => setOpen(!open)}/>

                    {/* Chatbox (Hidden unless open) */}
                    {open && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: 10 }}
                          className="w-96  bg-white shadow-xl rounded-2xl mt-2"
                        >
                          <Card>
                            <CardHeader className="p-4 bg-gray-100 rounded-t-2xl flex flex-row justify-between items-center">
                              <h2 className="text-lg font-semibold">Chatbot</h2>
                              <Button variant="ghost" size="sm" onClick={() => setMessages([])}>🗑️</Button>
                            </CardHeader>
                            <CardContent className="h-72 overflow-y-auto p-3 space-y-2" id="chat-content">
                              {messages.map((msg, index) => (
                              <div key={index} className={`flex items-center ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                {msg.sender === "bot" && <Bot className="flex-shrink-0 w-6 h-6 mr-2 text-black" />}
                                <div className={`px-4 py-2 rounded-lg text-sm ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                                {msg.text}
                                </div>
                                {msg.sender === "user" && <Cat className="flex-shrink-0 w-6 h-6 ml-2 text-black " />}
                              </div>
                              ))}
                            </CardContent>
                            <CardFooter className="p-3 border-t flex items-center">
                              <Input 
                                placeholder="Type a message..." 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                className="flex-1"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    sendMessage();
                                  }
                                }}
                              />
                              <Button variant="default" size="icon" onClick={sendMessage} className="ml-2">
                                <Send className="w-4 h-4 text-blue-700" />
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                    )}
                </div>

                {/* Patient header banner */}
                <Banner patientDetailData={patientDetailData} risk={acsRisk.model_prediction.category}/>
                

                {/* Tabs Here */}
                <Tabs defaultValue="risk" className="mt-3">
                    
                    {/* Tabs and download button */}
                    <div className="flex justify-between items-center py-2 ">
                      {/* Tabs */}
                      <TabsList className="flex space-x-2">
                        <TabsTrigger value="risk" className="text-secondary-foreground">Heart Risk</TabsTrigger>
                        <TabsTrigger value="dashboard" className="text-secondary-foreground">Dashboard</TabsTrigger>
                      </TabsList>

                      <div className="ml-auto flex gap-2">
                        

                        {/* Confirmation Dialog */}
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                          <Button variant="default" size="sm" className=" bg-secondary">
                            <Send className="mr-1 h-4 w-4" />
                            Send to Patient
                          </Button>
                          </DialogTrigger>
                          <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Send</DialogTitle>
                            <DialogDescription>
                            Are you sure you want to send this report to the patient?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button 
                            variant="default" 
                            onClick={() => {
                              sendReport(pateintId, accessToken, patientName, patientGender, patientDob, acsRisk, frsRisk, String(workspace_id));
                              setDialogOpen(false);
                            }}
                            >
                            Confirm
                            </Button>
                          </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Download report button */}
                        <Button 
                        variant="default" 
                        size="sm" 
                        className=" bg-secondary"
                        onClick={() => window.print()}
                        >
                          <DownloadIcon className="mr-1 h-4 w-4" />
                          Download Report
                        </Button>
                      </div>
                    </div>
                  
                  {/* Dashboard */}
                  <TabsContent value="dashboard">
                    {patientObservationData?                    
                      <Dashboard observations={patientObservationData} medications={patientMedicationData} conditions={patientConditionData} procedures={patientProcedureData}/>
                    : 
                     <DashboardSkeleton/>}
                  </TabsContent>
                  
                  {/* Risk */}
                  <TabsContent value="risk">
                    <Risk frsRisk={frsRisk} acsRisk={acsRisk} acsData={acsData}/>
                  </TabsContent>
                  
                </Tabs>

            </div>
    )
}