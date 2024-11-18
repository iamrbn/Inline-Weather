// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: sun;

//+++++++++++ START CONFIG AREA +++++++++++++++

const unit = 'metric' //Units of measurement: 'standard', 'metric' and 'imperial' units are available.
const unitSymb = '°' //Celsius
const unitSpeed = 'km/h'
const language = 'de' //learn more: https://openweathermap.org/current#multi 
const standardParameter = "60;forecast"//Refresh Intervall; Weather-Datas (current or forecast)

//++++++++++++++ END CONFIG AREA +++++++++++++

let df = new DateFormatter()
let fm = FileManager.iCloud()
let dir = fm.joinPath(fm.documentsDirectory(), 'Inline Weather')
if (!fm.fileExists(dir)) fm.createDirectory(dir)
let modulePath = fm.joinPath(dir, "iModule.js")
if (!fm.fileExists(modulePath)) await loadModule()
if (!fm.downloadFileFromiCloud(modulePath)) await fm.downloadFileFromiCloud(modulePath)
let iModule = importModule(modulePath)
let uCheck = await iModule.updateCheck(1.2)
let jsonPath = fm.joinPath(dir, 'apiKey.json')
let apiKey = await iModule.getAPIKey()
let wSize = config.widgetFamily
let wParameter = await args.widgetParameter
if (wParameter == null || wParameter.length <= 3) wParameter = standardParameter
let refreshInt = wParameter.match(/\d/g).join("")
let wContent =  wParameter.match(/[a-zA-Z]/g).join("")

Location.setAccuracyToHundredMeters()
//Location.setAccuracyToKilometer() //macOS
let location = await Location.current()

let data = await iModule.getFromAPI(`https://api.openweathermap.org/data/3.0/onecall?lat=${ location.latitude }&lon=${ location.longitude }&exclude=minutely,hourly&units=${ unit }&lang=${ language }&appid=${ apiKey }`)
//console.log(JSON.stringify(data, null, 2))

let Case = await iModule.getErrorCase(data, uCheck.needUpdate)
//Case = ['UPDATE']

if (config.runsInAccessoryWidget || config.runsInWidget){
    switch(wSize){
     case 'accessoryInline': w = await inlineCurrent(Case, wSize)
     break;
     case 'accessoryCircular': w = await circularCurrent(Case, wSize)
     break;
     case 'accessoryRectangular':
          if (wContent == 'current') w = await rectangularCurrent(Case, wSize)
          else if (wContent == 'forecast') w = await rectangularForecast(Case, wSize)
     break;
    
     default: w = await inlineCurrent(Case, wSize)
    }
    Script.setWidget(w)

} else if (!fm.fileExists(jsonPath) && config.runsInApp){
    await iModule.askForAPIKey()
    
} else if (config.runsInApp){
    QuickLook.present(await createTable(data))
}


//########### CREATE INLINE LS WIDGET #########
async function inlineCurrent(Case, size){
	let w = new ListWidget()
	    w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
	let stck = w.addStack()

   if (Case.length > 0) await iModule.infoWidget(Case, size, stck, uCheck.uC.version)
   else {
     await iModule.createHorizontallyStack(
        await iModule.getSF(data.current.weather[0].id, data.current.weather[0].icon),
        18,
        stck,
        "h1",
        await iModule.calcTemp(data.current.temp) + unitSymb + ' ↑' + await iModule.calcTemp(data.daily[0].temp.max) + '↓' + await iModule.calcTemp(data.daily[0].temp.min) + ' ⇣' + Math.round(data.daily[0].pop * 100 / 1) + '%',
        10
     )
    }
  
  return w
};


//######### CREATE CIRCULAR LS WIDGET ###########
async function circularCurrent(Case, size){
  let w = new ListWidget()
      w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
      w.addAccessoryWidgetBackground = true
      
  if (Case.length > 0) await iModule.infoWidget(Case, size, w, uCheck.uC.version)
  else {
  let mainStack = w.addStack()
      mainStack.layoutVertically()
      mainStack.size = new Size(70, 70)

  let topStack = mainStack.addStack()
      topStack.bottomAlignContent()
      
      topStack.addSpacer()
      
  let txt = topStack.addText(await iModule.calcTemp(data.current.temp)+unitSymb)
      txt.font = Font.regularSystemFont(16)
      txt.leftAlignText()
      txt.minimumScaleFactor = 0.7
    
      topStack.addSpacer(1)

  let img = topStack.addImage(await iModule.sfSymbol(await iModule.getSF(data.current.weather[0].id, data.current.weather[0].icon)))
      img.imageSize = new Size(27, 22)
      img.centerAlignImage()
      
      topStack.addSpacer(10)
      
  let middleStack = mainStack.addStack()
      middleStack.bottomAlignContent()

      middleStack.addSpacer()
      
  let desc = middleStack.addText('↑' + await iModule.calcTemp(data.daily[0].temp.max) + unitSymb + ' ↓' + await iModule.calcTemp(data.daily[0].temp.min) + unitSymb)
      desc.font = Font.lightSystemFont(12)
      desc.lineLimit = 1
      desc.minimumScaleFactor = 0.8
      desc.centerAlignText()
      
      middleStack.addSpacer()
      
  let bottomStack = mainStack.addStack()
      bottomStack.bottomAlignContent()
      
      bottomStack.addSpacer()
      
  let desc2 = bottomStack.addText('⇣' + data.daily[0].pop*100/1 + '%')
      desc2.font = Font.lightSystemFont(11)
      desc2.lineLimit = 1
      desc2.minimumScaleFactor = 0.8
      desc2.centerAlignText()
      
      bottomStack.addSpacer()
 }   
  return w
};


//########## CREATE RECTANGULAR CURRENT ###########
async function rectangularCurrent(Case, size){
 let w = new ListWidget()
     w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
     w.addAccessoryWidgetBackground = true
     w.setPadding(0, 0, 0, 0)
    
 if (Case.length > 0) await iModule.infoWidget(Case, size, w, uCheck.uC.version)
 else {
    
 let mainStack = w.addStack()
     mainStack.layoutVertically()
     mainStack.centerAlignContent()
      
 let headerStack = mainStack.addStack()
     headerStack.bottomAlignContent()
     headerStack.setPadding(0, 0, -1, 0)
    
 let bodyStack = mainStack.addStack()
     bodyStack.centerAlignContent()
    
 let leftBodyStack = bodyStack.addStack()
     leftBodyStack.layoutVertically()
     leftBodyStack.centerAlignContent()
     leftBodyStack.spacing = -1

 let rightBodyStack = bodyStack.addStack()
     rightBodyStack.layoutVertically()
     rightBodyStack.centerAlignContent()
     rightBodyStack.spacing = -1
   
 await iModule.createHorizontallyStack(await iModule.getSF(data.current.weather[0].id, data.current.weather[0].icon), 16, headerStack, "h1", await iModule.calcTemp(data.current.temp)+unitSymb+ ' ' +data.daily[0].weather[0].description, 13)
 await iModule.createHorizontallyStack('arrow.up.square', 11, leftBodyStack, "line1", await iModule.calcTemp(data.daily[0].temp.max)+unitSymb, 11)
 await iModule.createHorizontallyStack('arrow.down.square', 11, leftBodyStack, "line2", await iModule.calcTemp(data.daily[0].temp.min)+unitSymb, 11)
 await iModule.createHorizontallyStack('sunrise.fill', 12, leftBodyStack, "line3", await iModule.calcTime(df, data.current.sunrise), 10)
 await iModule.createHorizontallyStack('sunset.fill', 12, leftBodyStack, "line4", await iModule.calcTime(df, data.current.sunset), 10)

 await iModule.createHorizontallyStack('person.and.background.dotted', 13, rightBodyStack, "line1", await iModule.calcTemp(data.current.feels_like)+unitSymb, 11)
 await iModule.createHorizontallyStack('cloud.fill', 12, rightBodyStack, "line2", data.current.clouds + '%', 11)
 await iModule.createHorizontallyStack('wind', 12, rightBodyStack, "line3", data.current.wind_speed + unitSpeed + ' | ' + await iModule.calcWindDirection(data, 0), 11)
 moon = await iModule.calcMoonPhase(datas, idx)
 await iModule.createHorizontallyStack(moon[0], 10, rightBodyStack, "line4", moon[1], 11)
 }
  return w
};


//########## CREATE RECTANGULAR FORECAST ###########
async function rectangularForecast(Case, size){
  let w = new ListWidget()
      w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
      //w.addAccessoryWidgetBackground = true
      
  if (Case.length > 0) await iModule.infoWidget(Case, size, w, uCheck.uC.version)
  else {
        
  let mainStack = w.addStack()
      mainStack.layoutVertically()
  
  let headerStack = mainStack.addStack()
  let bodyStack = mainStack.addStack()
  
  await iModule.createHorizontallyStack(
    await iModule.getSF(data.current.weather[0].id, data.current.weather[0].icon),
    15,
    headerStack,
    "h",
    await iModule.calcTemp(data.current.temp) + unitSymb + ' ' + data.daily[0].weather[0].description,
    11
    )
  
      bodyStack.addSpacer(1)
  
  let rows = 6
  for (let i=0; i<rows; i++){
  await iModule.createVerticallyStack(
    await iModule.calcDate(df, data.daily[i].dt, 'EE'),
    Math.round(data.daily[i].pop*100/1),
    await iModule.getSF(data.daily[i].weather[0].id, data.daily[i].weather[0].icon),
    16,
    bodyStack,
    'd2',
    await iModule.calcTemp(data.daily[i].temp.max),
    await iModule.calcTemp(data.daily[i].temp.min),
    7,
    unitSymb
    )
  }
 }

 return w
};


// ############ CREATE TABLE ###########
async function createTable(datas){
  let table = new UITable()
      table.showSeparators = true
  
  let headerRow = new UITableRow()
      headerRow.backgroundColor = new Color('#48484A')
      headerRow.isHeader = true
      headerRow.height = 65
      headerRow.dismissOnSelect = false

      iconCell = UITableCell.imageAtURL('https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png')
      iconCell.widthWeight = 25
      headerRow.addCell(iconCell)
      
  let cityDatas = await iModule.getFromAPI(`https://api.openweathermap.org/data/2.5/weather?lat=${ datas.lat }&lon=${ datas.lon }&units=${ unit }&lang=${ language }&appid=${ apiKey }`)
      textCell = UITableCell.button('📍'+ cityDatas.name)
      textCell.onTap = () => changeLocation(cityDatas.id.toString(), cityDatas.name)
      textCell.rightAligned()
      textCell.widthWeight = 25
      headerRow.addCell(textCell)

      table.addRow(headerRow)
      
   if (uCheck.needUpdate){
      uRow = new UITableRow()
      uRow.height = 70
      uRow.backgroundColor = Color.white()
      uTitle = uRow.addText(`New server version ${uCheck.uC.version} is now available on GitHub!`, 'Run script in-app for changelog dialogue')
      uTitle.widthWeight = 40
      uTitle.titleColor = Color.red()
      uTitle.subtitleColor = Color.red()
      uImage = uRow.addImage(await iModule.sfSymbol('square.and.arrow.down', '#007AFF', 10))//007AFF
      uImage.leftAligned()
      uImage.widthWeight = 3
      table.addRow(uRow)
  }
      
  for (i=0; i<datas.daily.length; i++){
      let row = new UITableRow()
          row.height = 77
          row.cellSpacing = 5
          row.onSelect = async function(i){
      QuickLook.present(await showDetailView(datas, i-1))
    }
    
    row.dismissOnSelect = false
    
    if (i==0) row.backgroundColor = new Color('#0C83FF26')
        imageCell = row.addImageAtURL(`http://openweathermap.org/img/wn/${datas.daily[i].weather[0].icon}@2x.png`)
        imageCell.leftAligned()
        imageCell.widthWeight = 1

    let titleCell = row.addText(
        await iModule.calcDate(df, datas.daily[i].dt, 'EEEE, dd.MMMM'),
        `↑${await iModule.calcTemp(datas.daily[i].temp.max)+unitSymb} ↓${await iModule.calcTemp(datas.daily[i].temp.min)+unitSymb} • ⇣${Math.round(datas.daily[i].pop * 100 / 1)}% • ${datas.daily[i].weather[0].description}`)
        titleCell.widthWeight = 5
        titleCell.titleFont = Font.mediumMonospacedSystemFont(16)
        titleCell.subtitleFont = Font.lightMonospacedSystemFont(12)
        titleCell.subtitleColor = new Color('#EF7150')
        table.addRow(row)
     };
 



  let sourceRow = new UITableRow()
      sourceRow.height = 55
      sourceRow.cellSpacing = 3
      sourceRow.onSelect = async function(){ 
      await iModule.popUp(
        datas.alerts[0].sender_name,
        datas.alerts[0].event + ':\n' +  datas.alerts[0].description + '\n' + await iModule.calcDate(df, datas.alerts[0].start, 'EEEE, dd.MM.yy, HH:mm') + ' - ' + await iModule.calcDate(df, datas.alerts[0].end, 'EEEE, dd.MM.yy, HH:mm'))
    }
    
  let sourceRowCellImg = UITableCell.image(await iModule.sfSymbol('bolt.trianglebadge.exclamationmark.fill', 'ffffff', 1))
      sourceRowCellImg.widthWeight = 1
      sourceRowCellImg.leftAligned()
     
  let sourceContent = (datas.alerts == undefined) ? "No weather sources or alerts found in your area!" : datas.alerts[0].sender_name + ': ' + datas.alerts[0].event
  
  let sourceRowCellTxt = UITableCell.text(sourceContent) 
      sourceRowCellTxt.titleFont = Font.lightRoundedSystemFont(15)
      sourceRowCellTxt.titleColor = new Color('#EF7150')
      sourceRowCellTxt.widthWeight = 9
      sourceRowCellTxt.leftAligned()
      
      sourceRow.addCell(sourceRowCellImg)
      sourceRow.addCell(sourceRowCellTxt)
      
      table.addRow(sourceRow)
  
  let creditFooter = new UITableRow() 
      creditFooter.height = 40 
      creditFooter.cellSpacing = 7
   
  let creditFooterCellImg = UITableCell.imageAtURL('https://cdn-icons-png.flaticon.com/512/25/25231.png')
      creditFooterCellImg.widthWeight = 1
  
  let creditFooterCellbutton = UITableCell.button("Created by iamrbn - Show on GitHub↗")
      creditFooterCellbutton.widthWeight = 10
      creditFooterCellbutton.onTap = () => Safari.openInApp("https://github.com/iamrbn/Inline-Weather", false)
   
      creditFooter.addCell(creditFooterCellImg)
      creditFooter.addCell(creditFooterCellbutton)
      
      table.addRow(creditFooter)

    return table
};


// ######## CREATE DETAIL VIEW ########
async function showDetailView(datas, idx){
  let table = new UITable()
      //table.showSeparators = true 
  let headerRow = new UITableRow()
      headerRow.backgroundColor = new Color('#48484A')
      headerRow.isHeader = true
      headerRow.height = 65
      headerRow.dismissOnSelect = false
       
  let iconCell = UITableCell.imageAtURL('https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png')
      iconCell.widthWeight = 25
      headerRow.addCell(iconCell)
      table.addRow(headerRow)
   
  let row = new UITableRow()
      row.height = 85
      row.cellSpacing = 25
      
  let textCell = row.addText(await iModule.calcDate(df, datas.daily[idx].dt, 'EEEE, dd.MMMM'))
      textCell.widthWeight = 25
      textCell.titleFont = Font.boldMonospacedSystemFont(25)  
      //textCell.subtitleColor = new Color('#EF7150')
      //textCell.subtitleFont = Font.semiboldMonospacedSystemFont(25)
      textCell.leftAligned() 
  let imageCell = row.addImageAtURL(`http://openweathermap.org/img/wn/${datas.daily[idx].weather[0].icon}@2x.png`)
      imageCell.widthWeight = 15
      imageCell.rightAligned()
      table.addRow(row)
  
  let row1 = new UITableRow()
      row1.height = 40
  let textCell1 = row1.addText("" + datas.daily[idx].weather[0].description)
      textCell1.titleColor = new Color('#EF7150')
      textCell1.titleFont = Font.semiboldMonospacedSystemFont(25)
      textCell1.leftAligned()
      table.addRow(row1)
  
  let row2 = new UITableRow()
      row2.height = 66
  
  let sfCell = row2.addImage(await iModule.sfSymbol('arrow.up', '#EF7150', 0))
      sfCell.leftAligned()
  let txtCell = row2.addText(await iModule.calcTemp(datas.daily[idx].temp.max) + unitSymb, 'Highest')
      txtCell.titleColor = new Color('#EF7150')
      txtCell.titleFont = Font.regularMonospacedSystemFont(14)
      txtCell.subtitleFont = Font.lightMonospacedSystemFont(9)
  
  let sfCell2 = row2.addImage(await iModule.sfSymbol('arrow.down', '#EF7150', 0))
      sfCell2.leftAligned()
  let txtCell2 = row2.addText(await iModule.calcTemp(datas.daily[idx].temp.min) + unitSymb, "Lowest")
      txtCell2.titleColor = new Color('#EF7150')
      txtCell2.titleFont = Font.regularMonospacedSystemFont(14)
      txtCell2.subtitleFont = Font.lightMonospacedSystemFont(9)
  
  let sfCell3 = row2.addImage(await iModule.sfSymbol('person.and.background.dotted', '#EF7150', 0))
      sfCell3.leftAligned()
  let txtCell3 = row2.addText(await iModule.calcTemp(datas.daily[idx].feels_like.day) + unitSymb, "Feels Like")
      txtCell3.titleColor = new Color('#EF7150')
      txtCell3.titleFont = Font.regularMonospacedSystemFont(14)
      txtCell3.subtitleFont = Font.lightMonospacedSystemFont(9)
      txtCell3.rightAligned()
  
      table.addRow(row2)
      
  await iModule.createTableRow(table, 'person.and.background.dotted', 'Feels Like By Night: ' + await iModule.calcTemp(datas.daily[idx].feels_like.night) + unitSymb)
  await iModule.createTableRow(table, 'drop.fill', 'Probability Of Precipitation: ' + Math.round(datas.daily[idx].pop*100/1) + '%')
  await iModule.createTableRow(table, 'drop.triangle.fill', 'Precipitation: ' + datas.daily[idx].rain + 'mm/h')
  await iModule.createTableRow(table, 'sunrise.fill', 'Sunrise: ' + await iModule.calcTime(df, datas.daily[idx].sunrise))
  await iModule.createTableRow(table, 'sunset.fill', 'Sunset: ' + await iModule.calcTime(df, datas.daily[idx].sunset))
  await iModule.createTableRow(table, 'sun.max.fill', 'UV Index: ' + datas.daily[idx].uvi)
  await iModule.createTableRow(table, 'cloud.fill', 'Clouds: ' + datas.daily[idx].clouds + '%')
  await iModule.createTableRow(table, 'wind', 'Wind Speed: ' + datas.daily[idx].wind_speed + unitSpeed + ' | ' + await iModule.calcWindDirection(data, idx))
  await iModule.createTableRow(table, 'humidity.fill', 'Humidity: ' + datas.daily[idx].humidity + '%')
  await iModule.createTableRow(table, 'arrow.right.and.line.vertical.and.arrow.left', 'Pressure: ' + datas.daily[idx].pressure + 'hPa')
  moon = await iModule.calcMoonPhase(datas, idx)
  await iModule.createTableRow(table,  moon[0], `Moon Phase: ${moon[1]} (${datas.daily[idx].moon_phase})`)
  
  return table
};


async function changeLocation(id, currentLoc){
  alrt = new Alert()
  alrt.title = 'Change Location'
  alrt.message = 'CityID of your current location: ' + id
  alrt.addTextField('Search location by name...', currentLoc)
  alrt.addAction('Change')
  alrt.addCancelAction('Cancel')
  if (await alrt.present() === 0){
  coord = await iModule.getFromAPI(`https://api.openweathermap.org/data/2.5/weather?q=${ await iModule.replaceUmlauts(alrt.textFieldValue(0)) },${ language }&units=${ unit }&lang=${ language }&appid=${ await iModule.getAPIKey() }`)
  dataLoc = await iModule.getFromAPI(`https://api.openweathermap.org/data/3.0/onecall?lat=${ coord.coord.lat }&lon=${ coord.coord.lon }&exclude=minutely,hourly&units=${ unit }&lang=${ language }&appid=${ await iModule.getAPIKey() }`)
  QuickLook.present(await createTable(dataLoc))
    }
};


async function loadModule(){
  try {
    req = new Request('https://raw.githubusercontent.com/iamrbn/Inline-Weather/main/iModule.js')
    moduleFile = await req.loadString()
    fm.writeString(modulePath, moduleFile)
    console.warn('Loaded iModule.js file from github repo!')
  } catch (err){
    throw new Error(err.message)
  }
};


//====================================================
// ------------------- END OF SCRIPT -----------------
//====================================================
