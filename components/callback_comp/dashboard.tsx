import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { LineChart, LucideIcon, Pill  } from 'lucide-react'
import { Separator } from '../ui/separator'
import Observations from '../dashboard_comp/observations'
import Medications from '../dashboard_comp/medications'
import Conditions from '../dashboard_comp/conditions'
import Procedures from '../dashboard_comp/procedures'


  
  interface Condition {
    name: string
    status: string
    date: string
  }
  
  interface Risk {
    name: string
    level: number
    status: "low" | "moderate" | "high"
  }

  
  const conditions: Condition[] = [
    {
      name: "Type 2 Diabetes",
      status: "Active",
      date: "Diagnosed Jan 2022",
    },
    {
      name: "Hypertension",
      status: "Monitoring",
      date: "Diagnosed Mar 2021",
    },
    {
      name: "Asthma",
      status: "Controlled",
      date: "Diagnosed Sep 2020",
    },
  ]
  
  const risks: Risk[] = [
    {
      name: "Cardiovascular Risk",
      level: 35,
      status: "moderate",
    },
    {
      name: "Diabetes Complication",
      level: 65,
      status: "high",
    },
    {
      name: "Fall Risk",
      level: 20,
      status: "low",
    },
  ]

  const medications = [
    { name: "Aspirin", dosage: "75mg", frequency: "Once Daily", status: "active", adherence: 80 },
    { name: "Metformin", dosage: "500mg", frequency: "Twice Daily", status: "active", adherence: 90 },
    { name: "Atorvastatin", dosage: "20mg", frequency: "Once Daily", status: "completed", adherence: 100 },
  ];

  interface Observation {
    name: string
    code: string
    time: string
    value: string
    unit?: string
    icon?: LucideIcon
  }

  interface MedicationProps {
    medicationCode: string,
    medicationName: string,
    medicationStartDate: string,
    medicationEndDate: string,
    medicationDosage: string,
  }

  interface ConditionProps {
    conditionCode: string,
    condtionDate: string,
    conditionName: string,
    conditionStatus: string,
  }

  interface ProcedureProps {
      procedureCode: string,
      procedureDate: string,
      procedureName: string,
  }

interface DashboardProps {
  observations: Observation[];
  medications: MedicationProps[];
  conditions: ConditionProps[];
  procedures: ProcedureProps[];
}


  
const loading:boolean = true;
function Dashboard({ observations, medications, conditions, procedures }: DashboardProps) {
  return (
    <div className="grid gap-6 pb-8 md:grid-cols-12">  

        {/* Left Column */}
        <div className="grid gap-6 md:col-span-9">

          {/* Conditions */}
          <Conditions conditions={conditions} />

          {/* Observations */}
          <Observations observations={observations} />

        </div>
        
        {/* Right Column */}

        <div className="grid gap-6 md:col-span-3">

        {/* Medications */}
        <Medications medications={medications} />

        {/* Procedures */}
        <Procedures procedures={procedures}/>
        </div>
    </div>
  
)}


export default Dashboard