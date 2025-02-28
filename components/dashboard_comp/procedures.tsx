import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { BriefcaseMedical } from 'lucide-react'

interface ProcedureProps {
    procedureCode: string,
    procedureDate: string,
    procedureName: string,
}

function Procedures({ procedures }: { procedures: ProcedureProps[] }) {
  return (
    <div>
        <Card className='px-2 '>
            <CardHeader>
            <div className="flex items-center justify-between space-x-4">
                <div>
                <CardTitle>Procedures</CardTitle>
                <CardDescription>History of operations done</CardDescription>
                </div>
                <BriefcaseMedical className="h-4 w-4 text-muted-foreground" /> 
            </div>
            </CardHeader>
            <CardContent className="grid gap-4 px-2">
            {procedures.map((procedure, index) => (
                <div key={procedure.procedureCode} className="flex items-center justify-between px-6 py-4 border rounded-lg">
                <div className="grid gap-1">
                    <p className="text-sm font-medium">{procedure.procedureName}</p>
                    <p className="text-xs text-gray-500">
                    Completed on {procedure.procedureDate}
                    </p>
                </div>
                </div>
            ))}
            </CardContent>
        </Card>
    </div>
  )
}

export default Procedures