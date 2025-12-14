export default function getHistoryChanges(hierarchy) {
    const allPrograms = [];
    const visitedIds = new Set();
    const differences = [];

    function collectPrograms(item) {
        if (!item) return;

        if (Array.isArray(item.result)) {
            item.result.forEach(collectPrograms);
            return;
        }
        
        if (item.id && !visitedIds.has(item.id)) {
            allPrograms.push(item);
            visitedIds.add(item.id);

            if (Array.isArray(item.children)) {
                item.children.forEach(collectPrograms);
            }

            if (item.parent && item.parent.id && !visitedIds.has(item.parent.id)) {
                collectPrograms(item.parent); 
            }
        }
    }

    collectPrograms(hierarchy);

    allPrograms.sort((a, b) => {
        const ay = a.start_year ?? -Infinity;
        const by = b.start_year ?? -Infinity;
        if (ay !== by) return ay - by;
        return a.id - b.id;
    });

    if (allPrograms.length <= 1) {
        return [];
    }

    for (let i = 1; i < allPrograms.length; i++) {
        const prevProgram = allPrograms[i - 1];
        const currentProgram = allPrograms[i];

        const changes = compareObjects(prevProgram, currentProgram);

        const comparisonResult = {
            meta: {
                id: currentProgram.id,
                start_year: currentProgram.start_year,
                relationship: currentProgram.parent_id === prevProgram.id ? 'child' : currentProgram.id === prevProgram.parent_id ? 'parent' : 'other_program'
            },
            changes: changes || "No differences found (excluding hierarchy fields like parent/children)"
        };

        differences.push(comparisonResult);
    }

    return differences.reverse();
}

function compareObjects(master, current) {
    const changes = {};
    const ignoreKeys = new Set(['parent', 'children', 'result', 'count', 'is_active', 'end_year', 'school_code', 'start_year', 'id', 'parent_id', 'description' ]);

    for (const key in master) {
        if (ignoreKeys.has(key)) continue;

        const masterValue = master[key];
        const currentValue = current[key];

        if (Array.isArray(masterValue) && Array.isArray(currentValue)) {
            const masterStr = (masterValue || []).sort().join(',');
            const currentStr = (currentValue || []).sort().join(',');
            if (masterStr !== currentStr) {
                 changes[key] = {
                    master: masterValue,
                    current: currentValue
                };
            }
        } 
        else if (masterValue !== currentValue) {
            changes[key] = {
                master: masterValue,
                current: currentValue
            };
        }
    }
    
    for (const key in current) {
        if (!master.hasOwnProperty(key) && !ignoreKeys.has(key)) {
            changes[key] = {
                master: undefined,
                current: current[key]
            };
        }
    }

    return Object.keys(changes).length > 0 ? changes : null;
}