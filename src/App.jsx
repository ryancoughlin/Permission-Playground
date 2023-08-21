import { locations } from './locations'
import React, { useState } from 'react'

import Header from './components/Header'
import Table from './components/Table'
import SearchBar from './components/SearchBar'
import Drawer from './components/Drawer'
import BookingPermissionRow from './components/BookingPermissionRow'

const App = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false)
    const [selectedPermission, setSelectedPermission] = useState(null)

    const handleRowClick = (permission) => {
        setSelectedPermission(permission)
        setDrawerOpen(true)
    }

    const handleDrawerClose = () => {
        setDrawerOpen(false)
    }

    const permissions = [
        'Booking',
        'Bypass space booking policies',
        'Skip check-in',
    ]
    return (
        <div className="App relative">
            <div className="bg-gray-100 min-h-screen">
                <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-8 border border-gray-200">
                        <div className="flex flex-col mb-6">
                            <h3 className="text-2xl font-semibold mb-2">
                                Permissions
                            </h3>
                            <p className="text-sm text-gray-600">
                                Permissions define the level of access a user
                                has to specific features in Robin. Access and
                                management permissions can be scoped to include
                                certain buildings or spaces within a building.{' '}
                                <a
                                    href="https://support.robinpowered.com/hc/en-us/articles/360013039591-Adding-permissions-to-roles"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500"
                                >
                                    Learn more.
                                </a>
                            </p>
                        </div>

                        <table className="min-w-full border-t border-gray-200">
                            <tbody>
                                {permissions.map((permission) => (
                                    <BookingPermissionRow
                                        key={permission}
                                        title={permission}
                                        onClick={handleRowClick}
                                        isDrawerOpen={isDrawerOpen}
                                        handleDrawerClose={handleDrawerClose}
                                    />
                                ))}
                            </tbody>
                        </table>
                        <Drawer
                            isOpen={isDrawerOpen}
                            onClose={handleDrawerClose}
                            title={selectedPermission}
                        >
                            <Table data={locations[selectedPermission]} />
                        </Drawer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
