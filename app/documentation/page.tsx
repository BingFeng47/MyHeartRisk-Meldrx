'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Documentation() {

  return (
    <div className=" mx-auto p-6">
      <div className="flex flex-col items-center justify-center">
        <Image src="/assets/logo/heart_logo.png" alt="logo" width={50} height={50} className='mb-2' />
        <h1 className="text-3xl font-bold text-center mb-6">MyHeartRisk</h1>
      </div>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Introduction</h2>
        <p className="mt-2">
        MyHeartRisk is an AI-driven tool for patients to monitor their risk of ACS, developed as part of a study in Malaysia in collaboration with Universiti Teknologi MARA (UiTM) and Universiti Malaya (UM). It leverages data from the National Cardiovascular Disease (NCVD) Malaysia registry to build an ACS risk prediction model. 
        By integrating with MeldRx or functioning as a standalone app, MyHeartRisk delivers real-time ACS risk scores, categorized risk levels, and personalized health insights. The model is based on clinical research and data-driven methodologies, contributing to improved early detection and preventive care for cardiovascular diseases.
        Here are some work builds upon studies in cardiovascular risk assessment by us, including:
        <p>1. Sazzli, S., Sorayya, M., Putri, N., Lai, H., Sun, W., Hiew, J., . . . Song, C. (2023). Prediction of short- and long-term mortality in Asian ACS patients using stacked ensemble learning. International Journal of Cardiology, 393, 131471. https://doi.org/10.1016/j.ijcard.2023.131471</p>
        <p>2. Kasim, S., Malek, S., Ibrahim, K. S., & Kumar, D. S. (2023). Applying an interpretive machine learning algorithm to predict in-hospital mortality in elderly asian patients with acute coronary syndrome (ACS). European Heart Journal, 44(Supplement_1). https://doi.org/10.1093/eurheartj/ehac779.125</p>
        <p>3. Putri, N., Sazzli, S., Sorayya, M., Nurulain, I., Nafiza, M., & Najmin, A. (2023). Comparing the performance of the FRS, machine learning, and stacked ensemble learning in estimating the 10-year CVD risk in the Asian population. International Journal of Cardiology, 393, 131483. https://doi.org/10.1016/j.ijcard.2023.131483</p>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Why MyHeartRisk Matters in Healthcare & EHR</h2>
        <p className="mt-2">
        ACS risk prediction is crucial because Acute Coronary Syndrome (ACS) is a leading cause of heart-related emergencies and deaths, and early detection can significantly reduce mortality and complications. By leveraging AI-powered risk assessment, MyHeartRisk helps identify high-risk patients before symptoms appear, allowing for preventive strategies such as lifestyle modifications, medication adjustments, and closer monitoring. This proactive approach not only improves patient care but also reduces hospital readmissions, healthcare costs, and the burden on emergency services, making it a valuable tool for modern cardiovascular healthcare.
        Integrating MyHeartRisk with Meldrx enhances clinical decision-making by providing real-time ACS risk predictions directly within existing workflows. EHR integration ensures that healthcare providers have seamless access to a patient’s medical history, risk factors, and AI-driven insights without disrupting their workflow. This leads to more informed, data-driven decisions, enabling early intervention and better patient outcomes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Top Features</h2>
        <ul className="list-disc ml-6 mt-2">
          <li><strong>CDS Hooks for Instant ACS Risk Assessment</strong> – Provides real-time ACS risk scores within EHR workflows using CDS Hooks integration.</li>
          <li><strong>EHR Launch for Detailed Insights</strong> – Enables seamless EHR integration to view detailed patient risk analysis.</li>
          <li><strong>Patient Dashboard</strong> – Displays a comprehensive risk profile, including historical data and trends.</li>
          <li><strong>AI-Predicted ACS Risk</strong> – Uses AI-driven models to estimate personalized ACS risk levels based on patient data.</li>
          <li><strong>Framingham Risk Score (FRS) Calculation</strong> – Computes FRS risk scores to assess long-term cardiovascular risk.</li>
          <li><strong>Risk Factor Explanation</strong> – Provides a detailed breakdown of contributing factors.</li>
          <li><strong>Risk Adjustment</strong> – Allows customizable risk factor.</li>
          <li><strong>Return Report and Tasks to EHR</strong> – Full connection to EHR via FHIR standard.</li>
          <li><strong>Chatbot with Agent</strong> – An AI-powered assistant that provides risk explanations and answers provider queries.</li>
          <li><strong>Personalized Health Recommendations</strong> – Suggests lifestyle and treatment adjustments to lower cardiovascular risk.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">How to Try MyHeartRisk</h2>
        <ul className="list-disc ml-6 mt-2">
          <li><strong>Activate the MyHeartRisk App</strong> – Search from the public extensions and enable the MyHeartRisk application within your MeldRx workspace.</li>
          <li><strong>Import Patient XML File</strong> – Upload the provided patient XML file provided to load sample patient data.</li>
          <li><strong>Select and View a Patient</strong> – Choose a patient from the list to see their risk profile and health data.</li>
          <li><strong>EHR App Launcher</strong> – Use the EHR App Launcher located at the top section to access MyHeartRisk.</li>
          <li><strong>Allow Access</strong> – Grant the necessary permissions, and you’re ready to explore ACS risk predictions and insights.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">How to Try MyHeartRisk</h2>
        <p>Developing MyHeartRisk came with several challenges, especially as I navigated new concepts and technologies:</p>
        <ul className="list-disc ml-6 mt-2">
          <li><strong>First Time Working with EHR and MeldRx</strong> – This was my first experience with Electronic Health Records (EHRs) and the MeldRx platform, requiring a steep learning curve to understand how data flows and integrates within clinical environments.</li>
          <li><strong>Issues with Loading Provided Patient Data</strong> – The provided patient XML file did not load correctly, forcing me to manually code a patient XML file with the help of LLMs. The app might not work properly with other patient as the XML structure might be different. Please use the patient xml provided.</li>
          <li><strong>First Time Dealing with FHIR Standard</strong> – Fast Healthcare Interoperability Resources (FHIR) is a complex framework with strict data formatting rules. Understanding FHIR resources, profiles, and how to query data required significant effort.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">What I’ve Learned</h2>
        <p className="mt-2">
        Working on MyHeartRisk has been an incredible learning experience, giving me the opportunity to explore EHR integration, FHIR standards, and AI-driven risk prediction in a real-world healthcare setting. This project introduced me to the MeldRx platform, the complexities of clinical data handling, and the challenges of ensuring AI models align with medical decision-making. I’m especially grateful for the opportunity to contribute to a meaningful study that aims to improve cardiovascular risk assessment. This experience has strengthened my understanding of healthcare AI and inspired me to continue exploring innovations in this field. 🚀
        </p>
      </section>
    </div>
  );
}
