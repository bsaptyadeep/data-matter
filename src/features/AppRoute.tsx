import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ViewAssistantList from './features/ViewAssistantList';
import AddAssistant from './features/features/AddAssistant';
import ChatApp from './features/ChatApp';
import UserAuth from './features/UserAuth';

const AppRoute = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ViewAssistantList />} />
                <Route path="/add-assistant" element={<AddAssistant />} />
                <Route path="/chat" element={<ChatApp />} />
                <Route path="/auth" element={<UserAuth />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoute
