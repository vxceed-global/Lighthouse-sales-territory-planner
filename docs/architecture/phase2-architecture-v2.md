# Phase 2: System Architecture Document

**Version**: 2.0  
**Last Updated**: December 2024  
**Status**: Complete Draft for Review  
**Audience**: Architects, Technical Leads, Development Team

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Core Components](#3-core-components)
4. [Data Architecture](#4-data-architecture)
5. [Import Pipeline](#5-import-pipeline)
6. [Planning & Optimization](#6-planning--optimization)
7. [Security & Access Control](#7-security--access-control)
8. [Performance & Scalability](#8-performance--scalability)
9. [Deployment Architecture](#9-deployment-architecture)
10. [Technology Stack](#10-technology-stack)
11. [Cost Estimation Model](#11-cost-estimation-model)
12. [Disaster Recovery & Business Continuity](#12-disaster-recovery--business-continuity)

---

## 1. Executive Summary

This document describes the technical architecture for SRTO Phase 2, designed to handle enterprise-scale route optimization for 500K-3M outlets across 500-10K distributors. The architecture follows these key principles:

### Core Design Decisions
- **Databricks-Centric**: Unity Catalog as single source of truth
- **Pre-computed Snapshots**: Territory data cached for performance (Option A)
- **Serverless First**: AWS Lambda for APIs, Step Functions for orchestration
- **Import-First**: No CRUD operations, only bulk imports with delta updates
- **Channel Separation**: GT and MT planning in separate workspaces
- **Session-Based**: Explicit locking for planning operations

### Scale Requirements
- 500K - 3M outlets
- 500 - 10K distributors  
- 50K outlets per planning session
- <2s API response time
- <5s territory load time
- Support 100 concurrent planners

### Key Architectural Choices

| Decision | Choice | Rationale |
|----------|---------|-----------|
| Data Store | Databricks Unity Catalog | Single source of truth, ACID compliance |
| API Layer | AWS Lambda | Serverless scaling, cost-effective |
| Caching | Pre-computed snapshots | Sub-5s territory loads |
| Frontend | React SPA | Rich interactions, offline capability |
| Maps | Google Maps Platform | Best coverage in target markets |
| Auth | AWS Cognito | Enterprise SSO support |

---

## 2. Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React SPA)                        │
│  ┌─────────────┬─────────────┬─────────────┬────────────────┐  │
│  │   Import    │  GT Planning │ MT Planning │  Admin Panel   │  │
│  │   Wizard    │  Workspace   │  Workspace  │                │  │
│  └─────────────┴─────────────┴─────────────┴────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────┴────────────────────────────────────┐
│                    CloudFront (CDN)                              │
├─────────────────────────────────────────────────────────────────┤
│  Static Assets  │  Territory Snapshots  │  API Cache           │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                    API Gateway                                   │
├─────────────────────────────────────────────────────────────────┤
│  REST API  │  WebSocket (Future)  │  Rate Limiting             │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────┴────────┐ ┌────────┴────────┐ ┌──────┴──────┐
│ Import Pipeline │ │ Planning APIs   │ │ Admin APIs  │
│   (Lambda +     │ │   (Lambda)      │ │  (Lambda)   │
│ Step Functions) │ │                 │ │             │
└────────┬────────┘ └────────┬────────┘ └──────┬──────┘
         │                   │                   │
         └───────────────────┴───────────────────┘
                             │
                    ┌────────┴────────┐
                    │   DynamoDB      │
                    │  (Metadata)     │
                    └────────┬────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                      Databricks Workspace                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Unity Catalog                         │   │
│  │  ┌──────────┬──────────┬──────────┬────────────────┐   │   │
│  │  │ Outlets  │   DTs    │ Routes  │  Territories   │   │   │
│  │  │ (Delta)  │ (Delta)  │ (Delta) │   (Delta)      │   │   │
│  │  └──────────┴──────────┴──────────┴────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Databricks SQL Serverless                   │   │
│  │         (Query Engine for Planning APIs)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Databricks Jobs & Workflows                 │   │
│  │  • Import Processing  • Snapshot Generation              │   │
│  │  • NPPD Computation  • Territory Validation              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   S3 Storage    │
                    │ (Managed by UC) │
                    └─────────────────┘
```

### Logical Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│         React SPA with Redux, Google Maps, Ant Design       │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│     AWS Lambda Functions with Node.js/Python Runtime        │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   Orchestration Layer                        │
│         AWS Step Functions for Complex Workflows             │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│    Databricks Unity Catalog (Source of Truth)               │
│    DynamoDB (Session State)  |  S3 (File Storage)          │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   Processing Layer                           │
│     Databricks Jobs, ML Workflows, Optimization Engine      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Core Components

### 3.1 Frontend Application

**Technology**: React 18 with TypeScript

**Key Features**:
- Single Page Application (SPA)
- Channel-specific workspaces (GT/MT)
- Progressive Web App capabilities
- Offline support for loaded territories

**State Management**:
```typescript
// Redux store structure
{
  auth: { user, token, permissions },
  import: { sessions, schemas, validations },
  territory: { 
    selected: Territory,
    snapshot: TerritorySnapshot,
    lock: LockStatus
  },
  planning: {
    channel: 'GT' | 'MT',
    changes: PlanningChanges,
    optimizationStatus: OptimizationStatus
  },
  ui: { loading, errors, notifications }
}
```

### 3.2 API Gateway & Lambda Functions

**Import Management APIs**:
```yaml
/api/import/schema:
  POST: Create import schema definition
  GET: List saved schemas

/api/import/upload:
  POST: Get presigned URL for file upload
  
/api/import/session:
  POST: Start import session
  GET: Get session status
  
/api/import/validate:
  POST: Validate uploaded files
  
/api/import/process:
  POST: Process validated import
```

**Planning APIs**:
```yaml
/api/territory/list:
  GET: List user's territories with metrics

/api/territory/{id}/snapshot:
  GET: Get pre-computed territory data
  
/api/territory/{id}/lock:
  POST: Acquire planning lock
  DELETE: Release planning lock
  
/api/optimize:
  POST: Trigger route optimization
  GET: Get optimization status
  
/api/planning/save:
  POST: Save planning changes
  
/api/planning/commit:
  POST: Commit changes to Unity Catalog
```

### 3.3 Step Functions Workflows

**Import Workflow**:
```json
{
  "Comment": "Multi-file import with validation",
  "StartAt": "ValidateSchema",
  "States": {
    "ValidateSchema": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:region:account:function:validateSchema",
      "Next": "ProcessFiles"
    },
    "ProcessFiles": {
      "Type": "Map",
      "ItemsPath": "$.files",
      "MaxConcurrency": 5,
      "Iterator": {
        "StartAt": "ValidateFile",
        "States": {
          "ValidateFile": {
            "Type": "Task",
            "Resource": "arn:aws:lambda:region:account:function:validateFile"
          }
        }
      },
      "Next": "MergeData"
    },
    "MergeData": {
      "Type": "Task",
      "Resource": "arn:aws:states:::databricks:job:sync",
      "Parameters": {
        "JobId": "${DatabricksMergeJobId}",
        "JobParameters": {
          "import_session_id": "$.sessionId"
        }
      },
      "Next": "UpdateCatalog"
    }
  }
}
```

### 3.4 Databricks Components

**Unity Catalog Structure**:
```sql
-- Catalog: srto_prod
-- Schema: master_data

CREATE TABLE IF NOT EXISTS outlets (
  outlet_id STRING NOT NULL,
  outlet_name STRING NOT NULL,
  address STRING,
  latitude DOUBLE,
  longitude DOUBLE,
  channel STRING NOT NULL,  -- GT/MT/WS
  tier STRING,              -- Gold/Silver/Bronze
  territory_id STRING,
  dt_code STRING,
  route_id STRING,
  sales_model STRING,       -- PRE_SALES/VAN_SALES
  fulfillment_type STRING,  -- DT/DSD
  merchandising_required BOOLEAN,
  audit_frequency STRING,
  sales_volume DOUBLE,
  nppd_score DOUBLE,
  new_outlet_flag BOOLEAN,
  created_date DATE,
  modified_date DATE
) 
USING DELTA
PARTITIONED BY (territory_id)
TBLPROPERTIES (
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact' = 'true'
);

-- Similar tables for distributors, routes, territories
```

**Snapshot Generation Job**:
```python
# generate_territory_snapshots.py
def generate_snapshot(territory_id: str):
    """Generate pre-computed JSON snapshot for territory"""
    
    # Query all data for territory
    outlets_df = spark.sql(f"""
        SELECT * FROM srto_prod.master_data.outlets 
        WHERE territory_id = '{territory_id}'
        AND channel IN ('GT', 'MT')
    """)
    
    routes_df = spark.sql(f"""
        SELECT r.*, s.salesperson_name, s.working_hours
        FROM srto_prod.master_data.routes r
        JOIN srto_prod.master_data.salespeople s
        ON r.salesperson_id = s.salesperson_id
        WHERE r.territory_id = '{territory_id}'
    """)
    
    # Create snapshot structure
    snapshot = {
        "territory_id": territory_id,
        "generated_at": datetime.now().isoformat(),
        "metrics": calculate_metrics(outlets_df, routes_df),
        "outlets": outlets_df.toPandas().to_dict('records'),
        "routes": routes_df.toPandas().to_dict('records'),
        "distributors": get_distributors(territory_id),
        "optimization_params": get_saved_params(territory_id)
    }
    
    # Write to S3
    s3_path = f"s3://srto-snapshots/territories/{territory_id}/snapshot.json.gz"
    write_compressed_json(snapshot, s3_path)
    
    # Update CDN
    invalidate_cloudfront_cache(f"/territories/{territory_id}/*")
```

---

## 4. Data Architecture

### 4.1 Data Storage Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Hot Storage (DynamoDB)                    │
│  • Active sessions  • Locks  • User state  • Import jobs    │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                 Warm Storage (S3 + CloudFront)              │
│  • Territory snapshots  • Import staging  • Exports         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│              Cold Storage (Unity Catalog/Delta)             │
│  • Master data  • Historical data  • Audit logs            │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Data Flow

**Import Flow**:
```
User Upload → S3 Staging → Validation → Databricks Processing 
→ Unity Catalog → Snapshot Generation → CloudFront CDN
```

**Planning Flow**:
```
Territory Selection → Load Snapshot from CDN → Local State (Redux)
→ Optimization API → Manual Adjustments → Save to DynamoDB 
→ Commit to Unity Catalog
```

### 4.3 DynamoDB Schema

**Planning Sessions Table**:
```typescript
{
  PK: "SESSION#${sessionId}",
  SK: "METADATA",
  territoryId: string,
  userId: string,
  channel: "GT" | "MT",
  lockAcquiredAt: string,
  status: "ACTIVE" | "SAVING" | "COMMITTED",
  changes: {
    outlets: OutletChange[],
    routes: RouteChange[],
    metrics: MetricsChange
  },
  version: number,
  TTL: number  // Auto-cleanup after 24 hours
}
```

**Import Jobs Table**:
```typescript
{
  PK: "IMPORT#${jobId}",
  SK: "STATUS",
  userId: string,
  schemaId: string,
  files: ImportFile[],
  status: "UPLOADING" | "VALIDATING" | "PROCESSING" | "COMPLETED" | "FAILED",
  progress: number,
  results: {
    totalRecords: number,
    successCount: number,
    errorCount: number,
    warnings: ValidationWarning[]
  },
  createdAt: string,
  completedAt?: string
}
```

### 4.4 S3 Bucket Structure

```
srto-prod/
├── imports/
│   ├── staging/
│   │   └── {session_id}/
│   │       ├── outlets.csv
│   │       └── dt_mapping.csv
│   └── processed/
│       └── {date}/
│           └── {session_id}/
├── snapshots/
│   └── territories/
│       └── {territory_id}/
│           ├── snapshot.json.gz
│           └── metadata.json
├── exports/
│   └── {user_id}/
│       └── {date}/
│           └── journey_plans.xlsx
└── audit/
    └── {year}/
        └── {month}/
            └── {day}/
                └── audit_logs.parquet
```

---

## 5. Import Pipeline

### 5.1 Import Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Import Wizard (Frontend)                   │
│  1. Schema Definition  2. File Upload  3. Field Mapping     │
│  4. Validation Preview  5. Process Confirmation             │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                  Import Orchestration                        │
│                   (Step Functions)                           │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │Validate │→│Transform│→│  Merge  │→│ Update  │           │
│ │ Schema  │ │  Data   │ │  Delta  │ │Snapshot │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Schema Management

```typescript
interface ImportSchema {
  schemaId: string;
  schemaName: string;
  version: string;
  entities: {
    [entityName: string]: {
      primaryKey: string;
      requiredFields: string[];
      fieldMappings: FieldMapping[];
      validations: ValidationRule[];
    }
  };
  relationships: Relationship[];
  deltaStrategy: "UPSERT" | "MERGE" | "APPEND";
}

interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: "UPPER" | "LOWER" | "DATE_FORMAT" | "LOOKUP";
  lookupTable?: string;
  defaultValue?: any;
}
```

### 5.3 Validation Pipeline

```python
# Databricks validation job
def validate_import_data(session_id: str):
    """Multi-stage validation pipeline"""
    
    # Stage 1: Schema validation
    schema_errors = validate_schema_compliance(session_id)
    if schema_errors:
        return {"status": "FAILED", "errors": schema_errors}
    
    # Stage 2: Data quality validation
    quality_issues = []
    
    # Check required fields
    quality_issues.extend(check_required_fields(session_id))
    
    # Validate coordinates
    quality_issues.extend(validate_coordinates(session_id))
    
    # Check referential integrity
    quality_issues.extend(check_references(session_id))
    
    # Stage 3: Business rule validation
    business_issues = []
    
    # Territory assignment validation
    business_issues.extend(validate_territory_assignments(session_id))
    
    # Channel consistency
    business_issues.extend(validate_channel_rules(session_id))
    
    return {
        "status": "VALIDATED",
        "summary": {
            "total_records": count_records(session_id),
            "valid_records": count_valid_records(session_id),
            "errors": len([i for i in quality_issues if i.severity == "ERROR"]),
            "warnings": len([i for i in quality_issues if i.severity == "WARNING"])
        },
        "issues": quality_issues + business_issues
    }
```

---

## 6. Planning & Optimization

### 6.1 Planning Session Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Territory Selection                         │
│              (Check locks, load metrics)                     │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Acquire Lock                              │
│            (DynamoDB conditional write)                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                Load Territory Snapshot                       │
│              (CloudFront → Redux Store)                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Planning Operations                         │
│     (Optimization, Manual Adjustments, Validation)          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   Save Progress                              │
│              (DynamoDB versioned saves)                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                 Commit to Unity Catalog                      │
│            (Databricks job, release lock)                    │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Optimization Integration

**Optimization Request**:
```typescript
interface OptimizationRequest {
  sessionId: string;
  territoryId: string;
  channel: "GT" | "MT";
  parameters: {
    dateRange: DateRange;
    constraints: {
      maxOutletsPerRoute: number;
      maxRouteTime: number;
      vehicleType: string;
      workingHours: TimeWindow;
    };
    objectives: {
      minimizeTravelTime: number;
      maximizeCoverage: number;
      balanceWorkload: number;
    };
    includeNPPD: boolean;
  };
  excludedOutlets: string[];  // No coords/analytics
}
```

**Optimization Lambda**:
```python
def optimize_routes(event, context):
    """Trigger optimization via Google OR-Tools"""
    
    request = OptimizationRequest(**event)
    
    # Load territory data from snapshot
    territory_data = load_territory_snapshot(request.territory_id)
    
    # Filter optimizable outlets
    optimizable_outlets = [
        o for o in territory_data.outlets
        if o.latitude and o.longitude and o.outlet_id not in request.excluded_outlets
    ]
    
    # Prepare optimization input
    optimization_input = {
        "outlets": optimizable_outlets,
        "depot_locations": get_depot_locations(territory_data),
        "distance_matrix": compute_distance_matrix(optimizable_outlets),
        "time_windows": extract_time_windows(request.channel),
        "vehicle_capacities": get_vehicle_capacities(request.parameters),
        "service_times": get_service_times(optimizable_outlets)
    }
    
    # Call optimization engine
    optimization_job_id = trigger_optimization_job(optimization_input)
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "jobId": optimization_job_id,
            "optimizableOutlets": len(optimizable_outlets),
            "excludedOutlets": len(request.excluded_outlets),
            "estimatedTime": estimate_optimization_time(len(optimizable_outlets))
        })
    }
```

### 6.3 Session State Management

```typescript
// Frontend session state
class PlanningSession {
  private changes: Map<string, Change>;
  private originalSnapshot: TerritorySnapshot;
  
  constructor(snapshot: TerritorySnapshot) {
    this.originalSnapshot = snapshot;
    this.changes = new Map();
  }
  
  // Track outlet reassignment
  reassignOutlet(outletId: string, newRouteId: string) {
    const change: OutletReassignment = {
      type: 'OUTLET_REASSIGNMENT',
      outletId,
      oldRouteId: this.getOriginalRoute(outletId),
      newRouteId,
      timestamp: new Date().toISOString()
    };
    
    this.changes.set(`outlet_${outletId}`, change);
    this.recalculateMetrics();
  }
  
  // Get current state with changes applied
  getCurrentState(): TerritorySnapshot {
    const current = cloneDeep(this.originalSnapshot);
    
    // Apply changes
    this.changes.forEach(change => {
      applyChange(current, change);
    });
    
    return current;
  }
  
  // Save progress to backend
  async saveProgress(notes?: string) {
    const saveRequest = {
      sessionId: this.sessionId,
      changes: Array.from(this.changes.values()),
      metrics: this.currentMetrics,
      notes
    };
    
    await api.saveSessionProgress(saveRequest);
  }
}
```

---

## 7. Security & Access Control

### 7.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Login (Cognito)                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Get User Permissions                        │
│              (Territory assignments, Role)                   │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Generate JWT Token                          │
│         (Contains userId, role, territories)                 │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                API Gateway Authorizer                        │
│           (Validates token on each request)                 │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Authorization Model

```typescript
interface UserContext {
  userId: string;
  role: "ADMIN" | "GT_PLANNER" | "MT_PLANNER" | "DT_USER";
  assignments: {
    territoryId: string;
    level: "COUNTRY" | "ZONE" | "REGION" | "AREA" | "DT";
    permissions: Permission[];
  }[];
}

enum Permission {
  VIEW_TERRITORY = "VIEW_TERRITORY",
  PLAN_GT_ROUTES = "PLAN_GT_ROUTES",
  PLAN_MT_ROUTES = "PLAN_MT_ROUTES",
  OPTIMIZE_ROUTES = "OPTIMIZE_ROUTES",
  OVERRIDE_CHANGES = "OVERRIDE_CHANGES",
  IMPORT_DATA = "IMPORT_DATA",
  MANAGE_USERS = "MANAGE_USERS"
}
```

### 7.3 API Authorization

```python
def authorize_territory_access(user_context: dict, territory_id: str, action: str):
    """Check if user can perform action on territory"""
    
    # Admins have full access
    if user_context['role'] == 'ADMIN':
        return True
    
    # Check territory assignment
    for assignment in user_context['assignments']:
        if assignment['territory_id'] == territory_id:
            return action in assignment['permissions']
    
    # Check hierarchical access (e.g., Region planner can access Areas)
    if can_access_child_territory(user_context, territory_id):
        return action in get_inherited_permissions(user_context)
    
    return False
```

### 7.4 Audit Trail

```typescript
interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  sessionId?: string;
  action: AuditAction;
  resourceType: "OUTLET" | "ROUTE" | "TERRITORY" | "IMPORT";
  resourceId: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata: {
    ipAddress: string;
    userAgent: string;
    channel?: "GT" | "MT";
    reason?: string;  // For overrides
  };
}

// Audit Lambda
async function logAuditEntry(entry: AuditEntry) {
  // Write to DynamoDB for recent access
  await dynamodb.putItem({
    TableName: 'AuditTrail',
    Item: {
      ...entry,
      TTL: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60) // 90 days
    }
  });
  
  // Write to S3 for long-term storage
  await s3.putObject({
    Bucket: 'srto-audit-logs',
    Key: `${entry.timestamp.substring(0,10)}/${entry.id}.json`,
    Body: JSON.stringify(entry)
  });
}
```

---

## 8. Performance & Scalability

### 8.1 Performance Targets

| Operation | Target | Strategy |
|-----------|---------|----------|
| Territory Load | <5s | Pre-computed snapshots + CDN |
| API Response | <2s | Lambda warmed, DynamoDB indexes |
| Route Optimization | <2min | Distributed processing |
| Import 1M records | <30min | Parallel processing in Databricks |
| Map Render 10K outlets | <3s | Clustering + viewport culling |

### 8.2 Caching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Cache                             │
│         Territory data, User preferences                     │
│                    TTL: 1 hour                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  CloudFront CDN                              │
│     Territory snapshots, Static assets                       │
│                    TTL: 24 hours                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                Application Cache (Lambda)                    │
│        Frequently accessed metadata                          │
│                    TTL: 5 minutes                           │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Scalability Patterns

**Lambda Concurrency**:
```yaml
# serverless.yml
functions:
  queryTerritories:
    handler: handlers/territories.query
    reservedConcurrency: 50  # Guaranteed capacity
    
  importProcessor:
    handler: handlers/import.process
    reservedConcurrency: 10  # Limit parallel imports
    
  optimizeRoutes:
    handler: handlers/optimize.trigger
    timeout: 300  # 5 minutes for large territories
```

**DynamoDB Auto-scaling**:
```typescript
{
  TableName: 'PlanningSessions',
  BillingMode: 'PAY_PER_REQUEST',  // Auto-scales
  GlobalSecondaryIndexes: [{
    IndexName: 'UserIndex',
    PartitionKey: 'userId',
    SortKey: 'timestamp'
  }]
}
```

**Databricks Cluster Configuration**:
```python
# Cluster config for import jobs
cluster_config = {
    "spark_version": "11.3.x-scala2.12",
    "node_type_id": "i3.xlarge",
    "num_workers": {
        "min": 2,
        "max": 8  # Auto-scale based on load
    },
    "autotermination_minutes": 30,
    "spark_conf": {
        "spark.sql.adaptive.enabled": "true",
        "spark.sql.adaptive.coalescePartitions.enabled": "true"
    }
}
```

### 8.4 Load Handling Strategies

**Territory Snapshot Optimization**:
```python
def optimize_snapshot_size(territory_data):
    """Reduce snapshot size for faster loading"""
    
    # 1. Remove unnecessary fields
    essential_fields = ['outlet_id', 'name', 'lat', 'lng', 'channel', 'tier']
    
    # 2. Compress coordinate precision
    for outlet in territory_data['outlets']:
        outlet['lat'] = round(outlet['lat'], 5)  # ~1.1m precision
        outlet['lng'] = round(outlet['lng'], 5)
    
    # 3. Use compact JSON format
    return json.dumps(territory_data, separators=(',', ':'))
```

**Map Performance**:
```typescript
// Progressive outlet loading based on zoom
const loadOutletsByZoom = (map: google.maps.Map) => {
  const zoom = map.getZoom();
  const bounds = map.getBounds();
  
  if (zoom < 12) {
    // Show only clusters
    return loadOutletClusters(bounds);
  } else if (zoom < 15) {
    // Show tier-based filtering
    return loadOutletsByTier(bounds, ['Gold', 'Silver']);
  } else {
    // Show all outlets in viewport
    return loadAllOutlets(bounds);
  }
};
```

---

## 9. Deployment Architecture

### 9.1 Environment Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       Production                             │
│  • AWS Account: srto-prod                                   │
│  • Databricks: prod-workspace                               │
│  • Domain: app.srto.com                                    │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                        Staging                               │
│  • AWS Account: srto-staging                                │
│  • Databricks: staging-workspace                            │
│  • Domain: staging.srto.com                                │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      Development                             │
│  • AWS Account: srto-dev                                    │
│  • Databricks: dev-workspace                                │
│  • Domain: dev.srto.com                                    │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy SRTO

on:
  push:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          npm test
          python -m pytest backend/tests
          
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build React app
        run: npm run build
        
      - name: Deploy to S3
        run: |
          aws s3 sync build/ s3://$BUCKET_NAME
          aws cloudfront create-invalidation --distribution-id $CF_DIST_ID
          
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Lambda functions
        run: |
          serverless deploy --stage $STAGE
          
      - name: Deploy Step Functions
        run: |
          aws stepfunctions update-state-machine
          
      - name: Update Databricks jobs
        run: |
          databricks jobs update --job-id $JOB_ID
```

### 9.3 Infrastructure as Code

```typescript
// CDK stack definition
export class SrtoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    // S3 Buckets
    const importBucket = new Bucket(this, 'ImportBucket', {
      bucketName: `srto-imports-${props.env.account}`,
      lifecycle: [{
        id: 'DeleteOldImports',
        expiration: Duration.days(30)
      }]
    });
    
    // DynamoDB Tables
    const sessionTable = new Table(this, 'SessionTable', {
      tableName: 'PlanningSessions',
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      timeToLiveAttribute: 'TTL'
    });
    
    // Lambda Functions
    const apiLambda = new Function(this, 'ApiLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      environment: {
        SESSION_TABLE: sessionTable.tableName,
        DATABRICKS_HOST: props.databricksHost
      }
    });
    
    // API Gateway
    const api = new RestApi(this, 'SrtoApi', {
      domainName: {
        domainName: props.apiDomain,
        certificate: props.certificate
      }
    });
  }
}
```

---

## 10. Technology Stack

### 10.1 Frontend Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | React | 18.x | UI framework |
| Language | TypeScript | 5.x | Type safety |
| State | Redux Toolkit | 2.x | State management |
| Maps | Google Maps | Latest | Map visualization |
| UI Library | Ant Design | 5.x | Component library |
| Build | Vite | 4.x | Fast bundling |
| Testing | Vitest | Latest | Unit testing |

### 10.2 Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Runtime | Node.js | 18.x | Lambda runtime |
| Language | TypeScript/Python | Latest | API/Processing |
| Framework | Express/FastAPI | Latest | API framework |
| Database | DynamoDB | Managed | Session state |
| Storage | S3 | Managed | File storage |
| Analytics | Databricks | 11.x | Data processing |
| Orchestration | Step Functions | Managed | Workflows |

### 10.3 Infrastructure & DevOps

| Component | Technology | Purpose |
|-----------|------------|---------|
| IaC | AWS CDK | Infrastructure as code |
| CI/CD | GitHub Actions | Automated deployment |
| Monitoring | CloudWatch | Logs and metrics |
| CDN | CloudFront | Global content delivery |
| Auth | Cognito | User authentication |
| Secrets | AWS Secrets Manager | Credential management |

### 10.4 Data & Analytics

| Component | Technology | Purpose |
|-----------|------------|---------|
| Data Lake | Unity Catalog | Data governance |
| Processing | Spark SQL | Data transformation |
| ML Platform | MLflow | Model management |
| Optimization | Google OR-Tools | Route optimization |
| File Format | Delta Lake | ACID transactions |

---

## 11. Cost Estimation Model

### 11.1 AWS Services Cost Breakdown

**Monthly Cost Estimates (USD)**

| Service | Usage | Cost | Notes |
|---------|-------|------|-------|
| **Lambda** | | | |
| API Calls | 10M requests/month | $20 | @ $0.20 per 1M requests |
| Compute | 5M GB-seconds | $83 | @ $0.0000166667 per GB-second |
| **DynamoDB** | | | |
| On-Demand | 5M read, 2M write | $75 | @ $0.25/$1.25 per million |
| Storage | 10 GB | $2.50 | @ $0.25 per GB |
| **S3** | | | |
| Storage | 500 GB | $11.50 | @ $0.023 per GB |
| Requests | 10M GET, 1M PUT | $45 | GET: $0.0004, PUT: $0.005 |
| **CloudFront** | | | |
| Data Transfer | 1 TB | $85 | @ $0.085 per GB |
| Requests | 50M | $10 | @ $0.0075 per 10K |
| **Cognito** | | | |
| MAU | 500 users | $275 | First 50K MAU free, then $0.0055 |
| **API Gateway** | | | |
| REST API | 10M calls | $35 | @ $3.50 per million |
| **Step Functions** | | | |
| State Transitions | 1M | $25 | @ $0.025 per 1K |
| **Total AWS** | | **$667** | |

### 11.2 Databricks Cost Breakdown

| Component | Usage | DBU/month | Cost | Notes |
|-----------|-------|-----------|------|-------|
| **SQL Serverless** | | | | |
| Query Processing | 1000 hrs | 1000 | $550 | @ $0.55 per DBU |
| **Jobs Compute** | | | | |
| Import Processing | 100 hrs | 400 | $220 | 4 DBU/hr @ $0.55 |
| Snapshot Generation | 200 hrs | 800 | $440 | 4 DBU/hr @ $0.55 |
| **Unity Catalog** | | | | |
| Storage | 1 TB | - | $23 | S3 standard storage |
| **Total Databricks** | | | **$1,233** | |

### 11.3 Third-Party Services

| Service | Usage | Cost | Notes |
|---------|-------|------|-------|
| Google Maps | 50K loads | $350 | @ $7 per 1K loads |
| Google Distance Matrix | 100K elements | $500 | @ $5 per 1K |
| Google Geocoding | 10K requests | $50 | @ $5 per 1K |
| **Total Third-Party** | | **$900** | |

### 11.4 Total Monthly Cost

| Category | Cost |
|----------|------|
| AWS Services | $667 |
| Databricks | $1,233 |
| Third-Party | $900 |
| **Total** | **$2,800** |

### 11.5 Cost Optimization Strategies

1. **Reserved Capacity**
   - Lambda: Save 17% with Compute Savings Plans
   - DynamoDB: Save 50% with reserved capacity
   - Databricks: Commit to annual DBUs for 30% discount

2. **Caching Optimization**
   - Increase CloudFront cache TTL
   - Implement browser caching
   - Pre-compute common queries

3. **Data Lifecycle**
   - Move old imports to Glacier
   - Compress snapshots
   - Delete unused exports

4. **Usage Optimization**
   - Batch API calls
   - Optimize Lambda memory allocation
   - Use spot instances for Databricks jobs

### 11.6 Scale Cost Projections

| Users | Outlets | Monthly Cost |
|-------|---------|--------------|
| 100 | 500K | $2,800 |
| 500 | 1M | $8,500 |
| 1000 | 2M | $15,000 |
| 2000 | 3M | $25,000 |

---

## 12. Disaster Recovery & Business Continuity

### 12.1 RTO/RPO Targets

| Component | RTO | RPO | Strategy |
|-----------|-----|-----|----------|
| Planning Sessions | 4 hrs | 1 hr | Multi-region DynamoDB |
| Territory Data | 2 hrs | 24 hrs | S3 cross-region replication |
| Import Jobs | 8 hrs | 0 | Can be restarted |
| User Data | 4 hrs | 1 hr | Cognito backup |

### 12.2 Backup Strategy

```yaml
Backup Schedule:
  DynamoDB:
    - Continuous backups enabled
    - Point-in-time recovery: 35 days
    
  Unity Catalog:
    - Daily Delta table snapshots
    - 30-day retention
    - Cross-region replication
    
  S3:
    - Versioning enabled
    - Cross-region replication
    - Lifecycle policies for archival
    
  Application Config:
    - Git repository
    - Infrastructure as Code
    - Secrets in AWS Secrets Manager
```

### 12.3 Failure Scenarios

**Region Failure**:
```
Primary Region Down:
1. CloudFront serves cached content
2. Route53 health check detects failure
3. Failover to secondary region
4. DynamoDB global tables ensure data availability
5. Lambda@Edge handles critical functions
```

**Databricks Failure**:
```
Databricks Workspace Down:
1. Planning continues with cached snapshots
2. New imports queued in S3
3. Optimization falls back to simple algorithm
4. Alert sent to ops team
5. Manual failover to DR workspace if > 2 hours
```

### 12.4 Recovery Procedures

1. **Planning Session Recovery**
   ```python
   def recover_planning_session(session_id):
       # Check primary region
       session = dynamodb_primary.get_item(Key={'PK': f'SESSION#{session_id}'})
       
       if not session:
           # Failover to secondary
           session = dynamodb_secondary.get_item(Key={'PK': f'SESSION#{session_id}'})
           
       if session:
           # Restore to primary if needed
           restore_session_to_primary(session)
           
       return session
   ```

2. **Import Job Recovery**
   ```python
   def recover_import_job(job_id):
       # Check job status
       job = get_import_job_status(job_id)
       
       if job['status'] == 'PROCESSING':
           # Check if Databricks job is still running
           if not is_databricks_job_running(job['databricks_job_id']):
               # Restart from last checkpoint
               restart_import_from_checkpoint(job_id)
   ```

---

## Appendix A: API Examples

### Import API Request/Response
```typescript
// POST /api/import/session
Request: {
  schemaId: "schema_001",
  files: [
    { fileName: "outlets.csv", fileSize: 125000000 },
    { fileName: "dt_mapping.csv", fileSize: 5000000 }
  ]
}

Response: {
  sessionId: "imp_20240115_001",
  uploadUrls: {
    "outlets.csv": "https://s3.presigned.url...",
    "dt_mapping.csv": "https://s3.presigned.url..."
  },
  expiresIn: 3600
}
```

### Planning API Request/Response
```typescript
// POST /api/territory/lock
Request: {
  territoryId: "AREA-DEL-01",
  channel: "GT"
}

Response: {
  lockId: "lock_123",
  status: "ACQUIRED",
  expiresAt: "2024-01-15T14:00:00Z",
  existingLocks: []
}
```

---

## Appendix B: Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| ERR_AUTH_001 | Invalid authentication token | 401 |
| ERR_AUTH_002 | Insufficient permissions | 403 |
| ERR_LOCK_001 | Territory already locked | 409 |
| ERR_LOCK_002 | Lock expired | 410 |
| ERR_IMPORT_001 | Invalid file format | 400 |
| ERR_IMPORT_002 | Schema validation failed | 400 |
| ERR_IMPORT_003 | Import job failed | 500 |
| ERR_OPT_001 | Optimization failed | 500 |
| ERR_OPT_002 | Too many outlets for optimization | 400 |
| ERR_DATA_001 | Territory not found | 404 |
| ERR_DATA_002 | Snapshot generation failed | 500 |
| ERR_SESSION_001 | Session expired | 410 |
| ERR_SESSION_002 | Session conflict | 409 |

---

## Appendix C: Monitoring & Alerting

### Key Metrics to Monitor

```yaml
CloudWatch Alarms:
  API:
    - Latency > 2 seconds
    - Error rate > 1%
    - Throttling > 0
    
  Lambda:
    - Concurrent executions > 80%
    - Duration > timeout - 10s
    - Memory usage > 90%
    
  DynamoDB:
    - User errors > 0
    - System errors > 0
    - Throttled requests > 0
    
  Databricks:
    - Job failure rate > 5%
    - Cluster startup time > 5 min
    - Query timeout rate > 1%
    
  Business:
    - Import success rate < 95%
    - Territory load time > 5s
    - Active sessions > capacity
```

### Dashboard Configuration

```json
{
  "name": "SRTO Operations Dashboard",
  "widgets": [
    {
      "type": "metric",
      "title": "API Response Time",
      "metric": "AWS/Lambda/Duration",
      "stat": "p99"
    },
    {
      "type": "metric", 
      "title": "Active Planning Sessions",
      "metric": "Custom/SRTO/ActiveSessions"
    },
    {
      "type": "log",
      "title": "Recent Errors",
      "query": "fields @timestamp, @message | filter @message like /ERROR/"
    }
  ]
}
```

---

**Document Status**: Complete Draft for Review  
**Version**: 2.0  
**Changes from v1.0**:
- Added detailed cost estimation model (Section 11)
- Added disaster recovery planning (Section 12)
- Enhanced S3 bucket structure details
- Added error code appendix
- Added monitoring configuration
- Expanded scalability patterns

**Next Steps**: 
1. Review with architecture team
2. Validate cost estimates with finance
3. Security review with InfoSec team
4. Performance testing of key assumptions