const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {

    this.on('READ', 'Inspections', async (req) => {
        const tx = cds.transaction(req);
        return tx.run('SELECT * FROM "INSPECTIONS" ORDER BY "CREATED_AT" DESC');
    });

    this.on('READ', 'InspectionSummary', async (req) => {
        const tx = cds.transaction(req);
        return tx.run('SELECT * FROM "INSPECTION_SUMMARY"');
    });

    this.on('CREATE', 'Inspections', async (req) => {
        const tx = cds.transaction(req);
        const d = req.data;
        const id = d.INSPECTION_ID || cds.utils.uuid();

        // Determine status: NOT_READY if any check is FAIL
        const checks = [d.TIRE_PRESSURE, d.PHYSICAL_CONDITION, d.BRAKES, d.HYDRAULICS, d.HORN_LIGHTS];
        const status = checks.some(c => c === 'FAIL') ? 'NOT_READY' : 'READY';

        await tx.run(
            `INSERT INTO "INSPECTIONS" (
                "INSPECTION_ID","FORKLIFT_ID","OPERATOR_NAME","OPERATOR_ID",
                "INSPECTION_DATE","SHIFT","TIRE_PRESSURE","ODOMETER",
                "PHYSICAL_CONDITION","BRAKES","HYDRAULICS","HORN_LIGHTS",
                "REMARKS","STATUS","CREATED_BY","CREATED_AT"
            ) VALUES (?,?,?,?,CURRENT_DATE,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`,
            [id, d.FORKLIFT_ID, d.OPERATOR_NAME, d.OPERATOR_ID,
             d.SHIFT || 'DAY', d.TIRE_PRESSURE, d.ODOMETER || 0,
             d.PHYSICAL_CONDITION, d.BRAKES, d.HYDRAULICS, d.HORN_LIGHTS,
             d.REMARKS || '', status, d.OPERATOR_NAME]
        );

        return { INSPECTION_ID: id, STATUS: status, ...d };
    });
});
