import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Pill, LineChart } from "lucide-react";

function DashboardSkeleton() {
    return (
        <div className="grid gap-6 pb-8 md:grid-cols-12">          
            <div className="grid gap-6 md:col-span-8">
                
                {/* Current Conditions Skeleton */}
                <Card>
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
                                {[...Array(3)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-32 bg-secondary" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20 bg-secondary" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24 bg-secondary" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Observations Skeleton */}
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-6 w-32 bg-secondary" /></CardTitle>
                        <CardDescription><Skeleton className="h-4 w-48 bg-secondary" /></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-lg bg-secondary" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-6 md:col-span-4">

                {/* Medications Skeleton */}
                <Card className="px-2">
                    <CardHeader>
                        <div className="flex items-center justify-between space-x-4">
                            <div>
                                <CardTitle>Medications</CardTitle>
                                <CardDescription>Prescribed medications</CardDescription>
                            </div>
                            <Pill className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>

                    <CardContent className="grid gap-4 px-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="grid gap-1">
                                    <Skeleton className="h-5 w-32 bg-secondary" />
                                    <Skeleton className="h-4 w-24 bg-secondary" />
                                </div>
                                <Skeleton className="h-6 w-16 rounded-lg bg-secondary" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Activity Skeleton */}
                <Card>
                    <CardHeader>
                        <CardTitle>Procedures</CardTitle>
                        <CardDescription>History of operations done</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 px-2">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="grid gap-1">
                                    <Skeleton className="h-5 w-32 bg-secondary" />
                                    <Skeleton className="h-4 w-24 bg-secondary" />
                                </div>
                                <Skeleton className="h-6 w-16 rounded-lg bg-secondary" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

export default DashboardSkeleton;