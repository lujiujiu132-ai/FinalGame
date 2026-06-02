import { useState, FormEvent } from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { NpcId } from '../types';
import { Language, t, getLocalizedNpcDataList } from '../utils/i18n';

interface ConcludeScreenProps {
  unlockedClues: string[];
  isPendantFound: boolean;
  onConfirmAccusation: (culprit: NpcId, reason: string) => void;
  onCancel: () => void;
  culpritId: NpcId;
  language: Language;
  emotionStates?: Record<NpcId, number> & { isOutburst?: Record<NpcId, boolean> };
}

export default function ConcludeScreen({
  isPendantFound,
  onConfirmAccusation,
  onCancel,
  culpritId,
  language,
  emotionStates
}: ConcludeScreenProps) {
  const [selectedSuspect, setSelectedSuspect] = useState<NpcId | null>(null);
  const [accusationReason, setAccusationReason] = useState('');

  const npcList = getLocalizedNpcDataList(language, culpritId);

  // Generate dynamic evidence checklist choices mapped directly to each potential culprit
  const getDynamicEvidenceChecklist = (): { id: string; label: string }[] => {
    switch (culpritId) {
      case 'maid':
        return {
          zh: [
            { id: 'ev1', label: '逻辑论证：佣人在23:15声称没有看到任何人路过，而访客和管家均证实由于泡茶事情路过了唯一的走廊。此走廊不存在真空断层，其供词有绝对轨迹说谎！' },
            { id: 'ev2', label: '物证起赃：在厨房清洗水槽橱柜底板堆积的废旧拖把、乱长旧抹布堆下，成功起出了藏匿折叠的【夜鸦之眼古董翡翠吊坠】。' },
            { id: 'ev3', label: '动作呼应：访客周海平证实他在23:21离开客厅找水时，在隔断板附近听到非常惊忙、一拐一踏急促潜逃的小跑步鞋底声，指向做贼心虚。' }
          ],
          en: [
            { id: 'ev1', label: 'Logical loophole: The maid swore that at 23:15, she saw no one. However, both the Butler and Visitor Zhou verified they crossed that exact corridor. Her alibi collapses completely!' },
            { id: 'ev2', label: 'Physical seizure: The precious emerald pendant was successfully found and recovered beneath the pile of wet floor towels and dirty mops under the kitchen water sink.' },
            { id: 'ev3', label: 'Fleeing action: Witness Zhou confirmed hearing a panicky person running upstairs with messy slipper tapping and shuffling at exactly 23:21.' }
          ],
          ko: [
            { id: 'ev1', label: '논리적 모순: 하녀는 23:15에 조용히 홀로 있었다고 하나, 집사와 주씨의 일치된 복도 조우 증언은 이를 수비 압박합니다. 그녀의 복도 공실 주장은 허위입니다!' },
            { id: 'ev2', label: '장물 압수 대첩: 주방 가마 수조 아래 습하게 보관되어 있던 걸레 더미 속에서 도난당한 밤까마귀의 눈 에메랄드 펜던트를 발굴 확보했습니다.' },
            { id: 'ev3', label: '황급한 도주음: 내객 주해평이 23:21 수소 도도 타종 알람 전야에, 난삽한 발걸음과 함께 2층으로 헐레벌떡 뛰어가던 다습 신발 소리를 청각 포획했습니다.' }
          ]
        }[language];
      case 'butler':
        return {
          zh: [
            { id: 'ev1', label: '逻辑论证：管家李国栋主张自己23:15在厨房寸步不防冲泡宁茶，但客人周先生指控进入后厨时灶门开水严重滚溢焦灼、管家联个鬼影都瞧不见，戳穿了其假在场！' },
            { id: 'ev2', label: '物证起赃：在厨房清洗大水箱下深底藏暗处的脏抹布破拖把烂布堆中被翻搜查获了失窃的吊坠实物。' },
            { id: 'ev3', label: '动作呼应：女仆证实唯独管家全权负责也知道后厨密封茶叶罐内收纳的抽屉箱备用金质全锁匙，他具备极速空开在场的行窃用具。' }
          ],
          en: [
            { id: 'ev1', label: 'Logical loophole: The butler swore he was brewing tea at 23:15. But Visitor Zhou witnessed the stove water over-boiling and dry, with the Butler completely absent!' },
            { id: 'ev2', label: 'Physical seizure: The pendant was successfully seized inside the dirty old mops underneath the kitchen sink basin.' },
            { id: 'ev3', label: 'Trigger source: He has exclusive key custody. The spare safe key hidden inside the Earl Grey tea jar was missing, proving he unlocked it with zero broken trace.' }
          ],
          ko: [
            { id: 'ev1', label: '논리적 모순: 집사는 23:15에 주방을 굳게 지키며 차를 끓였다고 하나, 주해평이 갔을 때 가마 버너가 말라 비틀어졌고 집사는 부재중이었습니다.' },
            { id: 'ev2', label: '장물 압수 대첩: 주방 수조 밑창 더러운 밀걸레 더미 바닥 속에서 피고가 몰래 파묻은 오일 실물 펜던트를 수색 발견했습니다.' },
            { id: 'ev3', label: '도구 정전: 집사는 거실 보조 열쇠를 차통에 관리하던 유일 소유주로서 파손 흔적 없이 금고를 개장할 수 있는 유일한 자입니다.' }
          ]
        }[language];
      case 'visitor':
        return {
          zh: [
            { id: 'ev1', label: '逻辑论证：访客周海平狡辩自己23:15前往后厨接老管家的苏打气泡饮聊天。但主理沏茶的李管理赌上十六年声誉发誓这段十多分钟独在、绝无半只人影进入，打假了其虚造在场！' },
            { id: 'ev2', label: '物证起赃：在厨房清洗水池密封底下堆放常备脏拖把和废抹布里，起出了古董原物翡翠链坠。' },
            { id: 'ev3', label: '动作呼应：女仆陈敏证实：23:15在走廊清扫时撞见客人周海平汗如雨下、两手心虚捂在大衣内网飞快踱去厨房，特征精准契合藏匿赃物的举动。' }
          ],
          en: [
            { id: 'ev1', label: 'Logical loophole: Zhou claimed he was chatting with the Butler at 23:15. But the Butler swore on his 16-year career that he was completely alone in the kitchen with no visitors!' },
            { id: 'ev2', label: 'Physical seizure: The original antique emerald pendant was recovered inside the kitchen sink cabinet clutter.' },
            { id: 'ev3', label: 'Covert action: Maid Chen Min witnessed Zhou looking sweating and nervous at 23:15, hiding both hands inside his long coat, sneaking past towards the kitchen corners.' }
          ],
          ko: [
            { id: 'ev1', label: '논리적 모순: 주해평은 23:15에 집사와 주방에서 담소를 나눴다 했으나 맛 차를 준비하던 이국동은 16년 명예를 걸고 아무도 마주치지 않았다고 단정했습니다.' },
            { id: 'ev2', label: '장물 압수 대첩: 주방 전기 수조 싱크대 구석 젖은 잡부 걸레 바닥층에서 펜던트 보물을 안전하게 보관 영득했습니다.' },
            { id: 'ev3', label: '거동 포정: 하녀는 23:15 당시 주해평이 땀을 도배하고 품안에 뭔가를 숨긴 채 비정상적인 행보로 주방으로 밀접 서성이던 양상을 현시 확인했습니다.' }
          ]
        }[language];
      case 'niece':
        return {
          zh: [
            { id: 'ev1', label: '逻辑论证：侄女自称23:15戴着大耳套隔音听重音乐没下楼、台灯是猫弄坏的。但医生直通二楼查看发现其房空旷寂静无人、她声言的不出闺阁被医生双目戳穿！' },
            { id: 'ev2', label: '物证起赃：在厨房水盆不锈钢底台旧杂物废拖把的酸洗堆中找获并固定了起赃翡翠赃证。' },
            { id: 'ev3', label: '动作呼应：女仆听见23:15后楼梯板有慌张抢跑回楼上的死重踩踏。而侄女房内高级台灯翻砸，正是她作案跑回因做贼心慌绊乱摔打翻。' }
          ],
          en: [
            { id: 'ev1', label: 'Logical loophole: The niece said she was listening to ANC headphones on bed at 23:15. However, Dr. Lu checked her 2F bedroom and found it empty and quiet, shattering her alibi!' },
            { id: 'ev2', label: 'Physical seizure: Located and filed the emerald pendant from under the wet scrap mops in the kitchen washing shelf.' },
            { id: 'ev3', label: 'Tragic accident: The broken pink gold desk lamp in her bedroom and her head wig extensions caught inside it confirm she rushed back in pitch black under shock.' }
          ],
          ko: [
            { id: 'ev1', label: '논리적 모순: 조카는 23:15에 헤드폰을 끼고 노래를 들었다 했으나, 2층을 방문한 주치의는 그녀의 방이 텅텅 빈 공실 정경이었음을 정밀 감지했습니다.' },
            { id: 'ev2', label: '장물 압수 대첩: 주방 세척구 아래 거무튀튀한 고물 물걸레 깊은 보자기에서 에메랄드 장물을 확실히 구속 확보하였습니다.' },
            { id: 'ev3', label: '공황 낙착: 그녀의 탁상등이 깨져 있는 건 도둑질 후 귀환할 때 불을 켤 시간이 부족해 긴장과 불안 속에서 넘어뜨렸음을 웅변합니다.' }
          ]
        }[language];
      case 'doctor':
        return {
          zh: [
            { id: 'ev1', label: '逻辑论证：私人医生辩白23:15将地下铁门倒死清分类主人的处方丸。但管家下去查看目见地下配电总闸熄闭、窖门纯黑、根本不曾拉闸有人，戳穿了在场神话。' },
            { id: 'ev2', label: '物证起赃：在厨房清洗水龙头最底部堆装的抹布旧物中起获了原装的吊坠翡翠，链金完整。' },
            { id: 'ev3', label: '动作呼应：做工的女佣陈敏在23:14亲眼对立目睹陆医生捏着装满重料大医疗大褂提包，神带严冷戒备地从大厅柜暗格处偷退折回地下。' }
          ],
          en: [
            { id: 'ev1', label: 'Logical loophole: The physician claims he was mixing medication in B1 Cellar under safe light at 23:15. But Butler saw the breaker was pulled low, with B1 in absolute pitch blackness!' },
            { id: 'ev2', label: 'Physical seizure: The intact gold emerald pendant was recovered from underneath the kitchen washroom cabinet mops.' },
            { id: 'ev3', label: 'Sleeve stain: The wet washbasin detergent mark on Dr. Lu\'s coat elbow matches the kitchen sink, showing he reached deep down under the sink to stash the stolen item.' }
          ],
          ko: [
            { id: 'ev1', label: '논리적 모순: 육 의사는 23:15에 지하 불빛 아래서 조제했다고 주장하나, 집사가 확인했을 때 누전 차단기가 낙하되어 지하 일대가 암전 상태였습니다.' },
            { id: 'ev2', label: '장물 압수 대첩: 주방 하수구 밸브 아래 배치된 소형 잡걸레들 속에서 밤까마귀의 눈을 안전 기소 증거품으로 적출했습니다.' },
            { id: 'ev3', label: '소매 흔적: 그의 가운 소매에 묻은 세제 세척액 물얼룩은 주방 수조 바닥까지 손을 깊게 들이밀어 장물을 숨기려 했음을 가리킵니다.' }
          ]
        }[language];
      default:
        return [
          { id: 'ev1', label: '逻辑论证：犯人具有极大的时空轨迹矛盾漏洞，在 23:15 存在致命说谎！' },
          { id: 'ev2', label: '物证起赃：在厨房水槽清洗底柜下旧拖把废抹布堆深处起出了被藏匿翡翠吊坠。' },
          { id: 'ev3', label: '情绪突破：盘问中凶手的情绪在击败其心理防线后面色惨白地交代交代了犯罪动因。' }
        ];
    }
  };

  const evidenceChecklist = getDynamicEvidenceChecklist();

  const handleSubmitAccusation = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSuspect) return;
    onConfirmAccusation(selectedSuspect, accusationReason);
  };

  const getSuspectRoleText = (npcId: NpcId) => {
    const npc = npcList.find(n => n.id === npcId);
    return npc ? `${npc.roleName} ${npc.name}` : npcId;
  };

  const warningLabel = {
    zh: '审判宣读必读须知：',
    en: 'Trial Verdict Indictment Directives:',
    ko: '재판 선고 시 필수 확인 사항:'
  }[language];

  const warningContent = {
    zh: (
      <>
        1. 错误的嫌犯指控将宣告败诉（例如将无罪证人投进监牢，真凶会逍遥法外，你的侦探工牌将被吊销）；<br />
        2. 即使指控了正确的嫌犯，如果你<span className="text-rose-350 font-bold underline">未曾在厨房搜获关键物证“夜鸦之眼吊坠”</span>，对方会凭借警方“证据和物证不合”当堂无罪释放，导致指控因物证匮乏失败。请确保点击前去厨房起获挂饰！
      </>
    ),
    en: (
      <>
        1. Accusing the wrong suspect triggers immediate trial loss (innocent locked up, true thief flees, license revoked).<br />
        2. Even with the right name, if you <span className="text-rose-350 font-bold underline">have not physically grabbed the emerald pendant from the kitchen sink yet</span>, the defense lawyer will get them bailed out due to lack of material corpus delicti! Please retrieve it first!
      </>
    ),
    ko: (
      <>
        1. 그릇된 피고인 지목 시 즉각 패배 처결됩니다. (진범이 도망치며 수사관 평판 박탈).<br />
        2. 설령 올바른 용의자를 찾았다 하더라도, <span className="text-rose-350 font-bold underline">주방 싱크대 밑에서 에메랄드 펜던트를 아직 확보 완료하지 않은 상태라면</span>, 사법 물증 흠결로 보석 석방 처결되어 기소가 무너집니다. 주방에서 장물을 꼭 구속 보관해놓으십시오!
      </>
    )
  }[language];

  const step1Label = {
    zh: '第一步：选择指控的涉案案犯 (五人中选一)',
    en: 'Step 1: Select the main suspect (Chose 1 of 5)',
    ko: '1단계: 주범으로 지목할 피고인을 선택하십시오 (5명 중 1명 택)'
  }[language];

  const candidateLabel = {
    zh: '作为候选案犯',
    en: 'Accuse Suspect',
    ko: '용의자로 낙인'
  }[language];

  const defaultAccuseLabel = {
    zh: '指控此嫌犯',
    en: 'Select as Culprit',
    ko: '이 피고선택'
  }[language];

  const step2Label = {
    zh: '第二步：书写严密的起诉证据和口供理由 (或直接点击引入快捷证据库)',
    en: 'Step 2: Compose airtight prosecution warrants (or click fast checklist items below)',
    ko: '2단계: 명확한 범행 정황 및 육하원칙 사법 영장 기수장 작성 (아래 단서 클릭 시 자동 장입)'
  }[language];

  const pendantTrueLabel = {
    zh: '✓ 翡翠物证已在手',
    en: '✓ Pendant Seized in Inventory',
    ko: '✓ 물증 펜던트 확보 완료'
  }[language];

  const pendantFalseLabel = {
    zh: '✕ 未在厨房取搜吊坠物证',
    en: '✕ Pendant missing physically',
    ko: '✕ 주방 내 펜던트 미회수'
  }[language];

  const textareaPlaceholder = {
    zh: '根据目前突出的证言时间断点、搜查到的翡翠物证，在上方描述被指控人的行窃动机和逻辑破斩...',
    en: 'Based on the testimonies collision and the recovered pendant, expound how they slipped and committed theft...',
    ko: '수집한 시간표 모순과 싱크대 장물 정량 구도를 기록하여, 범행 실행 인과 정황을 논의하십시오...'
  }[language];

  const shortcutLabel = {
    zh: '快捷指认证据链 (点击可直接把相关矛盾理由追加进入笔录)：',
    en: 'Syllogism Library (Click to instantly inject arguments into the warrants text):',
    ko: '교차 모순 전서철 데이터 (추적 보관소):'
  }[language];

  return (
    <div id="conclude-screen-container" className="max-w-4xl mx-auto bg-slate-900 border border-slate-700/60 p-5 sm:p-7 rounded-2xl shadow-2xl text-slate-100 flex flex-col justify-between h-auto animate-fade-in font-sans">
      <div className="space-y-5">
        {/* Header */}
        <div className="text-center pb-4 border-b border-slate-800">
          <span className="text-[10px] tracking-widest text-rose-500 font-mono font-bold block uppercase mb-1">
            {t('concludeTitle', language)}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t('concludeTitle', language)}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {t('concludeSubtitle', language)}
          </p>
        </div>

        {/* Warning Badge */}
        <div className="bg-rose-950/20 text-rose-400 border border-rose-800/30 p-3.5 rounded-xl text-xs space-y-1 leading-relaxed">
          <h3 className="font-bold flex items-center space-x-1">
            <span className="text-sm">⚠️</span>
            <span>{warningLabel}</span>
          </h3>
          <p className="font-sans font-light">
            {warningContent}
          </p>
        </div>

        {/* Accused Suspect Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {step1Label}
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {npcList.map(npc => {
              const isSelected = selectedSuspect === npc.id;
              
              let borderClass = isSelected ? 'border-rose-500 bg-rose-950/30 font-semibold' : 'border-slate-800/80 bg-slate-950/60 hover:bg-slate-850 hover:border-slate-700';
              if (isSelected && npc.id === culpritId) {
                borderClass = 'border-rose-500 bg-rose-950/40 font-semibold shadow-inner';
              }

              return (
                <div
                  key={npc.id}
                  onClick={() => setSelectedSuspect(npc.id)}
                  className={`border rounded-xl p-3 cursor-pointer transition flex flex-col items-center justify-center text-center space-y-2.5 h-full ${borderClass}`}
                >
                  {/* Small Avatar Container */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-950 relative border border-slate-700/80 p-0.5">
                    <img
                      src={(emotionStates && emotionStates[npc.id] >= 75 && npc.outburstAvatar) ? npc.outburstAvatar : npc.avatar}
                      alt={npc.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-auto max-w-none mx-auto object-contain filter brightness-100 shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const element = e.currentTarget.parentElement?.querySelector('.conclude-avatar-placeholder');
                        if (element) element.classList.remove('hidden');
                      }}
                    />
                    <div className="conclude-avatar-placeholder hidden absolute inset-0 bg-slate-900 flex items-center justify-center text-base font-bold text-rose-400">
                      {npc.name[0]}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight truncate max-w-[85px]">{npc.name}</h4>
                    <span className="text-[9px] text-rose-400 font-medium block mt-0.5">
                      {npc.roleName}
                    </span>
                  </div>

                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    isSelected ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {isSelected ? candidateLabel : defaultAccuseLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reason Textarea Form */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {step2Label}
            </label>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
              isPendantFound ? 'bg-emerald-950/80 text-emerald-400' : 'bg-yellow-950/60 text-yellow-500 animate-pulse'
            }`}>
              {isPendantFound ? pendantTrueLabel : pendantFalseLabel}
            </span>
          </div>

          <textarea
            value={accusationReason}
            onChange={(e) => setAccusationReason(e.target.value)}
            placeholder={textareaPlaceholder}
            rows={3.5}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-rose-500 font-sans"
          />

          <div className="space-y-2 pt-0.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              {shortcutLabel}
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {evidenceChecklist.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => {
                    setAccusationReason(prev => prev ? `${prev}\n- ${ev.label}` : `- ${ev.label}`);
                  }}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg p-2 text-slate-300 hover:text-white text-xs text-left transition leading-relaxed"
                >
                  + {ev.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 mt-5">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto flex items-center justify-center space-x-1 border border-slate-700 bg-slate-950 text-slate-400 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold hover:border-slate-500 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('concludeBackToQuery', language)}</span>
        </button>

        <button
          type="button"
          onClick={handleSubmitAccusation}
          disabled={!selectedSuspect || !accusationReason.trim()}
          className={`w-full sm:w-auto flex items-center justify-center space-x-1.5 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition cursor-pointer shadow ${
            !selectedSuspect || !accusationReason.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-rose-600 hover:bg-rose-700 text-white hover:shadow-rose-950/30'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t('submitVerdict', language)} {selectedSuspect ? `(${getSuspectRoleText(selectedSuspect)})` : ''}</span>
        </button>
      </div>
    </div>
  );
}
