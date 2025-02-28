import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from '../ui/button'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'

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

export default function FactorsComp({acsRisk}:{acsRisk:AcsProps}) {
    const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({})

    const toggleFeature = (feature: string) => {
        setExpandedFeatures((prev) => ({
        ...prev,
        [feature]: !prev[feature],
        }))
    }

    const getImpactColor = (impact: string, contribution: number) => {
        if (impact === "positive") return "text-red-600"
        return "text-green-600"
    }

    const getContributionBarColor = (impact: string) => {
        if (impact === "positive") return "bg-red-500"
        return "bg-green-500"
    }

    const getContributionBarWidth = (contribution: number) => {
        // Scale the contribution to a reasonable width percentage
        const absContribution = Math.abs(contribution)
        return `${Math.min(absContribution * 300, 100)}%`
    }
    return (
        <Card>
            <CardHeader>
              <CardTitle>Contributing Factors</CardTitle>
              <CardDescription>Factors that influence the risk prediction</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {acsRisk.contribution_to_death.map((item) => (
                  <div key={item.feature} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 items-center mb-2 rounded-full mr-2 ${
                            item.impact === "positive" ? "bg-red-500" : "bg-green-500"
                          }`}
                        />
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-xl pb-2">{ item.feature}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-xl pb-0 mb-0 ${getImpactColor(item.impact, item.contribution)}`}>
                          {item.impact === "positive" ? "+" : "-"}
                          {(Math.abs(item.contribution) * 100).toFixed(1)}%
                        </span>
                        <p className="text-sm pb-2 text-gray-500">
                          {item.impact === "positive" ? "Increases risk" : "Decreases risk"}
                        </p>
                      </div>
                    </div>

                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getContributionBarColor(item.impact)}`}
                        style={{ width: getContributionBarWidth(item.contribution) }}
                      />
                    </div>

                    {item.advice && item.advice.length > 0 && (
                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto flex items-center text-sm text-gray-600 hover:text-gray-900"
                          onClick={() => toggleFeature(item.feature)}
                        >
                          {expandedFeatures[item.feature] ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Hide recommendations
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Show recommendations
                            </>
                          )}
                        </Button>

                        {expandedFeatures[item.feature] && (
                          <ul className="mt-2 space-y-1 pl-5 list-disc text-sm text-gray-700">
                            {item.advice.map((advice, index) => (
                              <li key={index}>{advice}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
  )
}
