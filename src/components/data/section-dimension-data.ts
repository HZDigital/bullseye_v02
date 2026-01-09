export interface DimensionData {
  title: string
  description: string[]
}

export interface SectionData {
  title: string
  description: string
  dimensions: DimensionData[]
}

export const sectionDimensionData: SectionData[] = [
  {
    title: "Demand",
    description: "Strategies for managing and optimizing demand across the organization",
    dimensions: [
      {
        title: "Demand Management",
        description: [
          "Demand Management refers to the strategic actions taken to control and influence the demand for goods and services. It involves aligning consumption behavior with business objectives by eliminating unnecessary demand, consolidating needs, optimizing order frequency, and improving internal coordination. The goal is to reduce procurement volumes without compromising functionality or performance."],
      },
      {
        title: "Forecasting and Planning",
        description: [
          "Forecasting and Planning encompass the processes and tools used to accurately predict future demand and align procurement activities accordingly. This includes demand forecasting, sales and operations planning (S&OP), and capacity planning. Improved forecasting and planning minimize stockouts, reduce excess inventory, and enhance supply chain efficiency and responsiveness."
        ],
      },
    ],
  },
  {
    title: "Specification",
    description: "Strategies for optimizing product and material specifications",
    dimensions: [
      {
        title: "Cost Value Engineering",
        description: [
          "Cost Value Engineering (CVE) is a structured methodology that focuses on optimizing product or service design to maximize functionality while minimizing costs. It involves analyzing components, materials, and processes to identify opportunities for cost reduction without degrading quality, performance, or compliance. CVE often includes cross-functional collaboration with suppliers, engineers, and users."
        ],
      },
      {
        title: "Innovation",
        description: [
          "Innovation in procurement refers to the pursuit and integration of new technologies, processes, or supplier collaborations that drive enhanced value. This cluster includes identifying and leveraging supplier-driven innovation, utilizing digital tools, and fostering partnerships that contribute to new product development, process improvements, or breakthrough solutions across cost, ESG, or resilience dimensions."
        ],
      },
    ],
  },
  {
    title: "Sourcing",
    description: "Strategies for optimizing supplier selection and management",
    dimensions: [
      {
        title: "Value Chain and Sourcing",
        description: [
          "Value Chain and Sourcing focuses on analyzing and optimizing how goods and services are sourced within the broader value chain. It includes make-or-buy decisions, nearshoring/offshoring, supplier base restructuring, total cost of ownership assessments, and localization strategies. The objective is to enhance cost efficiency, sustainability, and supply continuity across the end-to-end value chain."
        ],
      },
      {
        title: "Negotiations",
        description: [
          "Negotiations encompass all strategic and operational activities aimed at achieving optimal terms and conditions from suppliers. This includes pricing, payment terms, contract duration, service-level agreements, risk-sharing mechanisms, and value-added services. Successful negotiations lead to improved cost, flexibility, and supplier relationships beyond short-term price reductions."
        ],
      },
    ],
  },
  {
    title: "Execution",
    description: "Strategies for optimizing execution and implementation",
    dimensions: [
      {
        title: "ESG",
        description: [
          "Finance and Supply Chain Processes refer to the internal operational workflows and financial levers that influence procurement performance. These include process automation, procure-to-pay (P2P) efficiency, working capital optimization, payment term adjustments, and inventory financing. Improvements in these areas lead to increased transparency, process speed, and cost savings."
        ],
      },
      {
        title: "Finance and Supply Chain Processes", // "Process Execution",
        description: [
          "The Environmental, Social, Governance (ESG) cluster focuses on integrating sustainability and ethical responsibility into procurement decisions. It includes supplier assessments, decarbonization efforts, human rights compliance, and the promotion of circular economy principles. ESG actions ensure alignment with corporate responsibility goals and regulatory frameworks such as ESRS and CSRD."
        ],
      },
    ],
  },
]