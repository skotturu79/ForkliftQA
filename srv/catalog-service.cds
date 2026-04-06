service InspectionService @(path: '/api') {

    entity Inspections {
        key INSPECTION_ID    : String(36);
        FORKLIFT_ID          : String(20);
        OPERATOR_NAME        : String(100);
        OPERATOR_ID          : String(20);
        INSPECTION_DATE      : Date;
        SHIFT                : String(10);
        TIRE_PRESSURE        : String(10);
        ODOMETER             : Integer;
        PHYSICAL_CONDITION   : String(10);
        BRAKES               : String(10);
        HYDRAULICS           : String(10);
        HORN_LIGHTS          : String(10);
        REMARKS              : String(500);
        STATUS               : String(15);
        CREATED_BY           : String(100);
        CREATED_AT           : Timestamp;
    }

    @readonly
    entity InspectionSummary {
        key FORKLIFT_ID      : String(20);
        TOTAL_INSPECTIONS    : Integer;
        READY_COUNT          : Integer;
        NOT_READY_COUNT      : Integer;
        LAST_INSPECTION      : Date;
        LAST_ODOMETER        : Integer;
    }
}
