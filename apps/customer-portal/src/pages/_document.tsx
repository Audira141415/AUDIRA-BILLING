import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#070b14" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('audira_theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </Head>
      <body className="font-sans antialiased selection:bg-cyan-500 selection:text-black bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-200" suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
