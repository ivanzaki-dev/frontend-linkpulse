/** Teks UI customer — bahasa awam (ID). */

export const statusLabel: Record<string, string> = {
  // Order / payment
  pending: 'Menunggu bayar',
  awaiting_payment: 'Menunggu bayar',
  paid: 'Sudah dibayar',
  processing: 'Sedang dicek',
  completed: 'Selesai',
  failed: 'Gagal',
  queued: 'Antrian',
  claimed: 'Sedang diproses',
  ready: 'Siap',
  loading: 'Memuat…',
};

export const copy = {
  landing: {
    badge: 'Perkiraan waktu ½–2 menit',
    title: 'Cek link Shopee dari video YouTube Anda — dalam hitungan menit.',
    subtitle:
      'Tempel link video YouTube. Kami cari link Shopee di video tersebut, lalu Anda bisa pesan laporan PDF: link masih aktif atau sudah tidak berlaku.',
    ctaPreview: 'Cek link gratis dulu',
    ctaLogin: 'Masuk',
    sampleTitle: 'Contoh ringkasan harga',
  },
  order: {
    title: 'Pesan pengecekan baru',
    subtitle: 'Tempel link video YouTube (maksimal 20 video per pesanan).',
    videos: 'Daftar video',
    addVideo: '+ Tambah video',
    voucherLabel: 'Kode voucher (opsional)',
    voucherHint: 'Kode akan dipakai setelah ringkasan link selesai.',
    infoTitle: 'Apa yang terjadi berikutnya?',
    infoBody:
      'Kami akan mengumpulkan link Shopee dari video Anda. Biasanya selesai dalam 1–3 menit. Halaman ini akan memperbarui sendiri.',
    footerNone: 'Minimal 1 link video',
    footerReady: (n: number) => `${n} video siap dicek`,
    submit: 'Mulai cek link',
    errorCreate: 'Gagal memulai pengecekan. Coba lagi.',
  },
  preview: {
    title: 'Ringkasan link Shopee',
    back: '← Kembali',
    waitingTitle: 'Sedang mengumpulkan link…',
    waitingHint: 'Mohon tunggu. Halaman akan memperbarui otomatis.',
    failedTitle: 'Pengecekan gagal',
    failedDefault: 'Tidak dapat mengambil link dari video. Periksa URL atau coba lagi.',
    doneTitle: (n: number) => `Selesai — ditemukan ${n} link Shopee`,
    doneHint: 'Periksa rincian per video, lalu lanjut ke pembayaran.',
    tableVideo: 'Video',
    tableLinks: 'Jumlah link',
    tableSubtotal: 'Subtotal',
    checkout: 'Lanjut ke pembayaran',
    pricingNote: 'Diskon promo dan voucher sudah dihitung otomatis.',
    errorLoad: 'Gagal memuat ringkasan.',
    errorOrder: 'Gagal membuat pesanan.',
  },
  checkout: {
    title: 'Pembayaran',
    payTitle: 'Bayar pesanan',
    paySim: 'Bayar sekarang (mode uji)',
    paySimHint:
      'Saat ini pembayaran masih simulasi untuk pengujian. Pembayaran QR/transfer bank (Mayar) akan aktif sebelum rilis publik.',
    cancel: 'Batalkan',
    statusLabel: 'Status pesanan',
    afterPay:
      'Setelah bayar, tim kami akan memeriksa setiap link Shopee dan menyiapkan laporan PDF untuk Anda.',
    errorLoad: 'Gagal memuat pesanan.',
    errorPay: 'Pembayaran gagal. Coba lagi.',
  },
  orderStatus: {
    title: 'Status pesanan',
    back: '← Riwayat',
    progressScreenshots: (done: number, total: number) =>
      `Membuka halaman produk: ${done} dari ${total}`,
    progressAnalysis: (done: number, total: number) =>
      `Menganalisis hasil: ${done} dari ${total}`,
    progressHint: 'Halaman diperbarui otomatis setiap beberapa detik.',
    doneTitle: 'Pesanan selesai',
    doneSummary: (active: number, inactive: number, errors: number) =>
      `Aktif ${active} · Tidak aktif ${inactive} · Perlu dicek ${errors}`,
    downloadPdf: 'Unduh laporan PDF',
    errorLoad: 'Gagal memuat status.',
  },
  orders: {
    title: 'Riwayat pesanan',
    empty: 'Belum ada pesanan.',
    detail: 'Detail',
    errorLoad: 'Gagal memuat riwayat.',
  },
  login: {
    title: 'Masuk ke LinkPulse',
    subtitle: 'Masuk dengan Google akan segera tersedia.',
    stagingCta: 'Masuk mode uji (staging)',
  },
  devLogin: {
    title: 'Masuk mode uji',
    subtitle: 'Hanya untuk pengujian internal. Pengguna publik akan memakai login Google.',
    emailLabel: 'Email uji',
    submit: 'Lanjutkan',
  },
  header: {
    history: 'Riwayat pesanan',
    start: 'Pesan baru',
  },
} as const;

export function labelStatus(status: string): string {
  return statusLabel[status] || status.replace(/_/g, ' ');
}
