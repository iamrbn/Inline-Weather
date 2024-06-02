// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: sun;

//+++++++++++ START CONFIG AREA +++++++++++++++
const unit = 'metric' //Units of measurement: 'standard', 'metric' and 'imperial' units are available.
const unitSymb = '°' //Celsius
const unitSpeed = 'km/h'
const language = 'de' //learn more: https://openweathermap.org/current#multi
const apiKey = "YOUR API KEY GOES HERE"
const standardParameter = "30;current"//Refresh Intervall; Weather-Datas (current or forecast)
//+++++++++++++ END CONFIG AREA ++++++++++++++

let df = new DateFormatter()
let fm = FileManager.iCloud()
let dir = fm.joinPath(fm.documentsDirectory(), 'Inline Weather')
if (!fm.fileExists(dir)) fm.createDirectory(dir)
let modulePath = fm.joinPath(dir, "module.js")
if (!fm.fileExists(modulePath))await loadModule()
fm.downloadFileFromiCloud(modulePath)
let module = importModule('Inline Weather/module')
let uCheck = await module.updateCheck(fm, modulePath, 1.0)
let wSize = config.widgetFamily
let wParameter = await args.widgetParameter
if (wParameter == null || wParameter.length <= 3) wParameter = standardParameter
let refreshInt = wParameter.match(/\d/g).join("")
let wContent =  wParameter.match(/[a-zA-Z]/g).join("")

Location.setAccuracyToHundredMeters()
let location = await Location.current()
let data = await module.getFromAPI(`https://api.openweathermap.org/data/2.5/onecall?lat=${ location.latitude }&lon=${ location.longitude }&exclude=minutely,hourly&units=${ unit }&lang=${ language }&appid=${ apiKey }`)
//console.log(JSON.stringify(data, null, 2))
//log(`https://api.openweathermap.org/data/2.5/onecall?lat=${ location.latitude }&lon=${ location.longitude }&exclude=minutely,hourly&units=metric&lang=de&appid=${ apiKey }`)

if (config.runsInAccessoryWidget || config.runsInWidget){
 switch(wSize){
   case 'accessoryInline': w = await createInline(); w.presentAccessoryInline(); break;
   case 'accessoryRectangular': if(wContent == 'current'){w = await createRectangularCurrent(); w.presentAccessoryRectangular();} else if(wContent == 'forecast'){w = await createRectangularForecast(); w.presentAccessoryRectangular()} break;
   case 'accessoryCircular': w = await createCircular(); w.presentAccessoryCircular(); break;
   default: w = await createInline(); w.presentAccessoryInline(); break;
 }
 Script.setWidget(w)
 Script.complete()
} else if (config.runsInApp){
  QuickLook.present(await createTable(data))
};


//########### CREATE INLINE LS WIDGET #########
async function createInline(){
	let w = new ListWidget()
	    w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
	let stck = w.addStack()
	await createHorizontallyStack(
    module.getSF(data.current.weather[0].id, data.current.weather[0].icon),
    18,
    stck,
    "h1",
    module.calcTemp(data.current.temp) + unitSymb + ' ↑' + module.calcTemp(data.daily[0].temp.max) + '↓' + module.calcTemp(data.daily[0].temp.min) + ' ⇣' + Math.round(data.daily[0].pop * 100 / 1) + '%',
    10
    )
  return w
};


//######### CREATE CIRCULAR LS WIDGET ###########
async function createCircular(){
  let w = new ListWidget()
      w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
      w.addAccessoryWidgetBackground = true
      //w.setPadding(0, 5, 0, 5)
  let sf = SFSymbol.named(module.getSF(data.current.weather[0].id, data.current.weather[0].icon))
      sf.applyFont(Font.lightSystemFont(125))
      sf.applyLightWeight()
      
  let mainStack = w.addStack()
      mainStack.layoutVertically()
      mainStack.size = new Size(70, 70)//75
      //mainStack.backgroundColor = Color.black()
      
  let topStack = mainStack.addStack()
      topStack.bottomAlignContent()
      //topStack.backgroundColor = Color.green()
      
      topStack.addSpacer()
      
  let txt = topStack.addText(module.calcTemp(data.current.temp)+unitSymb)
      txt.font = Font.regularSystemFont(17)
      txt.leftAlignText()
      topStack.addSpacer(2)
      //txt.minimumScaleFactor = 0.8
  let img = topStack.addImage(sf.image)
      img.imageSize = new Size(27, 22)
      img.centerAlignImage()
      
      topStack.addSpacer(6)
      
  let middleStack = mainStack.addStack()
      middleStack.bottomAlignContent()
      //middleStack.backgroundColor = Color.red()
      
      middleStack.addSpacer()
      
  let desc = middleStack.addText('↑' + module.calcTemp(data.daily[0].temp.max) + unitSymb + ' ↓' + module.calcTemp(data.daily[0].temp.min) + unitSymb)
      desc.font = Font.lightSystemFont(12)
      desc.lineLimit = 1
      desc.minimumScaleFactor = 0.8
      desc.centerAlignText()
      
      middleStack.addSpacer()
      
  let bottomStack = mainStack.addStack()
      bottomStack.bottomAlignContent()
      //bottomStack.backgroundColor = Color.purple()
      
      bottomStack.addSpacer()
      
  let desc2 = bottomStack.addText('⇣' + data.daily[0].pop*100/1 + '%')
      desc2.font = Font.lightSystemFont(12)
      desc2.lineLimit = 1
      desc2.minimumScaleFactor = 0.8
      desc2.centerAlignText()
      //w.addSpacer(1)
      
      bottomStack.addSpacer()
      
  return w
};


//########## CREATE RECTANGULAR CURRENT ###########
async function createRectangularCurrent(){
 let w = new ListWidget()
     w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
     w.addAccessoryWidgetBackground = true
     w.setPadding(0, 0, 0, 0)
    
 let mainStack = w.addStack()
     mainStack.layoutVertically()
     mainStack.centerAlignContent()
     //mainStack.backgroundColor = Color.green()
      
 let headerStack = mainStack.addStack()
     headerStack.bottomAlignContent()
     headerStack.setPadding(0, 0, -1, 0)
     //headerStack.backgroundColor = Color.purple()
    
 let bodyStack = mainStack.addStack()
     bodyStack.centerAlignContent()
     //bodyStack.backgroundColor = Color.yellow()
    
 let leftBodyStack = bodyStack.addStack()
     leftBodyStack.layoutVertically()
     leftBodyStack.centerAlignContent()
     leftBodyStack.spacing = -1
     //leftBodyStack.backgroundColor = Color.blue()

 let rightBodyStack = bodyStack.addStack()
     rightBodyStack.layoutVertically()
     rightBodyStack.centerAlignContent()
     rightBodyStack.spacing = -1
     //rightBodyStack.backgroundColor = Color.black()
   
 await createHorizontallyStack(module.getSF(data.current.weather[0].id, data.current.weather[0].icon), 16, headerStack, "h1", module.calcTemp(data.current.temp)+unitSymb+ ' ' +data.daily[0].weather[0].description, 13)
 await createHorizontallyStack('arrow.up.square', 11, leftBodyStack, "line1", module.calcTemp(data.daily[0].temp.max)+unitSymb, 11)
 await createHorizontallyStack('arrow.down.square', 11, leftBodyStack, "line2", module.calcTemp(data.daily[0].temp.min)+unitSymb, 11)
 await createHorizontallyStack('sunrise.fill', 12, leftBodyStack, "line3", module.calcTime(df, data.current.sunrise), 10)
 await createHorizontallyStack('sunset.fill', 12, leftBodyStack, "line4", module.calcTime(df, data.current.sunset), 10)

 await createHorizontallyStack('person.and.background.dotted', 13, rightBodyStack, "line1", module.calcTemp(data.current.feels_like)+unitSymb, 11)
 await createHorizontallyStack('cloud.fill', 12, rightBodyStack, "line2", data.current.clouds + '%', 11)
 await createHorizontallyStack('wind', 12, rightBodyStack, "line3", data.current.wind_speed + unitSpeed + ' | ' + module.calcWindDirection(data, 0), 11)
 await createHorizontallyStack(module.calcMoonPhase(data, 0)[0], 10, rightBodyStack, "line4", module.calcMoonPhase(data, 0)[1], 11)

  return w
};


//########## CREATE RECTANGULAR FORECAST ###########
async function createRectangularForecast(){
  let w = new ListWidget()
      w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
      //w.addAccessoryWidgetBackground = true
  
  let mainStack = w.addStack()
      mainStack.layoutVertically()
  
  let headerStack = mainStack.addStack()
  let bodyStack = mainStack.addStack()
  
  await createHorizontallyStack(module.getSF(data.current.weather[0].id, data.current.weather[0].icon), 15, headerStack, "h", module.calcTemp(data.current.temp) + unitSymb + ' ' + data.daily[0].weather[0].description, 11)
  
      bodyStack.addSpacer(1)
  
  let rows = 6
  for (let i=0; i<rows; i++){
  createVerticallyStack(module.calcDate(df, data.daily[i].dt, 'EE'), Math.round(data.daily[i].pop*100/1), module.getSF(data.daily[i].weather[0].id, data.daily[i].weather[0].icon), 16, bodyStack, 'd2', module.calcTemp(data.daily[i].temp.max), module.calcTemp(data.daily[i].temp.min), 7)
};

return w
};


// ############ CREATE TABLE ###########
async function createTable(datas){
  let table = new UITable();
      table.showSeparators = true
  
  let headerRow = new UITableRow()
      headerRow.backgroundColor = new Color('#48484A')
      headerRow.isHeader = true
      headerRow.height = 65
      headerRow.dismissOnSelect = false

      iconCell = UITableCell.imageAtURL('https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png')
      iconCell.widthWeight = 25
      headerRow.addCell(iconCell)
      
  let cityDatas = await module.getFromAPI(`https://api.openweathermap.org/data/2.5/weather?lat=${ datas.lat }&lon=${ datas.lon }&units=${ unit }&lang=${ language }&appid=${ apiKey }`)
      textCell = UITableCell.button('📍'+ cityDatas.name)
      textCell.onTap = () => changeLocation(cityDatas.id.toString(), cityDatas.name)
      //cityIDPopUp()
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
      uImage = uRow.addImage(module.sfSymbol('square.and.arrow.down', '#007AFF', 10))//007AFF
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
        module.calcDate(df, datas.daily[i].dt, 'EEEE, dd.MMMM'),
        `↑${module.calcTemp(datas.daily[i].temp.max)+unitSymb} ↓${module.calcTemp(datas.daily[i].temp.min)+unitSymb} • ⇣${Math.round(datas.daily[i].pop * 100 / 1)}% • ${datas.daily[i].weather[0].description}`)
        titleCell.widthWeight = 5
        titleCell.titleFont = Font.mediumMonospacedSystemFont(16)
        titleCell.subtitleFont = Font.lightMonospacedSystemFont(12)
        titleCell.subtitleColor = new Color('#EF7150')
        table.addRow(row)
     };
 
  let sourceRow = new UITableRow()
      sourceRow.height = 50
      sourceRow.cellSpacing = 2
      sourceRow.onSelect = async function(){
      await weatherPopUp(datas)
    }
      
  let sourceContent = (datas.alerts == undefined) ? "No weather sources or alerts found in your area!" : datas.alerts[0].sender_name + ': ' + datas.alerts[0].event
   
  let footerCell = sourceRow.addText(sourceContent) 
      footerCell.titleFont = Font.lightRoundedSystemFont(15)
      footerCell.titleColor = new Color('#EF7150')
      footerCell.leftAligned() 
  
      //sourceRow.addCell(footerCell)
      table.addRow(sourceRow) 
  
  let creditFooter = new UITableRow() 
      creditFooter.height = 40
      creditFooter.cellSpacing = 7 
  
  let creditFooterCellImg = UITableCell.imageAtURL('https://cdn-icons-png.flaticon.com/512/25/25231.png')
      creditFooterCellImg.widthWeight = 1
  
  let creditFooterCellbutton = UITableCell.button("Created by iamrbn - Show on GitHub↗")
      creditFooterCellbutton.widthWeight = 15
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
      
  let textCell = row.addText(module.calcDate(df, datas.daily[idx].dt, 'EEEE, dd.MMMM'))
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
  let textCell1 = row1.addText(">" + datas.daily[idx].weather[0].description)
      textCell1.titleColor = new Color('#EF7150')
      textCell1.titleFont = Font.semiboldMonospacedSystemFont(25)
      textCell1.leftAligned()
      table.addRow(row1)
  
  let row2 = new UITableRow()
      row2.height = 66
  
  let sfCell = row2.addImage(module.sfSymbol('arrow.up', '#EF7150', 0))
      sfCell.leftAligned()
  let txtCell = row2.addText(module.calcTemp(datas.daily[idx].temp.max) + unitSymb, 'Highest')
      txtCell.titleColor = new Color('#EF7150')
      txtCell.titleFont = Font.regularMonospacedSystemFont(14)
      txtCell.subtitleFont = Font.lightMonospacedSystemFont(9)
  
  let sfCell2 = row2.addImage(module.sfSymbol('arrow.down', '#EF7150', 0))
      sfCell2.leftAligned()
  let txtCell2 = row2.addText(module.calcTemp(datas.daily[idx].temp.min) + unitSymb, "Lowest")
      txtCell2.titleColor = new Color('#EF7150')
      txtCell2.titleFont = Font.regularMonospacedSystemFont(14)
      txtCell2.subtitleFont = Font.lightMonospacedSystemFont(9)
  
  let sfCell3 = row2.addImage(module.sfSymbol('person.and.background.dotted', '#EF7150', 0))
      sfCell3.leftAligned()
  let txtCell3 = row2.addText(module.calcTemp(datas.daily[idx].feels_like.day) + unitSymb, "Feels Like")
      txtCell3.titleColor = new Color('#EF7150')
      txtCell3.titleFont = Font.regularMonospacedSystemFont(14)
      txtCell3.subtitleFont = Font.lightMonospacedSystemFont(9)
      txtCell3.rightAligned()
  
      table.addRow(row2)
  
  await createTableRow(table, 'person.and.background.dotted', 'Feels Like By Night: ' + module.calcTemp(datas.daily[idx].feels_like.night) + unitSymb)
  await createTableRow(table, 'drop.fill', 'Probability Of Precipitation: ' + Math.round(datas.daily[idx].pop*100/1) + '%')
  await createTableRow(table, 'drop.triangle.fill', 'Precipitation: ' + datas.daily[idx].rain + 'mm/h')
  await createTableRow(table, 'sunrise.fill', 'Sunrise: ' + module.calcTime(df, datas.daily[idx].sunrise))
  await createTableRow(table, 'sunset.fill', 'Sunset: ' + module.calcTime(df, datas.daily[idx].sunset))
  await createTableRow(table, 'sun.max.fill', 'UV Index: ' + datas.daily[idx].uvi)
  await createTableRow(table, 'cloud.fill', 'Clouds: ' + datas.daily[idx].clouds + '%')
  await createTableRow(table, 'wind', 'Wind Speed: ' + datas.daily[idx].wind_speed + unitSpeed + ' | ' + module.calcWindDirection(data, idx))
  await createTableRow(table, 'humidity.fill', 'Humidity: ' + datas.daily[idx].humidity + '%')
  await createTableRow(table, 'arrow.right.and.line.vertical.and.arrow.left', 'Pressure: ' + datas.daily[idx].pressure + 'hPa')
  await createTableRow(table, module.calcMoonPhase(data, idx)[0], 'Moon Phase: ' + module.calcMoonPhase(data, idx)[1] + ' (' + datas.daily[idx].moon_phase + ')')
  
  return table
};

async function createTableRow(table, sf, text){
  row = new UITableRow()
  row.dismissOnSelect = false
  row.height = 45
  row.cellSpacing = 5
  
  sf = SFSymbol.named(sf)
  sf.applyFont(Font.regularMonospacedSystemFont(45))
  sf.applyBoldWeight()
  sf.tintColor = new Color('#EF7150')
  sf.imageSize = new Size(15, 15)
  
  cell1 = UITableCell.image(sf.image)
  cell1.widthWeight = 5
  cell1.centerAligned()
  cell2 = UITableCell.text(text)
  cell2.titleFont = Font.thinMonospacedSystemFont(12)
  cell2.minimumScaleFactor = 0.8
  cell2.widthWeight = 25
  
  row.addCell(cell1)
  row.addCell(cell2)
  
  table.addRow(row)
};

function createVerticallyStack(day, pop, sfSymbol, sfSize, baseStack, newStack, text1, text2, textSize){
  newStack = baseStack.addStack()
  newStack.layoutVertically()
  newStack.centerAlignContent()
  newStack.size = new Size(23.5, 42)
  newStack.spacing = -2
  
  date = newStack.addText(day)
  date.font = Font.boldSystemFont(textSize)
  date.textColor = Color.white()
  
  newStack.addSpacer(3)
  
  rain = newStack.addText(pop+"%")
  rain.font = Font.mediumSystemFont(textSize-1)
  rain.textColor = Color.white()
  
  newStack.addSpacer(3)
  
  sf = SFSymbol.named(sfSymbol)
  sf.applyFont(Font.lightRoundedSystemFont(45))
  img = newStack.addImage(sf.image)
  img.imageSize = new Size(sfSize, sfSize)
  img.tintColor = Color.white()
  
  newStack.addSpacer(3)
  
  txt1 = newStack.addText('↑' + text1 + unitSymb)
  txt1.font = Font.regularSystemFont(textSize)
  txt1.textColor = Color.white()
  
  txt2 = newStack.addText('↓' + text2 + unitSymb)
  txt2.font = Font.mediumSystemFont(textSize)
  txt2.textColor = Color.white()
};

function createHorizontallyStack(sfSymbol, sfSize, baseStack, newStack, text, textSize){
  newStack = baseStack.addStack()
  newStack.centerAlignContent()  
  sf = SFSymbol.named(sfSymbol)
  sf.applyFont(Font.lightMonospacedSystemFont(sfSize))
  sf.applyBoldWeight()
  img = newStack.addImage(sf.image)
  img.imageSize = new Size(sfSize, sfSize)
  img.tintColor = Color.white()
  text = newStack.addText(text)
  text.font = Font.regularMonospacedSystemFont(textSize)
  text.textColor = Color.white()
  text.minimumScaleFactor = 0.6
  text.lineLimit = 1
  newStack.addSpacer()
};

async function weatherPopUp(datas){
 alrt = new Alert()
 alrt.title = datas.alerts[1].sender_name
 alrt.message = datas.alerts[1].event + ':\n' +  datas.alerts[1].description + '\n' + module.calcDate(df, datas.alerts[1].start, 'EEEE, dd.MM.yy, HH:mm') + ' - ' + module.calcDate(df, datas.alerts[1].end, 'EEEE, dd.MM.yy, HH:mm')
 alrt.addAction('OK')
 await alrt.presentSheet()
};

async function changeLocation(id, currentLoc){
  alrt = new Alert()
  alrt.title = 'Change Location'
  alrt.message = 'CityID of your current location: ' + id
  alrt.addTextField('Search city by name', currentLoc)
  alrt.addAction('Change')
  alrt.addCancelAction('Cancel')
  idx = await alrt.present()
  if (idx===0){
  log(module.replaceUmlauts(alrt.textFieldValue(0)))
  coord = await module.getFromAPI(`https://api.openweathermap.org/data/2.5/weather?q=${ module.replaceUmlauts(alrt.textFieldValue(0)) },${ language }&units=${ unit }&lang=${ language }&appid=${ apiKey }`)
  log({coord})
  long = coord.coord.lon
  lati = coord.coord.lat
  log({long,lati})
  dataLoc = await module.getFromAPI(`https://api.openweathermap.org/data/2.5/onecall?lat=${ lati }&lon=${ long }&exclude=minutely,hourly&units=${ unit }&lang=${ language }&appid=${ apiKey }`)
  log({dataLoc})
  QuickLook.present(await createTable(dataLoc))
    }
};

async function loadModule(){
   req = new Request('https://raw.githubusercontent.com/iamrbn/Inline-Weather/main/module.js')
   moduleFile = await req.loadString()
   fm.writeString(modulePath, moduleFile)
   console.warn('loaded modul.js file from github')
};

//====================================================
// ------------------- END OF SCRIPT -----------------
//====================================================
