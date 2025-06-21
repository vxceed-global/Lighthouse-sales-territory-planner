# SRTO Frontend Design Guide

## Version 1.1
**Date:** December 2024  
**Framework:** React + TypeScript + Ant Design 5.x  
**Updates:** Added Journey Plan & Calendar UI Components

---

## Table of Contents
1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing System](#4-spacing-system)
5. [Component Patterns](#5-component-patterns)
6. [Layout Structure](#6-layout-structure)
7. [Interactive States](#7-interactive-states)
8. [Responsive Breakpoints](#8-responsive-breakpoints)
9. [Specific UI Components](#9-specific-ui-components)
10. [Animation Guidelines](#10-animation-guidelines)
11. [Accessibility](#11-accessibility)
12. [Dark Mode](#12-dark-mode-future-consideration)

---

## 1. Design Principles

### Core Values
- **Data Clarity**: Prioritize clear visualization of complex route and territory data
- **Efficiency First**: Optimize for power users who interact with the system daily
- **Map-Centric**: Google Maps is the hero element; UI should complement, not compete
- **Progressive Disclosure**: Show essential information first, details on demand
- **Consistency**: Leverage Ant Design patterns throughout

### Visual Hierarchy
1. **Primary Focus**: Map visualization and route optimization controls
2. **Secondary**: Data tables, metrics, and analytics
3. **Tertiary**: Settings, configuration, and administrative functions

---

## 2. Color System

### Primary Palette
```scss
// Brand Colors
$primary-base: #7C00EF;        // hsl(271, 100%, 46.9%)
$primary-light: #9D2FFF;       // hsl(271, 100%, 61.2%)
$primary-dark: #5A00B3;        // hsl(271, 100%, 35.7%)

// Ant Design token overrides
@primary-color: #7C00EF;
@primary-color-hover: #9D2FFF;
@primary-color-active: #5A00B3;
```

### Semantic Colors
```scss
// Status & Feedback
$success: #52C41A;     // Successful optimization, good NPPD scores
$warning: #FAAD14;     // Near capacity, attention needed
$error: #FF4D4F;       // Over capacity, failed optimization
$info: #1890FF;        // General information

// Territory Tiers (Business Specific)
$tier-gold: #FFB800;   // Gold outlets - Highest priority
$tier-silver: #8C8C8C; // Silver outlets - Medium priority
$tier-bronze: #D4380D; // Bronze outlets - Standard priority
```

### Neutral Palette
```scss
$gray-1: #FFFFFF;      // Background
$gray-2: #FAFAFA;      // Subtle backgrounds
$gray-3: #F5F5F5;      // Hover states
$gray-4: #E8E8E8;      // Borders, dividers
$gray-5: #D9D9D9;      // Default borders
$gray-6: #BFBFBF;      // Disabled states
$gray-7: #8C8C8C;      // Secondary text
$gray-8: #595959;      // Default text
$gray-9: #262626;      // Headings
$gray-10: #000000;     // Maximum contrast
```

### Map-Specific Colors
```scss
// Route visualization (8 distinct colors for different salespeople)
$route-colors: (
  route-1: #7C00EF,    // Primary purple
  route-2: #00BFA5,    // Teal
  route-3: #FF6B6B,    // Coral
  route-4: #4ECDC4,    // Turquoise
  route-5: #45B7D1,    // Sky blue
  route-6: #F7B731,    // Golden
  route-7: #5F27CD,    // Deep purple
  route-8: #00D2D3     // Cyan
);

// Territory boundaries
$territory-boundary: rgba(124, 0, 239, 0.3);
$territory-fill: rgba(124, 0, 239, 0.1);
$territory-hover: rgba(124, 0, 239, 0.15);

// NPPD Heat Map
$nppd-high: #FF4757;     // High purchase probability
$nppd-medium: #FFA502;   // Medium probability
$nppd-low: #7BED9F;      // Low probability
```

---

## 3. Typography

### Font Stack
```scss
// System fonts for performance and consistency
$font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
$font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 
             'Courier New', monospace;
```

### Type Scale
```scss
// Using Ant Design's type scale
$heading-1: 38px;  // Page titles (e.g., "Territory Optimization")
$heading-2: 30px;  // Section headers (e.g., "Today's Routes")
$heading-3: 24px;  // Card titles (e.g., "Territory Performance")
$heading-4: 20px;  // Subsection headers
$heading-5: 16px;  // Label headers

$text-base: 14px;  // Default body text
$text-sm: 12px;    // Secondary text, captions
$text-xs: 11px;    // Metadata, timestamps
```

### Font Weights
```scss
$font-weight-light: 300;     // Not used in primary UI
$font-weight-regular: 400;   // Body text
$font-weight-medium: 500;    // Emphasized text, labels
$font-weight-semibold: 600;  // Subheadings
$font-weight-bold: 700;      // Headings, important numbers
```

### Line Heights
```scss
$line-height-compact: 1.3;   // Headings
$line-height-base: 1.5;      // Body text
$line-height-relaxed: 1.7;   // Long-form content
```

---

## 4. Spacing System

### Base Unit: 8px Grid
```scss
$space-xxs: 4px;   // Tight spacing (icon to text)
$space-xs: 8px;    // Default small spacing
$space-sm: 12px;   // Between related elements
$space-md: 16px;   // Default spacing
$space-lg: 24px;   // Section spacing
$space-xl: 32px;   // Major section breaks
$space-xxl: 48px;  // Page-level spacing
$space-xxxl: 64px; // Hero sections
```

### Component-Specific Spacing
```scss
// Cards and panels
$card-padding: 24px;
$card-margin: 16px;
$card-header-padding: 16px 24px;

// Map controls
$map-control-margin: 12px;
$map-control-padding: 8px;
$map-control-spacing: 8px;  // Between controls

// Table cells
$table-cell-padding-y: 12px;
$table-cell-padding-x: 16px;
$table-header-padding: 16px;

// Form elements
$form-item-margin-bottom: 24px;
$form-label-margin-bottom: 8px;
$input-padding: 4px 11px;
```

---

## 5. Component Patterns

### Cards
```tsx
// Standard data card pattern
<Card
  title="Territory Performance"
  extra={<Button type="text" icon={<MoreOutlined />} />}
  className="srto-data-card"
  style={{ marginBottom: 16 }}
  bodyStyle={{ padding: 24 }}
>
  {content}
</Card>

// Metric card pattern
<Card className="srto-metric-card" bordered={false}>
  <Statistic
    title="Total Outlets"
    value={1247}
    prefix={<ShopOutlined />}
    suffix={
      <span className="metric-trend positive">
        <ArrowUpOutlined /> 12%
      </span>
    }
  />
</Card>
```

### Map Overlays
```scss
.map-overlay {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 16px;
  z-index: 10;
  
  // Positioning classes
  &.map-overlay-tl { top: 12px; left: 12px; }
  &.map-overlay-tr { top: 12px; right: 12px; }
  &.map-overlay-bl { bottom: 12px; left: 12px; }
  &.map-overlay-br { bottom: 12px; right: 12px; }
  
  // Control panel variant
  &.map-control-panel {
    padding: 12px;
    min-width: 200px;
    
    .ant-btn {
      width: 100%;
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
```

### Data Tables
```tsx
// Outlet list table configuration
const outletTableConfig = {
  rowClassName: (record) => `tier-${record.tier.toLowerCase()}`,
  size: 'small',
  pagination: { 
    pageSize: 50,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} outlets`
  },
  scroll: { 
    y: 'calc(100vh - 280px)',
    x: 'max-content'
  },
  bordered: false,
  showSorterTooltip: true
};
```

### Loading States
```tsx
// Skeleton loading for data cards
<Card>
  <Skeleton active paragraph={{ rows: 4 }} />
</Card>

// Map loading overlay
<div className="map-loading-overlay">
  <Spin size="large" tip="Optimizing routes..." />
</div>
```

---

## 6. Layout Structure

### Main Application Layout
```scss
.srto-app {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main";
  grid-template-columns: 280px 1fr;
  grid-template-rows: 64px 1fr;
  height: 100vh;
  
  &.sidebar-collapsed {
    grid-template-columns: 80px 1fr;
  }
  
  &.fullscreen-map {
    grid-template-areas: "main";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    
    .srto-header,
    .srto-sidebar {
      display: none;
    }
  }
}

.srto-header {
  grid-area: header;
  background: white;
  border-bottom: 1px solid $gray-4;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}

.srto-sidebar {
  grid-area: sidebar;
  background: $gray-2;
  border-right: 1px solid $gray-4;
  overflow-y: auto;
  
  .ant-menu {
    background: transparent;
    border-right: none;
  }
}

.srto-main {
  grid-area: main;
  position: relative;
  overflow: hidden;
  background: $gray-3;
}
```

### Map Container
```scss
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  .google-map {
    width: 100%;
    height: 100%;
  }
  
  // Panel overlay for route details
  &.with-side-panel {
    .google-map {
      width: calc(100% - 400px);
    }
    
    .route-details-panel {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 400px;
      background: white;
      border-left: 1px solid $gray-4;
      overflow-y: auto;
    }
  }
}
```

---

## 7. Interactive States

### Buttons
```scss
// Primary button states
.ant-btn-primary {
  background: $primary-base;
  border-color: $primary-base;
  
  &:hover:not(:disabled) { 
    background: $primary-light;
    border-color: $primary-light;
  }
  
  &:active { 
    background: $primary-dark;
    border-color: $primary-dark;
  }
  
  &:focus { 
    box-shadow: 0 0 0 2px rgba(124, 0, 239, 0.2);
  }
  
  &.ant-btn-loading {
    opacity: 0.8;
    pointer-events: none;
  }
}

// Optimization button special state
.btn-optimize {
  &.optimizing {
    background: $warning;
    border-color: $warning;
    
    .anticon {
      animation: spin 1s linear infinite;
    }
  }
}
```

### Map Markers
```scss
// Outlet marker states
.outlet-marker {
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    z-index: 1000;
  }
  
  &.selected {
    transform: scale(1.2);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
  
  &.optimizing {
    animation: pulse 1.5s infinite;
  }
  
  &.tier-gold {
    fill: $tier-gold;
  }
  
  &.tier-silver {
    fill: $tier-silver;
  }
  
  &.tier-bronze {
    fill: $tier-bronze;
  }
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.15); }
  100% { opacity: 1; transform: scale(1); }
}
```

### Form Controls
```scss
// Input focus states
.ant-input,
.ant-select-selector {
  &:hover {
    border-color: $primary-light;
  }
  
  &:focus,
  &.ant-input-focused {
    border-color: $primary-base;
    box-shadow: 0 0 0 2px rgba(124, 0, 239, 0.1);
  }
}

// Switch states for route visibility
.route-visibility-switch {
  &.ant-switch-checked {
    background-color: var(--route-color);
  }
}
```

---

## 8. Responsive Breakpoints

```scss
// Ant Design default breakpoints
$screen-xs: 480px;   // Mobile portrait
$screen-sm: 576px;   // Mobile landscape
$screen-md: 768px;   // Tablet portrait
$screen-lg: 992px;   // Tablet landscape / Desktop
$screen-xl: 1200px;  // Desktop
$screen-xxl: 1600px; // Large desktop

// SRTO-specific breakpoints
$map-controls-stack: 768px;      // Stack map controls vertically
$sidebar-hide: 992px;            // Auto-hide sidebar
$table-horizontal-scroll: 768px; // Enable horizontal scroll
$card-grid-collapse: 576px;      // Single column layout
```

### Responsive Patterns
```scss
// Map controls responsive behavior
@media (max-width: $map-controls-stack) {
  .map-control-panel {
    &.map-overlay-tr {
      right: 8px;
      top: 8px;
      min-width: auto;
      
      .ant-btn-group {
        flex-direction: column;
        
        .ant-btn {
          border-radius: 4px !important;
          margin-bottom: 4px;
        }
      }
    }
  }
}

// Sidebar responsive behavior
@media (max-width: $sidebar-hide) {
  .srto-app {
    grid-template-columns: 0 1fr;
    
    &.sidebar-open {
      .srto-sidebar {
        position: fixed;
        left: 0;
        top: 64px;
        bottom: 0;
        width: 280px;
        z-index: 999;
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
      }
      
      .sidebar-overlay {
        display: block;
      }
    }
  }
}

// Card grid responsive
@media (max-width: $card-grid-collapse) {
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
```

---

## 9. Specific UI Components

### 9.1 Territory Assignment Modal
```tsx
<Modal
  title="Assign Outlets to Territory"
  width={800}
  className="territory-assignment-modal"
  okText="Save Assignment"
  cancelText="Cancel"
>
  <div className="assignment-stats">
    <Alert
      message={`${selectedOutlets.length} outlets selected`}
      type="info"
      showIcon
    />
  </div>
  
  <Transfer
    dataSource={outlets}
    titles={['Available Outlets', 'Assigned Outlets']}
    targetKeys={assignedOutletIds}
    onChange={handleTransferChange}
    render={item => (
      <span className={`outlet-item tier-${item.tier}`}>
        <Badge 
          color={tierColors[item.tier]} 
          text={`${item.name} - ${item.tier}`} 
        />
      </span>
    )}
    showSearch
    filterOption={(inputValue, item) =>
      item.name.toLowerCase().includes(inputValue.toLowerCase())
    }
    listStyle={{
      width: 350,
      height: 400,
    }}
  />
</Modal>
```

### 9.2 Route Timeline Component
```tsx
<Timeline className="route-timeline">
  <Timeline.Item dot={<EnvironmentOutlined />} color="green">
    <div className="timeline-content">
      <div className="timeline-header">
        <Text strong>Start from Distribution Center</Text>
        <Text type="secondary">8:00 AM</Text>
      </div>
    </div>
  </Timeline.Item>
  
  {route.waypoints.map((waypoint, index) => (
    <Timeline.Item 
      key={waypoint.id}
      dot={<ShopOutlined />}
      color={tierColors[waypoint.outlet.tier]}
    >
      <div className="timeline-content">
        <div className="outlet-info">
          <Text strong className="outlet-name">
            {waypoint.outlet.name}
          </Text>
          <Space size="small">
            <Text type="secondary" className="arrival-time">
              {waypoint.estimatedArrival}
            </Text>
            <Tag>{waypoint.outlet.tier}</Tag>
          </Space>
        </div>
        <div className="metrics">
          <Text type="secondary" className="distance">
            {waypoint.distance} km
          </Text>
          <Text type="secondary" className="duration">
            {waypoint.duration} mins
          </Text>
        </div>
      </div>
    </Timeline.Item>
  ))}
  
  <Timeline.Item dot={<HomeOutlined />} color="red">
    <div className="timeline-content">
      <div className="timeline-header">
        <Text strong>Return to Distribution Center</Text>
        <Text type="secondary">5:30 PM</Text>
      </div>
    </div>
  </Timeline.Item>
</Timeline>
```

### 9.3 Route Optimization Controls
```tsx
<Card className="optimization-controls map-overlay map-overlay-tr">
  <Space direction="vertical" style={{ width: '100%' }}>
    <DatePicker 
      defaultValue={dayjs()}
      style={{ width: '100%' }}
      disabledDate={(current) => current < dayjs().startOf('day')}
    />
    
    <Select
      placeholder="Select Territory"
      style={{ width: '100%' }}
      value={selectedTerritory}
      onChange={setSelectedTerritory}
    >
      {territories.map(territory => (
        <Option key={territory.id} value={territory.id}>
          {territory.name}
        </Option>
      ))}
    </Select>
    
    <Button
      type="primary"
      icon={<ThunderboltOutlined />}
      onClick={handleOptimize}
      loading={isOptimizing}
      block
    >
      {isOptimizing ? 'Optimizing...' : 'Optimize Routes'}
    </Button>
    
    <Collapse ghost>
      <Panel header="Advanced Options" key="1">
        <Form size="small">
          <Form.Item label="Max outlets per route">
            <InputNumber min={1} max={50} defaultValue={30} />
          </Form.Item>
          <Form.Item label="Include NPPD scores">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Panel>
    </Collapse>
  </Space>
</Card>
```

### 9.4 NPPD Score Indicator
```tsx
const NPPDIndicator = ({ score, size = 'default' }) => {
  const getColor = (score) => {
    if (score >= 0.7) return '#FF4757';  // High
    if (score >= 0.4) return '#FFA502';  // Medium
    return '#7BED9F';  // Low
  };
  
  return (
    <div className={`nppd-indicator nppd-${size}`}>
      <Progress
        type="circle"
        percent={score * 100}
        width={size === 'small' ? 40 : 60}
        strokeColor={getColor(score)}
        format={(percent) => `${percent}%`}
      />
      <Text type="secondary" className="nppd-label">
        NPPD Score
      </Text>
    </div>
  );
};
```

### 9.5 Journey Pattern Display
```tsx
const JourneyPatternDisplay = ({ pattern, outlet }) => {
  const formatPattern = (pattern) => {
    const weeks = [];
    for (let i = 1; i <= 5; i++) {
      const days = pattern[`week${i}_days`];
      if (days?.length > 0) {
        weeks.push(`Week ${i}: ${days.join(',')}`);
      }
    }
    return weeks.join(' | ');
  };

  return (
    <div className={`journey-pattern tier-${outlet.tier.toLowerCase()}`}>
      <div className="pattern-header">
        <Space>
          <ShopOutlined />
          <Text strong>{outlet.name}</Text>
          <Tag color={tierColors[outlet.tier]}>{outlet.tier}</Tag>
        </Space>
      </div>
      <div className="pattern-display">
        <CalendarOutlined />
        <Text className="pattern-text">
          {formatPattern(pattern)}
        </Text>
      </div>
      <div className="pattern-frequency">
        <Badge 
          color={frequencyColors[pattern.frequency]} 
          text={pattern.frequency} 
        />
      </div>
    </div>
  );
};

// Pattern display styles
.journey-pattern {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: var(--primary-color);
  }
  
  &.tier-gold {
    border-left: 4px solid #FFB800;
  }
  
  &.tier-silver {
    border-left: 4px solid #8C8C8C;
  }
  
  &.tier-bronze {
    border-left: 4px solid #D4380D;
  }
  
  .pattern-display {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0;
    
    .pattern-text {
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-secondary);
      background: var(--gray-2);
      padding: 4px 8px;
      border-radius: 4px;
    }
  }
}
```

### 9.6 Sales Calendar Picker
```tsx
const SalesCalendarPicker = ({ value, onChange }) => {
  const [calendarType, setCalendarType] = useState('4-4-5');
  const [fiscalYearStart, setFiscalYearStart] = useState(dayjs('2024-04-01'));
  
  return (
    <Card className="sales-calendar-picker">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div className="calendar-type-selector">
          <Text strong>Calendar Type</Text>
          <Radio.Group 
            value={calendarType} 
            onChange={e => setCalendarType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="4-4-5">4-4-5</Radio.Button>
            <Radio.Button value="4-5-4">4-5-4</Radio.Button>
            <Radio.Button value="5-4-4">5-4-4</Radio.Button>
            <Radio.Button value="standard">Standard</Radio.Button>
          </Radio.Group>
        </div>
        
        <div className="fiscal-year-selector">
          <Text strong>Fiscal Year Start</Text>
          <DatePicker 
            value={fiscalYearStart}
            onChange={setFiscalYearStart}
            format="MMMM D"
            style={{ width: '100%' }}
          />
        </div>
        
        <div className="period-preview">
          <Text strong>Period Structure Preview</Text>
          <div className="period-grid">
            {generatePeriods(calendarType, fiscalYearStart).map(period => (
              <div key={period.number} className="period-card">
                <Text type="secondary">Period {period.number}</Text>
                <Text strong>{period.name}</Text>
                <Text className="week-count">{period.weeks} weeks</Text>
              </div>
            ))}
          </div>
        </div>
      </Space>
    </Card>
  );
};

// Calendar picker styles
.sales-calendar-picker {
  .calendar-type-selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
  }
  
  .period-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    margin-top: 12px;
    
    .period-card {
      background: var(--gray-2);
      padding: 12px;
      border-radius: 6px;
      text-align: center;
      
      .week-count {
        display: block;
        font-size: 12px;
        color: var(--text-tertiary);
        margin-top: 4px;
      }
    }
  }
}
```

### 9.7 Holiday Calendar View
```tsx
const HolidayCalendarView = ({ territory, month }) => {
  const [holidays, setHolidays] = useState([]);
  const [events, setEvents] = useState([]);
  
  const dateCellRender = (date) => {
    const dayHolidays = holidays.filter(h => 
      dayjs(h.date).isSame(date, 'day')
    );
    const dayEvents = events.filter(e => 
      dayjs(e.date).isSame(date, 'day')
    );
    
    return (
      <div className="calendar-cell-content">
        {dayHolidays.map(holiday => (
          <div 
            key={holiday.id} 
            className={`holiday-indicator ${holiday.impact}`}
            title={`${holiday.name} - ${holiday.impact}`}
          >
            {holiday.type === 'NATIONAL' && '🇮🇳'}
            {holiday.type === 'RELIGIOUS' && '🕉️'}
            {holiday.type === 'REGIONAL' && '📍'}
          </div>
        ))}
        {dayEvents.map(event => (
          <div 
            key={event.id} 
            className="event-indicator"
            title={event.name}
          >
            {event.type === 'FESTIVAL' && '🎊'}
            {event.type === 'MARKET_DAY' && '🛍️'}
            {event.type === 'PROMOTION' && '📢'}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="holiday-calendar-view">
      <div className="calendar-header">
        <Title level={4}>Sales Calendar - {territory}</Title>
        <Space>
          <Badge color="red" text="No Operations" />
          <Badge color="orange" text="No Sales" />
          <Badge color="blue" text="Special Event" />
        </Space>
      </div>
      
      <Calendar 
        dateCellRender={dateCellRender}
        headerRender={({ value, onChange }) => (
          <div className="calendar-nav">
            <Button 
              icon={<LeftOutlined />} 
              onClick={() => onChange(value.subtract(1, 'month'))}
            />
            <Title level={5}>{value.format('MMMM YYYY')}</Title>
            <Button 
              icon={<RightOutlined />} 
              onClick={() => onChange(value.add(1, 'month'))}
            />
          </div>
        )}
      />
      
      <div className="holiday-legend">
        <Space direction="vertical">
          <Text strong>Holiday Types:</Text>
          <Space wrap>
            <span>🇮🇳 National</span>
            <span>🕉️ Religious</span>
            <span>📍 Regional</span>
            <span>🎊 Festival</span>
            <span>🛍️ Market Day</span>
            <span>📢 Promotion</span>
          </Space>
        </Space>
      </div>
    </div>
  );
};

// Holiday calendar styles
.holiday-calendar-view {
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .calendar-nav {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
  }
  
  .ant-picker-calendar-date-content {
    position: relative;
    height: 80px;
  }
  
  .calendar-cell-content {
    position: absolute;
    top: 4px;
    right: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .holiday-indicator {
    font-size: 16px;
    cursor: help;
    
    &.NO_OPERATIONS {
      filter: grayscale(100%);
      opacity: 0.7;
    }
    
    &.NO_SALES {
      filter: sepia(100%);
    }
    
    &.REDUCED_HOURS {
      opacity: 0.8;
    }
  }
  
  .event-indicator {
    font-size: 14px;
    cursor: help;
  }
  
  .holiday-legend {
    margin-top: 24px;
    padding: 16px;
    background: var(--gray-2);
    border-radius: 8px;
  }
}
```

### 9.8 Priority-Based Sequencing Toggle
```tsx
const PrioritySequencingToggle = ({ value, onChange, disabled }) => {
  const [customWeights, setCustomWeights] = useState({
    tier: 30,
    stockRisk: 30,
    orderValue: 40
  });
  
  const [showWeights, setShowWeights] = useState(false);
  
  return (
    <div className="priority-sequencing-toggle">
      <div className="toggle-header">
        <Space>
          <Text strong>Optimization Strategy</Text>
          <Tooltip title="Choose how outlets are sequenced within routes">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      </div>
      
      <Radio.Group 
        value={value} 
        onChange={e => {
          onChange(e.target.value);
          setShowWeights(e.target.value === 'BUSINESS_PRIORITY');
        }}
        className="strategy-selector"
      >
        <Radio value="GEOGRAPHIC" className="strategy-option">
          <Space>
            <EnvironmentOutlined />
            <div>
              <div className="option-title">Geographic</div>
              <Text type="secondary" className="option-desc">
                Minimize travel distance
              </Text>
            </div>
          </Space>
        </Radio>
        
        <Radio value="BUSINESS_PRIORITY" className="strategy-option">
          <Space>
            <TrophyOutlined />
            <div>
              <div className="option-title">Business Priority</div>
              <Text type="secondary" className="option-desc">
                Tier + Analytics based
              </Text>
            </div>
          </Space>
        </Radio>
        
        <Radio value="HYBRID" className="strategy-option">
          <Space>
            <MergeCellsOutlined />
            <div>
              <div className="option-title">Hybrid</div>
              <Text type="secondary" className="option-desc">
                Priority within zones
              </Text>
            </div>
          </Space>
        </Radio>
      </Radio.Group>
      
      <Collapse 
        ghost 
        activeKey={showWeights ? ['weights'] : []}
        className="weights-panel"
      >
        <Panel 
          header="Priority Weights" 
          key="weights"
          showArrow={false}
        >
          <div className="weight-sliders">
            <div className="weight-item">
              <div className="weight-label">
                <CrownOutlined />
                <Text>Outlet Tier</Text>
                <Text strong>{customWeights.tier}%</Text>
              </div>
              <Slider
                value={customWeights.tier}
                onChange={val => updateWeight('tier', val)}
                disabled={disabled}
              />
            </div>
            
            <div className="weight-item">
              <div className="weight-label">
                <WarningOutlined />
                <Text>Stock Risk</Text>
                <Text strong>{customWeights.stockRisk}%</Text>
              </div>
              <Slider
                value={customWeights.stockRisk}
                onChange={val => updateWeight('stockRisk', val)}
                disabled={disabled}
              />
            </div>
            
            <div className="weight-item">
              <div className="weight-label">
                <DollarOutlined />
                <Text>Order Value</Text>
                <Text strong>{customWeights.orderValue}%</Text>
              </div>
              <Slider
                value={customWeights.orderValue}
                onChange={val => updateWeight('orderValue', val)}
                disabled={disabled}
              />
            </div>
          </div>
          
          <Alert
            message={`Total: ${Object.values(customWeights).reduce((a,b) => a+b, 0)}%`}
            type={Object.values(customWeights).reduce((a,b) => a+b, 0) === 100 ? 'success' : 'warning'}
            showIcon
          />
        </Panel>
      </Collapse>
    </div>
  );
};

// Priority toggle styles
.priority-sequencing-toggle {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  
  .toggle-header {
    margin-bottom: 16px;
  }
  
  .strategy-selector {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .strategy-option {
      display: flex;
      padding: 12px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        border-color: var(--primary-color);
        background: var(--gray-2);
      }
      
      &.ant-radio-wrapper-checked {
        border-color: var(--primary-color);
        background: rgba(124, 0, 239, 0.04);
      }
      
      .option-title {
        font-weight: 500;
        margin-bottom: 2px;
      }
      
      .option-desc {
        font-size: 12px;
      }
    }
  }
  
  .weights-panel {
    margin-top: 16px;
    
    .weight-sliders {
      display: flex;
      flex-direction: column;
      gap: 20px;
      
      .weight-item {
        .weight-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          
          .anticon {
            font-size: 16px;
            color: var(--primary-color);
          }
          
          > span:last-child {
            margin-left: auto;
            color: var(--primary-color);
          }
        }
        
        .ant-slider {
          margin: 0;
          
          .ant-slider-track {
            background: var(--primary-color);
          }
          
          .ant-slider-handle {
            border-color: var(--primary-color);
          }
        }
      }
    }
  }
}
```

---

## 10. Animation Guidelines

### Timing Functions
```scss
// Standard easing functions
$ease-base: cubic-bezier(0.4, 0, 0.2, 1);      // Default easing
$ease-out: cubic-bezier(0.0, 0, 0.2, 1);       // Deceleration
$ease-in: cubic-bezier(0.4, 0, 1, 1);          // Acceleration
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);    // Standard

// Spring animations for delightful interactions
$spring-default: cubic-bezier(0.175, 0.885, 0.32, 1.275);
$spring-gentle: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Duration Scale
```scss
$duration-instant: 100ms;   // Immediate feedback
$duration-fast: 150ms;      // Hover states, small transitions
$duration-base: 200ms;      // Default transitions
$duration-moderate: 300ms;  // Panel slides, tooltips
$duration-slow: 500ms;      // Modal opens, page transitions
$duration-deliberate: 800ms; // Route drawing animations
```

### Map-Specific Animations
```javascript
// Route polyline drawing animation
const drawRoute = (path, map) => {
  const route = new google.maps.Polyline({
    path: [],
    geodesic: true,
    strokeColor: routeColors[routeIndex],
    strokeOpacity: 0,
    strokeWeight: 4,
    map: map
  });
  
  // Animate drawing
  let step = 0;
  const numSteps = 100;
  const timePerStep = 1500 / numSteps;
  
  const interval = setInterval(() => {
    step++;
    if (step > numSteps) {
      clearInterval(interval);
      route.setOptions({ strokeOpacity: 1.0 });
    } else {
      const progress = step / numSteps;
      const pathProgress = Math.floor(path.length * progress);
      route.setPath(path.slice(0, pathProgress));
      route.setOptions({ strokeOpacity: progress });
    }
  }, timePerStep);
};

// Marker drop animation with stagger
const dropMarkers = (markers, map) => {
  markers.forEach((marker, index) => {
    setTimeout(() => {
      marker.setMap(map);
      marker.setAnimation(google.maps.Animation.DROP);
    }, index * 50); // 50ms stagger
  });
};
```

### Loading Animations
```scss
// Skeleton pulse animation
@keyframes skeleton-pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.ant-skeleton-element {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

// Route optimization progress
.optimization-progress {
  .progress-indicator {
    animation: spin 1s linear infinite;
  }
  
  .progress-dots {
    span {
      animation: bounce 1.4s infinite ease-in-out both;
      
      &:nth-child(1) { animation-delay: -0.32s; }
      &:nth-child(2) { animation-delay: -0.16s; }
    }
  }
}
```

---

## 11. Accessibility

### Focus Management
```scss
// Consistent focus outline across all interactive elements
*:focus-visible {
  outline: 2px solid $primary-base;
  outline-offset: 2px;
  border-radius: 2px;
}

// Map control specific focus
.map-control {
  &:focus {
    box-shadow: 0 0 0 3px rgba(124, 0, 239, 0.3);
  }
}

// Remove focus outline for mouse users
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Color Contrast Requirements
- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text** (18px+): 3:1 contrast ratio minimum
- **UI components**: 3:1 contrast ratio minimum
- **Decorative elements**: No requirement

### Screen Reader Support
```tsx
// Proper ARIA labels for map controls
<Button
  icon={<AimOutlined />}
  aria-label="Center map on current territory"
  title="Center map on current territory"
/>

// Route visibility toggle with context
<Switch
  checked={routeVisible}
  aria-label={`Toggle visibility for ${salesPerson.name}'s route`}
  role="switch"
  aria-checked={routeVisible}
/>

// Live region for optimization status
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {isOptimizing 
    ? 'Route optimization in progress' 
    : 'Route optimization complete'}
</div>
```

### Keyboard Navigation
```tsx
// Custom keyboard shortcuts
const keyboardShortcuts = {
  'Ctrl+O': 'Open optimization panel',
  'Ctrl+T': 'Toggle territory view',
  'Ctrl+R': 'Toggle route visibility',
  'Escape': 'Close current modal/panel',
  'Tab': 'Navigate through controls',
  'Arrow keys': 'Pan map when focused'
};

// Implement keyboard handler
useEffect(() => {
  const handleKeyboard = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'o') {
      e.preventDefault();
      openOptimizationPanel();
    }
    // ... other shortcuts
  };
  
  document.addEventListener('keydown', handleKeyboard);
  return () => document.removeEventListener('keydown', handleKeyboard);
}, []);
```

### Color Blind Considerations
```scss
// Use patterns and shapes in addition to color
.outlet-marker {
  &.tier-gold {
    fill: $tier-gold;
    stroke: darken($tier-gold, 20%);
    stroke-width: 2;
    // Star shape for gold
  }
  
  &.tier-silver {
    fill: $tier-silver;
    stroke: darken($tier-silver, 20%);
    stroke-width: 2;
    // Diamond shape for silver
  }
  
  &.tier-bronze {
    fill: $tier-bronze;
    stroke: darken($tier-bronze, 20%);
    stroke-width: 2;
    // Circle shape for bronze
  }
}

// Alternative route identification
.route-line {
  &[data-route="1"] {
    stroke-dasharray: none;  // Solid
  }
  &[data-route="2"] {
    stroke-dasharray: 10, 5;  // Dashed
  }
  &[data-route="3"] {
    stroke-dasharray: 2, 2;   // Dotted
  }
}
```

---

## 12. Dark Mode (Future Consideration)

### Color Adjustments
```scss
[data-theme="dark"] {
  // Core colors
  --primary: #9D2FFF;           // Lighter purple for dark bg
  --primary-hover: #B24FFF;
  --primary-active: #7C00EF;
  
  // Backgrounds
  --background: #0A0A0A;        // Deep black
  --surface: #141414;           // Card background
  --surface-light: #1F1F1F;     // Hover states
  
  // Borders
  --border: #303030;
  --border-light: #404040;
  
  // Text
  --text-primary: #FFFFFF;
  --text-secondary: #A0A0A0;
  --text-disabled: #606060;
  
  // Map specific
  --map-overlay-bg: #1A1A1A;
  --map-overlay-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
}
```

### Google Maps Dark Theme
```javascript
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  // ... additional styles
];
```

### Component Adaptations
```scss
// Dark mode card styling
[data-theme="dark"] {
  .ant-card {
    background: var(--surface);
    border-color: var(--border);
    
    .ant-card-head {
      border-color: var(--border);
      color: var(--text-primary);
    }
  }
  
  // Table adjustments
  .ant-table {
    background: var(--surface);
    
    .ant-table-thead > tr > th {
      background: var(--surface-light);
      border-color: var(--border);
    }
    
    .ant-table-tbody > tr > td {
      border-color: var(--border);
    }
    
    .ant-table-tbody > tr:hover > td {
      background: var(--surface-light);
    }
  }
  
  // Map overlay adjustments
  .map-overlay {
    background: var(--map-overlay-bg);
    box-shadow: var(--map-overlay-shadow);
    border: 1px solid var(--border);
  }
}
```

---

## Implementation Checklist

### Initial Setup
- [ ] Configure Ant Design theme with custom tokens
- [ ] Set up CSS variables for dynamic theming
- [ ] Create base component library with consistent patterns
- [ ] Implement responsive grid system
- [ ] Set up icon library with custom SRTO icons

### Component Development
- [ ] Build reusable card components
- [ ] Create map overlay system
- [ ] Implement data table configurations
- [ ] Design loading states and skeletons
- [ ] Build notification system
- [ ] Implement journey pattern display components
- [ ] Create calendar picker and view components
- [ ] Build priority-based sequencing toggle

### Map Integration
- [ ] Style Google Maps with brand colors
- [ ] Create custom marker designs
- [ ] Implement route visualization
- [ ] Add territory boundary rendering
- [ ] Build map control panels

### Accessibility
- [ ] Audit color contrast ratios
- [ ] Implement keyboard navigation
- [ ] Add ARIA labels and roles
- [ ] Test with screen readers
- [ ] Validate focus management

### Performance
- [ ] Optimize animation performance
- [ ] Implement component lazy loading
- [ ] Add virtualization for large lists
- [ ] Minimize map re-renders
- [ ] Profile and optimize bundle size

---

## Version History

### Version 1.1 (December 2024)
- Added Journey Pattern Display component (Section 9.5)
- Added Sales Calendar Picker component (Section 9.6)
- Added Holiday Calendar View component (Section 9.7)
- Added Priority-Based Sequencing Toggle component (Section 9.8)
- Updated for Phase 2 journey plan requirements

### Version 1.0 (November 2024)
- Initial design guide creation
- Core design system established
- Basic component library defined

---

## Appendix: Quick Reference

### CSS Class Naming Convention
```scss
// BEM-inspired naming
.srto-[component]              // Component block
.srto-[component]__[element]   // Component element
.srto-[component]--[modifier]  // Component modifier

// Examples
.srto-route-card
.srto-route-card__header
.srto-route-card--optimizing

// State classes
.is-loading
.is-active
.is-disabled
.has-error
```

### Component Import Structure
```typescript
// Organize imports by category
import React, { useState, useEffect } from 'react';

// Ant Design components
import { Card, Button, Table, Space } from 'antd';

// Icons
import { 
  EnvironmentOutlined, 
  ThunderboltOutlined 
} from '@ant-design/icons';

// Custom components
import { RouteMap, OutletMarker } from '@/components/maps';

// Hooks and utilities
import { useOptimization } from '@/hooks';
import { formatDistance } from '@/utils';

// Types
import type { Route, Outlet } from '@/types';
```

### Performance Budget
- Initial bundle size: < 250KB gzipped
- Time to Interactive: < 3 seconds
- Map initialization: < 2 seconds
- Route optimization feedback: < 500ms
- Smooth scrolling: 60 FPS

---

This design guide serves as a living document and should be updated as the SRTO platform evolves. Regular reviews and updates ensure consistency and maintain high-quality user experience standards.