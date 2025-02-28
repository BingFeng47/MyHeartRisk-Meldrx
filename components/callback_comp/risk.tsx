import React from 'react'
import { ACS } from '../risk_comp/acs'

interface frsRiskProps {
  risk_category: string,
  probability: string
}

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


function Risk({ frsRisk, acsRisk, acsData }: { frsRisk: frsRiskProps, acsRisk: AcsRiskProps, acsData: ACSData }) {
  return (
    <div className='grid'>
        <ACS frsRisk={frsRisk} acsRisk={acsRisk} acsData={acsData}/>
    </div>
  )
}

export default Risk