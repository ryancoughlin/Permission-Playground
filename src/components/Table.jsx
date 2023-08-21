import React, { useState, useEffect } from 'react'
import { locations } from '../locations'

const TableRow = ({
    label,
    level,
    children,
    selectedValue,
    onSelectionChange,
    parentValue,
}) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [allow, setAllow] = useState(
        selectedValue === 'allow' || parentValue === 'allow'
    )
    const [disallow, setDisallow] = useState(
        selectedValue === 'disallow' || parentValue === 'disallow'
    )

    const handleCheckboxClick = (e) => {
        e.stopPropagation() // Stop the event from bubbling up to the parent elements
    }

    useEffect(() => {
        if (parentValue === 'allow') {
            setAllow(true)
            setDisallow(false)
        } else if (parentValue === 'disallow') {
            setAllow(false)
            setDisallow(true)
        } else {
            setAllow(false)
            setDisallow(false)
        }
    }, [parentValue])

    const handleCheckboxChange = (value) => (e) => {
        const checked = e.target.checked
        if (value === 'allow') {
            setAllow(checked)
            setDisallow(false)
            onSelectionChange(label, checked ? 'allow' : null)
        } else {
            setDisallow(checked)
            setAllow(false)
            onSelectionChange(label, checked ? 'disallow' : null)
        }
    }

    return (
        <React.Fragment>
            <tr
                className={`cursor-pointer hover:bg-gray-100 ${
                    allow || disallow ? 'bg-blue-100' : ''
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <td className={`pl-${level * 4} text-left py-2`}>{label}</td>
                <td className="text-center py-2" onClick={handleCheckboxClick}>
                    <input
                        type="checkbox"
                        checked={allow}
                        onChange={handleCheckboxChange('allow')}
                    />
                </td>
                <td className="text-center py-2" onClick={handleCheckboxClick}>
                    <input
                        type="checkbox"
                        checked={disallow}
                        onChange={handleCheckboxChange('disallow')}
                    />
                </td>
            </tr>
            {isExpanded &&
                children?.map((child) =>
                    React.cloneElement(child, {
                        parentValue: allow
                            ? 'allow'
                            : disallow
                            ? 'disallow'
                            : null,
                        onSelectionChange,
                    })
                )}
        </React.Fragment>
    )
}

const renderSpaces = (spaces, level, onSelectionChange, parentValue) =>
    spaces.map((space, index) => (
        <TableRow
            key={index}
            label={space}
            level={level}
            onSelectionChange={onSelectionChange}
            parentValue={parentValue}
        />
    ))

const renderFloors = (floors, level, onSelectionChange, parentValue) =>
    Object.entries(floors).map(([floor, spaces]) => (
        <TableRow
            key={floor}
            label={floor}
            level={level}
            onSelectionChange={onSelectionChange}
            parentValue={parentValue}
        >
            {renderSpaces(spaces, level + 1, onSelectionChange, parentValue)}
        </TableRow>
    ))

const renderBuildings = (buildings, level, onSelectionChange, parentValue) =>
    Object.entries(buildings).map(([building, floors]) => (
        <TableRow
            key={building}
            label={building}
            level={level}
            onSelectionChange={onSelectionChange}
            parentValue={parentValue}
        >
            {renderFloors(floors, level + 1, onSelectionChange, parentValue)}
        </TableRow>
    ))

// Table component
const Table = () => {
    const [selection, setSelection] = useState({})

    const onSelectionChange = (label, value) => {
        setSelection((prev) => ({ ...prev, [label]: value }))
    }

    return (
        <>
            <div className="px-4 py-6">
                <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="text-left pl-4 py-2">Location</th>
                            <th className="text-center py-2">Allow</th>
                            <th className="text-center py-2">Disallow</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(locations).map(
                            ([campus, buildings]) => (
                                <TableRow
                                    key={campus}
                                    label={campus}
                                    level={0}
                                    onSelectionChange={onSelectionChange}
                                >
                                    {renderBuildings(
                                        buildings,
                                        1,
                                        onSelectionChange,
                                        null
                                    )}
                                </TableRow>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table
