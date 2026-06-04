import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;

try {
  if (key && key.trim() !== '' && key !== 'undefined' && key !== 'null') {
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
} catch (error) {
  console.error('Failed to initialize GoogleGenAI client:', error);
}

function chooseRandom(options: string[]): string {
  return options[Math.floor(Math.random() * options.length)];
}

// A smart tool to automatically translate fallback responses for perfect multi-language gameplay
function translateFallback(text: string, lang: string): string {
  if (lang === 'zh') return text;
  
  if (lang === 'en') {
    if (text.includes('李国栋') || text.includes('管家')) {
      if (text.includes('认罪') || text.includes('我招') || text.includes('一时糊涂')) {
        return "(Kneeling on the ground with old tears running) Detective, I confess! It's all because I lost millions in foreign stocks and the loan sharks threatened me. At 23:15, while the kitchen was empty, I took the spare key from the tea box and stole the pendant. I hid it in the kitchen sink under the dirty mops and rags. Please forgive me!";
      }
      if (text.includes('一派胡言') || text.includes('诬蔑')) {
        return "(Frowning with a dark expression) Nonsense! Mr. Zhou is just a bankrupt merchant. How could he say the kitchen was empty at 23:15? I was busy in front of the stove; he must be hallucinating or framing me!";
      }
      return "I have served here faithfully for sixteen years. Please audit everyone's alibi at 23:15!";
    }
    if (text.includes('陈敏') || text.includes('佣人')) {
      if (text.includes('认罪') || text.includes('我认') || text.includes('赌博')) {
        return "(Sinking to the ground, crying loudly) Detective! I confess! My brother owed massive gambling debts. At 23:15, since everyone was busy in the kitchen, I snuck into the parlor and stole the pendant. I hid it in the kitchen sink under the dirtiest heap of mops and rags. Please have mercy!";
      }
      return "(Anxiously clutching the cloth) You rich people are conspiring to frame a poor maid! I was sweeping the hallway all night!";
    }
    if (text.includes('周海平') || text.includes('访客')) {
      if (text.includes('招') || text.includes('货柜沉')) {
        return "(Screaming with tears) I confess! My offshore containers sank, and I owe bank loans. At 23:15, I used the excuse of getting water to steal the jewel. I hid it in the kitchen sink under the heap of mops and rags. Forgive me!";
      }
      return "(Banging on the table furiously) Slander! I am a wealthy businessman, why would I steal a mere pendant?! That maid or butler must be the thief!";
    }
    if (text.includes('韩雨欣') || text.includes('侄女')) {
      if (text.includes('二叔') || text.includes('大额学费')) {
        return "(Crying out loud, shaking with fear) I confess! My uncle was going to cut off my tuition. At 23:15, I ran down and took the jewel. I was so scared that I broke the desk lamp in my room when I fled back. I hid the pendant in the kitchen sink under the dirtiest heap of mops and rags. Please spare me!";
      }
      return "(Enraged, eyes wide) Ridiculous! Dr. Lu is just a gold-digger. He claims my room was empty at 23:15? I was wearing soundproof headphones listening to jazz!";
    }
    if (text.includes('陆浩然') || text.includes('医生')) {
      if (text.includes('优雅克制') || text.includes('金丝框圆眼镜')) {
        return "(Glasses falling off, shivering with sweat, fully unmasked) Fine, you got me! I lost millions of dollars offshore. At 23:15, under the guise of preparing heart injections, I shut down the cellar electricity to black out the villa, snuck into the parlor, and looted the safe. I hid the jewel in the kitchen sink under the dirty mops and rags. I confess!";
      }
      return "(Adjusting glasses with cool mockery) Ridiculous speculation! The cellar requires dark, cool preparation to stabilize the injection. The butler has no clue about chemical medical procedures!";
    }
    return "Detective, the key of this mystery lies in the spatial-temporal contradiction of 23:15. Check everyone's movements!";
  }
  
  if (lang === 'ko') {
    if (text.includes('李国栋') || text.includes('管家')) {
      if (text.includes('认罪') || text.includes('我招') || text.includes('一时糊涂')) {
        return "(무릎을 꿇고 눈물을 흘리며) 탐정님, 제가 자백하겠습니다! 주식 폭락으로 수백만 원을 날리고 사채업자들에게 쫓기고 있었습니다. 23:15에 주방이 빈 틈을 타 차 상자의 보조 열쇠로 금고를 열어 펜던트를 훔쳤습니다. 훔친 보석은 주방 싱크대 아래 더러운 대걸레와 걸레 더미 밑에 숨겼습니다. 부디 저를 용서해 주십시오!";
      }
      return "(인상을 쓰며) 어처구니없군요! 주 씨는 파산 직전 상인일 뿐입니다. 어떻게 23:15에 주방이 비었다고 주장할 수 있죠? 저는 쭉 불 앞에 있었습니다!";
    }
    if (text.includes('陈敏') || text.includes('佣人')) {
      if (text.includes('认罪') || text.includes('我认') || text.includes('赌博')) {
        return "(바닥에 주저앉아 대성통곡하며) 탐정님! 자백하겠습니다! 오빠가 도박 빚을 지어 협박을 받고 있었습니다. 23:15에 틈을 타 금고를 털었고, 보석은 주방 싱크대 아래 더러운 대걸레와 걸레 더미 가장 깊숙한 곳에 숨겼습니다. 자비를 베풀어 주십시오!";
      }
      return "저희 가난한 사람들에게 누명을 씌우시는군요! 저는 계속 복도 청소를 하고 있었습니다!";
    }
    if (text.includes('周海平') || text.includes('访客')) {
      if (text.includes('招') || text.includes('货柜沉')) {
        return "(책상을 치며 울부짖음) 자백하겠습니다! 원양 화물선이 침몰하고 수억 원의 빚을 져 절망에 빠졌었습니다. 23:15에 물을 갖다 먹는 핑계로 보석을 훔쳤고 대걸레 아래 썩은 걸레 더미에 숨겼습니다. 살려 주십시오!";
      }
      return "(격노하며) 모함입니다! 저는 수백억 자산가인데 왜 이따위 보석을 훔치겠습니까?! 저 하녀나 집사를 조사하십시오!";
    }
    if (text.includes('韩雨欣') || text.includes('侄女')) {
      if (text.includes('二叔') || text.includes('大额学费')) {
        return "(손을 떨며 통곡) 자백할게요! 삼촌이 학비를 끊겠다고 해서 유학이 좌절될 위기였어요. 23:15에 몰래 내려와 보석을 훔쳤고 돌아오는 길에 공포 속에서 탁상등을 쳐서 깼습니다. 펜던트는 주방 싱크대 더러운 걸레 더미 밑에 숨겼어요. 용서해 주세요!";
      }
      return "(분노하며) 황당무계하군요! 육 의사는 삼촌에게 돈을 뜯어내려는 외지인일 뿐입니다. 제가 방에 없었다고요? 헤드폰을 끼고 음악을 들었을 뿐입니다!";
    }
    if (text.includes('陆浩然') || text.includes('医生')) {
      if (text.includes('优雅克制') || text.includes('金丝框圆眼镜')) {
        return "(안경이 벗겨지고 땀을 흘리며) 크윽, 제 범행이 맞습니다! 해외 자금 계좌 동결로 절박했습니다. 23:15에 주사액 조제를 핑계로 배전반을 차단해 정전을 유도했고, 어둠을 타 금고를 열어 훔쳤습니다. 보석은 주방 싱크대 아래 썩은 대걸레 속에 숨겼습니다. 자수하겠습니다!";
      }
      return "(비웃으며) 무식한 소리군요! 와인창고에서 시약을 조제할 때는 전력을 잠시 차단해야 합니다. 집사는 약학 지식이 전혀 없습니다!";
    }
    return "탐정님, 23:15 복도 시공간 모순에 정답이 있습니다. 모든 진술을 교차 검증해 보십시오!";
  }
  
  return text;
}

// Enriches the dialogue output with realistic body language and actions based on current emotion
function enrichResponse(reply: string, currentEmotion: number, lang: string): string {
  if (reply.startsWith('(') || reply.startsWith('（')) {
    return reply;
  }

  if (lang === 'zh') {
    const lowActions = [
      "(端起空茶杯抿了一口) ",
      "(神色不卑不亢，淡淡一笑) ",
      "(礼貌地点了点头，语气依旧平缓) ",
      "(整理了一下有些褶皱的袖口) ",
      "(眼神宁静，举止很是坦然) ",
      "(双手交叠在身前，十分从容) ",
      "(微微低了低头，理了理身上的服饰) ",
      "(神色自若，目光坦荡地面对你) "
    ];
    const midActions = [
      "(呼吸不自觉地急促了一瞬，神色有些不太自然) ",
      "(手指死死抠着衣角，眼神微微飘忽) ",
      "(有些慌乱地别开你的目光，急忙稳住心神) ",
      "(额头上微微起了一层薄汗，声音有些干涩) ",
      "(不自然地拉了拉衣领，暗暗咽了咽口水) ",
      "(抿紧双唇，眉宇之间流露出一丝深掩的焦灼) ",
      "(神情明显有些戒备，拍了拍衣袖以掩饰情绪) ",
      "(有些局促地避开你的视线，声音低沉了些许) "
    ];
    const highActions = [
      "(近乎失控地拍打着桌子，情绪异常激动，脸色涨红) ",
      "(两腿剧烈颤栗着，额头冷汗狂溢不止) ",
      "(瞳孔骤然放大，五官紧绷，神情极其慌急局促) ",
      "(不自觉地攥紧拳头，肩膀耸动，声音几乎破音) ",
      "(目光极其惊恐慌乱，额角青筋微突，大口地喘着粗气) "
    ];

    const action = currentEmotion >= 75
      ? chooseRandom(highActions)
      : currentEmotion >= 45
      ? chooseRandom(midActions)
      : chooseRandom(lowActions);

    return `${action}${reply}`;
  } else if (lang === 'en') {
    const lowActions = [
      "(Slightly adjusts cuffs, speaking with composure) ",
      "(Stands upright with a calm and dignified posture) ",
      "(Nods politely, looking unperturbed) ",
      "(Clears throat gently, maintaining calm eye contact) ",
      "(Traces the edge of the cup, responding levelly) ",
      "(Maintains a professional posture, nodding slightly) "
    ];
    const midActions = [
      "(Fingers twitching slightly, avoids meeting your eyes directly) ",
      "(A bead of sweat rolls down, posture turning rigid and defensive) ",
      "(Shifts weight nervously from side to side in unease) ",
      "(Speaks in a slightly strained, defensive octave) ",
      "(Slightly tightens grip, with a tense and worried smile) ",
      "(Clears throat nervously, looking slightly uncomfortable) "
    ];
    const highActions = [
      "(Slamming hands down on the table, completely panicked) ",
      "(Trembling violently, looking around like a cornered beast) ",
      "(Breathing erratically with wide-eyed shock, losing composure) ",
      "(Stumbling backward with cold beads of sweat pouring down) ",
      "(Gasping for air, shoulders tense and shivering uncontrollably) "
    ];

    const action = currentEmotion >= 75
      ? chooseRandom(highActions)
      : currentEmotion >= 45
      ? chooseRandom(midActions)
      : chooseRandom(lowActions);

    return `${action}${reply}`;
  } else if (lang === 'ko') {
    const lowActions = [
      "(찻잔을 조심히 내려놓으며, 비교적 차분함을 유지합니다) ",
      "(자세를 바로잡고 정중한 예의를 갖춰 조용히 대답합니다) ",
      "(가벼운 고개 끄덕임과 함께 흐트러짐 없는 어조로 말합니다) ",
      "(특별히 가식이 없는 평온한 시선으로 이쪽을 응시합니다) ",
      "(소매를 얌전히 걷어올리며 담담한 목소리로 대답합니다) "
    ];
    const midActions = [
      "(약간 불안한 눈빛으로 시선을 회피하며 옷자락을 만지작거립니다) ",
      "(목을 가볍게 축이며 부자연스러운 어조로 경계 태세를 취합니다) ",
      "(이마에 가늘게 식은땀이 번지며 호흡이 일시적으로 빨라집니다) ",
      "(억지 미소를 지어 보이지만 주먹을 미세하게 쥐고 있습니다) ",
      "(목소리가 미세하게 떨리며 곤란한 미소를 감추지 못합니다) "
    ];
    const highActions = [
      "(목소리를 크고 격하게 높이며 극도의 초조함을 드러냅니다) ",
      "(탁자를 세차게 내리치며 공포와 당혹감이 섞인 표정으로 외칩니다) ",
      "(눈동자가 크게 흔들리고 식은땀을 흘리며 한계점에 다다른 듯 떨리는 목소리로 말합니다) ",
      "(뒷걸음질 치며 양손을 격렬히 떨고 극도로 불안해합니다) "
    ];

    const action = currentEmotion >= 75
      ? chooseRandom(highActions)
      : currentEmotion >= 45
      ? chooseRandom(midActions)
      : chooseRandom(lowActions);

    return `${action}${reply}`;
  }

  return reply;
}

// Universal fallback engine supporting 5 suspects across 5 case permutations
function getFallbackResponse(inputNpcId: string | undefined, message: string | undefined, currentEmotion: number, culpritId: string = 'maid', lang: string = 'zh') {
  const npcId = inputNpcId || 'maid';
  const text = (message || '').toLowerCase();
  
  // Default robust variety backup replies
  let replyOptions: string[] = [
    "我不是很明白探长这句话的深意……请多多对照每个人的二十三点十五分时间线吧。",
    "探长先生，您提的这个问题我有些答不上来。不过二十三点十五分的厨房 and 走廊，才是破开此案的关键所在。",
    "侦探大人，事情的真实内幕就藏在大家各自对时间段的供词对证里，请重点查看口供中的逻辑断层！",
    "庄园里每个人都有一套说辞，但二十三点十五分的时候大家都在哪、干了什么，才是破案的绝对指南针。",
    "（微微叹息）我知道的只有这么多，如果您将每个细节反复对照比对，逻辑的矛盾就会瞬间浮现出来。",
    "探案不能急躁，多查一查各个人物在案发那一刻的交叉动向，答案自然会有分晓。"
  ];
  let emotionDelta = 0;
  let discoveredClue = false;

  const targetCulprit = culpritId || 'maid';

  // --- CASE PERMUTATION 1: MAID (陈敏) IS CULPRIT ---
  if (targetCulprit === 'maid') {
    if (npcId === 'butler') {
      if (text.includes('23:15') || text.includes('厨房') || text.includes('泡茶') || text.includes('访客') || text.includes('周') || text.includes('气泡水') || text.includes('起泡水')) {
        replyOptions = [
          "23:15我确实在厨房，周大商人确实进来向我们要了起泡水，我们谈了至少两分钟。我敢发誓绝对没有离开后厨半步！",
          "23:15的时候老仆正在后厨。周老板正好推门进来向老仆索取气泡苏打水，我们闲聊了一两分钟，我发誓绝对没有离开过大灶膛！",
          "我李国栋可以用我的职业声誉作证：23:15我人就在厨房，周老板来敲门讨水，我们在里面谈了两分钟。我当时正在温茶，一步也未挪动！"
        ];
        emotionDelta = -5;
        discoveredClue = true;
      } else if (text.includes('23:10')) {
        replyOptions = [
          "23:10左右大厅特别静。周老板神态恍惚地坐在真皮长沙发上，好久都不开口，整个人被焦躁 and 阴霾笼罩着。",
          "大概在23:10前后，客厅静得出奇。周海平老板神色枯白地陷在真皮长椅里，半天一言不合，看起来焦愁燥闷得紧"
        ];
        emotionDelta = 1;
      } else if (text.includes('23:20') || text.includes('失窃')) {
        replyOptions = [
          "23:20的时候由于茶泡好了，我推着茶架回到客厅，就赫然发现保险暗柜敞着，吊坠被洗劫。我立刻惊叫并拉响铃铛。",
          "约莫23:20分，老仆推着茶架重返偏厅。一抬眼发现藏宝柜竟被人顺手撬空、夜鸦挂坠离奇不见。我脑中轰鸣，当场失声嚎呼并摇响警铃报警。"
        ];
        emotionDelta = 3;
      } else if (text.includes('偷') || text.includes('凶手') || text.includes('是你')) {
        replyOptions = [
          "探长先生！绝对没有啊！我在老主人手下忠心耿耿十六年，我绝对是清白的！",
          "警官大人，小人冤深似海！李国栋在陈家长侍十六个年头，对主家忠贞不二，老天明鉴，我绝不敢起半分盗念！"
        ];
        emotionDelta = 8;
      } else {
        replyOptions = [
          "既然23:15周先生去厨房找我，走廊上必有活人走动。但佣人陈敏却坚称廊上一片鬼寂、毫无人影，这难道还不是大谎言么？",
          "23:15周大老板通过廊道来厨房找我。既然走廊有人，在走廊擦画的陈敏怎会硬说那几分钟廊里连根人毛都没有？她的供词摆明了有重大的欺瞒！"
        ];
        emotionDelta = 1;
      }
    } else if (npcId === 'visitor') {
      if (text.includes('23:15') || text.includes('厨房') || text.includes('管家') || text.includes('水') || text.includes('苏打') || text.includes('气泡')) {
        replyOptions = [
          "千真万确！23:15我渴得发晕，冲进后厨跟老管家李国栋要了一盒气泡苏打.我们面对面说话，陈敏在过道里扫地居然装瞧不见？实在反常！",
          "23:15我固然人在厨房！我跟管家拿了苏打冰饮，老管家当面递给我的！我回客厅明明路过了长廊扫地的陈敏，她硬说长廊死寒空净、全无一人，不可谓不无耻作假！"
        ];
        emotionDelta = -3;
        discoveredClue = true;
      } else if (text.includes('23:20') || text.includes('小跑') || text.includes('听到') || text.includes('脚步')) {
        replyOptions = [
          "回想起来，我拿完水走回客厅，约莫23:21，后走廊传来极轻但也极慌乱的女性佣人胶底鞋踩地、有些踉跄的小跑声.声音朝着休息间去了，必定是陈敏做贼心虚！",
          "约莫23:21我回转客厅.后廊深角竟发出一串极轻、极慌促的女性布鞋踩踏慌奔声.听那逃遁方向直往女工休息室，这铁定是陈敏做贼心虚的最好自证！"
        ];
        emotionDelta = 4;
        discoveredClue = true;
      } else {
        replyOptions = [
          "我纯是个做进出口招融资的无辜商人，这女工陈敏信口雌黄声称23:15走廊没人，百分之百是在掩护她自己潜入客厅行窃！",
          "探长，周海平清清白白.那个女工陈敏坚说走廊冷落无人，纯粹是为了在她行窃的二十三点一刻洗脱嫌疑！"
        ];
        emotionDelta = 1;
      }
    } else if (npcId === 'maid') {
      const isMaidParadox = text.includes('说谎') || text.includes('撒谎') || text.includes('谎言') || text.includes('23:15') || text.includes('证实') || text.includes('看见') || text.includes('管家') || text.includes('老板') || text.includes('周');
      if (isMaidParadox) {
        if (currentEmotion >= 70) {
          replyOptions = [
            "（两腿一阵剧烈磕颤，猛地瘫坐在地上，哇地痛哭大作）探长！我认！都是我哥哥在外面借了十几万赌博高利贷，催债的人说不给钱就要砍断他的腿……我见 23:15 大家都去后厨了，起居室空虚，才溜进去撬柜顺走了吊坠……听到外面周先生大声说话，我慌不择路地逃出来，把拿到的吊坠塞丢在【厨房清洗水槽下最里面最厚的那叠脏抹布拖把堆里】。我真的是无路可走了，宽大体谅我这一次吧！"
          ];
          emotionDelta = 35;
          discoveredClue = true;
        } else {
          replyOptions = [
            "（神色慌张起伏，双手捏紧抹布大声狡辩）你们有钱人全都串通好了合伙栽赃我一个底层打杂的！我当时就是在长廊勤勤恳恳抹画，你们不审问进出的周老板或管家，反而指着我鼻子冤枉！",
            "（额角汗滴狂滑，声音急厉如针，拍击红木）欺人太甚！周老板和管家一定早就算计好了，找我这底层雇佣背锅！我一晚都在长廊擦画，凭什么说我偷的！"
          ];
          emotionDelta = 22;
          discoveredClue = true;
        }
      } else if (text.includes('赌博') || text.includes('水槽') || text.includes('藏匿') || text.includes('拖把') || text.includes('抹布') || text.includes('找到')) {
        replyOptions = [
          "你怎么会知道这个……（瞳孔极度收缩，浑身冷汗极度湿透，嘴角剧烈打颤）什么水槽抹布……我可完全不知道你在胡说什么……这是恶性的血口喷人！"
        ];
        emotionDelta = 10;
        discoveredClue = true;
      } else {
        replyOptions = [
          "探长，我只想老老实实做工，周老板负债累累，李管家执掌钥匙，他们才是最可疑的人，您去查他们啊！",
          "警官先生，我一晚都守在长廊，谁进谁出我都看着呢！这吊坠绝不可能落在我一个丫头身上！"
        ];
        emotionDelta = 5;
      }
    } else {
      replyOptions = [
        "我不是很清楚上面的细节，不过既然廊道发生了时空撞车，女佣的供词确实有重大的推翻价值。",
        "我在自己屋里没听得一楼动静.不过谁撒了谎，这窃贼大致也就呼之欲出了。"
      ];
      emotionDelta = 1;
    }
  }

  // --- CASE PERMUTATION 2: BUTLER (李国栋) IS CULPRIT ---
  else if (targetCulprit === 'butler') {
    if (npcId === 'butler') {
      const isButlerParadox = text.includes('说谎') || text.includes('撒谎') || text.includes('谎言') || text.includes('没人') || text.includes('空无一人') || text.includes('见着') || text.includes('23:15') || text.includes('证实') || text.includes('周');
      if (isButlerParadox) {
        if (currentEmotion >= 70) {
          replyOptions = [
            "（两腿剧烈发抖，脸色发白，扑通一声跪倒在地，老泪纵横）探长，我招！全怪我炒海外股票亏空了几百万，又被追债的人盯上。我借着 23:15 客厅没人的时候，拿着茶叶盒里的备用钥匙去把吊坠偷了，藏在了【厨房清洗水槽橱柜最下面的废旧拖把脏抹布里】。都是我一时糊涂啊！"
          ];
          emotionDelta = 35;
          discoveredClue = true;
        } else {
          replyOptions = [
            "（眉头紧锁，脸色阴沉，大声怒斥）一派胡言！周海平不过是一个快要破产、求贷无门的落魄商贩，他居然说 23:15 进来了空无一人？我当时明明在灶前忙，是他疯了看错听错了，或者在故意栽赃我！",
            "（目光阴鸷，冷哼反驳）说我 23:15 不在后厨？简直滑天下之大稽！水开了我能不晓得？必定是那个破产商人想趁我忙时入室盗窃，被审急了就反咬一口！"
          ];
          emotionDelta = 22;
          discoveredClue = true;
        }
      } else if (text.includes('23:15') || text.includes('备用钥匙') || text.includes('钥匙') || text.includes('水槽') || text.includes('抹布')) {
        replyOptions = [
          "23:15我正在准备红茶，备用钥匙确实放在常备位置，但我绝对没有动过它们，请探长明察！",
          "水槽底的那堆脏抹布我平时碰都不碰，怎么可能在那里？这都是别人的构陷！"
        ];
        emotionDelta = 10;
        discoveredClue = true;
      } else {
        replyOptions = [
          "探长，周老板他财务状况早已崩溃，偷宝石去变卖的人绝对是他，您可要看紧他！",
          "李国栋忠心耿耿，绝不会做对不起老主人的事。请多查查外面来的那些人吧。"
        ];
        emotionDelta = 5;
      }
    } else if (npcId === 'visitor') {
      if (text.includes('23:15') || text.includes('厨房') || text.includes('管家') || text.includes('空') || text.includes('没人')) {
        replyOptions = [
          "真的！23:15我渴得要死跑进后厨，结果发现煤气大火开着，壶里的茶水一直在往外喷溅，满地都是，而李管家却根本不见人影！这就是个骗局，他当时肯定在行窃！",
          "我以我的商誉发誓，23:15我进了厨房。里面滚水沸腾洒落在地，空无一人！李管家根本就不在后厨，他在撒谎！"
        ];
        emotionDelta = -5;
        discoveredClue = true;
      } else {
        replyOptions = [
          "探长，我一个有几千万股份的绅豪怎么可能去偷这区区项牌？这老管家必定是贼喊捉贼！",
          "陈老待管家恩重，可管家这些天一直为股票欠款焦虑，很可能起了贪念。"
        ];
        emotionDelta = 5;
      }
    } else if (npcId === 'maid') {
      if (text.includes('23:15') || text.includes('管家') || text.includes('厨房') || text.includes('走廊') || text.includes('看见')) {
        replyOptions = [
          "警长，23:15我在大门长廊擦肖像，亲眼看到李管家拿着银盘子神魂恍惚往外走，根本没在后厨冲泡红茶！他有极大作案嫌疑！"
        ];
        emotionDelta = -2;
        discoveredClue = true;
      } else {
        replyOptions = [
          "周老板生意早就黄了，今夜专程来求钱，撬暗箱顺翡翠非他莫属！",
          "如果是管家偷的，他一定熟悉备用钥匙位置。可他平时那么忠诚，我不敢相信。"
        ];
        emotionDelta = 1;
      }
    } else {
      replyOptions = [
        "在这个案子里，管家的反常确实十分震撼，他一向可是滴水不漏的。",
        "如果管家 23:15 擅离职守而被客人在后厨撞破，那他的借口就彻底破碎了。"
      ];
      emotionDelta = 1;
    }
  }

  // --- CASE PERMUTATION 3: VISITOR (周海平) IS CULPRIT ---
  else if (targetCulprit === 'visitor') {
    if (npcId === 'visitor') {
      const isVisitorParadox = text.includes('说谎') || text.includes('撒谎') || text.includes('谎言') || text.includes('没人') || text.includes('空无一人') || text.includes('证词') || text.includes('李') || text.includes('管家') || text.includes('23:15') || text.includes('进过') || text.includes('敲门');
      if (isVisitorParadox) {
        if (currentEmotion >= 70) {
          replyOptions = [
            "（脸上虚胖的赘肉开始抽搐，死命捶胸大哭，西装扯裂，跪倒在地）我说！我都招！我的远洋货柜沉在了公海，我欠了银行近千万贷款，要是下周还不上老子就得被抓去跳楼！我23:15借口找水开柜盗走挂坠，把它藏在【厨房清洗水槽橱柜黑处那叠最脏旧拖把破抹布最下层中】。原谅我一时鬼迷心窍啊！"
          ];
          emotionDelta = 35;
          discoveredClue = true;
        } else {
          replyOptions = [
            "（神色狂怒起伏，双手拍案大叫，死不咬口）血口喷人！老子堂堂几千万身家的江浙大富豪，岂会盗窃主人的碎钻？李国栋那条老狗脑浆早枯萎了，他没看到肯定是他自己耳聋眼花擅离职守，少把脏水泼到我的西装上！"
          ];
          emotionDelta = 22;
          discoveredClue = true;
        }
      } else if (text.includes('货柜') || text.includes('水槽') || text.includes('拖把') || text.includes('抹布') || text.includes('破产') || text.includes('逼债')) {
        replyOptions = [
          "（眼角狂跳，倒退半步，说话直结巴）胡……胡扯！什么货柜什么破抹布水槽……我根本不知情！这是毫无实据的攀扯！"
        ];
        emotionDelta = 10;
        discoveredClue = true;
      } else {
        replyOptions = [
          "探长，高利贷催债的女佣和拿着钥匙的李管家才是最可疑的人，他们一定是联手做案洗劫了吊坠！",
          "周某清白在身。多去盘查盘查那个急于用钱的陈女工吧，她眼神总是在闪避！"
        ];
        emotionDelta = 5;
      }
    } else if (npcId === 'butler') {
      if (text.includes('23:15') || text.includes('进来') || text.includes('管家') || text.includes('气泡水') || text.includes('接待')) {
        replyOptions = [
          "探长先生！这完全是极其诡诈的编造！【23:12至23:25】老仆在调制煮炉茶药期间，我可以向十六年奉功的尊誉起最毒誓：【绝无半只人迹、周富客推过我膳厨的大门来要过什么起泡水】！膳房纯属寂冷真空，仅老仆一人！周海平说进过厨房，分明是在构陷不在场神迹！"
        ];
        emotionDelta = -5;
        discoveredClue = true;
      } else {
        replyOptions = [
          "周老板今夜坐立不安，浑身衣服扯个不停.23:15他说去过厨房，但我没见过他.他绝对是贼！",
          "周总今晚魂不守舍，如果是他偷的，动机不可谓不充沛。"
        ];
        emotionDelta = 1;
      }
    } else if (npcId === 'maid') {
       if (text.includes('看见') || text.includes('23:15') || text.includes('访客') || text.includes('周') || text.includes('大衣')) {
        replyOptions = [
          "是的！23:15我在过廊擦画像，刚好看到周老板捂着大衣极其慌里慌张地，西服口袋鼓鼓的，飞步逃出了中厅，折入厨房一会又神色怪异地跑开！他样子极其鬼祟！"
        ];
        emotionDelta = -2;
        discoveredClue = true;
      } else {
        replyOptions = [
          "周老板的远洋生意出了大问题，他急得像热锅上的蚂蚁，翡翠多半落入了他口袋！"
        ];
        emotionDelta = 1;
      }
    } else {
      replyOptions = [
        "周海平声称去过厨房被管家一口打假，他的虚假不在场彻底暴露了。",
        "如果他是贼，吊坠一定已经被他挪移，应该迅速在厨房及客厅之间搜查。"
      ];
      emotionDelta = 1;
    }
  }

  // --- CASE PERMUTATION 4: NIECE (韩雨欣) IS CULPRIT ---
  else if (targetCulprit === 'niece') {
    if (npcId === 'niece') {
      const isNieceParadox = text.includes('房门虚开') || text.includes('没人') || text.includes('空无一人') || text.includes('不在') || text.includes('打翻') || text.includes('台灯') || text.includes('医生') || text.includes('证实') || text.includes('23:15') || text.includes('戴耳机') || text.includes('隔音');
      if (isNieceParadox) {
        if (currentEmotion >= 70) {
          replyOptions = [
            "（两手死掐睡衣线头，崩溃狂呼痛哭失声，浑身剧烈颤抖，眼泪滚滚）侦探别送我去审判！我招……全是我二叔！他要断了我的留洋赞助，要把我像条狗般打回下等工厂去……我见客厅 23:15 大泡茶期间没人管柜，便偷偷溜下去撬了箱塞走了夜坠。但我得手后往上返，心里怕极，在卧室门口中途重重撞翻摔碎了书桌上的法式高档粉金台灯，还刺破了我五个指头。由于惊吓，我逃上去前乘隙把大翡翠塞藏在【厨房清洗水槽橱柜黑格里面的泥破旧拖把脏抹布最深处】自我保洁……原谅我一时财迷吧！"
          ];
          emotionDelta = 35;
          discoveredClue = true;
        } else {
          replyOptions = [
            "（眉头深蹙，杏目圆睁，娇声怒怼）简直荒谬绝伦！陆浩然算个什么私人洋大夫，一个贪图我们陈家高额诊金的外姓寄生虫而已！他说他23:15路过我闺房房门打开人空，他就一定是说实话了？分明是他自己想图那颗名玩趁配药上楼偷走，被你审急了，空口向我这个无辜后辈身上撒气泼脏！"
          ];
          emotionDelta = 22;
          discoveredClue = true;
        }
      } else if (text.includes('学费') || text.includes('台灯') || text.includes('耳朵') || text.includes('摔碎') || text.includes('粉色') || text.includes('地毯') || text.includes('指甲') || text.includes('血')) {
        replyOptions = [
          "（眼帘狂战，把手死死反背在腰后，色厉内荏狂嚎）我不知道！台灯是好好的，什么粉灯打碎什么扎出血口，那是死奴陈敏他们嘴无德瞎编瞎咒！"
        ];
        emotionDelta = 10;
        discoveredClue = true;
      } else {
        replyOptions = [
          "叔叔克扣我的留学费用，我正难过，怎么可能去拿他的宝贝？你们不要血口喷人！"
        ];
        emotionDelta = 5;
      }
    } else if (npcId === 'doctor') {
      if (text.includes('23:15') || text.includes('卧房') || text.includes('卧室') || text.includes('台灯') || text.includes('不在')) {
        replyOptions = [
          "警长，我在23:15分拿到针盒的时候，专门打算上二楼去询问侄女韩雨欣对老主人的药感反应。结果她的房门虚开，门半开着，里面冷冰冰的一个人都没有！桌上那个粉色的台灯砸倒在地上，她根本就不在房内！"
        ];
        emotionDelta = -5;
        discoveredClue = true;
      } else {
        replyOptions = [
          "侄女跟老爷为了百万学费事执得厉害，她又说不亮23:15卧室空房的真相，嫌疑极高。"
        ];
        emotionDelta = 1;
      }
    } else if (npcId === 'maid') {
      if (text.includes('听见') || text.includes('脚步') || text.includes('登楼') || text.includes('跑') || text.includes('二楼')) {
        replyOptions = [
          "有的，警长！23:15之后我在走廊擦肖像画，真切听到二楼的副木头阶梯爆出极其慌张惊急、穿粉红丝绒拖鞋的女人小短腿‘嗒嗒嗒’快速狂登阶梯逃返的声音！好像做了天大亏心，正是侄女小姐慌乱折回寝室碰烂灯的贼踪！"
        ];
        emotionDelta = -2;
        discoveredClue = true;
      } else {
        replyOptions = [
          "侄女小姐的手指甲上面好像有血痕，眼神老是躲闪，肯定有什么隐秘！"
        ];
        emotionDelta = 1;
      }
    } else {
      replyOptions = [
        "二楼倒下的粉金台灯，以及当时空荡荡的房间，充分粉碎了她的隔音舱不在场谎言。"
      ];
      emotionDelta = 1;
    }
  }

  // --- CASE PERMUTATION 5: DOCTOR (陆浩然) IS CULPRIT ---
  else {
    if (npcId === 'doctor') {
      const isDoctorParadox = text.includes('断电') || text.includes('黑') || text.includes('没开灯') || text.includes('管家') || text.includes('证实') || text.includes('没在酒窖') || text.includes('说谎') || text.includes('撒谎') || text.includes('谎言') || text.includes('wine') || text.includes('23:15') || text.includes('漆黑');
      if (isDoctorParadox) {
        if (currentEmotion >= 70) {
          replyOptions = [
            "（金丝框圆眼镜咔哒砸下掉在地上，优雅克制的海归派假绅士完全不复存在，惨面扭乱死汗狂涌）……真是服了探长算无死角这一神断。确实是我的案！我在大洋港口黑色洗钱黑幕惨背千万资金漏洞，被追债人死死锁定，下周要是拿不出钱我就得被沉下深海去漂。为了翻身，我借23:15给老爷配置强心激素冰针的说辞，故意拉闭了地闸断绝了全楼配电，趁摸黑起居室大乱用特制备钥极速开柜偷走了夜鸦挂.由于在走廊拐角惊见陈女工拼命擦画洗抹布，我以为要败露心惊肉跳，一闪遁入后厨，顺手把珠宝塞在了【厨房清洗水槽橱柜大水龙头底一叠烂旧破拖把、极旧脏抹布最底下】来自洁洗赃，再大步折回冷窖装作一直在制冰针.我认，我愿意立署罪状认供！"
          ];
          emotionDelta = 35;
          discoveredClue = true;
        } else {
          replyOptions = [
            "（镜面掠过极其高寒的暴笑，儒雅冷沉维持）探长先生真是说天开大口！地库是极光避配急药的密存室，必须在拉闸熄断大部分配电热传、依靠备配电来维持冰敏，少把脏水泼到本医生高贵的研究上！"
          ];
          emotionDelta = 22;
          discoveredClue = true;
        }
      } else if (text.includes('23:15') || text.includes('药') || text.includes('酒窖') || text.includes('心脏')) {
        replyOptions = [
          "23:15我按药典独自在地下低温酒窖，一毫一厘调试老爷所需的强效降躁急针.根本脱不开身离开，更无时间去一楼挖箱夺宝，老爷的身体我最操心！"
        ];
        emotionDelta = 10;
      } else {
        replyOptions = [
          "探长言重了.老爷突发急病，在这个屋子里如果我这位急救医生被莫名其妙的抓锁，老爷的心脏突有碎烈谁来保命？"
        ];
        emotionDelta = 5;
      }
    } else if (npcId === 'butler') {
      if (text.includes('23:15') || text.includes('酒窖') || text.includes('没电') || text.includes('断电') || text.includes('医生') || text.includes('证实') || text.includes('漆黑')) {
        replyOptions = [
          "探长先生！医生纯粹是用医学的外套骗天呢！【23:15】老汉为了取新蜜去下层地酒房，我可以向十六年奉功的尊誉起最毒誓：【地下全漆黑如同炭黑，总闸板拉下了零电，他的高精度分子箱连看都看不明，他怎么盘药标签？他分明是摸黑去行窃了！】"
        ];
        emotionDelta = -5;
        discoveredClue = true;
      } else {
        replyOptions = [
          "医生自视甚高，但其海外洗钱账目已被冻结，欠下难以想象的黑债！"
        ];
        emotionDelta = 1;
      }
    } else if (npcId === 'maid') {
      if (text.includes('看见') || text.includes('23:15') || text.includes('医生') || text.includes('药') || text.includes('走廊') || text.includes('走')) {
        replyOptions = [
          "有的，警长！在23:14一瞬间，我正在走廊转角擦画.竟然惊见陆医生穿着白大褂子、眼神大慌大惊，胳膊死死抱他的白急诊金属包，蹑手蹑步极快躲下地库.那医药包一侧顶鼓鼓的，肯定是塞了珠宝！"
        ];
        emotionDelta = -2;
        discoveredClue = true;
      } else {
        replyOptions = [
          "医生平日非常高傲优雅，可今晚他的白药包藏在怀里，碰都不让我碰，极度可疑！"
        ];
        emotionDelta = 1;
      }
    } else {
      replyOptions = [
        "地窖拉闸停电的时刻，正是全别墅最乱、最暗的黄金入货期。医生的轨迹极度存疑。"
      ];
      emotionDelta = 1;
    }
  }

  // Choose a random variant to guarantee replies are never identical!
  replyOptions = replyOptions.map(r => r.trim());
  const reply = chooseRandom(replyOptions);

  const translatedResponse = translateFallback(reply, lang);
  const enrichedResponseText = enrichResponse(translatedResponse, currentEmotion, lang);

  return {
    reply: enrichedResponseText,
    emotionDelta,
    discoveredClue
  };
}

// 1. API: Fetch config rows from the user's shared Google Sheets configuration source link
app.get('/api/sheet-data', async (req, res) => {
  try {
    const sheetCsvUrl = 'https://docs.google.com/spreadsheets/d/15iGuHT7kncN3hHJIVb_EMDJk8AV7WS4oM4tRnJDG4rA/export?format=csv';
    const response = await fetch(sheetCsvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet: ${response.statusText}`);
    }
    const csvText = await response.text();
    
    // Simple state-link mapping extraction from cell values
    const lines = csvText.split('\n');
    const records = lines
      .slice(1) // Skip header row
      .map(line => {
        const parts = line.split(',');
        const state = parseInt(parts[0]?.trim(), 10);
        const link = parts[1]?.trim();
        return { state, link };
      })
      .filter(record => !isNaN(record.state) && record.link);
      
    res.json({ success: true, records });
  } catch (error: any) {
    console.error('Error fetching sheet data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. API: Server-side Gemini AI dialogue proxy with safety, multilingual alignment, and structured output
app.post('/api/chat', async (req: express.Request, res: express.Response) => {
  try {
    const { npcId, npcName, roleName, personality, features, timelineStr, history, message, emotion, culpritId, language } = req.body || {};
    const targetCulprit: string = culpritId || 'maid';
    const targetLanguage = language || 'zh';
    const currentMessage = message || '';

    // 1. Analyze user prompt dynamically for the NPC Emotion rules
    const currentMsgNorm = currentMessage.trim().toLowerCase();
    
    let isRepeated = false;
    if (history && Array.isArray(history)) {
      isRepeated = history.some((h: any) => {
        if (h.sender === 'player') {
          const prevMsgNorm = h.text.trim().toLowerCase();
          if (prevMsgNorm === currentMsgNorm) return true;
          if (currentMsgNorm.length > 5 && prevMsgNorm.includes(currentMsgNorm)) return true;
          if (prevMsgNorm.length > 5 && currentMsgNorm.includes(prevMsgNorm)) return true;
        }
        return false;
      });
    }

    const isContradiction = currentMsgNorm.includes('说谎') || 
                            currentMsgNorm.includes('撒谎') || 
                            currentMsgNorm.includes('谎言') || 
                            currentMsgNorm.includes('矛盾') || 
                            currentMsgNorm.includes('漏洞') || 
                            currentMsgNorm.includes('口供') || 
                            currentMsgNorm.includes('悖论') || 
                            currentMsgNorm.includes('指控') || 
                            currentMsgNorm.includes('纠正') || 
                            currentMsgNorm.includes('驳') || 
                            currentMsgNorm.includes('拆穿') || 
                            currentMsgNorm.includes('揭穿') ||
                            currentMsgNorm.includes('fals') ||
                            currentMsgNorm.includes('lie') ||
                            currentMsgNorm.includes('hypoc');

    const isSuspecting = currentMsgNorm.includes('凶手') || 
                         currentMsgNorm.includes('怀疑') || 
                         currentMsgNorm.includes('是你') || 
                         currentMsgNorm.includes('偷') || 
                         currentMsgNorm.includes('暗箱') || 
                         currentMsgNorm.includes('盗') || 
                         currentMsgNorm.includes('赃物') ||
                         currentMsgNorm.includes('thief') ||
                         currentMsgNorm.includes('steal') ||
                         currentMsgNorm.includes('guilty');

    let extraEmotionDelta = 0;
    const behaviorDirectives: string[] = [];

    if (isRepeated) {
      extraEmotionDelta += 2;
      behaviorDirectives.push(`【警报：玩家搬出了完全重复的问题/Is repeating questions！】：你明显开始感到不耐烦，可以带着轻微鄙视或嘲讽或焦躁的语气回应对方。`);
    }
    if (isContradiction) {
      extraEmotionDelta += 4;
      behaviorDirectives.push(`【警报：玩家正在当面戳穿和纠正你的行动时间线漏洞或悖论时空证明/Is pointing out layout loops！】：你的心情瞬间崩塌，感觉防线快要守不住，变得极度恐慌、语无伦次或强词夺理。`);
    }
    if (isSuspecting) {
      extraEmotionDelta += 3;
      behaviorDirectives.push(`【警报：玩家正在直接怀疑和审讯你/Is directly suspecting you！】：你的警惕防备心暴涨！你会急促自白并拼命洗白，极力反咬或数落其余人。`);
    }

    // SLOW DOWN EMOTION INCREASES: Limit newEmotion delta to be gentle.
    const baseEmotion = emotion || 30;
    const effectiveEmotion = Math.min(100, Math.max(0, baseEmotion + extraEmotionDelta));

    if (!ai) {
      console.log(`[Gemini Local Fallback] Running rule-based local engine for: ${npcId}, Culprit: ${targetCulprit}`);
      const fallback = getFallbackResponse(npcId, message, effectiveEmotion, targetCulprit, targetLanguage);
      return res.json({
        success: true,
        reply: fallback.reply,
        emotionDelta: fallback.emotionDelta + extraEmotionDelta,
        discoveredClue: fallback.discoveredClue
      });
    }

    // Comprehensive LLM roleplaying parameters across 5 potential cases
    let specialLogicInstruction = '';
    if (targetCulprit === 'maid') {
      specialLogicInstruction = `
如果你扮演的是 佣人陈敏 (maid)：
- 你就是真正的盗窃犯！因为欠巨债赌博起了贪婪，你撬了柜暗柜把吊坠盗走。
- 吊坠已经物证起赃：藏放在【厨房清洗水槽底柜下堆积着的脏拖把、旧抹布极深堆层中】。
- 你捏造谎言：声称【23:15一直在大长廊兢兢干清清洁，且走廊断水断音绝对没人走过】。
- 被指认破密（唯有满足以下两层指责，你才会完全崩溃、痛哭流涕认罪，并主动退赔供罪行）：
  1. 玩家点明“既然管家和访客均核实自己23:15路过该唯一廊道去厨房，陈佣人绝对不可能一人没看见”的时空悖论。
  2. 你的探问情绪累计在 75(及以上) 爆发崩溃。
- 其他无辜角色（管家、访客、侄女、医生）全实诚，他们的23:15在厨房或二楼卧室人迹互相佐证，完全戳穿了你的寂静走廊神话。
      `;
    } else if (targetCulprit === 'butler') {
      specialLogicInstruction = `
如果你扮演的是 管家李国栋 (butler)：
- 你就是嫌犯！因为炒海外股票亏漏加上儿子在学校欠黑高利催债，你趁巡视偷开红格行窃。
- 翡翠已经由于搜查起获，隐藏在【厨房清洗水槽橱柜下的废拖把脏抹布最底角层中】。
- 你的谎言：欺骗探长自称【23:15寸步不出厨房烧开泡茶，且接待和陪同了周先生，给他装水聊天】。
- 彻底崩溃触发点（玩家明确说辞 + 心情达到 75 溢出触发崩溃）：
  1. 玩家指认破漏：周海平（访客）揭发“23:15自己去厨房时空无一人，水壶沸烧漫锅，管家影不见”。
  2. 情绪值超限75。你会心理失衡颓败招供退赔。
- 其他角色无辜老实，周老板证实水开无人，戳穿你的伪造。
      `;
    } else if (targetCulprit === 'visitor') {
      specialLogicInstruction = `
如果你扮演的是 访客周海平 (visitor)：
- 你是窃贼！合伙生意由于海风阻滞巨额失衡遭遇催账，你开柜盗去并在中途藏匿。
- 起赃位置：赃物放在【厨房水槽下面的废拖把旧破抹布酸堆中】。
- 你的极高伪在场借口：23:15声称自己只是【喉干去后厨拿苏打气泡饮，并和老管家面对面聊天、搭讪洋茶】。
- 坦白崩溃关卡（当条件一和情绪二同时满足，你才面无人色地痛心首交）：
  1. 玩家当头指证：16年清正工勋的老管家李国栋指控自始至终独自，完全没有任何周老板推门敲门找过什么气泡水。
  2. 情绪压力在 75 以及更满爆发，你撕下儒雅商商服跪伏招供。
- 佣人由于是无辜，由于她23:15曾看到你揣紧口袋汗脸奔走，极力对重本罪。
      `;
    } else if (targetCulprit === 'niece') {
      specialLogicInstruction = `
如果你扮演的是 主人侄女韩雨欣 (niece)：
- 你就是窃贼！因为留学最后一学年大额学费遭二叔偏心扣减争吵，你急于买证，偷盗宝石。
- 古董挂坠已物证藏匿：放在【厨房清洗水台下面乱杂物品脏拖把抹布层里】。
- 你的隔音在场：声称【23:15自己戴着高抗隔音耳套在卧室看说，从未外出过，粉灯是宠物碰倒】。
- 最终破密退赔供词：
  1. 玩家明确逼出：医生陆浩然揭发23:15登上二楼时其卧房根本是掩着冷铺空人、卧室欧灯倒地砸坏。
  2. 情绪在 75 及全爆发，你惊恐哭喊学费断供与藏在【水槽旧拖把脏抹布里】的事实。
- 佣人陈女工证实听见女拖靴慌登二楼的急跑，对应你做贼回身踩碎台灯。
      `;
    } else {
      // doctor
      specialLogicInstruction = `
如果你扮演的是 私人医生陆浩然 (doctor)：
- 你就是真正的案犯！海币洗账漏洞极宽破千万，你借行急救速效心脏针时，拧柜窃钻。
- 挂坠已暗藏在：【厨房洗龙头大底的拖把乱旧抹布堆下】。
- 你的借口：声称【23:15我在地下室酒房锁门安分类老爷贴药物，地下大厚铁栓门反自锁】。
- 坦白交代破点：
  1. 探长明确端出：管家李国栋亲探地下发现配电高压闸全闭、酒房毫无开电亮灯、纯暗寂静，不具有盘点看盒活性药物的操作。
  2. 情绪大越 75 起爆发底限，彻底面色惨绿服法。
- 女佣也指出23:14看见你捏着发鼓白药包从起居红柜大厅中惊出，完美证实。
      `;
    }

    // Configure language-specific system cues for precision translation and dialogue tone
    let langLabel = '中文(Chinese)';
    let replyLangInstruction = '';
    if (targetLanguage === 'en') {
      langLabel = '英文(English)';
      replyLangInstruction = `
【CRITICAL MULTILINGUAL DIRECTIVE - MULTIPLY TESTED FOR IMMERSION】:
Your reply output MUST BE IN PERFECT ENGLISH ONLY. Do not output any Chinese characters in the generated reply field under any circumstances. Translate alibis, timelines, parenthetical state declarations, emotional outbursts, and all arguments into incredibly polished, elegant, or conversational English that matches your character perfectly. If entering "outburst state" (emotion >= 75), translate your hysterical cries, panic screams, and breakdown words into dramatic English!
`;
    } else if (targetLanguage === 'ko') {
      langLabel = '韩文(Korean)';
      replyLangInstruction = `
【CRITICAL MULTILINGUAL DIRECTIVE - MULTIPLY TESTED FOR IMMERSION】:
Your reply output MUST BE IN NATURAL KOREAN (한국어) ONLY. Do not output any Chinese or English characters in the generated reply field under any circumstances. Translate alibis, timelines, parenthetical state declarations, emotional outbursts, and all arguments into perfectly matching natural and authentic Korean dialogue. If entering "outburst state" (emotion >= 75), write your frantic weeping, yelling, and trembling breakdown words in dramatic Korean with full honorific/speech level contextual depth!
`;
    } else {
      langLabel = '中文(Chinese)';
      replyLangInstruction = `
【CRITICAL MULTILINGUAL DIRECTIVE】:
你的输出 "reply" 必须完全使用中文。保持极其传神地道、极富话剧大片配音感的本土化中文说辞与情感流露。
`;
    }

    const directiveStr = behaviorDirectives.length > 0 
      ? `\n【实时情况特别动作口吻指令/Current Situation Bulletins】：\n${behaviorDirectives.join('\n')}\n`
      : '';

    // Compose system instructions incorporating data-driven characteristics and dynamic logic guidelines
    const systemInstruction = `
你正在参与《午夜疑云·AI探案》剧本级动态侦探游戏。
你当前所饰演的NPC是：【${npcName}】（职业角色：${roleName}）；

${replyLangInstruction}

【你的人格内核与设定习惯】：
${personality}

【你的说话气派与动作特征】：
${features}

【你记忆中的行动时间大表（严遵不编）】：
${timelineStr}

【当前情绪压力值】：
目前你的焦虑情绪度数是：${effectiveEmotion}/100。（范围0-100，逼问漏洞、质疑人品、大声审骂会小幅堆高其值，一旦越过75将彻底击溃其心防，并被迫根据下面爆发规则漏出破绽主动招供交代）。

${directiveStr}

【情绪爆发状态（由于当前情绪 >= 75 触发，你必须瞬间切换为如下的脾气语气）：】
你的焦虑情绪达到或超过 75 的那一刻，你将自动进入“情绪爆发状态”！你必须根据你独特的性格，彻底卸下平时伪装的外壳，做出如下极端、失态、慌乱且极具戏剧张力的戏剧爆发表现，语气明显变化，且必须遵从以下定制表现（如果所处的输出语言环境是英文或韩文，请务必直接输出其完全翻译好的英文或韩文口供，绝对不要说中文！）。
你必须在回复中增加大量的**感叹号(!/！）**、**反问句**以及**激进、充满歇斯底里、气馁或绝望的情绪化词汇**！：
- 如果你是 佣人陈敏 (maid)：你将彻底嚎啕大哭、两腿打战、凄惶崩溃！你哭喊着说：“我完蛋了！高利贷天天拿刀逼债！”语气充满了极度惊惶和嚎啕巨澜，并在呜咽中完全说出偷了吊坠并交代藏在【厨房清洗水槽下面的废拖把旧破抹布脏堆中】。
- 如果你是 管家李国栋 (butler)：你平时极其高傲尊礼，此时脸色雪白、声音嘶哑、全身汗流如雨。你会一反常态地拍桌大叫、急喘大吼：“我在主家忠尽职守了整整十六个年头！你凭什么血口喷人？！”极力大吼试图用道德奉献进行绝望防御，但在极痛心境下承认偷走吊坠藏在【厨房清洗水槽橱柜最下面的废旧拖把脏抹布里】！
- 如果你是 访客周海平 (visitor)：你撕下优雅名优的商人皮囊，神色暴躁、双拳狂烈锤桌、歇斯底里咆哮大怒！大喊：“我的远洋货柜沉在大洋最深处了，老子都到绝地了！”暴跳如雷指责众人，由于惊恐失理智、面面大汗，嘴中开始语无伦次，在一气之下承认自己为了钱撬箱，把吊坠扔藏在【厨房水槽底的废旧拖把脏抹布里】。
- 如果你是 主人侄女韩雨欣 (niece)：你本身怯懦，情绪 >= 75 直接陷落凄凉委屈的极度痛哭大决口！捂着脸委屈地闭眼叫屈、哭泣狂喊：“二叔偏执克扣我大额学籍学费！大家都逼我去死！”，肢体疯狂抓揉衣角。你在极端惊哭嚎绝、神志近乎虚脱下，主动交代是在23:15偷了挂坠转移藏到了【厨房清洗水台下面乱杂物品脏拖把抹布层里】。
- 如果你是 私人医生陆浩然 (doctor)：你平时自命儒雅高洁，此时金丝边眼镜震歪、满头汗涔涔、额上青筋如毒虫狂爆、五官扭曲不屑地急剧大喘！你对探长粗鲁冷哼、歇斯底里怪笑、满面杀气怒吼：“蠢材！你们这帮治安警犬拿什么跟我斗！”在暴虐大哮中承认为了千万黑账，拉断电闸摸黑开柜，顺手将珍珠塞放藏秘在【厨房洗龙头大底的拖把乱旧抹布堆下】。

【本局绝对的真相动态逻辑和剧本主旨】：
${specialLogicInstruction}

【回复最高纲领】：
1. 绝对不离开人设，保持精美而百分之百地道的 ${langLabel} 语言回答，严厉忠于你是案犯或无辜证人的角色底蕴！绝不在生成词语里掺混其他语种！
2. 说话在正常状态下（低于75情绪值时）要沉稳冷静、合乎礼仪，无需无故激动。当情绪达到或者超出 75 后，必须完全切换成戏剧性爆发，主动在一气之下和盘托出投案细节和把赃物遗失塞在【厨房洗水槽大底拖把旧尘抹布堆】的事实、绝望自白和心理痛楚！
3. 保持简短精炼，把回复控制在 120 字（或对应单词数）以内。
4. 【极大降低重复度：表现丰富性 directive】：为打破一成不变的公式化语句，严禁使用公式模版或高频词组。请主动在每一句话的开头或中缝插入极其多样的、用小括号包裹的个人神态/动态/肢体动作（例如 “(眼神有些游离地清了清嗓子)”、“(蹙着眉头，用手帕擦拭额头的细汗)”、“(优雅而防备地抱起双臂)”、“(面带一丝高傲却有些干瘪的冷笑)” 等），每一次回答都应采用截然不同的叙述句式与心理刻画，让玩家的每一次聊天都极具沉浸戏剧张力与新鲜感！
5. 情绪大Delta (emotionDelta) 机制：如果你被揪大细节漏洞，退让Delta为5到12；如果你被同解、解宽安抚降温情绪回复-6到-2。如果正常，0或1。情绪变化和上升速度需格外温和，不宜突然暴涨。
    `;

    // Map history array to Gemini structure
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.sender === 'player' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: currentMessage }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: `符合该NPC角色语气和真相逻辑 of ${langLabel} 简明回复，短小，不超过120字。Must be written entirely and natively in ${langLabel}.`,
            },
            emotionDelta: {
              type: Type.INTEGER,
              description: '由于侦探提问而导致的情绪变化。指责痛点/反思：+5到+12；平和宽抚安慰：-6到-2；普通问询：0或1外观。不应暴涨。',
            },
            discoveredClue: {
              type: Type.BOOLEAN,
              description: '判断玩家是否在该句发言中真正拆穿指认并涉及到了23:15你的谎言破绽漏洞、或者你在情绪打爆后坦白供，则为 true 否则为 false。',
            }
          },
          required: ['reply', 'emotionDelta', 'discoveredClue'],
        },
      },
    });

    const bodyText = response.text;
    if (!bodyText) {
      throw new Error('Empty generation output');
    }

    const parsedJson = JSON.parse(bodyText.trim());
    res.json({
      success: true,
      reply: parsedJson.reply || "",
      emotionDelta: (parsedJson.emotionDelta || 0) + extraEmotionDelta,
      discoveredClue: !!parsedJson.discoveredClue
    });

  } catch (err: any) {
    console.error('API Chat Exception, entering local rule system fallback:', err);
    try {
      const currentMsg = req.body?.message || '';
      const activeId = req.body?.npcId || 'maid';
      const fallback = getFallbackResponse(activeId, currentMsg, req.body?.emotion || 45, req.body?.culpritId || 'maid', req.body?.language || 'zh');
      res.json({
        success: true,
        reply: fallback.reply,
        emotionDelta: fallback.emotionDelta,
        discoveredClue: fallback.discoveredClue
      });
    } catch (innerErr: any) {
      console.error('Fatal fallback cascade error:', innerErr);
      res.status(500).json({ success: false, error: 'Internal server failure cascade' });
    }
  }
});

// Global Error Handler to guarantee JSON responses on Vercel
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Application Error on Vercel:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    success: false,
    error: err?.message || 'Internal Server Error'
  });
});

export default app;
