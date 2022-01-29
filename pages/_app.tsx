import type { AppProps } from 'next/app'
import DatasProvider from 'datas/app/domain'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DatasProvider>
      <Component {...pageProps} />
    </DatasProvider>
  )
}

export default MyApp
