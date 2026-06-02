import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Sparkles, Pin, Zap, Link2, Minimize2, Maximize2, RotateCcw, Award, Grid } from 'lucide-react';
import { NpcId } from '../types';
import { playDeductionCorrectSound, playDeductionWrongSound, playPaperFlipSound, playWritingSound } from '../utils/audio';
import { Language, t, getLocalizedPresetClues, getLocalizedPresetDeductions } from '../utils/i18n';

// Dynamic Relative Board Coordinates (Virtual Size 1000 x 650)
export interface PinClue {
  id: string;
  title: string;
  description: string;
  type: 'evidence' | 'testimony' | 'deduction';
  color: string; // Tailwind bg styles
  x: number; // 0 to 1000
  y: number; // 0 to 650
  rotation: string; // custom tilt
  unlockedAtStart?: boolean;
}

const PRESET_CLUES: PinClue[] = [
  {
    id: 'clue-faucet-wear',
    title: '水龙头防滑齿刮耗',
    description: '厨房洗水池的大铜阀顶针咬合防滑齿有极严重逆袭刮耗。寻常人极少用重铁钳强卡或螺栓破坏拧动，显然有人在此进行了狂暴破坏性的阀轴拧动。',
    type: 'evidence',
    color: 'bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-300 text-amber-950 font-sans',
    x: 80,
    y: 50,
    rotation: '-rotate-2'
  },
  {
    id: 'clue-water-flow',
    title: '23:15 七分钟暴流泄水声',
    description: '通过开启铜把阀门测试，其在黄金案发时刻【23:15】期间，曾被大肆拧开，在隔音极差的厨房不间断泄漏出足足七分钟的澎湃巨浪水流轰鸣声。',
    type: 'evidence',
    color: 'bg-gradient-to-br from-cyan-50 to-blue-100 border-cyan-300 text-sky-950 font-sans',
    x: 380,
    y: 50,
    rotation: 'rotate-1'
  },
  {
    id: 'clue-doctor-wet-stain',
    title: '随医白领衣袖未干水印',
    description: '随行医生陆浩然身上的大白褂右手肘外侧，有一道深色、边缘晕开的微湿圆领状水印。其化学分析对应了厨房水槽的水源酸性洗涤剂微粒。',
    type: 'evidence',
    color: 'bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-300 text-teal-950 font-sans',
    x: 760,
    y: 50,
    rotation: 'rotate-2'
  },
  {
    id: 'clue-maid-corridor',
    title: '佣人陈敏：走廊寂静空白说',
    description: '佣人陈敏笔录赌誓：“23:15 期间，我一直手抓抹布在走廊清扫先人肖像画，那时候整扇通道寂静如墓地，绝对没有任何半个人，也无任何脚步声。”',
    type: 'testimony',
    color: 'bg-gradient-to-br from-orange-50 to-amber-100 border-orange-300 text-orange-950 font-sans',
    x: 80,
    y: 280,
    rotation: 'rotate-1'
  },
  {
    id: 'clue-crossing-corridor',
    title: '管家与访客：23:15行廊中转',
    description: '管家李国栋和顾客周商客口供高度重合，指认：在 23:14 至 23:16 期间，二人曾分别大步穿行走廊前往厨房：一人取甘菊茶茶叶，一人索求苏打水。',
    type: 'testimony',
    color: 'bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-300 text-purple-950 font-sans',
    x: 80,
    y: 470,
    rotation: '-rotate-1'
  },
  {
    id: 'clue-run-footstep',
    title: '23:21 走廊大急慌逃跑声',
    description: '客商周海平直指，在听到管家失窃惨叫前半分钟，走廊传来一阵类似轻拖鞋底大慌、沉重、慌不择路登爬梯道向楼上急撤退的极其仓促脚步声。',
    type: 'testimony',
    color: 'bg-gradient-to-br from-rose-50 to-pink-100 border-rose-300 text-rose-950 font-sans',
    x: 410,
    y: 470,
    rotation: 'rotate-2'
  },
  {
    id: 'clue-niece-headphones',
    title: '侄女韩雨欣：降噪重音耳罩',
    description: '声称23:15为了平复被扣学费的极致愤怒，正坐在卧铺，双耳戴着专业厚降噪耳罩并高分贝轰放重低音电子小说，誓死坚信不曾离开和听到房间异响。',
    type: 'testimony',
    color: 'bg-gradient-to-br from-pink-50 to-fuchsia-100 border-pink-300 text-fuchsia-950 font-sans',
    x: 760,
    y: 280,
    rotation: '-rotate-2'
  },
  {
    id: 'clue-smashed-lamp',
    title: '二楼闺房打碎的粉色台灯',
    description: '侄女卧桌前名家名作粉色手绘夜台灯被粗暴倒摔于地，灯瓷皲裂，地毯泛湿。这说明韩雨欣卧室在案发瞬间经历过某种极为惊惶、急促抢光的返房慌退。',
    type: 'evidence',
    color: 'bg-gradient-to-br from-red-50 to-rose-100 border-red-300 text-red-950 font-sans',
    x: 760,
    y: 470,
    rotation: 'rotate-1'
  },
  {
    id: 'clue-dark-cellar',
    title: '无电熄闸的地下黑酒窖',
    description: '医生陆浩然声称 23:15 独自反锁在酒窖清点心脏药品，然而老管家正巧想下酒窖拿蜂蜜，看到地下大配电闸早被停挂，内里浸沉伸手不见五指死寂，无法辩药。',
    type: 'testimony',
    color: 'bg-gradient-to-br from-slate-50 to-zinc-150 border-slate-300 text-slate-900 font-sans',
    x: 415,
    y: 280,
    rotation: '-rotate-1'
  }
];

export interface DeductionResult {
  id: string;
  title: string;
  description: string;
  triggeredBy: [string, string]; // two clue ids that match
  unlockedClueId: string; // adds to customNotebook too
  x: number;
  y: number;
}

const PRESET_DEDUCTIONS: DeductionResult[] = [
  {
    id: 'deduction-audio-camouflage',
    title: '【高能推论：水流声障干扰】',
    description: '厨房大拧水龙头放水整整七分钟，其巨浪轰鸣完美笼罩了隔音极差的一楼。这说明放水者绝非为了洗手起泡，而是有预谋地利用强噪声干扰一楼巡视。目的是为走廊内贼人开箱、折返、以及慌张小奔跑打掩护！放水人与偷走吊坠并在23:21惊醒折返的人是极其严丝合缝的同谋，甚至为同一人！',
    triggeredBy: ['clue-water-flow', 'clue-run-footstep'],
    unlockedClueId: 'c2',
    x: 410,
    y: 260
  },
  {
    id: 'deduction-phantom-corridor',
    title: '【高能推论：佣人长廊不在场坍塌】',
    description: '佣人陈敏极力证实走廊在 23:15 度过真空“没有任何人半点异响”，但这与管家李国栋和访客周海平确认当时高频经过的事实产生致命物理碰撞。这证明女佣当时根本不在走廊岗位！她显然是在客厅内强撬保险挂锁，事后为了掩盖行踪，才凭空编造了走廊无人在场的极假伪证！',
    triggeredBy: ['clue-maid-corridor', 'clue-crossing-corridor'],
    unlockedClueId: 'c1',
    x: 80,
    y: 190
  },
  {
    id: 'deduction-niece-shattered',
    title: '【高能推论：耳机障蔽与慌乱归巢】',
    description: '侄女韩雨欣在案发时卧室空无一人。这就完全戳破了她“正佩戴ANC大音乐耳罩在卧沉思”的假在场！与其床上没人配合的，是她房内匆忙倒地撞坏的名贵台灯，以及在走廊 23:21 发生的急骤奔撤脚步。说明韩欣欣正是下楼开柜得手后，慌神赶在管家拉铃报窃前极度惊恐登楼归房、摸黑踩断台灯脚！',
    triggeredBy: ['clue-niece-headphones', 'clue-smashed-lamp'],
    unlockedClueId: 'c1',
    x: 760,
    y: 380
  },
  {
    id: 'deduction-doctor-faucet',
    title: '【高能推论：医生作恶与潮湿袖记】',
    description: '阀口齿轮有暴力别开磨刮，而平时高洁、双手从未沾水的医生陆浩然，案口身上恰有一道微潮酸性洗溶水印。这说明陆医生行窃得手后，慌忙奔行至厨房用蛮力逆转大水龙头进行放水制造掩蔽，不料袖子碰上水管沾湿！',
    triggeredBy: ['clue-doctor-wet-stain', 'clue-faucet-wear'],
    unlockedClueId: 'c1',
    x: 760,
    y: 190
  },
  {
    id: 'deduction-cellar-discharged',
    title: '【高能推论：地下深锁伪在场】',
    description: '医生声称23:15自己在地下室全反锁盘贴速效针，但那个时辰地下配电大闸早被卡锁拉闸、漆黑死暗。自命博学的理智医生绝不可能在黑如瞎盲里进行“逐粒配制心脏药丸”的离奇任务。他反锁大门只因为他早已神不知鬼不觉撬上客厅作案，然后把幽闭黑暗酒窖作为借口挡箭外衣！',
    triggeredBy: ['clue-dark-cellar', 'clue-doctor-wet-stain'],
    unlockedClueId: 'c1',
    x: 415,
    y: 190
  }
];

interface LogicPinBoardProps {
  onAddNote: (npcId: NpcId, noteText: string) => void;
  unlockedClues: string[];
  culpritId: NpcId;
  onClose?: () => void;
  unlockedDeductionIds?: string[];
  setUnlockedDeductionIds?: (val: string[] | ((prev: string[]) => string[])) => void;
  hiddenDeductionIds?: string[];
  setHiddenDeductionIds?: (val: string[] | ((prev: string[]) => string[])) => void;
  isGridLayout?: boolean;
  setIsGridLayout?: (val: boolean | ((prev: boolean) => boolean)) => void;
  language: Language;
}

export default function LogicPinBoard({
  onAddNote,
  unlockedClues,
  culpritId,
  onClose,
  unlockedDeductionIds: propsUnlockedDeductionIds,
  setUnlockedDeductionIds: propsSetUnlockedDeductionIds,
  hiddenDeductionIds: propsHiddenDeductionIds,
  setHiddenDeductionIds: propsSetHiddenDeductionIds,
  isGridLayout: propsIsGridLayout,
  setIsGridLayout: propsSetIsGridLayout,
  language
}: LogicPinBoardProps) {
  const PRESET_CLUES = getLocalizedPresetClues(language);
  const PRESET_DEDUCTIONS = getLocalizedPresetDeductions(language);

  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  
  const [localUnlockedDeductionIds, localSetUnlockedDeductionIds] = useState<string[]>([]);
  const [localHiddenDeductionIds, localSetHiddenDeductionIds] = useState<string[]>([]);
  const [localIsGridLayout, localSetIsGridLayout] = useState(false);

  const unlockedDeductionIds = propsUnlockedDeductionIds ?? localUnlockedDeductionIds;
  const setUnlockedDeductionIds = propsSetUnlockedDeductionIds ?? localSetUnlockedDeductionIds;
  const hiddenDeductionIds = propsHiddenDeductionIds ?? localHiddenDeductionIds;
  const setHiddenDeductionIds = propsSetHiddenDeductionIds ?? localSetHiddenDeductionIds;
  const isGridLayout = propsIsGridLayout ?? localIsGridLayout;
  const setIsGridLayout = propsSetIsGridLayout ?? localSetIsGridLayout;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notification, setNotification] = useState<{ title: string; text: string } | null>(null);

  // Dynamic Grid coordinate mapping to completely prevent overlapping under threads
  const getClueCoords = (node: PinClue, index: number) => {
    if (!isGridLayout) {
      return { x: node.x, y: node.y, rotation: node.rotation };
    }
    // Aligned Grid Layout Columns (Cols: 60px, 420px, 780px. Rows: 55px, 275px, 495px)
    const colIdx = index % 3;
    const rowIdx = Math.floor(index / 3);
    const xCoords = [65, 415, 765];
    const yCoords = [55, 275, 495];
    return {
      x: xCoords[colIdx],
      y: yCoords[rowIdx],
      rotation: 'rotate-0'
    };
  };

  const getDeductionCoords = (node: DeductionResult) => {
    if (!isGridLayout) {
      return { x: node.x, y: node.y };
    }
    // Middle layout with collision offset offsets to stay clear of Clue card areas
    const clueA = PRESET_CLUES.find(c => c.id === node.triggeredBy[0]);
    const clueB = PRESET_CLUES.find(c => c.id === node.triggeredBy[1]);
    if (!clueA || !clueB) return { x: node.x, y: node.y };

    const idxA = PRESET_CLUES.findIndex(c => c.id === clueA.id);
    const idxB = PRESET_CLUES.findIndex(c => c.id === clueB.id);

    const posA = getClueCoords(clueA, idxA);
    const posB = getClueCoords(clueB, idxB);

    let midX = (posA.x + posB.x) / 2;
    let midY = (posA.y + posB.y) / 2;

    if (midX === 415) {
      midX = 415 + 130; // Shift to right of center
    } else if (midX === 240) {
      midX = 215; // Shift left
    } else if (midX === 590) {
      midX = 610; // Shift right
    }

    if (midY === 55) midY = 160;
    else if (midY === 275) midY = 380;
    else if (midY === 495) midY = 390;
    else if (midY === 165) midY = 160;
    else if (midY === 385) midY = 380;

    return { x: midX, y: midY };
  };

  // Sound effects wrapper
  const testConnection = (idA: string, idB: string) => {
    // Look for preset deduction trigger cases
    const foundDeduction = PRESET_DEDUCTIONS.find(d => 
      (d.triggeredBy[0] === idA && d.triggeredBy[1] === idB) || 
      (d.triggeredBy[0] === idB && d.triggeredBy[1] === idA)
    );

    if (foundDeduction) {
      if (unlockedDeductionIds.includes(foundDeduction.id)) {
        setNotification({
          title: {
            zh: '📌 逻辑纽带已经存在',
            en: '📌 Logic thread already exists',
            ko: '📌 논리적 연결이 이미 존재합니다'
          }[language],
          text: {
            zh: `“${foundDeduction.title}”已被你成功挂线解锁，请勿重复连结。`,
            en: `"${foundDeduction.title}" has already been unlocked, do not reconnect.`,
            ko: `"${foundDeduction.title}"은 이미 잠금 해제되었습니다.`
          }[language]
        });
        setSelectedClueId(null);
        return;
      }

      // Unlock and play correct sound!
      playDeductionCorrectSound();
      setUnlockedDeductionIds(prev => [...prev, foundDeduction.id]);
      
      // Auto push deduction note into DetectiveNotebook!
      onAddNote(culpritId, `${foundDeduction.title}\n${foundDeduction.description}`);

      setNotification({
        title: {
          zh: `🎉 逻辑扣合成功！ ${foundDeduction.title}`,
          en: `🎉 Deduction Breakthrough! ${foundDeduction.title}`,
          ko: `🎉 논리적 모순 돌파! ${foundDeduction.title}`
        }[language],
        text: foundDeduction.description
      });
    } else {
      // Connect failed
      playDeductionWrongSound();
      setNotification({
        title: {
          zh: '❌ 指引产生逻辑冲突',
          en: '❌ Logical Mismatch',
          ko: '❌ 부적합한 논리 연결'
        }[language],
        text: {
          zh: '这两条线索关联在一起，似乎产生了一定物理和方位偏差，未能连接出突破真理的红线逻辑！',
          en: 'Connecting these two clues reveals no direct friction. Try combining other timelines!',
          ko: '두 단서 사이에는 뚜렷한 연관성이 발견되지 않았습니다. 다른 선조를 조합해보십시오!'
        }[language]
      });
    }
    
    // Clear selection
    setSelectedClueId(null);
  };

  const handleCardClick = (clueId: string) => {
    playPaperFlipSound();
    
    if (selectedClueId === null) {
      setSelectedClueId(clueId);
    } else {
      if (selectedClueId === clueId) {
        setSelectedClueId(null); // Deselect
      } else {
        testConnection(selectedClueId, clueId);
      }
    }
  };

  const resetBoard = () => {
    playPaperFlipSound();
    setUnlockedDeductionIds([]);
    setHiddenDeductionIds([]);
    setIsGridLayout(false);
    setSelectedClueId(null);
    setNotification({
      title: {
        zh: '🔄 连线板重置复位',
        en: '🔄 Pinboard Reset Complete',
        ko: '🔄 로직 보드 완전 리셋'
      }[language],
      text: {
        zh: '已清空板面上的所有红色棉球线，重新展开了所有已隐藏的推论卡片，并且恢复到原始自由排布。',
        en: 'All red cotton strings have been cleared, hidden deduction cards restored, and layout returned to default.',
        ko: '모든 적색 실선들이 전서 소거되었으며, 감춰졌던 추론 카드들이 기본 배열로 원복 되었습니다.'
      }[language]
    });
  };

  // Dimensions setup virtually (1000 x 650)
  // Yarn lines stay active once unlocked (doesn't disappear and can be restored)
  const activeConnections = PRESET_DEDUCTIONS.filter(d => unlockedDeductionIds.includes(d.id) && !hiddenDeductionIds.includes(d.id));
  const unlockedConnectionsForYarn = PRESET_DEDUCTIONS.filter(d => unlockedDeductionIds.includes(d.id));

  return (
    <div id="logic-pinboard-outer" className={`flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl scale-100' : 'relative h-full'
    }`}>
      
      {/* Header and tools */}
      <div className="bg-slate-905 p-3 px-4 border-b border-slate-850 flex items-center justify-between z-20">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-rose-500 animate-pulse" />
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white tracking-widest font-mono uppercase">
              {t('pinboardTitle', language)}
            </h3>
            <p className="text-[9px] text-slate-400 font-sans font-light">
              {t('pinboardSubtitle', language)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Dynamic Grid Alignment Rearranging Action button */}
          <button
            onClick={() => {
              playPaperFlipSound();
              setIsGridLayout(!isGridLayout);
              setNotification({
                title: !isGridLayout ? {
                  zh: '🗂️ 开启智能网格对齐排列',
                  en: '🗂️ Grid Layout Enabled',
                  ko: '🗂️ 그리드 배치 켜짐'
                }[language] : {
                  zh: '📌 恢复原始自由分布 layout',
                  en: '📌 Custom Loose Layout Restored',
                  ko: '📌 자유 경사 배치 복구'
                }[language],
                text: !isGridLayout 
                  ? {
                      zh: '已将原始错落的线索贴整齐归并到边缘网格，杜绝任何红色棉绳交叉穿透遮挡，视野清晰极佳！',
                      en: 'Cards are neat, ensuring zero overlapping thread tangle. Ultra readable view is active!',
                      ko: '단서들을 한눈에 쉽게 볼 수 있도록 가로세로 완정 정렬하였습니다.'
                    }[language]
                  : {
                      zh: '已恢复到案件最初的凌乱罪落白板状态。',
                      en: 'Restored the chalk board back to its original raw messy crime layout.',
                      ko: '초기 현장 사건 배치 구조 상태로 원복 완료하였습니다.'
                    }[language]
              });
            }}
            className={`p-1 px-2.5 border rounded text-[10px] sm:text-[11px] font-mono tracking-wider flex items-center gap-1 transition-all cursor-pointer font-bold ${
              isGridLayout 
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-200' 
                : 'bg-slate-900 border-slate-800 text-slate-350 hover:bg-slate-850 hover:text-white'
            }`}
            title={language === 'en' ? "Align clues & deductions cleanly to prevent lines crossing" : language === 'ko' ? "단서와 추론을 일괄 정렬하여 연결선을 명확히 봅니다" : "一键规整线索和推断，让棉线完全不交叉遮挡"}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{isGridLayout ? {
              zh: "自由偏倾",
              en: "Loose Flow",
              ko: "자유 배치"
            }[language] : {
              zh: "网格规整",
              en: "Grid Align",
              ko: "정렬 규격"
            }[language]}</span>
          </button>

          <button
            onClick={resetBoard}
            className="p-1 px-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white text-[10px] sm:text-[11px] font-mono tracking-wider rounded flex items-center gap-1 transition-all cursor-pointer font-bold"
            title={language === 'en' ? "Clear all connections and restore hidden cards" : language === 'ko' ? "연결선을 모두 청소하고 숨김 해제합니다" : "清空连线以及恢复隐藏卡"}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('pinboardReset', language)}</span>
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 px-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white text-[10px] sm:text-[11px] font-mono tracking-wider rounded flex items-center gap-1 transition-all cursor-pointer font-bold hidden sm:flex"
            title={language === 'en' ? "Toggle fullscreen board view" : language === 'ko' ? "전체화면 전환" : "切换全屏画布"}
          >
            {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            <span>{isFullscreen ? { zh: "退出全屏", en: "Exit Full", ko: "전체화면 종료" }[language] : { zh: "全屏探案", en: "Fullscreen", ko: "전체 화면" }[language]}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 px-3 ml-2 bg-gradient-to-r from-rose-900 to-red-950 border border-rose-500/45 hover:from-rose-850 hover:to-red-900 hover:border-rose-450 hover:shadow-[0_0_12px_rgba(239,68,68,0.4)] text-[11px] font-mono tracking-wider rounded text-rose-100 hover:text-white flex items-center gap-1 transition-all cursor-pointer font-black shadow-sm active:scale-95"
              title={language === 'en' ? "Back to investigation scenes" : language === 'ko' ? "현장 조사 단계로 돌아가기" : "回到现场探案"}
            >
              <span>✕ {t('exitPinboard', language)}</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border-b border-slate-850 p-2.5 px-4 text-[10.5px] text-slate-300 leading-normal flex items-start gap-1.5 font-light z-20">
        <Sparkles className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-rose-400 font-black">{t('howItWorksTitle', language)}</span>
          <span>{t('howItWorksDesc', language)}</span>
        </div>
      </div>

      {/* Main Board Container */}
      <div className="flex-1 overflow-auto bg-amber-950/20 bg-[radial-gradient(ellipse_at_center,rgba(67,56,202,0.1),transparent)] relative p-4 min-h-[520px]">
        
        {/* The Corkboard texture background - Warm maroon-mahogany dark detective styling */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#241212] via-[#120a0a] to-[#0a0505] opacity-95 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.15),transparent_75%)] pointer-events-none z-0" />
        
        {/* If no clues are unlocked, show beautiful instructional placeholder */}
        {PRESET_CLUES.filter(node => unlockedClues.includes(node.id) || node.unlockedAtStart).length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none z-15">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 p-8 rounded-2xl max-w-md shadow-2xl space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/20 animate-pulse">
                <Pin className="w-8 h-8 rotate-12" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">
                  {language === 'en' ? 'Evidence Board Empty' : language === 'ko' ? '사건 연관 단서 없음' : '线索白板暂无物证'}
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {language === 'en' 
                    ? 'Conduct thorough searches in rooms or cross-examine suspect alibis. Discovered contradictions and core alibis will automatically pin onto this board so you can draw threads between them.' 
                    : language === 'ko' 
                    ? '사택 안을 직접 수색하거나 용의자를 추문하여 시간적 충돌을 확보하십시오. 획득한 단서는 벽면에 자동 고정되어 실선으로 영합 추공이 가능해집니다.' 
                    : '请前往其他房间进行【彻底搜查】或针对各角色的 23:15 时间假说开展深入对话！当搜集到客观物证或口供漏洞后，它们会立即自动图钉到此白板，供你拉线对撞！'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Connected red line SVGs (Perfect scaled matching) */}
        <svg 
          viewBox="0 0 1000 650" 
          className="absolute inset-0 pointer-events-none z-10 w-full h-full"
          id="logic-yarn-svg"
        >
          {/* Draw cotton yarns for all unlocked connections (even if hidden - clicking the joint pin restores the card!) */}
          {unlockedConnectionsForYarn.map(conn => {
            const clueA = PRESET_CLUES.find(c => c.id === conn.triggeredBy[0]);
            const clueB = PRESET_CLUES.find(c => c.id === conn.triggeredBy[1]);
            const deductionNode = conn;

            if (!clueA || !clueB) return null;

            const idxA = PRESET_CLUES.findIndex(c => c.id === clueA.id);
            const idxB = PRESET_CLUES.findIndex(c => c.id === clueB.id);

            const posA = getClueCoords(clueA, idxA);
            const posB = getClueCoords(clueB, idxB);
            const posD = getDeductionCoords(conn);

            const xA = posA.x + 80;
            const yA = posA.y + 40;
            const xB = posB.x + 80;
            const yB = posB.y + 40;
            
            const xD = posD.x + 85;
            const yD = posD.y + 50;

            const isHidden = hiddenDeductionIds.includes(conn.id);

            return (
              <g key={conn.id}>
                {/* Line Clue A to Deduction Node */}
                <line 
                  x1={xA} 
                  y1={yA} 
                  x2={xD} 
                  y2={yD} 
                  stroke="#ef4444" 
                  strokeWidth="3.5" 
                  strokeDasharray="1 1"
                  strokeLinecap="round"
                  className="opacity-70 shadow-lg"
                />
                <line 
                  x1={xA} 
                  y1={yA} 
                  x2={xD} 
                  y2={yD} 
                  stroke="#f43f5e" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  className="opacity-90"
                />

                {/* Line Clue B to Deduction Node */}
                <line 
                  x1={xB} 
                  y1={yB} 
                  x2={xD} 
                  y2={yD} 
                  stroke="#ef4444" 
                  strokeWidth="3.5" 
                  strokeDasharray="1 1"
                  strokeLinecap="round"
                  className="opacity-70 shadow-lg"
                />
                <line 
                  x1={xB} 
                  y1={yB} 
                  x2={xD} 
                  y2={yD} 
                  stroke="#f43f5e" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  className="opacity-90"
                />

                {/* Joint peg / pin: clickable if hidden to restore the card */}
                {isHidden ? (
                  <g 
                    className="pointer-events-auto cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setHiddenDeductionIds(prev => prev.filter(id => id !== conn.id));
                      playWritingSound();
                      setNotification({
                        title: {
                          zh: '🔓 逻辑推论卡已恢复展现！',
                          en: '🔓 Deduction card restored!',
                          ko: '🔓 논리 추론 카드 복원됨!'
                        }[language],
                        text: {
                          zh: `“${conn.title}”已被你点击复原。`,
                          en: `"${conn.title}" is restored.`,
                          ko: `"${conn.title}" 복원되었습니다.`
                        }[language]
                      });
                    }}
                  >
                    <circle cx={xD} cy={yD} r="12" fill="#ef4444" opacity="0.3" className="animate-pulse" />
                    <circle cx={xD} cy={yD} r="6" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" className="shadow-lg" />
                    <circle cx={xD} cy={yD} r="2.5" fill="#fff" />
                    <title>{language === 'en' ? "Click to restore folded card" : language === 'ko' ? "클릭하여 숨겨진 카드 복구" : "点击复原折叠卡"}</title>
                  </g>
                ) : (
                  <g className="pointer-events-auto">
                    <circle cx={xD} cy={yD} r="5" fill="#ef4444" stroke="#fff" strokeWidth="1.5" className="shadow" />
                    <circle cx={xD} cy={yD} r="2" fill="#fff" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Card list of all clue/testimony/etc items */}
        {PRESET_CLUES.map((node, index) => {
          const isUnlocked = unlockedClues.includes(node.id) || node.unlockedAtStart;
          if (!isUnlocked) return null;

          const coords = getClueCoords(node, index);
          const isSelected = selectedClueId === node.id;
          
          // Check if this clue has successfully matching connection
          const hasJoinedAny = unlockedDeductionIds.some(dId => {
            const d = PRESET_DEDUCTIONS.find(item => item.id === dId);
            return d && (d.triggeredBy[0] === node.id || d.triggeredBy[1] === node.id);
          });

          return (
            <motion.div
              key={node.id}
              tabIndex={0}
              onClick={() => handleCardClick(node.id)}
              className={`absolute w-[160px] min-h-[88px] max-h-[140px] rounded-lg p-2.5 border-2 shadow-md cursor-pointer transition-all duration-300 pointer-events-auto select-none ${node.color} ${
                isSelected 
                  ? 'ring-4 ring-rose-500 scale-105 border-rose-500 -translate-y-1 shadow-[0_0_15px_rgba(244,63,94,0.6)] z-40' 
                  : 'hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-400 z-20'
              }`}
              style={{
                left: `${coords.x / 10}%`,
                top: `${coords.y / 6.5}%`,
                transform: isSelected ? 'scale(1.05)' : coords.rotation
              }}
            >
              {/* Push pin drawing at the top center */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-rose-600 drop-shadow-md z-30 transition hover:scale-110">
                <Pin className="w-4 h-4 fill-rose-600 rotate-12" />
              </div>

              <div className="flex flex-col justify-between h-full text-left">
                <div>
                  <span className={`text-[7px] font-bold px-1 py-0.2 rounded tracking-widest ${
                    node.type === 'evidence' 
                      ? 'bg-amber-200 text-amber-900 border border-amber-300' 
                      : 'bg-indigo-200 text-indigo-900 border border-indigo-300'
                  }`}>
                    {node.type === 'evidence' ? (language === 'zh' ? '📍 现证' : language === 'en' ? '📍 Evidence' : '📍 물증') : (language === 'zh' ? '💬 口供' : language === 'en' ? '💬 Testimony' : '💬 진술')}
                  </span>
                  <h4 className="text-[10px] font-extrabold mt-1 tracking-wide line-clamp-1 leading-normal text-slate-900">
                    {node.title}
                  </h4>
                  <p className="text-[8px] leading-relaxed mt-1 text-slate-700 line-clamp-3 font-normal">
                    {node.description}
                  </p>
                </div>

                {hasJoinedAny && (
                  <div className="text-[7.5px] font-mono font-bold tracking-widest text-rose-700 text-right mt-1 flex items-center justify-end gap-0.5">
                    <Zap className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                    <span>{language === 'zh' ? '已挂红棉线' : language === 'en' ? 'Threaded' : '실선 연결됨'}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* 2. DYNAMICS UNLOCKED DEDUCTION HIGHLIGHT CARDS (In corkboard intersections) */}
        {PRESET_DEDUCTIONS.map(node => {
          const isUnlocked = unlockedDeductionIds.includes(node.id);
          const isHidden = hiddenDeductionIds.includes(node.id);
          if (!isUnlocked || isHidden) return null;

          const coords = getDeductionCoords(node);

          return (
            <motion.div
              key={node.id}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              tabIndex={0}
              className="absolute w-[184px] rounded-xl p-3 border border-yellow-400/40 bg-gradient-to-b from-slate-900/98 to-slate-950/98 text-slate-100 shadow-[0_0_20px_rgba(251,191,36,0.3)] z-30 pointer-events-auto cursor-help hover:shadow-[0_0_25px_rgba(251,191,36,0.55)] hover:scale-105 transition-all text-left font-sans"
              style={{
                left: `${coords.x / 10}%`,
                top: `${coords.y / 6.5}%`,
                height: '142px'
              }}
            >
              {/* Gold star star on top left corner */}
              <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-yellow-500 border border-yellow-300 flex items-center justify-center text-slate-950 shadow">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              </div>

              {/* Hide / Close Card button inside top-right corner */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHiddenDeductionIds(prev => [...prev, node.id]);
                  playPaperFlipSound();
                  setNotification({
                    title: {
                      zh: '📌 已暂时将卡片折叠',
                      en: '📌 Card folded temporarily',
                      ko: '📌 카드가 일시 접혔습니다'
                    }[language],
                    text: {
                      zh: `若需要再次浏览卡片，随时点击其对应的红色棉绳中心 Peggy 黄金大针泡即可！`,
                      en: `If you need to view this card again, click the golden pin along its red yarn string!`,
                      ko: `카드를 복원하고 싶으시다면 언제든지 중앙의 빨간 실선 핀헤드를 탭 하십시오.`
                    }[language]
                  });
                }}
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center bg-white/5 hover:bg-rose-900/40 hover:text-white text-[9.5px] border border-white/15 select-none cursor-pointer z-40 transition-all font-bold text-slate-400"
                title={language === 'en' ? "Fold card temporarily (Click the red string pin to restore)" : language === 'ko' ? "일시적으로 추론 카드 보관 (적색 실선 중앙의 도 장침을 누르면 다시 열립니다)" : "暂时折叠收起推论卡(点击红绳中间针尖可重新唤出)"}
              >
                ✕
              </button>

              <div className="flex flex-col h-full justify-between overflow-y-auto">
                <h5 className="text-[10.5px] font-extrabold text-yellow-400 tracking-wide font-mono leading-tight pr-2">
                  {node.title}
                </h5>
                <p className="text-[8.5px] leading-relaxed mt-1.5 text-slate-300 font-sans font-light">
                  {node.description}
                </p>
                <div className="text-[7.5px] font-mono text-emerald-400 mt-1 uppercase text-right tracking-widest leading-none font-bold">
                  ✓ {t('loadedInNotebook', language)}
                </div>
              </div>
            </motion.div>
          );
        })}

      </div>

      {/* Connection notification or result overlay */}
      <div className="bg-slate-900 border-t border-slate-850 p-3.5 px-4 z-25 min-h-[60px] flex items-center justify-between">
        <div className="flex-1">
          {notification ? (
            <div className="animate-fade-in text-left">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                {notification.title.includes('❌') ? (
                  <span className="text-rose-500 font-bold">●</span>
                ) : (
                  <span className="text-emerald-400 font-bold animate-ping-slow">●</span>
                )}
                {notification.title}
              </h4>
              <p className="text-[10px] text-slate-350 leading-relaxed mt-1 font-sans font-light">
                {notification.text}
              </p>
            </div>
          ) : (
            <p className="text-[10px] text-slate-500 font-sans italic">
              {t('pinboardClickTips', language)}
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
