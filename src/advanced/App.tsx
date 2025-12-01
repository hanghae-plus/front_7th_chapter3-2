import { Provider } from 'jotai';
import { PagesLayout } from './components/layout/PagesLayout';

// 메인 App 컴포넌트
const App = () => {
  return (
    <Provider>
      <PagesLayout />
    </Provider>
  );
};

export default App;