# <img src=https://openweathermap.org/themes/openweathermap/assets/img/mobile_app/android-app-top-banner.png  width="25"> Inline-Weather

![](https://img.shields.io/badge/dynamic/json?color=EF7150&style=plastic&label=Script%20Version&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fiamrbn%2FInline-Weather%2Fmain%2FInline-Weather.json "Hi there 👋 I'm always up to date")

Script which shows weather datas from the openweathermap-api in [Scriptable for iOS](https://scriptable.app/ "App Homepage") in the lockscreen-widgets.

## ATTENTION: The script uses the API v2.5 endpoint. If you generated your API-key after June 2024, an error occurs. Because openweathermap has changed its pricing models. I'm try to switch the endpoint or find another solution. 
<img src="https://www.reddit.com/media?url=https%3A%2F%2Fpreview.redd.it%2Finline-weather-widgets-v0-rhe30gkw88fd1.jpeg%3Fwidth%3D512%26format%3Dpjpg%26auto%3Dwebp%26s%3D071eea146abc151a38284fb667cbe46147808775" width="300" title="error message"/>


<a href="https://home.openweathermap.org/users/sign_up">
	<img src="https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png" width="100"/>
</a>

First of all, you need an API-key by OpenWeather out of your [account](https://home.openweathermap.org/api_keys "https://home.openweathermap.org/api_keys"). If you doesn't have an accountone, click [here](https://home.openweathermap.org/users/sign_up "https://home.openweathermap.org/users/sign_up") to sign up.


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

<img title="Table Features" src="Images/thumbnail.PNG" width="650"/>

#### Detailview
<img title="Detail Table View" src="Images/detailView.PNG" width="350"/>

#### Change Location
<img title="CityID Dialog" src="Images/changeLocation.PNG" width="350"/>



## Config

#### Script Parameter
``` Javascript
const unit = 'metric' //Units of measurement: 'standard', 'metric' and 'imperial' units are available.
const unitSymb = '°' //Celsius
const unitSpeed = 'km/h'
const language = 'de' //learn more: https://openweathermap.org/current#multi
const apiKey = 'YOUR API KEY GOES HERE'
const standardParameter = '30;current'
```

#### Widget Parameter
Default value if null: `30;current`
The number at the beginning means the refresh intervall of the widget.
The second value controls which datas will be shown (current or forecast)

### Selfupdate Function
The Script updates itself[^1]

### On the first run
It downloads a module from this github repo and saves it in the "Inline Weather" directory.
```
iCloud Drive/
├─ Scriptable/
│  ├─ Inline Weather/
│  │  ├─ module.js
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
