const ws = require('lib/ws')
const layout = require('layout/terminal-display')
const window = require('global/window')
const once = require('lib/once')
const after = require('lib/loop').after
const ev = require('geval/event')
const messagesCount = require('state').observ.messagesCount
const is = require('lib/is')
const messageList = [{"type":"user","id":0.7813456309959292,"content":"#0 - 0.16139620449393988"},{"type":"user","id":0.228983138455078,"content":"#1 - 0.9471581201069057"},{"type":"user","id":0.1426250236108899,"content":"#2 - 0.7787933808285743"},{"type":"user","id":0.14867825084365904,"content":"#3 - 0.9191232074517757"},{"type":"user","id":0.5387213525827974,"content":"#4 - 0.1532936980947852"},{"type":"user","id":0.14443422062322497,"content":"#5 - 0.40235717268660665"},{"type":"user","id":0.25388552993535995,"content":"#6 - 0.05892953183501959"},{"type":"user","id":0.49893240188248456,"content":"#7 - 0.6330941326450557"},{"type":"user","id":0.9487270899116993,"content":"#8 - 0.4187994059175253"},{"type":"user","id":0.7062760752160102,"content":"#9 - 0.5422469147015363"},{"type":"user","id":0.7153034533839673,"content":"#10 - 0.3073037026915699"},{"type":"user","id":0.18846711982041597,"content":"#11 - 0.4512400690000504"},{"type":"user","id":0.7249995924066752,"content":"#12 - 0.11846285848878324"},{"type":"user","id":0.015318942023441195,"content":"#13 - 0.21463248902000487"},{"type":"user","id":0.194793134694919,"content":"#14 - 0.4957022708840668"},{"type":"user","id":0.3802772171329707,"content":"#15 - 0.1545528550632298"},{"type":"user","id":0.8323004650883377,"content":"#16 - 0.005486497189849615"},{"type":"user","id":0.9268325355369598,"content":"#17 - 0.5360584636218846"},{"type":"user","id":0.14767867443151772,"content":"#18 - 0.9010261443909258"},{"type":"user","id":0.2509102679323405,"content":"#19 - 0.41095008444972336"},{"type":"user","id":0.17346779070794582,"content":"#20 - 0.8813689288217574"},{"type":"user","id":0.8398611061275005,"content":"#21 - 0.3190700910054147"},{"type":"user","id":0.46214625146239996,"content":"#22 - 0.3656781855970621"},{"type":"user","id":0.803119003539905,"content":"#23 - 0.7448940668255091"},{"type":"user","id":0.8289327772799879,"content":"#24 - 0.29849176155403256"},{"type":"user","id":0.3058686051517725,"content":"#25 - 0.3160632133949548"},{"type":"user","id":0.2549491145182401,"content":"#26 - 0.2245276456233114"},{"type":"user","id":0.604644178180024,"content":"#27 - 0.8632920584641397"},{"type":"user","id":0.7866740284953266,"content":"#28 - 0.2380047410260886"},{"type":"user","id":0.6095496965572238,"content":"#29 - 0.3167834614869207"},{"type":"user","id":0.23455754038877785,"content":"#30 - 0.4416250572539866"},{"type":"user","id":0.380231277551502,"content":"#31 - 0.31432775454595685"},{"type":"user","id":0.9465763024054468,"content":"#32 - 0.6429187343455851"},{"type":"user","id":0.0746156198438257,"content":"#33 - 0.4470074519049376"},{"type":"user","id":0.4177755992859602,"content":"#34 - 0.23864391283132136"},{"type":"user","id":0.1317093016114086,"content":"#35 - 0.9791224035434425"},{"type":"user","id":0.4494238016195595,"content":"#36 - 0.9973841935861856"},{"type":"user","id":0.7130866006482393,"content":"#37 - 0.3343668826855719"},{"type":"user","id":0.2654144607950002,"content":"#38 - 0.9247269141487777"},{"type":"user","id":0.5727866941597313,"content":"#39 - 0.47623201413080096"},{"type":"user","id":0.3331272704526782,"content":"#40 - 0.9158584410324693"},{"type":"user","id":0.6802600887604058,"content":"#41 - 0.34371391660533845"},{"type":"user","id":0.799302258528769,"content":"#42 - 0.9254708087537438"},{"type":"user","id":0.9940129511523992,"content":"#43 - 0.9402571336831897"},{"type":"user","id":0.7255640956573188,"content":"#44 - 0.29473256738856435"},{"type":"user","id":0.5301230177283287,"content":"#45 - 0.12561456463299692"},{"type":"user","id":0.08170521655119956,"content":"#46 - 0.26800299366004765"},{"type":"user","id":0.5905400856863707,"content":"#47 - 0.56493135006167"},{"type":"user","id":0.8371271106880158,"content":"#48 - 0.02064421633258462"},{"type":"user","id":0.2214834711048752,"content":"#49 - 0.723327120533213"},{"type":"user","id":0.964444202138111,"content":"#50 - 0.8130696718581021"},{"type":"user","id":0.2726775056216866,"content":"#51 - 0.8740673791617155"},{"type":"user","id":0.06477504153735936,"content":"#52 - 0.0264123547822237"},{"type":"user","id":0.20916984253562987,"content":"#53 - 0.7063288919162005"},{"type":"user","id":0.4818697755690664,"content":"#54 - 0.9908270935993642"},{"type":"user","id":0.490925861755386,"content":"#55 - 0.2816443748306483"},{"type":"user","id":0.5536294460762292,"content":"#56 - 0.9381603531073779"},{"type":"user","id":0.9135198688600212,"content":"#57 - 0.513245094800368"},{"type":"user","id":0.8112568848300725,"content":"#58 - 0.4566920476499945"},{"type":"user","id":0.04396008513867855,"content":"#59 - 0.5971852953080088"},{"type":"user","id":0.3850760080385953,"content":"#60 - 0.6720546872820705"},{"type":"user","id":0.3916342800948769,"content":"#61 - 0.9237389715854079"},{"type":"user","id":0.7593636303208768,"content":"#62 - 0.831443790346384"},{"type":"user","id":0.5590487027075142,"content":"#63 - 0.6524183994624764"},{"type":"user","id":0.3652479271404445,"content":"#64 - 0.04905062587931752"},{"type":"user","id":0.3919812028761953,"content":"#65 - 0.1831761773210019"},{"type":"user","id":0.9186843221541494,"content":"#66 - 0.6386285300832242"},{"type":"user","id":0.7249663658440113,"content":"#67 - 0.5166161411907524"},{"type":"user","id":0.5944009223021567,"content":"#68 - 0.1688895730767399"},{"type":"user","id":0.3282703880686313,"content":"#69 - 0.34442653809674084"},{"type":"user","id":0.632914996240288,"content":"#70 - 0.7079963935539126"},{"type":"user","id":0.5516998104285449,"content":"#71 - 0.15011795284226537"},{"type":"user","id":0.8894939683377743,"content":"#72 - 0.33268928760662675"},{"type":"user","id":0.01680114329792559,"content":"#73 - 0.9254285367205739"},{"type":"user","id":0.22850248706527054,"content":"#74 - 0.28486589761450887"},{"type":"user","id":0.6340697016566992,"content":"#75 - 0.5316453000996262"},{"type":"user","id":0.5586206554435194,"content":"#76 - 0.9354709563776851"},{"type":"user","id":0.30070340167731047,"content":"#77 - 0.19260446052066982"},{"type":"user","id":0.040240586968138814,"content":"#78 - 0.5337927802465856"},{"type":"user","id":0.28976871143095195,"content":"#79 - 0.030284987995401025"},{"type":"user","id":0.04735574754886329,"content":"#80 - 0.8307342552579939"},{"type":"user","id":0.776608576066792,"content":"#81 - 0.7556784788612276"},{"type":"user","id":0.38484998838976026,"content":"#82 - 0.5889191345777363"},{"type":"user","id":0.331616900395602,"content":"#83 - 0.6759902483318001"},{"type":"user","id":0.3568461057730019,"content":"#84 - 0.5698065184988081"},{"type":"user","id":0.7411642549559474,"content":"#85 - 0.5676703245844692"},{"type":"user","id":0.2274924439843744,"content":"#86 - 0.06317650596611202"},{"type":"user","id":0.20207919040694833,"content":"#87 - 0.8562978054396808"},{"type":"user","id":0.6728087656665593,"content":"#88 - 0.001957402564585209"},{"type":"user","id":0.2967761487234384,"content":"#89 - 0.3685342303942889"},{"type":"user","id":0.3074771664105356,"content":"#90 - 0.32567800278775394"},{"type":"user","id":0.6128397770226002,"content":"#91 - 0.6283944884780794"},{"type":"user","id":0.20995744736865163,"content":"#92 - 0.9028583071194589"},{"type":"user","id":0.28195957909338176,"content":"#93 - 0.23805664433166385"},{"type":"user","id":0.5367693821899593,"content":"#94 - 0.9574151097331196"},{"type":"user","id":0.07084187585860491,"content":"#95 - 0.4079390480183065"},{"type":"user","id":0.8916932167485356,"content":"#96 - 0.9859294963534921"},{"type":"user","id":0.18828110257163644,"content":"#97 - 0.09582286141812801"},{"type":"user","id":0.8019023523665965,"content":"#98 - 0.7989335334859788"},{"type":"user","id":0.27679466735571623,"content":"#99 - 0.11710001272149384"},{"type":"user","id":0.441079223761335,"content":"#100 - 0.5469103425275534"},{"type":"user","id":0.7934400076046586,"content":"#101 - 0.23367309640161693"},{"type":"user","id":0.5128660728223622,"content":"#102 - 0.9870475942734629"},{"type":"user","id":0.3394732454326004,"content":"#103 - 0.33268680260516703"},{"type":"user","id":0.9686500946991146,"content":"#104 - 0.6376052242703736"},{"type":"user","id":0.27155333571136,"content":"#105 - 0.6047708857804537"},{"type":"user","id":0.14593618735671043,"content":"#106 - 0.4879307239316404"},{"type":"user","id":0.26402993546798825,"content":"#107 - 0.9658112947363406"},{"type":"user","id":0.44714654982089996,"content":"#108 - 0.9326640137005597"},{"type":"user","id":0.6830866201780736,"content":"#109 - 0.3135700295679271"},{"type":"user","id":0.3084880602546036,"content":"#110 - 0.5369896530173719"},{"type":"user","id":0.9315835845191032,"content":"#111 - 0.20895967190153897"},{"type":"user","id":0.931784825399518,"content":"#112 - 0.8327791295014322"},{"type":"user","id":0.6447421587072313,"content":"#113 - 0.9540560047607869"},{"type":"user","id":0.5062554751057178,"content":"#114 - 0.7849067230708897"},{"type":"user","id":0.36388417473062873,"content":"#115 - 0.46262080897577107"},{"type":"user","id":0.9409914035350084,"content":"#116 - 0.956883885897696"},{"type":"user","id":0.48421220062300563,"content":"#117 - 0.22128020972013474"},{"type":"user","id":0.0680175053421408,"content":"#118 - 0.4809107237961143"},{"type":"user","id":0.6892483006231487,"content":"#119 - 0.5299160699360073"},{"type":"user","id":0.3825283097103238,"content":"#120 - 0.7435703917872161"},{"type":"user","id":0.9500803602859378,"content":"#121 - 0.8313456794712692"},{"type":"user","id":0.7888749414123595,"content":"#122 - 0.9146939341444522"},{"type":"user","id":0.6904928328003734,"content":"#123 - 0.9680398267228156"},{"type":"user","id":0.6282360474579036,"content":"#124 - 0.35018165432848036"},{"type":"user","id":0.3997700351756066,"content":"#125 - 0.6095546297729015"},{"type":"user","id":0.3956766636110842,"content":"#126 - 0.8122751503251493"},{"type":"user","id":0.8227274883538485,"content":"#127 - 0.41360964765772223"},{"type":"user","id":0.13218349404633045,"content":"#128 - 0.5214638914912939"},{"type":"user","id":0.9869732393417507,"content":"#129 - 0.0006476212292909622"},{"type":"user","id":0.6888451562263072,"content":"#130 - 0.24477298324927688"},{"type":"user","id":0.6309561969246715,"content":"#131 - 0.39695757697336376"},{"type":"user","id":0.8935147868469357,"content":"#132 - 0.8248768274206668"},{"type":"user","id":0.15853246278129518,"content":"#133 - 0.5879367892630398"},{"type":"user","id":0.627541919471696,"content":"#134 - 0.8310014356393367"},{"type":"user","id":0.5788089658599347,"content":"#135 - 0.05247406265698373"},{"type":"user","id":0.11110130697488785,"content":"#136 - 0.29317979305051267"},{"type":"user","id":0.5399728277698159,"content":"#137 - 0.7125436326023191"},{"type":"user","id":0.5450774631462991,"content":"#138 - 0.7510398866143078"},{"type":"user","id":0.7546768737956882,"content":"#139 - 0.3233300291467458"},{"type":"user","id":0.2648440240882337,"content":"#140 - 0.6392309498041868"},{"type":"user","id":0.58411237411201,"content":"#141 - 0.6712925075553358"},{"type":"user","id":0.6562043626327068,"content":"#142 - 0.6248878666665405"},{"type":"user","id":0.8546041941735893,"content":"#143 - 0.14808956859633327"},{"type":"user","id":0.3136255033314228,"content":"#144 - 0.2961552271153778"},{"type":"user","id":0.1745247677899897,"content":"#145 - 0.9359570434316993"},{"type":"user","id":0.06752243055962026,"content":"#146 - 0.5643133886624128"},{"type":"user","id":0.6885977862402797,"content":"#147 - 0.7916538724675775"},{"type":"user","id":0.015306940767914057,"content":"#148 - 0.9871636391617358"},{"type":"user","id":0.4379034449812025,"content":"#149 - 0.2870416755322367"}]
const onmessage = ev()
const assign = require('lib/assign')
const id = window.localStorage.sessionId
const last = arr => arr[arr.length - 1]
const each = require('lib/collection/each')

const requestScroll = once(after, scrollTextArea)

// debug
each(msg => {
  if (msg.id > 0.5) {
    msg.id = id
  }
}, messageList)

const broadcast = (type, content) => onmessage.broadcast({
  time: Date.now(),
  id,
  type,
  content: String(content),
})

const curryError = content => details => broadcast('error', details
  ? content +' : '+ details
  : content)

const log = content => broadcast('log', content)
const error = content => broadcast('error', content)

error.commandNotFound = curryError('Command not found')
error.tooLong = curryError('Message too long')

function scrollTextArea() {
  const el = document.getElementById('messages-wrapper')
  if (!el) return
  el.scrollTop = el.scrollHeight
}

onmessage.listen(msg => {
  const lastMsg = last(messageList)
  if (lastMsg &&  lastMsg.id === msg.id && lastMsg.content === msg.content) {
    lastMsg.count++
  } else {
    msg.count = 1
    messageList.push(msg)
  }
  requestScroll()
  messagesCount.set(messageList.length)
})

const render = () => layout({ messageList })

render.post = broadcast

ws.on.msg(msg => onmessage.broadcast(assign({type: 'user'}, msg)))

render.clear = () => messagesCount.set(messageList.length = 0)

render.error = error

render.log = log

requestScroll()

module.exports = render