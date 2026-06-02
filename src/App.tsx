import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, HelpCircle, RefreshCw, Trophy, XCircle, ArrowRight, BookOpen, Pin, Globe } from 'lucide-react';
import { GameState, NpcId, ChatMessage, NoteItem } from './types';
import { DRIVE_IMAGES, NPC_DATA_LIST } from './caseData';

// Import our modular subcomponents
import StartScreen from './components/StartScreen';
import SceneExplorer from './components/SceneExplorer';
import DialogueBox from './components/DialogueBox';
import DetectiveNotebook from './components/DetectiveNotebook';
import ConcludeScreen from './components/ConcludeScreen';
import AudioPlayer from './components/AudioPlayer';
import LogicPinBoard from './components/LogicPinBoard';
import { playWritingSound, playDialogueOpenSound, playBreakdownSound, playDeductionCorrectSound, playDeductionWrongSound, playAlertSound } from './utils/audio';
import { Language, t, getLocalizedNpcDataList } from './utils/i18n';

const NPC_IDS: NpcId[] = ['maid', 'butler', 'visitor', 'niece', 'doctor'];

const getRandomCulprit = (): NpcId => {
  const randomIndex = Math.floor(Math.random() * NPC_IDS.length);
  return NPC_IDS[randomIndex];
};

const getRandomInitialEmotions = (): Record<NpcId, number> => {
  // Generates a random volatility multiplier across games from 0.45 to 2.22
  const volatilityMultiplier = 0.45 + Math.random() * 1.77; 
  const randNum = (base: number, range: number) => {
    // Individual random luck scale per suspect
    const individualScale = 0.65 + Math.random() * 0.7;
    const computed = Math.floor((Math.random() * range + base) * volatilityMultiplier * individualScale);
    // Keep between 5% and 85% to ensure it remains a fun and suspenseful start
    return Math.min(85, Math.max(5, computed));
  };
  return {
    butler: randNum(15, 20),
    maid: randNum(35, 20),
    visitor: randNum(20, 20),
    niece: randNum(25, 20),
    doctor: randNum(15, 20)
  };
};

export default function App() {
  const initialEmotions = getRandomInitialEmotions();
  const [language, setLanguage] = useState<Language>('ko');

  // Main Game State Managers
  const [gameState, setGameState] = useState<GameState>({
    currentStage: 'start',
    activeScene: 'living-room',
    activeNpcId: null,
    emotionStates: initialEmotions,
    customNotes: [],
    unlockedClues: [],
    selectedCulprit: null,
    culpritReason: '',
    culpritId: getRandomCulprit(),
    endingType: null
  });

  const [isPendantFound, setIsPendantFound] = useState(false);
  const [showPendantPopup, setShowPendantPopup] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<Record<NpcId, ChatMessage[]>>({
    butler: [
      {
        id: 'init-b',
        sender: 'npc',
        text: t('init_butler', 'ko'),
        emotionValue: 25,
        timestamp: Date.now()
      }
    ],
    maid: [
      {
        id: 'init-m',
        sender: 'npc',
        text: t('init_maid', 'ko'),
        emotionValue: 45,
        timestamp: Date.now()
      }
    ],
    visitor: [
      {
        id: 'init-v',
        sender: 'npc',
        text: t('init_visitor', 'ko'),
        emotionValue: 30,
        timestamp: Date.now()
      }
    ],
    niece: [
      {
        id: 'init-n',
        sender: 'npc',
        text: t('init_niece', 'ko'),
        emotionValue: 35,
        timestamp: Date.now()
      }
    ],
    doctor: [
      {
        id: 'init-d',
        sender: 'npc',
        text: t('init_doctor', 'ko'),
        emotionValue: 25,
        timestamp: Date.now()
      }
    ]
  });

  const [showInstructions, setShowInstructions ] = useState(false);
  const [showPinBoard, setShowPinBoard] = useState(false);
  const [unlockedDeductionIds, setUnlockedDeductionIds ] = useState<string[]>([]);
  const [hiddenDeductionIds, setHiddenDeductionIds ] = useState<string[]>([]);
  const [isPinBoardGridLayout, setIsPinBoardGridLayout] = useState(false);
  const [sheetRecords, setSheetRecords] = useState<any[]>([]);
  const [isExtracted, setIsExtracted] = useState<Record<string, boolean>>({});

  // Alert Box Notification Banner
  const [alertBox, setAlertBox] = useState<{
    type: 'success' | 'amber' | 'info';
    title: string;
    text: string;
  } | null>(null);

  // Keep initial chat greetings perfectly synced with selected language
  useEffect(() => {
    setChatMessages(prev => {
      const updated = { ...prev };
      (Object.keys(updated) as NpcId[]).forEach(npcId => {
        const targetInitId = `init-${npcId[0]}`;
        updated[npcId] = updated[npcId].map(msg => {
          if (msg.id === targetInitId) {
            return { ...msg, text: t(`init_${npcId}`, language) };
          }
          return msg;
        });
      });
      return updated;
    });
  }, [language]);

  // 1. Fetch Google Spreadsheet mapped links on initial mount
  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const res = await fetch('/api/sheet-data');
        const data = await res.json();
        if (data.success && data.records) {
          setSheetRecords(data.records);
        }
      } catch (err) {
        console.error('Failed to pre-fetch spreadsheet indicators:', err);
      }
    };
    fetchSheetData();
  }, []);

  const triggerAlert = (type: 'success' | 'amber' | 'info', title: string, text: string) => {
    playAlertSound();
    setAlertBox({ type, title, text });
  };

  const handleCloseAlert = () => {
    setAlertBox(null);
  };

  // 2. Automated evaluation of gameplay dialogues to unlock contradictions
  const evaluateDialogueForClueUnlocks = (npcId: NpcId, message: string, reply: string) => {
    const targetCulprit = gameState.culpritId;

    // Check for c1 core timeline contradiction unlocks based on keywords
    if (!gameState.unlockedClues.includes('c1')) {
      const isAboutC1 = message.includes('23:15') || message.includes('十一分') || message.includes('十五分') || message.includes('行踪') || message.includes('时间') || message.includes('不在场') || message.includes('谎言') || message.includes('撒谎') || message.includes('证据') || message.includes('对质') || reply.includes('23:15') || reply.includes('十一分') || reply.includes('十五分');

      if (isAboutC1) {
        playWritingSound();
        setGameState(prev => ({
          ...prev,
          unlockedClues: [...prev.unlockedClues, 'c1']
        }));

        let alertC1Text = '';
        let noteC1Text = '';

        if (targetCulprit === 'maid') {
          if (language === 'en') {
            alertC1Text = 'Paradox Solved! Central 23:15 Hallway vacuum is falsified! The Butler Li and Visitor Zhou confirmed passing each other in that corridor at 23:15. Maid Chen Min\'s claim that there was no one violates physical laws. Hallway Alibi busted. Clue registered!';
            noteC1Text = '[Paradox] At 23:15, both Butler Li and Visitor Zhou confirmed stepping in and out of the hallway. Maid Chen Min claimed "it was dead silent and completely empty." Physical layout collision proves her hallway alibi is a lie.';
          } else if (language === 'ko') {
            alertC1Text = '시공간 충돌 해제! 23:15 복도 진공의 거짓이 붕괴되었습니다! 집사 이국동과 주 사장 모두 당시 복도 통행을 공식 증언했으므로, 하녀 진민만이 복도에서 인기척을 못 느꼈다는 완충 알리바이는 법리적 우롱입니다. 단서 등록.';
            noteC1Text = '[동선 모순 문서] 23:15 당시 복도에서 집사 이국동과 방문객 주해평이 조우해 복도 이동을 정합했으나, 하녀 진민은 혼자서 개미 한 마리 안 지나갔다고 가짜 증언했습니다. 복도 정수 상태가 아닌 거실 금고 개방을 증명합니다.';
          } else {
            alertC1Text = '你破解了23:15的走廊时空白穿穿插！老管家李国栋和访客周海平当晚均交叉印证23:15正在唯一的走廊交错通过，佣人陈敏辩称“走廊万籁俱寂、绝无一人”的口供瞬间在物理规律上彻底坍塌！疑点解锁！';
            noteC1Text = '【证词矛盾】23:15案发时管家与访客均确认在走廊行走交叉，而佣人陈敏妄称当时走廊毫无一人、寂静死寂。两相对撞，佣人的不在场谎言被戳穿。说明她当时根本不在走廊，而在客厅行窃。';
          }
        } else if (targetCulprit === 'butler') {
          if (language === 'en') {
            alertC1Text = 'Paradox Solved! Butler\'s empty kitchen at 23:15 is proven! Visitor Zhou verified that the kitchen stove was boiling empty with no butler in sight. Butler Li\'s tea-making brewing is fully falsified! Clue registered!';
            noteC1Text = '[Paradox] Visitor Zhou stepped into the kitchen at 23:15 and testified there was no butler. Major boilings on stove but Butler Li was missing. Stifling 7-minute absence window unlocked under gas boiling camouflage.';
          } else if (language === 'ko') {
            alertC1Text = '시공간 충돌 해제! 23:15 집사의 주방 상주 위장이 타파되었습니다! 주 사장은 주방 수도 확인 차 23:15에 갔을 시 집사이탈 및 가마가 미친 듯 끓고 있었음을 폭로하여 집사의 조차 알리바이가 붕해되었습니다. 단서 등록.';
            noteC1Text = '[동선 모순 문서] 방문인 주해평이 23:15 주방에 갔을 때 솥이 펄펄 끓을 뿐 이국동 집사는 가담 탈영 상태였다고 실토했습니다. 가스 불막으로 소음을 은닉하여 금고를 누빈 7분 공범 시간의 핵심 상징입니다.';
          } else {
            alertC1Text = '你砸破了管家23:15在厨假配茶的伪证！访客周海平直指在该时间进去找汽水时主厨半影全无、煤气水壶暴烈空死，戳穿了管家李国栋“一直在后厨没出门”的秩序神话！疑点解锁！';
            noteC1Text = '【证词矛盾】访客周海平证实23:15进入后厨空无一人，水沸漫干，而管家李国栋妄称在该10分钟内不曾离厨。说明管家在利用开水鸣叫干扰作噪在23:15趁空窃锁！';
          }
        } else if (targetCulprit === 'visitor') {
          if (language === 'en') {
            alertC1Text = 'Paradox Solved! Visitor Zhou\'s tea-drinking alibi is broken! Butler Li testified that no guest asked him for beverages or came into kitchen at 23:15. Lord Zhou\'s cozy chat timeline is fully refuted! Clue registered!';
            noteC1Text = '[Paradox] At 23:15, Visitor Zhou claimed he drank soda and joked with Butler Li in the kitchen. Butler Li testified he did not manage any guest or tea meetings, proving Zhou\'s alibi is a self-made bubble.';
          } else if (language === 'ko') {
            alertC1Text = '시공간 충돌 해제! 주해평 소다수 알리바이의 거짓이 붕괴되었습니다! 주 사장은 집사와 주방에서 담소를 나누었다 하나, 집사는 그 시각 혼자 찻일을 조율했을 뿐 타인이 접근한 바가 결코 없다고 단언했습니다. 단서 등록.';
            noteC1Text = '[동선 모순 문서] 방문인 주해평은 23:15 주방에서 집사와 수다를 털었다 진술하나, 집사는 23:15 정시에는 손님 면접이나 음료 교부를 행하지 않았다고 부서 단정했습니다. 주해평의 갱생 금고 탈피용 위조입니다.';
          } else {
            alertC1Text = '你锁定了访客周海平23:15去厨房买冰汽水的弥天大谎！老管家李国栋当堂证实23:15无任何客人到后厨打招呼或索要汽水，对口击毁了周老板编造的融洽客商在场神话！疑点解锁！';
            noteC1Text = '【证词矛盾】访客周海平声称23:15去厨房找管家拿气泡水点调问，而管家李国栋断定23:15没有任何客人到厨房。戮穿了周海平编撰不在场、潜入行窃的真相。';
          }
        } else if (targetCulprit === 'niece') {
          if (language === 'en') {
            alertC1Text = 'Paradox Solved! Niece Han\'s headphones defense is dismantled! Physician Lu verified that when he climbed to 2F at 23:15 her room was completely open, bed cold, and desk lamp broken. The quiet bedroom alibi collapses! Clue registered!';
            noteC1Text = '[Paradox] At 23:15, Dr. Lu climbed up and confirmed her door was ajar, chamber empty, and golden lamp shattered. Niece Han\'s "lying peaceful wearing heavy ANC headphones on bed" was a pure scam.';
          } else if (language === 'ko') {
            alertC1Text = '시공간 충돌 해제! 조카 한우흔 방콕 헤드폰 위장이 타파되었습니다! 주치의 육 의사는 23:15 이층에 당도했을 시 한 양의 객방 문이 열려 있고 침대는 텅 비어 있었으며 탁자 핑크 조명등이 붕괴 상태였음을 증언했습니다. 단서 등록.';
            noteC1Text = '[동선 모순 문서] 주치의 육호연은 23:15에 이층 주택을 밟았을 때 한우흔의 방문이 활짝 구겨진 채 사람이 한 명도 부재했고 가구 전등이 전복된 흔적을 감정했습니다. 무흠 조카가 아래로 내려갔음을 가리키는 잉여 단정입니다.';
          } else {
            alertC1Text = '你戳破了侄女韩雨欣在闺房乖乖听歌的假在场！随行医师陆浩然白纸黑字证实自己在23:15大闸断路时登搂，当时其卧室半掩冷铺、房中香熏灯翻打一地、房里根本全空！疑点解锁！';
            noteC1Text = '【证词矛盾】医生陆浩然证实23:15登楼二层，看到韩雨欣卧室虚掩、冷衾空无一人且台灯侧歪翻倒；而韩雨欣狡辩当时自己一整晚平和戴大耳麦听歌、毫无外出。戳穿其盗宝狂奔碰翻灯具的痕迹。';
          }
        } else if (targetCulprit === 'doctor') {
          if (language === 'en') {
            alertC1Text = 'Paradox Solved! Doctor Lu\'s dark medicine counting is unmasked! Butler Li testified that the cellar breaker was manually shut, plunging B1 into freezing dark. Formulating pharmacy labels was physically impossible! Clue registered!';
            noteC1Text = '[Paradox] Dr. Lu claimed he dispenser pharmaceuticals in light at 23:15. Butler Li checked B1 and verified the main breaker was switched down under global power outage. Extreme dark made drug checking a lie.';
          } else if (language === 'ko') {
            alertC1Text = '시공간 충돌 해제! 칠흑 지하실 의사 알리바이가 붕해되었습니다! 집사가 주방 부속 배관 보수 때문에 지하실 배전기를 살폈을 때 23:15 레일은 수동 분리된 암실이었으므로 의사가 약병 이름표를 읽었다는 주장은 기만입니다. 단서 등록.';
            noteC1Text = '[동선 모순 문서] 의사는 23:15에 지하 와인방에서 치료 약제를 세정 계수했다 했으나, 집사 증언에 의해 당시는 지하 전력 바가 강제 차절된 흑조 암실 상태로 미세 글자들을 정간 검침할 수 없었음이 확정된 허구 공구입니다.';
          } else {
            alertC1Text = '你戳破了私人医生陆浩然在地窖盘点外文细微药剂的弥天大谎！管家李国栋证实23:15检查地下室高压闸由于故障全被彻底拉掉，地下一片漆黑煤窑，根本无法点查小药盒标签！疑点解锁！';
            noteC1Text = '【证词矛盾】私人医生陆浩然口称23:15在地下配配精密外文心脏药水，而管家李国栋目击23:15地下配电主闸被手工下拉关闭，地下伸手不见五指。断言医生借故断电摸瞎并上楼行窃！';
          }
        }

        triggerAlert('success', alertC1Text, '');
        handleAddCustomNote(targetCulprit, noteC1Text, 'c1');
      }
    }

    // Check for c2 acoustic/visual running clues
    if (!gameState.unlockedClues.includes('c2')) {
      const isAboutC2 = message.includes('急促') || message.includes('跑') || message.includes('小跑') || message.includes('声音') || message.includes('备用金钥') || message.includes('钥匙') || message.includes('医药包') || message.includes('手提包') || message.includes('衣服兜') || message.includes('衣兜') || message.includes('台灯') || message.includes('打碎') || message.includes('脚步') || reply.includes('急促') || reply.includes('跑') || reply.includes('小跑') || reply.includes('备用金钥') || reply.includes('钥匙') || reply.includes('医药包') || reply.includes('手提包') || reply.includes('衣服兜') || reply.includes('衣兜') || reply.includes('台灯') || reply.includes('打碎') || reply.includes('脚步');

      if (isAboutC2) {
        playWritingSound();
        playBreakdownSound();
        setGameState(prev => ({
          ...prev,
          unlockedClues: [...prev.unlockedClues, 'c2']
        }));

        let alertC2Text = '';
        let noteC2Text = '';

        if (targetCulprit === 'maid') {
          if (language === 'en') {
            alertC2Text = 'You unlocked the 23:21 corridor sprint trace! Visitor Zhou verified hearing panic quick shoes stamping past upstairs, while Maid Chen Min claimed she walked in extreme peace. Corridor lies are crushed! Clue registered!';
            noteC2Text = '[Acoustic Contradiction] Visitor Lord Zhou verified that at 23:21, somebody sprinted up the foyer floorboards in immense terror. Maid Chen Min claimed she paced calmly. Inward escape routes of the theft are exposed.';
          } else if (language === 'ko') {
            alertC2Text = '23:21 복도 비정상 급하 질주 발소리 폭로! 방문인 주 사장은 퇴거 직전 다급한 여성의 도주 소리를 포착했으나, 하녀 진민은 내내 쾌활히 세정 작업을 마쳤다며 사칭했습니다. 하녀의 동선 역류가 파괴되었습니다. 단서 등록.';
            noteC2Text = '[동선 모순 문서] 방문인 주 사장이 23:21 주방 퇴실 단계 복도에서 급박한 여성의 신발 거칠기를 식별했으나, 진민은 의심을 슬쩍 비켜가려 평온히 있었다고 속였습니다. 장물 은폐 후 황급 탈출한 증거입니다.';
          } else {
            alertC2Text = '你锁定了23:21的走廊异常跑步声！访客周海平声声称他快离开前听到惊慌而沉重的小脚步跑上楼。佣人陈敏辩称自己从容慢行。两相对照戳破了佣人的谎造状态！疑点解锁！';
            noteC2Text = '【疑点案卷】访客周海平在23:21离场前听见走廊有人惊慌逃跑，鞋底嚓嚓擦地，而陈敏狡辩自己当时优游自得。说明陈敏得手后极度作贼心虚、狂奔藏赃！';
          }
        } else if (targetCulprit === 'butler') {
          if (language === 'en') {
            alertC2Text = 'You solved the mystery of the missing spare key! The maid confirmed the duplicate safe key was hidden inside a kitchen tea-box, which only the butler knew and managed. The 7-minute empty burner was precisely the window used to steal! Clue registered!';
            noteC2Text = '[Dynamic Clue] Maid Chen Min confirmed only the butler managed the duplicate safe keys tucked deep inside the kitchen tea container. Butler Li\'s 7-minute absence under the cover of dry-boiling was the exact theft window.';
          } else if (language === 'ko') {
            alertC2Text = '소실된 보조 보석 열쇠의 수수께끼 해제! 하녀가 폭로하기를 보조 보석함 열쇠는 주방 찻잎상자에 엄격히 은폐 보관되어 있었고 오직 집사만이 이 정보를 숙지 수호하고 있었습니다. 가스레인지 7분의 소강기는 바로 이 열쇠를 은닉해 금고를 연 범행 시각이었습니다. 단서 기록.';
            noteC2Text = '[동선 모순 문서] 하녀 진민은 보조 열쇠가 오직 집사만이 통제하는 주방 홍차상자 밑에 수장되어 있었다고 증명했습니다. 집사 이국동이 물 끓인다는 수단으로 만든 7분의 공백은 열쇠로 보석을 편취했던 영락없는 사찰 정당 행위입니다.';
          } else {
            alertC2Text = '你锁定了保管钥匙的信息黑洞！佣人陈敏吐露二胡红柜金箱的辅轨套钥平时秘藏在厨房顶层红茶盒里，只有管家才有日常统称配属权。管家空阀干烧的7分钟，正是趁空取钥盗物极度闭合的物理时刻！疑点解锁！';
            noteC2Text = '【疑点案卷】佣人陈敏爆出备用钥匙被严格锁存藏匿厨房红茶铁罐内，专属管家一人管控。管家伪造并故意放空在23:15出去，实质正是趁大厅拉闸摸黑取钥匙窃钻的绝密漏洞！';
          }
        } else if (targetCulprit === 'visitor') {
          if (language === 'en') {
            alertC2Text = 'You uncovered Visitor Zhou\'s suspicious movements! Maid Chen Min saw Zhou at 23:15 walking in haste, hiding both clenched fists inside his trenchcoat pocket with an extremely irregular gesture. This is direct evidence of him grabbing the pendant from the cabinet!';
            noteC2Text = '[Physical Clue] Maid Chen Min testified that at 23:15 she saw Visitor Zhou walking past corridor in immense rush with his hands clenched tight inside coat pockets, looking extremely flustered. Unmasked his active burglary phase.';
          } else if (language === 'ko') {
            alertC2Text = '주해평의 어정쩡한 호주머니 압축 흔적 폭로! 하녀 진민은 23:15에 복도를 가로지르는 주 사장의 손이 양코트 안주머니로 대량 우겨 꽂히며 일그러진 긴장 태세를 취한 것을 식별했습니다. 금고를 편안히 비운 후 물건을 밀봉하던 수급 증거입니다. 단서 등록.';
            noteC2Text = '[동선 모순 문서] 하녀 진민이 23:15에 땀 젖은 손을 코트에 잔뜩 숨긴 채 거실 복도를 서성이며 피하는 주해평의 경련 직감을 채점 증언했습니다. 차를 가지러 왔다는 비지니스 거동을 무력화시키는 도주 지문입니다.';
          } else {
            alertC2Text = '你锁定了荒乱插入的死角痕迹！女佣陈敏目击周海平在23:15瘸拐急行、紧篡双拳塞入大衣外套口袋、神态怪异异常。这正是他开金箱得手后、攥着古币逃逸的实证！';
            noteC2Text = '【疑点案卷】佣人陈敏23:15直击周海平形色仓皇、双拳攥藏、快步踱回阁楼。对应其包装谎称的去开茶，刺中真相。';
          }
        } else if (targetCulprit === 'niece') {
          if (language === 'en') {
            alertC2Text = 'You unlocked the runaway footsteps of the niece! Maid Chen Min verified hearing a panicked female slippers rush登楼 up to 2F at 23:21 right after the lights-out. Contradicts niece claiming she was sound asleep. Clue registered!';
            noteC2Text = '[Footsteps Paradox] Maid Chen Min confirmed that at 23:21 a panicked female slippers ran upstairs instantly right after power out. Niece Han雨欣 returned and shattered her desk light in complete blackout.';
          } else if (language === 'ko') {
            alertC2Text = '조카 양의 도망 계단 흔적 폭로! 하녀 진민은 23:21에 계단을 다급히 밟고 이층으로 복귀하던 공종 하녀가 아닌 유아 슬리퍼 긁어대는 마찰음을 들었다고 실토했습니다. 조카의 방콕 음 청취가 허상임이 고정됩니다. 단서 등록.';
            noteC2Text = '[동선 모순 문서] 하녀 진민이 23:21 당시, 이층 여자용 귀향 계단 걸음을 가청했습니다. 한 양이 복강 하역을 취하고 도주 복귀하다가 사각 조명등을 충격해 전도시킨 철제 인장입니다.';
          } else {
            alertC2Text = '你锁定了走廊奔走的幽静女拖鞋声！佣人陈敏证实23:21突发大铃时，听见慌乱急速的女鞋登楼回阁音，恰巧和二楼房内被摸黑踩踩碾压踩断的奢华台灯铁器倒地鸣响极其配合！疑点解锁！';
            noteC2Text = '【疑点案卷】佣人陈敏直陈23:21听到惊惶轻便的女拖鞋踏阶奔登二楼，对应其二楼闺房被打碎的贵重台灯，刺穿了韩雨欣整夜未出卧室的不在场谎报！';
          }
        } else if (targetCulprit === 'doctor') {
          if (language === 'en') {
            alertC2Text = 'You solved the mystery of the suspicious potion box! Maid Chen Min saw Dr. Lu at 23:14 coming out of the parlor holding a bulky white medical kit in deep panic. Fits the timing of him using medical locks to bypass alarms! Clue registered!';
            noteC2Text = '[Kit Clue] Maid Chen Min testified she saw Dr. Lu holding a white emergency kit leaving the parlor area in rush at 23:14 under major blackout panic, contradicting B1 cellar alibi.';
          } else if (language === 'ko') {
            alertC2Text = '의사의 백색 의약함 팽배 돌출 폭로! 하녀 진민은 23:14 당시 거실에서 당혹된 태도로 가슴팍에 하얀 비상구급 의약 가방을 동동 맨 채 지하실 지하로 슬며시 비끼던 육 의사를 대조했습니다. 약을 챙기기 위해 전차를 뗐다는 조작의 무치성입니다. 단서 등록.';
            noteC2Text = '[동선 모순 문서] 여종 진민이 23:14 당시 거실 현장에서 튀어나와 지하 계단을 타고 전력 이탈을 행하던 육호연 주치의의 미터 백색 도구를 감지했습니다. 와인창고 알리바이를 무효로 만드는 금고 탈취의 유일 시간입니다.';
          } else {
            alertC2Text = '你锁定了白药包与诡秘轨迹！佣人陈敏直击23:14私人医生陆浩然攥紧一只高鼓白急救包、形色极慌忙从亮灯客厅跃出溜入地下室，刺中了医生“一直老实关在地窖”的谎伪气泡！疑点解锁！';
            noteC2Text = '【疑点案卷】女佣陈敏23:14目睹私人医生陆浩然攥紧一白色急救鼓袋跑出客厅、潜入地下配药。恰好对应了其二叔保险锁由于磁锁电感被物理急断时间，证明其盗窃经过！';
          }
        }

        triggerAlert('success', alertC2Text, '');
        handleAddCustomNote(targetCulprit, noteC2Text, 'c2');
      }
    }
  };

  // 3. Dialogue Agent Handler via Backend API with dynamic state updates
  const handleSendDialogue = async (text: string) => {
    if (!gameState.activeNpcId) return;
    const activeId = gameState.activeNpcId;

    const playerMsg: ChatMessage = {
      id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      sender: 'player',
      text,
      timestamp: Date.now()
    };

    setChatMessages(prev => ({
      ...prev,
      [activeId]: [...prev[activeId], playerMsg]
    }));

    setIsGenerating(true);

    try {
      const npcList = getLocalizedNpcDataList(language, gameState.culpritId);
      const activeNpcData = npcList.find(n => n.id === activeId)!;
      const timelineStr = activeNpcData.timeline.map(t => `${t.time} 在 ${t.location}：${t.action}`).join('\n');
      const history = chatMessages[activeId] || [];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          npcId: activeId,
          npcName: activeNpcData.name,
          roleName: activeNpcData.roleName,
          personality: activeNpcData.personality,
          features: activeNpcData.features,
          timelineStr,
          history,
          message: text,
          emotion: gameState.emotionStates[activeId] || 30,
          culpritId: gameState.culpritId,
          language: language
        })
      });

      const data = await response.json();
      if (data.success) {
        const replyText = data.reply;
        const emotionDelta = data.emotionDelta || 0;
        const discoveredClue = data.discoveredClue;

        const currentEmotion = gameState.emotionStates[activeId] || 30;
        let newEmotion = Math.max(0, Math.min(100, currentEmotion + emotionDelta));

        if (discoveredClue && activeId === gameState.culpritId) {
          if (newEmotion < 75) {
            newEmotion = 75;
          }
        }

        // Toggling boolean isOutburst flag in the emotionStates record if newEmotion >= 75
        const isOutburstMode = newEmotion >= 75;
        setGameState(prev => {
          const prevOutburst = prev.emotionStates.isOutburst || {};
          return {
            ...prev,
            emotionStates: {
              ...prev.emotionStates,
              [activeId]: newEmotion,
              isOutburst: {
                ...prevOutburst,
                [activeId]: isOutburstMode
              }
            }
          };
        });

        handleAppendChatMessage(activeId, 'npc', replyText, newEmotion);

        evaluateDialogueForClueUnlocks(activeId, text, replyText);

        if (newEmotion >= 75) {
          triggerAlert(
            'amber',
            language === 'en' ? '⚠️ Suspect Panic Red Zone!' : language === 'ko' ? '⚠️ 용의자 심리 한계 돌파!' : '⚠️ 嫌犯心防红区！溃不成声',
            language === 'en'
              ? `${activeNpcData.name}'s expression changed dramatically, tearing up or shouting. Point out where the evidence is hidden now!`
              : language === 'ko'
              ? `${activeNpcData.name}의 안색이 변하며 오열하기 시작했습니다. 물증이 있는 곳을 계속 추궁해보세요!`
              : `${activeNpcData.name}的神态剧变、冷汗溢出！他口角错谬、情绪彻底进入爆发崩溃状态，请继续盘查底牌起赃！`
          );
        }
      }
    } catch (err: any) {
      console.error('Interrogator connect failed:', err);
      triggerAlert(
        'info',
        language === 'en' ? '⚠️ API connection issue' : language === 'ko' ? '⚠️ 통신 회선에 신호 혼선' : '⚠️ 探案电传线路有些波动',
        language === 'en'
          ? `Storm/delay of API: ${err.message || 'Loading local backup rule analysis...'}`
          : language === 'ko'
          ? `폭풍우로 인터페이스 연결이 지연되었습니다: ${err.message || '로컬 백업 규칙 분석으로 무리 없이 진행됩니다!'}`
          : `别墅暴风雨使API略有延迟：${err.message || '正加载离线本地笔录解析，不影响通关！'}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // 4. Physical Evidence Search in Kitchen sink
  const handleSearchKitchen = () => {
    const hasCoreTimeline = gameState.unlockedClues.includes('c1');
    const culpritEmotion = gameState.emotionStates[gameState.culpritId];
    const npcList = getLocalizedNpcDataList(language, gameState.culpritId);
    const culpritNpcName = npcList.find(n => n.id === gameState.culpritId)?.name || (language === 'en' ? 'Suspect' : language === 'ko' ? '용의자' : '嫌犯');

    if (!hasCoreTimeline) {
      triggerAlert(
        'info',
        language === 'en' ? '🔍 Empty Kitchen Sink' : language === 'ko' ? '🔍 텅 빈 주방 싱크대' : '🔍 洗手水盆光溜溜一空',
        language === 'en'
          ? 'You searched the cabinets, bottles, and cupboards thoroughly, but found nothing but water stains. A rational detective won\'t dig aimlessly, go check more 23:15 timeline contradictions first!'
          : language === 'ko'
          ? '찬장, 양념통, 식기건조대 밑바닥까지 뒤져보았지만, 얼룩진 물자국 외엔 아무것도 보이지 않습니다. 이성적인 탐정은 무작정 수색하지 않습니다. 먼저 23:15 당사자들의 타임라인 행적 모순을 살펴보세요!'
          : '你把橱柜、调料瓶和碗柜翻拉了个底朝天，然而除了脏水渍外空无一人。理性的侦探不会漫无章法地乱挖，多去场景多核对 23:15 证词漏斗吧！'
      );
    } else if (culpritEmotion < 70) {
      triggerAlert(
        'info',
        language === 'en' ? '🔍 Suspect is the key' : language === 'ko' ? '🔍 단서는 알지만 디테일 부족' : '🔍 深知可能在水槽，但缺乏细节',
        language === 'en'
          ? `Your deduction points to under the kitchen sink, but the kitchen is messy. You need to pressure the key suspect 【${culpritNpcName}】 in interrogation, making their panic emotion reach 70+ to trigger a confession of where the pendant is hidden!`
          : language === 'ko'
          ? `직감상 싱크대 수도꼭지 아래에 물건이 숨겨져 있음을 직감했지만, 주방이 너무 지저분합니다. 핵심 용의자인 【${culpritNpcName}】을 한계까지 추궁해 불안 수치를 70 이상으로 올려 구체적인 은닉 위치를 실토하게 하십시오!`
          : `根据破绽，你直觉断定物件藏匿在水龙头下，但大宅厨房堆积极凌乱。你需要对口向嫌疑人【${culpritNpcName}】高压讯问，使这套核心嫌犯的情绪崩溃度堆积在 70+ 及以上，触发忏悔，明确赃藏的具体夹层，你才能精确获宝！`
      );
    } else {
      // SUCCESS!
      setIsPendantFound(true);
      setShowPendantPopup(true);
      triggerAlert(
        'success',
        language === 'en' ? '🎉 Blue Diamond Pendant Uncovered!' : language === 'ko' ? '🎉 블루 다이아몬드 펜던트 발견!' : '🎉 【起赃大捷！ 蓝钻吊坠已起获】',
        language === 'en' ? 'You successfully found the Blue Diamond Pendant under the sink!' : language === 'ko' ? '싱크대 아래에서 블루 다이아몬드 펜던트를 찾아냈습니다!' : '你成功搜出了藏在水槽下的蓝钻吊坠！'
      );
    }
  };

  const handleConfirmAccusation = (culprit: NpcId, reason: string) => {
    const isCorrect = culprit === gameState.culpritId;
    let finalEnding: 'success' | 'fail-insufficient-evidence' | 'fail-wrong-person';
    if (isCorrect) {
      if (isPendantFound) {
        finalEnding = 'success';
      } else {
        finalEnding = 'fail-insufficient-evidence';
      }
    } else {
      finalEnding = 'fail-wrong-person';
    }

    setGameState(prev => ({
      ...prev,
      selectedCulprit: culprit,
      culpritReason: reason,
      endingType: finalEnding,
      currentStage: 'ending'
    }));
  };

  // Manual Note Writers Helpers
  const handleAddCustomNote = (npcId: NpcId, content: string, clueId?: 'c1' | 'c2', hotspotId?: string) => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      npcId,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      content,
      isCustom: true,
      clueId,
      hotspotId
    };
    setGameState(prev => ({
      ...prev,
      customNotes: [newNote, ...prev.customNotes]
    }));
  };

  const handleDeleteNote = (id: string) => {
    setGameState(prev => ({
      ...prev,
      customNotes: prev.customNotes.filter(n => n.id !== id)
    }));
  };

  const handleUnlockContradiction = (clueId: string) => {
    setGameState(prev => {
      if (prev.unlockedClues.includes(clueId)) return prev;
      return {
        ...prev,
        unlockedClues: [...prev.unlockedClues, clueId]
      };
    });
  };

  const handleUpdateNpcEmotion = (npcId: NpcId, emotion: number) => {
    setGameState(prev => {
      const prevOutburst = prev.emotionStates.isOutburst || {};
      return {
        ...prev,
        emotionStates: {
          ...prev.emotionStates,
          [npcId]: emotion,
          isOutburst: {
            ...prevOutburst,
            [npcId]: emotion >= 75
          }
        }
      };
    });
  };

  const handleAppendChatMessage = (npcId: NpcId, sender: 'player' | 'npc', text: string, emotionValue?: number) => {
    const newMsg: ChatMessage = {
      id: `${sender[0]}-present-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      sender,
      text,
      emotionValue,
      timestamp: Date.now()
    };
    setChatMessages(prev => ({
      ...prev,
      [npcId]: [...prev[npcId], newMsg]
    }));
  };

  // Play Again Reset state
  const handleResetGame = () => {
    const freshEmotions = getRandomInitialEmotions();
    setIsPendantFound(false);
    setIsGenerating(false);
    setShowPinBoard(false);
    setShowPendantPopup(false);
    setIsExtracted({});
    setUnlockedDeductionIds([]);
    setHiddenDeductionIds([]);
    setGameState({
      currentStage: 'start',
      activeScene: 'living-room',
      activeNpcId: null,
      emotionStates: freshEmotions,
      customNotes: [],
      unlockedClues: [],
      selectedCulprit: null,
      culpritReason: '',
      culpritId: getRandomCulprit(),
      endingType: null
    });

    // Reset Dialogue messages to fresh default states matching new emotions
    setChatMessages({
      butler: [
        {
          id: 'init-b',
          sender: 'npc',
          text: t('init_butler', language),
          emotionValue: freshEmotions.butler,
          timestamp: Date.now()
        }
      ],
      maid: [
        {
          id: 'init-m',
          sender: 'npc',
          text: t('init_maid', language),
          emotionValue: freshEmotions.maid,
          timestamp: Date.now()
        }
      ],
      visitor: [
        {
          id: 'init-v',
          sender: 'npc',
          text: t('init_visitor', language),
          emotionValue: freshEmotions.visitor,
          timestamp: Date.now()
        }
      ],
      niece: [
        {
          id: 'init-n',
          sender: 'npc',
          text: t('init_niece', language),
          emotionValue: freshEmotions.niece,
          timestamp: Date.now()
        }
      ],
      doctor: [
        {
          id: 'init-d',
          sender: 'npc',
          text: t('init_doctor', language),
          emotionValue: freshEmotions.doctor,
          timestamp: Date.now()
        }
      ]
    });
  };

  return (
    <div id="game-sandbox-app" className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#1e293b] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden relative">
      
      {/* Safe Mini Floating Language Switcher - Positioned safely at bottom-left to prevent blocking interactive headers/notebooks */}
      <div id="global-lang-switcher" className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2 bg-slate-950/95 backdrop-blur border border-slate-800 hover:border-slate-750 p-2 px-3 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.7)] transition-all">
        <Globe className="w-3.5 h-3.5 text-rose-500 animate-spin-slow shrink-0" />
        <select
          value={language}
          onChange={(e) => {
            playWritingSound();
            const nextLang = e.target.value as Language;
            setLanguage(nextLang);
            // Dynamic logic translation reset for initial NPC dialogue cards!
            setChatMessages(prev => {
              const updated = { ...prev };
              (Object.keys(updated) as NpcId[]).forEach(npcId => {
                const targetInitId = `init-${npcId[0]}`;
                updated[npcId] = updated[npcId].map(msg => {
                  if (msg.id === targetInitId) {
                    return { ...msg, text: t(`init_${npcId}`, nextLang) };
                  }
                  return msg;
                });
              });
              return updated;
            });
          }}
          className="bg-transparent text-slate-100 text-[11px] font-bold font-mono focus:outline-none cursor-pointer border-none outline-none select-none"
        >
          <option value="ko" className="bg-slate-950 text-slate-100">한국어 (Default)</option>
          <option value="en" className="bg-slate-950 text-slate-100">English</option>
          <option value="zh" className="bg-slate-950 text-slate-100">中文</option>
        </select>
      </div>

      {/* Dynamic Pop Banner alerts top centerted */}
      <AnimatePresence>
        {alertBox && (
          <motion.div
            id="floating-alert-banner"
            initial={{ opacity: 0, y: -45, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg"
          >
            <div className={`p-4 rounded-xl border flex gap-3 shadow-2xl backdrop-blur-md relative ${
              alertBox.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-100'
                : alertBox.type === 'amber'
                ? 'bg-amber-950/95 border-amber-600/40 text-amber-100'
                : 'bg-slate-900/95 border-slate-700/50 text-slate-100'
            }`}>
              <Compass className={`w-5 h-5 flex-shrink-0 mt-0.5 animate-spin-slow ${
                alertBox.type === 'success' ? 'text-emerald-400' : alertBox.type === 'amber' ? 'text-amber-400' : 'text-rose-400'
              }`} />
              <div className="pr-6">
                <h4 className="text-xs font-extrabold tracking-wide text-white uppercase mb-1">{alertBox.title}</h4>
                <p className="text-[11px] leading-relaxed text-slate-350 font-sans font-light">{alertBox.text}</p>
              </div>
              <button
                onClick={handleCloseAlert}
                className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] border border-white/10 select-none cursor-pointer"
                title="关闭提示"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 1: START COVER SCREEN */}
      {gameState.currentStage === 'start' && (
        <StartScreen
          onStartGame={() => setGameState(prev => ({ ...prev, currentStage: 'background' }))}
          onShowInstructions={() => setShowInstructions(true)}
          language={language}
        />
      )}

      {/* STAGE 2: BACKGROUND DOCUMENT BRIEFING SCREEN */}
      {gameState.currentStage === 'background' && (
        <div
          id="background-stage-view"
          className="relative min-h-screen flex items-center justify-center p-3 sm:p-6 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.65)), url('${DRIVE_IMAGES.bgStart}')`,
            backgroundColor: '#1e293b'
          }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5 shadow-2.5xl backdrop-blur text-slate-200"
          >
            <div className="text-center">
              <span className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest block mb-0.5 animate-pulse">
                {t('briefTitle', language)}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-white">
                {t('briefSubtitle', language)}
              </h2>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-350 leading-relaxed font-sans font-light">
              <p>
                {t('briefText1', language)}
              </p>
              <p>
                {t('briefText2', language)}
              </p>
              <p className="border-l-2 border-rose-500/80 pl-3 italic text-xs bg-slate-950/40 p-2.5 rounded font-sans font-light">
                🔍 {t('briefGuide', language)}
              </p>
            </div>

            <button
              id="bg-enter-game"
              onClick={() => setGameState(prev => ({ ...prev, currentStage: 'investigate' }))}
              className="w-full flex items-center justify-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs p-3.5 rounded-lg tracking-widest shadow transition cursor-pointer active:scale-95"
            >
              <span>{t('briefButton', language)}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </motion.div>
        </div>
      )}

      {/* STAGE 3: INVESTIGATE EXPLORER MAP SHEET AND TALK */}
      {gameState.currentStage === 'investigate' && (
        <div id="investigate-stage-view" className="flex-grow flex flex-col md:flex-row h-[calc(100vh-45px)] md:h-screen overflow-hidden p-3 gap-3 bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#1e293b]">
          
          {/* LEFT 2/3 COLUMN DESIGNER OR DYNAMIC DIALOGUE INTERLOCK CONTROLS */}
          <div className="w-full md:w-[62%] lg:w-[66%] flex flex-col h-full min-h-0 bg-slate-950/20">
            {gameState.activeNpcId ? (
              <DialogueBox
                npcId={gameState.activeNpcId}
                messages={chatMessages[gameState.activeNpcId]}
                onSendMessage={handleSendDialogue}
                onExit={() => setGameState(prev => ({ ...prev, activeNpcId: null }))}
                npcEmotion={gameState.emotionStates[gameState.activeNpcId]}
                unlockedClues={gameState.unlockedClues}
                isGenerating={isGenerating}
                culpritId={gameState.culpritId}
                customNotes={gameState.customNotes}
                onUnlockContradiction={handleUnlockContradiction}
                onUpdateNpcEmotion={handleUpdateNpcEmotion}
                onAppendChatMessage={handleAppendChatMessage}
                language={language}
                isOutburst={gameState.activeNpcId ? !!gameState.emotionStates.isOutburst?.[gameState.activeNpcId] : false}
              />
            ) : (
              <SceneExplorer
                activeScene={gameState.activeScene}
                onSceneChange={(sceneId) => setGameState(prev => ({ ...prev, activeScene: sceneId }))}
                onNpcSelect={(npcId) => {
                  playDialogueOpenSound();
                  setGameState(prev => ({ ...prev, activeNpcId: npcId }));
                }}
                emotionStates={gameState.emotionStates}
                unlockedClues={gameState.unlockedClues}
                onSearchKitchen={handleSearchKitchen}
                isPendantFound={isPendantFound}
                onAddCustomNote={(npcId, content, hotspotId) => handleAddCustomNote(npcId, content, undefined, hotspotId)}
                isExtracted={isExtracted}
                setIsExtracted={setIsExtracted}
                language={language}
                culpritId={gameState.culpritId}
                onUnlockContradiction={handleUnlockContradiction}
                currentStage={gameState.currentStage}
              />
            )}
          </div>

          {/* RIGHT 1/3 SIDEBAR: Excel Interactive Spreadsheet columns and user Scratchpad */}
          <div className="w-full md:w-[38%] lg:w-[34%] flex flex-col h-full min-h-0 pb-1.5 justify-between">
            <div className="flex-1 min-h-0">
              <DetectiveNotebook
                customNotes={gameState.customNotes}
                onAddNote={handleAddCustomNote}
                onDeleteNote={handleDeleteNote}
                unlockedClues={gameState.unlockedClues}
                activeNpcId={gameState.activeNpcId}
                culpritId={gameState.culpritId}
                language={language}
              />
            </div>

            {/* Dedicated Pin-board Toggle Button - Redesigned to be highly notice-able, glowing, and prestigious */}
            <div className="pt-2">
              <button
                id="btn-trigger-pinboard"
                onClick={() => {
                  playDialogueOpenSound();
                  setShowPinBoard(true);
                }}
                className="w-full bg-gradient-to-r from-red-950 via-slate-900 to-red-950 hover:from-red-900 hover:via-slate-850 hover:to-red-900 text-rose-300 hover:text-white font-extrabold py-3.5 px-4 rounded-xl uppercase tracking-widest flex items-center justify-center space-x-2 border-2 border-rose-500 hover:border-rose-400 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.45)] hover:shadow-[0_0_28px_rgba(239,68,68,0.65)] active:scale-95 transition-all text-[11px] select-none animate-pulse"
                style={{ animationDuration: '3.5s' }}
              >
                <Pin className="w-4 h-4 text-rose-500 fill-rose-500 animate-bounce" />
                <span className="tracking-wider">
                  {language === 'en' ? '🧠 Logic Thread Pinboard 📌' : language === 'ko' ? '🧠 논리 단서 연결 백보드 📌' : '🧠 深度逻辑连线白板 📌'}
                </span>
                <span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded font-mono font-black animate-pulse uppercase shrink-0">
                  {language === 'en' ? 'Pro' : language === 'ko' ? '인기' : '高能'}
                </span>
              </button>
            </div>

            {/* Quick Conclude Launcher Button in sidebar footer */}
            <div className="pt-2.5">
              <button
                id="btn-trigger-conclude"
                onClick={() => setGameState(prev => ({ ...prev, currentStage: 'conclude' }))}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center space-x-1 border border-rose-500/30 cursor-pointer shadow-lg active:scale-95 transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {language === 'en' ? 'Accuse Suspect Closed Hearing ⚖️' : language === 'ko' ? '비공개 공소 지목: 진범 기소 ⚖️' : '召开闭门听证：指控罪魁 ⚖️'}
                </span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* STAGE 4: FINAL ACCUSATION closed form */}
      {gameState.currentStage === 'conclude' && (
        <div
          id="conclude-stage-view"
          className="relative min-h-screen flex items-center justify-center p-3 sm:p-5 bg-cover bg-center overflow-y-auto"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.7)), url('${DRIVE_IMAGES.bgStart}')`,
            backgroundColor: '#1e293b'
          }}
        >
          <ConcludeScreen
            unlockedClues={gameState.unlockedClues}
            isPendantFound={isPendantFound}
            onCancel={() => setGameState(prev => ({ ...prev, currentStage: 'investigate' }))}
            onConfirmAccusation={handleConfirmAccusation}
            culpritId={gameState.culpritId}
            language={language}
            emotionStates={gameState.emotionStates}
          />
        </div>
      )}

      {/* STAGE 5: ENDING FINAL CLASSIFIED BLOCKS */}
      {gameState.currentStage === 'ending' && (
        <div
          id="ending-screen-root"
          className="relative min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(10, 10, 15, 0.94), rgba(5, 5, 10, 0.98)), url('${DRIVE_IMAGES.bgStart}')`,
            backgroundColor: '#0a0d13'
          }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xl w-full bg-slate-905 border border-slate-800 p-5 sm:p-7 rounded-2xl shadow-2xl text-slate-200 text-center space-y-5"
          >
            {/* SUCCESS SLATE */}
            {gameState.endingType === 'success' && (
              <div className="space-y-4" id="ending-view-success">
                <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                  <Trophy className="w-7 h-7" />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-sans tracking-wide">
                  {t('endingSuccessTitle', language)}
                </h2>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed text-left bg-slate-950/70 p-4 border border-slate-850 rounded-xl font-sans font-light">
                  <p>
                    <strong className="text-white">
                      {language === 'en' ? 'Accusation Warrant Succeeded: ' : language === 'ko' ? '기소 및 송치 성공: ' : '指控犯人成功：'}
                    </strong>
                    {gameState.culpritId === 'maid' && (
                      language === 'en'
                        ? "Maid Chen Min confessed in tears when presented with Butler's coordinate facts showing active corridor movement around 23:15, admitting she stole the artifact to clear her debts."
                        : language === 'ko'
                        ? "식모인 진민의 마지노선 심리가 23:15에 집사와 외래객이 복도를 왕래했다는 상반 경로에 의해 무너졌으며, 빚 변제를 위해 절도를 도모했다고 눈물로 시인했습니다."
                        : "雇工佣人 陈敏 心理底线被你23:15走廊有管家主人通行的事实彻底物理打沉，当堂大哭，坦露其因填补赌债起了贼心。"
                    )}
                    {gameState.culpritId === 'butler' && (
                      language === 'en'
                        ? "Butler Li Guodong was confronted with Mr. Zhou's testimony proving the kitchen was empty with the kettle dry boiling around 23:15. Face pale, he admitted stealing the key and jewel to cover investment deficits."
                        : language === 'ko'
                        ? "집사 이국동은 23:15 무렵 주방 수돗가에 아무도 없었으며 용기가 과열 방치되었다는 사실을 대면 확인받고, 안색이 창백해져 투자 채무를 가리기 위해 부속 열쇠를 훔쳤다고 시인했습니다."
                        : "管家 李国栋 被周老板当面指证后厨空无一人、火上疯狂空水滚漫的事实，面孔铁青、终跪倒交代因境外投资股市赤字窃走古币的事实。"
                    )}
                    {gameState.culpritId === 'visitor' && (
                      language === 'en'
                        ? "Visitor Zhou Haiping pretended he was talking with the butler in the kitchen at 23:15, which was fully debunked. He confessed he stole the pendant due to a cash-flow crisis."
                        : language === 'ko'
                        ? "외래객 주해평의 23:15 주방 차담 알리바이가 집사님의 성실한 기재에 의해 모조리 격파되었고, 자금난 해소를 위해 보석을 편취했음을 순순히 자백했습니다."
                        : "访客周商客 周海平 假造23:15进去跟老管家喝茶泡聊的不在场神话被李老十六年清誉当面全盘推翻！他双手指甲掐骨，承认自己资金链亏沉盗走宝石。"
                    )}
                    {gameState.culpritId === 'niece' && (
                      language === 'en'
                        ? "Niece Han Yuxin was caught when the doctor testified her bedroom was empty at 23:15, forcing her to admit she committed the theft out of anger regarding canceled tuition support, accidentally smashing her desk lamp when fleeing."
                        : language === 'ko'
                        ? "조카 한우흔은 23:15 무렵 침실에 부재했다는 영락없는 사실로 추궁당했고, 유학비 축소에 격분해 보석을 편취하였으며 복귀 도중 전등을 전복시켰음을 실토했습니다."
                        : "侄女韩小姐 韩雨欣 被医生指证23:15房门虚开卧床冷空的铁案戳穿，嚎啕交代学费被取消所以愤而盗物的真相，承认逃跑回房绊碎了昂贵粉灯。"
                    )}
                    {gameState.culpritId === 'doctor' && (
                      language === 'en'
                        ? "Dr. Lu Haorany was caught on a power-lever cutoff discrepancy when a latex powder fingerprint was detected on B1 main breaker. He confessed he stole to cover overseas loan sharks."
                        : language === 'ko'
                        ? "주치의 육호연은 정전의 배전반 레버에 묻은 수술용 장갑 가루 단서에 덜미가 잡혔고, 고리대금 압박을 해제하기 위해 범행했음을 울며 사과했습니다."
                        : "随同医生 陆浩然 试图自锁地下遮罪，被老管家下探发现配电全断没电的黑事实钉死！他瘫软交心其境外不法药代欠高利私利的细节，人赃并获。"
                    )}
                  </p>
                  <p>
                    <strong className="text-white">
                      {language === 'en' ? 'Pendant Evidence Retrieved: ' : language === 'ko' ? '물증 복원 완벽: ' : '实赃归起完美：'}
                    </strong>
                    {t('endingSuccessDesc', language)}
                  </p>
                  <div className="mt-2 text-rose-400 font-extrabold bg-slate-900 p-2 text-center rounded border border-rose-500/10 text-xs text-rose-350 select-text font-mono">
                    {language === 'en' ? 'SHERLOCK HOLMES MASTER CLASS HONORS 🌟🌟🌟🌟🌟' : language === 'ko' ? '수사 영예: 1등 대셜록 홈즈 훈장 🌟🌟🌟🌟🌟' : '侦破荣誉：终身一等大福尔摩斯大英勋章 🌟🌟🌟🌟🌟'}
                  </div>
                </div>
              </div>
            )}

            {/* INSUFFICIENT EVIDENCE DISMISSAL */}
            {gameState.endingType === 'fail-insufficient-evidence' && (
              <div className="space-y-4" id="ending-view-insufficient">
                <div className="w-14 h-14 rounded-full bg-yellow-950/60 border border-yellow-500/40 flex items-center justify-center text-yellow-400 mx-auto mb-2">
                  <RefreshCw className="w-6 h-6 text-yellow-400" />
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-yellow-500 font-sans tracking-wide">
                  {t('endingFailEvidenceTitle', language)}
                </h2>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-350 leading-relaxed text-left bg-slate-950/70 p-4 border border-slate-850 rounded-xl font-sans font-light">
                  <p>
                    {language === 'en' ? 'Although you broke the timeline defense of ' : language === 'ko' ? '비록 대면 상에서 ' : '虽然你在对口盘盘中彻底击碎了嫌疑犯 '}
                    <strong className="text-rose-400">
                      {gameState.culpritId === 'maid' ? (language === 'en' ? 'Maid Chen Min' : language === 'ko' ? '식모 진민' : '佣人 陈敏') :
                       gameState.culpritId === 'butler' ? (language === 'en' ? 'Butler Li Guodong' : language === 'ko' ? '집사 이국동' : '管家 李国栋') :
                       gameState.culpritId === 'visitor' ? (language === 'en' ? 'Visitor Zhou Haiping' : language === 'ko' ? '방문인 주해평' : '访客 周海平') :
                       gameState.culpritId === 'niece' ? (language === 'en' ? 'Niece Han Yuxin' : language === 'ko' ? '조카 한우흔' : '主人侄女 韩雨欣') : 
                       (language === 'en' ? 'Doctor Lu Haoran' : language === 'ko' ? '의사 육호연' : '私人医生 陆浩然')}
                    </strong>
                    {language === 'en' ? "'s timeline contradictions..." : language === 'ko' ? "의 시간선 모순을 전면 격파해냈으나..." : " 在时间线上的弥天谎称。"}
                  </p>
                  <p>
                    {t('endingFailEvidenceDesc', language)}
                  </p>
                </div>
              </div>
            )}

            {/* WRONG SUSPECT ACCUSED */}
            {gameState.endingType === 'fail-wrong-person' && (
              <div className="space-y-4" id="ending-view-wrong">
                <div className="w-14 h-14 rounded-full bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-450 mx-auto mb-2">
                  <XCircle className="w-7 h-7" />
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-rose-500 font-sans tracking-wide">
                  {t('endingFailWrongPersonTitle', language)}
                </h2>

                <div className="space-y-3 text-xs sm:text-sm text-slate-350 leading-relaxed text-left bg-slate-950/70 p-4 border border-slate-850 rounded-xl font-sans font-light">
                  <p>
                    {language === 'en' ? 'You rushed or misjudged and indicted a completely innocent suspect: ' : language === 'ko' ? '귀하는 정밀 검증 없이 온전히 억울한 무고인을 송치하였습니다: ' : '你在荒张轻信以及漏洞时间下错误移交起诉了完全坦白的无辜好人：'}
                    <strong className="text-rose-400">
                      {gameState.selectedCulprit === 'butler' ? (language === 'en' ? 'Butler Li Guodong' : language === 'ko' ? '집사 이국동' : '管家 李国栋') :
                       gameState.selectedCulprit === 'maid' ? (language === 'en' ? 'Maid Chen Min' : language === 'ko' ? '식모 진민' : '佣人 陈敏') :
                       gameState.selectedCulprit === 'visitor' ? (language === 'en' ? 'Visitor Zhou Haiping' : language === 'ko' ? '방문인 주해평' : '访客 周海平') :
                       gameState.selectedCulprit === 'niece' ? (language === 'en' ? 'Niece Han Yuxin' : language === 'ko' ? '조카 한우흔' : '侄女 韩雨欣') : 
                       (language === 'en' ? 'Doctor Lu Haoran' : language === 'ko' ? '의사 육호연' : '医生 陆浩然')}
                    </strong>。
                  </p>
                  <p>
                    {language === 'en' ? 'The court produced complete exculpatory reports, rendering your suspect innocent. The true thief: ' : language === 'ko' ? '법원은 진술 배제 판정 및 전면 무죄를 선고했고, 진식 진범인: ' : '庭审出具了彻底的反向排除报告，无辜人宣无罪，引致警署蒙受滔天乌龙耻辱！而别墅真正的真凶—— '}
                    <strong className="text-emerald-400">
                      {gameState.culpritId === 'maid' ? (language === 'en' ? 'Chen Min' : language === 'ko' ? '진민' : '陈敏') :
                       gameState.culpritId === 'butler' ? (language === 'en' ? 'Li Guodong' : language === 'ko' ? '이국동' : '李国栋') :
                       gameState.culpritId === 'visitor' ? (language === 'en' ? 'Zhou Haiping' : language === 'ko' ? '주해평' : '周海平') :
                       gameState.culpritId === 'niece' ? (language === 'en' ? 'Han Yuxin' : language === 'ko' ? '한우흔' : '韩雨欣') : 
                       (language === 'en' ? 'Lu Haoran' : language === 'ko' ? '육호연' : '陆浩然')}
                    </strong>
                    {language === 'en' ? ' smirked outside the jury box!' : language === 'ko' ? '는 뒤쪽에서 비웃고 유유히 빠져나갔습니다!' : ' 正在陪审席外掩口冷笑！'}
                  </p>
                  <p>
                    {t('endingFailWrongPersonDesc', language)}
                  </p>
                </div>
              </div>
            )}

            {/* restart button */}
            <div className="flex justify-center pt-2">
              <button
                id="ending-restart-btn"
                onClick={handleResetGame}
                className="flex items-center space-x-1 border border-slate-750 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase px-7 py-3 rounded-lg shadow-md transition cursor-pointer active:scale-95 animate-pulse"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-rose-500 animate-bounce" />
                <span>
                  {language === 'en' ? 'Restart Reinvestigation 🔎' : language === 'ko' ? '처음부터 재수사하기 🔎' : '不屈不挠 · 重翻案宗二刷 🔎'}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* OPERATIONS INSTRUCTIONS DIALOG OVERLAY */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            id="instructions-modal-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-slate-200 space-y-4"
            >
              <div className="flex items-center space-x-1.5 text-rose-500 font-mono tracking-wider text-xs uppercase font-bold">
                <Compass className="w-4 h-4" />
                <span>{t('guideModalTitle', language)}</span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-300 font-sans font-light">
                <p className="font-semibold text-white">
                  {language === 'en' ? 'The Case of Villa burglary requires four rigorous investigation steps:' : language === 'ko' ? '빌라 도난 사건 수사를 위해 네 단계 지침을 준수하십시오:' : '别墅内夜半盗案，探长探明案卷需要四个严遵的步骤：'}
                </p>
                <div className="space-y-2.5 text-slate-350">
                  <div className="p-1 bg-slate-950/20 rounded">{t('guideItem1', language)}</div>
                  <div className="p-1 bg-slate-950/20 rounded">{t('guideItem2', language)}</div>
                  <div className="p-1 bg-slate-950/20 rounded">{t('guideItem3', language)}</div>
                  <div className="p-1 bg-slate-950/20 rounded">{t('guideItem4', language)}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  id="instructions-close-btn"
                  onClick={() => setShowInstructions(false)}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                >
                  {t('closeBtn', language)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. INTERACTIVE LOGIC PIN BOARD MODAL OVERLAY */}
      <AnimatePresence>
        {showPinBoard && (
          <motion.div
            id="logic-pinboard-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-5"
          >
            <motion.div
              initial={{ scale: 0.94, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              className="w-full h-[96vh] sm:h-[90vh] max-w-6xl shadow-2xl flex flex-col rounded-2xl overflow-hidden"
            >
              <LogicPinBoard
                onAddNote={handleAddCustomNote}
                unlockedClues={gameState.unlockedClues}
                culpritId={gameState.culpritId}
                onClose={() => setShowPinBoard(false)}
                unlockedDeductionIds={unlockedDeductionIds}
                setUnlockedDeductionIds={setUnlockedDeductionIds}
                hiddenDeductionIds={hiddenDeductionIds}
                setHiddenDeductionIds={setHiddenDeductionIds}
                isGridLayout={isPinBoardGridLayout}
                setIsGridLayout={setIsPinBoardGridLayout}
                language={language}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Headless Ambient Music Player */}
      <AudioPlayer emotionStates={gameState.emotionStates} currentStage={gameState.currentStage} />

      {/* PENDANT FOUND DYNAMIC POPUP MODAL */}
      <AnimatePresence>
        {showPendantPopup && (
          <motion.div
            id="pendant-found-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative max-w-md w-full bg-slate-900 border-double border-4 border-amber-500 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.35)] text-center space-y-5 flex flex-col items-center"
            >
              {/* Decorative design headers */}
              <div className="flex flex-col items-center space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-black animate-pulse">
                  {t('pendantAcquiredTitle', language)}
                </span>
                <h2 className="text-xl font-extrabold font-sans text-amber-400">
                  {t('pendantAcquiredHeading', language)}
                </h2>
              </div>

              {/* Magnificent Glowing Photo Box */}
              <div className="relative w-48 h-48 bg-slate-950 border border-amber-500/30 rounded-2xl overflow-hidden p-2 flex items-center justify-center shadow-inner group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none" />
                <img
                  src={DRIVE_IMAGES.pendant}
                  alt={t('pendantAlt', language)}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                  onError={(e) => {
                    console.error("Failed to load pendant image, using fallback icon styling");
                  }}
                />
                
                {/* Shiny reflex overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
              </div>

              {/* Dossier description */}
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans font-light bg-slate-950/60 p-4 border border-slate-800 rounded-xl text-left select-text">
                <p>
                  <strong className="text-amber-400">{language === 'en' ? 'Description: ' : language === 'ko' ? '물증 설명: ' : '物物描述：'}</strong>
                  {t('pendantDescription', language)}
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono text-amber-500 pt-1.5 border-t border-slate-800">
                  <span>{t('pendantStatus', language)}</span>
                  <span>{t('pendantIndictmentReady', language)}</span>
                </div>
              </div>

              {/* Direct navigation confirm button */}
              <button
                id="close-pendant-popup-btn"
                onClick={() => setShowPendantPopup(false)}
                className="w-full bg-gradient-to-r from-amber-50 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl cursor-pointer shadow-lg active:scale-95 transition"
              >
                {t('pendantCloseBtn', language)}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
