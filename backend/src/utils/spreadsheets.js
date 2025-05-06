const stream = require("stream")
const ExcelJS = require("exceljs")

/**
 * items: [
        { header: "Item Name", key: "itemName", width: 25 },
        { header: "Category", key: "category", width: 15 },
        { header: "Description", key: "description", width: 30 },
        { header: "Colors", key: "colors", width: 20 },
        { header: "Price (LKR)", key: "price", width: 15 },
        { header: "Size", key: "size", width: 10 },
        { header: "Quantity", key: "quantity", width: 10 },
        { header: "Stock Status", key: "stock", width: 15 },
      ]
 */

const columns = {
    items: [
        { width: 25 },
        { width: 15 },
        { width: 30 },
        { width: 20 },
        { width: 15 },
        { width: 10 },
        { width: 10 },
        { width: 15 },
    ],
    users: [
        { width: 25 },
        { width: 25 },
        { width: 25 },
        { width: 35 },
        { width: 10 },
        { width: 25 },
    ],
    usersLogs: [{ width: 25 }, { width: 25 }, { width: 25 }, { width: 30 }],
    monthlySales: [
        { width: 25 },
        { width: 25 },
        { width: 25 },
        { width: 25 },
        { width: 25 }
    ]
}

const addTable = (worksheet, header, rows) => {
    let currentRowIndex = worksheet.rowCount || 0

    let headerRow = worksheet.getRow(currentRowIndex + 1)
    headerRow.values = header
    headerRow.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
        size: 12,
    }
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF000000" },
    }
    headerRow.alignment = {
        vertical: "middle",
        horizontal: "center",
    }
    headerRow.height = 25

    // Apply borders to header cells
    headerRow.eachCell((cell) => {
        cell.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
        }
    })

    currentRowIndex += 2
    for (let row of rows) {
        let currentRow = worksheet.getRow(currentRowIndex)
        currentRow.values = row
        currentRowIndex++

        currentRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: currentRowIndex % 2 === 0 ? "FFE6F0FF" : "FFFFFFFF" },
        }

        // Add borders to cells
        currentRow.eachCell((cell, colNumber) => {
            cell.border = {
                top: { style: "thin", color: { argb: "FFD3D3D3" } },
                left: { style: "thin", color: { argb: "FFD3D3D3" } },
                bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
                right: { style: "thin", color: { argb: "FFD3D3D3" } },
            }

            // Align  cells
            cell.alignment = {
                vertical: "middle",
                horizontal: "center",
                wrapText: true,
            }
        })
    }

    return
}

const createAttachment = async (workbook, res) => {
    let fileStream = new stream.PassThrough()
    await workbook.xlsx.write(fileStream)
    res.attachment("output.xlsx")
    fileStream.pipe(res)
}

module.exports = {
    columns,
    addTable,
    createAttachment,
}
