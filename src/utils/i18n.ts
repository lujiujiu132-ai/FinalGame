import { NpcId, NpcStructure, TimelineRecord, ChatMessage } from '../types';

export type Language = 'zh' | 'ko' | 'en';

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' }
];

// 1. Static UI Translations Dictionary
const UI_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Start Screen
  appTitle: {
    zh: '午夜疑云',
    en: 'Midnight Suspicion',
    ko: '자정의 의혹'
  },
  appSubtitle: {
    zh: 'AI 探案',
    en: 'AI Investigation',
    ko: 'AI 수사'
  },
  enginePowered: {
    zh: '由 Gemini 3.5 AI 核心驱动',
    en: 'Powered by Gemini 3.5 AI Core',
    ko: 'Gemini 3.5 AI Core 기반 작동'
  },
  startDesc: {
    zh: '深夜 23:40，封闭的私人别墅发生古董黄金翡翠吊坠失窃案。嫌疑人将时间线编织在谎言之中，依靠你的 AI 质询和逻辑推理，撕开黑幕，找出真正盗贼。',
    en: 'At 23:40 PM, a priceless antique emerald-gold pendant vanished from a locked private villa. The suspects have woven their timelines with lies. Ask AI questions, spot logical contradictions, and find the culprit.',
    ko: '자정 전 23:40, 폐쇄된 사택에서 소중한 구형 에메랄드 골드 펜던트가 실종되었습니다. 용의자들은 거짓으로 시간선을 엮었습니다. AI 질문과 논리적 모순 분석을 통해 진범을 밝혀내십시오.'
  },
  enterGame: {
    zh: '踏入别墅调查',
    en: 'Enter Villa to Investigate',
    ko: '빌라 입장하여 조사하기'
  },
  opGuide: {
    zh: '侦讯指引(操作说明)',
    en: 'Investigation Guide (How to Play)',
    ko: '조사 가이드 (조작 설명)'
  },
  // Briefing Screen
  briefTitle: {
    zh: '任务前置简报',
    en: 'Mission Dossier Briefing',
    ko: '사건 전 브리핑'
  },
  briefSubtitle: {
    zh: '《午夜疑云·AI探案》别墅失窃案',
    en: 'Midnight Suspicion · Villa Theft Case',
    ko: '《자정의 의혹 · AI 수사》 빌라 도난 사건'
  },
  briefText1: {
    zh: '中夜 23:40，别墅主人收藏的极名贵古董挂锁吊坠“夜鸦之眼”突然神秘失踪。这一十分钟内大雨封死大门，绝无外入足迹。警方推定这是一起内部作案。',
    en: 'At 23:40 PM, the highly valuable antique pendant "Eye of the Night Raven" vanished. Heavy rain locked the doors, leaving no external footprint. Police conclude it is an inside job.',
    ko: '자정 23:40, 피해자의 오래된 에메랄드 펜던트 "밤까마귀의 눈"이 사라졌습니다. 폭우가 내리쳐 문을 걸어 잠갔으므로 외부 흔적은 전혀 없습니다. 경찰은 내부 소행으로 규정했습니다.'
  },
  briefText2: {
    zh: '留堂讯问的五位嫌疑人各有财务短缺、债务或纠葛，各怀鬼胎。而破案总钥匙，正是通过追问寻找他/她在 23:15 那一刻的时空轨迹真空盲损。',
    en: 'The five suspects interviewed have financial stress, gambling or debt troubles. The master key to solving the case lies in cross-examining their coordinate gaps at exactly 23:15.',
    ko: '심문을 진행 중인 다섯 용의자는 각자 채무, 파산 위기 혹은 불화를 숨기고 있습니다. 수사의 마스터 키는 바로 23:15의 행적 모순을 찾아내 추궁하는 것입니다.'
  },
  briefGuide: {
    zh: '我们必须与他们周旋盘问，寻找 23:15 那一刻的轨迹真空，前去厨房水槽底起赃起获翡翠，将其定死在铁案中！',
    en: 'We must question them, find the loophole at 23:15, locate the hidden pendant at the bottom of the kitchen sink cabinet, and close the case!',
    ko: '우리들은 그들과 대치하여 23:15의 시간선 공백을 찾아내고, 주방 싱크대 아래에 숨겨진 펜던트를 수색 및 확보하여 확실히 구속시켜야 합니다!'
  },
  briefButton: {
    zh: '授权接手案卷 · 进入侦破 ⚖️',
    en: 'Authorize Case File · Start Interrogation ⚖️',
    ko: '사건 수락 · 수사 개시 ⚖️'
  },
  // Main Investigator Page
  titleGame: {
    zh: '午夜疑云：AI案件侦讯室',
    en: 'Midnight Suspicion: AI Interrogation Room',
    ko: '자정의 의혹: AI 사건 심문실'
  },
  accuseButton: {
    zh: '⚖️ 指控推论/指认犯人',
    en: '⚖️ Accuse Culprit',
    ko: '⚖️ 진범 공식 지목 및 송치'
  },
  sceneBoardButton: {
    zh: '📌 逻辑线索白板',
    en: '📌 Logic Pinboard',
    ko: '📌 논리 백보드'
  },
  backToSceneButton: {
    zh: '🗺️ 退出白板返回场景',
    en: '🗺️ Back to Investigation',
    ko: '🗺️ 백보드 나가기'
  },
  pinboardDesc: {
    zh: '线索墙：你可以将提取出的线索连线（点击两块线索卡）进行动态论证！',
    en: 'Pinboard: Click two clues to draw a thread and unlock a high-level logical breakthrough!',
    ko: '단서 벽: 단서 두 개를 잇달아 클릭하여 선을 이어 고난도 논리적 추론을 잠금 해제하십시오!'
  },
  pinboardTitle: {
    zh: '🧠 逻辑棉线连线墙',
    en: '🧠 Logic Thread Pinboard',
    ko: '🧠 논리 단서 연결 백보드'
  },
  pinboardSubtitle: {
    zh: '将提取出的嫌疑人口供和犯罪现场物证进行交叉连线对撞，揭开隐藏逻辑！',
    en: 'Connect testimonies and physical findings to discover hidden logical paradoxes!',
    ko: '수집한 진술과 물증을 서로 연결해 숨겨진 모순을 찾아내십시오!'
  },
  pinboardReset: {
    zh: '重置白板',
    en: 'Reset Pinboard',
    ko: '백보드 리셋'
  },
  exitPinboard: {
    zh: '退出白板',
    en: 'Exit Pinboard',
    ko: '백보드 나가기'
  },
  howItWorksTitle: {
    zh: '【连线探证机制】：',
    en: '【Logic Association Mechanism】: ',
    ko: '【실선 단서 연결 규칙】: '
  },
  howItWorksDesc: {
    zh: '依次点击两个具有直接逻辑冲突或证据呼应的卡片（如 [口供] 与 [物理物证] 对照），红线会随针尖连接并在合围时解锁高能逻辑结案卷推论！解锁的推论将自动写入右侧的笔记本，作为最后批捕起诉真凶的决定性理据！',
    en: 'Click two cards that have dynamic connections or timeline contradictions. A red thread will link them to spawn high-level logical breakthrough cards. These Breakthroughs automagically populate your Investigation Notebook and form the ironclad foundation of your arrest warrant!',
    ko: '논리적 모순이나 상관성이 있는 단서 카드 두 개를 순서대로 클릭하십시오. 증거가 영합하면 추론이 잠금 해제되며 수사관 뇌리에 저장되어 범인 기소의 핵심 증거로 변환됩니다!'
  },
  loadedInNotebook: {
    zh: '已载入线索本',
    en: 'RECORDED IN CASE NOTE',
    ko: '수사관 노트 자동 기입됨'
  },
  pinboardClickTips: {
    zh: '👋 点击两张相关的线索/口供卡片，可以相互编织针刺红绳拉线对质...',
    en: '👋 Click any two related clue/testimony cards to connect them with a red string...',
    ko: '👋 서로 연관성이 강한 카드 두 개를 차례로 클릭해 보드용 적색 실선으로 묶어 보십시오...'
  },
  clearBoard: {
    zh: '重置所有连线',
    en: 'Reset Connections',
    ko: '모든 연결선 초기화'
  },
  pendantAcquiredTitle: {
    zh: '🌟 CRITICAL EVIDENCE ACQUIRED · 寻获核心物理物证 🌟',
    en: '🌟 CRITICAL EVIDENCE ACQUIRED · SECURED PHYSICAL EXHIBIT 🌟',
    ko: '🌟 CRITICAL EVIDENCE ACQUIRED · 핵심 물리 증거품 압수 🌟'
  },
  pendantAcquiredHeading: {
    zh: '【起赃大捷 · 夜鸦之眼】',
    en: '【EXHIBIT ACQUIRED: THE NIGHT RAVEN\'S EYE】',
    ko: '【장물 압수 대첩 · 밤까마귀의 눈】'
  },
  pendantAlt: {
    zh: '古董绿翡翠吊坠',
    en: 'Antique Emerald Pendant',
    ko: '고풍스러운 에메랄드 펜던트'
  },
  pendantDescription: {
    zh: '一枚历史丰厚的金边古玩绿翡翠挂坠。传闻这是十八世纪欧洲传奇海盗的随身护身符，色泽如深海冷水般幽暗，绿翡莹润、切工古拙，其黄金搭扣背后刻写着微小的两道刮痕。',
    en: 'A historic gold-trimmed jade necklace. Whispered to be a legendary 18th-century European pirate charm, its deep emerald luster shimmers like cold, deep abyssal water. Under close magnifier, two microscopic runic cuts can be seen etched behind the gold clasp clasp.',
    ko: '고귀한 고미술 기법의 장식이 가미된 진귀한 에메랄드 귀금속입니다. 18세기 밀항선의 주술 부적이었다는 구전이 있으며, 심해를 방불케 하는 짙은 옥색 휘광과 예리한 단면각이 감돌고 있습니다. 황금 연결고리 배면에 미세한 생채기 선 두 줄이 소성 표식처럼 새겨져 있습니다.'
  },
  pendantStatus: {
    zh: '状态: 物证扣留中 ✓',
    en: 'Status: Secured in Evidence Vault ✓',
    ko: '상태: 사법 구치소 물증 서랍에 영구 봉인됨 ✓'
  },
  pendantIndictmentReady: {
    zh: '指控权: 具备充足证据 ⚖️',
    en: 'Charge Rights: Structural Indictment Ready ⚖️',
    ko: '기소권 요건: 풍부한 정황 입증 확보 ⚖️'
  },
  pendantCloseBtn: {
    zh: '收纳物证 · 继续探案 ⚖️',
    en: 'Secure Evidence & Proceed ⚖️',
    ko: '물증 보관소 장기 탑재 · 수사 속행 ⚖️'
  },
  clearSuccess: {
    zh: '已清除白板上所有的红色棉线连结。',
    en: 'All red thread connections on the board have been cleared.',
    ko: '백보드의 모든 빨간색 연결실이 초기화되었습니다.'
  },
  inspectClue: {
    zh: '指纹与可疑线索提取中...',
    en: 'Extracting fingerprints & clues...',
    ko: '지문 및 가시적 단서 추출 중...'
  },
  inspectFound: {
    zh: '提取到证言线索并记录在案！',
    en: 'Successfully extracted & recorded into notebook!',
    ko: '지문 증언 단서 확보 완료 및 수사관 노트 기입!'
  },
  // Scene Explorer
  sceneTitle: {
    zh: '请选择当前调查区域：',
    en: 'Choose Active Room:',
    ko: '조사구역 선택:'
  },
  noNpcHere: {
    zh: '（此区域无其他嫌疑人）',
    en: '(No suspect in this room)',
    ko: '(이 구역에는 용의자가 없습니다)'
  },
  npcStatusLabel: {
    zh: '对话交互并深度逼问以解锁隐藏痕迹',
    en: 'Talk & interrogate deeply to reveal core clues',
    ko: '대화 및 집요한 추궁으로 숨겨진 단서 노출'
  },
  talkButton: {
    zh: '💬 与这名嫌疑人口供讯问',
    en: '💬 Question Suspect',
    ko: '💬 이 용의자 심문 시작'
  },
  statusSuspect: {
    zh: '嫌犯背景档案',
    en: 'Suspect Dossier',
    ko: '용의자 배경 정보'
  },
  // Dialogue Box
  backToVilla: {
    zh: '返回别墅场景',
    en: 'Back to Room Map',
    ko: '빌라 맵으로 돌아가기'
  },
  presentEvidenceTitle: {
    zh: '呈堂物证并对质 (Objection!)',
    en: 'Present Physical Evidence (Objection!)',
    ko: '물증 제시 및 대치 (이의 제기!)'
  },
  unlockedEvidenceCount: {
    zh: '已解锁物证：',
    en: 'Unlocked Evidence:',
    ko: '잠금 해제된 물증:'
  },
  presentBtn: {
    zh: '🎯 拿出此证物对质',
    en: '🎯 Present This Evidence',
    ko: '🎯 이 증거 제출'
  },
  breakthroughTitle: {
    zh: '突破供词！(Breakthrough)',
    en: 'Testimony Breakthrough!',
    ko: '증언 수사 돌파! (공식 자백)'
  },
  breakthroughBtn: {
    zh: '记录在案并退出对质',
    en: 'Record into Case File & Exit',
    ko: '사건 기록 보존 및 대화 종료'
  },
  objectionModalTitle: {
    zh: '异议！(Objection!)',
    en: 'Objection!',
    ko: '이의 있소!'
  },
  objectionCancel: {
    zh: '收回证据继续询问',
    en: 'Take Back & Continue Asking',
    ko: '증거 회수 후 대화 계속'
  },
  chatPlaceholder: {
    zh: '在此输入你要追索或盘问此NPC的问题（如：23:15你在哪里？/ 你在说谎吗？）...',
    en: 'Type your question (e.g. Where were you at 23:15? / You are lying!) ...',
    ko: '심문 대화 입력 (예: 23:15에 어디 계셨죠? / 당신의 시간선은 거짓입니다!) ...'
  },
  chatSend: {
    zh: '提问',
    en: 'Ask',
    ko: '질문'
  },
  chatAiTyping: {
    zh: 'NPC 拼命防守、极速思考中...',
    en: 'Suspect is thinking desperately...',
    ko: '용의자가 극도로 머리를 굴리는 중...'
  },
  chatEmotionLabel: {
    zh: '心防破决焦虑情绪度数：',
    en: 'Defensive Anxiety Level:',
    ko: '방어 기전 심리 불안 지수:'
  },
  // Notebook
  notebookTitle: {
    zh: '调查员电子探案手册',
    en: 'Digital Detective Dossier',
    ko: '수사관용 전자 정보 수첩'
  },
  notebookTimeLabel: {
    zh: '案发 23:40 发现',
    en: 'Discovered at 23:40',
    ko: '자정 전 23:40 발견'
  },
  tabTimeline: {
    zh: '时间线比对 (Matrix Grid)',
    en: 'Time Matrix Grid (Excel)',
    ko: '시간 매트릭스 (Excel)'
  },
  tabClues: {
    zh: '线索与矛盾',
    en: 'Clues & Contradictions',
    ko: '단서 및 모순 단서'
  },
  tabNotes: {
    zh: '探案笔记',
    en: 'Investigator Scratchpad',
    ko: '수사 긁어모음 노트'
  },
  tab1Tip: {
    zh: '这是通过对NPC证词交互实时更新的 Excel 关系大表。左右拖动表格，重点对比嫌疑人在 23:15 的行迹冲突。',
    en: 'This Excel matrix auto-updates with suspect testimonies. Focus on suspect coordinates at exactly 23:15 to spot overlaps.',
    ko: '매 시각 교차 검증되는 실시간 Excel 모표입니다. 23:15 무렵 용의자들의 장소 모순을 집중해서 비교하십시오.'
  },
  tableTimeHeader: {
    zh: '时刻',
    en: 'Time',
    ko: '시각'
  },
  tableLyingAlert: {
    zh: '⚠️ 此处谎报！',
    en: '⚠️ Liar loop!',
    ko: '⚠️ 허위 증언 감지!'
  },
  matrixHeader: {
    zh: '逻辑冲突印证器 (自动核对)：',
    en: 'Cross-Reference Verification Log (Auto Check):',
    ko: '교차 모순 자동 감지 로그:'
  },
  notebookCluesHeader: {
    zh: '当前发现的系统核心证词矛盾线索',
    en: 'Discovered Testimonial Contradictions & Loopholes',
    ko: '현재까지 확인된 핵심 증언 모순 단서 리스트'
  },
  notebookCluesLock: {
    zh: '？ 你需要分别在对话中，盘问和追索与 23:15 的特定目击事实及他们的方位，从而对比出极显眼的不合理逻辑盲点，解锁并使犯人露出马脚。',
    en: '? You must push them about 23:15 via conversation to unlock these logical breakthroughs and force the culprit to break.',
    ko: '? 상대와의 대화를 통해 23:15 전후 행적 및 장소를 면밀히 캐물어 모순적 인과관계를 입증하고 잠금을 해제해야 합니다.'
  },
  cluesSource: {
    zh: '证言来源：',
    en: 'Source:',
    ko: '증언 출처:'
  },
  noCluesUnlocked: {
    zh: '目前还没有正式解锁任何核心矛盾冲突。请点击在不同的场景中，找NPC们深度逼问！',
    en: 'No core contradictions unlocked yet. Keep questioning suspects in different locations!',
    ko: '아직 핵심 모순 구도가 잠금 해제되지 않았습니다. 다양한 전방위 장소에서 질문하십시오!'
  },
  scratchpadAddTitle: {
    zh: '手动记录嫌疑人笔录/线索备忘',
    en: 'Manual Suspect Interrogation Notes',
    ko: '용의자 진술 수동 필기기록 작성'
  },
  scratchpadAddPlaceholder: {
    zh: '在此记录你发现的破绽、供词备忘或者直觉判断...',
    en: 'Type any details, suspicious lines or your intuition here...',
    ko: '포착한 모순, 의아한 징후 혹은 주관적인 직감을 기록하십시오...'
  },
  scratchpadNpcPrefix: {
    zh: '记录其轨迹：',
    en: 'Log dynamic path:',
    ko: '동선 매핑 로그:'
  },
  scratchpadSaveBtn: {
    zh: '保存在案',
    en: 'Commit Memo',
    ko: '메모 등록하기'
  },
  scratchpadHeader: {
    zh: '已归档笔录手记',
    en: 'Archived Notebook Memos',
    ko: '보관된 수사 메모첩'
  },
  scratchpadEmpty: {
    zh: '探案纸尚空白。可在上方输入备忘，或与NPC对话时其关键线索将自动归档。',
    en: 'Empty memo pad. Write above, or watch dynamic clues automatically auto-file here.',
    ko: '수사관 수첩이 비어있습니다. 직접 입력하거나 질문 시 핵심 내용은 자동으로 보관됩니다.'
  },
  scratchpadDelete: {
    zh: '删除笔记',
    en: 'Delete Memo',
    ko: '메모 삭제'
  },
  // Conclude Screen
  concludeTitle: {
    zh: '案件裁决与起诉指控',
    en: 'Case Judgment & Indictment',
    ko: '사건 심결 및 진범 기소장 발부'
  },
  concludeSubtitle: {
    zh: '请根据你在探案本和线索白板中拼出的逻辑，正式决定起诉谁是唯一的“金翡吊坠大盗”。',
    en: 'Now, based on the logical matrix you established on the pinboard, select the sole culprit.',
    ko: '화이트보드 및 탐색 시간표를 바탕으로 수합한 물증을 토대로 실제 범행을 작당한 피고인을 지명 및 송치하십시오.'
  },
  concludeAccuseWho: {
    zh: '点击选择你将正式扣留的唯一嫌犯：',
    en: 'Select the primary suspect to detain:',
    ko: 'detain할 주범격 용의자를 공식 지목하십시오:'
  },
  concludeReasonTitle: {
    zh: '案件起诉状 ⚖️ (填写起诉和揭发理由，阐述 23:15 该角色的伪造在场和线索连线证据)：',
    en: 'Accusation Warrant ⚖️ (Expound why they are the thief and point to the 23:15 contradiction):',
    ko: '공판 기소 헌장 ⚖️ (23:15 모순 근거 및 물증 정황 분석, 기소 취지를 육하원칙으로 정리하십시오):'
  },
  concludeReasonPlaceholder: {
    zh: '例如：在时间线中，23:15陈敏声称走廊寂静，但李国栋和周海平都表示此时在走廊。并且我们在厨房水槽底起获了挂坠，结合陈敏23:21仓皇逃跑的细节和连线，证明陈敏就是撬箱并转移宝石的犯犯犯人！',
    en: 'e.g. At 23:15, Chen Min said the gallery was empty, but Butler and Zhou proved they crossed it. The pendant was found in the kitchen sink. Connecting Chen Min\'s 23:21 flight proves her guilt!',
    ko: '예: 23:15 경 하녀인 진민은 복도가 정막했다고 주장하나 타인들의 일치된 동선과 정면 충돌합니다. 주방 싱크대 밑에서 에메랄드가 확보되었으며 그녀의 23:21 당황한 도주와 연결해보아 그녀가 진범임을 가리킵니다!'
  },
  submitVerdict: {
    zh: '盖章定谳 · 递交正式判案 🔨',
    en: 'Apply Official Seal · Submit Verdict 🔨',
    ko: '공인 검인 찍기 · 공식 판결 제출 🔨'
  },
  concludeBackToQuery: {
    zh: '返回继续搜证讯聊',
    en: 'Return to Investigation',
    ko: '수사 단계로 돌아가 조사계속'
  },
  // Endings
  endingResetApp: {
    zh: '重新指派案件侦测',
    en: 'Reset Game & Restart Task',
    ko: '사건 아카이브 리셋 및 재시작'
  },
  endingSuccessTitle: {
    zh: '🏆 完美推破悬案 · 真凶伏法！',
    en: '🏆 Master Class! Case Solved Successfully!',
    ko: '🏆 명쾌한 쾌거! 진범 사건 현장 전면 구속!'
  },
  endingSuccessDesc: {
    zh: '你通过炉火纯青的 AI 质询和极缜密的时间矩阵分析，成功在【厨房清洗水槽底旧拖把脏抹布里】搜出了完璧归赵的古董“夜鸦之眼”绿吊坠！心防大决的嫌疑人在这份铁证和 23:15 时间线坍塌的冲击下瘫软招供，被押送至看守。陈老家主对你出神入化的神断万分感激！',
    en: 'Excellent! Your relentless cross-examination and airtight timeline comparisons successfully located the stolen antique in the kitchen sink cabinet. Faced with the 23:15 database collapse and physical proof, the culprit broke down in tears and confessed. The owner is eternal grateful!',
    ko: '완벽합니다! 치밀한 시간선 검토와 끈질긴 추궁 끝에 주방 싱크대 아래에 감금 보관되어 있던 "밤까마귀의 눈"을 온전히 발굴해냈습니다! 23:15의 구도 붕괴와 핵심 물증 제시 앞에 가해자는 오열하며 전면 범행을 실토했습니다. 빌라 주인이 기쁨에 겨운 치하를 아끼지 모할 것입니다!'
  },
  endingFailWrongPersonTitle: {
    zh: '❌ 错逮冤假！凶犯逍遥法外',
    en: '❌ Case Failed: Detained the Wrong Suspect!',
    ko: '❌ 오인 체포! 허위 지목으로 진범 방치'
  },
  endingFailWrongPersonDesc: {
    zh: '你起诉扣留的角色在案发 23:15 具有饱满纯正的活人在场相互作证，而其厨房水池下的藏泥物证也缺乏牢固的逻辑捆绑。你递交的起诉书被法庭以“无端构陷、事实冲突”当场废绝退回，真凶揣着上千万赃资笑坐邮轮趁夜潜逃！名侦探声誉扫地。',
    en: 'The suspect you accused has active, ironclad solid coordinates confirmed by mutual testimonials at 23:15. Your warrants were thrown out by the judge as unsubstantiated. The true culprit sailed away on a luxury cruiser with the millions-worth pendant! Your career is ruined.',
    ko: '기소 결정된 용의자는 23:15 무렵 무결한 알리바이를 상호 대립적으로 입증해냈습니다. 귀하가 상정한 영장은 증거 불충분 및 구성요건 흠결로 법원에서 즉시 기각되었습니다. 정황이 빈약한 틈을 타 진범은 거액의 환가 보물을 소지한 채 밀항선으로 잠적하였습니다!'
  },
  endingFailEvidenceTitle: {
    zh: '❌ 起诉证据不充足 · 无法批捕',
    en: '❌ Case Failed: Insufficient Evidence Context!',
    ko: '❌ 구속영장 기각! 공소 유지 수뇌부 증거 부족'
  },
  endingFailEvidenceDesc: {
    zh: '虽然你抓到了真正的名字，但你的起诉状没有陈明 23:15 其最根本的时间线物理坍塌与厨房脏抹布赃物之因果；或者他在本白板的“高能推论”里并未被红色连线锁。证据缺乏逻辑锁链，被保释律师抓到极其薄弱的法律退漏。嫌犯被无罪保释出狱，你功败垂成。',
    en: 'Though you correct identified the name, your warrants failed to expound the 23:15 matrix collision and kitchen sink logistics linkage. With insufficient logical links, the suspect was released on bail, rendering your efforts futile.',
    ko: '용의자의 이름 자체는 적중했으나, 기소장에 가리킨 23:15 시간선 모순 및 주방 싱크대 은닉 인과의 구성이 매우 부족합니다. 구체적인 논증 쇠사슬이 없어 영장 실질심사 단계에서 무죄 조건 보석금으로 풀려났습니다. 성공 직전 좌절을 맛보았습니다.'
  },
  // Operational Help modal
  guideModalTitle: {
    zh: '侦查办案电子手册指南',
    en: 'Operational Investigation Directives',
    ko: '전자 수사 지휘 사령 지침서'
  },
  guideItem1: {
    zh: '💬 【追索时间线】：在别墅地图里选择去对应的场景中（客厅、走廊、更衣室等），点击嫌疑人开始【口供盘问】。输入类似 “二十三点一刻（23:15）你在做什么？谁能证明？” 的语句，诱导其说出细节。',
    en: '💬 [Question Timelines]: Move to various rooms, click a suspect to begin interrogation. Input queries like "Where were you at 23:15? Who is your witness?" to map their coordinates.',
    ko: '💬 [시간선 심문]: 지도 상에서 수사 구역으로 이동 후, 용의자를 탭하여 대화를 실행합니다. "23:15 당시 동선과 무엇을 마셨는지" 파악하여 증언을 도출하십시오.'
  },
  guideItem2: {
    zh: '📌 【线索棉丝白板连线】：打开“逻辑线索白板”，点击任意两张“时间证据”或“口供证词”，可以将具有关联的蛛丝马迹拉线连。当匹配出对撞后将自动生出“高能推论”并写回探案本！这能提取出指控真凶的核心把手！',
    en: '📌 [Pinboard Linking]: Click two related files or visual testimonies to link them with a red thread. Matching opposites automatically spawns high-level deductions and logs them into your notebook, fueling your arrest warrant!',
    ko: '📌 [백보드 선연결]: 백보드 장치를 연 다음 연관된 단서 두 장을 터치하여 연결선을 이으십시오. 부합되는 구도가 성립하면 "고강도 추론 단서"가 발견되어 기록장에 장입됩니다!'
  },
  guideItem3: {
    zh: '🔍 【指纹绿印搜集】：有些被嫌疑犯摸过的微痕指纹散落在客厅、厨房或卧室中，点击场景内的闪烁黄热区，完成提取后将提取出铁证证词（绝不会重置，变绿后永久保留），用来破除谎言。',
    en: '🔍 [Extract Clues]: Click the pulsating orange heatspots within the static room canvas to extract fingerprints (will glow green and persist). Highlighting these registers ironclad exhibits to break suspect defenses.',
    ko: '🔍 [지문 녹색단서 수집]: 현장 요소 중 범죄자가 은폐한 정황(지문 열점)을 발견하면 터치하여 수집하십시오. 한번 탐침되어 녹색으로 변색된 열점은 리셋되지 않고 고정 유지됩니다.'
  },
  guideItem4: {
    zh: '📂 【呈堂物证 (Objection!)】：在与嫌疑人的盘问界面中，点击【呈堂物证并对质】按钮，挑选出与这名嫌犯 23:15 供词正面撞车的实物或文字，如果对等正确将爆发“Objection!”全场撕毁心防，解锁供罪自供口令！',
    en: '📂 [Exposing lies (Objection!)]: In talk screens, invoke "Present Physical Evidence". Pair their 23:15 deposition with a contradictory real-world object. A match triggers "Objection!", unlocking their guilty admissions!',
    ko: '📂 [물증 제시와 모순 대조]: 대화란 내 "물증 제시 및 대치"를 이용, 타인의 정반대 물증을 던져 이의 제기를 유도하십시오. 상성이 완전치 일치하면 상대방 심리 수비대가 전면 붕괴됩니다!'
  },
  closeBtn: {
    zh: '知道了，返回查案',
    en: 'Roger that, back to case',
    ko: '수사 요령 이해함, 복귀'
  },
  init_butler: {
    zh: '老主人把这么贵重的值钱吊坠交给我保管，现在居然在我的眼皮底下失窃，这是我极大的渎职。侦探，请随便问，我发誓毫无保留、原原本本把我记起的一切告诉你。',
    en: 'The old master trusted me with such a valuable pendant... Its theft under my watch is a massive failure of duty. Detective, please ask anything; I swear to tell everything I remember without reservation.',
    ko: '늙으신 주인님께서 소중한 펜던트를 제게 수호 제안하셨으나 무참히 도난당했습니다... 이는 막중한 실효입니다. 형사님, 무엇이든 심문하십시오. 전면 성실히 진술할 것임을 맹세합나다.'
  },
  init_maid: {
    zh: '你们把我扣在这里是什么意思？我只是个老老实实做清洁的佣人！我跟那只丢失的古董一点关系都没有。有什么好问的，问完了赶紧放我回去睡觉！',
    en: 'What is the meaning of holding me here? I am just a hardworking maid who cleans! I have absolutely nothing to do with the missing antique. What is there to ask? Let me go back to sleep when you are done!',
    ko: '저를 이곳에 억류해 두는 저의 가 무엇입니까? 저는 한낱 복도 청소를 분담하는 시종일 뿐입니다! 보석 분실과 무관하오니 속히 방면하여 주십시오!'
  },
  init_visitor: {
    zh: '唉，我今天太倒霉了。来面谈生意找投资，投资还没拿到手，居然惹上一桩盗窃案。我纯粹是个路过的外人，你们赶紧问几句就结了吧，我可没时间在这耽误。',
    en: 'Sigh, what bad luck today. I came to negotiate business for investment and ended up caught in this burglary. I am purely an outsider. Ask quickly so I can leave, I do not have time to waste here.',
    ko: '휴, 오늘 참 되는 일이 없군요. 단지 투자 유치 계약을 담판 지으러 대기 조율 중이었을 뿐인데 절도 혐의에 말려들다니요. 속히 몇 구 통상 문답하신 뒤 저를 퇴정 조치해주십시오.'
  },
  init_niece: {
    zh: '（抱紧双臂，瑟瑟发抖）探、探长……两分钟前二叔还在客厅念叨那枚吊坠，现在怎么会凭空丢了……我整晚都待在闺房戴着耳机呢，我真的什么都不知道。',
    en: '(Hugging her arms, shivering) De... Detective... Uncle was just talking about the pendant in the living room two minutes ago, how could it vanish... I was in my room with my headphones on all night, I really know nothing.',
    ko: '(두 팔로 몸을 감싸며 부들부들 떰) 형..형사님.. 이삼 분 전만 해도 삼촌께서 거실에서 펜던트를 만지셨는데 어떻게 홀연히 수중에 조적을 감출 수 있습니까? 저는 방에서 종일 해드셋을 착용한 채 독서 중이었습니다..'
  },
  init_doctor: {
    zh: '（从容地整理医学大白褂，双手插兜）深夜发生这种偷越安防的事情，实在令人遗憾。我作为老主人的私人随行医师，只关心他的心脏病情况。有什么医学或是轨迹层面的疑问，请尽管提。',
    en: '(Calmly adjusting his white coat, hands in pockets) It is truly regrettable that such a security breach occurred tonight. As the master\'s personal physician, I only care about his weak heart. Ask anything regarding medical or timeline coordinates.',
    ko: '(차분히 하얀 백의 가운 매무새를 곧추се우며 주머니에 손을 넣음) 한밤중에 이런 불비한 방화선 유출이 빚어져 원통망측할 따름입니다. 저는 주치의로서 그분의 지병 간호에 전념할 뿐입니다. 편히 질의하십시오.'
  }
};

export const t = (key: keyof typeof UI_TRANSLATIONS | string, lang: Language): string => {
  if (UI_TRANSLATIONS[key] && UI_TRANSLATIONS[key][lang]) {
    return UI_TRANSLATIONS[key][lang];
  }
  return String(key);
};

// 2. Multilingual Scene Definitions
export const getLocalizedScenes = (lang: Language): Record<string, any> => {
  const translations: Record<string, Record<Language, { name: string; description: string }>> = {
    'living-room': {
      zh: {
        name: '古董大客厅',
        description: '富丽堂皇的古董客厅，壁炉静静燃烧，留有威士忌酒气。一旁的红木储物格中放着存放古董吊坠“夜鸦之眼”的暗锁保险柜，此刻盖门大开，内部饰底空空如也，显然曾被熟练暴力或者钥匙撬动开启。'
      },
      en: {
        name: 'Antique Parlor',
        description: 'A luxurious parlor smelling of bourbon whiskey with a fireplace quietly burning. In the corner wood cabinet sits the mahogany safe for the "Eye of Night Raven" emerald pendant. The vault lid lies wide open, completely emptied—unlocked with precision keys.'
      },
      ko: {
        name: '럭셔리 리빙룸',
        description: '벽난로 불이 타오르는 호화로운 고 전형 거실. 구석 상단에는 "밤까마귀의 눈"이 안장되어 있던 홍목 수납함이 활짝 개방되어 내부가 말끔히 비어있습니다. 외부 균열 없이 정교하게 보조 열쇠로 침공된 상태입니다.'
      }
    },
    'corridor': {
      zh: {
        name: '1F走廊中枢',
        description: '狭长压抑的公用走廊，欧式黄灯极其昏暗，具有强烈的悬疑压制感。墙壁上挂着多幅庄严傲慢的历代先人油画。此处是连接一楼客厅、厨房以及通往楼上二楼的唯一中枢通道。'
      },
      en: {
        name: '1F Central Hallway',
        description: 'A narrow, eerie hallway with a dim yellow pendant light casting long shadows. Stern portraits of historical ancestors gaze down coldly. This is the sole corridor routing the guest parlor, cooking kitchen, and second floor stairs.'
      },
      ko: {
        name: '1층 공용 복도',
        description: '협소하고 무거운 분위기의 중앙 통로. 흐릿한 가스등 조명이 그림자를 내뿜습니다. 벽면에 선친들의 대형 초상화가 배열되어 있고, 거실, 주방 및 2층 침실로 도약하기 위한 유일한 연결 허브입니다.'
      }
    },
    'kitchen': {
      zh: {
        name: '1F后厨长台',
        description: '典型的欧式长台厨房，空气有些紧绷和凌乱，大水盆水嘴仍微微滴答滴水。水龙头下方是深度积满历史污血和破旧脏抹布拖把的封闭清洗洗物底橱，散发着一股洗涤剂的酸气。'
      },
      en: {
        name: '1F Cooking Kitchen',
        description: 'A classic western villa kitchen with a messy countertop and a leaky metal faucet. Beneath the washbasin lies the dark washing cabinet packed with wet sponges, damp floor towels and heavy old floor scrapers.'
      },
      ko: {
        name: '1층 배후 주방',
        description: '수조의 수도꼭지가 여전히 고여 흐르는 양식 주방. 식기 세척수조 문 뒤편에는 오래되어 변색된 대량의 걸레 뭉치가 습하게 퇴적되어 약한 산성 세제 냄새를 뒤섞고 있습니다.'
      }
    },
    'bedroom': {
      zh: {
        name: '2F少女闺房',
        description: '高位豪华的主人侄女韩小姐卧室。屋中凌乱不堪，高档粉红帘纱低卷，桌子上一盏金质奢华台灯不知由于何种外力被打翻在一盘香薰之上，空气里溢流着少女慌乱惊吓的压制情绪。'
      },
      en: {
        name: '2F Niece\'s Chamber',
        description: 'The luxurious private bedroom belonging to the owner\'s niece, Ms. Han. High-end pink curtains are pulled messy. An expensive gold desk lamp lies knocked over onto an ash tray. Panic hangs heavy in the air.'
      },
      ko: {
        name: '2층 아가씨 방',
        description: '화려하고 가벼운 분홍 휘장이 휘감긴 한우흔 양의 침실. 화장틀 가의 고가 탁상 전등이 원인 불명의 급격한 힘에 일그러진 채 쓰러졌으며, 공간 가득 그녀가 품었던 당혹감과 긴장 정서가 배어납니다.'
      }
    },
    'wine-cellar': {
      zh: {
        name: 'B1极寒酒窖',
        description: '别墅最隐蔽潮湿的原生酒窖，立有一架子排布整齐的葡萄酒。暗灰色水泥地面极滑，两边常备主人的私人医疗药水。这里处于地下深层，大木门封闭紧密，声音传不过去，充满秘密感。'
      },
      en: {
        name: 'B1 Damp Wine Cellar',
        description: 'The dampest underground chamber filled with vintage wines. Slippery gray cement floor and shelves cluttered with emergency medical formulas. The heavy oak gate isolates acoustics, preserving deep secrets.'
      },
      ko: {
        name: '지하 한랭 와인창고',
        description: '습기 서린 지하 최저층 와인고. 시멘트 평지가 미끄럽고 구석에 주치의 전용 의약품과 한랭 장치가 배비되었습니다. 대형 목재 중문이 사운드를 철저히 차단하여 비밀의 심도를 증보합니다.'
      }
    }
  };

  const results: Record<string, any> = {};
  const baseScenes = {
    'living-room': { id: 'living-room', bg: 'https://lh3.googleusercontent.com/d/1TJ56K4rtrTQJbBPrmGEBPOM-sF5iRiAN', npcs: ['butler', 'visitor'] },
    'corridor': { id: 'corridor', bg: 'https://lh3.googleusercontent.com/d/1BMKuSOTsyILgSXkqYFsoABSF6cuKwKAa', npcs: ['maid'] },
    'kitchen': { id: 'kitchen', bg: 'https://lh3.googleusercontent.com/d/1V4wswRCmgL0NGSOibs6MRNWvJNS4kIXh', npcs: [] },
    'bedroom': { id: 'bedroom', bg: 'https://lh3.googleusercontent.com/d/13ql1fE_Uk_I8q15PCdHp-wewjtVDkUQY', npcs: ['niece'] },
    'wine-cellar': { id: 'wine-cellar', bg: 'https://lh3.googleusercontent.com/d/1nK3Dg7nw3xYckmbBIND4n6AKMsJNXYsn', npcs: ['doctor'] }
  };

  for (const [id, base] of Object.entries(baseScenes)) {
    const tItem = translations[id]?.[lang] || translations[id]?.['zh'];
    results[id] = {
      ...base,
      name: tItem.name,
      description: tItem.description
    };
  }
  return results;
};

// 3. Localized NPC Data structure output
export const getLocalizedNpcDataList = (lang: Language, culpritId: NpcId): NpcStructure[] => {
  const translations: Record<NpcId, Record<Language, {
    name: string;
    roleName: string;
    personality: string;
    features: string;
    timeline: { time: string; location: string; action: string }[];
    truthTimeline: { time: string; location: string; action: string }[];
  }>> = {
    butler: {
      zh: {
        name: '李国栋',
        roleName: '管家',
        personality: '理性、冷静、严谨、逻辑感精确极强。说一不二，绝不说谎。他作为在这里奉献了十六年的主人老心腹，维护秩序。但如果是他作为案犯，他会掩护关于“水壶空烧、空无一人”的破绽。',
        features: '做事一板一眼，对时间回忆极其有说服力和礼教规范。',
        timeline: [
          { time: '23:10', location: '古董大客厅', action: '正在一楼大客厅进行常规锁具及贵重摆件的夜间巡视，当时看到来访客周海平独自坐在沙发里喝酒。随后我前去配茶水。' },
          { time: '23:15', location: '1F后厨长台', action: '留在隔壁厨房里调制主人的洋甘菊宁神茶。这时候我正在忙于烧水并在膳架上称量茶叶。在此期间，我确信一直在厨房独自作业。' },
          { time: '23:20', location: '古董大客厅', action: '茶水冲好，我整理好托盘茶钟端茶返回大客厅上楼。一回到客厅，就赫然发现保险箱盖敞露，绿宝石吊坠不翼而飞。我大惊之下拉响了电铃。' }
        ],
        truthTimeline: [
          { time: '23:10', location: '古董大客厅', action: '在客厅巡查，看见访客等候，随后前往厨间烧茶。' },
          { time: '23:15', location: '1F后厨长台', action: culpritId === 'butler' ? '下投钥匙打开客厅锁箱行窃，并将吊坠转移至水槽下。' : '留在厨房烧开水，发现壶烧响溢出或看到过客人。' },
          { time: '23:20', location: '古董大客厅', action: '端起茶杯回到客厅发现失窃，紧急拉响了警报，向众人宣布吊坠丢失。' }
        ]
      },
      en: {
        name: 'Li Guodong',
        roleName: 'Butler',
        personality: 'Logical, rigorous, and highly precise. Dedicated 16 years of loyalty. If he is the thief, he tries to conceal the kitchen water pot over-cooking paradox.',
        features: 'Meticulous attention to detail with an authoritative manner and strict timeline memory.',
        timeline: [
          { time: '23:10', location: 'Antique Parlor', action: 'Inspecting safe box and collection relics in guest area. Saw visitor Zhou sitting in leather chair alone drinking bourbon. Left to kitchen area.' },
          { time: '23:15', location: '1F Cooking Kitchen', action: 'In kitchen brewing hot chamomile digestive tea for owner. Busy heating water and weighing loose herbs. Stayed in kitchen alone.' },
          { time: '23:20', location: 'Antique Parlor', action: 'Tea brewed. Pushed trolley into dining parlor. Discovered safe box wide open with pendant missing. Rung alarms in absolute shock.' }
        ],
        truthTimeline: [
          { time: '23:10', location: 'Antique Parlor', action: 'Inspecting safe, saw client waiting. Moved to kitchen to cook hot herbal tea.' },
          { time: '23:15', location: '1F Cooking Kitchen', action: culpritId === 'butler' ? 'Sneaked back with keys, stole pendant, stuffed it into dirty mop pile under water sink.' : 'Bolding water, focusing on countdown and clocks.' },
          { time: '23:20', location: 'Antique Parlor', action: 'Pushed cart back, discovered theft and pulled brass alarm cord frantically.' }
        ]
      },
      ko: {
        name: '이국동',
        roleName: '집사',
        personality: '이성적이고 엄격한 규율가. 16년 간 가문을 지켜왔으나 진범일 경우 주방 소나기 끓기(공실 화재 위험) 모순을 물타기하려 듭니다.',
        features: '언동과 태도에 흔들림이 없으며, 보고된 상황 정리가 명확히 각인되어 믿음직스럽습니다.',
        timeline: [
          { time: '23:10', location: '럭셔리 리빙룸', action: '거실 골동품 및 소품 자물쇠의 정기 야간 점검 진행. 방문인 주해평이 혼자 술잔을 머금고 앉은 것 확인 후 밀실 주방으로 조제 출발.' },
          { time: '23:15', location: '1층 배후 주방', action: '차를 달이기 위해 화롯가에 대기. 가스불에 올린 주전자를 점검하고 찻잎을 계량하는 중이었으며 엄밀히 자리를 지켰다고 주장함.' },
          { time: '23:20', location: '럭셔리 리빙룸', action: '차가 데워져 트레이를 밀고 거실로 귀환. 수납함 철문이 벌려져 있고 가문의 상징이 강탈된 정황을 타개 후 엄정히 비상 벨타종.' }
        ],
        truthTimeline: [
          { time: '23:10', location: '럭셔리 리빙룸', action: '순찰 중 손님 확인, 주방 이동하여 국산차 주전자를 올림.' },
          { time: '23:15', location: '1층 배후 주방', action: culpritId === 'butler' ? '여분의 보조열쇠로 거실 금고 개방 및 에메랄드 절취 후 싱크대 바닥 걸레더미 밀어넣음.' : '물 끓이며 시계 바늘 독수함.' },
          { time: '23:20', location: '럭셔리 리빙룸', action: '다시 거실 와서 분실 알림 벨을 치고 소동을 자아냄.' }
        ]
      }
    },
    maid: {
      zh: {
        name: '陈敏',
        roleName: '佣人',
        personality: '情绪型，急躁、脾气冲，防御心态浓。深受沉重高利贷缠身催逼，如果她是凶手，为了掩盖在客厅的行窃轨迹，她会声称23:15在“寂静没有一个乘客”的长走廊擦擦洗洗，形成大漏洞。',
        features: '情绪起伏很大，一旦指控针对到她的家庭债务与轨迹失实，便手无足措，极易嚎啕。',
        timeline: [
          { time: '23:10', location: '1F走廊中枢', action: '我领到工单提着抹布在走廊长梯子边擦洗墙上那一架架肖像画。我一直都是一个人做的擦洗清洁工。' },
          { time: '23:15', location: '1F走廊中枢', action: '我仍然在别墅长走廊做抹布擦拭清洁。我发誓！那一刻整扇长廊安静得如同墓地！不仅没有任何人影，甚至连脚步影子都影子俱无！绝对没人！' },
          { time: '23:20', location: '1F后厨长台', action: '完成了水桶清扫后，我提拖把返回去一头的杂役更衣更服室。一歇脚就突然听到管家在拉铃嚎叫，我吓得魂不附体。' }
        ],
        truthTimeline: [
          { time: '23:10', location: '1F走廊中枢', action: '抱着清洁工具守在走廊，寻找行窃切口。' },
          { time: '23:15', location: '古董大客厅', action: culpritId === 'maid' ? '钻入客厅撬箱盗走真品，紧急藏在厨房大水槽污水管底的旧软抹布脏拖把底层。' : '照常清洁走廊，并目击了某人过道穿插。' },
          { time: '23:20', location: '1F后厨长台', action: '惊恐退往后方工舍偏房躲藏，听闻巨响身体一颤。' }
        ]
      },
      en: {
        name: 'Chen Min',
        roleName: 'Maid',
        personality: 'Emotional, defensive and easily panicked. Drowning in gambling debt. If she is the culprit, she falsely swears that at "23:15 the central corridor was completely empty and dead silent" to hide her burglary.',
        features: 'Highly volatile emotions. Easily breaks down and cries if pressed on her debt or her corridor timeline lie.',
        timeline: [
          { time: '23:10', location: '1F Central Hallway', action: 'Carrying a bucket and towels, working alone on cleaning dust off the high ancestral portraits hanging on the hallway walls.' },
          { time: '23:15', location: '1F Central Hallway', action: 'Still washing portraits in the hallway. I swear to god! The corridor was empty and silent as a grave! No footprints, no people, completely ghost-quiet!' },
          { time: '23:20', location: '1F Cooking Kitchen', action: 'Finished chores. Moved tools away into the staff utility lockers. Sudden high bells and butler\'s screaming shook me cold.' }
        ],
        truthTimeline: [
          { time: '23:10', location: '1F Central Hallway', action: 'Lurking around corridor, watching parlor security loopholes.' },
          { time: '23:15', location: 'Antique Parlor', action: culpritId === 'maid' ? 'Sneaked into parlor, broken safe code, took gemstone and hid it under the heavy wet mops inside the kitchen sink.' : 'Doing cleaning, saw suspects cross.' },
          { time: '23:20', location: '1F Cooking Kitchen', action: 'Walked back to staff locker area, breathing hard.' }
        ]
      },
      ko: {
        name: '진민',
        roleName: '하녀',
        personality: '과집착 방어형. 고리대금 압박에 시달리고 있습니다. 주범일 때 퇴로 차단을 감추려 23:15 당시 "조용하고 아무런 통행인이 없었다"는 고집을 피웁니다.',
        features: '감정 동요가 심하며, 사생활 가계 빚 이야기나 복도 조우 증언 침투 시 신경질적인 가슴 쥐기로 오열합니다.',
        timeline: [
          { time: '23:10', location: '1층 공용 복도', action: '위청소 청결 분장을 배정받아 밀걸레를 들고 초상화 대형 액자들을 하단부에서 수동 닦음질하고 있었습니다.' },
          { time: '23:15', location: '1층 공용 복도', action: '복도에서 액자 먼지털이를 독실히 속합. 하늘에 맹세코 그때는 개미 한마리 없이 공동묘지처럼 고요했고 지나간 육체도 동선도 전혀 없었습니다.' },
          { time: '23:20', location: '1층 배후 주방', action: '양동이를 챙기고 후미 탈의실 뒤 청소창고에 대기. 갑작스럽게 집사의 광란의 타종성이 터져 가슴이 내려앉았습니다.' }
        ],
        truthTimeline: [
          { time: '23:10', location: '1층 공용 복도', action: '공구를 매만지며 거실 동태 탐망.' },
          { time: '23:15', location: '럭셔리 리빙룸', action: culpritId === 'maid' ? '거실 침투 후 비밀 금고 개방, 석판 펜던트 강탈 후 주방 세척구 아래 걸레 보자기 속에 구겨넣음.' : '그림 청소하며 교차하는 타인 관찰.' },
          { time: '23:20', location: '1층 배후 주방', action: '식겁한 채 주방을 지나 탈의 휴게실 밀집.' }
        ]
      }
    },
    visitor: {
      zh: {
        name: '周海平',
        roleName: '访客',
        personality: '回避型，自私、傲慢而敷衍。来此是为了拉关系找主人拿商业贷款。他经常不耐烦地催促和转移话题，讨厌招惹警方。如果是他作案，他会虚构在23:15“找管家融洽喝气泡水”的完美假在场。',
        features: '言谈充满商务敷衍自傲。但他的无辜话语是重要的，能直接戳穿撒谎者。',
        timeline: [
          { time: '23:10', location: '古董大客厅', action: '在客厅大沙发上一口口喝主人预备给我的冰镇苏格兰威士忌洋酒。当时房间十分沉静，我有点困了。' },
          { time: '23:15', location: '1F走廊中枢', action: '我觉得喉咙极干发粘，走出客厅到厨房找李管家拿瓶气泡冰镇饮。在厨房我跟管家打招呼并且调侃他，随后直接转头回去走廊了。没瞧见别人。' },
          { time: '23:20', location: '古董大客厅', action: '我拿饮料回沙发上静思坐。突然在23:21的时候，我清晰感到隔扇走廊地板‘咚咚咚’重踏发出一串慌不择路的极仓惶小跑步声向内退去。' }
        ],
        truthTimeline: [
          { time: '23:10', location: '古董大客厅', action: '在大皮沙发无聊小憩、豪饮威士忌。' },
          { time: '23:15', location: '1F后厨长台', action: culpritId === 'visitor' ? '下手盗取配挂首饰，塞入厨房水槽下的脏拖把污堆，编造找茶借口。' : '到厨房顺畅讨得饮料，并目击了水开无人的事实。' },
          { time: '23:20', location: '古董大客厅', action: '回客厅，听到女性或某嫌疑犯向楼上大跨逃散急跑的异样声音。' }
        ]
      },
      en: {
        name: 'Zhou Haiping',
        roleName: 'Visitor',
        personality: 'Avoidant, arrogant, and impatient investor. Here seeking corporate bailouts. Hate police interference. If guilty, he invents a false cozy alibi "talking with the Butler at 23:15 over bubbles".',
        features: 'Flamboyant, talks with wealthy cynicism but his objective eyewitness claims can demolish other lies.',
        timeline: [
          { time: '23:10', location: 'Antique Parlor', action: 'Sitting on the deep leather chesterfield, enjoying a glass of peaty single-malt scotch whiskey left for me. The hall was peaceful.' },
          { time: '23:15', location: '1F Central Hallway', action: 'Thirsty. Headed to cooking kitchen. Obtained sparkling soda from Butler Li and cracked a joke. Returned instantly back. Saw no one.' },
          { time: '23:20', location: 'Antique Parlor', action: 'Resting on sofa with soda. Suddenly at 23:21, heard rapid, heavy slipper clicks in the back hallway running desperately toward the bedrooms.' }
        ],
        truthTimeline: [
          { time: '23:10', location: 'Antique Parlor', action: 'Sipping whiskey while nervously waiting for host loan reply.' },
          { time: '23:15', location: '1F Cooking Kitchen', action: culpritId === 'visitor' ? 'Pried open the mahogany drawer safe, and threw pendant under the kitchen sink before making up soda-fetching excuse.' : 'Went to fetch soda, found empty water Boiling.' },
          { time: '23:20', location: 'Antique Parlor', action: 'Sat with drink, listening to someone fleeing in panic upstairs.' }
        ]
      },
      ko: {
        name: '주해평',
        roleName: '방문객',
        personality: '회피 자만형 무역인. 자금 대출 알선을 위해 내방함. 경찰 귀찮음을 혐오하나 진범일 때 23:15에 "집사와 돈독히 수다떨었다"는 허위 시나리오를 주장합니다.',
        features: '비즈니스 교섭용 거드름 피우기 화법이 짙으며 귀족적 편달을 기탄합니다. 단, 죄가 없을 때의 증언은 주전자가 혼자 타던 정황처럼 맹목적 허위를 부숩니다.',
        timeline: [
          { time: '23:10', location: '럭셔리 리빙룸', action: '집주인이 비치해준 스카치 위스키 얼음 잔을 기울이며 대기. 전반적으로 적막무인하여 긴장이 다소 둔화됨.' },
          { time: '23:15', location: '1층 공용 복도', action: '갈증이 엄습해 부속 주방으로 우회. 이국동 집사에게 탄산 캔을 달라고 요청 및 농담 한마디 건넨 뒤 통로로 복귀. 무인 조우.' },
          { time: '23:20', location: '럭셔리 리빙룸', action: '캔 가스수를 입에 대고 거실 안장. 23:21 찰나 문틈 너머로 급격히 허둥대며 위쪽으로 달아나는 당혹스러운 신발 끌기 소리 감지.' }
        ],
        truthTimeline: [
          { time: '23:10', location: '럭셔리 리빙룸', action: '가죽소파에 파묻혀 연달아 만취 음주.' },
          { time: '23:15', location: '1층 배후 주방', action: culpritId === 'visitor' ? '거실 수납고를 해정해 석판을 절취, 주방 싱크대의 폐물 걸레 틈에 투기 후 식수 핑계를 두름.' : '주방에 소다캔 가지러 가 주전자만 타오르는 걸 직격함.' },
          { time: '23:20', location: '럭셔리 리빙룸', action: '거실 도처 앉아 위쪽 이탈 동선 급보 소리를 포획.' }
        ]
      }
    },
    niece: {
      zh: {
        name: '韩雨欣',
        roleName: '主人侄女',
        personality: '胆小、敏感，由于学费和二叔决裂的问题陷入重度紧张。如果她是真凶，利用降噪耳机作为遮羞布。一旦发现卧室在关键时间被人（私人医生）撞破空无一人、台灯砸碎，情绪会呈海啸般决口。',
        features: '手指一直止不住发颤，神情躲闪，容易受情绪压迫和惊吓。',
        timeline: [
          { time: '23:10', location: '2F少女闺房', action: '因为学费被扣的事情刚跟二叔狠狠大吵回卧室。在洗手间大水盆洗脸发呆，极其难过。' },
          { time: '23:15', location: '2F少女闺房', action: '我一直坐在卧室床脚。我戴着头戴头套降噪超大功率音箱，戴着它全程阻断听重低音歌，还用被子捂着头。我没离开过房间，啥惊呼声音也没听到。台灯可能是不小心手滑拂翻倒的，真的。' },
          { time: '23:20', location: '2F少女闺房', action: '我觉得头晕，就把耳机往上提，正好听到一楼传来非常喧嚣骇人的警报铃铛与尖喊大作，我的房门还是倒扣的。' }
        ],
        truthTimeline: [
          { time: '23:10', location: '2F少女闺房', action: '大吵后掩门闭气，怒不可遏。' },
          { time: '23:15', location: '2F少女闺房', action: culpritId === 'niece' ? '潜往一楼窃走藏宝，折行塞匿至厨房洗物底，回宿舍时心惊慌撞歪欧式立粉台灯。' : '戴深沉度密封耳套捂被，神思恍惚。' },
          { time: '23:20', location: '2F少女闺房', action: '在屋中伪装读书，听到敲铃后失容不振。' }
        ]
      },
      en: {
        name: 'Han Yuxin',
        roleName: 'Niece',
        personality: 'Timid, fragile, under severe anxiety due to her tuition cut. If she is the thief, she uses huge "noise-canceling headphones" as a shield. Once told her room was checked and empty with desk lamp smashed, her mind collapses.',
        features: 'Hands shaking constantly, avoiding gaze, hyperventilating under interrogation.',
        timeline: [
          { time: '23:10', location: '2F Niece\'s Chamber', action: 'Retreated to bedroom after a brutal screaming argument with uncle refusing my abroad college bills. Crying in washroom.' },
          { time: '23:15', location: '2F Niece\'s Chamber', action: 'Sitting on bed corner. Wearing ANC over-ear headphones, blasting heavy rock music, blankets pulled over head. Didn\'t leave room at all. Smashed gold lamp? Breeze blew it.' },
          { time: '23:20', location: '2F Niece\'s Chamber', action: 'Felt lightheaded. Slid headphones up, suddenly heard deafening bells and screaming echoing from parlor below.' }
        ],
        truthTimeline: [
          { time: '23:10', location: '2F Niece\'s Chamber', action: 'Shaking with fury on bed alone.' },
          { time: '23:15', location: '2F Niece\'s Chamber', action: culpritId === 'niece' ? 'Slithered downstairs, pried open vault, pocketed gem, hid it in kitchen sink cabinet, and accidentally tripped over the gold desk lamp returning.' : 'Drowning out the world in headphones.' },
          { time: '23:20', location: '2F Niece\'s Chamber', action: 'Panicking in the dark room pretending to read.' }
        ]
      },
      ko: {
        name: '한우흔',
        roleName: '방문 조카',
        personality: '소심 유약형. 유학 기금 거절로 숙부와의 불화 폭발 상태. 주범일 가능성 시 무산 진동 헤드폰을 모함의 연막으로 쓰며, 의사에게 방이 공실인걸 저격당하면 심폐 수비가 찢어집니다.',
        features: '지속해서 손끝을 떨고 수색관의 초점을 피하며 신경 쇠약 조율이 강합니다.',
        timeline: [
          { time: '23:10', location: '2층 아가씨 방', action: '학자금 융자 중단 문제로 성격 고약한 삼촌과 격렬히 사투를 벌인 뒤 세수대로 피신해 격노 속 음소거.' },
          { time: '23:15', location: '2층 아가씨 방', action: '침상 가장자리에 종일 앉아 노이즈캔슬링 폐쇄형 전동 헤드셋을 높은 데시벨로 밀고 있었습니다. 어떤 소음도 없었으며 전조등은 풍파에 깨진 것입니다.' },
          { time: '23:20', location: '2층 아가씨 방', action: '머리가 띵해 장비를 끄자 아래서 철그렁 대는 타종 경고가 요동침을 조우.' }
        ],
        truthTimeline: [
          { time: '23:10', location: '2층 아가씨 방', action: '극도의 좌절감에 치를 떨며 방에 혼재.' },
          { time: '23:15', location: '2층 아가씨 방', action: culpritId === 'niece' ? '계단을 통해 1층으로 잠입, 자물쇠 상자 타개 후 에메랄드 은닉, 도주해 들어오며 문전 명등을 사정없이 엎어버림.' : '밀폐 안경식에 가둔 채 누워 흐느낌.' },
          { time: '23:20', location: '2층 아가씨 방', action: '방에 아무 일 없듯 우두커니 대기 중.' }
        ]
      }
    },
    doctor: {
      zh: {
        name: '陆浩然',
        roleName: '私人医生',
        personality: '优雅、克制、虚荣。身为海归精英却因境外账户数额严重亏损而陷入疯狂。如果是他作案，会宣称23:15“在反锁漆黑的酒窖盘点心脏药物”，然而却不知道管家下去看见酒窖大配电开闸已经黑死，根本无法配药。',
        features: '带着金丝边眼镜，说话极为冷静傲骨。但对电闸、漆黑的矛盾一触即溃。',
        timeline: [
          { time: '23:10', location: 'B1极寒酒窖', action: '我拿着配药皮箱顺楼道走到地下原装酒窖。老主人犯心绞痛，我去整理专用的激素特效激素静推急救药。' },
          { time: '23:15', location: 'B1极寒酒窖', action: '我独自在地下室原配冷藏冰柜前配置降温试管药物。由于药敏需要避光，我反锁了酒室的大厚木头门，不曾与楼上产生任何物理接触。' },
          { time: '23:20', location: 'B1极寒酒窖', action: '药已经融度合适，我提着白箱打开厚重栓门准备踱步登楼送药，正逢一楼拉响大警盗铜铃。' }
        ],
        truthTimeline: [
          { time: '23:10', location: 'B1极寒酒窖', action: '取药箱到地下，实则在查看拉闸断电路线。' },
          { time: '23:15', location: 'B1极寒酒窖', action: culpritId === 'doctor' ? '彻底下拉配电大闸让全栋黑灯，趁客厅大乱摸上去打开金柜窃宝，并随手把挂坠掩藏至后厨水池死角底。' : '在楼道上目击了侄女卧室粉电灯砸在地上、空空如也的惊人现场。' },
          { time: '23:20', location: 'B1极寒酒窖', action: '摸黑拉回配闸，听到报被盗后，神定自持上阶。' }
        ]
      },
      en: {
        name: 'Lu Haoran',
        roleName: 'Medical Doctor',
        personality: 'Elegant, aloof, pretentious elite physician. In reality, broke and facing offshore laundering lawsuits. If guilty, he claims to be "working in the locked cellar counting prescription under low light", unware Butler saw the cellar in total pitch darkness with power completely cut.',
        features: 'Pushes up golden round spectacles. Eloquent, high vocabulary, but snaps under the cellar blackness contradiction.',
        timeline: [
          { time: '23:10', location: 'B1 Damp Wine Cellar', action: 'Brought medical chest to basement cellar to compile specialized vaso-sedatives for owner\'s angina. Checking temperatures.' },
          { time: '23:15', location: 'B1 Damp Wine Cellar', action: 'Mixing formula vials before cold vault. Because molecular agent degrades in light, I securely double-bolted the heavy gate. Inside cellar alone.' },
          { time: '23:20', location: 'B1 Damp Wine Cellar', action: 'Completed compounds. Pried bolt back and unlocked basement door. Stepping onto kitchen corridors right as bell rung.' }
        ],
        truthTimeline: [
          { time: '23:10', location: 'B1 Damp Wine Cellar', action: 'Moved to basement, checking electrical board panel.' },
          { time: '23:15', location: 'B1 Damp Wine Cellar', action: culpritId === 'doctor' ? 'Pulled B1 electricity lever to cut total house power. Pried parlor cabinet in global dark, then hid pendant under mops before returning.' : 'Delivering heart formula, saw niece\'s bedroom door open, room empty, expensive desk lamp broken.' },
          { time: '23:20', location: 'B1 Damp Wine Cellar', action: 'Pried power back on in basement, walked up on warning yell.' }
        ]
      },
      ko: {
        name: '육호연',
        roleName: '개인 의사',
        personality: '스마트하고 냉정한 가해 가면 위선 엘리트. 해외 송금 문제로 비밀 추적 파탄 면 직전. 진범일 때 "지하에서 불 켜고 심장 혈청을 검침 중"이라 하나, 집사가 목격한 지하 배전 전면 무전 오프 팩트에 지축이 무너집니다.',
        features: '금테 안경을 매만지고 품위 있는 영어를 한마디씩 얹으나, 암흑 소동 라인 맹점을 찌르면 금이 갑니다.',
        timeline: [
          { time: '23:10', location: '지하 한랭 와인창고', action: '소도 가방을 들고 지하창고 도보 이동. 주인의 협심증 심화를 막기 위해 냉장식 특수 에스트로겐 수치를 긴급 조율 하선.' },
          { time: '23:15', location: '지하 한랭 와인창고', action: '미동 없이 상온 약품함을 분주히 재정리. 빛 붕괴를 예방하려 대형 방화목문을 안쪽으로 굳게 자물쇠를 지르고 있었습니다.' },
          { time: '23:20', location: '지하 한랭 와인창고', action: '앰풀 배합 준비 완료 즉시 물고를 풀고 퇴장 행열 전개, 무섭게 1층의 격타음 감지.' }
        ],
        truthTimeline: [
          { time: '23:10', location: '지하 한랭 와인창고', action: '지하로 향함, 배수 전기 판넬 점검.' },
          { time: '23:15', location: '지하 한랭 와인창고', action: culpritId === 'doctor' ? '배전반 누전 차단기를 강제 하향 압박해 대란을 조장, 거실 침식 후 펜던트 취득 및 주방 밑바닥 틈 투척 후 지하 반환.' : '2층 가려 하다 조카 방이 텅 비고 분홍 명등이 깨져 자빠진 걸 실안 목격.' },
          { time: '23:20', location: '지하 한랭 와인창고', action: '전압 복원 직후 백색 박스 휴대하고 등단.' }
        ]
      }
    }
  };

  const baseAvatars: Record<NpcId, string> = {
    butler: 'https://lh3.googleusercontent.com/d/10Lou0WEuLTIKbaB3EIBxM3DpDXk6gnT6',
    maid: 'https://lh3.googleusercontent.com/d/12maqPsbjz_l24wU6zbYBaXIiUZAftF9R',
    visitor: 'https://lh3.googleusercontent.com/d/1qiDZFHIwTKgobCOd9UifRwLR4qdOXgE2',
    niece: 'https://lh3.googleusercontent.com/d/1_oXu4Wz__IUkW6HK-UovTZJ7HrtLVDUR',
    doctor: 'https://lh3.googleusercontent.com/d/1Y6jKwuZJ-aQkzBxI71e1_7uClOYFDgKH'
  };

  const initialEmotions: Record<NpcId, number> = {
    butler: 20,
    maid: 45,
    visitor: 30,
    niece: 35,
    doctor: 35
  };

  const list: NpcStructure[] = [];
  const npcIds: NpcId[] = ['butler', 'maid', 'visitor', 'niece', 'doctor'];

  for (const id of npcIds) {
    const tItem = translations[id]?.[lang] || translations[id]?.['zh'];
    list.push({
      id,
      name: tItem.name,
      roleName: tItem.roleName,
      avatar: baseAvatars[id],
      personality: tItem.personality,
      features: tItem.features,
      initialEmotion: initialEmotions[id],
      timeline: tItem.timeline.map(t => ({ ...t, isLying: id === culpritId && t.time === '23:15' })),
      truthTimeline: tItem.truthTimeline.map(t => ({ ...t, isLying: id === culpritId && t.time === '23:15' }))
    });
  }

  return list;
};

// 4. Multilingual Physical Evidence List
export interface EvidenceItem {
  id: string;
  name: string;
  roomName: string;
  associatedNpc: NpcId;
  associatedNpcName: string;
  description: string;
  contradictionTitle: string;
}

export const getLocalizedPhysicalEvidence = (lang: Language): EvidenceItem[] => {
  const translations: Record<string, Record<Language, {
    name: string;
    roomName: string;
    associatedNpcName: string;
    contradictionTitle: string;
    description: string;
  }>> = {
    'lr-safe': {
      zh: {
        name: '红木五屉柜锁孔铜屑',
        roomName: '古董大客厅',
        associatedNpcName: '管家李国栋',
        contradictionTitle: '备钥失踪与暗锁痕迹',
        description: '保险箱盖被甩开。锁孔内壁留有原装备用长匙插取留下的铜磨屑和润滑油迹，而非暴力砸击痕迹。证明内贼拿取了副钥匙开槽。'
      },
      en: {
        name: 'Brass Powder in Mahogany Drawer Hole',
        roomName: 'Antique Parlor',
        associatedNpcName: 'Butler Li',
        contradictionTitle: 'Spare Key Scratches vs. Pure Intrusions',
        description: 'The safe lid was swung wide open. Internal inspection shows fresh metal-brass scrapings and residual industrial lubrication from the original spare key, rather than crowbar dents. A key holder opened it.'
      },
      ko: {
        name: '홍목 옷장 서랍 구멍의 청동 가루',
        roomName: '럭셔리 리빙룸',
        associatedNpcName: '집사 이국동',
        contradictionTitle: '보조열쇠 습격과 정상 분실 마찰',
        description: '파쇄 잔해 없음. 구멍 내벽의 청동 피가 억지 해정이 아니라 원 규격 복제품이 들쑤셔져 마모되어 생긴 청동 잔사 및 오일 점적입니다.'
      }
    },
    'lr-sofa': {
      zh: {
        name: '沙发底揉折的远洋赤字勒退信',
        roomName: '古董大客厅',
        associatedNpcName: '访客周海平',
        contradictionTitle: '周海平千万债务危机',
        description: '揉成硬团的手撕勒收单：“若不于五日内到账一千万专款，名下资产将悉数冻结申报法办……”，周海平具有强烈的行窃并转移销赃的资金压力与犯罪动机。'
      },
      en: {
        name: 'Crumpled Debt Warning Letter under Sofa',
        roomName: 'Antique Parlor',
        associatedNpcName: 'Visitor Zhou',
        contradictionTitle: 'Zhou\'s Urgent $10M Liquidity Crash',
        description: 'Found squeezed deep under the plush sofa. Read: "Submit 10 Million within five banking days or face total asset confiscation." Zhou is under savage financial force to commit theft.'
      },
      ko: {
        name: '소파 밑에 은닉된 연안 채무 최후 통보장',
        roomName: '럭셔리 리빙룸',
        associatedNpcName: '방문객 주해평',
        contradictionTitle: '주해평의 긴급 천만 위안 파산위기',
        description: '의자 쿠션 깊숙이 한지처럼 우그러진 경고 서신. "5일 이내로 긴급 외환 상환이 불가하면 자산 사법 동결 예정..." 주해평은 극단적인 자금 탈환 절취 동기를 품고 있습니다.'
      }
    },
    'lr-fireplace': {
      zh: {
        name: '大壁炉未烧尽的速效心脏针包装袋',
        roomName: '古董大客厅',
        associatedNpcName: '私人医生陆浩然',
        contradictionTitle: '大壁炉中强效针余包装',
        description: '在薪火残灰下掏出的牛皮纸包装片，残留字样“速效心脏镇静激素针……”。证明医生或持有包装片的人，在23:15客厅趁暗烧毁剩余包装。'
      },
      en: {
        name: 'Half-Burned Heart Hormone Sleeve in Fireplace',
        roomName: 'Antique Parlor',
        associatedNpcName: 'Doctor Lu',
        contradictionTitle: 'Fireplace Residue of Sudden Vials',
        description: 'Pulled out from burning oak ashes in the fireplace. Scraps of wrapping reading "...fast acting endocrine injectables...". Indicates the doctor burned excess packages in the parlor under black out.'
      },
      ko: {
        name: '원목 화로에 그을린 혈청 주사 소모 포재',
        roomName: '럭셔리 리빙룸',
        associatedNpcName: '개인 의사 육호연',
        contradictionTitle: '화로에 잠입 탄화된 특수 의약 비닐',
        description: '타다 남은 비화 안에서 검출된 특수 포지 조각. "...속효성 심박 조율 에스트로젠 침투 주사..." 의약품에 지식이 있는 소지자가 지하에서 훔쳐 와 소각하려던 증제입니다.'
      }
    },
    'co-gallery': {
      zh: {
        name: '油画框袖口擦蹭白迹',
        roomName: '1F走廊中枢',
        associatedNpcName: '佣人陈敏',
        contradictionTitle: '走廊蹭划位置作假',
        description: '欧式壁肖像歪斜，底框一角留有大片袖口擦干净的高位白区，表明某人在23:15案发当时急行仓皇掠过走廊撞歪了像架。'
      },
      en: {
        name: 'Sleeve Friction White Mark on Picture Frame',
        roomName: '1F Central Hallway',
        associatedNpcName: 'Maid Chen Min',
        contradictionTitle: 'Hallway Drift Marks & Rushing Track',
        description: 'An oil portrait of a previous butler lies skewed. The corner frame exposes sleeve scuff whitening the dust, proving someone in a violent frenzy at 23:15 collided with the frame in total haste.'
      },
      ko: {
        name: '대형 유화 테두리에 쓸린 소맷단 털털자국',
        roomName: '1층 공용 복도',
        associatedNpcName: '하녀 진민',
        contradictionTitle: '복도 마찰 돌출과 탈출 동선 불일치',
        description: '초상화 액자가 유별나이 비뚤어져 휜 각도. 구석에 하얀 소매 질의 섬유 이물과 먼지 세척 구역이 남았습니다. 23:15 폭폭하고 비정상적인 급보 도주로 충돌한 잔류 자국입니다.'
      }
    },
    'co-stair': {
      zh: {
        name: '登楼台阶粘连的红玫瑰香草叶渣',
        roomName: '1F走廊中枢',
        associatedNpcName: '侄女韩雨欣',
        contradictionTitle: '韩雨欣仓惶返屋的印记',
        description: '第二级木楼梯阶沾附着酸湿酸湿红玫瑰香料屑。只在一楼大厅和二楼侄女闺阁里的台灯盆里培植，印证女犯人偷窃得手后极速跑上楼。'
      },
      en: {
        name: 'Wet Rose Leaf Paste on Stairs to 2F',
        roomName: '1F Central Hallway',
        associatedNpcName: 'Niece Han Yuxin',
        contradictionTitle: 'Niece\'s Panic Stairway Leaf Droppings',
        description: 'Sticky rose organic residue pressed into the second wood step. Cultivated solely in parlor and Ms. Han\'s lavender lights basket. Signals the culprit sprinted upstairs with damp shoes.'
      },
      ko: {
        name: '2층 나무계단에 짓이겨진 장미 가루 흙점',
        roomName: '1층 공용 복도',
        associatedNpcName: '조카 한우흔',
        contradictionTitle: '조카의 허둥지둥 등단 통행 흔적',
        description: '나무 계단 디딤판 가에 부착된 붉은 장미 오일 및 흙모래. 이는 거실 데코와 2층 그녀의 침실 화분에서 가식배양된 품종으로 범인이 훔치고 2층으로 튀었음을 입증합니다.'
      }
    },
    'ki-faucet': {
      zh: {
        name: '23:15大拧开喷泄水龙头',
        roomName: '1F后厨长台',
        associatedNpcName: '佣人陈敏',
        contradictionTitle: '水龙头激流听觉隔障',
        description: '水牙旋片在案发刻有因强力拧动摩擦脱落的热齿痕，积水极深。案发23:15时此处水喉全开，喷流声音震耳欲聋，用来遮掩人在长廊上跑回卧室的脚步声！'
      },
      en: {
        name: '23:15 Faucet Maximum Flow Blast',
        roomName: '1F Cooking Kitchen',
        associatedNpcName: 'Maid Chen Min',
        contradictionTitle: 'Acoustic Cover-up via Water Blasts',
        description: 'Friction teeth patterns on the brass tap shows it was cranked forcedly in great haste. Faucet fully on at 23:15, roaring water served to build an acoustic shield masking escape stairs footsteps.'
      },
      ko: {
        name: '23:15 무렵 최대 작동된 주방 급류 수문',
        roomName: '1층 배후 주방',
        associatedNpcName: '하녀 진민',
        contradictionTitle: '수도 급류의 청각 장벽용 소음 역용',
        description: '황동 밸브 가에 강타한 집게 자국 마찰흔. 사정동 가시 무렵 수포를 대역으로 최대 작동시켜 거구의 긴박한 사운드를 물소리로 흡음 소거하려는 동역입니다.'
      }
    },
    'ki-stove': {
      zh: {
        name: '汤灶水漫空烧水壶',
        roomName: '1F后厨长台',
        associatedNpcName: '管家李国栋',
        contradictionTitle: '管家离心烹茶骗局',
        description: '铁汤灶底干涸，留有大股白溢茶垢。证明23:15期间开水嗡嗡沸腾溢出，而管家人影皆无，他谎称寸步不退待在此处当面给客人温茶是弥天大谎！'
      },
      en: {
        name: 'Dry-Boiled tea Kettle Overflow Residue',
        roomName: '1F Cooking Kitchen',
        associatedNpcName: 'Butler Li',
        contradictionTitle: 'Butler\'s Culinary Kitchen Absconding',
        description: 'Stove burner dry and caked with boiled-over white mineral scaling. Proves the water inside overflowed at 23:15 with no attendant. The butler\'s report of being here with the customer is completely broken.'
      },
      ko: {
        name: '주방 전기 버너 주전자 분출 마른 백회',
        roomName: '1층 배후 주방',
        associatedNpcName: '집사 이국동',
        contradictionTitle: '집사의 기획 음료 부제 공실 허점',
        description: '화로 밑바닥에 물이 흘러넘쳤다 완전히 지져져 증발한 응회 띠. 이는 23:15 도난 발생 당시, 집사가 차 조제장에 있지 않고 대규모 밀실 이탈 상태였음을 방증합니다.'
      }
    },
    'ki-tea': {
      zh: {
        name: '伯爵红茶铁罐夹套副备用金钥匙',
        roomName: '1F后厨长台',
        associatedNpcName: '管家李国栋',
        contradictionTitle: '日常收纳副钥匙失踪',
        description: '红茶罐顶部的塑料钥匙盘无端无影，空了一档。管家是红木橱锁唯一的收纳持有者，证明内贼配走这把备钥轻松开格偷挂，而未对保险箱动粗。'
      },
      en: {
        name: 'Tea Tin Compartment Missing Spare Key',
        roomName: '1F Cooking Kitchen',
        associatedNpcName: 'Butler Li',
        contradictionTitle: 'Spare Safe Key Misplacement',
        description: 'The key slot at the top plate inside the Earl Grey tin is empty. The butler is the sole cataloger of this spare key, indicating someone pounced on this tea box in his physical custody.'
      },
      ko: {
        name: '얼그레이 차통 상층 빈 열쇠 카트리지',
        roomName: '1층 배후 주방',
        associatedNpcName: '집사 이국동',
        contradictionTitle: '소장용 비상 금고 열쇠의 조기 탈동',
        description: '차통 찻주머니 위에 고안된 서랍식 클립이 공실 상태. 관리직인 이국동 집사가 소유권을 수장한 복제 금고 속 지쇠로서 누군가 순조롭게 금고 록을 푼 증거입니다.'
      }
    },
    'be-lamp': {
      zh: {
        name: '勾夹假发丝的砸翻倾倒台灯',
        roomName: '2F少女闺房',
        associatedNpcName: '侄女韩雨欣',
        contradictionTitle: '打碎闺房台灯并勾住假发丝',
        description: '砸扁的名灯中紧挂有一缕微长的黑款假发丝，与韩雨欣配戴的长面具发极度一致。证明她在23:15不在房内，而是在偷物后神乱折回、重力砸翻台灯！'
      },
      en: {
        name: 'Overturned Desk Lamp Snagged with Fake Hair strand',
        roomName: '2F Niece\'s Chamber',
        associatedNpcName: 'Niece Han Yuxin',
        contradictionTitle: 'Tripping the Desk Lamp in Blind Panic',
        description: 'Slightly crushed luxury desk lamp has a lock of long extensions tangled in the wire loop, matching Ms. Han\'s wig. Tells us she ran in blind panic in total dark at 23:15, knocking it off.'
      },
      ko: {
        name: '화장탁상에 사정없이 꺾인 가발모 가닥 전등',
        roomName: '2층 아가씨 방',
        associatedNpcName: '조카 한우흔',
        contradictionTitle: '공황 상태 귀실과 골드 등잔 붕해',
        description: '뒤집혀 파손된 인장식 전등의 코드 홈에 여분의 긴 흑색 침투용 가발용 합성섬유가 인장되어 나포되었습니다. 23:15 기습 침투했다 돌아와 암흑 속에서 짚다 부순 흔적으로 입증됩니다.'
      }
    },
    'be-drawer': {
      zh: {
        name: '梳妆镜塞藏留洋学分期催退单',
        roomName: '2F少女闺房',
        associatedNpcName: '侄女韩雨欣',
        contradictionTitle: '韩女12万赞助学费红红赤字',
        description: '催缴单写明严重拖延勒退通知。今早她的学费要求遭到脾气倔强的大资本家二叔无情驳绝，少女铤而走险具备不可抗之动机！'
      },
      en: {
        name: 'College Expulsion Alert behind Cosmetics Mirror',
        roomName: '2F Niece\'s Chamber',
        associatedNpcName: 'Niece Han Yuxin',
        contradictionTitle: 'Tuition Shortage & Drastic Decisions',
        description: 'Past due college bill warning of imminent enrollment termination. Her plea to her uncle this morning for the $120k sum was fiercely blocked. Demoralized and backed into a corner, she had powerful reasons to steal.'
      },
      ko: {
        name: '화장거울 틈에 몰래 박힌 해외 대학교 제적 위보서',
        roomName: '2층 아가씨 방',
        associatedNpcName: '조카 한우흔',
        contradictionTitle: '학자금 긴급 중단과 해외 정학 전야',
        description: '송부 대기 중인 잔액 압류 제적 최종 경고장. 금일 오전 그녀의 일시 지원 간청은 숙부의 야멸찬 성벽에 좌절되어 궁지에 선 조카의 범행 요건을 완성시켰습니다.'
      }
    },
    'wc-db': {
      zh: {
        name: '配电柜黑色总电闸拉手把发黑手柄',
        roomName: 'B1极寒酒窖',
        associatedNpcName: '私人医生陆浩然',
        contradictionTitle: '酒窖断电总开与医生不在场证据',
        description: '在23:15地下配闸的大手把向下强压，配电全部断流黑灯长达十分钟。自诩值守配标药物的医生却撒反锁盘丸之谎，事实上面膜趁着起居室变黑行不轨！'
      },
      en: {
        name: 'Sub-Electrical breaker Lever Switched Off',
        roomName: 'B1 Damp Wine Cellar',
        associatedNpcName: 'Doctor Lu',
        contradictionTitle: 'Power Breaker Shutdown vs. Medicine Mixing',
        description: 'At 23:15, the master power switch was manually pushed lower, plunging the entire property into darkness for 10 minutes. The doctor who claimed he was mixing medications under secure light is exposed.'
      },
      ko: {
        name: '배전실 마스터 메인 셧오프 스위치 압강 손잡이',
        roomName: '지하 한랭 와인창고',
        associatedNpcName: '개인 의사 육호연',
        contradictionTitle: '배전기 단락 무전 제어와 진료 핑계 충돌',
        description: '주전력 핸들이 23:15에 하강 제어되어 빌라 전역이 10분 간 가발 암흑을 유발. 지하 밀봉실에서 세밀 조제 중이었다고 외치던 육 의사의 주장을 뒤흔듭니다.'
      }
    },
    'wc-med': {
      zh: {
        name: '医生冷柜黑护照与境外催还信',
        roomName: 'B1极寒酒窖',
        associatedNpcName: '私人医生陆浩然',
        contradictionTitle: '医生境外洗钱危急',
        description: '冷藏柜夹层搜到的黑账，显示医生涉嫌境外对账单造成了二十五万美金非法亏损，执业吊扣在即，优雅的神医正遭遇名利尽毁的深渊催促。'
      },
      en: {
        name: 'Fake Passport and Laundering Dossier inside Dr. Fridge',
        roomName: 'B1 Damp Wine Cellar',
        associatedNpcName: 'Doctor Lu',
        contradictionTitle: 'Offshore Laundering & Looming Asset Freeze',
        description: 'Secret ledger hidden in the medicine fridge compartment revealing $250k embezzlement and laundering. His medical license is on the verge of termination, pushing the elegant elite to grab quick cash.'
      },
      ko: {
        name: '의용 냉간기 사이 가짜 여권과 해외 사법 기소장',
        roomName: '지하 한랭 와인창고',
        associatedNpcName: '개인 의사 육호연',
        contradictionTitle: '육 의사의 해외 자금세탁 규명 소인',
        description: '전적용 정밀 약제함 이중 바닥에서 압수한 전재 유출 경과지. 25만 달러 빚 누적으로 전력 정지가 임계에 달한 지식인의 극한 한 수로 풀이됩니다.'
      }
    }
  };

  const results: EvidenceItem[] = [];
  const baseEvs = [
    { id: 'lr-safe', associatedNpc: 'butler' as NpcId },
    { id: 'lr-sofa', associatedNpc: 'visitor' as NpcId },
    { id: 'lr-fireplace', associatedNpc: 'doctor' as NpcId },
    { id: 'co-gallery', associatedNpc: 'maid' as NpcId },
    { id: 'co-stair', associatedNpc: 'niece' as NpcId },
    { id: 'ki-faucet', associatedNpc: 'maid' as NpcId },
    { id: 'ki-stove', associatedNpc: 'butler' as NpcId },
    { id: 'ki-tea', associatedNpc: 'butler' as NpcId },
    { id: 'be-lamp', associatedNpc: 'niece' as NpcId },
    { id: 'be-drawer', associatedNpc: 'niece' as NpcId },
    { id: 'wc-db', associatedNpc: 'doctor' as NpcId },
    { id: 'wc-med', associatedNpc: 'doctor' as NpcId }
  ];

  for (const info of baseEvs) {
    const tItem = translations[info.id]?.[lang] || translations[info.id]?.['zh'];
    results.push({
      id: info.id,
      name: tItem.name,
      roomName: tItem.roomName,
      associatedNpc: info.associatedNpc,
      associatedNpcName: tItem.associatedNpcName,
      contradictionTitle: tItem.contradictionTitle,
      description: tItem.description
    });
  }

  return results;
};

// 5. Multilingual PinBoard Clues list
export interface PinClue {
  id: string;
  title: string;
  description: string;
  type: 'evidence' | 'testimony' | 'deduction';
  color: string;
  x: number;
  y: number;
  rotation: string;
  unlockedAtStart?: boolean;
}

export const getLocalizedPresetClues = (lang: Language): PinClue[] => {
  const translations: Record<string, Record<Language, { title: string; description: string }>> = {
    'clue-faucet-wear': {
      zh: {
        title: '水龙头防滑齿刮耗',
        description: '厨房洗水池的大铜阀顶针咬合防滑齿有极严重逆袭刮耗。寻常人极少用重铁钳强卡或螺栓破坏拧动，显然有人在此进行了狂暴破坏性的阀轴拧动。'
      },
      en: {
        title: 'Water Tap Thread Scratches',
        description: 'Savage brass abrasions observed on the handle valve of the kitchen basin faucet. Ordinary users would never require iron pliers or wrench force, implying it was cranked under heavy physical rush.'
      },
      ko: {
        title: '수도 파이프 집게형 흉터',
        description: '주방 개수대 대형 파이프 밸브 모퉁이에 늑대 비축용 마그네틱 흠집이 고착되었습니다. 일반적인 정밀 세안에는 도구를 대지 않으므로 급히 파괴 연출한 것입니다.'
      }
    },
    'clue-water-flow': {
      zh: {
        title: '23:15 七分钟暴流泄水声',
        description: '通过开启铜把阀门测试，其在黄金案发时刻【23:15】期间，曾被大肆拧开，在隔音极差的厨房不间断泄漏出足足七分钟的澎湃巨浪水流轰鸣声。'
      },
      en: {
        title: '23:15 Seven-minute Water Blast',
        description: 'Water pressure testing shows that at exactly 23:15 during the burglary, the main faucet was cranked to maximum capacity, producing deafening continuous stream noise in the hollow kitchen area.'
      },
      ko: {
        title: '23:15 무렵 7분 누전성 급류량',
        description: '수압 배관 점검 결과 골든 범행 도약기 23:15 전후해 7분 간 수문이 통째로 전개되어 웅웅 거리는 고강도 배수 폭음 소리를 유통한 상태입니다.'
      }
    },
    'clue-doctor-wet-stain': {
      zh: {
        title: '随医白领衣袖未干水印',
        description: '随行医生陆浩然身上的大白褂右手肘外侧，有一道深色、边缘晕开的微湿圆领状水印。其化学分析对应了厨房水槽的水源酸性洗涤剂微粒。'
      },
      en: {
        title: 'Wet Stain on Doctor\'s Sleeve',
        description: 'A damp circle on the outer right sleeve of Doctor Lu\'s white laboratory coat. Chemical tests match trace of acid dishwasher compound strictly matching water from the kitchen washbasin.'
      },
      ko: {
        title: '육 의사 백의에 밴 산성 물티',
        description: '주치의 백일 가운 우측 주관절 전변에 고리 형태의 물얼룩이 선명히 존착. 물기 전파 성상 분석 시 주방 산성 합성 세제 잔과 100% 매치되는 분석 결과 획득.'
      }
    },
    'clue-maid-corridor': {
      zh: {
        title: '佣人陈敏：走廊寂静空白说',
        description: '佣人陈敏笔录赌誓：“23:15 期间，我一直手抓抹布在走廊清扫先人肖像画，那时候整扇通道寂静如墓地，绝对没有任何半个人，也无任何脚步声。”'
      },
      en: {
        title: 'Maid Chen\'s Silent Hallway Oath',
        description: 'The maid swore: "At 23:15 PM, I was diligently wiping portrait frames in the corridor. The pathway was quiet as a tomb. Absolutely no one walked past, and there was no sound of footsteps."'
      },
      ko: {
        title: '진민 하녀: 복도 공적무인 고집',
        description: '진 하녀 선서: "23:15경 가문 오일 화폭을 문전 대입 세정하던 시기, 복도는 적요였으며 어떠한 통행 기운이나 소음도 들리지 않았습니다."'
      }
    },
    'clue-crossing-corridor': {
      zh: {
        title: '管家与访客：23:15行廊中转',
        description: '管家李国栋和顾客周商客口供高度重合，指认：在 23:14 至 23:16 期间，二人曾分别大步穿行走廊前往厨房：一人取甘菊茶茶叶，一人索求苏打水。'
      },
      en: {
        title: 'Corridor Transit at 23:15',
        description: 'The testimonies of Butler Li and Client Zhou perfectly match: between 23:14 and 23:16, both walked briskly across the same central corridor to the kitchen, one seeking tea leaves, the other soda.'
      },
      ko: {
        title: '집사와 무역원: 23:15 복도 조우선',
        description: '이국동 집사와 주 무역원의 교차 교섭 내용 엄지 합치: 23:14-23:16 분새로 한 사람은 차 껍질을, 또 한사람은 사이다 캔을 취하기 위해 공통 복도로 진입함.'
      }
    },
    'clue-run-footstep': {
      zh: {
        title: '23:21 走廊大急慌逃跑声',
        description: '客商周海平直指，在听到管家失窃惨叫前半分钟，走廊传来一阵类似轻拖鞋底大慌、沉重、慌不择路登爬梯道向楼上急撤退的极其仓促脚步声。'
      },
      en: {
        title: '23:21 Sprint Footsteps in Corridor',
        description: 'Witness Zhou pointed out that just half a minute before Butler\'s alarming call representing theft, rapid, desperate slipper padding clicked through the wooden stairway fleeing upstairs.'
      },
      ko: {
        title: '23:21 복도 계단 급체 도망음',
        description: '내객 주씨 지목에 서술: 집사의 정황 벨이 울리기 직전 약 30초 전야에, 난잡하게 위층 완강계단 방향으로 뛰어들어 달아나는 황급한 슬리퍼 모래 마찰음을 전개함.'
      }
    },
    'clue-niece-headphones': {
      zh: {
        title: '侄女韩雨欣：降噪重音耳罩',
        description: '声称23:15为了平复被扣学费的极致愤怒，正坐在卧铺，双耳戴着专业厚降噪耳罩并高分贝轰放重低音电子小说，誓死坚信不曾离开和听到房间异响。'
      },
      en: {
        title: 'Niece\'s Heavy ANC Headphones',
        description: 'Ms. Han declared that during 23:15, she was on her bed with high-fidelity noise-canceling headphones playing heavy audiobooks on max volume, explaining why she heard nothing.'
      },
      ko: {
        title: '조카 한우흔: 최대 음적 헤드폰 핑계',
        description: '조카 자칭: 23:15경 숙부 조율 격분 정화를 극단으로 식히고자 침대에서 밀접 차음형 대형 헤드폰을 착수하고 소음을 물리쳤다며 침실 이탈을 전면 봉쇄한 내용입니다.'
      }
    },
    'clue-smashed-lamp': {
      zh: {
        title: '二楼闺房打碎的粉色台灯',
        description: '侄女卧桌前名家名作粉色手绘夜台灯被粗暴倒摔于地，灯瓷皲裂，地毯泛湿。这说明韩雨欣卧室在案发瞬间经历过某种极为惊惶、急促抢光的返房慌退。'
      },
      en: {
        title: 'Smashed Pink Lamp in 2F Bedroom',
        description: 'The designer pink hand-painted lamp lay shattered on the floor, rug wet. Indicates her private room witnessed a chaotic, frantic return in the dark right immediately during the theft window.'
      },
      ko: {
        title: '2층 침대 곁 조각난 분홍 명색 전등',
        description: '대형 화로 곁의 분홍 탁상등이 도자기가 찢어진 채 미완으로 도열. 누군가 자정 즈음 불이 꺼진 븜실 공간에 겁에 치여 들어오다 정황 엎어버린 표정입니다.'
      }
    },
    'clue-dark-cellar': {
      zh: {
        title: '无电熄闸的地下黑酒窖',
        description: '医生陆浩然声称 23:15 独自反锁在酒窖清点心脏药品，然而老管家正巧想下酒窖拿蜂蜜，看到地下大配电闸早被停挂，内里浸沉伸手不见五指死寂，无法辩药。'
      },
      en: {
        title: 'De-energized Pitch Black Wine Cellar',
        description: 'Dr. Lu insists he spent 23:15 locked in the cellar sorting formulary. However, Butler Li who wanted honey saw B1 breaker was pulled. The cellar was in freezing pitch darkness, impossible to read labels.'
      },
      ko: {
        title: '무전 단전 암전된 한랭 와인장',
        description: '의사는 23:15 와인실 가스 조율을 했다 했나, 집사가 야채 꿀통 조달을 위해 내려오자 전기 스위치 레일이 완전 벌거벗고 차단되어 칠흑 같은 암실 상태였음이 발굴되었습니다.'
      }
    }
  };

  const presetCluesBase = [
    { id: 'clue-faucet-wear', type: 'evidence' as const, color: 'bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-300 text-amber-950 font-sans', x: 80, y: 50, rotation: '-rotate-2' },
    { id: 'clue-water-flow', type: 'evidence' as const, color: 'bg-gradient-to-br from-cyan-50 to-blue-100 border-cyan-300 text-sky-950 font-sans', x: 380, y: 50, rotation: 'rotate-1' },
    { id: 'clue-doctor-wet-stain', type: 'evidence' as const, color: 'bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-300 text-teal-950 font-sans', x: 760, y: 50, rotation: 'rotate-2' },
    { id: 'clue-maid-corridor', type: 'testimony' as const, color: 'bg-gradient-to-br from-orange-50 to-amber-100 border-orange-300 text-orange-950 font-sans', x: 80, y: 280, rotation: 'rotate-1', unlockedAtStart: true },
    { id: 'clue-crossing-corridor', type: 'testimony' as const, color: 'bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-300 text-purple-950 font-sans', x: 80, y: 470, rotation: '-rotate-1', unlockedAtStart: true },
    { id: 'clue-run-footstep', type: 'testimony' as const, color: 'bg-gradient-to-br from-rose-50 to-pink-100 border-rose-300 text-rose-950 font-sans', x: 410, y: 470, rotation: 'rotate-2' },
    { id: 'clue-niece-headphones', type: 'testimony' as const, color: 'bg-gradient-to-br from-pink-50 to-fuchsia-100 border-pink-300 text-fuchsia-950 font-sans', x: 760, y: 280, rotation: '-rotate-2' },
    { id: 'clue-smashed-lamp', type: 'evidence' as const, color: 'bg-gradient-to-br from-red-50 to-rose-100 border-red-300 text-red-950 font-sans', x: 760, y: 470, rotation: 'rotate-1' },
    { id: 'clue-dark-cellar', type: 'testimony' as const, color: 'bg-gradient-to-br from-slate-50 to-zinc-150 border-slate-300 text-slate-900 font-sans', x: 415, y: 280, rotation: '-rotate-1' }
  ];

  return presetCluesBase.map(item => {
    const tItem = translations[item.id]?.[lang] || translations[item.id]?.['zh'];
    return {
      ...item,
      title: tItem.title,
      description: tItem.description
    };
  });
};

// 6. Multilingual PinBoard Deductions list
export interface DeductionResult {
  id: string;
  title: string;
  description: string;
  triggeredBy: [string, string];
  unlockedClueId: string;
  x: number;
  y: number;
}

export const getLocalizedPresetDeductions = (lang: Language): DeductionResult[] => {
  const translations: Record<string, Record<Language, { title: string; description: string }>> = {
    'deduction-audio-camouflage': {
      zh: {
        title: '【高能推论：水流声障干扰】',
        description: '厨房大拧水龙头放水整整七分钟，其巨浪轰鸣完美笼罩了隔音极差的一楼。这说明放水者绝非为了洗手起泡，而是有预谋地利用强噪声干扰一楼巡视。目的是为走廊内贼人开箱、折返、以及慌张小奔跑打掩护！放水人与偷走吊坠并在23:21惊醒折返的人是极其严丝合缝的同谋，甚至为同一人！'
      },
      en: {
        title: '【Deduction: Acoustic Water Camouflage】',
        description: 'The kitchen faucet was left blasted full for seven minutes, roaring loud enough to mask footsteps on the 1st floor. It proves the culprit intentionally generated a noise barrier. Its sole purpose was to muffle safe picking, staircase sprint, and corridor transit. The dumper and the thief are strictly the same person or deep partners!'
      },
      ko: {
        title: '【논리 추론: 수도 급류 소음 장벽】',
        description: '주방 수도를 7분 간 사정없이 개방한 격은 단순 손 닦음이 아닙니다. 비정상적 소음을 가공시켜 거실 금고 개방과 복도 통로 패싱 계단 진입 도망 소음을 은밀하게 침투 가리는 음벽 역용 계책입니다! 배수 밸브 침수 조작과 사칭 인물은 전형적으로 동일인입니다!'
      }
    },
    'deduction-phantom-corridor': {
      zh: {
        title: '【高能推论：佣人长廊不在场坍塌】',
        description: '佣人陈敏极力证实走廊在 23:15 度过真空“没有任何人半点异响”，但这与管家李国栋和访客周海平确认当时高频经过的事实产生致命物理碰撞。这证明女佣当时根本不在走廊岗位！她显然是在客厅内强撬保险挂锁，事后为了掩盖行踪，才凭空编造了走廊无人在场的极假伪证！'
      },
      en: {
        title: '【Deduction: Maid Corridor Alibi Collapse】',
        description: 'Maid Chen Min swore the hallway was entirely empty at 23:15. However, Butler and Visitor Zhou verified they stepped into that exact hallway during that precise time window. This physical paradox proves Chen Min was nowhere near her duty in the corridor! She was likely picking the parlor safe, and fabricated the "empty graveyard hallway" after the fact.'
      },
      ko: {
        title: '【논리 추론: 하녀 복도 지킴 증명 함몰】',
        description: '하녀 진민은 23:15에 복도가 적요였고 아무도 통행하지 않았다고 가치 주장하나, 집사 이국동과 내객 주해평의 공통 복도 인장 통과와 강력 충돌합니다. 즉, 그녀는 복도에 존재하지 않았습니다! 거실 금고를 급습한 뒤 범행 경로 파종을 위해 공실 거짓말을 연출한 것입니다!'
      }
    },
    'deduction-niece-shattered': {
      zh: {
        title: '【高能推论：耳机障蔽与慌乱归巢】',
        description: '侄女韩雨欣在案发时卧室空无一人。这就完全戳破了她“正佩戴ANC大音乐耳罩在卧沉思”的假在场！与其床上没人配合的，是她房内匆忙倒地撞坏的名贵台灯，以及在走廊 23:21 发生的急骤奔撤脚步。说明韩欣欣正是下楼开柜得手后，慌神赶在管家拉铃报窃前极度惊恐登楼归房、摸黑踩断台灯脚！'
      },
      en: {
        title: '【Deduction: Headphone Shields or Runaway?】',
        description: 'Niece Han\'s chamber was verified empty at 23:15. This shatters her alibi of "wearing heavy ANC headphones peacefully on bed". The empty bed, combined with her shattered desk lamp in global dark and the 23:21 corridor rush slippers, confirms she slithered downstairs to grab the pendant, tripped the lamp in absolute panic returning.'
      },
      ko: {
        title: '【논리 추론: 헤드폰 보호막과 공황의 도주】',
        description: '조카 한우흔은 23:15 정야에 침실에 부존재 상태였습니다. "헤드폰 조율 정서" 알리바이가 붕해됩니다. 가구들의 전도 붕해 와장탕 흔적과 23:21 복도 슬리퍼 격파음이 맞아떨어지며, 절도 작지 실행 즉시 소리가 나 벨이 타동 되기 전, 어두운 방으로 뛰어가 불장난 전등을 엎친 증빙 구도입니다.'
      }
    },
    'deduction-doctor-faucet': {
      zh: {
        title: '【高能推论：医生作恶与潮湿袖记】',
        description: '阀口齿轮有暴力别开磨刮，而平时高洁、双手从未沾水的医生陆浩然，案口身上恰有一道微潮酸性洗溶水印。这说明陆医生行窃得手后，慌忙奔行至厨房用蛮力逆转大水龙头进行放水制造掩蔽，不料袖子碰上水管沾湿！'
      },
      en: {
        title: '【Deduction: Doctor\'s Plunge & Wet Sleeves】',
        description: 'The kitchen faucet copper pin was wrenched with heavy force, and Dr. Lu, whose hands are normally sanitised and dry, happened to bear a wet acid-cleaner stain under his lab-coat elbow. Outlines that Dr. Lu after prying the jewelry, darted into the sink to switch the torrent faucet on to camouflage acoustics, brushing his sleeve against the pipe.'
      },
      ko: {
        title: '【논리 추론: 의사의 무전 제합과 가운 수축 무티】',
        description: '수조의 밸브 축이 극도의 외력으로 문대어졌고, 마침 고결한 성품의 육 의사의 우측 가운 소매에 산성 배수수 무리가 묻어 감식되었습니다. 이는 에메랄드 절도 완료 직후 수도를 급히 전개하려다 소매가 배관에 정통 쓸린 흔적으로 성상 수렴됩니다.'
      }
    },
    'deduction-doctor-breaker': {
      zh: {
        title: '【高能推论：配电闸歪斜与假照盲药】',
        description: '地窖配闸被拉掉，处于断开状态，这直接锤死了陆浩然“在锁门冷藏前安详清点药物”的不在场扮演。因为地下一片炭黑，配药瓶上极小密麻的洋文标识根本不可能辨认。他事实上是拉了总闸，摸黑上楼犯案。'
      },
      en: {
        title: '【Deduction: Breaker Shutdown & False Light Formulation】',
        description: 'The cellar breaker was discovered manually lowered. This completely dismantles Dr. Lu\'s claim of "locked-in careful medication dispensing under light". In freezing pitch darkness, tiny foreign instructions on chemical vials are impossible to read. The physician cut the power master grid and sneaked up on foot.'
      },
      ko: {
        title: '【논리 추론: 배전 정지 차단과 영문 표기 해정 불가】',
        description: '지하 전력 레일 차단 해제. 가벼운 배약 작업을 칠흑 암실 구도에서 분침할 수 한계가 없습니다. 미세 외항 약제 부호를 대조할 수 없으므로, 즉 전기를 절개해 전체 암전을 만들고 1층에서 주범 획득을 추진한 동종 역학입니다.'
      }
    }
  };

  const presetDeductionsBase = [
    { id: 'deduction-audio-camouflage', triggeredBy: ['clue-water-flow', 'clue-run-footstep'] as [string, string], unlockedClueId: 'c2', x: 410, y: 260 },
    { id: 'deduction-phantom-corridor', triggeredBy: ['clue-maid-corridor', 'clue-crossing-corridor'] as [string, string], unlockedClueId: 'c1', x: 80, y: 190 },
    { id: 'deduction-niece-shattered', triggeredBy: ['clue-niece-headphones', 'clue-smashed-lamp'] as [string, string], unlockedClueId: 'c1', x: 760, y: 380 },
    { id: 'deduction-doctor-faucet', triggeredBy: ['clue-doctor-wet-stain', 'clue-faucet-wear'] as [string, string], unlockedClueId: 'c1', x: 760, y: 190 },
    { id: 'deduction-doctor-breaker', triggeredBy: ['clue-dark-cellar', 'clue-doctor-wet-stain'] as [string, string], unlockedClueId: 'c1', x: 410, y: 190 }
  ];

  return presetDeductionsBase.map(item => {
    const tItem = translations[item.id]?.[lang] || translations[item.id]?.['zh'];
    return {
      ...item,
      title: tItem.title,
      description: tItem.description
    };
  });
};

// 7. Breakthrough Accused Responses of the characters (when players present correct evidence in dialogs)
export const getLocalizedReaction = (evidenceId: string, npcId: NpcId, culpritId: NpcId, lang: Language): string => {
  if (culpritId === 'maid' && npcId === 'maid') {
    if (evidenceId === 'co-gallery' || evidenceId === 'ki-faucet') {
      return {
        zh: "啊！！！画、画框底部的摩擦衣底白迹……？！你竟然发现那里有我的衣服剐蹭痕迹……而且你还指出，在23:15案发当时，厨房水龙头大开，流水声音大得出奇，正是为了通过高噪音来遮盖楼道里仓皇急躁的脚步声？！\n\n（陈敏双眼瞳孔暴缩，情绪瞬间崩溃失控，泪水夺眶而出）\n\n呜呜呜……对不起！侦探，我说谎了！我承认我不在走廊扫地，23:15那一刻我见客厅变暗，的确偷偷撬开了红木五屉柜……但我求你相信我，我真的没有拿走绿宝石吊坠！在我撬开柜子的一瞬间，里面就已经是空的了！我是听到了楼上卧室台灯砸碎的声音，太害怕了，才拼命跑下楼并把水龙头拧开……在逃跑前我鬼迷心窍把捡到的吊坠藏在 厨房清洗水槽橱柜大拖把旧抹布最底层 里面了！",
        en: "Ah!!! Sleeve smudge on the painting frame corner?! You found matching fibers there... and you point out that at 23:15, the roaring faucet was deliberately turned full blast to cover panic running sounds on the wooden hallway?!\n\n(Chen Min's eyes shrink in horror, her defenses snap and tears burst out)\n\nSob... Im so sorry, detective! I lied! I wasn't cleaning the corridor at 23:15. I saw the parlor darken and pried the mahogany drawer cabinet... But believe me, I didn't mean to steal originally! To escape track, I stuffed the gemstone under the pile of dirty old mops inside the kitchen washroom sink cabinet!",
        ko: "악!!! 화폭 모퉁이 밑바닥의 섬유 오물 마찰흔...?! 거기 세정 지문을 규합하다니... 게다가 23:15 도주 시 소음을 감추려 주방 수도를 과격하게 개동해 폭주급 소리를 음벽으로 대입한 걸 저격했단 말인가요?!\n\n(진민의 동공이 극도로 수축되며 심리 수비선이 돌파되어 오열하기 시작함)\n\n우우우... 죄송합니다 탐정님! 거짓을 보탰습니다. 23:15 복도 청소는 허구입니다.客厅이 어두워지자 수납함을 따개 에메랄드를 품었습니다... 단지 벨이 울려대자 공포에 치여 절취물을 주방 수조 싱크대 밑창 잡탕 누더기 걸레더미 깊은 곳에 은닉했습니다!"
      }[lang];
    }
  }

  if (culpritId === 'butler' && npcId === 'butler') {
    if (evidenceId === 'ki-stove' || evidenceId === 'ki-tea') {
      return {
        zh: "什么……！汤灶空烧水的干涸白茶垢……还有红茶茶叶盒顶端的备用锁匙塑料卡片空了印子？！\n\n（李国栋脸色瞬间变得如纸般惨白，习惯拿茶杯的手剧烈战栗起来）\n\n可、可恶……！我一向以严谨自诩，在这个宅子里服侍了整整十六年……没想到居然败露在汤灶烧水溢出漫干的细节上……！看来天网恢恢，确实是在我23:15擅离厨房、借开水冲滚并故意空置去客厅开箱窃取绿吊坠的时间内发生的。是的！我说谎了，周海平根本没有当面遇到我，是我为了伪造不在场证明而编造了他接水的场景……我求罪开脱！我把东西暂藏在 厨房水槽底最里面脏拖把脏抹布最深角 里面了！我全认了！",
        en: "What...! Dry-boiling tea kettle scalings on the stove... and the vacant slot in the tea tin where the spare mahogany key is normally locked?!\n\n(Li Guodong's face turns paper white, his hand holding the tea tray shaking violently)\n\nDamn it...! I prided myself on flawless accuracy for 16 years in this villa... Only to be undone by overflows on the gas stove! It's true—at 23:15 I left the kitchen unattended, grabbed the spare key and pried the safe to take the pendant. I hid it under the pile of wet floor mops beneath the kitchen sink! I surrender!",
        ko: "허억...! 버너 가마의 찻물 탈화 자국... 게다가 얼그레이 차상자 상단의 보조 치쇠 거취 공실 흔적까지 보셨습니까?!\n\n(이국동의 얼굴이 종잇장처럼 창백히 질리며 차 쟁반을 잡던 손이 덜덜 떨리기 시작함)\n\n으윽...! 16년 지기 엄격성을 자부하던 제 평생이 물이 흘러넘쳐 건조 증발한 백회 구도에 덜미를 잡힐 줄이야...! 사정 시각 23:15, 화로를 고의 비운 채 주방에서 이탈, 여분 열쇠로 거실 자물쇠를 타개해 보물을 빼낸 것이 팩트입니다. 은빛 펜던트는 우선 급한 대로 주방 개수대 수납장 걸레 잡태층 최하단에 구겨넣었습니다! 죄를 달게 받겠습니다."
      }[lang];
    }
  }

  if (culpritId === 'visitor' && npcId === 'visitor') {
    if (evidenceId === 'ki-stove' || evidenceId === 'lr-sofa') {
      return {
        zh: "开、开玩笑……这居然是我揉成团塞在大皮沙发垫最深缝的远洋千万赤字催缴传单？！还有，你说当时管家根本不在厨房，水壶在空烧溢满……根本就没有管家亲手给我端苏打冰水这回事……？！\n\n（周海平傲慢的神情当场瓦解，他急促扯开领带，大汗淋漓，表情极度屈辱和惊惶）\n\n呃！啊……该死的侦探，你竟然私拆老爷的洋甘菊红茶罐和我的商务账单！……好！既然被你挖得一丝不挂，我也无需再抵赖。我确实欠着一千万港币的外债压力，五天内不结款就名誉扫地……所以23:15我乘其大厅黑夜用备钥抽空窃下了翡翠真品，并趁乱塞丢进厨房水池最深处的脏洗布拖把堆底下！我认栽！",
        en: "Y-You must be joking... This is my offshore debt warrant that I crumpled and shoved behind the leather sofa cushion?! And you prove the Butler wasn't in the kitchen at all, stove dry-boiling... meaning there was no soda delivery?!\n\n(Zhou's arrogant posture collapses. He rips loose his necktie, sweat pouring down his forehead)\n\nUgh! Ah... You persistent detective! Okay! I won't lie anymore. I have a $10 Million deficit and five days left before total bankruptcy. Yes, at 23:15 I pried the safe box in the dark hallway, grabbed the sapphire pendant, and threw it inside the dirtier cloth mop stack at the very bottom of the kitchen sink. I submit!",
        ko: "자, 장난해... 이 최후 파장장이 소파 가죽 틈에 처박았던 제 천만 위안 부도 전신이란 말입니까?! 게다가 당시 집사는 주방에 존재하지 않고 버너가 홀로 불타고 있었다면... 음료 제 배달도 성립되지 않고 다 거짓이란 얘긴가요?!\n\n(주해평의 거만한 턱시도 자태가 무대화되며 넥타이를 풀어 헤친 채 비지땀을 쏟아냄)\n\n끄윽! 아... 빌어먹을 탐정녀석! 밑바닥 채무서까지 찢어낼 줄이야... 좋습니다. 자금 압박으로 5일 내 외환 상환이 급급해 23:15 틈을 따 금고를 털었습니다. 보물 펜던트는 발각될 배후를 우려해 주방 싱크 수조 아래 젖어 걸터앉은 구형 걸레더미 깊은 곳에 욱여넣었습니다. 제가 졌습니다!"
      }[lang];
    }
  }

  if (culpritId === 'niece' && npcId === 'niece') {
    if (evidenceId === 'be-lamp' || evidenceId === 'co-stair') {
      return {
        zh: "砸扁黄金台灯边缘里勾夹着的……我平常修饰长耳搭配配用的几丝‘假黑色假发丝’丝线……？！还有楼梯扶踏台阶上粘着的，一楼香薰泥土玫瑰叶子？\n\n（韩雨欣整个身体如同遭遇冰冻，手捂着脸哇地一声哭泣起来，心理防线崩溃一触即决）\n\n呜哇……！探长，我求求你，绝对别告诉我二叔……！我不是真正想作恶的！今早二叔怒吼绝回了我的赞助学费通知，学校说后天不缴就得强制退学……我当时害怕极了，乘其大楼拉电，快步下一楼去客厅把吊坠窃走藏到了厨房洗水池底最脏那一块旧拖把破布堆格里……可上楼的时候太漆黑，我慌恐极了踩翻台灯碎了一地……我认，我全都交代！",
        en: "Fibers from my long black hair extension wig caught in the dented golden desk lamp's loop...?! And the wet rose fragrance leaf trail matching the parlor plants stuck to the hallway steps?!\n\n(Han Yuxin freezes entirely, covering her face and bursting into tears as her mind breaks)\n\nNo!!! Detective, please don't tell my uncle! I'm not a bad girl... He rejected my tuition bills and the university threatened expulsion tomorrow. I was terrified! In the 23:15 power cutout, I ran to the parlor safe, took the gemstone, shoved it under the dirty, wet mop piles in the kitchen wash cabinet. Returning, I tripped over the designer table lamp in total darkness! I confess everything!",
        ko: "찌그러진 탁상 금빛 전치 나사 틈에 감긴... 제가 머리 연출용으로 엮어 꽂고 다니던 흑색 가발사 올가미...?! 게다가 계단 입귀에 부스러기처럼 붙어 비벼진 은은한 장미 잎장 자국까지 다 보신 건가요?!\n\n(한우흔 아가씨의 상체가 화석처럼 굳어지며 손수건에 상안을 파묻고 흐느낌을 폭발시킴)\n\n으아아앙...! 탐정님, 숙부에게 절대 발설하지 말아주세요! 등록 학자금을 삭감 당해 모레 제적될 공포에 싸였습니다. 23:15 전택 정지 시기에 내달려 석판을 갈취, 주방 개수대 찌꺼기 거치대 물풀 걸레 보자기에 마구 밀쳤습니다. 복귀 단계에 시야가 안 보여 전등을 전도시켜 깨트렸습니다. 자백하겠습니다...!"
      }[lang];
    }
  }

  if (culpritId === 'doctor' && npcId === 'doctor') {
    if (evidenceId === 'wc-db' || evidenceId === 'wc-med') {
      return {
        zh: "地窖断电拉闸板扣死……还有私人低温冰箱储药格夹层里的海外假护照黑账册本？！\n\n（陆浩然脸色瞬间惨绿交迫，优雅的金丝框眼镜咔哒滑落在地，全身汗潮湿透）\n\n……！天网恢恢，真没想到，你居然算到了地下一层全部掉闸电荒与低温调药不可能黑暗进行的致命盲区……！是的，我在境外赌账亏空了上千万，黑势力逼我一周内平账。23:15我为了营造行动便利，板断了总电闸全栋陷入盲摸，以精调避光制急救特效冰针为借口，摸开保险撬走极珠宝。中途在长廊与陈女佣差身，仓促中直接塞埋在 厨房水槽下的旧脏拖把抹布层 掩盖痕迹！我服了，我全供！",
        en: "The cellar breaker lever verified pulled shut... and the secret offshore ledger and fake passport hidden in the medicine fridge drawer?!\n\n(Dr. Lu's face turns green in horror, his elegant round glasses sliding to the floor, shirt soaked in cold sweat)\n\n...! Unbelievable. You noted the paradox that B1 pitch darkness makes micro-dosing chemical solutions completely impossible...! Yes! I lost millions in offshore sports booking. I cut the power grid at 23:15, prying the parlor vault under blackout. Running into the maid on the corridor, I panicked and shoved the pendant under the dusty wet mops below the kitchen basin. You won!",
        ko: "지하 배전 차단 레일 강제 복구 오프... 약제창고 보관실 하단 벽에서 발포 감지된 자금 세탁용 외국 적색 기록망을 보신 모양이로군요?!\n\n(육호연의 얼굴색이 카키빛으로 굳어버리며 품위 넘치던 스펙터클 금테 안경이 탁상으로 낙하함)\n\n끄으으...! 지하기 수차 누전 및 조약 성상 판정의 지리적 한계를 수립해 내다니... 맞습니다. 해외 사채 회복을 조달하려 23:15 마스터 메인 라인을 격하 탈색, 주택을 혼란에 몰아넣어 물건을 입수했습니다. 복도에서 하녀와 부딪칠 뻔하자 몽롱한 마음에 주방 세조 밑바닥 흙먼지 구정물 걸레 밑에 세웠습니다. 지침에 따르겠습니다."
      }[lang];
    }
  }

  return {
    zh: "（咬了咬牙，扭过头去）侦探，我完全听不懂你在胡言乱语拿出这些做些什么……这和案发二十三点十五分没有任何的事实冲突！你这纯属于无端的构陷！",
    en: "(Gritting teeth and looking away) Detective, I have no idea what you are trying to imply with these exhibits... There is absolutely no temporal collision with my 23:15 timeline! This is groundless harassment!",
    ko: "(이를 악물며 눈길을 돌림) 탐정님, 이 증거들이 자정 당시와 어떠한 성상 충돌을 유도하는지 납득키 불가합니다. 억지 수사로 모함하지 마십시오!"
  }[lang];
};

export const getLocalizedClueNote = (clueId: 'c1' | 'c2', npcId: NpcId, lang: Language, culpritId: NpcId): string => {
  const data: Record<NpcId, Record<'c1' | 'c2', Record<Language, string>>> = {
    maid: {
      c1: {
        en: '[Paradox] At 23:15, both Butler Li and Visitor Zhou confirmed stepping in and out of the hallway. Maid Chen Min claimed "it was dead silent and completely empty." Physical layout collision proves her hallway alibi is a lie.',
        ko: '[동선 모순 문서] 23:15 당시 복도에서 집사 이국동과 방문객 주해평이 조우해 복도 이동을 정합했으나, 하녀 진민은 혼자서 개미 한 마리 안 지나갔다고 가짜 증언했습니다. 복도 정수 상태가 아닌 거실 금고 개방을 증명합니다.',
        zh: '【证词矛盾】23:15案发时管家与访客均确认在走廊行走交叉，而佣人陈敏妄称当时走廊毫无一人、寂静死寂。两相对撞，佣人的不在场谎言被戳穿。说明她当时根本不在走廊，而在客厅行窃。'
      },
      c2: {
        en: '[Acoustic Contradiction] Visitor Lord Zhou verified that at 23:21, somebody sprinted up the foyer floorboards in immense terror. Maid Chen Min claimed she paced calmly. Inward escape routes of the theft are exposed.',
        ko: '[동선 모순 문서] 방문인 주 사장이 23:21 주방 퇴실 단계 복도에서 급박한 여성의 신발 거칠기를 식별했으나, 진민은 의심을 슬쩍 비켜가려 평온히 있었다고 속였습니다. 장물 은폐 후 황급 탈출한 증거입니다.',
        zh: '【疑点案卷】访客周海平在23:21离场前听见走廊有人惊慌逃跑，鞋底嚓嚓擦地，而陈敏狡辩自己当时优游自得。说明陈敏得手后极度作贼心虚、狂奔藏赃！'
      }
    },
    butler: {
      c1: {
        en: '[Paradox] Visitor Zhou stepped into the kitchen at 23:15 and testified there was no butler. Major boilings on stove but Butler Li was missing. Stifling 7-minute absence window unlocked under gas boiling camouflage.',
        ko: '[동선 모순 문서] 방문인 주해평이 23:15 주방에 갔을 때 솥이 펄펄 끓을 뿐 이국동 집사는 가담 탈영 상태였다고 실토했습니다. 가스 불막으로 소음을 은닉하여 금고를 누빈 7분 공범 시간의 핵심 상징입니다.',
        zh: '【证词矛盾】访客周海平证实23:15进入后厨空无一人，水沸漫干，而管家李国栋妄称在该10分钟内不曾离厨。说明管家在利用开水鸣叫干扰作噪在23:15趁空窃锁！'
      },
      c2: {
        en: '[Dynamic Clue] Maid Chen Min confirmed only the butler managed the duplicate safe keys tucked deep inside the kitchen tea container. Butler Li\'s 7-minute absence under the cover of dry-boiling was the exact theft window.',
        ko: '[동선 모순 문서] 하녀 진민은 보조 열쇠가 오직 집사만이 통제하는 주방 홍차상자 밑에 수장되어 있었다고 증명했습니다. 집사 이국동이 물 끓인다는 수단으로 만든 7분의 공백은 열쇠로 보석을 편취했던 영락없는 사찰 정당 행위입니다.',
        zh: '【疑点案卷】佣人陈敏爆出备用钥匙被严格锁存藏匿厨房红茶铁罐内，专属管家一人管控。管家伪造并故意放空在23:15出去，实质正是趁大厅拉闸摸黑取钥匙窃钻的绝密漏洞！'
      }
    },
    visitor: {
      c1: {
        en: '[Paradox] At 23:15, Visitor Zhou claimed he drank soda and joked with Butler Li in the kitchen. Butler Li testified he did not manage any guest or tea meetings, proving Zhou\'s alibi is a self-made bubble.',
        ko: '[동선 모순 문서] 방문인 주해평은 23:15 주방에서 집사와 수다를 털었다 진술하나, 집사는 23:15 정시에는 손님 면접이나 음료 교부를 행하지 않았다고 부서 단정했습니다. 주해평의 갱생 금고 탈피용 위조입니다.',
        zh: '【证词矛盾】访客周海平声称23:15去厨房找管家拿气泡水点调问，而管家李国栋断定23:15没有任何客人到厨房。戮穿了周海平编撰不在场、潜入行窃的真相。'
      },
      c2: {
        en: '[Physical Clue] Maid Chen Min testified that at 23:15 she saw Visitor Zhou walking past corridor in immense rush with his hands clenched tight inside coat pockets, looking extremely flustered. Unmasked his active burglary phase.',
        ko: '[동선 모순 문서] 하녀 진민이 23:15에 땀 젖은 손을 코트에 잔뜩 숨긴 채 거실 복도를 서성이며 피하는 주해평의 경련 직감을 채점 증언했습니다. 차를 가지러 왔다는 비지니스 거동을 무력화시키는 도주 지문입니다.',
        zh: '【疑点案卷】佣人陈敏23:15直击周海平形色仓皇、双拳攥藏、快步踱回阁楼。对应其包装谎称的去开茶，刺中真相。'
      }
    },
    niece: {
      c1: {
        en: '[Paradox] At 23:15, Dr. Lu climbed up and confirmed her door was ajar, chamber empty, and golden lamp shattered. Niece Han\'s "lying peaceful wearing heavy ANC headphones on bed" was a pure scam.',
        ko: '[동선 모순 문서] 주치의 육호연은 23:15에 이층 주택을 밟았을 때 한우흔의 방문이 활짝 구겨진 채 사람이 한 명도 부재했고 가구 전등이 전복된 흔적을 감정했습니다. 무흠 조카가 아래로 내려갔음을 가리키는 잉여 단정입니다.',
        zh: '【证词矛盾】医生陆浩然证实23:15登楼二层，看到韩雨欣卧室虚掩、冷衾空无一人且台灯侧歪翻倒；而韩雨欣狡辩当时自己一整晚平和戴大耳麦听歌、毫无外出。戳穿其盗宝狂奔碰翻灯具的痕迹。'
      },
      c2: {
        en: '[Footsteps Paradox] Maid Chen Min confirmed that at 23:21 a panicked female slippers ran upstairs instantly right after power out. Niece Han Yuxin returned and shattered her desk light in complete blackout.',
        ko: '[동선 모순 문서] 하녀 진민이 23:21 당시, 이층 여자용 귀향 계단 걸음을 가청했습니다. 한 양이 복강 하역을 취하고 도주 복귀하다가 사각 조명등을 충격해 전도시킨 철제 인장입니다.',
        zh: '【疑点案卷】佣人陈敏直陈23:21听到惊惶轻便的女拖鞋踏阶奔登二楼，对应其二楼闺房被打碎的贵重台灯，刺穿了韩雨欣整夜未出卧室的不在场谎报！'
      }
    },
    doctor: {
      c1: {
        en: '[Paradox] Dr. Lu claimed he dispenser pharmaceuticals in light at 23:15. Butler Li checked B1 and verified the main breaker was switched down under global power outage. Extreme dark made drug checking a lie.',
        ko: '[동선 모순 문서] 의사는 23:15에 지하 와인방에서 치료 약제를 세정 계수했다 했으나, 집사 증언에 의해 당시는 지하 전력 바가 강제 차절된 흑조 암실 상태로 미세 글자들을 정간 검침할 수 없었음이 확정된 허구 공구입니다.',
        zh: '【证词矛盾】私人医生陆浩然口称23:15在地下配配精密外文心脏药水，而管家李国栋目击23:15地下配电主闸被手工下拉关闭，地下伸手不见五指。断言医生借故断电摸瞎并上楼行窃！'
      },
      c2: {
        en: '[Kit Clue] Maid Chen Min testified she saw Dr. Lu holding a white emergency kit leaving the parlor area in rush at 23:14 under major blackout panic, contradicting B1 cellar alibi.',
        ko: '[동선 모순 문서] 여종 진민이 23:14 당시 거실 현장에서 튀어나와 지하 계단을 타고 전력 이탈을 행하던 육호연 주치의의 미터 백색 도구를 감지했습니다. 와인창고 알리바이를 무효로 만드는 금고 탈취의 유일 시간입니다.',
        zh: '【疑点案卷】女佣陈敏23:14目睹私人医生陆浩然攥紧一白色急救鼓袋跑出客厅、潜入地下配药。恰好对应了其二叔保险锁由于磁锁电感被物理急断时间，证明其盗窃经过！'
      }
    }
  };

  return data[culpritId]?.[clueId]?.[lang] || '';
};

export const getLocalizedHotspotNote = (hotspotId: string, lang: Language): string => {
  if (hotspotId === 'ki-faucet') {
    return {
      zh: '【生铁水龙头23:15声音侧证】根据水龙头冷凝汽、防滑丝摩擦及积水深度，在23:15案发当刻，厨房水龙头曾被完全旋开释放出持续的喷薄激流声。这强烈的环境喧鸣音犹如听觉隔障，完美遮蔽了同时走廊上嫌犯惊慌仓皇逃回房间的「沉重脚步声」，为该脚步声提供了完美的物理环境侧证！',
      en: '[Water Tap 23:15 Acoustic Evidence] Based on metal temperature and thread wear, the kitchen faucet was wide-open at 23:15, generating heavy rushing water sound. This intense background racket perfectly masked the panicked, heavy footsteps of the suspect hurrying back up the corridor, providing a critical acoustic alibi debunk!',
      ko: '[수도꼭지 23:15 교차 음파 단서] 수조 내부 응기 및 밸브 나선 톳니 마모 상황으로 대조해 23:15 정점 무렵 주방 수돗문이 완전 최대로 해방되어 굉음을 내지른 음파 간극이 입증되었습니다. 이 세척수 격리는 거실을 기습해 범죄를 저지르고 복도를 뛰어올라가며 낸 치명적 발걸음 소리를 완벽히 은폐해주는 물리 음음 방벽 역할을 수행했습니다!'
    }[lang];
  }

  if (hotspotId === 'ki-sink') {
    return {
      zh: '不锈钢滴水洗水槽柜搜查发现：【核心藏赃处】不锈钢水喉发出滴水响。底下拉门敞着半格。无数的脏拖把、陈年发酸发黄抹布叠在一起。这里是整起大案极顶的藏真首饰‘夜鸦之眼’的物理窝巢！只有通过23:15时空拆穿并审得犯人防线溃散忏悔后，你才能把手扣入最底部抠拿真金吊缀！',
      en: 'Metal Drip Sink Cabinet discovered via searching: 【Case Vault】The leaky faucet drips slowly. The lower cabinet door is half open, revealing wet floor sponges and old rags. This is the ultimate physical vault for the stolen emerald pendant! Only after cross-examining suspects about 23:15 and breaking their psychological defense can you retrieve the pendant from the bottom!',
      ko: '식기 세척수조 문 뒤편 수색 발견 단서: 【장물 보관 장소】세척 수조 뒤편을 면밀히 열어본 결과, 묵은 걸레 뭉치와 세척제 잔해가 침전되어 있습니다. 이곳이 절취된 비정의 에메랄드 펜던트가 임시 가매장된 실제 은닉처입니다. 대화로 23:15의 전조를 가려내어 용의자의 방어벽을 무너뜨려 자백을 얻기 전까지는 회수할 수 없습니다.'
    }[lang];
  }

  const evs = getLocalizedPhysicalEvidence(lang);
  const ev = evs.find(e => e.id === hotspotId);
  if (!ev) return '';

  const suffix = {
    zh: ' [玩家通过现场搜索获取铁证]',
    en: ' [Evidence retrieved by searching environment]',
    ko: ' [수사관 환경 탐사를 통한 인장 확립]'
  }[lang];

  return `${ev.name}：${ev.description.slice(0, 150)}...${suffix}`;
};

