-- ECHO: Emergency Coordination Hub — Seed Data
-- Idempotent seed script: inserts data only if tables are empty
-- All object names are fully qualified against ECHO_DB

USE WAREHOUSE ECHO_WH;
USE DATABASE ECHO_DB;

----------------------------------------------------------------------
-- CORE.INCIDENTS (5 Australian emergencies)
----------------------------------------------------------------------
INSERT INTO ECHO_DB.CORE.INCIDENTS (
  incident_id, title, description, severity, status, incident_type,
  location_lat, location_lng, location_name, reported_at, resolved_at, metadata
)
SELECT * FROM (
  SELECT
    'INC-001' AS incident_id,
    'Adelaide Hills Bushfire' AS title,
    'Fast-moving bushfire originating near Lobethal Road, spreading south-east under strong northerly winds. Multiple properties under ember attack. CFS elevated to Grade 3 incident.' AS description,
    'CRITICAL' AS severity,
    'ACTIVE' AS status,
    'FIRE' AS incident_type,
    -34.9747 AS location_lat,
    138.8562 AS location_lng,
    'Adelaide Hills, SA' AS location_name,
    '2026-07-19T06:15:00+10:30'::TIMESTAMP_TZ AS reported_at,
    NULL::TIMESTAMP_TZ AS resolved_at,
    PARSE_JSON('{"wind_speed_kmh": 65, "temperature_c": 38, "fire_danger_rating": "CATASTROPHIC", "hectares_burned": 420, "structures_threatened": 34, "evacuations_issued": true}') AS metadata
  UNION ALL SELECT
    'INC-002', 'Murray Bridge River Flood',
    'Murray River exceeding minor flood level at Murray Bridge. Low-lying areas experiencing inundation. SES conducting doorknocking in affected streets. River level at 3.8m and rising.',
    'HIGH', 'ACTIVE', 'FLOOD',
    -35.1197, 139.2764, 'Murray Bridge, SA',
    '2026-07-18T22:30:00+10:30'::TIMESTAMP_TZ, NULL,
    PARSE_JSON('{"river_level_m": 3.8, "flood_class": "MINOR", "forecast_peak_m": 4.2, "properties_affected": 18, "roads_closed": 5, "sandbagging_active": true}')
  UNION ALL SELECT
    'INC-003', 'Chemical Spill – Port Adelaide Industrial',
    'Hydrochloric acid leak from storage tank at industrial facility on Grand Junction Road. 200m exclusion zone established. HAZMAT team on scene assessing atmospheric readings.',
    'HIGH', 'CONTAINED', 'HAZMAT',
    -34.8353, 138.5097, 'Port Adelaide, SA',
    '2026-07-19T03:45:00+10:30'::TIMESTAMP_TZ, NULL,
    PARSE_JSON('{"chemical": "Hydrochloric Acid", "volume_litres": 800, "exclusion_zone_m": 200, "wind_direction": "SW", "air_monitoring": "ACTIVE", "residents_evacuated": 45}')
  UNION ALL SELECT
    'INC-004', 'Severe Storm Damage – Mount Barker',
    'Supercell thunderstorm causing significant structural damage in Mount Barker township. Multiple trees down across roads, power outages affecting 3,200 premises. SES receiving high volume of requests.',
    'MEDIUM', 'ACTIVE', 'STORM',
    -35.0687, 138.8590, 'Mount Barker, SA',
    '2026-07-19T01:20:00+10:30'::TIMESTAMP_TZ, NULL,
    PARSE_JSON('{"wind_gust_kmh": 110, "hail_size_cm": 4, "power_outages": 3200, "trees_down": 28, "buildings_damaged": 12, "roads_blocked": 7}')
  UNION ALL SELECT
    'INC-005', 'Multi-Vehicle Collision – South Eastern Freeway',
    'Chain-reaction collision involving 6 vehicles including a fuel tanker near the Crafers interchange. 3 critical injuries, fuel leak contained. Freeway closed in both directions.',
    'CRITICAL', 'CONTAINED', 'COLLISION',
    '2026-07-19T07:42:00+10:30'::TIMESTAMP_TZ AS reported_at,
    -35.0194, 138.7102, 'South Eastern Freeway, Crafers SA',
    '2026-07-19T07:42:00+10:30'::TIMESTAMP_TZ, NULL,
    PARSE_JSON('{"vehicles_involved": 6, "fuel_tanker": true, "injuries_critical": 3, "injuries_minor": 5, "freeway_closed": true, "fuel_leak_litres": 120, "lanes_blocked": "ALL"}')
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM ECHO_DB.CORE.INCIDENTS LIMIT 1);

----------------------------------------------------------------------
-- CORE.RESOURCES (12 emergency resources)
----------------------------------------------------------------------
INSERT INTO ECHO_DB.CORE.RESOURCES (
  resource_id, resource_type, name, status, location_lat, location_lng, capacity, metadata
)
SELECT * FROM (
  SELECT
    'RES-001' AS resource_id, 'VEHICLE' AS resource_type, 'Fire Truck Alpha' AS name,
    'DEPLOYED' AS status, -34.9280 AS location_lat, 138.6007 AS location_lng, 6 AS capacity,
    PARSE_JSON('{"unit": "CFS", "vehicle_class": "Type 3 Pumper", "water_capacity_l": 3000, "call_sign": "ALPHA-7"}') AS metadata
  UNION ALL SELECT
    'RES-002', 'VEHICLE', 'Ambulance SA-41', 'DEPLOYED', -34.9210, 138.6050, 2,
    PARSE_JSON('{"unit": "SA Ambulance", "vehicle_class": "Advanced Life Support", "call_sign": "SA-41", "equipment": ["defibrillator", "ventilator", "trauma_kit"]}')
  UNION ALL SELECT
    'RES-003', 'VEHICLE', 'Police Unit Delta-9', 'DEPLOYED', -34.9250, 138.5990, 4,
    PARSE_JSON('{"unit": "SAPOL", "vehicle_class": "Highway Patrol", "call_sign": "DELTA-9", "capabilities": ["traffic_management", "investigation", "perimeter_control"]}')
  UNION ALL SELECT
    'RES-004', 'PERSONNEL', 'SES Team Bravo', 'DEPLOYED', -35.1200, 139.2800, 8,
    PARSE_JSON('{"unit": "SA SES", "team_size": 8, "specialisation": "flood_rescue", "equipment": ["inflatable_boat", "pumps", "sandbags", "chainsaws"]}')
  UNION ALL SELECT
    'RES-005', 'VEHICLE', 'Rescue Helicopter MedSTAR-1', 'DEPLOYED', -34.9450, 138.5300, 4,
    PARSE_JSON('{"unit": "MedSTAR", "aircraft_type": "AW139", "call_sign": "MEDSTAR-1", "range_km": 600, "winch_capable": true}')
  UNION ALL SELECT
    'RES-006', 'VEHICLE', 'Mobile Command Vehicle', 'DEPLOYED', -34.9750, 138.8560, 12,
    PARSE_JSON('{"unit": "CFS", "capabilities": ["satellite_comms", "mapping", "video_conference", "weather_station"], "call_sign": "COMMAND-1"}')
  UNION ALL SELECT
    'RES-007', 'PERSONNEL', 'Medical Team Charlie', 'DEPLOYED', -35.0190, 138.7100, 6,
    PARSE_JSON('{"unit": "SA Health", "team_size": 6, "composition": ["2x_paramedic", "1x_doctor", "2x_nurse", "1x_triage_officer"], "triage_capability": true}')
  UNION ALL SELECT
    'RES-008', 'VEHICLE', 'Water Tanker CFS-T4', 'DEPLOYED', -34.9800, 138.8600, 2,
    PARSE_JSON('{"unit": "CFS", "vehicle_class": "Bulk Water Carrier", "water_capacity_l": 12000, "call_sign": "TANKER-4"}')
  UNION ALL SELECT
    'RES-009', 'EQUIPMENT', 'Drone Unit Skywatch', 'AVAILABLE', -34.9400, 138.6200, 1,
    PARSE_JSON('{"unit": "SAPOL", "drone_type": "DJI Matrice 350", "capabilities": ["thermal_imaging", "4k_video", "mapping", "gas_detection"], "flight_time_min": 45}')
  UNION ALL SELECT
    'RES-010', 'VEHICLE', 'Evacuation Bus EB-02', 'AVAILABLE', -34.9300, 138.5800, 52,
    PARSE_JSON('{"unit": "SA Transport", "vehicle_class": "Coach", "capacity_seated": 52, "wheelchair_accessible": true, "call_sign": "EVAC-BUS-02"}')
  UNION ALL SELECT
    'RES-011', 'EQUIPMENT', 'Portable Generator PG-7', 'AVAILABLE', -35.0700, 138.8500, 1,
    PARSE_JSON('{"unit": "SA SES", "power_output_kw": 25, "fuel_type": "diesel", "runtime_hours": 18, "connections": ["3_phase", "single_phase"]}')
  UNION ALL SELECT
    'RES-012', 'PERSONNEL', 'Shelter Support Team', 'AVAILABLE', -34.9260, 138.5990, 10,
    PARSE_JSON('{"unit": "Red Cross", "team_size": 10, "capabilities": ["registration", "welfare_checks", "first_aid", "catering", "psychological_support"]}')
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM ECHO_DB.CORE.RESOURCES LIMIT 1);

----------------------------------------------------------------------
-- CORE.RESOURCE_ALLOCATIONS
----------------------------------------------------------------------
INSERT INTO ECHO_DB.CORE.RESOURCE_ALLOCATIONS (
  allocation_id, incident_id, resource_id, allocated_at, released_at, status, priority
)
SELECT * FROM (
  -- INC-001 Bushfire: Fire Truck, Water Tanker, Mobile Command, Drone
  SELECT 'ALLOC-001' AS allocation_id, 'INC-001' AS incident_id, 'RES-001' AS resource_id,
    '2026-07-19T06:25:00+10:30'::TIMESTAMP_TZ AS allocated_at, NULL::TIMESTAMP_TZ AS released_at,
    'ACTIVE' AS status, 1 AS priority
  UNION ALL SELECT 'ALLOC-002', 'INC-001', 'RES-008',
    '2026-07-19T06:30:00+10:30'::TIMESTAMP_TZ, NULL, 'ACTIVE', 1
  UNION ALL SELECT 'ALLOC-003', 'INC-001', 'RES-006',
    '2026-07-19T06:35:00+10:30'::TIMESTAMP_TZ, NULL, 'ACTIVE', 2
  -- INC-002 Flood: SES Team, Evacuation Bus
  UNION ALL SELECT 'ALLOC-004', 'INC-002', 'RES-004',
    '2026-07-18T23:00:00+10:30'::TIMESTAMP_TZ, NULL, 'ACTIVE', 1
  UNION ALL SELECT 'ALLOC-005', 'INC-002', 'RES-010',
    '2026-07-19T05:00:00+10:30'::TIMESTAMP_TZ, NULL, 'ACTIVE', 2
  -- INC-003 Chemical Spill: Police Unit, Shelter Support
  UNION ALL SELECT 'ALLOC-006', 'INC-003', 'RES-003',
    '2026-07-19T04:00:00+10:30'::TIMESTAMP_TZ, NULL, 'ACTIVE', 1
  UNION ALL SELECT 'ALLOC-007', 'INC-003', 'RES-012',
    '2026-07-19T04:30:00+10:30'::TIMESTAMP_TZ, NULL, 'ACTIVE', 2
  -- INC-004 Storm: SES Generator, Drone
  UNION ALL SELECT 'ALLOC-008', 'INC-004', 'RES-011',
    '2026-07-19T02:00:00+10:30'::TIMESTAMP_TZ, NULL, 'ACTIVE', 2
  UNION ALL SELECT 'ALLOC-009', 'INC-004', 'RES-009',
    '2026-07-19T02:15:00+10:30'::TIMESTAMP_TZ, NULL, 'ACTIVE', 3
  -- INC-005 Collision: Ambulance, Helicopter, Medical Team
  UNION ALL SELECT 'ALLOC-010', 'INC-005', 'RES-002',
    '2026-07-19T07:45:00+10:30'::TIMESTAMP_TZ, NULL, 'ACTIVE', 1
  UNION ALL SELECT 'ALLOC-011', 'INC-005', 'RES-005',
    '2026-07-19T07:48:00+10:30'::TIMESTAMP_TZ, NULL, 'ACTIVE', 1
  UNION ALL SELECT 'ALLOC-012', 'INC-005', 'RES-007',
    '2026-07-19T07:50:00+10:30'::TIMESTAMP_TZ, NULL, 'ACTIVE', 1
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM ECHO_DB.CORE.RESOURCE_ALLOCATIONS LIMIT 1);

----------------------------------------------------------------------
-- AI.RECOMMENDATIONS
----------------------------------------------------------------------
INSERT INTO ECHO_DB.AI.RECOMMENDATIONS (
  recommendation_id, incident_id, recommendation_type, content,
  confidence_score, model_version, accepted, created_at
)
SELECT * FROM (
  SELECT
    'REC-001' AS recommendation_id, 'INC-001' AS incident_id,
    'EVACUATE' AS recommendation_type,
    'Immediate evacuation recommended for residents within 2km radius south-east of fire front. Wind change forecast at 1400hrs will push fire toward Stirling and Aldgate. Pre-position evacuation buses at Mount Lofty Oval.' AS content,
    96.4 AS confidence_score, 'echo-v1.2.0' AS model_version, TRUE AS accepted,
    '2026-07-19T06:45:00+10:30'::TIMESTAMP_TZ AS created_at
  UNION ALL SELECT
    'REC-002', 'INC-002', 'RESOURCE_DEPLOY',
    'Deploy additional sandbagging crews to Riverglen Drive and Murray Terrace. Hydrological model predicts peak flow in 14 hours. Current levee capacity will be exceeded at 4.1m without reinforcement.',
    91.7, 'echo-v1.2.0', TRUE,
    '2026-07-19T00:15:00+10:30'::TIMESTAMP_TZ
  UNION ALL SELECT
    'REC-003', 'INC-003', 'CONTAIN',
    'Expand exclusion zone to 350m based on atmospheric dispersion modelling. Current HCl concentration at 180m boundary approaching IDLH threshold. Recommend shelter-in-place for residents between 200-350m.',
    94.2, 'echo-v1.2.0', FALSE,
    '2026-07-19T04:15:00+10:30'::TIMESTAMP_TZ
  UNION ALL SELECT
    'REC-004', 'INC-005', 'ESCALATE',
    'Escalate to Major Crash Investigation. Fuel tanker structural integrity compromised — risk of secondary explosion. Recommend extending road closure to 1km and requesting MFS foam unit.',
    97.8, 'echo-v1.2.0', TRUE,
    '2026-07-19T08:00:00+10:30'::TIMESTAMP_TZ
  UNION ALL SELECT
    'REC-005', 'INC-004', 'RESOURCE_DEPLOY',
    'Priority restoration needed for Mount Barker Hospital backup power. Generator PG-7 available at depot. Estimated 3,200 premises without power for 8+ hours based on SA Power Networks damage assessment.',
    88.5, 'echo-v1.2.0', TRUE,
    '2026-07-19T02:30:00+10:30'::TIMESTAMP_TZ
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM ECHO_DB.AI.RECOMMENDATIONS LIMIT 1);

----------------------------------------------------------------------
-- AI.DECISION_LOG
----------------------------------------------------------------------
INSERT INTO ECHO_DB.AI.DECISION_LOG (
  decision_id, incident_id, decision_type, decision_made,
  reasoning, ai_assisted, decided_at, decided_by
)
SELECT * FROM (
  SELECT
    'DEC-001' AS decision_id, 'INC-001' AS incident_id,
    'EVACUATION' AS decision_type,
    'Issue Emergency Warning and commence evacuation of Lobethal Road corridor' AS decision_made,
    'AI recommendation REC-001 confirmed by Bureau of Meteorology wind change forecast. Ground crews report ember spotting 800m ahead of fire front. Decision aligns with CFS Standard Operating Procedure for Grade 3 bushfire.' AS reasoning,
    TRUE AS ai_assisted,
    '2026-07-19T06:50:00+10:30'::TIMESTAMP_TZ AS decided_at,
    'IC Commander J. Morrison' AS decided_by
  UNION ALL SELECT
    'DEC-002', 'INC-002', 'RESOURCE_DEPLOYMENT',
    'Deploy 2 additional SES crews with 4000 sandbags to Riverglen Drive',
    'Accepted AI recommendation REC-002. River gauge confirms rising trend consistent with model. Council flood maps show Riverglen Drive properties below 1-in-20 year flood level.',
    TRUE, '2026-07-19T00:30:00+10:30'::TIMESTAMP_TZ, 'IC Commander S. Patel'
  UNION ALL SELECT
    'DEC-003', 'INC-003', 'CONTAINMENT',
    'Maintain 200m exclusion zone; reject expansion to 350m',
    'Overrode AI recommendation REC-003. On-ground atmospheric readings at 200m boundary are well within safe limits. Expanding zone would displace additional 120 residents unnecessarily. Continuous monitoring maintained.',
    TRUE, '2026-07-19T04:30:00+10:30'::TIMESTAMP_TZ, 'IC Commander R. Chen'
  UNION ALL SELECT
    'DEC-004', 'INC-005', 'ESCALATION',
    'Escalate to Major Crash; request MFS foam unit and extend closure to 1.2km',
    'AI recommendation REC-004 accepted and extended. On-scene assessment confirms diesel leak from compromised tank. MFS foam unit requested as precaution. Extended closure beyond AI recommendation to 1.2km due to downhill gradient.',
    TRUE, '2026-07-19T08:05:00+10:30'::TIMESTAMP_TZ, 'IC Commander J. Morrison'
  UNION ALL SELECT
    'DEC-005', 'INC-004', 'RESOURCE_DEPLOYMENT',
    'Deploy portable generator PG-7 to Mount Barker Hospital',
    'Accepted AI recommendation REC-005. Hospital confirmed backup generator failed during storm. 14 patients on life support equipment. Generator PG-7 dispatched with SES crew for installation.',
    TRUE, '2026-07-19T02:45:00+10:30'::TIMESTAMP_TZ, 'IC Commander S. Patel'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM ECHO_DB.AI.DECISION_LOG LIMIT 1);

----------------------------------------------------------------------
-- SIMULATION.RUNS (3 completed runs)
----------------------------------------------------------------------
INSERT INTO ECHO_DB.SIMULATION.RUNS (
  run_id, incident_id, status, scenarios, selected_scenario,
  confidence_score, started_at, completed_at
)
SELECT * FROM (
  SELECT
    'SIM-001' AS run_id, 'INC-001' AS incident_id, 'COMPLETED' AS status,
    PARSE_JSON('[
      {"id": "S1A", "name": "Aggressive Aerial Suppression", "description": "Deploy 3 water bombers with ground crew pincer movement from east and west", "estimated_containment_hrs": 4, "risk_level": "HIGH", "resource_cost": "VERY_HIGH"},
      {"id": "S1B", "name": "Controlled Evacuation + Perimeter Hold", "description": "Evacuate threatened areas while establishing firebreaks along Ridge Road", "estimated_containment_hrs": 8, "risk_level": "MEDIUM", "resource_cost": "HIGH"},
      {"id": "S1C", "name": "Staged Withdrawal", "description": "Progressive evacuation with defensive firefighting on key assets only", "estimated_containment_hrs": 12, "risk_level": "LOW", "resource_cost": "MEDIUM"}
    ]') AS scenarios,
    'S1B' AS selected_scenario, 92.3 AS confidence_score,
    '2026-07-19T06:40:00+10:30'::TIMESTAMP_TZ AS started_at,
    '2026-07-19T06:42:00+10:30'::TIMESTAMP_TZ AS completed_at
  UNION ALL SELECT
    'SIM-002', 'INC-002', 'COMPLETED',
    PARSE_JSON('[
      {"id": "S2A", "name": "Proactive Levee Reinforcement", "description": "Deploy all available crews to reinforce levees before predicted peak", "estimated_protection_hrs": 24, "risk_level": "LOW", "resource_cost": "HIGH"},
      {"id": "S2B", "name": "Targeted Evacuation + Pump Deployment", "description": "Evacuate lowest-lying 8 properties and deploy portable pumps at key drainage points", "estimated_protection_hrs": 48, "risk_level": "MEDIUM", "resource_cost": "MEDIUM"},
      {"id": "S2C", "name": "Full Precautionary Evacuation", "description": "Evacuate all properties below 4.5m elevation within 500m of riverbank", "estimated_protection_hrs": 72, "risk_level": "LOW", "resource_cost": "VERY_HIGH"}
    ]'),
    'S2A', 89.1,
    '2026-07-19T00:10:00+10:30'::TIMESTAMP_TZ,
    '2026-07-19T00:12:00+10:30'::TIMESTAMP_TZ
  UNION ALL SELECT
    'SIM-003', 'INC-005', 'COMPLETED',
    PARSE_JSON('[
      {"id": "S3A", "name": "Rapid Extraction + Foam Blanket", "description": "Extract casualties immediately while applying foam suppression to fuel leak", "estimated_resolution_hrs": 2, "risk_level": "HIGH", "resource_cost": "HIGH"},
      {"id": "S3B", "name": "Stabilise Then Extract", "description": "Stabilise fuel leak with absorbent booms, then commence patient extraction with full HAZMAT precautions", "estimated_resolution_hrs": 4, "risk_level": "MEDIUM", "resource_cost": "MEDIUM"},
      {"id": "S3C", "name": "Full HAZMAT Protocol", "description": "Treat as HAZMAT incident. Extended exclusion zone, specialist extraction with full decontamination corridor", "estimated_resolution_hrs": 6, "risk_level": "LOW", "resource_cost": "VERY_HIGH"}
    ]'),
    'S3A', 95.6,
    '2026-07-19T07:55:00+10:30'::TIMESTAMP_TZ,
    '2026-07-19T07:57:00+10:30'::TIMESTAMP_TZ
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM ECHO_DB.SIMULATION.RUNS LIMIT 1);

----------------------------------------------------------------------
-- CORTEX.DOCUMENTS (10 SOPs for future RAG/Search)
----------------------------------------------------------------------
INSERT INTO ECHO_DB.CORTEX.DOCUMENTS (
  doc_id, doc_type, title, content, metadata, updated_at
)
SELECT * FROM (
  SELECT
    'DOC-001' AS doc_id, 'SOP' AS doc_type,
    'Bushfire Response – Initial Attack Protocol' AS title,
    'PURPOSE: This procedure establishes the standard initial attack protocol for bushfire incidents in South Australia. SCOPE: All CFS brigades and supporting agencies responding to vegetation fires. PROCEDURE: 1. On notification of a bushfire, the first arriving officer assumes Incident Controller role and conducts a rapid size-up including fire behaviour assessment, structures at risk, and access routes. 2. Establish anchor point on a secure flank. Begin suppression from the rear of the fire working forward along flanks. Never attack the head unless conditions are clearly manageable. 3. Request aerial support if fire exceeds 2 hectares in grassland or 0.5 hectares in scrub/forest with active spread. 4. Issue Watch and Act or Emergency Warning via SA Alert if any structures are under threat within 30 minutes. 5. Establish staging area minimum 500m from active fire edge, upwind where possible. All crew rotations occur through staging. 6. Maintain 10-minute situational reports to Incident Management Team. Include fire behaviour indicators: flame height, rate of spread, spotting distance.' AS content,
    PARSE_JSON('{"version": "3.1", "effective_date": "2025-11-01", "review_date": "2026-11-01", "authority": "CFS Operations", "classification": "OPERATIONAL"}') AS metadata,
    '2025-11-01T00:00:00+10:30'::TIMESTAMP_TZ AS updated_at
  UNION ALL SELECT
    'DOC-002', 'SOP', 'Flood Response – Levee Management and Sandbagging',
    'PURPOSE: Establish procedures for levee management, sandbagging operations, and flood mitigation during riverine flooding events. SCOPE: SA SES units, council workers, and volunteers engaged in flood protection activities. PROCEDURE: 1. On receipt of Bureau of Meteorology Flood Warning, activate local flood plan and notify all registered volunteers. 2. Conduct levee inspection within 2 hours of warning. Document condition with photographs and GPS coordinates of any seepage, boils, or soft spots. 3. Sandbagging operations: Use standard pyramid stacking method. Each bag filled two-thirds capacity (approximately 15kg). Stack in interlocking pattern with seams facing upstream. Minimum wall height: predicted flood level plus 300mm freeboard. 4. Critical infrastructure protection priority order: water treatment, hospital, aged care, telecommunications, electrical substations. 5. Pump deployment: Position portable pumps at lowest elevation points behind levee. Maintain minimum 2 pump redundancy at each critical location. Test all pumps for 5 minutes before positioning. 6. Monitor river gauges every 30 minutes during rising phase. Report any levee anomalies immediately to Incident Controller.',
    PARSE_JSON('{"version": "2.4", "effective_date": "2025-09-15", "review_date": "2026-09-15", "authority": "SA SES State HQ", "classification": "OPERATIONAL"}'),
    '2025-09-15T00:00:00+10:30'::TIMESTAMP_TZ
  UNION ALL SELECT
    'DOC-003', 'SOP', 'Hazardous Chemical Spill – Containment and Decontamination',
    'PURPOSE: Define the response protocol for hazardous chemical spills including containment, atmospheric monitoring, and decontamination procedures. SCOPE: MFS HAZMAT teams, CFS, SAPOL, SA Health, and EPA South Australia. PROCEDURE: 1. First responder establishes initial exclusion zone of minimum 100m (adjust based on chemical identity, wind, and quantity). Approach from upwind, uphill. 2. Identify substance using placards, SDS, or manifest. If unknown, treat as worst-case scenario until identified. Contact ChemCall 24/7 for specialist advice. 3. Atmospheric monitoring: Deploy multi-gas detector at exclusion boundary. Record readings every 10 minutes. Expand zone immediately if any reading exceeds STEL values. 4. Containment: For liquid spills, deploy absorbent booms and dyking material to prevent entry into stormwater drains. For gas releases, establish vapour suppression with fog lines. 5. Decontamination corridor: Establish three-zone decon (hot/warm/cold) with minimum 30m between zones. All personnel exiting hot zone undergo full technical decontamination. 6. EPA notification mandatory within 1 hour for any reportable quantity release. Preserve evidence for investigation.',
    PARSE_JSON('{"version": "4.0", "effective_date": "2026-02-01", "review_date": "2027-02-01", "authority": "MFS HAZMAT Division", "classification": "OPERATIONAL"}'),
    '2026-02-01T00:00:00+10:30'::TIMESTAMP_TZ
  UNION ALL SELECT
    'DOC-004', 'SOP', 'Evacuation Procedures – Community Warning and Movement',
    'PURPOSE: Establish standardised procedures for ordering, communicating, and executing community evacuations during emergencies. SCOPE: All emergency services agencies in South Australia responsible for protective actions. PROCEDURE: 1. Evacuation decision authority rests with Incident Controller (or delegate) based on risk assessment. Consider: time available, population characteristics, route capacity, and shelter availability. 2. Warning dissemination sequence: SA Alert (Emergency Warning), ABC Emergency Broadcasting, door-to-door where time permits, variable message signs on arterial roads. 3. Evacuation route selection: Minimum two routes from each sector. Routes must lead away from hazard. Traffic management points established at key intersections with police or traffic marshals. 4. Vulnerable populations: Identify aged care facilities, hospitals, schools, and disability services within evacuation zone. These require dedicated transport and longer lead times — commence first. 5. Evacuation centre activation: Notify Red Cross Registration and Inquiry team. Ensure centre has capacity for expected numbers plus 30% contingency. Minimum facilities: registration desk, rest area, first aid, refreshments, pet area, information board. 6. Route clearance: Remove obstacles, contra-flow arterial roads if required (police authorisation needed), position breakdown assistance vehicles at 2km intervals.',
    PARSE_JSON('{"version": "5.2", "effective_date": "2026-01-15", "review_date": "2027-01-15", "authority": "SEMC South Australia", "classification": "OPERATIONAL"}'),
    '2026-01-15T00:00:00+10:30'::TIMESTAMP_TZ
  UNION ALL SELECT
    'DOC-005', 'SOP', 'Incident Command System – Structure and Responsibilities',
    'PURPOSE: Define the Incident Command System structure, roles, and responsibilities for multi-agency emergency response in South Australia. SCOPE: All combat and support agencies operating under the AIIMS framework. PROCEDURE: 1. Incident Controller (IC): Overall authority for incident management. Responsible for setting objectives, approving Incident Action Plan, authorising resource requests, and ensuring safety of all personnel. 2. Operations Officer: Manages tactical operations. Organises resources into Divisions (geographic) or Groups (functional). Maintains Tactical Worksheet. Reports progress against objectives to IC every operational period. 3. Planning Officer: Manages information flow. Maintains Situation Unit (mapping, intelligence), Resources Unit (tracking), and prepares Incident Action Plan for each operational period. Conducts planning meetings. 4. Logistics Officer: Provides facilities, transport, communications, food, and medical support to operations. Manages staging areas and base camp. Procures resources through established supply chains. 5. Public Information Officer: Single point of contact for media. Prepares community information in consultation with IC. Coordinates messaging across agencies to ensure consistency. 6. Safety Advisor: Monitors operations for safety compliance. Has authority to suspend any operation presenting imminent threat to personnel safety. Conducts risk assessments for all tactical assignments.',
    PARSE_JSON('{"version": "6.0", "effective_date": "2025-07-01", "review_date": "2026-07-01", "authority": "SEMC South Australia", "classification": "GOVERNANCE"}'),
    '2025-07-01T00:00:00+10:30'::TIMESTAMP_TZ
  UNION ALL SELECT
    'DOC-006', 'SOP', 'Mass Casualty Triage – START Protocol',
    'PURPOSE: Establish the standard triage protocol for mass casualty incidents to ensure optimal patient outcomes through prioritised treatment and transport. SCOPE: SA Ambulance Service, MFS, CFS first responders, hospital emergency departments. PROCEDURE: 1. First arriving paramedic assumes Ambulance Commander role. Conduct rapid scene assessment: estimated casualty count, hazard status, access points, and triage area location. 2. Designate triage area: flat, accessible ground clear of hazards, ideally with vehicle access on two sides. Mark with green tape or cones. 3. Apply START triage (Simple Triage and Rapid Treatment): Walk filter — all ambulatory patients directed to GREEN (Minor) collection point. Remaining patients assessed in order encountered. 4. Assessment sequence: Breathing? If no, reposition airway. Still no = BLACK (Deceased). If yes, respiratory rate >30 = RED (Immediate). Perfusion: capillary refill >2 seconds or radial pulse absent = RED. Mental status: cannot follow commands = RED. All others = YELLOW (Delayed). 5. Tagging: Attach triage tag to right wrist or ankle. Do NOT re-triage upward at this stage — reassessment occurs at Casualty Clearing Station by senior clinician. 6. Transport priority: RED patients first to nearest appropriate facility. Maximum 2 RED patients per ambulance. Distribute across hospitals to prevent single-facility overload. Notify hospitals of expected numbers via MCI broadcast.',
    PARSE_JSON('{"version": "3.3", "effective_date": "2026-03-01", "review_date": "2027-03-01", "authority": "SA Ambulance Service", "classification": "CLINICAL"}'),
    '2026-03-01T00:00:00+10:30'::TIMESTAMP_TZ
  UNION ALL SELECT
    'DOC-007', 'SOP', 'Resource Deployment – Mobilisation and Tracking',
    'PURPOSE: Establish procedures for mobilising, deploying, tracking, and demobilising emergency resources during incident response. SCOPE: All agencies managing physical resources (vehicles, equipment, personnel teams) during emergencies. PROCEDURE: 1. Resource request: All requests submitted through Incident Controller to Logistics Officer. Specify resource type, capability required, quantity, deployment location, and urgency (immediate/planned). 2. Dispatch priority: Priority 1 — life safety resources (ambulance, rescue). Dispatch within 3 minutes. Priority 2 — containment resources (fire trucks, HAZMAT). Dispatch within 10 minutes. Priority 3 — support resources (catering, welfare). Dispatch within 30 minutes. 3. Tracking: All deployed resources report location and status every 30 minutes to Resources Unit via radio or AVL. Status categories: Assigned, En Route, On Scene, Available, Out of Service. 4. Staging: Resources not immediately assigned report to staging area. Staging manager maintains ready pool and dispatches on request from Operations. Maximum staging time 2 hours before rotation or redeployment. 5. Demobilisation: Resources released by Operations Officer when no longer required. Complete demobilisation checklist: equipment inspection, consumables report, personnel welfare check. Return to home station via approved route. 6. Documentation: All resource movements logged in Resource Tracking System. Post-incident reconciliation within 48 hours.',
    PARSE_JSON('{"version": "2.1", "effective_date": "2025-12-01", "review_date": "2026-12-01", "authority": "SEMC Logistics", "classification": "OPERATIONAL"}'),
    '2025-12-01T00:00:00+10:30'::TIMESTAMP_TZ
  UNION ALL SELECT
    'DOC-008', 'SOP', 'Public Communication – Emergency Messaging Standards',
    'PURPOSE: Define standards and procedures for public communication during emergencies to ensure timely, accurate, and consistent messaging. SCOPE: Public Information Officers, Incident Controllers, media liaison staff across all agencies. PROCEDURE: 1. Warning levels (in escalating order): Advice (incident occurring, no immediate threat), Watch and Act (conditions changing, prepare to act), Emergency Warning (take immediate action to survive). Each level has prescribed content template and dissemination channels. 2. Message construction: Use plain English, maximum Year 8 reading level. Lead with action required. Include: what is happening, where, what to do, when to do it, where to get more information. Avoid jargon and acronyms. 3. Timing: First public message within 30 minutes of incident notification. Updates minimum every 60 minutes during active incident, or immediately on significant change. All-clear message when threat has passed. 4. Channels (in priority order): Emergency Alert (location-based SMS/voice), SA Alert website, ABC Emergency Broadcasting (radio and TV), social media (official agency accounts only), media briefings, community meetings. 5. Multi-language support: For areas with >5% non-English speaking population, translate key messages into top 3 community languages within 2 hours. Use accredited interpreters only. 6. Social media monitoring: Monitor for misinformation. Issue corrections promptly referencing official sources. Do not engage in argument — state facts and provide link to official information.',
    PARSE_JSON('{"version": "4.1", "effective_date": "2026-04-01", "review_date": "2027-04-01", "authority": "Government Communications", "classification": "COMMUNICATIONS"}'),
    '2026-04-01T00:00:00+10:30'::TIMESTAMP_TZ
  UNION ALL SELECT
    'DOC-009', 'SOP', 'Emergency Shelter – Activation and Management',
    'PURPOSE: Establish procedures for activating, operating, and deactivating emergency shelters for displaced persons. SCOPE: Red Cross, local councils, SA Housing Authority, and welfare agencies. PROCEDURE: 1. Activation trigger: Incident Controller requests shelter activation when evacuation displaces more than 20 persons or displacement expected beyond 4 hours. 2. Site selection criteria: Structurally sound building, accessible by public transport, adequate parking, kitchen facilities, accessible toilets and showers, backup power connection, minimum 3.5 sqm per person. Preferred venues: community centres, school gymnasiums, church halls (pre-agreed MOU required). 3. Setup requirements: Registration desk at single entry point, rest areas with camp beds (1 per person), family zones separated from singles, pet holding area (outdoor), first aid station, information board with incident updates, charging stations for devices, quiet room for distressed persons. 4. Registration: All arrivals registered using National Registration and Inquiry System (NRIS). Record name, address, contact number, medical needs, accompanying persons, pets. Issue wristband with unique ID. 5. Welfare services: Hot meals within 2 hours of activation. Psychological first aid available on-site within 4 hours. Financial assistance referrals for eligible persons. Daily briefings from Incident Management Team at 0900 and 1700. 6. Deactivation: When residents can return home or alternative accommodation secured. Minimum 24-hour notice to occupants. Provide return information pack including safety inspection requirements.',
    PARSE_JSON('{"version": "3.0", "effective_date": "2025-10-01", "review_date": "2026-10-01", "authority": "Red Cross SA", "classification": "WELFARE"}'),
    '2025-10-01T00:00:00+10:30'::TIMESTAMP_TZ
  UNION ALL SELECT
    'DOC-010', 'SOP', 'Multi-Agency Coordination – Unified Command Procedures',
    'PURPOSE: Establish procedures for multi-agency coordination when an incident requires response from multiple control agencies with concurrent jurisdictional authority. SCOPE: All South Australian emergency services agencies participating in multi-agency incidents. PROCEDURE: 1. Unified Command is established when two or more agencies have jurisdictional responsibility for an incident (e.g., bushfire threatening HAZMAT facility, flood requiring road rescue). No single agency relinquishes authority — commanders work together to set unified objectives. 2. Establishment criteria: Multiple control agencies, overlapping geographic or functional jurisdiction, resource competition between agencies, or incident complexity exceeding single-agency capability (Level 3+). 3. Command structure: Joint Incident Controller arrangement or Lead Agency with supporting agencies model. Decision method agreed at first unified briefing. All agencies maintain internal reporting chains while operating under unified objectives. 4. Information sharing: Common Operating Picture maintained on shared mapping platform. Situation reports standardised across agencies using agreed template. Joint intelligence briefings every 2 hours minimum. Shared radio channel designated for inter-agency coordination (separate from tactical channels). 5. Resource sharing: Resources offered to unified pool retain agency ownership but accept tasking from Operations Officer. Cost-sharing arrangements documented in Logistics section of Incident Action Plan. 6. Transition and handover: As incident evolves, lead agency may change. Formal handover briefing required with documented transfer of control. Supporting agencies brief incoming lead on their sector status, committed resources, and outstanding issues.',
    PARSE_JSON('{"version": "2.0", "effective_date": "2026-05-01", "review_date": "2027-05-01", "authority": "SEMC South Australia", "classification": "GOVERNANCE"}'),
    '2026-05-01T00:00:00+10:30'::TIMESTAMP_TZ
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM ECHO_DB.CORTEX.DOCUMENTS LIMIT 1);
