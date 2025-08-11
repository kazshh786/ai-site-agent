import React from 'react';

/**
 * Props for the RecentShipments component.
 * @interface RecentShipmentsProps
 * @property {string[]} headers - An array of strings representing the table headers.
 * @property {string[][]} rows - A 2D array of strings, where each inner array represents a row of data.
 */
interface RecentShipmentsProps {
  headers: string[];
  rows: string[][];
}

/**
 * A reusable React component to display recent shipments in a table format.
 * It's designed to be used within a dashboard or similar section.
 *
 * @param {RecentShipmentsProps} props - The properties for the component.
 * @returns {JSX.Element} A React component displaying a table of recent shipments.
 */
const RecentShipments: React.FC<RecentShipmentsProps> = ({ headers, rows }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Shipments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={`header-${index}`}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {/* Ensure JSX text is escaped according to instructions */}
                  {header.replace(/'/g, '&apos;').replace(/"/g, '&quot;')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {/* Ensure JSX text is escaped according to instructions */}
                      {cell.replace(/'/g, '&apos;').replace(/"/g, '&quot;')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No recent shipments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentShipments;