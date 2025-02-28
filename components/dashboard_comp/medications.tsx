import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Pill } from 'lucide-react'

interface MedicationProps 
    {
        medicationCode: string,
        medicationName: string,
        medicationStartDate: string,
        medicationEndDate: string,
        medicationDosage: string,
    }


function Medications({ medications }: { medications: MedicationProps[] }) {
  return (
    <div>
          {/* Medication */}
          <Card className='px-2'>
          <CardHeader>
            <div className="flex items-center justify-between space-x-4">
              <div>
                <CardTitle>Medications</CardTitle>
                <CardDescription>Prescribed medications</CardDescription>
              </div>
              <Pill className="h-4 w-4 text-muted-foreground" /> {/* Medication icon */}
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 px-2">
            {medications.map((medication:any) => (
                
              <div key={medication.medicationCode} className="flex items-center justify-between px-6 py-4 border rounded-lg">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">{medication.medicationName}</p>
                  <p className="text-xs text-gray-500">
                    {medication.medicationDosage}
                  </p>
                  <div className="flex space-x-4">
                    <p className="text-xs text-gray-500">
                      Start: {medication.medicationStartDate}
                    </p>
                    <p className="text-xs text-gray-500">
                      End: {medication.medicationEndDate}
                    </p>
                  </div>
                </div>

                    
              </div>
            ))}
          </CardContent>
        </Card>
    </div>
  )
}

export default Medications