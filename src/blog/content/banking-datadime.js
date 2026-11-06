export default [
  {
    slug: 'bank-branch-security-ai',
    title: 'AI for bank branch security: spotting pickpocketing and suspicious behaviour early',
    category: 'Banking',
    product: 'Sakshi',
    excerpt: 'Branch cameras mostly record incidents for review later. Here is how video analytics on the CCTV you already have can flag unusual behaviour while there is still time to act.',
    description: 'AI for bank branch security turns existing CCTV into early alerts for pickpocketing and suspicious behaviour, without new cameras or identifying customers.',
    body: `<p>AI for bank branch security means software that watches your existing CCTV feeds and flags unusual behaviour as it happens, instead of leaving footage to be reviewed after an incident. It works on the cameras already on your walls. It looks at movement and patterns, not at who a person is.</p>
<p>For a security head, that shifts the camera from a record of what went wrong to a signal that something may be about to.</p>

<h2>Why is pickpocketing so hard to catch in a branch?</h2>
<p>A branch is busy at predictable hours. Customers carry cash, queue close together and focus on forms or tokens. That is the setting where theft of a wallet or a withdrawn envelope happens, and it happens quickly.</p>
<p>Most branches have cameras. Few have anyone watching them. A guard covers the door, a manager covers the floor, and the monitor in the back office shows many feeds at once. When something is reported, the team scrolls back through hours of video to find a few seconds.</p>
<p>The cameras did their job as a record. They just did not help in the moment.</p>

<h2>What does suspicious behaviour look like to a camera?</h2>
<p>A camera cannot read intent. It can read patterns. For example, a person who enters, walks the lobby more than once without going to a counter or a queue, and lingers close to people who are busy is behaving differently from most visitors. So is someone who stays far longer than the usual visit, or who keeps returning to the same spot near the cash counters.</p>
<p>None of these prove anything. A person may be waiting for a relative or may be lost. That is why the useful output is a prompt for a human to look, not a verdict. A good alert says: this part of the lobby, this camera, this moment. Your guard decides what to do.</p>

<div class="closer"><strong>An alert is a prompt, not a verdict</strong>Analytics should point your guard to the right camera at the right moment. The decision stays with a person.</div>

<h2>How Sakshi approaches branch security</h2>
<p>Sakshi runs on the CCTV a branch already has. There are no new cameras to buy or mount. It turns the video into counts, flows and behaviour patterns: who walks in, where they go and how long they stay.</p>
<p>For a branch, that gives your team a few practical things.</p>
<ul>
<li><strong>A live view of the floor.</strong> How many people are in the branch now, and where they are concentrated.</li>
<li><strong>Unusual-pattern flags.</strong> Long dwell in a spot where people normally pass through, or movement that does not match how customers normally use the space.</li>
<li><strong>Faster review.</strong> When an incident is reported, you can go to the relevant zone and time rather than watching hours of footage.</li>
<li><strong>A baseline.</strong> Once you know what a normal Tuesday looks like, an odd one is easier to spot.</li>
</ul>
<p>Sakshi does not claim to identify people. It works with counts and behaviour, which also makes it easier to explain to customers, staff and your compliance team. For more on that approach, see <a href="#blog/privacy-first-video-analytics">privacy-first video analytics</a>.</p>

<h2>What to keep in mind</h2>
<p>Analytics will not replace a trained guard or a good branch layout. It supports both. It also needs sensible thresholds. Set them too tight and your team gets alerts they stop reading. Our piece on <a href="#blog/atm-lobby-monitoring">ATM lobby monitoring</a> covers how to keep alerts few and useful.</p>
<p>Plan for a review period. Run the system quietly for a few weeks, look at what it flags, and tune it with your security team before anyone is expected to act on it.</p>
<p>You can read more about how <a href="#sakshi">Sakshi</a> turns cameras into data, or see how the same footage helps with <a href="#blog/branch-queue-wait-times">queues and wait times</a>.</p>

<h2>How to get started</h2>
<ol>
<li><strong>Pick two or three pilot branches.</strong> Choose a mix, for example one busy city branch and one quieter one, so you see different patterns.</li>
<li><strong>Connect the existing CCTV.</strong> No new cameras. Confirm which feeds cover the lobby, counters and entrance.</li>
<li><strong>Run in observation mode for a few weeks.</strong> Let the system learn what normal looks like in each branch.</li>
<li><strong>Review flagged moments with your security team.</strong> Keep the alerts that were useful and tighten or drop the rest.</li>
<li><strong>Turn on live alerts for the guard or branch manager.</strong> Start with a small set and widen it once the team trusts it.</li>
</ol>`,
  },
  {
    slug: 'branch-queue-wait-times',
    title: 'Reading queues and wait times in bank branches with existing CCTV',
    category: 'Banking',
    product: 'Sakshi',
    excerpt: 'Long waits frustrate customers and are hard to see from a head office. See how existing branch cameras can show queue length and wait time, hour by hour.',
    description: 'Measure queues and wait times in bank branches using the CCTV you already have, and see when waits build up and which counters need support.',
    body: `<p>You can measure queues and wait times in bank branches with the CCTV already installed. The software counts people in the queue area and tracks how long they stay, which gives you queue length and wait by hour, with no new hardware at the counter.</p>
<p>The result is a plain answer to a question most head offices cannot answer today: how long do customers actually wait?</p>

<h2>Why do branch managers struggle to see waits?</h2>
<p>Most branches count transactions. A token system tells you how many customers were served. It does not tell you how many walked in, looked at the line and left, or how long the average person stood waiting.</p>
<p>Surveys help a little, but they capture a few opinions on a few days. A manager on the floor knows the branch feels busy at certain times. A regional head looking at forty branches cannot see that.</p>
<p>So decisions get made on instinct. Staff are rostered the same way every day, even though customers do not arrive that way.</p>

<h2>What can existing cameras tell you about queues?</h2>
<p>A branch camera already sees the queue area. Analytics turn that view into numbers.</p>
<ul>
<li><strong>Queue length.</strong> How many people are waiting at a given moment.</li>
<li><strong>Wait time.</strong> How long a person stays in the queue zone before reaching the counter.</li>
<li><strong>Peak hours.</strong> When the line builds, by hour and by day of the week.</li>
<li><strong>Walk-aways.</strong> People who enter the queue area and leave without being served, often called bounce.</li>
</ul>
<p>For example, say a branch seems fine on most days but the line stretches to the door every second Friday and during the first week of the month. Without data that is a hunch. With data, it is a pattern you can staff against.</p>

<div class="closer"><strong>Count the wait, not just the transactions</strong>A token count says how many were served. Camera data says how long people waited, and how many gave up.</div>

<h2>How Sakshi turns queues into decisions</h2>
<p>Sakshi works on CCTV the branch already has. It measures who walks in, where they go and how long they stay. In a bank, those same measures describe the queue: how many are waiting, for how long, and at which hour it gets worse.</p>
<p>That supports a few concrete choices.</p>
<ul>
<li><strong>Rostering.</strong> Match counter staff to the hours when people actually arrive. Our article on <a href="#blog/staffing-to-real-traffic">staffing to real traffic</a> goes deeper on this for retail, and the logic is the same.</li>
<li><strong>Counter mix.</strong> If cash deposits clog the line at certain hours, you may open a dedicated counter then.</li>
<li><strong>Layout.</strong> If the queue blocks the entrance or runs into the ATM lobby, you can see it and adjust the floor plan.</li>
<li><strong>Comparison.</strong> Put similar branches side by side and see which handle peaks well and which do not.</li>
</ul>
<p>Sakshi works with counts and flows, not with identifying customers. For the thinking behind that, read about <a href="#blog/privacy-first-video-analytics">privacy-first video analytics</a>.</p>

<h2>What to watch out for</h2>
<p>Queue data tells you what is happening. It does not tell you why. A long wait could mean too few staff, a slow process or a system outage. Pair the numbers with a conversation with the branch manager.</p>
<p>Also define what a long wait means for you before you start. Pick a number your service team agrees on, and judge branches against it. A fair target for a small rural branch is different from a city one.</p>
<p>Once you have the numbers across a network, the next step is asking questions of them. See <a href="#blog/branch-network-insights">asking your branch network questions in plain language</a>. You can also read more about <a href="#sakshi">Sakshi</a>.</p>

<h2>How to get started</h2>
<ol>
<li><strong>Choose a few branches with known queue problems.</strong> Ask regional managers which ones get the most complaints.</li>
<li><strong>Confirm camera coverage of the queue area.</strong> The counter line and the waiting zone should be visible on at least one feed.</li>
<li><strong>Agree what counts as a long wait.</strong> Set one target for the pilot so results are easy to read.</li>
<li><strong>Collect two to four weeks of data.</strong> Look at wait by hour and by day, and note the peaks.</li>
<li><strong>Change one thing and measure again.</strong> Shift a roster or open a counter at the peak hour, then check whether waits fell.</li>
</ol>`,
  },
  {
    slug: 'atm-lobby-monitoring',
    title: 'Smarter ATM lobby monitoring: alerts that matter, fewer false alarms',
    category: 'Banking',
    product: 'Sakshi',
    excerpt: 'ATM lobbies generate a flood of alerts that teams learn to ignore. Here is how to keep the ones that matter, using the cameras you already have.',
    description: 'Smarter ATM lobby monitoring uses existing CCTV to raise fewer, better alerts, so security teams respond to what matters instead of ignoring false alarms.',
    body: `<p>Smarter ATM lobby monitoring means fewer alerts, each one worth acting on. Instead of triggering on every movement, analytics on your existing CCTV watch for patterns that are unusual for that lobby, so your team stops ignoring the alarm channel.</p>
<p>The aim is not more alerts. It is alerts someone trusts.</p>

<h2>Why do ATM lobby alerts get ignored?</h2>
<p>Basic motion detection treats everything as an event. A customer walking in, a cleaner mopping, a person waiting for a friend and a shadow from a passing vehicle can all trigger the same alert. Multiply that across hundreds of lobbies and the control room sees a constant stream.</p>
<p>People adapt. They stop looking closely. Then a real event arrives looking like all the others. This is a well-known problem with any alert system, and it gets worse the more sites you add.</p>
<p>The fix is not to turn alerts off. It is to make each alert carry more meaning.</p>

<h2>What makes an alert worth raising?</h2>
<p>A useful alert is tied to behaviour that is unusual for that place and time. For example, think about these situations in a lobby.</p>
<ul>
<li>A person staying much longer than a normal transaction takes.</li>
<li>More people inside than the lobby usually holds, so a crowd forms around the machines.</li>
<li>Someone entering repeatedly without using a machine.</li>
<li>Activity at an hour when the lobby is normally empty.</li>
</ul>
<p>None of these prove wrongdoing. Each is worth a look. And each is a pattern, not a person. The system counts and measures. It does not need to know who anyone is.</p>

<div class="closer"><strong>Fewer alerts, more trust</strong>If every alert is worth a look, your team keeps looking. Set the rules around unusual behaviour for that lobby, not around any movement at all.</div>

<h2>How Sakshi helps cut the noise</h2>
<p>Sakshi runs on CCTV that is already in place, with no new cameras. It measures who enters, where they go and how long they stay. For an ATM lobby, that gives you a picture of normal: a typical stay, a typical headcount, a typical hour.</p>
<p>Once normal is known, the system can raise an alert only when something departs from it. Your team gets a short list instead of a long one, and each item points to a camera and a moment.</p>
<p>Because Sakshi deals in counts, dwell and flow, it fits a privacy-minded approach. If you want the reasoning, see <a href="#blog/privacy-first-video-analytics">privacy-first video analytics</a>. The same ideas apply inside the branch, which we cover in <a href="#blog/bank-branch-security-ai">AI for bank branch security</a>.</p>

<h2>Tuning is part of the job</h2>
<p>No system gets thresholds right on day one. A lobby near a busy market behaves differently from one in a quiet residential street. Expect to spend a few weeks reviewing flagged events with your security team.</p>
<p>Track a simple measure: of the alerts raised, how many did someone act on? If most are dismissed, tighten the rule. If your team finds things the system missed, loosen it. That loop is what turns a noisy system into a quiet, useful one.</p>
<p>It also helps to decide who receives each type of alert. A crowding alert may go to the branch manager. An off-hours alert may go to the control room. See how <a href="#sakshi">Sakshi</a> fits into this kind of workflow.</p>

<h2>How to get started</h2>
<ol>
<li><strong>List your current alert sources.</strong> Note how many alerts come in a week and how many anyone acts on.</li>
<li><strong>Select a handful of lobbies.</strong> Include different settings, such as a market area, a residential area and a mall.</li>
<li><strong>Run Sakshi in observation mode.</strong> Let it build a picture of normal dwell, headcount and hours for each lobby.</li>
<li><strong>Define a short set of rules.</strong> Start with three or four behaviours, such as unusual dwell, crowding and off-hours entry.</li>
<li><strong>Review weekly and adjust.</strong> Retire rules that create noise and keep the ones your team acts on.</li>
</ol>`,
  },
  {
    slug: 'branch-network-insights',
    title: 'Asking your branch network questions in plain language',
    category: 'Banking',
    product: 'DataDime',
    excerpt: 'Branch data often sits in reports few people have time to read. See how asking questions in plain language gets operations heads answers without waiting on an analyst.',
    description: 'Ask your branch network questions in plain language and get answers from layout and floor data, without waiting for a report or an analyst to build one.',
    body: `<p>You can ask your branch network questions in plain language and get an answer drawn from your layout and floor data. DataDime is built for that. You type or say the question, the way you would ask a colleague, and it reads the data to reply.</p>
<p>It removes the gap between a question an operations head has and the report that someone has to build to answer it.</p>

<h2>Why is branch data hard to use?</h2>
<p>A bank with many branches has plenty of data. Footfall, queue lengths, layouts, security events. The trouble is access. Each view usually sits in its own report or dashboard, built for one purpose. A new question means a request to an analyst, a wait of days and a result that answers a slightly different question from the one you meant.</p>
<p>By then the moment has passed. The decision was made on instinct.</p>
<p>The people closest to the decisions, regional heads, branch network managers and security leads, are rarely the people who know how to query a database. So the data stays one step away from them.</p>

<h2>What does a plain-language question look like?</h2>
<p>Here are examples of the kind of thing an operations head might ask.</p>
<ul>
<li>Which branches get the longest lines on Monday mornings?</li>
<li>Where do customers spend the most time before reaching a counter?</li>
<li>Which branch layouts have the ATM lobby furthest from the entrance, and does it matter?</li>
<li>If we move a counter, what happens to the way people flow through the floor?</li>
</ul>
<p>These are ordinary questions. None needs a special query language. The value is in being able to ask the second and third question straight after the first, while the thought is still fresh.</p>

<div class="closer"><strong>The question should not need a ticket</strong>If an operations head has to raise a request to learn something about a branch, most questions never get asked. Plain language removes that step.</div>

<h2>How DataDime works with the rest of the platform</h2>
<p>DataDime lets you ask questions about the layout and the floor data in plain language. The floor data comes from <a href="#blog/branch-queue-wait-times">queue and wait readings</a> and other signals that Sakshi produces from existing CCTV. The layout comes from the design side of the platform.</p>
<p>That pairing is the point. A question like where do people stop in this branch becomes more useful when the answer can sit next to the floor plan. You see the pattern and the space it happens in.</p>
<p>It also helps with security work. Flagged events from <a href="#blog/bank-branch-security-ai">branch security analytics</a> can be explored the same way, for example by asking which branches see the most off-hours activity.</p>
<p>DataDime works from the data your system holds. It will not invent facts about branches it has no information on, and answers are only as good as the data behind them. Read more at <a href="#datadime">DataDime</a>.</p>

<h2>What changes for the network team</h2>
<p>When asking is easy, people ask more. Regional heads can compare branches before a review meeting rather than after. Security leads can test an idea in the morning and act on it by afternoon. Analysts are freed from routine requests and can work on harder problems.</p>
<p>It also changes the quality of conversation with branch managers. Instead of arguing about whether Tuesday is quiet, both sides look at the same answer.</p>
<p>For a wider view of this idea outside banking, see <a href="#blog/talk-to-your-stores">asking your stores a question</a>.</p>

<h2>How to get started</h2>
<ol>
<li><strong>Write down ten questions you wish you could ask.</strong> Collect them from regional heads, security leads and service teams.</li>
<li><strong>Check what data exists for them.</strong> Layouts, footfall, queues and flows are a good starting set.</li>
<li><strong>Start with a pilot group of branches.</strong> Choose a region where the questions matter most.</li>
<li><strong>Let a few non-technical users try it.</strong> Watch what they ask and where the answers fall short.</li>
<li><strong>Expand to the wider network.</strong> Add branches and data sources once the pilot questions are answered well.</li>
</ol>`,
  },
  {
    slug: 'talk-to-your-stores',
    title: 'Ask your stores a question, get a plain answer: conversational analytics for retail',
    category: 'DataDime',
    product: 'DataDime',
    excerpt: 'Conversational analytics lets retail teams ask about their stores in plain words and get an answer. Here is what it is, and where it helps most.',
    description: 'Conversational analytics for retail lets you ask your stores a question in plain language and get an answer from layout and floor data, no analyst needed.',
    body: `<p>Conversational analytics for retail means asking a question about your stores in everyday language and getting a plain answer back. You do not need a dashboard training session or an analyst to build a report first. DataDime does this for your store layouts and floor data.</p>
<p>It is a simple idea. Ask the way you would ask a colleague, and get an answer you can act on.</p>

<h2>What is wrong with dashboards?</h2>
<p>Dashboards are useful when the question is known in advance. They show the numbers someone decided to track. The trouble starts with the next question. Why is this store lower than that one? What happened to this zone after the reset? A dashboard rarely has that answer ready.</p>
<p>So the team raises a request. An analyst builds a view. A few days later, there is an answer to a question that has already moved on.</p>
<p>For a retail operations head, that delay is costly in a small way, every week. Decisions on staffing, layout or stock placement are made with partial information because getting more takes too long.</p>

<h2>What does asking a store a question look like?</h2>
<p>These are examples of the kind of question a retail team may want to ask.</p>
<ul>
<li>Which zone are shoppers walking past?</li>
<li>What does a price change do to a zone?</li>
<li>Where do I add staff next month?</li>
<li>Which layout sells better?</li>
</ul>
<p>These are the questions on the DataDime site itself. They are the real questions people in stores already ask. The change is that the answer arrives in seconds and comes with the floor in front of you.</p>

<div class="closer"><strong>Ask first, build the report later</strong>A plain question gets you a first answer in seconds. If it matters, you can then ask for a permanent view.</div>

<h2>How DataDime fits with SpaceZap and Sakshi</h2>
<p>DataDime sits on top of two other sources. SpaceZap gives you the layout: the shape of the store, where fixtures sit and how zones are arranged. Sakshi gives you the signal: who walks in, where they go and how long they stay, read from the CCTV your stores already have.</p>
<p>DataDime lets you talk to both. That means a question can mix design and behaviour. For example, you can ask how the footfall in a zone compares with the space it takes up on the floor plan.</p>
<p>It also means the answer is tied to the store, not to a general average. You are not told what stores like yours usually do. You are told what your store is doing. Learn more about the <a href="#blog/physical-retail-data-gap">physical retail data gap</a> and how this closes it, or see <a href="#datadime">DataDime</a> directly.</p>

<h2>Where it helps most</h2>
<p>It helps most where decisions are frequent and the data is scattered. Layout reviews, staffing plans, seasonal resets and new store openings all benefit. Teams can try an idea in conversation before committing to a change on the floor.</p>
<p>It is also useful for people who are not analysts. A store design lead can check how a past layout performed. A regional head can compare zones across locations. A CXO can ask a quick question before a meeting without waiting for a pack.</p>
<p>Keep in mind that answers depend on the data. If a store has no footfall data yet, there is little to say about it. Our article on <a href="#blog/zone-performance-questions">zone performance questions</a> shows how to build a first set of questions worth asking.</p>

<h2>How to get started</h2>
<ol>
<li><strong>List the questions your team asks most.</strong> Include the ones that always need an analyst.</li>
<li><strong>Connect your layouts and floor data.</strong> Start with a small set of stores that already have cameras and drawings.</li>
<li><strong>Try the questions in plain words.</strong> Let the store team, not only analysts, use it.</li>
<li><strong>Check answers against what you know.</strong> If a store manager disagrees, find out why and improve the data.</li>
<li><strong>Add more stores and questions.</strong> Grow once people are asking without being prompted.</li>
</ol>`,
  },
  {
    slug: 'zone-performance-questions',
    title: 'Which zone are shoppers walking past? Turning floor data into decisions',
    category: 'DataDime',
    product: 'DataDime',
    excerpt: 'Some zones in a store get visits and some are walked past. Learn which questions about zones are worth asking, and how floor data turns them into decisions.',
    description: 'Find out which zone shoppers are walking past, and how floor data on footfall and dwell turns zone questions into layout and staffing decisions.',
    body: `<p>To find out which zone shoppers are walking past, you compare how many people pass a zone with how many stop in it. The gap between the two is the signal. Floor data from your existing cameras provides both numbers, and DataDime lets you ask for the comparison in plain language.</p>
<p>A zone that gets traffic but little dwell is a different problem from a zone that gets no traffic at all.</p>

<h2>Why do zones go unnoticed?</h2>
<p>Every store has areas that customers simply do not reach. Sometimes it is a back corner. Sometimes it is a display near the entrance that people walk past on their way elsewhere. The layout may look sensible on the drawing and still not work on the floor.</p>
<p>Sales figures alone do not explain it. A low-selling zone could be unseen, or seen and ignored, or seen and priced wrongly. Each has a different fix. Without floor data you are guessing which one applies.</p>
<p>This is part of what we call the <a href="#blog/physical-retail-data-gap">physical retail data gap</a>: online stores know where every visitor goes, and physical stores often do not.</p>

<h2>Which zone questions are worth asking?</h2>
<p>Start with a few that lead to action.</p>
<ul>
<li><strong>Which zones are people walking past?</strong> High pass-by, low dwell.</li>
<li><strong>Which zones do they never reach?</strong> Low pass-by altogether.</li>
<li><strong>Where do people slow down?</strong> Long dwell may mean interest, or it may mean confusion.</li>
<li><strong>What changed after a reset?</strong> Compare a zone before and after.</li>
<li><strong>Where is the floor thin on staff?</strong> Match customer presence in a zone to staff presence.</li>
</ul>
<p>For example, say a 40-store chain places a new range near the back of every store. If customers in most stores never reach that area, the issue is probably the layout, not the range. That is a finding you can act on.</p>

<div class="closer"><strong>Passing is not the same as stopping</strong>A zone people walk past needs a different fix from a zone nobody reaches. The floor data tells you which one you have.</div>

<h2>How DataDime and Sakshi answer them</h2>
<p>Sakshi reads the CCTV your store already has. It measures who walks in, where they go and how long they stay, and which zones they never reach. That is the raw signal.</p>
<p>DataDime lets you ask about it in plain language, next to the layout. You can ask which zone shoppers are walking past and see the answer against the floor plan. You can then follow with what a change might do, or where to add staff next month. For more on how that conversation works, read <a href="#blog/talk-to-your-stores">asking your stores a question</a>.</p>
<p>This is also where the layout side matters. If a zone is consistently passed, you may want to change the layout rather than only the display. Our article on <a href="#blog/footfall-dwell-bounce">footfall, dwell and bounce</a> explains the underlying measures in more detail, and <a href="#datadime">DataDime</a> shows how the questions are asked.</p>

<h2>Turning an answer into a decision</h2>
<p>An answer is only useful if it leads somewhere. Treat each finding as a small test. If a zone is passed by, try a change: move a fixture, adjust signage, shift a category. Then ask the same question again and see whether it moved.</p>
<p>Change one thing at a time, so you know what caused the effect. Keep notes on what you changed and when. And compare similar stores, since a mall store and a high street store will not behave alike.</p>
<p>Be careful about conclusions from a short period. Festival weeks, weather and local events all change footfall. Give any test enough time to be fair.</p>

<h2>How to get started</h2>
<ol>
<li><strong>Pick one store and one question.</strong> For example, which zone are shoppers walking past?</li>
<li><strong>Get the layout and floor data together.</strong> The drawing and the camera readings need to describe the same space.</li>
<li><strong>Ask the question and read the answer against the plan.</strong> Note the zones with high pass-by and low dwell.</li>
<li><strong>Make one change.</strong> Move a fixture, adjust a display or change staffing in that zone.</li>
<li><strong>Ask again after a few weeks.</strong> If it helped, repeat the change in similar stores.</li>
</ol>`,
  },
];
