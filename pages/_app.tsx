import type { AppProps } from 'next/app'
import AppProvider from 'app/App'
import DatasProvider from 'datas/app/domain'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DatasProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </DatasProvider>
  )
}

export default MyApp
