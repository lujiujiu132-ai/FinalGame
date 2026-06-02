export interface TimelineRecord {
  time: string; // '23:10' | '23:15' | '23:20'
  location: string; // '客厅' | '走廊' | '厨房'
  action: string; // 工作/行为描述
  isLying: boolean; // 是否在说谎
  truthLocation?: string; // 真实的地点 (如果说谎的话)
  truthAction?: string; // 真实的动作 (如果说谎的话)
}

export type NpcId = 'butler' | 'maid' | 'visitor' | 'niece' | 'doctor';

export interface NpcStructure {
  id: NpcId;
  name: string;
  roleName: string;
  avatar: string; // Google Drive url, fallback handled
  outburstAvatar?: string; // High emotion outburst avatar url
  personality: string;
  features: string;
  initialEmotion: number; // 初始情绪值 (0-100)
  timeline: TimelineRecord[]; // 声明的时间线
  truthTimeline: TimelineRecord[]; // 真实的时间线 (用于系统核对与推导)
}

export interface ChatMessage {
  id: string;
  sender: 'player' | 'npc';
  text: string;
  emotionValue?: number; // NPC 讲话时的情绪值 (0-100)
  timestamp: number;
}

export interface NoteItem {
  id: string;
  npcId: NpcId;
  time: string;
  content: string;
  isCustom?: boolean; // 玩家自定义的记录
  clueId?: 'c1' | 'c2'; // 系统产生的线索
  hotspotId?: string; // 现场搜索到的具体Hotspot ID
}

export interface ClueItem {
  id: string;
  title: string;
  description: string;
  source: string;
  isContradiction: boolean;
}

export type Language = 'zh' | 'en' | 'ko';

export interface GameState {
  currentStage: 'start' | 'background' | 'investigate' | 'conclude' | 'ending';
  activeScene: 'living-room' | 'corridor' | 'kitchen' | 'bedroom' | 'wine-cellar';
  activeNpcId: NpcId | null;
  emotionStates: Record<NpcId, number> & { isOutburst?: Record<NpcId, boolean> }; // 动态控制情绪并且支持爆发状态
  customNotes: NoteItem[]; // 玩家笔记
  unlockedClues: string[]; // 玩家解锁的线索(矛盾点)
  selectedCulprit: NpcId | null;
  culpritReason: string;
  culpritId: NpcId; // The randomly selected culprit for the current puzzle run
  endingType: 'success' | 'fail-wrong-person' | 'fail-insufficient-evidence' | null;
}
