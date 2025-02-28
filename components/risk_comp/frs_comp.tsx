import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "./circular-progress"

interface FraminghamScoreProps {
  probability: string
  risk_category: string
}

export default function FrsComp({frsRisk}: {frsRisk:FraminghamScoreProps}) {
  // Convert percentage string to number for progress
  const probabilityValue = Number.parseFloat(frsRisk.probability)

  // Determine color based on risk category
  const getRiskColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "low risk":
        return "stroke-green-500 text-green-500"
      case "intermediate risk":
        return "stroke-yellow-400 text-yellow-500"
      case "high risk":
        return "stroke-red-500 text-red-500"
      default:
        return "stroke-primary text-primary"
    }
  }

  const getRecommendation = (category: string) => {
    switch (category.toLowerCase()) {
      case "low risk":
        return "maintain your current healthy lifestyle."
      case "intermediate risk":
        return "discuss risk reduction strategies with your healthcare provider."
      case "high risk":
        return "take immediate action and consult your healthcare provider."
      default:
        return "consult with your healthcare provider."
    }
  }

  return (
    <div className="">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Framingham Risk Score</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative flex flex-row items-center justify-between w-full">
              <div className="relative">
                <CircularProgress value={probabilityValue} className={getRiskColor(frsRisk.risk_category)} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-bold tracking-tighter">{frsRisk.probability||"0%"}</div>
                  <div className={`text-sm font-semibold ${getRiskColor(frsRisk.risk_category)}`}>{frsRisk.risk_category}</div>
                </div>
              </div>
              <div className="ml-4 text-sm">
                <p>
                  The Framingham Risk Score estimates your 10-year risk of developing cardiovascular disease. A score
                  of {frsRisk.probability} indicates {frsRisk.risk_category.toLowerCase()}, suggesting you should{" "}
                  {getRecommendation(frsRisk.risk_category)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

