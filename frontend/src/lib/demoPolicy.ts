export const DEMO_POLICY_FILENAME = "demo-home-policy.txt";

export const DEMO_POLICY_TEXT = `NORDIC HOME INSURANCE
Policy Number: DEMO-0001
Policyholder: Demo User

SECTION 4 — WATER DAMAGE COVERAGE

4.1 General coverage
This policy covers sudden and unexpected water damage to the insured property caused by:
- Household appliances (washing machines, dishwashers, water heaters)
- Burst or leaking pipes
- Water damage originating from a neighboring unit

4.2 Conditions
Coverage under this section requires:
(a) The loss is reported within 30 days of discovery.
(b) The insured takes reasonable steps to limit further damage once discovered.
(c) Damage caused by gradual wear, poor maintenance, or flooding from natural bodies of water is excluded.

4.3 Coverage limit
Maximum compensation under this section is EUR 5,000 per incident, subject to a EUR 200 deductible.

SECTION 5 — ACCIDENTAL DAMAGE COVERAGE

5.1 General coverage
This policy covers sudden, accidental damage to personal belongings, including electronics and mobile devices,
caused by drops, spills, or impacts.

5.2 Conditions
Coverage requires that the item was in normal working condition immediately before the incident and that the
loss is reported within 14 days.

5.3 Coverage limit
Maximum compensation under this section is EUR 500 per incident, with no deductible.

SECTION 7 — GENERAL EXCLUSIONS

This policy does not cover:
- Intentional damage
- Damage occurring while the property was unoccupied for more than 60 consecutive days
- Pre-existing damage present before the policy start date
- Loss or damage not reported within the timeframes stated above`;

export function createDemoPolicyFile(): File {
  return new File([DEMO_POLICY_TEXT], DEMO_POLICY_FILENAME, { type: "text/plain" });
}
