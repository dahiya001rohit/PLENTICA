import React, { useEffect, useState } from 'react';

const Bottom = ({ data }) => {
    const [plantingGrid, setPlantingGrid] = useState([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ]);
    const [dataField, setDataField] = useState([]);

    useEffect(() => {
        if (data && data.plantingGrid) {
            setPlantingGrid(data.plantingGrid);
        }
        if (data && data.fields) {
            setDataField(data.fields);
        }
    }, [data]);

    return (
        <div className='w-full h-[42%]'>
            <div className='w-full h-full bg-white rounded-xl border border-gray-200 p-5 flex flex-col'>
                {/* Header */}
                <div className='flex items-center justify-between mb-3'>
                    <h3 className='text-sm font-bold text-gray-800'>Planting Layout Visualization</h3>
                    <div className='flex items-center gap-3'>
                        {dataField.map((field, idx) => (
                            <div key={idx} className='flex items-center gap-1.5'>
                                <span
                                    className={`w-3 h-3 rounded-sm ${field?.bgColor || 'bg-gray-200'} border ${field?.borderColor || 'border-gray-300'}`}
                                ></span>
                                <span className='text-[11px] text-gray-500 font-medium'>{field?.name || `Field ${idx + 1}`}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className='flex-1 flex flex-col gap-1.5'>
                    {plantingGrid.map((row, rowIdx) => (
                        <div key={rowIdx} className='flex-1 flex gap-1.5'>
                            {row.map((cell, colIdx) => {
                                const field = dataField[cell] || {};
                                return (
                                    <div
                                        key={colIdx}
                                        className={`flex-1 rounded-md ${field.bgColor || 'bg-gray-200'} border ${field.borderColor || 'border-gray-300'}`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Footer labels */}
                <div className='flex items-center justify-between mt-3 px-1'>
                    <span className='text-[10px] text-gray-400'>North Boundary</span>
                    <span className='text-[10px] text-gray-400'>Optimal drainage zones highlighted</span>
                    <span className='text-[10px] text-gray-400'>South Boundary</span>
                </div>
            </div>
        </div>
    );
};

export default Bottom;
