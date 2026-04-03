---
title: "Spacecraft"
order: 2
---

<h1 id="sec-2">2. Spacecraft</h1>
<p>This section catalogues spacecraft types, propulsion systems, and onboard subsystems used across all mission profiles.</p>

<h2 id="sec-2-1">2.1 Spacecraft Types</h2>
<p>Every spacecraft in the fleet is categorized by its primary role. The registry below lists each vessel class alongside its key specifications.</p>

<h3 id="sec-2-1-1">2.1.1 Spacecraft Registry</h3>
<p>Every spacecraft in the fleet is categorized by its primary role. The registry below lists each vessel class alongside its key specifications.</p>

<!-- <div class="doc-table-wrap">
  <table>
    <thead>
      <tr>
        <th>Designation</th>
        <th>Role</th>
        <th>Crew Capacity</th>
        <th>Propulsion</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr id="row-atlas">
        <td>Atlas IV</td>
        <td>Heavy cargo transport</td>
        <td>0 (autonomous)</td>
        <td><a href="#row-prop-ion">Ion drive</a></td>
        <td>Active</td>
      </tr>
      <tr id="row-horizon">
        <td>Horizon</td>
        <td>Deep-space exploration</td>
        <td>6</td>
        <td><a href="#row-prop-fusion">Fusion pulse</a></td>
        <td>Active</td>
      </tr>
      <tr id="row-meridian">
        <td>Meridian</td>
        <td>Orbital crew shuttle</td>
        <td>12</td>
        <td><a href="#row-prop-chemical">Chemical bipropellant</a></td>
        <td>Active</td>
      </tr>
      <tr id="row-voyager-x">
        <td>Voyager X</td>
        <td>Interstellar probe</td>
        <td>0 (autonomous)</td>
        <td><a href="#row-prop-ion">Ion drive</a></td>
        <td>In transit</td>
      </tr>
      <tr id="row-sentinel">
        <td>Sentinel</td>
        <td>Station resupply</td>
        <td>4</td>
        <td><a href="#row-prop-chemical">Chemical bipropellant</a></td>
        <td>Retired</td>
      </tr>
    </tbody>
  </table>
</div> -->

<h4 id="sec-2-1-1-1">2.1.1.1 Registry by Status</h4>
<p>Vessels are grouped by operational status for quick reference.</p>

<h5 id="sec-2-1-1-1-1">2.1.1.1.1 Active</h5>
<p>Active craft are cleared for mission assignment and available in the pool. Atlas IV, Horizon, and Meridian currently hold Active status. Each has passed the latest readiness review and is eligible for tasking.</p>

<h5 id="sec-2-1-1-1-2">2.1.1.1.2 In-Transit</h5>
<p>In-transit vessels are already committed to a mission and cannot be reassigned until the current mission ends. Voyager X is in transit. Status is updated when the craft reaches its destination or is formally released from the mission.</p>

<h5 id="sec-2-1-1-1-3">2.1.1.1.3 Retired</h5>
<p>Retired craft are no longer in the operational fleet. No further missions or refits are planned; see <a href="#sec-2-5">Maintenance and Refit</a> for retirement criteria. Sentinel is retired.</p>

<h5 id="sec-2-1-1-1-4">2.1.1.1.4 Standby and Reserve</h5>
<p>Standby or reserve status applies to craft that are temporarily unavailable (e.g. in refit, awaiting certification, or held in reserve). They remain on the registry but are excluded from the active mission pool until status is updated.</p>

<h4 id="sec-2-1-1-2">2.1.1.2 Registry by Role</h4>
<p>Role determines mission type and certification.</p>

<h5 id="sec-2-1-1-2-1">2.1.1.2.1 Active and In-Transit</h5>
<p>Atlas IV, Horizon, Meridian, and Voyager X are currently in the active fleet or in transit. Active craft are cleared for mission assignment; in-transit craft are already committed.</p>
<p>Atlas IV, Horizon, Meridian, and Voyager X are currently in the active fleet or in transit. Active craft are cleared for mission assignment; in-transit craft are already committed.</p>

<h5 id="sec-2-1-1-2-2">2.1.1.2.2 Retired</h5>
<p>Sentinel is retired. No further missions or refits are planned; see <a href="#sec-2-5">Maintenance and Refit</a> for retirement criteria.</p>

<h5 id="sec-2-1-1-2-3">2.1.1.2.3 Crewed Vessels</h5>
<p>Horizon and Meridian are human-rated and support crew. Capacity and life-support limits apply.</p>
<p>1</p><p>1</p><p>1</p><p>1</p><p>1</p>

<h5 id="sec-2-1-1-2-4">2.1.1.2.4 Cargo and Probe</h5>
<p>Atlas IV (cargo) and Voyager X (probe) are uncrewed. Different safety and comm protocols apply.</p>

<h5 id="sec-2-1-1-2-5">2.1.1.2.5 Registry Maintenance and Reclassification</h5>
<p>The spacecraft registry is maintained by Mission Planning and updated whenever a vessel’s role or status changes. Reclassification is required when a craft is repurposed (e.g. from crewed shuttle to cargo-only after human-rating lapse), when a new class is introduced, or when a vessel is retired.</p>
<p>Proposed changes are submitted via the Registry Change Request (RCR) form and reviewed by the Fleet Director. Approval updates the master registry, the mission-assignment rules, and the certification matrix. No vessel may be assigned to a mission type for which it is not currently certified in the registry.</p>
<p>Historical role and status are preserved in the registry archive so that past missions can be correctly attributed. For audit and training, the archive is read-only; only the current snapshot is used for planning and operations.</p>
<p>Registry entries include: designation, role, crew capacity, propulsion system, status, date of last reclassification, and (for retired craft) retirement date and reason. Optional notes may record temporary role changes (e.g. a crewed vessel used in uncrewed mode for a test flight).</p>
<p>At least once per quarter, Mission Planning reconciles the registry against the actual fleet: every active or in-transit vessel must have a current registry entry, and every registry entry must correspond to a real asset or a formally retired vessel. Discrepancies are escalated to the Fleet Director and corrected before the next planning cycle.</p>

<h3 id="sec-2-1-2">2.1.2 Propulsion Systems</h3>
<p>Each propulsion system defines the thrust profile and fuel requirements for its class of spacecraft. See the <a href="#sec-2-1-1">Spacecraft Registry</a> for which vessels use each system.</p>
<div class="doc-table-wrap">
  <table>
    <thead>
      <tr>
        <th>System</th>
        <th>Thrust Class</th>
        <th>Fuel Type</th>
        <th>Specific Impulse</th>
      </tr>
    </thead>
    <tbody>
      <tr id="row-prop-chemical">
        <td>Chemical Bipropellant</td>
        <td>High</td>
        <td>LOX / RP-1</td>
        <td>350 s</td>
      </tr>
      <tr id="row-prop-ion">
        <td>Ion Drive</td>
        <td>Low (sustained)</td>
        <td>Xenon</td>
        <td>3,100 s</td>
      </tr>
      <tr id="row-prop-fusion">
        <td>Fusion Pulse</td>
        <td>Very high</td>
        <td>Deuterium-Tritium</td>
        <td>12,000 s</td>
      </tr>
    </tbody>
  </table>
</div>

<h4 id="sec-2-1-2-1">2.1.2.1 Chemical Propulsion</h4>
<p>High thrust, short burn; used for ascent and insertion.</p>

<h5 id="sec-2-1-2-1-1">2.1.2.1.1 Bipropellant (LOX/RP-1)</h5>
<p>Chemical bipropellant uses liquid oxygen and RP-1. Specific impulse ~350 s. Used by Meridian and (historically) Sentinel.</p>

<h4 id="sec-2-1-2-2">2.1.2.2 Electric Propulsion</h4>
<p>Low thrust, long burn; used for cargo and probes.</p>

<h5 id="sec-2-1-2-2-1">2.1.2.2.1 Ion Drive</h5>
<p>Xenon ion drive, 3,100 s Isp. Used by Atlas IV and Voyager X for efficient long-duration burns.</p>

<h4 id="sec-2-1-2-3">2.1.2.3 Fusion Propulsion</h4>
<p>Very high thrust and Isp; used for deep-space crewed missions.</p>

<h5 id="sec-2-1-2-3-1">2.1.2.3.1 D-T Fusion Pulse</h5>
<p>Deuterium-tritium fusion pulse drive, 12,000 s Isp. Horizon only. Requires dedicated fuel handling and shielding.</p>

<h2 id="sec-2-2">2.2 Design Philosophy</h2>
<p>Fleet vessels are built for modularity and long service life. Standard interfaces allow subsystem swaps and upgrades without full refits. All crewed craft meet the same human-rating and redundancy requirements; uncrewed probes use a lighter but still standardized bus.</p>

<h2 id="sec-2-3">2.3 Subsystems</h2>
<p>All spacecraft share a common set of onboard subsystems, organized hierarchically by function.</p>

<h3 id="sec-2-3-1">2.3.1 Subsystem Overview</h3>
<div class="doc-tree">
  <ul>
    <li><strong>Power</strong>
      <ul>
        <li>Solar Arrays</li>
        <li>RTG (Radioisotope Thermoelectric Generator)</li>
        <li>Battery Bank</li>
      </ul>
    </li>
    <li><strong>Life Support</strong>
      <ul>
        <li>Atmospheric Control</li>
        <li>Water Recovery</li>
        <li>Thermal Regulation</li>
      </ul>
    </li>
    <li><strong>Navigation</strong>
      <ul>
        <li>Star Tracker</li>
        <li>Inertial Measurement Unit</li>
        <li>Ground Uplink Receiver</li>
      </ul>
    </li>
    <li><strong>Communications</strong>
      <ul>
        <li>S-Band Transponder</li>
        <li>Ka-Band High-Gain Antenna</li>
        <li>Laser Comm Terminal</li>
      </ul>
    </li>
  </ul>
</div>

<h4 id="sec-2-3-1-1">2.3.1.1 Power Subsystem</h4>
<p>Power is provided by solar arrays, RTG, or battery depending on mission.</p>

<h5 id="sec-2-3-1-1-1">2.3.1.1.1 Solar and RTG</h5>
<p>LEO craft use solar arrays; deep-space probes may use RTG where sunlight is insufficient.</p>

<h4 id="sec-2-3-1-2">2.3.1.2 Life Support Subsystem</h4>
<p>Crewed craft only. Atmospheric control, water recovery, thermal regulation.</p>

<h5 id="sec-2-3-1-2-1">2.3.1.2.1 Redundancy</h5>
<p>Life support has N+1 redundancy on all crewed missions; failure of one unit does not compromise the crew.</p>

<h3 id="sec-2-3-2">2.3.2 Power Requirements</h3>
<p>Power budgets are computed per mission phase. The following constraints determine total power allocation for the <a href="#row-horizon">Horizon</a> deep-space explorer.</p>

<p><strong>Cruise Phase Budget</strong></p>
<ol class="doc-rules-list" style="list-style: none">
  <li>
    <div class="doc-rule-line doc-rule-conditions"><span class="doc-rule-num"></span><span class="doc-rule-keyword">If</span><span class="doc-rule-content">mission phase = <strong>Cruise</strong></span></div>
    <div class="doc-rule-line doc-rule-then"><span class="doc-rule-num"></span><span class="doc-rule-keyword">Then</span><span class="doc-rule-content">allocate 40% to <strong>Ion Drive</strong>, 25% to <strong>Life Support</strong>, 20% to <strong>Communications</strong>, 15% to <strong>Navigation</strong></span></div>
  </li>
</ol>

<p><strong>Orbital Insertion Budget</strong></p>
<ol class="doc-rules-list" style="list-style: none">
  <li>
    <div class="doc-rule-line doc-rule-conditions"><span class="doc-rule-num"></span><span class="doc-rule-keyword">If</span><span class="doc-rule-content">mission phase = <strong>Orbital Insertion</strong></span></div>
    <div class="doc-rule-line doc-rule-then"><span class="doc-rule-num"></span><span class="doc-rule-keyword">Then</span><span class="doc-rule-content">allocate 65% to <strong>Propulsion</strong>, 20% to <strong>Life Support</strong>, 10% to <strong>Navigation</strong>, 5% to <strong>Communications</strong></span></div>
  </li>
  <li>
    <div class="doc-rule-line doc-rule-conditions"><span class="doc-rule-num"></span><span class="doc-rule-keyword">If</span><span class="doc-rule-content">battery charge &lt; 20%</span></div>
    <div class="doc-rule-line doc-rule-then"><span class="doc-rule-num"></span><span class="doc-rule-keyword">Then</span><span class="doc-rule-content">defer non-essential <strong>Communications</strong> until charge &gt; 40%</span></div>
  </li>
</ol>

<h2 id="sec-2-4">2.4 Mass and Payload</h2>
<p>Payload capacity and dry mass determine which missions each vessel can support. Heavy cargo runs use <a href="#row-atlas">Atlas IV</a>; crew rotations use <a href="/main/#sec-2-1-1">Spacecraft Registry</a> or, for long-duration, <a href="#row-horizon">Horizon</a>. Probe missions are mass-limited by the launch vehicle; Voyager X carries only instruments and comms.</p>

<h2 id="sec-2-5">2.5 Maintenance and Refit</h2>
<p>Every vessel follows a scheduled maintenance regime. Post-flight inspections cover thermal tiles, propulsion plumbing, and avionics. Life-support filters and battery packs are replaced on fixed intervals; ion drives get thruster wear checks after each long burn.</p>
<p>Major refits are planned between missions. During a refit, subsystems can be upgraded (e.g. swapping an older S-Band transponder for a Ka-Band unit), and structural inspections are performed. The <a href="#row-sentinel">Sentinel</a> class was retired after refit costs exceeded the value of continued operation; the <a href="#row-meridian">Meridian</a> fleet now handles the same role with better margins.</p>
<p>Uncrewed craft receive remote diagnostics and, where possible, software and parameter updates. Voyager X cannot be physically serviced but continues to receive command uplinks and trajectory corrections.</p>
