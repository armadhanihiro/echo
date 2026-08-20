-- ECHO: Emergency Coordination Hub
-- Idempotent setup script for Snowflake MVP architecture
-- Warehouse: ECHO_WH
--
-- NOTE ON CONSTRAINTS:
-- Primary keys and foreign keys on Snowflake standard tables are logical/
-- documentation constraints. They are NOT enforced at insert/update time.
-- They exist for query optimization hints and schema documentation.
-- NOT NULL and CHECK constraints ARE enforced.

USE WAREHOUSE ECHO_WH;

----------------------------------------------------------------------
-- DATABASE
----------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS ECHO_DB
  COMMENT = 'ECHO - AI-powered Emergency Coordination Hub';

USE DATABASE ECHO_DB;

----------------------------------------------------------------------
-- SCHEMA: CORE
----------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS CORE
  COMMENT = 'Core business entities — incidents, resources, allocations';

----------------------------------------------------------------------
-- SCHEMA: AI
----------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS AI
  COMMENT = 'AI/ML artifacts — recommendations and decision tracking';

----------------------------------------------------------------------
-- SCHEMA: SIMULATION
----------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS SIMULATION
  COMMENT = 'Response simulation runs and scenario analysis';

----------------------------------------------------------------------
-- SCHEMA: CORTEX
----------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS CORTEX
  COMMENT = 'Future Cortex AI integration — RAG documents and search';

----------------------------------------------------------------------
-- TABLE: CORE.INCIDENTS
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.INCIDENTS (
  incident_id    VARCHAR      NOT NULL PRIMARY KEY
    COMMENT 'Unique incident identifier',
  title          VARCHAR      NOT NULL,
  description    VARCHAR,
  severity       VARCHAR      NOT NULL
    COMMENT 'CRITICAL | HIGH | MEDIUM | LOW',
  status         VARCHAR      NOT NULL
    COMMENT 'ACTIVE | CONTAINED | RESOLVED | CLOSED',
  incident_type  VARCHAR      NOT NULL
    COMMENT 'FIRE | FLOOD | EARTHQUAKE | HAZMAT | COLLISION | STORM | MEDICAL | OTHER',
  location_lat   FLOAT,
  location_lng   FLOAT,
  location_name  VARCHAR,
  reported_at    TIMESTAMP_TZ NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  resolved_at    TIMESTAMP_TZ,
  metadata       VARIANT
    COMMENT 'Flexible JSON for additional incident attributes',
  CONSTRAINT chk_severity
    CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  CONSTRAINT chk_status
    CHECK (status IN ('ACTIVE', 'CONTAINED', 'RESOLVED', 'CLOSED')),
  CONSTRAINT chk_incident_type
    CHECK (incident_type IN ('FIRE', 'FLOOD', 'EARTHQUAKE', 'HAZMAT', 'COLLISION', 'STORN' 'OTHER'))
)
COMMENT = 'Emergency incidents reported and tracked by ECHO';

----------------------------------------------------------------------
-- TABLE: CORE.RESOURCES
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.RESOURCES (
  resource_id    VARCHAR      NOT NULL PRIMARY KEY
    COMMENT 'Unique resource identifier',
  resource_type  VARCHAR      NOT NULL
    COMMENT 'VEHICLE | EQUIPMENT | SUPPLY | PERSONNEL',
  name           VARCHAR      NOT NULL,
  status         VARCHAR      NOT NULL
    COMMENT 'AVAILABLE | DEPLOYED | MAINTENANCE',
  location_lat   FLOAT,
  location_lng   FLOAT,
  capacity       NUMBER,
  metadata       VARIANT
    COMMENT 'Flexible JSON for resource-specific attributes',
  CONSTRAINT chk_resource_status
    CHECK (status IN ('AVAILABLE', 'DEPLOYED', 'MAINTENANCE'))
)
COMMENT = 'Available emergency resources — vehicles, equipment, personnel';

----------------------------------------------------------------------
-- TABLE: CORE.RESOURCE_ALLOCATIONS
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.RESOURCE_ALLOCATIONS (
  allocation_id  VARCHAR      NOT NULL PRIMARY KEY
    COMMENT 'Unique allocation identifier',
  incident_id    VARCHAR      NOT NULL
    COMMENT 'FK to CORE.INCIDENTS',
  resource_id    VARCHAR      NOT NULL
    COMMENT 'FK to CORE.RESOURCES',
  allocated_at   TIMESTAMP_TZ NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  released_at    TIMESTAMP_TZ,
  status         VARCHAR      NOT NULL
    COMMENT 'ACTIVE | RELEASED',
  priority       NUMBER       NOT NULL
    COMMENT 'Allocation priority (1 = highest, 5 = lowest)',
  CONSTRAINT fk_allocation_incident
    FOREIGN KEY (incident_id) REFERENCES CORE.INCIDENTS (incident_id),
  CONSTRAINT fk_allocation_resource
    FOREIGN KEY (resource_id) REFERENCES CORE.RESOURCES (resource_id),
  CONSTRAINT chk_allocation_status
    CHECK (status IN ('ACTIVE', 'RELEASED')),
  CONSTRAINT chk_allocation_priority
    CHECK (priority BETWEEN 1 AND 5)
)
COMMENT = 'Maps resources to incidents — tracks deployment and release';

----------------------------------------------------------------------
-- TABLE: AI.RECOMMENDATIONS
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS AI.RECOMMENDATIONS (
  recommendation_id   VARCHAR      NOT NULL PRIMARY KEY
    COMMENT 'Unique recommendation identifier',
  incident_id         VARCHAR      NOT NULL
    COMMENT 'FK to CORE.INCIDENTS',
  recommendation_type VARCHAR      NOT NULL
    COMMENT 'RESOURCE_DEPLOY | EVACUATE | ESCALATE | CONTAIN',
  content             VARCHAR      NOT NULL
    COMMENT 'Human-readable recommendation text',
  confidence_score    FLOAT
    COMMENT 'Model confidence 0 to 100 (e.g. 97.8)',
  model_version       VARCHAR,
  accepted            BOOLEAN,
  created_at          TIMESTAMP_TZ NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_recommendation_incident
    FOREIGN KEY (incident_id) REFERENCES CORE.INCIDENTS (incident_id),
  CONSTRAINT chk_recommendation_confidence
    CHECK (confidence_score BETWEEN 0 AND 100)
)
COMMENT = 'AI-generated recommendations for incident response';

----------------------------------------------------------------------
-- TABLE: AI.DECISION_LOG
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS AI.DECISION_LOG (
  decision_id    VARCHAR      NOT NULL PRIMARY KEY
    COMMENT 'Unique decision identifier',
  incident_id    VARCHAR      NOT NULL
    COMMENT 'FK to CORE.INCIDENTS',
  decision_type  VARCHAR      NOT NULL,
  decision_made  VARCHAR      NOT NULL,
  reasoning      VARCHAR,
  ai_assisted    BOOLEAN      NOT NULL DEFAULT FALSE
    COMMENT 'Whether AI contributed to this decision',
  decided_at     TIMESTAMP_TZ NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  decided_by     VARCHAR      NOT NULL,
  CONSTRAINT fk_decision_incident
    FOREIGN KEY (incident_id) REFERENCES CORE.INCIDENTS (incident_id)
)
COMMENT = 'Audit log of decisions made during incident response';

----------------------------------------------------------------------
-- TABLE: SIMULATION.RUNS
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS SIMULATION.RUNS (
  run_id            VARCHAR      NOT NULL PRIMARY KEY
    COMMENT 'Unique simulation run identifier',
  incident_id       VARCHAR      NOT NULL
    COMMENT 'FK to CORE.INCIDENTS — the incident being simulated',
  status            VARCHAR      NOT NULL
    COMMENT 'RUNNING | COMPLETED | FAILED',
  scenarios         VARIANT      NOT NULL
    COMMENT 'JSON array of generated response scenarios',
  selected_scenario VARCHAR
    COMMENT 'The scenario chosen by the user or AI',
  confidence_score  FLOAT
    COMMENT 'Overall simulation confidence 0 to 100 (e.g. 97.8)',
  started_at        TIMESTAMP_TZ NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  completed_at      TIMESTAMP_TZ,
  CONSTRAINT fk_run_incident
    FOREIGN KEY (incident_id) REFERENCES CORE.INCIDENTS (incident_id),
  CONSTRAINT chk_run_status
    CHECK (status IN ('RUNNING', 'COMPLETED', 'FAILED')),
  CONSTRAINT chk_run_confidence
    CHECK (confidence_score BETWEEN 0 AND 100)
)
COMMENT = 'Simulation runs for emergency response scenario analysis';

----------------------------------------------------------------------
-- TABLE: CORTEX.DOCUMENTS
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORTEX.DOCUMENTS (
  doc_id         VARCHAR      NOT NULL PRIMARY KEY
    COMMENT 'Unique document identifier',
  doc_type       VARCHAR      NOT NULL
    COMMENT 'SOP | PROTOCOL | HISTORICAL_REPORT',
  title          VARCHAR      NOT NULL,
  content        VARCHAR      NOT NULL
    COMMENT 'Full text content — used for RAG chunking and Cortex Search',
  metadata       VARIANT
    COMMENT 'Flexible JSON for tags, source, version info',
  updated_at     TIMESTAMP_TZ NOT NULL DEFAULT CURRENT_TIMESTAMP()
)
COMMENT = 'Documents for future RAG and Cortex Search integration';

----------------------------------------------------------------------
-- SET SESSION CONTEXT
----------------------------------------------------------------------
USE DATABASE ECHO_DB;
USE SCHEMA CORE;
