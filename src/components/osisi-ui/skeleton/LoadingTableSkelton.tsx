import React from 'react'

export default function LoadingTableSkelton() {
return (
    <table className="table-auto w-full animate-pulse">
        <thead>
            <tr>
                <th className="bg-gray-300 h-6"></th>
                <th className="bg-gray-300 h-6"></th>
                <th className="bg-gray-300 h-6"></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td className="bg-gray-200 h-8"></td>
                <td className="bg-gray-200 h-8"></td>
                <td className="bg-gray-200 h-8"></td>
            </tr>
            <tr>
                <td className="bg-gray-200 h-8"></td>
                <td className="bg-gray-200 h-8"></td>
                <td className="bg-gray-200 h-8"></td>
            </tr>
            <tr>
                <td className="bg-gray-200 h-8"></td>
                <td className="bg-gray-200 h-8"></td>
                <td className="bg-gray-200 h-8"></td>
            </tr>
        </tbody>
    </table>
)
}
