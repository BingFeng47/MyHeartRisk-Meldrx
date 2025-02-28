import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Clock, InfoIcon, LucideIcon, Search } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface Observation {
    name: string
    code: string
    time: string
    value: string
    unit?: string
    icon?: LucideIcon
  }

  
const Observations: React.FC<{ observations: Observation[] }> = ({ observations }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between space-x-4">
                    <div>
                        <CardTitle>Recent Observations</CardTitle>
                        <CardDescription>Latest vital signs and measurements</CardDescription>
                    </div>
                    <Search className="h-4 w-4 text-muted-foreground" /> {/* Medication icon */}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 ">
                    {observations.map((observation) => (
                        <div
                            key={observation.name}
                            className="flex items-center justify-between space-x-4 rounded-lg border p-4"
                        >
                            <div className="flex items-center space-x-4">
                                {/* <div
                                    className={`rounded-lg p-2 ${
                                        observation.status === "normal"
                                            ? "bg-green-100 text-green-700"
                                            : observation.status === "warning"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    <observation.icon className="h-6 w-6" />
                                </div> */}
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">{observation.name}</p>
                                    <p className="text-xs font-medium">({observation.code})</p>
                                    <p className="text-xl font-bold tracking-tighter">{observation.value} {observation.unit}</p>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {observation.time}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default Observations