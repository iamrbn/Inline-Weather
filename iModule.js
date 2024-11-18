
//=======================================//
//=========== START OF MODULE ===========//
//============= Version 1.1 =============//


let iconsID = {
  //thunderstorm
  200: "cloud.bolt.rain.fill",
  201: "cloud.bolt.rain.fill",
  202: "cloud.bolt.rain.fill",
  210: "cloud.sun.bolt.fill",
  211: "cloud.sun.bolt.fill",
  212: "cloud.sun.bolt.fill",
  221: "cloud.bolt.rain.fill",
  230: "cloud.bolt.rain.fill",
  231: "cloud.bolt.rain.fill",
  232: "cloud.bolt.rain.fill",
  //drizzle
  300: "cloud.drizzle.fill",
  301: "cloud.drizzle.fill",
  302: "cloud.drizzle.fill",
  310: "cloud.drizzle.fill",
  311: "cloud.drizzle.fill",
  312: "cloud.drizzle.fill",
  313: "cloud.drizzle.fill",
  314: "cloud.drizzle.fill",
  321: "cloud.drizzle.fill",
  //rain
  500: "cloud.rain.fill",
  501: "cloud.rain.fill",
  502: "cloud.heavyrain.fill",
  503: "cloud.heavyrain.fill",
  504: "cloud.heavyrain.fill",
  511: "cloud.sleet.fill",
  520: "cloud.heavyrain.fill",
  521: "cloud.heavyrain.fill",
  522: "cloud.heavyrain.fill",
  531: "cloud.heavyrain.fill",
  //snow
  600: "snowflake",
  601: "snowflake",
  602: "snowflake",
  611: "cloud.sleet.fill",
  612: "cloud.sleet.fill",
  613: "cloud.sleet.fill",
  615: "cloud.sleet.fill",
  616: "cloud.sleet.fill",
  620: "cloud.sleet.fill",
  621: "snowflake",
  622: "snowflake",
  //atmosphere
  701: "sun.haze.fill",
  711: "sun.haze.fill",
  721: "sun.haze.fill",
  731: "sun.dust.fill",
  741: "cloud.fog.fill",
  751: "sun.haze.fill",
  761: "sun.haze.fill",
  762: "sun.haze.fill",
  771: "sun.haze.fill",
  781: "tornado",
  //clear
  800: "sun.max.fill" || "moon.stars.fill",
  //clouds
  801: "cloud.sun.fill",
  802: "cloud.fill",
  803: "smoke.fill",
  804: "smoke.fill"
 };


async function getFromAPI(url){
    let res;
    try {
        res = await new Request(url).loadJSON()
        //log(res)
        if (res.cod !== undefined && res.cod !== 200) res = res.cod
    } catch (e){
        console.error("Error 404: " + e.message)
        res = 404
    }
    
    return res
};


async function getErrorCase(apiRes, needUpdate){
     fm = FileManager.iCloud()
     dir = fm.joinPath(fm.documentsDirectory(), 'Inline Weather')
     jsonPath = fm.joinPath(dir, 'apiKey.json')
     
     var errorCase = []
     if (!fm.fileExists(jsonPath)) errorCase.push('API-KEY')
     if (typeof apiRes === 'number') errorCase.push('API-ERROR')
     if (needUpdate) errorCase.push('UPDATE')
    
  return errorCase
};


async function getAPIKey(){
    fm = FileManager.iCloud()
    dir = fm.joinPath(fm.documentsDirectory(), 'Inline Weather')
    jsonPath = fm.joinPath(dir, 'apiKey.json')
    let key;
    try {
        await fm.downloadFileFromiCloud(jsonPath)
        data = await JSON.parse(fm.readString(jsonPath))
        key = data.APIKEY
        return key
    } catch (err){
        console.error(err.message)
        return 404
    }
};


async function askForAPIKey(){
     fm = FileManager.iCloud()
     dir = fm.joinPath(fm.documentsDirectory(), 'Inline Weather')
     jsonPath = fm.joinPath(dir, 'apiKey.json')
     
     a = new Alert()
     a.title = "No Data Found in iCloud"
     a.message = "Please Enter Your API Key"
     a.addTextField("API Key")
     a.addAction("Save")
     a.addDestructiveAction("Cancel")
     a.addAction("Create API-Key ↗")
     idx = await a.present()
     if (idx === 0){
         userDatas = {
          APIKEY: a.textFieldValue(0)
     }
         checkObj = Object.values(userDatas).every(value => value !== "" && value.length > 20)
         if (checkObj){
             FileManager.iCloud().writeString(jsonPath, JSON.stringify(userDatas, null, 1))
             await popUp('SUCCESSFULLY SAVED!', '~ iCloud/Scriptable/Inline Weather/apiKey.json')
         } else {
             await popUp('ERROR: Input Too Short!', 'Please Try Again')
         }
     } else if (idx === 1){
         throw new Error('User clicked Cancel')
     } else if (idx === 2){
         Safari.openInApp('https://home.openweathermap.org/api_keys', false)
     }
};


async function popUp(title ,message){
      a = new Alert()
      a.title = title
      a.message = message
      a.addAction("OK")
      await a.presentAlert()
};


async function calcWindDirection(data, idx){
     degrees =  data.daily[idx].wind_deg
     directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
     degrees = degrees * 8 / 360 // Split into the 8 directions
     degrees = Math.round(degrees, 0) // round to nearest integer.
     degrees = (degrees + 8) % 8 // Ensure it's within 0-7
    
 return directions[degrees]
};


async function calcMoonPhase(data, idx){
   /*
   data.daily[idx].moon_phase
  0 and 1 are 'new moon',
  0.25 is 'first quarter moon',
  0.5 is 'full moon'
  0.75 is 'last quarter moon'.
  The periods in between are called 'waxing crescent', 'waxing gibous', 'waning gibous', and 'waning crescent', respectively. 
  */
     mPhase = data.daily[idx].moon_phase
     moonsSF = ['moonphase.new.moon', 'moonphase.waxing.crescent', 'moonphase.first.quarter', 'moonphase.waxing.gibbous', 'moonphase.full.moon', 'moonphase.waning.gibbous', 'moonphase.last.quarter', 'moonphase.waning.crescent', 'moonphase.new.moon']
     moonsName = ['New Moon', 'Waxing Cresent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent', 'New Moon']
     mPhase = mPhase * 9 / 1
     mPhase = Math.floor(mPhase)
     mPhase = (mPhase + 9) % 9
     symb = moonsSF[mPhase]
     name = moonsName[mPhase]
     //log(arr)
     
 return [symb, name]
};


async function infoWidget(type, widget, stack, version){
    stack.addAccessoryWidgetBackground = true
    stack.refreshAfterDate = new Date(Date.now() + 1000 * 60 * 1)
    stack.setPadding(0, 0, 0, 0)
    //throw new Error(xxx)
    
    if (type.includes('API-KEY')){
         sfName = 'questionmark.key.filled'
         title = 'Bad API Request'
         subtitle = 'Please Check Your API Key'
    } else if (type.includes('API-ERROR')){
         sfName = 'network.slash'
         title = 'No API Response'
         subtitle = 'Please Check Your Internet Connection'
    } else if (type.includes('UPDATE')){
         sfName = 'square.and.arrow.down'// gearshape.arrow.trianglehead.2.clockwise.rotate.90; square.and.arrow.down; exclamationmark.arrow.trianglehead.2.clockwise.rotate.90
         title = `Update ${version} Available`
         subtitle = 'Please Run Script To Update'
    }
    
    sf = SFSymbol.named(sfName)
    sf.applyFont(Font.semiboldRoundedSystemFont(200))
    
    if (widget === 'accessoryInline'){
         sf.applyFont(Font.boldRoundedSystemFont(19))
         stack.addImage(sf.image)
         stack.addText(title)
    } else if (widget === 'accessoryCircular'){
         stack.addSpacer(6)
         img = stack.addImage(sf.image)
         img.imageSize = new Size(20, 18)
         img.tintColor = Color.white()
         img.centerAlignImage()
         txt = stack.addText(await title.replace(/(\d)\s/, '$1\n'))
         txt.lineLimit = 3
         txt.font = Font.regularRoundedSystemFont(8)
         txt.centerAlignText()
         stack.addSpacer()
    } else if (widget === 'accessoryRectangular'){
         img = stack.addImage(sf.image)
         img.imageSize = new Size(25, 23)
         img.tintColor = Color.white()
         img.centerAlignImage()
         title = stack.addText(title)
         title.font = Font.regularRoundedSystemFont(13)
         title.centerAlignText()
         body = stack.addText(subtitle)
         body.lineLimit = 1
         body.font = Font.regularRoundedSystemFont(8)
         body.minimumScaleFactor = 0.7
         body.centerAlignText() 
    }

    return stack
};


async function getSF(key, icon){
     sfName = iconsID[key]
     if (icon.includes("n") && sfName.includes("sun")) sfName = sfName.replace("sun", "moon")
     if (key === 800 && icon.includes("n")) sfName = "moon.stars.fill"
     if (key === 731 && icon.includes("n")) sfName = "moon.haze.fill"
  
  return sfName
};


async function sfSymbol(name){
     sf = SFSymbol.named(name)
     sf.applyFont(Font.regularMonospacedSystemFont(150))
     //img = sf.image
     //img.applyRegularWeight()
     //img.tintColor = new Color(color)//hex
     //img.imageSize = new Size(size, size)

 return sf.image
};


async function calcTemp(temp){
    return Math.round(temp)
};


async function calcTime(df, timestamp){
     df.dateFormat = 'HH:mm:ss'
     df.useShortTimeStyle()
     calc = 1000*60*1//60.000
  
 return df.string(new Date(Math.round(timestamp*1000/calc)*calc))
};


async function calcDate(df, timestamp, format){
     df.dateFormat = format//stays for the day name
    
 return df.string(new Date(timestamp*1000))
};


async function loadIcon(name){
     symbol = new Request(`https://openweathermap.org/img/wn/${name}@2x.png`).loadImage()
     symbol.size = new Size(40, 40)
      
return symbol
};


async function replaceUmlauts(name){
     cityName = name.toLowerCase()
     cityName = cityName.replace(/ä/g, 'ae')
     cityName = cityName.replace(/ö/g, 'oe')
     cityName = cityName.replace(/ü/g, 'ue')
     cityName = cityName.replace(/ß/g, 'ss')
     
return cityName
};


async function createHorizontallyStack(sfSymbol, sfSize, baseStack, newStack, text, textSize){
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


async function createVerticallyStack(day, pop, sfSymbol, sfSize, baseStack, newStack, text1, text2, textSize, unitSymb){
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
  
  return newStack
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


//Checks if's there an server update on GitHub available
async function updateCheck(version){
    fm = FileManager.iCloud()
    dir = fm.joinPath(fm.documentsDirectory(), 'Inline Weather')
    modulePath = fm.joinPath(dir, "iModule.js")
    
    url = 'https://raw.githubusercontent.com/iamrbn/Inline-Weather/main/'
    endpoints = ['Inline-Weather.js', 'iModule.js']
  
    let uC;
    try {
      uC = await new Request(url+endpoints[0]+'on').loadJSON()
    } catch (err){
        return log(err.message)
        }

  needUpdate = false
  if (uC.version > version){
     needUpdate = true
    if (config.runsInApp){
      //console.error(`New Server Version ${uC.version} Available`)
      let newAlert = new Alert()
          newAlert.title = `New Server Version ${uC.version} Available!`
          newAlert.addAction("OK")
          newAlert.addDestructiveAction("Later")
          newAlert.message="Changes:\n" + uC.notes + "\n\nOK starts the download from GitHub\n More informations about the update changes go to the GitHub Repo"
      if (await newAlert.present() == 0){
        reqCode = new Request(url+endpoints[0])
        updatedCode = await reqCode.loadString()
        pathCode = fm.joinPath(fm.documentsDirectory(), `${Script.name()}.js`)
        fm.writeString(pathCode, updatedCode)
        reqModule = new Request(url+endpoints[1])
        moduleFile = await reqModule.loadString()
        fm.writeString(modulePath, moduleFile)
        throw new Error("Update Complete!")
      }
    }
  } else {
      log(">> SCRIPT IS UP TO DATE!")
      }
  return {uC, needUpdate}
};


// export functions
module.exports = {
    updateCheck,
    createHorizontallyStack,
    popUp,
    createVerticallyStack,
    askForAPIKey,
    getAPIKey,
    infoWidget,
    createTableRow,
    replaceUmlauts,
    loadIcon,
    calcDate,
    calcTime,
    calcTemp,
    sfSymbol,
    getSF,
    calcMoonPhase,
    calcWindDirection,
    getErrorCase,
    getFromAPI
}


//=========================================//
//============== END OF MODULE ============//
//=========================================//

