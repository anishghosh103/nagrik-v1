const grievancesEn = {
  centre: {
    eyebrow: 'Across your services',
    title: 'Grievance Centre',
    subtitle:
      'Track every case you have raised with Income Tax, PF & EPFO, or shared identity records.',
    file: 'File a new grievance',
    empty: 'No grievances filed',
    emptyHelp: 'Cases you raise about any connected service will appear here.',
    submittedOn: 'Filed on {{date}}',
  },
  wizard: {
    eyebrow: 'New grievance',
    serviceTitle: 'Which service is this about?',
    serviceHelp:
      'Choose the service, or let us work it out from your description.',
    unsure: "I'm not sure",
    unsureHelp: "We'll work this out from what you describe next.",
    describeTitle: 'Describe what happened',
    describeHelp:
      'Use your own words. There is no need to mention forms, sections or rule codes.',
    describePlaceholder:
      'For example: My May contribution is not showing in my PF passbook.',
    describeContinue: 'Continue',
    categoryTitle: 'Suggested category',
    categoryHelp:
      'Based on what you described, this looks like the closest match. Change it if it is not right.',
    categoryDetectedService: 'Detected service: {{service}}',
    evidenceTitle: 'Add supporting material',
    evidenceHelp:
      'Add anything relevant, such as a salary slip or a screenshot description. This is optional.',
    evidencePlaceholder: 'For example: Passbook screenshot for May 2026',
    evidenceAdd: 'Add',
    evidenceEmpty: 'No supporting material added yet.',
    evidenceRemove: 'Remove',
    reviewTitle: 'Review before filing',
    reviewHelp: 'Check the details below before this is filed.',
    reviewService: 'Service',
    reviewCategory: 'Category',
    reviewDescription: 'Your description',
    reviewEvidence: 'Supporting material',
    reviewEvidenceCount_one: '{{count}} item added',
    reviewEvidenceCount_other: '{{count}} items added',
    reviewEvidenceNone: 'None added',
    submit: 'File this grievance',
    submitting: 'Filing your grievance…',
    submitFailed: 'We could not file this grievance. Try again.',
    prefilledTitle: 'Prefilled from your passbook',
    prefilledHelp:
      'Service, category and description were carried forward from the missing contribution you reviewed.',
  },
  confirmation: {
    eyebrow: 'Grievance filed',
    title: 'Your grievance was filed',
    subtitle: 'We will track this case until it is resolved.',
    viewCase: 'View this grievance',
    viewActivity: 'View Activity',
  },
  detail: {
    eyebrow: 'Grievance {{reference}}',
    filedOn: 'Filed on',
    service: 'Service',
    category: 'Category',
    yourDescription: 'What you described',
    evidence: 'Supporting material',
    evidenceNone: 'No supporting material was added.',
    checkUpdates: 'Check for updates',
    checking: 'Checking…',
    escalate: 'Escalate this grievance',
    escalating: 'Escalating…',
    escalateHelp:
      'This case was closed without changing your record. You can ask for it to be reviewed again.',
    escalatedNotice:
      'Your escalation has been forwarded. Check back for the outcome.',
    currentMeaning: 'What this means',
    notFound: 'Grievance not found',
  },
  meaning: {
    acknowledged: 'Your grievance has been received and is waiting for review.',
    inReview: 'Your grievance is being reviewed.',
    disposedResolved:
      'The office closed this grievance and updated your record.',
    disposedNoChange:
      'The office closed this grievance without changing your record.',
    escalationInReview: 'Your escalation is being reviewed.',
    escalationResolved:
      'Your escalation was reviewed and your record was updated.',
  },
  status: {
    ACKNOWLEDGED: 'Received',
    IN_REVIEW: 'In review',
    DISPOSED: 'Closed',
    ESCALATED: 'Escalation in review',
    ESCALATION_RESOLVED: 'Escalation resolved',
  },
  timeline: {
    SUBMITTED: 'Grievance filed',
    IN_REVIEW: 'Under review',
    DISPOSED: 'Case closed',
    ESCALATED: 'Escalation requested',
    ESCALATION_RESOLVED: 'Escalation resolved',
  },
  categories: {
    REFUND_DELAY: {
      title: 'Refund not received',
      help: 'Your Income Tax refund is delayed or shows no update.',
    },
    NOTICE_DISAGREEMENT: {
      title: 'Disagreement with a notice',
      help: 'You believe a tax notice or demand is incorrect.',
    },
    PAYMENT_MISMATCH: {
      title: 'Payment not reflecting',
      help: 'A tax payment you made is not showing against your PAN.',
    },
    PORTAL_ACCESS: {
      title: 'Portal or login problem',
      help: 'You could not access the Income Tax portal or complete a step.',
    },
    CONTRIBUTION_MISMATCH: {
      title: 'Missing or wrong contribution',
      help: 'A monthly contribution is missing or incorrect in your passbook.',
    },
    CLAIM_DELAY: {
      title: 'PF claim delay or rejection',
      help: 'Your withdrawal claim is delayed or was rejected.',
    },
    KYC_CORRECTION: {
      title: 'KYC or record correction',
      help: 'Your Aadhaar, PAN or bank record needs correction at EPFO.',
    },
    TRANSFER_DELAY: {
      title: 'PF transfer delay',
      help: 'Your transfer from a previous employer is delayed.',
    },
    IDENTITY_MISMATCH: {
      title: 'Details differ across records',
      help: 'Your name or other details differ between connected records.',
    },
    PROPAGATION_FAILURE: {
      title: 'Correction did not update everywhere',
      help: 'A correction you made has not reached every connected record.',
    },
    OTHER: {
      title: 'Something else',
      help: 'Your issue does not match another category.',
    },
  },
  process: {
    INCOME_TAX:
      "We'll prepare this for the Income Tax CPC grievance channel. Simulated review typically takes 15–30 days.",
    EPFO: "We'll forward this to the EPFO regional office handling your account. Simulated review typically takes 15–30 days.",
    IDENTITY:
      "We'll route this to the connected service your category affects. Simulated review typically takes 7–15 days.",
  },
  activity: {
    submittedTitle: 'Grievance filed',
    submittedDetail: 'Reference {{reference}} is awaiting review.',
    disposedTitle: 'Grievance closed',
    disposedResolvedDetail:
      'Reference {{reference}} was closed and your record was updated.',
    disposedNoChangeDetail:
      'Reference {{reference}} was closed without changing your record.',
    escalatedTitle: 'Grievance escalated',
    escalatedDetail: 'Reference {{reference}} was sent for a second review.',
    escalationResolvedTitle: 'Escalation resolved',
    escalationResolvedDetail:
      'Reference {{reference}} was reviewed again and your record was updated.',
  },
};

const grievancesHi: typeof grievancesEn = {
  centre: {
    eyebrow: 'आपकी सेवाओं में',
    title: 'शिकायत केंद्र',
    subtitle:
      'इनकम टैक्स, पीएफ और ईपीएफओ, या साझा पहचान रिकॉर्ड से जुड़े हर मामले को ट्रैक करें।',
    file: 'नई शिकायत दर्ज करें',
    empty: 'कोई शिकायत दर्ज नहीं',
    emptyHelp: 'किसी भी जुड़ी सेवा से जुड़ा मामला यहाँ दिखेगा।',
    submittedOn: '{{date}} को दर्ज',
  },
  wizard: {
    eyebrow: 'नई शिकायत',
    serviceTitle: 'यह किस सेवा से जुड़ी है?',
    serviceHelp: 'सेवा चुनें, या अपने विवरण से हमें तय करने दें।',
    unsure: 'मुझे यकीन नहीं है',
    unsureHelp: 'हम आपके अगले विवरण से यह तय करेंगे।',
    describeTitle: 'बताएं क्या हुआ',
    describeHelp:
      'अपने शब्दों में लिखें। फॉर्म, धारा या नियम कोड बताने की जरूरत नहीं।',
    describePlaceholder:
      'उदाहरण: मेरे मई माह का अंशदान पीएफ पासबुक में नहीं दिख रहा।',
    describeContinue: 'जारी रखें',
    categoryTitle: 'सुझाई गई श्रेणी',
    categoryHelp:
      'आपके विवरण के आधार पर यह सबसे करीबी श्रेणी है। यदि सही न हो तो बदलें।',
    categoryDetectedService: 'पहचानी गई सेवा: {{service}}',
    evidenceTitle: 'सहायक सामग्री जोड़ें',
    evidenceHelp:
      'कोई भी प्रासंगिक जानकारी जोड़ें, जैसे सैलरी स्लिप या स्क्रीनशॉट का विवरण। यह वैकल्पिक है।',
    evidencePlaceholder: 'उदाहरण: मई 2026 पासबुक स्क्रीनशॉट',
    evidenceAdd: 'जोड़ें',
    evidenceEmpty: 'अभी तक कोई सहायक सामग्री नहीं जोड़ी गई।',
    evidenceRemove: 'हटाएं',
    reviewTitle: 'दर्ज करने से पहले समीक्षा करें',
    reviewHelp: 'दर्ज करने से पहले नीचे दिया विवरण जांच लें।',
    reviewService: 'सेवा',
    reviewCategory: 'श्रेणी',
    reviewDescription: 'आपका विवरण',
    reviewEvidence: 'सहायक सामग्री',
    reviewEvidenceCount_one: '{{count}} वस्तु जोड़ी गई',
    reviewEvidenceCount_other: '{{count}} वस्तुएं जोड़ी गईं',
    reviewEvidenceNone: 'कोई नहीं जोड़ी गई',
    submit: 'यह शिकायत दर्ज करें',
    submitting: 'आपकी शिकायत दर्ज हो रही है…',
    submitFailed: 'शिकायत दर्ज नहीं हो सकी। दोबारा कोशिश करें।',
    prefilledTitle: 'आपकी पासबुक से भरा गया',
    prefilledHelp:
      'सेवा, श्रेणी और विवरण उस गुम अंशदान से आगे लाए गए हैं जिसे आपने देखा था।',
  },
  confirmation: {
    eyebrow: 'शिकायत दर्ज हुई',
    title: 'आपकी शिकायत दर्ज हो गई',
    subtitle: 'हल होने तक हम इस मामले को ट्रैक करेंगे।',
    viewCase: 'यह शिकायत देखें',
    viewActivity: 'गतिविधि देखें',
  },
  detail: {
    eyebrow: 'शिकायत {{reference}}',
    filedOn: 'दर्ज की गई',
    service: 'सेवा',
    category: 'श्रेणी',
    yourDescription: 'आपने क्या बताया',
    evidence: 'सहायक सामग्री',
    evidenceNone: 'कोई सहायक सामग्री नहीं जोड़ी गई।',
    checkUpdates: 'अपडेट जांचें',
    checking: 'जांच हो रही है…',
    escalate: 'यह शिकायत आगे भेजें',
    escalating: 'आगे भेजा जा रहा है…',
    escalateHelp:
      'यह मामला बिना रिकॉर्ड बदले बंद हुआ। आप इसे फिर से समीक्षा के लिए भेज सकते हैं।',
    escalatedNotice:
      'आपकी एस्केलेशन आगे भेज दी गई है। परिणाम के लिए बाद में देखें।',
    currentMeaning: 'इसका मतलब',
    notFound: 'शिकायत नहीं मिली',
  },
  meaning: {
    acknowledged: 'आपकी शिकायत मिल गई है और समीक्षा की प्रतीक्षा में है।',
    inReview: 'आपकी शिकायत की समीक्षा हो रही है।',
    disposedResolved: 'कार्यालय ने यह शिकायत बंद कर आपका रिकॉर्ड अपडेट किया।',
    disposedNoChange: 'कार्यालय ने यह शिकायत बिना रिकॉर्ड बदले बंद कर दी।',
    escalationInReview: 'आपकी एस्केलेशन की समीक्षा हो रही है।',
    escalationResolved:
      'आपकी एस्केलेशन की दोबारा समीक्षा हुई और रिकॉर्ड अपडेट हुआ।',
  },
  status: {
    ACKNOWLEDGED: 'प्राप्त',
    IN_REVIEW: 'समीक्षा में',
    DISPOSED: 'बंद',
    ESCALATED: 'एस्केलेशन समीक्षा में',
    ESCALATION_RESOLVED: 'एस्केलेशन हल',
  },
  timeline: {
    SUBMITTED: 'शिकायत दर्ज हुई',
    IN_REVIEW: 'समीक्षा जारी',
    DISPOSED: 'मामला बंद हुआ',
    ESCALATED: 'एस्केलेशन का अनुरोध',
    ESCALATION_RESOLVED: 'एस्केलेशन हल हुई',
  },
  categories: {
    REFUND_DELAY: {
      title: 'रिफंड नहीं मिला',
      help: 'आपका इनकम टैक्स रिफंड देरी से है या अपडेट नहीं दिख रहा।',
    },
    NOTICE_DISAGREEMENT: {
      title: 'नोटिस से असहमति',
      help: 'आपको लगता है कि टैक्स नोटिस या मांग गलत है।',
    },
    PAYMENT_MISMATCH: {
      title: 'भुगतान नहीं दिख रहा',
      help: 'आपका किया गया टैक्स भुगतान आपके पैन में नहीं दिख रहा।',
    },
    PORTAL_ACCESS: {
      title: 'पोर्टल या लॉगिन समस्या',
      help: 'आप इनकम टैक्स पोर्टल पर पहुंच या कोई चरण पूरा नहीं कर पाए।',
    },
    CONTRIBUTION_MISMATCH: {
      title: 'अंशदान गुम या गलत',
      help: 'आपकी पासबुक में एक माह का अंशदान गुम या गलत है।',
    },
    CLAIM_DELAY: {
      title: 'पीएफ क्लेम में देरी या अस्वीकृति',
      help: 'आपका निकासी क्लेम देरी से है या अस्वीकृत हुआ।',
    },
    KYC_CORRECTION: {
      title: 'केवाईसी या रिकॉर्ड सुधार',
      help: 'ईपीएफओ में आपके आधार, पैन या बैंक रिकॉर्ड में सुधार चाहिए।',
    },
    TRANSFER_DELAY: {
      title: 'पीएफ ट्रांसफर में देरी',
      help: 'पिछले नियोक्ता से आपका ट्रांसफर देरी से है।',
    },
    IDENTITY_MISMATCH: {
      title: 'रिकॉर्ड में विवरण अलग हैं',
      help: 'जुड़े रिकॉर्ड में आपका नाम या अन्य विवरण अलग-अलग है।',
    },
    PROPAGATION_FAILURE: {
      title: 'सुधार हर जगह अपडेट नहीं हुआ',
      help: 'आपका किया गया सुधार हर जुड़े रिकॉर्ड तक नहीं पहुंचा।',
    },
    OTHER: {
      title: 'कुछ और',
      help: 'आपकी समस्या किसी अन्य श्रेणी से मेल नहीं खाती।',
    },
  },
  process: {
    INCOME_TAX:
      'हम इसे इनकम टैक्स सीपीसी शिकायत चैनल के लिए तैयार करेंगे। सिम्युलेटेड समीक्षा में सामान्यतः 15–30 दिन लगते हैं।',
    EPFO: 'हम इसे आपके खाते वाले ईपीएफओ क्षेत्रीय कार्यालय को भेजेंगे। सिम्युलेटेड समीक्षा में सामान्यतः 15–30 दिन लगते हैं।',
    IDENTITY:
      'हम इसे उस जुड़ी सेवा तक भेजेंगे जिसे आपकी श्रेणी प्रभावित करती है। सिम्युलेटेड समीक्षा में सामान्यतः 7–15 दिन लगते हैं।',
  },
  activity: {
    submittedTitle: 'शिकायत दर्ज हुई',
    submittedDetail: 'संदर्भ {{reference}} समीक्षा की प्रतीक्षा में है।',
    disposedTitle: 'शिकायत बंद हुई',
    disposedResolvedDetail:
      'संदर्भ {{reference}} बंद हुआ और रिकॉर्ड अपडेट हुआ।',
    disposedNoChangeDetail: 'संदर्भ {{reference}} बिना रिकॉर्ड बदले बंद हुआ।',
    escalatedTitle: 'शिकायत आगे भेजी गई',
    escalatedDetail: 'संदर्भ {{reference}} को दोबारा समीक्षा के लिए भेजा गया।',
    escalationResolvedTitle: 'एस्केलेशन हल हुई',
    escalationResolvedDetail:
      'संदर्भ {{reference}} की दोबारा समीक्षा हुई और रिकॉर्ड अपडेट हुआ।',
  },
};

const grievancesBn: typeof grievancesEn = {
  centre: {
    eyebrow: 'আপনার পরিষেবাজুড়ে',
    title: 'অভিযোগ কেন্দ্র',
    subtitle:
      'ইনকাম ট্যাক্স, পিএফ ও ইপিএফও, অথবা ভাগ করা পরিচয় রেকর্ড নিয়ে দায়ের করা প্রতিটি মামলা ট্র্যাক করুন।',
    file: 'নতুন অভিযোগ দাখিল করুন',
    empty: 'কোনো অভিযোগ দাখিল হয়নি',
    emptyHelp: 'যেকোনো যুক্ত পরিষেবা নিয়ে দায়ের করা মামলা এখানে দেখাবে।',
    submittedOn: '{{date}} তারিখে দাখিল',
  },
  wizard: {
    eyebrow: 'নতুন অভিযোগ',
    serviceTitle: 'এটি কোন পরিষেবা সম্পর্কিত?',
    serviceHelp:
      'পরিষেবা বেছে নিন, অথবা আপনার বিবরণ থেকে আমাদের তা ঠিক করতে দিন।',
    unsure: 'আমি নিশ্চিত নই',
    unsureHelp: 'পরের বিবরণ থেকে আমরা এটি ঠিক করব।',
    describeTitle: 'কী ঘটেছে বলুন',
    describeHelp:
      'নিজের ভাষায় লিখুন। ফর্ম, ধারা বা নিয়ম কোড বলার প্রয়োজন নেই।',
    describePlaceholder:
      'উদাহরণ: আমার মে মাসের অবদান পিএফ পাসবইয়ে দেখাচ্ছে না।',
    describeContinue: 'চালিয়ে যান',
    categoryTitle: 'প্রস্তাবিত বিভাগ',
    categoryHelp:
      'আপনার বিবরণের ভিত্তিতে এটি সবচেয়ে কাছাকাছি বিভাগ। ঠিক না হলে বদলান।',
    categoryDetectedService: 'শনাক্ত পরিষেবা: {{service}}',
    evidenceTitle: 'সহায়ক তথ্য যোগ করুন',
    evidenceHelp:
      'প্রাসঙ্গিক কিছু যোগ করুন, যেমন বেতন স্লিপ বা স্ক্রিনশটের বিবরণ। এটি ঐচ্ছিক।',
    evidencePlaceholder: 'উদাহরণ: মে ২০২৬ পাসবই স্ক্রিনশট',
    evidenceAdd: 'যোগ করুন',
    evidenceEmpty: 'এখনও কোনো সহায়ক তথ্য যোগ করা হয়নি।',
    evidenceRemove: 'সরান',
    reviewTitle: 'দাখিলের আগে পর্যালোচনা করুন',
    reviewHelp: 'দাখিল করার আগে নিচের বিবরণ যাচাই করুন।',
    reviewService: 'পরিষেবা',
    reviewCategory: 'বিভাগ',
    reviewDescription: 'আপনার বিবরণ',
    reviewEvidence: 'সহায়ক তথ্য',
    reviewEvidenceCount_one: '{{count}}টি আইটেম যোগ হয়েছে',
    reviewEvidenceCount_other: '{{count}}টি আইটেম যোগ হয়েছে',
    reviewEvidenceNone: 'কিছু যোগ হয়নি',
    submit: 'এই অভিযোগ দাখিল করুন',
    submitting: 'আপনার অভিযোগ দাখিল হচ্ছে…',
    submitFailed: 'অভিযোগ দাখিল করা যায়নি। আবার চেষ্টা করুন।',
    prefilledTitle: 'আপনার পাসবই থেকে পূরণ করা হয়েছে',
    prefilledHelp:
      'পরিষেবা, বিভাগ ও বিবরণ আপনার দেখা হারানো অবদান থেকে বহন করা হয়েছে।',
  },
  confirmation: {
    eyebrow: 'অভিযোগ দাখিল হয়েছে',
    title: 'আপনার অভিযোগ দাখিল হয়েছে',
    subtitle: 'সমাধান না হওয়া পর্যন্ত আমরা এই মামলা ট্র্যাক করব।',
    viewCase: 'এই অভিযোগ দেখুন',
    viewActivity: 'কার্যকলাপ দেখুন',
  },
  detail: {
    eyebrow: 'অভিযোগ {{reference}}',
    filedOn: 'দাখিলের তারিখ',
    service: 'পরিষেবা',
    category: 'বিভাগ',
    yourDescription: 'আপনি যা বলেছেন',
    evidence: 'সহায়ক তথ্য',
    evidenceNone: 'কোনো সহায়ক তথ্য যোগ করা হয়নি।',
    checkUpdates: 'আপডেট দেখুন',
    checking: 'পরীক্ষা করা হচ্ছে…',
    escalate: 'এই অভিযোগ আরও পাঠান',
    escalating: 'পাঠানো হচ্ছে…',
    escalateHelp:
      'রেকর্ড না বদলেই এই মামলা বন্ধ হয়েছিল। আপনি এটি আবার পর্যালোচনার জন্য পাঠাতে পারেন।',
    escalatedNotice: 'আপনার এস্কেলেশন পাঠানো হয়েছে। ফলাফলের জন্য পরে দেখুন।',
    currentMeaning: 'এর অর্থ',
    notFound: 'অভিযোগ পাওয়া যায়নি',
  },
  meaning: {
    acknowledged: 'আপনার অভিযোগ পাওয়া গেছে এবং পর্যালোচনার অপেক্ষায় আছে।',
    inReview: 'আপনার অভিযোগ পর্যালোচনা হচ্ছে।',
    disposedResolved: 'অফিস এই অভিযোগ বন্ধ করে আপনার রেকর্ড আপডেট করেছে।',
    disposedNoChange: 'অফিস রেকর্ড না বদলেই এই অভিযোগ বন্ধ করেছে।',
    escalationInReview: 'আপনার এস্কেলেশন পর্যালোচনা হচ্ছে।',
    escalationResolved:
      'আপনার এস্কেলেশন আবার পর্যালোচনা হয়ে রেকর্ড আপডেট হয়েছে।',
  },
  status: {
    ACKNOWLEDGED: 'গৃহীত',
    IN_REVIEW: 'পর্যালোচনায়',
    DISPOSED: 'বন্ধ',
    ESCALATED: 'এস্কেলেশন পর্যালোচনায়',
    ESCALATION_RESOLVED: 'এস্কেলেশন সমাধান হয়েছে',
  },
  timeline: {
    SUBMITTED: 'অভিযোগ দাখিল হয়েছে',
    IN_REVIEW: 'পর্যালোচনা চলছে',
    DISPOSED: 'মামলা বন্ধ হয়েছে',
    ESCALATED: 'এস্কেলেশনের অনুরোধ',
    ESCALATION_RESOLVED: 'এস্কেলেশন সমাধান হয়েছে',
  },
  categories: {
    REFUND_DELAY: {
      title: 'রিফান্ড পাননি',
      help: 'আপনার ইনকাম ট্যাক্স রিফান্ড দেরি হচ্ছে বা আপডেট নেই।',
    },
    NOTICE_DISAGREEMENT: {
      title: 'নোটিসের সঙ্গে দ্বিমত',
      help: 'আপনি মনে করেন ট্যাক্স নোটিস বা দাবি ভুল।',
    },
    PAYMENT_MISMATCH: {
      title: 'পেমেন্ট দেখাচ্ছে না',
      help: 'আপনার করা ট্যাক্স পেমেন্ট আপনার প্যানে দেখাচ্ছে না।',
    },
    PORTAL_ACCESS: {
      title: 'পোর্টাল বা লগইন সমস্যা',
      help: 'আপনি ইনকাম ট্যাক্স পোর্টালে ঢুকতে বা কোনো ধাপ শেষ করতে পারেননি।',
    },
    CONTRIBUTION_MISMATCH: {
      title: 'অবদান হারানো বা ভুল',
      help: 'আপনার পাসবইয়ে একটি মাসের অবদান হারানো বা ভুল।',
    },
    CLAIM_DELAY: {
      title: 'পিএফ দাবিতে দেরি বা প্রত্যাখ্যান',
      help: 'আপনার তোলার দাবি দেরি হচ্ছে বা প্রত্যাখ্যাত হয়েছে।',
    },
    KYC_CORRECTION: {
      title: 'কেওয়াইসি বা রেকর্ড সংশোধন',
      help: 'ইপিএফওতে আপনার আধার, প্যান বা ব্যাংক রেকর্ড সংশোধন দরকার।',
    },
    TRANSFER_DELAY: {
      title: 'পিএফ ট্রান্সফারে দেরি',
      help: 'আগের নিয়োগকর্তা থেকে আপনার ট্রান্সফার দেরি হচ্ছে।',
    },
    IDENTITY_MISMATCH: {
      title: 'রেকর্ডজুড়ে বিবরণ আলাদা',
      help: 'যুক্ত রেকর্ডে আপনার নাম বা অন্য বিবরণ আলাদা।',
    },
    PROPAGATION_FAILURE: {
      title: 'সংশোধন সব জায়গায় আপডেট হয়নি',
      help: 'আপনার করা সংশোধন প্রতিটি যুক্ত রেকর্ডে পৌঁছায়নি।',
    },
    OTHER: {
      title: 'অন্য কিছু',
      help: 'আপনার সমস্যা অন্য কোনো বিভাগের সঙ্গে মেলে না।',
    },
  },
  process: {
    INCOME_TAX:
      'আমরা এটি ইনকাম ট্যাক্স সিপিসি অভিযোগ চ্যানেলের জন্য প্রস্তুত করব। সিমুলেটেড পর্যালোচনায় সাধারণত ১৫–৩০ দিন লাগে।',
    EPFO: 'আমরা এটি আপনার অ্যাকাউন্ট পরিচালনাকারী ইপিএফও আঞ্চলিক অফিসে পাঠাব। সিমুলেটেড পর্যালোচনায় সাধারণত ১৫–৩০ দিন লাগে।',
    IDENTITY:
      'আপনার বিভাগ যে যুক্ত পরিষেবাকে প্রভাবিত করে সেখানে আমরা এটি পাঠাব। সিমুলেটেড পর্যালোচনায় সাধারণত ৭–১৫ দিন লাগে।',
  },
  activity: {
    submittedTitle: 'অভিযোগ দাখিল হয়েছে',
    submittedDetail: 'রেফারেন্স {{reference}} পর্যালোচনার অপেক্ষায়।',
    disposedTitle: 'অভিযোগ বন্ধ হয়েছে',
    disposedResolvedDetail:
      'রেফারেন্স {{reference}} বন্ধ হয়েছে এবং রেকর্ড আপডেট হয়েছে।',
    disposedNoChangeDetail:
      'রেফারেন্স {{reference}} রেকর্ড না বদলেই বন্ধ হয়েছে।',
    escalatedTitle: 'অভিযোগ এস্কেলেট হয়েছে',
    escalatedDetail:
      'রেফারেন্স {{reference}} দ্বিতীয় পর্যালোচনার জন্য পাঠানো হয়েছে।',
    escalationResolvedTitle: 'এস্কেলেশন সমাধান হয়েছে',
    escalationResolvedDetail:
      'রেফারেন্স {{reference}} আবার পর্যালোচনা হয়ে রেকর্ড আপডেট হয়েছে।',
  },
};

export { grievancesBn, grievancesEn, grievancesHi };
