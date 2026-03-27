import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const inputDir = './input_json';
const outputDir = './Output_json';
const compareDir = './comparision';

/**
 * Flattens a deeply nested JSON object into a single layer with dot-notation paths.
 * Useful for comparing structures of varying depths.
 */
function flattenObject(ob) {
    let toReturn = {};
    for (let i in ob) {
        if (!ob.hasOwnProperty(i)) continue;
        if ((typeof ob[i]) === 'object' && ob[i] !== null) {
            let flatObject = flattenObject(ob[i]);
            for (let x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;
                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

export const compareJsonFiles = () => {
    console.log(`🔍 Starting JSON comparison process...`);
    
    if (!fs.existsSync(compareDir)) {
        fs.mkdirSync(compareDir, { recursive: true });
    }

    if (!fs.existsSync(inputDir)) {
        console.error(`❌ Input directory ${inputDir} does not exist.`);
        return;
    }

    const inputFiles = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));

    if (inputFiles.length === 0) {
        console.log(`⚠️ No JSON files found in ${inputDir}.`);
        return;
    }

    for (const file of inputFiles) {
        console.log(`\n📄 Comparing file: ${file}`);
        
        const inputFilePath = path.join(inputDir, file);
        const outputFilePath = path.join(outputDir, `x${file}`);

        if (!fs.existsSync(outputFilePath)) {
            console.log(`⚠️ Output file missing: ${outputFilePath} (Has the export process run?)`);
            continue;
        }

        let inputData, outputData;
        try {
            inputData = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));
            outputData = JSON.parse(fs.readFileSync(outputFilePath, 'utf8'));
        } catch (e) {
            console.error(`❌ Error parsing JSON for ${file}:`, e.message);
            continue;
        }

        // Flatten both JSON objects
        const flatInput = flattenObject(inputData);
        const flatOutput = flattenObject(outputData);

        const allKeys = new Set([...Object.keys(flatInput), ...Object.keys(flatOutput)]);
        
        const differences = [];

        for (const key of allKeys) {
            const inVal = flatInput[key];
            const outVal = flatOutput[key];

            // Compare values. If one is missing or deeply different, report it.
            if (inVal !== outVal) {
                differences.push({
                    'JSON Path Keys': key,
                    'Input Value (input_json)': inVal !== undefined ? String(inVal) : 'MISSING IN INPUT',
                    'Output Value (Output_json)': outVal !== undefined ? String(outVal) : 'MISSING IN OUTPUT'
                });
            }
        }

        if (differences.length === 0) {
            console.log(`✅ No differences found. Both files are structurally identical.`);
            differences.push({
                'JSON Path Keys': 'Identical',
                'Input Value (input_json)': 'Match',
                'Output Value (Output_json)': 'Match'
            });
        }

        // Generate Excel Worksheet
        const worksheet = xlsx.utils.json_to_sheet(differences);
        
        // Auto-size columns to be easily readable
        const wscols = [
            { wch: 50 }, // Path
            { wch: 35 }, // Input
            { wch: 35 }  // Output
        ];
        worksheet['!cols'] = wscols;

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Differences');

        const excelName = `Diff_Comparison_${file.replace('.json', '.xlsx')}`;
        const excelPath = path.join(compareDir, excelName);

        xlsx.writeFile(workbook, excelPath);
        console.log(`📊 Differences successfully dumped to Excel: ${excelPath}`);
    }
    
    console.log(`\n🎉 COMPARISON COMPLETE`);
};

// Execute if run directly via `node 04_comparision.js`
compareJsonFiles();
