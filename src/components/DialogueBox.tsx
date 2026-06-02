import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, Loader2, Compass, AlertCircle, Briefcase, FileText, ShieldAlert, X, Sparkles } from 'lucide-react';
import { NpcId, ChatMessage, NoteItem, Language } from '../types';
import { playObjectionSound, playBreakdownSound, playWritingSound, playPaperFlipSound } from '../utils/audio';
import { getLocalizedNpcDataList, getLocalizedPhysicalEvidence, getLocalizedReaction } from '../utils/i18n';
import { NPC_DATA_LIST } from '../caseData';

interface DialogueBoxProps {
  npcId: NpcId;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onExit: () => void;
  npcEmotion: number;
  unlockedClues: string[];
  isGenerating: boolean;
  culpritId?: NpcId;
  customNotes?: NoteItem[];
  onUnlockContradiction?: (clueId: string) => void;
  onUpdateNpcEmotion?: (npcId: NpcId, emotion: number) => void;
  onAppendChatMessage?: (npcId: NpcId, sender: 'player' | 'npc', text: string, emotionValue?: number) => void;
  language: Language;
  isOutburst?: boolean;
}

const checkEvidenceDiscovered = (id: string, notes: NoteItem[]): boolean => {
  const noteTexts = notes.map(n => n.content).join(' ').toLowerCase();
  switch (id) {
    case 'lr-safe': 
      return noteTexts.includes('五屉') || noteTexts.includes('暗格') || noteTexts.includes('柜锁') || noteTexts.includes('锁孔') || 
             noteTexts.includes('drawer') || noteTexts.includes('safe') || noteTexts.includes('서랍') || noteTexts.includes('보관함');
    case 'lr-sofa': 
      return noteTexts.includes('沙发') || noteTexts.includes('勒退') || noteTexts.includes('周老板') || noteTexts.includes('催收') || 
             noteTexts.includes('sofa') || noteTexts.includes('debt') || noteTexts.includes('visitor') || noteTexts.includes('소파') || 
             noteTexts.includes('채무') || noteTexts.includes('독촉');
    case 'lr-fireplace': 
      return noteTexts.includes('壁炉') || noteTexts.includes('余温') || noteTexts.includes('fireplace') || noteTexts.includes('ash') || 
             noteTexts.includes('벽난로') || noteTexts.includes('화재');
    case 'co-gallery': 
      return noteTexts.includes('油画') || noteTexts.includes('画框') || noteTexts.includes('蹭') || noteTexts.includes('画幅') || 
             noteTexts.includes('canvas') || noteTexts.includes('gallery') || noteTexts.includes('portrait') || noteTexts.includes('유화') || 
             noteTexts.includes('액자') || noteTexts.includes('그림');
    case 'co-stair': 
      return noteTexts.includes('木梯') || noteTexts.includes('台阶') || noteTexts.includes('楼梯') || noteTexts.includes('玫瑰') || 
             noteTexts.includes('stair') || noteTexts.includes('rose') || noteTexts.includes('계단') || noteTexts.includes('장미');
    case 'ki-faucet': 
      return noteTexts.includes('水龙头') || noteTexts.includes('滴水') || noteTexts.includes('水喉') || noteTexts.includes('faucet') || 
             noteTexts.includes('tap') || noteTexts.includes('water') || noteTexts.includes('수도') || noteTexts.includes('수조') || 
             noteTexts.includes('수돗');
    case 'ki-stove': 
      return noteTexts.includes('壶') || noteTexts.includes('汤灶') || noteTexts.includes('茶垢') || noteTexts.includes('空烧') || 
             noteTexts.includes('stove') || noteTexts.includes('boiler') || noteTexts.includes('kettle') || noteTexts.includes('보일러') || 
             noteTexts.includes('차솥') || noteTexts.includes('끓인');
    case 'ki-tea': 
      return noteTexts.includes('红茶') || noteTexts.includes('备钥') || noteTexts.includes('茶叶') || noteTexts.includes('副钥') || 
             noteTexts.includes('备用匙') || noteTexts.includes('tea') || noteTexts.includes('key') || noteTexts.includes('차') || 
             noteTexts.includes('열쇠');
    case 'be-lamp': 
      return noteTexts.includes('台灯') || noteTexts.includes('发丝') || noteTexts.includes('金粉') || noteTexts.includes('lamp') || 
             noteTexts.includes('hair') || noteTexts.includes('전등') || noteTexts.includes('머리') || noteTexts.includes('스탠드');
    case 'be-drawer': 
      return noteTexts.includes('梳妆') || noteTexts.includes('退学') || noteTexts.includes('赞助') || noteTexts.includes('学费') || 
             noteTexts.includes('drawer') || noteTexts.includes('tuition') || noteTexts.includes('school') || noteTexts.includes('화장') || 
             noteTexts.includes('유학') || noteTexts.includes('학비');
    case 'wc-db': 
      return noteTexts.includes('电闸') || noteTexts.includes('配电') || noteTexts.includes('断电') || noteTexts.includes('拉闸') || 
             noteTexts.includes('breaker') || noteTexts.includes('power') || noteTexts.includes('gate') || noteTexts.includes('배전') || 
             noteTexts.includes('전원') || noteTexts.includes('차단');
    case 'wc-med': 
      return noteTexts.includes('冷柜') || noteTexts.includes('药箱') || noteTexts.includes('美金') || noteTexts.includes('黑账') || 
             noteTexts.includes('洗动') || noteTexts.includes('洗钱') || noteTexts.includes('med') || noteTexts.includes('passport') || 
             noteTexts.includes('debt') || noteTexts.includes('달러') || noteTexts.includes('여권') || noteTexts.includes('약고');
    default: 
      return false;
  }
};

const checkEvidenceIsCorrect = (evidenceId: string, currentNpcId: NpcId, culpritId: NpcId): boolean => {
  return (culpritId === 'maid' && currentNpcId === 'maid' && (evidenceId === 'co-gallery' || evidenceId === 'ki-faucet')) ||
         (culpritId === 'butler' && currentNpcId === 'butler' && (evidenceId === 'ki-stove' || evidenceId === 'ki-tea')) ||
         (culpritId === 'visitor' && currentNpcId === 'visitor' && (evidenceId === 'ki-stove' || evidenceId === 'lr-sofa')) ||
         (culpritId === 'niece' && currentNpcId === 'niece' && (evidenceId === 'be-lamp' || evidenceId === 'co-stair')) ||
         (culpritId === 'doctor' && currentNpcId === 'doctor' && (evidenceId === 'wc-db' || evidenceId === 'wc-med'));
};

export default function DialogueBox({
  npcId,
  messages,
  onSendMessage,
  onExit,
  npcEmotion,
  unlockedClues,
  isGenerating,
  culpritId = 'maid',
  customNotes = [],
  onUnlockContradiction,
  onUpdateNpcEmotion,
  onAppendChatMessage,
  language,
  isOutburst
}: DialogueBoxProps) {
  const localizedNpcList = getLocalizedNpcDataList(language, culpritId);
  const npc = localizedNpcList.find(n => n.id === npcId);
  
  const npcFromMap = NPC_DATA_LIST.find(n => n.id === npcId);
  const outburstAvatar = npcFromMap?.outburstAvatar || npc?.outburstAvatar;
  const isCurrentlyInOutburst = isOutburst !== undefined ? isOutburst : (npcEmotion >= 75);
  
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    if (isCurrentlyInOutburst) {
      setShouldShake(true);
      const timer = setTimeout(() => {
        setShouldShake(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShouldShake(false);
    }
  }, [isCurrentlyInOutburst, npcId]);

  const [inputText, setInputText] = useState('');
  const [showEvidenceCabinet, setShowEvidenceCabinet] = useState(false);
  const [objectionActive, setObjectionActive] = useState(false);
  const [shakeActive, setShakeActive] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    evidenceName: string;
    npcName: string;
    roomName: string;
    contradictionTitle: string;
    reaction: string;
  } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const localizedEvidenceList = getLocalizedPhysicalEvidence(language);

  const handlePresentEvidence = (evidenceId: string) => {
    setShowEvidenceCabinet(false);
    
    const reactionText = getLocalizedReaction(evidenceId, npcId, culpritId, language);
    const isCorrect = checkEvidenceIsCorrect(evidenceId, npcId, culpritId);
    const matchedEv = localizedEvidenceList.find(e => e.id === evidenceId);
    
    if (isCorrect) {
      playBreakdownSound();
      
      setSuccessModal({
        evidenceName: matchedEv?.name || '',
        npcName: npc?.name || '',
        roomName: matchedEv?.roomName || '',
        contradictionTitle: matchedEv?.contradictionTitle || '',
        reaction: reactionText
      });

      const playerFlingMsg = {
        zh: `【🕵️‍♂️ 控方呈堂物证批驳：${matchedEv?.name}】！你刚才说的证言存在巨大的时空悖论！事实真相已经非常明确了，请你看看这件铁证！`,
        en: `【🕵️‍♂️ Presenting Evidence: ${matchedEv?.name}】! Your testimony contradicts the physical facts! The truth is clear; take a look closely at this evidence!`,
        ko: `【🕵️‍♂️ 핵심 모순 물증 제시: ${matchedEv?.name}】! 귀하가 거듭 변명했던 성명에는 회복할 수 없는 모순이 포착되었습니다. 이 결정적 철증을 보십시오!`
      }[language];

      onAppendChatMessage?.(npcId, 'player', playerFlingMsg);
      
      setTimeout(() => {
        onUpdateNpcEmotion?.(npcId, 95);
        onAppendChatMessage?.(npcId, 'npc', reactionText, 95);
        
        onUnlockContradiction?.('c1');
        onUnlockContradiction?.('c2');
      }, 605);

    } else {
      playObjectionSound();
      setObjectionActive(true);
      setShakeActive(true);
      
      setTimeout(() => {
        setObjectionActive(false);
        setShakeActive(false);
        
        const playerQuestionMsg = {
          zh: `【🕵️‍♂️ 出示物证质问：${matchedEv?.name}】。解释一下，这个证物和你当时自称的动向有什么关联？不要想蒙混过关！`,
          en: `【🕵️‍♂️ Questioning Evidence: ${matchedEv?.name}】. Explain this: how is this related to your claimed timeline or movements?`,
          ko: `【🕵️‍♂️ 단서 정황 질의: ${matchedEv?.name}】. 정면 대답해주십시오: 이 증거가 당시 귀하의 실 거동과 어떤 연관이 존재합니까?`
        }[language];

        onAppendChatMessage?.(npcId, 'player', playerQuestionMsg);
        
        setTimeout(() => {
          onAppendChatMessage?.(npcId, 'npc', reactionText, npcEmotion);
        }, 600);
      }, 1200);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  if (!npc) return null;

  // Render Emotion Badges
  let emotionRating = {
    zh: '平静',
    en: 'Calm',
    ko: '포커페이스 차분함'
  }[language];

  let emotionRatingColor = 'text-green-400 bg-green-950/40 border-green-800/30';
  
  if (npcEmotion >= 80) {
    emotionRating = {
      zh: '极度慌乱崩溃',
      en: 'Extreme Panic & Breakdown',
      ko: '매우 두려워 기절 직전'
    }[language];
    emotionRatingColor = 'text-rose-400 bg-rose-950/40 border-rose-800/50 animate-pulse font-bold';
  } else if (npcEmotion >= 45) {
    emotionRating = {
      zh: '焦虑防备中',
      en: 'Defensive & Guarded',
      ko: '불안 전전긍긍 저항'
    }[language];
    emotionRatingColor = 'text-amber-400 bg-amber-950/40 border-amber-800/40';
  }

  // Pre-defined Quick Questions corresponding to timelines and contradictions
  const quickQuestions = [
    {
      text: {
        zh: '⏱️ 23:10时刻你在哪，在做些什么？',
        en: '⏱️ Where were you at 23:10 and what were you doing?',
        ko: '⏱️ 23:10 시점에 귀하는 어디에서 무엇을 하고 있었습니까?'
      }[language],
      value: {
        zh: '23:10 的时候，请说清楚你在哪个房间，在做些什么？当时周围有谁？',
        en: 'Speak clearly where you were and what you were doing at 23:10. Who was around you?',
        ko: '23:10 시점 당시 귀하는 어느 구역에 있었으며 구체적으로 무엇을 하고 있었습니까? 근처에 누가 있었나요?'
      }[language]
    },
    {
      text: {
        zh: '⏱️ 23:15案发期间，是否看到有人路过走廊？',
        en: '⏱️ Did you see anyone passing the corridor around 23:15?',
        ko: '⏱️ 23:15 무렵 복도를 지나는 거동 수상자를 관측했습니까?'
      }[language],
      value: {
        zh: '23:14 至 23:16 期间，案发关键时刻，你身处何处？周围动向如何？',
        en: 'Between 23:14 and 23:16, during the critical moment of the crime, where were you and what did you see?',
        ko: '23:14에서 23:16 사이, 사건 정점 시간대에 귀하의 실 이동 위치와 주위 환경은 어땠습니까?'
      }[language]
    },
    {
      text: {
        zh: '⏱️ 23:20时刻你的动向是什么？',
        en: '⏱️ What was your movement at 23:20?',
        ko: '⏱️ 23:20 시점에 귀하의 동행 및 이동 경로는 어떻게 됩니까?'
      }[language],
      value: {
        zh: '23:20 黄金玉石吊坠失窃案发当时及之后，你去了哪里？',
        en: 'Right at 23:20 when the golden emerald pendant went missing, where did you go afterwards?',
        ko: '23:20 펜던트 소실 사건 발생 직후 및 그 이후에는 어디로 이동했나요?'
      }[language]
    }
  ];

  const hasContradictionUnveiled = unlockedClues.includes('c1');
  const targetCulprit = culpritId || 'maid';

  // Add the custom accusation template based on combined npcId AND targetCulprit
  if (targetCulprit === 'maid') {
    if (npcId === 'maid') {
      quickQuestions.push({
        text: {
          zh: '🔥 揭穿谎言：核对23:15走廊目击逻辑悖论！',
          en: '🔥 Confront: Debunk 23:15 Corridor Witness Paradox!',
          ko: '🔥 거짓 폭파: 23:15 복도 목격 시간과 공간 모순 증명!'
        }[language],
        value: {
          zh: '指控：陈敏，你说你23:15一直在大走廊且周围完全没有人影子路过。但是管家已经证实他23:15在厨房，访客也证实23:15在厨房。访客去厨房和管家烧红茶都必须路过你声称守着的这一条走廊！如果你的确守在那里，你为什么斩钉截铁嘴硬声称根本没有任何人走动？你在撒谎！你当时不在现场，你根本是去客厅偷玉石或者藏吊坠了！',
          en: 'Confrontation: Chen Min, you claim that at 23:15 you were along the corridor and saw absolutely no one. However, the butler confirmed he was in the kitchen at 23:15, and the visitor also confirmed being in the kitchen then. For the visitor to reach the kitchen, they had to cross your corridor! If you were really there, how could you claim there was no movement? You are lying! You were not there; you slipped into the parlor to steal or hide the pendant!',
          ko: '신문: 천민 씨, 당신은 23:15에 복도를 지키고 있었고 아무인도 보지 못했다고 단언했습니다. 하지만 집사는 23:15에 주방에 주재했고 주 사장 역시 주방으로 이동했습니다. 주 사장이 주방으로 가려면 귀하가 청소하던 복도를 가로지르는 수밖에 없습니다! 정말 거기 있었다면 어떻게 한 존재도 보지 못했을까요? 당신은 거짓말을 하고 있습니다! 그 시점에 절도 행각을 위해 다른 곳으로 이동했음이 다분합니다!'
        }[language]
      });
    } else if (npcId === 'visitor') {
      quickQuestions.push({
        text: {
          zh: '💬 证实：23:15你在厨房里是否见到李管家？',
          en: '💬 Corroborate: Did you see Butler Li in the kitchen at 23:15?',
          ko: '💬 물증 대조: 23:15에 주방에 갔을 때 집사 이국동 씨가 있었습니까?'
        }[language],
        value: {
          zh: '周先生，23:15你进入后厨接冷饮或苏打水时，李管家当时是不是确切地在烧开水泡甘菊茶、全程没有外出？',
          en: 'Mr. Zhou, when you entered the kitchen for soda at 23:15, was Butler Li indeed there boiling water for chamomile tea, without leaving?',
          ko: '주 사장님, 23:15 무렵 후주방에 갔을 때 이국동 집사가 오롯이 온차를 끓이며 자리를 지키고 있었습니까?'
        }[language]
      });
    } else if (npcId === 'butler') {
      quickQuestions.push({
        text: {
          zh: '💬 证实：23:15是否有外客进入厨房找你？',
          en: '💬 Corroborate: Did a visitor enter the kitchen at 23:15?',
          ko: '💬 물증 대조: 23:15 무렵 외래객이 주방에 진입한 기록이 있나요?'
        }[language],
        value: {
          zh: '李管家，在23:15期间，周海平先生是否进过厨房，向你要过冷气泡苏打水？',
          en: 'Butler Li, around 23:15, did Mr. Zhou Haiping enter the kitchen and ask you for ice-cold bubble soda water?',
          ko: '이국동 씨, 23:15 전후에 주 사장이 실질적으로 주방 대문을列고 들어와 탄산음료수를 요구한 사실이 존재합니까?'
        }[language]
      });
    }
  } else if (targetCulprit === 'butler') {
    if (npcId === 'butler') {
      quickQuestions.push({
        text: {
          zh: '🔥 揭穿谎言：核对23:15没人也无开水的悖论！',
          en: '🔥 Confront: Explain empty kitchen & dry kettle at 23:15!',
          ko: '🔥 거짓 폭파: 23:15 사람도 물도 없는 비어버린 주방 단죄!'
        }[language],
        value: {
          zh: '指控：李国栋，你说你23:15一直在厨房调咖啡和甘菊红茶，全过程接待了进来的周先生。但是周先生已经证实他23:15去厨房拿气泡水时里面空空如也，连个鬼影都没有，只有水壶开锅了在一旁滚烫没人管。你既然擅离跑去了客厅撬柜行窃，为什么编造接待在场口供？你在扯谎撒谎！',
          en: 'Confrontation: Li Guodong, you claim that at 23:15 you were in the kitchen preparing coffee and chamomile tea, serving Mr. Zhou the whole time. However, Mr. Zhou confirmed that when he went to the kitchen at 23:15, it was empty with no soul inside, whilst the boiler was dry boiling unattended. Since you left to safe-crack the parlor drawer, why did you fabricate this alibi? You are lying!',
          ko: '신문: 이국동 씨, 당신은 23:15에 주방에서 차와 다과를 제조 중이었고 주 사장을 직접 마중했다고 주장했습니다. 하지만 주 사장은 수돗가에 진입했을 때 아무도 없었으며 전열 냄비만 물 없이 가열되고 흐르고 있었다고 진술했습니다. 거실 비밀 수납공간을 해정하기 위해 자리를 비워놓고 왜 완벽한 마중 알리바이를 장식했습니까? 거짓진술을 멈추십시오!'
        }[language]
      });
    } else if (npcId === 'visitor') {
      quickQuestions.push({
        text: {
          zh: '💬 证实：23:15进入厨房时里面是否空无一人？',
          en: '💬 Corroborate: Was the kitchen completely empty at 23:15?',
          ko: '💬 물증 대조: 23:15 주방 진입 무렵 정말 사람이 한 명도 부재했습니까?'
        }[language],
        value: {
          zh: '周先生，请确认：你23:15走廊走进厨房时，厨房煤气灶的滚水壶是不是在嗡嗡大开，而里面李管家却人影俱无，他到底溜去了哪里？',
          en: 'Mr. Zhou, please confirm: when you walked into the kitchen at 23:15, was the kettle violently dry-boiling while Butler Li was nowhere to be found? Where did he sneak off to?',
          ko: '주 사장님, 기입 바랍니다: 23:15에 복도를 통해 주방에 진포했을 당시 끓는 주전자는 굉음을 내고 돌고 있는데 이국동 집사는 온데간데없었습니까? 그가 어디에 은신해 있었을까요?'
        }[language]
      });
    } else if (npcId === 'maid') {
      quickQuestions.push({
        text: {
          zh: '💬 证实：23:15是否看到周先生和管家的流动？',
          en: '💬 Corroborate: Did you see Mr. Zhou or the butler move around 23:15?',
          ko: '💬 물증 대조: 23:15 전후 주 사장이나 이국동 집사가 이동하는 경로를 관찰했나요?'
        }[language],
        value: {
          zh: '陈敏，你在走廊清扫时，23:15前后是否隐约看到周海平慢条斯理地独自走进了后厨？当时后厨方向有没有人交谈？',
          en: 'Chen Min, when you were sweeping the corridor, did you see Mr. Zhou walk alone into the kitchen around 23:15? Was there any conversation coming from the kitchen?',
          ko: '천민 씨, 복도 청소 도중 23:15 전후 시간대에 주 사장이 느슨한 자세로 유유히 주방에 혼자 진입하는 경로를 목도했습니까? 주방 내부에서 차소리나 대화 파동이 검출되었나요?'
        }[language]
      });
    }
  } else if (targetCulprit === 'visitor') {
    if (npcId === 'visitor') {
      quickQuestions.push({
        text: {
          zh: '🔥 揭穿谎言：核对自言泡茶接待的重大驳火！',
          en: '🔥 Confront: Expose fabricated butler reception alibi!',
          ko: '🔥 거짓 폭파: 주방에서 이국동 집사와 차담을 나눴다는 알리바이 파훼!'
        }[language],
        value: {
          zh: '指控：周海平，你说你23:15极渴，进入厨房由管家李国栋当面给你端气泡红茶并讨论了茶叶。可是李管家已经明确说，23:12至23:25期间厨房除了他自己，绝对没有第二人进来或取冷水！你在捏造借口，掩盖你利用大厅漆黑行窃真钻并藏入水池最底端的罪行！',
          en: 'Confrontation: Mr. Zhou, you claim you were extremely thirsty at 23:15, entering the kitchen where Butler Li served you in person and discussed tea. However, Butler Li confirmed that between 23:12 and 23:25, absolutely no second person entered or took water; he was entirely alone! You forged this perfect cover-up to hide using the blackout to steal the necklace and stuff it into the bottom of the sink cabinet!',
          ko: '신문: 주해평 씨, 당신은 23:15에 극심한 갈증으로 주방에 들어가 집사 이국동 대면 아래 음료를 마셨다고 호언장담했습니다. 하지만 이국동 집사는 23:12~23:25 사이 주방에는 본인 단독 외에 어떤 인간도 통과하거나 물을 가져가지 않았다고 확인했습니다! 당신은 칠흑 정전 중에 비밀 수장고를 소거하고 보석을 수조 바닥에 유기하기 위해 완벽한 알리바이를 날조했습니다!'
        }[language]
      });
    } else if (npcId === 'butler') {
      quickQuestions.push({
        text: {
          zh: '💬 证实：23:15是否真的任何人未见推门？',
          en: '💬 Corroborate: Confirm that absolutely no one entered the kitchen at 23:15?',
          ko: '💬 물적 대조: 23:15 정점 무렵 주방에 어느 타인도 들어오지 않은 게 완벽합니까?'
        }[language],
        value: {
          zh: '李管家，请你再次向我确定：在23:12至23:25你泡甘菊茶时，周海平先生真的一丁点都未推过厨房门找你借用杯水么？',
          en: 'Butler Li, please confirm once again: when you were brewing chamomile tea between 23:12 and 23:25, did Mr. Zhou Haiping absolutely not touch or open the kitchen door at all?',
          ko: '이국동 집사님, 재확인 요청합니다: 23:12에서 23:25 사이 온차 우림 도중, 주 사장이 눈길 한 톨이나 주방문을 가볍게라도 열고 접견을 요구한 사건이 존재하지 않습니까?'
        }[language]
      });
    } else if (npcId === 'maid') {
      quickQuestions.push({
        text: {
          zh: '💬 证实：23:15走廊扫地时周先生的异样？',
          en: '💬 Corroborate: Any suspicious behavior by Mr. Zhou on the corridor?',
          ko: '💬 물증 대조: 복도 정비 당시 주 사장의 탈선 거동이나 이상 동향이 포착되었습니까?'
        }[language],
        value: {
          zh: '陈敏，你擦洗长廊画框时，周海平在23:15之前是否有匆匆从起居大门鬼鬼祟祟地钻路出来？',
          en: 'Chen Min, when you were cleaning the corridor paintings, did you catch Mr. Zhou slinking suspiciously out of the living room doors right before 23:15?',
          ko: '천민 씨, 그림틀을 정비할 당시 23:15 바로 직전에 주 사장이 거실 정문 복도로 살그머니 발을 빼며 배회하는 광경을 감지한 적 있나요?'
        }[language]
      });
    }
  } else if (targetCulprit === 'niece') {
    if (npcId === 'niece') {
      quickQuestions.push({
        text: {
          zh: '🔥 揭穿谎言：核对二楼台灯砸毁与1F香薰泥迹！',
          en: '🔥 Confront: Explain broken 2F lamp and 1F aromatherapy dirt!',
          ko: '🔥 거짓 폭파: 2층 전등 전복과 1층의 특제 화분 흙더미 결부!'
        }[language],
        value: {
          zh: '指控：韩雨欣，你说你案发期间由于惧怕黑暗，全程抱膝缩在二楼自己的闺房内，连电闸断电都没有探头出来。如果是这样，你房里被砸坏深埋在碎瓷器底下的贵重台灯，切口边缘为什么会紧紧咬挂一缕属于你用来配长耳环的黑色假短丝发？而且楼上那尘土微小的走廊第二台阶，又为何带有只可能从一楼大厅盆溢出的酸香香草香薰叶片？！你在撒谎！你在断电那一瞬间偷偷下了楼行窃，慌乱折回才打翻了你房里的台灯！',
          en: 'Confrontation: Ms. Han, you claim that because of your fear of the dark, you stayed in your 2F bedroom, and didn\'t peek out when the fuse blew. If so, why was a strand of your black cosplay wig caught inside the broken bedside lamp shards? And why were there traces of acidic chamomile/rose potting soil—which only exists in the 1F lobby parlor—resting on the staircase 2nd step? You are lying! You slunk downstairs in the dark, stolen the pendant, and broke your lamp in a cold sweat upon frantic return!',
          ko: '신문: 한우흔 양, 당신은 암전에 대한 공포감으로 2층 침소에서 전 과정 이불을 덮고 대피해 있었으며 문밖을 나가지 않았다고 단언했습니다. 그렇다면 귀하의 방 안에서 격파된 침상 전등 파편 틈새에서 귀하의 가발 검은 원사가 합치 검출된 자초지종은 무엇입니까? 또한 2층 계단 발판 위에서 1층 화분에서만 생육 중이던 분홍 점토형 장미 잎 점적이 검출된 물적 근거는 무엇입니까? 당신은 이의가 흐려진 극비 자물쇠를 해방하고, 도망쳐 올라오는 어둠 속에서 실수로 등을 깨뜨린 것입니다!'
        }[language]
      });
    } else if (npcId === 'visitor') {
      quickQuestions.push({
        text: {
          zh: '💬 证实：23:15是否看到韩雨欣下楼身影？',
          en: '💬 Corroborate: Did you see Ms. Han slipping downstairs?',
          ko: '💬 물적 대조: 정전 당시 한 양이 아래층으로 거동하는 흔적을 주시하셨습니까?'
        }[language],
        value: {
          zh: '周先生，你23:15路过走廊往厨房时，大厅一片漆黑。你有没有听到侧楼梯有女式的急促、慌里慌张的跑步震动？',
          en: 'Mr. Zhou, when you passed the dark lobby towards the kitchen at 23:15, did you hear some hurried, panicked feminine runner footsteps pattering along the side staircases?',
          ko: '주 사장님, 23:15에 어둠 차단 복도를 걸을 당시 측면 나무 계단 통로에서 여성용 구두 굽의 급박하고 공포에 질린 타진 굉음이 울려 퍼진 것을 들으신 적 있나요?'
        }[language]
      });
    } else if (npcId === 'maid') {
      quickQuestions.push({
        text: {
          zh: '💬 证实：23:15之后二楼大台灯坠地轰响？',
          en: '💬 Corroborate: Did you hear a lamp shattering on 2F?',
          ko: '💬 물적 대조: 복도 정화 시기 2층에서 전등 도자가 돌발 붕괴하는 폭발음을 관측했습니까?'
        }[language],
        value: {
          zh: '陈敏，你在走廊拿着抹布扫地时，在 23:15 偏后、或者大厅供电断掉的当刻，楼上女主人韩雨欣房里是不是发出过一声瓷器重重砸翻落地的沉闷轰响？',
          en: 'Chen Min, when you were active on the floor in the dark, did you hear a loud, heavy porcelain crash and glass smashing coming from Ms. Han\'s 2F chamber right after the blackout?',
          ko: '천민 씨, 정전이 발생한 23:15 파동 직후에 귀하의 위쪽 한우흔 침실 주변에서 화기 전등이 연쇄 대리석 바닥을 내동댕이치는 소리가 들렸습니까?'
        }[language]
      });
    }
  } else if (targetCulprit === 'doctor') {
    if (npcId === 'doctor') {
      quickQuestions.push({
        text: {
          zh: '🔥 揭穿谎言：核对配电黑色大闸与配盘药单！',
          en: '🔥 Confront: Expose main power lever cutoff & forge prescription!',
          ko: '🔥 거짓 폭파: 메인 배전반 손절단 차단과 조제 내역 위조의 이면!'
        }[language],
        value: {
          zh: '指控：陆浩然，你说你23:15一直在地下一层最深处的恒温酒窖核对老爷子的心脏处方药单并贴小标签，中途从未碰过大总电闸。但凡是神医都知道，低温配药不需要在昏暗配电匣旁逗留！你自诩23:15进行了细致的工作，而整个恒温箱在23:15到23:25期间根本没有开启的温变温度记录，反而大总闸金属黑色手柄留下了由于仓促推上大闸残留的一片因指甲磨蹭脱落的乳橡胶手套碎粉！证明你拉断闸，借黑暗行窃并捏造医疗值班，你在说弥天大谎！',
          en: 'Confrontation: Dr. Lu, you claim that at 23:15 you were at the B1 wine cellar sifting prescription papers and sticking tags, never touching the fuse box. But every expert knows that prescription work does not require lingering near industrial breakers in the damp! Your cold dispenser recorded absolutely no opening logs between 23:15 and 23:25. Instead, the main cut-off lever had fresh white latex glove powder scraped from a hurried swipe. You pulled the main breaker to cause a blackout, sneaked into the parlor to steal the jewel, and forged your medical log!',
          ko: '신문: 육호연 씨, 당신은 23:15에 지하 1층 배전박스 옆의 냉온 보관 박스에서 처방전 라벨을 검토하고 있었으며 브레이커 전력 차단 버튼을 타진하지 않았다고 강변했습니다. 하지만 극소 저온 의과학 기기는 23:15~23:25 사이 전면 개방 이력이 감출 없이 가동 중단되었으며, 대신 전원 메인 복귀 핸들 우측 한탄에 백색 유동 고무 미세 가루가 검침되었습니다! 당신은 의도적으로 거택 정전을 야기하고 의무 대기를 위조해 거실의 걸작품을 탈취한 것입니다!'
        }[language]
      });
    } else if (npcId === 'butler') {
      quickQuestions.push({
        text: {
          zh: '💬 证实：23:15全楼大断电之前供电波动？',
          en: '💬 Corroborate: Any power fluctuations before B1 blackout?',
          ko: '💬 물적 대조: 23:15 주 배전 지네가 내려가기 전 전기 등화 흔들림 현상이 목격되었습니까?'
        }[language],
        value: {
          zh: '李管家，你23:15在灶台烧水大沸时，你面前的后厨长明灯在整栋断电前，是否伴随大工业闸被暴力强拉产生的两下激烈电压瞬闪瞬暗？',
          en: 'Butler Li, when you were brewing tea, did the kitchen fluorescent lamp experience two dramatic voltage drops and flickering moments-typical of high-voltage industrial manual switches being forced down-right before the total blackout?',
          ko: '이국동 집사님, 23:15 물이 끓던 시기에 주방 가스 기기 부근 천장 영생등이 일시적으로 깜빡거리며 압력 도작이 요동치는 물리 전조 현상이 수반되었나요?'
        }[language]
      });
    } else if (npcId === 'maid') {
      quickQuestions.push({
        text: {
          zh: '💬 证实：23:15之前医生是否急促走向地下酒库？',
          en: '💬 Corroborate: Did Dr. Lu rush down to B1 right before 23:15?',
          ko: '💬 물적 대조: 23:15 직전 주치의 육의사가 지하로 다급히 직진하는 기척을 감각했습니까?'
        }[language],
        value: {
          zh: '陈敏，你案发期间正好守在离地下酒库楼梯最近的走廊画墙。在23:15分全网熄灭前两分钟，陆医生有没有行色匆忙、带着手套从你扫地的身边不语擦过，踏入地下酒窖入口？',
          en: 'Chen Min, you were cleaning the wall closest to the basement stairs. Two minutes before the blackout at 23:15, did Dr. Lu brush quietly past you in surgical gloves, hurrying down into the cellar?',
          ko: '천민 씨, 사건 무렵 지하 계단 진입부 초입과 가장 인접한 복도 그림틀 부근에 정위하고 있었습니다. 23:15 전전 무렵, 육 원장이 장갑을 기민하게 조이고 침묵하는 보폭으로 옆을 우회해 지하 계단으로 직행해 내려간 적이 있습니까?'
        }[language]
      });
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickQuestionClick = (value: string) => {
    if (isGenerating) return;
    onSendMessage(value);
  };

  return (
    <div id="dialogue-box-container" className={`flex flex-col h-full bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl animate-fade-in text-slate-100 ${shakeActive ? 'gavel-shake' : ''}`}>
      <style>{`
        @keyframes custom-shake {
          0%, 100% { transform: translate(0, 0) rotate(0); }
          15% { transform: translate(-6px, 4px) rotate(-1deg); }
          30% { transform: translate(6px, -3px) rotate(1deg); }
          45% { transform: translate(-4px, -3px) rotate(-0.5deg); }
          60% { transform: translate(4px, 4px) rotate(0.5deg); }
          75% { transform: translate(-2px, 1px) rotate(-0.2deg); }
          90% { transform: translate(2px, -1px) rotate(0.2deg); }
        }
        .gavel-shake {
          animation: custom-shake 0.15s ease-in-out infinite;
        }
        @keyframes avatar-breakdown-shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-2px, 1.5px) rotate(-0.5deg); }
          20% { transform: translate(2px, -1.5px) rotate(0.5deg); }
          30% { transform: translate(-1.5px, -1px) rotate(-0.2deg); }
          40% { transform: translate(1.5px, 2px) rotate(0.3deg); }
          50% { transform: translate(-2px, 1px) rotate(-0.5deg); }
          60% { transform: translate(2px, -1px) rotate(0.5deg); }
          70% { transform: translate(-1px, 2px) rotate(0.2deg); }
          80% { transform: translate(1.5px, -1px) rotate(-0.2deg); }
          90% { transform: translate(-1px, -1.5px) rotate(0.1deg); }
        }
        .avatar-shaking {
          animation: avatar-breakdown-shake 0.25s ease-in-out infinite;
        }
      `}</style>
      
      {/* Dialogue Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <button
          id="dialogue-exit-back-btn"
          onClick={onExit}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>
            {language === 'en' ? 'Return to Room' : language === 'ko' ? '현장 이동으로 복귀' : '返回现场移动'}
          </span>
        </button>

        <div className="text-center animate-fade-in">
          <span className="text-[10px] tracking-widest text-rose-500 uppercase font-mono font-bold block">
            {language === 'en' ? 'INTERROGATION CABINET · Confront' : language === 'ko' ? 'INTERROGATION CABINET · 피심문 용의자 직대면' : 'INTERROGATION CABINET · 正对讯问'}
          </span>
          <h3 className="text-sm font-bold text-white font-sans">
            {language === 'en' ? 'Quizzing: ' : language === 'ko' ? '대면 심문: ' : '对口盘查：'}{npc.name} ({npc.roleName})
          </h3>
        </div>

        <div className="text-xs text-slate-500 font-mono hidden sm:block">
          STATUS: CASE ACTS
        </div>
      </div>

      {/* Main Dialogue Splitted Area (NPC Profile left / Messages right) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        
        {/* Left Side: NPC visual profile card & real-time emotions */}
        <div id="npc-sidebar-profile" className="w-full md:w-[340px] bg-slate-950 p-5 border-b md:border-b-0 md:border-r border-slate-800 flex flex-row md:flex-col items-center md:items-stretch gap-4 shrink-0 overflow-y-auto w-full md:max-w-xs lg:max-w-sm">
          {/* Avatar frame */}
          <div className="w-40 h-52 sm:w-48 sm:h-64 md:w-76 md:h-[420px] bg-slate-900/40 rounded-xl shrink-0 relative overflow-hidden self-center flex items-center justify-center p-1 border border-slate-800/40 shadow-inner">
            <img
              src={(isCurrentlyInOutburst && outburstAvatar) ? outburstAvatar : npc.avatar}
              alt={npc.name}
              referrerPolicy="no-referrer"
              className={`h-full w-auto max-w-none object-contain filter drop-shadow-[0_14px_22px_rgba(0,0,0,0.9)] brightness-100 saturate-100 transition-all hover:scale-105 duration-300 ${shouldShake ? 'avatar-shaking' : ''}`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const avatarNode = e.currentTarget.parentElement?.querySelector('.avatar-box');
                if (avatarNode) avatarNode.classList.remove('hidden');
              }}
            />
            <div className="avatar-box hidden absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center font-bold font-serif text-rose-400 text-3xl rounded-xl">
              {npc.name[0]}
            </div>
          </div>

          {/* NPC Name & Bio Info */}
          <div className="flex-1 md:flex-none md:text-center space-y-1.5 md:mt-3">
            <h4 className="text-sm font-bold text-white">{npc.name}</h4>
            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono tracking-wider font-bold bg-rose-950 text-rose-400 border border-rose-900/30 uppercase">
              {npc.roleName}
            </span>
            <p className="text-[11px] text-slate-400 leading-normal font-sans font-light text-left md:text-center mt-1">
              {npc.personality}
            </p>
          </div>

          {/* Realtime Emotion Meter */}
          <div className="hidden sm:block md:w-full bg-slate-900/70 p-3 rounded-xl border border-slate-800 md:mt-auto space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold block font-sans">
                {language === 'en' ? 'Suspect Stress Level:' : language === 'ko' ? '용의자 돌파 심리 정서:' : '嫌疑人突破情绪:'}
              </span>
              <span className="font-mono">{npcEmotion}%</span>
            </div>

            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  npcEmotion >= 80 
                    ? 'bg-rose-500 shadow-lg shadow-rose-950 animate-pulse' 
                    : npcEmotion >= 45 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${npcEmotion}%` }}
              />
            </div>

            <span className={`text-[10px] border px-2 py-0.5 rounded tracking-wide inline-block w-full text-center ${emotionRatingColor}`}>
              {language === 'en' ? 'Current State: ' : language === 'ko' ? '현재 심리 상태: ' : '当前情绪：'}{emotionRating}
            </span>
          </div>

        </div>

        {/* Right Side: Conversation interface */}
        <div id="dialogue-chat-portal" className="flex-1 flex flex-col overflow-hidden bg-slate-900/40 p-4">
          
          {/* Messages Log Panel scrollable */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 min-h-0 animate-fade-in" id="chat-messages-scroller">
            
            {/* Introductory statement */}
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed max-w-2xl mx-auto space-y-1 select-none">
              <span>👤 <span className="font-semibold text-rose-400">
                {language === 'en' ? 'CASE BRIEFING MEMORANDUM: ' : language === 'ko' ? '사건 실질 각서: ' : '案件基本事实备忘：'}
              </span>
              {language === 'en' 
                ? 'The pendant theft occurred between [23:10 - 23:20]. The villa doors were locked throughout. Interrogate suspect below!' 
                : language === 'ko'
                ? '펜던트 도난 사고는 정전 [23:10 ~ 23:20] 사이에 발발했습니다. 정당 대화를 통해 진상을 밝혀내십시오.'
                : '该起黄金绿宝石吊坠失窃案发生在【23:10至23:20】。别墅当时大门紧锁。你可以打字自由质问或利用下方的快速指涉，攻破嫌疑人的防线吧！'}
              </span>
            </div>

            {/* Bubble Rendering Array */}
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'player' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-md flex flex-col space-y-1 ${
                    msg.sender === 'player'
                      ? 'bg-rose-600 text-white rounded-tr-none'
                      : 'bg-slate-950 text-slate-100 rounded-tl-none border border-slate-800/80'
                  }`}>
                    
                    {/* Bubble Label */}
                    <span className="text-[9px] uppercase tracking-wider font-mono opacity-60">
                      {msg.sender === 'player' 
                        ? (language === 'en' ? 'You (Detective)' : language === 'ko' ? '당신 (수사관)' : '你 (探长)')
                        : `${npc.name} (${npc.roleName})`}
                    </span>
                    
                    {/* Bubble Content Text */}
                    <p className="text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line font-light select-text">
                      {msg.text}
                    </p>

                    {/* NPC emotion delta response stamp */}
                    {msg.sender === 'npc' && msg.emotionValue !== undefined && (
                      <span className="text-[9px] flex items-center space-x-1 pt-1 opacity-50 border-t border-slate-900 font-mono mt-1 select-none">
                        <span>
                          {language === 'en' ? 'Anxiety Rate: ' : language === 'ko' ? '심리 불안도: ' : '焦虑度: '}{msg.emotionValue}%
                        </span>
                      </span>
                    )}

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* GEMINI LOADER STATE */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-slate-950/40 border border-slate-800/80 text-slate-400 rounded-2xl rounded-tl-none p-4 flex items-center space-x-3 max-w-sm">
                  <Loader2 className="w-4 h-4 text-rose-500 animate-spin" />
                  <span className="text-xs font-mono font-bold animate-pulse text-rose-500 italic block">
                    {language === 'en' 
                      ? "Analyzing suspect's psychological waves..." 
                      : language === 'ko'
                      ? "용의자의 피심 동공 변화 및 진술 대조 분석 중..."
                      : "正在对比证词疑点与谎言心理波动..."}
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested Quick Question Suggestions Panel */}
          <div id="quick-inquiries-deck" className="bg-slate-950/80 p-3.5 rounded-t-xl border-t border-x border-slate-800 mt-2 select-none">
            <span className="text-[10px] font-bold text-slate-400 block uppercase mb-2">
              {language === 'en' ? '💡 Suggested Inquiries:' : language === 'ko' ? '💡 권장 대면 심문 항목:' : '💡 快速证据询问提示（双击可直接提交）：'}
            </span>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickQuestionClick(q.value)}
                  disabled={isGenerating}
                  className="bg-slate-900 hover:bg-rose-950/50 hover:border-rose-800 border border-slate-700/80 text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg text-left text-[11px] leading-tight transition cursor-pointer flex-1 min-w-[200px]"
                >
                  {q.text}
                </button>
              ))}
            </div>
            {(() => {
              const culpritNameText = targetCulprit === 'maid' 
                ? (language === 'en' ? 'Maid Chen' : language === 'ko' ? '식모 천민' : '佣人陈敏') 
                : targetCulprit === 'butler' 
                ? (language === 'en' ? 'Butler Li' : language === 'ko' ? '집사 이국동' : '管家李国栋') 
                : (language === 'en' ? 'Mr. Zhou' : language === 'ko' ? '주 사장' : '访客周海平');
              
              if (npcId === targetCulprit && !hasContradictionUnveiled) {
                return (
                  <div className="mt-2 text-[10px] text-yellow-600 bg-yellow-950/20 p-2 border border-yellow-900/30 rounded flex items-center space-x-1 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>
                      {language === 'en' 
                        ? `You must first cross-examine suspects about 23:15 and inspect the timetable before launching direct accusations against 【${culpritNameText}】.` 
                        : language === 'ko'
                        ? `수사관님께서는 23:15 시점의 어긋남을 대조 확인하고 증거표를 보충해야만 【${culpritNameText}】에게 타격을 가할 수 있습니다.`
                        : `你必须先和所有人盘问关于 23:15 的证词并查看时间线比对表，才能向【${culpritNameText}】发起致命的冲撞指控爆破口供。`}
                    </span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* Typing Form box */}
          <form onSubmit={handleSubmit} className="relative z-10 flex border-t border-slate-800 bg-slate-950 p-2.5 rounded-b-xl border-x border-b gap-2.5 items-center">
            <button
              type="button"
              onClick={() => {
                playPaperFlipSound();
                setShowEvidenceCabinet(true);
              }}
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-xs tracking-wider rounded-lg flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition cursor-pointer select-none active:scale-95 border border-amber-400/30 shrink-0"
              title={language === 'en' ? 'Present Collected Clues' : language === 'ko' ? '수집한 증거 전적 제시' : '出示搜寻到的关键物证，击碎其谎言'}
            >
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span>
                {language === 'en' ? 'Present Clue' : language === 'ko' ? '증거 제시' : '呈堂证物'}
              </span>
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isGenerating}
              placeholder={
                isGenerating 
                  ? (language === 'en' ? "Analyzing suspect response..." : language === 'ko' ? "답변 조율 수립 중..." : "等待嫌疑人回答中...") 
                  : {
                      zh: `向 [${npc.name}] 提出质询、或者直接点击【呈堂证物】出示物证面揭谎言...`,
                      en: `Interrogate [${npc.name}] or present evidence to break their lie...`,
                      ko: `[${npc.name}]에게 질의를 전송하거나, [증거 제시]로 사실 전모를 고착시키십시오...`
                    }[language]
              }
              className="flex-grow bg-slate-900/80 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={isGenerating || !inputText.trim()}
              className={`p-2.5 px-4 rounded-lg font-medium text-xs flex items-center space-x-1.5 transition cursor-pointer shrink-0 ${
                isGenerating || !inputText.trim()
                  ? 'bg-slate-800 text-slate-500'
                  : 'bg-rose-600 text-white hover:bg-rose-700 active:scale-95 shadow'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === 'en' ? 'Send' : language === 'ko' ? '신문 송신' : '提出质询'}
              </span>
            </button>
          </form>

        </div>

      </div>

      {/* Dramatic Cinematic Objection Banner Overlay */}
      <AnimatePresence>
        {objectionActive && (
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: 1,
              x: [0, -12, 12, -12, 12, 0],
              y: [0, 8, -8, 8, -8, 0]
            }}
            exit={{ scale: 1.6, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center z-50 bg-rose-950/45 backdrop-blur-[2px] pointer-events-none"
          >
            <div 
              id="objection-flash-badge" 
              className="bg-gradient-to-r from-red-650 via-rose-600 to-red-650 text-white border-y-4 border-yellow-400 font-extrabold font-serif px-12 py-7 text-4xl sm:text-5xl md:text-6xl tracking-widest shadow-[0_0_60px_rgba(239,68,68,0.9)] uppercase relative select-none"
              style={{
                textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                transform: 'rotate(-5deg)'
              }}
            >
              <div className="absolute top-1 left-2 text-[9px] uppercase font-mono tracking-widest text-yellow-350 opacity-80 leading-none">
                ★ COUNTER-CONFRONTATION SYSTEM ★
              </div>
              {language === 'en' ? 'OBJECTION!!!' : language === 'ko' ? '이의 있소!!!' : '有异议！！！'}
              <div className="absolute -bottom-3 right-4 bg-yellow-400 text-black text-[9px] font-mono px-2 py-0.5 rounded font-black tracking-normal uppercase shrink-0 transform rotate-6 border border-black shadow">
                Objection!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Handheld Evidence briefcase Cabinet Modal Drawer */}
      <AnimatePresence>
        {showEvidenceCabinet && (
          <motion.div
            id="evidence-cabinet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 border border-slate-700/60 rounded-xl"
          >
            <motion.div
              id="evidence-cabinet-panel"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-2xl max-h-[90%] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Cabinet Header */}
              <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 select-none">
                  <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20 shadow-inner">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-350 tracking-wide font-mono">
                      {language === 'en' ? "💼 Detective's Evidence Briefcase" : language === 'ko' ? "💼 수사단 전용 증거 품목 보관실" : "💼 探长的手提证物陈列箱"}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {language === 'en' ? "Show physical evidence to the matching suspect's albi" : language === 'ko' ? "현장에서 포착한 증거를 선택해 용의자의 진술 전모와 교차 신문하십시오" : "选择一件您在现场勘查到的事实物证，与嫌犯当前的口供进行比对指控"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playPaperFlipSound();
                    setShowEvidenceCabinet(false);
                  }}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-lg cursor-pointer transition border border-transparent hover:border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cabinet List Scrollable Area */}
              <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-950/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {localizedEvidenceList.map((evidence) => {
                    const discovered = checkEvidenceDiscovered(evidence.id, customNotes);
                    const isNpcEvidence = evidence.associatedNpc === npcId;

                    return (
                      <div
                        key={evidence.id}
                        className={`flex flex-col border rounded-lg p-3 relative overflow-hidden transition ${
                          discovered
                            ? isNpcEvidence
                              ? 'bg-rose-950/20 border-rose-700/40 hover:border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.06)] animate-fade-in'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 shadow-sm animate-fade-in'
                            : 'bg-slate-950/70 border-slate-900 opacity-60'
                        }`}
                      >
                        {/* Discovered Clue */}
                        {discovered ? (
                          <>
                            {/* Room Badge */}
                            <div className="flex items-center justify-between text-[9px] mb-1.5 font-mono select-none">
                              <span className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50">
                                📍 {evidence.roomName}
                              </span>
                              {isNpcEvidence && (
                                <span className="text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/30 font-bold tracking-tight animate-pulse shrink-0">
                                  {language === 'en' ? '⚠️ Gaps / Paradox Locked' : language === 'ko' ? '⚠️ 모순 타격 일치' : '⚠️ 锁定嫌合矛盾'}
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs font-bold text-slate-100 mb-1 flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="select-text">{evidence.name}</span>
                            </h4>

                            <p className="text-[10px] text-slate-300 leading-relaxed mb-3 flex-grow bg-slate-950/45 p-1.5 rounded border border-slate-900 font-mono select-text">
                              {evidence.description}
                            </p>

                            {/* Present Button */}
                            <button
                              type="button"
                              onClick={() => handlePresentEvidence(evidence.id)}
                              className={`w-full py-1.5 rounded text-[10px] font-black tracking-wide flex items-center justify-center gap-1 cursor-pointer transition ${
                                isNpcEvidence
                                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:brightness-110 shadow-lg active:scale-[0.98]'
                                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-[0.98]'
                              }`}
                            >
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                {language === 'en' ? '👉 Confront Suspect (Cross-Interrogate)' : language === 'ko' ? '💥 지목 신문 (정황 정밀 교사)' : '👉 对准抛掷指控 (Cross-Interrogate)'}
                              </span>
                            </button>
                          </>
                        ) : (
                          /* Locked Clue Drawer */
                          <div className="flex flex-col items-center justify-center py-6 text-center h-full min-h-[140px] select-none">
                            <Compass className="w-8 h-8 text-slate-700 mb-2 animate-spin-slow shrink-0" />
                            <h4 className="text-[11px] font-bold text-slate-500">
                              {language === 'en' ? '🔒 Not Discovered Yet' : language === 'ko' ? '🔒 아직 대조 포착물 없음' : '🔒 尚未在现场勘查中发现'}
                            </h4>
                            <p className="text-[9px] text-slate-600 mt-1 max-w-[200px]">
                              {language === 'en' 
                                ? `Tips: Hidden in 【${evidence.roomName}】. Move to that room and conduct a thorough search!` 
                                : language === 'ko'
                                ? `안내: 사건 단서가 【${evidence.roomName}】에 잠재되어 있습니다. 이동하셔서 샅샅이 수색하십시오.`
                                : `提示：此物理证物位于【${evidence.roomName}】，请前往进行更彻底的现场勘查搜索以获取该线索。`}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cabinet Footer */}
              <div className="bg-slate-950 p-3 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none">
                <span>
                  {language === 'en' ? 'Unlocked Evidences: ' : language === 'ko' ? '확보된 증거: ' : '📂 已解锁物证：'}{localizedEvidenceList.filter(e => checkEvidenceDiscovered(e.id, customNotes)).length} / 12
                </span>
                <span className="text-amber-400">
                  {language === 'en' 
                    ? 'Hint: Present matching items to the associated suspect to trigger breakdown!' 
                    : language === 'ko'
                    ? '정보: 연관 일치 증거를 제시하면 높은 확률로 멘탈 타격이 가해집니다!'
                    : '💡 提示：将关键物证出示给关联嫌疑人即可触发高能突破！'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Triumphant Successful Evidence Presentation / Breakthrough Popup Modal */}
      <AnimatePresence>
        {successModal && (
          <motion.div
            id="evidence-success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 border border-emerald-500/30 rounded-xl"
          >
            <motion.div
              id="evidence-success-panel"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0, transition: { type: "spring", damping: 15 } }}
              exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-lg bg-gradient-to-b from-[#064e3b] via-slate-900 to-slate-950 border-2 border-emerald-500 rounded-2xl p-6 sm:p-8 text-center relative shadow-[0_0_50px_rgba(16,185,129,0.35)] space-y-5"
            >
              {/* Top Sparkly Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-bounce">
                <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>

              {/* Header Titles */}
              <div className="select-none">
                <h3 className="text-xl sm:text-2xl font-black text-emerald-350 font-sans tracking-wide">
                  {language === 'en' ? '✨ Irrefutable Proof! Defense Broken!' : language === 'ko' ? '✨ 철증여산, 심리 돌파 완료!' : '✨ 铁证如山，突破防线！'}
                </h3>
                <p className="text-xs text-emerald-500 uppercase tracking-widest font-mono mt-1">
                  CRITICAL EVIDENCE BREAKTHROUGH
                </p>
              </div>

              {/* Evidence details card list */}
              <div className="bg-slate-950/80 border border-emerald-500/20 rounded-xl p-4 text-left space-y-2.5 font-mono text-xs sm:text-sm select-text">
                <div className="flex items-start">
                  <span className="text-slate-400 shrink-0 select-none w-20">
                    {language === 'en' ? '🔎 Evidence: ' : language === 'ko' ? '🔎 핵심 증거: ' : '🔎 呈堂物证:'}
                  </span>
                  <span className="text-amber-300 font-bold">{successModal.evidenceName}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 shrink-0 select-none w-20">
                    {language === 'en' ? '📍 Room: ' : language === 'ko' ? '📍 포착 위치: ' : '📍 发现地点:'}
                  </span>
                  <span className="text-slate-200">{successModal.roomName}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-400 shrink-0 select-none w-20">
                    {language === 'en' ? '💥 Gaps: ' : language === 'ko' ? '💥 모순 타격점: ' : '💥 矛盾焦点:'}
                  </span>
                  <span className="text-rose-400 font-semibold">{successModal.contradictionTitle}</span>
                </div>
              </div>

              {/* confession reaction scroll section */}
              <div className="space-y-1.5 text-center">
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase select-none">
                  ⚡ {language === 'en' ? `Suspect 【${successModal.npcName}】 Mental Breakdown` : language === 'ko' ? `용의자 【${successModal.npcName}】 멘탈 전교 붕괴 기소` : `嫌疑人 【${successModal.npcName}】 心智大崩溃`} ⚡
                </p>
                <div className="bg-[#022c22]/40 border border-emerald-500/10 rounded-xl p-4 text-[11px] sm:text-xs text-emerald-20 max-h-[160px] overflow-y-auto leading-relaxed text-left font-sans italic border-l-4 border-l-emerald-400 select-text">
                  {successModal.reaction}
                </div>
              </div>

              {/* Confirm action button to close */}
              <button
                type="button"
                onClick={() => {
                  playPaperFlipSound();
                  setSuccessModal(null);
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl cursor-pointer shadow-lg active:scale-95 transition"
              >
                {language === 'en' ? 'CONFIRM TESTIMONY BREAKTHROUGH' : language === 'ko' ? '진 술 모 순 정 립 확 인' : '确 认 突 破 证 词'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
