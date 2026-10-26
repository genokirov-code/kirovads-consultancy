# Blog post 1 — Meta Pixel & Conversions API

- **EN URL:** /blog/meta-pixel-conversions-api-checklist.html
- **BG URL:** /bg/blog/meta-pixel-conversions-api-proverka.html
- **Category:** Tracking
- **Reading time:** 7 min
- **Image:** assets/images/blog/meta-pixel-capi.webp
- **Image brief:** Split screen: Meta Events Manager with a green "deduplicated" status on one side, an online shop order list on the other, with matching numbers.

---

## ENGLISH

- **Title tag:** How to Check if Your Meta Pixel and Conversions API Are Working (2026 Checklist)
- **Meta description:** A practical 7-step checklist to verify your Meta Pixel and Conversions API: test events, deduplication, Event Match Quality, consent and real order matching.

# How to check if your Meta Pixel and Conversions API are working: a 7-step checklist

*By Geno Kirov · Performance marketing consultant · Last updated: [deploy date]*

**Short answer:** Your Meta tracking works correctly when every real purchase or lead is recorded once in Events Manager, with the right value, sent by both the Pixel (browser) and the Conversions API (server), and deduplicated through a shared event ID. The fastest test is to compare Meta's reported conversions with the actual orders or leads in your shop or CRM for the same period.

### Key takeaways

- The Meta Pixel runs in the browser; the Conversions API (CAPI) sends the same events from your server. Using both gives Meta more complete data.
- When you use both, each event must carry the same `event_name` and `event_id`, so Meta counts it once instead of twice.
- Meta's numbers will never match your shop exactly. A large over-count usually means duplicate events; a large under-count usually means missing events or consent blocking.
- In the EU, server-side tracking does not remove the need for user consent.

## What is the difference between the Meta Pixel and the Conversions API?

The **Meta Pixel** is a piece of JavaScript on your website that sends events (page views, add to cart, purchases) from the visitor's browser to Meta. The **Conversions API** sends the same kind of events directly from your server or platform to Meta.

The Pixel alone loses data when browsers block scripts, when ad blockers are active, or when a page closes before the event fires. CAPI fills those gaps. Meta recommends using both together.

## Step 1: Compare Meta with your real orders

Before opening any technical tool, do this:

1. In Meta Events Manager, note the number of Purchase (or Lead) events for the last 30 days.
2. In your shop, CRM or form inbox, count the real orders or leads for the same 30 days.
3. Compare.

How to read the result:

- **Meta shows far more than reality** → events are probably duplicated (e.g. the Pixel installed twice, or the thank-you page fires on every reload).
- **Meta shows far fewer** → events are missing, CAPI is not set up, or consent is blocking more than expected.
- **Roughly similar** → good. Continue with the checks below to confirm quality.

## Step 2: Check which events fire with Meta Pixel Helper

Install the free **Meta Pixel Helper** Chrome extension, then go through your site like a customer: view a product, add it to the cart, start checkout, and (on a test order) complete a purchase.

Look for:

- The same Pixel ID appearing twice (a sign of double installation, e.g. through a plugin *and* Google Tag Manager).
- Purchase firing on pages where nothing was bought.
- Missing `value` and `currency` on Purchase events.

## Step 3: Use Test Events in Events Manager

In Events Manager, open **Test events**, enter your website URL, and repeat the customer journey. You will see each event as it arrives, and whether it came from the **browser** (Pixel), the **server** (CAPI), or both.

## Step 4: Confirm deduplication

If an event arrives from both browser and server, Meta needs a way to know it's the same event. This is done by sending the **same `event_name` and the same `event_id`** from both sources.

In Events Manager, open each key event and check the deduplication status in the overview. If Meta reports that browser and server events are not being deduplicated, your conversions are being counted twice — and Meta's algorithm is learning from inflated numbers.

## Step 5: Check Event Match Quality

For events sent through CAPI, Events Manager shows an **Event Match Quality** score from 0 to 10. It reflects how well Meta can match the event to a real person.

To improve it, send more customer information parameters with server events, hashed as Meta requires: email, phone number, first and last name, city, country, and the `fbp` and `fbc` browser identifiers. Only send data you are allowed to process under your privacy policy.

## Step 6: Verify your domain and event setup

In Business Settings, check that your website domain is **verified**. Then confirm that the event you optimise your campaigns for (usually Purchase or Lead) is active and receiving data from both browser and server.

## Step 7: Check consent (EU businesses)

If your business serves users in the EU, the Pixel should only fire after the visitor accepts marketing cookies in your cookie banner. Test it: open your site in a private window, decline cookies, and check with Pixel Helper that no Pixel events fire.

Server-side events through CAPI also need a lawful basis under GDPR. Moving tracking to the server is a data-quality improvement, not a way around consent rules.

## Where AI helps — and where it doesn't

AI tools are useful for comparing exports: for example, matching a list of orders from your shop with the events Meta received, or spotting days when events suddenly dropped. That saves time.

But AI cannot see inside your Events Manager, test your checkout, or tell whether a missing event is a bug or a consent decision. In my audits, AI-assisted analysis points to *where* to look; the actual checks above are done by hand in the accounts.

## Frequently asked questions

**Do I need the Conversions API if I already have the Meta Pixel?**
For most businesses running Meta ads, yes. The Pixel alone misses events because of browser restrictions and ad blockers. CAPI sends the same events from the server, which gives Meta more complete data to optimise on.

**Why does Meta show more purchases than my shop?**
The most common causes are duplicate events: the Pixel installed twice, Purchase firing on page reloads, or browser and server events that are not deduplicated with a shared `event_id`. Attribution windows also play a role, since Meta credits conversions within its attribution window.

**Is the Conversions API GDPR-compliant?**
CAPI is a technical tool; compliance depends on how you use it. You still need a lawful basis (usually consent) for sending personal data to Meta, and your privacy policy must describe it. This is not legal advice — check with your legal advisor.

**How long does it take to set up the Conversions API?**
On platforms with a native integration (such as Shopify or WooCommerce with an official plugin), a basic setup can take a few hours. A custom setup through Google Tag Manager server-side or a developer usually takes a few days, including testing.

**What is a good Event Match Quality score?**
Higher is better. Rather than chasing a specific number, focus on sending the customer parameters you legitimately collect — especially email and phone — with every server event.

> **Author box:** Geno Kirov — performance marketing consultant with 10+ years in Google Ads, Meta Ads and tracking, $20M+ in ad spend managed. [LinkedIn]
>
> **CTA:** Not sure your Meta tracking is right? Book a free 30-minute call or request an Ads & Tracking Audit (from €150).

---

## БЪЛГАРСКИ

- **Title tag:** Как да проверите дали Meta Pixel и Conversions API работят правилно (чек-лист 2026)
- **Meta description:** Практичен чек-лист в 7 стъпки за проверка на Meta Pixel и Conversions API: тестови събития, дедупликация, Event Match Quality, съгласие и сверка с поръчките.

# Как да проверите дали Meta Pixel и Conversions API работят: чек-лист в 7 стъпки

*Автор: Гено Киров · Консултант по performance маркетинг · Последна актуализация: [дата на публикуване]*

**Кратък отговор:** Проследяването в Meta работи правилно, когато всяка реална покупка или запитване се отчита веднъж в Events Manager, с правилната стойност, изпраща се и от Pixel (браузъра), и от Conversions API (сървъра) и се дедуплицира чрез общ event ID. Най-бързата проверка е да сравните конверсиите, които Meta отчита, с реалните поръчки или запитвания в магазина или CRM системата за същия период.

### Основни изводи

- Meta Pixel работи в браузъра; Conversions API (CAPI) изпраща същите събития от сървъра ви. Двете заедно дават на Meta по-пълни данни.
- Когато използвате и двете, всяко събитие трябва да има еднакви `event_name` и `event_id`, за да бъде отчетено веднъж, а не два пъти.
- Числата в Meta никога няма да съвпаднат точно с магазина ви. Голямо превишение обикновено означава дублирани събития; голям недостиг — липсващи събития или блокиране от съгласието.
- В ЕС сървърното проследяване не премахва нуждата от съгласие на потребителя.

## Каква е разликата между Meta Pixel и Conversions API?

**Meta Pixel** е JavaScript код на сайта ви, който изпраща събития (разглеждания, добавяне в количката, покупки) от браузъра на посетителя към Meta. **Conversions API** изпраща същите събития директно от сървъра или платформата ви.

Само с Pixel губите данни, когато браузърът блокира скриптове, има активен ad blocker или страницата се затвори, преди събитието да се изпрати. CAPI запълва тези пропуски. Meta препоръчва да се използват заедно.

## Стъпка 1: Сравнете Meta с реалните поръчки

Преди да отворите какъвто и да е технически инструмент:

1. В Meta Events Manager вижте броя Purchase (или Lead) събития за последните 30 дни.
2. В магазина, CRM системата или пощата с формите пребройте реалните поръчки или запитвания за същите 30 дни.
3. Сравнете.

Как да прочетете резултата:

- **Meta показва много повече** → вероятно има дублирани събития (например Pixel е инсталиран два пъти или благодарствената страница изпраща покупка при всяко презареждане).
- **Meta показва много по-малко** → липсват събития, CAPI не е настроен или съгласието блокира повече от очакваното.
- **Приблизително еднакво** → добре. Продължете с проверките по-долу.

## Стъпка 2: Проверете събитията с Meta Pixel Helper

Инсталирайте безплатното разширение за Chrome **Meta Pixel Helper** и минете през сайта като клиент: разгледайте продукт, добавете го в количката, започнете поръчка и (с тестова поръчка) завършете покупка.

Търсете:

- Един и същ Pixel ID, който се появява два пъти (знак за двойна инсталация — например чрез плъгин *и* Google Tag Manager).
- Purchase, който се изпраща на страници без покупка.
- Липсващи `value` и `currency` при Purchase.

## Стъпка 3: Използвайте Test Events в Events Manager

В Events Manager отворете **Test events**, въведете адреса на сайта и повторете пътя на клиента. Ще виждате всяко събитие в момента на получаване и дали идва от **браузъра** (Pixel), от **сървъра** (CAPI) или от двете.

## Стъпка 4: Потвърдете дедупликацията

Когато събитие идва и от браузъра, и от сървъра, Meta трябва да разбере, че е едно и също. Това става, като и двата източника изпращат **еднакво `event_name` и еднакво `event_id`**.

В Events Manager отворете всяко ключово събитие и проверете статуса на дедупликацията. Ако Meta отчита, че събитията от браузъра и сървъра не се дедуплицират, конверсиите ви се броят двойно — и алгоритъмът се учи от надути числа.

## Стъпка 5: Проверете Event Match Quality

За събитията през CAPI Events Manager показва оценка **Event Match Quality** от 0 до 10. Тя показва доколко Meta успява да свърже събитието с реален човек.

За да я подобрите, изпращайте повече параметри за клиента със сървърните събития, хеширани според изискванията на Meta: имейл, телефон, име и фамилия, град, държава, както и идентификаторите `fbp` и `fbc`. Изпращайте само данни, които имате право да обработвате според политиката си за поверителност.

## Стъпка 6: Проверете домейна и настройката на събитията

В Business Settings проверете дали домейнът на сайта ви е **верифициран**. След това се уверете, че събитието, към което оптимизирате кампаниите (обикновено Purchase или Lead), е активно и получава данни и от браузъра, и от сървъра.

## Стъпка 7: Проверете съгласието (за бизнеси в ЕС)

Ако обслужвате потребители в ЕС, Pixel трябва да се зарежда само след като посетителят приеме маркетинговите бисквитки в банера. Тествайте: отворете сайта в инкогнито прозорец, откажете бисквитките и проверете с Pixel Helper, че не се изпращат събития.

Сървърните събития през CAPI също изискват правно основание според GDPR. Преместването на проследяването на сървъра подобрява качеството на данните, но не заобикаля правилата за съгласие.

## Къде помага AI — и къде не

AI инструментите са полезни за сравняване на експорти: например да съпоставят списък с поръчки от магазина със събитията, получени от Meta, или да открият дни, в които събитията внезапно спадат. Това спестява време.

Но AI не вижда вътре в Events Manager, не може да тества количката ви и не може да прецени дали липсващо събитие е грешка или решение на потребителя за съгласие. В моите одити анализът с помощта на AI показва *къде* да се погледне; самите проверки по-горе се правят ръчно в акаунтите.

## Често задавани въпроси

**Трябва ли ми Conversions API, ако вече имам Meta Pixel?**
За повечето бизнеси с Meta реклами — да. Само с Pixel се губят събития заради ограниченията на браузърите и ad blocker-ите. CAPI изпраща същите събития от сървъра и дава на Meta по-пълни данни за оптимизация.

**Защо Meta показва повече покупки от магазина ми?**
Най-честата причина са дублирани събития: Pixel е инсталиран два пъти, Purchase се изпраща при презареждане или събитията от браузъра и сървъра не се дедуплицират с общ `event_id`. Роля играе и прозорецът за атрибуция на Meta.

**Съвместим ли е Conversions API с GDPR?**
CAPI е технически инструмент; съвместимостта зависи от начина, по който го използвате. Все още ви трябва правно основание (обикновено съгласие), за да изпращате лични данни към Meta, и то трябва да е описано в политиката ви за поверителност. Това не е правен съвет — консултирайте се с юрист.

**Колко време отнема настройката на Conversions API?**
При платформи с официална интеграция (например Shopify или WooCommerce с официален плъгин) базовата настройка може да отнеме няколко часа. Персонализирана настройка чрез сървърен Google Tag Manager или програмист обикновено отнема няколко дни, включително тестване.

**Каква е добрата оценка за Event Match Quality?**
Колкото по-висока, толкова по-добре. Вместо да гоните конкретно число, изпращайте със всяко сървърно събитие параметрите за клиента, които законно събирате — особено имейл и телефон.

> **Карта на автора:** Гено Киров — консултант по performance маркетинг с 10+ години опит в Google Ads, Meta реклами и проследяване, над $20M управляван рекламен бюджет. [LinkedIn]
>
> **CTA:** Не сте сигурни, че проследяването в Meta е наред? Запазете безплатен 30-минутен разговор или поискайте одит на реклами и проследяване (от €150).
