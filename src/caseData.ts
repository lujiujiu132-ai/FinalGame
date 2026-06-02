import { NpcStructure, NpcId } from './types';

// Extracting clean IDs from Google Drive URLs for direct rendering via Googleusercontent
export const DRIVE_IMAGES = {
  bgStart: 'https://lh3.googleusercontent.com/d/1ODHDFE_Q48dfcmX8AZeyXMZfp7sTdypi',
  bgLivingRoom: 'https://lh3.googleusercontent.com/d/1TJ56K4rtrTQJbBPrmGEBPOM-sF5iRiAN',
  bgCorridor: 'https://lh3.googleusercontent.com/d/1BMKuSOTsyILgSXkqYFsoABSF6cuKwKAa',
  bgKitchen: 'https://lh3.googleusercontent.com/d/1V4wswRCmgL0NGSOibs6MRNWvJNS4kIXh',
  bgBedroom: 'https://lh3.googleusercontent.com/d/13ql1fE_Uk_I8q15PCdHp-wewjtVDkUQY',
  bgWineCellar: 'https://lh3.googleusercontent.com/d/1nK3Dg7nw3xYckmbBIND4n6AKMsJNXYsn',
  npcButler: 'https://lh3.googleusercontent.com/d/10Lou0WEuLTIKbaB3EIBxM3DpDXk6gnT6',
  npcMaid: 'https://lh3.googleusercontent.com/d/12maqPsbjz_l24wU6zbYBaXIiUZAftF9R',
  npcVisitor: 'https://lh3.googleusercontent.com/d/1qiDZFHIwTKgobCOd9UifRwLR4qdOXgE2',
  npcNiece: 'https://lh3.googleusercontent.com/d/1_oXu4Wz__IUkW6HK-UovTZJ7HrtLVDUR',
  npcDoctor: 'https://lh3.googleusercontent.com/d/1Y6jKwuZJ-aQkzBxI71e1_7uClOYFDgKH',
  outburstButler: 'https://lh3.googleusercontent.com/d/1mTQ2zSgoOptJPBkxXd7Ggv3IWhBEPQ-U',
  outburstMaid: 'https://lh3.googleusercontent.com/d/1gBk2ajyFqT3uJ6G0WHhdjGhHWKoQswDj',
  outburstVisitor: 'https://lh3.googleusercontent.com/d/1Ik0pxxNdL1zx1o9csD6QDGQHbN3J84Bt',
  outburstNiece: 'https://lh3.googleusercontent.com/d/1tRKwagKVAyG3tT34xHyWBpZp4yB2orN-',
  outburstDoctor: 'https://lh3.googleusercontent.com/d/1Exl6czLlhqC0-b7B5Ux-qwKVFC-r0cax',
  playerDetective: 'https://lh3.googleusercontent.com/d/112gM_e7Ts4Z6PX2tITHF4_9tlWRvu7j6',
  playerConfident: 'https://lh3.googleusercontent.com/d/1JurqzEzk_wxwHDwIa7r2_GlNy6e8jbtK',
  pendant: 'https://lh3.googleusercontent.com/d/1sNh9Jq9qcvrKV66VO55tIPLBaUiSs9KJ',
};

export const SCENES = {
  'living-room': {
    id: 'living-room' as const,
    name: '客厅',
    bg: DRIVE_IMAGES.bgLivingRoom,
    description: '富丽堂皇的古董客厅，壁炉静静燃烧，留有威士忌酒气。一旁的红木储物格中放着存放古董吊坠“夜鸦之眼”的暗锁保险柜，此刻盖门大开，内部饰底空空如也，显然曾被熟练暴力或者钥匙撬动开启。',
    npcs: ['butler', 'visitor'] as const,
  },
  'corridor': {
    id: 'corridor' as const,
    name: '走廊',
    bg: DRIVE_IMAGES.bgCorridor,
    description: '狭长压抑的公用走廊，欧式黄灯极其昏暗，具有强烈的悬疑压制感。墙壁上挂着多幅庄严傲慢的历代先人油画。此处是连接一楼客厅、厨房以及通往楼上二楼的唯一中枢通道。',
    npcs: ['maid'] as const,
  },
  'kitchen': {
    id: 'kitchen' as const,
    name: '厨房',
    bg: DRIVE_IMAGES.bgKitchen,
    description: '典型的欧式长台厨房，空气有些紧绷和凌乱，大水盆水嘴仍微微滴答滴水。水龙头下方是深度积满历史污血和破旧脏抹布拖把的封闭清洗洗物底橱，散发着一股洗涤剂的酸气。',
    npcs: [] as const,
  },
  'bedroom': {
    id: 'bedroom' as const,
    name: '二楼卧室',
    bg: DRIVE_IMAGES.bgBedroom,
    description: '高位豪华的主人侄女韩小姐卧室。屋中凌乱不堪，高档粉红帘纱低卷，桌子上一盏金质奢华台灯不知由于何种外力被打翻在一盘香薰之上，空气里溢流着少女慌乱惊吓的压制情绪。',
    npcs: ['niece'] as const,
  },
  'wine-cellar': {
    id: 'wine-cellar' as const,
    name: '地下酒窖',
    bg: DRIVE_IMAGES.bgWineCellar,
    description: '别墅最隐蔽潮湿的原生酒窖，立有一架子排布整齐的葡萄酒。暗灰色水泥地面极滑，两边常备主人的私人医疗药水。这里处于地下深层，大木门封闭紧密，声音传不过去，充满秘密感。',
    npcs: ['doctor'] as const,
  }
};

export const NPC_DATA_LIST: NpcStructure[] = [
  {
    id: 'butler',
    name: '李国栋',
    roleName: '管家',
    avatar: DRIVE_IMAGES.npcButler,
    outburstAvatar: DRIVE_IMAGES.outburstButler,
    personality: '理性、冷静、严谨、逻辑感精确极强。说一不二，绝不说谎。他作为在这里奉献了十六年的主人老心腹，维护秩序。但如果是他作为案犯，他会掩护关于“水壶空烧、空无一人”的破绽。',
    features: '做事一板一眼，对时间回忆极其有说服力和礼教规范。',
    initialEmotion: 20,
    timeline: [
      {
        time: '23:10',
        location: '客厅',
        action: '正在一楼大客厅进行常规锁具及贵重摆件的夜间巡视，当时看到来访客周海平独自坐在沙发里喝酒。随后我前去配茶水。',
        isLying: false
      },
      {
        time: '23:15',
        location: '厨房',
        action: '留在隔壁厨房里调制主人的洋甘菊宁神茶。这时候我正在忙于烧水并在膳架上称量茶叶。在此期间，我确信一直在厨房独自作业。',
        isLying: false
      },
      {
        time: '23:20',
        location: '客厅',
        action: '茶水冲好，我整理好托盘茶钟端茶返回大客厅上楼。一回到客厅，就赫然发现保险箱盖敞露，绿宝石吊坠不翼而飞。我大惊之下拉响了电铃。',
        isLying: false
      }
    ],
    truthTimeline: [
      { time: '23:10', location: '客厅', action: '在客厅巡查，看见访客等候，随后前往厨间烧茶。', isLying: false },
      { time: '23:15', location: '厨房', action: '如果无罪，他在厨房烧水准备配茶，看到访客或听到其推门。若他是真凶，他就在此时下投钥匙打开客厅锁箱行窃，并将吊坠转移至水槽下。', isLying: true },
      { time: '23:20', location: '客厅', action: '端起杯子宣读被盗。', isLying: false }
    ]
  },
  {
    id: 'maid',
    name: '陈敏',
    roleName: '佣人',
    avatar: DRIVE_IMAGES.npcMaid,
    outburstAvatar: DRIVE_IMAGES.outburstMaid,
    personality: '情绪型，急躁、脾气冲，防御心态浓。深受沉重高利贷缠身催逼，如果她是凶手，为了掩盖在客厅的行窃轨迹，她会声称23:15在“寂静没有一个乘客”的长走廊擦擦洗洗，形成大漏洞。',
    features: '情绪起伏很大，一旦指控针对到她的家庭债务与轨迹失实，便手无足措，极易嚎啕。',
    initialEmotion: 45,
    timeline: [
      {
        time: '23:10',
        location: '1F走廊中枢',
        action: '我领到工单提着抹布在走廊长梯子边擦洗墙上那一架架肖像画。我一直都是一个人做的擦洗清洁工。',
        isLying: false
      },
      {
        time: '23:15',
        location: '1F走廊中枢',
        action: '我仍然在别墅长走廊做抹布擦拭清洁。我发誓！那一刻整扇长廊安静得如同墓地！不仅没有任何人影，甚至连脚步影子都影子俱无！绝对没人！',
        isLying: true
      },
      {
        time: '23:20',
        location: '1F后厨长台',
        action: '完成了水桶清扫后，我提拖把返回去一头的杂役更衣更服室。一歇脚就突然听到管家在拉铃嚎叫，我吓得魂不附体。',
        isLying: false
      }
    ],
    truthTimeline: [
      { time: '23:10', location: '1F走廊中枢', action: '抱着清洁工具守在走廊，寻找行窃切口。', isLying: false },
      { time: '23:15', location: '古董大客厅', action: '钻入客厅撬箱盗走真品，紧急藏在厨房大水槽污水管底的旧软抹布脏拖把底层。', isLying: true },
      { time: '23:20', location: '1F后厨长台', action: '惊恐退往后方工舍偏房躲藏，听闻巨响身体一颤。', isLying: false }
    ]
  },
  {
    id: 'visitor',
    name: '周海平',
    roleName: '访客',
    avatar: DRIVE_IMAGES.npcVisitor,
    outburstAvatar: DRIVE_IMAGES.outburstVisitor,
    personality: '回避型，自私、傲慢而敷衍。来此是为了拉关系找主人拿商业贷款。他经常不耐烦地催促 and 转移话题，讨厌招惹警方。如果是他作案，他会虚构在23:15“找管家融洽喝气泡水”的完美假在场。',
    features: '言谈充满商务敷衍自傲。但他的无辜话语是重要的，能直接戳穿撒谎者。',
    initialEmotion: 30,
    timeline: [
      {
        time: '23:10',
        location: '古董大客厅',
        action: '在客厅大沙发上一口口喝主人预备给我的冰镇苏格兰威士忌洋酒。当时房间十分沉静，我有点困了。',
        isLying: false
      },
      {
        time: '23:15',
        location: '1F走廊中枢',
        action: '我觉得喉咙极干发粘，走出客厅到厨房找李管家拿瓶气泡冰镇饮。在厨房我跟管家打招呼并且调侃他，随后直接转头回去走廊了。没瞧见别人。',
        isLying: true
      },
      {
        time: '23:20',
        location: '古董大客厅',
        action: '我拿饮料回沙发上静思坐。突然在23:21的时候，我清晰感到隔扇走廊地板‘咚咚咚’重踏发出一串慌不择路的极仓惶小跑步声向内退去。',
        isLying: false
      }
    ],
    truthTimeline: [
      { time: '23:10', location: '古董大客厅', action: '在大皮沙发无聊小憩、豪饮威士忌。', isLying: false },
      { time: '23:15', location: '1F后厨长台', action: '下手盗取配挂首饰，塞入厨房水槽下的脏拖把污堆，编造找茶借口。', isLying: true },
      { time: '23:20', location: '古董大客厅', action: '回客厅，听到女性或某嫌疑犯向楼上大跨逃散急跑的异样声音。', isLying: false }
    ]
  },
  {
    id: 'niece',
    name: '韩雨欣',
    roleName: '主人侄女',
    avatar: DRIVE_IMAGES.npcNiece,
    outburstAvatar: DRIVE_IMAGES.outburstNiece,
    personality: '胆小、敏感，由于学费和二叔决裂的问题陷入重度紧张。如果她是真凶，利用降噪耳机作为遮羞布。一旦发现卧室在关键时间被人（私人医生）撞破空无一人、台灯砸碎，情绪会呈海啸般决口。',
    features: '手指一直止不住发颤，神情躲闪，容易受情绪压迫和惊吓。',
    initialEmotion: 35,
    timeline: [
      {
        time: '23:10',
        location: '二楼卧室',
        action: '因为学费被扣的事情刚跟二叔狠狠大吵回卧室。在洗手间大水盆洗脸发呆，极其难过。',
        isLying: false
      },
      {
        time: '23:15',
        location: '二楼卧室',
        action: '我一直坐在卧室床脚。我戴着头戴头套降噪超大功率音箱，戴着它全程阻断听重低音歌，还用被子捂着头。我没离开过房间，啥惊呼声音也没听到。台灯可能是不小心手滑拂翻倒的，真的。',
        isLying: true
      },
      {
        time: '23:20',
        location: '二楼卧室',
        action: '我觉得头晕，就把耳机往上提，正好听到一楼传来非常喧嚣骇人的警报铃铛与尖喊大作，我的房门还是倒扣的。',
        isLying: false
      }
    ],
    truthTimeline: [
      { time: '23:10', location: '卧室', action: '大吵后在房里独自愤怒。', isLying: false },
      { time: '23:15', location: '客厅', action: '如果作案：蹑手蹑脚挪下一楼起居室将摆件撬走，顺楼折返中打翻二楼花架，吊坠先塞塞进了厨房水槽旧杂物堆里。', isLying: true },
      { time: '23:20', location: '卧室', action: '回屋装作没事并戴上降噪耳机掩人耳目。', isLying: false }
    ]
  },
  {
    id: 'doctor',
    name: '陆浩然',
    roleName: '私人医生',
    avatar: DRIVE_IMAGES.npcDoctor,
    outburstAvatar: DRIVE_IMAGES.outburstDoctor,
    personality: '优雅、克制、虚荣。身为海归精英却因境外账户数额严重亏损而陷入疯狂。如果是他作案，会宣称23:15“在反锁漆黑的酒窖盘点心脏药物”，然而却不知道管家下去看见酒窖大配电开闸已经黑死，根本无法配药。',
    features: '带着金丝边眼镜，说话极为冷静傲骨。但对电闸、漆黑的矛盾一触即溃。',
    initialEmotion: 35,
    timeline: [
      {
        time: '23:10',
        location: '地下酒窖',
        action: '我拿着配药皮箱顺楼道走到地下原装酒窖。老主人犯心绞痛，我去整理专用的急救特效药配比。',
        isLying: false
      },
      {
        time: '23:15',
        location: '地下酒窖',
        action: '我一直在地下室原配冷藏冰柜前配置降温试管药物。由于药敏需要避光，我反锁了酒室的大厚木头门，不曾与楼上产生任何物理接触。',
        isLying: true
      },
      {
        time: '23:20',
        location: '地下酒窖',
        action: '配齐了针水，开铁门端药沿梯走上大厅，结果一推门就发现整个别墅处于管家哭泣和探长的红灯闪烁中，十分荒唐。',
        isLying: false
      }
    ],
    truthTimeline: [
      { time: '23:10', location: '地下酒窖', action: '取药。', isLying: false },
      { time: '23:15', location: '客厅', action: '若作案：借取急救针由头推开大厅锁格，盗取真品吊坠后快步藏于洗水盆隔层中，反串躲避。', isLying: true },
      { time: '23:20', location: '地下酒窖', action: '假装调适完毕走上来。', isLying: false }
    ]
  }
];

// Helper to provide descriptive information based on the randomized culprit
export const CONTRADICTIONS_INFO = [
  {
    id: 'c1',
    title: '走廊无人之谜（最核心证词矛盾）',
    description: '佣人陈敏声称自己在【23:15】一直待在走廊清洁，且信誓旦旦声称“走廊里极度安静，绝对没有任何人经过”。然而，访客周海平声称自己在【23:15】离开客厅穿过走廊前往厨房找管家，而管家李国栋也作证证实周海平在【23:15】确实来到了厨房拿气泡水，且管家也是在【23:14 - 23:15】路过走廊去往厨房。两人的无差别行动路径证明【23:15】有至少两人通过走廊。佣人声称无人路过，唯一的可能就是她当时根本不在走廊！（她正在客厅实施盗窃，因此必须编造走廊不在场的谎言）',
    source: '对比 佣人23:15证词、访客23:15行动与管家证言'
  },
  {
    id: 'c2',
    title: '匆忙的脚步声',
    description: '访客提到在【23:20】之后回到客厅，听到走廊传来惊慌匆忙的快步声。而佣人声称自己在【23:20】回休息室休息，坚称自己步伐平静地走回去。然而，在听到被盗呼喊前，有谁需要在宅中惊慌奔跑？这恰巧说明做了亏心事者的逃跑心虚举动。',
    source: '访客听到走廊跑步声 对应 佣人的心虚掩盖'
  }
];

// Return dynamic contradictions based on who the randomized culprit is
export const getActiveContradictions = (culpritId: NpcId, lang: string = 'zh') => {
  if (lang === 'en') {
    if (culpritId === 'maid') {
      return [
        {
          id: 'c1',
          title: 'The corridor vacuum myth (Time-space crash)',
          description: "Maid Chen Min claimed she was cleaning the walls in the narrow corridor at 23:15 and swore 'nobody and nothing passed'. However, Butler Li and Visitor Zhou both testified that between 23:14 and 23:16, both of them walked through the corridor to meet in the kitchen for chamomile tea and water! Since the corridor is the only path connecting the rooms, she couldn't possibly have missed them if she was really there. This proves she must have left her post, allowing her to burglarize the parlor safe and hide the jewel.",
          source: "Corridor witness testimony vs. Butler & Visitor's 23:15 path collision"
        },
        {
          id: 'c2',
          title: 'Panic midnight running sounds',
          description: "Visitor Zhou confirmed that around 23:21, before leaving the parlor, he heard a panic, rapid, low-footstep running sound heading away from the hallway. This matches the slip-on shoes worn by the maid. Meanwhile, Chen Min claimed she walked slowly back to the lounge with complete calm. This panic rush highlights her guilty state immediately after concealing the stolen jewel.",
          source: "Visitor's panic footsteps vs. Maid's calm stroll claim"
        }
      ];
    } else if (culpritId === 'butler') {
      return [
        {
          id: 'c1',
          title: 'The empty tea room (Butler\'s alibi busted)',
          description: "Butler Li swore that at 23:15 he was in the kitchen brewing herbal tea and serving Mr. Zhou. But Visitor Zhou debunked this: 'At 23:15 I entered the kitchen, the kettle was dry boiling with steam exploding, and the room was completely empty!' This completely destroys the butler's kitchen alibi. He left the room to locate the spare key and steal the pendant.",
          source: "Butler's kitchen alibi vs. Visitor's eye-witness of the empty kitchen"
        },
        {
          id: 'c2',
          title: 'The vanished spare key',
          description: "Maid Chen Min confirmed that besides the master's primary key, the spare key for the mahogany safe is kept in a sealed tea box on top of the kitchen cupboard, which only the butler controls and knows about. The butler's seven minutes of empty-kitchen absence was the golden opportunity for him to seize this key, open the vault, and stash the treasure in the water basin.",
          source: "Maid's spare key storage statement vs. Butler alibi void"
        }
      ];
    } else if (culpritId === 'visitor') {
      return [
        {
          id: 'c1',
          title: 'The phantom soda conversation (Visitor alibi shattered)',
          description: "Visitor Zhou Haiping claimed that at 23:15, he felt extremely thirsty, entered the kitchen, spoke with Butler Li, and was served soda. But Butler Li, with 16 years of untarnished service, swore on his honor: 'From 23:12 to 23:25, I was entirely alone in the kitchen. Absolutely no visitor came in, and I served no drinks.' Since Li has no motive and a flawless record, Zhou's claim is direct fabrication to conceal his robbery.",
          source: "Visitor's soda alibi vs. Butler's verified solitary tea brewing"
        },
        {
          id: 'c2',
          title: 'The double pocket shelter',
          description: "Maid Chen Min testified that around 23:15, she saw Mr. Zhou hobbling anxiously down the hallway with both fists tightly shoved deep into his coat pockets, sweat rolling down his forehead. This indicates he had just unlocked the safe, grabbed the emerald, and was fleeing to hide it.",
          source: "Maid's observation of Zhou's panic stroll vs. Visitor's lie"
        }
      ];
    } else if (culpritId === 'niece') {
      return [
        {
          id: 'c1',
          title: 'The vacant pink chamber (Niece empty room collapse)',
          description: "Niece Han Yuxin swore that she was locked inside her room at 23:15 playing high-volume music on soundproof headphones. But Dr. Lu refuted this: 'At 23:15, I walked by her room. The door was open, the computer was playing on autopilot, and her luxury pink desk lamp was lying shattered on the floor with nobody in the room.' This proves her alibi was a lie to cover for her stealing downstairs.",
          source: "Niece's headphone lockup claim vs. Dr. Lu's witness of the empty room"
        },
        {
          id: 'c2',
          title: 'Heavy stairs rushing sounds',
          description: "Maid Chen Min testified that after 23:15, she heard hasty, staggering slipper steps scrambling up the stairs from the parlor to the attic bedroom. This corresponds beautifully with Ms. Han's desperate escape after stealing the pendant and smashing her desk lamp in panic.",
          source: "Maid's stair-climbing acoustics vs. Niece's smashed desk lamp panic"
        }
      ];
    } else {
      return [
        {
          id: 'c1',
          title: 'The pitch black pharmacy alibi (Doctor trace decoded)',
          description: "Doctor Lu Haoran claimed that at 23:15 he was in the B1 wine cellar under lock sorting emergency heart injection vials. However, Butler Li testified: 'At 23:15, I went down to the B1 cellar searching for honey, the door was double locked from the inside, but looking through the glass window, there was no electricity on and the place was in absolute complete darkness without a soul working inside.' Lu's alibi is shattered. He was upstairs using the lockpicking gold box to loot.",
          source: "Doctor's locked pharmacy claim vs. Butler's pitch black electric outage check"
        },
        {
          id: 'c2',
          title: 'The emergency kit under parlour shadow',
          description: "Maid Chen Min confirmed that at 23:14, while cleaning, she saw Dr. Lu sneaking out of the mahogany drawer area holding his heavy white clinical medical bag, quickly concealing some heavy metallic lockpick tools inside it before sliding into the cellar in silence. This proves he took advantage of the heart rescue call to execute his robbery.",
          source: "Maid's direct corner-greeting vs. Doctor's first floor absence claim"
        }
      ];
    }
  }

  if (lang === 'ko') {
    if (culpritId === 'maid') {
      return [
        {
          id: 'c1',
          title: '복도 진공 신화 (시공간 물리적 충돌)',
          description: "하녀 진민은 23:15에 계속 복도를 청소 중이었으며 '아무도 지나가지 않았다'고 진술했습니다. 하지만 집사 이국동과 방문객 주해평은 23:14 ~ 23:16 사이에 복도를 지나쳐 주방에서 만났다고 일관되게 증언했습니다. 복도는 유일한 통로이므로 진짜 복도에 있었다면 두 사람을 놓칠 리 없습니다. 이는 당시 자리를 비우고 거실 금고를 털어 보석을 숨겼음을 보여줍니다.",
          source: "복도 유일 청소 진술 vs 집사 및 방문객의 23:15 복도 동선 교차 충돌"
        },
        {
          id: 'c2',
          title: '보이지 않는 야반도주 발소리',
          description: "방문객 주해평은 23:21경 주방을 떠나기 전 복도 너머로 황급한 발소리가 멀어지는 것을 똑똑히 들었다고 증언했습니다. 이는 하녀 진민의 슬리퍼 소리와 부합합니다. 진민은 편안하게 옷방으로 퇴장했다고 거짓 주장하나, 이 급박한 발걸음은 보석을 숨긴 직후의 불안감을 완벽히 대변합니다.",
          source: "방문객의 황급한 도주 발소리 청취 청천벽력 vs 하녀의 덤덤한 퇴장 주장"
        }
      ];
    } else if (culpritId === 'butler') {
      return [
        {
          id: 'c1',
          title: '공실이 된 주방의 수수께끼 (집사의 가짜 알리바이)',
          description: "집사 이국동은 23:15에 주방에서 양감국 차를 달이고 있었으며 방문객 주해평을 대접했다고 주장합니다. 그러나 주해평은 '23:15에 주방에 들어갔을 때 주전자는 완전히 끓어 철철 넘치고 있었고 주방 안에는 개미 한 마리 보이지 않았다'고 폭로했습니다. 이로써 집사의 주방 알리바이는 붕괴되었으며, 그가 거실 금고를 돌파해 도난을 범했음이 입증됩니다.",
          source: "집사의 23:15 주방 자증 vs 방문객 주해평의 주방 공실 목격의 전면 대립"
        },
        {
          id: 'c2',
          title: '사라진 비상 보조 열쇠',
          description: "하녀 진민은 평소 거실 홍목 수납함 보관실의 보조 전용 금 열쇠가 주방 상단 구석의 비공개 차 통에 정갈하게 격납되어 있으며, 오직 집사만이 이 보조 열쇠의 존재를 알고 관리해 왔다고 증언했습니다. 집사가 주방을 비운 7분은 이 열쇠로 수납함을 개방해 보석을 훔치는 공백 시간대였습니다.",
          source: "하녀의 보조열쇠 격납 위치 증언 vs 집사의 주방 부재 공백"
        }
      ];
    } else if (culpritId === 'visitor') {
      return [
        {
          id: 'c1',
          title: '환상의 탄산수 대화 (방문객 알리바이의 균열)',
          description: "방문인 주해평은 23:15에 너무 목이 말라 주방에 가서 집사 이국동과 함께 차를 고르며 찬 음료를 요청받았다고 주장했습니다. 하지만 16년 근속으로 명성을 떨친 집사 이국동은 '23:12 ~ 23:25 사이에 주방에는 오직 나 혼자 뿐이었으며 방문객은커녕 얼씬한 사람조차 아예 없었다'고 단언했습니다. 주해평이 자증하려 지어낸 완벽한 위장 대화는 완전한 거짓입니다.",
          source: "방문객의 음료 청구 주장 vs 노련한 집사의 주방 나홀로 대기 증언의 정면 격돌"
        },
        {
          id: 'c2',
          title: '품 안의 다급한 수수께끼',
          description: "하녀 진민은 23:15경 복도 모퉁이에서 주해평 씨가 이마에 식은땀을 흘리며 두 손을 옷 주머니에 다급히 찔러넣고 어쩔 줄 모르는 수상한 상태로 걸어가던 장면을 목격했다고 증언했습니다. 이는 그가 거실에서 에메랄드를 서리로 훔쳐 주머니에 대고 격납하려는 행적이었습니다.",
          source: "하녀의 주해평 접근 거동 포착 vs 방문객의 거짓 알리바이"
        }
      ];
    } else if (culpritId === 'niece') {
      return [
        {
          id: 'c1',
          title: '아가씨 방의 공실 정황 (조카딸 알리바이 붕괴)',
          description: "조카딸 한우흔은 23:15에 줄곧 방에 가만히 틀어박혀 노이즈 캔슬링 헤드폰을 충전하며 소설을 보았다고 선서했습니다. 하지만 육 의사는 '23:15에 조제함을 들고 방을 지날 때 방 철문은 열려 있었고 책상은 공실 상태였으며 값비싼 분홍 탁상등은 바닥에 완전히 깨져 넘어져 있었다'고 폭로했습니다. 방을 이탈했음을 말해주는 확실한 반증입니다.",
          source: "조카딸의 헤드폰 안락방 주장 vs 육 의사의 2층 공실 및 전등 파손 폭로의 정면 충돌"
        },
        {
          id: 'c2',
          title: '복도 전율의 쿵쾅거리는 발소리',
          description: "하녀 진민은 23:15 이후 1층 거실에서 2층으로 헐떡거리며 황급히 층계를 밟고 뛰어넘던 어떤 가련한 슬리퍼 발소리를 청취했다고 증언했습니다. 이는 에메랄드를 가슴에 품고 돌아오다 당황하여 조명등을 쓰러뜨린 조카의 행보와 일맥상통합니다.",
          source: "하녀의 층계 긴박 충돌 마찰음 청취 vs 아가씨 방 탁상등 파편의 수치적 매칭"
        }
      ];
    } else {
      return [
        {
          id: 'c1',
          title: '소등된 적막의 무전력 와인창고 (의사 배후의 알리바이 붕괴)',
          description: "주치의 육호연은 23:15에 심장 처방 조제를 지키기 위해 지하 와인고의 철문을 걸고 작업 중이었다고 밝혔습니다. 그러나 집사 이국동은 '23:15에 양감국차 벌꿀을 가지러 지하로 하강했을 때 와인창고 문은 잠겼으되 내부 전력 차단기가 내려가 칠흑 같은 어둠 속에 잠겨 있었고, 어떠한 약사 작업 행실도 보이지 않았다'고 증언하여 의사의 완전무장을 자백시켰습니다.",
          source: "의사의 주방조재 와인고 잠금 주장 vs 집사가 직격한 와인고의 전력 차단 침묵"
        },
        {
          id: 'c2',
          title: '의료 가방 속에 숨겨진 거실의 음影',
          description: "하녀 진敏은 23:14경 복도 모퉁이에서 육 의사가 크고 불룩한 전용 치료용 흰색 가방을 들고 홍목 보관함이 위치해 있던 거실 구석에서 슬며시 빠져나와 쇠붙이를 가방 안쪽에 급히 집어넣고 내려가는 동작을 두 눈으로 똑똑히 목격했다고 폭로했습니다. 기회를 타 거실을 턴 실체입니다.",
          source: "하녀의 대형 가방 이동 모습 포착 vs 의사가 1층을 도약하지 않았다는 가설의 정면 격돌"
        }
      ];
    }
  }

  // DEFAULT CHINESE ('zh')
  if (culpritId === 'maid') {
    return [
      {
        id: 'c1',
        title: '长廊真空神话 (时空物理撞车)',
        description: '女工陈敏声称 23:15 她一直在狭长走廊干擦墙活，并赌誓‘没有任何人和任何动静经过走廊’。但管家李国栋和访客周海平一致口供指认：在 23:14 - 23:16 期间，二人先后自走廊走两趟进入厨房，进行倒冲洋甘菊和拿冰水大声打招呼！既然走廊是单一路由唯一的走道，女工若真的如愿坚守其位，绝对无可能不碰到一前一后经过的两人！说明她当时根本不在此地，她具有无法磨灭的客厅离位和盗窃藏赃嫌疑！',
        source: '走廊唯一擦抹证词 与 管家及客人23:15会面流线 彻底冲撞'
      },
      {
        id: 'c2',
        title: '夜半走廊突围小跑步声',
        description: '访客周海平证实，在 23:21 喝完冰起泡水离开之前，隔墙敏锐感到有一串急迫而沉重的跑步声音、发出类似抹布女工便鞋的磨削声向外潜逃。而女工却假说自己拖完地异常轻松从容地移步更衣间。这种极其慌恐的异常跑跳正说明了她盗物之后的逃命心虚！',
        source: '访客听到狂奔动员 对应 女工谎称若无其事漫步离开'
      }
    ];
  } else if (culpritId === 'butler') {
    return [
      {
        id: 'c1',
        title: '空虚的茶室之迷 (管家真空借口)',
        description: '管家李国栋指天在 23:15 他分秒不舍地在厨房沏主人的晚茗，并顺便招待和气泡水给了周客人。但客人周海平揭发：“23:15我走进后厨，灶台水壶早已剧烈煮沸，水滴漫溅。环顾四周无一人在！管家完全不在内！”这粉碎了其“23:15寸步不离厨房泡茶叶”的不在场轨迹。管家擅离职守、秘密窜下起居室暗格开箱行窃已成定论！',
        source: '管家23:15厨房自证 与 访客周海平直击空巢后厨 绝对对立'
      },
      {
        id: 'c2',
        title: '消失的备用金钥',
        description: '佣人陈敏证实，通常除主人的主钥匙外，别墅红木五屉柜保险暗拉的副手备用全套金钥一直放置在后厨顶端的密封茶叶盒内收纳，只有管家平日单独掌管与放置位置熟知。管家空烧水的那七分钟，正是拿此长匙潜伏中厅迅速抽换并偷走绿钻古董的绝对诡计期。',
        source: '女佣证实副钥收纳 与 管家擅离厨房的真空期呼应'
      }
    ];
  } else if (culpritId === 'visitor') {
    return [
      {
        id: 'c1',
        title: '幽灵的苏打气泡对话 (访客完美在场戳破)',
        description: '商客周海平坚称，在 23:15 他极渴于是走进后厨，向管家打招呼闲谈茶叶、并拿到气泡水折返。但管家李国栋严正赌咒，拿着十六年工龄作保：“23:12至23:25我在厨房，除了我自己，绝无半个人推门进入，更无任何人索水搭腔！”由于李国栋毫无作案负债负担且清誉惊人，周浩然的在场虚伪被当场戳穿！他必然是撒编完美的谎词将行窃掩盖！',
        source: '访客借水在场说词 与 老管家独自烧茶全过程无第二人路入 的指认彻底瓦解'
      },
      {
        id: 'c2',
        title: '荒乱插入的死角',
        description: '女工陈敏指证：23:15 期间，她从走廊拐角看见周先生一瘸一拐、极力将两只拳头紧缩插入他厚实的商装外衣兜中，汗水顺额角滚淌，神色怪异极其慌张。这切中了他在起居室开锁扒箱，将吊坠攥入大衣仓皇藏尸的过程！',
        source: '女工目击周极快潜行 与 访客说谎在场对应'
      }
    ];
  } else if (culpritId === 'niece') {
    return [
      {
        id: 'c1',
        title: '惊现的真空卧室 (二楼侄女不在场坍塌)',
        description: '侄女韩雨欣发誓“由于学费惨遭拒绝愤怒，在 23:15 关紧卧门戴隔音降噪ANC耳套浸润重低音电子乐看小说，不曾移动分毫”。但随行医生陆医生严正指出：“23:15我拿了备药盒路过其卧室，门虚开，电脑空放，室内桌台前根本一无所有人！唯一的粉色贵重台灯倒摔在尘埃中！”这推翻了侄女一整晚寸步不离卧室的主张，她的重隔音说辞不过是贼喊捉贼。',
        source: '侄女耳机宅缩证言 与 陆医生二楼直面空无一人的凌乱内宅 直接断桥'
      },
      {
        id: 'c2',
        title: '楼道沉重的夺步折回声',
        description: '女佣陈敏供认，23:15 后，有从一楼起居室通往二楼阁楼的一声极为惊慌失措、类似女拖鞋鞋底快速爬登楼梯的慌忙脚步。这正好对照了韩雨欣得手翡翠真品后，惊恐回卧室把重物摔倒倒翻台灯的狼狈相。',
        source: '女佣听阶梯折返 对应 闺房打碎台灯的凌乱慌神'
      }
    ];
  } else {
    // doctor
    return [
      {
        id: 'c1',
        title: '熄灯反封的幽闭酒窖 (医生神秘轨迹解扣)',
        description: '私人医生陆浩然冷静指出“23:15为老爷分拣贴标强效心脏速效针，在地下酒窖锁门独自盘点，声音隔绝”。然而管家李国栋证言：“23:15我由于泡甘菊想下到酒窖侧台大箱寻找配套蜂蜜，当时长窖门是大死反栓着，但我朝窗内窥看，电闸绝无开启断电在闭，里面完全浸没在伸手不见人指的浓重黑暗中，不似有任何人在劳碌配标药！”。陆医生的假在场不攻自破！他根本没有在地下，而是利用主人的病急慌中探窍盗宝！',
        source: '医生独自反栓酒窖盘药 自相抵冲了 管家直击地下室断电黑夜 的反证'
      },
      {
        id: 'c2',
        title: '大厅幽影下的医药急护包',
        description: '佣人陈敏证实：23:14左右擦拭长廊画副时，亲眼瞧到平日自恃儒雅冷冰冰的陆医生拎着他的医药包从大厅起居配锁红箱方向侧步绕出，将某种金属物极其飞快倒扣进其医药白箱暗网，再蹑手走入地下。这毫无置喙地证明了他是利用拿心脏针的黄金期开锁夺钻！',
        source: '女仆大厅转角直面对白 击碎 医生未登一楼之托辞'
      }
    ];
  }
};
