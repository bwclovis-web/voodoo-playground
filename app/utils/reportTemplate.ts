export const generateReport = usage => {
  const reportData = Object.create({})

  console.log(`%c USEAGE`, 'background: #0047ab; color: #fff; padding: 2px:', usage)

  const rawData = usage.map(data => data.cpuUse)

  reportData.maxUse = Math.max(...rawData)
  reportData.minUse = Math.min(...rawData)
  reportData.avgUse = rawData.reduce((acc: number, curr: number) => acc + curr, 0) / rawData.length

  return reportData
}
