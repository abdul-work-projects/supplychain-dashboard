# 📦 **Product Requirements Document (PRD)**

## **Project: Supply Chain Tracking UI**

---

# **1. Overview**

### **1.1 Product Summary**

The _Supply Chain Tracking UI_ is a web-based platform that provides real-time visibility into the movement of goods across a supply chain network. The system displays shipment statuses, vehicle locations, warehouse inventory levels, transit delays, and route optimizations.
The goal is to integrate multiple data sources into an intuitive, high-performance interface designed for operations managers, logistics teams, and analysts.

### **1.2 Problem Statement**

Businesses face:

- Fragmented visibility across logistics operations
- Delays in identifying bottlenecks
- No centralized view of inventory, shipments, and transport activity
- Difficulty predicting ETA changes in real-time

A data-heavy UI that unifies all supply chain data solves these issues.

### **1.3 Goals**

- Provide end-to-end tracking of shipments
- Enable real-time monitoring of vehicles and warehouses
- Surface actionable insights such as delays, predicted ETAs, and bottlenecks
- Deliver high-speed performance for large data volumes
- Offer intuitive tools for filtering, searching, and analyzing supply chain data

### **1.4 Non-Goals**

- Not building a full logistics ERP
- Not handling actual order fulfillment or dispatching
- Not replacing any transportation management systems (TMS)

---

# **2. Target Users**

### **Primary Users**

- **Logistics Operations Managers**
- **Warehouse Managers**
- **Supply Chain Analysts**

### **Secondary Users**

- Customer service teams
- Business intelligence analysts
- Executive leadership dashboards

---

# **3. Key Use Cases**

### **3.1 Real-Time Shipment Tracking**

Users can:

- Track trucks, ships, or containers in real-time
- See current location on a map
- View status (in transit, delayed, waiting at port, delivered)

### **3.2 Route Visualization**

Users can:

- See planned vs. actual route
- Compare past performance
- Get alerts when routes deviate

### **3.3 Warehouse Inventory Monitoring**

Users can:

- View stock levels across warehouses
- Monitor SKU trends
- See inbound and outbound goods
- Get low-stock alerts

### **3.4 Delay Detection & Alerting**

System automatically flags:

- Late shipments
- Congested routes
- Bottlenecks in specific cities or ports

### **3.5 Shipment Details & Audit Logs**

Users can open a shipment card with:

- Origin & destination
- ETAs & delay timestamps
- Vehicle info
- Temperature logs (cold chain)
- Driver events history

### **3.6 Search + Filter**

Search and filter by:

- Shipment ID
- Container ID
- Route
- Warehouse
- Status
- Priority
- Date range

---

# **4. Feature Requirements**

## **4.1 Dashboard Overview**

### Components:

- KPI tiles:

  - Shipments in transit
  - Delayed shipments
  - Warehouse stock %
  - Active vehicles

- Line charts (trend of delays, delivery rate)
- Heatmap of high traffic routes
- Alerts panel (real-time)

## **4.2 Interactive Global Map**

### Capabilities:

- Show vehicle markers with clustering for 1,000+ points
- Real-time position updates via WebSockets
- Route overlays (planned vs actual)
- Status coloring (green = on time, red = delayed)
- Click to open shipment detail drawer

## **4.3 Shipments Table**

### Requirements:

- Up to 500k rows with virtualization
- Columns:

  - Shipment ID
  - Origin → Destination
  - Current location
  - Status
  - ETA
  - Vehicle ID
  - Delay reason

- Multi-level filters
- Server-side sorting

## **4.4 Warehouse Inventory Module**

### Features:

- Map of warehouse locations
- Inventory levels (bar chart per SKU category)
- Table of inbound/outbound flows
- Low-stock alerts
- Forecasted 7-day stock levels

## **4.5 Shipment Detail Drawer**

When clicking a shipment:

- Timeline (creation → loading → transit → delivered)
- Sensor data:

  - Temperature
  - Humidity
  - Door open/close logs

- Route breakdown
- Vehicle data (driver, license, capacity)
- Event log feed

## **4.6 Alerts & Notifications**

Trigger alerts for:

- Weather disruptions
- Customs hold
- Late pickup
- Carrier delays
- Warehouse congestion

Alerts should appear in:

- Dashboard center feed
- Notification badge
- In-shipment detail view

## **4.7 User Management**

- Roles:

  - Admin
  - Operator
  - Viewer

- Permissions:

  - Data access restrictions by region
  - Read-only vs edit

---

# **5. Data Requirements**

### **5.1 Data Sources**

- GPS location stream
- Shipment metadata
- Warehouse inventory API
- Weather + traffic data provider
- Sensor logs

### **5.2 Data Volume Expectations**

- Vehicle pings: 1M+ per day
- Shipments: 100k active
- Inventory records: 500k rows
- Sensor logs: 50M events/day

### **5.3 Data Refresh Rates**

- Real-time data via WebSockets (1–5 seconds)
- Inventory refresh every 15 minutes
- Summary metrics every 1 minute

---

# **6. Technical Requirements**

### **6.1 Frontend**

- **React + TypeScript**
- **Mapbox GL** for geospatial
- **Recharts / D3** for charts
- **TanStack Table** for large tables
- **WebSockets** for live updates

### **6.2 Backend**

- Node.js or Python API
- WebSocket server
- Time-series database (TimescaleDB or InfluxDB)
- High-volume streams: Kafka or Redis Streams
- Geo queries using PostGIS

### **6.3 Performance Requirements**

- Map should render 10k+ markers without lag
- Tables must smoothly handle 500k rows
- Updates must appear within 5 seconds
- P99 response time < 500 ms

---

# **7. UX / UI Requirements**

### **7.1 Visual Design**

- Light + dark mode
- Flat card-based layout
- Smooth animations
- Traffic color coding:

| Status    | Color  |
| --------- | ------ |
| On time   | Green  |
| At risk   | Yellow |
| Delayed   | Red    |
| Delivered | Gray   |

### **7.2 Navigation**

- Left side nav

  - Dashboard
  - Shipments
  - Map view
  - Warehouses
  - Alerts
  - Settings

### **7.3 Mobile Version**

- Responsive
- Reduced density for tables
- Map interaction supported

---

# **8. Success Metrics**

### **Product Metrics**

- Time to detect delays reduced by 50%
- Operational efficiency increased (fewer manual calls/emails)
- 90% user satisfaction score
- <3-second initial load time

### **Usage Metrics**

- DAU of ops dashboard
- Avg session time
- Number of alerts resolved

---
