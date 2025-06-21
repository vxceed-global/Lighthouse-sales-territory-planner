# Phase 2: User Stories & Personas

**Version**: 2.2  
**Last Updated**: December 2024  
**Status**: Updated with Journey Plan & Calendar Stories  
**Audience**: Product Owners, Architects, Development Team

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [User Personas](#2-user-personas)
3. [Epic Overview](#3-epic-overview)
4. [Detailed User Stories](#4-detailed-user-stories)
5. [Permission Matrix](#5-permission-matrix)
6. [Edge Cases & Error Scenarios](#6-edge-cases--error-scenarios)
7. [Acceptance Criteria Summary](#7-acceptance-criteria-summary)

---

## 1. Executive Summary

This document defines the user stories for SRTO Phase 2, focusing on data import, territory-based planning, route optimization, and journey plan generation for pre-sales activities. The system serves distinct user personas for General Trade (GT) and Modern Trade (MT) channels, handling 500K-3M outlets across 500-10K distributors.

### Key Principles
- **Import-First**: Master data comes from external systems (ERP/DMS) with "define once, update many" approach
- **Channel-Specific Planning**: Separate workflows for GT and MT optimization
- **Territory-Based**: All planning happens within defined territory boundaries
- **Pattern-Based Journey Plans**: Convert optimized routes to easy-to-understand visit patterns
- **Calendar-Aware**: Respect sales calendars and holiday schedules
- **Role-Based Access**: Users can only access their assigned territories and channels
- **Audit Everything**: All changes are tracked with user and reason
- **Data Quality Aware**: System handles missing/incomplete data gracefully

### Phase 2 Scope
- **Channels**: Both GT and MT
- **Sales Role**: Pre-sales only (van sales and merchandising deferred)
- **Import**: Schema definition with delta updates
- **Planning**: Territory-based with channel-specific constraints
- **Journey Plans**: Pattern-based with calendar integration

---

## 2. User Personas

### 2.1 GT Planning Manager (Rajesh)

**Profile**:
- General Trade Planning Manager
- Manages 10-15 Areas with 500-1000 DTs
- Plans pre-sales routes for GT channel
- Reports to National Sales Manager

**Goals**:
- Optimize pre-sales routes for maximum outlet coverage
- Balance workload across GT sales reps
- Ensure service level compliance for different outlet tiers
- Manage distributor territories efficiently
- Generate clear journey plans for field execution

**Pain Points**:
- Complex DT boundaries and overlaps
- High outlet density in urban areas
- Varying outlet service requirements
- Coordination with multiple distributors
- Manual journey plan creation takes days

**Technical Proficiency**: Medium - comfortable with business software but not technical tools

---

### 2.2 MT Planning Manager (Priya)

**Profile**:
- Modern Trade Planning Manager  
- Manages routes across 200-300 MT outlets
- Plans for company-employed sales officers
- Cross-DT and direct distribution planning

**Goals**:
- Optimize routes across MT chains
- Manage appointment windows and store timings
- Coordinate with category managers
- Plan for both DT-served and DSD outlets
- Ensure visit patterns match chain requirements

**Pain Points**:
- MT outlets span multiple DT territories
- Complex appointment scheduling
- Different service levels by chain
- Coordination with merchandising teams
- Holiday impacts on store operations

**Technical Proficiency**: Medium to High - uses various retail systems

---

### 2.3 Territory Planner (Rashmi)

**Profile**:
- Regional Sales Planning Manager
- Manages 5-10 Areas with 200-500 DTs
- Plans monthly route optimization cycles
- Reports to Zonal Sales Head

**Goals**:
- Optimize routes across all DTs in territory for maximum efficiency
- Ensure balanced workload among salespeople
- Meet coverage targets for all outlet tiers
- Respond to business changes (new outlets, DT changes)
- Align journey plans with sales calendar

**Pain Points**:
- Manual planning takes 3-5 days per cycle
- Difficult to visualize and compare route options
- Changes by DTs can disrupt optimized plans
- No clear audit trail for compliance
- Holiday calendar management is complex

**Technical Proficiency**: Medium - comfortable with business software but not technical tools

---

### 2.4 Distributor User (Ajay)

**Profile**:
- Distributor Owner/Manager
- Manages 1 DT with 5-15 sales routes
- 500-2000 outlets in coverage area
- Direct P&L responsibility

**Goals**:
- Optimize routes for his salespeople
- Quickly assign new outlets to routes
- Adjust plans based on ground reality
- Maximize sales with available resources
- Follow company-defined journey patterns

**Pain Points**:
- Corporate plans don't reflect ground reality
- New outlets need immediate assignment
- No tools for quick route adjustments
- Can't see impact of changes immediately
- Local holidays not always considered

**Technical Proficiency**: Low to Medium - primarily uses mobile apps and basic web tools

---

### 2.5 System Administrator (Vikram)

**Profile**:
- IT Administrator for Sales Operations
- Manages system configuration and access
- Handles data imports and quality
- Supports 50-100 users

**Goals**:
- Ensure smooth data imports from multiple sources
- Maintain data quality and consistency
- Manage user access and permissions
- Monitor system performance
- Configure calendars and holidays

**Pain Points**:
- Multiple data formats from different sources
- Handling large file imports
- Managing territory hierarchy changes
- Troubleshooting failed imports
- Complex calendar configurations

**Technical Proficiency**: High - comfortable with technical tools and data management

---

### 2.6 Data Analyst (Meera)

**Profile**:
- Sales Analytics Team Member
- Prepares data for import
- Monitors optimization metrics
- Creates performance reports

**Goals**:
- Ensure accurate data for optimization
- Track optimization effectiveness
- Identify data quality issues
- Generate insights from route performance
- Monitor journey plan compliance

**Pain Points**:
- Inconsistent data formats
- Missing or incorrect coordinates
- No visibility into import status
- Difficulty tracking changes over time
- Complex calendar variations by region

**Technical Proficiency**: High - expert in Excel, SQL, and data tools

---

### 2.7 Sales Operations Manager (Suresh)

**Profile**:
- National Sales Operations Head
- Oversees journey plan approval process
- Manages sales calendar configuration
- Reports to Sales Director

**Goals**:
- Standardize journey planning across regions
- Ensure optimal coverage nationwide
- Manage sales period transitions smoothly
- Track plan vs actual execution
- Handle special events and promotions

**Pain Points**:
- Inconsistent planning approaches by region
- Difficulty in tracking plan changes
- Complex approval workflows
- Festival impacts vary by region
- No unified view of nationwide coverage

**Technical Proficiency**: Medium - focuses on reports and dashboards

---

### 2.8 Future Personas (Documented for Reference)

#### Merchandising Manager (Phase 3)
- Plans merchandiser routes post-delivery
- Manages merchandising calendar
- Coordinates with sales teams
- Tracks in-store execution

#### Van Sales Manager (Phase 3)
- Plans routes with vehicle capacity
- Manages cash collection
- Coordinates inventory loading
- Tracks van productivity

---

## 3. Epic Overview

### Epic 1: Data Import & Schema Management
Enable robust import of outlet, distributor, territory, and calendar data with "define once, update many" approach

### Epic 2: Territory Setup & Validation
System-guided territory hierarchy setup with size validation and planning unit generation

### Epic 3: GT Pre-Sales Route Planning
Territory-based planning for General Trade channel with DT boundaries, constraints, journey plan generation, and calendar management

### Epic 4: MT Pre-Sales Route Planning  
Cross-DT planning for Modern Trade channel with appointment windows and chain requirements

### Epic 5: Access Control & Audit
Role-based access control with comprehensive audit trail for all changes

### Epic 6: Data Quality Management
Handle missing coordinates, new outlets, and incomplete data gracefully

### Epic 7: Planning Workspace Foundation
Common planning tools, locking mechanism, and optimization framework for both channels

### Epic 8: Additional Journey Plan Features
Advanced journey plan management features including approval workflows and publishing

### Epic 9: System-wide Calendar Management
Enterprise calendar configuration for holidays, events, and special occasions

---

## 4. Detailed User Stories

### Epic 1: Data Import & Schema Management

#### Story 1.1: Define Import Schema
**As a** System Administrator  
**I want to** define the import schema and relationships once  
**So that** all future imports follow the same structure

**Acceptance Criteria**:
- Support multiple file upload in single session
- Define relationships between files (e.g., outlet → DT mapping)
- Set primary keys and merge keys
- Configure data types and formats
- Validate minimum required fields for planning
- Save schema configuration as template
- Support both normalized and denormalized formats

**Schema Definition Example**:
```
Import Session: "Brand X GT Setup"
Files:
1. outlets.csv (Primary: outlet_id)
2. outlet_dt_mapping.csv (Keys: outlet_id, dt_code)
3. dt_master.csv (Primary: dt_code)
4. territory_hierarchy.csv
5. routes.csv (Primary: route_id)

Relationships:
- outlets.outlet_id → outlet_dt_mapping.outlet_id
- outlet_dt_mapping.dt_code → dt_master.dt_code
- dt_master.territory_id → territory_hierarchy.area_id
```

---

#### Story 1.2: Upload Master Data Files
**As a** System Administrator  
**I want to** upload multiple related files in one session  
**So that** I can import complete dataset with relationships

**Acceptance Criteria**:
- Support CSV and Excel formats up to 500MB per file
- Upload multiple files in single session
- Show upload progress for each file
- Validate file format matches schema
- Support resume for interrupted uploads
- Store original files for audit trail
- Generate unique import session ID

**Import Session UI**:
```
Import Session: IMP-2024-001
Schema: "Brand X GT Setup"

Files to Upload:
✓ outlets_master.csv (234 MB) - Uploaded
⟳ dt_mapping.csv (45 MB) - Uploading 67%
○ territory_master.csv (12 MB) - Pending
○ routes.csv (8 MB) - Pending

[Pause] [Cancel] [Continue with Uploaded]
```

---

#### Story 1.3: Process Delta Updates
**As a** Data Analyst  
**I want to** upload only changed records  
**So that** I don't need to upload complete masters every time

**Acceptance Criteria**:
- Support three operations: INSERT, UPDATE, DELETE
- Auto-detect operation based on key existence
- Option to specify operation type per file
- Show preview of changes before applying
- Validate referential integrity
- Support bulk operations
- Maintain change history

**Delta Upload Example**:
```
Delta Import for: Brand X GT
Base Schema: IMP-2024-001

File: outlet_updates.csv
Detected Changes:
- New Records: 150
- Updates: 320  
- Deletions: 45 (marked with status='DELETED')

Validation:
✓ All DT codes exist
✓ No duplicate outlet IDs
⚠ 23 outlets missing coordinates

[Preview Changes] [Apply Delta] [Download Validation Report]
```

---

#### Story 1.4: Map Import Fields
**As a** System Administrator  
**I want to** map source fields to target fields  
**So that** different file formats can be imported

**Acceptance Criteria**:
- Auto-detect common field mappings
- Drag-and-drop interface for manual mapping
- Support field transformations:
  - Case conversion (UPPER, lower, Proper)
  - Date format conversion
  - Value mapping (Y/N → YES/NO)
  - Default values for missing fields
- Save mapping as part of schema template
- Preview mapped data (first 100 rows)

**Field Mapping Interface**:
```
Source: outlets_master.csv → Target: Outlet Entity

Source Field          Target Field         Transform
---------------------------------------------------
outlet_code      →    outlet_id            None
outlet_desc      →    outlet_name          Proper Case
outlet_lat       →    latitude             Number
outlet_long      →    longitude            Number
channel          →    channel_type         Lookup(GT,MT)
tier_code        →    service_tier         Map(A→Gold,B→Silver)
[unmapped]       →    sales_model          Default('PRE_SALES')
[unmapped]       →    fulfillment_type     Default('DT')

Enhanced Outlet Attributes:
☑ sales_model (PRE_SALES|VAN_SALES|BOTH)
☑ fulfillment_type (DT|DSD|BOTH)
☑ merchandising_required (YES|NO)
☑ audit_frequency (WEEKLY|MONTHLY|QUARTERLY)
```

---

#### Story 1.5: Validate Import Data
**As a** Data Analyst  
**I want to** see validation results before confirming import  
**So that** I can fix data quality issues

**Acceptance Criteria**:
- Validate against schema requirements
- Check minimum data for planning:
  - Outlet with coordinates OR address
  - Valid territory assignment
  - Valid channel (GT/MT/WS)
  - Sales model defined
- Categorize issues:
  - Errors (blocks planning)
  - Warnings (allows planning with limitations)
  - Info (suggestions)
- Download detailed validation report
- Option to fix and re-upload

**Validation Report**:
```
Import Session: IMP-2024-002
Total Records: 245,230

Summary by Entity:
Outlets: 245,230 records
✓ Valid: 235,150 (95.9%)
⚠ Warnings: 8,580 (3.5%)
✗ Errors: 1,500 (0.6%)

Critical Errors (Must Fix):
- Missing channel type: 500 outlets
- Invalid territory: 450 outlets
- No DT assignment: 550 outlets

Warnings (Can Proceed):
- Missing coordinates: 4,230 outlets
- No analytics data: 3,150 outlets
- New outlets (added < 30 days): 1,200 outlets

Planning Impact:
- Optimizable outlets: 230,920 (94.3%)
- Manual assignment required: 9,080 (3.7%)
- Cannot be planned: 1,500 (0.6%)

[Download Full Report] [Fix & Re-upload] [Proceed with Valid]
```

---

#### Story 1.6: Import Calendar Data
**As a** System Administrator  
**I want to** import sales calendar and holiday configurations  
**So that** journey plans align with business calendar

**Acceptance Criteria**:
- Import sales calendar structure (4-4-5, 4-5-4, standard)
- Define fiscal year start and period mappings
- Import company-wide and regional holidays
- Support recurring holiday patterns
- Import special events and festivals
- Validate date overlaps and conflicts
- Preview calendar before confirmation

**Calendar Import Interface**:
```
Calendar Import Session: CAL-2024-001

Calendar Type: 4-4-5
Fiscal Year Start: April 1, 2024
Total Periods: 12
Total Weeks: 52

Files:
✓ sales_calendar.csv - 364 days defined
✓ holidays_national.csv - 15 holidays
✓ holidays_regional.csv - 45 holidays
✓ events_festivals.csv - 28 events

Validation:
✓ All dates covered for FY 2024
⚠ 3 holidays fall on Sunday
✓ No overlapping holidays

[Preview Calendar] [Import Calendars]
```

---

### Epic 2: Territory Setup & Validation

#### Story 2.1: Detect Territory Hierarchy
**As a** System Administrator  
**I want to** automatically detect territory hierarchy from imported data  
**So that** I can set up the planning structure

**Acceptance Criteria**:
- Identify hierarchy levels from data patterns
- Show detected levels with record counts
- Validate hierarchy completeness
- Flag orphaned territories
- Suggest planning level based on size
- Allow manual override of detection

**Hierarchy Detection Result**:
```
Detected Hierarchy:
└── India (1)
    └── Zones (6 detected)
        └── Regions (42 detected)
            └── Areas (187 detected)
                └── Distributors (8,234 detected)

Recommended Planning Level: AREA
Reason: Average 44 DTs and 16,200 outlets per area
```

---

#### Story 2.2: Validate Territory Sizes
**As a** Territory Planner  
**I want to** see which territories are too large for efficient planning  
**So that** I can request splits or adjust planning level

**Acceptance Criteria**:
- Show metrics per territory:
  - Outlet count
  - DT count
  - Geographic spread
  - Route count
- Flag territories exceeding thresholds:
  - > 50,000 outlets
  - > 50 DTs
  - > 500 routes
- Suggest remediation (split, merge, different level)
- Allow threshold customization
- Export territory analysis

**Territory Analysis**:
```
Area Name         Outlets    DTs   Status    Recommendation
Mumbai Central    89,342     127   ⚠ Large   Split into 2-3 areas
Delhi South       76,234     95    ⚠ Large   Split into 2 areas
Bangalore North   23,456     38    ✓ OK      None
Chennai West      18,234     42    ✓ OK      None
```

---

#### Story 2.3: Configure Planning Units
**As a** System Administrator  
**I want to** finalize planning units after validation  
**So that** planners have appropriately sized territories

**Acceptance Criteria**:
- Create virtual splits for large territories
- Merge small adjacent territories
- Assign planning unit codes
- Generate planning unit metadata
- Create snapshot generation schedule
- Notify affected users of changes

---

### Epic 3: GT Pre-Sales Route Planning

#### Story 3.1: Select GT Planning Mode
**As a** GT Planning Manager  
**I want to** enter GT-specific planning workspace  
**So that** I can plan routes with GT constraints

**Acceptance Criteria**:
- Show channel selection on login (GT/MT)
- Load GT-specific UI components
- Apply GT business rules
- Show only GT outlets (filter MT/WS)
- Display DT boundaries prominently
- Load GT-specific optimization parameters

**Mode Selection**:
```
Select Planning Mode:

┌─────────────────────┐  ┌─────────────────────┐
│   General Trade     │  │   Modern Trade      │
│       (GT)          │  │       (MT)          │
│                     │  │                     │
│ • DT-based routes   │  │ • Cross-DT routes   │
│ • Dense coverage    │  │ • Appointment slots │
│ • Daily frequency   │  │ • Chain management  │
│                     │  │                     │
│   [Enter GT Mode]   │  │   [Enter MT Mode]   │
└─────────────────────┘  └─────────────────────┘
```

---

#### Story 3.2: Optimize GT Pre-Sales Routes
**As a** GT Planning Manager  
**I want to** optimize pre-sales routes within DT boundaries  
**So that** sales reps can maximize outlet coverage

**Acceptance Criteria**:
- Respect DT boundaries strictly
- Choose optimization strategy:
  - Geographic (shortest distance)
  - Business Priority (tier + analytics)
  - Hybrid (priority within zones)
- Consider outlet tiers (Gold/Silver/Bronze)
- Apply GT-specific constraints:
  - Max 120 outlets per route
  - 8:00 AM - 6:00 PM working hours
  - 30-minute lunch break
  - Service time by outlet tier
- Show GT-specific metrics
- Handle traditional trade patterns
- Configure priority weights for business optimization

**GT Optimization Parameters**:
```
GT Pre-Sales Optimization

Territory: North Delhi Area
DTs in Territory: 42
Total GT Outlets: 18,500

Optimization Strategy:
○ Geographic (Minimize Distance)
● Business Priority (Tier + Analytics)
○ Hybrid (Priority Groups + Geographic)

Priority Weights (if Business Priority selected):
├─ Outlet Tier: 30% [====|----]
├─ Stock Risk: 30% [====|----]
├─ Order Value: 40% [=====|---]

Parameters:
├─ Coverage Requirements
│  ├─ Gold outlets: Weekly (Mandatory)
│  ├─ Silver outlets: Bi-weekly
│  └─ Bronze outlets: Monthly
│
├─ Route Constraints  
│  ├─ Max outlets/day: 120
│  ├─ Avg service time: 5 min
│  ├─ Travel mode: Motorcycle
│  └─ Start/End: From DT location
│
└─ GT-Specific Rules
   ├─ Market day considerations
   ├─ Wholesale market timings
   └─ Religious holiday calendar

[Optimize GT Routes] [Load Saved Parameters]
```

---

#### Story 3.3: Handle GT Outlet Density
**As a** GT Planning Manager  
**I want to** manage routes in high-density areas  
**So that** routes are practical for execution

**Acceptance Criteria**:
- Identify high-density clusters (>200 outlets/km²)
- Suggest route splitting for dense areas
- Show walking routes for market areas
- Group nearby outlets for efficiency
- Support micro-route planning
- Visual density heatmap

**Density Management**:
```
High Density Alert: Karol Bagh Market

Outlet Count: 450 in 0.5 km²
Current Routes: 3
Suggested Routes: 5

Optimization Options:
○ Standard routing (vehicle-based)
● Market routing (walking + clustering)
○ Split by sub-areas
○ Split by outlet tiers

Micro-routing will create:
- 3 motorcycle routes (perimeter)
- 2 walking routes (market interior)

[Apply Market Routing] [Preview Routes]
```

---

### Epic 4: MT Pre-Sales Route Planning

#### Story 4.1: Select MT Planning Mode
**As an** MT Planning Manager  
**I want to** enter MT-specific planning workspace  
**So that** I can plan routes across DT boundaries

**Acceptance Criteria**:
- Load MT-specific interface
- Show all MT outlets regardless of DT
- Display chain groupings
- Load appointment scheduling tools
- Show both DT and DSD outlets
- Enable cross-DT optimization

---

#### Story 4.2: Optimize MT Pre-Sales Routes
**As an** MT Planning Manager  
**I want to** optimize routes for sales officers  
**So that** they can cover MT chains efficiently

**Acceptance Criteria**:
- Optimize across DT boundaries
- Integrate with appointment calendar system
- Respect store appointment windows
- Group by retail chain
- Consider store receiving hours
- Apply MT constraints:
  - Max 15-20 outlets per day
  - Longer service time (30-45 min)
  - Car-based routing
- Handle key account requirements
- Support weekly/monthly planning
- Sync with chain-specific calendars
- Auto-detect appointment conflicts

**MT Optimization Parameters**:
```
MT Pre-Sales Optimization

Territory: Delhi NCR Region
MT Outlets: 285
Chains: 12 (Big Bazaar, Reliance, Spencer's...)

Calendar Integration:
├─ Import Chain Calendars
│  ├─ Big Bazaar Calendar: ✓ Synced
│  ├─ Reliance Calendar: ✓ Synced
│  └─ Spencer's Calendar: ⟳ Syncing
│
├─ Appointment Windows
│  ├─ Big Bazaar: Tue/Thu 10AM-12PM
│  ├─ Reliance: Mon/Wed/Fri 2PM-5PM
│  ├─ Spencer's: Mon-Fri 9AM-11AM
│  └─ Default: 10AM-5PM
│
├─ Calendar Constraints
│  ├─ Block store holidays
│  ├─ Respect blackout dates
│  └─ Handle recurring windows
│
├─ Visit Frequency
│  ├─ Hypermarkets: Weekly
│  ├─ Supermarkets: Bi-weekly  
│  └─ Convenience: Weekly
│
├─ Service Requirements
│  ├─ Avg service time: 45 min
│  ├─ Travel mode: Car
│  └─ Start: Sales officer home
│
└─ Coverage
   ├─ Cross-DT routing: Enabled
   ├─ Include DSD outlets: Yes
   └─ Chain proximity bonus: Yes

[Optimize MT Routes] [Manage Appointments] [Sync Calendars]
```

---

#### Story 4.3: Manage MT Appointments
**As an** MT Planning Manager  
**I want to** work within store appointment constraints  
**So that** sales officers visit at acceptable times

**Acceptance Criteria**:
- Import appointment slots by chain
- Show calendar view of constraints
- Validate routes against appointments
- Suggest appointment changes if needed
- Alert on appointment conflicts
- Support recurring appointments

**Appointment Manager**:
```
MT Appointment Constraints

Big Bazaar - Janakpuri:
Available Slots: Tue, Thu (10 AM - 12 PM)
Current Assignment: Route MT-005
Next Visit: Jan 23 (Tuesday)

Conflicts Found:
⚠ Spencer's Select (2 PM) → Big Bazaar (2:30 PM)
  Travel time insufficient (45 min required)

Suggestions:
1. Move Spencer's to 1 PM slot
2. Move Big Bazaar to Thursday
3. Assign to different route

[Adjust Appointments] [Override Conflict]
```

---

#### Story 4.4: Optimize Routes (DT Level)
**As a** Distributor User  
**I want to** optimize routes within my DT  
**So that** I can improve my team's efficiency

**Acceptance Criteria**:
- Access only own DT's data
- Cannot move outlets to other DTs
- Same optimization parameters as planner
- See impact on DT-level metrics only
- Save changes to DT workspace
- Changes visible to territory planner

**DT Optimization Constraints**:
```
Optimizing: Delhi DT-042
Your Outlets: 1,250
Your Routes: 8
Your Salespeople: 8

Constraints:
✓ Can reassign outlets between your routes
✗ Cannot move outlets to other DTs
✓ Can modify journey sequences
✓ Can exclude outlets from routes
```

---

#### Story 4.5: Manually Adjust Routes
**As a** Territory Planner  
**I want to** manually adjust optimized routes  
**So that** I can incorporate local knowledge and constraints

**Acceptance Criteria**:
- Drag outlets between routes on map
- Multi-select outlets for bulk moves
- See real-time impact on metrics:
  - Distance change
  - Time change
  - Balance score
- Validate constraints immediately
- Support undo/redo
- Show optimization violations
- Maintain audit trail

**Manual Adjustment Interface**:
```
Route R-101 → R-102
Moving: 5 outlets

Impact Analysis:
Route R-101: 
  Distance: 120km → 95km (↓25km)
  Time: 8.5hr → 7.2hr (↓1.3hr)
  
Route R-102:
  Distance: 110km → 140km (↑30km)
  Time: 7.8hr → 9.5hr (↑1.7hr)
  ⚠ Exceeds 9hr limit

[Confirm Move] [Cancel]
```

---

#### Story 4.6: Override DT Changes
**As a** Territory Planner  
**I want to** override changes made by DT users when necessary  
**So that** I can maintain territory-wide optimization

**Acceptance Criteria**:
- Highlight routes modified by DT users
- Show original vs modified metrics
- Display DT user's change reasons
- Require override justification
- Warn before override
- Notify DT user of override
- Log in audit trail

**Override Warning Dialog**:
```
⚠ Override DT Changes

You are about to override changes made by:
User: Ajay Kumar (DT-042)
Date: Jan 20, 2024, 3:30 PM
Changes: Reassigned 15 outlets

DT's Reason: "New outlets in market area"

Your override will:
- Revert 15 outlet assignments
- Impact 2 routes (R-105, R-106)
- Affect tomorrow's journeys

Override Reason (required):
[____________________________]

[Proceed with Override] [Keep DT Changes] [View Details]
```

---

### Epic 5: Access Control & Audit

#### Story 5.1: Manage User Access
**As a** System Administrator  
**I want to** assign users to territories  
**So that** they can only access authorized data

**Acceptance Criteria**:
- Assign users to territories at any level
- Support multiple territory assignments
- Define role (Planner/DT User/Admin)
- Set permission levels
- Bulk user management
- Export user access matrix
- Audit access changes

**User Access Management**:
```
User: rashmi.sharma@company.com
Role: Territory Planner

Assigned Territories:
✓ North Delhi Area (Can Plan)
✓ South Delhi Area (Can Plan)
✓ Central Delhi Area (View Only)

Permissions:
✓ View outlets
✓ Run optimization
✓ Override DT changes
✓ Export data
✗ Modify territory boundaries
✗ Delete outlets

[Save Permissions] [View Audit Trail]
```

---

#### Story 5.2: View Audit Trail
**As a** Territory Planner  
**I want to** see all changes made in my territory  
**So that** I can understand planning history and decisions

**Acceptance Criteria**:
- Filter by date range
- Filter by user
- Filter by action type
- Search by outlet/route
- Show change details
- Display override reasons
- Export audit report
- Link to planning sessions

**Audit Trail View**:
```
Territory: North Delhi Area
Date Range: Jan 1-31, 2024

[Timeline View]

Jan 20, 3:30 PM - Ajay Kumar (DT-042)
  ↳ Reassigned 15 outlets from R-105 to R-106
  ↳ Reason: "New outlets in market area"

Jan 21, 10:15 AM - Rashmi Sharma (Planner)
  ↳ Started planning session
  ↳ Optimized 42 routes
  ↳ Duration: 2.5 hours

Jan 21, 11:45 AM - Rashmi Sharma (Planner)
  ↳ Override DT changes
  ↳ Affected: 15 outlets
  ↳ Reason: "Territory-wide optimization requires original assignment"

[Export Full Audit] [Filter Results]
```

---

### Epic 6: Data Quality Management

#### Story 6.1: Handle Missing Coordinates
**As a** Territory Planner  
**I want to** see outlets with missing coordinates  
**So that** I can plan for manual assignment or geocoding

**Acceptance Criteria**:
- List all outlets without coordinates
- Group by territory/DT
- Show on map as approximate location
- Allow manual coordinate entry
- Bulk geocoding request
- Assign despite missing coords
- Track for future resolution

**Missing Coordinates Report**:
```
Outlets Without Coordinates: 450

By Territory:
- North Delhi: 230 outlets
- South Delhi: 150 outlets  
- East Delhi: 70 outlets

Actions:
[Request Geocoding] [Export List] [Assign Manually]

Note: These outlets will not participate in 
route optimization but can be manually assigned.
```

---

#### Story 6.2: Monitor Import Status
**As a** Data Analyst  
**I want to** track import job progress  
**So that** I can plan dependent activities

**Acceptance Criteria**:
- Real-time status updates
- Show current processing stage
- Estimate completion time
- View validation summary
- Access error details
- Download processed file
- Receive email notifications
- Cancel running import

**Import Monitor Dashboard**:
```
Active Import Jobs:

Job ID: IMP-2024-001
File: outlets_master_jan.csv
Status: Processing ████████░░ 80%
Stage: Converting to Parquet
Records: 800,000 / 1,000,000
Started: 2:00 PM (25 min ago)
ETA: 5 minutes

Validation Summary:
✓ Valid: 785,000 (98.1%)
⚠ Warnings: 12,000 (1.5%)
✗ Errors: 3,000 (0.4%)

[View Details] [Cancel Import]
```

---

### Epic 7: Planning Workspace Foundation

#### Story 7.1: Select Territory for Planning
**As a** Territory Planner (GT or MT)  
**I want to** select my territory and start a planning session  
**So that** I can optimize routes for the upcoming period

**Acceptance Criteria**:
- Show territories based on user role and channel
- Display territory metrics by channel:
  - Outlet count (GT/MT split)
  - Last planned date
  - Current performance
- Check for existing locks
- Show other users' active sessions
- Load territory snapshot
- Initialize channel-specific workspace

**Territory Selection Screen**:
```
Your Territories (GT Planning Mode):
┌─────────────────────────────────────────┐
│ North Delhi Area                        │
│ GT Outlets: 18,500 | DTs: 42          │
│ MT Outlets: 285 (View Only)            │
│ Last Planned: 15 days ago               │
│ Status: ✓ Available                     │
│ [Start GT Planning Session]             │
└─────────────────────────────────────────┘
```

---

#### Story 7.2: Lock Territory for Planning
**As a** Territory Planner  
**I want to** lock my territory during planning  
**So that** other users cannot make conflicting changes

**Acceptance Criteria**:
- Acquire exclusive lock on selection
- Lock is channel-specific (GT lock doesn't block MT)
- Show lock status prominently
- Prevent other users from editing same channel
- Support explicit lock release
- No auto-release (explicit release only)
- Maintain lock during saves

**Lock Management UI**:
```
🔒 Planning Session Active
Territory: North Delhi Area
Channel: General Trade (GT)
Started: 10:30 AM (2 hours ago)
Your Changes: 45 outlets reassigned, 3 routes optimized

Note: MT planning can proceed independently

[Save Progress] [Complete Planning] [Release Lock]
```

---

#### Story 7.3: Handle New Outlets
**As a** GT/MT Planner or DT User  
**I want to** assign new outlets without analytics  
**So that** sales teams can start coverage immediately

**Acceptance Criteria**:
- Show list of unassigned new outlets
- Filter by channel (GT/MT)
- Filter by address/area
- Assign to routes manually
- Add to journey plans
- Mark for future geocoding
- Set visit frequency
- Track as "manual assignment"

**New Outlet Assignment**:
```
New GT Outlets in Territory (23)

□ Krishna Store - MG Road (Added: Jan 18)
  Channel: GT | Sales Model: PRE_SALES
  Status: No coordinates, No analytics
  
□ Super Mart - Sector 5 (Added: Jan 19)
  Channel: GT | Sales Model: PRE_SALES
  Status: Has coordinates, No analytics

Assign to Route: [Dropdown: R-101, R-102...]
Visit Frequency: [Weekly|Biweekly|Monthly]
Notes: [_________________________]

Warning: These outlets will not participate in 
optimization until analytics data is available.

[Assign Selected] [Request Coordinates]
```

---

#### Story 7.4: Save Planning Changes
**As a** Territory Planner  
**I want to** save my changes progressively  
**So that** I don't lose work and can recover from issues

**Acceptance Criteria**:
- Save without releasing lock
- Create versioned snapshots
- Show save confirmation
- Allow rollback to previous save
- Track what changed since last save
- Support notes with each save
- Separate saves by channel

**Save Progress Dialog**:
```
Save Planning Progress

Channel: General Trade
Territory: North Delhi Area

Changes since last save:
- 145 outlets reassigned
- 8 routes optimized  
- 23 new outlets assigned
- 2 DT overrides

Save Notes (optional):
"Completed DT-001 to DT-015, market area pending"

Version History:
- v5 (Current): 145 changes
- v4 (2:30 PM): Initial optimization
- v3 (11:00 AM): Session start

[Save Version] [Save & Release Lock] [Cancel]
```

---

### Epic 8: Additional Journey Plan Features

#### Story 8.1: View Journey Patterns (Extended View)
**As a** Territory Planner  
**I want to** see comprehensive journey plan analytics  
**So that** I can analyze pattern effectiveness

**Acceptance Criteria**:
- Show pattern distribution analysis
- Display coverage heatmaps
- Compare planned vs actual visits
- Identify pattern anomalies
- Export detailed analytics
- Track pattern compliance
- Generate optimization suggestions

**Journey Plan Generation**:
```
Generate Journey Plan

Territory: North Delhi Area
Period: April 2024 (Period 1)
Calendar: 4-4-5 (4 weeks)

Generation Strategy:
○ Geographic Optimization (shortest distance)
● Business Priority (tier + analytics)
○ Hybrid (priority within zones)

Priority Weights:
├─ Outlet Tier: 30% [====|----]
├─ Stock Risk: 30% [====|----]
├─ Order Value: 40% [=====|---]

Coverage Preview:
- Gold Outlets: 100% (weekly)
- Silver Outlets: 100% (biweekly)
- Bronze Outlets: 95% (monthly)
- New Outlets: 100% (assigned)

[Generate Journey Plan] [Adjust Weights]
```

---

#### Story 8.2: Manage Pattern Templates
**As a** Sales Operations Manager  
**I want to** create reusable journey pattern templates  
**So that** planning can be standardized across territories

**Acceptance Criteria**:
- Create pattern templates by channel/tier
- Define standard visit frequencies
- Set default sequencing rules
- Share templates across territories
- Version control for templates
- Apply templates to new territories
- Track template usage

**Pattern View Interface**:
```
Journey Plan: April 2024 - North Delhi Area

Route: R-101 (Ram Kumar)
Total Outlets: 95

┌─────────────────────────────────────────┐
│ Weekly Visits (15 outlets)              │
├─────────────────────────────────────────┤
│ Krishna Store (Gold)                    │
│ Week 1: Mon,Thu | Week 2: Mon,Thu      │
│ Week 3: Mon,Thu | Week 4: Mon,Thu      │
├─────────────────────────────────────────┤
│ Sharma Traders (Gold)                   │
│ All weeks: Tue,Fri                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Biweekly Visits (45 outlets)           │
├─────────────────────────────────────────┤
│ Delhi Mart (Silver)                     │
│ Week 1,3: Mon | Week 2,4: -            │
├─────────────────────────────────────────┤
│ City Grocers (Silver)                   │
│ Week 1,3: - | Week 2,4: Wed            │
└─────────────────────────────────────────┘

[Edit Patterns] [Export View] [Calendar View]
```

---

#### Story 8.3: Multi-Period Journey Planning
**As a** Territory Planner  
**I want to** plan journeys for multiple periods at once  
**So that** I can ensure consistent coverage over time

**Acceptance Criteria**:
- Generate plans for up to 6 periods
- Maintain pattern consistency
- Handle period transitions
- Preview multi-period coverage
- Adjust for seasonal variations
- Bulk approve multiple periods
- Track period-over-period changes

**Pattern Adjustment Dialog**:
```
Adjust Visit Pattern

Outlet: Krishna Store (Gold)
Current: Weekly - All weeks Mon,Thu

New Pattern:
Frequency: [Weekly ▼]
□ Week 1: [Mon ▼] [Thu ▼] [+ Add Day]
□ Week 2: [Mon ▼] [Thu ▼]
□ Week 3: [Mon ▼] [Thu ▼]
□ Week 4: [Mon ▼] [Thu ▼]

Impact:
- Monday load: 85 → 90 outlets (+5)
- Thursday load: 82 → 87 outlets (+5)

Reason for change: [_________________]

[Apply Change] [Cancel]
```

---

#### Story 8.4: Journey Plan Versioning
**As a** Territory Planner  
**I want to** maintain versions of journey plans  
**So that** I can track changes and revert if needed

**Acceptance Criteria**:
- Auto-version on significant changes
- Compare versions side-by-side
- Track who made changes
- Revert to previous versions
- Merge changes from different versions
- Archive old versions
- Generate change reports

**Holiday Conflict Resolution**:
```
Holiday Conflicts Found: 47 visits

Republic Day - Jan 26 (Friday)
Impact: No Operations
Affected: 12 routes, 156 outlets

Auto-Reschedule Options:
● Next Working Day (Jan 27)
○ Previous Day (Jan 25)
○ Distribute in Same Week
○ Skip Visit

Preview (Next Working Day):
- Jan 27 load: 95 → 251 outlets
  ⚠ Exceeds capacity

Manual Resolution Needed: 35 outlets

[Apply Auto-Reschedule] [Resolve Manually]
```

---

#### Story 8.5: Approve Journey Plans
**As a** Sales Operations Manager  
**I want to** review and approve journey plans with workflow  
**So that** plans meet business standards before publishing

**Acceptance Criteria**:
- Multi-level approval workflow
- Set approval rules by territory
- Conditional approval options
- Bulk approval for multiple territories
- Approval delegation
- Audit trail of approvals
- Integration with email notifications

**Approval Workflow**:
```
Journey Plan Approval Workflow

Territory: North Delhi Area
Status: Pending L2 Approval

Approval Chain:
✓ L1: Territory Planner (Submitted)
⟳ L2: Regional Manager (In Review)
○ L3: Sales Operations Head

Current Reviewer: Suresh Kumar
Due Date: Mar 20, 2024

Review Actions:
[Approve] [Conditional Approve] [Reject] [Request Changes]
```

---

#### Story 8.6: Publish Journey Plans (Advanced)
**As a** Territory Planner  
**I want to** publish approved journey plans with advanced options  
**So that** field teams receive customized plan formats

**Acceptance Criteria**:
- Multiple export formats (PDF, Excel, JSON)
- Customizable route cards
- Language localization
- Selective publishing by route/DT
- Integration with third-party systems
- QR codes for mobile access
- Scheduled publishing options

**Advanced Publishing Options**:
```
Advanced Journey Plan Publishing

Export Formats:
☑ PDF Route Cards (Customized)
  └─ Template: [Regional Standard ▼]
  └─ Language: [Hindi ▼]
☑ Excel Workbooks (By DT)
☑ Mobile App Packages
☑ WhatsApp Cards (Compressed)
☐ Third-party Integration
  └─ System: [Select ▼]

Distribution Options:
○ Immediate
● Scheduled: [Apr 1, 6:00 AM ▼]
○ Staggered by Territory

Recipients Filter:
☑ All DTs (42)
☐ Select DTs: [Choose ▼]
☑ All Salespeople (156)
☐ Select Routes: [Choose ▼]

[Preview Outputs] [Publish]
```

---

### Epic 9: System-wide Calendar Management

#### Story 9.1: Multi-Company Calendar Support
**As a** System Administrator  
**I want to** configure different calendars for multiple companies  
**So that** each business unit can follow their fiscal calendar

**Acceptance Criteria**:
- Support multiple calendar instances
- Assign calendars to companies/regions
- Handle different fiscal year starts
- Manage calendar transitions
- Copy calendar configurations
- Archive old calendars
- Set calendar hierarchies

**Calendar Configuration**:
```
Sales Calendar Setup

Calendar Name: FY 2024-25
Type: 4-4-5
Fiscal Year Start: April 1, 2024

Period Structure:
Period 1: April (4 weeks)
Period 2: May (4 weeks)
Period 3: June (5 weeks)
[... continues for 12 periods]

Week 53 Handling: Add to Period 12

Preview:
     April 2024
S  M  T  W  T  F  S
   1  2  3  4  5  6  ← Week 1
7  8  9 10 11 12 13
14 15 16 17 18 19 20 ← Week 2

[Save Calendar] [Set as Default]
```

---

#### Story 9.2: Regional Holiday Management
**As a** System Administrator  
**I want to** manage complex regional holiday rules  
**So that** local variations are properly handled

**Acceptance Criteria**:
- Define holiday hierarchies (national/state/local)
- Set religious holiday patterns
- Handle lunar calendar holidays
- Configure holiday inheritance rules
- Manage holiday conflicts
- Support floating holidays
- Track regional variations

**Regional Holiday Configuration**:
```
Regional Holiday Management

Holiday: Diwali (Lunar Calendar)
Type: Religious Festival
Calculation: Lunar (Varies yearly)

Regional Variations:
├─ North India
│  ├─ Days: 5 days
│  ├─ Impact: No Operations (Day 1,3)
│  └─ Custom: Dhanteras, Bhai Dooj
│
├─ South India  
│  ├─ Days: 2 days
│  ├─ Impact: No Sales
│  └─ Custom: Deepavali only
│
└─ West India
   ├─ Days: 5 days
   ├─ Impact: Reduced Hours
   └─ Custom: Gujarati New Year

[Save Configuration] [Apply to Territories]
```

---

#### Story 9.3: Event & Promotion Calendar
**As a** Sales Operations Manager  
**I want to** manage promotional events and campaigns  
**So that** journey plans align with business initiatives

**Acceptance Criteria**:
- Create promotional calendars
- Link events to products/categories
- Set visit priority during events
- Define event-specific routes
- Track historical event performance
- Integrate with journey planning
- Generate event coverage reports

**Promotion Event Management**:
```
Promotional Event Setup

Event: Summer Beverage Push
Type: Product Promotion
Duration: May 1 - June 30, 2024
Products: Soft Drinks, Juices, Water

Territory Application:
☑ All Urban Areas
☑ High-Temperature Regions
☐ Rural Markets

Journey Plan Impact:
☑ Increase visit frequency +20%
☑ Priority to beverage outlets
☑ Add cooler audit checks
☑ Focus on visibility metrics

Expected Uplift: +35%
Last Year Actual: +32%

[Create Event] [Apply to Plans]
```

---

#### Story 9.4: Calendar Synchronization
**As a** System Administrator  
**I want to** synchronize calendars with external systems  
**So that** all systems share consistent calendar data

**Acceptance Criteria**:
- Import from ERP/HR systems
- Export to planning systems
- Real-time sync options
- Handle calendar conflicts
- Map different calendar formats
- Validate imported data
- Schedule sync jobs

**Calendar Sync Configuration**:
```
External Calendar Synchronization

Source Systems:
☑ SAP HR (Holidays)
  Status: Connected
  Last Sync: Today 2:00 PM
  
☑ Oracle ERP (Fiscal Calendar)
  Status: Connected
  Last Sync: Yesterday
  
☐ Google Calendar (Events)
  Status: Not configured

Sync Schedule:
○ Real-time
● Daily at: [2:00 AM ▼]
○ Weekly
○ Manual only

Conflict Resolution:
● External system wins
○ Local system wins
○ Manual review

[Test Connection] [Sync Now] [View Logs]
```

---

#### Story 9.5: Calendar Analytics & Reporting
**As a** Sales Operations Manager  
**I want to** analyze calendar impact on performance  
**So that** I can optimize future calendars

**Acceptance Criteria**:
- Working days analysis by period
- Holiday impact on sales
- Event effectiveness tracking
- Compare calendar scenarios
- Generate calendar reports
- Export analytical data
- Predictive calendar modeling

**Calendar Analytics Dashboard**:
```
Calendar Performance Analytics

FY 2023-24 Analysis:

Working Days Efficiency:
- Total Days: 365
- Working Days: 294 (80.5%)
- Lost to Holidays: 52
- Lost to Events: 19

Period Comparison:
Period 1: 22 days | Sales: ₹45M
Period 2: 20 days | Sales: ₹38M
Period 3: 24 days | Sales: ₹52M

Holiday Impact:
- Diwali Week: -45% visits, +125% order value
- Holi: -100% visits (no operations)
- Regional holidays: -15% avg coverage

Recommendations:
⚡ Merge Period 2 holidays for efficiency
⚡ Pre-load inventory before Diwali
⚡ Adjust Period 3 to avoid monsoon

[Export Analysis] [Model Scenarios]
```

---

## 5. Permission Matrix

### Role-Based Permissions

| Action | Admin | GT Planner | MT Planner | DT User | Data Analyst | Sales Ops Manager |
|--------|-------|------------|------------|---------|--------------|-------------------|
| **Data Import** |
| Upload files | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ |
| Configure schema | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ |
| Process delta updates | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ |
| Import calendars | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Territory Setup** |
| Configure hierarchy | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Validate sizes | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ |
| **GT Planning** |
| Start GT planning session | ✓ | ✓* | ✗ | ✓* | ✗ | ✗ |
| Lock GT territory | ✓ | ✓* | ✗ | ✓* | ✗ | ✗ |
| Optimize GT routes | ✓ | ✓* | ✗ | ✓* | ✗ | ✗ |
| Override DT changes | ✓ | ✓* | ✗ | ✗ | ✗ | ✗ |
| **MT Planning** |
| Start MT planning session | ✓ | ✗ | ✓* | ✗ | ✗ | ✗ |
| Lock MT territory | ✓ | ✗ | ✓* | ✗ | ✗ | ✗ |
| Optimize MT routes | ✓ | ✗ | ✓* | ✗ | ✗ | ✗ |
| Cross-DT assignments | ✓ | ✗ | ✓* | ✗ | ✗ | ✗ |
| **Journey Plans** |
| Generate journey plans | ✓ | ✓* | ✓* | ✗ | ✗ | ✗ |
| Modify patterns | ✓ | ✓* | ✓* | ✓* | ✗ | ✗ |
| Approve plans | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Publish plans | ✓ | ✓* | ✓* | ✗ | ✗ | ✓ |
| **Calendar Management** |
| Configure sales calendar | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Manage holidays | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Add special events | ✓ | ✓* | ✓* | ✗ | ✗ | ✓ |
| **Common Actions** |
| Manual outlet assignment | ✓ | ✓* | ✓* | ✓* | ✗ | ✗ |
| View audit trail | ✓ | ✓* | ✓* | ✓* | ✓ | ✓ |
| Export data | ✓ | ✓* | ✓* | ✓* | ✓ | ✓ |

*Within assigned territories/channel only

### Channel Access Matrix

| User Type | GT Data | MT Data |
|-----------|---------|---------|
| GT Planner | Full Access | View Only |
| MT Planner | View Only | Full Access |
| DT User | Own DT Only | Not Applicable |
| Sales Ops Manager | View All | View All |
| Admin | Full Access | Full Access |

---

## 6. Edge Cases & Error Scenarios

### Import Edge Cases

1. **Duplicate Outlet IDs**
   - Detection: During validation
   - Handling: Show duplicates, use latest record
   - User Action: Download duplicate report

2. **Territory Reassignment**
   - Detection: Outlet territory changed
   - Handling: Update assignment, log change
   - User Action: Review impact on routes

3. **File Too Large**
   - Detection: File > 500MB
   - Handling: Reject with clear message
   - User Action: Split file or contact admin

4. **Corrupt File**
   - Detection: Cannot parse file
   - Handling: Show specific error
   - User Action: Verify format, re-export

### Planning Edge Cases

1. **Concurrent Lock Attempts**
   - Detection: Lock already exists
   - Handling: Show current lock holder
   - User Action: Wait or request release

2. **Session Timeout**
   - Detection: No activity for 2 hours
   - Handling: Auto-save and release lock
   - User Action: Resume from last save

3. **Optimization Failure**
   - Detection: No valid solution found
   - Handling: Show constraint violations
   - User Action: Adjust parameters

4. **Network Disconnection**
   - Detection: Lost connection during save
   - Handling: Retry with exponential backoff
   - User Action: Check connection, retry

### Data Quality Edge Cases

1. **All Outlets Unoptimizable**
   - Detection: No outlets have required data
   - Handling: Prevent optimization
   - User Action: Manual assignment only

2. **Territory Boundary Change**
   - Detection: Outlet outside boundary
   - Handling: Flag for review
   - User Action: Reassign or update boundary

3. **Circular Route**
   - Detection: Route returns to start mid-way
   - Handling: Warning but allow
   - User Action: Review and adjust

### Journey Plan Edge Cases

1. **Impossible Visit Frequency**
   - Detection: More visits required than working days
   - Handling: Show capacity violation
   - User Action: Adjust frequency or add resources

2. **Holiday Cluster**
   - Detection: Multiple holidays in same week
   - Handling: Warn about low coverage
   - User Action: Pre-plan or post-plan visits

3. **Pattern Conflicts**
   - Detection: Same outlet in multiple patterns
   - Handling: Show conflict details
   - User Action: Resolve duplicate assignment

4. **Calendar Change Mid-Period**
   - Detection: Calendar modified after planning
   - Handling: Flag affected plans
   - User Action: Regenerate affected plans

---

## 7. Acceptance Criteria Summary

### Import Success Criteria
- ✓ Support CSV and Excel formats
- ✓ Handle files up to 500MB
- ✓ Process 1M records < 30 minutes
- ✓ Field mapping accuracy > 90%
- ✓ Zero data loss during import
- ✓ Comprehensive error reporting
- ✓ Calendar data imports correctly

### Planning Success Criteria
- ✓ Territory lock within 2 seconds
- ✓ Load territory data < 5 seconds
- ✓ Optimization request < 2 minutes
- ✓ Real-time metric updates
- ✓ Support 50k outlets per session
- ✓ Audit trail for all changes
- ✓ Journey plan generation < 30 seconds

### User Experience Criteria
- ✓ Intuitive navigation
- ✓ Clear error messages
- ✓ Responsive on tablet/desktop
- ✓ Keyboard shortcuts for power users
- ✓ Export capabilities
- ✓ Contextual help
- ✓ Pattern view easy to understand

### Technical Criteria
- ✓ API response time < 2 seconds
- ✓ 99.9% uptime
- ✓ Support 100 concurrent users
- ✓ Data encryption at rest/transit
- ✓ Daily backups
- ✓ Disaster recovery plan
- ✓ Calendar calculations accurate

---

## Appendix A: Glossary

**DT**: Distributor - An independent business partner managing sales in a geographic area

**Journey Plan**: Pattern-based visit schedule aligned with sales calendar

**Journey Pattern**: Repeating visit schedule (e.g., Week 1,3: Mon,Thu)

**LPO**: Lines Per Order - Number of different products in an order

**NPPD**: Next Product Purchase Date - ML-predicted purchase probability

**Outlet**: Retail point of sale (shop, store, restaurant)

**Planning Unit**: Territory level used for route optimization (typically Area)

**Route**: Collection of outlets assigned to one salesperson

**Sales Calendar**: Business calendar (e.g., 4-4-5) used for planning

**Territory**: Hierarchical geographic division (Country > Zone > Region > Area > DT)

---

## Appendix B: Complete Data Formats

### Outlet Master Format (Denormalized)
```csv
outlet_id,outlet_name,address,latitude,longitude,channel,tier,territory,dt_code,route_id,sales_model,fulfillment_type,merchandising_required,audit_frequency,sales_volume,nppd_score,new_outlet_flag
OTL001,Krishna Store,"MG Road, Delhi",28.6139,77.2090,GT,Silver,AREA-DEL-01,DT-001,R-101,PRE_SALES,DT,YES,MONTHLY,45000,0.78,N
OTL002,Big Bazaar Janakpuri,"District Centre",28.6219,77.0878,MT,Gold,AREA-DEL-01,MULTIPLE,MT-005,PRE_SALES,DSD,YES,WEEKLY,500000,0.92,N
```

### Journey Pattern Format
```csv
pattern_id,journey_plan_id,route_id,outlet_id,visit_frequency,week1_days,week2_days,week3_days,week4_days,week5_days,visit_priority,tier_score,stock_risk_score,order_value_score
PAT001,JP-2024-04,R-101,OTL001,WEEKLY,"MON,THU","MON,THU","MON,THU","MON,THU",MON,1,100,85,92
PAT002,JP-2024-04,R-101,OTL002,BIWEEKLY,MON,,MON,,,2,70,45,65
PAT003,JP-2024-04,R-101,OTL003,MONTHLY,,TUE,,,3,40,20,35
```

### Sales Calendar Format
```csv
calendar_id,company_id,calendar_type,sales_year,sales_period,sales_week,sales_day,calendar_date,period_name,is_working_day
CAL001,COMP001,4-4-5,2024,1,1,1,2024-04-01,April,TRUE
CAL001,COMP001,4-4-5,2024,1,1,2,2024-04-02,April,TRUE
```

### Holiday Calendar Format
```csv
holiday_id,company_id,holiday_date,holiday_name,holiday_type,applicable_level,applicable_territories,impact_type,reschedule_visits,reschedule_to
HOL001,COMP001,2024-01-26,Republic Day,NATIONAL,ALL,,NO_OPERATIONS,TRUE,NEXT_DAY
HOL002,COMP001,2024-03-25,Holi,RELIGIOUS,TERRITORY,"NORTH,WEST",NO_SALES,TRUE,NEXT_DAY
```

---

## Appendix C: Journey Plan Generation Parameters

### Business Priority Scoring
```json
{
  "scoring_weights": {
    "tier_weight": 0.3,
    "stock_risk_weight": 0.3,
    "order_value_weight": 0.4
  },
  "tier_scores": {
    "GOLD": 100,
    "SILVER": 70,
    "BRONZE": 40
  },
  "frequency_rules": {
    "GOLD": "WEEKLY",
    "SILVER": "BIWEEKLY",
    "BRONZE": "MONTHLY"
  },
  "sequencing_strategy": "BUSINESS_PRIORITY"
}
```

### Calendar Integration Rules
```json
{
  "holiday_handling": {
    "NO_OPERATIONS": "RESCHEDULE_NEXT_DAY",
    "NO_SALES": "RESCHEDULE_PREVIOUS_DAY",
    "REDUCED_HOURS": "ADJUST_ROUTE"
  },
  "conflict_resolution": {
    "strategy": "AUTO_RESCHEDULE",
    "manual_review_threshold": 50,
    "distribution_logic": "SAME_WEEK_FIRST"
  }
}
```

---

**Document Status**: Updated with Journey Plan & Calendar Stories  
**Version**: 2.1  
**Last Updated**: December 2024  
**Changes in v2.2**: 
- Updated Story 3.2 to include business priority optimization option
- Updated Story 4.2 to enhance appointment calendar integration
- Moved journey plan stories to Epic 3 as Stories 3.9-3.12
- Restructured Epic 8 and 9 to contain additional advanced features
- Ensured all required changes are properly placed