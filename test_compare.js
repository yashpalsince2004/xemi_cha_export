const fs = require('fs');
const inputPath = './input_json/SB_output.json';
const outputPath = './Output_json/xSB_output.json';
const inputJson = JSON.parse(fs.readFileSync(inputPath));
const outputJson = JSON.parse(fs.readFileSync(outputPath));
const generalMapping = {
    Exporter_Name: 'impExpName',
    Branch_Name_Sr_No: 'branchNameSrNo',
    AD_Code: 'adCode',
    Exporter_Type: 'exporterType',
    Mode_Of_Transport: 'modeOfTransport',
    Custom_House: 'customHouse',
    Port_of_Discharge: 'portOfDischarge',
    Country_of_Discharge: 'countryOfDischarge',
    Port_of_Destination: 'portOfDestination',
    Country_of_Destination: 'countryOfDestination',
    SB_Type: 'sbType',
    Consignee_Name: 'consigneeName',
    Consignee_Address: 'consigneeAddress',
    Consignee_Country: 'consigneeCountry',
    Consignee_Buyer_Same: 'consigneeBuyerSame',
    Consignor_Manufacturer_Same_for_All_Items: 'consignorManufacturerSameForAllItems',
    NFEI: 'nfei',
    Warehouse_Code: 'warehouseCode',
    SEZ_Unit_Code: 'sezUnitCode',
    Drawback_Beneficiary: 'drawbackBeneficiary',
    Nature_of_Cargo: 'natureOfCargo',
    Seal_Type: 'sealType',
    Gross_Weight: 'grossWeight',
    Type: 'type',
    Net_Weight: 'netWeight',
    RBI_Waiver_No: 'rbiWaiverNo',
    RBI_Waiver_Date: 'rbiWaiverDate',
    EPZ_Code: 'epzCode',
    No_of_Packages: 'noOfPackages',
    Pkg_Unit: 'pkgUnit',
    Loose_Packages: 'loosePackages',
    Rotation_No: 'rotationNo',
    Rotation_Date: 'rotationDate',
    Is_Factory_Stuffed: 'isFactoryStuffed',
    Is_Sample_Accompanied: 'isSampleAccompanied',
    'Marks_&_Numbers': 'marksAndNumbers',
    EOU_Company_Name: 'eouCompanyName',
    EOU_IEC_Number: 'eouIecNumber',
    EOU_Company_Address: 'eouCompanyAddress',
    Examiner: 'examiner',
    Examiner_Designation: 'examinerDesignation',
    Examination_Date: 'examinationDate',
    Supervisor: 'supervisor',
    Supervisor_Designation: 'supervisorDesignation',
    Seal_No: 'sealNo',
    Commissionerate: 'commissionerate',
    Division: 'division',
    Range: 'range',
    Is_Verified_by_Examining_Officer: 'isVerifiedByExaminingOfficer',
    Sample_Forward: 'sampleForward'
};

function mapKeys(obj, mapping) {
    const res = {};
    for (let key in obj) {
        const mapped = mapping[key] || key;
        res[mapped] = obj[key];
    }
    return res;
}
const genIn = mapKeys(inputJson.GENERAL?.[0] || {}, generalMapping);
const genOut = outputJson.master?.sbModel?.[0] || {};

console.log(Object.keys(genOut).filter(k => !(k in genIn)));
console.log(Object.keys(genIn).filter(k => !(k in genOut)));
