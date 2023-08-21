import React, { useState } from 'react'
import Table from './Table'
import Drawer from './Drawer'
import { locations } from '../locations'

const PermissionRow = ({ title, onClick, isDrawerOpen, handleDrawerClose }) => {
    return (
        <>
            <tr
                onClick={() => onClick(title)}
                className="cursor-pointer hover:bg-gray-100"
            >
                <td className="col-span-1">
                    <p className="font-semibold">{title}</p>
                </td>
                <td className="col-span-2">
                    <div className="mb-2">
                        <span className="text-green-500">Can in:</span>
                        <span>
                            {/* Locations that can perform the action */}
                        </span>
                    </div>
                    <div>
                        <span className="text-red-500">Can't in:</span>
                        <span>
                            {/* Locations that can't perform the action */}
                        </span>
                    </div>
                </td>
            </tr>
            <Drawer
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                title={title}
            >
                <Table data={locations} />
            </Drawer>
        </>
    )
}
export default PermissionRow
