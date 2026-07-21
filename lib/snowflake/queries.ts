export const incidentQueries = {
  getAll: `
    SELECT
      incident_id,
      title,
      description,
      severity,
      status,
      incident_type,
      location_lat,
      location_lng,
      location_name,
      reported_at,
      resolved_at,
      metadata
    FROM ECHO_DB.CORE.INCIDENTS
    ORDER BY reported_at DESC
  `,

  getById: `
    SELECT
      incident_id,
      title,
      description,
      severity,
      status,
      incident_type,
      location_lat,
      location_lng,
      location_name,
      reported_at,
      resolved_at,
      metadata
    FROM ECHO_DB.CORE.INCIDENTS
    WHERE incident_id = ?
    LIMIT 1
  `,
} as const;

export const intelligenceQueries = {
  recommendation: `
    SELECT
      recommendation_id,
      recommendation_type,
      content,
      confidence_score,
      model_version,
      accepted,
      created_at
    FROM ECHO_DB.AI.RECOMMENDATIONS
    WHERE incident_id = ?
    ORDER BY created_at DESC
    LIMIT 1
  `,

  decision: `
    SELECT
      decision_id,
      decision_type,
      decision_made,
      reasoning,
      ai_assisted,
      decided_at,
      decided_by
    FROM ECHO_DB.AI.DECISION_LOG
    WHERE incident_id = ?
    ORDER BY decided_at DESC
    LIMIT 1
  `,

  resources: `
    SELECT
      r.resource_id,
      r.resource_type,
      r.name,
      r.status,
      r.capacity,
      r.metadata,
      a.priority,
      a.allocated_at
    FROM ECHO_DB.CORE.RESOURCE_ALLOCATIONS a
    INNER JOIN ECHO_DB.CORE.RESOURCES r
      ON r.resource_id = a.resource_id
    WHERE a.incident_id = ?
      AND a.status = 'ACTIVE'
    ORDER BY a.priority ASC, a.allocated_at ASC
  `,

  simulation: `
    SELECT
      run_id,
      status,
      scenarios,
      selected_scenario,
      confidence_score,
      started_at,
      completed_at
    FROM ECHO_DB.SIMULATION.RUNS
    WHERE incident_id = ?
    ORDER BY started_at DESC
    LIMIT 1
  `,
} as const;