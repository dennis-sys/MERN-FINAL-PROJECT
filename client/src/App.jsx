import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PostProvider } from "./context/PostContext";
import PostList from "./components/PostList";
import PostView from "./components/PostView";

function App() {
  return (
    <BrowserRouter>
      <PostProvider>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:id" element={<PostView />} />
        </Routes>
      </PostProvider>
    </BrowserRouter>
  );
}

export default App;
