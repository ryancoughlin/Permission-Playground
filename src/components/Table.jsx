import React, { useState, useEffect } from 'react'

import { locations } from '../locations'
import {
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/solid'

const filterAndExpand = (locations, searchTerm) => {
    const filteredLocations = {}
    let shouldExpand = {}

    Object.entries(locations).forEach(([campus, buildings]) => {
        let isCampusMatched = campus
            .toLowerCase()
            .includes(searchTerm.toLowerCase())

        if (isCampusMatched) {
            // If the campus matches the search term, include all its children in the result
            filteredLocations[campus] = buildings
            shouldExpand[campus] = true
        } else {
            // Otherwise, filter the children based on the search term as before
            let filteredBuildings = {}
            Object.entries(buildings).forEach(([building, floors]) => {
                let isBuildingMatched = building
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())

                let filteredFloors = {}
                Object.entries(floors).forEach(([floor, spaces]) => {
                    let isFloorMatched = floor
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    let filteredSpaces = spaces.filter((space) =>
                        space.toLowerCase().includes(searchTerm.toLowerCase())
                    )

                    if (isFloorMatched || filteredSpaces.length > 0) {
                        filteredFloors[floor] = filteredSpaces
                        shouldExpand[`${campus}-${building}`] = true
                        shouldExpand[`${campus}-${building}-${floor}`] = true
                    }
                })

                if (
                    isBuildingMatched ||
                    Object.keys(filteredFloors).length > 0
                ) {
                    filteredBuildings[building] = filteredFloors
                    shouldExpand[`${campus}-${building}`] = true
                }
            })

            if (Object.keys(filteredBuildings).length > 0) {
                filteredLocations[campus] = filteredBuildings
            }
        }
    })

    return { filteredLocations, shouldExpand }
}

const Table = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [expanded, setExpanded] = useState(() => {
        const initialExpanded = {}
        Object.keys(locations).forEach((campus) => {
            initialExpanded[campus] = true
        })
        return initialExpanded
    })

    const [selected, setSelected] = useState({})

    const { filteredLocations, shouldExpand } = filterAndExpand(
        locations,
        searchTerm
    )

    const toggleExpand = (key, e) => {
        e.stopPropagation()
        setExpanded((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))
    }

    const updateChildren = (parentKey, value) => {
        Object.keys(selected).forEach((key) => {
            if (key.startsWith(parentKey)) {
                updatedSelection[key] = value
            }
        })
    }

    const getTotalSelected = () => {
        return Object.values(selected).filter((value) => value != null).length
    }

    const handleCheckboxChange = (key, value, e) => {
        const isChecked = e.target.checked
        const updatedSelection = { ...selected }

        const applySelectionToChildren = (
            currentLocation,
            parentKey,
            value
        ) => {
            Object.entries(currentLocation).forEach(
                ([childKey, childValue], i) => {
                    const fullKey = `${parentKey}-${i}`
                    updatedSelection[fullKey] = value
                    if (typeof childValue === 'object') {
                        applySelectionToChildren(childValue, fullKey, value)
                    }
                }
            )
        }

        updatedSelection[key] = isChecked ? value : null

        Object.entries(filteredLocations).forEach(
            ([locationKey, buildings], i) => {
                if (key === locationKey) {
                    applySelectionToChildren(
                        buildings,
                        key,
                        isChecked ? value : null
                    )
                } else {
                    Object.entries(buildings).forEach(
                        ([buildingKey, floors], j) => {
                            const fullBuildingKey = `${locationKey}-${j}`
                            if (key === fullBuildingKey) {
                                applySelectionToChildren(
                                    floors,
                                    fullBuildingKey,
                                    isChecked ? value : null
                                )
                            }
                        }
                    )
                }
            }
        )

        setSelected(updatedSelection)
    }

    const renderHeader = () => (
        <div className="grid grid-cols-6 text-sm font-bold p-2 bg-gray-200">
            {' '}
            {/* Added background color */}
            <div className="col-span-4 pl-28">Name</div>
            <div className="col-span-1 flex justify-center items-center">
                <div>Allow</div>
            </div>
            <div className="col-span-1 flex justify-center items-center">
                <div>Disallow</div>
            </div>
        </div>
    )
    const renderControls = (key) => (
        <>
            <div className="col-span-1 flex justify-center items-center">
                <label onClick={(e) => e.stopPropagation()}>
                    <input
                        onChange={(e) => handleCheckboxChange(key, 'allow', e)}
                        type="checkbox"
                        className="mr-2 leading-tight"
                        checked={selected[key] === 'allow'}
                    />
                </label>
            </div>
            <div className="col-span-1 flex justify-center items-center">
                <label onClick={(e) => e.stopPropagation()}>
                    <input
                        onChange={(e) =>
                            handleCheckboxChange(key, 'disallow', e)
                        }
                        type="checkbox"
                        className="mr-2 leading-tight"
                        checked={selected[key] === 'disallow'}
                    />
                </label>
            </div>
        </>
    )

    const getBackgroundColor = (key) => {
        // Check if the key itself is selected
        if (selected[key]) return 'bg-blue-50'

        // Check if any child of the key is selected
        for (let selectedKey in selected) {
            if (selectedKey.startsWith(key) && selected[selectedKey]) {
                return 'bg-blue-50'
            }
        }

        return '' // Default: no background color
    }

    const renderSpace = (space, key) => (
        <div key={key} className="hover:bg-gray-100 grid grid-cols-6 pl-24 p-2">
            <div className="col-span-3 text-gray-700 text-sm">{space}</div>
            {renderControls(key)}
        </div>
    )

    const renderFloor = (floor, spaces, key) => (
        <div key={key} className="pl-8">
            <div
                onClick={(e) => toggleExpand(key, e)}
                className={`hover:bg-gray-100 grid grid-cols-6 items-center ${getBackgroundColor(
                    key
                )} cursor-pointer p-2`}
            >
                {expanded[key] ? (
                    <ChevronDownIcon className="h-4 w-4 mr-2 text-gray-600" />
                ) : (
                    <ChevronRightIcon className="h-4 w-4 mr-2 text-gray-600" />
                )}
                <div className="col-span-3 text-gray-700 text-sm">{floor}</div>
                {renderControls(key)}
            </div>
            {expanded[key] &&
                spaces.map((space, i) => renderSpace(space, `${key}-${i}`))}
        </div>
    )

    const renderBuilding = (building, floors, key) => (
        <div key={key}>
            <div
                onClick={(e) => toggleExpand(key, e)}
                className={`hover:bg-gray-100 pl-8 grid grid-cols-6 items-center ${getBackgroundColor(
                    key
                )} cursor-pointer p-2`}
            >
                {expanded[key] ? (
                    <ChevronDownIcon className="h-4 w-4 mr-2 text-gray-600" />
                ) : (
                    <ChevronRightIcon className="h-4 w-4 mr-2 text-gray-600" />
                )}
                <div className="col-span-3 text-gray-700 text-sm">
                    {building}
                </div>
                {renderControls(key)}
            </div>
            {expanded[key] &&
                Object.entries(floors).map(([floor, spaces], i) =>
                    renderFloor(floor, spaces, `${key}-${i}`)
                )}
        </div>
    )

    const renderLocation = (location, buildings) => (
        <div key={location} className="mb-1">
            <div
                onClick={(e) => toggleExpand(location, e)}
                className={`hover:bg-gray-100 grid grid-cols-6 items-center ${getBackgroundColor(
                    location
                )} cursor-pointer p-2`}
            >
                {expanded[location] ? (
                    <ChevronDownIcon className="h-4 w-4 mr-2 text-gray-600" />
                ) : (
                    <ChevronRightIcon className="h-4 w-4 mr-2 text-gray-600" />
                )}
                <div className="col-span-3 text-gray-700 text-sm font-bold">
                    {location}
                </div>
                {renderControls(location)}
            </div>
            {expanded[location] &&
                Object.entries(buildings).map(([building, floors], i) =>
                    renderBuilding(building, floors, `${location}-${i}`)
                )}
        </div>
    )

    useEffect(() => {
        setExpanded((prev) => ({
            ...prev,
            ...shouldExpand,
        }))
    }, [searchTerm])

    return (
        <div className="container mx-auto p-4">
            <div className="sticky top-0 z-10 bg-white">
                {' '}
                {/* Sticky container */}
                <div className="mb-4 flex items-center relative">
                    {' '}
                    {/* Added 'relative' class */}
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
                        placeholder="Search locations..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-600 absolute ml-3 mt-2" />
                </div>
                {renderHeader()}
            </div>
            {Object.entries(filteredLocations).map(([location, buildings]) =>
                renderLocation(location, buildings)
            )}
        </div>
    )
}

export default Table
