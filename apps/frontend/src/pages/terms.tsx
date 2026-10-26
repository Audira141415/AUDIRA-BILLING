import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Syarat & Ketentuan — AUDIRA NET</title>
      </Head>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-[var(--app-card)] border border-[var(--app-border)] rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="mb-6">
            <Link
              href="/register"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Pendaftaran
            </Link>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--app-text)]">
                Syarat & Ketentuan Layanan
              </h1>
              <p className="text-sm text-[var(--app-muted)]">
                Terakhir diperbarui: 26 Juli 2026 • AUDIRA NET & BILLING
              </p>
            </div>
          </div>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-[var(--app-text)]/90">
            <section>
              <h2 className="text-lg font-bold text-[var(--app-text)] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                1. Ketentuan Umum & Kepemilikan
              </h2>
              <p>
                Platform <strong>AUDIRA NET & BILLING</strong> dikembangkan dan dimiliki secara eksklusif oleh{' '}
                <strong>Audira Multimedia Digital / Audira Sukses Mandiri</strong> di bawah kepemimpinan{' '}
                <strong>Agus Dwi Rianto (AUDIRA)</strong>. Seluruh sistem, kode sumber, database, dan hak kekayaan intelektual dilindungi oleh undang-undang hak cipta dan lisensi perangkat lunak komersial.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--app-text)] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                2. Penggunaan Akun & Keamanan
              </h2>
              <p>
                Setiap pengguna bertanggung jawab penuh atas kerahasiaan kredensial akun, token autentikasi, serta akses ke API Router/MikroTik dan Gateway yang terhubung dengan akun mereka. Segala aktivitas yang terjadi melalui akun Anda menjadi tanggung jawab pemilik akun.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--app-text)] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                3. Layanan Billing, Jaringan & Otomasi
              </h2>
              <p>
                AUDIRA NET menyediakan fitur manajemen pelanggan ISP, generate tagihan (invoice), monitoring ONT/ONU TR-069, integrasi MikroTik PPPoE, dan otomasi notifikasi WhatsApp. Pengguna dilarang memanfaatkan platform untuk spamming massal atau aktivitas melanggar hukum telekomunikasi di Republik Indonesia.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--app-text)] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                4. Pembatasan Tanggung Jawab
              </h2>
              <p>
                AUDIRA berkomitmen menjaga ketersediaan layanan dengan SLA tinggi. Namun demikian, gangguan yang diakibatkan oleh pihak ketiga seperti provider ISP upstream, kegagalan listrik regional, atau bencana alam berada di luar kendali langsung sistem.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--app-text)] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                5. Kontak & Bantuan Resmi
              </h2>
              <p>
                Pertanyaan terkait syarat dan ketentuan ini dapat disampaikan melalui email resmi di{' '}
                <a href="mailto:agusdwirianto@gmail.com" className="text-blue-600 underline">
                  agusdwirianto@gmail.com
                </a>{' '}
                atau kunjungi portal resmi kami di{' '}
                <a href="https://audira.my.id" target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  https://audira.my.id
                </a>.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--app-border)] flex items-center justify-between">
            <p className="text-xs text-[var(--app-muted)]">
              © {new Date().getFullYear()} AUDIRA. All rights reserved.
            </p>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Setuju & Lanjutkan
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
