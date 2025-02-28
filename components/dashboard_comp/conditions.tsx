import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from '../ui/table'
import { Badge } from '../ui/badge'

interface ConditionProps {
    conditionCode: string,
    condtionDate: string,
    conditionName: string,
    conditionStatus: string,
}


function Conditions({ conditions }: { conditions: ConditionProps[] }) {
  return (
    <div className='flex-grow '>
        <Card className='h-full '>
            <CardHeader>
            <CardTitle>Current Conditions</CardTitle>
            <CardDescription>Active and monitored health conditions</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Condition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {conditions.map((condition) => (
                    <TableRow key={condition.conditionCode}>
                    <TableCell className="font-medium">{condition.conditionName}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className="bg-green-700 text-white">{condition.conditionStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{condition.condtionDate}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    </div>
  )
}

export default Conditions