//=======================================//
//=========== START OF MODULE ===========//
//============= Version 1.0 =============//


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


module.exports.getFromAPI = async (apiURL) => {
  let data;
  try {
    data = await new Request(apiURL).loadJSON()
  } catch (error){
    console.error("ERROR:\n" + JSON.stringify(error))
  }
  return data
};


module.exports.calcWindDirection = (data, idx) => {
    degrees =  data.daily[idx].wind_deg
    directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    degrees = degrees * 8 / 360 // Split into the 8 directions
    degrees = Math.round(degrees, 0) // round to nearest integer.
    degrees = (degrees + 8) % 8 // Ensure it's within 0-7
 return directions[degrees]
};


module.exports.calcMoonPhase = (data, idx) => {
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
 return [symb, name]
};


module.exports.getSF = (key, icon) => {
    sfName = iconsID[key]
     if (icon.includes("n") && sfName.includes("sun")) sfName = sfName.replace("sun", "moon")
     if (key === 800 && icon.includes("n")) sfName = "moon.stars.fill"
     if (key === 731 && icon.includes("n")) sfName = "moon.haze.fill"
  return sfName
};


module.exports.sfSymbol = (name, color, size) => {
  sf = SFSymbol.named(name)
  sf.applyFont(Font.regularMonospacedSystemFont(size))
  sf.applyRegularWeight()
  sf.tintColor = new Color(color)//hex
  sf.imageSize = new Size(size, size)
 return sf.image
};


module.exports.calcTemp = (temp) => {
return Math.round(temp)
};


module.exports.calcTime = (df, timestamp) => {
  df.dateFormat = 'HH:mm:ss'
  df.useShortTimeStyle()
  calc = 1000*60*1//60.000
 return df.string(new Date(Math.round(timestamp*1000/calc)*calc))
};


module.exports.calcDate = (df, timestamp, format) => {
    df.dateFormat = format//stays for the day name
 return df.string(new Date(timestamp*1000))
};


module.exports.loadIcon = (name) => {
      symbol = new Request(`https://openweathermap.org/img/wn/${name}@2x.png`).loadImage()
      symbol.size = new Size(40, 40)
return symbol
};


module.exports.replaceUmlauts = (name) => {
cityName = name.toLowerCase()
cityName = cityName.replace(/ä/g, 'ae')
cityName = cityName.replace(/ö/g, 'oe')
cityName = cityName.replace(/ü/g, 'ue')
cityName = cityName.replace(/ß/g, 'ss')
return cityName
};


//Checks if's there an server update on GitHub available
module.exports.updateCheck = async (fm, modulePath, version) => {
  let url = 'https://raw.githubusercontent.com/iamrbn/Inline-Weather/main/'
  let endpoints = ['Inline-Weather.js', 'module.js']
  
  if (!fm.fileExists(modulePath)){
    req = new Request(url+endpoints[1])
    moduleFile = await req.loadString()
    fm.writeString(modulePath, moduleFile)
    console.warn('loaded modul.js file from github')
  }
    let uC;
    try {
      updateCheck = new Request(url+endpoints[0]+'on')
      uC = await updateCheck.loadJSON()
    } catch (e){
        return log(e)
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


//=========================================//
//============== END OF MODULE ============//
//=========================================//
