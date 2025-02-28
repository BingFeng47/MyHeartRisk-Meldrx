"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'
import { CircularProgress } from './circular-progress'
import { getAcsRisk } from '@/services/risk'

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

interface ACSData {
  ptageatnotification?: number,
  heartrate?: number,
  canginapast2wk?: number,
  killipclass?: number,
  hdlc?: number,
  ldlc?: number,
  fbg?: number,
  cabg?: number,
  oralhypogly?: number,
  antiarr?: number,
  ecgabnormlocationll?: number,
  cardiaccath?: number,
  statin?: number,
  lipidla?: number
}

function AdjustComp({ acsRisk, acsData }: { acsRisk: AcsProps, acsData: ACSData }) {
    // Initial sample data
    const [acsDataState, setAcsData] = useState<ACSData>(acsData);
    const [acsRiskState, setAcsRiskState] = useState<AcsProps>(acsRisk);

    useEffect(() => {
        setAcsRiskState(acsRisk);
        setAcsData(acsData);
    }, [acsRisk]);

  // Handle binary feature changes
  const handleBinaryChange = (key: keyof ACSData) => {
    console.log(`Toggling ${key} from ${acsDataState[key]} to ${!acsDataState[key]}`);
    setAcsData((prev) => ({
      ...prev,
      [key]: prev[key] ? 0 : 1, // Assuming 0 and 1 are used for binary features
    }));
  };

  // Handle continuous feature changes
  const handleContinuousChange = (key: keyof ACSData, value: number) => {
    const range = ranges[key];
    const clampedValue = Math.max(range.min, Math.min(range.max, value));
    console.log(`Updating ${key} to ${clampedValue}`);
    setAcsData((prev) => ({
      ...prev,
      [key]: clampedValue,
    }));
  };

  // Format labels for better readability
  const formatLabel = (key: string): string => {
    const labels: Record<string, string> = {
      hdlc: "HDL Cholesterol",
      ldlc: "LDL Cholesterol",
      cabg: "Coronary Artery Bypass Graft",
      cardiaccath: "Cardiac Catheterization",
      heartrate: "Heart Rate",
      fbg: "Fasting Blood Glucose",
    };
    return labels[key] || key.toUpperCase();
  };

  // Define ranges for continuous features
  const ranges: Record<string, { min: number; max: number; step: number; unit: string }> = {
    heartrate: { min: 0, max: 220, step: 1, unit: "bpm" },
    age: { min: 0, max: 150, step: 1, unit: "years" },
    hdlc: { min: 0, max: 10, step: 0.01, unit: "mmol/L" },
    ldlc: { min: 0, max: 10, step: 0.01, unit: "mmol/L" },
    fbg: { min: 0, max: 15, step: 0.01, unit: "mmol/L" }
  };

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

    // Binary features list
    const binaryFeatures = ["cabg", "cardiaccath"];

    // Continuous features list
    const continuousFeatures = ["heartrate", "hdlc", "ldlc", "fbg"];

    // Debugging: Log state changes
    useEffect(() => {
        console.log("acsDataState updated:", acsDataState);
        const updateRisk = async () => {
            const updatedRisk = await getAcsRisk(acsDataState);
            setAcsRiskState(updatedRisk);
        };
        updateRisk();
    }, [acsDataState]);

  if (!acsRiskState || !acsRiskState.model_prediction) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full">
        {/* <pre>{JSON.stringify(acsDataState, null, 2)}</pre> */}

        <CardHeader>
            <CardTitle>Adjusted Risk</CardTitle>
            <div className="flex justify-between items-center text-lg font-bold pt-4">
              <p className=''>{acsRiskState.model_prediction.category}</p>
              <p>{(acsRiskState.model_prediction.probability * 100).toFixed(2)}%</p>
            </div>
            <div className="relative w-full h-4 bg-muted rounded">
              <div
                className={`absolute rounded-2xl h-full ${getRiskColor(acsRiskState.model_prediction.category)}`}
                style={{ width: `${acsRiskState.model_prediction.probability * 100}%` }}
              />
            </div>
            
        </CardHeader>

      <CardHeader>
        <CardTitle>Modify Your Inputs</CardTitle>
        <CardDescription>Get to know how features affect your predicted risk</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {binaryFeatures.map((key) => (
              <Card key={key} className="flex items-center justify-between p-4">
                <Label htmlFor={key} className="flex-1">
                  {formatLabel(key)}
                </Label>
                <Switch
                  id={key}
                  checked={Boolean(acsDataState[key as keyof ACSData])}
                  onCheckedChange={() => handleBinaryChange(key as keyof ACSData)}
                />
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {continuousFeatures.map((key) => {
              const range = ranges[key];
              const value = acsDataState[key as keyof ACSData] as number;

              return (
                <Card key={key} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={key}>{formatLabel(key)}</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id={`${key}-input`}
                        type="number"
                        value={value}
                        onChange={(e) => handleContinuousChange(key as keyof ACSData, Number.parseFloat(e.target.value))}
                        className="w-20"
                        min={range.min}
                        max={range.max}
                        step={range.step}
                      />
                      <span className="text-sm text-muted-foreground w-16">{range.unit}</span>
                    </div>
                  </div>
                  <Slider
                    id={key}
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    value={[value]}
                    onValueChange={(values) => handleContinuousChange(key as keyof ACSData, values[0])}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {range.min} {range.unit}
                    </span>
                    <span>
                      {range.max} {range.unit}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdjustComp;