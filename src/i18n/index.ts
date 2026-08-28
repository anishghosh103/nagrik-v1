import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { epfoBn, epfoEn, epfoHi } from './epfo';
import { taxBn, taxEn, taxHi } from './tax';

const en = {
  nav: {
    home: 'Home',
    actions: 'Action Centre',
    identity: 'Identity',
    tax: 'Income Tax',
    epfo: 'PF & EPFO',
    activity: 'Activity',
    profile: 'Profile',
  },
  common: {
    prototype: 'Prototype',
    back: 'Back',
    continue: 'Continue',
    review: 'Review and fix',
    details: 'Details',
    source: 'Source',
    retry: 'Try again',
    saved: 'Saved locally',
    lastUpdated: 'Last updated',
    signOut: 'Sign out',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    remove: 'Remove',
    confirmed: 'Confirmed',
  },
  home: {
    eyebrow: 'Good afternoon',
    title: 'Your money tasks, in one place',
    subtitle: 'Start with the issue that affects the most services.',
    priority: 'Priority action',
    identity: 'Financial identity',
    connected: 'connected sources',
    services: 'Your services',
    recent: 'Recent activity',
    healthy: 'Your connected records agree.',
    issue: 'One difference needs attention.',
  },
  identity: {
    title: 'Check your financial identity',
    subtitle:
      'Compare the name, mobile and bank details held by connected services.',
    score: 'Identity health',
    field: 'Field',
    attention: 'Needs attention',
    consistent: 'Consistent',
    mismatchTitle: 'Choose the name that is yours',
    mismatchSubtitle:
      'This difference can block a PF claim and delay bank validation for an Income Tax refund.',
    canonical: 'Use this name everywhere',
    propagation: 'We will update these simulated records',
    confirm: 'Update connected records',
    success: 'Your name is consistent now',
    successBody:
      'Five connected records were updated and your PF claim checks were rerun.',
    receipt: 'Change receipt',
    changedFrom: 'Different values replaced',
    changedTo: 'Chosen value',
    viewPf: 'Continue to PF claim checks',
  },
  epfo: {
    title: 'PF claim doctor',
    subtitle:
      'Know what may block your final settlement claim before you fill it in.',
    balance: 'Estimated PF balance',
    run: 'Run claim checks',
    ready: 'Your claim is ready to review',
    blocked: 'One check is blocking this claim',
    notGuarantee:
      'Readiness means the information passed these prototype checks. It is not an approval guarantee.',
    passed: 'Passed checks',
    failed: 'Needs action',
    claimAmount: 'Claim amount',
    bank: 'Destination bank account',
    declaration:
      'I confirm these fictional details and understand this is a simulated submission.',
    otp: 'Mock OTP',
    otpHint: 'Use 123456',
    submit: 'Submit mock PF claim',
    received: 'Your PF claim was received',
    expected: 'EPFO validation is expected next, usually within about 9 days.',
    track: 'Track this claim',
    reference: 'Claim reference',
    ...epfoEn,
  },
  tax: taxEn,
  activity: {
    title: 'Activity and status',
    subtitle: 'A traceable history across identity and PF services.',
    current: 'Current status',
    next: 'Next expected event: service validation',
    currentStates: {
      transfer: 'PF transfer received — employer review is expected next.',
      claim: 'PF claim received — validation is expected next.',
      identity:
        'Identity correction is needed before the PF claim can continue.',
      taxVerificationPending:
        'Income Tax return filed — e-verification is expected next.',
      taxDraftInProgress: 'An Income Tax return draft is in progress.',
      taxNotice: 'An Income Tax notice has one required corrective action.',
      refundDelayed:
        'An Income Tax refund is waiting for bank-linkage revalidation.',
      ready: 'PF claim checks are ready to review.',
    },
    events: {
      correctionComplete: 'Identity correction complete',
      correctionDetail: 'The selected value reached every simulated source.',
      claimReceived: 'PF claim received',
      claimReceivedDetail:
        'Reference {{reference}} is awaiting EPFO validation.',
      transferReceived: 'PF transfer received',
      transferReceivedDetail:
        'Reference {{reference}} is awaiting employer review.',
      nominationEffective: 'PF nomination effective',
      nominationEffectiveDetail:
        'The complete nominee allocation was mock-verified.',
      serviceDatesUpdated: 'Employment dates corrected',
      serviceDatesUpdatedDetail:
        '{{employer}} will be rechecked in dependent PF journeys.',
      taxFiled: 'Income Tax return filed',
      taxFiledDetail: 'Reference {{reference}} is awaiting e-verification.',
      noticeReceived: 'Income Tax notice received',
      noticeReceivedDetail:
        'A simulated section {{section}} notice needs one corrective action.',
      noticeResolved: 'Income Tax notice resolved',
      noticeResolvedDetail:
        'The required action for section {{section}} completed.',
      precheckAttention: 'PF pre-check flagged attention needed',
      nameBlocksClaim:
        'A name mismatch across connected records is blocking claim readiness.',
    },
  },
  rules: {
    name: {
      fail: 'Your name differs between identity and EPFO records.',
      pass: 'Name matches across connected records.',
    },
    pan: { pass: 'PAN KYC is valid.' },
    aadhaar: { pass: 'Aadhaar KYC is linked.' },
    bank: { pass: 'Bank KYC matches the claim destination.' },
    exit: {
      pass: 'Your employment exit date is present.',
      fail: 'The previous employment exit date is missing.',
    },
    overlap: {
      pass: 'No overlapping service dates were found.',
      fail: 'The previous and current employment dates overlap.',
    },
    eligibility: { pass: 'A final settlement claim can be started.' },
    transfer: {
      selectionPass: 'Previous and current employment records are selected.',
      selectionFail: 'Select distinct previous and current employment records.',
    },
  },
  actions: {
    taxNotice: {
      title: 'Respond to your section {{section}} notice',
      consequenceDefault:
        'Nagrik found one required action and preserved the filed return behind it.',
      consequenceSubmitted:
        'Your correction request is submitted. Check for the department outcome.',
      source: 'Simulated Income Tax notice {{reference}}',
    },
    refundDelayed: {
      title: 'Recheck your refund bank linkage',
      consequence:
        'Your refund is paused until the selected bank account is linked and validated.',
      source: 'Income Tax refund and bank validation records',
    },
    identityMismatch: {
      title: 'Correct your name across connected records',
      consequence:
        'This difference can block your PF claim and delay Income Tax bank validation.',
      source: 'Aadhaar, PAN, bank, EPFO and Income Tax records',
    },
    pfReady: {
      title: 'Your PF claim checks are ready',
      consequence:
        'Review the checks and decide whether to submit a final settlement claim.',
      source: 'EPFO and identity records',
    },
    taxDraft: {
      title: 'Continue your Income Tax return',
      consequence:
        'Your Income Tax return has unsaved sections that still need review before filing.',
      source: 'Income Tax draft',
    },
  },
};

const hi = {
  nav: {
    home: 'होम',
    actions: 'कार्य केंद्र',
    identity: 'पहचान',
    tax: 'आयकर',
    epfo: 'पीएफ और ईपीएफओ',
    activity: 'गतिविधि',
    profile: 'प्रोफ़ाइल',
  },
  common: {
    prototype: 'प्रोटोटाइप',
    back: 'पीछे',
    continue: 'आगे बढ़ें',
    review: 'जाँचें और सुधारें',
    details: 'विवरण',
    source: 'स्रोत',
    retry: 'फिर कोशिश करें',
    saved: 'स्थानीय रूप से सहेजा गया',
    lastUpdated: 'अंतिम अपडेट',
    signOut: 'साइन आउट',
    close: 'बंद करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    remove: 'हटाएँ',
    confirmed: 'पुष्टि हो गई',
  },
  home: {
    eyebrow: 'नमस्कार',
    title: 'आपके सभी धन संबंधी काम एक जगह',
    subtitle: 'सबसे अधिक सेवाओं को प्रभावित करने वाले मुद्दे से शुरू करें।',
    priority: 'प्राथमिक काम',
    identity: 'वित्तीय पहचान',
    connected: 'जुड़े स्रोत',
    services: 'आपकी सेवाएँ',
    recent: 'हाल की गतिविधि',
    healthy: 'आपके जुड़े रिकॉर्ड मेल खाते हैं।',
    issue: 'एक अंतर पर ध्यान देना है।',
  },
  identity: {
    title: 'अपनी वित्तीय पहचान जाँचें',
    subtitle: 'जुड़ी सेवाओं में दर्ज नाम, मोबाइल और बैंक विवरण की तुलना करें।',
    score: 'पहचान स्वास्थ्य',
    field: 'फ़ील्ड',
    attention: 'ध्यान देना है',
    consistent: 'सही',
    mismatchTitle: 'अपना सही नाम चुनें',
    mismatchSubtitle:
      'यह अंतर पीएफ दावा रोक सकता है और आयकर रिफंड के बैंक सत्यापन में देरी कर सकता है।',
    canonical: 'यह नाम हर जगह उपयोग करें',
    propagation: 'हम इन सिम्युलेटेड रिकॉर्ड को अपडेट करेंगे',
    confirm: 'जुड़े रिकॉर्ड अपडेट करें',
    success: 'अब आपका नाम एक जैसा है',
    successBody: 'पाँच जुड़े रिकॉर्ड अपडेट हुए और पीएफ दावा जाँच फिर चली।',
    receipt: 'बदलाव की रसीद',
    changedFrom: 'बदले गए अलग मान',
    changedTo: 'चुना गया मान',
    viewPf: 'पीएफ दावा जाँच जारी रखें',
  },
  epfo: {
    title: 'पीएफ क्लेम डॉक्टर',
    subtitle: 'अंतिम निपटान दावा भरने से पहले जानें कि क्या रुकावट हो सकती है।',
    balance: 'अनुमानित पीएफ शेष',
    run: 'दावे की जाँच चलाएँ',
    ready: 'आपका दावा समीक्षा के लिए तैयार है',
    blocked: 'एक जाँच इस दावे को रोक रही है',
    notGuarantee:
      'तैयारी का अर्थ है कि जानकारी ने ये प्रोटोटाइप जाँच पास कीं। यह मंज़ूरी की गारंटी नहीं है।',
    passed: 'पास जाँच',
    failed: 'कार्रवाई चाहिए',
    claimAmount: 'दावा राशि',
    bank: 'गंतव्य बैंक खाता',
    declaration:
      'मैं इन काल्पनिक विवरणों की पुष्टि करता हूँ और समझता हूँ कि यह सिम्युलेटेड सबमिशन है।',
    otp: 'मॉक ओटीपी',
    otpHint: '123456 उपयोग करें',
    submit: 'मॉक पीएफ दावा भेजें',
    received: 'आपका पीएफ दावा मिला',
    expected: 'अगला चरण ईपीएफओ सत्यापन है, आम तौर पर लगभग 9 दिनों में।',
    track: 'दावा ट्रैक करें',
    reference: 'दावा संदर्भ',
    ...epfoHi,
  },
  tax: taxHi,
  activity: {
    ...en.activity,
    title: 'गतिविधि और स्थिति',
    subtitle: 'पहचान और पीएफ सेवाओं का पता लगाने योग्य इतिहास।',
    current: 'वर्तमान स्थिति',
    next: 'अगला अपेक्षित चरण: सेवा सत्यापन',
  },
  rules: {
    ...en.rules,
    overlap: {
      pass: 'सेवा तारीखों में कोई ओवरलैप नहीं मिला।',
      fail: 'पिछली और वर्तमान नौकरी की तारीखें ओवरलैप करती हैं।',
    },
    exit: {
      pass: 'नौकरी छोड़ने की तारीख दर्ज है।',
      fail: 'पिछली नौकरी छोड़ने की तारीख नहीं है।',
    },
  },
  actions: {
    taxNotice: {
      title: 'अपने सेक्शन {{section}} नोटिस का जवाब दें',
      consequenceDefault:
        'नागरिक को एक ज़रूरी कार्रवाई मिली है और भरा गया रिटर्न उसके पीछे सुरक्षित रखा गया है।',
      consequenceSubmitted:
        'आपका सुधार अनुरोध भेजा जा चुका है। विभाग के परिणाम की जाँच करें।',
      source: 'सिम्युलेटेड आयकर नोटिस {{reference}}',
    },
    refundDelayed: {
      title: 'अपना रिफंड बैंक लिंकेज फिर जाँचें',
      consequence:
        'चुना गया बैंक खाता लिंक और सत्यापित होने तक आपका रिफंड रुका है।',
      source: 'आयकर रिफंड और बैंक सत्यापन रिकॉर्ड',
    },
    identityMismatch: {
      title: 'जुड़े रिकॉर्ड में अपना नाम सुधारें',
      consequence:
        'यह अंतर आपके पीएफ दावे को रोक सकता है और आयकर के बैंक सत्यापन में देरी कर सकता है।',
      source: 'आधार, पैन, बैंक, ईपीएफओ और आयकर रिकॉर्ड',
    },
    pfReady: {
      title: 'आपकी पीएफ दावा जाँच तैयार है',
      consequence:
        'जाँच की समीक्षा करें और तय करें कि अंतिम निपटान दावा भेजना है या नहीं।',
      source: 'ईपीएफओ और पहचान रिकॉर्ड',
    },
    taxDraft: {
      title: 'अपना आयकर रिटर्न जारी रखें',
      consequence:
        'आपके आयकर रिटर्न में कुछ सेक्शन अभी भी समीक्षा और सुरक्षित करने बाकी हैं।',
      source: 'आयकर ड्राफ्ट',
    },
  },
};

const bn = {
  nav: {
    home: 'হোম',
    actions: 'করণীয়',
    identity: 'পরিচয়',
    tax: 'আয়কর',
    epfo: 'পিএফ ও ইপিএফও',
    activity: 'কার্যকলাপ',
    profile: 'প্রোফাইল',
  },
  common: {
    prototype: 'প্রোটোটাইপ',
    back: 'ফিরুন',
    continue: 'এগিয়ে যান',
    review: 'দেখুন ও ঠিক করুন',
    details: 'বিস্তারিত',
    source: 'উৎস',
    retry: 'আবার চেষ্টা করুন',
    saved: 'স্থানীয়ভাবে সংরক্ষিত',
    lastUpdated: 'শেষ আপডেট',
    signOut: 'সাইন আউট',
    close: 'বন্ধ করুন',
    cancel: 'বাতিল',
    save: 'সংরক্ষণ করুন',
    remove: 'সরান',
    confirmed: 'নিশ্চিত',
  },
  home: {
    eyebrow: 'নমস্কার',
    title: 'আপনার অর্থসংক্রান্ত কাজ এক জায়গায়',
    subtitle:
      'যে সমস্যাটি সবচেয়ে বেশি পরিষেবাকে প্রভাবিত করে সেটি দিয়ে শুরু করুন।',
    priority: 'প্রধান করণীয়',
    identity: 'আর্থিক পরিচয়',
    connected: 'সংযুক্ত উৎস',
    services: 'আপনার পরিষেবা',
    recent: 'সাম্প্রতিক কার্যকলাপ',
    healthy: 'আপনার সংযুক্ত রেকর্ডগুলি মিলছে।',
    issue: 'একটি অমিল দেখা দরকার।',
  },
  identity: {
    title: 'আপনার আর্থিক পরিচয় পরীক্ষা করুন',
    subtitle:
      'সংযুক্ত পরিষেবায় থাকা নাম, মোবাইল এবং ব্যাঙ্কের তথ্য তুলনা করুন।',
    score: 'পরিচয়ের স্বাস্থ্য',
    field: 'তথ্য',
    attention: 'দেখা দরকার',
    consistent: 'সঠিক',
    mismatchTitle: 'আপনার সঠিক নামটি বেছে নিন',
    mismatchSubtitle:
      'এই অমিল পিএফ দাবি আটকাতে এবং আয়কর রিফান্ডের ব্যাঙ্ক যাচাই দেরি করাতে পারে।',
    canonical: 'সব জায়গায় এই নাম ব্যবহার করুন',
    propagation: 'আমরা এই সিমুলেটেড রেকর্ডগুলি আপডেট করব',
    confirm: 'সংযুক্ত রেকর্ড আপডেট করুন',
    success: 'এখন আপনার নাম সব জায়গায় এক',
    successBody:
      'পাঁচটি সংযুক্ত রেকর্ড আপডেট হয়েছে এবং পিএফ দাবির পরীক্ষা আবার হয়েছে।',
    receipt: 'পরিবর্তনের রসিদ',
    changedFrom: 'বদলে দেওয়া আলাদা নাম',
    changedTo: 'বেছে নেওয়া নাম',
    viewPf: 'পিএফ দাবির পরীক্ষা চালিয়ে যান',
  },
  epfo: {
    title: 'পিএফ ক্লেম ডক্টর',
    subtitle: 'চূড়ান্ত নিষ্পত্তির দাবি পূরণের আগে কী বাধা হতে পারে জানুন।',
    balance: 'আনুমানিক পিএফ ব্যালান্স',
    run: 'দাবির পরীক্ষা চালান',
    ready: 'আপনার দাবি পর্যালোচনার জন্য প্রস্তুত',
    blocked: 'একটি পরীক্ষা এই দাবি আটকাচ্ছে',
    notGuarantee:
      'প্রস্তুত মানে তথ্যটি এই প্রোটোটাইপ পরীক্ষায় পাস করেছে। এটি অনুমোদনের নিশ্চয়তা নয়।',
    passed: 'পাস করা পরীক্ষা',
    failed: 'পদক্ষেপ দরকার',
    claimAmount: 'দাবির পরিমাণ',
    bank: 'গন্তব্য ব্যাঙ্ক অ্যাকাউন্ট',
    declaration:
      'আমি এই কাল্পনিক তথ্য নিশ্চিত করছি এবং বুঝছি এটি একটি সিমুলেটেড জমা।',
    otp: 'মক ওটিপি',
    otpHint: '123456 ব্যবহার করুন',
    submit: 'মক পিএফ দাবি জমা দিন',
    received: 'আপনার পিএফ দাবি গৃহীত হয়েছে',
    expected: 'এরপর ইপিএফও যাচাই হবে, সাধারণত প্রায় ৯ দিনের মধ্যে।',
    track: 'দাবিটি ট্র্যাক করুন',
    reference: 'দাবির রেফারেন্স',
    ...epfoBn,
  },
  tax: taxBn,
  activity: {
    ...en.activity,
    title: 'কার্যকলাপ ও অবস্থা',
    subtitle: 'পরিচয় ও পিএফ পরিষেবা জুড়ে অনুসরণযোগ্য ইতিহাস।',
    current: 'বর্তমান অবস্থা',
    next: 'পরবর্তী প্রত্যাশিত ধাপ: পরিষেবা যাচাই',
  },
  rules: {
    ...en.rules,
    overlap: {
      pass: 'পরিষেবার তারিখে কোনও ওভারল্যাপ নেই।',
      fail: 'আগের ও বর্তমান চাকরির তারিখ ওভারল্যাপ করছে।',
    },
    exit: {
      pass: 'চাকরি ছাড়ার তারিখ আছে।',
      fail: 'আগের চাকরি ছাড়ার তারিখ নেই।',
    },
  },
  actions: {
    taxNotice: {
      title: 'আপনার সেকশন {{section}} নোটিসের জবাব দিন',
      consequenceDefault:
        'নাগরিক একটি প্রয়োজনীয় পদক্ষেপ খুঁজে পেয়েছে এবং জমা দেওয়া রিটার্ন তার পিছনে সুরক্ষিত রেখেছে।',
      consequenceSubmitted:
        'আপনার সংশোধন অনুরোধ জমা হয়েছে। বিভাগের ফলাফলের জন্য দেখুন।',
      source: 'সিমুলেটেড আয়কর নোটিস {{reference}}',
    },
    refundDelayed: {
      title: 'আপনার রিফান্ড ব্যাঙ্ক লিঙ্কেজ আবার পরীক্ষা করুন',
      consequence:
        'নির্বাচিত ব্যাঙ্ক অ্যাকাউন্ট লিঙ্ক ও যাচাই না হওয়া পর্যন্ত আপনার রিফান্ড থেমে আছে।',
      source: 'আয়কর রিফান্ড ও ব্যাঙ্ক যাচাই রেকর্ড',
    },
    identityMismatch: {
      title: 'সংযুক্ত রেকর্ড জুড়ে আপনার নাম ঠিক করুন',
      consequence:
        'এই অমিল আপনার পিএফ দাবি আটকাতে এবং আয়কর ব্যাঙ্ক যাচাই দেরি করাতে পারে।',
      source: 'আধার, প্যান, ব্যাঙ্ক, ইপিএফও ও আয়কর রেকর্ড',
    },
    pfReady: {
      title: 'আপনার পিএফ দাবির পরীক্ষা প্রস্তুত',
      consequence:
        'পরীক্ষাগুলি দেখুন এবং ঠিক করুন চূড়ান্ত নিষ্পত্তির দাবি জমা দেবেন কিনা।',
      source: 'ইপিএফও ও পরিচয় রেকর্ড',
    },
    taxDraft: {
      title: 'আপনার আয়কর রিটার্ন চালিয়ে যান',
      consequence:
        'আপনার আয়কর রিটার্নে এমন সেকশন আছে যা জমা দেওয়ার আগে দেখা দরকার।',
      source: 'আয়কর খসড়া',
    },
  },
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    bn: { translation: bn },
  },
  lng: localStorage.getItem('nagrik:language') ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});
export default i18n;
