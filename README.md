# 🚨 ECHO

### Emergency Coordination Hub & Operations

An intelligent emergency operations platform that combines operational dashboards, decision intelligence, semantic search, and grounded AI assistance to support emergency coordinators during critical incidents.

> Built for the CoCo Hackathon using Snowflake Cortex.

---

## 📖 Overview

Emergency response teams operate in environments where every decision matters. Coordinators must monitor multiple incidents, evaluate changing conditions, allocate resources, and consult operational procedures, often within minutes.

ECHO centralises these workflows into a single operational platform. By combining structured incident data with Snowflake Cortex AI capabilities, the platform helps operators access critical information faster and make informed, evidence-based decisions.

Unlike traditional dashboards that only visualise data, ECHO provides AI-assisted operational guidance grounded in official Standard Operating Procedures (SOPs).

---

## Why ECHO?

During emergency situations, operators frequently switch between multiple systems to gather situational awareness, review response procedures, and coordinate resources.

This fragmented workflow increases cognitive load and slows decision-making when rapid responses are essential.

ECHO brings operational intelligence, resource coordination, and AI-assisted guidance into a single workspace, enabling emergency coordinators to make faster, more confident decisions.

---

## ✨ Key Features

### Incident Dashboard

Monitor multiple emergency incidents from a unified operational dashboard.

Supported incident types include:

- Bushfire
- Flood
- Hazardous Material Spill
- Mass Casualty Incident
- Severe Weather Events

Each incident dynamically updates the dashboard, timeline, operational intelligence, map, and response recommendations.

---

### AI Commander

The AI Commander continuously analyses operational information through specialist intelligence modules:

- Weather Intelligence
- Medical Intelligence
- Infrastructure Intelligence
- Operational Risk Intelligence

These modules provide situational awareness throughout the incident lifecycle and contribute to the overall response recommendation.

---

### Decision Intelligence

Operational evidence is consolidated into an explainable recommendation supported by:

- Confidence score
- Decision metrics
- Supporting evidence
- Recommended operational action

This enables operators to understand *why* a recommendation was generated rather than simply receiving an output.

---

### Decision Simulation

ECHO compares multiple response strategies before deployment.

Each simulated scenario includes:

- Operational risk
- Resource requirements
- Estimated response time
- Confidence level

allowing emergency coordinators to evaluate trade-offs before committing to a response plan.

---

### Interactive Operations Map

The map provides a real-time operational view including:

- Incident locations
- Dynamic incident zones
- Resource deployment
- Evacuation routes
- Incident-specific visualisation

---

### Ask ECHO

Ask operational questions using natural language.

Example:

> *"How should responders manage the exclusion zone?"*

Ask ECHO automatically:

1. Understands the current incident context.
2. Retrieves relevant SOP documents using Snowflake Cortex Search.
3. Grounds responses using retrieved operational procedures.
4. Generates contextual guidance with Snowflake AI_COMPLETE.

Every response includes supporting source documents to improve transparency and traceability.

---

## AI Workflow

```text
Operator Question
        │
        ▼
Current Incident Context
        │
        ▼
Snowflake Cortex Search
(Semantic Retrieval)
        │
        ▼
Relevant SOP Documents
        │
        ▼
Snowflake AI_COMPLETE
        │
        ▼
Grounded Operational Guidance
```

---

## System Architecture

```text
                    Emergency Incident
                            │
                            ▼
                 Snowflake Operational Data
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
 Incident Data      Resources Data      SOP Documents
        │                   │                   │
        └──────────────┬────┴──────────────┬────┘
                       ▼                   ▼
               Decision Intelligence   Cortex Search
                       │                   │
                       ▼                   ▼
                AI Commander        AI_COMPLETE (RAG)
                       │                   │
                       └──────────┬────────┘
                                  ▼
                           ECHO Dashboard
                                  │
                                  ▼
                      Emergency Coordinator
```

---

## ❄️ Snowflake Integration

ECHO leverages multiple Snowflake capabilities to support AI-assisted emergency operations.

### Snowflake Cortex Search

Used for:

- Semantic SOP retrieval
- Vector-based document search
- Incident-aware information retrieval
- Retrieval-Augmented Generation (RAG)

### Snowflake AI_COMPLETE

Used to generate:

- Grounded operational guidance
- Context-aware emergency recommendations

### Structured Snowflake Data

Operational information retrieved directly from Snowflake includes:

- Incident data
- Resource allocation
- Decision intelligence
- Response simulations
- Operational recommendations

---

## 🛠️ Technology Stack

**Frontend**

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Leaflet
- Lucide React

**Backend**

- Next.js API Routes

**Artificial Intelligence**

- Snowflake Cortex Search
- Snowflake AI_COMPLETE
- Retrieval-Augmented Generation (RAG)

**Database**

- Snowflake

---

## 📸 Application Preview

### Dashboard Overview

<p align="center">
  <img width="1918" height="955" alt="image" src="https://github.com/user-attachments/assets/c3c93ef3-7560-4ac0-9b35-0c2cd092b665" />
  <img width="1853" height="917" alt="image" src="https://github.com/user-attachments/assets/c065b6bd-52bb-435d-b98d-d396537f6f32" />
</p>

The main operational dashboard provides a unified view of incidents, resources, decision intelligence, and AI-assisted recommendations.

---

### Ask ECHO

<p align="center">
  <img width="1817" height="862" alt="image" src="https://github.com/user-attachments/assets/a275c676-8e68-462b-b39d-2b5a75ec4384" />
  <img width="1802" height="661" alt="image" src="https://github.com/user-attachments/assets/3ad72f6e-fbb5-4cd2-8ca6-60c4c1ebe57f" />
</p>

Ask ECHO combines Snowflake Cortex Search with AI_COMPLETE to retrieve relevant SOPs and generate grounded operational guidance.

---

### Interactive Operations Map

<p align="center">
  <img width="1820" height="882" alt="image" src="https://github.com/user-attachments/assets/132984e9-950f-4ad7-a35e-b9850d0a4077" />
</p>

The interactive map visualises incidents, operational zones, evacuation routes, and deployed resources in real time.

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/<repository>.git
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
SNOWFLAKE_ACCOUNT=
SNOWFLAKE_USERNAME=
SNOWFLAKE_PASSWORD=
SNOWFLAKE_DATABASE=
SNOWFLAKE_SCHEMA=
SNOWFLAKE_WAREHOUSE=
SNOWFLAKE_ROLE=
```

Start the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 📁 Project Structure

```text
app/
components/
data/
hooks/
lib/
services/
types/
public/
```

---

## 🔮 Future Work

Potential future enhancements include:

- Autonomous specialist AI agents
- Live IoT sensor integration
- Satellite imagery analysis
- Predictive incident forecasting
- Multi-agency collaboration
- Mobile responder application
- Voice-assisted emergency operations

---

## 📄 License

This project was developed as part of the **CoCo Hackathon** using **Snowflake Cortex**.
