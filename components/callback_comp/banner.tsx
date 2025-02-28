import React from 'react'
import { Button } from '../ui/button'
import { Book, ClipboardCopyIcon, DownloadIcon } from 'lucide-react'
import Image from 'next/image'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { calculateAge } from '@/services/utils'
import { Badge } from '../ui/badge'



function Banner({ patientDetailData, risk }: { patientDetailData: any, risk:string }) {
    // Determine color based on risk category
    const getRiskColor = (category: string) => {
        switch (category.toLowerCase()) {
          case "low risk":
            return "stroke-green-500 text-green-500 bg-green-500"
          case "medium risk":
            return "stroke-yellow-400 text-yellow-500 bg-yellow-500"
          case "high risk":
            return "stroke-red-500 text-red-500 bg-red-500"
          default:
            return "stroke-primary text-primary bg-primary"
        }
      }
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-white rounded-lg">
                    <div className="flex h-14 items-center py-10">
                        {/* Title */}
                        <div className="flex items-center justify-center ">
                            <Image src="/assets/logo/heart_logo.png" alt="MyHeartRisk"  width={35} height={35} className="ml-4" />
                            <h1 className="text-2xl font-semibold ml-4">
                                MyHeartRisk
                            </h1>
                        </div>

                        {/* Documentation */}
                        <div className="flex flex-1 items-center space-x-2 justify-end">
                            <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => window.location.href = "/documentation"}>
                              <Book className='text-blue-700'/>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Card>
                            <CardHeader className="flex flex-row items-center space-y-0">
                              {/* Display skeleton if loading */}
                              {!patientDetailData ? 
                                  <div className="flex items-center space-x-4">
                                      <Skeleton className="w-[80px] h-[80px] rounded-full bg-secondary" />
                                      <div>
                                          <Skeleton className="w-[150px] h-[20px] bg-secondary" />
                                          <Skeleton className="w-[100px] h-[20px] mt-1 bg-secondary" />
                                      </div>
                                  </div>
                              :
                                  <div className="flex items-center space-x-4 justify-between w-full">
                                      {/* Patient details */}
                                      <div className="flex items-center space-x-4">
                                          <Image src="/assets/profile_pic/patient_avatar.png" alt="Patient photo" className="rounded-full bg-accent p-1 shadow-2xl" width={80} height={80} />                                     
                                          <div>
                                              <CardTitle className="text-xl">
                                                  {patientDetailData?.name?.[0]?.given?.[0] ?? "Loading"} {patientDetailData?.name?.[0]?.family ?? "Patient"}
                                              </CardTitle>
                                              <CardDescription className="capitalize  text-sm">
                                                    <p>{calculateAge(patientDetailData?.birthDate) ?? "Loading"} years • {patientDetailData?.gender ?? "Loading"}</p>
                                              </CardDescription>
                                          </div>
                                      </div>
                                  
                                      {/* action button in the banner*/}
                                      <div className="flex space-x-4 ml-auto">
                                            <Badge variant="default" className={`bg-${getRiskColor(risk)} text-white text-xl`}>{risk}</Badge>
                                      </div>
                                  </div>
                              }
                            </CardHeader>
                        </Card>
                    </div>
                </div>
  )
}

export default Banner