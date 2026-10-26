# Blog post 3 — Google Consent Mode v2 for EU businesses

- **EN URL:** /blog/google-consent-mode-v2-eu.html
- **BG URL:** /bg/blog/google-consent-mode-v2.html
- **Category:** Tracking · EU
- **Reading time:** 7 min
- **Image:** assets/images/blog/google-consent-mode-v2.jpg
- **Image brief:** A cookie banner on a phone screen with "Accept / Decline", and four small toggles labelled ad_storage, analytics_storage, ad_user_data, ad_personalization.

---

## ENGLISH

- **Title tag:** Google Consent Mode v2 Explained for EU Businesses (and How to Check Yours)
- **Meta description:** What Google Consent Mode v2 is, why EU advertisers need it, the difference between Basic and Advanced mode, and how to check if it's working on your website.

# Google Consent Mode v2 explained for EU businesses

*By Geno Kirov · Performance marketing consultant · Last updated: [deploy date]*

**Short answer:** Google Consent Mode v2 is the way your website tells Google's tags (Google Ads, GA4) what each visitor agreed to in your cookie banner. For businesses advertising to users in the European Economic Area, Google requires these consent signals to keep using features such as remarketing audiences and personalised advertising. Without it, your ads and reports lose data.

### Key takeaways

- Consent Mode v2 sends four signals: `ad_storage`, `analytics_storage`, `ad_user_data` and `ad_personalization`.
- The last two were added in v2 and are the ones many older setups are missing.
- A cookie banner alone is not enough — it has to pass the visitor's choice to Google's tags.
- Consent Mode does not replace consent. It respects the visitor's choice and adjusts how Google tags behave.

## What is Google Consent Mode?

Consent Mode is a Google feature that connects your cookie banner (Consent Management Platform, or CMP) with Google tags such as Google Ads, GA4 and Floodlight. When a visitor accepts or declines cookies, Consent Mode passes that choice to the tags, and they change their behaviour accordingly.

## What changed in version 2?

Version 1 used two signals: `ad_storage` (can advertising cookies be stored?) and `analytics_storage` (can analytics cookies be stored?).

Version 2 added two more:

- **`ad_user_data`** — can user data be sent to Google for advertising purposes?
- **`ad_personalization`** — can the data be used for personalised advertising, such as remarketing?

Google introduced these in connection with the EU's Digital Markets Act and has required them for EEA traffic since March 2024.

## Who needs Consent Mode v2?

Any business that uses Google Ads or GA4 and has visitors from the European Economic Area — which includes every business in Bulgaria. If the signals are missing, Google limits features such as remarketing lists and conversion measurement for those users.

## Basic vs Advanced Consent Mode: what's the difference?

- **Basic mode:** Google tags don't load at all until the visitor gives consent. If they decline, Google receives nothing from that visit.
- **Advanced mode:** Google tags load immediately with consent set to "denied" by default. If the visitor declines, the tags send limited, cookieless pings without identifiers. Google uses these to model conversions it can't observe directly.

Advanced mode usually recovers more measurement data. Basic mode is the more conservative choice. Which one is right depends on your legal assessment — discuss it with your legal or privacy advisor.

## How to check if Consent Mode v2 is working on your website

1. **Open your site in a private window.** The cookie banner should appear before any marketing tags fire.
2. **Use Google Tag Assistant** (tagassistant.google.com). Connect your site, then open the **Consent** tab. Check that the default state is set *before* the banner choice, and that all four signals update after you accept or decline.
3. **Test both choices.** Accept everything once, decline everything once. The four signals should change accordingly.
4. **Check Google Ads.** In **Goals → Conversions**, Google shows diagnostics for your conversion actions, including whether consent signals are being received.
5. **Check GA4.** In the **Admin** section, GA4 shows consent settings status for your property.

If any of the four signals is missing, or the default isn't set before the banner, the setup needs fixing.

## How to set it up

The most common and reliable route is:

1. Use a **Google-certified CMP** (cookie banner tool). Google keeps a list of certified partners; many popular tools such as Cookiebot, CookieYes and Usercentrics are on it. Check the current list before choosing.
2. Connect the CMP to **Google Tag Manager** using its official template.
3. Set default consent states for all four signals, then let the CMP update them on the visitor's choice.
4. Test with Tag Assistant as described above.

## What about Meta (Facebook) ads?

Meta has no direct equivalent of Google's Consent Mode. For EU visitors, the Meta Pixel should only load after the visitor accepts marketing cookies — usually by firing it through Google Tag Manager with a consent condition from your CMP. The same principle applies to TikTok, LinkedIn and other ad platforms.

## Where AI helps — and where it doesn't

AI can help explain error messages, compare tag configurations or summarise what a long consent log shows. But checking Consent Mode means opening the site, clicking the banner and watching what each tag does — that has to be tested by hand, in a real browser. That's how I do it in every tracking audit.

## Frequently asked questions

**Is Consent Mode v2 mandatory?**
Google requires consent signals for users in the EEA if you want to keep using personalised advertising and audience features. Consent itself is required by EU law (GDPR and ePrivacy rules). Consent Mode is Google's way of receiving that consent information.

**Does Consent Mode make my website GDPR-compliant?**
No. Consent Mode passes consent choices to Google tags. Compliance depends on your whole setup: your cookie banner, privacy policy, which tools you use and how. This article is not legal advice.

**Will I lose data with Consent Mode?**
You lose observed data from visitors who decline cookies — that happens with or without Consent Mode. Advanced mode lets Google model some of the missing conversions, which usually gives a more complete picture than having no consent signals at all.

**Do I need Consent Mode if I only use GA4 and not Google Ads?**
Yes, if you have visitors in the EEA. GA4 uses the analytics and advertising consent signals too, especially if it's linked to Google Ads or uses Google signals.

> **Author box:** Geno Kirov — performance marketing consultant with 10+ years in Google Ads, Meta Ads and tracking, $20M+ in ad spend managed. [LinkedIn]
>
> **CTA:** Not sure your consent setup is right? Book a free 30-minute call — Consent Mode is part of every Ads & Tracking Audit (from €150).

---

## БЪЛГАРСКИ

- **Title tag:** Google Consent Mode v2 — обяснено за бизнеси в ЕС (и как да проверите своя)
- **Meta description:** Какво е Google Consent Mode v2, защо рекламодателите в ЕС се нуждаят от него, разлика между Basic и Advanced и как да проверите дали работи на сайта ви.

# Google Consent Mode v2 — обяснено за бизнеси в ЕС

*Автор: Гено Киров · Консултант по performance маркетинг · Последна актуализация: [дата на публикуване]*

**Кратък отговор:** Google Consent Mode v2 е начинът, по който сайтът ви казва на таговете на Google (Google Ads, GA4) какво е избрал всеки посетител в банера за бисквитки. За бизнесите, които рекламират на потребители в Европейското икономическо пространство, Google изисква тези сигнали, за да могат да продължат да използват функции като ремаркетинг аудитории и персонализирана реклама. Без тях рекламите и отчетите ви губят данни.

### Основни изводи

- Consent Mode v2 изпраща четири сигнала: `ad_storage`, `analytics_storage`, `ad_user_data` и `ad_personalization`.
- Последните два са добавени във версия 2 и точно те липсват в много по-стари настройки.
- Самият банер за бисквитки не е достатъчен — той трябва да предава избора на посетителя към таговете на Google.
- Consent Mode не замества съгласието. Той спазва избора на посетителя и променя поведението на таговете на Google.

## Какво е Google Consent Mode?

Consent Mode е функция на Google, която свързва банера за бисквитки (Consent Management Platform, CMP) с тагове като Google Ads, GA4 и Floodlight. Когато посетителят приеме или откаже бисквитките, Consent Mode предава избора към таговете и те променят поведението си.

## Какво се промени във версия 2?

Версия 1 използваше два сигнала: `ad_storage` (могат ли да се записват рекламни бисквитки?) и `analytics_storage` (могат ли да се записват аналитични бисквитки?).

Версия 2 добави още два:

- **`ad_user_data`** — могат ли потребителските данни да се изпращат към Google за рекламни цели?
- **`ad_personalization`** — могат ли данните да се използват за персонализирана реклама, например ремаркетинг?

Google ги въведе във връзка с Акта за цифровите пазари на ЕС и ги изисква за трафика от ЕИП от март 2024 г.

## Кой има нужда от Consent Mode v2?

Всеки бизнес, който използва Google Ads или GA4 и има посетители от Европейското икономическо пространство — тоест всеки бизнес в България. Ако сигналите липсват, Google ограничава функции като ремаркетинг списъци и измерване на конверсии за тези потребители.

## Basic или Advanced Consent Mode: каква е разликата?

- **Basic режим:** таговете на Google не се зареждат изобщо, докато посетителят не даде съгласие. Ако откаже, Google не получава нищо от това посещение.
- **Advanced режим:** таговете се зареждат веднага, със съгласие „отказано" по подразбиране. Ако посетителят откаже, таговете изпращат ограничени сигнали без бисквитки и без идентификатори. Google ги използва, за да моделира конверсии, които не може да види директно.

Advanced режимът обикновено възстановява повече данни за измерване. Basic е по-консервативният избор. Кой е правилният зависи от правната ви преценка — обсъдете го с юрист или специалист по защита на данните.

## Как да проверите дали Consent Mode v2 работи на сайта ви

1. **Отворете сайта в инкогнито прозорец.** Банерът трябва да се появи преди да се заредят маркетинговите тагове.
2. **Използвайте Google Tag Assistant** (tagassistant.google.com). Свържете сайта и отворете раздела **Consent**. Проверете дали състоянието по подразбиране е зададено *преди* избора в банера и дали и четирите сигнала се променят, след като приемете или откажете.
3. **Тествайте и двата избора.** Веднъж приемете всичко, веднъж откажете всичко. Четирите сигнала трябва да се променят съответно.
4. **Проверете Google Ads.** В **Цели → Конверсии** Google показва диагностика за действията за конверсия, включително дали получава сигнали за съгласие.
5. **Проверете GA4.** В раздела **Admin** GA4 показва статуса на настройките за съгласие за ресурса ви.

Ако някой от четирите сигнала липсва или състоянието по подразбиране не е зададено преди банера, настройката трябва да се поправи.

## Как се настройва

Най-честият и надежден начин:

1. Използвайте **сертифицирана от Google CMP** (инструмент за банер за бисквитки). Google поддържа списък със сертифицирани партньори; в него са много популярни инструменти като Cookiebot, CookieYes и Usercentrics. Проверете актуалния списък, преди да изберете.
2. Свържете CMP с **Google Tag Manager** чрез официалния шаблон.
3. Задайте състояния по подразбиране за четирите сигнала и оставете CMP да ги обновява според избора на посетителя.
4. Тествайте с Tag Assistant, както е описано по-горе.

## А какво става с рекламите в Meta (Facebook)?

Meta няма пряк еквивалент на Consent Mode на Google. За посетители от ЕС Meta Pixel трябва да се зарежда само след като посетителят приеме маркетинговите бисквитки — обикновено чрез Google Tag Manager с условие за съгласие от CMP. Същият принцип важи за TikTok, LinkedIn и другите рекламни платформи.

## Къде помага AI — и къде не

AI може да помогне да се разтълкуват съобщения за грешки, да се сравнят конфигурации на тагове или да се обобщи какво показва дълъг лог. Но проверката на Consent Mode означава да отворите сайта, да кликнете банера и да наблюдавате какво прави всеки таг — това се тества ръчно, в реален браузър. Така го правя при всеки одит на проследяването.

## Често задавани въпроси

**Задължителен ли е Consent Mode v2?**
Google изисква сигнали за съгласие за потребителите в ЕИП, ако искате да продължите да използвате персонализирана реклама и функциите с аудитории. Самото съгласие се изисква от правото на ЕС (GDPR и правилата за електронни комуникации). Consent Mode е начинът, по който Google получава информацията за съгласието.

**Прави ли Consent Mode сайта ми съвместим с GDPR?**
Не. Consent Mode предава избора за съгласие към таговете на Google. Съвместимостта зависи от цялата ви настройка: банера, политиката за поверителност, кои инструменти използвате и как. Тази статия не е правен съвет.

**Ще загубя ли данни с Consent Mode?**
Губите наблюдаваните данни от посетителите, които откажат бисквитките — това се случва със или без Consent Mode. Advanced режимът позволява на Google да моделира част от липсващите конверсии, което обикновено дава по-пълна картина, отколкото липсата на сигнали за съгласие.

**Трябва ли ми Consent Mode, ако използвам само GA4, без Google Ads?**
Да, ако имате посетители от ЕИП. GA4 също използва сигналите за аналитично и рекламно съгласие, особено ако е свързан с Google Ads или използва Google signals.

> **Карта на автора:** Гено Киров — консултант по performance маркетинг с 10+ години опит в Google Ads, Meta реклами и проследяване, над $20M управляван рекламен бюджет. [LinkedIn]
>
> **CTA:** Не сте сигурни, че настройката за съгласие е правилна? Запазете безплатен 30-минутен разговор — Consent Mode е част от всеки одит на реклами и проследяване (от €150).
