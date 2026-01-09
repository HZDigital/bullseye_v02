import { useBullseyeStore } from "@/stores/bullseyeStore"
import ExcelJS from "exceljs"

export const exportBullseyeToXLSX = async () => {
  const { variantData, currentVariant } = useBullseyeStore.getState()

  const data = variantData[currentVariant].cartItems

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Bullseye Data")

  worksheet.mergeCells("B5:B6");
  worksheet.mergeCells("C5:C6");
  worksheet.mergeCells("D5:D6");
  worksheet.mergeCells("E5:E6");
  worksheet.mergeCells("F5:F6");
  worksheet.mergeCells("G5:G6");
  worksheet.mergeCells("H5:I5");
  worksheet.mergeCells("J5:K5");
  worksheet.mergeCells("L5:M5");
  worksheet.mergeCells("N5:O5");
  worksheet.mergeCells("P5:P6");
  worksheet.mergeCells("Q5:Q6");
  worksheet.mergeCells("R5:R6");

  worksheet.getCell("B5").value = "#";
  worksheet.getCell("C5").value = "Saving lever";
  worksheet.getCell("D5").value = "Description of idea / measure";
  worksheet.getCell("E5").value = "Suppliers in scope";
  worksheet.getCell("F5").value = "Baseline";
  worksheet.getCell("G5").value = "Addressable volume";
  worksheet.getCell("H5").value = "Saving indication (%)";
  worksheet.getCell("J5").value = "Saving indication (k€)";
  worksheet.getCell("L5").value = "Realistic Saving indication (%)";
  worksheet.getCell("N5").value = "Realistic Saving indication (k€)";
  worksheet.getCell("P5").value = "Necessary enabler and pre-requisites";
  worksheet.getCell("Q5").value = "Implementation effort";
  worksheet.getCell("R5").value = "Period until DoI4";

  worksheet.getCell("H6").value = "min (%)";
  worksheet.getCell("I6").value = "max (%)";
  worksheet.getCell("J6").value = "min (k€)";
  worksheet.getCell("K6").value = "max (k€)";
  worksheet.getCell("L6").value = "min (%)";
  worksheet.getCell("M6").value = "max (%)";
  worksheet.getCell("N6").value = "min (k€)";
  worksheet.getCell("O6").value = "max (k€)";

  worksheet.addTable({
    name: "Value_Creation_Plan",
    ref: "B7",
    headerRow: true,
    totalsRow: false,
    style: {
      theme: "TableStyleLight1",
      showRowStripes: false,
    },
    columns: [
      { name: "1.", filterButton: true },
      { name: "2.", filterButton: true },
      { name: "3.", filterButton: true },
      { name: "4.", filterButton: true },
      { name: "5.", filterButton: true },
      { name: "6.", filterButton: true },
      { name: "7.", filterButton: true },
      { name: "8.", filterButton: true },
      { name: "9.", filterButton: true },
      { name: "10.", filterButton: true },
      { name: "11.", filterButton: true },
      { name: "12.", filterButton: true },
      { name: "13.", filterButton: true },
      { name: "14.", filterButton: true },
      { name: "15.", filterButton: true },
      { name: "16.", filterButton: true },
      { name: "17.", filterButton: true },
    ],
    rows: 
      data.map((d, i) => [
        i, d.title, d.definition, d.supplier_type.join(", "),
        null, null, null, null, null, null, null, null, null, null, d.approach.join(", ")
      ]),
    
  })

  worksheet.getColumn("A").width = 2
  worksheet.getColumn("B").width = 10
  worksheet.getColumn("B").alignment = { horizontal: "center", vertical: "middle" }
  worksheet.getColumn("C").alignment = { wrapText: true }
  worksheet.getColumn("C").width = 30
  worksheet.getColumn("D").alignment = { wrapText: true }
  worksheet.getColumn("D").width = 40
  worksheet.getColumn("E").width = 20
  worksheet.getColumn("F").width = 20
  worksheet.getColumn("G").width = 20
  worksheet.getColumn("H").width = 12
  worksheet.getColumn("I").width = 12
  worksheet.getColumn("J").width = 12
  worksheet.getColumn("K").width = 12
  worksheet.getColumn("L").width = 14
  worksheet.getColumn("M").width = 14
  worksheet.getColumn("N").width = 14
  worksheet.getColumn("O").width = 14
  worksheet.getColumn("P").alignment = {wrapText: true}
  worksheet.getColumn("P").width = 40
  worksheet.getColumn("Q").width = 22
  worksheet.getColumn("R").width = 20

  worksheet.getRows(8, data.length + 7)?.forEach((row) => {
    row.height = 100
  })

  const startColumn = "B"
  const startRow = 5
  const endColumn = "R"
  const endRow = 7
  for (let i = startColumn.charCodeAt(0); i <= endColumn.charCodeAt(0); i++) {
    for (let j = startRow; j <= endRow; j++) {
      const cell = worksheet.getCell(String.fromCharCode(i) + j)
      cell.font = { bold: true }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDDEBF7" },
      }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    }
  }

  const startColumnGreen = "L"
  const startRowGreen = 5
  const endColumnGreen = "O"
  const endRowGreen = 7
  for (let i = startColumnGreen.charCodeAt(0); i <= endColumnGreen.charCodeAt(0); i++) {
    for (let j = startRowGreen; j <= endRowGreen; j++) {
      const cell = worksheet.getCell(String.fromCharCode(i) + j)
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC6E0B4" },
      }
    }
  }

  worksheet.getColumn("J").eachCell((cell) => {
    if (+cell.row > 7) {
      cell.value = {
        formula: `G${cell.row}*H${cell.row}`,
        result: 0,
      }
      cell.numFmt = '#0 "k€"'
    }
  })
  worksheet.getColumn("K").eachCell((cell) => {
    if (+cell.row > 7) {
      cell.value = {
        formula: `G${cell.row}*I${cell.row}`,
        result: 0,
      }
      cell.numFmt = '#0 "k€"'
    }
  })
  worksheet.getColumn("N").eachCell((cell) => {
    if (+cell.row > 7) {
      cell.value = {
        formula: `J${cell.row}*0.7`,
        result: 0,
      }
      cell.numFmt = '#0 "k€"'
    }
  })
  worksheet.getColumn("O").eachCell((cell) => {
    if (+cell.row > 7) {
      cell.value = {
        formula: `K${cell.row}*0.7`,
        result: 0,
      }
      cell.numFmt = '#0 "k€"'
    }
  })

  worksheet.getCell("L8").value = "Enter min savings indication"
  worksheet.getCell("L8").font = { italic: true }

  worksheet.getCell("M8").value = "Enter max savings indication"
  worksheet.getCell("M8").font = { italic: true }

  // worksheet.getCell("P8").value = "Enter necessary enabler and pre-requisites"
  // worksheet.getCell("P8").font = { italic: true }

  worksheet.getCell("Q8").value = "Enter implementation effort (low, medium, high)"
  worksheet.getCell("Q8").font = { italic: true }

  worksheet.getCell("R8").value = "Enter number of month"
  worksheet.getCell("R8").font = { italic: true }


  worksheet.getRow(1).height = 10
  worksheet.getRow(4).height = 10

  worksheet.getCell("B2").value = "Measure Nr."
  worksheet.getCell("B2").font = { bold: true }

  worksheet.getCell("C2").value = "Category:"
  worksheet.getCell("C2").font = { bold: true }
  worksheet.getCell("C2").style = { alignment: { horizontal: "right", wrapText: false}}
  worksheet.getCell("D2").value = "Category 1"
  worksheet.getCell("D2").font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getCell("D2").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF808080" },
  }
  worksheet.getCell("D2").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  }

  worksheet.getCell("E2").value = "Spend 2020 (in k€)"
  worksheet.getCell("E2").font = { bold: true }
  worksheet.getCell("E2").style = { alignment: { horizontal: "right"}}
  worksheet.getCell("F2").value = "Enter total baseline"
  worksheet.getCell("F2").font = { bold: true, color: { argb: "FFFFFFFF" }  }
  worksheet.getCell("F2").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF808080" },
  }
  worksheet.getCell("F2").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  }

  worksheet.getCell("I2").value = "Saving indication(in k€)"
  worksheet.getCell("I2").font = { bold: true }
  worksheet.getCell("I2").style = { alignment: { horizontal: "right"}}
  worksheet.getCell("I3").value = "Saving indication(in %)"
  worksheet.getCell("I3").font = { bold: true }
  worksheet.getCell("I3").style = { alignment: { horizontal: "right"}}
  worksheet.getCell("J2").value = {
    formula: "SUBTOTAL(9, J8:J1000)",
    result: 0,
  }
  worksheet.getCell("J2").numFmt = '#0 "k€"'
  worksheet.getCell("J2").font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getCell("J2").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF808080" },
  }
  worksheet.getCell("J2").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  }
  worksheet.getCell("K2").value = {
    formula: "SUBTOTAL(9, K8:K1000)",
    result: 0,
  }
  worksheet.getCell("K2").numFmt = '#0 "k€"'
  worksheet.getCell("K2").font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getCell("K2").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF808080" },
  }
  worksheet.getCell("K2").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  }
  worksheet.getCell("J3").value = {
    formula: "J2/F2",
    result: 0,
  }
  worksheet.getCell("J3").numFmt = "0.00%"
  worksheet.getCell("J3").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF808080" },
  }
  worksheet.getCell("J3").font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getCell("J3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  }
  worksheet.getCell("K3").value = {
    formula: "K2/F2",
    result: 0,
  }
  worksheet.getCell("K3").numFmt = "0.00%"
  worksheet.getCell("K3").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF808080" },
  }
  worksheet.getCell("K3").font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getCell("K3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  }

  worksheet.getCell("M2").value = "Saving indication (in k€)"
  worksheet.getCell("M2").font = { bold: true }
  worksheet.getCell("M2").style = { alignment: { horizontal: "right"}}
  worksheet.getCell("M3").value = "Saving indication (in %)"
  worksheet.getCell("M3").font = { bold: true }
  worksheet.getCell("M3").style = { alignment: { horizontal: "right"}}

  worksheet.getCell("N2").value = {
    formula: "SUBTOTAL(9, N8:N1000)",
    result: 0,
  }
  worksheet.getCell("N2").numFmt = '#0 "k€"'
  worksheet.getCell("N2").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF808080" },
  }
  worksheet.getCell("N2").font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getCell("N2").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  }
  worksheet.getCell("O2").value = {
    formula: "SUBTOTAL(9, O8:O1000)",
    result: 0,
  }
  worksheet.getCell("O2").numFmt = '#0 "k€"'
  worksheet.getCell("O2").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF808080" },
  }
  worksheet.getCell("O2").font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getCell("O2").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  }
  worksheet.getCell("N3").value = {
    formula: "N2/F2",
    result: 0,
  }
  worksheet.getCell("N3").numFmt = "0.00%"
  worksheet.getCell("N3").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF808080" },
  }
  worksheet.getCell("N3").font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getCell("N3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  }
  worksheet.getCell("O3").value = {
    formula: "O2/F2",
    result: 0,
  }
  worksheet.getCell("O3").numFmt = "0.00%"
  worksheet.getCell("O3").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF808080" },
  }
  worksheet.getCell("O3").font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getCell("O3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  }


  const buffer = await workbook.xlsx.writeBuffer()
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  const fileName = `Bullseye_${currentVariant}.xlsx`
  const blob = new Blob([buffer], { type: fileType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}