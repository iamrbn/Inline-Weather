# <img src=https://openweathermap.org/themes/openweathermap/assets/img/mobile_app/android-app-top-banner.png  width="25"> Inline-Weather

![](https://img.shields.io/badge/dynamic/json?color=EF7150&style=plastic&label=Script%20Version&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fiamrbn%2FInline-Weather%2Fmain%2FInline-Weather.json "Hi there 👋 I'm always up to date")

Script which shows weather datas from the openweathermap-api in [Scriptable for iOS](https://scriptable.app/ "App Homepage") in the lockscreen-widgets.

<a href="https://home.openweathermap.org/users/sign_up">
	<img src="https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png" width="100"/>
</a>

First of all, you need an API-key by OpenWeather out of your [account](https://home.openweathermap.org/api_keys "https://home.openweathermap.org/api_keys"). If you doesn't have an accountone, click [here](https://home.openweathermap.org/users/sign_up "https://home.openweathermap.org/users/sign_up") to sign up.

#### ATTENTION!
The current script version (`1.1`) uses now the API v3.0 endpoint.
Because openweathermap is shutting down version 2.5 on Oct. 14.


## Features
#### Available Widget Sizes (Lockscreen)
- Inline (current weather)
- Circular (current weather)
- Rectangular (current & forecast)

<img title="Available Lockscreen Widgets 1" src="Images/lockscreenMockup.png" width="1000"/>

### Tabel View (In App)
- Current & Forecast
- Clickable rows
- Detailview of each day
- Dialog, that shows the city ID
- Quick access to this GitHub Repo in the footer

<img title="Table Features" src="Images/thumbnail.png" width="777"/>

#### Detailed iew of a specific day:
<img title="Detail Table View" src="Images/detailView.png" width="450"/>

#### Change your location:
<img title="Change Location" src="Images/changeLocation.png" width="450"/>

#### Weather alerts in your area:
<img title="Alert If Available" src="Images/weatherAlertPopUp.png" width="450"/>


## Config

#### Widget Parameter
Default value if null: `30;current`
The number at the beginning means the refresh intervall of the widget.
The second value controls which datas will be shown (current or forecast)

#### Script Parameter
``` Javascript
const unit = 'metric' //Units of measurement: 'standard', 'metric' and 'imperial' units are available.
const unitSymb = '°' //Celsius
const unitSpeed = 'km/h'
const language = 'de' //learn more: https://openweathermap.org/current#multi
const standardParameter = '30;current'
```

#### Your API-Key
The script asks you at the first run for your openweathermap API-Key.
It saves it in the 'Inline Weather' Directory at the Scriptable iCloud Folder as JSON file.
So it wont go lost after script updates.     
<img title="Dialogue" src="Images/askForAPIKey.png" width="450"/>

___

### Info Widget
The info widgets show existing errors. For example, if there is no internet connection or the API key is incorrect.
<img title="Dialogue" src="Images/infoWidgets.png" width="650"/>

### Selfupdate Function
The Script updates itself[^1]

### On the first run
It downloads a module from this github repo and saves it in the "Inline Weather" directory.
```
iCloud Drive/
├─ Scriptable/
│  ├─ Inline Weather/
│  │  ├─ module.js
------------------
│  │  ├─ apiKey.json <-- your successfully saved API-Key
```


---

<p align="center">
  <a href="https://reddit.com/user/iamrbn/">
    <img title="My second Reddit @iamrbn" src="https://github.com/iamrbn/slack-status/blob/08d06ec886dcef950a8acbf4983940ad7fb8bed9/Images/Badges/reddit_black_iamrbn.png" width="125"/>
  </a>
  <a href="https://twitter.com/iamrbn_/">
    <img title="Follow Me On Twitter @iamrbn_" src="https://github.com/iamrbn/slack-status/blob/ae62582b728c2e2ad8ea6a55cc7729cf71bfaeab/Images/Badges/twitter_black.png" width="130"/>
  </a>
  <a href="https://mastodon.social/@iamrbn">
    <img title="Follow Me On Mastodon @iamrbn@mastodon.socail" src="https://github.com/iamrbn/slack-status/blob/1e67e1ea969b791a36ebb71142ec8719594e1e8d/Images/Badges/mastodon_black.png" width="163"/>
  </a>
</p>

<br>

[^1]:[Function](https://github.com/mvan231/Scriptable#updater-mechanism-code-example "GitHub Repo") is written by the amazing [@mvan231](https://twitter.com/mvan231 "Twitter")
