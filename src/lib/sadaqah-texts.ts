import type { TransLang } from "@/lib/islamic-content";

export const SADAQAH_FORM_TEXTS: Record<TransLang, {
  addSadaqah: string;
  amount: string;
  date: string;
  category: string;
  notesOptional: string;
  notesPlaceholder: string;
  recordSadaqah: string;
  successMessage: string;
}> = {
  en: { addSadaqah: "Add Sadaqah", amount: "Amount", date: "Date", category: "Category", notesOptional: "Notes (optional)", notesPlaceholder: "e.g. Donated to local food bank", recordSadaqah: "Record Sadaqah", successMessage: "Sadaqah recorded! May Allah accept it." },
  bn: { addSadaqah: "সাদাকাহ যোগ করুন", amount: "পরিমাণ", date: "তারিখ", category: "বিভাগ", notesOptional: "নোট (ঐচ্ছিক)", notesPlaceholder: "যেমন: স্থানীয় ফুড ব্যাংকে দান", recordSadaqah: "সাদাকাহ রেকর্ড করুন", successMessage: "সাদাকাহ রেকর্ড হয়েছে! আল্লাহ কবুল করুন।" },
  ur: { addSadaqah: "صدقہ شامل کریں", amount: "رقم", date: "تاریخ", category: "زمرہ", notesOptional: "نوٹس (اختیاری)", notesPlaceholder: "مثلاً: مقامی فوڈ بینک میں عطیہ", recordSadaqah: "صدقہ ریکارڈ کریں", successMessage: "صدقہ ریکارڈ ہو گیا! اللہ قبول فرمائے۔" },
  ar: { addSadaqah: "إضافة صدقة", amount: "المبلغ", date: "التاريخ", category: "الفئة", notesOptional: "ملاحظات (اختياري)", notesPlaceholder: "مثال: تبرع لبنك الطعام المحلي", recordSadaqah: "تسجيل الصدقة", successMessage: "تم تسجيل الصدقة! تقبل الله منا ومنكم." },
  tr: { addSadaqah: "Sadaka Ekle", amount: "Miktar", date: "Tarih", category: "Kategori", notesOptional: "Notlar (isteğe bağlı)", notesPlaceholder: "örn. Yerel gıda bankasına bağış", recordSadaqah: "Sadaka Kaydet", successMessage: "Sadaka kaydedildi! Allah kabul etsin." },
  ms: { addSadaqah: "Tambah Sedekah", amount: "Jumlah", date: "Tarikh", category: "Kategori", notesOptional: "Nota (pilihan)", notesPlaceholder: "cth. Derma kepada bank makanan", recordSadaqah: "Rekod Sedekah", successMessage: "Sedekah direkodkan! Semoga Allah terima." },
  id: { addSadaqah: "Tambah Sedekah", amount: "Jumlah", date: "Tanggal", category: "Kategori", notesOptional: "Catatan (opsional)", notesPlaceholder: "cth. Donasi ke bank makanan lokal", recordSadaqah: "Catat Sedekah", successMessage: "Sedekah tercatat! Semoga Allah menerima." },
};

export const SADAQAH_CATEGORY_LABELS: Record<TransLang, Record<string, string>> = {
  en: { Food: "Food", Education: "Education", Medical: "Medical", Orphans: "Orphans", Masjid: "Masjid", "Emergency Relief": "Emergency", General: "General" },
  bn: { Food: "খাদ্য", Education: "শিক্ষা", Medical: "চিকিৎসা", Orphans: "এতিম", Masjid: "মসজিদ", "Emergency Relief": "জরুরি", General: "সাধারণ" },
  ur: { Food: "خوراک", Education: "تعلیم", Medical: "طبی", Orphans: "یتیم", Masjid: "مسجد", "Emergency Relief": "ہنگامی", General: "عام" },
  ar: { Food: "طعام", Education: "تعليم", Medical: "طبي", Orphans: "أيتام", Masjid: "مسجد", "Emergency Relief": "إغاثة", General: "عام" },
  tr: { Food: "Gıda", Education: "Eğitim", Medical: "Sağlık", Orphans: "Yetimler", Masjid: "Cami", "Emergency Relief": "Acil", General: "Genel" },
  ms: { Food: "Makanan", Education: "Pendidikan", Medical: "Perubatan", Orphans: "Anak Yatim", Masjid: "Masjid", "Emergency Relief": "Kecemasan", General: "Umum" },
  id: { Food: "Makanan", Education: "Pendidikan", Medical: "Medis", Orphans: "Yatim", Masjid: "Masjid", "Emergency Relief": "Darurat", General: "Umum" },
};

export const SADAQAH_STATS_TEXTS: Record<TransLang, {
  thisMonth: string;
  thisYear: string;
  totalDonations: string;
  monthlyTotals: string;
  byCategory: string;
}> = {
  en: { thisMonth: "This Month", thisYear: "This Year", totalDonations: "Total Donations", monthlyTotals: "Monthly Totals", byCategory: "By Category" },
  bn: { thisMonth: "এই মাস", thisYear: "এই বছর", totalDonations: "মোট দান", monthlyTotals: "মাসিক মোট", byCategory: "বিভাগ অনুযায়ী" },
  ur: { thisMonth: "اس مہینے", thisYear: "اس سال", totalDonations: "کل عطیات", monthlyTotals: "ماہانہ کل", byCategory: "زمرے کے مطابق" },
  ar: { thisMonth: "هذا الشهر", thisYear: "هذا العام", totalDonations: "إجمالي التبرعات", monthlyTotals: "الإجمالي الشهري", byCategory: "حسب الفئة" },
  tr: { thisMonth: "Bu Ay", thisYear: "Bu Yıl", totalDonations: "Toplam Bağışlar", monthlyTotals: "Aylık Toplamlar", byCategory: "Kategoriye Göre" },
  ms: { thisMonth: "Bulan Ini", thisYear: "Tahun Ini", totalDonations: "Jumlah Derma", monthlyTotals: "Jumlah Bulanan", byCategory: "Mengikut Kategori" },
  id: { thisMonth: "Bulan Ini", thisYear: "Tahun Ini", totalDonations: "Total Donasi", monthlyTotals: "Total Bulanan", byCategory: "Per Kategori" },
};

export const SADAQAH_LIST_TEXTS: Record<TransLang, {
  noDonationsYet: string;
  noDonationsDesc: string;
  donationHistory: string;
  donation: string;
  donations: string;
  charityHadith: string;
}> = {
  en: { noDonationsYet: "No donations yet", noDonationsDesc: "Start recording your Sadaqah to track your generosity and earn continuous rewards.", donationHistory: "Donation History", donation: "donation", donations: "donations", charityHadith: "Charity does not decrease wealth." },
  bn: { noDonationsYet: "এখনো কোনো দান নেই", noDonationsDesc: "আপনার সাদাকাহ রেকর্ড করা শুরু করুন এবং অবিরত সওয়াব অর্জন করুন।", donationHistory: "দানের ইতিহাস", donation: "টি দান", donations: "টি দান", charityHadith: "সাদাকাহ সম্পদ কমায় না।" },
  ur: { noDonationsYet: "ابھی تک کوئی عطیہ نہیں", noDonationsDesc: "اپنا صدقہ ریکارڈ کرنا شروع کریں اور مسلسل ثواب حاصل کریں۔", donationHistory: "عطیات کی تاریخ", donation: "عطیہ", donations: "عطیات", charityHadith: "صدقہ مال میں کمی نہیں کرتا۔" },
  ar: { noDonationsYet: "لا توجد تبرعات بعد", noDonationsDesc: "ابدأ بتسجيل صدقاتك لتتبع عطاءك وكسب الأجر المستمر.", donationHistory: "سجل التبرعات", donation: "تبرع", donations: "تبرعات", charityHadith: "ما نقصت صدقة من مال." },
  tr: { noDonationsYet: "Henüz bağış yok", noDonationsDesc: "Cömertliğinizi takip etmek ve sürekli sevap kazanmak için sadakanızı kaydetmeye başlayın.", donationHistory: "Bağış Geçmişi", donation: "bağış", donations: "bağış", charityHadith: "Sadaka malı eksiltmez." },
  ms: { noDonationsYet: "Belum ada derma", noDonationsDesc: "Mula merekodkan sedekah anda untuk menjejak kemurahan hati dan mendapat ganjaran berterusan.", donationHistory: "Sejarah Derma", donation: "derma", donations: "derma", charityHadith: "Sedekah tidak mengurangi harta." },
  id: { noDonationsYet: "Belum ada donasi", noDonationsDesc: "Mulai mencatat sedekah Anda untuk melacak kedermawanan dan mendapat pahala berkelanjutan.", donationHistory: "Riwayat Donasi", donation: "donasi", donations: "donasi", charityHadith: "Sedekah tidak mengurangi harta." },
};
