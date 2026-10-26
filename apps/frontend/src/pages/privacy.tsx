import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Kebijakan Privasi — AUDIRA NET</title>
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
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--app-text)]">
                Kebijakan Privasi & Perlindungan Data
              </h1>
              <p className="text-sm text-[var(--app-muted)]">
                Terakhir diperbarui: 26 Juli 2026 • AUDIRA NET & BILLING
              </p>
            </div>
          </div>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-[var(--app-text)]/90">
            <section>
              <h2 className="text-lg font-bold text-[var(--app-text)] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                1. Komitmen Perlindungan Data Pribadi
              </h2>
              <p>
                <strong>AUDIRA (Audira Multimedia Digital / Audira Sukses Mandiri)</strong> sangat menghargai privasi setiap pengguna platform kami. Kebijakan ini menjelaskan bagaimana data pelanggan, telemetry jaringan, serta informasi transaksi keuangan dikumpulkan, diproses, dan dilindungi.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--app-text)] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                2. Data yang Dikumpulkan
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-[var(--app-muted)]">
                <li><strong className="text-[var(--app-text)]">Identitas Pengguna:</strong> Nama, alamat email, nomor telepon WhatsApp, dan nama perusahaan/ISP.</li>
                <li><strong className="text-[var(--app-text)]">Data Operasional ISP:</strong> Daftar pelanggan internet, IP address ONT/ONU, profile bandwidth MikroTik, serta status pembayaran invoice.</li>
                <li><strong className="text-[var(--app-text)]">Log Audit:</strong> Catatan waktu akses dan aksi administratif untuk keperluan audit keamanan sistem.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--app-text)] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                3. Keamanan & Enkripsi Data
              </h2>
              <p>
                Seluruh kata sandi dienkripsi menggunakan hash standar industri (bcrypt/Argon2). Transmisi data diamankan dengan TLS/HTTPS, dan token autentikasi JWT disimpan dengan aman. Kami tidak pernah membagikan atau menjual data pribadi Anda kepada pihak ketiga mana pun tanpa izin eksplisit.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--app-text)] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                4. Hak Pengguna & Penghapusan Data
              </h2>
              <p>
                Anda berhak memperbarui, mengekspor, atau mengajukan permohonan penghapusan data akun Anda melalui pengaturan akun admin atau dengan menghubungi tim privasi resmi kami.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--app-text)] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                5. Kontak Petugas Privasi Data
              </h2>
              <p>
                Untuk konsultasi perlindungan data pribadi dan pertanyaan seputar privasi, silakan hubungi:{' '}
                <a href="mailto:agusdwirianto@gmail.com" className="text-emerald-600 underline">
                  agusdwirianto@gmail.com
                </a>{' '}
                atau hotline WhatsApp resmi di{' '}
                <a href="https://wa.me/6282112001600" target="_blank" rel="noreferrer" className="text-emerald-600 underline">
                  +62 821-1200-1600
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Kembali
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
