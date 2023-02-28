import * as fs from 'fs'
import * as path from 'path'

const stylesDir = path.join(__dirname, '../static/styles')

if (!fs.existsSync(stylesDir)) {
  fs.mkdirSync(stylesDir)
}

const styles = ['atom-one-light.css', 'atom-one-dark.css']

styles.forEach((element) => {
  fs.copyFile(
    path.join(__dirname, '../node_modules/highlight.js/styles/', element),
    path.join(stylesDir, element),
    (err: any) => {
      if (err) throw err
      console.log(element + ': source was copied to destination')
    }
  )
})
