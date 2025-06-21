Historical sales order information (purchases of Retailers from Distributors) is incredibly valuable and can be used in several key ways within the Sales Route & Territory Optimizer:

**1. Deriving Service Level Tiers & Visit Frequency:**

*   **How:** Analyze historical sales data to segment outlets.
    *   **Volume/Value:** Outlets contributing the highest sales volume or value (e.g., top 20% contribute 80% of sales - Pareto principle) can be classified as "Gold" tier.
    *   **Order Frequency:** Outlets ordering frequently, even if smaller individual orders, might be "Silver" or "Gold" as they represent consistent business.
    *   **Growth Potential:** Outlets showing consistent growth in purchase volume/frequency, even if not yet top-tier, could be targeted for higher service.
    *   **Product Mix (Lines Per Order - LPO):** Outlets purchasing a wider range of products (higher LPO) might be more engaged and valuable.
*   **Impact on Optimization:**
    *   **Visit Frequency:** Gold outlets might require weekly visits, Silver bi-weekly, Bronze monthly. This becomes a constraint for the multi-day route planner (FR2.3.3). The system needs to ensure an outlet is visited `X` times within a planning cycle (e.g., 4 weeks).
    *   **Resource Allocation:** More strategic outlets (higher tiers) justify more salesperson time.

**2. Estimating Time Spent in Outlet:**

*   **How:**
    *   **Correlation with Order Complexity:** Historically, outlets with larger orders or higher Lines Per Order (LPO) might require more time for order taking, merchandising, and relationship management.
    *   **Average Values per Tier:** Once tiers are defined (see point 1), calculate the average LPO or average order value for outlets in each tier. This can be used as a proxy to set default "time spent in outlet" for that tier.
    *   **Specific Outlet History:** If data is granular enough, the system could learn or be set with specific average visit durations for high-volume individual outlets.
*   **Impact on Optimization:**
    *   More accurate "service time" input for each outlet (FR2.1.1, FR2.3.1) leads to more realistic route schedules and workload calculations.

**3. Setting Productivity Targets & Order Size Goals:**

*   **How:**
    *   **Historical Averages:** Analyze historical average order size (value or units) and LPO per outlet or per outlet tier.
    *   **Benchmarking:** Identify best-performing outlets/salespeople in terms of these metrics.
*   **Impact on Optimization:**
    *   **Input for "Order size min and max drop size target":** Based on historical data, realistic targets can be set. While the optimizer itself might not directly enforce these (it's more about visit sequence), this data is crucial for *evaluating* the quality of territories and routes.
    *   **Post-Optimization Analysis:** The "expected sales" from a route (FR2.5.1) can be compared against these targets. If a route comprises many small-order-history outlets, it might not meet drop size targets without specific sales strategies.

**4. Informing "Expected Sales" & Territory Balancing:**

*   **How:**
    *   **Baseline Sales:** The sum of historical sales for outlets assigned to a route or territory provides a baseline "expected sales" figure.
    *   **Sales Potential:** While historical data is backward-looking, it's often the best indicator of future short-term potential, especially when combined with growth trends.
*   **Impact on Optimization:**
    *   **Territory Design (FR2.2.3):** One of the balancing criteria for assigning outlets to DTs/territories can be "total historical sales value" or "total sales potential derived from historical sales." This helps create equitable territories.
    *   **Reporting (FR2.5.1, FR2.5.2):** The "View expected sales" output heavily relies on this historical data for each route and territory.

**5. Understanding NPPD (New Product Purchase Distribution) Purchase Behavior:**

*   **How:**
    *   **Track New Product Adoption:** By analyzing sales orders over time, identify which outlets are early adopters of new products, which are late adopters, and which rarely purchase new SKUs.
    *   **Link to Product Launches:** If the brand is launching new products, this insight is key.
*   **Impact on Optimization & Sales Strategy (though slightly outside core routing):**
    *   **Prioritization (Indirectly):** Outlets known for good NPPD might be prioritized for visits immediately after a new product launch (this could be a manual adjustment or a temporary "boost" to their service tier).
    *   **Salesperson Focus:** Salespeople can be armed with this knowledge to tailor their pitch. While the optimizer plans the *who* and *when*, this informs the *what* during the visit.
    *   **Segmentation Refinement:** This behavior can be another dimension for outlet segmentation.

**6. Validating and Refining Outlet Data:**

*   **How:**
    *   **Activity Status:** If an outlet has no sales orders for an extended period (e.g., 6 months), it might be inactive or incorrectly assigned. This can flag outlets for review.
    *   **Channel Consistency:** Do purchase patterns align with the designated outlet channel? (e.g., a "small grocery" consistently buying HoReCa pack sizes might be misclassified).
*   **Impact on Optimization:**
    *   Ensures the optimizer is working with accurate and relevant outlet data, improving the quality of its output.

**Data Integration Requirements for Historical Sales:**

To use this effectively, the SRTO product would need to:

1.  **Import Sales Order History:** Allow import of transactional data, typically including:
    *   Outlet ID (to link to outlet master data)
    *   Distributor ID (if relevant for analysis)
    *   Order Date
    *   Product ID/SKU
    *   Quantity Sold
    *   Value Sold
    *   Order ID
2.  **Aggregation & Analysis Capabilities:** The system (or a pre-processing step) needs to be able to aggregate this data (e.g., total sales per outlet over last 12 months, average LPO, order frequency).
3.  **Linkage to Optimization Parameters:** The insights derived (e.g., service tier) must then be translatable into inputs that the optimization algorithms understand (e.g., visit frequency constraints, service time estimates).

By integrating and leveraging historical sales order data, the SRTO moves from a purely logistical optimization tool to a more strategic one, aligning sales effort with actual sales performance and potential.