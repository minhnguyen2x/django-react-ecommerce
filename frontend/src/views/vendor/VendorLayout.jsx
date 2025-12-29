import React from 'react'

import Sidebar from './Sidebar'

function VendorLayout({ title, description, actions, children }) {
  return (
    <div className=" bg-slate-50">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 px-4 py-6 lg:px-8">
          {(title || description || actions) && (
            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                {title && <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>}
                {description && <p className="text-sm text-slate-500">{description}</p>}
              </div>
              {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
            </header>
          )}
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default VendorLayout
