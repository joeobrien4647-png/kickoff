export type TriviaCategory =
  | "history"
  | "players"
  | "hosts"
  | "records"
  | "england"
  | "culture";

export type TriviaQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
  category: TriviaCategory;
};

export const TRIVIA_CATEGORIES: {
  value: TriviaCategory;
  label: string;
}[] = [
  { value: "history", label: "History" },
  { value: "players", label: "Players" },
  { value: "hosts", label: "Hosts & Venues" },
  { value: "records", label: "Records" },
  { value: "england", label: "England" },
  { value: "culture", label: "Culture" },
];

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // ── History (8) ───────────────────────────────────────────────────────
  {
    id: 1,
    question: "Who won the very first FIFA World Cup in 1930?",
    options: ["Brazil", "Uruguay", "Argentina", "Italy"],
    correctIndex: 1,
    funFact:
      "Uruguay hosted and won the inaugural tournament, beating Argentina 4-2 in the final. Only 13 teams entered because most European nations refused to make the two-week boat journey.",
    category: "history",
  },
  {
    id: 2,
    question: "Which country has won the most World Cups?",
    options: ["Germany", "Italy", "Argentina", "Brazil"],
    correctIndex: 3,
    funFact:
      "Brazil has won 5 World Cups (1958, 1962, 1970, 1994, 2002) and is the only team to have played in every single tournament since 1930.",
    category: "history",
  },
  {
    id: 3,
    question:
      'In which year did the infamous "Hand of God" goal occur?',
    options: ["1982", "1986", "1990", "1994"],
    correctIndex: 1,
    funFact:
      'Maradona punched the ball into the net against England in the 1986 quarter-final in Mexico City. He then scored the "Goal of the Century" just four minutes later, dribbling past five English players.',
    category: "history",
  },
  {
    id: 4,
    question:
      "Which World Cup final was the first to be decided by a penalty shootout?",
    options: [
      "1990 — West Germany vs Argentina",
      "1994 — Brazil vs Italy",
      "1998 — France vs Brazil",
      "2006 — Italy vs France",
    ],
    correctIndex: 1,
    funFact:
      "Roberto Baggio blazed his penalty over the bar to hand Brazil the trophy. The Italian legend later said that missed kick haunted him for years.",
    category: "history",
  },
  {
    id: 5,
    question:
      "What year was the World Cup first held in Asia?",
    options: ["1998", "2002", "2006", "2010"],
    correctIndex: 1,
    funFact:
      "The 2002 tournament was co-hosted by Japan and South Korea -- the first time the World Cup was shared between two countries, and the first time it was held outside Europe or the Americas.",
    category: "history",
  },
  {
    id: 6,
    question:
      "Who scored the fastest goal in World Cup history?",
    options: [
      "Clint Dempsey (30 seconds)",
      "Hakan Sukur (11 seconds)",
      "Vaclav Masek (15 seconds)",
      "Ernst Lehner (25 seconds)",
    ],
    correctIndex: 1,
    funFact:
      "Turkey's Hakan Sukur scored just 11 seconds into the 2002 third-place match against South Korea. He received the ball from kickoff, ran forward, and blasted it past the keeper.",
    category: "history",
  },
  {
    id: 7,
    question:
      "Has any country ever hosted the World Cup in back-to-back tournaments?",
    options: [
      "Yes -- Italy in 1934 and 1938",
      "Yes -- France in 1998 and 2002",
      "Yes -- Brazil in 1950 and 1954",
      "No -- it has never happened",
    ],
    correctIndex: 3,
    funFact:
      "FIFA has never allowed the same country to host consecutive tournaments. Mexico holds the record for most times hosting (1970, 1986, and co-hosting in 2026).",
    category: "history",
  },
  {
    id: 8,
    question: "What was the highest-scoring World Cup final ever?",
    options: [
      "1958 — Brazil 5-2 Sweden",
      "1966 — England 4-2 West Germany",
      "1970 — Brazil 4-1 Italy",
      "1938 — Italy 4-2 Hungary",
    ],
    correctIndex: 0,
    funFact:
      "A 17-year-old Pele scored twice in that 1958 final. He burst into tears on the pitch afterwards -- the youngest player to score in a World Cup final, and he did it with a hat-trick of brilliance.",
    category: "history",
  },

  // ── Players (8) ───────────────────────────────────────────────────────
  {
    id: 9,
    question: "Who is the all-time top scorer in World Cup history?",
    options: [
      "Ronaldo (Brazil)",
      "Gerd Muller",
      "Miroslav Klose",
      "Just Fontaine",
    ],
    correctIndex: 2,
    funFact:
      "Germany's Miroslav Klose scored 16 World Cup goals across four tournaments (2002-2014). He broke Ronaldo's record of 15 in the 2014 semi-final against Brazil.",
    category: "players",
  },
  {
    id: 10,
    question:
      "Which player has appeared in the most World Cup tournaments (5)?",
    options: [
      "Lothar Matthaus",
      "Antonio Carbajal",
      "Cristiano Ronaldo",
      "Diego Maradona",
    ],
    correctIndex: 1,
    funFact:
      "Mexican goalkeeper Antonio Carbajal appeared in five consecutive World Cups from 1950 to 1966. Gianluigi Buffon and Rafael Marquez later matched the record. Lionel Messi also reached 5 in 2022.",
    category: "players",
  },
  {
    id: 11,
    question:
      "Who scored the most goals in a single World Cup tournament?",
    options: [
      "Gerd Muller — 10 goals (1970)",
      "Just Fontaine — 13 goals (1958)",
      "Sandor Kocsis — 11 goals (1954)",
      "Ronaldo — 8 goals (2002)",
    ],
    correctIndex: 1,
    funFact:
      "France's Just Fontaine scored 13 goals in just 6 matches at the 1958 World Cup in Sweden. He wasn't even first-choice striker at the start of the tournament -- he only played because a teammate got injured.",
    category: "players",
  },
  {
    id: 12,
    question: "Who is the youngest player ever to score in a World Cup?",
    options: [
      "Michael Owen (18)",
      "Pele (17)",
      "Kylian Mbappe (19)",
      "Lionel Messi (18)",
    ],
    correctIndex: 1,
    funFact:
      "Pele was just 17 years and 239 days old when he scored against Wales in the 1958 quarter-final. By the end of that tournament, he'd scored 6 goals and become a global icon.",
    category: "players",
  },
  {
    id: 13,
    question:
      "Which goalkeeper holds the record for the most World Cup clean sheets?",
    options: [
      "Gianluigi Buffon (7)",
      "Manuel Neuer (6)",
      "Fabien Barthez (10)",
      "Peter Shilton (10)",
    ],
    correctIndex: 2,
    funFact:
      "France's Fabien Barthez kept 10 clean sheets across three World Cups (1998-2006). His bald head became iconic -- Laurent Blanc kissed it before every match for good luck in 1998.",
    category: "players",
  },
  {
    id: 14,
    question: "How many players have scored in three consecutive World Cup finals?",
    options: ["One -- Pele", "Two -- Pele and Vava", "Three", "None"],
    correctIndex: 3,
    funFact:
      "Nobody has managed it. Vava scored in the 1958 and 1962 finals but not 1966. Pele scored in 1958 but was injured in 1962. Kylian Mbappe scored in 2018 and 2022 -- could 2026 be the charm?",
    category: "players",
  },
  {
    id: 15,
    question: "Who is England's all-time top scorer at World Cups?",
    options: [
      "Bobby Charlton (6)",
      "Gary Lineker (10)",
      "Wayne Rooney (3)",
      "Harry Kane (8)",
    ],
    correctIndex: 1,
    funFact:
      "Gary Lineker scored 10 World Cup goals, including 6 at Mexico 1986 where he won the Golden Boot. He famously never received a yellow or red card in his entire career.",
    category: "players",
  },
  {
    id: 16,
    question: "Who has scored the most World Cup hat-tricks?",
    options: [
      "Pele (2)",
      "Just Fontaine (2)",
      "Gerd Muller (2)",
      "Sandor Kocsis (2)",
    ],
    correctIndex: 2,
    funFact:
      "Several legends share the record with 2 hat-tricks each, including Muller, Fontaine, and Kocsis. But Hungary's Laszlo Kiss holds the strangest record -- he scored a hat-trick as a substitute in 1982.",
    category: "players",
  },

  // ── Hosts & Venues (8) ────────────────────────────────────────────────
  {
    id: 17,
    question: "How many countries are co-hosting the 2026 World Cup?",
    options: [
      "2 — USA and Mexico",
      "3 — USA, Canada, and Mexico",
      "4 — USA, Canada, Mexico, and Costa Rica",
      "1 — USA only",
    ],
    correctIndex: 1,
    funFact:
      "It's the first World Cup with three host nations. The USA hosts 78 of the 104 matches, with Canada and Mexico each hosting 13. It's also the first 48-team World Cup.",
    category: "hosts",
  },
  {
    id: 18,
    question:
      "Which US city has been awarded the most 2026 World Cup matches?",
    options: ["New York/New Jersey", "Dallas", "Los Angeles", "Miami"],
    correctIndex: 0,
    funFact:
      "MetLife Stadium in East Rutherford, NJ will host the most matches, including the World Cup Final. It's technically in New Jersey, not New York -- don't tell any New Yorkers.",
    category: "hosts",
  },
  {
    id: 19,
    question: "What is the approximate capacity of MetLife Stadium?",
    options: ["65,000", "72,500", "82,500", "90,000"],
    correctIndex: 2,
    funFact:
      "MetLife Stadium holds around 82,500 fans and will host the 2026 World Cup Final. It's one of the most expensive stadiums ever built, costing $1.6 billion. It has no naming rights -- wait, yes it does.",
    category: "hosts",
  },
  {
    id: 20,
    question: "Which 2026 World Cup venue is closest to a beach?",
    options: [
      "SoFi Stadium (LA)",
      "Hard Rock Stadium (Miami)",
      "Lumen Field (Seattle)",
      "Gillette Stadium (Boston)",
    ],
    correctIndex: 1,
    funFact:
      "Hard Rock Stadium in Miami Gardens is about 15 miles from South Beach. Perfect for a post-match swim -- if you can handle the June Florida heat, which averages 33C (91F).",
    category: "hosts",
  },
  {
    id: 21,
    question:
      "Which of these World Cup host nations has NEVER won the tournament?",
    options: ["Germany (2006)", "South Korea (2002)", "France (1998)", "Argentina (1978)"],
    correctIndex: 1,
    funFact:
      "South Korea's best result was reaching the semi-finals as co-hosts in 2002, shocking Spain and Italy along the way. The USA, Canada, Mexico, Japan, and South Africa have also hosted without winning.",
    category: "hosts",
  },
  {
    id: 22,
    question: "How many stadiums will be used across the 2026 World Cup?",
    options: ["12", "14", "16", "20"],
    correctIndex: 2,
    funFact:
      "16 stadiums across 16 cities will host matches. 11 are in the USA, 3 in Mexico, and 2 in Canada. Every single one is an existing venue -- no new stadiums were built for this World Cup.",
    category: "hosts",
  },
  {
    id: 23,
    question: "Which of these stadiums was built most recently?",
    options: [
      "MetLife Stadium (2010)",
      "SoFi Stadium (2020)",
      "Mercedes-Benz Stadium (2017)",
      "Hard Rock Stadium (1987)",
    ],
    correctIndex: 1,
    funFact:
      "SoFi Stadium in LA opened in 2020 after a $5.5 billion construction -- making it the most expensive stadium ever built. Its translucent roof gives it a space-age look.",
    category: "hosts",
  },
  {
    id: 24,
    question: "What is the northernmost 2026 World Cup venue city?",
    options: ["Seattle", "Vancouver", "Toronto", "Boston"],
    correctIndex: 1,
    funFact:
      "Vancouver, British Columbia sits at roughly 49.3 degrees north latitude, edging out Seattle (47.6N) and Toronto (43.7N). The June weather should be lovely, though -- around 20C (68F).",
    category: "hosts",
  },

  // ── Records (8) ───────────────────────────────────────────────────────
  {
    id: 25,
    question:
      "What's the most total goals scored in a single World Cup match?",
    options: [
      "Hungary 10-1 El Salvador (1982)",
      "Austria 7-5 Switzerland (1954)",
      "Brazil 6-5 Poland (1938)",
      "Germany 8-0 Saudi Arabia (2002)",
    ],
    correctIndex: 1,
    funFact:
      "Austria vs Switzerland in 1954 produced 12 goals in a single match. The game had 5 goals in the first 20 minutes. The 1954 tournament was nicknamed the 'Miracle of Bern' and averaged 5.38 goals per game.",
    category: "records",
  },
  {
    id: 26,
    question: "Which team has the longest unbeaten run in World Cup history?",
    options: [
      "Brazil (13 matches)",
      "Italy (14 matches)",
      "Brazil (17 matches)",
      "Germany (15 matches)",
    ],
    correctIndex: 0,
    funFact:
      "Brazil went unbeaten for 13 consecutive World Cup matches from 2002-2010 (winning 11, drawing 2). Their run ended with a 2-1 loss to the Netherlands in the 2010 quarter-finals.",
    category: "records",
  },
  {
    id: 27,
    question:
      "What's the biggest margin of victory in World Cup history?",
    options: [
      "Germany 8-0 Saudi Arabia (2002)",
      "Hungary 10-1 El Salvador (1982)",
      "Yugoslavia 9-0 Zaire (1974)",
      "Hungary 9-0 South Korea (1954)",
    ],
    correctIndex: 1,
    funFact:
      "Hungary demolished El Salvador 10-1 in 1982. Laszlo Kiss scored a hat-trick as a substitute, becoming the first sub ever to score three goals in a World Cup match.",
    category: "records",
  },
  {
    id: 28,
    question: "Which team has lost the most World Cup finals?",
    options: [
      "Netherlands (3)",
      "Germany (4)",
      "Argentina (3)",
      "Brazil (2)",
    ],
    correctIndex: 1,
    funFact:
      "Germany (including West Germany) has lost 4 finals: 1966, 1982, 1986, and 2002. But they've also won 4, so it evens out. The Netherlands have lost 3 finals without ever winning -- the ultimate nearly-men.",
    category: "records",
  },
  {
    id: 29,
    question:
      "Most red cards shown in a single World Cup match?",
    options: [
      "2 cards",
      "3 cards",
      "4 cards",
      "5 cards",
    ],
    correctIndex: 2,
    funFact:
      "The 2006 round of 16 match between Portugal and Netherlands saw 4 red cards (Costinha, Deco, Boulahrouz, and Figo). Referee Valentin Ivanov also showed 16 yellow cards. It was nicknamed 'The Battle of Nuremberg'.",
    category: "records",
  },
  {
    id: 30,
    question:
      "What's the longest penalty shootout in World Cup history?",
    options: [
      "10 penalties each",
      "6 penalties each",
      "5 penalties each",
      "7 penalties each",
    ],
    correctIndex: 0,
    funFact:
      "Argentina beat France 4-2 on penalties after a dramatic 3-3 draw in the 2022 final, but the longest shootout was in qualification stages. In World Cup finals tournaments, shootouts typically end within 5-6 rounds.",
    category: "records",
  },
  {
    id: 31,
    question:
      "How many own goals were scored at the 2018 World Cup in Russia?",
    options: ["6", "8", "10", "12"],
    correctIndex: 3,
    funFact:
      "The 2018 World Cup saw 12 own goals -- more than all previous World Cups combined had averaged per tournament. Some blame the modern attacking pressing style, others blame the VAR-induced panic.",
    category: "records",
  },
  {
    id: 32,
    question: "What's the fastest hat-trick in World Cup history?",
    options: [
      "Laszlo Kiss — 7 minutes (1982)",
      "Fabienne Ernst — 12 minutes (2015)",
      "Gerd Muller — 9 minutes (1970)",
      "Batistuta — 10 minutes (1998)",
    ],
    correctIndex: 0,
    funFact:
      "Hungary's Laszlo Kiss scored three goals in just 7 minutes against El Salvador in 1982 (in the 70th, 74th, and 77th minutes). He came on as a sub and became an instant World Cup legend.",
    category: "records",
  },

  // ── England (8) ───────────────────────────────────────────────────────
  {
    id: 33,
    question: "What year did England win the World Cup?",
    options: ["1962", "1966", "1970", "1974"],
    correctIndex: 1,
    funFact:
      "England beat West Germany 4-2 after extra time at Wembley on 30 July 1966. The BBC commentary line 'They think it's all over... it is now!' as Geoff Hurst scored is the most famous in English sports history.",
    category: "england",
  },
  {
    id: 34,
    question: "Who scored a hat-trick in the 1966 World Cup final?",
    options: [
      "Bobby Charlton",
      "Jimmy Greaves",
      "Geoff Hurst",
      "Gordon Banks",
    ],
    correctIndex: 2,
    funFact:
      "Geoff Hurst remains the only player to score a hat-trick in a World Cup final. His second goal -- the famous 'Wembley Goal' -- bounced off the crossbar and may or may not have crossed the line. Germans are still arguing about it.",
    category: "england",
  },
  {
    id: 35,
    question:
      'What is the "ghost goal" controversy from the 1966 final?',
    options: [
      "A goal was disallowed for offside incorrectly",
      "Hurst's shot hit the bar and bounced on or near the line",
      "A German goal was wrongly chalked off",
      "The ball was handled before the winning goal",
    ],
    correctIndex: 1,
    funFact:
      "To this day, nobody can definitively prove whether Hurst's shot fully crossed the line. Modern analysis using AI suggests it probably didn't. Every English fan: 'It was definitely over.' Every German fan: 'It definitely wasn't.'",
    category: "england",
  },
  {
    id: 36,
    question:
      "How many times has England reached a World Cup semi-final?",
    options: ["2 times", "3 times", "4 times", "5 times"],
    correctIndex: 1,
    funFact:
      "England have reached the semi-finals three times: winning in 1966, losing in 1990 (Gazza's tears), and losing in 2018. The 2018 run under Southgate ended England's 28-year drought of reaching the last four.",
    category: "england",
  },
  {
    id: 37,
    question:
      "Which England player has the most World Cup appearances?",
    options: [
      "David Beckham (13)",
      "Peter Shilton (17)",
      "Wayne Rooney (14)",
      "Bobby Moore (14)",
    ],
    correctIndex: 1,
    funFact:
      "Peter Shilton played 17 World Cup matches for England across three tournaments (1982, 1986, 1990). The legendary goalkeeper won 125 caps in total and played professional football until he was 47 years old.",
    category: "england",
  },
  {
    id: 38,
    question: "What was England's worst defeat at a World Cup?",
    options: [
      "Hungary 6-3 (1954)",
      "Brazil 3-1 (2002)",
      "Germany 4-1 (2010)",
      "USA 1-0 (1950)",
    ],
    correctIndex: 2,
    funFact:
      "Germany hammered England 4-1 in the 2010 round of 16 in South Africa. Frank Lampard also had a perfectly good goal disallowed when the ball clearly crossed the line -- poetic revenge for 1966, said every German.",
    category: "england",
  },
  {
    id: 39,
    question: "Who managed England at their most recent World Cup (2022)?",
    options: [
      "Sam Allardyce",
      "Gareth Southgate",
      "Sven-Goran Eriksson",
      "Harry Redknapp",
    ],
    correctIndex: 1,
    funFact:
      "Gareth Southgate managed England at both 2018 and 2022, reaching the quarter-finals in Qatar. As a player, he missed the crucial penalty in the 1996 Euros semi-final vs Germany -- redemption came via the touchline.",
    category: "england",
  },
  {
    id: 40,
    question:
      "Which English city hosted matches during the 1966 World Cup?",
    options: [
      "Manchester, Liverpool, and Birmingham",
      "London, Manchester, and Sheffield",
      "London, Liverpool, and Leeds",
      "London only",
    ],
    correctIndex: 1,
    funFact:
      "The 1966 tournament used 8 venues across England: Wembley and White City (London), Hillsborough (Sheffield), Old Trafford (Manchester), Goodison Park (Liverpool), Villa Park (Birmingham), Roker Park (Sunderland), and Ayresome Park (Middlesbrough).",
    category: "england",
  },
];
