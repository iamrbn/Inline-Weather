# <img src=https://openweathermap.org/themes/openweathermap/assets/img/mobile_app/android-app-top-banner.png  width="25"> Inline-Weather

[![](https://img.shields.io/badge/Script_Version-1.0-DB6149.svg?style=plastic)]()

Script which shows weather datas about the openweathermap api in [Scriptable for iOS](https://scriptable.app/ "App Homepage") lockscreen widgets.

<a href="https://home.openweathermap.org/users/sign_up">
	<img src="https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png" width="100"/>
</a>

First of all, you need an API-key by OpenWeather out of your [account](https://home.openweathermap.org/api_keys "https://home.openweathermap.org/api_keys"). If you doesn't have an accountone, click [here](https://home.openweathermap.org/users/sign_up "https://home.openweathermap.org/users/sign_up") to sign up.


## Features
#### Widget Sizes (Lockscreen)
- Inline
- Circular
- Rectangular (Current & Forecast)

#### Tabel View (In App)
- Today & Forecast
- Clickable rows
- Detailview of each day

#### Selfupdate Function
The Script update itself[^1]

## Config
#### Script
``` Javascript
const unit = 'metric' //Units of measurement: 'standard', 'metric' and 'imperial' units are available.
const unitSymb = '°'
const unitSpeed = 'km/h'
const language = 'de' //learn more: https://openweathermap.org/current#multi
```
#### Widget Parameter
Default value if null: `30;current`
The number at the beginning means the refresh intervall of the widget.
The second value controls which datas will be shown (current or forecast)

___

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
