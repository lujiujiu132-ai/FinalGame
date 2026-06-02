import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Compass, BookOpen, Fingerprint, Sparkles, Loader2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { NpcId, Language } from '../types';
import { playSearchExploreSound, playPaperFlipSound, playWritingSound, playWaterSound, stopWaterSound } from '../utils/audio';
import { getLocalizedScenes, t, getLocalizedNpcDataList, getLocalizedPhysicalEvidence } from '../utils/i18n';
import { DRIVE_IMAGES } from '../caseData';

type SceneId = 'living-room' | 'corridor' | 'kitchen' | 'bedroom' | 'wine-cellar';

interface SceneExplorerProps {
  activeScene: SceneId;
  onSceneChange: (sceneId: SceneId) => void;
  onNpcSelect: (npcId: NpcId) => void;
  emotionStates: Record<NpcId, number> & { isOutburst?: Record<NpcId, boolean> };
  unlockedClues: string[];
  onSearchKitchen: () => void;
  isPendantFound: boolean;
  onAddCustomNote: (npcId: NpcId, content: string, hotspotId?: string) => void;
  isExtracted: Record<string, boolean>;
  setIsExtracted: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  language: Language;
  culpritId: NpcId;
  onUnlockContradiction?: (clueId: string) => void;
  currentStage?: string;
}

// Full detailed Case-File Hotspots across all 5 rooms
interface Hotspot {
  id: string;
  name: string;
  top: string;
  left: string;
  associatedNpc: NpcId;
  description: string;
}

const getLocalizedRoomAdjacency = (lang: Language): Record<SceneId, {
  up?: { id: SceneId; label: string };
  down?: { id: SceneId; label: string };
  left?: { id: SceneId; label: string };
  right?: { id: SceneId; label: string };
}> => {
  const sc = getLocalizedScenes(lang);
  return {
    'corridor': {
      up: { id: 'bedroom', label: `2F ${sc['bedroom']?.name}` },
      down: { id: 'wine-cellar', label: `B1 ${sc['wine-cellar']?.name}` },
      left: { id: 'living-room', label: `1F ${sc['living-room']?.name}` },
      right: { id: 'kitchen', label: `1F ${sc['kitchen']?.name}` }
    },
    'living-room': {
      right: { id: 'corridor', label: `1F ${sc['corridor']?.name}` }
    },
    'kitchen': {
      left: { id: 'corridor', label: `1F ${sc['corridor']?.name}` }
    },
    'bedroom': {
      down: { id: 'corridor', label: `1F ${sc['corridor']?.name}` }
    },
    'wine-cellar': {
      up: { id: 'corridor', label: `1F ${sc['corridor']?.name}` }
    }
  };
};

const getLocalizedHotspots = (lang: Language): Record<SceneId, Hotspot[]> => {
  const evs = getLocalizedPhysicalEvidence(lang);
  const getEv = (id: string) => evs.find(e => e.id === id);

  const sinkName = {
    zh: '不锈钢滴水洗水槽柜',
    en: 'Metal Drip Sink Cabinet',
    ko: '식기 세척수조 문 뒤편'
  }[lang];

  const sinkDesc = {
    zh: '【核心藏赃处】不锈钢水喉发出滴水响。底下拉门敞着半格。无数的脏拖把、陈年发酸发黄抹布叠在一起。这里是整起大案极顶的藏真首饰‘夜鸦之眼’的物理窝巢！只有通过23:15时空拆穿并审得犯人防线溃散忏悔后，你才能把手扣入最底部抠拿真金吊缀！',
    en: '【Case Vault】The leaky faucet drips slowly. The lower cabinet door is half open, revealing wet floor sponges and old rags. This is the ultimate physical vault for the stolen emerald pendant! Only after cross-examining suspects about 23:15 and breaking their psychological defense can you retrieve the pendant from the bottom!',
    ko: '【장물 보관 장소】세척 수조 뒤편을 면밀히 열어본 결과, 묵은 걸레 뭉치와 세척제 잔해가 침전되어 있습니다. 이곳이 절취된 비정의 에메랄드 펜던트가 임시 가매장된 실제 은닉처입니다. 대화로 23:15의 전조를 가려내어 용의자의 방어벽을 무너뜨려 자백을 얻기 전까지는 회수할 수 없습니다.'
  }[lang];

  return {
    'living-room': [
      { id: 'lr-safe', name: getEv('lr-safe')?.name || '红木五屉柜暗格', top: '45%', left: '26%', associatedNpc: 'butler', description: getEv('lr-safe')?.description || '' },
      { id: 'lr-sofa', name: getEv('lr-sofa')?.name || '大客皮沙发底', top: '72%', left: '52%', associatedNpc: 'visitor', description: getEv('lr-sofa')?.description || '' },
      { id: 'lr-fireplace', name: getEv('lr-fireplace')?.name || '余温大壁炉', top: '38%', left: '84%', associatedNpc: 'doctor', description: getEv('lr-fireplace')?.description || '' }
    ],
    'corridor': [
      { id: 'co-gallery', name: getEv('co-gallery')?.name || '历代庄严油画墙', top: '34%', left: '24%', associatedNpc: 'maid', description: getEv('co-gallery')?.description || '' },
      { id: 'co-stair', name: getEv('co-stair')?.name || '木梯扶踏台阶', top: '68%', left: '74%', associatedNpc: 'niece', description: getEv('co-stair')?.description || '' }
    ],
    'kitchen': [
      { id: 'ki-sink', name: sinkName, top: '64%', left: '50%', associatedNpc: 'maid', description: sinkDesc },
      { id: 'ki-faucet', name: getEv('ki-faucet')?.name || '不锈钢滴水水龙头', top: '46%', left: '56%', associatedNpc: 'maid', description: getEv('ki-faucet')?.description || '' },
      { id: 'ki-stove', name: getEv('ki-stove')?.name || '汤灶与空烧水水壶', top: '52%', left: '20%', associatedNpc: 'butler', description: getEv('ki-stove')?.description || '' },
      { id: 'ki-tea', name: getEv('ki-tea')?.name || '红木名茶叶储存格', top: '28%', left: '80%', associatedNpc: 'butler', description: getEv('ki-tea')?.description || '' }
    ],
    'bedroom': [
      { id: 'be-lamp', name: getEv('be-lamp')?.name || '砸翻摔毁的台灯', top: '56%', left: '32%', associatedNpc: 'niece', description: getEv('be-lamp')?.description || '' },
      { id: 'be-drawer', name: getEv('be-drawer')?.name || '梳妆镜柜缝塞信', top: '46%', left: '70%', associatedNpc: 'niece', description: getEv('be-drawer')?.description || '' }
    ],
    'wine-cellar': [
      { id: 'wc-db', name: getEv('wc-db')?.name || '配电柜黑色总电闸', top: '38%', left: '32%', associatedNpc: 'doctor', description: getEv('wc-db')?.description || '' },
      { id: 'wc-med', name: getEv('wc-med')?.name || '随同心脏冰针冷保箱', top: '64%', left: '78%', associatedNpc: 'doctor', description: getEv('wc-med')?.description || '' }
    ]
  };
};

export default function SceneExplorer({
  activeScene,
  onSceneChange,
  onNpcSelect,
  emotionStates,
  onSearchKitchen,
  isPendantFound,
  onAddCustomNote,
  isExtracted,
  setIsExtracted,
  language,
  culpritId,
  onUnlockContradiction,
  currentStage = 'investigate'
}: SceneExplorerProps) {
  const localizedScenes = getLocalizedScenes(language);
  const currentSceneData = localizedScenes[activeScene];
  
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [faucetBranch, setFaucetBranch] = useState<'intro' | 'listen' | 'deduced' | 'witness'>('intro');
  const [isSearchingRoom, setIsSearchingRoom] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [detectiveMindBubble, setDetectiveMindBubble] = useState<string | null>(null);

  useEffect(() => {
    if (detectiveMindBubble) {
      const timer = setTimeout(() => {
        setDetectiveMindBubble(null);
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [detectiveMindBubble]);

  const handleDetectiveClick = () => {
    playWritingSound();
    const thoughts: Record<SceneId, Record<Language, string>> = {
      'living-room': {
        zh: culpritId === 'butler'
          ? "管家李国栋老成持重，却在此处伪造了完美的供词。23:15客厅沸腾溢出的水壶，究竟掩盖了他去往何处的脚步？"
          : culpritId === 'maid'
          ? "佣人陈敏神态极为防御，她若 23:15 就在一门之隔的走廊上，怎么可能对迎面而过的周海平先生视若无睹？"
          : "这起突发于密室内的珠宝失窃，在 23:15 这个最核心的时间点，必然有人在说谎。核算并对比他们的时间线是突破口。",
        en: culpritId === 'butler'
          ? "Butler Lee seems steady, yet forged a perfect timeline. 23:15 kitchen steam masked his silent heist doors!"
          : culpritId === 'maid'
          ? "Maid Chen stands on complete guard. If she was in the hallway at 23:15, how could she miss Mr. Zhou walking nearby?"
          : "A locked room jewel heist. At the 23:15 core timestamp, someone definitely fabricated their witness. Timeline analysis is key.",
        ko: culpritId === 'butler'
          ? "이국동 집사는 온화해 보이지만, 영리하게 알리바이를 조작했습니다. 23:15 소란스레 끓어 넘친 주전자가 그의 행적을 지웠군요!"
          : culpritId === 'maid'
          ? "메이드 천민의 방어적 태도... 23:15 복도에 서 있었다면서 왜 그곳을 왕래한 주해평 사장을 한 명도 못 봤다고 일축할까요?"
          : "밀실 보석 도난 사건... 23:15라는 핵심 시점에 누군가 새빨간 거짓말을 늘어놓았습니다. 용의 보조 기록들을 상호 대조해 봅시다."
      },
      'corridor': {
        zh: "狭长而漆黑的廊道。佣人陈敏咬死该时间一片寂静、空无一人。但老管家和访客却证实他们在此擦肩走入。大谎显现！",
        en: "Narrow, elongated corridor. Maid Chen swore nobody walked here at 23:15, yet others cross-referenced passing each other!",
        ko: "좁고 어두운 연결 복도. 메이드 천민은 아무 기척도 없었다고 장담했으나, 집사와 손님은 여기서 마주쳤다고 입증했습니다!"
      },
      'kitchen': {
        zh: "水槽和杂乱拖把抹布中，还留有余热。且 23:15 厨房龙头暴流七分钟的噪声，正是贼人行窃或掩饰行迹的完美屏障！",
        en: "The water tap was running high for 7 mins at 23:15, creating an accidental sensory masking shield to hide lock picking!",
        ko: "주방 하수 설비의 급격한 마모 흔적. 23:15 당시 7분간 퍼부은 물줄기가 거점 문을 따는 청각적 굉음을 감추어 주었습니다!"
      },
      'bedroom': {
        zh: "打碎的粉色台灯，被动过手脚的抽屉。韩小姐借口说戴着降噪耳戴，但医生却查明房间在关键时段空无一人。真是错漏！",
        en: "Smashed pink desk lamp, messy drawers. Ms. Han claims she wore soundproof caps, but the doctor found her quarters closed and empty!",
        ko: "침실 수색 중 산산조각 난 분홍색 스탠드 확인. 한양은 헤드폰을 써서 못 들었다고 하나, 의사는 그 시각 방이 비어있었다고 합니다."
      },
      'wine-cellar': {
        zh: "断电、死寂且漆黑的酒窖。陆医生狡辩在此避光盘点心脏试剂，但在拉闸瞎黑一团的地下，不照光他难道能隔空配药？",
        en: "Freezing pitch-dark cellar, tripped breaker. Dr. Lu claims he mixed cold doses here. But in dead darkness, how could he measure doses?",
        ko: "와인 창고의 차단기 총 전력 오프. 육 의사는 암실 약민을 가려내려 배합했다고 우기나, 한 치 앞도 안 보였을 창고에서 어떻게?"
      }
    };
    
    const activeThoughts = thoughts[activeScene]?.[language] || thoughts[activeScene]?.['zh'] || "思考中...";
    setDetectiveMindBubble(activeThoughts);
  };

  const triggerClueUnlockForHotspot = (hotspotId: string) => {
    if (!onUnlockContradiction) return;
    if (hotspotId === 'ki-faucet' || hotspotId === 'ki-sink') {
      onUnlockContradiction('clue-faucet-wear');
      onUnlockContradiction('clue-water-flow');
    } else if (hotspotId === 'be-lamp' || hotspotId === 'be-drawer') {
      onUnlockContradiction('clue-niece-headphones');
      onUnlockContradiction('clue-smashed-lamp');
    } else if (hotspotId === 'wc-db' || hotspotId === 'wc-med') {
      onUnlockContradiction('clue-dark-cellar');
      onUnlockContradiction('clue-doctor-wet-stain');
    } else if (hotspotId === 'lr-safe' || hotspotId === 'lr-sofa' || hotspotId === 'lr-fireplace') {
      onUnlockContradiction('clue-crossing-corridor');
      onUnlockContradiction('clue-maid-corridor');
    } else if (hotspotId === 'co-gallery' || hotspotId === 'co-stair') {
      onUnlockContradiction('clue-maid-corridor');
      onUnlockContradiction('clue-run-footstep');
    }
  };

  useEffect(() => {
    return () => {
      stopWaterSound();
    };
  }, []);

  useEffect(() => {
    stopWaterSound();
    setSelectedHotspot(null);
    setFaucetBranch('intro');
  }, [activeScene]);

  const handleRoomSelect = (sceneId: SceneId) => {
    playPaperFlipSound();
    onSceneChange(sceneId);
  };

  const handleThoroughSearch = () => {
    if (isSearchingRoom) return;
    setIsSearchingRoom(true);
    playPaperFlipSound();

    setTimeout(() => {
      setIsSearchingRoom(false);
      let outcome = "";
      if (activeScene === 'bedroom') {
        outcome = {
          zh: "你在韩雨欣有些杂乱的书橱和化妆包里好一顿搜查。翻到了未付清的贵族高阶留学分期账单，还有几枚带有慌乱擦拭印痕的粉色眼影折屑。该房间的现场物理指纹线索已被全部采集，并自动归入右侧的【侦探个人笔记】中！",
          en: "You searched through Ms. Han's cluttered closet and makeup pouch, finding the unpaid high tuition bill for studying abroad and remnants of hurried pink eyeshadow smears. All physical clues in this room have been successfully gathered and logged into your Notebook!",
          ko: "한우흔 양의 어수선한 책상과 화장품 가방을 샅샅이 검색한 결과, 납부 전액이 연체된 외국 명문대 유학 분할 청구서와 허겁지겁 닦아낸 흔적이 오롯이 남은 분홍색 섀도 안료 잔류물을 확인해 단서를 수사관 개인 수첩으로 자동 이첩시켰습니다!"
        }[language];
      } else if (activeScene === 'living-room') {
        outcome = {
          zh: "你仔细掀开古董真皮沙发垫底下、用拨火棍排查大客厅壁炉内的灰渣。翻出了保险柜底侧的偏门暗槽、细碎的甘菊红茶粉，以及周老板匆匆离开沙发时洒在桌脚的苏打水迹。房间的现场指纹线索皆已完美采集，并自动录入【侦探记事本】中！",
          en: "You carefully looked under the antique leather sofa cushions and sifted fireplace ash, revealing the safety deposit side-slot drawer, remnants of loose chamomile tea herbs, and soda stains from when Mr. Zhou stood up in a panic. All parlor clues have been logged into your Notebook!",
          ko: "구풍 가죽 소파 소품 밑판과 벽난로 불타버린 냉각 탄재를 샅샅이 갈퀴로 파헤친 결과, 보관함 우편의 측면 슬롯 홈, 국산 캐모마일 홍차 분말 및 주 사장이 기립 시 흘린 소다수 건조 흔적을 채집해 수사 수첩으로 송부 완료했습니다!"
        }[language];
      } else if (activeScene === 'corridor') {
        outcome = {
          zh: "你趴在大走廊羊毛红地毯和历代先人厚质油画边框沿线处反复探摸，发现油画背面有明显的金属钥匙挂碰擦。楼梯往上的第二级台阶边也有粘有后厨湿抹布脏污水迹的细小泥印。所有的廊道暗物证据已自动录入【侦探记事本】！",
          en: "Crawling along the hallway wool carpet and ancestor frames, you detected metal key friction marks behind the oil canvas, and damp water mud stains on the 2nd stair step. All corridor clues are successfully logged in your Notebook!",
          ko: "복도의 대형 선친 유화 액자 하단 면밀한 표면을 채취한 결과, 뒷면의 금속제 열쇠 쓸림 자국 및 주방 바닥 걸레 하수 자국과 완전 합치되는 미세 점토질 족적을 보존해 수사관 노트 앱으로 완전 자동 기장했습니다!"
        }[language];
      } else if (activeScene === 'kitchen') {
        outcome = {
          zh: "你把后厨的操作长台、备膳茶叶夹格以及汤灶旁边都仔细摸索过了一番，炉火边尚存甘菊干植物香。极废旧脏拖把和冷湿抹布中则藏匿着作案者最后的心理挣扎痕迹。所有灶台线索已全盘打包填入您的【侦探笔记本】！",
          en: "Searching the kitchen countertop, tea storage shelves and stove, you found residual chamomile aroma. Packed inside the damp rags and mop fibers was the suspect's final trace of struggle. All clues have been logged into your Notebook!",
          ko: "주방 요리 오퍼레이션 조리대, 수납 서랍장 및 가스 레인지 가를 탐색한 결과 가마솥 가리에 건조 국화 잔존 방향이 확인되었습니다. 폐걸레와 젖은 모포 속에서 급박한 범인의 범행 직동 징후를 채종해 탐서 노트에 밀패 고정 처리했습니다!"
        }[language];
      } else if (activeScene === 'wine-cellar') {
        outcome = {
          zh: "你细摸阴暗冰森酒柜陈列里配电总箱的每一个金属把手，并挪开了重重堆放的陈酿木桶。不仅捡到了医生由于炒海外期股欠下二十五万美元危局的诉斥黑账信，配电闸上还遗有推拉断电总闸的淡淡胶皮碎。全部酒地下室蛛丝马迹已自动存入【笔记本】！",
          en: "Scanning metal main power switch levers and deep rows of oak barrels on B1, you found the doctor's secret foreign investment debt letter (losing $250k) and plastic lever scrapings on the main cut-off gate. All wine-cellar clues have been archived to your Notebook!",
          ko: "음산한 배전반 전원 지렛대 손잡이 주위를 현미경 탐사하고 무거운 대량 와인 목통을 이동해보아, 주치의가 해외 비금융 투기 배상으로 직면한 25만불 공판 소송 채무 독촉장 및 차단 레버를 손가락으로 마찰 당겨 차단한 마찰 칩을 회수해 수첩에 각인 적립하였습니다!"
        }[language];
      }

      setSearchResult(outcome);
      playWritingSound();

      // Extract all hotspots for this scene automatically as a result of thorough searching
      const localizedHotspots = getLocalizedHotspots(language);
      const sceneHotspots = localizedHotspots[activeScene];
      sceneHotspots.forEach(hotspot => {
        if (!isExtracted[hotspot.id]) {
          setIsExtracted(prev => ({ ...prev, [hotspot.id]: true }));
          const suffix = {
            zh: '搜查发现：',
            en: ' discovered via searching: ',
            ko: ' 수색 발견 단서: '
          }[language];
          onAddCustomNote(hotspot.associatedNpc, `${hotspot.name}${suffix}${hotspot.description.slice(0, 160)}...`, hotspot.id);
        }
        triggerClueUnlockForHotspot(hotspot.id);
      });

    }, 1300);
  };

  const handleExtractClue = (hotspot: Hotspot) => {
    playWritingSound();
    setIsExtracted(prev => ({ ...prev, [hotspot.id]: true }));
    triggerClueUnlockForHotspot(hotspot.id);
    if (hotspot.id === 'ki-faucet') {
      const content = {
        zh: '【生铁水龙头23:15声音侧证】根据水龙头冷凝汽、防滑丝摩擦及积水深度，在23:15案发当刻，厨房水龙头曾被完全旋开释放出持续的喷薄激流声。这强烈的环境喧鸣音犹如听觉隔障，完美遮蔽了同时走廊上嫌犯惊慌仓皇逃回房间的「沉重脚步声」，为该脚步声提供了完美的物理环境侧证！',
        en: '[Water Tap 23:15 Acoustic Evidence] Based on metal temperature and thread wear, the kitchen faucet was wide-open at 23:15, generating heavy rushing water sound. This intense background racket perfectly masked the panicked, heavy footsteps of the suspect hurrying back up the corridor, providing a critical acoustic alibi debunk!',
        ko: '[수도꼭지 23:15 교차 음파 단서] 수조 내부 응기 및 밸브 나선 톳니 마모 상황으로 대조해 23:15 정점 무렵 주방 수돗문이 완전 최대로 해방되어 굉음을 내지른 음파 간극이 입증되었습니다. 이 세척수 격리는 거실을 기습해 범죄를 저지르고 복도를 뛰어올라가며 낸 치명적 발걸음 소리를 완벽히 은폐해주는 물리 음음 방벽 역할을 수행했습니다!'
      }[language];
      onAddCustomNote(hotspot.associatedNpc, content, hotspot.id);
    } else {
      const suffix = {
        zh: ' [玩家通过现场搜索获取铁证]',
        en: ' [Evidence retrieved by searching environment]',
        ko: ' [수사관 환경 탐사를 통한 인장 확립]'
      }[language];
      onAddCustomNote(hotspot.associatedNpc, `${hotspot.name}：${hotspot.description.slice(0, 150)}...${suffix}`, hotspot.id);
    }
  };

  const localizedNpcList = getLocalizedNpcDataList(language, culpritId);
  const localizedHotspotsMap = getLocalizedHotspots(language);
  const roomAdjacencyMap = getLocalizedRoomAdjacency(language);

  return (
    <div 
      id="scene-explorer-root" 
      className="relative flex-1 flex flex-col min-h-[460px] h-full rounded-2xl overflow-hidden border-4 border-slate-700 border-double bg-slate-900 shadow-[0_0_25px_rgba(0,0,0,0.5)]"
      style={{
        boxShadow: 'inset 0 0 50px rgba(0, 20, 30, 0.45)'
      }}
    >
      {/* 1. Cinematic Background Layer with Scanline overlay & Vignette */}
      <div
        id="scene-bg-layer"
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out filter brightness-[0.75] saturate-[0.85]"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.25), rgba(15, 23, 42, 0.5)), url('${currentSceneData.bg}')`,
          backgroundColor: '#1e293b'
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(15,23,42,0.5))] pointer-events-none z-10" />
      
      {/* Cool 2D game scanline filter */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />

      {/* 1.5. Spatial Arrow Navigation (Top, Bottom, Left, Right) */}
      {(() => {
        const adj = roomAdjacencyMap[activeScene];
        return (
          <>
            {/* UP BUTTON */}
            {adj.up && (
              <button
                onClick={() => handleRoomSelect(adj.up.id)}
                className="absolute top-[82px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center group bg-slate-950/85 hover:bg-cyan-950/90 border border-slate-800 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 py-1.5 px-4 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all hover:scale-105 duration-200 cursor-pointer text-[10px]"
              >
                <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform mb-0.5" />
                <span className="text-[7.5px] uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 font-mono font-bold leading-none">
                  {language === 'en' ? 'GO UPSTAIRS' : language === 'ko' ? '계단 오르기' : '登楼 UP'}
                </span>
                <span className="font-sans text-[10px] mt-0.5 leading-none">{adj.up.label}</span>
              </button>
            )}

            {/* DOWN BUTTON */}
            {adj.down && (
              <button
                onClick={() => handleRoomSelect(adj.down.id)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center group bg-slate-950/85 hover:bg-cyan-950/90 border border-slate-800 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 py-1.5 px-4 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all hover:scale-105 duration-200 cursor-pointer text-[10px]"
              >
                <span className="font-sans text-[10px] mb-0.5 leading-none">{adj.down.label}</span>
                <span className="text-[7.5px] uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 font-mono font-bold leading-none">
                  {language === 'en' ? 'GO DOWNSTAIRS' : language === 'ko' ? '지하로 하향' : '下楼 DOWN'}
                </span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform mt-0.5" />
              </button>
            )}

            {/* LEFT BUTTON */}
            {adj.left && (
              <button
                onClick={() => handleRoomSelect(adj.left.id)}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex flex-row items-center group bg-slate-950/85 hover:bg-cyan-950/90 border border-slate-800 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 py-3 px-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all hover:scale-105 duration-200 cursor-pointer text-[10px]"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform mr-1" />
                <div className="flex flex-col items-start">
                  <span className="text-[7.5px] uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 font-mono font-bold leading-none">
                    {language === 'en' ? 'GO LEFT' : language === 'ko' ? '외곽 왼쪽 이동' : '左移 LEFT'}
                  </span>
                  <span className="font-sans text-[10px] mt-0.5 leading-none">{adj.left.label}</span>
                </div>
              </button>
            )}

            {/* RIGHT BUTTON */}
            {adj.right && (
              <button
                onClick={() => handleRoomSelect(adj.right.id)}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-row items-center group bg-slate-950/85 hover:bg-cyan-950/90 border border-slate-800 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 py-3 px-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all hover:scale-105 duration-200 cursor-pointer text-[10px]"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[7.5px] uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 font-mono font-bold leading-none text-right">
                    {language === 'en' ? 'GO RIGHT' : language === 'ko' ? '우측 입구 진입' : '右移 RIGHT'}
                  </span>
                  <span className="font-sans text-[10px] mt-0.5 leading-none text-right">{adj.right.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform ml-1" />
              </button>
            )}
          </>
        );
      })()}

      {/* 2. Top Bar for Scene Metadata */}
      <div className="relative z-20 p-3.5 bg-slate-950/90 border-b border-cyan-950/60 backdrop-blur-md flex items-center justify-between">
        <div id="scene-meta-name">
          <span className="text-[9px] uppercase tracking-widest text-[rgba(34,211,238,0.85)] font-mono font-black block animate-pulse">
            {language === 'en' ? '🕵️‍♂️ DOSSIER SECTOR · Forensic Room Scan' : language === 'ko' ? '🕵️‍♂️ DOSSIER SECTOR · 별장 물리 과학 수사 구역' : '🕵️‍♂️ DOSSIER SECTOR · 墅内空间极密勘察'}
          </span>
          <h2 className="text-base sm:text-lg font-extrabold font-sans text-slate-100 flex items-center gap-1.5 animate-fade-in">
            <Compass className="w-4 h-4 text-cyan-400 rotate-12" />
            {currentSceneData.name} {currentSceneData.npcs.length > 0 && (
              <span className="text-[10px] text-slate-400 font-normal">
                {language === 'en' ? ' (Available suspects here: ' : language === 'ko' ? ' (대화 가능한 용의자: ' : '（当前可对话案员: '}
                {currentSceneData.npcs.map((id: NpcId) => localizedNpcList.find(n => n.id === id)?.name).join(language === 'en' ? ', ' : '、')}
                {language === 'en' ? ')' : '）'}
              </span>
            )}
          </h2>
        </div>
        <div className="text-[10px] text-cyan-500 font-mono text-right max-w-[320px] hidden sm:block leading-tight bg-cyan-950/30 px-3 py-1 border border-cyan-800/20 rounded">
          {activeScene === 'living-room' && (language === 'en' ? '📝 Lobby: safety key lock triggers, whiskey smell.' : language === 'ko' ? '📝 응접거실: 홍목형 열쇠 훼손, 위스키 냄새 진동.' : '📝 沙龙客厅: 红木柜锁藏匿副钥匙，有威士忌酒气。')}
          {activeScene === 'corridor' && (language === 'en' ? '📝 Central Hall: routs upstairs. Tilted portraits.' : language === 'ko' ? '📝 중앙벽랑: 2F 승강로. 조상님들 유화가 기울어짐.' : '📝 公用长廊: 通往二楼。挂有先人歪歪扭扭的厚重画幅。')}
          {activeScene === 'kitchen' && (language === 'en' ? '🧊 Cooking kitchen: dry boiling kettle, leaky pipe.' : language === 'ko' ? '🧊 내부식주방: 차솥 수증기 폭발. 수조 문 뒤 습한 걸레 축적.' : '🧊 膳用后房: 灶火开水泛溢。深藏极其浓厚的滴水水槽底厨。')}
          {activeScene === 'bedroom' && (language === 'en' ? '📝 Chamber: messy room, shattered lamp.' : language === 'ko' ? '📝 침실처소: 한우흔 침대. 쓰러져 만개한 전등. 유학 서류.' : '📝 侄女卧室: 凌乱不堪，砸有倾砸粉碎台灯。学费拖延。')}
          {activeScene === 'wine-cellar' && (language === 'en' ? '🍇 Wine Cellar: main breaker off, black letters hidden.' : language === 'ko' ? '🍇 지하동굴: 메인 전력 셧다운. 닥터 부채 공문 확보.' : '🍇 地下酒库: 大闸拉断，冷柜内藏匿有极秘黑账户信。')}
        </div>
      </div>

      {/* 3. Main Exploration Stage Area with absolute positioned hotspots overlay */}
      <div className="relative z-10 flex-1 flex flex-col justify-between p-4 min-h-[300px]">
        
        {/* Hotspots Container inside the active viewport */}
        <div className="absolute inset-x-0 bottom-24 top-16 pointer-events-none z-30">
          {localizedHotspotsMap[activeScene].map((hotspot) => {
            const hasDiscovered = isExtracted[hotspot.id];
            
            return (
              <div
                key={hotspot.id}
                className="absolute pointer-events-auto"
                style={{ top: hotspot.top, left: hotspot.left }}
              >
                {/* Visual Pulsing Point */}
                <button
                  onClick={() => {
                    playSearchExploreSound();
                    setSelectedHotspot(hotspot);
                  }}
                  className={`relative group w-6.5 h-6.5 rounded-full flex items-center justify-center transition-all shadow-[0_0_12px_rgba(34,211,238,0.5)] border cursor-pointer select-none ${
                    hasDiscovered
                      ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-400'
                      : hotspot.id === 'ki-sink'
                      ? 'bg-rose-950/90 border-rose-500/60 text-rose-400 animate-pulse'
                      : 'bg-cyan-950/90 border-cyan-500/60 text-cyan-450 hover:bg-cyan-900'
                  }`}
                  title={language === 'en' ? `Investigate closely: ${hotspot.name}` : language === 'ko' ? `집중 탐사: ${hotspot.name}` : `仔细调查: ${hotspot.name}`}
                >
                  <span className={`absolute -inset-1.5 rounded-full border border-dotted opacity-0 group-hover:opacity-100 transition-opacity animate-spin-slow ${
                    hasDiscovered ? 'border-emerald-500/40' : 'border-cyan-500/40'
                  }`} />
                  {hotspot.id === 'ki-sink' ? (
                    <Search className="w-3 h-3 text-rose-400" />
                  ) : (
                    <Fingerprint className="w-3.5 h-3.5 transform group-hover:scale-110 transition-transform" />
                  )}
                  
                  {/* Subtle clean label */}
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 opacity-0 group-hover:opacity-100 bg-slate-950/95 border border-slate-800 text-[9px] text-slate-200 px-2 py-0.5 rounded shadow-xl whitespace-nowrap transition-all duration-300 pointer-events-none font-mono">
                    🔎 {hotspot.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Scene Narrative Box / Prompt */}
        <div className="relative max-w-xl mx-auto w-full text-center bg-slate-950/90 border-double border-4 border-slate-900 p-3 rounded-lg backdrop-blur shadow-2xl z-20 mt-1 select-none">
          <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed font-sans font-light">
            {currentSceneData.description}
          </p>
          <div className="mt-1 flex items-center justify-center space-x-1.5 text-[8.5px] font-mono text-cyan-500 uppercase tracking-widest font-black animate-pulse">
            <Sparkles className="w-2.5 h-2.5" />
            <span>
              {language === 'en' 
                ? `The environment hides ${localizedHotspotsMap[activeScene].length} miniature physics clues` 
                : language === 'ko'
                ? `이 구역에는 고정밀 물리 단서 ${localizedHotspotsMap[activeScene].length}개가 잔류 중입니다`
                : `环境边缘藏匿有 ${localizedHotspotsMap[activeScene].length} 处微型细节指纹线索`}
            </span>
          </div>

          {/* New 2D room-level thorough search trigger button */}
          <button
            onClick={handleThoroughSearch}
            disabled={isSearchingRoom}
            className="mt-2 text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 hover:bg-cyan-900/40 px-4 py-1 flex items-center justify-center gap-1 text-[11px] font-mono font-bold tracking-wider rounded-md cursor-pointer transition mx-auto hover:text-white"
          >
            {isSearchingRoom ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            {isSearchingRoom ? (
              language === 'en' ? 'Searching cabinets and closets...' : language === 'ko' ? '방 안의 서랍까지 샅샅이 뒤지는 중...' : '正在房间翻箱倒柜中...'
            ) : (
              language === 'en' ? '🔍 Thoroughly Search Current Room' : language === 'ko' ? '🔍 이 방을 샅샅이 뒤져 정밀 수색' : '🔍 翻箱倒柜彻底搜查当前房间'
            )}
          </button>
        </div>

        {/* 4. Clickable character cards list */}
        <div id="characters-container" className="my-auto py-3 z-10 relative flex justify-center items-center">
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-14 pt-3">
            
            {/* 🕵️‍♂️ Detective Player Standee Card representing movement system */}
            <motion.div
              key="detective-player-card"
              id="npc-card-detective"
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDetectiveClick}
              className="relative flex flex-col justify-end items-center cursor-pointer select-none transition-all group shrink-0 border border-amber-500/30 rounded-2xl bg-gradient-to-b from-amber-955/10 to-slate-950/90 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:border-amber-400/60"
              style={{ width: '270px', height: '410px' }}
            >
              <AnimatePresence>
                {detectiveMindBubble && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute bottom-56 inset-x-2 z-35 bg-amber-50 border border-amber-200 text-amber-950 px-3.5 py-3 rounded-xl shadow-2xl text-[10px] leading-relaxed font-sans text-left after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-amber-50"
                  >
                    <span className="font-bold block border-b border-amber-200 pb-0.5 mb-1 font-serif text-[9px] uppercase tracking-wider text-amber-900">
                      💭 {language === 'en' ? 'PROTAGONIST MONOLOGUE' : language === 'ko' ? '탐정의 독백 심리 분석' : '侦探思维独白'}
                    </span>
                    {detectiveMindBubble}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-24 w-44 h-4.5 bg-slate-950/90 rounded-full border border-amber-900/20 pointer-events-none group-hover:bg-amber-950/40 group-hover:border-amber-800/30 transition-colors" />

              <div className="absolute inset-x-0 bottom-24 top-0 flex flex-col justify-end overflow-visible">
                <img
                  src={(isPendantFound || currentStage === 'conclude' || currentStage === 'ending') ? DRIVE_IMAGES.playerConfident : DRIVE_IMAGES.playerDetective}
                  alt="Detective"
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full mx-auto object-contain filter drop-shadow-[0_14px_22px_rgba(0,0,0,1)] brightness-[0.9] group-hover:brightness-110 active:brightness-125 transition-all duration-300 select-none pb-2"
                />
              </div>

              <div className="absolute bottom-0 inset-x-0 z-20 flex flex-col items-center pointer-events-none">
                <div className="bg-slate-950/95 border border-amber-500/30 group-hover:border-amber-400 px-2.5 py-1.5 rounded-lg shadow-2xl flex flex-col items-center space-y-0.5 w-[98%] transition-colors duration-300">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-xs font-black text-amber-200 transition-colors font-sans">
                      {language === 'en' ? 'Me (Detective)' : language === 'ko' ? '나 (탐정 수사관)' : '你 (侦探探长)'}
                    </span>
                    <span className="inline-block px-1 py-0.2 text-[8px] font-black bg-amber-950 text-amber-400 border border-amber-900/30 rounded font-mono">
                      {language === 'en' ? 'PROTAGONIST' : language === 'ko' ? '주인공' : '角色主角'}
                    </span>
                  </div>

                  <div className="w-full space-y-1.5 pt-1 border-t border-slate-900 text-left">
                    <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 leading-tight">
                      <span>📍 {language === 'en' ? 'POSITION' : language === 'ko' ? '현재 위치' : '当前位置'}</span>
                      <span className="text-amber-300 font-bold">{localizedScenes[activeScene]?.name || activeScene}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 leading-tight">
                      <span>👥 {language === 'en' ? 'SUSPECTS' : language === 'ko' ? '대면 상대' : '互动对象'}</span>
                      <span className="text-slate-100 truncate max-w-[120px]">
                        {currentSceneData.npcs.length > 0 
                          ? currentSceneData.npcs.map(id => localizedNpcList.find(n => n.id === id)?.name || id).join(', ')
                          : (language === 'en' ? 'None (Scanning)' : language === 'ko' ? '없음 (정밀수사)' : '自主搜查现场')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 leading-tight">
                      <span>💼 {language === 'en' ? 'CURRENT TASK' : language === 'ko' ? '수사 임무' : '当前事件'}</span>
                      <span className="text-amber-400 truncate max-w-[124px]">
                        {currentStage === 'conclude' || currentStage === 'ending'
                          ? (language === 'en' ? 'Final Accusation' : language === 'ko' ? '최종 진범 연행' : '锁紧真凶结案')
                          : currentSceneData.npcs.length > 0 
                          ? (language === 'en' ? 'Interrogation' : language === 'ko' ? '정밀 심궁 돌파' : '突破嫌疑人防御')
                          : (language === 'en' ? 'Forensic Audit' : language === 'ko' ? '잔류 증거 조사' : '翻箱捣柜查细节')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Suspects in the room */}
            {currentSceneData.npcs.map((npcId: NpcId) => {
              const npc = localizedNpcList.find(n => n.id === npcId);
              if (!npc) return null;
              const emotion = emotionStates[npcId] || 0;

              let emotionColorClass = 'bg-cyan-500 shadow-cyan-950/30';
              
              const emotionText = {
                zh: emotion >= 75 ? '崩溃痛哭 · 交代底牌' : emotion >= 45 ? '警觉抵抗 · 抱紧胳膊' : '极其冷静',
                en: emotion >= 75 ? 'Mental Breakdown · Disclosing Secrets' : emotion >= 45 ? 'Defensive & Guarded' : 'Extremely Calm',
                ko: emotion >= 75 ? '심리 완전 멘탈 붕괴 · 진조 자백' : emotion >= 45 ? '경고 저항세 · 심리 팔짱 수비' : '매우 포커페이스 차분함'
              }[language];

              if (emotion >= 75) {
                emotionColorClass = 'bg-rose-500 shadow-rose-950/40 animate-pulse';
              } else if (emotion >= 45) {
                emotionColorClass = 'bg-amber-500 shadow-amber-950/30';
              }

              return (
                <motion.div
                  key={npc.id}
                  id={`npc-card-${npc.id}`}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNpcSelect(npc.id)}
                  className="relative flex flex-col justify-end items-center cursor-pointer select-none transition-all group shrink-0"
                  style={{ width: '270px', height: '410px' }}
                >
                  {/* Shadow underneath */}
                  <div className="absolute bottom-24 w-44 h-4.5 bg-slate-950/90 rounded-full border border-slate-900 pointer-events-none group-hover:bg-cyan-950/40 group-hover:border-cyan-800/30 transition-colors" />

                  {/* NPC Standing Portrait - scaled up! */}
                  <div className="absolute inset-x-0 bottom-24 top-0 flex flex-col justify-end overflow-visible">
                    <img
                      src={(emotion >= 75 && npc.outburstAvatar) ? npc.outburstAvatar : npc.avatar}
                      alt={npc.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-auto max-w-none mx-auto object-contain filter drop-shadow-[0_14px_22px_rgba(0,0,0,1)] brightness-[0.8] group-hover:brightness-105 group-hover:drop-shadow-[0_0_18px_rgba(34,211,238,0.45)] transition-all duration-300 select-none pb-2"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallbackNode = e.currentTarget.parentElement?.querySelector('.avatar-placeholder');
                        if (fallbackNode) fallbackNode.classList.remove('hidden');
                      }}
                    />
                    <div className="avatar-placeholder hidden absolute inset-x-2 bottom-0 top-10 flex flex-col justify-center items-center bg-slate-900 border border-slate-800 text-white rounded-xl">
                      <span className="w-12 h-12 rounded-full bg-slate-850 flex items-center justify-center text-cyan-400 font-extrabold text-sm mb-1">
                        {npc.name[0]}
                      </span>
                      <span className="text-[9px] tracking-widest text-slate-400 font-mono">
                        {npc.roleName}
                      </span>
                    </div>
                  </div>

                  {/* Low-Saturation 2D-Game UI info capsules */}
                  <div className="absolute bottom-0 inset-x-0 z-20 flex flex-col items-center pointer-events-none">
                    <div className="bg-slate-950/95 border border-slate-900 group-hover:border-cyan-500/50 px-2.5 py-1.5 rounded-lg shadow-2xl flex flex-col items-center space-y-0.5 w-[98%] transition-colors duration-300">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                        <span className="text-xs font-black text-slate-150 group-hover:text-cyan-400 transition-colors font-sans">
                          {npc.name}
                        </span>
                        <span className="inline-block px-1 py-0.2 text-[8px] font-black bg-cyan-950 text-cyan-400 border border-cyan-900/30 rounded font-mono">
                          {npc.roleName}
                        </span>
                      </div>

                      <div className="w-full space-y-1.5 pt-1 border-t border-slate-900">
                        <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 leading-none">
                          <span>{emotionText}</span>
                          <span className={emotion >= 75 ? 'text-rose-400' : emotion >= 45 ? 'text-amber-400' : 'text-cyan-400'}>
                            {emotion}%
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${emotionColorClass}`}
                            style={{ width: `${emotion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* CLUE MODAL DRAWER OVERLAY */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            id="clue-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/90 z-40 backdrop-blur-sm p-4 flex items-center justify-center animate-fade-in"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-md w-full bg-slate-900 border-double border-4 border-cyan-800/60 rounded-xl p-4.5 text-slate-250 shadow-[0_0_35px_rgba(34,211,238,0.3)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-1.5 text-cyan-400 text-xs font-mono tracking-widest font-extrabold uppercase">
                    <Fingerprint className="w-4 h-4 text-cyan-550" />
                    <span>
                      {language === 'en' ? 'CASE INVESTIGATION FILE · Forensic Scan' : language === 'ko' ? 'CASE INVESTIGATION FILE · 사건 실황 수사 실록' : 'CASE INVESTIGATION FILE · 现场搜查实录'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedHotspot(null);
                      setFaucetBranch('intro');
                      stopWaterSound();
                    }}
                    className="text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-white transition cursor-pointer bg-slate-950/40 border border-slate-800 px-2 py-0.5 rounded"
                  >
                    {language === 'en' ? 'Close ESC' : language === 'ko' ? '닫기 ESC' : '关闭 ESC'}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 mb-2 font-sans underline decoration-cyan-500/50 decoration-2">
                  🕵️‍♂️ {language === 'en' ? 'Scene Spot: ' : language === 'ko' ? '현장 단서 거점: ' : '现场勘点: '} {selectedHotspot.name}
                </h3>

                {selectedHotspot.id === 'ki-faucet' ? (
                  <div className="space-y-3 mt-2 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 animate-fade-in text-[11px]">
                    {faucetBranch === 'intro' && (
                      <div className="space-y-3">
                        <p className="text-slate-300 leading-relaxed font-sans font-light">
                          {selectedHotspot.description}
                        </p>
                        <div className="h-px bg-slate-800/50 my-1" />
                        <p className="text-[9.5px] uppercase tracking-wider text-cyan-400 font-bold font-mono">
                          {language === 'en' ? '💬 Select investigation or spatial deductor branch:' : language === 'ko' ? '💬 대조 분석을 위한 정립 검문 분기를 선택하십시오:' : '💬 点击选择调查/推演分支（按回音重建声场）：'}
                        </p>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              playSearchExploreSound();
                              setFaucetBranch('listen');
                              playWaterSound();
                            }}
                            className="w-full text-left bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-cyan-405 border border-slate-800 p-2 rounded text-[10px] font-sans transition flex items-center justify-between cursor-pointer"
                          >
                            <span>
                              {language === 'en' 
                                ? '🎧 [Sound Test] Reconstruct faucet water acoustics from 23:15' 
                                : language === 'ko'
                                ? '🎧 [음향 재현] 23:15 시점 주방 수돗물 밸브 굉음 재생'
                                : '🎧 [声音测试] 物理重演 23:15 期间龙头阀门水流声响'}
                            </span>
                            <span className="text-[9px] text-cyan-500 font-bold font-mono">
                              {language === 'en' ? 'Investigate' : language === 'ko' ? '분석' : '🔍 探明'}
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              playSearchExploreSound();
                              setFaucetBranch('deduced');
                            }}
                            className="w-full text-left bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-cyan-405 border border-slate-800 p-2 rounded text-[10px] font-sans transition flex items-center justify-between cursor-pointer"
                          >
                            <span>
                              {language === 'en' 
                                ? '💡 [Spatial Deduction] How water noise masked corridor footsteps' 
                                : language === 'ko'
                                ? '💡 [시공간 추론] 급류 소음과 복도 발소리 차폐 연계성 검증'
                                : '💡 [时空推演] 哗哗水声与走廊「脚步声」的遮蔽吻合推论'}
                            </span>
                            <span className="text-[9px] text-cyan-500 font-bold font-mono">
                              {language === 'en' ? 'Analyze' : language === 'ko' ? '고찰' : '🧠 剖析'}
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              playSearchExploreSound();
                              setFaucetBranch('witness');
                            }}
                            className="w-full text-left bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-cyan-405 border border-slate-800 p-2 rounded text-[10px] font-sans transition flex items-center justify-between cursor-pointer"
                          >
                            <span>
                              {language === 'en' 
                                ? '⚖️ [Testimony Check] Killer psychology: creating an acoustic barrier' 
                                : language === 'ko'
                                ? '⚖️ [진술 대조] 의도적으로 청각 방벽망을 설치한 범행 심층 동기'
                                : '⚖️ [证言比照] 故意制造听觉屏障的犯罪心理动机'}
                            </span>
                            <span className="text-[9px] text-cyan-500 font-bold font-mono">
                              {language === 'en' ? 'Cross-Examine' : language === 'ko' ? '정리' : '📜 审订'}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {faucetBranch === 'listen' && (
                      <div className="space-y-2.5 animate-fade-in">
                        <div className="bg-cyan-950/25 border border-cyan-800/30 p-2 rounded text-[10px] text-cyan-400 font-mono uppercase font-black tracking-widest flex items-center gap-1.5 select-none">
                          <span className="animate-pulse">🔊</span> 
                          {language === 'en' ? '23:15 Acoustic Replay · Fluid Simulator' : language === 'ko' ? '23:15 음향 환경 복원 · 수류 가동' : '23:15 声学环境复盘 · 水流模拟'}
                        </div>
                        <p className="text-slate-300 leading-relaxed font-sans font-light">
                          {language === 'en' ? (
                            'You release the valve. Rust pipes rattle fiercely as a deluge of deafening water hits the steel box, echoing throughout the kitchen.\n\nAccording to sediment levels, between 23:15 and 23:22, the faucet was fully opened for a continuous seven minutes instead of leaking!'
                          ) : language === 'ko' ? (
                            '밸브를 열자 녹슨 도관이 요동치며 식기 대야를 매섭게 때리는 우레 같은 격류가 쏟아져 귀를 먹먹하게 만듭니다.\n\n조사 결과, 23:15~23:22 사이에 수도꼭지는 원래 완전 개방되어 약 7분간 최대 수압으로 급류를 내려온 흔적이 확인되었습니다!'
                          ) : (
                            '你拧开龙头。生锈的管道猛烈震荡，排出一长串混水后，大股哗哗激流在不锈钢水槽内撞击，震耳欲聋。根据水槽边缘残余的水线及滤网沉淀微粒层受力分析——在 23:15 到 23:22 期间，厨房的水龙头并没有像现在这样漏水滴答，而是曾被拉到底拧开，持续泄洪吐水足足七分钟！'
                          )}
                        </p>
                        <button
                          onClick={() => {
                            playPaperFlipSound();
                            setFaucetBranch('intro');
                            stopWaterSound();
                          }}
                          className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white px-2 py-1 text-[9px] font-mono tracking-wider rounded cursor-pointer animate-fade-in"
                        >
                          {language === 'en' ? '← Back' : language === 'ko' ? '← 이전 단계' : '← 返回上一层'}
                        </button>
                      </div>
                    )}

                    {faucetBranch === 'deduced' && (
                      <div className="space-y-2.5 animate-fade-in">
                        <div className="bg-amber-950/30 border border-amber-800/20 p-2 rounded text-[10px] text-amber-400 font-mono uppercase font-black tracking-widest flex items-center gap-1.5 select-none">
                          <span>🧠</span> 
                          {language === 'en' ? 'Acoustic Masking Deduction · Covering Footsteps' : language === 'ko' ? '청역 차단 추리 · 발소리 엄폐 구도' : '听觉遮蔽推衍 · 掩护“脚步声”'}
                        </div>
                        <p className="text-slate-300 leading-relaxed font-sans font-light">
                          {language === 'en' ? (
                            'The kitchen is separated from the side hallway and Ms. Han\'s staircase by a thin wall section. Rushing water acoustics will bounce and swallow footsteps echoing at the corridor corner!\n\n[Spatial Proof]: Suspect testimonies mentioned hearing hurried footprints. This rushing water served as a physical noise-canceler masking the thief fleeing upstairs!'
                          ) : language === 'ko' ? (
                            '주방 전용 통로는 카펫이 깔린 1층 측면 계단 및 복도 통각지와 격막 하나로 밀착되어, 주방 소음은 파동 마찰로 주변 통로의 발걸음 자극을 삼킵니다.\n\n[공간 검증]: 주변인들은 23:15경 기묘한 발소리를 들었으나 주방 우레 소리에 묻혀 희석되었고, 결국 수돗물 방벽이 진범의 허겁지겁 도주를 완전 엄폐했음을 의미합니다!'
                          ) : (
                            '厨房与侧廊的大红地毯、通往二楼卧房的台阶仅一厚重隔断相连，此处的巨量水响，在声波折射中会把侧廊拐角处的动静高度吞噬！【环境侧证确立】：访客和女佣曾口供说在 23:15 后有串惊急粗重的“跑步脚步声”。那串大步攀梯的异动绝未引起大厅注意，正是因为这突兀的水流巨响，为这一极其致命暴露的脚步声充当了物理降噪遮盖物！'
                          )}
                        </p>
                        <button
                          onClick={() => {
                            playPaperFlipSound();
                            setFaucetBranch('intro');
                          }}
                          className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white px-2 py-1 text-[9px] font-mono tracking-wider rounded cursor-pointer animate-fade-in"
                        >
                          {language === 'en' ? '← Back' : language === 'ko' ? '← 이전 단계' : '← 返回上一层'}
                        </button>
                      </div>
                    )}

                    {faucetBranch === 'witness' && (
                      <div className="space-y-2.5 animate-fade-in">
                        <div className="bg-rose-950/30 border border-rose-800/25 p-2 rounded text-[10px] text-rose-400 font-mono uppercase font-black tracking-widest flex items-center gap-1.5 select-none">
                          <span>📜</span> 
                          {language === 'en' ? 'Acoustic Trap Logic · Sidetrack Corrobation' : language === 'ko' ? '청각 트랩과 은폐용 공작 심리 성찰' : '嫌犯听觉陷阱逻辑 · 侧翼旁证'}
                        </div>
                        <p className="text-slate-300 leading-relaxed font-sans font-light">
                          {language === 'en' ? (
                            'At 23:15, the butler left empty boilers drying whilst the faucet was turned to its absolute peak. Combined with the thief safe-cracking and escaping, heavy panting and shoes sliding were inevitable. This acoustic trap served as an acoustic barrier to hide the truth!'
                          ) : language === 'ko' ? (
                            '23:15 경, 집사는 보일러 용수를 수동 방치했고 주방 밸브는 최대 한도로 전개되어 있었습니다. 진범이 거실 수납함에서 진주를 절취 및 도주하는 긴박한 경로에서 수돗소리가 청각 방호막 역할을 구사했습니다!'
                          ) : (
                            '在 23:15 该秒。管家擅自空着开水锅，而龙头又被完全开大——结合罪犯从客厅开锁夺去翡翠，疯狂逃匿中必然产生沉重喘气与鞋面摩擦声。作案人或故意设置了这一“流水雷鸣”作为声音隔离屏障，或急行逃匿时慌手慌脚在后厨洗抹布而忘关。这无悬念佐证了 23:15 这个时间差大案确实在疯狂进行，而非众人坚称的不出房、无人的假象！'
                          )}
                        </p>
                        <button
                          onClick={() => {
                            playPaperFlipSound();
                            setFaucetBranch('intro');
                          }}
                          className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white px-2 py-1 text-[9px] font-mono tracking-wider rounded cursor-pointer animate-fade-in"
                        >
                          {language === 'en' ? '← Back' : language === 'ko' ? '← 이전 단계' : '← 返回上一层'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-light select-text">
                    {selectedHotspot.description}
                  </p>
                )}
              </div>

              {/* Special condition action drawers */}
              <div className="mt-4.5 pt-3 border-t border-slate-800/80">
                {selectedHotspot.id === 'ki-sink' ? (
                  /* Custom Sink finding handler inside modal */
                  <div className="space-y-2">
                    <p className="text-[9.5px] italic text-rose-450 mb-1.5 leading-snug">
                      {language === 'en' 
                        ? '* Hints: To seize the stolen goods, (1) you must break the 23:15 contradiction and (2) push the culprit\'s emotion above 70% in interrogation to make them confess.' 
                        : language === 'ko'
                        ? '* 팁: 진범 장물을 환수하려면 (1) 23:15 알리바이 모순을 입증하고 (2) 대화를 통해 진범의 정서(Emotion)를 70% 이상 도발 및 붕괴시켜 은닉 위치를 자백받아야 합니다.'
                        : '* 提示: 寻获赃物需要：(1)已经破获 23:15 悖论线索 (2)嫌犯情绪被高压逼供逼哭至 70% 以上以交代水槽底端的细节层。'}
                    </p>
                    {isPendantFound ? (
                      <div className="flex flex-col items-center space-y-3">
                        <div className="bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 p-2.5 rounded-lg text-xs font-semibold leading-relaxed text-center font-mono w-full">
                          {language === 'en' 
                            ? '🎉 Seized Success! The stolen emerald pendant "Eye of Night Raven" has been secured into the indictment.' 
                            : language === 'ko'
                            ? '🎉 장물 압수 성공! 분실된 에메랄드 펜던트 "밤까마귀의 눈"을 확보해 증거 목록에 보관했습니다!'
                            : '🎉 起赃完美大捷！翡翠吊坠“夜鸦之眼”已缴入起诉案卷。'}
                        </div>
                        <div className="relative w-40 h-40 bg-slate-950 border border-emerald-500/30 rounded-2xl overflow-hidden p-2 flex items-center justify-center shadow-lg shadow-emerald-950/40">
                          <img
                            src="https://lh3.googleusercontent.com/d/1sNh9Jq9qcvrKV66VO55tIPLBaUiSs9KJ"
                            alt={language === 'en' ? 'Emerald Pendant' : language === 'ko' ? '에메랄드 펜던트' : '古董绿翡翠吊坠'}
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                          />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onSearchKitchen();
                          setSelectedHotspot(null);
                        }}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-4 py-2.5 rounded-lg shadow-lg cursor-pointer transition active:scale-95"
                      >
                        {language === 'en' ? '⚡ Search Kitchen Sink Cabinet' : language === 'ko' ? '⚡ 싱크대 수조 내부 샅샅이 뒤지기' : '⚡ 探摸翻找厨房水槽'}
                      </button>
                    )}
                  </div>
                ) : (
                  /* Standard clue extraction into notepad notes */
                  <div className="flex flex-col gap-2">
                    {isExtracted[selectedHotspot.id] ? (
                      <div className="bg-cyan-950/30 text-cyan-400 border border-cyan-800/20 text-center p-2 rounded text-[10px] font-mono select-none">
                        {language === 'en' 
                          ? '☑️ Case forensic file registered to your Detective Notebook on the right!' 
                          : language === 'ko'
                          ? '☑️ 이 사건 현장 단서가 우측의 [수사관 수목첩]에 정상 등록 처리되었습니다.'
                          : '☑️ 该勘查铁证资料已完美汇录至您右侧的 【侦探笔记】 中，开庭可考。'}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleExtractClue(selectedHotspot)}
                        className="w-full flex items-center justify-center space-x-1 border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900 text-cyan-400 font-bold text-xs py-2 rounded-lg cursor-pointer hover:text-white transition active:scale-95 animate-fade-in"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>
                          {language === 'en' 
                            ? '📝 Log Above Clue into Cases Notebook' 
                            : language === 'ko'
                            ? '📝 상기 채집 단서를 수사관 개인 수첩에 수록'
                            : '📝 将上述勘查疑据记录存入案卷笔记本'}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2D-Game style Room Rummage Result Modal */}
      <AnimatePresence>
        {searchResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 z-50 p-4 flex items-center justify-center backdrop-blur-sm animate-fade-in"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-md w-full bg-slate-900 border-double border-4 border-cyan-800 rounded-xl p-5 text-slate-200 shadow-[0_0_40px_rgba(34,211,238,0.25)] ring-1 ring-cyan-500/20"
            >
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest border-b border-cyan-900 pb-2 mb-3">
                <Search className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>RUMMAGE ENVIRONMENT · {language === 'en' ? 'Forensic Area Progress' : language === 'ko' ? '정밀 수색 진척' : '搜查全境取得进展'}</span>
              </div>
              <h4 className="text-sm font-extrabold text-white mb-2 underline decoration-cyan-500 decoration-2">
                🔎 {language === 'en' ? 'Detailed Rummage Result' : language === 'ko' ? '방 전체 모색 결과 대조' : '🔎 深度搜索结果反馈'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-850 font-sans font-light select-text">
                {searchResult}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSearchResult(null)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-slate-950 font-black text-xs px-5 py-2 rounded-lg cursor-pointer transition active:scale-95"
                >
                  {language === 'en' ? 'Got it, logged into Notebook' : language === 'ko' ? '좋습니다. 수첩에 등록하겠습니다' : '好，已收入案卷中'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
