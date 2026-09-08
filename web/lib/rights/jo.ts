import type { JurisdictionRights } from "./types";

/**
 * Jordan jurisdiction content for the client-rights hub.
 * Procedural specifics are marked `verified: false` — Jordanian laws, fee
 * scales and bar processes change; each unverified item renders a "verify
 * with the official source" badge and the page carries a full
 * not-legal-advice disclaimer. Institutional names are stable facts.
 */
export const jo: JurisdictionRights = {
  country: "JO",
  name: { en: "Jordan", ar: "الأردن" },
  flag: "🇯🇴",
  intro: {
    en: "A plain-language guide to what you are entitled to when you hire a lawyer in the Hashemite Kingdom of Jordan, what your lawyer is professionally required to do, and the channels available to you if things go wrong. This page describes rights and duties in general terms so you can navigate a difficult situation more confidently — it is not a substitute for a lawyer's advice on your specific case.",
    ar: "دليل بلغة واضحة لحقوقك عندما توكّل محامياً في المملكة الأردنية الهاشمية، وما يلتزم به المحامي مهنياً تجاهك، والقنوات المتاحة لك إذا حدث خلل في العلاقة. تصف هذه الصفحة الحقوق والواجبات بعبارات عامة لتمنحك ثقة أكبر في التعامل مع موقف صعب، وهي ليست بديلاً عن استشارة محامٍ في حالتك الخاصة.",
  },
  basis: {
    en: "These expectations rest on Jordan's legal framework — the Civil Code (Law No. 43/1976), the Code of Civil Procedure, the Legal Profession Law (Law No. 11/1972) and its amendments, and the professional conduct rules administered by the Jordan Bar Association — alongside general principles of agency and good faith.",
    ar: "تستند هذه التوقعات إلى الإطار القانوني الأردني — القانون المدني (رقم 43/1976)، وقانون أصول المحاكمات المدنية، وقانون نقابة المحامين (رقم 11/1972) وتعديلاته، وقواعد آداب المهنة التي تديرها نقابة المحامين الأردنيين — إضافةً إلى المبادئ العامة للوكالة وحسن النية.",
  },
  rightsLead: {
    en: "Basic, essential rights of a client in Jordan",
    ar: "حقوقك الأساسية والجوهرية كموكّل في الأردن",
  },
  rights: [
    {
      id: "clear-terms",
      title: { en: "Clear, written engagement terms", ar: "اتفاق محدد وواضح للتوكيل" },
      body: {
        en: "You are entitled to know, up front and in writing where possible: what the lawyer will do, at which stage your case stands, and how their fees are calculated (fixed, hourly, or a percentage consistent with the legal fee rules and scales). A written fee agreement protects both sides and prevents later disputes.",
        ar: "من حقك أن تعرف مسبقاً وبشكل واضح — كتابياً كلما أمكن — ما الذي سيقوم به المحامي، وفي أي مرحلة يمرّ بها قضيتك، وكيف تُحتسب أتعابه (مبلغ مقطوع، أو أجر بالساعة، أو نسبة وفقاً لقواعد وجداول الأتعاب المنظمة). الاتفاق الكتابي على الأتعاب يحمي الطرفين ويقي من الخلافات لاحقاً.",
      },
    },
    {
      id: "informed",
      title: { en: "Being kept informed", ar: "إبقاؤك على اطلاع" },
      body: {
        en: "You are entitled to honest updates about your matter — the hearings, the steps taken, the risks, and how the other party responds. A lawyer should not disappear, delay without explanation, or keep you in the dark about developments that affect your case.",
        ar: "من حقك الحصول على تحديثات صادقة بشأن قضيتك — الجلسات، والخطوات التي اتُّخذت، والمخاطر، وكيفية تعامل الطرف الآخر. لا يجوز للمحامي أن يختفي، أو يؤخر العمل دون مبرر، أو يبقيك بعيداً عن التطورات التي تمس قضيتك.",
      },
    },
    {
      id: "confidentiality",
      title: { en: "Confidentiality", ar: "السرية" },
      body: {
        en: "Everything you tell your lawyer for the purpose of the engagement is confidential. Confidentiality is a corner-stone of the attorney–client relationship under the profession's rules, and it is why professional privilege protects your communications with your lawyer.",
        ar: "كل ما تطلع عليه محاميك بغرض التوكيل يبقى سرياً. السرية ركيزة من ركائز علاقة المحامي بموكّله وفقاً لآداب المهنة، وهي أساس الحماية المقرّرة للاتصالات بينك وبين محاميك (السر المهني).",
      },
    },
    {
      id: "loyalty",
      title: { en: "Loyalty and no conflicting interests", ar: "الإخلاص وعدم تضارب المصالح" },
      body: {
        en: "Your lawyer must act in your interest and must not represent the opposing side, another party in the same dispute, or negotiate a position that reduces your claim. A lawyer cannot put their own interests ahead of yours.",
        ar: "يجب أن يسعى محاميك لتحقيق مصلحتك، وألا يوكل عن الطرف الخصم، أو عن طرف آخر في النزاع نفسه، أو يتفاوض على ما ينتقص من حقك. لا يجوز للمحامي أن يقدّم مصلحته الخاصة على مصلحتك.",
      },
    },
    {
      id: "care",
      title: { en: "Competent, diligent work", ar: "عمل كفؤ ومتقن" },
      body: {
        en: "You are entitled to a lawyer who is qualified to handle the type of matter you brought, who prepares the case, attends hearings, files documents on time, and applies reasonable skill and care. Wanting your matter dismissed, handled carelessly, or handed to an unprepared substitute is a legitimate concern.",
        ar: "من حقك أن يتولاك محامٍ مؤهل لنوع القضية التي رفعتَها، ويُعدّ القضية، ويحضر الجلسات، ويودع المستندات في مواعيدها، ويبذل المهارة والعناية المعقولة. قلقك من إهمال قضيتك، أو التواني فيها، أو تحويلها لمندوب غير مُعدّ، هو قلق مشروع.",
      },
    },
    {
      id: "no-funds",
      title: { en: "Honest handling of your money and papers", ar: "أمانة التعامل مع أموالك ومستنداتك" },
      body: {
        en: "Any amounts you pay or entrust must be accounted for accurately, receipts issued, and your original documents returned. Your files and papers belong to you; on termination you are entitled to their return (a lawyer may keep a file only within the limits the rules allow for securing unpaid fees).",
        ar: "أي مبالغ تدفعها أو تُسلّمها لمحاميك يجب أن تُقيَّد بدقة وتُصدَّر لها إيصالات، وتُردّ إليك أصول مستنداتك. ملفاتك وأوراقك ملكك؛ وعند انتهاء التوكيل من حقك استردادها، ولا يجوز للمحامي حبس الملف إلا في الحدود التي تسمح بها القواعد لتأمين أتعابه غير المدفوعة.",
      },
    },
    {
      id: "terminate",
      title: { en: "Changing or ending the engagement", ar: "تغيير المحامي أو إنهاء التوكيل" },
      body: {
        en: "You are entitled to end the retainer and appoint another lawyer, subject to your contractual obligations and notice. The outgoing lawyer must cooperate with the transfer, hand over what belongs to you, and settle fees according to the agreement and the rules.",
        ar: "من حقك إنهاء التوكيل وتعيين محامٍ آخر، وفقاً لالتزاماتك التعاقدية والإشعار الواجب. يتعيّن على المحامي المُستقيل أن يتعاون في نقل الملف، ويسلّم ما يخصّك، ويُسلِّم حساب أتعابه وفق الاتفاق والقواعد.",
      },
    },
  ],
  dutiesLead: {
    en: "What the law and the legal profession require of a lawyer",
    ar: "ما يفرضه القانون ومهنة المحاماة على المحامي",
  },
  duties: [
    {
      id: "loyalty",
      title: { en: "Principle of loyalty", ar: "مبدأ الإخلاص" },
      body: {
        en: "Express, propose, or sign nothing against your documented interest, and never pass information or documents to the opposing side without your consent where the rules require it.",
        ar: "أن لا يعبّر أو يقترح أو يُوقّع ضد مصلحتك الموثّقة، وألا يمكّن الطرف الخصم من معلومات أو مستندات دون موافقتك في الحالات التي تقتضيها القواعد.",
      },
      standard: {
        en: "Professional conduct rules of the Jordan Bar Association.",
        ar: "قواعد آداب المهنة لدى نقابة المحامين الأردنيين.",
      },
    },
    {
      id: "confidentiality",
      title: { en: "Duty of confidentiality", ar: "واجب السرية" },
      body: {
        en: "Keep your secrets and the information of the case confidential, even after the engagement ends, except where disclosure is legally required or made by you.",
        ar: "أن يحفظ أسرارك ومعلومات القضية، حتى بعد انتهاء التوكيل، إلا في حالات الإفصاح التي يوجبها القانون أو التي تأذن بها أنت.",
      },
      standard: {
        en: "Professional confidentiality and attorney–client privilege.",
        ar: "السرية المهنية والسر المهني بين المحامي والموكّل.",
      },
    },
    {
      id: "competence",
      title: { en: "Duty of competence and diligence", ar: "واجب الكفاءة والاجتهاد" },
      body: {
        en: "Prepare the case, respect deadlines and court dates, and exercise the care a reasonably skilled lawyer would use in the same circumstances.",
        ar: "أن يُعدّ القضية، ويحترم المواعيد والجلسات، ويبذل العناية التي يبذلها المحامي الماهر ذو الخبرة المعقولة في الظروف نفسها.",
      },
      standard: {
        en: "Standards of professional practice.",
        ar: "معايير الممارسة المهنية.",
      },
    },
    {
      id: "communication",
      title: { en: "Duty to inform the client", ar: "واجب إطلاع الموكل" },
      body: {
        en: "Notify you of what happens in the case, the stages reached, and any proposal or settlement, and follow your instructions within the limits allowed by the engagement.",
        ar: "أن يطلعك على ما يجري في القضية، ومراحلها، وأي عرض أو تسوية، وأن يمتثل لتعليماتك في حدود التوكيل.",
      },
      standard: {
        en: "Good-faith dealing in attorney–client relations.",
        ar: "حسن المعاملة وحسن النية في علاقة المحامي بالموكل.",
      },
    },
    {
      id: "fees",
      title: { en: "Duty of transparency on fees", ar: "واجب الشفافية في الأتعاب" },
      body: {
        en: "Agree fees clearly, issue receipts for what you pay, and charge within the limits set by law and the bar's fee rules — neither overcharging nor collecting unlawful or unconscionable amounts.",
        ar: "أن يُحدد الأتعاب بوضوح، ويصدر إيصالاً بما يُدفع، وألا يتقاضى ما يخالف القانون والقواعد أو يتجاوز الحدود المعقولة والمقررة للأتعاب.",
      },
      standard: {
        en: "The fee provisions of the Legal Profession Law and the bar's regulations.",
        ar: "أحكام الأتعاب في قانون نقابة المحامين ونظمها.",
      },
    },
    {
      id: "accounting",
      title: { en: "Duty to account for client funds", ar: "واجب الإمساك بحساب أموال الموكلين" },
      body: {
        en: "Keep what you entrust separate, record it accurately, use it only for the purpose agreed, and return the balance to you without delay.",
        ar: "أن يحفظ ما تؤتمنه عليه في حسابات مقيدة بدقة، ويستخدمها في الغرض المتفق عليه فقط، ويردّ لك الباقي دون تأخير.",
      },
      standard: {
        en: "Trust-accounting and the discipline rules of the bar.",
        ar: "قواعد حفظ أموال الموكلين وقواعد التأديب لدى النقابة.",
      },
    },
    {
      id: "candor",
      title: { en: "Duty of candor toward the courts", ar: "واجب الصدق تجاه القضاء" },
      body: {
        en: "Present your case through lawful and honest means, avoid misleading the court, and refuse to participate in fabrication or fraud — regardless of any instruction to the contrary.",
        ar: "أن يقدم قضيتك بوسائل مشروعة وصادقة، وألا يضلل المحكمة، وألا يشارك في تزوير أو احتيال — مهما كانت التعليمات الصادرة إليه.",
      },
      standard: {
        en: "Rules protecting the integrity of the judicial process.",
        ar: "القواعد الحافظة لنزاهة سير العدالة.",
      },
    },
  ],
  coursesLead: {
    en: "Understanding the three ways things can go wrong",
    ar: "فهم الأنواع الثلاثة للخلل المهني",
  },
  courses: {
    misconduct: {
      id: "misconduct",
      title: { en: "Professional misconduct", ar: "الخطأ المهني التأديبي" },
      body: {
        en: "A violation of professional conduct or the ethics rules — for example ignoring your file, sharing your secrets, acting against your interest, missing a hearing without cause, or fee practices the rules forbid. Misconduct can exist even when you suffered no financial damage, and it is examined by the bar's disciplinary bodies.",
        ar: "هو مخالفة آداب المهنة أو أصولها — مثل إهمال ملفك، أو إفشاء أسرارك، أو العمل ضد مصلحتك، أو التخلف عن جلسة دون عذر، أو ممارسات أتعاب تحظرها القواعد. قد يوجد الخطأ التأديبي حتى دون أن يلحق بك ضرر مالي، وينظر فيه أمام جهات التأديب في النقابة.",
      },
      indicators: [
        { en: "The lawyer violated a rule or an ethical duty of the profession.", ar: "خالف المحامي قاعدة أو واجباً أخلاقياً من واجبات المهنة." },
        { en: "The issue is about how the lawyer behaved, not only about money lost.", ar: "الخلل في سلوك المحامي وآدابه، وليس مجرد خسارة مالية." },
        { en: "The result, if you succeed, is a professional sanction — not damages paid to you.", ar: "النتيجة — عند نجاح الشكوى — جزاء تأديبي مهني، وليست تعويضاً مادياً لك." },
      ],
    },
    malpractice: {
      id: "malpractice",
      title: { en: "Legal malpractice / negligence causing harm", ar: "الخطأ المهني الموجب للتعويض (الإهمال)" },
      body: {
        en: "When the lawyer's failure to exercise the skill and care reasonably required causes you actual harm — for example a claim lost because a deadline was missed, a document was not filed, or an obvious error was made. This is a civil question: you may seek damages in the courts by proving the breach, the harm, and the link between them.",
        ar: "أن يُلحق إخلال المحامي ببذل المهارة والعناية المطلوبة ضرراً فعلياً بك — مثل ضياع مطالبة بسبب تفويت موعد، أو عدم إيداع مستند، أو خطأ واضح. هذا باب مدني: يمكنك طلب التعويض أمام القضاء بإثبات الإخلال والضرر وعلاقة السببية بينهما.",
      },
      indicators: [
        { en: "You suffered a concrete, measurable loss.", ar: "لحقت بك خسارة فعلية قابلة للتقدير." },
        { en: "The loss is linked to a failure in the lawyer's care or skill.", ar: "الخسارة ناتجة عن إخلال في عناية المحامي أو مهارته." },
        { en: "The remedy is a civil claim for compensation in the courts.", ar: "وسيلة التعويض هي دعوى مدنية أمام القضاء." },
      ],
    },
    fiduciary: {
      id: "fiduciary",
      title: { en: "Breach of trust with your funds or papers", ar: "الإخلال بالأمانة في أموالك أو مستنداتك" },
      body: {
        en: "Using money or documents you entrusted to the lawyer for an unapproved purpose, or failing to return them. Depending on the facts this can be disciplinary, civil, and in serious cases criminal (for example embezzlement). These facts should be documented and reported to a lawyer you trust before deciding the path.",
        ar: "استخدام المبالغ أو المستندات التي ائتمنت بها المحامي في غير الغرض المأذون، أو عدم ردّها. وبحسب الوقائع قد يكون هذا خلافاً تأديبياً أو مدنياً، وفي الحالات الجسيمة قد يكون فعلاً مجرّماً (كالاختلاس). يُنصح بتوثيق الوقائع وعرضها على محامٍ تثق به قبل اختيار المسار.",
      },
      indicators: [
        { en: "Money you entrusted was used or withheld against the agreement.", ar: "استُخدم المال المؤتمَن عليه أو حُجِز خلافاً للاتفاق." },
        { en: "Original documents or files were withheld without a lawful basis.", ar: "حُجِزت الأصول أو الملفات دون سند مشروع." },
        { en: "The conduct can be pursued on more than one legal track.", ar: "قد تجري ملاحقته في أكثر من مسار قانوني في آن واحد." },
      ],
    },
  },
  evidenceLead: {
    en: "What to gather before you act (in an evidence folder, not in the chat)",
    ar: "ما يجب توثيقه قبل اتخاذ أي إجراء (في ملف أدلة، وليس في المحادثات)",
  },
  evidence: [
    {
      id: "engagement",
      title: { en: "The engagement record", ar: "الأوراق التعاقدية" },
      body: {
        en: "The agency document (power of attorney), any signed fee agreement, receipts for every payment, and correspondence about scope and fees.",
        ar: "سند الوكالة، واتفاق الأتعاب إن وُجد، وإيصالات كل مبلغ سُدد، والمراسلات المتعلقة بنطاق التوكيل والأتعاب.",
      },
    },
    {
      id: "late-evidence",
      title: { en: "Proving silence and delay", ar: "إثبات الصمت والتأخير" },
      body: {
        en: "Dated messages asking for status, notes of calls with dates and what was said, and a chronology of missed appointments or unreturned calls.",
        ar: "رسائل مؤرخة تطلب فيها أحوال القضية، ومذكرات بالمكالمات (التاريخ ومضمونها)، وتسلسل زمني للمواعيد الضائعة والمكالمات غير المرَد عليها.",
      },
    },
    {
      id: "case-evidence",
      title: { en: "The underlying case papers", ar: "أوراق القضية الأصلية" },
      body: {
        en: "Copies of what you handed over, the court/file number and stage of the case, and any loss you can tie to missing filings or missed dates.",
        ar: "نسخ مما سلّمتَه، ورقم القضية ومرحلتها، وأي ضرر يمكن ربطه بإيداع فائت أو موعد ضائع.",
      },
    },
    {
      id: "funds-evidence",
      title: { en: "Proof about money", ar: "أدلة مالية" },
      body: {
        en: "Bank slips and transfer confirmations, receipts, and any demand letters requesting a refund, a balance, or the return of your papers.",
        ar: "إيصالات التحويل والبنك، والفواتير، وأي إنذارات مطالبة بردّ مبلغ أو رصيد أو إعادة أوراقك.",
      },
    },
  ],
  actionsLead: {
    en: "The actions and resources available to you",
    ar: "الإجراءات والوسائل المتاحة لك",
  },
  actions: [
    {
      id: "bar-complaint",
      eyebrow: { en: "Disciplinary track", ar: "المسار التأديبي" },
      title: { en: "File a complaint with the Jordan Bar Association", ar: "تقديم شكوى إلى نقابة المحامين الأردنيين" },
      body: {
        en: "Professional conduct is governed by the Legal Profession Law and the Association's rules, and complaints are examined by its disciplinary bodies, which can impose sanctions ranging from a warning to, in serious cases, suspension or striking off. The bar also plays a role in fee matters between lawyer and client.",
        ar: "يخضع السلوك المهني لقانون نقابة المحامين وأنظمتها، وتنظر في الشكاوى جهاتها التأديبية، ويجوز لها توقيع جزاءات تبدأ بالتنبيه وقد تصل — في الحالات الجسيمة — إلى الإيقاف أو الشطب. وللنقابة دور في مسائل الأتعاب بين المحامي والموكل.",
      },
      bestFor: {
        en: "Unprofessional or unethical behavior: silence, conflicts of interest, breaches of confidentiality, fee overreach, neglect of the file.",
        ar: "السلوك غير المهني أو غير الأخلاقي: الصمت، وتضارب المصالح، والمساس بالسرية، والمغالاة في الأتعاب، وإهمال الملف.",
      },
      evidence: [
        { en: "Engagement documents and receipts", ar: "أوراق التوكيل والإيصالات" },
        { en: "Dated correspondence and notes proving the conduct", ar: "مراسلات ومذكرات مؤرخة تُثبت السلوك" },
        { en: "A clear chronology of events", ar: "تسلسل زمني واضح للأحداث" },
      ],
      steps: [
        {
          title: { en: "Confirm the current procedure", ar: "تأكد من الإجراءات الحالية" },
          body: {
            en: "Complaint channels, required forms, and the supporting annex format are set by the Bar Association and may change. Confirm the current filing procedure on the Association's official channels before submitting.",
            ar: "تحدد النقابة قنوات تقديم الشكوى والنماذج المطلوبة وصيغة المرفقات، وقد تتغير. تحقق من إجراءات التقديم الحالية عبر القنوات الرسمية للنقابة قبل الإرسال.",
          },
          authority: "Jordan Bar Association",
        },
        {
          title: { en: "Submit a written, factual complaint", ar: "قدّم شكوى كتابية موضوعية" },
          body: {
            en: "Describe what happened in a dated written statement: who, when, what was promised, what was done or not done. Attach copies — keep your originals.",
            ar: "صف ما حدث في مذكرة مؤرخة: من، ومتى، وما الذي وُعد به، وما أُنجز أو لم يُنجز. أرفق نسخاً، واحتفظ بالأصول.",
          },
        },
        {
          title: { en: "Follow up on the referral", ar: "تابع مسار الشكوى" },
          body: {
            en: "Disciplinary referral depends on the merits. If the body requests documents or a hearing, respond promptly and in writing.",
            ar: "الإحالة للتأديب مرتبطة بتوافر الوجاهة في الشكوى. إذا طلبت الجهة مستندات أو استجواباً، فاستجب بسرعة وكتابياً.",
          },
        },
      ],
      verified: false,
      parallel: {
        en: "A bar complaint does not block a civil claim for your loss, and it does not by itself pay you damages.",
        ar: "شكوى النقابة لا تمنع رفع دعوى تعويض عن ضررك، ولا تُغني هي بذاتها عن الحكم لك بتعويض.",
      },
    },
    {
      id: "civil-claim",
      eyebrow: { en: "Civil track", ar: "المسار المدني" },
      title: { en: "Claim compensation in the courts", ar: "المطالبة بالتعويض قضائياً" },
      body: {
        en: "If the lawyer's negligence caused you an actual loss, you may bring a civil claim for damages under the Civil Code through the competent court. You will need to prove the breach, the harm, and the causal link. Court procedures, jurisdiction, and prescription periods are fixed by law — verify them for your case at the time you act.",
        ar: "إذا ترتب على إهمال المحامي ضرر فعلي، يمكنك رفع دعوى تعويض أمام المحكمة المختصة استناداً إلى القانون المدني. ستحتاج إلى إثبات الإخلال والضرر وعلاقة السببية. تُنظّم إجراءات التقاضي والاختصاص ومواعيد السقوط بنصوص قانونية — تحقق منها لحالتك وقت مباشرة الإجراء.",
      },
      bestFor: {
        en: "Real financial loss caused by the lawyer's fault: a claim lost to a missed deadline, a bad legal step, or mishandling of your funds.",
        ar: "الخسارة المالية الفعلية الناتجة عن خطأ المحامي: دعوى ضاعت بسبب موعد فائت، أو خطوة قانونية خاطئة، أو إساءة التصرف في أموالك.",
      },
      evidence: [
        { en: "Proof of the loss (court rulings, valuations, contracts)", ar: "إثبات الخسارة (أحكام، وتقديرات، وعقود)" },
        { en: "Documents showing the deadline or filing that was missed", ar: "ما يثبت الموعد أو الإيداع الذي فات" },
        { en: "Your engagement and payment records", ar: "أوراق التوكيل والمدفوعات" },
      ],
      steps: [
        {
          title: { en: "Take advice from an independent lawyer", ar: "استشر محامياً مستقلّاً" },
          body: {
            en: "Before suing a lawyer, discuss the merits, the prescription period that applies, and the evidence with a lawyer unconnected to the dispute.",
            ar: "قبل مقاضاة محامٍ، ناقش وجاهة الدعوى وما يسري عليها من مواعيد سقوط وأدلة، مع محامٍ غير مرتبط بالنزاع.",
          },
        },
        {
          title: { en: "Verify the forum and the deadline", ar: "تحقق من المحكمة المختصة ومدة السقوط" },
          body: {
            en: "Confirm which court hears the claim, the applicable rules, and the time limit for filing in your jurisdiction on the date you act.",
            ar: "تأكد من المحكمة المختصة بالنظر، والقواعد المطبقة، ومدة السقوط المسموحة في اختصاصك في يوم مباشرة الإجراء.",
          },
        },
        {
          title: { en: "Preserve the evidence", ar: "حافظ على الأدلة" },
          body: {
            en: "Keep originals safe and duplicates in your secure folder. Original evidence is the backbone of a damages claim.",
            ar: "احتفظ بالأصول في مكان آمن وبنُسخ في مجلدك المؤمَّن. الأدلة الأصلية هي ركيزة دعوى التعويض.",
          },
        },
      ],
      verified: false,
      parallel: {
        en: "A civil claim and a disciplinary complaint are separate tracks and can run in parallel depending on the circumstances.",
        ar: "الدعوى المدنية والشكوى التأديبية مساران مستقلان وقد يسيران بالتوازي بحسب الظروف.",
      },
    },
    {
      id: "fee-dispute",
      eyebrow: { en: "Fee track", ar: "مسار الأتعاب" },
      title: { en: "Challenge an unjust fee demand", ar: "الاعتراض على أتعاب مجحفة" },
      body: {
        en: "Disputes about the amount of fees can be raised — first by requesting a written account, then through the bar's mediation/complaint channels or, where the law so provides, before the court that has jurisdiction over the matter.",
        ar: "يمكن الاعتراض على قيمة الأتعاب — أولاً بطلب حساب كتابي، ثم عبر قنوات التوفيق أو الشكوى لدى النقابة، أو أمام الجهة القضائية المختصة حيث يجيز القانون ذلك.",
      },
      bestFor: {
        en: "Over-billing, an inflated percentage, double-billing, or a fee demand with no written basis.",
        ar: "المغالاة في الفواتير، أو نسبة مرتفعة، أو تحصيل مضاعف، أو مطالبة بأتعاب بلا أساس كتابي.",
      },
      evidence: [
        { en: "The signed fee agreement if one exists", ar: "اتفاق الأتعاب الموقّع إن وُجد" },
        { en: "Receipts and transfer records", ar: "الإيصالات وسجلات التحويل" },
        { en: "Itemised work performed (dates, tasks)", ar: "بيان تفصيلي بالأعمال المنفذة (تواريخ ومهام)" },
      ],
      steps: [
        {
          title: { en: "Ask for a written itemised account", ar: "اطلب حساباً كتابياً مفصلاً" },
          body: {
            en: "A dated letter asking for a full written breakdown of fees, what was done, and the basis in the agreement. Keep a copy.",
            ar: "رسالة مؤرخة تطلب بياناً تفصيلياً كاملاً بالأتعاب والأعمال المنفذة وأساسها في الاتفاق. احتفظ بنسخة.",
          },
        },
        {
          title: { en: "Try to reach an amicable settlement", ar: "حاول الوصول إلى تسوية ودّية" },
          body: {
            en: "Document the offers and the response; an amicable resolution is nearly always faster and cheaper.",
            ar: "وثّق العروض والردود؛ فالحل الودي أسرع وأقل كلفة في الغالب.",
          },
        },
        {
          title: { en: "Escalate through the bar or the courts", ar: "صعّد عبر النقابة أو القضاء" },
          body: {
            en: "Where the rules and the law allow, the fee dispute can be referred to the bar's channels or a court with jurisdiction — verify the current route.",
            ar: "حيث تجيز القواعد والقانون، يمكن إحالة النزاع على الأتعاب إلى قنوات النقابة أو جهة قضائية مختصة — تحقق من المسار الحالي.",
          },
        },
      ],
      verified: false,
      parallel: {
        en: "Withholding your file to force payment must itself be tested against the rules — you may need a lawyer or the bar to call for its return as a separate step.",
        ar: "حبس ملفك للضغط من أجل الدفع يجب اختباره في ذاته أمام القواعد — وقد تحتاج إلى محامٍ أو إلى تدخل النقابة للمطالبة بردّه كخطوة مستقلة.",
      },
    },
  ],
  parallelLead: {
    en: "Keep these in mind",
    ar: "نقاط تذكرة مهمة",
  },
  parallel: [
    {
      en: "A disciplinary complaint and a civil claim are different: one concerns the profession, the other your damages. You can take advice on pursuing both.",
      ar: "الشكوى التأديبية والدعوى المدنية مختلفتان: الأولى شأن مهني، والثانية تعويض عن ضررك. يمكنك التشاور حول السير فيهما معاً.",
    },
    {
      en: "Separating what a lawyer did (facts) from what you conclude about their intent (allegations) makes your complaint stronger and safer.",
      ar: "الفصل بين ما فعله المحامي (وقائع) وبين ما تستنتجه من نواياه (اتهامات) يجعل شكواك أقوى وأسلم.",
    },
    {
      en: "Prescription periods apply and are not paused; verify the applicable period for your claim early.",
      ar: "تسري مواعيد السقوط ولا تتوقف؛ تحقق مبكراً من المدة السارية على مطالبتك.",
    },
  ],
  templatesLead: {
    en: "Draft letters you can edit",
    ar: "نماذج خطابات قابلة للتعديل",
  },
  templates: {
    note: {
      en: "Drafts to guide you — they are not legal advice and must be completed with your true facts. Send copies and keep the originals. Verify the addressee's official address before sending.",
      ar: "مسودات إرشادية — ليست استشارة قانونية، ويجب إكمالها بوقائعك الصحيحة. أرسل نسخاً واحتفظ بالأصول. تحقق من عنوان الجهة الرسمي قبل الإرسال.",
    },
    items: [
      {
        id: "file-return",
        title: { en: "Request the return of your file and papers", ar: "طلب ردّ الملف والمستندات" },
        recipient: { en: "Your lawyer", ar: "محاميك" },
        body: { en: `Date: {TODAY}

To: {LAWYER_NAME} — {LAWYER_ADDRESS}

Re: Request to close the file No. {FILE_NUMBER} and return my papers

Dear Lawyer,

I am writing to confirm the termination of your representation in the matter "{CASE_NAME}" and to request that you return to me, within a reasonable time, all original documents and correspondence belonging to me, together with copies of everything you filed on my behalf.

Please confirm in writing that no other documents remain in your possession and provide your final written account of fees, including every amount I paid (attached references: {RECEIPT_REFS}).

Please send the return of the papers by traceable delivery to the address below.

{CLIENT_NAME}
{CLIENT_PHONE}
{CLIENT_ADDRESS}`,
          ar: `التاريخ: {TODAY}

إلى: {LAWYER_NAME} — {LAWYER_ADDRESS}

الموضوع: طلب إغلاق الملف رقم {FILE_NUMBER} وردّ مستنداتي

سيدي المحامي،

بالإشارة إلى إنهاء توكيلكم عني في قضية "{CASE_NAME}"، أطلب إعادة جميع الأصول والمراسلات التي تخصّني إليّ، خلال مدة معقولة، مع نسخ من كل ما أودعتموه باسمي.

كما أرجو تأكيد كتابياً عدم بقاء أي مستندات أخرى بحوزتكم، وتزويدي بالحساب الختامي المكتوب لما دفعته لكم (مراجع الإيصالات: {RECEIPT_REFS}).

ولطفاً أرسلوا الملف عبر وسيلة توصيل موثقة إلى العنوان التالي.

{CLIENT_NAME}
{CLIENT_PHONE}
{CLIENT_ADDRESS}` },
      },
      {
        id: "fee-reconciliation",
        title: { en: "Fee reconciliation demand", ar: "طلب مفاضلة الحساب في الأتعاب" },
        recipient: { en: "Your lawyer", ar: "محاميك" },
        body: { en: `Date: {TODAY}

To: {LAWYER_NAME} — {LAWYER_ADDRESS}

Re: Written account and reconciliation of fees — matter "{CASE_NAME}"

Dear Lawyer,

In our engagement in the matter above we agreed on the basis for fees (agreement ref.: {AGREEMENT_REF}, dated {AGREEMENT_DATE}). To date I have paid you the total of {TOTAL_PAID}, receipts for which I hold ({RECEIPT_REFS}).

Please provide me, within {DAYS} days, a written itemised account showing: every task performed with its date, the fee basis applied to it, and any balance remaining. If a balance is claimed, please explain precisely how it follows from our agreement.

If your account shows that I overpaid, please credit or refund the difference and confirm the transfer.

{CLIENT_NAME}
{CLIENT_PHONE}
{CLIENT_ADDRESS}`,
          ar: `التاريخ: {TODAY}

إلى: {LAWYER_NAME} — {LAWYER_ADDRESS}

الموضوع: بيان مكتوب ومفاضلة حساب الأتعاب — قضية "{CASE_NAME}"

سيدي المحامي،

بموجب اتفاقنا في القضية الموضحة أعلاه (مرجع الاتفاق: {AGREEMENT_REF} بتاريخ {AGREEMENT_DATE}) فقد دفعت لكم حتى تاريخه مبلغاً إجمالياً قدره {TOTAL_PAID}، ولديّ إيصالاته ({RECEIPT_REFS}).

أرجو تزويدي خلال {DAYS} يوماً بحساب مكتوب ومفصّل يبيّن: كل عمل منفّذ وتاريخه، وأساس احتسابه، وأي رصيد متبقٍّ. وإذا ادّعيتم وجود رصيد، فالرجاء بيان كيف يُستنتج تحديداً من اتفاقنا.

وإذا تبيّن من الحساب أنني دفعت أكثر مما يحقّ لكم، فأرجو ردّ الفارق أو خصمه وتأكيد التحويل.

{CLIENT_NAME}
{CLIENT_PHONE}
{CLIENT_ADDRESS}` },
      },
      {
        id: "bar-complaint",
        title: { en: "Complaint to the Jordan Bar Association", ar: "شكوى إلى نقابة المحامين الأردنيين" },
        recipient: { en: "Jordan Bar Association", ar: "نقابة المحامين الأردنيين" },
        body: { en: `Date: {TODAY}

To: The Jordan Bar Association — Complaints / Disciplinary Committee
{ASSOCIATION_ADDRESS}

Re: Complaint about the professional conduct of Lawyer {LAWYER_NAME} (registration No. {REGISTRATION_NO} if known)

Dear Mr/Madam,

I instruct you that I retained the Lawyer named above in the matter "{CASE_NAME}" (case/file No. {FILE_NUMBER}) and agreed fees as follows: {FEE_TERMS}.

The facts of my complaint are as follows:
1. {FACT_ONE}
2. {FACT_TWO}
3. {FACT_THREE}

I have attached copies of: the engagement documents, my receipts, and the dated correspondence showing the above. I retain the originals and will present them if required.

In separate words, I am not asking the Association to rule on the outcome of my case, but on the professional conduct described above.

{CLIENT_NAME}
{CLIENT_PHONE}
{CLIENT_ADDRESS}

Attachments: {ATTACHMENT_LIST}`,
          ar: `التاريخ: {TODAY}

إلى: نقابة المحامين الأردنيين — لجنة الشكاوى/التأديب
{ASSOCIATION_ADDRESS}

الموضوع: شكوى ضد سلوك مهني للمحامي/المحامية {LAWYER_NAME} (رقم القيد {REGISTRATION_NO} إن عُلم)

تحية طيبة وبعد،

بياناً: أحصلت على خدمات المحامي المذكور أعلاه في قضية "{CASE_NAME}" (رقم القضية/الملف {FILE_NUMBER}) واتفقنا على الأتعاب على النحو التالي: {FEE_TERMS}.

وقائع الشكوى لديكم كالتالي:
1. {FACT_ONE}
2. {FACT_TWO}
3. {FACT_THREE}

أرفق نسخاً من: أوراق التوكيل، والإيصالات، والمراسلات المؤرخة التي تُظهر ما تقدم. وأحتفظ بالأصول لتقديمها عند الطلب.

أوضح أنني لا أطلب من النقابة الفصل في نتيجة قضيتي، وإنما في السلوك المهني الموصوف أعلاه.

{CLIENT_NAME}
{CLIENT_PHONE}
{CLIENT_ADDRESS}

المرفقات: {ATTACHMENT_LIST}` },
      },
    ],
  },
  resourcesLead: {
    en: "Official bodies you may need",
    ar: "الجهات الرسمية التي قد تحتاج إليها",
  },
  resources: [
    {
      id: "jo-bar",
      authority: { en: "Jordan Bar Association", ar: "نقابة المحامين الأردنيين" },
      role: {
        en: "Complaints on professional conduct; mediation in lawyer–client fee and file disputes; disciplinary referral.",
        ar: "النظر في شكاوى آداب المهنة، والوساطة في نزاعات الأتعاب والملفات بين المحامي والموكل، والإحالة للتأديب.",
      },
      verified: true,
      note: {
        en: "Contact channels change — confirm the current official address before writing.",
        ar: "تتغير قنوات التواصل — أكّد عنوان الجهة الرسمي الحالي قبل المراسلة.",
      },
    },
    {
      id: "jo-justice",
      authority: { en: "Ministry of Justice — Hashemite Kingdom of Jordan", ar: "وزارة العدل — المملكة الأردنية الهاشمية" },
      role: {
        en: "Courts and judicial affairs; general supervision of the justice sector.",
        ar: "شؤون المحاكم والقضاء؛ والإشراف العام على قطاع العدالة.",
      },
      verified: true,
    },
    {
      id: "jo-courts",
      authority: { en: "The competent court", ar: "المحكمة المختصة" },
      role: {
        en: "Civil claims for damages arising from the lawyer's fault; fee claims where the law so provides.",
        ar: "فرز دعاوى التعويض الناشئة عن خطأ المحامي؛ ومطالبات الأتعاب حيث يجيز القانون.",
      },
      verified: true,
    },
  ],
  verify: {
    en: "This page describes rights and duties in general terms. Jordanian procedures for complaints, fee disputes and civil claims are set by current law and by the bar's regulations, which change over time. Verify every step, deadline and address with the official sources before you act, and take independent legal advice on your own facts.",
    ar: "تصف هذه الصفحة الحقوق والواجبات بعبارات عامة. وتحدَّد إجراءات الشكاوى ومنازعات الأتعاب والدعاوى المدنية في الأردن بالقانون الحالي وأنظمة النقابة، وهي قابلة للتغيير. تحقق من كل خطوة وموعد وعنوان مع الجهات الرسمية قبل المضي، واستشر محامياً مستقلاً في وقائعك الخاصة.",
  },
  updated: {
    en: "Educational content snapshot — verify with current official sources.",
    ar: "لقطة محتوى تثقيفي — يُرجى التحقق من المصادر الرسمية الحالية.",
  },
};