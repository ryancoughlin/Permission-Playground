import React from 'react'
import Drawer from './Drawer'
import Table from './Table'
import { locations } from '../locations'

const PermissionRow = ({
    permission,
    onClick,
    isDrawerOpen,
    handleDrawerClose,
    allowedCount,
    disallowedCount,
}) => {
    return (
        <>
            <div
                onClick={() => onClick(permission.title)}
                className="flex p-2 cursor-pointer hover:bg-gray-100"
            >
                <div className="flex-1">
                    <p className="font-semibold">{permission.title}</p>
                    <p className="text-sm text-gray-500">
                        {permission.description}
                    </p>
                </div>

                <div className="flex-2">
                    <span className="text-green-500">
                        {allowedCount} Allowed
                    </span>{' '}
                    /{' '}
                    <span className="text-red-500">
                        {disallowedCount} Disallowed
                    </span>
                </div>
            </div>
            <Drawer
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                title={permission.title}
            >
                <Table data={locations} />
            </Drawer>
        </>
    )
}

export default PermissionRow
