import { useState, FormEvent } from 'react';
import { BookOpen, Table, Edit3, Trash2, ShieldAlert } from 'lucide-react';
import { NpcId, TimelineRecord, NoteItem, Language } from '../types';
import { playWritingSound, playPaperFlipSound } from '../utils/audio';
import { t, getLocalizedNpcDataList, getLocalizedPresetClues, getLocalizedClueNote, getLocalizedHotspotNote } from '../utils/i18n';

interface DetectiveNotebookProps {
  customNotes: NoteItem[];
  onAddNote: (npcId: NpcId, noteText: string) => void;
  onDeleteNote: (id: string) => void;
  unlockedClues: string[];
  activeNpcId: NpcId | null;
  culpritId: NpcId;
  language: Language;
}

const getLocalizedCrossReference = (culpritId: NpcId, lang: Language) => {
  if (culpritId === 'maid') {
    return (
      <>
        <li className="flex items-start space-x-1.5">
          <span className="text-emerald-400 font-bold mt-0.5">✓</span>
          <span>
            {lang === 'en' && <><strong>Butler Li & Visitor Zhou cross-lock:</strong> Both agreed they met in the kitchen at [23:15], overlapping facts.</>}
            {lang === 'ko' && <><strong>집사와 손님의 교차 검증:</strong> 두 사람 모두 [23:15]경 [주방]에서 상호 조우를 증언하여 사실이 일치합니다.</>}
            {lang === 'zh' && <><strong>管家李国栋与访客周海平互锁：</strong>二人均核对在【23:15】于【厨房】遭遇相遇，事实重合。</>}
          </span>
        </li>
        <li className="flex items-start space-x-1.5">
          <span className="text-rose-400 font-bold mt-0.5">✗</span>
          <span>
            {lang === 'en' && <><strong>Maid Chen's fabricated corridor presence:</strong> Claims she was alone in the corridor at 23:15. But Butler and Visitor had to cross that corridor to meet in the kitchen, proving a fatal spatial and temporal contradiction!</>}
            {lang === 'ko' && <><strong>하녀 진민의 거짓 복도 상주:</strong> 23:15경 복도 소탕에 전념했다고 하나, 주방 식기대로 향하던 이들이 이 복도를 관통했기에 거짓임이 판별되었습니다!</>}
            {lang === 'zh' && <><strong>佣人陈敏虚构走廊在场：</strong>声称23:15一人在走廊清洁，且无任何行人。但管家和客人必须经过她所在的该走廊去厨房，这是绝对的时空无交集矛盾！</>}
          </span>
        </li>
      </>
    );
  } else if (culpritId === 'butler') {
    return (
      <>
        <li className="flex items-start space-x-1.5">
          <span className="text-emerald-400 font-bold mt-0.5">✓</span>
          <span>
            {lang === 'en' && <><strong>Kettle boil verified by Visitor:</strong> Zhou verified that when he entered the kitchen at [23:15], the kettle was dry-boiling with nobody tending to it.</>}
            {lang === 'ko' && <><strong>가스 버너 주전자 방치 관측:</strong> 주해평이 [23:15]경 침입했을 시 가스렌지 주전자는 극렬 가열 중이었고 집사는 보이지 않았음을 검증했습니다.</>}
            {lang === 'zh' && <><strong>访客直击开水空烧：</strong>周海平证实【23:15】推门进厨，里面水壶狂滚，而管家李国栋连半个人影都没有（真实无误）。</>}
          </span>
        </li>
        <li className="flex items-start space-x-1.5">
          <span className="text-rose-400 font-bold mt-0.5">✗</span>
          <span>
            {lang === 'en' && <><strong>Butler's fake accompaniment:</strong> Butler claims he was brewing tea for Zhou at 23:15, which is easily dismantled by the Visitor's testimony.</>}
            {lang === 'ko' && <><strong>집사의 허위 접대 알리바이:</strong> 23:15경 줄곧 주해평 씨를 응대하고 차를 대접했다고 하나 손님의 증언에 의해 허위임이 폭로되었습니다!</>}
            {lang === 'zh' && <><strong>管家凭空编造陪同：</strong>声称自己23:15寸步不离给周到气泡水，在客串核实下不攻自破！</>}
          </span>
        </li>
      </>
    );
  } else if (culpritId === 'visitor') {
    return (
      <>
        <li className="flex items-start space-x-1.5">
          <span className="text-emerald-400 font-bold mt-0.5">✓</span>
          <span>
            {lang === 'en' && <><strong>Butler's 16 years of service integrity:</strong> Confirmed he was brewing chamomile tea alone between 23:12 and 23:25, with absolutely no visitors entering.</>}
            {lang === 'ko' && <><strong>우수한 이 노집사의 명예:</strong> 23:12 ~ 23:25 사이 주방을 방문한 외래객은 전혀 관측되지 않았다는 사실을 입증합니다.</>}
            {lang === 'zh' && <><strong>老管家16年清誉作保：</strong>证实自己在23:12至23:25里独坐冲洋甘菊，在此10分钟绝无访客或第二人进来取苏打水。</>}
          </span>
        </li>
        <li className="flex items-start space-x-1.5">
          <span className="text-rose-400 font-bold mt-0.5">✗</span>
          <span>
            {lang === 'en' && <><strong>Visitor's fabricated reception scenario:</strong> Zhou falsely claimed he got water from the kitchen to hide his safe-prying. Directly debunked by the Butler!</>}
            {lang === 'ko' && <><strong>방문자의 날조 조우극:</strong> 주해평이 자금 도난 시각 주방을 방문하여 의지했다고 칭했으나 집사의 엄정한 대조 진술로 격하되었습니다!</>}
            {lang === 'zh' && <><strong>客人谎造接待场景：</strong>周海平为作案买借口谎称去厨房取水闲话，直接被管家彻底打假解构！</>}
          </span>
        </li>
      </>
    );
  } else if (culpritId === 'niece') {
    return (
      <>
        <li className="flex items-start space-x-1.5">
          <span className="text-emerald-400 font-bold mt-0.5">✓</span>
          <span>
            {lang === 'en' && <><strong>Doctor's bedroom observation:</strong> Dr. Lu verified that when he went to 2F at [23:15], Ms. Han's bedroom was empty and the gold lamp lay smashed on the floor.</>}
            {lang === 'ko' && <><strong>주치의 육호연의 이층 목격:</strong> 23:15경 주치의는 2층 왕진 시 조카 처소의 문이 개방되어 비었고 스탠드가 깨져 누워 있었음을 직시전조했습니다.</>}
            {lang === 'zh' && <><strong>医生上楼亲口直击：</strong>医生陆浩然证实【23:15】拿针过路其房，其卧室空荡无人，高仿台灯倒摔在尘埃中（真实状态）。</>}
          </span>
        </li>
        <li className="flex items-start space-x-1.5">
          <span className="text-rose-400 font-bold mt-0.5">✗</span>
          <span>
            {lang === 'en' && <><strong>Niece's fake quiet bedroom sleep:</strong> Claims she was sleeping with noise-canceling headphones. Dr. Lu's eye-witness accounts shatter her alibi!</>}
            {lang === 'ko' && <><strong>조카의 소음 방비 침대 환영:</strong> 이어폰을 낀 채 꿈속이었다고 한 시간선은 2층 부재 기록과 대조해 볼 때 기각됩니다!</>}
            {lang === 'zh' && <><strong>侄女戴隔音耳机假象：</strong>自称一整晚绝对卧床，医生直击无人在房拆穿了她潜下一楼行窃后慌乱折回砸烂台灯的行迹！</>}
          </span>
        </li>
      </>
    );
  } else {
    return (
      <>
        <li className="flex items-start space-x-1.5">
          <span className="text-emerald-400 font-bold mt-0.5">✓</span>
          <span>
            {lang === 'en' && <><strong>Maid's hallway eyewitness:</strong> Chen Min verified that around [23:14], she saw Dr. Lu slinking out of the mahogany cabinet lounge with bulged coat pockets.</>}
            {lang === 'ko' && <><strong>복도 통로 관측 진술:</strong> 하녀 진민은 23:14 복도 수납장 주변에서 육 의사가 불룩한 주머니 상태로 서행해 이탈했음을 확인했습니다.</>}
            {lang === 'zh' && <><strong>女佣廊道一目了然：</strong>陈敏指出【23:14】看到陆医生捏着有些鼓胀的药大白褂从一楼撬动的红木大柜大厅角潜行出来（真实起赃）。</>}
          </span>
        </li>
        <li className="flex items-start space-x-1.5">
          <span className="text-rose-400 font-bold mt-0.5">✗</span>
          <span>
            {lang === 'en' && <><strong>Doctor's cellar sorting myth:</strong> Claims he was locked in the B1 cellar, but Butler proved the wine cellar main power was cut off entirely, leaving B1 in pitch-black silence!</>}
            {lang === 'ko' && <><strong>닥터의 지하실 정온실 작업론:</strong> 지하실에 락업되어 있었다고 자칭했으나 배전 전원이 하강되어 전면 정전 및 암막인 채 방치되었음이 반박되었습니다!</>}
            {lang === 'zh' && <><strong>医生地下核分类神话：</strong>自辩23:15反锁在地下。但老管家下探发现地下根本没有打闸过电，一片死寂漆黑！</>}
          </span>
        </li>
      </>
    );
  }
};

export default function DetectiveNotebook({
  customNotes,
  onAddNote,
  onDeleteNote,
  unlockedClues,
  activeNpcId,
  culpritId,
  language
}: DetectiveNotebookProps) {
  const [activeTab, setActiveTab ] = useState<'timeline' | 'clues' | 'notes'>('timeline');
  const [newNoteText, setNewNoteText] = useState('');
  const [noteNpc, setNoteNpc] = useState<NpcId>('maid');

  const times = ['23:10', '23:15', '23:20'];
  const activeContradictions = getLocalizedPresetClues(language);
  const localizedNpcList = getLocalizedNpcDataList(language, culpritId);

  const getTimelineCell = (npcId: NpcId, time: string) => {
    const npc = localizedNpcList.find(n => n.id === npcId);
    if (!npc) return null;
    return npc.timeline.find(t => t.time === time);
  };

  const handleAddCustomNote = (e: FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    playWritingSound();
    onAddNote(noteNpc, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div id="detective-notebook" className="flex flex-col h-full bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl">
      {/* Notebook Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-rose-500" />
          <h2 className="text-sm font-semibold tracking-wider uppercase text-white font-sans">
            {t('notebookTitle', language)}
          </h2>
        </div>
        <div className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 font-mono">
          {t('notebookTimeLabel', language)}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-800 bg-slate-950/50">
        <button
          id="tab-btn-timeline"
          onClick={() => {
            setActiveTab('timeline');
            playPaperFlipSound();
          }}
          className={`flex-1 py-3 text-[11px] font-semibold tracking-wide flex items-center justify-center space-x-1.5 transition-all outline-none cursor-pointer ${
            activeTab === 'timeline'
              ? 'text-rose-500 border-b-2 border-rose-500 bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>{t('tabTimeline', language)}</span>
        </button>
        <button
          id="tab-btn-clues"
          onClick={() => {
            setActiveTab('clues');
            playPaperFlipSound();
          }}
          className={`flex-1 py-3 text-[11px] font-semibold tracking-wide flex items-center justify-center space-x-1.5 transition-all outline-none cursor-pointer ${
            activeTab === 'clues'
              ? 'text-rose-500 border-b-2 border-rose-500 bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{t('tabClues', language)} ({unlockedClues.length})</span>
        </button>
        <button
          id="tab-btn-notes"
          onClick={() => {
            setActiveTab('notes');
            playPaperFlipSound();
          }}
          className={`flex-1 py-3 text-[11px] font-semibold tracking-wide flex items-center justify-center space-x-1.5 transition-all outline-none cursor-pointer ${
            activeTab === 'notes'
              ? 'text-rose-500 border-b-2 border-rose-500 bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>{t('tabNotes', language)} ({customNotes.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* TAB 1: SPREADSHEET TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4 animate-fade-in" id="timeline-sheet-view">
            <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/65 p-2.5 rounded border border-slate-800">
              💡 {t('tab1Tip', language)}
            </div>

            {/* Matrix Sheet Table with Horizontal Scroll support */}
            <div className="overflow-x-auto border border-slate-700 rounded-lg bg-slate-950/20">
              <table className="min-w-[640px] w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-300 font-mono border-b border-slate-700">
                    <th className="p-3 border-r border-slate-800 text-center w-16">{t('tableTimeHeader', language)}</th>
                    {localizedNpcList.map((npc) => {
                      const isTarget = npc.id === culpritId;
                      let colorClass = "text-rose-400";
                      if (npc.id === 'maid') colorClass = "text-amber-400";
                      else if (npc.id === 'visitor') colorClass = "text-cyan-400";
                      else if (npc.id === 'niece') colorClass = "text-pink-400";
                      else if (npc.id === 'doctor') colorClass = "text-indigo-400";
                      
                      return (
                        <th key={npc.id} className={`p-3 border-r border-slate-800 font-bold ${colorClass}`}>
                          {npc.roleName} - {npc.name} {isTarget ? "★" : ""}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {times.map((time, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      {/* TIME COLUMN */}
                      <td className="p-3 font-mono font-bold text-center border-r border-slate-800 text-slate-300 bg-slate-950/40">
                        {time}
                      </td>
                      
                      {/* NPC COLUMNS */}
                      {localizedNpcList.map((npc) => {
                        const cell = getTimelineCell(npc.id, time);
                        const isContradictionActive = time === '23:15' && npc.id === culpritId;
                        return (
                          <td key={npc.id} className={`p-3 border-r border-slate-800 align-top leading-normal transition-all ${
                            isContradictionActive ? 'bg-rose-950/20' : ''
                          }`}>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mb-1 ${
                              isContradictionActive 
                                ? 'bg-rose-500 text-white font-bold' 
                                : npc.id === 'butler' 
                                ? 'bg-emerald-950/60 text-emerald-400' 
                                : npc.id === 'visitor' 
                                ? 'bg-sky-950/60 text-sky-400'
                                : npc.id === 'niece'
                                ? 'bg-pink-950/60 text-pink-400'
                                : npc.id === 'doctor'
                                ? 'bg-indigo-950/60 text-indigo-400'
                                : 'bg-amber-950/60 text-amber-400'
                            }`}>
                              📍 {cell?.location || (language === 'en' ? 'Unknown' : language === 'ko' ? '미정' : '未知')}
                            </span>
                            <p className={`font-sans text-[11px] ${
                              isContradictionActive ? 'text-amber-200 font-medium' : 'text-slate-300 font-light'
                            }`}>{cell?.action || (language === 'en' ? 'Not mentioned' : language === 'ko' ? '기록 없음' : '未涉及')}</p>
                            {isContradictionActive && (
                              <div className="mt-1 text-[9px] text-yellow-500 font-semibold flex items-center space-x-1 animate-pulse bg-yellow-950/30 p-1 rounded">
                                <span>{t('tableLyingAlert', language)}</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Cross Reference Check */}
            <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-850 space-y-2">
              <span className="text-[11px] font-bold text-rose-500 tracking-wider uppercase block">
                {t('matrixHeader', language)}
              </span>
              <ul className="text-xs text-slate-300 space-y-2.5 font-sans font-light">
                {getLocalizedCrossReference(culpritId, language)}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: DETECTED CLUES / CONTRADICTIONS */}
        {activeTab === 'clues' && (
          <div className="space-y-3.5 animate-fade-in" id="detected-clues-view">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {t('notebookCluesHeader', language)}
            </h3>

            {activeContradictions.filter(clue => unlockedClues.includes(clue.id)).map(clue => {
              const isUnlocked = true;

              return (
                <div
                  key={clue.id}
                  className="p-4 rounded-lg border transition-all duration-300 bg-rose-950/20 border-rose-800/60 shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-white">
                      {clue.title}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-rose-900/60 text-rose-300">
                      {language === 'en' ? '★ Solved' : language === 'ko' ? '★ 해석정비' : '★ 已解析'}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans font-light">
                    {clue.description}
                  </p>

                  <div className="mt-3 text-[10px] text-slate-400 bg-slate-950/60 px-2 py-1 rounded font-sans border border-slate-800">
                    {t('cluesSource', language)} {
                      clue.type === 'evidence'
                        ? (language === 'en' ? 'Physical Clue / Item' : language === 'ko' ? '현장 물증 단서' : '现场实物遗存')
                        : clue.type === 'testimony'
                        ? (language === 'en' ? 'Suspect Timeline / Statement' : language === 'ko' ? '용의자 구두 진술' : '嫌疑人涉案涉时口供')
                        : (language === 'en' ? 'Logical Deduction' : language === 'ko' ? '논리 인과 추론' : '逻辑链推导成果')
                    }
                  </div>
                </div>
              );
            })}

            {unlockedClues.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500 font-sans italic border border-dashed border-slate-800 rounded">
                {t('noCluesUnlocked', language)}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOM SCRATCHPAD NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-4 animate-fade-in" id="custom-scratchpad-view">
            {/* Note Writing Form */}
            <form onSubmit={handleAddCustomNote} className="space-y-2.5 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              <label className="text-[11px] font-bold text-slate-400 block uppercase">
                {t('scratchpadAddTitle', language)}
              </label>

              <div className="flex space-x-2">
                <select
                  value={noteNpc}
                  onChange={(e) => setNoteNpc(e.target.value as NpcId)}
                  className="bg-slate-900 text-slate-200 text-xs border border-slate-700 rounded px-2 py-1.5 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="butler">{language === 'en' ? 'Butler Li' : language === 'ko' ? '집사 이국동' : '李国栋 (管家)'}</option>
                  <option value="maid">{language === 'en' ? 'Maid Chen' : language === 'ko' ? '하녀 진민' : '陈敏 (佣人)'}</option>
                  <option value="visitor">{language === 'en' ? 'Visitor Zhou' : language === 'ko' ? '손님 주해평' : '周海平 (访客)'}</option>
                  <option value="niece">{language === 'en' ? 'Niece Han' : language === 'ko' ? '조카 한우흔' : '韩雨欣 (侄女)'}</option>
                  <option value="doctor">{language === 'en' ? 'Doctor Lu' : language === 'ko' ? '의사 육호연' : '陆浩然 (医生)'}</option>
                </select>

                <span className="text-slate-500 self-center text-xs">{t('scratchpadNpcPrefix', language)}</span>
              </div>

              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder={t('scratchpadAddPlaceholder', language)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-700/80 rounded p-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium p-2 rounded text-xs transition duration-200 cursor-pointer shadow"
              >
                {t('scratchpadSaveBtn', language)}
              </button>
            </form>

            {/* Note List */}
            <div className="space-y-2.5">
              {(() => {
                // Deduplicate customNotes by ID to guarantee unique React keys and stable rendering
                const uniqueNotesMap = new Map<string, typeof customNotes[0]>();
                customNotes.forEach(note => {
                  if (!uniqueNotesMap.has(note.id)) {
                    uniqueNotesMap.set(note.id, note);
                  }
                });
                const uniqueNotes = Array.from(uniqueNotesMap.values());

                return (
                  <>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {t('scratchpadHeader', language)} ({uniqueNotes.length})
                    </h4>

                    {uniqueNotes.map(note => {
                      const npc = localizedNpcList.find(n => n.id === note.npcId);
                      return (
                        <div key={note.id} className="relative bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1.5 hover:bg-slate-900/40 transition">
                          <button
                            type="button"
                            onClick={() => {
                              playPaperFlipSound();
                              onDeleteNote(note.id);
                            }}
                            className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition cursor-pointer"
                            title={t('scratchpadDelete', language)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center space-x-1.5">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              note.npcId === 'butler'
                                ? 'bg-emerald-950/85 text-emerald-400'
                                : note.npcId === 'maid'
                                ? 'bg-amber-950/85 text-amber-400'
                                : note.npcId === 'visitor'
                                ? 'bg-sky-950/85 text-sky-400'
                                : note.npcId === 'niece'
                                ? 'bg-pink-950/85 text-pink-400'
                                : 'bg-indigo-950/85 text-indigo-400'
                            }`}>
                              {npc?.roleName} · {npc?.name}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {note.time}
                            </span>
                          </div>

                          <p className="text-xs text-slate-200 font-sans font-light pr-6 leading-relaxed whitespace-pre-wrap">
                            {note.clueId 
                              ? getLocalizedClueNote(note.clueId, note.npcId, language, culpritId) 
                              : note.hotspotId 
                              ? getLocalizedHotspotNote(note.hotspotId, language) 
                              : note.content}
                          </p>
                        </div>
                      );
                    })}

                    {uniqueNotes.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-500 italic font-sans border border-dashed border-slate-800 rounded">
                        {t('scratchpadEmpty', language)}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
