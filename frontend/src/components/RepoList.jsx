import { useEffect, useState } from "react";
import axios from "axios";
import RepoItem from "./RepoItem";
import SyncButton from "./SyncButton";

function RepoList() {
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRepos = async () => {
    try {
      const response = await axios.get("/api/repositories");
      setRepos(response.data);
    } catch (error) {
      console.error("Error fetching repos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <div className="repo-list-container">
      <div className="repo-header">
        <h2>Трендовые репозитории</h2>
        <SyncButton onSyncComplete={fetchRepos} />
      </div>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : repos.length === 0 ? (
        <p>Репозитории не найдены</p>
      ) : (
        <ul className="repo-list">
          {repos.map((repo) => (
            <RepoItem key={repo.id} repo={repo} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default RepoList;
