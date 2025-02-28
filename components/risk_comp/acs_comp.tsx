import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "./circular-progress"

interface AcsRiskProps {
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

export default function AcsComp({acsRisk}: {acsRisk:AcsRiskProps}) {
  // Convert percentage string to number for progress
  const probabilityValue = Number.parseFloat(acsRisk.model_prediction.probability.toString()) * 100

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
            <CardTitle>MyHeart ACS AI Risk</CardTitle>
            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="inline-flex h-6 w-6 items-center justify-center rounded-full  bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
                    <InfoIcon className="h-4 w-4" />
                    <span className="sr-only">About Framingham Risk Score</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] text-sm bg-secondary p-4" side="right">
                  <p>
                    The Framingham Risk Score estimates your 10-year risk of developing cardiovascular disease. A score
                    of {probability} indicates {riskCategory.toLowerCase()}, suggesting you should{" "}
                    {getRecommendation(riskCategory)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative flex flex-row items-center justify-between w-full">
              <div className="relative">
                <CircularProgress value={probabilityValue} className={getRiskColor(acsRisk.model_prediction.category)} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-bold tracking-tighter">{probabilityValue}%</div>
                  <div className={`text-sm font-semibold ${getRiskColor(acsRisk.model_prediction.category)}`}>{acsRisk.model_prediction.category}</div>
                </div>
              </div>
              <div className="ml-4 text-sm">
                <p className="text-md">
                Our ACS Risk Prediction model, developed as part of our study in Malaysia, estimates your risk of experiencing Acute Coronary Syndrome.  
                A score of {probabilityValue} indicates {acsRisk.model_prediction.category.toLowerCase()}, suggesting you should{" "}  
                {getRecommendation(acsRisk.model_prediction.category)}.  
                For more details, refer to our published paper and documentation.  
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

