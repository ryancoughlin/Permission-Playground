const Drawer = ({ isOpen, onClose, title, children }) => {
    return (
        <div
            className={`fixed inset-0 ${isOpen ? '' : 'hidden'}`}
            style={{ right: 0, left: 'auto', zIndex: 1000 }}
        >
            <div
                className="absolute right-0 h-full bg-white p-4 overflow-y-auto border-l shadow-xl"
                style={{ width: '660px' }}
            >
                <h2 className="text-2xl font-bold">{title}</h2>{' '}
                <p className="text-gray-600 mb-6">
                    Manage the permission settings for locations to control user
                    accessibility.
                </p>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                {children}
            </div>
        </div>
    )
}

export default Drawer
