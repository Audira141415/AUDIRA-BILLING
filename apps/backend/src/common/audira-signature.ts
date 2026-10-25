/**
 * =============================================================================
 *      AUDIRA CRYPTOGRAPHIC IDENTITY & DIGITAL SIGNATURE ANCHOR (OFFICIAL)
 *                    Created by Agus Dwi Rianto (AUDIRA)
 *                    Organization: Audira Multimedia Digital
 *                    Official Domain: https://audira.my.id
 * =============================================================================
 * Modul integritas digital resmi. Memverifikasi bahwa aplikasi dijalankan
 * dengan tanda tangan kriptografis asli milik Agus Dwi Rianto (AUDIRA).
 * Jika ada pihak yang memodifikasi nama atau lisensi, verifikasi akan gagal.
 * =============================================================================
 */

import * as crypto from 'crypto';

export const OFFICIAL_AUTHOR = "Agus Dwi Rianto (AUDIRA)";
export const OFFICIAL_ORG = "Audira Multimedia Digital / Audira Sukses Mandiri";
export const OFFICIAL_DOMAIN = "https://audira.my.id";
export const OFFICIAL_EMAIL = "agusdwirianto@gmail.com";
export const IMMUTABLE_ID = "AUDIRA-ID-SEAL-2026-AGUS-DWI-RIANTO-PROPRIETARY";

export const CANONICAL_SHA256 = "3d20f799144f963dc00d90384b19fbed92320438f35f235065083c9e3671b059";
export const AUTHOR_PUBLIC_KEY_HEX = "7ce7954e23732492e0e7dcbf67b9aca471296484eff4cded55c6bb5504b78cd6";
export const AUTHOR_SIGNATURE_HEX = "930ec63509c9762a3cbf285359c77f42a728078b9dd7bdaa851f91d155a57f4c1d2c2bf6cf380a89d2a8b1f6eafe35385be292b541ede5c9c812cdc5f8ddab0d";
export const CANONICAL_PAYLOAD_STRING = '{"alias":"AUDIRA","author":"Agus Dwi Rianto","brand":"AUDIRA","immutable_identifier":"AUDIRA-ID-SEAL-2026-AGUS-DWI-RIANTO-PROPRIETARY","license":"AUDIRA Commercial & Proprietary Software License","official_domain":"https://audira.my.id","official_email":"agusdwirianto@gmail.com","organization":"Audira Multimedia Digital / Audira Sukses Mandiri","security_protocol":"Zero-Trust Cryptographic Identity Seal (Ed25519 + SHA256)"}';

export interface IdentityStatus {
  isValid: boolean;
  author: string;
  organization: string;
  domain: string;
  fingerprint: string;
  details: string;
}

/**
 * Memverifikasi integritas payload dan tanda tangan digital Ed25519
 */
export function verifyAudiraSignature(): IdentityStatus {
  try {
    // 1. Verifikasi Hash SHA-256
    const calculatedHash = crypto
      .createHash('sha256')
      .update(CANONICAL_PAYLOAD_STRING, 'utf8')
      .digest('hex');

    if (calculatedHash !== CANONICAL_SHA256) {
      return {
        isValid: false,
        author: 'UNKNOWN / TAMPERED',
        organization: 'UNAUTHORIZED',
        domain: 'INVALID',
        fingerprint: calculatedHash,
        details: 'Integrity check failed: Payload hash does not match canonical SHA-256!',
      };
    }

    // 2. Verifikasi Ed25519 Signature
    const publicKeyBuffer = Buffer.from(AUTHOR_PUBLIC_KEY_HEX, 'hex');
    const signatureBuffer = Buffer.from(AUTHOR_SIGNATURE_HEX, 'hex');
    const payloadBuffer = Buffer.from(CANONICAL_PAYLOAD_STRING, 'utf8');

    // Buat SPKI format untuk Ed25519 Public Key
    const spkiPrefix = Buffer.from('302a300506032b6570032100', 'hex');
    const fullPublicKey = Buffer.concat([spkiPrefix, publicKeyBuffer]);

    const isVerified = crypto.verify(
      null,
      payloadBuffer,
      {
        key: fullPublicKey,
        format: 'der',
        type: 'spki',
      },
      signatureBuffer
    );

    if (isVerified) {
      return {
        isValid: true,
        author: OFFICIAL_AUTHOR,
        organization: OFFICIAL_ORG,
        domain: OFFICIAL_DOMAIN,
        fingerprint: CANONICAL_SHA256,
        details: 'Official Authentic AUDIRA Build - Cryptographically Verified',
      };
    } else {
      return {
        isValid: false,
        author: 'UNKNOWN / TAMPERED',
        organization: 'UNAUTHORIZED',
        domain: 'INVALID',
        fingerprint: CANONICAL_SHA256,
        details: 'Cryptographic signature verification failed! Code tampering detected.',
      };
    }
  } catch (err: any) {
    return {
      isValid: false,
      author: 'ERROR',
      organization: 'ERROR',
      domain: 'ERROR',
      fingerprint: '',
      details: `Verification exception: ${err.message}`,
    };
  }
}

/**
 * Validasi ketat saat booting server/aplikasi
 */
export function enforceAudiraAuthenticity(): void {
  const status = verifyAudiraSignature();
  if (!status.isValid) {
    console.error('======================================================================');
    console.error(' [SECURITY CRITICAL] AUDIRA TAMPER DETECTION TRIGGERED!');
    console.error(` Details: ${status.details}`);
    console.error(' Aplikasi ini adalah hak cipta resmi Agus Dwi Rianto (AUDIRA).');
    console.error(' Modifikasi ilegal terdeteksi. Proses dihentikan demi keamanan.');
    console.error('======================================================================');
    process.exit(1);
  } else {
    console.log(`[AUDIRA-SECURITY] Digital Signature VERIFIED: ${status.author} (${status.domain})`);
  }
}
