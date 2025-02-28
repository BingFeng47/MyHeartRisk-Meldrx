"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ChevronDown, ChevronUp, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import FrsComp from "./frs_comp"
import AcsComp from "./acs_comp"
import AdjustComp from "./adjust_comp"
import FactorsComp from "./factors_comp"

interface FrsProps {
    risk_category: string,
    probability: string
}

interface AcsProps {
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



export function ACS({ frsRisk, acsRisk, acsData }: { frsRisk: FrsProps, acsRisk: AcsProps, acsData: ACSData }) {
  

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Patient Risk Assessment</h1>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        
        <AcsComp acsRisk={acsRisk} />
        <FrsComp frsRisk={frsRisk} />

      </div>

      <Tabs defaultValue="adjust" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="adjust">Adjust Health Factors</TabsTrigger>
          <TabsTrigger value="factors">Risk Factors</TabsTrigger>
        </TabsList>

        {/* adjust health factors */}
        <TabsContent value="adjust">
            <AdjustComp acsData={acsData} acsRisk={acsRisk}/>
        </TabsContent>

        {/*  Risk Factors */}
        <TabsContent value="factors" id="risk-factors">
            <FactorsComp acsRisk={acsRisk}/>
        </TabsContent>

        
      </Tabs>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Important Note</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            This risk assessment is based on statistical analysis and should be interpreted by healthcare professionals.
            Always consult with your doctor before making any changes to your treatment plan.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

