const express = require('express')

const path = require('path')
const fs = require('fs')

const app = express()
const port = process.env.PORT || 3000
const pdfThumbPageNumber = process.env.PDF_THUMB_PAGE_NUMBER || 2

const { PDFNet } = require('@pdftron/pdfnet-node');


app.get('/', (req, res) => {
    const docPath = path.resolve(__dirname,'./assets/sample1.pdf')
    const thumbPath = path.resolve(__dirname, `./assets/thumbnails/${Math.floor(Date.now() / 1000)}.png`)
    const getThumbFromPdf = async () => {
        const doc = await PDFNet.PDFDoc.createFromFilePath(docPath)
        await doc.initSecurityHandler()
        const pdfDraw = await PDFNet.PDFDraw.create(92)
        const currentPage = await doc.getPage(pdfThumbPageNumber)
        await pdfDraw.export(currentPage, thumbPath, 'PNG')        
    }
    PDFNet.runWithCleanup(getThumbFromPdf).then(() => {
        fs.readFile(thumbPath, (err, data) => {
            if (err) throw err
            res.writeHead(200, {"Content-Type" : "image/png" })
            res.end(data)
        })
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});