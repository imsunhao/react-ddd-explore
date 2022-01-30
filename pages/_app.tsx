import type { AppProps } from 'next/app'
import AppProvider from 'app/App'
import DatasProvider from 'datas/app/domain'
import { Provider } from 'react-redux'

import store from 'store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <DatasProvider>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </DatasProvider>
    </Provider>
  )
}

export default MyApp
